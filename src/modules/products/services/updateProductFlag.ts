import api from '@/lib/api';
import { ApiResponse } from '@/lib/api-service';
import { ProductFlagRequest } from '../types';

export const updateProductFlag = {
  execute: async (request: ProductFlagRequest): Promise<{ success: boolean }> => {
    const { data } = await api.put<ApiResponse<{ success: boolean }>>("/records/products/flag", request);
    return data.data;
  }
};
