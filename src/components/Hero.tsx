import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Users } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/90" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              Fund the Future
            </span>
            <br />
            <span className="text-foreground">
              Together
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-foreground/80 mb-8 max-w-2xl mx-auto">
            CrowdGoal is a decentralized crowdfunding platform on Chiliz Network. 
            Back innovative projects and help bring groundbreaking ideas to life.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button variant="hero" size="lg" className="text-lg px-8 py-4">
              Explore Projects
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4">
              Start a Project
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">$2.5M+</div>
              <div className="text-foreground/70">Total Funded</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">150+</div>
              <div className="text-foreground/70">Active Projects</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">10K+</div>
              <div className="text-foreground/70">Backers</div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 animate-pulse">
        <TrendingUp className="h-8 w-8 text-primary/30" />
      </div>
      <div className="absolute bottom-20 right-10 animate-pulse">
        <Users className="h-8 w-8 text-primary/30" />
      </div>
    </section>
  );
};

export default Hero;