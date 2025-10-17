export type NormalizedError = {
  code?: number | string;
  title: string;
  message: string;
};

export function normalizeWeb3Error(err: unknown): NormalizedError {
  // MetaMask and EIP-1193 style errors commonly include a numeric code
  const code =
    typeof err === "object" && err && "code" in err
      ? (err as { code?: number | string }).code
      : undefined;
  const rawMessage =
    typeof err === "object" && err && "message" in err
      ? (err as { message?: string }).message
      : String(err);

  // User rejected request
  if (code === 4001) {
    return {
      code,
      title: "Request Rejected",
      message: "You rejected the request in your wallet.",
    };
  }
  // Pending request (MetaMask)
  if (code === -32002) {
    return {
      code,
      title: "Action Pending",
      message:
        "A wallet request is already pending. Complete or dismiss it in your wallet.",
    };
  }
  // Unrecognized chain (needs add)
  if (code === 4902) {
    return {
      code,
      title: "Unknown Network",
      message:
        "Your wallet does not recognize this network. Please add it and try again.",
    };
  }
  // ethers-specific action rejected
  if (rawMessage?.toLowerCase().includes("user denied")) {
    return {
      code: 4001,
      title: "Signature Rejected",
      message: "You denied the signature or transaction.",
    };
  }
  // Missing revert data / simulation errors
  if (rawMessage?.toLowerCase().includes("missing revert data")) {
    return {
      title: "Simulation Failed",
      message:
        "The transaction simulation failed. Check inputs and network settings.",
    };
  }
  // Opcode incompatibility
  if (rawMessage?.toLowerCase().includes("invalid opcode: mcopy")) {
    return {
      title: "Node Compatibility",
      message:
        "Your RPC/node EVM version is incompatible with the bytecode. Switch RPC or redeploy for this chain.",
    };
  }
  // Default fallback
  return {
    code,
    title: "Wallet Error",
    message: rawMessage || "An unknown wallet error occurred.",
  };
}
