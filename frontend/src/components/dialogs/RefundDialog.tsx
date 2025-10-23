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
import { CheckCircle, XCircle, RefreshCw } from "lucide-react";

interface RefundSuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  message: string;
}

interface RefundErrorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  message: string;
}

export const RefundSuccessDialog: React.FC<RefundSuccessDialogProps> = ({ 
  open, 
  onOpenChange,
  message
}) => {
  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center space-y-6">
          <div className="mx-auto flex items-center justify-center">
            <CheckCircle className="h-12 w-12 text-green-600 stroke-2" />
          </div>
          <DialogTitle className="text-xl font-semibold text-green-600">
            Refund Claimed Successfully!
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            {message}
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="mt-8">
          <Button
            onClick={handleClose}
            className="w-full"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const RefundErrorDialog: React.FC<RefundErrorDialogProps> = ({ 
  open, 
  onOpenChange,
  message
}) => {
  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center space-y-6">
          <div className="mx-auto flex items-center justify-center">
            <XCircle className="h-12 w-12 text-red-600 stroke-2" />
          </div>
          <DialogTitle className="text-xl font-semibold text-red-600">
            Refund Claim Failed
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            {message}
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="mt-8">
          <Button
            onClick={handleClose}
            className="w-full"
            variant="destructive"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
