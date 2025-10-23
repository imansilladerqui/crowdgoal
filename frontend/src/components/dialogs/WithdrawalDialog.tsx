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
import { CheckCircle, XCircle, Wallet } from "lucide-react";

interface WithdrawalSuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  message: string;
}

interface WithdrawalErrorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  message: string;
}

export const WithdrawalSuccessDialog: React.FC<WithdrawalSuccessDialogProps> = ({ 
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
            Funds Withdrawn Successfully!
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
            <Wallet className="mr-2 h-4 w-4" />
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const WithdrawalErrorDialog: React.FC<WithdrawalErrorDialogProps> = ({ 
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
            Withdrawal Failed
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
            <Wallet className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
