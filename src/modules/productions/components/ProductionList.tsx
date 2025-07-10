import React, { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Button, Select, Dialog } from "@/shared/components";
import { ProductionTable } from "./ProductionTable";
import { 
  useProductions, 
  useUpdateProductionFlag 
} from "../";
import { useProducts } from "@/modules/products";

export interface ProductionListProps {
  className?: string;
}

export const ProductionList: React.FC<ProductionListProps> = ({ 
  className = "" 
}) => {
  const router = useRouter();
  const [situationFilter, setSituationFilter] = useState<"all" | "active" | "inactive">("all");
  const [productFilter, setProductFilter] = useState<string>("all");
  const [showJustificationView, setShowJustificationView] = useState(false);
  const [currentJustification, setCurrentJustification] = useState<string>("");

  const { data: productions, isLoading, error } = useProductions();
  const { data: products } = useProducts();
  const { updateProductionFlag, isLoading: isUpdatingFlag } = useUpdateProductionFlag();

  const activeProducts = useMemo(() => {
    return products?.filter(product => product.active) || [];
  }, [products]);

  const filteredProductions = useMemo(() => {
    if (!productions) return [];
    
    let filtered = productions;

    if (situationFilter !== "all") {
      filtered = filtered.filter(production => 
        situationFilter === "active" ? production.active : !production.active
      );
    }

    if (productFilter !== "all") {
      filtered = filtered.filter(production => production.productId === productFilter);
    }

    return filtered;
  }, [productions, situationFilter, productFilter]);

  const handleAddProduction = useCallback(() => {
    router.push("/productions/new");
  }, [router]);

  const toggleProductionStatus = useCallback(async (id: string, currentStatus: boolean) => {
    try {
      await updateProductionFlag({
        id,
        active: !currentStatus,
      });
      toast.success("Status atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      toast.error("Erro ao atualizar status. Tente novamente.");
    }
  }, [updateProductionFlag]);

  const handleViewJustification = useCallback((justification: string) => {
    setCurrentJustification(justification);
    setShowJustificationView(true);
  }, []);

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
          <Select
            value={productFilter}
            onChange={(e) => setProductFilter(e.target.value)}
            size="sm"
          >
            <option value="all">Todos os produtos</option>
            {activeProducts.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </Select>
        </div>
        <Button
          onClick={handleAddProduction}
          variant="primary"
          size="sm"
        >
          Adicionar
        </Button>
      </div>

      <ProductionTable
        productions={filteredProductions}
        isLoading={isLoading}
        error={error?.message || null}
        onToggleStatus={toggleProductionStatus}
        onViewJustification={handleViewJustification}
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

      <Dialog
        isOpen={showJustificationView}
        onClose={() => setShowJustificationView(false)}
        title="Justificativa"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-900">{currentJustification}</p>
          <div className="flex justify-end">
            <Button
              variant="secondary"
              onClick={() => setShowJustificationView(false)}
            >
              Fechar
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};
