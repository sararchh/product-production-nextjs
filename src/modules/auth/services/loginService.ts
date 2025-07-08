import api from '@/lib/api';
import { LoginRequest, LoginResponse } from '../types';

export const loginService = {
  execute: async (req: LoginRequest): Promise<LoginResponse> => {
    const { data } = await api.post<LoginResponse>("/login", req);
    return data;
  }
};
