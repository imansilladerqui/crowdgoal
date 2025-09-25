import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogClose,
} from "@/components/ui/dialog";
import { Wallet } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

const MetaMaskDialog = ({
  open,
  onCancel,
}: {
  open: boolean;
  onCancel: () => void;
}) => (
  <Dialog open={open} onOpenChange={(v) => !v && onCancel()}>
    <DialogContent>
      <VisuallyHidden>
        <DialogTitle>Metamask</DialogTitle>
      </VisuallyHidden>
      <div className="flex flex-col items-center text-center gap-4">
        <Wallet className="h-10 w-10 text-primary mb-2" />
        <h2 className="text-2xl font-bold">MetaMask Not Detected</h2>
        <p className="text-foreground/70 mb-2">
          To connect your wallet, please install the MetaMask extension in your
          browser.
        </p>
        <DialogClose asChild>
          <button
            onClick={onCancel}
            className="mt-2 px-6 py-2 bg-primary text-white rounded-lg font-semibold shadow hover:bg-primary/80 transition"
          >
            Close
          </button>
        </DialogClose>
      </div>
    </DialogContent>
  </Dialog>
);

export default MetaMaskDialog;
