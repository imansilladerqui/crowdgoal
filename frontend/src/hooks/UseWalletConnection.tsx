declare global {
  interface EthereumProvider {
    request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  }
  interface Window {
    ethereum?: EthereumProvider;
  }
}

import { useState, useEffect } from "react";
import { CHILIZ_CHAIN_ID, CHILIZ_RPC_URL } from "../config";
import { useWalletDialogs } from "@/lib/context/WalletDialogContext";
import { setWalletAddress } from "@/hooks/UseWalletStorage";
import {
  ensureCorrectChainOrPrompt,
  requestAccounts,
} from "@/lib/web3/network";
import { normalizeWeb3Error } from "@/lib/web3/errors";

export interface WalletConnection {
  confirmConnectWallet: () => Promise<void>;
  isConnecting: boolean;
  checkWalletRequirements: () => boolean;
}

export const useWalletConnection = (): WalletConnection => {
  const { metamaskDialog, walletErrorDialog, walletRejectedDialog } =
    useWalletDialogs();

  const [isConnecting, setIsConnecting] = useState(false);

  const checkWalletRequirements = () => {
    if (!window.ethereum) {
      metamaskDialog.show();
      return false;
    }
    if (!CHILIZ_CHAIN_ID || !CHILIZ_RPC_URL) {
      walletErrorDialog.setMessage(
        "Network Configuration Error\nNetwork configuration missing. Please contact support."
      );
      walletErrorDialog.setOpen(true);
      return false;
    }
    return true;
  };

  const confirmConnectWallet = async () => {
    setIsConnecting(true);
    try {
      await ensureCorrectChainOrPrompt((msg) => {
        walletErrorDialog.setMessage(msg);
        walletErrorDialog.setOpen(true);
      });
      const account = await requestAccounts();
      await setWalletAddress(account);
    } catch (err) {
      const normalized = normalizeWeb3Error(err);
      if (normalized.code === 4001) {
        walletRejectedDialog.setOpen(true);
        return;
      }
      walletErrorDialog.setMessage(
        `${normalized.title}\n${normalized.message}`
      );
      walletErrorDialog.setOpen(true);
    } finally {
      setIsConnecting(false);
    }
  };

  // Keep local storage in sync if user switches accounts in wallet
  useEffect(() => {
    if (!window.ethereum) return;
    const handler = (accounts: unknown) => {
      if (Array.isArray(accounts) && accounts[0]) {
        setWalletAddress(accounts[0] as string);
      } else {
        setWalletAddress(null);
      }
    };
    // @ts-expect-error: EIP-1193 event typing not declared in our shim
    window.ethereum.on?.("accountsChanged", handler);
    return () => {
      // @ts-expect-error: EIP-1193 event typing not declared in our shim
      window.ethereum?.removeListener?.("accountsChanged", handler);
    };
  }, []);

  return {
    confirmConnectWallet,
    isConnecting,
    checkWalletRequirements,
  };
};
