import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

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
      const res = await axios.get(`${API}/api/v1/admin/pending_users`, {
        params: {
          page,
          limit,
          sortBy,
          filter,
          populate,
        },
        withCredentials: true,
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
      const res = await axios.put(
        `${API}/api/v1/admin/approve_user/`,
        {
          user_id: userId,
        },
        {
          withCredentials: true,
        }
      );
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
    }: {
      userId: string;
      reason: string;
    }) => {
      const res = await axios.put(
        `${API}/api/v1/admin/reject_user/`,
        {
          user_id: userId,
          reason: reason,
        },
        {
          withCredentials: true,
        }
      );
      return res.data.message;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-user"] });
    },
  });
};
