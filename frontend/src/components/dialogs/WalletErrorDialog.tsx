import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogClose,
} from "@/components/ui/dialog";
import { Wallet } from "lucide-react";
import React from "react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface WalletErrorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  message: string;
  color?: string;
}

const WalletErrorDialog: React.FC<WalletErrorDialogProps> = ({
  open,
  onOpenChange,
  title = "Wallet Error",
  message,
  color = "text-red-500",
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <VisuallyHidden>
        <DialogTitle>Error</DialogTitle>
      </VisuallyHidden>
      <div className="flex flex-col items-center text-center gap-4">
        <Wallet className={`h-10 w-10 ${color} mb-2`} />
        <h2 className={`text-2xl font-bold ${color}`}>{title}</h2>
        <p className="text-foreground/70 mb-2">{message}</p>
        <DialogClose asChild>
          <button
            className={`mt-2 px-6 py-2 bg-red-500 text-white rounded-lg font-semibold shadow hover:bg-red-600 transition`}
          >
            Close
          </button>
        </DialogClose>
      </div>
    </DialogContent>
  </Dialog>
);

export default WalletErrorDialog;
