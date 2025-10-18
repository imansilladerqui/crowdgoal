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
      }}
    >
      {children}
    </WalletDialogContext.Provider>
  );
};
