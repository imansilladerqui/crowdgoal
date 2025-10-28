import ProjectCard from "./ProjectCard";
import ProjectCardSkeleton from "./ProjectCardSkeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useMemo, useState, useEffect } from "react";
import { useCampaigns } from "@/hooks/useCampaigns";
import { useProfileDonations } from "@/hooks/useProfileDonations";
import { AlertCircle, Sparkles } from "lucide-react";
import { getComputedCampaignStatus } from "@/lib/utils/campaignStatus";

const ProjectGrid = () => {
  const { data, isLoading, isError } = useCampaigns();
  const { canClaimRefunds, donations, claimingRefunds, handleClaimRefund } = useProfileDonations();
  const projects = useMemo(() => {
    const now = Date.now();
    return (data ?? []).map((c) => ({
      id: String(c.id),
      title: c.title,
      description: c.description,
      goal: c.goal,
      raised: c.raised,
      backers: c.backers,
      daysLeft: Math.max(
        0,
        Math.ceil((c.expiringDate * 1000 - now) / (1000 * 60 * 60 * 24))
      ),
      status: c.status,
      authorName: c.authorName,
      expiringDate: c.expiringDate,
      userDonation: c.userDonation ?? 0,
    }));
  }, [data]);

  const statuses = ["open", "funded", "failed", "finalized"] as const;
  const [selectedStatus, setSelectedStatus] = useState<"open" | "funded" | "failed" | "finalized">("open");

  const filterProjectsByStatus = (status: string) => {
    return projects.filter((project) => project.status === status);
  };

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    statuses.forEach(status => {
      counts[status] = projects.filter((p) => p.status === status).length;
    });
    return counts;
  }, [projects]);

  const availableStatuses = useMemo(() => {
    return statuses.filter(status => statusCounts[status] > 0);
  }, [statusCounts]);

  useEffect(() => {
    if (availableStatuses.length > 0 && !availableStatuses.includes(selectedStatus)) {
      setSelectedStatus(availableStatuses[0]);
    }
  }, [availableStatuses, selectedStatus]);

  const hasAnyProjects = projects.length > 0;

  return (
    <section className="py-20 bg-background" id="projects">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Discover{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Fan-Powered Sports Projects
            </span>
          </h2>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
            Explore innovative sports projects and experiences created by fans,
            for fans. Support your favorite teams, events, and grassroots
            campaigns—make an impact in the world of sports!
          </p>
        </div>

        {canClaimRefunds && (
          <Card className="relative border-2 border-purple-500/40 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-blue-500/5 shadow-2xl hover:shadow-purple-500/30 hover:scale-[1.02] transition-all duration-300 overflow-hidden backdrop-blur-sm mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/15 via-pink-500/15 to-blue-500/15 opacity-60 animate-pulse"></div>
            
            <div className="absolute top-3 right-3 animate-pulse">
              <Sparkles className="h-5 w-5 text-purple-400" />
            </div>
            
            <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_1px_1px,_white_1px,_transparent_0)] [background-size:20px_20px]"></div>
            
            <CardContent className="p-5 relative z-10">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="rounded-xl bg-violet-500 p-2 shadow-md">
                    <AlertCircle className="h-5 w-5 text-white" strokeWidth={2.5} />
                  </div>
                </div>
                
                <div className="flex-1 space-y-3">
                  <h3 className="text-lg font-semibold">
                    Refunds Available
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    You have donations in failed campaigns that you can claim refunds for.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {donations?.filter(d => {
                      const computedStatus = getComputedCampaignStatus(
                        d.campaignStatus,
                        d.campaignExpiringDate,
                        d.campaignRaised,
                        d.campaignGoal
                      );
                      return computedStatus === 2;
                    }).slice(0, 3).map((failedDonation) => (
                      <Button 
                        key={failedDonation.campaignId}
                        variant="outline" 
                        size="sm"
                        onClick={() => handleClaimRefund(failedDonation.campaignId)}
                        disabled={claimingRefunds.has(failedDonation.campaignId)}
                        className="text-xs"
                      >
                        {claimingRefunds.has(failedDonation.campaignId) ? (
                          <>
                            <div className="animate-spin mr-1 h-3 w-3 border-2 border-t-transparent border-current rounded-full" />
                            Claiming...
                          </>
                        ) : (
                          `Claim ${failedDonation.campaignTitle.slice(0, 12)}...`
                        )}
                      </Button>
                    ))}
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.location.href = "/profile/my-donations"}
                      className="text-xs"
                    >
                      View All →
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {hasAnyProjects && (
          <div className="flex justify-center mb-8 gap-2">
            {availableStatuses.map((status) => (
              <Button
                key={status}
                variant={selectedStatus === status ? "default" : "outline"}
                size="lg"
                onClick={() => setSelectedStatus(status)}
                className="relative"
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
                <span className={`inline-flex items-center justify-center min-w-[24px] h-6 px-2 text-sm font-semibold rounded-full transition-colors ${
                  selectedStatus === status 
                    ? "bg-primary-foreground/20 text-primary-foreground" 
                    : "bg-primary/10 text-primary"
                }`}>
                  {statusCounts[status]}
                </span>
              </Button>
            ))}
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[...Array(6)].map((_, i) => (
              <ProjectCardSkeleton key={i} />
            ))}
          </div>
        ) : isError ? (
          <div className="text-center text-red-500">
            Failed to load projects. Try refresh.
          </div>
        ) : !hasAnyProjects ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold mb-2">No Projects Yet</h3>
              <p className="text-muted-foreground mb-6">
                Be the first to create a sports project and start your crowdfunding campaign!
              </p>
              <Button size="lg" onClick={() => window.location.href = "/create"}>
                Create First Project
              </Button>
            </div>
          </div>
        ) : (
          <>
            {filterProjectsByStatus(selectedStatus).length === 0 ? (
              <div className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <div className="text-6xl mb-4">📭</div>
                  <h3 className="text-2xl font-bold mb-2">No {selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1)} Projects</h3>
                  <p className="text-muted-foreground mb-6">
                    There are no {selectedStatus} projects at the moment. Check back later or explore other categories.
                  </p>
                  {availableStatuses.length > 1 && (
                    <div className="flex gap-2 justify-center">
                      {availableStatuses.map((status) => (
                        <Button
                          key={status}
                          variant={status === selectedStatus ? "default" : "outline"}
                          onClick={() => setSelectedStatus(status)}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {filterProjectsByStatus(selectedStatus).map((project) => (
                  <ProjectCard key={project.id} {...project} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default ProjectGrid;
