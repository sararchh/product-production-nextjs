'use client';

import { useApiErrorHandler } from '@/modules/auth';

export const ApiErrorHandler: React.FC = () => {
  useApiErrorHandler();
  return null;
};
