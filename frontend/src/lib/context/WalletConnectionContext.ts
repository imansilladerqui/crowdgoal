import { createContext, useContext } from "react";
import { WalletConnection } from "@/hooks/UseWalletConnection";

export const WalletConnectionContext = createContext<
  WalletConnection | undefined
>(undefined);

export const useWallet = () => {
  const context = useContext(WalletConnectionContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletConnectionProvider");
  }
  return context;
};
