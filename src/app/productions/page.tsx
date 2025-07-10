"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
  useProductions,
  useUpdateProductionFlag,
} from "@/modules/productions";
import { useProducts } from "@/modules/products";
import { useAuthContext } from "@/modules/auth";
import { ProtectedRoute, PageTemplate } from "@/shared/components";
import { Button, Dialog, Select } from "@/shared/components";

export default function ProductionsPage() {
  const router = useRouter();
  const { user, logout } = useAuthContext();
  const [situationFilter, setSituationFilter] = useState<"all" | "active" | "inactive">("all");
  const [productFilter, setProductFilter] = useState<string>("all");
  const [showJustificationView, setShowJustificationView] = useState(false);
  const [currentJustification, setCurrentJustification] = useState<string>("");

  const { data: productions, isLoading, error } = useProductions();
  const { data: products, isLoading: isLoadingProducts } = useProducts();
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

  const getProductName = useCallback((productId: string) => {
    const product = products?.find(p => p.id === productId);
    return product?.name || "Produto não encontrado";
  }, [products]);

  const getProductRange = useCallback((productId: string) => {
    const product = products?.find(p => p.id === productId);
    if (!product) return null;
    return { min: product.minProduction, max: product.maxProduction };
  }, [products]);

  const isQuantityOutOfRange = useCallback((productId: string, quantity: number) => {
    const range = getProductRange(productId);
    if (!range) return false;
    return quantity < range.min || quantity > range.max;
  }, [getProductRange]);

  const handleGoToDashboard = useCallback(() => {
    router.push("/dashboard");
  }, [router]);

  const handleToggleForm = useCallback(() => {
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
    <ProtectedRoute>
      <PageTemplate showSidebar currentPage="productions">
        <div className="flex-1 flex flex-col">
          <header className="bg-white shadow-sm border-b">
            <div className="flex justify-between items-center px-6 py-4">
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-semibold text-gray-900">
                  Apontamento de Produção
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">Olá, {user?.name}</span>
                <Button
                  onClick={handleGoToDashboard}
                  variant="primary"
                  size="sm"
                >
                  Dashboard
                </Button>
                <Button
                  onClick={logout}
                  variant="danger"
                  size="sm"
                >
                  Sair
                </Button>
              </div>
            </div>
          </header>

          <main className="flex-1 p-6">
            <div className="bg-white rounded-lg shadow">
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
                  onClick={handleToggleForm}
                  variant="primary"
                  size="sm"
                >
                  Adicionar
                </Button>
              </div>

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
                            <AiOutlineLoading3Quarters className="animate-spin h-6 w-6 text-blue-600" />
                          </div>
                        </td>
                      </tr>
                    ) : error ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-red-600">
                          Erro ao carregar apontamentos
                        </td>
                      </tr>
                    ) : filteredProductions.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-gray-700">
                          Nenhum apontamento encontrado
                        </td>
                      </tr>
                    ) : (
                      filteredProductions.map((production, index) => {
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
                                  onClick={() => toggleProductionStatus(production.id, production.active)}
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
                                    onClick={() => handleViewJustification(production.justification!)}
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
            </div>
          </main>
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
      </PageTemplate>
    </ProtectedRoute>
  );
}
