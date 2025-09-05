'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { NexusPrime } from '@/components/layout/NexusPrime';
import { WalletManager } from '@/components/ui/WalletManager';
import { stellarConfig } from '@/lib/wallet-config';
import { useState, useEffect } from 'react';
import {
  validateStellarAddress,
  sanitizeStellarAddressInput,
  generateTestStellarAddress,
} from '@/lib/stellar-address-validation';
import { useGlobalWallet, WalletProvider } from '@/contexts/WalletContext';

function WalletPageContent() {
  const { walletData, isConnected, connect, disconnect, isFreighterAvailable } = useGlobalWallet();
  const [isConnecting, setIsConnecting] = useState(false);
  const [manualAddress, setManualAddress] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);
  const [validationError, setValidationError] = useState<string>('');
  const [isValidating, setIsValidating] = useState(false);
  const [showWeb3Help, setShowWeb3Help] = useState(true);

  const handleConnect = async (walletId?: string) => {
    setIsConnecting(true);
    try {
      if (walletId) {
        await connect(walletId);
      } else {
        // For POC, use a default test wallet address
        const defaultWalletId = 'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF';
        await connect(defaultWalletId);
      }
    } catch (error) {
      console.error('Failed to connect:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleManualConnect = async () => {
    if (!manualAddress.trim()) {
      setValidationError('⚠️ Please enter a wallet address');
      return;
    }

    // Validate the Stellar address
    setIsValidating(true);
    setValidationError('');

    const validation = validateStellarAddress(manualAddress);

    if (!validation.isValid) {
      setValidationError(validation.error || 'Invalid Stellar address format');
      setIsValidating(false);
      return;
    }

    try {
      await handleConnect(manualAddress.trim());
      setManualAddress('');
      setShowManualInput(false);
      setValidationError('');
    } catch (err) {
      setValidationError('❌ Connection failed. Please try again.');
    } finally {
      setIsValidating(false);
    }
  };

  const copyAddress = () => {
    if (walletData?.publicKey) {
      navigator.clipboard.writeText(walletData.publicKey);
      // Show temporary success message
      const button = document.getElementById('copy-address-btn');
      if (button) {
        const originalText = button.textContent;
        button.textContent = '✅ Copied!';
        button.classList.add('bg-green-500/20', 'text-green-300');
        setTimeout(() => {
          button.textContent = originalText;
          button.classList.remove('bg-green-500/20', 'text-green-300');
        }, 2000);
      }
    }
  };

  const getNetworkColor = () => {
    return stellarConfig.network === 'TESTNET'
      ? 'from-warning-500 to-warning-600'
      : 'from-success-500 to-success-600';
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-neutral-900 via-brand-900 to-neutral-900'>
      {/* Header */}
      <div className='bg-white/10 backdrop-blur-md border-b border-white/20 p-4 relative overflow-hidden'>
        {/* Epic Background Effect */}
        <div className='absolute inset-0 pointer-events-none'>
          {/* Energy Core */}
          <div className='absolute inset-0 bg-gradient-to-r from-brand-500/10 via-accent-500/15 to-brand-400/10'></div>

          {/* Floating Particles */}
          <div className='absolute top-2 left-1/4 w-1 h-1 bg-brand-400 rounded-full animate-ping opacity-60'></div>
          <div
            className='absolute top-3 right-1/3 w-1.5 h-1.5 bg-accent-400 rounded-full animate-ping opacity-70'
            style={{ animationDelay: '0.5s' }}
          ></div>
          <div
            className='absolute bottom-2 left-1/3 w-1 h-1 bg-brand-300 rounded-full animate-ping opacity-50'
            style={{ animationDelay: '1s' }}
          ></div>
          <div
            className='absolute bottom-3 right-1/4 w-1.5 h-1.5 bg-accent-300 rounded-full animate-ping opacity-65'
            style={{ animationDelay: '1.5s' }}
          ></div>

          {/* Energy Streams */}
          <div className='absolute left-0 top-1/2 w-1 h-8 bg-gradient-to-b from-transparent via-brand-400/30 to-transparent animate-pulse opacity-40'></div>
          <div className='absolute right-0 top-1/2 w-1 h-6 bg-gradient-to-b from-transparent via-accent-400/30 to-transparent animate-pulse opacity-50'></div>
        </div>

        <div className='flex items-center justify-between relative z-10'>
          <div className='flex items-center space-x-3'>
            <div className='w-8 h-8 bg-gradient-to-br from-brand-500 to-accent-600 rounded-lg flex items-center justify-center'>
              <span className='text-white text-sm font-bold'>SW</span>
            </div>
            <div>
              <h1 className='text-lg font-bold text-white'>Stellar Wallet</h1>
              <p className='text-xs text-white/60'>Trustless Work POC</p>
            </div>
          </div>

          <div className='flex items-center space-x-2'>
            <div className='flex items-center space-x-2'>
              <div className={`w-2 h-2 bg-gradient-to-r ${getNetworkColor()} rounded-full`}></div>
              <span
                className={`text-xs font-medium bg-gradient-to-r ${getNetworkColor()} bg-clip-text text-transparent`}
              >
                {stellarConfig.network}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='p-6'>
        {!isConnected ? (
          // Not Connected State
          <div className='max-w-md mx-auto text-center py-12'>
            <div className='w-24 h-24 bg-gradient-to-br from-brand-500/20 to-accent-500/20 rounded-full flex items-center justify-center mx-auto mb-6'>
              <span className='text-4xl'>🔐</span>
            </div>
            <h2 className='text-2xl font-bold text-white mb-3'>Connect Your Wallet</h2>
            <p className='text-white/70 mb-8'>
              Connect your Stellar wallet to start using the Trustless Work demos
            </p>

            {/* Web3 Onboarding Section */}
            {showWeb3Help && (
              <div className='mb-6 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-400/20 rounded-lg relative'>
                <button
                  onClick={() => setShowWeb3Help(false)}
                  className='absolute top-2 right-2 w-6 h-6 bg-red-500/80 hover:bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold hover:scale-110 transition-all duration-200'
                  title='Close Web3 help'
                >
                  ×
                </button>
                <h4 className='text-sm font-semibold text-blue-300 mb-3 flex items-center pr-8'>
                  🌟 New to Web3? Start Here!
                </h4>

                {/* Freighter Recommendation */}
                <div className='mb-4 p-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 rounded-lg'>
                  <div className='flex items-center space-x-2 mb-2'>
                    <span className='text-lg'>🔗</span>
                    <span className='text-sm font-medium text-cyan-200'>
                      Recommended: Freighter Wallet
                    </span>
                  </div>
                  <p className='text-xs text-cyan-100/80 mb-3'>
                    The most popular Stellar wallet with browser extension support
                  </p>
                  <div className='space-y-2'>
                    <a
                      href='https://www.freighter.app/'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='block w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-xs font-medium py-2 px-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg text-center'
                    >
                      🚀 Install Freighter
                    </a>
                    <div className='text-xs text-cyan-200/60 text-center'>
                      Free • Secure • Easy to use
                    </div>
                  </div>
                </div>

                {/* Other Wallet Options */}
                <div className='space-y-2'>
                  <p className='text-xs text-blue-200/80 mb-2'>Other Stellar Wallets:</p>
                  <div className='grid grid-cols-2 gap-2'>
                    <a
                      href='https://albedo.link/'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-xs text-blue-300 hover:text-blue-200 underline transition-colors text-center'
                    >
                      🌅 Albedo
                    </a>
                    <a
                      href='https://xbull.app/'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-xs text-blue-300 hover:text-blue-200 underline transition-colors text-center'
                    >
                      🐂 xBull
                    </a>
                    <a
                      href='https://rabet.io/'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-xs text-blue-300 hover:text-blue-200 underline transition-colors text-center'
                    >
                      🐰 Rabet
                    </a>
                    <a
                      href='https://stellar.org/ecosystem/wallets'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-xs text-blue-300 hover:text-blue-200 underline transition-colors text-center'
                    >
                      📚 More Options
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Connection Options */}
            <div className='space-y-4'>
              {/* Freighter Connect Button */}
              {isFreighterAvailable && (
                <button
                  onClick={() => handleConnect()}
                  disabled={isConnecting}
                  className='w-full px-6 py-4 bg-gradient-to-r from-brand-500 to-accent-600 hover:from-brand-600 hover:to-accent-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
                >
                  {isConnecting ? '🔄 Connecting...' : '🔗 Connect with Freighter'}
                </button>
              )}

              {/* Manual Address Input */}
              <div className='space-y-3'>
                {!showManualInput ? (
                  <button
                    onClick={() => setShowManualInput(true)}
                    className='w-full px-6 py-3 bg-gradient-to-r from-accent-500/20 to-accent-600/20 hover:from-accent-500/30 hover:to-accent-600/30 border border-accent-400/30 text-accent-300 font-medium rounded-lg transition-all duration-300 hover:scale-105'
                  >
                    📝 Enter Manual Address
                  </button>
                ) : (
                  <div className='space-y-3'>
                    <input
                      type='text'
                      value={manualAddress}
                      onChange={e => {
                        const value = e.target.value;
                        setManualAddress(value);

                        // Clear validation error when user starts typing
                        if (validationError) {
                          setValidationError('');
                        }

                        // Real-time validation and sanitization
                        if (value.length > 0) {
                          const sanitized = sanitizeStellarAddressInput(value);
                          if (sanitized !== value) {
                            setManualAddress(sanitized);
                          }
                        }
                      }}
                      placeholder='G... (56 characters)'
                      maxLength={56}
                      className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-accent-400/50 focus:border-accent-400 transition-colors ${
                        validationError
                          ? 'border-red-400 focus:border-red-400'
                          : 'border-accent-400/30'
                      }`}
                    />
                    {validationError && (
                      <div className='text-red-400 text-xs p-2 bg-red-500/10 border border-red-400/30 rounded'>
                        ⚠️ {validationError}
                      </div>
                    )}

                    {/* Generate Test Address Button */}
                    <div className='text-center mb-3'>
                      <button
                        type='button'
                        onClick={() => {
                          const testAddress = generateTestStellarAddress();
                          setManualAddress(testAddress);
                          setValidationError('');
                        }}
                        className='text-xs text-cyan-300 hover:text-cyan-100 underline transition-colors'
                      >
                        🎲 Generate Test Address (Demo Only)
                      </button>
                    </div>

                    <div className='flex space-x-3'>
                      <button
                        onClick={handleManualConnect}
                        disabled={isConnecting || !manualAddress.trim()}
                        className='flex-1 px-4 py-3 bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white font-medium rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
                      >
                        {isConnecting ? '🔄 Connecting...' : '🔗 Connect'}
                      </button>
                      <button
                        onClick={() => {
                          setShowManualInput(false);
                          setManualAddress('');
                        }}
                        className='px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors border border-white/20'
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Demo Connect Button */}
              <button
                onClick={() => handleConnect()}
                disabled={isConnecting}
                className='w-full px-6 py-3 bg-gradient-to-r from-neutral-500/20 to-neutral-600/20 hover:from-neutral-500/30 hover:to-neutral-600/30 border border-neutral-400/30 text-neutral-300 font-medium rounded-lg transition-all duration-300 hover:scale-105'
              >
                🧪 Connect Demo Wallet (POC)
              </button>
            </div>

            {/* Network Info */}
            <div className='mt-8 p-4 bg-white/5 rounded-lg border border-white/10'>
              <h3 className='text-white font-medium mb-3'>Network Information</h3>
              <div className='space-y-2 text-sm'>
                <div className='flex items-center justify-between'>
                  <span className='text-white/60'>Network:</span>
                  <span
                    className={`font-medium bg-gradient-to-r ${getNetworkColor()} bg-clip-text text-transparent`}
                  >
                    {stellarConfig.network}
                  </span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-white/60'>Horizon URL:</span>
                  <span className='text-white/80 font-mono text-xs'>
                    {stellarConfig.horizonUrl}
                  </span>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className='mt-8 grid grid-cols-2 gap-4'>
              <div className='p-4 bg-white/5 rounded-lg border border-white/10'>
                <div className='text-2xl mb-2'>⚡</div>
                <h4 className='text-white font-medium text-sm mb-1'>Fast</h4>
                <p className='text-white/60 text-xs'>3-5 second settlement</p>
              </div>
              <div className='p-4 bg-white/5 rounded-lg border border-white/10'>
                <div className='text-2xl mb-2'>💰</div>
                <h4 className='text-white font-medium text-sm mb-1'>Low Cost</h4>
                <p className='text-white/60 text-xs'>Minimal transaction fees</p>
              </div>
            </div>
          </div>
        ) : (
          // Connected State
          <div className='max-w-2xl mx-auto'>
            <div className='text-center mb-8'>
              <div className='w-16 h-16 bg-gradient-to-br from-success-500/20 to-success-600/20 rounded-full flex items-center justify-center mx-auto mb-4'>
                <span className='text-2xl'>✅</span>
              </div>
              <h2 className='text-2xl font-bold text-white mb-2'>Wallet Connected</h2>
              <p className='text-white/70'>Your Stellar wallet is ready to use</p>
            </div>

            {/* Wallet Details */}
            <div className='space-y-6'>
              {/* Connection Status */}
              <div className='p-6 bg-gradient-to-br from-success-500/20 to-success-600/20 rounded-lg border border-success-400/30'>
                <div className='flex items-center space-x-3 mb-4'>
                  <div className='w-3 h-3 bg-success-400 rounded-full animate-pulse'></div>
                  <span className='text-success-300 font-medium'>Active Connection</span>
                  <span className='text-xs text-success-200/80 bg-success-500/30 px-2 py-1 rounded-full'>
                    Real-time Sync
                  </span>
                </div>

                <div className='grid md:grid-cols-2 gap-4'>
                  <div>
                    <p className='text-white/60 text-sm mb-2'>Network</p>
                    <span
                      className={`text-sm font-medium bg-gradient-to-r ${getNetworkColor()} bg-clip-text text-transparent`}
                    >
                      {walletData?.network}
                    </span>
                  </div>
                  <div>
                    <p className='text-white/60 text-sm mb-2'>Connection Time</p>
                    <span className='text-white text-sm'>{new Date().toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>

              {/* Wallet Address */}
              <div className='p-6 bg-white/5 rounded-lg border border-white/20'>
                <h3 className='text-white font-medium mb-4'>Wallet Address</h3>
                <div className='flex items-center space-x-3'>
                  <code className='flex-1 text-sm text-success-300 bg-success-900/30 px-4 py-3 rounded-lg font-mono break-all'>
                    {walletData?.publicKey}
                  </code>
                  <button
                    id='copy-address-btn'
                    onClick={copyAddress}
                    className='px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg transition-colors'
                    title='Copy address'
                  >
                    📋
                  </button>
                </div>
                <p className='text-white/60 text-xs mt-2'>
                  This is your public wallet address. Keep it safe and share it when needed.
                </p>
              </div>

              {/* Real-time Sync Info */}
              <div className='p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-400/20'>
                <div className='flex items-center space-x-2 mb-2'>
                  <span className='text-blue-300'>🔄</span>
                  <span className='text-blue-200 text-sm font-medium'>Real-time Data Sync</span>
                </div>
                <p className='text-xs text-blue-200/80'>
                  This window shares real-time wallet data with the main application. Any changes
                  made here will be reflected immediately in the main app and vice versa.
                </p>
              </div>

              {/* Quick Actions */}
              <div className='p-6 bg-white/5 rounded-lg border border-white/20'>
                <h3 className='text-white font-medium mb-4'>Quick Actions</h3>
                <div className='grid md:grid-cols-2 gap-4'>
                  <button
                    onClick={() => window.open('/', '_blank')}
                    className='p-4 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 hover:from-cyan-500/30 hover:to-purple-500/30 border border-cyan-400/30 text-cyan-300 rounded-lg transition-all duration-300 hover:scale-105'
                  >
                    <div className='text-2xl mb-2'>🏠</div>
                    <h4 className='font-medium mb-1'>Go to Main App</h4>
                    <p className='text-xs text-cyan-200'>Open the main application</p>
                  </button>

                  <button
                    onClick={() => window.open('/demos', '_blank')}
                    className='p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 border border-purple-400/30 text-purple-300 rounded-lg transition-all duration-300 hover:scale-105'
                  >
                    <div className='text-2xl mb-2'>🧪</div>
                    <h4 className='font-medium mb-1'>Open Demos</h4>
                    <p className='text-xs text-purple-200'>Test the demo scenarios</p>
                  </button>
                </div>
              </div>

              {/* Disconnect */}
              <div className='text-center'>
                <button
                  onClick={disconnect}
                  className='px-6 py-3 bg-danger-500/20 hover:bg-danger-500/30 border border-danger-400/30 text-danger-300 rounded-lg transition-colors'
                >
                  🔌 Disconnect Wallet
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function WalletPage() {
  return (
    <WalletProvider>
      <WalletPageContent />
    </WalletProvider>
  );
}
