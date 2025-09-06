'use client';

import { ReactNode } from 'react';
import { TransactionProvider } from '@/contexts/TransactionContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { BadgeAnimationProvider } from '@/contexts/BadgeAnimationContext';
import { AccountProvider } from '@/contexts/AccountContext';
import { BugfenderInit } from './BugfenderInit';

interface ProvidersProps {
  children: ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <TransactionProvider>
      <ToastProvider>
        <BadgeAnimationProvider>
          <AccountProvider>
            <BugfenderInit />
            {children}
          </AccountProvider>
        </BadgeAnimationProvider>
      </ToastProvider>
    </TransactionProvider>
  );
};
