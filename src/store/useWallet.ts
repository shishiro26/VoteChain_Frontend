import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import { toast } from "sonner";

type Profile = {
  first_name: string;
  last_name: string;
  phone_number: string;
  status: string;
  email: string;
};

type WalletState = {
  wallet: string | null;
  connecting: boolean;
  is_profile_complete: boolean;
  role: string | null;
  profile: Profile | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  setIsProfileComplete: (value: boolean) => void;
};

export const useWallet = create(
  persist<WalletState>(
    (set) => ({
      wallet: null,
      connecting: false,
      is_profile_complete: false,
      role: null,
      profile: null,

      connectWallet: async () => {
        set({ connecting: true });
        if (typeof window.ethereum === "undefined") {
          toast.error("MetaMask not found");
          set({ connecting: false });
          return;
        }

        try {
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });

          const account = accounts[0];
          set({ wallet: account });

          const loginResponse = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/v1/auth/login`,
            { wallet_address: account },
            { withCredentials: true }
          );

          if (loginResponse.status === 201) {
            const profileCompleted = loginResponse.data.profile_completed;
            set({ is_profile_complete: profileCompleted });

            const decodeResponse = await axios.get(
              `${import.meta.env.VITE_API_URL}/api/v1/auth/jwt`,
              { withCredentials: true }
            );

            const {
              first_name,
              last_name,
              wallet_address,
              role,
              phone_number,
              status,
              email,
            } = decodeResponse.data.data;

            if (
              !first_name ||
              !last_name ||
              !phone_number ||
              !status ||
              !email
            ) {
              set({ is_profile_complete: false });
              return;
            }

            console.log(
              "FirstName,lastName,phoneNumber,status,email",
              decodeResponse.data.data
            );
            set({
              wallet: wallet_address,
              role,
              profile: {
                first_name,
                last_name,
                phone_number,
                status,
                email,
              },
            });

            toast.success("Wallet Connected successfully");
          }
        } catch (error) {
          console.error("Wallet connect error:", error);
          toast.error("Failed to connect wallet");
        } finally {
          set({ connecting: false });
        }
      },

      disconnectWallet: async () => {
        try {
          await axios.post(
            `${import.meta.env.VITE_API_URL}/api/v1/auth/logout`,
            {},
            { withCredentials: true }
          );
        } catch (error) {
          console.error("Logout failed:", error);
          toast.error("Logout failed on server");
        } finally {
          set({
            wallet: null,
            is_profile_complete: false,
            role: null,
            profile: null,
          });
          toast.success("Wallet Disconnected");
        }
      },

      setIsProfileComplete: (value: boolean) => {
        set({ is_profile_complete: value });
      },
    }),
    {
      name: "wallet-store",
      partialize: (state) => ({
        wallet: state.wallet,
        connecting: state.connecting,
        is_profile_complete: state.is_profile_complete,
        role: state.role,
        profile: state.profile,
        connectWallet: state.connectWallet,
        disconnectWallet: state.disconnectWallet,
        setIsProfileComplete: state.setIsProfileComplete,
      }),
    }
  )
);
