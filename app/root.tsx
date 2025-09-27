'use client';

import { ReactNode } from 'react';
import { TransactionProvider } from '@/contexts/TransactionContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { BadgeAnimationProvider } from '@/contexts/BadgeAnimationContext';
import { WalletProvider } from '@/contexts/WalletContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { NetworkProvider } from '@/contexts/NetworkContext';
import { FirebaseProvider } from '@/contexts/FirebaseContext';
import { EscrowProvider } from '@/contexts/EscrowContext';

interface RootProvidersProps {
  children: ReactNode;
}

export const RootProviders = ({ children }: RootProvidersProps) => {
  return (
    <WalletProvider>
      <NetworkProvider>
        <AuthProvider>
          <ToastProvider>
            <FirebaseProvider>
              <TransactionProvider>
                <BadgeAnimationProvider>
                  <EscrowProvider>{children}</EscrowProvider>
                </BadgeAnimationProvider>
              </TransactionProvider>
            </FirebaseProvider>
          </ToastProvider>
        </AuthProvider>
      </NetworkProvider>
    </WalletProvider>
  );
};
