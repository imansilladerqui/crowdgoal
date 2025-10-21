import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { BrowserProvider } from "ethers";
import { getReadableProvider } from "@/lib/web3/network";
import { getCampaignFactoryContract } from "@/lib/web3/contracts";
import { getWalletAddress } from "@/hooks/UseWalletStorage";

export interface ProfileCampaign {
  id: number;
  title: string;
  description: string;
  goal: number;
  raised: number;
  expiringDate: number;
  status: number;
  fundsWithdrawn: boolean;
  authorName: string;
  authorWallet: string;
  donorCount: number;
}

export const useProfileMyCampaigns = () => {
  const [withdrawingCampaigns, setWithdrawingCampaigns] = useState<Set<number>>(new Set());
  const walletAddress = getWalletAddress();

  const { data: campaigns, isLoading, refetch } = useQuery({
    queryKey: ["my-campaigns", walletAddress],
    queryFn: async (): Promise<ProfileCampaign[]> => {
      if (!walletAddress) return [];
      
      try {
        const provider = await getReadableProvider();
        const contract = getCampaignFactoryContract(provider);
        
        const allCampaigns = await contract.getAllCampaigns();
        
        const myCampaigns = allCampaigns.filter(
          (campaign: any) => {
            return campaign.authorWallet.toLowerCase() === walletAddress.toLowerCase();
          }
        );
        
        const campaignsWithDonors = await Promise.all(
          myCampaigns.map(async (campaign: any) => {
            try {
              const donors = await contract.getCampaignDonors(campaign.id);
              return {
                ...campaign,
                donorCount: donors.length
              };
            } catch (error) {
              return {
                ...campaign,
                donorCount: 0
              };
            }
          })
        );
        
        const mappedCampaigns = campaignsWithDonors.map((campaign: any) => {
          return {
            id: Number(campaign[0]),
            title: String(campaign[9] || "Untitled Campaign"),
            description: String(campaign[10] || "No description provided"),
            goal: Number(campaign[3]),
            raised: Number(campaign[4]),
            expiringDate: Number(campaign[5]),
            status: Number(campaign[6] || 0),
            fundsWithdrawn: Boolean(campaign[7] || false),
            authorName: String(campaign[8] || "Unknown Author"),
            authorWallet: String(campaign[1] || ""),
            donorCount: campaign.donorCount || 0
          };
        });
        
        return mappedCampaigns;
      } catch (error) {
        return [];
      }
    },
    enabled: !!walletAddress,
  });

  const handleWithdrawFunds = async (campaignId: number) => {
    if (!window.ethereum) {
      alert("Wallet not available");
      return;
    }

    setWithdrawingCampaigns(prev => new Set(prev).add(campaignId));

    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = getCampaignFactoryContract(signer);

      const tx = await contract.withdrawFunds(campaignId);
      await tx.wait();

      alert("Funds withdrawn successfully!");
      refetch();
    } catch (error: any) {
      alert(`Withdrawal failed: ${error.message}`);
    } finally {
      setWithdrawingCampaigns(prev => {
        const newSet = new Set(prev);
        newSet.delete(campaignId);
        return newSet;
      });
    }
  };

  return {
    campaigns: campaigns || [],
    isLoading,
    withdrawingCampaigns,
    handleWithdrawFunds
  };
};