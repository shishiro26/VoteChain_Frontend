import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Toaster } from "sonner";
import { BrowserRouter } from "react-router";
import { ThemeProvider } from "./components/shared/theme-provider.tsx";
import { ReactQueryProvider } from "@/ReactQueryProvider.tsx";
import { ConnectivityStatus } from "@/components/shared/connectivity-monitor.tsx";
import { SessionExpiredAlert } from "@/components/shared/custom-alert.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <ReactQueryProvider>
          <Toaster richColors />
          <App />
          <SessionExpiredAlert />
        </ReactQueryProvider>
        <ConnectivityStatus />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
