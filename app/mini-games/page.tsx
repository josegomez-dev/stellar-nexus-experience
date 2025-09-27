// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

import MiniGameStore from '@/components/games/MiniGameStore';
import { WalletProvider } from '@/contexts/wallet/WalletContext';
import { AuthProvider } from '@/contexts/auth/AuthContext';
import { ToastProvider } from '@/contexts/ui/ToastContext';
import { TransactionProvider } from '@/contexts/data/TransactionContext';
import { AccountProvider } from '@/contexts/auth/AccountContext';
import { ToastContainer } from '@/components/ui/Toast';
export default function MiniGamesPage() {
  return (
    <WalletProvider>
      <AuthProvider>
        <AccountProvider>
          <ToastProvider>
            <TransactionProvider>
              <MiniGameStore />
              <ToastContainer />
            </TransactionProvider>
          </ToastProvider>
        </AccountProvider>
      </AuthProvider>
    </WalletProvider>
  );
}
