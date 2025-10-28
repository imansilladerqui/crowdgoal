import { formatCHZ } from "@/lib/utils/formatCHZ";
import { formatDate } from "@/lib/utils/formatDate";

interface CampaignStatsGridProps {
  donorCount: number;
  goal: number;
  raised: number;
  expiringDate: number;
  dateLabel?: string;
}

export const CampaignStatsGrid = ({ donorCount, goal, raised, expiringDate, dateLabel = "Expired" }: CampaignStatsGridProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
      <div>
        <div className="text-2xl font-bold">{donorCount}</div>
        <div className="text-sm text-muted-foreground">Supporters</div>
      </div>
      <div>
        <div className="text-2xl font-bold">{formatCHZ(goal)}</div>
        <div className="text-sm text-muted-foreground">Goal (CHZ)</div>
      </div>
      <div>
        <div className="text-2xl font-bold">{formatCHZ(raised)}</div>
        <div className="text-sm text-muted-foreground">Raised (CHZ)</div>
      </div>
      <div>
        <div className="text-2xl font-bold">{formatDate(expiringDate)}</div>
        <div className="text-sm text-muted-foreground">{dateLabel}</div>
      </div>
    </div>
  );
};

