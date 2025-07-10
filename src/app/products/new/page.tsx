"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useCreateProduct } from "@/modules/products";
import { ProductForm } from "@/modules/products/components/ProductForm";
import { ProtectedRoute, PageTemplate } from "@/shared/components";

export default function NewProductPage() {
  const router = useRouter();
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
