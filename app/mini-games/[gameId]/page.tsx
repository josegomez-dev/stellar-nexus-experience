'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { NexusPrime } from '@/components/layout/NexusPrime'
import { EscrowProvider } from '@/contexts/EscrowContext'
import { WalletProvider } from '@/contexts/WalletContext'
import XboxStyleConsole from '@/components/ui/XboxStyleConsole'
import RetroArcadeSidebar from '@/components/ui/RetroArcadeSidebar'
import Image from 'next/image'

// Game data with detailed information
const gameLibrary = {
  'escrow-puzzle-master': {
    id: 'escrow-puzzle-master',
    title: 'Escrow Puzzle Master',
    subtitle: 'Master the Art of Trustless Transactions',
    description: 'Solve complex escrow puzzles while learning Stellar blockchain fundamentals. Complete challenges, unlock achievements, and become a DeFi expert!',
    icon: '🔐',
    status: 'development',
    category: 'blockchain',
    difficulty: 'Intermediate',
    estimatedTime: '3-4 hours',
    rewards: '150 XLM + Master Badge',
    currentPlayers: 2341,
    rating: 4.9,
    thumbnail: '/images/demos/democracyinaction.png',
    progress: 100,
    estimatedRelease: 'Available Now',
    donationGoal: 0,
    currentDonations: 0,
    features: ['Smart Contract Puzzles', 'Escrow Mechanics', 'Stellar Network', 'DeFi Fundamentals'],
    achievements: ['Puzzle Master', 'Escrow Expert', 'Stellar Champion', 'Trust Guardian'],
    developers: [
      { name: 'Stellar Development Team', role: 'Core Engine', avatar: '/images/logo/logoicon.png' },
      { name: 'Trustless Work Labs', role: 'Game Design', avatar: '/images/logo/logoicon.png' },
      { name: 'Blockchain Gaming Studio', role: 'UI/UX', avatar: '/images/logo/logoicon.png' }
    ],
    technologies: ['Stellar Blockchain', 'Smart Contracts', 'React Hooks', 'TypeScript'],
    releaseDate: '2024',
    version: '1.2.0',
    size: '45.2 MB',
    tags: ['Puzzle', 'Educational', 'Blockchain', 'DeFi']
  },
  'web3-basics-adventure': {
    id: 'web3-basics-adventure',
    title: 'Web3 Basics Adventure',
    subtitle: 'Journey Through Blockchain Fundamentals',
    description: 'Embark on an epic journey through blockchain fundamentals. Learn smart contracts, wallets, and DeFi while earning crypto rewards!',
    icon: '🌐',
    status: 'beta',
    category: 'learning',
    difficulty: 'Beginner',
    estimatedTime: '2-3 hours',
    rewards: '50 XLM + NFT Badge',
    currentPlayers: 1247,
    rating: 4.8,
    thumbnail: '/images/demos/babysteps.png',
    progress: 100,
    estimatedRelease: 'Available Now',
    donationGoal: 0,
    currentDonations: 0,
    features: ['Smart Contract Basics', 'Wallet Security', 'DeFi Fundamentals', 'Interactive Quests'],
    achievements: ['First Transaction', 'Smart Contract Master', 'DeFi Explorer', 'Blockchain Pioneer'],
    developers: [
      { name: 'Web3 Academy', role: 'Core Engine', avatar: '/images/logo/logoicon.png' },
      { name: 'Blockchain Education', role: 'Game Design', avatar: '/images/logo/logoicon.png' },
      { name: 'Crypto Learning Labs', role: 'UI/UX', avatar: '/images/logo/logoicon.png' }
    ],
    technologies: ['React', 'Solidity', 'Web3.js', 'TypeScript'],
    releaseDate: '2024',
    version: '1.0.0',
    size: '32.1 MB',
    tags: ['Adventure', 'Educational', 'Beginner', 'Crypto']
  },
  'defi-trading-arena': {
    id: 'defi-trading-arena',
    title: 'DeFi Trading Arena',
    subtitle: 'Compete in the Ultimate Trading Challenge',
    description: 'Enter the competitive world of DeFi trading! Learn liquidity pools, yield farming, and automated market making while competing for top rankings.',
    icon: '📈',
    status: 'development',
    category: 'defi',
    difficulty: 'Advanced',
    estimatedTime: '6-8 hours',
    rewards: '200 XLM + Trading Trophy',
    currentPlayers: 567,
    rating: 4.7,
    thumbnail: '/images/demos/economy.png',
    progress: 85,
    estimatedRelease: 'Beta Testing',
    donationGoal: 5000,
    currentDonations: 3200,
    features: ['Liquidity Pools', 'Yield Farming', 'AMM Strategies', 'Risk Management'],
    achievements: ['Trading Champion', 'Yield Master', 'Risk Taker', 'DeFi Legend'],
    developers: [
      { name: 'DeFi Gaming Corp', role: 'Core Engine', avatar: '/images/logo/logoicon.png' },
      { name: 'Trading Masters', role: 'Game Design', avatar: '/images/logo/logoicon.png' },
      { name: 'Financial Gaming', role: 'UI/UX', avatar: '/images/logo/logoicon.png' }
    ],
    technologies: ['Solidity', 'Web3.js', 'Uniswap SDK', 'React'],
    releaseDate: '2024',
    version: '0.9.5',
    size: '67.8 MB',
    tags: ['Trading', 'Competitive', 'Advanced', 'DeFi']
  }
}

