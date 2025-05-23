import { api } from "@/api/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const API = import.meta.env.VITE_API_URL;

type ParamFilters = {
  page: number;
  limit: number;
  sortBy: string;
  filter: object | string;
  populate?: string;
};

export const usePendingUsers = ({
  page = 1,
  limit = 10,
  sortBy = "createdAt:desc",
  filter,
  populate,
}: ParamFilters) => {
  return useQuery({
    queryKey: ["pending-user", { page, limit, sortBy, filter, populate }],
    queryFn: async () => {
      const res = await api.get(`${API}/api/v1/admin/pending_users`, {
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
    staleTime: 1000 * 60 * 60,
    retry: 1,
  });
};

export const useApproveUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId }: { userId: string }) => {
      const res = await api.put(`${API}/api/v1/admin/approve_user/`, {
        userId: userId,
      });
      return res.data.message;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-user"] });
    },
  });
};

export const useRejectUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      userId,
      reason,
      rejectedFields,
    }: {
      userId: string;
      reason: string;
      rejectedFields: string[];
    }) => {
      const res = await api.put(`${API}/api/v1/admin/reject_user/`, {
        userId: userId,
        reason: reason,
        rejectedFields: rejectedFields,
      });
      return res.data.message;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-user"] });
    },
  });
};
