'use client'

import { useState } from 'react'
import { useGlobalWallet } from '@/contexts/WalletContext'
import { appConfig, stellarConfig } from '@/lib/wallet-config'
import Image from 'next/image'

export const Header = () => {
  const { walletData, isConnected, disconnect } = useGlobalWallet()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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
    <header className="bg-white/10 backdrop-blur-md fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and App Name */}
          <div className="flex items-center space-x-1">
            <div className="flex items-center space-x-2">
              <a href="/" className="hover:opacity-80 transition-opacity duration-300">
                <Image 
                  src="/images/logo/iconletter.png"
                  alt="STELLAR NEXUS"
                  width={80}
                  height={24}
                />
              </a>
              <p className="text-xs text-white/60">v{appConfig.version}</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <div className="relative">
              {/* Simplified Navigation Bar */}
              <div className="bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-white/20 rounded-2xl px-4 py-2 shadow-2xl shadow-cyan-500/25">
                <div className="flex items-center space-x-1">
                  {/* Demos */}
                  <a 
                    href="/demos" 
                    className="group relative px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105"
                  >
                    <div className="relative flex items-center space-x-3">
                      <Image 
                        src="/images/icons/demos.png"
                        alt="Demos"
                        width={24}
                        height={24}
                        className="w-6 h-6"
                      />
                      <span className="text-white font-semibold group-hover:text-cyan-300 transition-colors duration-300">Demos</span>
                    </div>
                  </a>

                  {/* Games */}
                  <a 
                    href="/mini-games" 
                    className="group relative px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105"
                  >
                    <div className="relative flex items-center space-x-3">
                      <Image 
                        src="/images/icons/store.png"
                        alt="Store"
                        width={24}
                        height={24}
                        className="w-6 h-6"
                      />
                      <span className="text-white font-semibold group-hover:text-purple-300 transition-colors duration-300">Store</span>
                    </div>
                  </a>

                  {/* Web3 Adventure */}
                  <a 
                    href="/mini-games/web3-basics-adventure" 
                    className="group relative px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105"
                  >
                    <div className="relative flex items-center space-x-3">
                      <Image 
                        src="/images/icons/console.png"
                        alt="Console"
                        width={24}
                        height={24}
                        className="w-6 h-6"
                      />
                      <span className="text-white font-semibold group-hover:text-green-300 transition-colors duration-300">Console</span>
                    </div>
                  </a>

                  {/* Docs */}
                  <a 
                    href="/docs" 
                    className="group relative px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105"
                  >
                    <div className="relative flex items-center space-x-3">
                      <Image 
                        src="/images/icons/docs.png"
                        alt="Docs"
                        width={24}
                        height={24}
                        className="w-6 h-6"
                      />
                      <span className="text-white font-semibold group-hover:text-orange-300 transition-colors duration-300">Docs</span>
                    </div>
                  </a>
                </div>
              </div>
            </div>
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
                  <span className="text-xs text-white/90 font-mono bg-white/20 px-2 py-1 rounded border border-white/30 backdrop-blur-sm">
                    {walletData.publicKey ? `${walletData.publicKey.slice(0, 6)}...${walletData.publicKey.slice(-4)}` : 'Invalid Address'}
                  </span>
                </div>
                <button
                  onClick={copyWalletAddress}
                  className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded"
                  title="Copy wallet address"
                >
                  📋
                </button>
                <button
                  onClick={handleDisconnect}
                  className="text-white/80 hover:text-red-400 transition-colors p-1 hover:bg-white/10 rounded"
                  title="Disconnect wallet"
                >
                  🔌
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-white/60 hidden sm:inline">Wallet not connected</span>
                <button
                  onClick={() => {
                    // Dispatch custom event to open wallet sidebar
                    window.dispatchEvent(new CustomEvent('toggleWalletSidebar'))
                    // Also dispatch an event to expand the sidebar
                    setTimeout(() => {
                      window.dispatchEvent(new CustomEvent('expandWalletSidebar'))
                    }, 100)
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white text-sm font-medium rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border border-white/20 hover:border-white/40 cursor-pointer group relative"
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">🔗</span>
                    <span>Connect</span>
                    <span className="text-xs opacity-70 group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </div>
                </button>
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
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white/10 backdrop-blur-md border-t border-white/20 shadow-xl z-50">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <a
              href="/demos"
              className="block px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-md transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center space-x-2">
                <Image 
                  src="/images/icons/demos.png"
                  alt="Demos"
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
                <span>Demos</span>
              </div>
            </a>
            <a
              href="/mini-games"
              className="block px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-md transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center space-x-2">
                <Image 
                  src="/images/icons/store.png"
                  alt="Store"
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
                <span>Store</span>
              </div>
            </a>
            <a
              href="/mini-games/web3-basics-adventure"
              className="block px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-md transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center space-x-2">
                <Image 
                  src="/images/icons/console.png"
                  alt="Console"
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
                <span>Console</span>
              </div>
            </a>

            <a
              href="/docs"
              className="block px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-md transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center space-x-2">
                <Image 
                  src="/images/icons/docs.png"
                  alt="Docs"
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
                <span>Docs</span>
              </div>
            </a>
            
            {/* Mobile Wallet Status */}
            <div className="border-t border-white/20 pt-2 mt-2">
              {isConnected && walletData ? (
                <div className="px-3 py-2">
                  <div className="text-xs text-white/60 mb-1">Connected Wallet:</div>
                  <div className="text-xs text-white/90 font-mono bg-white/20 px-2 py-1 rounded border border-white/30">
                    {walletData.publicKey ? `${walletData.publicKey.slice(0, 6)}...${walletData.publicKey.slice(-4)}` : 'Invalid Address'}
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent('toggleWalletSidebar'))
                    setTimeout(() => {
                      window.dispatchEvent(new CustomEvent('expandWalletSidebar'))
                    }, 100)
                    setIsMenuOpen(false)
                  }}
                  className="w-full text-left px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                >
                  🔗 Connect Wallet
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
