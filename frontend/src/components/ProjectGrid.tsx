import ProjectCard from "./ProjectCard";
import { Button } from "@/components/ui/button";
import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";
import { useMemo, useState } from "react";
import { useCampaigns } from "@/hooks/useCampaigns";
const ProjectGrid = () => {
  const { data, isLoading, isError, refetch, isFetching } = useCampaigns();
  const projects = useMemo(() => {
    const now = Date.now();
    return (data ?? []).map((c) => ({
      id: String(c.id),
      title: c.title,
      description: c.description,
      image: [project1, project2, project3][c.id % 3],
      goal: c.goal,
      raised: c.raised,
      backers: c.backers,
      daysLeft: Math.max(
        0,
        Math.ceil((c.expiringDate * 1000 - now) / (1000 * 60 * 60 * 24))
      ),
      status: c.status,
    }));
  }, [data]);

  const statuses = ["open", "funded", "failed", "finalized"] as const;
  const [selectedStatus, setSelectedStatus] = useState<string>("open");

  const filterProjectsByStatus = (status: string) => {
    return projects.filter((project) => project.status === status);
  };

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

        <div className="flex justify-center mb-8 gap-4">
          {statuses.map((status) => (
            <Button
              key={status}
              variant={selectedStatus === status ? "default" : "outline"}
              size="lg"
              onClick={() => setSelectedStatus(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
          <Button
            variant="outline"
            size="lg"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            {isFetching ? "Refreshing..." : "Refresh"}
          </Button>
        </div>

        {isLoading || isFetching ? (
          <div className="text-center text-foreground/70">
            Loading projects...
          </div>
        ) : isError ? (
          <div className="text-center text-red-500">
            Failed to load projects. Try refresh.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filterProjectsByStatus(selectedStatus).map((project) => (
              <ProjectCard key={project.id} {...project} />
            ))}
          </div>
        )}

        {/* Pagination placeholder retained; backend currently returns all campaigns */}
      </div>
    </section>
  );
};

export default ProjectGrid;
