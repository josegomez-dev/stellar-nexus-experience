'use client';

import { ReactNode } from 'react';
import { TransactionProvider } from '@/contexts/TransactionContext';
import { ToastProvider } from '@/contexts/ToastContext';

interface ProvidersProps {
  children: ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <TransactionProvider>
      <ToastProvider>{children}</ToastProvider>
    </TransactionProvider>
  );
};
