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
import { AlertTriangle, RefreshCw } from "lucide-react";

interface UnexpectedErrorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  message?: string;
}

export const UnexpectedErrorDialog: React.FC<UnexpectedErrorDialogProps> = ({ 
  open, 
  onOpenChange,
  message = "An unexpected error occurred. Please try again."
}) => {
  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center space-y-6">
          <div className="mx-auto flex items-center justify-center">
            <AlertTriangle className="h-12 w-12 text-red-600 stroke-2" />
          </div>
          <DialogTitle className="text-xl font-semibold text-red-600">
            Unexpected Error
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
