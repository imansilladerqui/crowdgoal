import {
  Dialog,
  DialogClose,
  DialogTitle,
  DialogContent,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Wallet } from "lucide-react";
import { Button } from "../ui/button";
import { useWalletConnection } from "@/hooks/UseWalletConnection";
import { useWalletDialogs } from "@/lib/context/WalletDialogContext";

interface EnableWalletDialogProps {
  open: boolean;
  onCancel: () => void;
}

const EnableWalletDialog = ({ open, onCancel }: EnableWalletDialogProps) => {
  const { walletConsentDialog } = useWalletDialogs();
  const { isConnecting } = useWalletConnection();
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onCancel()}>
      <DialogContent>
        <VisuallyHidden>
          <DialogTitle>Create Project</DialogTitle>
        </VisuallyHidden>
        <div className="flex flex-col items-center text-center gap-4">
          <Wallet className="h-10 w-10 text-purple-600 mb-2" />
          <h2 className="text-2xl font-bold">Wallet Required</h2>
          <p className="text-foreground/70 mb-2">
            To create a project, you must connect your wallet.
            <br />
            Please connect your wallet to continue.
          </p>
          <div className="flex gap-2 w-full mt-4">
            <DialogClose asChild>
              <button
                className="flex-1 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold shadow hover:bg-gray-300 transition"
                onClick={onCancel}
                disabled={isConnecting}
              >
                Cancel
              </button>
            </DialogClose>
            <Button
              variant="glow"
              onClick={() => walletConsentDialog.setOpen(true)}
              className="flex-1"
              disabled={isConnecting}
            >
              Connect Wallet
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnableWalletDialog;
