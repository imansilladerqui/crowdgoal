import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, Users, User, ExternalLink, Download, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { formatCHZ } from "@/lib/utils/formatCHZ";
import { getCampaignStatusInfo } from "@/lib/utils/statusInfo";
import { calculateProgress } from "@/lib/utils/calculations";
import { useState } from "react";
import { useWalletDialogs } from "@/lib/context/WalletDialogContext";
import { BrowserProvider } from "ethers";
import { getCampaignFactoryContract } from "@/lib/web3/contracts";
import { toast } from "sonner";

interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  goal: number;
  raised: number;
  backers: number;
  daysLeft: number;
  status: string;
  authorName?: string;
  expiringDate?: number;
  userDonation?: number;
}

const ProjectCard = ({
  id,
  title,
  description,
  goal,
  raised,
  backers,
  daysLeft,
  status,
  authorName,
  expiringDate,
  userDonation = 0,
}: ProjectCardProps) => {
  const navigate = useNavigate();
  const [isClaimingRefund, setIsClaimingRefund] = useState(false);
  const { refundErrorDialog } = useWalletDialogs();
  
  const progressPercentage = calculateProgress(raised, goal);
  const isRefundAvailable = status === 'failed' && userDonation > 0;

  const getStatusNumber = (status: string): number => {
    switch (status) {
      case 'funded': return 1;
      case 'failed': return 2;
      case 'finalized': return 3;
      case 'open':
      default: return 0;
    }
  };

  const statusInfo = getCampaignStatusInfo(getStatusNumber(status));
  const StatusIcon = statusInfo.icon;

  const StatusBadge = ({ variant, className = "", children }: { variant: string; className?: string; children: React.ReactNode }) => {
    const baseClasses = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors";
    const variantClasses: Record<string, string> = {
      default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
      success: "border-transparent bg-green-600 text-white hover:bg-green-700",
      destructive: "border-transparent bg-red-600 text-white hover:bg-red-700",
      warning: "border-transparent bg-yellow-600 text-white hover:bg-yellow-700",
      info: "border-transparent bg-blue-600 text-white hover:bg-blue-700",
    };
    
    return (
      <div className={cn(baseClasses, variantClasses[variant] || variantClasses.default, className)}>
        {children}
      </div>
    );
  };

  const handleClaimRefund = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!window.ethereum) {
      refundErrorDialog.setMessage('Please connect your wallet to claim refunds.');
      refundErrorDialog.show();
      return;
    }

    setIsClaimingRefund(true);

    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = getCampaignFactoryContract(signer);

      const tx = await contract.claimRefund(id);
      await tx.wait();

      toast.success("Refund Claimed Successfully!", {
        description: "Your refund has been sent to your wallet.",
        duration: 5000,
      });
      
      setTimeout(() => window.location.reload(), 2000);
    } catch (error: any) {
      refundErrorDialog.setMessage(error.message || 'There was an error processing your refund claim. Please try again.');
      refundErrorDialog.show();
    } finally {
      setIsClaimingRefund(false);
    }
  };

  const isUrgent = daysLeft <= 3 && status === 'open';
  const isSuccessful = status === 'funded' || status === 'finalized';

  return (
    <Card className="group overflow-hidden border-border/50 bg-gradient-card hover:border-primary/50 transition-all duration-300 hover:shadow-glow-secondary flex flex-col h-full">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between mb-2">
          <StatusBadge 
            variant={statusInfo.variant}
            className={statusInfo.variant === 'destructive' ? '' : 'backdrop-blur-sm bg-background/80'}
          >
            {StatusIcon && <StatusIcon className="h-3 w-3 mr-1" />}
            {statusInfo.text}
          </StatusBadge>
          
          <div className="flex gap-2">
            {isRefundAvailable && (
              <StatusBadge variant="destructive" className="bg-red-600 hover:bg-red-700">
                <AlertCircle className="h-3 w-3 mr-1" />
                Refund Available
              </StatusBadge>
            )}
            {isUrgent && (
              <StatusBadge variant="warning" className="animate-pulse backdrop-blur-sm bg-background/80">
                <Clock className="h-3 w-3 mr-1" />
                Urgent
              </StatusBadge>
            )}
          </div>
        </div>
        
        <h3 className="text-xl font-semibold line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-foreground/70 text-sm line-clamp-2">{description}</p>
        
        {authorName && (
          <div className="flex items-center gap-2 text-xs text-foreground/60 mt-2">
            <User className="h-3 w-3" />
            <span>by {authorName}</span>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4 flex-1">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-foreground/70">Raised</span>
            <span className="font-semibold">{formatCHZ(raised)} CHZ</span>
          </div>
          
          <Progress 
            value={progressPercentage} 
            className={`h-2 ${isSuccessful ? 'bg-green-200' : ''}`}
          />
          
          <div className="flex justify-between text-sm text-foreground/70">
            <span>{progressPercentage.toFixed(1)}% funded</span>
            <span>Goal: {formatCHZ(goal)} CHZ</span>
          </div>
        </div>

        <div className="flex justify-between text-sm">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4 text-primary" />
            <span>{backers} sport fans</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-primary" />
            <span className={isUrgent ? "text-red-500 font-semibold" : ""}>
              {daysLeft > 0 ? `${daysLeft} days left` : 'Expired'}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="mt-auto">
        {isRefundAvailable ? (
          <div className="w-full space-y-2">
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleClaimRefund}
              disabled={isClaimingRefund}
            >
              {isClaimingRefund ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-t-transparent border-white rounded-full" />
                  Claiming...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Claim Refund
                </>
              )}
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate(`/campaign/${id}`)}
            >
              View Details
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          </div>
        ) : (
          <Button
            variant={status === 'open' ? "outline-primary" : "outline"}
            className={`w-full ${
              status === 'open' 
                ? "group-hover:border-primary group-hover:text-primary group-hover:bg-primary/5 transition-all duration-300" 
                : ""
            }`}
            onClick={() => navigate(`/campaign/${id}`)}
          >
            {status === 'open' ? "Support Project" : "View Details"}
            <ExternalLink className="h-4 w-4 ml-2" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
