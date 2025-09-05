'use client';

import { ReactNode } from 'react';
import { TransactionProvider } from '@/contexts/TransactionContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { AccountProvider } from '@/contexts/AccountContext';
import { BugfenderInit } from './BugfenderInit';

interface ProvidersProps {
  children: ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <TransactionProvider>
      <ToastProvider>
        <AccountProvider>
          <BugfenderInit />
          {children}
        </AccountProvider>
      </ToastProvider>
    </TransactionProvider>
  );
};
