import { BrowserProvider, parseEther, ZeroAddress } from "ethers";
import { getCampaignFactoryContract } from "@/lib/web3/contracts";
import { ensureCorrectChainOrPrompt } from "@/lib/web3/network";

type FormData = {
  authorWallet: string;
  authorName: string;
  title: string;
  description: string;
  goal: string;
  expiringDate: string;
};

type CreateProjectResult = {
  success: boolean;
  error?: string;
  txHash?: string;
  campaignId?: number;
};

export const useCreateProject = () => {
  const postProject = async (data: FormData): Promise<CreateProjectResult> => {
    try {
      // Validate form data
      const validationError = validateFormData(data);
      if (validationError) {
        return { success: false, error: validationError };
      }

      // Ensure correct network and get contract instance
      await ensureCorrectChainOrPrompt();
      const { contract } = await getContractInstance();

      // Prepare contract arguments
      const contractArgs = prepareContractArguments(data);

      console.log(contractArgs);

      // Estimate gas and execute transaction
      const gasEstimate = await contract.createCampaign.estimateGas(...contractArgs);
      const tx = await contract.createCampaign(...contractArgs, {
        gasLimit: gasEstimate * BigInt(120) / BigInt(100) // Add 20% buffer
      });

      // Wait for confirmation and extract campaign ID
      const receipt = await tx.wait();
      const campaignId = extractCampaignIdFromReceipt(receipt, contract);

      return {
        success: true,
        txHash: tx.hash,
        campaignId
      };

    } catch (error: any) {
      return {
        success: false,
        error: getErrorMessage(error)
      };
    }
  };

  return { postProject };
};

// Helper functions for better code organization
const validateFormData = (data: FormData): string | null => {
  if (!data.authorName || !data.title || !data.description || !data.goal || !data.expiringDate) {
    return "Please fill in all required fields";
  }
  if (!data.authorWallet) {
    return "Please connect your wallet";
  }
  
  // Validate goal is a valid number
  const goalNumber = parseFloat(data.goal);
  if (isNaN(goalNumber) || goalNumber <= 0) {
    return "Please enter a valid goal amount";
  }
  
  return null;
};

const getContractInstance = async () => {
  if (!window.ethereum) {
    throw new Error("Wallet not available");
  }

  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = getCampaignFactoryContract(signer);

  return { provider, signer, contract };
};

const prepareContractArguments = (data: FormData) => {
  let goalInWei;
  try {
    goalInWei = parseEther(data.goal);
  } catch (error) {
    throw new Error("Invalid goal amount. Please enter a valid number.");
  }
  
  const expiringTimestamp = parseInt(data.expiringDate);
  const tokenAddress = ZeroAddress; 
  const metadataURI = ""; 

  return [
    data.authorWallet,
    data.authorName,
    data.title,
    data.description,
    goalInWei,
    expiringTimestamp,
    tokenAddress,
    metadataURI
  ];
};

const extractCampaignIdFromReceipt = (receipt: any, contract: any): number | undefined => {
  if (!receipt?.logs) return undefined;

  for (const log of receipt.logs) {
    try {
      const parsedLog = contract.interface.parseLog(log);
      if (parsedLog?.name === "CampaignCreated") {
        return Number(parsedLog.args.id);
      }
    } catch {
      // Skip logs that can't be parsed
    }
  }
  return undefined;
};

const getErrorMessage = (error: any): string => {
  if (error.code === 4001) {
    return "Transaction rejected by user";
  }
  if (error.code === -32603) {
    return "Contract call failed. Check if contract is deployed and you're on the correct network.";
  }
  if (error.message?.includes("insufficient funds")) {
    return "Insufficient funds for gas";
  }
  if (error.message?.includes("network")) {
    return "Network error. Please check your connection";
  }
  return error.message || "Unknown error occurred";
};