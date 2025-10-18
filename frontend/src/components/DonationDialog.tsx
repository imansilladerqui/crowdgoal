import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { useDonation } from "../hooks/useDonation";
import { Loader2, Coins } from "lucide-react";

interface DonationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaignId: number;
  campaignTitle: string;
  onSuccess?: (amount: string) => void;
}

export const DonationDialog = ({ 
  open, 
  onOpenChange, 
  campaignId, 
  campaignTitle,
  onSuccess 
}: DonationDialogProps) => {
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { donate } = useDonation();

  const handleDonate = async () => {
    if (!amount || parseFloat(amount) <= 0) return;

    setIsLoading(true);
    try {
      const result = await donate({
        campaignId,
        amount
      });

      if (result.success) {
        setAmount("");
        onOpenChange(false);
        onSuccess?.(amount);
      } else {
        alert(result.error || "Donation failed");
      }
    } catch (error) {
      console.error("Donation error:", error);
      alert("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const quickAmounts = [0.1, 0.5, 1, 5, 10, 50];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-primary" />
            Support Campaign
          </DialogTitle>
          <DialogDescription>
            Donate to "{campaignTitle}" and help reach the funding goal.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Donation Amount (CHZ)</Label>
            <Input
              id="amount"
              type="number"
              step="0.001"
              min="0.001"
              max="10000"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Quick Amounts</Label>
            <div className="flex flex-wrap gap-2">
              {quickAmounts.map((quickAmount) => (
                <Button
                  key={quickAmount}
                  variant="outline"
                  size="sm"
                  onClick={() => setAmount(quickAmount.toString())}
                  disabled={isLoading}
                  className="text-xs"
                >
                  {quickAmount} CHZ
                </Button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDonate}
            disabled={!amount || parseFloat(amount) <= 0 || isLoading}
            className="flex-1"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Coins className="mr-2 h-4 w-4" />
                Donate {amount ? `${amount} CHZ` : ''}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
