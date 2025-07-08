import { useMutation } from "@tanstack/react-query";
import { ProductFlagRequest } from "../types";
import { updateProductFlag } from "../services/updateProductFlag";

export function useUpdateProductFlag() {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (values: ProductFlagRequest) => 
      updateProductFlag.execute(values),
  });

  return { updateProductFlag: mutateAsync, isLoading: isPending };
}
