import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  User, 
  LogOut, 
  Wallet, 
  Trophy,
  DollarSign,
  Shield,
  ChevronDown
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getWalletAddress } from "@/hooks/UseWalletStorage";
import { useWalletDialogs } from "@/lib/context/WalletDialogContext";

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const walletAddress = getWalletAddress();
  const { logoutDialog } = useWalletDialogs();

  if (!walletAddress) return null;

  const handleLogout = () => {
    setIsOpen(false);
    logoutDialog.show();
  };

  const handleNavigation = (path: string) => {
    setIsOpen(false);
    navigate(path);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 ml-2 h-10 px-4 py-2"
        >
          <User className="h-4 w-4" />
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5 text-sm text-muted-foreground">
          <div className="font-medium text-foreground">
            {`${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`}
          </div>
          <div className="text-xs">Connected Wallet</div>
        </div>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => handleNavigation("/profile/my-campaigns")}>
          <Trophy className="h-4 w-4 mr-2" />
          My Campaigns
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleNavigation("/profile/my-donations")}>
          <DollarSign className="h-4 w-4 mr-2" />
          My Donations
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => handleNavigation("/profile/admin")}>
          <Shield className="h-4 w-4 mr-2" />
          Admin Panel
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleLogout} className="text-destructive">
          <LogOut className="h-4 w-4 mr-2" />
          Disconnect Wallet
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileDropdown;
