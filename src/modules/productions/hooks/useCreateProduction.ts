import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProductionRequest } from "../types";
import { createProduction } from "../services/createProduction";

export function useCreateProduction() {
  const queryClient = useQueryClient();
  
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (values: ProductionRequest) => 
      createProduction.execute(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productions"] });
    },
  });

  return { createProduction: mutateAsync, isLoading: isPending };
}
