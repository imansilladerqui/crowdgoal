declare global {
  interface EthereumProvider {
    request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  }
  interface Window {
    ethereum?: EthereumProvider;
  }
}
const CHILIZ_CHAIN_ID = import.meta.env.VITE_CHILIZ_CHAIN_ID;
const CHILIZ_RPC_URL = import.meta.env.VITE_CHILIZ_RPC_URL;

import { useState } from "react";
import { BrowserProvider, Contract } from "ethers";
import { setWalletAddress } from "@/hooks/UseWalletStorage";
import { useWalletDialogs } from "@/lib/context/WalletDialogContext";

export interface WalletConnection {
  confirmConnectWallet: () => Promise<void>;
  isConnecting: boolean;
  checkWalletRequirements: () => boolean;
  sendContract: (
    contractAddress: string,
    contractABI: readonly unknown[],
    method: string,
    args: unknown[]
  ) => Promise<unknown>;
}

export const useWalletConnection = (): WalletConnection => {
  const { metamaskDialog, walletErrorDialog, walletRejectedDialog } =
    useWalletDialogs();

  const sendContract = async (
    contractAddress: string,
    contractABI: readonly unknown[],
    method: string,
    args: unknown[]
  ): Promise<unknown> => {
    if (!window.ethereum) throw new Error("MetaMask not found");
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new Contract(contractAddress, contractABI, signer);
    if (typeof contract[method] !== "function")
      throw new Error("Contract method not found");
    const tx = await contract[method](...args);
    return tx;
  };
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
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: CHILIZ_CHAIN_ID,
            chainName: "Chiliz SpicyNet",
            nativeCurrency: {
              name: "CHZ",
              symbol: "CHZ",
              decimals: 18,
            },
            rpcUrls: [CHILIZ_RPC_URL],
            blockExplorerUrls: ["https://spicy-explorer.chiliz.com/"],
          },
        ],
      });
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      if (!Array.isArray(accounts) || !accounts[0]) {
        walletErrorDialog.setMessage("No accounts returned from wallet.");
        walletErrorDialog.show();
        return;
      }
      setWalletAddress(accounts[0]);
    } catch (err) {
      if (
        typeof err === "object" &&
        err !== null &&
        "code" in err &&
        (err as { code?: number }).code === 4001
      ) {
        walletRejectedDialog.setOpen(true);
      } else if (typeof err === "object" && err !== null && "message" in err) {
        walletErrorDialog.setMessage(
          (err as { message?: string }).message || "Wallet error."
        );
        walletErrorDialog.setOpen(true);
      } else {
        walletErrorDialog.setMessage(
          "Wallet connection failed. Please check your network and try again."
        );
        walletErrorDialog.setOpen(true);
      }
    } finally {
      setIsConnecting(false);
    }
  };

  return {
    confirmConnectWallet,
    isConnecting,
    sendContract,
    checkWalletRequirements,
  };
};
