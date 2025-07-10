import api from '@/lib/api';
import { ProductionChartData } from '../types';
import { API_ROUTES } from '@/config';

export const getProductionChartData = async (): Promise<ProductionChartData> => {
  const response = await api.get(API_ROUTES.PRODUCTIONS.CHART_DATA);
  return response.data;
};
