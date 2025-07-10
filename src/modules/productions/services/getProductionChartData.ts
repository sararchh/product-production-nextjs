import api from "@/lib/api";
import { ProductionChartData } from "../types";

export const getProductionChartData = async (): Promise<ProductionChartData> => {
  const response = await api.get("/records/productions/chart-data");
  return response.data;
};
