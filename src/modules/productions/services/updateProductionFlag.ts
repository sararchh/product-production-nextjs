import api from '@/lib/api';
import { ApiResponse } from '@/lib/api-service';
import { ProductionFlagRequest } from '../types';

export const updateProductionFlag = {
  execute: async (request: ProductionFlagRequest): Promise<{ success: boolean }> => {
    const { data } = await api.put<ApiResponse<{ success: boolean }>>("/records/productions/flag", request);
    return data.data;
  }
};
