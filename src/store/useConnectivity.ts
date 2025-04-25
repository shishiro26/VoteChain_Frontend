import { create } from "zustand";

interface ConnectivityState {
  isOnline: boolean;
  isReconnecting: boolean;
  visible: boolean;
  setOnline: () => void;
  setOffline: () => void;
}

export const useConnectivityStore = create<ConnectivityState>((set) => ({
  isOnline: navigator.onLine,
  isReconnecting: false,
  visible: !navigator.onLine,

  setOnline: () => {
    set({ isReconnecting: true });
    setTimeout(() => {
      set({ isOnline: true });
      setTimeout(() => {
        set({ isReconnecting: false, visible: false });
      }, 2000);
    }, 1500);
  },

  setOffline: () => {
    set({ isOnline: false, visible: true });
  },
}));
