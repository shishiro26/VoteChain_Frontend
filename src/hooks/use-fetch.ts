import { useLoaderStore } from "@/store/useLoading";

type useFetchParams = {
  isLoading: boolean;
};
export const useFetch = ({ isLoading }: useFetchParams) => {
  const { setIsLoading } = useLoaderStore();

  
};
