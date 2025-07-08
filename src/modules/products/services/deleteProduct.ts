import api from '@/lib/api';
import { ApiResponse } from '@/lib/api-service';

export const deleteProduct = {
  execute: async (id: string): Promise<{ success: boolean }> => {
    const { data } = await api.delete<ApiResponse<{ success: boolean }>>(`/registers/products/${id}`);
    return data.data;
  }
};
