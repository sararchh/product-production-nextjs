"use client";

import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useCreateProduction } from "@/modules/productions";
import { useAuthContext } from "@/modules/auth";
import { ProtectedRoute, PageTemplate, Button } from "@/shared/components";
import { ProductionForm, ProductionFormData } from "@/modules/productions";

export default function NewProductionPage() {
  const router = useRouter();
  const { user, logout } = useAuthContext();
  const { createProduction, isLoading } = useCreateProduction();

  const handleGoToDashboard = () => {
    router.push("/dashboard");
  };

  const handleGoToProductions = () => {
    router.push("/productions");
  };

  const handleSubmit = async (data: ProductionFormData) => {
    try {
      const productionData = {
        ...data,
        productionDate: new Date().toISOString(),
      };

      await createProduction(productionData);
      toast.success("Apontamento criado com sucesso!");
      router.push("/productions");
    } catch (error) {
      console.error("Erro ao criar apontamento:", error);
      toast.error("Erro ao criar apontamento. Tente novamente.");
    }
  };

  const handleSubmitWithJustification = async (data: ProductionFormData, justification: string) => {
    try {
      const productionData = {
        ...data,
        productionDate: new Date().toISOString(),
        justification,
      };

      await createProduction(productionData);
      toast.success("Apontamento criado com sucesso!");
      router.push("/productions");
    } catch (error) {
      console.error("Erro ao criar apontamento:", error);
      toast.error("Erro ao criar apontamento. Tente novamente.");
    }
  };



  return (
    <ProtectedRoute>
      <PageTemplate showSidebar currentPage="productions">
        <div className="flex-1 flex flex-col">
          <header className="bg-white shadow-sm border-b">
            <div className="flex justify-between items-center px-6 py-4">
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-semibold text-gray-900">
                  Apontamento de Produção &gt; Adicionar
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
            <div className="bg-white rounded-lg shadow p-6">
              <ProductionForm
                onSubmit={handleSubmit}
                onSubmitWithJustification={handleSubmitWithJustification}
                onCancel={handleGoToProductions}
                isLoading={isLoading}
              />

              <div className="mt-6 flex justify-center">
                <Button
                  onClick={handleGoToProductions}
                  variant="ghost"
                  size="sm"
                >
                  ← Voltar para a lista
                </Button>
              </div>
            </div>
          </main>
        </div>
      </PageTemplate>
    </ProtectedRoute>
  );
}
