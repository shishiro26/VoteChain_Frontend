import { useMutation } from "@tanstack/react-query";
import { api } from "@/api/axios";

export const useSearchUser = () => {
  const mutationFn = async ({
    wallet_address,
    status,
    role,
  }: {
    wallet_address: string;
    status: string;
    role: string;
  }) => {
    if (!wallet_address) {
      throw new Error("Wallet address is required");
    }

    const res = await api.get(`/api/v1/auth/search`, {
      params: { wallet_address, status, role },
    });

    return res.data.data;
  };

  return useMutation({ mutationFn });
};
