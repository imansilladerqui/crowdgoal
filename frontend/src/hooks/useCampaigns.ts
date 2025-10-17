import { useQuery } from "@tanstack/react-query";
import { getReadableProvider } from "@/lib/web3/network";
import { getCampaignFactoryContract } from "@/lib/web3/contracts";
import { OnChainCampaign, CampaignStatus } from "@/types/web3";

const enumToStatus = (statusValue: number): CampaignStatus => {
  switch (statusValue) {
    case 0:
      return "open"; // Active
    case 1:
      return "funded"; // Successful
    case 2:
      return "failed"; // Failed
    case 3:
      return "finalized"; // Finalized
    default:
      return "open";
  }
};

export function useCampaigns() {
  return useQuery<OnChainCampaign[]>({
    queryKey: ["campaigns"],
    queryFn: async () => {
      const provider = await getReadableProvider();
      const contract = getCampaignFactoryContract(provider);

      const campaigns: any[] = await contract.getAllCampaigns();

      // Fetch donor counts in parallel for each campaign
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

      return campaigns.map((c, idx) => ({
        id: Number(c.id),
        title: String(c.title),
        description: String(c.description),
        goal: Number(c.goal),
        raised: Number(c.raised),
        expiringDate: Number(c.expiringDate),
        status: enumToStatus(Number(c.status)),
        backers: donorCounts[idx] ?? 0,
      }));
    },
  });
}
