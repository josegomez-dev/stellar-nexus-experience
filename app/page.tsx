'use client'

import { WalletSidebar } from '@/components/WalletSidebar'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { EscrowProvider } from '@/contexts/EscrowContext'
import { WalletProvider } from '@/contexts/WalletContext'
import { useGlobalWallet } from '@/contexts/WalletContext'
import { useState, useEffect } from 'react'

// Wallet Address Display Component
const WalletAddressDisplay = () => {
  const { walletData, isConnected } = useGlobalWallet()
  
  if (!isConnected || !walletData) {
    return null
  }
  
  return (
    <div className="max-w-4xl mx-auto mb-8 p-6 bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-green-400/30 rounded-xl shadow-2xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-3xl">✅</span>
          <div>
            <h3 className="text-lg font-semibold text-green-300">
              Wallet Connected
            </h3>
            <p className="text-sm text-green-200">
              Network: {walletData.network}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-green-200 mb-1">Your Address:</p>
          <div className="flex items-center space-x-2">
            <p className="font-mono text-sm text-green-300 bg-green-900/50 px-3 py-2 rounded-lg border border-green-400/30">
              {walletData.publicKey.slice(0, 8)}...{walletData.publicKey.slice(-8)}
            </p>
            <button
              onClick={() => {
                navigator.clipboard.writeText(walletData.publicKey);
                alert('Full wallet address copied to clipboard!');
              }}
              className="text-green-300 hover:text-green-100 text-lg transition-colors"
              title="Copy full address"
            >
              📋
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function HomeContent() {
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [walletSidebarOpen, setWalletSidebarOpen] = useState(false)
  const [walletExpanded, setWalletExpanded] = useState(false)

  // Listen for wallet sidebar state changes
  useEffect(() => {
    const handleWalletSidebarToggle = (event: CustomEvent) => {
      setWalletSidebarOpen(event.detail.isOpen)
      setWalletExpanded(event.detail.isExpanded)
    }

    window.addEventListener('walletSidebarToggle', handleWalletSidebarToggle as EventListener)
    return () => {
      window.removeEventListener('walletSidebarToggle', handleWalletSidebarToggle as EventListener)
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <EscrowProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        {/* Header */}
        <Header />
        
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20 bg-gradient-to-r from-cyan-500/10 via-transparent to-purple-500/10"></div>
        
        {/* Main Content */}
        <main className={`relative z-10 transition-all duration-500 ease-out ${
          walletSidebarOpen && walletExpanded ? 'mr-96' : walletSidebarOpen ? 'mr-20' : 'mr-0'
        } ${!walletSidebarOpen ? 'pb-32' : 'pb-8'}`}>
          {/* Hero Section */}
          <section id="home" className="container mx-auto px-4 py-10">
            <div className="text-center">
              <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 mb-8">
                🚀 Trustless Work POC
              </h1>
              <p className="text-xl text-white/80 max-w-3xl mx-auto">
                Experience the future of decentralized work with escrow management on the Stellar blockchain
              </p>
              
              {/* Wallet Address Display */}
              <WalletAddressDisplay />
            </div>
          </section>

          {/* Wallet Sidebar Toggle */}
          <div className="fixed top-20 right-4 z-30 lg:hidden">
            <button
              onClick={() => setWalletSidebarOpen(true)}
              className="p-3 bg-gradient-to-br from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white rounded-full shadow-lg transition-all duration-300 transform hover:scale-110"
              title="Open Wallet"
            >
              🔐
            </button>
          </div>


          {/* Demos Section */}
          <section className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <a
                href="/demos"
                className="inline-block px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                🚀 Explore Demos
              </a>
            </div>
          </section>

          {/* Features Section */}
          <section id="features" className="container mx-auto px-4 ">
            <div className="max-w-4xl mx-auto">
              <br />
              <br />
              <h2 className="text-3xl md:text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-12">
                ⭐ About Stellar Blockchain
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6 text-white/90">
                <div className="text-center p-6 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg border border-white/20 hover:border-white/40 transition-all duration-300">
                  <div className="text-4xl mb-4">🌐</div>
                  <h4 className="font-semibold mb-3 text-lg">Decentralized Network</h4>
                  <p className="text-sm">Open-source, decentralized protocol for digital currency to fiat money transfers</p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-lg border border-white/20 hover:border-white/40 transition-all duration-300">
                  <div className="text-4xl mb-4">⚡</div>
                  <h4 className="font-semibold mb-3 text-lg">Fast & Low-Cost</h4>
                  <p className="text-sm">3-5 second settlement times with minimal transaction fees</p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg border border-white/20 hover:border-white/40 transition-all duration-300">
                  <div className="text-4xl mb-4">🔒</div>
                  <h4 className="font-semibold mb-3 text-lg">Secure & Reliable</h4>
                  <p className="text-sm">Built on proven cryptographic principles with 99.9% uptime</p>
                </div>
              </div>
            </div>
          </section>

        </main>

        {/* Back to Top Button */}
        {showBackToTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-cyan-500 to-purple-600 text-white p-3 rounded-full shadow-lg hover:from-cyan-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-110 backdrop-blur-sm border border-white/20"
            title="Back to top"
          >
            <span className="text-xl">⬆️</span>
          </button>
        )}

        {/* Footer */}
        <Footer />
      </div>

      {/* Wallet Sidebar */}
      <WalletSidebar 
        isOpen={walletSidebarOpen} 
        onToggle={() => setWalletSidebarOpen(!walletSidebarOpen)} 
      />
    </EscrowProvider>
  );
}

export default function Home() {
  return (
    <WalletProvider>
      <HomeContent />
    </WalletProvider>
  )
}
