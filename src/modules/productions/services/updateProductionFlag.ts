import api from '@/lib/api';
import { ApiResponse } from '@/lib/api-service';
import { ProductionFlagRequest } from '../types';
import { API_ROUTES } from '@/config';

export const updateProductionFlag = {
  execute: async (request: ProductionFlagRequest): Promise<{ success: boolean }> => {
    const { data } = await api.put<ApiResponse<{ success: boolean }>>(API_ROUTES.PRODUCTIONS.FLAG, request);
    return data.data;
  }
};
