import { useQuery } from "@tanstack/react-query";
import { Production } from "../types";
import { getProductions } from "../services/getProductions";

export function useProductions() {
  const { data, isLoading, isFetching, refetch, error } = useQuery({
    queryKey: ["productions"],
    queryFn: () => getProductions.execute(),
    refetchOnMount: true,
  });

  return { 
    data: (data || []) as Production[], 
    isLoading, 
    isFetching, 
    refetch,
    error
  };
}
