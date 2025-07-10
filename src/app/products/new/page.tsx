"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useCreateProduct } from "@/modules/products";
import { ProductForm } from "@/modules/products/components/ProductForm";
import { useAuthContext } from "@/modules/auth";
import { ProtectedRoute, PageTemplate, Button } from "@/shared/components";

export default function NewProductPage() {
  const router = useRouter();
  const { user, logout } = useAuthContext();
  const { createProduct, isLoading } = useCreateProduct();

  const handleSubmit = useCallback(
    async (data: {
      name: string;
      minProduction: number;
      maxProduction: number;
    }) => {
      try {
        await createProduct(data);
        toast.success("Produto criado com sucesso!");
        router.push("/products");
      } catch {
        toast.error("Erro ao criar produto");
      }
    },
    [createProduct, router]
  );

  const handleCancel = useCallback(() => {
    router.push("/products");
  }, [router]);

  return (
    <ProtectedRoute>
      <PageTemplate showSidebar currentPage="products">
        <div className="flex-1 flex flex-col">
          <header className="bg-white shadow-sm border-b">
            <div className="flex justify-between items-center px-6 py-4">
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-semibold text-gray-900">
                  Cadastro de Produto &gt; Adicionar
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">Olá, {user?.name}</span>
                <Button onClick={logout} variant="danger" size="sm">
                  Sair
                </Button>
              </div>
            </div>
          </header>

          <main className="flex-1 p-6">
            <ProductForm
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isLoading={isLoading}
            />
          </main>
        </div>
      </PageTemplate>
    </ProtectedRoute>
  );
}
