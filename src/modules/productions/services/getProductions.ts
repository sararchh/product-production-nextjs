import api from '@/lib/api';
import { ApiResponse } from '@/lib/api-service';
import { Production } from '../types';

export const getProductions = {
  execute: async (): Promise<Production[]> => {
    const { data } = await api.get<ApiResponse<Production[]>>("/records/productions");
    return data.data;
  }
};
