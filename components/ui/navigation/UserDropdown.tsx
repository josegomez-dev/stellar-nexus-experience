'use client';

import { useState, useRef, useEffect } from 'react';
import { useGlobalWallet } from '@/contexts/WalletContext';
import { useAuth } from '@/contexts/AuthContext';
import { appConfig, stellarConfig } from '@/lib/wallet-config';
import { UserAvatar } from './UserAvatar';
import { generateFunnyName } from '@/lib/funny-name-generator';
import { useToast } from '@/contexts/ToastContext';
import Image from 'next/image';

export const UserDropdown = () => {
  const { isConnected, walletData, disconnect, connect, isFreighterAvailable } = useGlobalWallet();
  const { isAuthenticated, user, getUserStats, updateUser } = useAuth();
  const { addToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
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
    // Use funny name generator for more engaging names
    return generateFunnyName(address);
  };

  const displayName = 
    isAuthenticated && user 
      ? (user.customName || user.username) 
      : (() => {
          // Check localStorage for profile data if wallet is connected
          if (walletData?.publicKey) {
            try {
              const profileData = localStorage.getItem(`profile_${walletData.publicKey}`);
              if (profileData) {
                const parsed = JSON.parse(profileData);
                if (parsed.customName) return parsed.customName;
              }
            } catch (error) {
              console.error('Error reading profile data:', error);
            }
          }
          return generateDisplayName(walletData?.publicKey || '');
        })();
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

  const handleAutoGenerate = async () => {
    if (!walletData?.publicKey) {
      addToast({
        type: 'error',
        title: 'No Wallet Connected',
        message: 'Please connect your wallet first',
        duration: 3000,
      });
      return;
    }

    setIsGenerating(true);
    try {
      // Generate new funny name
      const newName = generateFunnyName(walletData.publicKey + Date.now().toString());
      
      // Generate new avatar seed
      const newAvatarSeed = Date.now().toString() + Math.random().toString();

      if (user) {
        // Update existing user
        await updateUser({
          customName: newName,
          avatarSeed: newAvatarSeed,
        });
      } else {
        // Store in localStorage for non-authenticated users
        const profileData = {
          customName: newName,
          avatarSeed: newAvatarSeed,
          walletAddress: walletData.publicKey,
        };
        localStorage.setItem(`profile_${walletData.publicKey}`, JSON.stringify(profileData));
      }

      addToast({
        type: 'success',
        title: '🎉 Profile Updated!',
        message: `Your new name is: ${newName}`,
        duration: 3000,
      });

      // Keep dropdown open to show the updated profile
    } catch (error) {
      console.error('Error updating profile:', error);
      addToast({
        type: 'error',
        title: '❌ Update Failed',
        message: 'Failed to update profile. Please try again.',
        duration: 3000,
      });
    } finally {
      setIsGenerating(false);
    }
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
                    <button
                  onClick={handleAutoGenerate}
                  disabled={isGenerating}
                  className='w-full flex items-center space-x-3 px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  <span className='text-lg'>
                    {isGenerating ? (
                      <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                    ) : (
                      '🎲'
                    )}
                  </span>
                  <span>{isGenerating ? 'Generating...' : 'Customize Profile'}</span>
                </button>
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
                <a
                  href='/'
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

                <a
                  href='/mini-games'
                  className='w-full flex items-center space-x-3 px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200 text-sm'
                >
                  <span className='text-lg'>
                    <Image
                      src='/images/icons/console.png'
                      alt='Web3 Playground'
                      width={50}
                      height={20}
                    />
                  </span>
                  <span>Nexus Web3 Playground</span>
                </a>

                <hr />

                <a
                  href='/docs'
                  className='w-full flex items-center space-x-3 px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200 text-sm'
                >
                  <span className='text-lg'>📚</span>
                  <span>Documentation</span>
                </a>
                
                <a
                  href='/docs'
                  className='w-full flex items-center space-x-3 px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200 text-sm'
                >
                  <span className='text-lg'>📊</span>
                  <span>Analytics</span>
                </a>

                <hr />

                <button
                  onClick={() => {
                    // Dispatch custom event to open rewards sidebar
                    window.dispatchEvent(new CustomEvent('toggleRewardsSidebar'));
                    setIsOpen(false);
                  }}
                  className='w-full flex items-center space-x-3 px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200 text-sm'
                >
                  <span className='text-lg'>🎮</span>
                  <span>Rewards & Progress</span>
                </button>

                <hr />

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
