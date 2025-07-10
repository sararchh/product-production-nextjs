import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/modules/auth';
import { Spinner } from '../atoms';
import { ROUTES } from '@/config';

export interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  showLoader?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectTo = ROUTES.AUTH.LOGIN,
  showLoader = true,
}) => {
  const router = useRouter();
  const { user, isLoading } = useAuthContext();

  React.useEffect(() => {
    if (!isLoading && !user) {
      router.push(redirectTo);
    }
  }, [user, isLoading, router, redirectTo]);

  if (isLoading) {
    if (!showLoader) return null;
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <Spinner size="lg" color="primary" />
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
};
