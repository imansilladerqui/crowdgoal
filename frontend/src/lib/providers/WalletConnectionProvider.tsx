import React from "react";
import { useWalletConnection } from "@/hooks/UseWalletConnection";
import { WalletConnectionContext } from "../context/WalletConnectionContext";

export const WalletConnectionProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const wallet = useWalletConnection();
  return (
    <WalletConnectionContext.Provider value={wallet}>
      {children}
    </WalletConnectionContext.Provider>
  );
};
