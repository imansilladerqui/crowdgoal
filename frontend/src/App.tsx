import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { WalletConnectionProvider } from "./lib/providers/WalletConnectionProvider";
import WalletDialogManager from "./components/WalletDialogManager";
import { WalletDialogProvider } from "./lib/providers/WalletDialogProvider";
import { Suspense, lazy } from "react";
import { normalizeWeb3Error } from "@/lib/web3/errors";
import ChainReadinessBanner from "@/components/ChainReadinessBanner";

const CreateProject = lazy(() => import("./pages/Createproject"));
const About = lazy(() => import("./pages/About"));

const parseRetryAfterMs = (error: unknown): number | undefined => {
  try {
    // axios-like
    const header1 = (
      error as { response?: { headers?: Record<string, string> } }
    )?.response?.headers?.["retry-after"];
    // fetch-like
    const header2 = (
      error as { headers?: { get?: (k: string) => string | null } }
    )?.headers?.get?.("Retry-After");
    const value = header1 ?? header2;
    if (!value) return undefined;
    const seconds = Number(value);
    if (Number.isFinite(seconds))
      return Math.max(0, Math.floor(seconds * 1000));
    const dateMs = Date.parse(value);
    if (Number.isFinite(dateMs)) return Math.max(0, dateMs - Date.now());
  } catch {}
  return undefined;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Do not retry for user-driven wallet errors; otherwise up to 3 attempts
      retry: (failureCount, error) => {
        if (failureCount >= 3) return false;
        const n = normalizeWeb3Error(error);
        if (n.code === 4001 || n.code === -32002 || n.code === 4902)
          return false;
        return true;
      },
      retryDelay: (attempt, error) => {
        const base = 500 * Math.pow(2, Math.max(0, attempt - 1)); // 0.5s, 1s, 2s
        const cap = 10000; // 10s max
        const jitter = Math.random() * 250; // up to 250ms jitter
        const retryAfter = parseRetryAfterMs(error);
        const computed = Math.min(cap, base + jitter);
        return Math.max(computed, retryAfter ?? 0);
      },
    },
  },
});

const App = () => (
  <WalletDialogProvider>
    <WalletDialogManager />
    <WalletConnectionProvider>
      <QueryClientProvider client={queryClient}>
        <ChainReadinessBanner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route
              path="/create"
              element={
                <Suspense fallback={<div className="p-6">Loading...</div>}>
                  <CreateProject />
                </Suspense>
              }
            />
            <Route
              path="/about"
              element={
                <Suspense fallback={<div className="p-6">Loading...</div>}>
                  <About />
                </Suspense>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </WalletConnectionProvider>
  </WalletDialogProvider>
);

export default App;
