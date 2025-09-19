import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import React from "react";

interface LogoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

const LogoutDialog: React.FC<LogoutDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-sm text-center">
      <DialogHeader>
        <div className="flex flex-col items-center gap-2">
          <span className="bg-gradient-to-r from-red-500 via-yellow-500 to-orange-500 bg-clip-text text-transparent">
            <LogOut className="mx-auto h-10 w-10 text-red-500" />
          </span>
          <DialogTitle className="bg-gradient-to-r from-red-500 via-yellow-500 to-orange-500 bg-clip-text text-transparent text-2xl font-bold">
            Disconnect Wallet?
          </DialogTitle>
        </div>
      </DialogHeader>
      <p className="mt-2 text-muted-foreground text-base">
        You are about to disconnect your wallet from CrowdGoal.
        <br />
        This will log you out and you will need to reconnect to continue.
      </p>
      <div className="mt-6 flex justify-center gap-4">
        <Button variant="outline" size="lg" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button variant="destructive" size="lg" onClick={onConfirm}>
          Disconnect
        </Button>
      </div>
    </DialogContent>
  </Dialog>
);

export default LogoutDialog;
