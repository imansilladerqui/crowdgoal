import { useEffect, useState } from "react";
import { getReadableProvider } from "@/lib/web3/network";
import { CAMPAIGN_FACTORY_ADDRESS } from "@/config";

const ChainReadinessBanner = () => {
  const [message, setMessage] = useState<string>("");
  const [checking, setChecking] = useState<boolean>(true);

  const runCheck = async () => {
    setChecking(true);
    try {
      const provider = await getReadableProvider();
      // RPC reachable check
      await provider.getBlockNumber();
      // Factory code check (if configured)
      if (CAMPAIGN_FACTORY_ADDRESS) {
        const code = await provider.getCode(CAMPAIGN_FACTORY_ADDRESS);
        if (!code || code === "0x") {
          setMessage(
            "Smart contract not found on the connected network. Please verify the factory address and network."
          );
          return;
        }
      } else {
        setMessage("Campaign Factory address is not configured.");
        return;
      }
      setMessage("");
    } catch (err) {
      setMessage(
        "Unable to reach the RPC. Please check your network or RPC URL."
      );
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    runCheck();
  }, []);

  if (checking || !message) return null;

  return (
    <div className="w-full bg-yellow-500/10 border-b border-yellow-500/40 text-yellow-800 dark:text-yellow-300 text-sm">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between gap-4">
        <span>{message}</span>
        <button
          onClick={runCheck}
          className="px-3 py-1 rounded border border-yellow-500/50 hover:bg-yellow-500/10"
        >
          Recheck
        </button>
      </div>
    </div>
  );
};

export default ChainReadinessBanner;
