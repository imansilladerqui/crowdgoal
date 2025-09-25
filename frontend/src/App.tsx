import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import { WalletConnectionProvider } from "./lib/providers/WalletConnectionProvider";
import CreateProject from "./pages/Createproject";
import WalletDialogManager from "./components/WalletDialogManager";
import { WalletDialogProvider } from "./lib/providers/WalletDialogProvider";

const queryClient = new QueryClient();

const App = () => (
  <WalletDialogProvider>
    <WalletDialogManager />
    <WalletConnectionProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/create" element={<CreateProject />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </WalletConnectionProvider>
  </WalletDialogProvider>
);

export default App;
