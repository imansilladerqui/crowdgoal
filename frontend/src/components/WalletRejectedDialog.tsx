import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Wallet } from "lucide-react";
import React from "react";

interface WalletRejectedDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const WalletRejectedDialog: React.FC<WalletRejectedDialogProps> = ({
  open,
  onOpenChange,
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <div className="flex flex-col items-center text-center gap-4">
        <Wallet className="h-10 w-10 text-red-500 mb-2" />
        <h2 className="text-2xl font-bold text-red-500">Connection Rejected</h2>
        <p className="text-foreground/70 mb-2">
          Connection request rejected by user.
          <br />
          You can try again or check your wallet settings.
        </p>
        <DialogClose asChild>
          <button className="mt-2 px-6 py-2 bg-red-500 text-white rounded-lg font-semibold shadow hover:bg-red-600 transition">
            Close
          </button>
        </DialogClose>
      </div>
    </DialogContent>
  </Dialog>
);

export default WalletRejectedDialog;
