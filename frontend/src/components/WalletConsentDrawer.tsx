import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import React from "react";

interface WalletConsentDrawerProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isConnecting: boolean;
}

const WalletConsentDrawer: React.FC<WalletConsentDrawerProps> = ({
  open,
  onConfirm,
  onCancel,
  isConnecting,
}) => (
  <Dialog open={open} onOpenChange={(v) => !v && onCancel()}>
    <DialogContent>
      <div className="flex flex-col items-center text-center gap-4">
        <Wallet className="h-10 w-10 text-primary mb-2" />
        <h2 className="text-2xl font-bold">Connect Wallet</h2>
        <p className="text-foreground/70 mb-2">
          Connecting your wallet will allow CrowdGoal to view your public
          address and request network switching to{" "}
          <span className="font-semibold text-primary">Chiliz SpicyNet</span>.
          <br />
          <span className="text-red-500 font-semibold">
            Never share your private key.
          </span>
        </p>
        <div className="flex flex-row gap-4 justify-center mt-2 w-full">
          <Button
            variant="glow"
            onClick={onConfirm}
            disabled={isConnecting}
            className="flex-1"
          >
            {isConnecting ? (
              <span className="animate-spin mr-2 h-4 w-4 border-2 border-t-transparent border-foreground rounded-full inline-block" />
            ) : null}
            Proceed
          </Button>
          <DialogClose asChild>
            <Button
              variant="wallet"
              onClick={onCancel}
              disabled={isConnecting}
              className="flex-1"
            >
              Cancel
            </Button>
          </DialogClose>
        </div>
      </div>
    </DialogContent>
  </Dialog>
);

export default WalletConsentDrawer;
