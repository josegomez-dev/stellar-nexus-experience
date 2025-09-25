// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

import MiniGameStore from '@/components/games/MiniGameStore';
import { WalletProvider } from '@/contexts/WalletContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { TransactionProvider } from '@/contexts/TransactionContext';
import { AccountProvider } from '@/contexts/AccountContext';
import { ToastContainer } from '@/components/ui/Toast';
import { ProtectedMiniGamesAccess } from '@/components/ui/ProtectedMiniGamesAccess';

export default function MiniGamesPage() {
  return (
    <WalletProvider>
      <AuthProvider>
        <AccountProvider>
          <ToastProvider>
            <TransactionProvider>
              <ProtectedMiniGamesAccess>
                <MiniGameStore />
              </ProtectedMiniGamesAccess>
              <ToastContainer />
            </TransactionProvider>
          </ToastProvider>
        </AccountProvider>
      </AuthProvider>
    </WalletProvider>
  );
}
