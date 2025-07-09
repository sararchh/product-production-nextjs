"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import {
  useProductions,
  useCreateProduction,
  useUpdateProductionFlag,
} from "@/modules/productions";
import { useProducts, Product } from "@/modules/products";
import { useAuthContext } from "@/modules/auth";
import { ProtectedRoute, PageTemplate } from "@/shared/components";
import { ConfirmDialog, FormField, Button, Dialog } from "@/shared/components";

const productionSchema = z.object({
  productId: z.string().min(1, "Produto é obrigatório"),
  quantity: z.number().min(0.1, "Quantidade deve ser maior que zero"),
});

type ProductionFormData = z.infer<typeof productionSchema>;

interface JustificationFormData {
  justification: string;
}

export default function ProductionsPage() {
  const router = useRouter();
  const { user, logout } = useAuthContext();
  const [showForm, setShowForm] = useState(false);
  const [situationFilter, setSituationFilter] = useState<"all" | "active" | "inactive">("all");
  const [productFilter, setProductFilter] = useState<string>("all");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showJustificationDialog, setShowJustificationDialog] = useState(false);
  const [showJustificationView, setShowJustificationView] = useState(false);
  const [pendingProduction, setPendingProduction] = useState<ProductionFormData | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentJustification, setCurrentJustification] = useState<string>("");
  const [isOutOfRange, setIsOutOfRange] = useState(false);
  const [productSearch, setProductSearch] = useState("");
  const [showProductDropdown, setShowProductDropdown] = useState(false);

  const { data: productions, isLoading, error } = useProductions();
  const { data: products, isLoading: isLoadingProducts } = useProducts();
  const { createProduction, isLoading: isCreating } = useCreateProduction();
  const { updateProductionFlag, isLoading: isUpdatingFlag } = useUpdateProductionFlag();

  const activeProducts = useMemo(() => {
    return products?.filter(product => product.active) || [];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (!productSearch) return activeProducts;
    return activeProducts.filter(product => 
      product.name.toLowerCase().includes(productSearch.toLowerCase())
    );
  }, [activeProducts, productSearch]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
    setError,
    clearErrors,
  } = useForm<ProductionFormData>({
    resolver: zodResolver(productionSchema),
  });

  const {
    register: registerJustification,
    handleSubmit: handleSubmitJustification,
    formState: { errors: justificationErrors },
    reset: resetJustification,
  } = useForm<JustificationFormData>();

  const watchedProductId = watch("productId");
  const watchedQuantity = watch("quantity");

  useEffect(() => {
    if (watchedProductId && watchedQuantity && selectedProduct) {
      const outOfRange = watchedQuantity < selectedProduct.minProduction || 
                        watchedQuantity > selectedProduct.maxProduction;
      setIsOutOfRange(outOfRange);
      
      if (outOfRange) {
        setError("quantity", {
          type: "manual",
          message: `Quantidade deve estar entre ${selectedProduct.minProduction} e ${selectedProduct.maxProduction} m²`
        });
      } else {
        clearErrors("quantity");
      }
    }
  }, [watchedProductId, watchedQuantity, selectedProduct, setError, clearErrors]);

  useEffect(() => {
    if (watchedProductId) {
      const product = activeProducts.find(p => p.id === watchedProductId);
      setSelectedProduct(product || null);
    }
  }, [watchedProductId, activeProducts]);

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
    setShowForm((prev) => !prev);
    if (showForm) {
      reset();
      setSelectedProduct(null);
      setProductSearch("");
    }
  }, [showForm, reset]);

  const handleProductSelect = useCallback((product: Product) => {
    setValue("productId", product.id);
    setSelectedProduct(product);
    setProductSearch(product.name);
    setShowProductDropdown(false);
  }, [setValue]);

  const onSubmit = useCallback((data: ProductionFormData) => {
    setPendingProduction(data);
    
    if (isOutOfRange) {
      setShowJustificationDialog(true);
    } else {
      setShowConfirmDialog(true);
    }
  }, [isOutOfRange]);

  const onJustificationSubmit = useCallback((data: JustificationFormData) => {
    if (pendingProduction) {
      setCurrentJustification(data.justification);
      setShowJustificationDialog(false);
      setShowConfirmDialog(true);
    }
  }, [pendingProduction]);

  const handleConfirmSave = useCallback(async () => {
    if (!pendingProduction) return;

    try {
      const productionData = {
        ...pendingProduction,
        productionDate: new Date().toISOString(),
        justification: isOutOfRange ? currentJustification : undefined,
      };

      await createProduction(productionData);
      toast.success("Apontamento criado com sucesso!");
      setShowForm(false);
      setShowConfirmDialog(false);
      setPendingProduction(null);
      setCurrentJustification("");
      reset();
      resetJustification();
    } catch (error) {
      console.error("Erro ao criar apontamento:", error);
      toast.error("Erro ao criar apontamento. Tente novamente.");
    }
  }, [pendingProduction, isOutOfRange, currentJustification, createProduction, reset, resetJustification]);

  const handleCancelSave = useCallback(() => {
    setShowConfirmDialog(false);
    setPendingProduction(null);
  }, []);

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

  const sidebarSections = [
    {
      title: "Apontamentos",
      items: [
        {
          label: "Apontamento de Produção",
          isActive: true,
          onClick: () => {},
        },
      ],
    },
    {
      title: "Cadastros",
      items: [
        {
          label: "Cadastro de Produto",
          isActive: false,
          onClick: () => router.push("/products"),
        },
      ],
    },
  ];

  return (
    <ProtectedRoute>
      <PageTemplate showSidebar sidebarSections={sidebarSections}>
        <div className="flex-1 flex flex-col">
          <header className="bg-white shadow-sm border-b">
            <div className="flex justify-between items-center px-6 py-4">
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-semibold text-gray-900">
                  Apontamento de Produção
                  {showForm && ` > Adicionar`}
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">Olá, {user?.name}</span>
                <button
                  onClick={handleGoToDashboard}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Dashboard
                </button>
                <button
                  onClick={logout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Sair
                </button>
              </div>
            </div>
          </header>

          <main className="flex-1 p-6">
            {showForm ? (
              <div className="bg-white rounded-lg shadow p-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Produto *
                      </label>
                      <input
                        type="text"
                        value={productSearch}
                        onChange={(e) => {
                          setProductSearch(e.target.value);
                          setShowProductDropdown(true);
                        }}
                        onFocus={() => setShowProductDropdown(true)}
                        placeholder="Digite para buscar produtos..."
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {errors.productId && (
                        <p className="mt-1 text-sm text-red-600">{errors.productId.message}</p>
                      )}
                      {showProductDropdown && filteredProducts.length > 0 && (
                        <div className="absolute top-16 left-0 right-0 z-10 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                          {filteredProducts.map((product) => (
                            <button
                              key={product.id}
                              type="button"
                              onClick={() => handleProductSelect(product)}
                              className="w-full text-left p-2 hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                            >
                              <div className="font-medium">{product.name}</div>
                              <div className="text-sm text-gray-500">
                                Produção: {product.minProduction} - {product.maxProduction} m²
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                      <input
                        type="hidden"
                        {...register("productId")}
                      />
                    </div>

                    <FormField
                      label="Produção (m²)"
                      name="quantity"
                      type="number"
                      placeholder="Quantidade produzida"
                      register={register}
                      error={errors.quantity?.message}
                      valueAsNumber
                      required
                    />
                  </div>

                  {selectedProduct && (
                    <div className="text-sm text-gray-500">
                      Intervalo válido para {selectedProduct.name}: {selectedProduct.minProduction} - {selectedProduct.maxProduction} m²
                    </div>
                  )}

                  <div className="flex justify-center">
                    <Button
                      type="submit"
                      isLoading={isCreating}
                      loadingText="Salvando..."
                      className="w-full max-w-md"
                      size="lg"
                    >
                      Salvar
                    </Button>
                  </div>
                </form>

                <div className="mt-6 flex justify-center">
                  <button
                    onClick={handleToggleForm}
                    className="text-gray-600 hover:text-gray-800 text-sm"
                  >
                    ← Voltar para a lista
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setSituationFilter("all")}
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        situationFilter === "all"
                          ? "bg-blue-100 text-blue-700"
                          : "text-gray-600 hover:text-gray-800"
                      }`}
                    >
                      Filtro situação
                    </button>
                    <select
                      value={situationFilter}
                      onChange={(e) => setSituationFilter(e.target.value as "all" | "active" | "inactive")}
                      className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="all">Todos</option>
                      <option value="active">Ativo</option>
                      <option value="inactive">Inativo</option>
                    </select>
                    <select
                      value={productFilter}
                      onChange={(e) => setProductFilter(e.target.value)}
                      className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="all">Todos os produtos</option>
                      {activeProducts.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={handleToggleForm}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Adicionar
                  </button>
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
                                  <button
                                    onClick={() => toggleProductionStatus(production.id, production.active)}
                                    disabled={isUpdatingFlag}
                                    className="text-indigo-600 hover:text-indigo-900 font-medium"
                                    title="Alterar Situação"
                                  >
                                    Alterar Situação
                                  </button>
                                  {production.justification && (
                                    <button
                                      onClick={() => handleViewJustification(production.justification!)}
                                      className="text-green-600 hover:text-green-900 font-medium"
                                      title="Ver Justificativa"
                                    >
                                      Ver Justificativa
                                    </button>
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
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <span className="text-sm text-gray-700">1</span>
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>

        <Dialog
          isOpen={showJustificationDialog}
          onClose={() => setShowJustificationDialog(false)}
          title="Justificativa Necessária"
        >
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              A produção informada está fora do padrão. Por favor, informe a justificativa:
            </p>
            <form onSubmit={handleSubmitJustification(onJustificationSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Justificativa *
                </label>
                <textarea
                  {...registerJustification("justification", { required: "Justificativa é obrigatória" })}
                  rows={4}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Descreva o motivo da produção estar fora do padrão..."
                />
                {justificationErrors.justification && (
                  <p className="mt-1 text-sm text-red-600">{justificationErrors.justification.message}</p>
                )}
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowJustificationDialog(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" variant="primary">
                  Continuar
                </Button>
              </div>
            </form>
          </div>
        </Dialog>

        <ConfirmDialog
          isOpen={showConfirmDialog}
          onClose={handleCancelSave}
          onConfirm={handleConfirmSave}
          title="Confirmar Apontamento"
          message="Deseja realmente criar este apontamento?"
          confirmText={isCreating ? 'Salvando...' : 'Confirmar'}
          isLoading={isCreating}
        />

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
