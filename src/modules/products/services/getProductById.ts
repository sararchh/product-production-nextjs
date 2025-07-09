import api from '@/lib/api';
import { ApiResponse } from '@/lib/api-service';
import { Product } from '../types';

export const getProductById = {
  execute: async (id: string): Promise<Product> => {
    const { data } = await api.get<ApiResponse<Product>>(`/registers/products/${id}`);
    return data.data;
  }
};
