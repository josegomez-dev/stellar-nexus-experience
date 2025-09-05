// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

import MiniGameStore from '@/components/games/MiniGameStore';
import { WalletProvider } from '@/contexts/WalletContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { TransactionProvider } from '@/contexts/TransactionContext';
import { ToastContainer } from '@/components/ui/Toast';

export default function MiniGamesPage() {
  return (
    <WalletProvider>
      <AuthProvider>
        <ToastProvider>
          <TransactionProvider>
            <MiniGameStore />
            <ToastContainer />
          </TransactionProvider>
        </ToastProvider>
      </AuthProvider>
    </WalletProvider>
  );
}
