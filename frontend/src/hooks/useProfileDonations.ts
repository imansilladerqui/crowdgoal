import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { BrowserProvider } from "ethers";
import { getReadableProvider } from "@/lib/web3/network";
import { getCampaignFactoryContract } from "@/lib/web3/contracts";
import { getWalletAddress } from "@/hooks/UseWalletStorage";
import { useWalletDialogs } from "@/lib/context/WalletDialogContext";


export interface ProfileDonation {
  campaignId: number;
  campaignTitle: string;
  campaignDescription: string;
  campaignGoal: number;
  campaignRaised: number;
  campaignExpiringDate: number;
  campaignStatus: number;
  campaignAuthorName: string;
  donationAmount: number;
  donorCount: number;
}

export const useProfileDonations = () => {
  const [claimingRefunds, setClaimingRefunds] = useState<Set<number>>(new Set());
  const { refundSuccessDialog, refundErrorDialog } = useWalletDialogs();
  const walletAddress = getWalletAddress();

  const { data: donations, isLoading, refetch } = useQuery({
    queryKey: ["my-donations", walletAddress],
    queryFn: async (): Promise<ProfileDonation[]> => {
      if (!walletAddress) return [];
      
      const provider = await getReadableProvider();
      const contract = getCampaignFactoryContract(provider);
      
      const allCampaigns = await contract.getAllCampaigns();
      const myDonations: ProfileDonation[] = [];
      
      // Check each campaign for donations from current user
      for (const campaign of allCampaigns) {
        try {
          const donationAmount = await contract.getDonation(campaign.id, walletAddress);
          if (donationAmount > 0) {
            const donors = await contract.getCampaignDonors(campaign.id);
            myDonations.push({
              campaignId: Number(campaign.id),
              campaignTitle: String(campaign.title),
              campaignDescription: String(campaign.description),
              campaignGoal: Number(campaign.goal),
              campaignRaised: Number(campaign.raised),
              campaignExpiringDate: Number(campaign.expiringDate),
              campaignStatus: Number(campaign.status),
              campaignAuthorName: String(campaign.authorName),
              donationAmount: Number(donationAmount),
              donorCount: donors.length
            });
          }
        } catch (error) {
        }
      }
      
      return myDonations;
    },
    enabled: !!walletAddress,
  });

  const handleClaimRefund = async (campaignId: number) => {
    if (!window.ethereum) {
      refundErrorDialog.setMessage('Please connect your wallet to claim refunds.');
      refundErrorDialog.show();
      return;
    }

    setClaimingRefunds(prev => new Set(prev).add(campaignId));

    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = getCampaignFactoryContract(signer);

      const tx = await contract.claimRefund(campaignId);
      await tx.wait();

      refundSuccessDialog.setMessage('Your refund has been successfully claimed and sent to your wallet.');
      refundSuccessDialog.show();
      refetch();
    } catch (error: any) {
      refundErrorDialog.setMessage(error.message || 'There was an error processing your refund claim. Please try again.');
      refundErrorDialog.show();
    } finally {
      setClaimingRefunds(prev => {
        const newSet = new Set(prev);
        newSet.delete(campaignId);
        return newSet;
      });
    }
  };

  // Computed values
  const totalDonated = donations?.reduce((sum, donation) => sum + donation.donationAmount, 0) || 0;
  const failedDonations = donations?.filter(d => d.campaignStatus === 2) || [];
  const canClaimRefunds = failedDonations.length > 0;

  return {
    donations: donations || [],
    isLoading,
    claimingRefunds,
    totalDonated,
    canClaimRefunds,
    handleClaimRefund
  };
};
