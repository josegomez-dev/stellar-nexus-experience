'use client'

import { useState } from 'react'
import { useGlobalWallet } from '@/contexts/WalletContext'
import { appConfig, stellarConfig } from '@/lib/wallet-config'
import Image from 'next/image'

export const Header = () => {
  const { walletData, isConnected, disconnect } = useGlobalWallet()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // CSS keyframes for animations
  const animations = `
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
    
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }
    
    @keyframes glow {
      0%, 100% { box-shadow: 0 0 20px rgba(34, 211, 238, 0.3); }
      50% { box-shadow: 0 0 30px rgba(34, 211, 238, 0.6), 0 0 40px rgba(147, 51, 234, 0.4); }
    }
    
    @keyframes shimmer {
      0% { background-position: -200% center; }
      100% { background-position: 200% center; }
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
      <style>{animations}</style>
      <header className="bg-white/10 backdrop-blur-md  sticky top-0 z-50 transition-all duration-300 relative">
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
              {/* Floating Navigation Bar */}
              <div className="bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-white/20 rounded-2xl px-4 py-2 shadow-2xl shadow-cyan-500/25 animate-glow">
                <div className="flex items-center space-x-1">
                  {/* Demos */}
                  <a 
                    href="/demos" 
                    className="group relative px-4 py-2 rounded-xl transition-all duration-500 hover:scale-110"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm"></div>
                    <div className="relative flex items-center space-x-3">
                      <span className="text-2xl group-hover:animate-bounce">🧪</span>
                      <span className="text-white font-semibold group-hover:text-cyan-300 transition-colors duration-300">Demos</span>
                    </div>
                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/30 to-blue-500/30 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-md"></div>
                  </a>

                  {/* Games */}
                  <a 
                    href="/mini-games" 
                    className="group relative px-4 py-2 rounded-xl transition-all duration-500 hover:scale-110"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm"></div>
                    <div className="relative flex items-center space-x-3">
                      <span className="text-2xl group-hover:animate-bounce">🎪</span>
                      <span className="text-white font-semibold group-hover:text-purple-300 transition-colors duration-300">Store</span>
                    </div>
                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400/30 to-pink-500/30 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-md"></div>
                  </a>

                  {/* Web3 Adventure */}
                  <a 
                    href="/mini-games/web3-basics-adventure" 
                    className="group relative px-4 py-2 rounded-xl transition-all duration-500 hover:scale-110"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm"></div>
                    <div className="relative flex items-center space-x-3">
                      <span className="text-2xl group-hover:animate-bounce">🎮</span>
                      <span className="text-white font-semibold group-hover:text-green-300 transition-colors duration-300">Console</span>
                    </div>
                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400/30 to-emerald-500/30 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-md"></div>
                  </a>

                  {/* Docs */}
                  <a 
                    href="/docs" 
                    className="group relative px-4 py-2 rounded-xl transition-all duration-500 hover:scale-110"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-yellow-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm"></div>
                    <div className="relative flex items-center space-x-3">
                      <span className="text-2xl group-hover:animate-bounce">📚</span>
                      <span className="text-white font-semibold group-hover:text-orange-300 transition-colors duration-300">Docs</span>
                    </div>
                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400/30 to-yellow-500/30 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-md"></div>
                  </a>
                </div>

                {/* Animated Background Elements */}
                <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
                  <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse"></div>
                  <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-pink-400 to-transparent animate-pulse" style={{ animationDelay: '1s' }}></div>
                  <div className="absolute top-1/2 left-0 w-px h-1/2 bg-gradient-to-b from-transparent via-purple-400 to-transparent animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                  <div className="absolute top-1/2 right-0 w-px h-1/2 bg-gradient-to-b from-transparent via-green-400 to-transparent animate-pulse" style={{ animationDelay: '1.5s' }}></div>
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
                href="/demos"
                className="block px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                🧪 Demos
              </a>
              <a
                href="/mini-games"
                className="block px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                🎪 Store
              </a>
              <a
                href="/mini-games/web3-basics-adventure"
                className="block px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                🎮 Console
              </a>

              <a
                href="/docs"
                className="block px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                📚 Docs
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
