import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProductionFlagRequest } from "../types";
import { updateProductionFlag } from "../services/updateProductionFlag";

export function useUpdateProductionFlag() {
  const queryClient = useQueryClient();
  
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (values: ProductionFlagRequest) => 
      updateProductionFlag.execute(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productions"] });
    },
  });

  return { updateProductionFlag: mutateAsync, isLoading: isPending };
}
