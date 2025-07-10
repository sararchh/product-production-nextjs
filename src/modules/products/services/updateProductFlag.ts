import api from '@/lib/api';
import { ApiResponse } from '@/lib/api-service';
import { ProductFlagRequest } from '../types';
import { API_ROUTES } from '@/config';

export const updateProductFlag = {
  execute: async (request: ProductFlagRequest): Promise<{ success: boolean }> => {
    const { data } = await api.put<ApiResponse<{ success: boolean }>>(API_ROUTES.PRODUCTS.FLAG, request);
    return data.data;
  }
};
