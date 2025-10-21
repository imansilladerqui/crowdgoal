import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  Download,
  CheckCircle,
} from "lucide-react";
import { useProfileMyCampaigns } from "@/hooks/useProfileMyCampaigns";
import { formatCHZ } from "@/lib/utils/formatCHZ";
import { formatDate } from "@/lib/utils/formatDate";
import { getMyCampaignStatusInfo } from "@/lib/utils/statusInfo";

const MyCampaigns = () => {
  const {
    campaigns,
    isLoading,
    withdrawingCampaigns,
    handleWithdrawFunds
  } = useProfileMyCampaigns();

  console.log(campaigns);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">My Campaigns</h2>
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

  if (!campaigns || campaigns.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">My Campaigns</h2>
        <Card>
          <CardContent className="p-8 text-center">
            <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Campaigns Yet</h3>
            <p className="text-muted-foreground mb-4">
              You haven't created any campaigns yet. Start by creating your first campaign!
            </p>
            <Button onClick={() => window.location.href = "/create"}>
              Create Your First Campaign
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Campaigns</h2>
        <Button onClick={() => window.location.href = "/create"}>
          Create New Campaign
        </Button>
      </div>

      <div className="grid gap-6">
        {campaigns.map((campaign) => {
          const statusInfo = getMyCampaignStatusInfo(campaign.status, campaign.fundsWithdrawn);
          const StatusIcon = statusInfo.icon;
          
          const progressPercentage = campaign.goal > 0 
            ? Math.min((campaign.raised / campaign.goal) * 100, 100) 
            : 0;
            
          const canWithdraw = campaign.status === 1 && !campaign.fundsWithdrawn;
          const isWithdrawing = withdrawingCampaigns.has(campaign.id);

          return (
            <Card key={campaign.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-xl">{campaign.title}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant={statusInfo.variant}>
                        {campaign.status === 0 ? '' : <StatusIcon className={`h-3 w-3 mr-1 ${statusInfo.color}`} />}
                        {statusInfo.text}
                      </Badge>
                    </div>
                  </div>
                  {canWithdraw && (
                    <Button
                      onClick={() => handleWithdrawFunds(campaign.id)}
                      disabled={isWithdrawing}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isWithdrawing ? (
                        <>
                          <div className="animate-spin mr-2 h-4 w-4 border-2 border-t-transparent border-white rounded-full" />
                          Withdrawing...
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          Withdraw Funds
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{campaign.description}</p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{progressPercentage.toFixed(1)}%</span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{formatCHZ(campaign.raised)} CHZ raised</span>
                    <span>Goal: {formatCHZ(campaign.goal)} CHZ</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">{campaign.donorCount}</div>
                    <div className="text-sm text-muted-foreground">Supporters</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{formatCHZ(campaign.goal)}</div>
                    <div className="text-sm text-muted-foreground">Goal (CHZ)</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{formatCHZ(campaign.raised)}</div>
                    <div className="text-sm text-muted-foreground">Raised (CHZ)</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{formatDate(campaign.expiringDate)}</div>
                    <div className="text-sm text-muted-foreground">Expires</div>
                  </div>
                </div>

                {canWithdraw && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-green-800">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-semibold">Campaign Successful!</span>
                    </div>
                    <p className="text-green-700 text-sm mt-1">
                      Your campaign has reached its goal. You can now withdraw the funds (minus 3% platform fee).
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default MyCampaigns;
