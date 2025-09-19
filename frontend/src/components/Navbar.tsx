import { Button } from "@/components/ui/button";
import LogoutDialog from "@/components/LogoutDialog";
import { Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import MetaMaskDialog from "@/components/MetaMaskDialog";
import { useWalletConnection } from "@/hooks/use-wallet-connection";
import WalletConsentDrawer from "@/components/WalletConsentDrawer";
import WalletRejectedDialog from "@/components/WalletRejectedDialog";
import WalletErrorDialog from "@/components/WalletErrorDialog";

const Navbar = () => {
  const {
    walletAddress,
    showMetaMaskModal,
    setShowMetaMaskModal,
    handleLogin,
    handleLogout,
    confirmConnectWallet,
    isConnecting,
    showConsentDrawer,
    setShowConsentDrawer,
    showRejectedDialog,
    setShowRejectedDialog,
    showNetworkErrorDialog,
    setShowNetworkErrorDialog,
    showWalletErrorDialog,
    setShowWalletErrorDialog,
    showLogoutDialog,
    setShowLogoutDialog,
    confirmLogout,
    walletErrorMessage,
  } = useWalletConnection();

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
                  onClick={handleLogout}
                  className="flex items-center gap-2"
                  disabled={isConnecting}
                >
                  <Wallet className="h-4 w-4" />
                  {`${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`}
                </Button>
                <LogoutDialog
                  open={showLogoutDialog}
                  onOpenChange={setShowLogoutDialog}
                  onConfirm={confirmLogout}
                />
              </>
            ) : (
              <Button
                variant="wallet"
                onClick={handleLogin}
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

          <div className="flex items-center space-x-4">
            {walletAddress ? (
              <>
                <Button
                  variant="glow"
                  onClick={handleLogout}
                  className="flex items-center gap-2"
                  disabled={isConnecting}
                >
                  <Wallet className="h-4 w-4" />
                  {`${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`}
                </Button>
                <LogoutDialog
                  open={showLogoutDialog}
                  onOpenChange={setShowLogoutDialog}
                  onConfirm={confirmLogout}
                />
              </>
            ) : (
              <Button
                variant="wallet"
                onClick={handleLogin}
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
          <MetaMaskDialog
            open={showMetaMaskModal}
            onOpenChange={setShowMetaMaskModal}
          />
          <WalletConsentDrawer
            open={showConsentDrawer}
            onConfirm={confirmConnectWallet}
            onCancel={() => setShowConsentDrawer(false)}
            isConnecting={isConnecting}
          />
          <WalletRejectedDialog
            open={showRejectedDialog}
            onOpenChange={setShowRejectedDialog}
          />
          <WalletErrorDialog
            open={showNetworkErrorDialog}
            onOpenChange={setShowNetworkErrorDialog}
            title="Network Configuration Error"
            message="Network configuration missing. Please contact support."
          />
          <WalletErrorDialog
            open={showWalletErrorDialog}
            onOpenChange={setShowWalletErrorDialog}
            title="Wallet Error"
            message={walletErrorMessage}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
