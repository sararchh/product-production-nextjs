import api from '@/lib/api';
import { ApiResponse } from '@/lib/api-service';
import { Product, ProductRequest } from '../types';
import { API_ROUTES } from '@/config';

export const createProduct = {
  execute: async (request: ProductRequest): Promise<Product> => {
    const { data } = await api.post<ApiResponse<Product>>(API_ROUTES.PRODUCTS.BASE, request);
    return data.data;
  }
};
