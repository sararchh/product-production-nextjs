import { useMutation } from "@tanstack/react-query";
import { LoginRequest } from "../types";
import { loginService } from "../services/loginService";

export function useLogin() {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (values: LoginRequest) => 
      loginService.execute(values),
  });

  return { login: mutateAsync, isLoading: isPending };
}

export const useAuth = useLogin;
