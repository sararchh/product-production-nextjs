import React from 'react';
import { Text, Button } from '../atoms';

export interface PageLayoutProps {
  title: string;
  subtitle?: string;
  user?: {
    name?: string;
  };
  onLogout?: () => void;
  onDashboard?: () => void;
  children: React.ReactNode;
  showUserInfo?: boolean;
  actions?: React.ReactNode;
  className?: string;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  title,
  subtitle,
  user,
  onLogout,
  onDashboard,
  children,
  showUserInfo = true,
  actions,
  className = '',
}) => {
  return (
    <div className={`flex-1 flex flex-col ${className}`}>
      <header className="bg-white shadow-sm border-b">
        <div className="flex justify-between items-center px-6 py-4">
          <div className="flex items-center space-x-2">
            <Text variant="h4" weight="semibold">
              {title}
              {subtitle && ` > ${subtitle}`}
            </Text>
          </div>
          <div className="flex items-center space-x-4">
            {actions}
            {showUserInfo && user && (
              <>
                <Text color="secondary">Olá, {user.name}</Text>
                {onDashboard && (
                  <Button
                    onClick={onDashboard}
                    variant="primary"
                    size="sm"
                  >
                    Dashboard
                  </Button>
                )}
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
      </header>

      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
};
