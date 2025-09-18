import ProjectCard from "./ProjectCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";

const ProjectGrid = () => {
  const projects = [
    {
      id: "1",
      title: "AI-Powered Robotics Platform",
      description:
        "Revolutionary robotics platform that combines artificial intelligence with advanced hardware to create autonomous assistants for everyday tasks.",
      image: project1,
      goal: 50000,
      raised: 35000,
      backers: 245,
      daysLeft: 15,
      isLiked: true,
    },
    {
      id: "2",
      title: "Sustainable Energy Grid",
      description:
        "Building a decentralized renewable energy network using solar and wind power to create sustainable communities across the globe.",
      image: project2,
      goal: 100000,
      raised: 78000,
      backers: 520,
      daysLeft: 8,
    },
    {
      id: "3",
      title: "Next-Gen Gaming Platform",
      description:
        "Immersive gaming experience that blends virtual reality with blockchain technology to create truly owned digital assets.",
      image: project3,
      goal: 75000,
      raised: 23000,
      backers: 180,
      daysLeft: 22,
    },
    {
      id: "4",
      title: "AI-Powered Robotics Platform",
      description:
        "Revolutionary robotics platform that combines artificial intelligence with advanced hardware.",
      image: project1,
      goal: 30000,
      raised: 12000,
      backers: 95,
      daysLeft: 30,
    },
    {
      id: "5",
      title: "Sustainable Energy Grid",
      description:
        "Building a decentralized renewable energy network using cutting-edge technology.",
      image: project2,
      goal: 80000,
      raised: 45000,
      backers: 320,
      daysLeft: 12,
    },
    {
      id: "6",
      title: "Next-Gen Gaming Platform",
      description:
        "Immersive gaming experience with blockchain integration and true asset ownership.",
      image: project3,
      goal: 60000,
      raised: 55000,
      backers: 410,
      daysLeft: 5,
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Discover{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Amazing Projects
            </span>
          </h2>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
            Explore innovative projects from creators around the world and help
            bring their visions to life
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {projects.map((project) => (
            <ProjectCard key={project.id} {...project} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Load More Projects
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProjectGrid;
