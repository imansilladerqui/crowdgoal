import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { CheckCircle, Heart } from "lucide-react";

interface ThankYouDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaignTitle?: string;
  donationAmount?: string;
}

export const ThankYouDialog = ({ 
  open, 
  onOpenChange, 
  campaignTitle,
  donationAmount
}: ThankYouDialogProps) => {
  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center">
            <Heart className="h-12 w-12 text-red-500" />
          </div>
          <DialogTitle className="text-2xl mb-6 font-bold text-red-600 text-center">
            Thank You!
          </DialogTitle>
          <div>
            <DialogDescription className="text-lg mt-2">
                Your donation of <span className="font-semibold ml-2 text-foreground">{donationAmount} CHZ</span> to 
                <br />
                <span className="font-semibold text-primary">"{campaignTitle}"</span> has been successfully processed!
            </DialogDescription>
          </div>
          
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-xs text-muted-foreground">
            <p>You'll receive updates about this campaign's progress.</p>
            <p>Thank you for being part of the community!</p>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleClose}
            className="w-full"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
