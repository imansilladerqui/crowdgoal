import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Users } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/90" />
      </div>
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              Fund the Passion
            </span>
            <br />
            <span className="text-foreground">For Sports Fans Everywhere</span>
          </h1>

          <p className="text-xl md:text-2xl text-foreground/80 mb-8 max-w-2xl mx-auto">
            CrowdGoal is the world’s first decentralized crowdfunding platform
            for sports fans. Unite, fund, and bring to life the most exciting
            fan-driven sports projects, experiences, and community initiatives
            on the Chiliz Network.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              variant="hero"
              size="lg"
              className="text-lg px-8 py-4"
              onClick={() => {
                const el = document.getElementById("projects-section");
                if (el) {
                  el.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              Explore Fan Projects
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 py-4"
              onClick={() => {
                window.location.href = "/create";
              }}
            >
              Start a Sports Project
            </Button>
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
