import { Progress } from "@/components/ui/progress";
import { formatCHZ } from "@/lib/utils/formatCHZ";
import { calculateProgress } from "@/lib/utils/calculations";

interface ProgressSectionProps {
  raised: number;
  goal: number;
  raisedLabel?: string;
  goalLabel?: string;
}

export const ProgressSection = ({ 
  raised, 
  goal, 
  raisedLabel = "Raised", 
  goalLabel = "Goal" 
}: ProgressSectionProps) => {
  const progressPercentage = calculateProgress(raised, goal);
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>{raisedLabel}</span>
        <span className="font-semibold">{formatCHZ(raised)} CHZ</span>
      </div>
      <Progress value={progressPercentage} className="h-2" />
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>{progressPercentage.toFixed(1)}%</span>
        <span>{goalLabel}: {formatCHZ(goal)} CHZ</span>
      </div>
    </div>
  );
};

