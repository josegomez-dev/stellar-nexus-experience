'use client';

import { useState } from 'react';
import { useGlobalWallet } from '@/contexts/WalletContext';
import { useAccount } from '@/contexts/AccountContext';
import { appConfig, stellarConfig } from '@/lib/wallet-config';
import { Tooltip } from '@/components/ui/Tooltip';
import { UserDropdown } from '@/components/ui/UserDropdown';
import { NetworkIndicator } from '@/components/ui/NetworkIndicator';
import { RewardsSidebar } from '@/components/ui/RewardsSidebar';
import Image from 'next/image';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRewardsOpen, setIsRewardsOpen] = useState(false);
  const { isConnected } = useGlobalWallet();
  const { account, loading } = useAccount();

  return (
    <header className='bg-white/10 backdrop-blur-md fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-white/10 shadow-lg'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          {/* Logo and App Name */}
          <div className='flex items-center space-x-1'>
            <div className='flex items-center space-x-2'>
              <a href='/' className='hover:opacity-80 transition-opacity duration-300'>
                <Image
                  src='/images/logo/iconletter.png'
                  alt='STELLAR NEXUS'
                  width={80}
                  height={24}
                />
              </a>
              <span className='font-bold'>Web3 Experience</span>
              <p className='text-xs text-white/60'>v{appConfig.version}</p>
            </div>
          </div>

          {/* Header Controls */}
          <div className='flex items-center space-x-4'>
            {/* Account Status - Show when connected */}
            {isConnected && (
              <div className="flex items-center space-x-2">
                {account ? (
                  <>
                    {/* Account Info */}
                    <div className="hidden sm:flex items-center space-x-2 bg-white/10 rounded-lg px-3 py-1">
                      <span className="text-xs text-white/70">Points:</span>
                      <span className="text-sm font-semibold text-green-400">
                        {account.profile.totalPoints}
                      </span>
                      <span className="text-xs text-white/70">Level:</span>
                      <span className="text-sm font-semibold text-blue-400">
                        {account.profile.level}
                      </span>
                    </div>
                    
                    {/* Rewards Button */}
                    <Tooltip content="View Rewards & Progress">
                      <button
                        onClick={() => setIsRewardsOpen(true)}
                        className='relative p-2 text-white/80 hover:text-white transition-colors'
                      >
                        <span className='text-xl'>🎮</span>
                        {account.profile.totalPoints > 0 && (
                          <span className='absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center'>
                            {account.profile.totalPoints}
                          </span>
                        )}
                      </button>
                    </Tooltip>
                  </>
                ) : loading ? (
                  <div className="flex items-center space-x-2 bg-white/10 rounded-lg px-3 py-1">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span className="text-xs text-white/70">Setting up account...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 bg-white/10 rounded-lg px-3 py-1">
                    <span className="text-xs text-white/70">No account</span>
                  </div>
                )}
              </div>
            )}


            {/* Network Indicator */}
            <div className='hidden sm:flex items-center'>
              <NetworkIndicator className='scale-90' showSwitchButton={true} />
            </div>

            {/* User Dropdown */}
            <UserDropdown />

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className='md:hidden text-white/80 hover:text-white transition-colors'
            >
              {isMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className='md:hidden absolute top-full left-0 right-0 bg-white/10 backdrop-blur-md border-t border-white/20 shadow-xl z-50'>
          <div className='px-2 pt-2 pb-3 space-y-1'>
            <a
              href='/demos'
              className='block px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-md transition-colors'
              onClick={() => setIsMenuOpen(false)}
            >
              <div className='flex items-center space-x-2'>
                <Image
                  src='/images/icons/demos.png'
                  alt='Demos'
                  width={20}
                  height={20}
                  className='w-5 h-5'
                />
                <span>Demos</span>
              </div>
            </a>
            <a
              href='/mini-games'
              className='block px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-md transition-colors'
              onClick={() => setIsMenuOpen(false)}
            >
              <div className='flex items-center space-x-2'>
                <Image
                  src='/images/icons/store.png'
                  alt='Store'
                  width={20}
                  height={20}
                  className='w-5 h-5'
                />
                <span>Store</span>
              </div>
            </a>
            <a
              href='/mini-games/web3-basics-adventure'
              className='block px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-md transition-colors'
              onClick={() => setIsMenuOpen(false)}
            >
              <div className='flex items-center space-x-2'>
                <Image
                  src='/images/icons/console.png'
                  alt='Console'
                  width={20}
                  height={20}
                  className='w-5 h-5'
                />
                <span>Console</span>
              </div>
            </a>

            <a
              href='/docs'
              className='block px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-md transition-colors'
              onClick={() => setIsMenuOpen(false)}
            >
              <div className='flex items-center space-x-2'>
                <Image
                  src='/images/icons/docs.png'
                  alt='Docs'
                  width={20}
                  height={20}
                  className='w-5 h-5'
                />
                <span>Docs</span>
              </div>
            </a>
          </div>
        </div>
      )}

      {/* Rewards Sidebar */}
      <RewardsSidebar 
        isOpen={isRewardsOpen} 
        onClose={() => setIsRewardsOpen(false)} 
      />
    </header>
  );
};
