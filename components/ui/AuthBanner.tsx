'use client';

import React, { useState } from 'react';
import { useAccount } from '@/contexts/AccountContext';
import { useGlobalWallet } from '@/contexts/WalletContext';
import Image from 'next/image';

interface AuthBannerProps {
  onSignUpClick: () => void;
  onSignInClick: () => void;
}

export const AuthBanner: React.FC<AuthBannerProps> = ({ onSignUpClick, onSignInClick }) => {
  const { account } = useAccount();
  const { isConnected, walletData } = useGlobalWallet();
  const [isDismissed, setIsDismissed] = useState(false);

  // Don't show banner if user has an account or banner is dismissed
  if (account || isDismissed) {
    return null;
  }

  return (
    <div className='fixed top-0 left-0 right-0 mt-16 z-20 bg-gradient-to-r from-brand-500/20 via-accent-500/25 to-brand-400/20 border-b border-white/10 backdrop-blur-sm'>
      {/* Animated background elements */}
      <div className='absolute inset-0 overflow-hidden'>
        {/* Floating particles */}
        <div className='absolute top-2 left-1/4 w-1 h-1 bg-brand-400 rounded-full animate-ping opacity-70'></div>
        <div
          className='absolute top-4 right-1/3 w-1 h-1 bg-accent-400 rounded-full animate-ping opacity-80'
          style={{ animationDelay: '0.5s' }}
        ></div>
        <div
          className='absolute bottom-2 left-1/3 w-1 h-1 bg-brand-300 rounded-full animate-ping opacity-60'
          style={{ animationDelay: '1s' }}
        ></div>
        <div
          className='absolute bottom-4 right-1/4 w-1 h-1 bg-accent-300 rounded-full animate-ping opacity-90'
          style={{ animationDelay: '1.5s' }}
        ></div>

        {/* Energy streams */}
        <div className='absolute left-0 top-1/2 w-1 h-6 bg-gradient-to-b from-transparent via-brand-400/40 to-transparent animate-pulse opacity-50'></div>
        <div className='absolute right-0 top-1/2 w-1 h-4 bg-gradient-to-b from-transparent via-accent-400/40 to-transparent animate-pulse opacity-60'></div>
      </div>

      <div className='relative z-10 container mx-auto px-4 py-4'>
        <div className='flex items-center justify-between'>
          {/* Left side - Icon and main message */}
          <div className='flex items-center space-x-4'>
            {/* Animated Nexus logo */}
            <div className='relative'>
              <Image
                src='/images/logo/logoicon.png'
                alt='Nexus Logo'
                width={32}
                height={32}
                className='animate-pulse'
              />
              <div className='absolute -top-1 -right-1 w-3 h-3 bg-accent-400 rounded-full animate-ping opacity-70'></div>
            </div>

            {/* Main message */}
            <div className='flex flex-col'>
              <h3 className='text-white font-bold text-sm md:text-base'>
                🚀 Unlock Your Full Potential!
              </h3>
              <p className='text-white/80 text-xs md:text-sm'>
                Create an account to track your progress, earn badges, and unlock exclusive rewards
              </p>
            </div>
          </div>

          {/* Right side - Action buttons */}
          <div className='flex items-center space-x-3'>
            {isConnected && walletData?.publicKey ? (
              <>
                {/* Sign Up Button */}
                <button
                  onClick={onSignUpClick}
                  className='px-4 py-2 bg-gradient-to-r from-brand-500 to-accent-500 hover:from-brand-600 hover:to-accent-600 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border border-white/20 hover:border-white/40 text-sm'
                >
                  <div className='flex items-center space-x-2'>
                    <span>✨</span>
                    <span>Create Account</span>
                  </div>
                </button>

                {/* Sign In Button */}
                <button
                  onClick={onSignInClick}
                  className='px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 border border-white/20 hover:border-white/40 text-sm'
                >
                  <div className='flex items-center space-x-2'>
                    <span>🔑</span>
                    <span>Sign In</span>
                  </div>
                </button>
              </>
            ) : (
              <div className='text-center'>
                <p className='text-white/70 text-xs mb-2'>Connect your wallet first</p>
                <div className='flex items-center space-x-2 text-brand-300'>
                  <div className='w-2 h-2 bg-brand-400 rounded-full animate-pulse'></div>
                  <span className='text-xs'>Wallet Required</span>
                </div>
              </div>
            )}

            {/* Dismiss button */}
            <button
              onClick={() => setIsDismissed(true)}
              className='p-2 text-white/60 hover:text-white/80 hover:bg-white/10 rounded-lg transition-all duration-200'
              title='Dismiss banner'
            >
              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Additional info for connected users */}
        {isConnected && walletData?.publicKey && (
          <div className='mt-3 pt-3 border-t border-white/10'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-4 text-xs text-white/70'>
                <div className='flex items-center space-x-1'>
                  <span>🎯</span>
                  <span>Track demo progress</span>
                </div>
                <div className='flex items-center space-x-1'>
                  <span>🏆</span>
                  <span>Earn NFT badges</span>
                </div>
                <div className='flex items-center space-x-1'>
                  <span>⭐</span>
                  <span>Unlock rewards</span>
                </div>
              </div>

              <div className='text-xs text-brand-300'>
                Wallet: {walletData.publicKey.slice(0, 8)}...{walletData.publicKey.slice(-6)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
