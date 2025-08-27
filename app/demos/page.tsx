'use client'

import { useEffect, useState, useRef } from 'react'
import { WalletSidebar } from '@/components/WalletSidebar'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { NexusPrime } from '@/components/NexusPrime'
import { EscrowProvider } from '@/contexts/EscrowContext'
import { WalletProvider } from '@/contexts/WalletContext'
import { TransactionProvider } from '@/contexts/TransactionContext'
import { ToastProvider } from '@/contexts/ToastContext'
import { useGlobalWallet } from '@/contexts/WalletContext'
import { HelloMilestoneDemo } from '@/components/demos/HelloMilestoneDemo'
import { MilestoneVotingDemo } from '@/components/demos/MilestoneVotingDemo'
import { DisputeResolutionDemo } from '@/components/demos/DisputeResolutionDemo'
import { MicroTaskMarketplaceDemo } from '@/components/demos/MicroTaskMarketplaceDemo'
import { OnboardingOverlay } from '@/components/OnboardingOverlay'
import { ToastContainer } from '@/components/Toast'
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
  const handleDemoSelect = (demoId: string) => {
    setActiveDemo(demoId)
    
    // Smooth scroll to the demo display section
    setTimeout(() => {
      const demoSection = document.getElementById('active-demo-display')
      if (demoSection) {
        demoSection.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        })
      }
    }, 100)
  }
  const demos = [
    {
      id: 'hello-milestone',
      title: '1. Baby Steps to Riches',
      subtitle: 'Basic Escrow Flow Demo',
      description: 'Simple escrow flow with automatic milestone completion. Learn the fundamentals of trustless work: initialize escrow, fund it, complete milestones, approve work, and automatically release funds.',
      icon: '/images/demos/babysteps.png',
      color: 'from-brand-500 to-brand-400'
    },
    {
      id: 'milestone-voting',
      title: '2. Democracy in Action',
      subtitle: 'Multi-Stakeholder Approval System',
      description: 'Multi-stakeholder approval system where multiple reviewers must approve milestones before funds are released. Perfect for complex projects requiring multiple sign-offs.',
      icon: '/images/demos/democracyinaction.png',
      color: 'from-success-500 to-success-400'
    },
    {
      id: 'dispute-resolution',
      title: '3. Drama Queen Escrow',
      subtitle: 'Dispute Resolution & Arbitration',
      description: 'Arbitration drama - who will win the trust battle? Experience the full dispute resolution workflow: raise disputes, present evidence, and let arbitrators decide the outcome.',
      icon: '/images/demos/drama.png',
      color: 'from-warning-500 to-warning-400'
    },
    {
      id: 'micro-marketplace',
      title: '4. Gig Economy Madness',
      subtitle: 'Micro-Task Marketplace',
      description: 'Lightweight gig-board with escrow! Post tasks, browse opportunities, and manage micro-work with built-in escrow protection for both clients and workers.',
      icon: '/images/demos/economy.png',
      color: 'from-accent-500 to-accent-400'
    }
  ]

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
      {demos.map((demo) => (
        <button
          key={demo.id}
          onClick={() => handleDemoSelect(demo.id)}
          className={`demo-card p-6 rounded-xl border-2 transition-all duration-500 ease-out transform hover:scale-105 min-h-[280px] relative overflow-hidden group ${
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
          
          {/* Epic Legendary Background for Demo Title */}
          <div className="relative mb-2">
            {/* Energy Background */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Energy Core */}
              <div className="absolute inset-0 bg-gradient-to-r from-brand-500/20 via-accent-500/25 to-brand-400/20 rounded-lg blur-sm"></div>
              
              {/* Floating Particles */}
              <div className="absolute top-1 left-1/4 w-1 h-1 bg-brand-400 rounded-full animate-ping opacity-70"></div>
              <div className="absolute top-2 right-1/3 w-1 h-1 bg-accent-400 rounded-full animate-ping opacity-80" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute bottom-1 left-1/3 w-1 h-1 bg-brand-300 rounded-full animate-ping opacity-60" style={{ animationDelay: '1s' }}></div>
              
              {/* Energy Streams */}
              <div className="absolute left-0 top-1/2 w-1 h-6 bg-gradient-to-b from-transparent via-brand-400/40 to-transparent animate-pulse opacity-50"></div>
              <div className="absolute right-0 top-1/2 w-1 h-4 bg-gradient-to-b from-transparent via-accent-400/40 to-transparent animate-pulse opacity-60"></div>
            </div>
            
            {/* Demo Title with Enhanced Styling */}
            <h3 className="relative z-10 font-bold text-white text-left text-lg leading-tight drop-shadow-lg group-hover:drop-shadow-2xl group-hover:text-brand-200 transition-all duration-500">{demo.title}</h3>
          </div>
          
          <h4 className="font-semibold text-brand-300 mb-3 text-left text-sm uppercase tracking-wide">{demo.subtitle}</h4>
          <p className="text-sm text-white/70 text-left leading-relaxed">{demo.description}</p>
        </button>
      ))}
    </div>
  )
}

// Wallet Status Component
const WalletStatus = ({ onOpenWallet, onShowConnectedChange }: { 
  onOpenWallet: () => void
  onShowConnectedChange: (show: boolean) => void 
}) => {
  const { walletData, isConnected } = useGlobalWallet()
  const [showConnected, setShowConnected] = useState(true)
  const [progress, setProgress] = useState(100)
  
  // Auto-hide connected message after 10 seconds
  useEffect(() => {
    if (isConnected && walletData) {
      setShowConnected(true)
      setProgress(100)
      
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev <= 0) {
            setShowConnected(false)
            onShowConnectedChange(false) // Notify parent component
            return 0
          }
          return prev - 1 // Decrease by 1% every 100ms (10 seconds total)
        })
      }, 100)
      
      return () => clearInterval(interval)
    } else {
      // Reset states when wallet disconnects
      setShowConnected(false)
      setProgress(0)
    }
  }, [isConnected, walletData])
  
  if (!isConnected || !walletData) {
    return (
      <div className="max-w-4xl mx-auto mb-8 p-6 bg-gradient-to-r from-danger-500/20 to-warning-500/20 backdrop-blur-sm border border-danger-400/30 rounded-xl shadow-2xl transition-all duration-500 ease-in-out">
        <div className="flex items-center justify-center space-x-6">
          <span style={{ fontSize: '2rem'}}>⚠️</span>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-danger-300 mb-2">
              Wallet Not Connected
            </h3>
            <p className="hidden sm:block text-sm text-danger-200 mb-4">
              Please connect your Stellar wallet to test the demos
            </p>
            <button
              onClick={onOpenWallet}
              className="wallet-connect-button px-8 py-4 bg-gradient-to-r from-brand-500 to-accent-600 hover:from-brand-600 hover:to-accent-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border-2 border-white/20 hover:border-white/40"
            >
              🔗 Connect Wallet
            </button>
          </div>
        </div>
      </div>
    )
  }
  
  if (!showConnected) {
    return null // Completely remove from DOM to eliminate blank space
  }
  
  return (
    <div className="max-w-4xl mx-auto mb-8 p-6 bg-gradient-to-r from-success-500/20 to-success-400/20 backdrop-blur-sm border border-success-400/30 rounded-xl shadow-2xl relative overflow-hidden transition-all duration-500 ease-in-out">
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 h-1 bg-gradient-to-r from-success-400 to-success-300 transition-all duration-100 ease-linear" 
           style={{ width: `${progress}%` }}>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-3xl">✅</span>
          <div>
            <h3 className="text-lg font-semibold text-success-300">
              Wallet Connected
            </h3>
            <p className="text-sm text-success-200">
              Network: {walletData.network}
            </p>
            <p className="hidden sm:block text-xs text-success-200/80 mt-1">
              Auto-hiding in {Math.ceil(progress / 10)}s...
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="hidden sm:block text-xs text-success-200 mb-1">Your Address:</p>
          <div className="flex items-center space-x-2">
            <p className="font-mono text-sm text-success-300 bg-success-900/50 px-3 py-2 rounded-lg border border-success-400/30">
              {walletData.publicKey.slice(0, 8)}...{walletData.publicKey.slice(-8)}
            </p>
            <button
              onClick={() => {
                navigator.clipboard.writeText(walletData.publicKey);
                alert('Full wallet address copied to clipboard!');
              }}
              className="text-success-300 hover:text-success-100 text-lg transition-colors"
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
  
  // Prevent layout shifts by maintaining consistent spacing
  const walletNotificationRef = useRef<HTMLDivElement>(null)
  const [walletNotificationHeight, setWalletNotificationHeight] = useState(0)
  const [showWalletConnected, setShowWalletConnected] = useState(true)

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
  
  // Measure wallet notification height to prevent layout shifts
  useEffect(() => {
    if (walletNotificationRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setWalletNotificationHeight(entry.contentRect.height)
        }
      })
      
      resizeObserver.observe(walletNotificationRef.current)
      return () => resizeObserver.disconnect()
    }
  }, [isConnected])

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
      <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-brand-900 to-neutral-900 relative overflow-hidden">
        {/* Header */}
        <Header />
        
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20 bg-gradient-to-r from-brand-500/10 via-transparent to-accent-500/10"></div>
        
        {/* Main Content */}
        <main className={`relative z-10 transition-all duration-500 ease-out ${
          walletSidebarOpen && walletExpanded ? 'mr-96' : walletSidebarOpen ? 'mr-20' : 'mr-0'
        } ${!walletSidebarOpen ? 'pb-32' : 'pb-8'}`}>
          {/* Hero Section */}
          <section className="container mx-auto px-4 py-16">
            <div className="text-center">


              {/* Page Header */}
              <div className="text-center mb-16">
                <div className="flex justify-center mb-6">
                  <Image 
                    src="/images/character/nexus-prime-chat.png" 
                    alt="STELLAR NEXUS" 
                    width={180} 
                    height={120}
                    style={{ zIndex: -1, position: 'relative' }}
                  />
                </div>
                
                {/* Epic Legendary Background for Title */}
                <div className="relative mb-8">
                  {/* Legendary Energy Background */}
                  <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
                    {/* Primary Energy Core */}
                    <div className="relative w-[500px] h-40">
                      {/* Inner Energy Ring */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-brand-500/40 via-accent-500/50 to-brand-400/40 blur-lg scale-150"></div>
                      
                      {/* Middle Energy Ring */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-accent-500/30 via-brand-500/40 to-accent-400/30 blur-xl scale-200"></div>
                      
                      {/* Outer Energy Ring */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-brand-400/20 via-accent-500/30 to-brand-300/20 blur-2xl scale-250"></div>
                    </div>
                    
                    {/* Floating Energy Particles */}
                    <div className="absolute inset-0">
                      <div className="absolute top-6 left-1/4 w-3 h-3 bg-brand-400 rounded-full animate-ping opacity-80"></div>
                      <div className="absolute top-12 right-1/3 w-2 h-2 bg-accent-400 rounded-full animate-ping opacity-90" style={{ animationDelay: '0.5s' }}></div>
                      <div className="absolute bottom-8 left-1/3 w-2.5 h-2.5 bg-brand-300 rounded-full animate-ping opacity-70" style={{ animationDelay: '1s' }}></div>
                      <div className="absolute bottom-12 right-1/4 w-2 h-2 bg-accent-300 rounded-full animate-ping opacity-85" style={{ animationDelay: '1.5s' }}></div>
                      <div className="absolute top-1/2 left-1/6 w-1.5 h-1.5 bg-brand-200 rounded-full animate-ping opacity-60" style={{ animationDelay: '2s' }}></div>
                      <div className="absolute top-1/2 right-1/6 w-2 h-2 bg-accent-200 rounded-full animate-ping opacity-75" style={{ animationDelay: '2.5s' }}></div>
                    </div>
                    
                    {/* Energy Wave Rings */}
                    <div className="absolute inset-0">
                      <div className="absolute inset-0 rounded-full border-2 border-brand-400/40 animate-ping scale-150" style={{ animationDuration: '4s' }}></div>
                      <div className="absolute inset-0 rounded-full border border-accent-400/30 animate-ping scale-200" style={{ animationDuration: '5s' }}></div>
                      <div className="absolute inset-0 rounded-full border border-brand-300/25 animate-ping scale-250" style={{ animationDuration: '6s' }}></div>
                    </div>
                    
                    {/* Plasma Energy Streams */}
                    <div className="absolute inset-0">
                      <div className="absolute left-0 top-1/2 w-1 h-24 bg-gradient-to-b from-transparent via-brand-400/50 to-transparent animate-pulse opacity-60" style={{ animationDuration: '3s' }}></div>
                      <div className="absolute right-0 top-1/2 w-1 h-20 bg-gradient-to-b from-transparent via-accent-400/50 to-transparent animate-pulse opacity-70" style={{ animationDuration: '2.5s' }}></div>
                      <div className="absolute top-0 left-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-brand-400/50 to-transparent animate-pulse opacity-50" style={{ animationDuration: '3.5s' }}></div>
                      <div className="absolute bottom-0 left-1/2 w-20 h-1 bg-gradient-to-r from-transparent via-accent-400/50 to-transparent animate-pulse opacity-65" style={{ animationDuration: '2.8s' }}></div>
                    </div>
                  </div>
                  
                  {/* Title with Enhanced Styling */}
                  <h1 className="relative z-10 text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-accent-400 to-brand-400 mb-6 drop-shadow-2xl" style={{ zIndex: 1000, marginTop: '-50px' }}>
                    ESCROW ARSENAL
                  </h1>
                </div>
                
                <p className="text-xl text-white/80 max-w-3xl mx-auto">
                  Master the art of trustless work with our hilarious demo suite on Stellar blockchain
                </p>
              </div>
              
              {/* Onboarding Trigger */}
              <div className="mb-8">
                <button
                  onClick={() => setShowOnboarding(true)}
                  className="px-8 py-4 bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border-2 border-white/20 hover:border-white/40"
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
                    <p className="text-brand-300 text-sm animate-pulse">
                      💡 New here? Start with the tutorial to learn how everything works!
                    </p>
                  </div>
                )}
              </div>
              
                        {/* Wallet Status - Stable Container */}
          <div 
            ref={walletNotificationRef}
            style={{ 
              minHeight: walletNotificationHeight > 0 && isConnected ? walletNotificationHeight : '0px',
              overflow: 'hidden'
            }}
            className="transition-all duration-500 ease-in-out"
          >
            <WalletStatus 
              onOpenWallet={handleOpenWallet} 
              onShowConnectedChange={setShowWalletConnected}
            />
          </div>
            </div>
          </section>

          {/* Demo Selection */}
          <section 
            className="container mx-auto px-4 transition-all duration-500 ease-in-out"
            style={{ 
              marginTop: !showWalletConnected && isConnected ? '-200px' : '0px'
            }}
          >
            <div className="max-w-6xl mx-auto">
              {/* Epic Legendary Background for Title */}
              <div className="relative mb-12">
                {/* Legendary Energy Background */}
                <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
                  {/* Primary Energy Core */}
                  <div className="relative w-96 h-32">
                    {/* Inner Energy Ring */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-brand-500/30 via-accent-500/40 to-brand-400/30 blur-md scale-150"></div>
                    
                    {/* Middle Energy Ring */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-accent-500/20 via-brand-500/30 to-accent-400/20 blur-lg scale-200"></div>
                    
                    {/* Outer Energy Ring */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-brand-400/10 via-accent-500/20 to-brand-300/10 blur-xl scale-250"></div>
                  </div>
                  
                  {/* Floating Energy Particles */}
                  <div className="absolute inset-0">
                    <div className="absolute top-4 left-1/4 w-2 h-2 bg-brand-400 rounded-full animate-ping opacity-70"></div>
                    <div className="absolute top-8 right-1/3 w-1.5 h-1.5 bg-accent-400 rounded-full animate-ping opacity-80" style={{ animationDelay: '0.5s' }}></div>
                    <div className="absolute bottom-6 left-1/3 w-2 h-2 bg-brand-300 rounded-full animate-ping opacity-60" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute bottom-8 right-1/4 w-1.5 h-1.5 bg-accent-300 rounded-full animate-ping opacity-90" style={{ animationDelay: '1.5s' }}></div>
                  </div>
                  
                  {/* Energy Wave Rings */}
                  <div className="absolute inset-0">
                    <div className="absolute inset-0 rounded-full border border-brand-400/30 animate-ping scale-150" style={{ animationDuration: '3s' }}></div>
                    <div className="absolute inset-0 rounded-full border border-accent-400/20 animate-ping scale-200" style={{ animationDuration: '4s' }}></div>
                    <div className="absolute inset-0 rounded-full border border-brand-300/15 animate-ping scale-250" style={{ animationDuration: '5s' }}></div>
                  </div>
                </div>
                
                {/* Title with Enhanced Styling */}
                <h2 className="relative z-10 text-3xl md:text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-accent-400 to-brand-400 mb-8 drop-shadow-2xl">
                  🎭 Pick Your Adventure
                </h2>
              </div>
              
              <DemoSelector activeDemo={activeDemo} setActiveDemo={setActiveDemo} />
            </div>
          </section>

          {/* Active Demo Display */}
          <section id="active-demo-display" className="container mx-auto px-4 py-10">
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
        showBanner={true}
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
      <ToastProvider>
        <TransactionProvider>
          <DemosPageContent />
          <ToastContainer />
        </TransactionProvider>
      </ToastProvider>
    </WalletProvider>
  )
}
