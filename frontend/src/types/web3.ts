export type CampaignStatus = "open" | "funded" | "failed" | "finalized";

export interface OnChainCampaign {
  id: number;
  title: string;
  description: string;
  goal: number;
  raised: number;
  expiringDate: number;
  status: CampaignStatus;
  backers: number;
}

export type CreateCampaignArgs = [
  string,
  string,
  string,
  string,
  number,
  number,
  string,
  string
];
