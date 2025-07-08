import api from '@/lib/api';
import { ApiResponse } from '@/lib/api-service';
import { Production, ProductionRequest } from '../types';

export const createProduction = {
  execute: async (request: ProductionRequest): Promise<Production> => {
    const { data } = await api.post<ApiResponse<Production>>("/records/productions", request);
    return data.data;
  }
};
