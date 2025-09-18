import { Button } from "@/components/ui/button";
import { Wallet, Search } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const handleConnectWallet = () => {
    // Placeholder for wallet connection logic
    setIsWalletConnected(!isWalletConnected);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              CrowdGoal
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-foreground/80 hover:text-foreground transition-colors">
              Projects
            </Link>
            <Link to="/create" className="text-foreground/80 hover:text-foreground transition-colors">
              Create
            </Link>
            <Link to="/about" className="text-foreground/80 hover:text-foreground transition-colors">
              About
            </Link>
          </div>

          {/* Search and Wallet */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Search className="h-5 w-5" />
            </Button>
            <Button 
              variant={isWalletConnected ? "glow" : "wallet"} 
              onClick={handleConnectWallet}
              className="flex items-center gap-2"
            >
              <Wallet className="h-4 w-4" />
              {isWalletConnected ? "0x123...abc" : "Connect Wallet"}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;