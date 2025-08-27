'use client'

import { useState } from 'react'
import { useGlobalWallet } from '@/contexts/WalletContext'
import { appConfig, stellarConfig } from '@/lib/wallet-config'
import Image from 'next/image'

export const Header = () => {
  const { walletData, isConnected, disconnect } = useGlobalWallet()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // CSS keyframes for dropdown animation
  const dropdownAnimation = `
    @keyframes fadeInDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `

  const handleDisconnect = () => {
    disconnect()
    setIsMenuOpen(false)
  }

  const copyWalletAddress = () => {
    if (walletData?.publicKey) {
      navigator.clipboard.writeText(walletData.publicKey)
      alert('Wallet address copied to clipboard!')
    }
  }

  return (
    <>
      <style>{dropdownAnimation}</style>
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50 transition-all duration-300 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and App Name */}
          <div className="flex items-center space-x-1">
            <div className="flex items-center space-x-2">
              <Image 
                src="/images/logo/iconletter.png"
                alt="STELLAR NEXUS"
                width={80}
                height={24}
              />
              <p className="text-xs text-white/60">v{appConfig.version}</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-white/80 hover:text-white transition-colors relative group">
              🏠 Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-brand-400 to-accent-400 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="/demos" className="text-white/80 hover:text-white transition-colors relative group">
              🧪 Demos
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-brand-400 to-accent-400 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="/docs" className="text-white/80 hover:text-white transition-colors relative group">
              📚 Docs
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-brand-400 to-accent-400 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="https://github.com/josegomez-dev/trustless-poc" target='_blank' className="text-white/80 hover:text-white transition-colors relative group">
              📦 Repo
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-brand-400 to-accent-400 transition-all duration-300 group-hover:w-full"></span>
            </a>
          </nav>

          {/* Wallet Status and Controls */}
          <div className="flex items-center space-x-4">
            {/* Network Indicator */}
            <div className="hidden sm:flex items-center space-x-2">
              <span className="text-xs text-white/60">Network:</span>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                stellarConfig.network === 'TESTNET' 
                  ? 'bg-warning-500/30 text-warning-200 border border-warning-400/30'
                  : 'bg-success-500/30 text-success-200 border border-success-400/30'
              }`}>
                {stellarConfig.network}
              </span>
            </div>

            {/* Wallet Connection Status */}
            {isConnected && walletData ? (
              <div className="flex items-center space-x-3">
                                  <div className="hidden sm:flex items-center space-x-2">
                    <span className="text-xs text-white/60">Wallet:</span>
                    <span className="text-xs text-white/90 font-mono bg-white/20 px-2 py-1 rounded border border-white/30">
                      {walletData.publicKey ? `${walletData.publicKey.slice(0, 6)}...${walletData.publicKey.slice(-4)}` : 'Invalid Address'}
                    </span>
                  </div>
                <button
                  onClick={copyWalletAddress}
                  className="text-white/80 hover:text-white transition-colors"
                  title="Copy wallet address"
                >
                  📋
                </button>
                <button
                  onClick={handleDisconnect}
                  className="text-white/80 hover:text-red-400 transition-colors"
                  title="Disconnect wallet"
                >
                  🔌
                </button>
              </div>
            ) : (
              <div className="text-sm text-white/60">
                Wallet not connected
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-white/80 hover:text-white transition-colors"
            >
              {isMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div 
            className="md:hidden absolute top-full left-0 right-0 bg-white/10 backdrop-blur-md border-t border-white/20 shadow-xl z-50"
            style={{
              animation: 'fadeInDown 0.3s ease-out'
            }}
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a
                href="/"
                className="block px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                🏠 Home
              </a>
              <a
                href="/demos"
                className="block px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                🧪 Demos
              </a>
              <a
                href="/docs"
                className="block px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                📚 Docs
              </a>
              <a
                target='_blank'
                href="https://github.com/josegomez-dev/trustless-poc"
                className="block px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                📦 Repo
              </a>
              
              {/* Mobile Wallet Info */}
              {isConnected && walletData && (
                <div className="border-t border-white/20 pt-3 mt-3">
                  <div className="px-3 py-2">
                    <div className="text-xs text-white/60 mb-2">Connected Wallet:</div>
                    <div className="text-sm text-white/90 font-mono bg-white/20 px-2 py-1 rounded border border-white/30 break-all">
                      {walletData.publicKey || 'Invalid Address'}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-white/60">
                        Network: {walletData.network || stellarConfig.network}
                      </span>
                      <button
                        onClick={handleDisconnect}
                        className="text-red-400 hover:text-red-300 text-sm transition-colors"
                      >
                        Disconnect
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
    </>
  )
}
