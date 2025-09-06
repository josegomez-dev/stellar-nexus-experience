'use client';

import { useState, useRef, useEffect } from 'react';
import { useGlobalWallet } from '@/contexts/WalletContext';
import { useAuth } from '@/contexts/AuthContext';
import { appConfig, stellarConfig } from '@/lib/wallet-config';
import { UserAvatar } from './UserAvatar';
import Image from 'next/image';

export const UserDropdown = () => {
  const { isConnected, walletData, disconnect, connect, isFreighterAvailable } = useGlobalWallet();
  const { isAuthenticated, user, getUserStats } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Generate display name from wallet address or user data
  const generateDisplayName = (address: string) => {
    if (!address) return 'Guest User';
    const last8 = address.slice(-8);
    const word1 = last8.slice(0, 4);
    const word2 = last8.slice(4, 8);
    return `${word1.charAt(0).toUpperCase()}${word1.slice(1)} ${word2.charAt(0).toUpperCase()}${word2.slice(1)}`;
  };

  const displayName =
    isAuthenticated && user ? user.username : generateDisplayName(walletData?.publicKey || '');
  const stats = getUserStats();

  const handleDisconnect = () => {
    disconnect();
    setIsOpen(false);
  };

  const copyWalletAddress = () => {
    if (walletData?.publicKey) {
      navigator.clipboard.writeText(walletData.publicKey);
      // You could add a toast notification here
    }
  };

  const handleUserProfile = () => {
    // Dispatch custom event to open user profile modal
    window.dispatchEvent(new CustomEvent('openUserProfile'));
    setIsOpen(false);
  };

  return (
    <div className='relative' ref={dropdownRef}>
      {/* Avatar Button */}
      <UserAvatar onClick={() => setIsOpen(!isOpen)} size='md' showStatus={true} />

      {/* Dropdown Menu */}
      {isOpen && (
        <div className='absolute right-0 mt-2 w-64 bg-black/80 backdrop-blur-2xl border border-white/30 rounded-2xl shadow-2xl z-50 overflow-hidden'>
          {/* Enhanced background blur overlay */}
          <div className='absolute inset-0 bg-gradient-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-3xl'></div>
          <div className='absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/20'></div>
          {/* Header */}
          <div className='relative z-10 p-4 border-b border-white/10'>
            <div className='flex items-center space-x-3'>
              <UserAvatar size='lg' showStatus={false} />
              <div className='flex-1 min-w-0'>
                <h3 className='text-white font-semibold text-sm truncate'>{displayName}</h3>
                <p className='text-white/60 text-xs truncate'>
                  {isConnected
                    ? `${walletData?.publicKey?.slice(0, 6)}...${walletData?.publicKey?.slice(-4)}`
                    : 'Not Connected'}
                </p>
                {isAuthenticated && (
                  <div className='flex items-center space-x-2 mt-1'>
                    <span className='text-brand-300 text-xs'>Level {stats.level}</span>
                    <span className='text-white/50 text-xs'>•</span>
                    <span className='text-accent-300 text-xs'>
                      {stats.totalDemosCompleted} demos
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Network Status */}
          <div className='relative z-10 px-4 py-2 border-b border-white/10'>
            <div className='flex items-center justify-between'>
              <span className='text-white/60 text-xs'>Network:</span>
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  stellarConfig.network === 'TESTNET'
                    ? 'bg-warning-500/30 text-warning-200 border border-warning-400/30'
                    : 'bg-success-500/30 text-success-200 border border-success-400/30'
                }`}
              >
                {stellarConfig.network}
              </span>
            </div>
          </div>

          {/* Menu Items */}
          <div className='relative z-10 p-2'>
            {isConnected ? (
              <>
                {isAuthenticated && (
                  <button
                    onClick={handleUserProfile}
                    className='w-full flex items-center space-x-3 px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200 text-sm'
                  >
                    <span className='text-lg'>👤</span>
                    <span>View Profile</span>
                  </button>
                )}

                <a
                  href='/demos'
                  className='w-full flex items-center space-x-3 px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200 text-sm'
                >
                  <span className='text-lg'>
                    <Image
                      src='/images/icons/demos.png'
                      alt='Web3 Playground'
                      width={50}
                      height={20}
                    />
                  </span>
                  <span>Stellar Nexus Experience</span>
                </a>

                <button
                  disabled
                  className='w-full flex items-center justify-between px-3 py-2 text-gray-400 cursor-not-allowed rounded-lg transition-colors duration-200 text-sm relative'
                  title='Nexus Web3 Playground coming soon!'
                >
                  <div className='flex items-center space-x-3'>
                    <span className='text-lg'>
                      <Image
                        src='/images/icons/console.png'
                        alt='Web3 Playground'
                        width={50}
                        height={20}
                        className='opacity-50 grayscale'
                      />
                    </span>
                    <span>Nexus Web3 Playground</span>
                  </div>
                  <span className='text-xs bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 rounded-full font-medium'>
                    Coming Soon
                  </span>
                </button>

                <hr />

                <button
                  onClick={copyWalletAddress}
                  className='w-full flex items-center space-x-3 px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200 text-sm'
                >
                  <span className='text-lg'>📋</span>
                  <span>Copy Address</span>
                </button>

                <a
                  href='/docs'
                  className='w-full flex items-center space-x-3 px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200 text-sm'
                >
                  <span className='text-lg'>📚</span>
                  <span>Documentation</span>
                </a>

                <button
                  disabled
                  className='w-full flex items-center justify-between px-3 py-2 text-gray-400 cursor-not-allowed rounded-lg transition-colors duration-200 text-sm relative'
                  title='Leaderboard coming soon!'
                >
                  <div className='flex items-center space-x-3'>
                    <span className='text-lg'>🏆</span>
                    <span>Leaderboard</span>
                  </div>
                  <span className='text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full font-medium'>
                    Coming Soon
                  </span>
                </button>

                <button
                  onClick={handleDisconnect}
                  className='w-full flex items-center space-x-3 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors duration-200 text-sm'
                >
                  <span className='text-lg'>🔌</span>
                  <span>Disconnect</span>
                </button>
              </>
            ) : (
              <p className='text-white/60 text-xs'>
                Connect your wallet to access the full features of{' '}
                <span className='font-bold'>Stellar Nexus Experience</span>
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
