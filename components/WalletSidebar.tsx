'use client'

import { useState, useEffect } from 'react'
import { useGlobalWallet } from '@/contexts/WalletContext'
import { useTransactionHistory } from '@/contexts/TransactionContext'
import { stellarConfig } from '@/lib/wallet-config'
import Image from 'next/image'

interface WalletSidebarProps {
  isOpen: boolean
  onToggle: () => void
  showBanner?: boolean
}

export const WalletSidebar = ({ isOpen, onToggle, showBanner = false }: WalletSidebarProps) => {
  const { walletData, isConnected, connect, disconnect, isFreighterAvailable } = useGlobalWallet()
  const { getRecentTransactions, transactions } = useTransactionHistory()
  const [isExpanded, setIsExpanded] = useState(false)
  const [isNewWindow, setIsNewWindow] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [manualAddress, setManualAddress] = useState('')
  const [showTransactionHistory, setShowTransactionHistory] = useState(false)
  const [showWeb3Help, setShowWeb3Help] = useState(true)

  // Get recent transactions
  const recentTransactions = getRecentTransactions(5)

  // Dispatch custom event to move main content
  useEffect(() => {
    const event = new CustomEvent('walletSidebarToggle', {
      detail: { isOpen, isExpanded }
    })
    window.dispatchEvent(event)
  }, [isOpen, isExpanded])

  // Dispatch wallet state change events
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('walletStateChanged', {
        detail: { 
          isConnected,
          walletData,
          isFreighterAvailable
        }
      }))
    }
  }, [isConnected, walletData, isFreighterAvailable])

  // Handle escape key to close sidebar and custom event to open
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onToggle()
      }
    }
    
    const handleToggleWallet = () => {
      onToggle()
    }
    
    document.addEventListener('keydown', handleEscape)
    window.addEventListener('toggleWalletSidebar', handleToggleWallet)
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      window.removeEventListener('toggleWalletSidebar', handleToggleWallet)
    }
  }, [isOpen, onToggle])

  // Open wallet in new window
  const openInNewWindow = () => {
    const width = 400
    const height = 600
    const left = (window.screen.width - width) / 2
    const top = (window.screen.height - height) / 2
    
    const newWindow = window.open(
      '/wallet',
      'StellarWallet',
      `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
    )
    
    if (newWindow) {
      setIsNewWindow(true)
      newWindow.onbeforeunload = () => setIsNewWindow(false)
    }
  }

  const copyAddress = () => {
    if (walletData?.publicKey) {
      navigator.clipboard.writeText(walletData.publicKey)
      // Show temporary success message
      const button = document.getElementById('copy-address-btn')
      if (button) {
        const originalHTML = button.innerHTML
        button.innerHTML = `
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        `
        button.classList.add('bg-success-500/20', 'text-success-200', 'border-success-400/50')
        setTimeout(() => {
          button.innerHTML = originalHTML
          button.classList.remove('bg-success-500/20', 'text-success-200', 'border-success-400/50')
        }, 2000)
      }
    }
  }

  const formatBalance = (balance: string) => {
    const num = parseFloat(balance) / 1000000 // Convert from Stellar units
    return num.toFixed(2)
  }

  const getNetworkColor = () => {
    return stellarConfig.network === 'TESTNET' 
      ? 'from-warning-500 to-warning-400' 
      : 'from-success-500 to-success-400'
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 right-0 h-full z-50 transform transition-all duration-500 ease-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        ${isExpanded ? 'w-96' : 'w-20'}
        bg-gradient-to-b from-slate-900/98 to-slate-800/98 backdrop-blur-2xl
        border-l border-white/30 shadow-2xl
        ${isExpanded ? 'shadow-[-20px_0_60px_rgba(0,0,0,0.8)]' : 'shadow-[-10px_0_30px_rgba(0,0,0,0.6)]'}
      `}>
        {/* Header */}
        <div className={`flex items-center justify-between border-b border-white/20 transition-all duration-300 ${
          isExpanded ? 'p-4' : 'p-2'
        }`}>
          <div className="flex items-center space-x-1">
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
              <div className="animate-fadeIn flex items-center space-x-2">
                <Image 
                  src="/images/logo/iconletter.png"
                  alt="STELLAR NEXUS"
                  width={80}
                  height={16}
                />
                <span className="text-xs text-white/60">Wallet</span>
              </div>
            )}
          </div>
          
          {/* Close Button - Better positioned and styled */}
          <button
            onClick={onToggle}
            className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-br from-red-500/80 to-pink-600/80 hover:from-red-500 to-pink-600 text-white rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 hover:shadow-xl border border-white/20 flex items-center justify-center group"
            title="Close Wallet"
          >
            <span className="text-lg font-bold group-hover:scale-110 transition-transform duration-200">×</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={`text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300 hover:scale-110 ${
                isExpanded ? 'p-2' : 'p-1.5'
              }`}
              title={isExpanded ? 'Collapse' : 'Expand'}
            >
              <div className={`transform transition-transform duration-300 ${!isExpanded ? 'rotate-180' : 'rotate-0'}`}>
                ▶
              </div>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className={`flex-1 overflow-y-auto transition-all duration-300 ${
          isExpanded ? 'p-4' : 'p-2'
        }`} style={{ minHeight: '400px' }}>
          {!isConnected ? (
            // Not Connected State
            <div className={isExpanded ? "text-center py-8" : "text-center py-2"}>
              <div className={`${isExpanded ? "w-16 h-16" : "w-10 h-10"} bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-500`}>
                <span className={isExpanded ? "text-2xl" : "text-lg"}>🔐</span>
              </div>
              
              {isExpanded && (
                <div className="animate-fadeIn">
                  <h3 className="font-semibold text-white mb-2">Connect Wallet</h3>
                  <p className="hidden sm:block text-white/70 text-sm mb-6">
                    Connect your Stellar wallet to start using the demos
                  </p>
                </div>
              )}
              
              <div className={`space-y-3 ${!isExpanded ? 'space-y-2' : ''}`}>
                {/* Freighter Connect Button */}
                {isFreighterAvailable ? (
                  <button
                    onClick={async () => {
                      setIsConnecting(true)
                      try {
                        await connect() // Connect to Freighter
                        if (!isExpanded) {
                          setIsExpanded(true) // Auto-expand if collapsed
                        }
                      } finally {
                        setIsConnecting(false)
                      }
                    }}
                    disabled={isConnecting}
                    className={`w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                      isExpanded ? "px-4 py-3" : "px-2 py-2.5"
                    }`}
                    title={!isExpanded ? "Connect Freighter" : undefined}
                  >
                    <span className="text-lg">🔗</span>
                    {isExpanded && (
                      <span className="ml-2 animate-fadeIn">
                        {isConnecting ? 'Connecting...' : 'Connect Freighter'}
                      </span>
                    )}
                  </button>
                ) : (
                  <div className={`text-center ${isExpanded ? "py-2" : "py-1"}`}>
                    <p className="text-xs text-white/60">
                      {isExpanded ? (
                        <span className="hidden sm:inline">Freighter not detected. Install the extension or use manual input below.</span>
                      ) : "⚠️"}
                    </p>
                    {isExpanded && (
                      <button
                        onClick={() => {
                          console.log('🔍 Debug: Checking Freighter detection...')
                          console.log('Window object:', typeof window !== 'undefined' ? 'Available' : 'Not available')
                          console.log('window.stellar:', !!(window as any).stellar)
                          console.log('window.freighter:', !!(window as any).freighter)
                          console.log('User Agent:', (window as any).navigator?.userAgent)
                          console.log('Current isFreighterAvailable state:', isFreighterAvailable)
                        }}
                        className="mt-2 text-xs text-amber-300 hover:text-amber-200 underline"
                      >
                        🔍 Debug Freighter Detection
                      </button>
                    )}
                  </div>
                )}
                
                {/* Web3 Onboarding Section */}
                {isExpanded && showWeb3Help && (
                  <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-400/20 rounded-lg relative">
                    <button
                      onClick={() => setShowWeb3Help(false)}
                      className="absolute top-2 right-2 w-6 h-6 bg-red-500/80 hover:bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold hover:scale-110 transition-all duration-200"
                      title="Close Web3 help"
                    >
                      ×
                    </button>
                    <h4 className="text-sm font-semibold text-blue-300 mb-3 flex items-center pr-8">
                      🌟 New to Web3? Start Here!
                    </h4>
                    
                    {/* Freighter Recommendation */}
                    <div className="mb-4 p-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-lg">🔗</span>
                        <span className="text-sm font-medium text-cyan-200">Recommended: Freighter Wallet</span>
                      </div>
                      <p className="text-xs text-cyan-100/80 mb-3">
                        The most popular Stellar wallet with browser extension support
                      </p>
                      <div className="space-y-2">
                        <a
                          href="https://www.freighter.app/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-xs font-medium py-2 px-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg text-center"
                        >
                          🚀 Install Freighter
                        </a>
                        <div className="text-xs text-cyan-200/60 text-center">
                          Free • Secure • Easy to use
                        </div>
                      </div>
                    </div>

                    {/* Other Wallet Options */}
                    <div className="space-y-2">
                      <p className="text-xs text-blue-200/80 mb-2">Other Stellar Wallets:</p>
                      <div className="grid grid-cols-2 gap-2">
                        <a
                          href="https://albedo.link/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-300 hover:text-blue-200 underline transition-colors text-center"
                        >
                          🌅 Albedo
                        </a>
                        <a
                          href="https://xbull.app/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-300 hover:text-blue-200 underline transition-colors text-center"
                        >
                          🐂 xBull
                        </a>
                        <a
                          href="https://rabet.io/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-300 hover:text-blue-200 underline transition-colors text-center"
                        >
                          🐰 Rabet
                        </a>
                        <a
                          href="https://stellar.org/ecosystem/wallets"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-300 hover:text-blue-200 underline transition-colors text-center"
                        >
                          📚 More Options
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* Manual Address Input */}
                {isExpanded && (
                  <div className="space-y-2">
                    <div className="text-center">
                      <p className="hidden sm:block text-xs text-white/60 mb-2">Or enter wallet address manually:</p>
                    </div>
                    <input
                      type="text"
                      value={manualAddress}
                      onChange={(e) => setManualAddress(e.target.value)}
                      placeholder="G... (Stellar address)"
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 text-sm focus:outline-none focus:border-cyan-400 transition-colors"
                    />
                    <button
                      onClick={async () => {
                        if (!manualAddress.trim()) return
                        setIsConnecting(true)
                        try {
                          await connect(manualAddress.trim())
                          setManualAddress('')
                        } finally {
                          setIsConnecting(false)
                        }
                      }}
                      disabled={isConnecting || !manualAddress.trim()}
                      className="w-full px-3 py-2 bg-white/20 hover:bg-white/30 border border-white/30 text-white text-sm rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isConnecting ? '🔄 Connecting...' : '🔗 Connect Manual Address'}
                    </button>
                  </div>
                )}
                
                <button
                  onClick={openInNewWindow}
                  className={`w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium rounded-lg transition-all duration-300 hover:border-white/40 ${
                    isExpanded ? "px-4 py-3" : "px-2 py-2.5"
                  }`}
                  title={!isExpanded ? "Open in New Window" : undefined}
                >
                  <span className="text-lg">🪟</span>
                  {isExpanded && (
                    <span className="ml-2 animate-fadeIn">Open in New Window</span>
                  )}
                </button>
              </div>

              {/* Network Info - Only show when expanded */}
              {isExpanded && (
                <div className="mt-6 p-3 bg-white/5 rounded-lg border border-white/10 animate-fadeIn">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <div className={`w-2 h-2 bg-gradient-to-r ${getNetworkColor()} rounded-full animate-pulse`}></div>
                    <span className="text-xs text-white/60">Network</span>
                  </div>
                  <span className={`text-sm font-medium bg-gradient-to-r ${getNetworkColor()} bg-clip-text text-transparent`}>
                    {stellarConfig.network}
                  </span>
                </div>
              )}
            </div>
          ) : (
            // Connected State
            <div className={`space-y-4 ${!isExpanded ? 'space-y-3' : ''}`}>
              {/* Wallet Info */}
              <div className={`bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg border border-green-400/30 shadow-lg transition-all duration-300 ${
                isExpanded ? 'p-4' : 'p-3'
              }`}>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg"></div>
                  {isExpanded && <span className="text-green-300 text-sm font-medium animate-fadeIn">Connected</span>}
                </div>
                
                <div className={`space-y-3 ${!isExpanded ? 'space-y-2' : ''}`}>
                  <div>
                    {isExpanded && <p className="text-xs text-white/60 mb-1 animate-fadeIn">Wallet Address</p>}
                    <div className="flex items-center space-x-2">
                      <code className={`text-green-300 bg-green-900/30 px-2 py-1 rounded flex-1 font-mono transition-all duration-300 truncate ${
                        isExpanded ? 'text-xs' : 'text-xs text-center'
                      }`}>
                        {isExpanded 
                          ? `${walletData?.publicKey?.slice(0, 8)}...${walletData?.publicKey?.slice(-8)}`
                          : `${walletData?.publicKey?.slice(0, 4)}...${walletData?.publicKey?.slice(-4)}`
                        }
                      </code>
                      {isExpanded && (
                        <button
                          id="copy-address-btn"
                          onClick={copyAddress}
                          className="flex-shrink-0 text-green-300 hover:text-green-200 hover:bg-green-500/20 rounded transition-all duration-300 hover:scale-110 border border-green-400/30 hover:border-green-400/50 p-1.5"
                          title="Copy address"
                        >
                          <Image 
                            src="/images/icons/copy.svg"
                            alt="Copy address"
                            width={12}
                            height={12}
                            className="w-full h-full"
                          />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Network Info - Only show when expanded */}
                  {isExpanded && (
                    <div className="animate-fadeIn">
                      <p className="text-xs text-white/60 mb-1">Network</p>
                      <span className={`text-xs px-2 py-1 rounded bg-gradient-to-r ${getNetworkColor()} bg-clip-text text-transparent font-medium`}>
                        {walletData?.network || stellarConfig.network}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className={`space-y-2 ${!isExpanded ? 'space-y-1.5' : ''}`}>
                <button
                  onClick={openInNewWindow}
                  className={`w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm rounded-lg transition-all duration-300 hover:border-white/40 flex items-center justify-center space-x-2 ${
                    isExpanded ? "px-3 py-2" : "px-2 py-2"
                  }`}
                  title={!isExpanded ? "Open in New Window" : undefined}
                >
                  <span className="text-lg">🪟</span>
                  {isExpanded && <span className="animate-fadeIn">Open in New Window</span>}
                </button>
                
                <button
                  onClick={disconnect}
                  className={`w-full bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 text-red-300 text-sm rounded-lg transition-all duration-300 hover:border-red-400/50 flex items-center justify-center space-x-2 ${
                    isExpanded ? "px-3 py-2" : "px-2 py-2"
                  }`}
                  title={!isExpanded ? "Disconnect" : undefined}
                >
                  <span className="text-lg">🔌</span>
                  {isExpanded && <span className="animate-fadeIn">Disconnect</span>}
                </button>
              </div>

              {/* Demo Status - Only show when expanded */}
              {isExpanded && (
                <div className="p-3 bg-white/5 rounded-lg border border-white/10 animate-fadeIn">
                  <h4 className="text-white font-medium text-sm mb-3">Demo Status</h4>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="text-center">
                      <div className="text-green-400 mb-1">✅</div>
                      <span className="text-white/60">Ready</span>
                    </div>
                    <div className="text-center">
                      <div className="text-green-400 mb-1">🛜</div>
                      <span className="text-white/60">Network</span>
                    </div>
                    <div className="text-center">
                      <div className="text-green-400 mb-1">💳ve</div>
                      <span className="text-white/60">{transactions.length} TX</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Transaction History - Only show when expanded */}
              {isExpanded && transactions.length > 0 && (
                <div className="p-3 bg-white/5 rounded-lg border border-white/10 animate-fadeIn">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-white font-medium text-sm">Transaction History</h4>
                    <button
                      onClick={() => setShowTransactionHistory(!showTransactionHistory)}
                      className="text-xs text-white/60 hover:text-white/80 transition-colors"
                    >
                      {showTransactionHistory ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  
                  {showTransactionHistory && (
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {recentTransactions.map((tx, index) => (
                        <div
                          key={index}
                          className={`p-2 rounded-lg border text-xs ${
                            tx.status === 'success' ? 'border-success-400/30 bg-success-500/10' :
                            tx.status === 'failed' ? 'border-danger-400/30 bg-danger-500/10' :
                            'border-warning-400/30 bg-warning-500/10'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <p className={`font-medium truncate flex-1 ${
                              tx.status === 'success' ? 'text-success-300' :
                              tx.status === 'failed' ? 'text-danger-300' :
                              'text-warning-300'
                            }`}>
                              {tx.message}
                            </p>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-white/50">
                              {tx.timestamp.toLocaleTimeString()}
                            </span>
                            <span className={`px-1.5 py-0.5 rounded text-xs ${
                              tx.status === 'success' ? 'text-success-400 bg-success-500/20' :
                              tx.status === 'failed' ? 'text-danger-400 bg-danger-500/20' :
                              'text-warning-400 bg-warning-500/20'
                            }`}>
                              {tx.status.toUpperCase()}
                            </span>
                          </div>
                          {tx.demoId && (
                            <div className="text-xs text-white/40 mt-1">
                              Demo: {tx.demoId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {!showTransactionHistory && transactions.length > 0 && (
                    <div className="text-center">
                      <button
                        onClick={() => setShowTransactionHistory(true)}
                        className="text-xs text-white/60 hover:text-white/80 transition-colors underline"
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
        <div className="p-4 border-t border-white/20">
          <div className="flex items-center justify-between text-xs text-white/40">
            <span>v1.0.0</span>
            {isExpanded && (
              <span className="text-cyan-400">Stellar POC</span>
            )}
          </div>
        </div>
      </div>

      {/* Floating Wallet Control Buttons */}
      <div className="fixed top-20 right-4 z-30 flex flex-col space-y-3">
        {/* Open Wallet Button */}
        {!isOpen && (
          <>
            {/* Mobile toggle button */}
            <button
              onClick={onToggle}
              className="p-3 bg-gradient-to-br from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 lg:hidden"
              title="Open Wallet"
            >
              🔐
              {!isConnected && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse border-2 border-white shadow-lg"></div>
              )}
            </button>
            
            {/* Desktop toggle button */}
            <button
              onClick={onToggle}
              className="p-3 bg-gradient-to-br from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 hidden lg:block"
              title="Open Wallet"
            >
              <div className="flex items-center space-x-2">
                <span>🔐</span>
                <span className="text-sm font-medium">Wallet</span>
              </div>
              {!isConnected && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse border-2 border-white shadow-lg"></div>
              )}
            </button>
          </>
        )}

        {/* Open in New Window Button */}
        {!isOpen && (
          <button
            onClick={openInNewWindow}
            className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
            title="Open Wallet in New Window"
          >
            <div className="flex items-center space-x-2">
              <span>🪟</span>
              <span className="text-sm font-medium hidden lg:block">New Window</span>
            </div>
          </button>
        )}


      </div>

      {/* Wallet Connection Banner */}
      {showBanner && !isConnected && !isConnecting && (
        <div className="fixed bottom-0 left-0 right-0 z-40 animate-slideInUp">
          <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white shadow-2xl border-t-4 border-amber-400 relative overflow-hidden">
            {/* Animated background pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 via-orange-400/20 to-red-400/20 animate-pulse"></div>
            <div className="absolute inset-0 animate-shimmer"></div>
            <div className="absolute inset-0 opacity-30">
              <div className="w-full h-full" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
              }}></div>
            </div>
            
            <div className="container mx-auto px-4 py-3 relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center animate-pulse shadow-lg animate-float">
                      <span className="text-xl">🔐</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-1 text-white drop-shadow-sm">Wallet Not Connected</h3>
                    <p className="hidden sm:block text-sm text-white/95 leading-relaxed">
                      Connect your Stellar wallet to start testing the Trustless Work demos and unlock all features
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3">
                  <button
                    onClick={async () => {
                      setIsConnecting(true)
                      onToggle() // Open the sidebar
                      // Small delay to ensure sidebar opens smoothly before expanding
                      setTimeout(() => {
                        setIsExpanded(true) // Expand it
                      }, 100)
                      try {
                        if (isFreighterAvailable) {
                          await connect() // Connect to Freighter
                        } else {
                          // Just open sidebar for manual input
                          console.log('Freighter not available, opening sidebar for manual input')
                        }
                      } finally {
                        setIsConnecting(false)
                      }
                    }}
                    disabled={isConnecting}
                    className="w-full sm:w-auto px-6 py-2.5 bg-white text-amber-600 font-bold rounded-lg hover:bg-white/90 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border-2 border-white/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isConnecting ? '🔄 Connecting...' : '🔗 Connect Wallet'}
                  </button>
                  <button
                    onClick={onToggle}
                    className="hidden sm:block px-5 py-2.5 bg-white/20 text-white font-semibold rounded-lg hover:bg-white/30 transition-all duration-300 border-2 border-white/30 hover:border-white/50"
                  >
                    🪟 Open Wallet
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
