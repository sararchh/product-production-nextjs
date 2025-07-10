import React, { useState, useEffect, useCallback } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
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
  isOpen?: boolean;
  onToggle?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  sections,
  className = '',
  isOpen: externalIsOpen,
  onToggle: externalOnToggle,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  
  const toggleSidebar = useCallback(() => {
    if (externalOnToggle) {
      externalOnToggle();
    } else {
      setInternalIsOpen(!internalIsOpen);
    }
  }, [externalOnToggle, internalIsOpen]);

  const handleItemClick = useCallback((itemOnClick?: () => void) => {
    if (itemOnClick) {
      itemOnClick();
    }

    if (window.innerWidth < 768) {
      toggleSidebar();
    }
  }, [toggleSidebar]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        toggleSidebar();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, toggleSidebar]);

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-3 left-4 z-50 p-2 bg-white rounded-lg shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
      </button>

      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-[rgba(74,85,101,0.5)] z-30 transition-opacity"
          onClick={toggleSidebar}
        />
      )}

      <div className={`
        fixed md:relative
        top-0 left-0 h-full
        w-64 bg-white shadow-lg
        transform transition-transform duration-300 ease-in-out
        z-40
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        ${className}
      `}>
        <div className="p-6 pt-16 md:pt-6">
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
                      onClick={() => handleItemClick(item.onClick)}
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
    </>
  );
};
