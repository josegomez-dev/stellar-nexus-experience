'use client'

import { useEffect, useState } from 'react'
import { WalletSidebar } from '@/components/WalletSidebar'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { EscrowProvider } from '@/contexts/EscrowContext'
import { WalletProvider } from '@/contexts/WalletContext'
import { useGlobalWallet } from '@/contexts/WalletContext'
import { HelloMilestoneDemo } from '@/components/demos/HelloMilestoneDemo'
import { MilestoneVotingDemo } from '@/components/demos/MilestoneVotingDemo'
import { DisputeResolutionDemo } from '@/components/demos/DisputeResolutionDemo'
import { MicroTaskMarketplaceDemo } from '@/components/demos/MicroTaskMarketplaceDemo'

// Demo Selection Component
const DemoSelector = ({ activeDemo, setActiveDemo }: { 
  activeDemo: string, 
  setActiveDemo: (demo: string) => void 
}) => {
  const demos = [
    {
      id: 'hello-milestone',
      title: '1. Hello Milestone Demo',
      description: 'Simple escrow flow with automatic milestone completion',
      icon: '🚀',
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'milestone-voting',
      title: '2. Milestone Voting Demo',
      description: 'Multi-stakeholder approval system',
      icon: '🗳️',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'dispute-resolution',
      title: '3. Dispute Resolution Demo',
      description: 'Arbitration and conflict resolution flow',
      icon: '⚖️',
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'micro-marketplace',
      title: '4. Micro-Task Marketplace',
      description: 'Lightweight gig-board with escrow',
      icon: '🛒',
      color: 'from-purple-500 to-pink-500'
    }
  ]

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {demos.map((demo) => (
        <button
          key={demo.id}
          onClick={() => setActiveDemo(demo.id)}
          className={`p-6 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
            activeDemo === demo.id
              ? `border-white/50 bg-gradient-to-br ${demo.color}/20`
              : 'border-white/20 bg-white/5 hover:border-white/30 hover:bg-white/10'
          }`}
        >
          <div className="text-4xl mb-3">{demo.icon}</div>
          <h3 className="font-semibold text-white mb-2 text-left">{demo.title}</h3>
          <p className="text-sm text-white/70 text-left">{demo.description}</p>
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
            <p className="text-sm text-red-200 mb-4">
              Please connect your Stellar wallet to test the demos
            </p>
            <button
              onClick={onOpenWallet}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border-2 border-white/20 hover:border-white/40"
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
            <p className="text-xs text-green-200/80 mt-1">
              Auto-hiding in {Math.ceil(progress / 20)}s...
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

function DemosPageContent() {
  const [activeDemo, setActiveDemo] = useState('hello-milestone')
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
              <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 mb-8">
                🧪 Stellar Technology Demos
              </h1>
              <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8">
                Test and explore different aspects of the Trustless Work system on Stellar blockchain
              </p>
              
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
              🔐
            </button>
          </div>

          {/* Demo Selection */}
          <section className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-8">
                🎯 Choose Your Demo
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
        </main>

        {/* Footer */}
        <Footer />
      </div>

      {/* Wallet Sidebar */}
      <WalletSidebar 
        isOpen={walletSidebarOpen} 
        onToggle={() => setWalletSidebarOpen(!walletSidebarOpen)} 
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
