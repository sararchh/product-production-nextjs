"use client";

import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useCreateProduction } from "@/modules/productions";
import { ProtectedRoute, PageTemplate, Button } from "@/shared/components";
import { ProductionForm, ProductionFormData } from "@/modules/productions";

export default function NewProductionPage() {
  const router = useRouter();
  const { createProduction, isLoading } = useCreateProduction();

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

  const handleSubmitWithJustification = async (
    data: ProductionFormData,
    justification: string
  ) => {
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
