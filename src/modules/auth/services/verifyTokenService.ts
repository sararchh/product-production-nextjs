import api from '@/lib/api';

export type VerifyTokenResponse = {
  valid: boolean;
};

export const verifyTokenService = {
  execute: async (): Promise<VerifyTokenResponse> => {
    const { data } = await api.get<VerifyTokenResponse>("/auth/verify");
    return data;
  }
};
