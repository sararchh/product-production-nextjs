import { useMutation } from "@tanstack/react-query";
import { ProductionRequest } from "../types";
import { createProduction } from "../services/createProduction";

export function useCreateProduction() {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (values: ProductionRequest) => 
      createProduction.execute(values),
  });

  return { createProduction: mutateAsync, isLoading: isPending };
}
