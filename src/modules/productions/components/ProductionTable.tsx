import React from "react";
import { Button, Table, TableColumn } from "@/shared/components";
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

  const columns: TableColumn<Production>[] = [
    {
      key: "index",
      label: "ID",
      width: "80px",
      render: (_, index) => (
        <span className="text-gray-900">
          {String(index + 1).padStart(2, '0')}
        </span>
      ),
    },
    {
      key: "actions",
      label: "AÇÕES",
      width: "200px",
      render: (production) => (
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
      ),
    },
    {
      key: "status",
      label: "SITUAÇÃO",
      width: "120px",
      render: (production) => (
        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
          production.active
            ? "bg-blue-100 text-blue-800"
            : "bg-gray-100 text-gray-800"
        }`}>
          {production.active ? "ATIVO" : "INATIVO"}
        </span>
      ),
    },
    {
      key: "product",
      label: "PRODUTO",
      render: (production) => (
        <span className="text-gray-900">{getProductName(production.productId)}</span>
      ),
    },
    {
      key: "production",
      label: "PRODUÇÃO",
      render: (production) => {
        const outOfRange = isQuantityOutOfRange(production.productId, production.quantity);
        
        return (
          <span 
            className={`${
              outOfRange 
                ? "border-2 border-red-500 bg-red-50 text-red-800 px-2 py-1 rounded font-semibold" 
                : "text-gray-900"
            }`}
          >
            {production.quantity} m²
          </span>
        );
      },
    },
  ];

  return (
    <Table<Production>
      data={productions}
      columns={columns}
      isLoading={isLoading || isLoadingProducts}
      error={error}
      emptyMessage="Nenhum apontamento encontrado"
      errorMessage="Erro ao carregar apontamentos"
      rowClassName={(production) => 
        production.active ? "border-l-4 border-blue-500" : ""
      }
    />
  );
};
