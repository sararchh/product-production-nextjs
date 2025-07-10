import React, { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Button, Select, ConfirmDialog } from "@/shared/components";
import { 
  useProducts, 
  useDeleteProduct, 
  useUpdateProductFlag, 
  Product 
} from "../";
import { ProductTable } from "./ProductTable";
import { ROUTES } from "@/config";

export interface ProductListProps {
  className?: string;
}

export const ProductList: React.FC<ProductListProps> = ({ 
  className = "" 
}) => {
  const router = useRouter();
  const [situationFilter, setSituationFilter] = useState<"all" | "active" | "inactive">("all");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const { data: products, isLoading, error } = useProducts();
  const { deleteProduct, isLoading: isDeleting } = useDeleteProduct();
  const { updateProductFlag, isLoading: isUpdatingFlag } = useUpdateProductFlag();

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    
    switch (situationFilter) {
      case "active":
        return products.filter(product => product.active);
      case "inactive":
        return products.filter(product => !product.active);
      default:
        return products;
    }
  }, [products, situationFilter]);

  const handleCreateProduct = useCallback(() => {
    router.push(ROUTES.PRODUCTS.NEW);
  }, [router]);

  const handleEditProduct = useCallback((product: Product) => {
    router.push(ROUTES.PRODUCTS.EDIT(product.id.toString()));
  }, [router]);

  const handleDeleteProduct = useCallback((product: Product) => {
    setProductToDelete(product);
    setShowDeleteDialog(true);
  }, []);

  const confirmDeleteProduct = useCallback(async () => {
    if (!productToDelete) return;
    
    try {
      await deleteProduct(productToDelete.id);
      toast.success("Produto excluído com sucesso!");
      setShowDeleteDialog(false);
      setProductToDelete(null);
    } catch {
      toast.error("Erro ao excluir produto");
    }
  }, [deleteProduct, productToDelete]);

  const cancelDelete = useCallback(() => {
    setShowDeleteDialog(false);
    setProductToDelete(null);
  }, []);

  const toggleProductStatus = useCallback(
    async (id: string, active: boolean) => {
      try {
        await updateProductFlag({ id, active: !active });
        toast.success(
          `Produto ${!active ? "ativado" : "desativado"} com sucesso!`
        );
      } catch {
        toast.error("Erro ao alterar status do produto");
      }
    },
    [updateProductFlag]
  );

  return (
    <div className={`bg-white rounded-lg shadow ${className}`}>
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Select
            value={situationFilter}
            onChange={(e) => setSituationFilter(e.target.value as "all" | "active" | "inactive")}
            size="sm"
          >
            <option value="all">Todos</option>
            <option value="active">Ativo</option>
            <option value="inactive">Inativo</option>
          </Select>
        </div>
        <Button
          onClick={handleCreateProduct}
          variant="primary"
          size="sm"
        >
          Adicionar
        </Button>
      </div>

      <ProductTable
        products={filteredProducts}
        isLoading={isLoading}
        error={error?.message || null}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
        onToggleStatus={toggleProductStatus}
        isUpdatingFlag={isUpdatingFlag}
      />

      <div className="px-6 py-3 border-t border-gray-200 flex justify-center">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Button>
          <span className="text-sm text-gray-700">1</span>
          <Button
            variant="ghost"
            size="sm"
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={cancelDelete}
        onConfirm={confirmDeleteProduct}
        title="Confirmar Exclusão"
        message={`Deseja realmente excluir o produto "${productToDelete?.name}"?`}
        confirmText={isDeleting ? 'Excluindo...' : 'Excluir'}
        confirmVariant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
};
