import api from '@/lib/api';
import { ApiResponse } from '@/lib/api-service';
import { Production } from '../types';
import { API_ROUTES } from '@/config';

export const getProductions = {
  execute: async (): Promise<Production[]> => {
    const { data } = await api.get<ApiResponse<Production[]>>(API_ROUTES.PRODUCTIONS.BASE);
    return data.data;
  }
};
