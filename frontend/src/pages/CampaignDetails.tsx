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
  Calendar,
  User,
  Target,
  TrendingUp,
  Copy,
  Check,
  Heart
} from "lucide-react";
import { useState } from "react";
import { formatCHZ } from "@/lib/utils/formatCHZ";
import { getCampaignStatusInfo } from "@/lib/utils/statusInfo";

const CampaignDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
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

  const progressPercentage = Math.min((campaign.raised / campaign.goal) * 100, 100);
  const daysLeft = Math.max(0, Math.ceil((campaign.expiringDate * 1000 - Date.now()) / (1000 * 60 * 60 * 24)));
  
  // Get status info using utility
  const getStatusInfo = () => getCampaignStatusInfo(campaign.status);

  const isUrgent = daysLeft <= 3 && campaign.status === 0;
  const isSuccessful = campaign.status === 1 || campaign.status === 3;

  const copyUrl = async () => {
    try {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
    }
  };

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
                <Badge variant={getStatusInfo().variant}>
                  {getStatusInfo().text}
                </Badge>
                {isUrgent && (
                  <Badge variant="warning" className="animate-pulse">
                    <Clock className="h-3 w-3 mr-1" />
                    Urgent
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

        {/* Action Buttons */}
        <div className="flex gap-4">
          {isSuccessful ? (
            <Button size="lg" className="flex-1">
              <ExternalLink className="h-4 w-4 mr-2" />
              View Details
            </Button>
          ) : (
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
          )}
          
          <Button 
            variant="outline" 
            size="lg"
            onClick={copyUrl}
            className={`relative transition-all duration-200 ${
              copied ? "bg-green-50 border-green-200 text-green-700" : ""
            }`}
            title={copied ? "Copied!" : "Copy campaign URL"}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Share Campaign
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetails;
