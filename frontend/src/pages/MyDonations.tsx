import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {  
  Download,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { useProfileDonations } from "@/hooks/useProfileDonations";
import { formatCHZ } from "@/lib/utils/formatCHZ";
import { getDonationStatusInfo } from "@/lib/utils/statusInfo";
import { calculateProgress } from "@/lib/utils/calculations";
import { CampaignStatsGrid } from "@/components/CampaignStatsGrid";
import { ProgressSection } from "@/components/ProgressSection";

const MyDonations = () => {
  const {
    donations,
    isLoading,
    claimingRefunds,
    totalDonated,
    canClaimRefunds,
    handleClaimRefund
  } = useProfileDonations();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">My Donations</h2>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                  <div className="h-2 bg-muted rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!donations || donations.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">My Donations</h2>
        <Card>
          <CardContent className="p-8 text-center">
            <h3 className="text-lg font-semibold mb-2">No Donations Yet</h3>
            <p className="text-muted-foreground mb-4">
              You haven't made any donations yet. Support a campaign to get started!
            </p>
            <Button onClick={() => window.location.href = "/"}>
              Browse Campaigns
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Donations</h2>
        <div className="text-right">
          <div className="text-sm text-muted-foreground">Total Donated</div>
          <div className="text-2xl font-bold">{formatCHZ(totalDonated)} CHZ</div>
        </div>
      </div>

      {canClaimRefunds && (
        <Card className="relative border-2 border-purple-500/40 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-blue-500/5 shadow-2xl hover:shadow-purple-500/30 hover:scale-[1.02] transition-all duration-300 overflow-hidden backdrop-blur-sm">
          {/* Animated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/15 via-pink-500/15 to-blue-500/15 opacity-60 animate-pulse"></div>
          
          {/* Sparkles decoration */}
          <div className="absolute top-3 right-3 animate-pulse">
            <Sparkles className="h-5 w-5 text-purple-400" />
          </div>
          
          {/* Subtle pattern */}
          <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_1px_1px,_white_1px,_transparent_0)] [background-size:20px_20px]"></div>
          
            <CardContent className="p-5 relative z-10">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="rounded-xl bg-violet-500 p-2 shadow-md">
                    <AlertCircle className="h-5 w-5 text-white" strokeWidth={2.5} />
                  </div>
                </div>
                
                <div className="flex-1 space-y-2">
                  <h3 className="text-lg font-semibold">
                    Refunds Available
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    You have donations in failed campaigns that you can claim refunds for.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
      )}

      <div className="grid gap-6">
        {donations.map((donation) => {
          const statusInfo = getDonationStatusInfo(donation.campaignStatus);
          const StatusIcon = statusInfo.icon;
          const progressPercentage = calculateProgress(donation.campaignRaised, donation.campaignGoal);
          const canClaimRefund = donation.campaignStatus === 2;
          const isClaimingRefund = claimingRefunds.has(donation.campaignId);

          return (
            <Card key={donation.campaignId}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-xl">{donation.campaignTitle}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant={statusInfo.variant}>
                        {statusInfo.icon && <StatusIcon className={`h-3 w-3 mr-1 ${statusInfo.variant === 'destructive' ? 'text-destructive-foreground' : statusInfo.color}`} />}
                        {statusInfo.text}
                      </Badge>
                      <Badge variant="outline">
                        {formatCHZ(donation.donationAmount)} CHZ
                      </Badge>
                    </div>
                  </div>
                  {canClaimRefund && (
                    <Button
                      onClick={() => handleClaimRefund(donation.campaignId)}
                      disabled={isClaimingRefund}
                      variant="destructive"
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
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{donation.campaignDescription}</p>
                
                <div className="space-y-2">
                  <Progress value={progressPercentage} className="h-2" />
                  <ProgressSection 
                    raised={donation.campaignRaised} 
                    goal={donation.campaignGoal}
                  />
                </div>

                <CampaignStatsGrid
                  donorCount={donation.donorCount}
                  goal={donation.campaignGoal}
                  raised={donation.campaignRaised}
                  expiringDate={donation.campaignExpiringDate}
                />
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default MyDonations;
