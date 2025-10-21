import ProjectCard from "./ProjectCard";
import ProjectCardSkeleton from "./ProjectCardSkeleton";
import { Button } from "@/components/ui/button";
import { useMemo, useState, useEffect } from "react";
import { useCampaigns } from "@/hooks/useCampaigns";
const ProjectGrid = () => {
  const { data, isLoading, isError } = useCampaigns();
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
    }));
  }, [data]);

  const statuses = ["open", "funded", "failed", "finalized"] as const;
  const [selectedStatus, setSelectedStatus] = useState<"open" | "funded" | "failed" | "finalized">("open");

  const filterProjectsByStatus = (status: string) => {
    return projects.filter((project) => project.status === status);
  };

  // Calculate project counts for each status
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    statuses.forEach(status => {
      counts[status] = filterProjectsByStatus(status).length;
    });
    return counts;
  }, [projects]);

  // Get available statuses (only those with projects)
  const availableStatuses = useMemo(() => {
    return statuses.filter(status => statusCounts[status] > 0);
  }, [statusCounts]);

  // Auto-select first available status if current selection has no projects
  useEffect(() => {
    if (availableStatuses.length > 0 && !availableStatuses.includes(selectedStatus)) {
      setSelectedStatus(availableStatuses[0]);
    }
  }, [availableStatuses, selectedStatus]);

  // Check if there are any projects at all
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

        {/* Category Selector - Only show if there are projects */}
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

        {/* Pagination placeholder retained; backend currently returns all campaigns */}
      </div>
    </section>
  );
};

export default ProjectGrid;
