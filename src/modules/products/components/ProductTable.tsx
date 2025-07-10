import React from "react";
import { Button, Table, TableColumn } from "@/shared/components";
import { Product } from "../types";

export interface ProductTableProps {
  products: Product[];
  isLoading?: boolean;
  error?: string | null;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onToggleStatus: (id: string, active: boolean) => void;
  isUpdatingFlag?: boolean;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  isLoading = false,
  error = null,
  onEdit,
  onDelete,
  onToggleStatus,
  isUpdatingFlag = false,
}) => {
  const columns: TableColumn<Product>[] = [
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
      width: "120px",
      render: (product) => (
        <div className="flex space-x-2">
          <Button 
            onClick={() => onEdit(product)}
            variant="ghost"
            size="sm"
            className="text-blue-600 hover:text-blue-800 p-1"
            title="Editar produto"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </Button>
          <Button 
            onClick={() => onDelete(product)}
            variant="ghost"
            size="sm"
            className="text-red-600 hover:text-red-800 p-1"
            title="Excluir produto"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </Button>
        </div>
      ),
    },
    {
      key: "status",
      label: "SITUAÇÃO",
      width: "120px",
      render: (product) => (
        <Button
          onClick={() => onToggleStatus(product.id, product.active)}
          disabled={isUpdatingFlag}
          variant="ghost"
          size="sm"
          className={`px-3 py-1 text-xs font-medium rounded-full ${
            product.active
              ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
          }`}
        >
          {product.active ? "ATIVO" : "INATIVO"}
        </Button>
      ),
    },
    {
      key: "name",
      label: "PRODUTO",
      render: (product) => (
        <span className="text-gray-900">{product.name}</span>
      ),
    },
    {
      key: "production",
      label: "PADRÃO PRODUÇÃO",
      render: (product) => (
        <span className="text-gray-900">
          Min. {product.minProduction || 0} Max. {product.maxProduction || 0}
        </span>
      ),
    },
  ];

  return (
    <Table<Product>
      data={products}
      columns={columns}
      isLoading={isLoading}
      error={error}
      emptyMessage="Nenhum produto encontrado"
      errorMessage="Erro ao carregar produtos"
      rowClassName={(product) => 
        product.active ? "border-l-4 border-blue-500" : ""
      }
    />
  );
};
