import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar, SidebarSection } from '../organisms';
import { Button } from '../atoms';
import { useAuthContext } from '@/modules/auth';

export interface PageTemplateProps {
  children: React.ReactNode;
  sidebarSections?: SidebarSection[];
  showSidebar?: boolean;
  className?: string;
  currentPage?: 'dashboard' | 'productions' | 'products';
  pageTitle?: string;
}

export const PageTemplate: React.FC<PageTemplateProps> = ({
  children,
  sidebarSections,
  showSidebar = false,
  className = '',
  currentPage,
  pageTitle,
}) => {
  const router = useRouter();
  const { logout } = useAuthContext();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const getPageTitle = () => {
    if (pageTitle) return pageTitle;
    switch (currentPage) {
      case 'dashboard':
        return 'Dashboard';
      case 'productions':
        return 'Apontamentos de Produção';
      case 'products':
        return 'Cadastro de Produtos';
      default:
        return 'Sistema';
    }
  };

  const defaultSidebarSections: SidebarSection[] = [
    {
      title: "Navegação",
      items: [
        {
          label: "Dashboard",
          isActive: currentPage === 'dashboard',
          onClick: () => router.push("/dashboard"),
        },
      ],
    },
    {
      title: "Apontamentos",
      items: [
        {
          label: "Apontamento de Produção",
          isActive: currentPage === 'productions',
          onClick: () => router.push("/productions"),
        },
      ],
    },
    {
      title: "Cadastros",
      items: [
        {
          label: "Cadastro de Produto",
          isActive: currentPage === 'products',
          onClick: () => router.push("/products"),
        },
      ],
    },
  ];

  const finalSidebarSections = sidebarSections || defaultSidebarSections;

  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      <div className="flex h-screen">
        {showSidebar && finalSidebarSections.length > 0 && (
          <Sidebar 
            sections={finalSidebarSections} 
            isOpen={sidebarOpen}
            onToggle={toggleSidebar}
          />
        )}
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="flex justify-between items-center px-6 py-4">
              <div className="flex items-center space-x-2">
                {/* Espaço reservado para o botão hamburger em mobile */}
                <div className="md:hidden w-10"></div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {getPageTitle()}
                </h1>
              </div>
              <Button onClick={logout} variant="secondary" size="sm">
                Sair
              </Button>
            </div>
          </header>
          <main className="flex-1 p-6 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};
