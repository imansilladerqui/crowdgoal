import { useQuery } from "@tanstack/react-query";
import { getReadableProvider } from "@/lib/web3/network";
import { getCampaignFactoryContract } from "@/lib/web3/contracts";
import { OnChainCampaign, CampaignStatus } from "@/types/web3";
import { getComputedCampaignStatus } from "@/lib/utils/campaignStatus";
import { getWalletAddress } from "@/hooks/UseWalletStorage";

const enumToStatus = (statusValue: number): CampaignStatus => {
  switch (statusValue) {
    case 0: return "open"; 
    case 1: return "funded"; 
    case 2: return "failed"; 
    case 3: return "finalized"; 
    default: return "open";
  }
};

export function useCampaigns() {
  const walletAddress = getWalletAddress();
  
  return useQuery<OnChainCampaign[]>({
    queryKey: ["campaigns", walletAddress],
    queryFn: async () => {
      const provider = await getReadableProvider();
      const contract = getCampaignFactoryContract(provider);

      const campaigns = await contract.getAllCampaigns() as any[];

      const donorCounts: number[] = await Promise.all(
        campaigns.map(async (c) => {
          try {
            const donors: string[] = await contract.getCampaignDonors(c.id);
            return donors.length;
          } catch {
            return 0;
          }
        })
      );

      const userDonations: number[] = walletAddress
        ? await Promise.all(
            campaigns.map(async (c) => {
              try {
                const donation = await contract.getDonation(c.id, walletAddress);
                return Number(donation);
              } catch {
                return 0;
              }
            })
          )
        : campaigns.map(() => 0);

      return campaigns.map((c, idx) => {
        const onChainStatus = Number(c.status);
        const expiringDate = Number(c.expiringDate);
        const raised = Number(c.raised);
        const goal = Number(c.goal);
        
        const computedStatus = getComputedCampaignStatus(onChainStatus, expiringDate, raised, goal);
        
        return {
          id: Number(c.id),
          title: String(c.title),
          description: String(c.description),
          goal,
          raised,
          expiringDate,
          status: enumToStatus(computedStatus), 
          backers: donorCounts[idx] ?? 0,
          authorName: String(c.authorName),
          authorWallet: String(c.authorWallet),
          userDonation: userDonations[idx] ?? 0,
        };
      });
    },
  });
}
