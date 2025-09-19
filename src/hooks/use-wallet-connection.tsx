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

export interface WalletConnection {
  walletAddress: string | null;
  setWalletAddress: (address: string | null) => void;
  showMetaMaskModal: boolean;
  setShowMetaMaskModal: (show: boolean) => void;
  handleConnectWallet: () => void;
  confirmConnectWallet: () => Promise<void>;
  handleLogin: () => void;
  handleLogout: () => void;
  showLogoutDialog: boolean;
  setShowLogoutDialog: (show: boolean) => void;
  confirmLogout: () => void;
  isConnecting: boolean;
  showConsentDrawer: boolean;
  setShowConsentDrawer: (show: boolean) => void;
  showRejectedDialog: boolean;
  setShowRejectedDialog: (show: boolean) => void;
  showNetworkErrorDialog: boolean;
  setShowNetworkErrorDialog: (show: boolean) => void;
  showWalletErrorDialog: boolean;
  setShowWalletErrorDialog: (show: boolean) => void;
  walletErrorMessage: string;
  setWalletErrorMessage: (msg: string) => void;
}

export const useWalletConnection = (): WalletConnection => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [showMetaMaskModal, setShowMetaMaskModal] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showConsentDrawer, setShowConsentDrawer] = useState(false);
  const [showRejectedDialog, setShowRejectedDialog] = useState(false);
  const [showNetworkErrorDialog, setShowNetworkErrorDialog] = useState(false);
  const [showWalletErrorDialog, setShowWalletErrorDialog] = useState(false);
  const [walletErrorMessage, setWalletErrorMessage] = useState("");
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const confirmLogout = () => {
    setWalletAddress(null);
    setShowLogoutDialog(false);
  };

  const handleConnectWallet = () => {
    if (!window.ethereum) {
      setShowMetaMaskModal(true);
      return;
    }
    if (!CHILIZ_CHAIN_ID || !CHILIZ_RPC_URL) {
      setWalletErrorMessage(
        "Network Configuration Error\nNetwork configuration missing. Please contact support."
      );
      setShowNetworkErrorDialog(true);
      return;
    }
    setShowConsentDrawer(true);
  };

  const confirmConnectWallet = async () => {
    setIsConnecting(true);
    setShowConsentDrawer(false);
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
        setWalletErrorMessage("No accounts returned from wallet.");
        setShowWalletErrorDialog(true);
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
        setShowRejectedDialog(true);
      } else if (typeof err === "object" && err !== null && "message" in err) {
        setWalletErrorMessage(
          (err as { message?: string }).message || "Wallet error."
        );
        setShowWalletErrorDialog(true);
      } else {
        setWalletErrorMessage(
          "Wallet connection failed. Please check your network and try again."
        );
        setShowWalletErrorDialog(true);
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const handleLogin = () => {
    handleConnectWallet();
  };

  const handleLogout = () => {
    setShowLogoutDialog(true);
  };

  return {
    walletAddress,
    setWalletAddress,
    showMetaMaskModal,
    setShowMetaMaskModal,
    handleConnectWallet,
    confirmConnectWallet,
    handleLogin,
    handleLogout,
    showLogoutDialog,
    setShowLogoutDialog,
    confirmLogout,
    isConnecting,
    showConsentDrawer,
    setShowConsentDrawer,
    showRejectedDialog,
    setShowRejectedDialog,
    showNetworkErrorDialog,
    setShowNetworkErrorDialog,
    showWalletErrorDialog,
    setShowWalletErrorDialog,
    walletErrorMessage,
    setWalletErrorMessage,
  };
};
