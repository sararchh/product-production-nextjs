"use client";

import { useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-toastify";
import { useProduct, useUpdateProduct } from "@/modules/products";
import { ProductForm } from "@/modules/products/components/ProductForm";
import { useAuthContext } from "@/modules/auth";
import { ProtectedRoute, PageTemplate, Button } from "@/shared/components";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const { user, logout } = useAuthContext();
  
  const productId = params.id as string;
  const { data: product, isLoading: isLoadingProduct } = useProduct(productId);
  const { updateProduct, isLoading: isUpdating } = useUpdateProduct();

  const handleSubmit = useCallback(async (data: { name: string; minProduction: number; maxProduction: number; }) => {
    try {
      await updateProduct({ id: productId, data });
      toast.success("Produto atualizado com sucesso!");
      router.push("/products");
    } catch {
      toast.error("Erro ao atualizar produto");
    }
  }, [updateProduct, productId, router]);

  const handleCancel = useCallback(() => {
    router.push("/products");
  }, [router]);

  const handleGoToDashboard = useCallback(() => {
    router.push("/dashboard");
  }, [router]);

  const sidebarSections = [
    {
      title: "Navegação",
      items: [
        {
          label: "Dashboard",
          isActive: false,
          onClick: () => router.push("/dashboard"),
        },
      ],
    },
    {
      title: "Apontamentos",
      items: [
        {
          label: "Apontamento de Produção",
          isActive: false,
          onClick: () => router.push("/productions"),
        },
      ],
    },
    {
      title: "Cadastros",
      items: [
        {
          label: "Cadastro de Produto",
          isActive: true,
          onClick: () => router.push("/products"),
        },
      ],
    },
  ];

  if (isLoadingProduct) {
    return (
      <ProtectedRoute>
        <PageTemplate showSidebar sidebarSections={sidebarSections}>
          <div className="flex-1 flex flex-col">
            <header className="bg-white shadow-sm border-b">
              <div className="flex justify-between items-center px-6 py-4">
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl font-semibold text-gray-900">
                    Cadastro de Produto &gt; Editar
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

            <main className="flex-1 p-6 flex items-center justify-center">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span>Carregando produto...</span>
              </div>
            </main>
          </div>
        </PageTemplate>
      </ProtectedRoute>
    );
  }

  if (!product) {
    return (
      <ProtectedRoute>
        <PageTemplate showSidebar sidebarSections={sidebarSections}>
          <div className="flex-1 flex flex-col">
            <header className="bg-white shadow-sm border-b">
              <div className="flex justify-between items-center px-6 py-4">
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl font-semibold text-gray-900">
                    Cadastro de Produto &gt; Editar
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

            <main className="flex-1 p-6 flex items-center justify-center">
              <div className="text-center">
                <p className="text-red-600 mb-4">Produto não encontrado</p>
                <Button onClick={handleCancel} variant="primary">
                  Voltar para lista
                </Button>
              </div>
            </main>
          </div>
        </PageTemplate>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <PageTemplate showSidebar sidebarSections={sidebarSections}>
        <div className="flex-1 flex flex-col">
          <header className="bg-white shadow-sm border-b">
            <div className="flex justify-between items-center px-6 py-4">
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-semibold text-gray-900">
                  Cadastro de Produto &gt; Editar
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
            <ProductForm
              product={product}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isUpdating={isUpdating}
            />
          </main>
        </div>
      </PageTemplate>
    </ProtectedRoute>
  );
}
