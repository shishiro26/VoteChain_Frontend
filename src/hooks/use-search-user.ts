import { useMutation } from "@tanstack/react-query";
import { api } from "@/api/axios";

export const useSearchUser = () => {
  const mutationFn = async ({
    walletAddress,
    status,
    role,
    inParty = "true",
  }: {
    walletAddress: string;
    status: string;
    role: string;
    inParty?: string;
  }) => {
    if (!walletAddress) {
      throw new Error("Wallet address is required");
    }

    const res = await api.get(`/api/v1/auth/search`, {
      params: { walletAddress, status, role, inParty },
    });

    return res.data.data;
  };

  return useMutation({ mutationFn });
};
