import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getReadableProvider } from "@/lib/web3/network";
import { getCampaignFactoryContract } from "@/lib/web3/contracts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { DonationDialog } from "@/components/DonationDialog";
import { useWalletDialogs } from "@/lib/context/WalletDialogContext";
import { 
  ArrowLeft, 
  Clock, 
  Users, 
  ExternalLink,
  User,
  Target,
  TrendingUp,
  Copy,
  Download,
  AlertCircle
} from "lucide-react";
import { useState } from "react";
import { formatCHZ } from "@/lib/utils/formatCHZ";
import { getCampaignStatusInfo } from "@/lib/utils/statusInfo";
import { getComputedCampaignStatus } from "@/lib/utils/campaignStatus";
import { calculateProgress } from "@/lib/utils/calculations";
import { getWalletAddress } from "@/hooks/UseWalletStorage";
import { BrowserProvider } from "ethers";
import { toast } from "sonner";

const CampaignDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { donationDialog } = useWalletDialogs();

  const { data: campaign, isLoading, isError } = useQuery({
    queryKey: ["campaign", id],
    queryFn: async () => {
      if (!id) throw new Error("Campaign ID is required");
      
      const provider = await getReadableProvider();
      const contract = getCampaignFactoryContract(provider);
      
      const campaignData = await contract.getCampaign(id);
      const donors = await contract.getCampaignDonors(id);
      
      return {
        id: Number(campaignData.id),
        title: String(campaignData.title),
        description: String(campaignData.description),
        goal: Number(campaignData.goal),
        raised: Number(campaignData.raised),
        expiringDate: Number(campaignData.expiringDate),
        status: Number(campaignData.status),
        authorName: String(campaignData.authorName),
        authorWallet: String(campaignData.authorWallet),
        backers: donors.length,
      };
    },
    enabled: !!id,
  });

  const walletAddress = getWalletAddress();
  const { data: userDonation = 0 } = useQuery({
    queryKey: ["user-donation", id, walletAddress],
    queryFn: async () => {
      if (!id || !walletAddress) return 0;
      
      const provider = await getReadableProvider();
      const contract = getCampaignFactoryContract(provider);
      const donation = await contract.getDonation(id, walletAddress);
      return Number(donation);
    },
    enabled: !!id && !!walletAddress,
  });

  const [isClaimingRefund, setIsClaimingRefund] = useState(false);
  const { refundSuccessDialog, refundErrorDialog } = useWalletDialogs();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-32 bg-muted rounded"></div>
            <div className="h-64 w-full bg-muted rounded"></div>
            <div className="h-32 w-full bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !campaign) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">
            Campaign Not Found
          </h1>
          <p className="text-muted-foreground mb-6">
            The campaign you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate("/")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const progressPercentage = calculateProgress(campaign.raised, campaign.goal);
  const daysLeft = Math.max(0, Math.ceil((campaign.expiringDate * 1000 - Date.now()) / (1000 * 60 * 60 * 24)));
  
  const computedStatus = getComputedCampaignStatus(
    campaign.status,
    campaign.expiringDate,
    campaign.raised,
    campaign.goal
  );
  
  const isUrgent = daysLeft <= 3 && computedStatus === 0;
  const statusInfo = getCampaignStatusInfo(computedStatus);

  const copyUrl = async () => {
    try {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      toast.success("Campaign link copied to clipboard!", {
        description: "Share this campaign with others!",
      });
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  const handleClaimRefund = async () => {
    if (!window.ethereum || !id) {
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

  const isRefundAvailable = computedStatus === 2 && userDonation > 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate("/")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Projects
        </Button>

        {/* Campaign Header */}
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Badge variant={statusInfo.variant}>
                  {statusInfo.text}
                </Badge>
                {isUrgent && (
                  <Badge variant="warning" className="animate-pulse">
                    <Clock className="h-3 w-3 mr-1" />
                    Urgent
                  </Badge>
                )}
                {isRefundAvailable && (
                  <Badge variant="destructive" className="bg-red-600 hover:bg-red-700">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Refund Available
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl font-bold">{campaign.title}</h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="h-4 w-4" />
                <span>by {campaign.authorName}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Campaign Stats */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Campaign Progress</h2>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Raised</span>
                <span className="font-semibold text-lg">{formatCHZ(campaign.raised)} CHZ</span>
              </div>
              <Progress 
                value={progressPercentage} 
                className="h-3"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{progressPercentage.toFixed(1)}% funded</span>
                <span>Goal: {formatCHZ(campaign.goal)} CHZ</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div className="text-2xl font-bold">{campaign.backers}</div>
                <div className="text-sm text-muted-foreground">Sport Fans</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div className="text-2xl font-bold">{daysLeft}</div>
                <div className="text-sm text-muted-foreground">Days Left</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Target className="h-5 w-5 text-primary" />
                </div>
                <div className="text-2xl font-bold">{formatCHZ(campaign.goal)}</div>
                <div className="text-sm text-muted-foreground">Goal (CHZ)</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div className="text-2xl font-bold">{progressPercentage.toFixed(0)}%</div>
                <div className="text-sm text-muted-foreground">Progress</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Campaign Description */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">About This Campaign</h2>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              {campaign.description}
            </p>
          </CardContent>
        </Card>

        {/* Refund Alert */}
        {isRefundAvailable && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-red-800">
                  <AlertCircle className="h-5 w-5" />
                  <div>
                    <div className="font-semibold">Refund Available</div>
                    <p className="text-sm text-red-700">
                      You donated {formatCHZ(userDonation)} CHZ to this campaign. You can claim your refund now.
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleClaimRefund}
                  disabled={isClaimingRefund}
                  variant="destructive"
                  className="shrink-0"
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
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          {isRefundAvailable ? (
            <Button size="lg" className="flex-1" variant="secondary" disabled>
              Campaign Ended
            </Button>
          ) : computedStatus === 0 ? (
            <Button 
              size="lg" 
              className="flex-1"
              onClick={() => {
                donationDialog.setMessage({
                  campaignId: campaign.id,
                  campaignTitle: campaign.title
                });
                donationDialog.show();
              }}
            >
              Support This Campaign
            </Button>
          ) : (
            <Button size="lg" className="flex-1">
              <ExternalLink className="h-4 w-4 mr-2" />
              View Details
            </Button>
          )}
          
          <Button 
            variant="outline" 
            size="lg"
            onClick={copyUrl}
            title="Copy campaign URL"
          >
            <Copy className="h-4 w-4 mr-2" />
            Share Campaign
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetails;
