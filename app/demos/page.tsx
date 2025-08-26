'use client'

import { useEffect, useState } from 'react'
import { WalletSidebar } from '@/components/WalletSidebar'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { NexusPrime } from '@/components/NexusPrime'
import { EscrowProvider } from '@/contexts/EscrowContext'
import { WalletProvider } from '@/contexts/WalletContext'
import { useGlobalWallet } from '@/contexts/WalletContext'
import { HelloMilestoneDemo } from '@/components/demos/HelloMilestoneDemo'
import { MilestoneVotingDemo } from '@/components/demos/MilestoneVotingDemo'
import { DisputeResolutionDemo } from '@/components/demos/DisputeResolutionDemo'
import { MicroTaskMarketplaceDemo } from '@/components/demos/MicroTaskMarketplaceDemo'
import { OnboardingOverlay } from '@/components/OnboardingOverlay'
import Image from 'next/image'

// Demo Selection Component
interface Demo {
  id: string
  title: string
  subtitle: string
  description: string
  icon: string
  color: string
}

const DemoSelector = ({ activeDemo, setActiveDemo }: { 
  activeDemo: string, 
  setActiveDemo: (demo: string) => void 
}) => {
  const demos = [
    {
      id: 'hello-milestone',
      title: '1. Baby Steps to Riches 🍼💰',
      subtitle: 'Basic Escrow Flow Demo',
      description: 'Simple escrow flow with automatic milestone completion. Learn the fundamentals of trustless work: initialize escrow, fund it, complete milestones, approve work, and automatically release funds.',
      icon: '/images/demos/babysteps.png',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'milestone-voting',
      title: '2. Democracy in Action 🗳️',
      subtitle: 'Multi-Stakeholder Approval System',
      description: 'Multi-stakeholder approval system where multiple reviewers must approve milestones before funds are released. Perfect for complex projects requiring multiple sign-offs.',
      icon: '/images/demos/democracyinaction.png',
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'dispute-resolution',
      title: '3. Drama Queen Escrow 👑🎭',
      subtitle: 'Dispute Resolution & Arbitration',
      description: 'Arbitration drama - who will win the trust battle? Experience the full dispute resolution workflow: raise disputes, present evidence, and let arbitrators decide the outcome.',
      icon: '/images/demos/drama.png',
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'micro-marketplace',
      title: '4. Gig Economy Madness 🛒',
      subtitle: 'Micro-Task Marketplace',
      description: 'Lightweight gig-board with escrow! Post tasks, browse opportunities, and manage micro-work with built-in escrow protection for both clients and workers.',
      icon: '/images/demos/babysteps.png',
      color: 'from-purple-500 to-pink-500'
    }
  ]

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
      {demos.map((demo) => (
        <button
          key={demo.id}
          onClick={() => setActiveDemo(demo.id)}
          className={`demo-card p-6 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 min-h-[280px] ${
            activeDemo === demo.id
              ? `border-white/50 bg-gradient-to-br ${demo.color}/20`
              : 'border-white/20 bg-gradient-to-br from-white/5 to-white/10 hover:border-white/30 hover:from-white/10 hover:to-white/15'
          }`}
          data-demo-id={demo.id}
        >
          <div className="mb-3 flex justify-center">
            <Image 
              src={demo.icon} 
              alt={demo.title}
              width={64} 
              height={64}
              className="w-16 h-16"
            />
          </div>
          <h3 className="font-bold text-white mb-2 text-left text-lg leading-tight">{demo.title}</h3>
          <h4 className="font-semibold text-cyan-300 mb-3 text-left text-sm uppercase tracking-wide">{demo.subtitle}</h4>
          <p className="text-sm text-white/70 text-left leading-relaxed">{demo.description}</p>
        </button>
      ))}
    </div>
  )
}

