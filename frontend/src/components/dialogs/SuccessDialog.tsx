import React from 'react';
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { CheckCircle, X, Home } from "lucide-react";

interface SuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  message?: string;
}

const SuccessDialog: React.FC<SuccessDialogProps> = ({ 
  open, 
  onOpenChange,
  title = "Project Created Successfully!",
  message = "Your crowdfunding campaign has been successfully created and submitted to the blockchain!"
}) => {
  const handleClose = () => {
    onOpenChange(false);
    // Redirect to home page
    window.location.href = '/';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <DialogTitle className="text-2xl font-bold text-green-600">
            {title}
          </DialogTitle>
          <DialogDescription className="text-lg">
            {message}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="rounded-lg bg-green-50 p-4 text-center">
            <p className="text-sm text-green-700">
              Your project is now live and ready to receive donations from the community!
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleClose}
            className="w-full"
          >
            <Home className="mr-2 h-4 w-4" />
            Close & Go to Home
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessDialog;
