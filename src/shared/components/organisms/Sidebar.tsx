import React from 'react';
import { Text, Button } from '../atoms';

export interface SidebarItem {
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

export interface SidebarSection {
  title: string;
  items: SidebarItem[];
}

export interface SidebarProps {
  sections: SidebarSection[];
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  sections,
  className = '',
}) => {
  return (
    <div className={`w-64 bg-white shadow-lg ${className}`}>
      <div className="p-6">
        <Text variant="h5" weight="semibold">Menu principal</Text>
      </div>
      <nav className="mt-4">
        {sections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="px-4 py-2 mt-4">
            <Text 
              variant="caption" 
              weight="medium" 
              color="secondary" 
              className="uppercase tracking-wider"
            >
              {section.title}
            </Text>
            <ul className="mt-2 space-y-1">
              {section.items.map((item, itemIndex) => (
                <li key={itemIndex}>
                  <Button
                    onClick={item.onClick}
                    variant="ghost"
                    size="sm"
                    fullWidth
                    className={`justify-start transition-colors duration-200 ${
                      item.isActive
                        ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {item.label}
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </div>
  );
};
