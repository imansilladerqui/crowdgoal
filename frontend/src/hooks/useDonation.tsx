import { BrowserProvider, parseEther } from "ethers";
import { getCampaignFactoryContract } from "@/lib/web3/contracts";
import { ensureCorrectChainOrPrompt } from "@/lib/web3/network";

type DonationData = {
  campaignId: number;
  amount: string; // Amount in CHZ (will be converted to wei)
};

type DonationResult = {
  success: boolean;
  error?: string;
  txHash?: string;
};

export const useDonation = () => {
  const donate = async (data: DonationData): Promise<DonationResult> => {
    try {
      // Validate donation data
      const validationError = validateDonationData(data);
      if (validationError) {
        return { success: false, error: validationError };
      }

      // Ensure correct network and get contract instance
      await ensureCorrectChainOrPrompt();
      const { contract, signer } = await getContractInstance();

      // Prepare donation amount in wei
      const amountInWei = parseEther(data.amount);

      // Estimate gas and execute transaction
      const gasEstimate = await contract.donate.estimateGas(
        data.campaignId,
        amountInWei,
        { value: amountInWei } // Send ETH/CHZ with the transaction
      );

      const tx = await contract.donate(data.campaignId, amountInWei, {
        gasLimit: gasEstimate * BigInt(120) / BigInt(100), // Add 20% buffer
        value: amountInWei
      });

      // Wait for confirmation
      await tx.wait();

      return {
        success: true,
        txHash: tx.hash
      };

    } catch (error: any) {
      return {
        success: false,
        error: getErrorMessage(error)
      };
    }
  };

  return { donate };
};

// Helper functions for better code organization
const validateDonationData = (data: DonationData): string | null => {
  if (!data.campaignId && data.campaignId !== 0) {
    return "Campaign ID is required";
  }
  if (!data.amount || data.amount === "0") {
    return "Donation amount must be greater than zero";
  }
  
  const amount = parseFloat(data.amount);
  if (isNaN(amount) || amount <= 0) {
    return "Please enter a valid donation amount";
  }
  if (amount > 10000) {
    return "Donation cannot exceed 10,000 CHZ";
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

const getErrorMessage = (error: any): string => {
  if (error.code === 4001) {
    return "Transaction rejected by user";
  }
  if (error.code === -32603) {
    return "Contract call failed. Check if contract is deployed and you're on the correct network.";
  }
  if (error.message?.includes("insufficient funds")) {
    return "Insufficient funds for donation or gas";
  }
  if (error.message?.includes("Campaign is not active")) {
    return "This campaign is no longer active";
  }
  if (error.message?.includes("Campaign does not exist")) {
    return "Campaign not found";
  }
  if (error.message?.includes("network")) {
    return "Network error. Please check your connection";
  }
  return error.message || "Unknown error occurred";
};
