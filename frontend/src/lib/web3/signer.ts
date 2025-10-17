import { getReadableProvider } from "@/lib/web3/network";

export async function getWritableSigner() {
  const provider = await getReadableProvider();
  if (
    "getSigner" in provider &&
    typeof (provider as { getSigner?: () => Promise<unknown> }).getSigner ===
      "function"
  ) {
    return await (
      provider as { getSigner: () => Promise<unknown> }
    ).getSigner();
  }
  throw new Error("Writable provider not available; connect a wallet.");
}
