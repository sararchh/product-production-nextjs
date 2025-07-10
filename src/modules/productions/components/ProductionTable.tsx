import React from "react";
import { Button } from "@/shared/components";
import { Production } from "../types";
import { useProducts } from "@/modules/products";

export interface ProductionTableProps {
  productions: Production[];
  isLoading?: boolean;
  error?: string | null;
  onToggleStatus: (id: string, active: boolean) => void;
  onViewJustification: (justification: string) => void;
  isUpdatingFlag?: boolean;
}

export const ProductionTable: React.FC<ProductionTableProps> = ({
  productions,
  isLoading = false,
  error = null,
  onToggleStatus,
  onViewJustification,
  isUpdatingFlag = false,
}) => {
  const { data: products, isLoading: isLoadingProducts } = useProducts();

  const getProductName = (productId: string) => {
    const product = products?.find(p => p.id === productId);
    return product?.name || "Produto não encontrado";
  };

  const getProductRange = (productId: string) => {
    const product = products?.find(p => p.id === productId);
    if (!product) return null;
    return { min: product.minProduction, max: product.maxProduction };
  };

  const isQuantityOutOfRange = (productId: string, quantity: number) => {
    const range = getProductRange(productId);
    if (!range) return false;
    return quantity < range.min || quantity > range.max;
  };

  return (
    <div className="overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              AÇÕES
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              SITUAÇÃO
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              PRODUTO
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              PRODUÇÃO
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {isLoading || isLoadingProducts ? (
            <tr>
              <td colSpan={5} className="px-6 py-4 text-center">
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
              </td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan={5} className="px-6 py-4 text-center text-red-600">
                Erro ao carregar apontamentos
              </td>
            </tr>
          ) : productions.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-4 text-center text-gray-700">
                Nenhum apontamento encontrado
              </td>
            </tr>
          ) : (
            productions.map((production, index) => {
              const outOfRange = isQuantityOutOfRange(production.productId, production.quantity);
              return (
                <tr 
                  key={production.id} 
                  className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} ${
                    production.active ? "border-l-4 border-blue-500" : ""
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {String(index + 1).padStart(2, '0')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => onToggleStatus(production.id, production.active)}
                        disabled={isUpdatingFlag}
                        variant="ghost"
                        size="sm"
                        className="text-indigo-600 hover:text-indigo-900 font-medium"
                        title="Alterar Situação"
                      >
                        Alterar Situação
                      </Button>
                      {production.justification && (
                        <Button
                          onClick={() => onViewJustification(production.justification!)}
                          variant="ghost"
                          size="sm"
                          className="text-green-600 hover:text-green-900 font-medium"
                          title="Ver Justificativa"
                        >
                          Ver Justificativa
                        </Button>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      production.active
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {production.active ? "ATIVO" : "INATIVO"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getProductName(production.productId)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span 
                      className={`${
                        outOfRange 
                          ? "border-2 border-red-500 bg-red-50 text-red-800 px-2 py-1 rounded font-semibold" 
                          : "text-gray-900"
                      }`}
                    >
                      {production.quantity} m²
                    </span>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};
