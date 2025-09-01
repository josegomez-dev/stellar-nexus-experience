'use client'

import { useEffect, useState, useRef } from 'react'
import { WalletSidebar } from '@/components/ui/WalletSidebar'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { NexusPrime } from '@/components/layout/NexusPrime'
import { EscrowProvider } from '@/contexts/EscrowContext'
import { WalletProvider } from '@/contexts/WalletContext'
import { Providers } from '@/components/Providers'
import { TransactionProvider } from '@/contexts/TransactionContext'
import { ToastProvider } from '@/contexts/ToastContext'
import { useGlobalWallet } from '@/contexts/WalletContext'
import { HelloMilestoneDemo } from '@/components/demos/HelloMilestoneDemo'
import { MilestoneVotingDemo } from '@/components/demos/MilestoneVotingDemo'
import { DisputeResolutionDemo } from '@/components/demos/DisputeResolutionDemo'
import { MicroTaskMarketplaceDemo } from '@/components/demos/MicroTaskMarketplaceDemo'
import { OnboardingOverlay } from '@/components/OnboardingOverlay'
import { ToastContainer } from '@/components/ui/Toast'
import Image from 'next/image'
import { nexusCodex } from '@/lib/newsData'

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
  // Clap system with localStorage persistence
  const [demoClaps, setDemoClaps] = useState<Record<string, number>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('demoClaps')
      return saved ? JSON.parse(saved) : {
        'hello-milestone': 24,
        'milestone-voting': 18,
        'dispute-resolution': 12,
        'micro-marketplace': 31
      }
    }
    return {
      'hello-milestone': 24,
      'milestone-voting': 18,
      'dispute-resolution': 12,
      'micro-marketplace': 31
    }
  })
  const [userClapped, setUserClapped] = useState<Record<string, boolean>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('userClapped')
      return saved ? JSON.parse(saved) : {
        'hello-milestone': false,
        'milestone-voting': false,
        'dispute-resolution': false,
        'micro-marketplace': false
      }
    }
    return {
      'hello-milestone': false,
      'milestone-voting': false,
      'dispute-resolution': false,
      'micro-marketplace': false
    }
  })
  
  // Simulated completion counts for demos
  const [demoCompletions, setDemoCompletions] = useState<Record<string, number>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('demoCompletions')
      return saved ? JSON.parse(saved) : {
        'hello-milestone': 42,
        'milestone-voting': 28,
        'dispute-resolution': 19,
        'micro-marketplace': 35
      }
    }
    return {
      'hello-milestone': 42,
      'milestone-voting': 28,
      'dispute-resolution': 19,
      'micro-marketplace': 35
    }
  })

  const handleClap = (demoId: string) => {
    if (userClapped[demoId]) return // User already clapped
    
    const newClaps = { ...demoClaps, [demoId]: demoClaps[demoId] + 1 }
    const newUserClapped = { ...userClapped, [demoId]: true }
    
    setDemoClaps(newClaps)
    setUserClapped(newUserClapped)
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('demoClaps', JSON.stringify(newClaps))
      localStorage.setItem('userClapped', JSON.stringify(newUserClapped))
    }
  }

  const getClapStats = (demoId: string) => {
    const claps = demoClaps[demoId]
    const hasClapped = userClapped[demoId]
    const completions = demoCompletions[demoId]
    
    return {
      claps: claps,
      hasClapped: hasClapped,
      completions: completions
    }
  }

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

  const handleArticleClick = (link: string) => {
    window.open(link, '_blank', 'noopener,noreferrer')
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
    <div className="space-y-8">
      {/* Demo Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-2">
        {demos.map((demo) => {
          const demoArticles = nexusCodex.filter(article => article.demo === demo.title.split('. ')[1] || article.demo === demo.title)
          const relevantArticles = demoArticles.slice(0, 2) // Get 2 most relevant articles
          
          return (
            <button
              key={demo.id}
              onClick={() => handleDemoSelect(demo.id)}
              className={`demo-card p-6 rounded-xl border-2 transition-all duration-500 ease-out transform hover:scale-105 min-h-[420px] relative overflow-hidden group ${
                activeDemo === demo.id
                  ? `border-white/50 bg-gradient-to-br ${demo.color}/20`
                  : 'border-white/20 bg-gradient-to-br from-white/5 to-white/10 hover:border-white/30 hover:from-white/10 hover:to-white/15'
              }`}
              data-demo-id={demo.id}
            >


              {/* Clap Statistics Box - Above start button */}
              <div className="mb-3">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                  {(() => {
                    const stats = getClapStats(demo.id)
                    return (
                      <div className="grid grid-cols-3 gap-3 text-center">
                        <div>
                          <div className="text-lg font-bold text-cyan-400">
                            {stats.claps}
                          </div>
                          <div className="text-xs text-white/60">Claps</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-amber-400">
                            {stats.completions}
                          </div>
                          <div className="text-xs text-white/60">Completed</div>
                        </div>
                        <div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleClap(demo.id)
                            }}
                            disabled={stats.hasClapped}
                            className={`w-full transition-all duration-200 hover:scale-105 ${
                              stats.hasClapped 
                                ? 'text-emerald-400 cursor-not-allowed' 
                                : 'text-emerald-400 hover:text-emerald-300'
                            }`}
                            title={stats.hasClapped ? 'Already clapped!' : 'Clap for this demo!'}
                          >
                            <div className="text-lg font-bold">
                              {stats.hasClapped ? '✓' : '✓'}
                            </div>
                            <div className="text-xs text-white/60">
                              {stats.hasClapped ? 'Clapped!' : 'Clap'}
                            </div>
                          </button>
                        </div>
                      </div>
                    )
                  })()}
                </div>
              </div>
              
              {/* Epic Legendary Background for Demo Title */}
              <div className="relative mb-3">
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
              <p className="text-sm text-white/70 text-left leading-relaxed mb-4">{demo.description}</p>
              
              {/* Small Codex Section */}
              {relevantArticles.length > 0 && (
                <div className="mb-4">
                  <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                    <div className="flex items-center mb-2">
                      <span className="text-xs font-semibold text-brand-300 uppercase tracking-wide">Related Codex</span>
                    </div>
                    <div className="space-y-2">
                      {relevantArticles.map((article, index) => (
                        <div 
                          key={article.id}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleArticleClick(article.link)
                          }}
                          className="group cursor-pointer p-2 rounded-md hover:bg-white/10 transition-all duration-200"
                        >
                          <div className="flex items-start space-x-2">
                            <div className="flex-shrink-0 w-2 h-2 bg-brand-400 rounded-full mt-2"></div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-white/80 group-hover:text-brand-300 transition-colors duration-200 line-clamp-2 font-medium">
                                {article.title}
                              </p>
                              <p className="text-xs text-white/60 mt-1">
                                {article.readTime} • {article.type === 'youtube' ? '🎥' : '📝'}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Start Demo Button */}
              <div className="flex flex-col items-center space-y-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDemoSelect(demo.id)
                  }}
                  className={`px-6 py-3 font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border-2 ${
                    activeDemo === demo.id
                      ? 'bg-gradient-to-r from-gray-800 to-black hover:from-gray-700 hover:to-gray-800 text-white border-white/50 shadow-2xl'
                      : `bg-gradient-to-r ${demo.color} hover:brightness-110 text-white border-white/20 hover:border-white/40`
                  }`}
                >
                  {activeDemo === demo.id ? 'Active Demo' : 'Start Demo'}
                </button>
              </div>
            </button>
          )
        })}
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
  const [isLoading, setIsLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)

  // Preloader effect
  useEffect(() => {
    const loadingSteps = [
      { progress: 20, message: 'Initializing Demo Suite...' },
      { progress: 40, message: 'Loading Smart Contracts...' },
      { progress: 60, message: 'Preparing Interactive Demos...' },
      { progress: 80, message: 'Setting up Wallet Integration...' },
      { progress: 100, message: 'Ready to Launch!' }
    ]

    let currentStep = 0
    const interval = setInterval(() => {
      if (currentStep < loadingSteps.length) {
        setLoadingProgress(loadingSteps[currentStep].progress)
        currentStep++
      } else {
        clearInterval(interval)
        setTimeout(() => {
          setIsLoading(false)
        }, 500)
      }
    }, 800)

    return () => clearInterval(interval)
  }, [])

  // Listen for wallet sidebar state changes
  useEffect(() => {
    const handleWalletSidebarToggle = (event: CustomEvent) => {
      setWalletSidebarOpen(event.detail.isOpen)
      // Always ensure the sidebar is expanded when it opens
      if (event.detail.isOpen) {
        setWalletExpanded(true)
      } else {
        setWalletExpanded(event.detail.isExpanded)
      }
    }

    window.addEventListener('walletSidebarToggle', handleWalletSidebarToggle as EventListener)
    return () => {
      window.removeEventListener('walletSidebarToggle', handleWalletSidebarToggle as EventListener)
    }
  }, [])

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
        
        {/* Preloader Screen */}
        {isLoading && (
          <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-neutral-900 via-brand-900 to-neutral-900 flex items-center justify-center">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
              {/* Floating Energy Orbs */}
              <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-brand-400/20 rounded-full animate-ping"></div>
              <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-accent-400/20 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute bottom-1/3 left-1/3 w-28 h-28 bg-brand-500/20 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
              <div className="absolute bottom-1/4 right-1/3 w-20 h-20 bg-accent-500/20 rounded-full animate-ping" style={{ animationDelay: '1.5s' }}></div>
              
              {/* Energy Grid */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(14,165,233,0.1)_0%,_transparent_70%)] animate-pulse"></div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 text-center">
              {/* Logo Animation */}
              <div className="mb-8 animate-bounce">
                <Image 
                  src="/images/logo/logoicon.png" 
                  alt="STELLAR NEXUS" 
                  width={120} 
                  height={120} 
                  className="w-30 h-30"
                />
              </div>

              {/* Loading Text */}
              <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-brand-500 to-accent-600 mb-6 animate-pulse">
                INITIALIZING STELLAR NEXUS EXPERIENCE
              </h1>

              {/* Subtitle */}
              <p className="text-xl text-brand-300 mb-8 animate-pulse">
                Preparing your trustless work experience...
              </p>

              {/* Loading Bar */}
              <div className="w-80 h-3 bg-white/10 rounded-full overflow-hidden mx-auto mb-8">
                <div 
                  className="h-full bg-gradient-to-r from-brand-500 via-brand-600 to-accent-600 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${loadingProgress}%` }}
                ></div>
              </div>

              {/* Loading Steps */}
              <div className="space-y-2 text-white/80">
                <p className="animate-fadeInUp" style={{ animationDelay: '0.5s' }}>Connecting to Stellar Network...</p>
                <p className="animate-fadeInUp" style={{ animationDelay: '1s' }}>Loading Smart Contracts...</p>
                <p className="animate-fadeInUp" style={{ animationDelay: '1.5s' }}>Preparing Demo Suite...</p>
                <p className="animate-fadeInUp" style={{ animationDelay: '2s' }}>Launching STELLAR NEXUS EXPERIENCE...</p>
              </div>

              {/* Progress Percentage */}
              <div className="mt-8 text-brand-300 text-lg">
                <span className="font-bold">{loadingProgress}%</span> Complete
              </div>
            </div>
          </div>
        )}
        
        {/* Main Content */}
        <main className={`relative z-10 pt-20 ${
          walletSidebarOpen && walletExpanded ? 'mr-96' : walletSidebarOpen ? 'mr-20' : 'mr-0'
        } ${!walletSidebarOpen ? 'pb-32' : 'pb-8'}`}>
         
          
          {/* Hero Section */}
          <section className="container mx-auto px-4 py-16">
            <div className="text-center">


              {/* Page Header */}
              <div className="text-center mb-16">
                <div className="flex justify-center mb-6">
                  <Image 
                    src="/images/logo/logoicon.png" 
                    alt="STELLAR NEXUS" 
                    width={300} 
                    height={300}
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
                  <h1 className="relative z-10 text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-accent-400 to-brand-400 mb-6 drop-shadow-2xl" style={{ zIndex: 1000, marginTop: '-200px' }}>
                    STELLAR NEXUS EXPERIENCE
                  </h1>
                </div>

                <br />
                <br />
                
                <p className="text-xl text-white/80 max-w-3xl mx-auto">
                  Master the art of trustless work with our hilarious demo suite on Stellar blockchain
                </p>
              </div>
              

                {/* Powered by Trustless Work */}
                <div className="text-center mt-4">
                  <p className="text-brand-300/70 text-sm font-medium animate-pulse">
                    Powered by <span className="text-brand-200 font-semibold">Trustless Work</span>
                  </p>
                </div>
              
            </div>
          </section>


          {/* Nexus Codex Section */}
          <section className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {nexusCodex.slice(0, 4).map((article: any, index: number) => {
                  // Determine if content is ready based on index (0,1 are ready, 2,3 are WIP)
                  const isReady = index < 2;
                  
                  return (
                    <article
                      key={article.id}
                      className="group bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-brand-400/50 hover:bg-white/10 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-brand-500/20"
                    >
                      {/* Article Image */}
                      <div className="relative h-32 overflow-hidden">
                        <Image 
                          src={`/images/demos/demo${index + 1}.png`}
                          alt={article.title}
                          width={400}
                          height={128}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/40 group-hover:from-black/10 group-hover:to-black/30 transition-all duration-300"></div>
                        
                        {/* Read Time */}
                        <div className="absolute top-2 right-2">
                          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-black/60 text-white backdrop-blur-sm">
                            {article.readTime}
                          </span>
                        </div>

                        {/* Demo Badge with Demo Color */}
                        <div className="absolute bottom-2 left-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${article.demoColor} text-white backdrop-blur-sm border border-white/20`}>
                            {article.demo}
                          </span>
                        </div>
                      </div>

                      {/* Article Content */}
                      <div className="p-4">
                        {/* Date */}
                        <p className="text-white/60 text-xs mb-2">
                          {new Date(article.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>

                        {/* Title */}
                        <h3 className="text-sm font-semibold text-white mb-2 group-hover:text-brand-300 transition-colors duration-300 line-clamp-2">
                          {article.title}
                        </h3>

                        {/* Description */}
                        <p className="text-white/70 text-xs mb-3 line-clamp-2">
                          {article.description}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {article.tags.slice(0, 2).map((tag: string, tagIndex: number) => (
                            <span
                              key={tagIndex}
                              className="px-2 py-1 rounded-full text-xs font-medium bg-white/10 text-white/80 group-hover:bg-brand-500/20 group-hover:text-brand-300 transition-all duration-300"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          {/* Watch Video Button */}
                          <button 
                            className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 ${
                              isReady 
                                ? 'bg-gradient-to-r from-brand-500/20 to-accent-600/20 hover:from-brand-500/30 hover:to-accent-600/30 border border-brand-400/30 hover:border-brand-400/50 text-brand-300 hover:text-brand-200 group-hover:scale-105'
                                : 'bg-white/5 border border-white/20 text-white/40 cursor-not-allowed'
                            }`}
                            onClick={(e) => {
                              e.stopPropagation()
                              if (isReady) {
                                const videoLinks = [
                                  'https://www.youtube.com/watch?v=FuXQtLgDDBE',
                                  'https://www.youtube.com/watch?v=BvmHc9PDIfc',
                                  '#',
                                  '#'
                                ];
                                window.open(videoLinks[index], '_blank', 'noopener,noreferrer')
                              }
                            }}
                            disabled={!isReady}
                          >
                            {isReady ? 'Watch Video' : 'Coming Soon'}
                          </button>
                          
                          {/* Read Article Button */}
                          <button 
                            className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 ${
                              isReady 
                                ? 'bg-gradient-to-r from-brand-500/20 to-accent-600/20 hover:from-brand-500/30 hover:to-accent-600/30 border border-brand-400/30 hover:border-brand-400/50 text-brand-300 hover:text-brand-200 group-hover:scale-105'
                                : 'bg-white/5 border border-white/20 text-white/40 cursor-not-allowed'
                            }`}
                            onClick={(e) => {
                              e.stopPropagation()
                              if (isReady) {
                                const articleLinks = [
                                  'https://josegomezdev.medium.com/building-trustless-escrow-systems-on-stellar-a-developers-guide-770e402751f9',
                                  'https://josegomezdev.medium.com/democracy-in-action-multi-stakeholder-escrow-on-stellar-173fe02e5ffa',
                                  '#',
                                  '#'
                                ];
                                window.open(articleLinks[index], '_blank', 'noopener,noreferrer')
                              }
                            }}
                            disabled={!isReady}
                          >
                            {isReady ? 'Read Article' : 'Coming Soon'}
                          </button>
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>
            </div>
          </section>

          {/* Interactive Tutorial Section - Full Width with Irregular Shape */}
          <section className="relative w-full py-20 overflow-hidden">
            {/* Irregular Background Shape - Full Width */}
            <div className="absolute inset-0">
              {/* Main irregular shape using clip-path */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand-500/20 via-accent-500/25 to-brand-400/20" 
                   style={{
                     clipPath: 'polygon(0% 0%, 100% 8%, 92% 100%, 0% 92%)'
                   }}>
              </div>
              
              {/* Secondary irregular shape overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-accent-500/15 via-transparent to-brand-500/15"
                   style={{
                     clipPath: 'polygon(8% 0%, 100% 0%, 88% 100%, 0% 100%)'
                   }}>
              </div>
              
              {/* Floating geometric elements */}
              <div className="absolute top-16 left-16 w-40 h-40 bg-gradient-to-r from-brand-400/25 to-accent-400/25 rounded-full blur-2xl animate-pulse"></div>
              <div className="absolute top-24 right-24 w-32 h-32 bg-gradient-to-r from-accent-400/25 to-brand-400/25 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
              <div className="absolute bottom-24 left-24 w-36 h-36 bg-gradient-to-r from-brand-500/25 to-accent-500/25 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
              <div className="absolute bottom-16 right-16 w-28 h-28 bg-gradient-to-r from-accent-500/25 to-brand-500/25 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '3s' }}></div>
              
              {/* Diagonal lines for texture */}
              <div className="absolute inset-0 opacity-15">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white to-transparent transform rotate-12"></div>
                <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-white to-transparent transform -rotate-6"></div>
                <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white to-transparent transform rotate-8"></div>
                <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-white to-transparent transform -rotate-4"></div>
                <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white to-transparent transform rotate-15"></div>
              </div>
              
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-40 h-40 border-l-4 border-t-4 border-brand-400/40 rounded-tl-3xl"></div>
              <div className="absolute top-0 right-0 w-40 h-40 border-r-4 border-t-4 border-accent-400/40 rounded-tr-3xl"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 border-l-4 border-b-4 border-accent-400/40 rounded-bl-3xl"></div>
              <div className="absolute bottom-0 right-0 w-40 h-40 border-r-4 border-b-4 border-brand-400/40 rounded-br-3xl"></div>
            </div>
            
            {/* Content */}
            <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
              {/* Additional Floating Decorative Elements - Repositioned for better balance */}
              <div className="absolute top-20 left-1/4 w-6 h-6 bg-gradient-to-r from-brand-400/40 to-accent-400/40 rounded-full blur-sm animate-pulse opacity-60"></div>
              <div className="absolute top-32 right-1/3 w-4 h-4 bg-gradient-to-r from-accent-400/40 to-brand-400/40 rounded-full blur-sm animate-pulse opacity-70" style={{ animationDelay: '1.5s' }}></div>
              <div className="absolute bottom-32 left-1/3 w-5 h-5 bg-gradient-to-r from-brand-500/40 to-accent-500/40 rounded-full blur-sm animate-pulse opacity-50" style={{ animationDelay: '2s' }}></div>
              <div className="absolute bottom-24 right-1/4 w-4 h-4 bg-gradient-to-r from-accent-500/40 to-brand-500/40 rounded-full blur-sm animate-pulse opacity-65" style={{ animationDelay: '2.5s' }}></div>
              
              {/* Floating Character Images - Left and Right - Repositioned for bottom alignment */}
              
              <div className="absolute bottom-8 -right-8 opacity-80 pointer-events-none">
                <div className="relative w-full h-full">
                  <Image
                    src="/images/character/character.png"
                    alt="Guide Character Right"
                    width={200}
                    height={200}
                    className="w-full h-full object-contain drop-shadow-2xl animate-float mr-40 -mb-40"
                  />
                  {/* Floating sparkles around right character */}
                  <div className="absolute top-4 left-4 w-3 h-3 bg-brand-400 rounded-full animate-ping opacity-70"></div>
                  <div className="absolute top-8 right-6 w-2 h-2 bg-accent-400 rounded-full animate-ping opacity-80" style={{ animationDelay: '0.5s' }}></div>
                  <div className="absolute bottom-6 left-8 w-2.5 h-2.5 bg-brand-300 rounded-full animate-ping opacity-60" style={{ animationDelay: '1s' }}></div>
                  <div className="absolute bottom-8 right-4 w-2 h-2 bg-accent-300 rounded-full animate-ping opacity-85" style={{ animationDelay: '1.5s' }}></div>
                </div>
              </div>
              
         
              <div className="mb-12">
                <h3 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-accent-400 mb-6 drop-shadow-2xl">
                  🎓 Interactive Tutorial
                </h3>
                <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
                  New to trustless work? <br /> Start with our interactive tutorial to learn how everything works!
                </p>
              </div>
              
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
                  <div className="mt-4 text-center">
                    <p className="text-brand-300 text-sm animate-pulse">
                      💡 New here? Start with the tutorial to learn how everything works!
                    </p>
                  </div>
                )}
              </div>
              
              <div className="grid md:grid-cols-3 gap-8 text-sm">
                <div className="group p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl relative overflow-hidden">
                  {/* Card background effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-accent-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative z-10">
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">⚡</div>
                    <div className="font-semibold text-white/90 mb-2 text-base">Quick Start</div>
                    <div className="text-white/70">Learn the basics in just a few minutes</div>
                  </div>
                </div>
                
                <div className="group p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl relative overflow-hidden">
                  {/* Card background effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-accent-500/5 to-brand-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative z-10">
                    <div className="text-4xl mb-4 group-hover:scale-105 transition-transform duration-300">🎯</div>
                    <div className="font-semibold text-white/90 mb-2 text-base">Hands-on</div>
                    <div className="text-white/70">Interactive examples and real scenarios</div>
                  </div>
                </div>
                
                <div className="group p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl relative overflow-hidden">
                  {/* Card background effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-accent-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative z-10">
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">💡</div>
                    <div className="font-semibold text-white/90 mb-2 text-base">Smart Tips</div>
                    <div className="text-white/70">Pro tips and best practices included</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <br />
          <br />

        
          {/* Demo Selection */}
          <section 
            className="container mx-auto px-4 transition-all duration-500 ease-in-out"
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
                <h2 className="relative z-10 text-3xl md:text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-accent-400 to-brand-400 mb-4 drop-shadow-2xl">
                  Pick Your Adventure
                </h2>
                <p className="relative z-10 text-lg text-center text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed">
                  Choose from our collection of interactive demos to experience the power of trustless work on the Stellar blockchain. 
                  Each demo showcases different aspects of escrow contracts, from basic workflows to complex dispute resolution. 
                  Rate your experience and help us improve!
                </p>
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
        onToggle={() => {
          const newOpenState = !walletSidebarOpen
          setWalletSidebarOpen(newOpenState)
          // Always ensure it's expanded when opening
          if (newOpenState) {
            setWalletExpanded(true)
          }
        }} 
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
