import { useDialog } from "@/hooks/UseDialogs";
import { WalletDialogContext } from "../context/WalletDialogContext";

export const WalletDialogProvider = ({ children }) => {
  const enableWalletDialog = useDialog();
  const logoutDialog = useDialog();
  const successDialog = useDialog();
  const metamaskDialog = useDialog();
  const walletConsentDialog = useDialog();
  const walletErrorDialog = useDialog();
  const walletRejectedDialog = useDialog();
  const thankYouDialog = useDialog();
  const donationDialog = useDialog();
  const withdrawalSuccessDialog = useDialog();
  const withdrawalErrorDialog = useDialog();
  const refundSuccessDialog = useDialog();
  const refundErrorDialog = useDialog();
  const unexpectedErrorDialog = useDialog();

  return (
    <WalletDialogContext.Provider
      value={{
        enableWalletDialog,
        logoutDialog,
        metamaskDialog,
        walletConsentDialog,
        walletErrorDialog,
        walletRejectedDialog,
        successDialog,
        thankYouDialog,
        donationDialog,
        withdrawalSuccessDialog,
        withdrawalErrorDialog,
        refundSuccessDialog,
        refundErrorDialog,
        unexpectedErrorDialog,
      }}
    >
      {children}
    </WalletDialogContext.Provider>
  );
};
