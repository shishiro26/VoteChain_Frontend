import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

type ParamFilters = {
  page: number;
  limit: number;
  sortBy: string;
  filter: object | string;
  populate?: string; // Make populate optional
};

export const usePendingUsers = ({
  page = 1,
  limit = 10,
  sortBy = "createdAt:desc",
  filter,
  populate,
}: ParamFilters) => {
  return useQuery({
    queryKey: ["approve-user", { page, limit, sortBy, filter, populate }],
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
      return res.data.results;
    },
    staleTime: 1000 * 60 * 60,
    retry: 1,
  });
};
