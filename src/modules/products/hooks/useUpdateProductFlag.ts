import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProductFlagRequest } from "../types";
import { updateProductFlag } from "../services/updateProductFlag";

export function useUpdateProductFlag() {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (values: ProductFlagRequest) => 
      updateProductFlag.execute(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  return { updateProductFlag: mutateAsync, isLoading: isPending };
}
