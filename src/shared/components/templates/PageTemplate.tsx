import React from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar, SidebarSection } from '../organisms';

export interface PageTemplateProps {
  children: React.ReactNode;
  sidebarSections?: SidebarSection[];
  showSidebar?: boolean;
  className?: string;
  currentPage?: 'dashboard' | 'productions' | 'products';
}

export const PageTemplate: React.FC<PageTemplateProps> = ({
  children,
  sidebarSections,
  showSidebar = false,
  className = '',
  currentPage,
}) => {
  const router = useRouter();

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
    <div className={`min-h-screen bg-gray-50 flex ${className}`}>
      {showSidebar && finalSidebarSections.length > 0 && (
        <Sidebar sections={finalSidebarSections} />
      )}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
};
