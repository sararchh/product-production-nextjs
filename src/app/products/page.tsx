"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import {
  useProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  useUpdateProductFlag,
  Product,
} from "@/modules/products";
import { useAuthContext } from "@/modules/auth";
import { ProtectedRoute, PageTemplate } from "@/shared/components";
import { ConfirmDialog, FormField, Button } from "@/shared/components";

const productSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  minProduction: z.number().min(1, "Produção mínima deve ser maior que zero"),
  maxProduction: z.number().min(1, "Produção máxima deve ser maior que zero"),
}).refine(data => data.maxProduction >= data.minProduction, {
  message: "Produção máxima deve ser maior ou igual à mínima",
  path: ["maxProduction"],
});

type ProductFormData = z.infer<typeof productSchema>;

export default function ProductsPage() {
  const router = useRouter();
  const { user, logout } = useAuthContext();
  const [showForm, setShowForm] = useState(false);
  const [situationFilter, setSituationFilter] = useState<"all" | "active" | "inactive">("all");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [pendingProduct, setPendingProduct] = useState<ProductFormData | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const { data: products, isLoading, error } = useProducts();
  const { createProduct, isLoading: isCreating } = useCreateProduct();
  const { updateProduct, isLoading: isUpdating } = useUpdateProduct();
  const { deleteProduct, isLoading: isDeleting } = useDeleteProduct();
  const { updateProductFlag, isLoading: isUpdatingFlag } = useUpdateProductFlag();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

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

  const onSubmit = useCallback(
    async (data: ProductFormData) => {
      setPendingProduct(data);
      setShowConfirmDialog(true);
    },
    []
  );

  const handleConfirmSave = useCallback(
    async () => {
      if (!pendingProduct) return;
      
      try {
        if (editingProduct) {
          await updateProduct({ 
            id: editingProduct.id, 
            data: pendingProduct 
          });
          toast.success("Produto atualizado com sucesso!");
          setEditingProduct(null);
        } else {
          await createProduct(pendingProduct);
          toast.success("Produto criado com sucesso!");
        }
        reset();
        setShowForm(false);
        setShowConfirmDialog(false);
        setPendingProduct(null);
      } catch {
        toast.error(editingProduct ? "Erro ao atualizar produto" : "Erro ao criar produto");
        setShowConfirmDialog(false);
      }
    },
    [createProduct, updateProduct, reset, pendingProduct, editingProduct]
  );

  const handleCancelSave = useCallback(() => {
    setShowConfirmDialog(false);
    setPendingProduct(null);
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

  const handleEditProduct = useCallback((product: Product) => {
    setEditingProduct(product);
    reset({
      name: product.name,
      minProduction: product.minProduction,
      maxProduction: product.maxProduction,
    });
    setShowForm(true);
  }, [reset]);

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

  const handleGoToDashboard = useCallback(() => {
    router.push("/dashboard");
  }, [router]);

  const handleToggleForm = useCallback(() => {
    setShowForm((prev) => !prev);
    if (showForm) {
      reset();
      setEditingProduct(null);
    }
  }, [showForm, reset]);

  const sidebarSections = [
    {
      title: "Apontamentos",
      items: [
        {
          label: "Apontamento de Produção",
          isActive: false,
          onClick: () => {},
        },
      ],
    },
    {
      title: "Cadastros",
      items: [
        {
          label: "Cadastro de Produto",
          isActive: true,
          onClick: () => {},
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
                  Cadastro de Produto
                  {showForm && ` > ${editingProduct ? 'Editar' : 'Adicionar'}`}
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
                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      label="Produto"
                      name="name"
                      type="text"
                      placeholder="Nome do produto"
                      register={register}
                      error={errors.name?.message}
                    />

                    <FormField
                      label="Produção Min."
                      name="minProduction"
                      type="number"
                      placeholder="Mínima"
                      register={register}
                      error={errors.minProduction?.message}
                      valueAsNumber
                    />

                    <FormField
                      label="Produção Máx."
                      name="maxProduction"
                      type="number"
                      placeholder="Máxima"
                      register={register}
                      error={errors.maxProduction?.message}
                      valueAsNumber
                    />
                  </div>

                  <div className="flex justify-center">
                    <Button
                      type="submit"
                      isLoading={isCreating || isUpdating}
                      loadingText="Salvando..."
                      className="w-full max-w-md"
                      size="lg"
                    >
                      {editingProduct ? 'Atualizar' : 'Salvar'}
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
                      className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 outline-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="all">Todos</option>
                      <option value="active">Ativo</option>
                      <option value="inactive">Inativo</option>
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
                          PADRÃO PRODUÇÃO
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {isLoading ? (
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
                            Erro ao carregar produtos
                          </td>
                        </tr>
                      ) : filteredProducts.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-4 text-center text-gray-700">
                            Nenhum produto encontrado
                          </td>
                        </tr>
                      ) : (
                        filteredProducts.map((product, index) => (
                          <tr key={product.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {String(index + 1).padStart(2, '0')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <div className="flex space-x-2">
                                <button 
                                  onClick={() => handleEditProduct(product)}
                                  className="text-blue-600 hover:text-blue-800"
                                  title="Editar produto"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                  </svg>
                                </button>
                                <button 
                                  onClick={() => handleDeleteProduct(product)}
                                  className="text-red-600 hover:text-red-800"
                                  title="Excluir produto"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button
                                onClick={() => toggleProductStatus(product.id, product.active)}
                                disabled={isUpdatingFlag}
                                className={`px-3 py-1 text-xs font-medium rounded-full ${
                                  product.active
                                    ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                                }`}
                              >
                                {product.active ? "ATIVO" : "INATIVO"}
                              </button>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {product.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              Min. {product.minProduction || 0} Max. {product.maxProduction || 0}
                            </td>
                          </tr>
                        ))
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

      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={handleCancelSave}
        onConfirm={handleConfirmSave}
        title={editingProduct ? 'Confirmar Atualização' : 'Confirmar Cadastro'}
        message={editingProduct 
          ? 'Deseja realmente atualizar este produto?' 
          : 'Deseja realmente cadastrar este produto?'
        }
        confirmText={isCreating || isUpdating ? 'Salvando...' : 'Confirmar'}
        isLoading={isCreating || isUpdating}
      />

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
      </PageTemplate>
    </ProtectedRoute>
  );
}
