import api from '@/lib/api';
import { ApiResponse } from '@/lib/api-service';
import { Product } from '../types';
import { API_ROUTES } from '@/config';

export const getProducts = {
  execute: async (): Promise<Product[]> => {
    const { data } = await api.get<ApiResponse<Product[]>>(API_ROUTES.PRODUCTS.BASE);
    return data.data;
  }
};
