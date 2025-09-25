import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import { useWalletConnection } from "@/hooks/UseWalletConnection";
import { getWalletAddress, setWalletAddress } from "@/hooks/UseWalletStorage";
import { useWalletDialogs } from "@/lib/context/WalletDialogContext";

const Navbar = () => {
  const walletAddress = getWalletAddress();
  const { enableWalletDialog, logoutDialog, walletConsentDialog } =
    useWalletDialogs();

  const { isConnecting, checkWalletRequirements } = useWalletConnection();

  return (
    <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="relative flex items-center h-16">
          <div className="absolute left-0 top-0 h-full flex items-center pl-4">
            <Link
              to="/"
              className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent"
            >
              CrowdGoal
            </Link>
          </div>
          <div className="mx-auto hidden md:flex items-center space-x-8">
            <Link
              to="/create"
              className="text-foreground/80 hover:text-foreground transition-colors"
              onClick={(e) => {
                if (!walletAddress) {
                  e.preventDefault();
                  enableWalletDialog.show();
                }
              }}
            >
              Create
            </Link>
            <Link
              to="/about"
              className="text-foreground/80 hover:text-foreground transition-colors"
            >
              About
            </Link>
          </div>
          <div className="absolute right-0 top-0 h-full flex items-center">
            {walletAddress ? (
              <>
                <Button
                  variant="glow"
                  onClick={() => logoutDialog.show()}
                  className="flex items-center gap-2"
                  disabled={isConnecting}
                >
                  <Wallet className="h-4 w-4" />
                  {`${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`}
                </Button>
              </>
            ) : (
              <Button
                variant="wallet"
                onClick={() => {
                  if (checkWalletRequirements()) {
                    return walletConsentDialog.show();
                  }
                }}
                className="flex items-center gap-2"
                disabled={isConnecting}
              >
                {isConnecting ? (
                  <span className="animate-spin mr-2 h-4 w-4 border-2 border-t-transparent border-foreground rounded-full inline-block" />
                ) : (
                  <Wallet className="h-4 w-4" />
                )}
                {isConnecting ? "Connecting..." : "Connect Wallet"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
