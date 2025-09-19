import { Github, Linkedin, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border/40 bg-background/50 backdrop-blur">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              CrowdGoal
            </div>
            <p className="text-foreground/70 text-sm">
              CrowdGoal is the world’s first decentralized crowdfunding platform
              for sports fans. Empowering fan communities to launch, fund, and
              experience the best in global sports together.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.linkedin.com/in/imansilladerqui/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="h-5 w-5 text-foreground/60 hover:text-primary cursor-pointer transition-colors" />
              </a>
              <a
                href="https://github.com/imansilladerqui"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-5 w-5 text-foreground/60 hover:text-primary cursor-pointer transition-colors" />
              </a>
              <a
                href="mailto:imansilladerqui@hotmail.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Mail className="h-5 w-5 text-foreground/60 hover:text-primary cursor-pointer transition-colors" />
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Community</h3>
            <ul className="space-y-2 text-sm text-foreground/70">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Create Project
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/40 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-foreground/60">
            © 2024 CrowdGoal. All rights reserved.
          </p>
          <p className="text-sm text-foreground/60 mt-2 md:mt-0">
            Built on Chiliz Network ⚡
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
