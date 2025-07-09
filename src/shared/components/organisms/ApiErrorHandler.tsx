'use client';

import { useApiErrorHandler } from '@/modules/auth/hooks/useApiErrorHandler';

export const ApiErrorHandler: React.FC = () => {
  useApiErrorHandler();
  
  return null;
};
