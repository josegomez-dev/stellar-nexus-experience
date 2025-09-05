'use client';

import { useState, useEffect } from 'react';
import { useGlobalWallet } from '@/contexts/WalletContext';
import { useTransactionHistory } from '@/contexts/TransactionContext';
import { useToast } from '@/contexts/ToastContext';
import { stellarConfig } from '@/lib/wallet-config';
import { Tooltip } from './Tooltip';
import Image from 'next/image';
import { Web3OnboardingModal } from './Web3OnboardingModal';
import { NetworkIndicator } from './NetworkIndicator';
import { FreighterInstallationGuide } from './FreighterInstallationGuide';

interface WalletSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  showBanner?: boolean;
}

export const WalletSidebar = ({ isOpen, onToggle, showBanner = false }: WalletSidebarProps) => {
  const {
    walletData,
    isConnected,
    connect,
    connectFreighter,
    connectManualAddress,
    disconnect,
    isFreighterAvailable,
    openWalletModal,
  } = useGlobalWallet();
  const { getRecentTransactions, transactions } = useTransactionHistory();
  const { addToast } = useToast();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isNewWindow, setIsNewWindow] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [manualAddress, setManualAddress] = useState('');
  const [showTransactionHistory, setShowTransactionHistory] = useState(false);
  const [showWeb3Help, setShowWeb3Help] = useState(true);
  const [showWeb3Modal, setShowWeb3Modal] = useState(false);
  const [hasShownWeb3Modal, setHasShownWeb3Modal] = useState(false);
  const [showFreighterGuide, setShowFreighterGuide] = useState(false);

  // Stellar address validation function
  const isValidStellarAddress = (address: string): boolean => {
    // Stellar addresses start with 'G' and are 56 characters long
    const stellarAddressRegex = /^G[A-Z2-7]{55}$/;
    return stellarAddressRegex.test(address.trim());
  };

  // Get recent transactions
  const recentTransactions = getRecentTransactions(5);

  // Dispatch custom event to move main content
  useEffect(() => {
    const event = new CustomEvent('walletSidebarToggle', {
      detail: { isOpen, isExpanded },
    });
    window.dispatchEvent(event);
  }, [isOpen, isExpanded]);

  // Dispatch wallet state change events
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('walletStateChanged', {
          detail: {
            isConnected,
            walletData,
            isFreighterAvailable,
          },
        })
      );
    }
  }, [isConnected, walletData, isFreighterAvailable]);

  // Handle escape key to close sidebar and custom event to open
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onToggle();
      }
    };

    const handleToggleWallet = () => {
      onToggle();
    };

    const handleExpandWallet = () => {
      setIsExpanded(true);
    };

    document.addEventListener('keydown', handleEscape);
    window.addEventListener('toggleWalletSidebar', handleToggleWallet);
    window.addEventListener('expandWalletSidebar', handleExpandWallet);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      window.removeEventListener('toggleWalletSidebar', handleToggleWallet);
      window.removeEventListener('expandWalletSidebar', handleExpandWallet);
    };
  }, [isOpen, onToggle]);

  // Auto-show Web3 modal when sidebar opens for the first time
  useEffect(() => {
    if (isOpen && !isConnected && !hasShownWeb3Modal && !isFreighterAvailable) {
      const timer = setTimeout(() => {
        setShowWeb3Modal(true);
        setHasShownWeb3Modal(true);
      }, 500); // Small delay to let sidebar animation complete

      return () => clearTimeout(timer);
    }
  }, [isOpen, isConnected, hasShownWeb3Modal, isFreighterAvailable]);

  // Track if user manually opened the sidebar (to prevent auto-close conflicts)
  const [userOpened, setUserOpened] = useState(false);

  // Auto-close sidebar when wallet is disconnected (but allow manual opening)
  useEffect(() => {
    if (!isConnected && isOpen && !userOpened) {
      // Add a small delay to prevent race conditions with button clicks
      const timer = setTimeout(() => {
        onToggle();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isConnected, isOpen, userOpened, onToggle]);

  // Reset userOpened when sidebar closes
  useEffect(() => {
    if (!isOpen) {
      setUserOpened(false);
    }
  }, [isOpen]);

  // Open mini games store in new window
  const redirectToNexusStartersLiveApp = () => {
    const width = 1200;
    const height = 800;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;

    const newWindow = window.open(
      'https://nexus-starter.vercel.app/',
      'Nexus Starters',
      `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
    );

    if (newWindow) {
      setIsNewWindow(true);
      newWindow.onbeforeunload = () => setIsNewWindow(false);
    }
  };

  const copyAddress = () => {
    if (walletData?.publicKey) {
      navigator.clipboard.writeText(walletData.publicKey);
      // Show temporary success message
      const button = document.getElementById('copy-address-btn');
      if (button) {
        const originalHTML = button.innerHTML;
        button.innerHTML = `
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        `;
        button.classList.add('bg-success-500/20', 'text-success-200', 'border-success-400/50');
        setTimeout(() => {
          button.innerHTML = originalHTML;
          button.classList.remove('bg-success-500/20', 'text-success-200', 'border-success-400/50');
        }, 2000);
      }
    }
  };

  const formatBalance = (balance: string) => {
    const num = parseFloat(balance) / 1000000; // Convert from Stellar units
    return num.toFixed(2);
  };

  const getNetworkColor = () => {
    return stellarConfig.network === 'TESTNET'
      ? 'from-warning-500 to-warning-400'
      : 'from-success-500 to-success-400';
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className='fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden'
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed top-0 right-0 h-full z-50 transform transition-all duration-500 ease-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        ${isExpanded ? 'w-96' : 'w-20'}
        bg-gradient-to-b from-slate-900/98 to-slate-800/98 backdrop-blur-2xl
        border-l border-white/30 shadow-2xl
        ${isExpanded ? 'shadow-[-20px_0_60px_rgba(0,0,0,0.8)]' : 'shadow-[-10px_0_30px_rgba(0,0,0,0.6)]'}
      `}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between border-b border-white/20 transition-all duration-300 ${
            isExpanded ? 'p-4' : 'p-2'
          }`}
        >
          <div className='flex items-center space-x-1'>
            {/* <div className={`bg-gradient-to-br from-brand-500 to-accent-600 rounded-lg flex items-center justify-center shadow-lg transition-all duration-300 ${
              isExpanded ? 'w-8 h-8' : 'w-6 h-6'
            }`}>
              <Image 
                src="/images/logo/logoicon.png"
                alt="STELLAR NEXUS"
                width={isExpanded ? 32 : 24}
                height={isExpanded ? 32 : 24}
                className="w-full h-full"
              />
            </div> */}
            {isExpanded && (
              <div className='animate-fadeIn flex items-center space-x-2'>
                <Image
                  src='/images/logo/iconletter.png'
                  alt='STELLAR NEXUS'
                  width={80}
                  height={16}
                />
                <span className='text-xs text-white/60'>Wallet</span>
              </div>
            )}
          </div>

          <div className='flex items-center space-x-2'>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={`text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300 hover:scale-110 ${
                isExpanded ? 'p-2' : 'p-1.5'
              }`}
              title={isExpanded ? 'Collapse' : 'Expand'}
            >
              <div
                className={`transform transition-transform duration-300 ${!isExpanded ? 'rotate-180' : 'rotate-0'}`}
              >
                ▶
              </div>
            </button>
          </div>
        </div>

        {/* Content */}
        <div
          className={`flex-1 transition-all duration-300 overflow-y-auto ${isExpanded ? 'p-4' : 'p-2'}`}
          style={{ minHeight: '400px', maxHeight: 'calc(100vh - 200px)' }}
        >
          {/* Close Button - Positioned in bottom right corner */}
          <button
            onClick={onToggle}
            className='absolute bottom-8 right-4 w-8 h-8 bg-gradient-to-br from-red-500/80 to-pink-600/80 hover:from-red-500 to-pink-600 text-white rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 hover:shadow-xl border border-white/20 flex items-center justify-center group z-10'
            title='Close Wallet'
          >
            <span className='text-lg font-bold group-hover:scale-110 transition-transform duration-200'>
              ×
            </span>
          </button>

          {!isConnected ? (
            // Not Connected State
            <div className={isExpanded ? 'text-center' : 'text-center py-2'}>
              <div
                className={`${isExpanded ? 'w-16 h-16' : 'w-10 h-10'} bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-500`}
              >
                <span className={isExpanded ? 'text-2xl' : 'text-lg'}>🔐</span>
              </div>

              {isExpanded && (
                <div className='animate-fadeIn'>
                  <h3 className='font-semibold text-white mb-2'>Connect Wallet</h3>
                  <p className='hidden sm:block text-white/70 text-sm mb-6'>
                    Connect your Stellar wallet to start using the demos
                  </p>
                </div>
              )}
              

              <div className={`space-y-3 ${!isExpanded ? 'space-y-2' : ''}`}>
                {/* Freighter Connect Button */}
                {isFreighterAvailable ? (
                  <button
                    onClick={async () => {
                      setIsConnecting(true);
                      try {
                        await connect(); // Connect to Freighter
                        if (!isExpanded) {
                          setIsExpanded(true); // Auto-expand if collapsed
                        }
                      } finally {
                        setIsConnecting(false);
                      }
                    }}
                    disabled={isConnecting}
                    className={`w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                      isExpanded ? 'px-4 py-3' : 'px-2 py-2.5'
                    }`}
                    title={!isExpanded ? 'Connect Freighter' : undefined}
                  >
                    <span className='text-lg'>🔗</span>
                    {isExpanded && (
                      <span className='ml-2 animate-fadeIn'>
                        {isConnecting ? 'Connecting...' : 'Connect Freighter'}
                      </span>
                    )}
                  </button>
                ) : (
                  // Fallback button when Freighter is not available
                  <button
                    onClick={async () => {
                      setIsConnecting(true);
                      try {
                        // Try to connect anyway (might work with fallback)
                        await connect();
                        if (!isExpanded) {
                          setIsExpanded(true);
                        }
                      } catch (error) {
                        console.log('Freighter connection failed, opening manual input');
                        // If Freighter fails, just expand for manual input
                        setIsExpanded(true);
                      } finally {
                        setIsConnecting(false);
                      }
                    }}
                    disabled={isConnecting}
                    className={`w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                      isExpanded ? 'px-4 py-3' : 'px-2 py-2.5'
                    }`}
                    title={!isExpanded ? 'Connect Wallet' : undefined}
                  >
                    <span className='text-lg'>🔗</span>
                    {isExpanded && (
                      <span className='ml-2 animate-fadeIn'>
                        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                      </span>
                    )}
                  </button>
                )}


                {/* Multi-Wallet Button */}
                {isExpanded && (
                  <div className='space-y-2'>
                    
                    <button
                      onClick={async () => {
                        setIsConnecting(true);
                        try {
                          await openWalletModal(); // Use Stellar Wallets Kit modal
                        } catch (error) {
                          console.error('Failed to open wallet modal:', error);
                          addToast({
                            type: 'error',
                            title: 'Wallet Connection Error',
                            message: 'Failed to open wallet selection modal',
                            duration: 5000,
                          });
                        } finally {
                          setIsConnecting(false);
                        }
                      }}
                      disabled={isConnecting}
                      className='w-full px-3 py-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                      {isConnecting ? '🔄 Opening...' : '🎯 Multi-Wallet'}
                    </button>
                    
                  </div>
                )}
               
                {/* Manual Address Input */}
                {isExpanded && (
                  <div className='space-y-2'>
                    <div className='text-center'>
                      <p className='hidden sm:block text-xs text-white/60 mb-2'>
                        Or enter wallet address manually:
                      </p>
                    </div>
                    <input
                      type='text'
                      value={manualAddress}
                      onChange={e => setManualAddress(e.target.value)}
                      onKeyPress={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (!manualAddress.trim()) {
                            addToast({
                              type: 'warning',
                              title: 'Empty Address',
                              message: 'Please enter a Stellar wallet address',
                              duration: 4000,
                            });
                            return;
                          }

                          if (!isValidStellarAddress(manualAddress)) {
                            addToast({
                              type: 'error',
                              title: 'Invalid Stellar Address',
                              message:
                                'Please enter a valid Stellar address starting with "G" and 56 characters long',
                              duration: 6000,
                            });
                            return;
                          }

                          // Trigger the connect button click
                          const target = e.target as HTMLInputElement;
                          const connectButton = target.parentElement?.querySelector('button');
                          if (connectButton) {
                            connectButton.click();
                          }
                        }
                      }}
                      placeholder='G... (Stellar address)'
                      className={`w-full px-3 py-2 bg-white/10 border rounded-lg text-white placeholder-white/40 text-sm focus:outline-none transition-colors ${
                        manualAddress.trim() && !isValidStellarAddress(manualAddress)
                          ? 'border-red-400 focus:border-red-400'
                          : 'border-white/20 focus:border-cyan-400'
                      }`}
                    />
                    {manualAddress.trim() && !isValidStellarAddress(manualAddress) && (
                      <p className='text-xs text-red-400 animate-fadeIn'>
                        ⚠️ Invalid Stellar address format
                      </p>
                    )}
                    {manualAddress.trim() && isValidStellarAddress(manualAddress) && (
                      <p className='text-xs text-green-400 animate-fadeIn'>
                        ✅ Valid Stellar address format
                      </p>
                    )}
                    <button
                      onClick={async () => {
                        if (!manualAddress.trim()) {
                          addToast({
                            type: 'warning',
                            title: 'Empty Address',
                            message: 'Please enter a Stellar wallet address',
                            duration: 4000,
                          });
                          return;
                        }

                        if (!isValidStellarAddress(manualAddress)) {
                          addToast({
                            type: 'error',
                            title: 'Invalid Stellar Address',
                            message:
                              'Please enter a valid Stellar address starting with "G" and 56 characters long',
                            duration: 6000,
                          });
                          return;
                        }

                        setIsConnecting(true);
                        try {
                          await connectManualAddress(manualAddress.trim());
                          setManualAddress('');
                          addToast({
                            type: 'success',
                            title: 'Wallet Connected',
                            message: 'Successfully connected to manual Stellar address',
                            duration: 4000,
                          });
                        } catch (error) {
                          addToast({
                            type: 'error',
                            title: 'Connection Failed',
                            message: 'Failed to connect to the provided wallet address',
                            duration: 6000,
                          });
                        } finally {
                          setIsConnecting(false);
                        }
                      }}
                      disabled={isConnecting || !manualAddress.trim()}
                      className='w-full px-3 py-2 bg-white/20 hover:bg-white/30 border border-white/30 text-white text-sm rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                      {isConnecting ? '🔄 Connecting...' : '🔗 Connect Manual Address'}
                    </button>
                  </div>
                )}

                {/* Navigation Links */}
                <div
                  className={`${
                    isExpanded ? 'grid grid-cols-2 gap-2' : 'flex flex-col space-y-1.5'
                  }`}
                >
                  <Tooltip
                    content={
                      <div>
                        <p className='text-white/90 text-sm font-medium'>Interactive Demo Suite</p>
                        <p className='text-cyan-300 text-xs mt-1'>
                          Experience trustless escrow workflows
                        </p>
                      </div>
                    }
                    position='bottom'
                  >
                    {isConnected ? (
                      <a
                        href='/demos'
                        className={`bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm rounded-lg transition-all duration-300 hover:border-white/40 flex items-center justify-center ${
                          isExpanded ? 'px-3 py-2' : 'px-2 py-2'
                        }`}
                      >
                        <Image src='/images/icons/demos.png' alt='Demos' width={50} height={20} />
                      </a>
                    ) : (
                      <div
                        className={`bg-gray-500/30 border border-gray-400/30 text-gray-400 text-sm rounded-lg cursor-not-allowed blur-[1px] opacity-70 relative flex items-center justify-center ${
                          isExpanded ? 'px-3 py-2' : 'px-2 py-2'
                        }`}
                        title='Connect wallet to access Demos'
                      >
                        <Image src='/images/icons/demos.png' alt='Demos' width={50} height={20} />
                        <div className='absolute top-1 right-1'>
                          <span className='text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full'>🔒</span>
                        </div>
                      </div>
                    )}
                  </Tooltip>

                  <Tooltip
                    content={
                      <div>
                        <p className='text-white/90 text-sm font-medium'>Mini-Games Collection</p>
                        <p className='text-purple-300 text-xs mt-1'>
                          Learn Web3 through interactive games
                        </p>
                      </div>
                    }
                    position='bottom'
                  >
                    <div className="relative">
                      <div
                        className={`bg-gray-500/30 border border-gray-400/30 text-gray-400 text-sm rounded-lg cursor-not-allowed blur-[1px] opacity-70 relative flex items-center justify-center ${
                          isExpanded ? 'px-3 py-2' : 'px-2 py-2'
                        }`}
                        title='Coming Soon - Web3 Playground under development'
                      >
                        <Image src='/images/icons/console.png' alt='Store' width={50} height={20} />
                      </div>
                      
                      {/* Coming Soon Badge */}
                      <div className='absolute -top-1 -right-1 z-10'>
                        <div className='bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-0.5 rounded-full font-bold text-xs shadow-lg animate-pulse border border-white'>
                          🚧
                        </div>
                      </div>
                    </div>
                  </Tooltip>
                </div>
              </div>
<br />
<hr />
<br />
               {/* Web3 Help Button */}
 {isExpanded && !isFreighterAvailable && (
                  <div className="space-y-2">
                    <button
                      onClick={() => setShowFreighterGuide(true)}
                      className='w-full p-3 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-400/30 text-orange-200 rounded-lg transition-all duration-300 hover:from-orange-500/30 hover:to-red-500/30 hover:border-orange-400/50'
                    >
                      <div className='flex items-center justify-center space-x-2'>
                        <span className='text-lg'>🔗</span>
                        <span className='text-sm font-medium'>Install Freighter Wallet</span>
                      </div>
                    </button>
                    
                    <button
                      onClick={() => setShowWeb3Modal(true)}
                      className='w-full p-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 text-blue-200 rounded-lg transition-all duration-300 hover:from-blue-500/30 hover:to-purple-500/30 hover:border-blue-400/50'
                    >
                      <div className='flex items-center justify-center space-x-2'>
                        <div className='bg-transparent flex items-center justify-center border-2 border-white/20 rounded-full bg-gradient-to-r from-cyan-400/20 to-purple-400/20'>
                          <img
                            src='/images/character/nexus-prime-chat.png'
                            className='rounded-full '
                            alt='STELLAR NEXUS'
                            width={50}
                            height={50}
                          />
                        </div>
                        <span className='text-sm font-medium'>New to Web3? Start Here!</span>
                      </div>
                    </button>
                  </div>
                )}



              {/* Network Info - Only show when expanded */}
              {isExpanded && (
                <div className='mt-6 p-3 bg-white/5 rounded-lg border border-white/10 animate-fadeIn'>
                  <div className='flex items-center justify-center space-x-2 mb-2'>
                    <div
                      className={`w-2 h-2 bg-gradient-to-r ${getNetworkColor()} rounded-full animate-pulse`}
                    ></div>
                    <span className='text-xs text-white/60'>Network</span>
                  </div>
                  <span
                    className={`text-sm font-medium bg-gradient-to-r ${getNetworkColor()} bg-clip-text text-transparent`}
                  >
                    {stellarConfig.network}
                  </span>
                </div>
              )}
            </div>
          ) : (
            // Connected State
            <div className={`space-y-4 ${!isExpanded ? 'space-y-3' : ''}`}>
              {/* Wallet Info */}
              <div
                className={`bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg border border-green-400/30 shadow-lg transition-all duration-300 ${
                  isExpanded ? 'p-4' : 'p-3'
                }`}
              >
                <div className='flex items-center space-x-3 mb-3'>
                  <div className='w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg'></div>
                  {isExpanded && (
                    <span className='text-green-300 text-sm font-medium animate-fadeIn'>
                      Connected
                    </span>
                  )}
                </div>

                <div className={`space-y-3 ${!isExpanded ? 'space-y-2' : ''}`}>
                  <div>
                    {isExpanded && (
                      <p className='text-xs text-white/60 mb-1 animate-fadeIn'>Wallet Address</p>
                    )}
                    <div className='flex items-center space-x-2'>
                      <code
                        className={`text-green-300 bg-green-900/30 px-2 py-1 rounded flex-1 font-mono transition-all duration-300 truncate ${
                          isExpanded ? 'text-xs' : 'text-xs text-center'
                        }`}
                      >
                        {isExpanded
                          ? `${walletData?.publicKey?.slice(0, 8)}...${walletData?.publicKey?.slice(-8)}`
                          : `${walletData?.publicKey?.slice(0, 4)}...${walletData?.publicKey?.slice(-4)}`}
                      </code>
                      {isExpanded && (
                        <button
                          id='copy-address-btn'
                          onClick={copyAddress}
                          className='flex-shrink-0 text-green-300 hover:text-green-200 hover:bg-green-500/20 rounded transition-all duration-300 hover:scale-110 border border-green-400/30 hover:border-green-400/50 p-1.5'
                          title='Copy address'
                        >
                          <Image
                            src='/images/icons/copy.svg'
                            alt='Copy address'
                            width={12}
                            height={12}
                            className='w-full h-full'
                          />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Network Info - Only show when expanded */}
                  {isExpanded && (
                    <div className='animate-fadeIn'>
                      <p className='text-xs text-white/60 mb-2'>Network</p>
                      <NetworkIndicator className='w-full' showSwitchButton={true} />
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className={`space-y-2 ${!isExpanded ? 'space-y-1.5' : ''}`}>
                <button
                  onClick={redirectToNexusStartersLiveApp}
                  className={`w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm rounded-lg transition-all duration-300 hover:border-white/40 flex items-center justify-center space-x-2 ${
                    isExpanded ? 'px-3 py-2' : 'px-2 py-2'
                  }`}
                  title={!isExpanded ? 'Mini Games Store' : undefined}
                >
                  <span className='text-lg'>👨🏻‍💻</span>
                  {isExpanded && <span className='animate-fadeIn'>Explore Nexus Starters</span>}
                </button>

                <button
                  onClick={redirectToNexusStartersLiveApp}
                  className={`w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm rounded-lg transition-all duration-300 hover:border-white/40 flex items-center justify-center space-x-2 ${
                    isExpanded ? 'px-3 py-2' : 'px-2 py-2'
                  }`}
                  title={!isExpanded ? 'Mini Games Store' : undefined}
                >
                  <span className='text-lg'>📚</span>
                  {isExpanded && <span className='animate-fadeIn'>Nexus Documentation</span>}
                </button>

                {/* Navigation Links */}
                <div
                  className={`${
                    isExpanded ? 'grid grid-cols-4 gap-2' : 'flex flex-col space-y-1.5'
                  }`}
                >
                  {isConnected ? (
                    <a
                      href='/demos'
                      className={`bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm rounded-lg transition-all duration-300 hover:border-white/40 flex items-center justify-center ${
                        isExpanded ? 'px-3 py-2' : 'px-2 py-2'
                      }`}
                      title={!isExpanded ? 'Demos' : undefined}
                    >
                      <Image
                        src='/images/icons/demos.png'
                        alt='Demos'
                        width={20}
                        height={20}
                        className='w-5 h-5'
                      />
                    </a>
                  ) : (
                    <div
                      className={`bg-gray-500/30 border border-gray-400/30 text-gray-400 text-sm rounded-lg cursor-not-allowed blur-[1px] opacity-70 relative flex items-center justify-center ${
                        isExpanded ? 'px-3 py-2' : 'px-2 py-2'
                      }`}
                      title={!isExpanded ? 'Connect wallet to access Demos' : undefined}
                    >
                      <Image
                        src='/images/icons/demos.png'
                        alt='Demos'
                        width={20}
                        height={20}
                        className='w-5 h-5'
                      />
                      <div className='absolute top-1 right-1'>
                        <span className='text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full'>🔒</span>
                      </div>
                    </div>
                  )}

                  <div className="relative">
                    <div
                      className={`bg-gray-500/30 border border-gray-400/30 text-gray-400 text-sm rounded-lg cursor-not-allowed blur-[1px] opacity-70 relative flex items-center justify-center ${
                        isExpanded ? 'px-3 py-2' : 'px-2 py-2'
                      }`}
                      title={!isExpanded ? 'Coming Soon - Web3 Playground' : 'Coming Soon - Web3 Playground under development'}
                    >
                      <Image
                        src='/images/icons/console.png'
                        alt='Console'
                        width={20}
                        height={20}
                        className='w-5 h-5'
                      />
                    </div>
                    
                    {/* Coming Soon Badge */}
                    <div className='absolute -top-1 -right-1 z-10'>
                      <div className='bg-gradient-to-r from-orange-500 to-red-500 text-white px-1 py-0.5 rounded-full font-bold text-xs shadow-lg animate-pulse border border-white'>
                        🚧
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={disconnect}
                  className={`w-full bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 text-red-300 text-sm rounded-lg transition-all duration-300 hover:border-red-400/50 flex items-center justify-center space-x-2 ${
                    isExpanded ? 'px-3 py-2' : 'px-2 py-2'
                  }`}
                  title={!isExpanded ? 'Disconnect' : undefined}
                >
                  <span className='text-lg'>🔌</span>
                  {isExpanded && <span className='animate-fadeIn'>Disconnect</span>}
                </button>
              </div>

              {/* Demo Status - Only show when expanded */}
              {isExpanded && (
                <div className='p-3 bg-white/5 rounded-lg border border-white/10 animate-fadeIn'>
                  <h4 className='text-white font-medium text-sm mb-3'>Demo Status</h4>
                  <div className='grid grid-cols-3 gap-2 text-xs'>
                    <div className='text-center'>
                      <div className='text-green-400 mb-1'>✅</div>
                      <span className='text-white/60'>Ready</span>
                    </div>
                    <div className='text-center'>
                      <div className='text-green-400 mb-1'>🛜</div>
                      <span className='text-white/60'>Network</span>
                    </div>
                    <div className='text-center'>
                      <div className='text-green-400 mb-1'>💳ve</div>
                      <span className='text-white/60'>{transactions.length} TX</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Transaction History - Only show when expanded */}
              {isExpanded && transactions.length > 0 && (
                <div className='p-3 bg-white/5 rounded-lg border border-white/10 animate-fadeIn'>
                  <div className='flex items-center justify-between mb-3'>
                    <h4 className='text-white font-medium text-sm'>Transaction History</h4>
                    <button
                      onClick={() => setShowTransactionHistory(!showTransactionHistory)}
                      className='text-xs text-white/60 hover:text-white/80 transition-colors'
                    >
                      {showTransactionHistory ? 'Hide' : 'Show'}
                    </button>
                  </div>

                  {showTransactionHistory && (
                    <div className='space-y-2 max-h-40 overflow-y-auto'>
                      {recentTransactions.map((tx, index) => (
                        <div
                          key={index}
                          className={`p-2 rounded-lg border text-xs ${
                            tx.status === 'success'
                              ? 'border-success-400/30 bg-success-500/10'
                              : tx.status === 'failed'
                                ? 'border-danger-400/30 bg-danger-500/10'
                                : 'border-warning-400/30 bg-warning-500/10'
                          }`}
                        >
                          <div className='flex items-center justify-between mb-1'>
                            <p
                              className={`font-medium truncate flex-1 ${
                                tx.status === 'success'
                                  ? 'text-success-300'
                                  : tx.status === 'failed'
                                    ? 'text-danger-300'
                                    : 'text-warning-300'
                              }`}
                            >
                              {tx.message}
                            </p>
                          </div>
                          <div className='flex items-center justify-between text-xs'>
                            <span className='text-white/50'>
                              {tx.timestamp.toLocaleTimeString()}
                            </span>
                            <span
                              className={`px-1.5 py-0.5 rounded text-xs ${
                                tx.status === 'success'
                                  ? 'text-success-400 bg-success-500/20'
                                  : tx.status === 'failed'
                                    ? 'text-danger-400 bg-danger-500/20'
                                    : 'text-warning-400 bg-warning-500/20'
                              }`}
                            >
                              {tx.status.toUpperCase()}
                            </span>
                          </div>
                          {tx.demoId && (
                            <div className='text-xs text-white/40 mt-1'>
                              Demo:{' '}
                              {tx.demoId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {!showTransactionHistory && transactions.length > 0 && (
                    <div className='text-center'>
                      <button
                        onClick={() => setShowTransactionHistory(true)}
                        className='text-xs text-white/60 hover:text-white/80 transition-colors underline'
                      >
                        View {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className='p-4 border-t border-white/20'>
          <div className='flex items-center justify-between text-xs text-white/40'>
            <span>v1.0.0</span>
            {isExpanded && (
              <div className='mt-4'>
                <p className='text-brand-300/70 text-sm font-medium animate-pulse'>
                  Powered by <span className='text-brand-200 font-semibold'>Trustless Work</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Wallet Control Buttons - Always show, different styling based on connection */}
      <div className='fixed top-20 right-4 z-30 flex flex-col space-y-3'>
        {/* Open Wallet Button */}
        {!isOpen && (
          <>
            {/* Mobile toggle button */}
            <button
              onClick={() => {
                setUserOpened(true);
                onToggle();
                // Auto-expand the sidebar when opening
                setTimeout(() => setIsExpanded(true), 100);
              }}
              className={`p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 lg:hidden cursor-pointer relative group ${
                isConnected
                  ? 'bg-gradient-to-br from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white'
                  : 'bg-gradient-to-br from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-gray-300'
              }`}
              title={isConnected ? 'Open Wallet' : 'Connect Wallet'}
            >
              <span className='text-xl'>{isConnected ? '🔐' : '🔌'}</span>
              {/* Hover indicator */}
              <div className='absolute inset-0 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
            </button>

            {/* Desktop toggle button */}
            <button
              onClick={() => {
                setUserOpened(true);
                onToggle();
                // Auto-expand the sidebar when opening
                setTimeout(() => setIsExpanded(true), 100);
              }}
              className={`p-4 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 hidden lg:block cursor-pointer relative group ${
                isConnected
                  ? 'bg-gradient-to-br from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white'
                  : 'bg-gradient-to-br from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-gray-300'
              }`}
              title={isConnected ? 'Open Wallet' : 'Connect Wallet'}
            >
              <div className='flex items-center space-x-3'>
                <span className='text-xl'>{isConnected ? '🔐' : '🔌'}</span>
                <span className='text-sm font-medium'>{isConnected ? 'Wallet' : 'Connect'}</span>
              </div>
              {/* Hover indicator */}
              <div className='absolute inset-0 bg-white/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
            </button>
          </>
        )}

        {/* Navigation Buttons - Matching Main Menu - Always show but with different states */}
        {!isOpen && (
          <>
            {/* Demos Button */}
            {isConnected ? (
              <a
                href='/demos'
                className='p-3 bg-gradient-to-br from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 group'
                title='Demos'
              >
                <div className='flex items-center space-x-2'>
                  <Image
                    src='/images/icons/demos.png'
                    alt='Demos'
                    width={20}
                    height={20}
                    className='w-5 h-5 group-hover:animate-bounce'
                  />
                  <span className='text-sm font-medium hidden lg:block'>Demos</span>
                </div>
              </a>
            ) : (
              <div
                className='p-3 bg-gray-500/30 rounded-lg shadow-lg relative cursor-not-allowed blur-[1px] opacity-70'
                title='Connect wallet to access Demos'
              >
                <div className='flex items-center space-x-2'>
                  <Image
                    src='/images/icons/demos.png'
                    alt='Demos'
                    width={20}
                    height={20}
                    className='w-5 h-5'
                  />
                  <span className='text-sm font-medium hidden lg:block text-gray-400'>Demos</span>
                  <div className='absolute top-1 right-1'>
                    <span className='text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full'>🔒</span>
                  </div>
                </div>
              </div>
            )}

            {/* Store Button */}
            <div className="relative">
              <div
                className='p-3 bg-gray-500/30 rounded-lg shadow-lg relative cursor-not-allowed blur-[1px] opacity-70'
                title='Coming Soon - Web3 Playground Store under development'
              >
                <div className='flex items-center space-x-2'>
                  <Image
                    src='/images/icons/console.png'
                    alt='Store'
                    width={20}
                    height={20}
                    className='w-5 h-5'
                  />
                  <span className='text-sm font-medium hidden lg:block text-gray-400'>Store</span>
                </div>
              </div>
              
              {/* Coming Soon Badge */}
              <div className='absolute -top-2 -right-2 z-10'>
                <div className='bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-0.5 rounded-full font-bold text-xs shadow-lg animate-pulse border border-white'>
                  🚧 Coming Soon
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Wallet Connection Banner */}
      {showBanner && !isConnected && !isConnecting && (
        <div className='fixed bottom-0 left-0 right-0 z-40 animate-slideInUp'>
          <div className='bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white shadow-2xl border-t-4 border-amber-400 relative overflow-hidden'>
            {/* Animated background pattern */}
            <div className='absolute inset-0 bg-gradient-to-r from-amber-400/20 via-orange-400/20 to-red-400/20 animate-pulse'></div>
            <div className='absolute inset-0 animate-shimmer'></div>
            <div className='absolute inset-0 opacity-30'>
              <div
                className='w-full h-full'
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
              ></div>
            </div>

            <div className='container mx-auto px-4 py-3 relative z-10'>
              <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0'>
                <div className='flex items-center space-x-4'>
                  <div className='flex-shrink-0'>
                    <div className='w-10 h-10 bg-white/20 rounded-full flex items-center justify-center animate-pulse shadow-lg animate-float'>
                      <span className='text-xl'>🔐</span>
                    </div>
                  </div>
                  <div className='flex-1'>
                    <h3 className='text-lg font-bold mb-1 text-white drop-shadow-sm'>
                      Wallet Not Connected
                    </h3>
                    <p className='hidden sm:block text-sm text-white/95 leading-relaxed'>
                      Connect your Stellar wallet to start testing the Trustless Work demos and
                      unlock all features
                    </p>
                  </div>
                </div>
                <div className='flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3'>
                  <div className='flex flex-col sm:flex-row gap-3'>
                    <button
                      onClick={async () => {
                        setIsConnecting(true);
                        setUserOpened(true); // Mark as user-initiated
                        onToggle(); // Open the sidebar
                        // Small delay to ensure sidebar opens smoothly before expanding
                        setTimeout(() => {
                          setIsExpanded(true); // Expand it
                        }, 100);
                        try {
                          if (isFreighterAvailable) {
                            await connect(); // Connect to Freighter
                          } else {
                            // Just open sidebar for manual input
                            console.log(
                              'Freighter not available, opening sidebar for manual input'
                            );
                          }
                        } finally {
                          setIsConnecting(false);
                        }
                      }}
                      disabled={isConnecting}
                      className='w-full sm:w-auto px-6 py-2.5 bg-white text-amber-600 font-bold rounded-lg hover:bg-white/90 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border-2 border-white/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
                    >
                      {isConnecting ? '🔄 Connecting...' : '🔗 Connect Wallet'}
                    </button>

                    <button
                      onClick={async () => {
                        setIsConnecting(true);
                        try {
                          await openWalletModal(); // Use Stellar Wallets Kit modal
                        } catch (error) {
                          console.error('Failed to open wallet modal:', error);
                          addToast({
                            type: 'error',
                            title: 'Wallet Connection Error',
                            message: 'Failed to open wallet selection modal',
                            duration: 5000,
                          });
                        } finally {
                          setIsConnecting(false);
                        }
                      }}
                      disabled={isConnecting}
                      className='w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border-2 border-purple-400/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
                    >
                      {isConnecting ? '🔄 Opening...' : '🎯 Multi-Wallet'}
                    </button>

                    <button
                      onClick={() => setShowFreighterGuide(true)}
                      className='w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border-2 border-orange-400/50'
                    >
                      🔗 Install Freighter
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Web3 Onboarding Modal */}
      <Web3OnboardingModal isOpen={showWeb3Modal} onClose={() => setShowWeb3Modal(false)} />
      
      {/* Freighter Installation Guide */}
      <FreighterInstallationGuide isOpen={showFreighterGuide} onClose={() => setShowFreighterGuide(false)} />
    </>
  );
};
