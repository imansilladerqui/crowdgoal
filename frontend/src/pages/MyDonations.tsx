import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {  
  Download,
  AlertCircle,
} from "lucide-react";
import { useProfileDonations } from "@/hooks/useProfileDonations";
import { formatCHZ } from "@/lib/utils/formatCHZ";
import { formatDate } from "@/lib/utils/formatDate";
import { getDonationStatusInfo } from "@/lib/utils/statusInfo";

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
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="h-5 w-5" />
              <span className="font-semibold">Refunds Available</span>
            </div>
            <p className="text-red-700 text-sm mt-1">
              You have donations in failed campaigns that you can claim refunds for.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6">
        {donations.map((donation) => {
          const statusInfo = getDonationStatusInfo(donation.campaignStatus);
          const StatusIcon = statusInfo.icon;
          const progressPercentage = Math.min((donation.campaignRaised / donation.campaignGoal) * 100, 100);
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
                        {statusInfo.icon && <StatusIcon className={`h-3 w-3 mr-1 ${statusInfo.color}`} />}
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
                  <div className="flex justify-between text-sm">
                    <span>Campaign Progress</span>
                    <span>{progressPercentage.toFixed(1)}%</span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{formatCHZ(donation.campaignRaised)} CHZ raised</span>
                    <span>Goal: {formatCHZ(donation.campaignGoal)} CHZ</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">{donation.donorCount}</div>
                    <div className="text-sm text-muted-foreground">Supporters</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{formatCHZ(donation.campaignGoal)}</div>
                    <div className="text-sm text-muted-foreground">Goal (CHZ)</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{formatCHZ(donation.campaignRaised)}</div>
                    <div className="text-sm text-muted-foreground">Raised (CHZ)</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{formatDate(donation.campaignExpiringDate)}</div>
                    <div className="text-sm text-muted-foreground">Expired</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default MyDonations;
