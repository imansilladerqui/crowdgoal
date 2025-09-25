import { createContext, useContext } from "react";

export const WalletDialogContext = createContext(null);

export const useWalletDialogs = () => {
  const ctx = useContext(WalletDialogContext);
  if (!ctx)
    throw new Error(
      "useWalletDialogs must be used within WalletDialogProvider"
    );
  return ctx;
};
