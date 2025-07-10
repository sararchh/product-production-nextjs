import { useQuery } from "@tanstack/react-query";
import { getProductionChartData } from "../services/getProductionChartData";

export const useProductionChartData = () => {
  return useQuery({
    queryKey: ["production-chart-data"],
    queryFn: getProductionChartData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
