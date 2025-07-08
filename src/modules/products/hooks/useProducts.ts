import { useQuery } from "@tanstack/react-query";
import { Product } from "../types";
import { getProducts } from "../services/getProducts";

export function useProducts() {
  const { data, isLoading, isFetching, refetch, error } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts.execute(),
    refetchOnMount: true,
  });

  return { 
    data: (data || []) as Product[], 
    isLoading, 
    isFetching, 
    refetch,
    error
  };
}
