import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProductRequest } from "../types";
import { createProduct } from "../services/createProduct";

export function useCreateProduct() {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (values: ProductRequest) => 
      createProduct.execute(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  return { createProduct: mutateAsync, isLoading: isPending };
}
