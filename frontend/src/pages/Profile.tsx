import { Outlet, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, User, Trophy, DollarSign, Shield } from "lucide-react";
import { getWalletAddress } from "@/hooks/UseWalletStorage";

const ProfileLayout = () => {
  const navigate = useNavigate();
  const walletAddress = getWalletAddress();

  if (!walletAddress) {
    navigate("/");
    return null;
  }

  const profileSections = [
    {
      title: "My Campaigns",
      description: "Manage your created campaigns",
      icon: Trophy,
      path: "/profile/my-campaigns",
      color: "text-blue-600"
    },
    {
      title: "My Donations", 
      description: "View and manage your donations",
      icon: DollarSign,
      path: "/profile/my-donations",
      color: "text-green-600"
    },
    {
      title: "Admin Panel",
      description: "Contract owner functions",
      icon: Shield,
      path: "/profile/admin",
      color: "text-purple-600"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>

        <div className="space-y-6">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <User className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h1 className="text-3xl font-bold">Profile Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your campaigns, donations, and account settings
            </p>
            <div className="text-sm text-muted-foreground">
              Wallet: {`${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`}
            </div>
          </div>

          {/* Profile Sections Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profileSections.map((section) => {
              const IconComponent = section.icon;
              return (
                <Card 
                  key={section.path}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => navigate(section.path)}
                >
                  <CardHeader className="text-center">
                    <div className="flex justify-center mb-2">
                      <IconComponent className={`h-8 w-8 ${section.color}`} />
                    </div>
                    <CardTitle className="text-lg">{section.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-sm text-muted-foreground">
                      {section.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Outlet for nested routes */}
        <Outlet />
      </div>
    </div>
  );
};

export default ProfileLayout;
