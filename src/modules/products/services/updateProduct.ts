import api from '@/lib/api';
import { ApiResponse } from '@/lib/api-service';
import { Product, ProductRequest } from '../types';
import { API_ROUTES } from '@/config';

export const updateProduct = {
  execute: async (id: string, request: ProductRequest): Promise<Product> => {
    const { data } = await api.put<ApiResponse<Product>>(API_ROUTES.PRODUCTS.BY_ID(id), request);
    return data.data;
  }
};
