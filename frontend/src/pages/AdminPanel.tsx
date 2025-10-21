import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Shield, 
  AlertTriangle,
  Users,
  Settings,
  Copy,
  Check,
  DollarSign
} from "lucide-react";
import { getReadableProvider } from "@/lib/web3/network";
import { getCampaignFactoryContract } from "@/lib/web3/contracts";
import { getWalletAddress } from "@/hooks/UseWalletStorage";
import { BrowserProvider } from "ethers";
import { formatCHZ } from "@/lib/utils/formatCHZ";

const AdminPanel = () => {
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const [emergencyTokenAddress, setEmergencyTokenAddress] = useState("");
  const walletAddress = getWalletAddress();

  const { data: adminData, isLoading } = useQuery({
    queryKey: ["admin-data", walletAddress],
    queryFn: async () => {
      if (!walletAddress) return null;
      
      const provider = await getReadableProvider();
      const contract = getCampaignFactoryContract(provider);
      
      try {
        const owner = await contract.owner();
        const contractBalance = await contract.getContractBalance();
        const totalCampaigns = await contract.getAllCampaigns();
        
        return {
          owner: String(owner),
          contractBalance: Number(contractBalance),
          totalCampaigns: totalCampaigns.length,
          isOwner: owner.toLowerCase() === walletAddress.toLowerCase()
        };
      } catch (error) {
        return null;
      }
    },
    enabled: !!walletAddress,
  });

  const handleEmergencyWithdrawETH = async () => {
    if (!window.ethereum) {
      alert("Wallet not available");
      return;
    }

    if (!confirm("Are you sure you want to withdraw all ETH from the contract? This is an emergency function.")) {
      return;
    }

    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = getCampaignFactoryContract(signer);

      const tx = await contract.emergencyWithdrawETH();
      await tx.wait();

      alert("Emergency ETH withdrawal completed successfully!");
    } catch (error: any) {
      alert(`Emergency withdrawal failed: ${error.message}`);
    }
  };

  const handleEmergencyWithdrawToken = async () => {
    if (!emergencyTokenAddress) {
      alert("Please enter a token address");
      return;
    }

    if (!window.ethereum) {
      alert("Wallet not available");
      return;
    }

    if (!confirm(`Are you sure you want to withdraw all tokens from address ${emergencyTokenAddress}? This is an emergency function.`)) {
      return;
    }

    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = getCampaignFactoryContract(signer);

      const tx = await contract.emergencyWithdrawToken(emergencyTokenAddress);
      await tx.wait();

      alert("Emergency token withdrawal completed successfully!");
      setEmergencyTokenAddress("");
    } catch (error: any) {
      alert(`Emergency withdrawal failed: ${error.message}`);
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedAddress(label);
      setTimeout(() => setCopiedAddress(null), 2000);
    } catch (err) {
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Admin Panel</h2>
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
              <div className="h-2 bg-muted rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!adminData) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Admin Panel</h2>
        <Card>
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-destructive" />
            <h3 className="text-lg font-semibold mb-2">Error Loading Admin Data</h3>
            <p className="text-muted-foreground">
              Unable to load admin information. Please check your connection and try again.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!adminData.isOwner) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Admin Panel</h2>
        <Card>
          <CardContent className="p-8 text-center">
            <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
            <p className="text-muted-foreground mb-4">
              You are not the contract owner. Only the contract owner can access admin functions.
            </p>
            <div className="text-sm text-muted-foreground">
              <p>Contract Owner: {adminData.owner}</p>
              <p>Your Address: {walletAddress}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Admin Panel</h2>
        <Badge variant="success" className="bg-green-600">
          <Shield className="h-3 w-3 mr-1" />
          Contract Owner
        </Badge>
      </div>

      {/* Contract Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Contract Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">Contract Owner</Label>
              <div className="flex items-center gap-2 mt-1">
                <code className="text-sm bg-background text-white pr-3 py-1 rounded">
                  {adminData.owner}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(adminData.owner, "owner")}
                  className="hover:bg-transparent"
                >
                  {copiedAddress === "owner" ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium">Contract Balance</Label>
              <div className="text-2xl font-bold mt-1">
                {formatCHZ(adminData.contractBalance)} CHZ
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Platform Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold">{adminData.totalCampaigns}</div>
              <div className="text-sm text-muted-foreground">Total Campaigns</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{formatCHZ(adminData.contractBalance)}</div>
              <div className="text-sm text-muted-foreground">Contract Balance (CHZ)</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">3%</div>
              <div className="text-sm text-muted-foreground">Platform Fee</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Functions */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Emergency Functions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-red-800 mb-2">
              <AlertTriangle className="h-4 w-4" />
              <span className="font-semibold">Warning</span>
            </div>
            <p className="text-red-700 text-sm">
              These functions should only be used in emergency situations. They will withdraw all funds from the contract.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <Label className="text-sm font-medium">Emergency ETH Withdrawal</Label>
                  <p className="text-sm text-muted-foreground">
                    Withdraw all ETH from the contract to the owner address.
                  </p>
                </div>
                <Button
                  variant="destructive"
                  onClick={handleEmergencyWithdrawETH}
                  disabled={adminData.contractBalance === 0}
                  className="mt-1"
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  Withdraw All ETH
                </Button>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Emergency Token Withdrawal</Label>
              <p className="text-sm text-muted-foreground mb-2">
                Withdraw all tokens of a specific ERC20 token from the contract.
              </p>
              <div className="flex gap-2">
                <Input
                  placeholder="Token contract address (0x...)"
                  value={emergencyTokenAddress}
                  onChange={(e) => setEmergencyTokenAddress(e.target.value)}
                  className="flex-1"
                />
                <Button
                  variant="destructive"
                  onClick={handleEmergencyWithdrawToken}
                  disabled={!emergencyTokenAddress}
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  Withdraw Tokens
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPanel;