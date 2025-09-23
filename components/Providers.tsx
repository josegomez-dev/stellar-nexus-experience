'use client';

import { ReactNode } from 'react';
import { TransactionProvider } from '@/contexts/TransactionContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { BadgeAnimationProvider } from '@/contexts/BadgeAnimationContext';
import { WalletProvider } from '@/contexts/WalletContext';
import { AccountProvider } from '@/contexts/AccountContext';

interface ProvidersProps {
  children: ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <TransactionProvider>
      <ToastProvider>
        <BadgeAnimationProvider>
          <WalletProvider>
            <AccountProvider>
              {children}
            </AccountProvider>
          </WalletProvider>
        </BadgeAnimationProvider>
      </ToastProvider>
    </TransactionProvider>
  );
};
