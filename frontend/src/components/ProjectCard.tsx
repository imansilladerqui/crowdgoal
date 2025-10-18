import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, Users, User, Calendar, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  goal: number;
  raised: number;
  backers: number;
  daysLeft: number;
  status: string;
  authorName?: string;
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
  status,
  authorName,
}: ProjectCardProps) => {
  const navigate = useNavigate();
  
  // Ensure progress doesn't exceed 100%
  const progressPercentage = Math.min((raised / goal) * 100, 100);
  
  // Proper CHZ token formatting (assuming 18 decimals)
  const formatCHZ = (amount: number) => {
    const chzAmount = amount / Math.pow(10, 18);
    
    if (chzAmount >= 1000000) {
      return `${(chzAmount / 1000000).toFixed(1)}M`;
    } else if (chzAmount >= 1000) {
      return `${(chzAmount / 1000).toFixed(1)}K`;
    } else if (chzAmount >= 1) {
      return chzAmount.toFixed(1);
    } else {
      return chzAmount.toFixed(3);
    }
  };

  // Get status badge variant
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'funded':
        return 'success';
      case 'failed':
        return 'destructive';
      case 'finalized':
        return 'info';
      case 'open':
      default:
        return 'default';
    }
  };

  // Get status text
  const getStatusText = (status: string) => {
    switch (status) {
      case 'funded':
        return 'Funded';
      case 'failed':
        return 'Failed';
      case 'finalized':
        return 'Finalized';
      case 'open':
      default:
        return 'Active';
    }
  };

  // Simple inline Badge component
  const Badge = ({ variant, className, children }: { variant: string; className?: string; children: React.ReactNode }) => {
    const baseClasses = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors";
    const variantClasses = {
      default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
      success: "border-transparent bg-green-600 text-white hover:bg-green-700",
      destructive: "border-transparent bg-red-600 text-white hover:bg-red-700",
      warning: "border-transparent bg-yellow-600 text-white hover:bg-yellow-700",
      info: "border-transparent bg-blue-600 text-white hover:bg-blue-700",
    };
    
    return (
      <div className={cn(baseClasses, variantClasses[variant as keyof typeof variantClasses] || variantClasses.default, className)}>
        {children}
      </div>
    );
  };

  // Check if campaign is urgent (less than 3 days)
  const isUrgent = daysLeft <= 3 && status === 'open';
  const isSuccessful = status === 'funded' || status === 'finalized';

  return (
    <Card className="group overflow-hidden border-border/50 bg-gradient-card hover:border-primary/50 transition-all duration-300 hover:shadow-glow-secondary">
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          <Badge 
            variant={getStatusVariant(status)}
            className="backdrop-blur-sm bg-background/80"
          >
            {getStatusText(status)}
          </Badge>
        </div>
        
        {/* Urgency Badge */}
        {isUrgent && (
          <div className="absolute top-4 right-16">
            <Badge variant="warning" className="animate-pulse backdrop-blur-sm bg-background/80">
              <Clock className="h-3 w-3 mr-1" />
              Urgent
            </Badge>
          </div>
        )}
      </div>

      <CardHeader className="pb-2">
        <h3 className="text-xl font-semibold line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-foreground/70 text-sm line-clamp-2">{description}</p>
        
        {/* Author Info */}
        {authorName && (
          <div className="flex items-center gap-2 text-xs text-foreground/60 mt-2">
            <User className="h-3 w-3" />
            <span>by {authorName}</span>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-foreground/70">Raised</span>
            <span className="font-semibold">{formatCHZ(raised)} CHZ</span>
          </div>
          
          <Progress 
            value={progressPercentage} 
            className={`h-2 ${isSuccessful ? 'bg-green-200' : ''}`}
          />
          
          <div className="flex justify-between text-sm text-foreground/70">
            <span>{progressPercentage.toFixed(1)}% funded</span>
            <span>Goal: {formatCHZ(goal)} CHZ</span>
          </div>
        </div>

        <div className="flex justify-between text-sm">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4 text-primary" />
            <span>{backers} sport fans</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-primary" />
            <span className={isUrgent ? "text-red-500 font-semibold" : ""}>
              {daysLeft > 0 ? `${daysLeft} days left` : 'Expired'}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button
          variant="outline-primary"
          className="w-full group-hover:border-primary group-hover:text-primary group-hover:bg-primary/5 transition-all duration-300"
          onClick={() => navigate(`/campaign/${id}`)}
        >
          {isSuccessful ? "View Details" : "Support Project"}
          <ExternalLink className="h-4 w-4 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
