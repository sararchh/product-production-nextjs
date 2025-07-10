"use client";

import { useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-toastify";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useProduct, useUpdateProduct } from "@/modules/products";
import { ProductForm } from "@/modules/products/components/ProductForm";
import { ProtectedRoute, PageTemplate, Button } from "@/shared/components";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();

  const productId = params.id as string;
  const { data: product, isLoading: isLoadingProduct } = useProduct(productId);
  const { updateProduct, isLoading: isUpdating } = useUpdateProduct();

  const handleSubmit = useCallback(
    async (data: {
      name: string;
      minProduction: number;
      maxProduction: number;
    }) => {
      try {
        await updateProduct({ id: productId, data });
        toast.success("Produto atualizado com sucesso!");
        router.push("/products");
      } catch {
        toast.error("Erro ao atualizar produto");
      }
    },
    [updateProduct, productId, router]
  );

  const handleCancel = useCallback(() => {
    router.push("/products");
  }, [router]);

  if (isLoadingProduct) {
    return (
      <ProtectedRoute>
        <PageTemplate showSidebar currentPage="products">
          <div className="flex-1 flex flex-col">
            <main className="flex-1 p-6 flex items-center justify-center">
              <div className="flex items-center space-x-2">
                <AiOutlineLoading3Quarters className="animate-spin h-6 w-6 text-blue-600" />
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
        <PageTemplate showSidebar currentPage="products">
          <div className="flex-1 flex flex-col">
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
      <PageTemplate showSidebar currentPage="products">
        <div className="flex-1 flex flex-col">
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
