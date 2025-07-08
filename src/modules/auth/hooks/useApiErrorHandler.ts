'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '../contexts/AuthContext';

export const useApiErrorHandler = () => {
  const router = useRouter();
  const { logout } = useAuthContext();

  useEffect(() => {
    const handleUnauthorizedError = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.name === 'UnauthorizedError') {
        logout();
        router.push('/login');
      }
    };

    window.addEventListener('unauthorized-error', handleUnauthorizedError);
    
    return () => {
      window.removeEventListener('unauthorized-error', handleUnauthorizedError);
    };
  }, [logout, router]);
};
