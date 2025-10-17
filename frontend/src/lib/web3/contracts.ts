import { Contract, Provider, getAddress } from "ethers";
import { CAMPAIGN_FACTORY_ADDRESS } from "@/config";
import CampaignFactoryABI from "../../../../shared/abis/CampaignFactory.json";

export function getCampaignFactoryContract(providerOrSigner: Provider | any) {
  if (!CAMPAIGN_FACTORY_ADDRESS) {
    throw new Error("CampaignFactory address not configured");
  }
  const address = getAddress(CAMPAIGN_FACTORY_ADDRESS);
  return new Contract(address, CampaignFactoryABI, providerOrSigner);
}
