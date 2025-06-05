import { useMutation, useQuery } from "@tanstack/react-query";
import { useWallet } from "@/store/useWallet";
import { toast } from "sonner";
import { api } from "@/api/axios";
import { getAuthContract } from "@/utils/getContracts";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;
const ML_API = import.meta.env.VITE_ML_API_URL;

export const useStatesQuery = () => {
  return useQuery({
    queryKey: ["states"],
    queryFn: async () => {
      const res = await api.get(`${API}/api/v1/location/states`);
      return res.data.data;
    },
    staleTime: 1000 * 60 * 60,
    retry: 1,
  });
};

export const useDistrictsQuery = (state_id: string) => {
  return useQuery({
    queryKey: ["districts", state_id],
    queryFn: async () => {
      const res = await api.get(`${API}/api/v1/location/districts/${state_id}`);
      return res.data.data;
    },
    enabled: state_id !== "",
    staleTime: 1000 * 60 * 60,
    retry: 1,
  });
};

export const useMandalsQuery = (districtId?: string | null) => {
  return useQuery({
    queryKey: ["mandals", districtId],
    queryFn: async () => {
      const res = await api.get(`${API}/api/v1/location/mandals/${districtId}`);
      return res.data.data;
    },
    enabled: Boolean(districtId),
    staleTime: 1000 * 60 * 60,
    retry: 1,
  });
};

export const useConstituenciesQuery = (mandalId?: string | null) => {
  return useQuery({
    queryKey: ["constituencies", mandalId],
    queryFn: async () => {
      const res = await api.get(
        `${API}/api/v1/location/constituencies/${mandalId}`
      );
      return res.data.data;
    },
    enabled: Boolean(mandalId),
    staleTime: 1000 * 60 * 60,
    retry: 1,
  });
};

export const useModelMutation = () => {
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await axios.post(`${ML_API}/process_and_verify`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        validateStatus: () => true,
      });
      return res;
    },
  });
};

export const useUpdateProfileMutation = () => {
  const { setIsProfileComplete } = useWallet();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await api.put(`${API}/api/v1/auth/update_profile`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    },
    onSuccess: async (data) => {
      const firstName = data.data.firstName;
      const lastName = data.data.lastName;
      const profileImage = data.data.profileImage;
      const authContract = await getAuthContract();
      const tx = await authContract.register(
        firstName + " " + lastName,
        profileImage
      );
      const receipt = await tx.wait();

      const payload = {
        transactionHash: receipt.hash,
        from: receipt.from,
        to: receipt.to,
        blockNumber: receipt.blockNumber,
        status: receipt.status === 1 ? "SUCCESS" : "FAILED",
        amount: receipt.gasUsed.toString(),
        type: "USER REGISTRATION",
      };

      await api.post("/api/v1/auth/create-transaction", payload);
      setIsProfileComplete(true);
    },
    onError: (error) => {
      console.error("Error updating profile", error);
      toast.error("Error updating profile");
    },
  });
};
