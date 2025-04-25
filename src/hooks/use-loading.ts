import { useLoaderStore } from "@/store/useLoading";

export const useLoading = () => {
  const { isLoading, setIsLoading } = useLoaderStore();

  return {
    isLoading,
    setIsLoading,
  };
};
