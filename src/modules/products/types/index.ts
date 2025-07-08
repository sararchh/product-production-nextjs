export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  minProduction: number;
  maxProduction: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductRequest {
  name: string;
  description?: string;
  price?: number;
  minProduction: number;
  maxProduction: number;
}

export interface ProductFlagRequest {
  id: string;
  active: boolean;
}

export interface ProductsResponse {
  success: boolean;
  data: Product[];
}

export interface ProductResponse {
  success: boolean;
  data: Product;
}
