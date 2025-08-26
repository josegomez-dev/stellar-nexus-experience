'use client'

import { useGlobalWallet, WalletProvider } from '@/contexts/WalletContext'
import { stellarConfig } from '@/lib/wallet-config'
import { useState } from 'react'

function WalletPageContent() {
  const { walletData, isConnected, connect, disconnect, isFreighterAvailable } = useGlobalWallet()
  const [isConnecting, setIsConnecting] = useState(false)
  const [manualAddress, setManualAddress] = useState('')
  const [showManualInput, setShowManualInput] = useState(false)

  const handleConnect = async (walletId?: string) => {
    setIsConnecting(true)
    try {
      if (walletId) {
        await connect(walletId)
      } else {
        // For POC, use a default test wallet address
        const defaultWalletId = 'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF'
        await connect(defaultWalletId)
      }
    } catch (error) {
      console.error('Failed to connect:', error)
    } finally {
      setIsConnecting(false)
    }
  }

  const handleManualConnect = async () => {
    if (!manualAddress.trim()) {
      alert('Please enter a valid Stellar wallet address')
      return
    }
    
    // Basic validation for Stellar address format
    if (!manualAddress.startsWith('G') || manualAddress.length !== 56) {
      alert('Please enter a valid Stellar wallet address (should start with G and be 56 characters long)')
      return
    }
    
    await handleConnect(manualAddress.trim())
    setManualAddress('')
    setShowManualInput(false)
  }

  const copyAddress = () => {
    if (walletData?.publicKey) {
      navigator.clipboard.writeText(walletData.publicKey)
      // Show temporary success message
      const button = document.getElementById('copy-address-btn')
      if (button) {
        const originalText = button.textContent
        button.textContent = '✅ Copied!'
        button.classList.add('bg-green-500/20', 'text-green-300')
        setTimeout(() => {
          button.textContent = originalText
          button.classList.remove('bg-green-500/20', 'text-green-300')
        }, 2000)
      }
    }
  }

  const getNetworkColor = () => {
    return stellarConfig.network === 'TESTNET' 
      ? 'from-warning-500 to-warning-600' 
      : 'from-success-500 to-success-600'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-brand-900 to-neutral-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-accent-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">SW</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Stellar Wallet</h1>
              <p className="text-xs text-white/60">Trustless Work POC</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 bg-gradient-to-r ${getNetworkColor()} rounded-full`}></div>
              <span className={`text-xs font-medium bg-gradient-to-r ${getNetworkColor()} bg-clip-text text-transparent`}>
                {stellarConfig.network}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {!isConnected ? (
          // Not Connected State
          <div className="max-w-md mx-auto text-center py-12">
            <div className="w-24 h-24 bg-gradient-to-br from-brand-500/20 to-accent-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🔐</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Connect Your Wallet</h2>
            <p className="text-white/70 mb-8">
              Connect your Stellar wallet to start using the Trustless Work demos
            </p>
            
            {/* Connection Options */}
            <div className="space-y-4">
              {/* Freighter Connect Button */}
              {isFreighterAvailable && (
                <button
                  onClick={() => handleConnect()}
                  disabled={isConnecting}
                  className="w-full px-6 py-4 bg-gradient-to-r from-brand-500 to-accent-600 hover:from-brand-600 hover:to-accent-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isConnecting ? '🔄 Connecting...' : '🔗 Connect with Freighter'}
                </button>
              )}

              {/* Manual Address Input */}
              <div className="space-y-3">
                {!showManualInput ? (
                  <button
                    onClick={() => setShowManualInput(true)}
                    className="w-full px-6 py-3 bg-gradient-to-r from-accent-500/20 to-accent-600/20 hover:from-accent-500/30 hover:to-accent-600/30 border border-accent-400/30 text-accent-300 font-medium rounded-lg transition-all duration-300 hover:scale-105"
                  >
                    📝 Enter Manual Address
                  </button>
                ) : (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={manualAddress}
                      onChange={(e) => setManualAddress(e.target.value)}
                      placeholder="G... (56 characters)"
                      className="w-full px-4 py-3 bg-white/10 border border-accent-400/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-accent-400/50 focus:border-accent-400"
                    />
                    <div className="flex space-x-3">
                      <button
                        onClick={handleManualConnect}
                        disabled={isConnecting || !manualAddress.trim()}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white font-medium rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isConnecting ? '🔄 Connecting...' : '🔗 Connect'}
                      </button>
                      <button
                        onClick={() => {
                          setShowManualInput(false)
                          setManualAddress('')
                        }}
                        className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors border border-white/20"
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
                className="w-full px-6 py-3 bg-gradient-to-r from-neutral-500/20 to-neutral-600/20 hover:from-neutral-500/30 hover:to-neutral-600/30 border border-neutral-400/30 text-neutral-300 font-medium rounded-lg transition-all duration-300 hover:scale-105"
              >
                🧪 Connect Demo Wallet (POC)
              </button>
            </div>

            {/* Network Info */}
            <div className="mt-8 p-4 bg-white/5 rounded-lg border border-white/10">
              <h3 className="text-white font-medium mb-3">Network Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-white/60">Network:</span>
                  <span className={`font-medium bg-gradient-to-r ${getNetworkColor()} bg-clip-text text-transparent`}>
                    {stellarConfig.network}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60">Horizon URL:</span>
                  <span className="text-white/80 font-mono text-xs">
                    {stellarConfig.horizonUrl}
                  </span>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="text-2xl mb-2">⚡</div>
                <h4 className="text-white font-medium text-sm mb-1">Fast</h4>
                <p className="text-white/60 text-xs">3-5 second settlement</p>
              </div>
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="text-2xl mb-2">💰</div>
                <h4 className="text-white font-medium text-sm mb-1">Low Cost</h4>
                <p className="text-white/60 text-xs">Minimal transaction fees</p>
              </div>
            </div>
          </div>
        ) : (
          // Connected State
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
                          <div className="w-16 h-16 bg-gradient-to-br from-success-500/20 to-success-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">✅</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Wallet Connected</h2>
            <p className="text-white/70">Your Stellar wallet is ready to use</p>
          </div>

          {/* Wallet Details */}
          <div className="space-y-6">
            {/* Connection Status */}
            <div className="p-6 bg-gradient-to-br from-success-500/20 to-success-600/20 rounded-lg border border-success-400/30">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-3 h-3 bg-success-400 rounded-full animate-pulse"></div>
                <span className="text-success-300 font-medium">Active Connection</span>
              </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-white/60 text-sm mb-2">Network</p>
                    <span className={`text-sm font-medium bg-gradient-to-r ${getNetworkColor()} bg-clip-text text-transparent`}>
                      {walletData?.network}
                    </span>
                  </div>
                  <div>
                    <p className="text-white/60 text-sm mb-2">Connection Time</p>
                    <span className="text-white text-sm">
                      {new Date().toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Wallet Address */}
              <div className="p-6 bg-white/5 rounded-lg border border-white/20">
                <h3 className="text-white font-medium mb-4">Wallet Address</h3>
                <div className="flex items-center space-x-3">
                  <code className="flex-1 text-sm text-success-300 bg-success-900/30 px-4 py-3 rounded-lg font-mono break-all">
                    {walletData?.publicKey}
                  </code>
                  <button
                    id="copy-address-btn"
                    onClick={copyAddress}
                    className="px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg transition-colors"
                    title="Copy address"
                  >
                    📋
                  </button>
                </div>
                <p className="text-white/60 text-xs mt-2">
                  This is your public wallet address. Keep it safe and share it when needed.
                </p>
              </div>

              {/* Quick Actions */}
              <div className="p-6 bg-white/5 rounded-lg border border-white/20">
                <h3 className="text-white font-medium mb-4">Quick Actions</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <button
                    onClick={() => window.open('/', '_blank')}
                    className="p-4 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 hover:from-cyan-500/30 hover:to-purple-500/30 border border-cyan-400/30 text-cyan-300 rounded-lg transition-all duration-300 hover:scale-105"
                  >
                    <div className="text-2xl mb-2">🏠</div>
                    <h4 className="font-medium mb-1">Go to Main App</h4>
                    <p className="text-xs text-cyan-200">Open the main application</p>
                  </button>
                  
                  <button
                    onClick={() => window.open('/demos', '_blank')}
                    className="p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 border border-purple-400/30 text-purple-300 rounded-lg transition-all duration-300 hover:scale-105"
                  >
                    <div className="text-2xl mb-2">🧪</div>
                    <h4 className="font-medium mb-1">Open Demos</h4>
                    <p className="text-xs text-purple-200">Test the demo scenarios</p>
                  </button>
                </div>
              </div>

              {/* Disconnect */}
              <div className="text-center">
                <button
                  onClick={disconnect}
                  className="px-6 py-3 bg-danger-500/20 hover:bg-danger-500/30 border border-danger-400/30 text-danger-300 rounded-lg transition-colors"
                >
                  🔌 Disconnect Wallet
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function WalletPage() {
  return (
    <WalletProvider>
      <WalletPageContent />
    </WalletProvider>
  )
}
