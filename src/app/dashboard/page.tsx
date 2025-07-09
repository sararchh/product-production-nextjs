"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/modules/auth";
import { ProtectedRoute, PageTemplate } from "@/shared/components";
import { DashboardCard, Button } from "@/shared/components";
import { FiPackage, FiClipboard, FiUser } from "react-icons/fi";

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout } = useAuthContext();

  const handleGoToProductions = useCallback(() => {
    router.push("/productions");
  }, [router]);

  const handleGoToProducts = useCallback(() => {
    router.push("/products");
  }, [router]);

  const sidebarSections = [
    {
      title: "Navegação",
      items: [
        {
          label: "Dashboard",
          isActive: true,
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
                  Dashboard
                </h1>
              </div>
              <Button
                onClick={logout}
                variant="secondary"
                size="sm"
              >
                Sair
              </Button>
            </div>
          </header>

          <main className="flex-1 p-6">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <DashboardCard
                title="Cadastros"
                subtitle="Cadastro de Produto"
                icon={<FiPackage className="w-6 h-6 text-white" />}
                borderColor="border-blue-500"
                iconBgColor="bg-blue-600"
                actionText="Gerenciar produtos →"
                actionTextColor="text-blue-700 hover:text-blue-600"
                onClick={handleGoToProducts}
              />

              <DashboardCard
                title="Apontamentos"
                subtitle="Apontamento de Produção"
                icon={<FiClipboard className="w-6 h-6 text-white" />}
                borderColor="border-green-500"
                iconBgColor="bg-green-600"
                actionText="Gerenciar apontamentos →"
                actionTextColor="text-green-700 hover:text-green-600"
                onClick={handleGoToProductions}
              />
            </div>

            <div className="mt-8 bg-white shadow rounded-lg border-l-4 border-blue-500">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <FiUser className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Bem-vindo, {user?.name}!
                    </h3>
                    <div className="mt-2 max-w-xl text-sm text-gray-600">
                      <p>
                        Use o dashboard para navegar entre os diferentes módulos
                        do sistema. Comece pelo cadastro de produtos para
                        gerenciar seu catálogo.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5">
                  <Button
                    onClick={handleGoToProducts}
                    variant="primary"
                    className="inline-flex items-center"
                  >
                    <FiPackage className="w-4 h-4 mr-2" />
                    Acessar Cadastro de Produtos
                  </Button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </PageTemplate>
    </ProtectedRoute>
  );
}
