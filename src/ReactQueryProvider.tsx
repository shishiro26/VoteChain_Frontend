import React from "react";
import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
  onlineManager,
} from "@tanstack/react-query";
import { useConnectivityStore } from "./store/useConnectivity.ts";
import { toast } from "sonner";
import { handleAxiosError } from "./utils/errorHandler.ts";

onlineManager.setEventListener((setOnline) => {
  const handleOnline = () => {
    setOnline(true);
    useConnectivityStore.getState().setOnline();
  };

  const handleOffline = () => {
    setOnline(false);
    useConnectivityStore.getState().setOffline();
  };

  window.addEventListener("online", handleOnline);
  window.addEventListener("offline", handleOffline);

  return () => {
    window.removeEventListener("online", handleOnline);
    window.removeEventListener("offline", handleOffline);
  };
});

export const ShowToast = (
  summary: string,
  detail: string,
  duration: number = 5000,
  type: "info" | "success" | "error" | "warning" = "info"
) => {
  const message = `${summary}: ${detail}`;
  toast[type](message, { duration });
};

export function ReactQueryProvider({ children }: React.PropsWithChildren) {
  const queryClient = new QueryClient({
    mutationCache: new MutationCache({
      onError: (error: unknown) => {
        const err = error as Error;
        console.error(err);
      },
    }),
    defaultOptions: {
      mutations: {
        onError: (error) => handleAxiosError(error),
      },
      queries: {
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
