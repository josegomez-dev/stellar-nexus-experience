'use client'

import { WalletSidebar } from '@/components/WalletSidebar'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { NexusPrime } from '@/components/NexusPrime'
import { EscrowProvider } from '@/contexts/EscrowContext'
import { WalletProvider } from '@/contexts/WalletContext'
import { useGlobalWallet } from '@/contexts/WalletContext'
import { useState, useEffect } from 'react'
import Image from 'next/image'

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
  const { isConnected } = useGlobalWallet()
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

          {/* Wallet Sidebar Toggle */}
          <div className="fixed top-20 right-4 z-30 lg:hidden">
            <button
              onClick={() => setWalletSidebarOpen(true)}
              className="p-3 bg-gradient-to-br from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white rounded-full shadow-lg transition-all duration-300 transform hover:scale-110"
              title="Open Wallet"
            >
              <Image
                src="/images/logo/logoicon.png"
                alt="Wallet"
                width={16}
                height={16}
                className="w-6 h-4"
              />
            </button>
          </div>


          {/* Demos Section */}
          <section className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">

              {/* add logo letter here */}
              <div className="flex justify-center -mt-[50px]">
                <Image src="/images/logo/iconletter.png" alt="STELLAR NEXUS" width={350} height={100} />
              </div>

              <p className="text-white/80 mb-8 -mt-[100px]">
                Explore the ESCROW ARSENAL and see how it works in action.
              </p>

              <div className="flex justify-center -mb-10 relative">
                <Image src="/images/character/character.png" alt="Nexus Prime" width={200} height={200} />
                
                {/* Plasma Ball Effect */}
                <div className="absolute top-8 right-8 w-16 h-16 animate-float">
                  {/* Core Plasma Ball */}
                  <div className="plasma-core absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 animate-pulse"></div>
                  
                  {/* Energy Rings */}
                  <div className="plasma-ring-1 absolute inset-0 rounded-full border-2 border-cyan-300/60 animate-spin" style={{ animationDuration: '3s' }}></div>
                  <div className="plasma-ring-2 absolute inset-0 rounded-full border border-blue-400/40 animate-spin" style={{ animationDuration: '4s', animationDirection: 'reverse' }}></div>
                  <div className="plasma-ring-3 absolute inset-0 rounded-full border border-purple-500/50 animate-spin" style={{ animationDuration: '5s' }}></div>
                  
                  {/* Energy Particles */}
                  <div className="plasma-particle-1 absolute top-0 left-1/2 w-2 h-2 bg-cyan-300 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                  <div className="plasma-particle-2 absolute top-1/4 right-0 w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
                  <div className="plasma-particle-3 absolute bottom-1/4 left-0 w-1 h-1 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
                  <div className="plasma-particle-4 absolute bottom-0 right-1/4 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '1.5s' }}></div>
                  
                  {/* Glow Effect */}
                  <div className="plasma-glow absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400/20 via-blue-500/20 to-purple-600/20 blur-xl animate-pulse"></div>
                  
                  {/* Electric Arcs */}
                  <div className="plasma-arc-1 absolute top-0 left-0 w-full h-full">
                    <div className="absolute top-1/2 left-1/2 w-1 h-8 bg-gradient-to-b from-cyan-300 to-transparent animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <div className="plasma-arc-2 absolute top-0 left-0 w-full h-full">
                    <div className="absolute top-1/2 left-1/2 w-1 h-6 bg-gradient-to-b from-blue-400 to-transparent animate-pulse" style={{ animationDelay: '0.7s' }}></div>
                  </div>
                  <div className="plasma-arc-3 absolute top-0 left-0 w-full h-full">
                    <div className="absolute top-1/2 left-1/2 w-1 h-10 bg-gradient-to-b from-purple-500 to-transparent animate-pulse" style={{ animationDelay: '1.2s' }}></div>
                  </div>
                </div>
              </div>
                            <a
                href="/demos"
                className="inline-block px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-3"
              >
                <Image 
                  src="/images/logo/logoicon.png" 
                  alt="STELLAR NEXUS" 
                  width={24} 
                  height={24} 
                  className="w-6 h-6"
                />
                <span>ESCROW <strong style={{ color: 'gold' }}>ARSENAL</strong></span>
              </a>

              <br />
              <br />

              <div className="epic-container max-w-4xl mx-auto p-6 relative">
                {/* Floating Particles */}
                <div className="epic-particle"></div>
                <div className="epic-particle"></div>
                <div className="epic-particle"></div>
                <div className="epic-particle"></div>
                <div className="epic-particle"></div>
                
                <p className="epic-text text-2xl md:text-3xl text-center leading-relaxed">
                  Experience the future of decentralized work with the ESCROW ARSENAL on the Stellar blockchain
                </p>
                
                {/* Epic Subtitle */}
                <p className="text-cyan-300 text-lg text-center mt-4 font-medium animate-pulse">
                  ✨ Where Trust Meets Innovation ✨
                </p>
              </div>

            </div>
          </section>

          {/* Features Section */}
          <section id="features" className="container mx-auto px-4 -mb-[50px]">
            <div className="max-w-4xl mx-auto">
              <br />
              <br />
              <div className="text-center mb-12">
                                <div className="flex justify-center items-center space-x-3 mb-4">
                  <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                    About STELLAR
                  </h2>
                </div>
              </div>
              
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
            <Image
              src="/images/logo/logoicon.png"
              alt="Back to top"
              width={20}
              height={20}
              className="w-5 h-5"
            />
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

      {/* NEXUS PRIME Character */}
      <NexusPrime 
        currentPage="home"
        walletConnected={isConnected}
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
