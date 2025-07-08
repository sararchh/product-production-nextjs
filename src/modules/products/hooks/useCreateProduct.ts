import { useMutation } from "@tanstack/react-query";
import { ProductRequest } from "../types";
import { createProduct } from "../services/createProduct";

export function useCreateProduct() {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (values: ProductRequest) => 
      createProduct.execute(values),
  });

  return { createProduct: mutateAsync, isLoading: isPending };
}
