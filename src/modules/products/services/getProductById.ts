import api from '@/lib/api';
import { ApiResponse } from '@/lib/api-service';
import { Product } from '../types';
import { API_ROUTES } from '@/config';

export const getProductById = {
  execute: async (id: string): Promise<Product> => {
    const { data } = await api.get<ApiResponse<Product>>(API_ROUTES.PRODUCTS.BY_ID(id));
    return data.data;
  }
};
