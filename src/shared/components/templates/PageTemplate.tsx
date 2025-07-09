import React from 'react';
import { Sidebar, SidebarSection } from '../organisms';

export interface PageTemplateProps {
  children: React.ReactNode;
  sidebarSections?: SidebarSection[];
  showSidebar?: boolean;
  className?: string;
}

export const PageTemplate: React.FC<PageTemplateProps> = ({
  children,
  sidebarSections = [],
  showSidebar = false,
  className = '',
}) => {
  return (
    <div className={`min-h-screen bg-gray-50 flex ${className}`}>
      {showSidebar && sidebarSections.length > 0 && (
        <Sidebar sections={sidebarSections} />
      )}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
};
