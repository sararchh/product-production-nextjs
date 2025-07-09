import React from 'react';
import { Button, Text } from '../atoms';

export interface HeaderProps {
  title: string;
  user?: {
    name?: string;
  };
  onLogout?: () => void;
  showUserInfo?: boolean;
  actions?: React.ReactNode;
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  user,
  onLogout,
  showUserInfo = true,
  actions,
  className = '',
}) => {
  return (
    <nav className={`bg-white shadow ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center transform rotate-45">
              <span className="text-white font-bold text-sm transform -rotate-45">
                {title.charAt(0).toUpperCase()}
              </span>
            </div>
            <Text variant="h4" weight="semibold" className="ml-3">
              {title}
            </Text>
          </div>
          
          <div className="flex items-center space-x-4">
            {actions}
            {showUserInfo && user && (
              <>
                <Text color="secondary">Olá, {user.name}</Text>
                {onLogout && (
                  <Button
                    onClick={onLogout}
                    variant="danger"
                    size="sm"
                  >
                    Sair
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
