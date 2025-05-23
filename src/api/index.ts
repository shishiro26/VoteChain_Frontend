import axios from "axios";
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
      partyName: string;
      partySymbol: string;
      userId: string;
      linkExpiry: number;
    }) => {
      const res = await api.post(
        `${API}/api/v1/admin/create-party`,
        {
          partyName: payload.partyName,
          partySymbol: payload.partySymbol,
          userId: payload.userId,
          linkExpiry: payload.linkExpiry,
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
      walletAddress,
    }: {
      token: string;
      walletAddress: string;
    }) => {
      const res = await api.post(
        `${API}/api/v1/party/verify/?walletAddress=${walletAddress}&token=${token}`
      );

      return res.data.data;
    },
  });
};

export const useGetPartyDetailsByToken = (token: string) => {
  const isValidToken = !!token;

  return useQuery({
    queryKey: ["party-details", token],
    queryFn: async () => {
      try {
        const res = await api.get(
          `${API}/api/v1/party/details_by_token?token=${token}`
        );
        return res.data.data;
      } catch (err) {
        if (axios.isAxiosError(err)) {
          const message =
            err.response?.data?.message || "Failed to fetch party details";
          throw new Error(message);
        }
        throw err;
      }
    },
    enabled: isValidToken,
    initialData: null,
    retry: false,
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

export const useGetPartyDetailsByWalletId = (
  partyId: string,
  walletAddress: string
) => {
  const isValidPartyId = partyId !== undefined && partyId !== "";
  const isValidWalletAddress =
    walletAddress !== undefined && walletAddress !== "";
  return useQuery({
    queryKey: ["party-details-by-wallet", partyId, walletAddress],
    queryFn: async () => {
      const res = await api.get(`${API}/api/v1/party/get_party/`, {
        params: {
          walletAddress,
          partyId,
        },
      });
      if (res.status !== 200) {
        throw new Error(res.data);
      }
      return res.data.data;
    },
    enabled: isValidPartyId && isValidWalletAddress,
  });
};

export const useGetProfileDetailsByWalletId = (
  walletAddress: string,
  isProfileComplete: boolean,
  profile: boolean
) => {
  return useQuery({
    queryKey: ["profile", walletAddress],
    queryFn: async () => {
      const res = await api.get(`${API}/api/v1/auth/user/`, {
        params: {
          walletAddress,
        },
      });
      console.log("res", res.data);
      return res.data.data;
    },
    enabled: !!walletAddress && isProfileComplete && !profile,
  });
};

export const useGetPartyMembers = (
  {
    page = 1,
    limit = 10,
    sortBy = "createdAt:desc",
    filter = {},
    populate,
  }: ParamFilters = {
    page: 1,
    limit: 10,
    sortBy: "createdAt:desc",
    filter: {},
  }
) => {
  return useQuery({
    queryKey: [
      "party-members",
      page,
      limit,
      sortBy,
      JSON.stringify(filter),
      populate,
    ],
    queryFn: async () => {
      const res = await api.get(`${API}/api/v1/party/get_members`, {
        params: {
          page,
          limit,
          sortBy,
          filter,
          populate,
        },
      });
      return res.data.data;
    },
  });
};

export const useJoinPartyMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { partyId: string }) => {
      const res = await api.post(
        `${API}/api/v1/party/join-party`,
        {
          partyId: payload.partyId,
        },
        {
          withCredentials: true,
        }
      );

      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["party-members"] });
    },
  });
};

export const useApprovePartyMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { partyId: string; userId: string }) => {
      const res = await api.post(`${API}/api/v1/party/approve-user`, {
        partyId: payload.partyId,
        userId: payload.userId,
      });

      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["party-members"] });
    },
  });
};

export const useRejectPartyMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { partyId: string; userId: string }) => {
      const res = await api.post(`${API}/api/v1/party/reject-user`, {
        partyId: payload.partyId,
        userId: payload.userId,
      });

      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["party-members"] });
    },
  });
};
