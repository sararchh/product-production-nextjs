"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { ProductList } from "@/modules/products/components/ProductList";
import { useAuthContext } from "@/modules/auth";
import { ProtectedRoute, PageTemplate, Button } from "@/shared/components";

export default function ProductsPage() {
  const router = useRouter();
  const { user, logout } = useAuthContext();

  const handleGoToDashboard = useCallback(() => {
    router.push("/dashboard");
  }, [router]);

  return (
    <ProtectedRoute>
      <PageTemplate showSidebar currentPage="products">
        <div className="flex-1 flex flex-col">
          <header className="bg-white shadow-sm border-b">
            <div className="flex justify-between items-center px-6 py-4">
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-semibold text-gray-900">
                  Cadastro de Produto
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
            <ProductList />
          </main>
        </div>
      </PageTemplate>
    </ProtectedRoute>
  );
}
