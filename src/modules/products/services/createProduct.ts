import api from '@/lib/api';
import { ApiResponse } from '@/lib/api-service';
import { Product, ProductRequest } from '../types';

export const createProduct = {
  execute: async (request: ProductRequest): Promise<Product> => {
    const { data } = await api.post<ApiResponse<Product>>("/records/products", request);
    return data.data;
  }
};
