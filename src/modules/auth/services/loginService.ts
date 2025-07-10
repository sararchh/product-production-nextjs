import api from '@/lib/api';
import { LoginRequest, LoginResponse } from '../types';
import { API_ROUTES } from '@/config';

export const loginService = {
  execute: async (req: LoginRequest): Promise<LoginResponse> => {
    const { data } = await api.post<LoginResponse>(API_ROUTES.AUTH.LOGIN, req);
    return data;
  },
};
