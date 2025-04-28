import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import { toast } from "sonner";

type LocationType = {
  id: string;
  name: string;
};
type Location = {
  state: LocationType;
  district: LocationType;
  mandal: LocationType;
  constituency: LocationType;
};

type Profile = {
  first_name: string;
  last_name: string;
  phone_number: string;
  status: string;
  email: string;
  profile_image: string;
  location: Location;
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

          const loginResponse = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/v1/auth/login`,
            { wallet_address: account },
            { withCredentials: true }
          );

          if (loginResponse.status === 201) {
            const profileCompleted = loginResponse.data.profile_completed;

            const user = await axios.get(
              `${import.meta.env.VITE_API_URL}/api/v1/auth/user`,
              { withCredentials: true }
            );

            const decodeResponse = await axios.get(
              `${import.meta.env.VITE_API_URL}/api/v1/auth/jwt`,
              { withCredentials: true }
            );

            const { wallet_address, role } = decodeResponse.data;
            console.log("role,", role);
            const {
              first_name,
              last_name,
              phone_number,
              status,
              email,
              profile_image,
              location,
            } = user.data;

            set({
              wallet: wallet_address,
              role,
              profile: {
                first_name,
                last_name,
                phone_number,
                status,
                email,
                profile_image,
                location: {
                  state: location.state,
                  district: location.district,
                  mandal: location.mandal,
                  constituency: location.constituency,
                },
              },
              is_profile_complete: profileCompleted,
            });

            if (profileCompleted) {
              toast.success("Wallet Connected successfully");
            } else {
              toast.warning("Wallet connected. Please complete your profile.");
            }
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
