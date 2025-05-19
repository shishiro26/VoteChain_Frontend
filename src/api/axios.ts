import { showSessionExpiredAlert } from "@/utils/session-expired-handler";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;
export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      await showSessionExpiredAlert();
    }
    return Promise.reject(error);
  }
);