// Wallet Status Component
const WalletStatus = ({ onOpenWallet }: { onOpenWallet: () => void }) => {
  const { walletData, isConnected } = useGlobalWallet()
  const [showConnected, setShowConnected] = useState(true)
  const [progress, setProgress] = useState(100)
  
  // Auto-hide connected message after 5 seconds
  useEffect(() => {
    if (isConnected && walletData) {
      setShowConnected(true)
      setProgress(100)
      
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev <= 0) {
            setShowConnected(false)
            return 0
          }
          return prev - 2 // Decrease by 2% every 100ms (5 seconds total)
        })
      }, 100)
      
      return () => clearInterval(interval)
    }
  }, [isConnected, walletData])
  
  if (!isConnected || !walletData) {
    return (
      <div className="max-w-4xl mx-auto mb-8 p-6 bg-gradient-to-r from-red-500/20 to-orange-500/20 backdrop-blur-sm border border-red-400/30 rounded-xl shadow-2xl">
        <div className="flex items-center justify-center space-x-6">
          <span className="text-3xl">⚠️</span>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-red-300 mb-2">
              Wallet Not Connected
            </h3>
            <p className="hidden sm:block text-sm text-red-200 mb-4">
              Please connect your Stellar wallet to test the demos
            </p>
            <button
              onClick={onOpenWallet}
              className="wallet-connect-button px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border-2 border-white/20 hover:border-white/40"
            >
              🔗 Connect Wallet
            </button>
          </div>
        </div>
      </div>
    )
  }
  
  if (!showConnected) {
    return null
  }
  
  return (
    <div className="max-w-4xl mx-auto mb-8 p-6 bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-green-400/30 rounded-xl shadow-2xl relative overflow-hidden">
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 h-1 bg-gradient-to-r from-green-400 to-emerald-400 transition-all duration-100 ease-linear" 
           style={{ width: `${progress}%` }}>
      </div>
      
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
            <p className="hidden sm:block text-xs text-green-200/80 mt-1">
              Auto-hiding in {Math.ceil(progress / 20)}s...
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="hidden sm:block text-xs text-green-200 mb-1">Your Address:</p>
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

function DemosPageContent() {
  const { isConnected } = useGlobalWallet()
  const [activeDemo, setActiveDemo] = useState('hello-milestone')
  const [walletSidebarOpen, setWalletSidebarOpen] = useState(false)
  const [walletExpanded, setWalletExpanded] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false)

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

  const handleOpenWallet = () => {
    setWalletSidebarOpen(true)
    // Dispatch event to expand the wallet sidebar
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('walletSidebarToggle', {
        detail: { isOpen: true, isExpanded: true }
      }))
    }, 100)
  }

  const renderActiveDemo = () => {
    switch (activeDemo) {
      case 'hello-milestone':
        return <HelloMilestoneDemo />
      case 'milestone-voting':
        return <MilestoneVotingDemo />
      case 'dispute-resolution':
        return <DisputeResolutionDemo />
      case 'micro-marketplace':
        return <MicroTaskMarketplaceDemo />
      default:
        return <HelloMilestoneDemo />
    }
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
          <section className="container mx-auto px-4 py-16">
            <div className="text-center">
              <div className="flex flex-col items-center mb-8">
                <div className="mb-4">
                  <Image 
                    src="/images/logo/logoicon.png"
                    alt="STELLAR NEXUS Icon"
                    width={60}
                    height={60}
                    className="w-15 h-15"
                  />
                </div>
                <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
                  <div className="flex items-center justify-center space-x-3">
          <Image 
            src="/images/logo/logoicon.png" 
            alt="STELLAR NEXUS" 
            width={32} 
            height={32} 
            className="w-8 h-8"
          />
          <span>ESCROW ARSENAL</span>
        </div>
                </h1>
              </div>
              <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8">
                Master the art of trustless work with our hilarious demo suite on Stellar blockchain
              </p>
              
              {/* Onboarding Trigger */}
              <div className="mb-8">
                <button
                  onClick={() => setShowOnboarding(true)}
                  className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border-2 border-white/20 hover:border-white/40"
                >
                  <div className="flex items-center space-x-2">
                    <Image
                      src="/images/logo/logoicon.png"
                      alt="Tutorial"
                      width={20}
                      height={20}
                      className="w-5 h-5"
                    />
                    <span>Start Interactive Tutorial</span>
                  </div>
                </button>
                {!hasSeenOnboarding && (
                  <div className="mt-3 text-center">
                    <p className="text-cyan-300 text-sm animate-pulse">
                      💡 New here? Start with the tutorial to learn how everything works!
                    </p>
                  </div>
                )}
              </div>
              
              {/* Wallet Status */}
              <WalletStatus onOpenWallet={handleOpenWallet} />
            </div>
          </section>

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
                className="w-4 h-4"
              />
            </button>
          </div>

          {/* Demo Selection */}
          <section className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-8">
                🎭 Pick Your Adventure
              </h2>
              
              <DemoSelector activeDemo={activeDemo} setActiveDemo={setActiveDemo} />
            </div>
          </section>

          {/* Active Demo Display */}
          <section className="container mx-auto px-4 py-10">
            <div className="max-w-6xl mx-auto">
              {renderActiveDemo()}
            </div>
          </section>

          {/* Floating Help Button */}
          <div className="fixed bottom-8 right-8 z-40">
            <button
              onClick={() => setShowOnboarding(true)}
              className="p-4 bg-gradient-to-br from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 border-2 border-white/20"
              title="Get Help & Tutorial"
            >
              <Image
                src="/images/logo/logoicon.png"
                alt="Help"
                width={20}
                height={20}
                className="w-5 h-5"
              />
            </button>
          </div>
        </main>

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
        currentPage="demos"
        currentDemo={activeDemo}
        walletConnected={isConnected}
      />

      {/* Onboarding Overlay */}
      <OnboardingOverlay
        isActive={showOnboarding}
        onComplete={() => {
          setShowOnboarding(false)
          setHasSeenOnboarding(true)
        }}
        currentDemo={activeDemo}
      />
    </EscrowProvider>
  )
}

export default function DemosPage() {
  return (
    <WalletProvider>
      <DemosPageContent />
    </WalletProvider>
  )
}
