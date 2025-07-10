import api from '@/lib/api';
import { ApiResponse } from '@/lib/api-service';
import { API_ROUTES } from '@/config';

export const deleteProduct = {
  execute: async (id: string): Promise<{ success: boolean }> => {
    const { data } = await api.delete<ApiResponse<{ success: boolean }>>(API_ROUTES.PRODUCTS.BY_ID(id));
    return data.data;
  }
};
