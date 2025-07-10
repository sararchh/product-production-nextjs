export interface Production {
  id: string;
  productId: string;
  quantity: number;
  productionDate: string;
  active: boolean;
  justification?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductionRequest {
  productId: string;
  quantity: number;
  productionDate: string;
  justification?: string;
}

export interface ProductionFlagRequest {
  id: string;
  active: boolean;
}

export interface ProductionsResponse {
  success: boolean;
  data: Production[];
}

export interface ProductionResponse {
  success: boolean;
  data: Production;
}

export interface ProductionChartDataPoint {
  date: string;
  quantity: number;
  productName: string;
  minProduction: number;
  maxProduction: number;
  status: 'low' | 'normal' | 'high';
}

export interface ProductionChartData {
  success: boolean;
  data: ProductionChartDataPoint[];
}
