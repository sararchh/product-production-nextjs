import api from '@/lib/api';
import { ApiResponse } from '@/lib/api-service';
import { Production, ProductionRequest } from '../types';
import { API_ROUTES } from '@/config';

export const createProduction = {
  execute: async (request: ProductionRequest): Promise<Production> => {
    const { data } = await api.post<ApiResponse<Production>>(API_ROUTES.PRODUCTIONS.BASE, request);
    return data.data;
  }
};
