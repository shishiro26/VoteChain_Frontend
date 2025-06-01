import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import { toast } from "sonner";

type Party = {
  id: string;
  name: string;
  symbol: string;
  logo: string;
  description: string;
  isLeader: boolean;
  joinDate: string;
  pending_count: number | null;
  approved_count: number | null;
  rejected_count: number | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  headquarters: string;
  website: string;
  contact_email: string;
  contact_phone: string;
  founded_on: Date;
  abbreviation: string;
};

type Location = {
  state: string;
  constituency: string;
  constituencyId: string;
  stateId: string;
};

type Profile = {
  id: string;
  walletAddress: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "INCOMPLETE";
  role: "PHEAD" | "ADMIN" | "USER";
  verifiedAt: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  partyId: string | null;
  party: Party | null;
  location: Location;
  profileImage: string;
  dob: string;
};

type WalletState = {
  walletAddress: string | null;
  connecting: boolean;
  isProfileComplete: boolean;
  isProfileApproved: boolean;
  role: string | null;
  profile: Profile | null;
  connectThroughAuth: (walletAddress: string) => Promise<void>;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  setIsProfileComplete: (value: boolean) => void;
  setProfile: (profile: Profile) => void;
};

export const useWallet = create(
  persist<WalletState>(
    (set) => ({
      walletAddress: null,
      connecting: false,
      isProfileComplete: false,
      isProfileApproved: false,
      role: null,
      profile: null,
      setProfile: (profile: Profile) => {
        set({ profile });
      },

      connectThroughAuth: async (walletAddress: string) => {
        set({ connecting: true });
        try {
          const loginResponse = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/v1/auth/login`,
            { walletAddress },
            { withCredentials: true }
          );

          if (loginResponse.status === 200 || loginResponse.status === 201) {
            const decodeResponse = await axios.get(
              `${import.meta.env.VITE_API_URL}/api/v1/auth/jwt`,
              { withCredentials: true }
            );

            const { walletAddress, role, status } = decodeResponse.data.data;
            let profileCompleted = true;
            if (status === "INCOMPLETE") {
              profileCompleted = false;
            }

            let profileApproved = false;
            if (status === "APPROVED") {
              profileApproved = true;
            }

            set({
              walletAddress,
              role,
              isProfileComplete: profileCompleted,
              isProfileApproved: profileApproved,
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
            { walletAddress: account },
            { withCredentials: true }
          );

          if (loginResponse.status === 200 || loginResponse.status === 201) {
            const decodeResponse = await axios.get(
              `${import.meta.env.VITE_API_URL}/api/v1/auth/jwt`,
              { withCredentials: true }
            );

            const { walletAddress, role, status } = decodeResponse.data.data;
            let profileCompleted = true;

            if (status === "INCOMPLETE") {
              profileCompleted = false;
            }

            set({
              walletAddress: walletAddress,
              role,
              isProfileComplete: profileCompleted,
              isProfileApproved: status === "APPROVED",
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
            walletAddress: null,
            isProfileComplete: false,
            role: null,
            profile: null,
          });
          toast.success("Wallet Disconnected");
        }
      },

      setIsProfileComplete: (value: boolean) => {
        set({ isProfileComplete: value });
      },
    }),
    {
      name: "wallet-store",
      partialize: (state) => ({
        walletAddress: state.walletAddress,
        connecting: state.connecting,
        isProfileComplete: state.isProfileComplete,
        isProfileApproved: state.isProfileApproved,
        role: state.role,
        profile: state.profile,
        connectWallet: state.connectWallet,
        disconnectWallet: state.disconnectWallet,
        setIsProfileComplete: state.setIsProfileComplete,
        connectThroughAuth: state.connectThroughAuth,
        setProfile: state.setProfile,
      }),
    }
  )
);
