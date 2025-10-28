import EnableWalletDialog from "@/components/dialogs/EnableWalletDialog";
import MetaMaskDialog from "@/components/dialogs/MetaMaskDialog";
import WalletRejectedDialog from "@/components/dialogs/WalletRejectedDialog";
import WalletErrorDialog from "@/components/dialogs/WalletErrorDialog";
import WalletConsentDrawer from "@/components/dialogs/WalletConsentDrawer";
import LogoutDialog from "@/components/dialogs/LogoutDialog";
import SuccessDialog from "@/components/dialogs/SuccessDialog";
import { ThankYouDialog } from "@/components/dialogs/ThankYouDialog";
import { DonationDialog } from "@/components/DonationDialog";
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
    successDialog,
    thankYouDialog,
    donationDialog,
    refundSuccessDialog,
    refundErrorDialog
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
        onCancel={() => metamaskDialog.setOpen(false)}
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
      <SuccessDialog
        open={successDialog.open}
        onOpenChange={successDialog.setOpen}
        title={successDialog.message?.title}
        message={successDialog.message?.message}
      />
      <ThankYouDialog
        open={thankYouDialog.open}
        onOpenChange={thankYouDialog.setOpen}
        campaignTitle={thankYouDialog.message?.campaignTitle}
        donationAmount={thankYouDialog.message?.donationAmount}
      />
      <DonationDialog
        open={donationDialog.open}
        onOpenChange={donationDialog.setOpen}
        campaignId={donationDialog.message?.campaignId}
        campaignTitle={donationDialog.message?.campaignTitle}
        onSuccess={(amount) => {
          thankYouDialog.setMessage({
            campaignTitle: donationDialog.message?.campaignTitle,
            donationAmount: amount,
          });
          thankYouDialog.show();
        }}
      />
      <WalletErrorDialog
        open={refundSuccessDialog.open}
        onOpenChange={refundSuccessDialog.setOpen}
        title="Refund Success"
        message={refundSuccessDialog.message}
      />
      <WalletErrorDialog
        open={refundErrorDialog.open}
        onOpenChange={refundErrorDialog.setOpen}
        title="Refund Error"
        message={refundErrorDialog.message}
      />
    </>
  );
};

export default WalletDialogManager;
