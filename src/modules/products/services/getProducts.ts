import api from '@/lib/api';
import { ApiResponse } from '@/lib/api-service';
import { Product } from '../types';

export const getProducts = {
  execute: async (): Promise<Product[]> => {
    const { data } = await api.get<ApiResponse<Product[]>>("/records/products");
    return data.data;
  }
};
