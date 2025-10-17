import { ZeroAddress } from "ethers";
import { CAMPAIGN_FACTORY_ADDRESS } from "@/config";
import { getReadableProvider } from "@/lib/web3/network";
import { getCampaignFactoryContract } from "@/lib/web3/contracts";
import { getWritableSigner } from "@/lib/web3/signer";
import { validateCreateProjectInput, sanitizeMetadataURI } from "@/lib/utils/validation";
import { normalizeWeb3Error } from "@/lib/web3/errors";
import { getWalletAddress } from "./UseWalletStorage";

type FormData = {
  authorName: string;
  title: string;
  description: string;
  goal: string;
  expiringDate: string;
};

type ValidationResult = 
  | { ok: true; goal: number; expiringTs: number }
  | { ok: false; error: string };

type CreateProjectResult = {
  success: boolean;
  error?: string;
  txHash?: string;
};

// Constants for validation
const VALIDATION_LIMITS = {
  AUTHOR_NAME_MAX: 50,
  TITLE_MAX: 100,
  DESCRIPTION_MAX: 500,
} as const;

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

/**
 * Validates and sanitizes form data for campaign creation
 */
const prepareCampaignData = (data: FormData): ValidationResult => {
  const validated = validateCreateProjectInput(data) as ValidationResult;
  
  if (!validated.ok) {
    return validated;
  }

  const { goal: numericGoal, expiringTs: expiringTimestamp } = validated;
  
  if (numericGoal <= 0 || !Number.isInteger(numericGoal)) {
    return { ok: false, error: "Goal must be a positive integer" };
  }
  
  if (expiringTimestamp <= Math.floor(Date.now() / 1000)) {
    return { ok: false, error: "Expiry date must be in the future" };
  }

  return validated;
};

/**
 * Validates contract deployment and accessibility
 */
const validateContract = async (provider: unknown, factoryAddress: string): Promise<string | null> => {
  if (!factoryAddress || factoryAddress === ZERO_ADDRESS) {
    return "Campaign Factory address is not configured. Please set VITE_CAMPAIGN_FACTORY_ADDRESS in your .env file.";
  }
  
  const factoryCode = await (provider as { getCode: (address: string) => Promise<string> }).getCode(factoryAddress);
  if (!factoryCode || factoryCode === "0x") {
    return `Campaign Factory contract not found at address ${factoryAddress}. Please deploy the contract first or check your VITE_CAMPAIGN_FACTORY_ADDRESS in .env file.`;
  }

  return null;
};

/**
 * Creates sanitized campaign arguments for contract call
 */
const createCampaignArgs = (data: FormData, goal: number, expiringTs: number) => {
  const walletAddress = getWalletAddress();
  const sanitizedAuthorName = data.authorName.trim().slice(0, VALIDATION_LIMITS.AUTHOR_NAME_MAX);
  const sanitizedTitle = data.title.trim().slice(0, VALIDATION_LIMITS.TITLE_MAX);
  const sanitizedDescription = data.description.trim().slice(0, VALIDATION_LIMITS.DESCRIPTION_MAX);

  return [
    walletAddress,
    sanitizedAuthorName,
    sanitizedTitle,
    sanitizedDescription,
    BigInt(goal),
    BigInt(expiringTs),
    ZeroAddress,
    sanitizeMetadataURI(data),
  ] as const;
};

/**
 * Executes the campaign creation transaction
 */
const executeTransaction = async (contract: unknown, args: readonly unknown[]): Promise<CreateProjectResult> => {
  try {
    const tx = await (contract as { createCampaign: (...args: unknown[]) => Promise<{ hash: string; wait: () => Promise<unknown> }> }).createCampaign(...args);
    const receipt = await tx.wait();
    
    return { 
      success: true, 
      txHash: tx.hash 
    };
  } catch (txError: unknown) {
    console.error("Transaction failed:", txError);
    
    // Enhanced error logging for debugging
    if (txError && typeof txError === 'object' && 'data' in txError) {
      console.error("Revert data:", (txError as { data: unknown }).data);
    }
    
    throw txError;
  }
};

export const useCreateProject = () => {
  const postProject = async (data: FormData): Promise<CreateProjectResult> => {
    // Early validation
    if (!window.ethereum) {
      return { success: false, error: "MetaMask not found" };
    }

    try {
      // Connect wallet and get providers
      await window.ethereum.request({ method: "eth_requestAccounts" });
      
      const [provider, signer] = await Promise.all([
        getReadableProvider(),
        getWritableSigner()
      ]);

      // Validate and prepare campaign data
      const validation = prepareCampaignData(data);
      if (!validation.ok) {
        return { success: false, error: (validation as { ok: false; error: string }).error };
      }

      const { goal: numericGoal, expiringTs: expiringTimestamp } = validation;

      // Get contract instance
      const contract = getCampaignFactoryContract(signer as object);
      const factoryAddress = String((contract as { target?: string }).target ?? "");

      // Validate contract deployment
      const contractError = await validateContract(provider, factoryAddress);
      if (contractError) {
        return { success: false, error: contractError };
      }

      // Create campaign arguments
      const args = createCampaignArgs(data, numericGoal, expiringTimestamp);

      // Execute transaction
      return await executeTransaction(contract, args);

    } catch (err) {
      console.error("Campaign creation failed:", err);
      const normalized = normalizeWeb3Error(err);
      return {
        success: false,
        error: `${normalized.title}: ${normalized.message}`,
      };
    }
  };

  return { postProject };
};