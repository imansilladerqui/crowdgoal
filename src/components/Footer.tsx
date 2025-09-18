import { Github, Twitter, MessageCircle } from "lucide-react";
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
              Decentralized crowdfunding platform on Chiliz Network. Empowering
              creators and backers worldwide.
            </p>
            <div className="flex space-x-4">
              <Twitter className="h-5 w-5 text-foreground/60 hover:text-primary cursor-pointer transition-colors" />
              <Github className="h-5 w-5 text-foreground/60 hover:text-primary cursor-pointer transition-colors" />
              <MessageCircle className="h-5 w-5 text-foreground/60 hover:text-primary cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Community */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Community</h3>
            <ul className="space-y-2 text-sm text-foreground/70">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Create Project
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Success Stories
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Guidelines
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Support
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Resources</h3>
            <ul className="space-y-2 text-sm text-foreground/70">
              <li>
                <Link
                  to="/docs"
                  className="hover:text-primary transition-colors"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Privacy Policy
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
