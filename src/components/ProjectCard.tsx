import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Heart } from "lucide-react";

interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  goal: number;
  raised: number;
  backers: number;
  daysLeft: number;
  isLiked?: boolean;
}

const ProjectCard = ({
  id,
  title,
  description,
  image,
  goal,
  raised,
  backers,
  daysLeft,
  isLiked = false,
}: ProjectCardProps) => {
  const progressPercentage = (raised / goal) * 100;

  const formatAmount = (amount: number) => {
    if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}K`;
    }
    return amount.toString();
  };

  return (
    <Card className="group overflow-hidden border-border/50 bg-gradient-card hover:border-primary/50 transition-all duration-300 hover:shadow-glow-secondary">
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4"></div>
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-4 right-4 bg-background/80 backdrop-blur hover:bg-background/90 ${
            isLiked ? "text-red-500" : "text-foreground/70"
          }`}
        >
          <Heart className="h-4 w-4" fill={isLiked ? "currentColor" : "none"} />
        </Button>
      </div>

      <CardHeader className="pb-2">
        <h3 className="text-xl font-semibold line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-foreground/70 text-sm line-clamp-2">{description}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-foreground/70">Raised</span>
            <span className="font-semibold">${formatAmount(raised)} CHZ</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <div className="flex justify-between text-sm text-foreground/70">
            <span>{progressPercentage.toFixed(1)}% funded</span>
            <span>Goal: ${formatAmount(goal)} CHZ</span>
          </div>
        </div>

        <div className="flex justify-between text-sm">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4 text-primary" />
            <span>{backers} backers</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-primary" />
            <span>{daysLeft} days left</span>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button
          variant="outline"
          className="w-full group-hover:border-primary group-hover:text-primary transition-colors"
        >
          View Project
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
