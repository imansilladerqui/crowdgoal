import { BrowserProvider, JsonRpcProvider } from "ethers";
import { CHILIZ_CHAIN_ID, CHILIZ_RPC_URL } from "@/config";

export const toHexChainId = (value: unknown): string => {
  if (typeof value === "string") {
    if (value.startsWith("0x") || value.startsWith("0X")) return value;
    const asInt = Number.parseInt(value, 10);
    if (!Number.isFinite(asInt) || asInt <= 0) {
      throw new Error("Invalid chain id; must be positive integer or 0x-hex.");
    }
    return "0x" + asInt.toString(16);
  }
  if (typeof value === "number") {
    if (!Number.isFinite(value) || value <= 0) {
      throw new Error("Invalid chain id number; must be > 0.");
    }
    return "0x" + value.toString(16);
  }
  throw new Error("Invalid chain id type.");
};

export async function getReadableProvider() {
  if (typeof window !== "undefined" && window.ethereum) {
    try {
      return new BrowserProvider(window.ethereum);
    } catch {
      // fall back to RPC below
    }
  }
  if (!CHILIZ_RPC_URL) throw new Error("CHILIZ_RPC_URL not configured");
  return new JsonRpcProvider(CHILIZ_RPC_URL);
}

export async function ensureCorrectChainOrPrompt(
  onPending?: (message: string) => void
) {
  if (!window.ethereum) throw new Error("Wallet not available");
  const chainIdHex = toHexChainId(CHILIZ_CHAIN_ID);
  const currentChainId = (await window.ethereum.request({
    method: "eth_chainId",
  })) as string;

  if (currentChainId?.toLowerCase() === chainIdHex.toLowerCase()) return;

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: chainIdHex }],
    });
  } catch (switchErr) {
    if (
      typeof switchErr === "object" &&
      switchErr !== null &&
      "code" in switchErr &&
      (switchErr as { code?: number }).code === 4902
    ) {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: chainIdHex,
            chainName: "Chiliz SpicyNet",
            nativeCurrency: { name: "CHZ", symbol: "CHZ", decimals: 18 },
            rpcUrls: [CHILIZ_RPC_URL],
            blockExplorerUrls: ["https://spicy-explorer.chiliz.com/"],
          },
        ],
      });
    } else if (
      typeof switchErr === "object" &&
      switchErr !== null &&
      "code" in switchErr &&
      (switchErr as { code?: number }).code === -32002
    ) {
      onPending?.(
        "A wallet request is already pending. Complete or dismiss it in your wallet."
      );
      throw switchErr;
    } else {
      throw switchErr;
    }
  }
}

export async function requestAccounts(): Promise<string> {
  if (!window.ethereum) throw new Error("Wallet not available");
  const accounts = (await window.ethereum.request({
    method: "eth_requestAccounts",
  })) as unknown;
  if (Array.isArray(accounts) && accounts[0]) return accounts[0] as string;
  throw new Error("No accounts returned from wallet.");
}
