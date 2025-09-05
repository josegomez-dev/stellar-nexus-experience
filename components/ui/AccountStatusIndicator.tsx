'use client';

import React, { useState, useEffect } from 'react';
import { useAccount } from '@/contexts/AccountContext';
import { useGlobalWallet } from '@/contexts/WalletContext';

export const AccountStatusIndicator: React.FC = () => {
  const { account, loading } = useAccount();
  const { isConnected } = useGlobalWallet();
  const [showAccountReady, setShowAccountReady] = useState(false);
  const [progress, setProgress] = useState(100);

  // Show account ready notification when account is first created/loaded
  useEffect(() => {
    if (account && !loading) {
      setShowAccountReady(true);
      setProgress(100);
      
      // Start progress countdown
      const interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev - 1;
          if (newProgress <= 0) {
            clearInterval(interval);
            setTimeout(() => setShowAccountReady(false), 100);
            return 0;
          }
          return newProgress;
        });
      }, 100); // Update every 100ms for smooth animation (10 seconds total)

      return () => clearInterval(interval);
    }
  }, [account, loading]);

  const handleClose = () => {
    setShowAccountReady(false);
  };

  if (!isConnected) {
    return null;
  }

  return (
    <div className="fixed top-20 right-4 z-40">
      {loading && !account && (
        <div className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg animate-pulse flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          <span className="text-sm font-medium">Creating account...</span>
        </div>
      )}
      
      {account && showAccountReady && (
        <div className="bg-green-600 text-white rounded-lg shadow-lg animate-fade-in relative overflow-hidden min-w-[280px]">
          {/* Progress bar background */}
          <div className="absolute bottom-0 left-0 h-1 bg-green-800 w-full">
            <div 
              className="h-full bg-green-300 transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          {/* Content */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm">✅</span>
              <div className="text-sm">
                <div className="font-medium">Account Ready</div>
                <div className="text-xs opacity-90">
                  {account.profile.totalPoints} points • Level {account.profile.level}
                </div>
              </div>
            </div>
            
            {/* Close button */}
            <button
              onClick={handleClose}
              className="ml-3 text-white hover:text-green-200 transition-colors p-1 rounded hover:bg-green-700"
              title="Close"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
