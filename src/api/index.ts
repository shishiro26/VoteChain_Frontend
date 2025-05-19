import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "./axios";

const API = import.meta.env.VITE_API_URL;
type ParamFilters = {
  page: number;
  limit: number;
  sortBy: string;
  filter?: object | string;
  populate?: string;
};

export const useCreatePartyMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      party_name: string;
      party_symbol: string;
      user_id: string;
      link_expiry: number;
    }) => {
      const res = await api.post(
        `${API}/api/v1/admin/create-party`,
        {
          party_name: payload.party_name,
          party_symbol: payload.party_symbol,
          user_id: payload.user_id,
          link_expiry: payload.link_expiry,
        },
        {
          withCredentials: true,
        }
      );

      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["party-links"] });
    },
  });
};

export const useGetAllPartiesQuery = ({
  page = 1,
  limit = 10,
  sortBy = "createdAt:desc",
  filter = {},
  populate,
}: ParamFilters) => {
  return useQuery({
    queryKey: ["party-links"],
    queryFn: async () => {
      const res = await api.get(`${API}/api/v1/party/get_parties`, {
        params: {
          page,
          limit,
          sortBy,
          populate,
          filter,
        },
      });
      return res.data.data;
    },
  });
};

export const useVerifyEmailToken = () => {
  return useMutation({
    mutationFn: async ({
      token,
      wallet_address,
    }: {
      token: string;
      wallet_address: string;
    }) => {
      const res = await api.post(
        `${API}/api/v1/party/verify/?wallet_address=${wallet_address}&token=${token}`
      );

      return res.data.data;
    },
  });
};

export const useGetPartyDetailsByToken = (token: string) => {
  const isValidToken = token !== undefined && token !== "" && token !== null;

  return useQuery({
    queryKey: ["party-details", token],
    queryFn: async () => {
      const res = await api.get(
        `${API}/api/v1/party/details_by_token?token=${token}`
      );
      return res.data.data;
    },
    enabled: isValidToken,
    initialData: null,
  });
};

export const useUpdatePartyMutation = (token: string) => {
  const queryClient = useQueryClient();
  const isValidToken = token !== undefined && token !== "" && token !== null;

  if (!isValidToken) {
    throw new Error("Token is required to update party");
  }

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await api.post(
        `${API}/api/v1/party/update?token=${token}`,
        formData
      );
      if (res.status !== 200) {
        throw new Error(res.data.errors?.[0] || "Failed to update party");
      }
      return res.data.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["party-links"] });
    },
  });
};
