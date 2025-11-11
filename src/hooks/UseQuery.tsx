import { useQuery } from "@tanstack/react-query";
import AxiosInstance from "../config/axios.config";
import type { AxiosRequestConfig } from "axios";
interface UseQueryProps {
  queryKey: string[];
  url: string;
  config?: AxiosRequestConfig;
}
const UseQuery = ({ queryKey, url, config }: UseQueryProps) => {
  return useQuery({
    queryKey: queryKey,
    queryFn: async () => await AxiosInstance.get(url, config),
    staleTime: 5 * 60 * 1000,
  });
};

export default UseQuery;
