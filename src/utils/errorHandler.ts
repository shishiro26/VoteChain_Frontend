import { AxiosError } from "axios";
import { toast } from "sonner";

export type ErrorResponse = {
  message: string;
  errors?: string | Record<string, string>;
};

export const handleAxiosError = (
  error: unknown,
  setError?: (msg: string) => void,
  useToast = true
): void => {
  let message = "Something went wrong";
  let details;

  if (
    error &&
    typeof error === "object" &&
    "isAxiosError" in error &&
    error.isAxiosError
  ) {
    const axiosError = error as AxiosError<ErrorResponse>;
    message = axiosError.response?.data?.message || message;
    details = axiosError.response?.data?.errors;
  }

  if (details) {
    console.error("Details:", details);
  }

  if (useToast) {
    toast.error(message);
  }

  if (setError) {
    setError(message);
  }

  console.error("Global Error Handler:", message);
};