export default function GamePage() {
  const params = useParams()
  const router = useRouter()
  const gameId = params.gameId as string
  const game = gameLibrary[gameId as keyof typeof gameLibrary]
  
  const [loadingState, setLoadingState] = useState<'initializing' | 'loading' | 'ready' | 'error'>('initializing')
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [showGameSelector, setShowGameSelector] = useState(false)
  const [selectedGame, setSelectedGame] = useState(gameId)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    if (!game) {
      setLoadingState('error')
      return
    }

    // Simulate epic arcade machine boot sequence
    const bootSequence = async () => {
      setLoadingState('initializing')
      
      // Initializing phase
      await new Promise(resolve => setTimeout(resolve, 2000))
      setLoadingState('loading')
      
      // Loading progress simulation
      const progressInterval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval)
            setLoadingState('ready')
            return 100
          }
          return prev + Math.random() * 15
        })
      }, 200)
    }

    bootSequence()
  }, [game])

  // Full-screen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  const handleGameSelect = (newGameId: string) => {
    setSelectedGame(newGameId)
    setShowGameSelector(false)
    router.push(`/mini-games/${newGameId}`)
  }

  const handleFullscreenToggle = () => {
    if (isFullscreen) {
      document.exitFullscreen()
    } else {
      document.documentElement.requestFullscreen()
    }
  }

  const handlePlayGame = () => {
    // Launch the actual game
    console.log(`🚀 Launching ${game.title} - Prepare for an epic adventure!`)
    alert(`🎮 ${game.title} is launching! Get ready to learn and earn rewards!`)
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-black to-red-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl mb-6">❌</div>
          <h1 className="text-4xl font-bold text-white mb-4">Game Not Found</h1>
          <p className="text-white/70 mb-8">The requested game could not be loaded.</p>
          <button 
            onClick={() => router.push('/mini-games')}
            className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-xl transition-all duration-300"
          >
            ← Back to Arcade
          </button>
        </div>
      </div>
    )
  }

  // Prepare games data for sidebar
  const sidebarGames = Object.values(gameLibrary || {}).map(game => ({
    id: game.id,
    title: game.title,
    subtitle: game.subtitle,
    icon: game.icon,
    status: game.status
  }))

  return (
    <WalletProvider>
      <EscrowProvider>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
          {/* Epic Arcade Machine Background */}
          <div className="absolute inset-0">
            {/* CRT Scan Lines Effect */}
            <div className="absolute inset-0 opacity-10">
              {Array.from({ length: 50 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
                  style={{ top: `${i * 2}%` }}
                />
              ))}
            </div>
            
            {/* Floating Arcade Elements */}
            <div className="absolute top-20 left-10 w-4 h-4 bg-cyan-400 rounded-full animate-ping opacity-60"></div>
            <div className="absolute top-40 right-20 w-3 h-3 bg-purple-400 rounded-full animate-ping opacity-80" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-40 left-1/4 w-2 h-2 bg-pink-400 rounded-full animate-ping opacity-70" style={{ animationDelay: '2s' }}></div>
            
            {/* Energy Grid */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
              <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-pink-400 to-transparent"></div>
            </div>
          </div>

          <Header />
          
          {/* Main Content */}
          <main className="relative z-10 pt-20 pb-32">
            <div className="container mx-auto px-4">
              <div className="max-w-7xl mx-auto">
                
                {/* Retro Arcade Sidebar */}
                <RetroArcadeSidebar
                  games={sidebarGames}
                  selectedGame={selectedGame}
                  isFullscreen={isFullscreen}
                  onGameSelect={handleGameSelect}
                  onFullscreenToggle={handleFullscreenToggle}
                />
                
                {/* Mobile Game Selector Button */}
                <div className="lg:hidden text-center mb-8">
                  <button
                    onClick={() => setShowGameSelector(!showGameSelector)}
                    className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    🎯 Select Game
                  </button>
                </div>
                
                {/* Game Selector Modal */}
                {showGameSelector && (
                  <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl border border-white/20 shadow-2xl max-w-4xl w-full p-8 max-h-[80vh] overflow-y-auto">
                      <div className="text-center mb-6">
                        <h2 className="text-3xl font-bold text-white mb-2">🎮 Game Library</h2>
                        <p className="text-white/70">Select your next adventure</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.values(gameLibrary || {}).map((gameOption) => (
                          <div
                            key={gameOption.id}
                            onClick={() => handleGameSelect(gameOption.id)}
                            className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                              gameOption.id === selectedGame
                                ? 'border-cyan-400 bg-cyan-500/10'
                                : 'border-white/20 bg-white/5 hover:border-cyan-400/50 hover:bg-cyan-500/5'
                            }`}
                          >
                            <div className="text-center">
                              <div className="text-4xl mb-2">{gameOption.icon}</div>
                              <h3 className="font-bold text-white mb-1">{gameOption.title}</h3>
                              <p className="text-white/70 text-sm mb-2">{gameOption.subtitle}</p>
                              <div className="flex items-center justify-center space-x-2 text-xs">
                                <span className={`px-2 py-1 rounded-full ${
                                  gameOption.status === 'available' ? 'bg-green-500/20 text-green-300' :
                                  gameOption.status === 'beta' ? 'bg-blue-500/20 text-blue-300' :
                                  'bg-yellow-500/20 text-yellow-300'
                                }`}>
                                  {gameOption.status}
                                </span>
                                <span className="text-white/60">⭐ {gameOption.rating}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="text-center mt-6">
                        <button
                          onClick={() => setShowGameSelector(false)}
                          className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-all duration-300"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* EPIC XBOX-STYLE LOADING CONSOLE */}
                <XboxStyleConsole
                  loadingState={loadingState}
                  loadingProgress={loadingProgress}
                  gameTitle={game.title}
                />

                {/* Game Ready Screen */}
                {loadingState === 'ready' && (
                  <div className="space-y-12 mt-10">
                    {/* Game Header */}
                    <div className="text-center">
                      {/* <div className="flex justify-center mb-6">
                        <div className="text-8xl animate-pulse">{game.icon}</div>
                      </div> */}
                      
                      <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-4">
                        {game.title}
                      </h1>
                      
                      <h2 className="text-2xl md:text-3xl font-semibold text-white/90 mb-6">
                        {game.subtitle}
                      </h2>
                      
                      <p className="text-lg text-white/80 max-w-3xl mx-auto leading-relaxed">
                        {game.description}
                      </p>
                    </div>

                    {/* Game Information Grid */}
                    <div className="grid md:grid-cols-2 gap-8">
                      {/* Game Details */}
                      <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8">
                        <h3 className="text-2xl font-bold text-white mb-6">🎮 Game Details</h3>
                        
                        <div className="space-y-4">
                          <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                            <span className="text-white/70">Difficulty:</span>
                            <span className="text-white font-semibold">{game.difficulty}</span>
                          </div>
                          
                          <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                            <span className="text-white/70">Duration:</span>
                            <span className="text-white font-semibold">{game.estimatedTime}</span>
                          </div>
                          
                          <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                            <span className="text-white/70">Rewards:</span>
                            <span className="text-white font-semibold">{game.rewards}</span>
                          </div>
                          
                          <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                            <span className="text-white/70">Players:</span>
                            <span className="text-white font-semibold">{game.currentPlayers.toLocaleString()}</span>
                          </div>
                          
                          <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                            <span className="text-white/70">Rating:</span>
                            <span className="text-white font-semibold">⭐ {game.rating}</span>
                          </div>
                        </div>
                      </div>

                      {/* Technologies & Features */}
                      <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8">
                        <h3 className="text-2xl font-bold text-white mb-6">⚡ Technologies</h3>
                        
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-white/80 font-semibold mb-2">Core Technologies:</h4>
                            <div className="flex flex-wrap gap-2">
                              {game.technologies.map((tech, index) => (
                                <span key={index} className="px-3 py-1 bg-cyan-500/20 text-cyan-300 text-sm rounded-full border border-cyan-400/30">
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-white/80 font-semibold mb-2">Key Features:</h4>
                            <div className="flex flex-wrap gap-2">
                              {game.features.map((feature, index) => (
                                <span key={index} className="px-3 py-1 bg-purple-500/20 text-purple-300 text-sm rounded-full border border-purple-400/30">
                                  {feature}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Development Team */}
                    <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8" style={{ marginBottom: '-100px' }}>
                      <h3 className="text-2xl font-bold text-white mb-6 text-center">👨‍💻 Development Team</h3>
                      
                      <div className="grid md:grid-cols-3 gap-6">
                        {game.developers.map((dev, index) => (
                          <div key={index} className="text-center p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-cyan-400/30 transition-all duration-300">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full overflow-hidden border-2 border-cyan-400/30">
                              <Image
                                src={dev.avatar}
                                alt={dev.name}
                                width={64}
                                height={64}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <h4 className="text-white font-semibold mb-2">{dev.name}</h4>
                            <p className="text-cyan-300 text-sm">{dev.role}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}
              </div>
            </div>
          </main>

          {/* Nexus Prime */}
          <NexusPrime currentPage="mini-games" />
          
          <Footer />
        </div>
      </EscrowProvider>
    </WalletProvider>
  )
}
