import api from '@/lib/api';
import { ApiResponse } from '@/lib/api-service';
import { Product, ProductRequest } from '../types';

export const updateProduct = {
  execute: async (id: string, request: ProductRequest): Promise<Product> => {
    const { data } = await api.put<ApiResponse<Product>>(`/registers/products/${id}`, request);
    return data.data;
  }
};
