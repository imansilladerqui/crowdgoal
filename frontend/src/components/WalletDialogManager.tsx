import EnableWalletDialog from "@/components/dialogs/EnableWalletDialog";
import MetaMaskDialog from "@/components/dialogs/MetaMaskDialog";
import WalletRejectedDialog from "@/components/dialogs/WalletRejectedDialog";
import WalletErrorDialog from "@/components/dialogs/WalletErrorDialog";
import WalletConsentDrawer from "@/components/dialogs/WalletConsentDrawer";
import LogoutDialog from "@/components/dialogs/LogoutDialog";
import { useWalletConnection } from "@/hooks/UseWalletConnection";
import { setWalletAddress } from "@/hooks/UseWalletStorage";
import { useWalletDialogs } from "@/lib/context/WalletDialogContext";
const WalletDialogManager = () => {
  const {
    enableWalletDialog,
    logoutDialog,
    metamaskDialog,
    walletConsentDialog,
    walletErrorDialog,
    walletRejectedDialog,
  } = useWalletDialogs();
  const { confirmConnectWallet, isConnecting } = useWalletConnection();

  return (
    <>
      <EnableWalletDialog
        open={enableWalletDialog.open}
        onCancel={() => enableWalletDialog.setOpen(false)}
      />
      <MetaMaskDialog
        open={metamaskDialog.open}
        onCancel={() => walletConsentDialog.setOpen(false)}
      />
      <WalletRejectedDialog
        open={walletRejectedDialog.open}
        onCancel={() => walletRejectedDialog.setOpen(false)}
      />
      <WalletErrorDialog
        open={walletErrorDialog.open}
        onOpenChange={walletErrorDialog.setOpen}
        title="Wallet Error"
        message={walletErrorDialog.message}
      />
      <WalletConsentDrawer
        open={walletConsentDialog.open}
        onConfirm={async () => {
          await confirmConnectWallet();
          walletConsentDialog.setOpen(false);
          enableWalletDialog.setOpen(false);
        }}
        onCancel={() => {
          walletConsentDialog.setOpen(false);
          enableWalletDialog.setOpen(false);
        }}
        isConnecting={isConnecting}
      />
      <LogoutDialog
        open={logoutDialog.open}
        onConfirm={async () => {
          await setWalletAddress(null);
          logoutDialog.setOpen(false);
        }}
        onCancel={() => logoutDialog.setOpen(false)}
      />
    </>
  );
};

export default WalletDialogManager;
