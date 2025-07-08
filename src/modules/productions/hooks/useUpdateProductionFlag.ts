import { useMutation } from "@tanstack/react-query";
import { ProductionFlagRequest } from "../types";
import { updateProductionFlag } from "../services/updateProductionFlag";

export function useUpdateProductionFlag() {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (values: ProductionFlagRequest) => 
      updateProductionFlag.execute(values),
  });

  return { updateProductionFlag: mutateAsync, isLoading: isPending };
}
