import { useMutation } from "@tanstack/react-query";
import { verifyTokenService } from "../services/verifyTokenService";

export function useVerifyToken() {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () => 
      verifyTokenService.execute(),
  });

  return { verifyToken: mutateAsync, isLoading: isPending };
}
