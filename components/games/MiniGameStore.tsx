'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { NexusPrime } from '@/components/layout/NexusPrime'
import { EscrowProvider } from '@/contexts/EscrowContext'
import { WalletProvider } from '@/contexts/WalletContext'
import Image from 'next/image'

export default function MiniGameStore() {
  const [activePromo, setActivePromo] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showDonationModal, setShowDonationModal] = useState<string | null>(null)
  const [hoveredGame, setHoveredGame] = useState<string | null>(null)

  // Epic promotional banners
  const promotionalBanners = [
    {
      id: 1,
      title: "🚀 WEB3 LEARNING REVOLUTION",
      subtitle: "Learn blockchain while earning rewards",
      description: "Master smart contracts, earn crypto, and build the future",
      image: "/images/banner/web3-learning.png",
      gradient: "from-purple-600 via-pink-600 to-orange-600",
      cta: "Start Learning Now",
      badge: "🔥 HOT",
      players: "2,847 Active Learners"
    },
    {
      id: 2,
      title: "🏆 DAILY CONTESTS & PRIZES",
      subtitle: "Compete with developers worldwide",
      description: "Win XLM, NFTs, and exclusive web3 opportunities",
      image: "/images/banner/daily-contest.png",
      gradient: "from-blue-600 via-cyan-600 to-teal-600",
      cta: "Join Contest",
      badge: "⚡ LIVE",
      players: "1,234 Contestants"
    },
    {
      id: 3,
      title: "🎯 SECRET MISSIONS UNLOCKED",
      subtitle: "Hidden challenges await",
      description: "Discover secret quests and earn legendary rewards",
      image: "/images/banner/secret-missions.png",
      gradient: "from-green-600 via-emerald-600 to-teal-600",
      cta: "Explore Missions",
      badge: "🌟 NEW",
      players: "567 Mission Hunters"
    }
  ]

  // Enhanced game categories
  const categories = [
    { id: 'all', name: '🎮 All Games', count: 8 },
    { id: 'available', name: '✅ Available', count: 3 },
    { id: 'beta', name: '🧪 Beta', count: 2 },
    { id: 'development', name: '🚧 In Development', count: 2 },
    { id: 'coming-soon', name: '⏳ Coming Soon', count: 1 }
  ]

  // Enhanced mini games with epic descriptions and thumbnails
  const miniGames = [
    {
      id: 'web3-basics',
      title: 'Web3 Basics Adventure',
      description: 'Embark on an epic journey through blockchain fundamentals. Learn smart contracts, wallets, and DeFi while earning crypto rewards!',
      shortDescription: 'Master blockchain basics through interactive gameplay',
      icon: '🌐',
      status: 'available',
      category: 'learning',
      difficulty: 'Beginner',
      estimatedTime: '2-3 hours',
      rewards: '50 XLM + NFT Badge',
      currentPlayers: 1247,
      rating: 4.8,
      thumbnail: '/images/games/web3-basics-adventure.png',
      progress: 100,
      estimatedRelease: 'Available Now',
      donationGoal: 0,
      currentDonations: 0,
      features: ['Smart Contract Basics', 'Wallet Security', 'DeFi Fundamentals', 'Interactive Quests'],
      achievements: ['First Transaction', 'Smart Contract Master', 'DeFi Explorer', 'Blockchain Pioneer']
    },
    {
      id: 'stellar-escrow',
      title: 'Stellar Escrow Master',
      description: 'Become a Stellar blockchain expert! Master escrow systems, multi-signature wallets, and trustless transactions in this action-packed learning game.',
      shortDescription: 'Master Stellar escrow and trustless systems',
      icon: '⭐',
      status: 'available',
      category: 'blockchain',
      difficulty: 'Intermediate',
      estimatedTime: '4-5 hours',
      rewards: '100 XLM + Expert Badge',
      currentPlayers: 892,
      rating: 4.9,
      thumbnail: '/images/games/escrow-puzzle-master.png',
      progress: 100,
      estimatedRelease: 'Available Now',
      donationGoal: 0,
      currentDonations: 0,
      features: ['Escrow Systems', 'Multi-Sig Wallets', 'Trustless Transactions', 'Stellar Network'],
      achievements: ['Escrow Master', 'Trust Guardian', 'Stellar Expert', 'Security Champion']
    },
    {
      id: 'defi-trading',
      title: 'DeFi Trading Arena',
      description: 'Enter the competitive world of DeFi trading! Learn liquidity pools, yield farming, and automated market making while competing for top rankings.',
      shortDescription: 'Compete in DeFi trading challenges',
      icon: '📈',
      status: 'beta',
      category: 'defi',
      difficulty: 'Advanced',
      estimatedTime: '6-8 hours',
      rewards: '200 XLM + Trading Trophy',
      currentPlayers: 567,
      rating: 4.7,
      thumbnail: '/images/games/defi-trading-arena.png',
      progress: 85,
      estimatedRelease: 'Beta Testing',
      donationGoal: 5000,
      currentDonations: 3200,
      features: ['Liquidity Pools', 'Yield Farming', 'AMM Strategies', 'Risk Management'],
      achievements: ['Trading Champion', 'Yield Master', 'Risk Taker', 'DeFi Legend']
    },
    {
      id: 'nft-creation',
      title: 'NFT Creation Studio',
      description: 'Unleash your creativity in the NFT universe! Design, mint, and trade unique digital assets while learning the art of digital ownership.',
      shortDescription: 'Create and trade unique NFTs',
      icon: '🎨',
      status: 'beta',
      category: 'nft',
      difficulty: 'Intermediate',
      estimatedTime: '3-4 hours',
      rewards: '75 XLM + Creator Badge',
      currentPlayers: 423,
      rating: 4.6,
      thumbnail: '/images/games/blank.png',
      progress: 75,
      estimatedRelease: 'Beta Testing',
      donationGoal: 3000,
      currentDonations: 1800,
      features: ['NFT Design Tools', 'Minting Process', 'Marketplace Trading', 'Royalty Systems'],
      achievements: ['Creative Genius', 'NFT Pioneer', 'Market Master', 'Digital Artist']
    },
    {
      id: 'dao-governance',
      title: 'DAO Governance Simulator',
      description: 'Experience the future of decentralized governance! Participate in DAO voting, proposal creation, and community decision-making.',
      shortDescription: 'Learn DAO governance and voting systems',
      icon: '🗳️',
      status: 'development',
      category: 'governance',
      difficulty: 'Intermediate',
      estimatedTime: '5-6 hours',
      rewards: '150 XLM + Governance Badge',
      currentPlayers: 0,
      rating: 0,
      thumbnail: '/images/games/blank.png',
      progress: 45,
      estimatedRelease: 'Q2 2024',
      donationGoal: 8000,
      currentDonations: 4500,
      features: ['Voting Mechanisms', 'Proposal Creation', 'Treasury Management', 'Community Building'],
      achievements: ['Governance Expert', 'Proposal Master', 'Community Leader', 'DAO Architect']
    },
    {
      id: 'cross-chain-bridge',
      title: 'Cross-Chain Bridge Explorer',
      description: 'Master the art of cross-chain interoperability! Learn bridge protocols, asset transfers, and multi-chain DeFi strategies.',
      shortDescription: 'Explore cross-chain bridge technologies',
      icon: '🌉',
      status: 'development',
      category: 'interoperability',
      difficulty: 'Advanced',
      estimatedTime: '7-9 hours',
      rewards: '300 XLM + Bridge Master Badge',
      currentPlayers: 0,
      rating: 0,
      thumbnail: '/images/games/blank.png',
      progress: 30,
      estimatedRelease: 'Q3 2024',
      donationGoal: 12000,
      currentDonations: 2800,
      features: ['Bridge Protocols', 'Asset Transfers', 'Security Audits', 'Multi-Chain DeFi'],
      achievements: ['Bridge Master', 'Interoperability Expert', 'Security Guardian', 'Chain Hopper']
    },
    {
      id: 'metaverse-builder',
      title: 'Metaverse Builder World',
      description: 'Build your own metaverse! Create 3D worlds, virtual assets, and immersive experiences using web3 technology.',
      shortDescription: 'Build immersive 3D metaverse worlds',
      icon: '🌍',
      status: 'coming-soon',
      category: 'metaverse',
      difficulty: 'Expert',
      estimatedTime: '10-12 hours',
      rewards: '500 XLM + Metaverse Creator Badge',
      currentPlayers: 0,
      rating: 0,
      thumbnail: '/images/games/blank.png',
      progress: 15,
      estimatedRelease: 'Q4 2024',
      donationGoal: 20000,
      currentDonations: 1200,
      features: ['3D World Building', 'Virtual Asset Creation', 'VR Integration', 'Social Interactions'],
      achievements: ['World Builder', 'Asset Creator', 'VR Pioneer', 'Metaverse Legend']
    },
    {
      id: 'ai-web3-fusion',
      title: 'AI + Web3 Fusion Lab',
      description: 'Explore the cutting edge of AI and blockchain integration! Learn how AI enhances smart contracts, DeFi, and decentralized applications.',
      shortDescription: 'Fuse AI with blockchain technology',
      icon: '🤖',
      status: 'coming-soon',
      category: 'ai',
      difficulty: 'Expert',
      estimatedTime: '8-10 hours',
      rewards: '400 XLM + AI Pioneer Badge',
      currentPlayers: 0,
      rating: 0,
      thumbnail: '/images/games/blank.png',
      progress: 5,
      estimatedRelease: 'Q1 2025',
      donationGoal: 25000,
      currentDonations: 800,
      features: ['AI-Enhanced Smart Contracts', 'Predictive DeFi', 'Decentralized AI', 'Automated Trading'],
      achievements: ['AI Pioneer', 'Smart Contract Master', 'DeFi Innovator', 'Future Builder']
    }
  ]

  // Auto-rotate promotional banners
  useEffect(() => {
    const interval = setInterval(() => {
      setActivePromo((prev) => (prev + 1) % promotionalBanners.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [promotionalBanners.length])

  const handlePlayGame = (game: any) => {
    // Navigate to the individual game page
    window.location.href = `/mini-games/${game.id}`
  }

  const handleDonate = (game: any) => {
    setShowDonationModal(game.id)
  }

  const closeDonationModal = () => {
    setShowDonationModal(null)
  }

  const filteredGames = miniGames.filter(game => {
    const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         game.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || game.status === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'from-green-500 to-emerald-500'
    if (progress >= 60) return 'from-yellow-500 to-orange-500'
    if (progress >= 40) return 'from-orange-500 to-red-500'
    return 'from-red-500 to-pink-500'
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'from-green-500 to-emerald-500'
      case 'Intermediate': return 'from-blue-500 to-cyan-500'
      case 'Advanced': return 'from-purple-500 to-pink-500'
      case 'Expert': return 'from-red-500 to-orange-500'
      default: return 'from-gray-500 to-slate-500'
    }
  }

  return (
    <WalletProvider>
      <EscrowProvider>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
          {/* Epic Background Effects */}
          <div className="absolute inset-0">
            {/* Floating Particles */}
            <div className="absolute top-20 left-10 w-2 h-2 bg-cyan-400 rounded-full animate-ping opacity-60"></div>
            <div className="absolute top-40 right-20 w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping opacity-80" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-40 left-1/4 w-1 h-1 bg-pink-400 rounded-full animate-ping opacity-70" style={{ animationDelay: '2s' }}></div>
            <div className="absolute bottom-20 right-1/3 w-2.5 h-2.5 bg-blue-400 rounded-full animate-ping opacity-90" style={{ animationDelay: '0.5s' }}></div>
            
            {/* Energy Grid Lines */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
              <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
              <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-pink-400 to-transparent"></div>
              <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
            </div>
          </div>

          <Header />
          
          {/* Main Content */}
          <main className="relative z-10 pt-20 pb-32">
            <div className="container mx-auto px-4">
              <div className="max-w-7xl mx-auto">
                
                {/* Epic Hero Section */}
                <div className="text-center mb-16 relative">
                  {/* Legendary Background Effects */}
                  <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
                    {/* Primary Energy Core */}
                    <div className="relative w-[600px] h-48">
                      {/* Inner Energy Ring */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/40 via-purple-500/50 to-pink-500/40 blur-lg scale-150 animate-pulse"></div>
                      
                      {/* Middle Energy Ring */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/30 via-pink-500/40 to-cyan-400/30 blur-xl scale-200 animate-pulse" style={{ animationDelay: '1s' }}></div>
                      
                      {/* Outer Energy Ring */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-400/20 via-cyan-500/30 to-purple-300/20 blur-2xl scale-250 animate-pulse" style={{ animationDelay: '2s' }}></div>
                    </div>
                  </div>
                  
                  {/* Logo and Title */}
                  <div className="relative z-10 mb-8">
                    <div className="flex justify-center mb-6">
                      <div className="relative">
                        <Image 
                          src="/images/logo/logoicon.png"
                          alt="Trustless Work"
                          width={300}
                          height={300}
                          className="drop-shadow-2xl animate-pulse opacity-10"
                        />
                        {/* Glowing Orb Effect */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400/20 to-purple-400/20 blur-xl scale-110 animate-ping"></div>
                      </div>
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 drop-shadow-2xl mb-6 animate-pulse" style={{marginTop: '-200px'}}>
                      GAMING STORE
                    </h1>
                    
                    <h2 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 drop-shadow-xl mb-8">
                      WEB3 LEARNING PLATFORM
                    </h2>
                  </div>

                  <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed mb-8">
                    🚀 <span className="text-cyan-400 font-bold">LEARN</span> • 🎮 <span className="text-purple-400 font-bold">PLAY</span> • 🏆 <span className="text-pink-400 font-bold">EARN</span> • 🌟 <span className="text-yellow-400 font-bold">BUILD</span>
                  </p>
                  
                  <p className="text-lg text-white/80 max-w-3xl mx-auto">
                    Master blockchain technology through epic gaming adventures. Complete quests, earn crypto rewards, 
                    and unlock secret missions while building the future of web3!
                  </p>
                </div>

                {/* Epic Promotional Banner Carousel */}
                <div className="mb-16 relative">
                  <div className="relative h-96 rounded-3xl overflow-hidden shadow-2xl">
                    {promotionalBanners.map((banner, index) => (
                      <div
                        key={banner.id}
                        className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                          index === activePromo ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                        }`}
                      >
                        <div className={`absolute inset-0 bg-gradient-to-r ${banner.gradient} opacity-90`}></div>
                        <div className="absolute inset-0 bg-black/20"></div>
                        
                        {/* Background Image */}
                        <div className="absolute inset-0">
                          <Image
                            src={banner.image}
                            alt={banner.title}
                            fill
                            className="object-cover opacity-30"
                          />
                        </div>
                        
                        {/* Content */}
                        <div className="relative z-10 h-full flex items-center justify-center text-center p-8">
                          <div className="max-w-4xl">
                            {/* Badge */}
                            
                            <h3 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-2xl">
                              {banner.title}
                            </h3>
                            <h4 className="text-2xl md:text-3xl font-semibold text-white/90 mb-4 drop-shadow-xl">
                              {banner.subtitle}
                            </h4>
                            <p className="text-lg md:text-xl text-white/80 mb-6 max-w-2xl mx-auto drop-shadow-lg">
                              {banner.description}
                            </p>
                            
                            {/* Player Count */}
                            <div className="mb-6 text-white/80 text-sm">
                              👥 {banner.players}
                            </div>
                            
                            {/* <button className="px-8 py-4 bg-white/20 hover:bg-white/30 text-white font-bold text-lg rounded-2xl border-2 border-white/30 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl backdrop-blur-sm">
                              {banner.cta} →
                            </button> */}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* Navigation Dots */}
                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
                      {promotionalBanners.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setActivePromo(index)}
                          className={`w-3 h-3 rounded-full transition-all duration-300 ${
                            index === activePromo 
                              ? 'bg-white scale-125' 
                              : 'bg-white/50 hover:bg-white/75'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Epic Search and Filter Section */}
                <div className="mb-12">
                  <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
                    {/* Search Bar */}
                    <div className="mb-8">
                      <div className="relative max-w-2xl mx-auto">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <div className="text-2xl">🔍</div>
                        </div>
                        <input
                          type="text"
                          placeholder="Search for epic games, quests, or challenges..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-16 pr-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 text-lg"
                        />
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                          <div className="text-white/60 text-sm">
                            {filteredGames.length} games found
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Category Filters */}
                    <div className="flex flex-wrap justify-center gap-3">
                      {categories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.id)}
                          className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                            selectedCategory === category.id
                              ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg shadow-cyan-500/25'
                              : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/20'
                          }`}
                        >
                          <span className="mr-2">{category.name.split(' ')[0]}</span>
                          {category.name.split(' ').slice(1).join(' ')}
                          <span className="ml-2 px-2 py-1 bg-white/20 rounded-full text-xs">
                            {category.count}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Featured Game Spotlight */}
                <div className="mb-16">
                  <div className="text-center mb-8">
                    <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 mb-4">
                      🌟 FEATURED GAME OF THE WEEK 🌟
                    </h2>
                    <p className="text-white/80 text-lg">Experience the most popular web3 learning adventure!</p>
                  </div>
                  
                  <div className="relative bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-red-500/10 backdrop-blur-xl border border-yellow-400/30 rounded-3xl p-8 shadow-2xl">
                    <div className="grid lg:grid-cols-2 gap-8 items-center">
                      {/* Game Thumbnail */}
                      <div className="relative">
                        <div className="relative h-80 rounded-2xl overflow-hidden">
                          <Image
                            src="/images/games/web3-basics-adventure.png"
                            alt="Web3 Basics Adventure"
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                          
                          {/* Featured Badge */}
                          <div className="absolute top-4 left-4">
                            <span className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold text-sm rounded-full animate-pulse">
                              ⭐ FEATURED
                            </span>
                          </div>
                          
                          {/* Rating */}
                          <div className="absolute bottom-4 left-4 flex items-center space-x-2">
                            <span className="text-yellow-400 text-2xl">⭐</span>
                            <span className="text-white text-xl font-bold">4.8</span>
                            <span className="text-white/80 text-sm">(1,247 players)</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Game Info */}
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-4xl font-bold text-white mb-4">🌐 Web3 Basics Adventure</h3>
                          <p className="text-white/90 text-lg leading-relaxed mb-6">
                            Embark on an epic journey through blockchain fundamentals. Learn smart contracts, wallets, and DeFi while earning crypto rewards! Perfect for beginners starting their web3 journey.
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-3 bg-white/10 rounded-xl">
                            <div className="text-2xl mb-2">⏱️</div>
                            <div className="text-white font-semibold">2-3 hours</div>
                            <div className="text-white/60 text-sm">Duration</div>
                          </div>
                          <div className="text-center p-3 bg-white/10 rounded-xl">
                            <div className="text-2xl mb-2">🏆</div>
                            <div className="text-white font-semibold">50 XLM</div>
                            <div className="text-white/60 text-sm">+ NFT Badge</div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-white/80 text-sm mb-3">🎯 Key Learning Areas:</div>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 text-sm rounded-full border border-cyan-400/30">
                              Smart Contracts
                            </span>
                            <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-sm rounded-full border border-purple-400/30">
                              Wallet Security
                            </span>
                            <span className="px-3 py-1 bg-pink-500/20 text-pink-300 text-sm rounded-full border border-pink-400/30">
                              DeFi Basics
                            </span>
                          </div>
                        </div>
                        
                        <button 
                          onClick={() => window.location.href = '/mini-games/web3-basics-adventure'}
                          className="w-full py-4 px-6 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold text-xl rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-yellow-500/25"
                        >
                          🚀 PLAY NOW - START YOUR JOURNEY!
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Epic Games Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
                  {filteredGames.map((game) => (
                    <div
                      key={game.id}
                      className={`group relative bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden transition-all duration-500 transform hover:scale-105 hover:shadow-2xl ${
                        hoveredGame === game.id ? 'shadow-cyan-500/25' : 'shadow-lg'
                      }`}
                      onMouseEnter={() => setHoveredGame(game.id)}
                      onMouseLeave={() => setHoveredGame(null)}
                    >
                      {/* Game Thumbnail */}
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={game.thumbnail}
                          alt={game.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        
                        {/* Overlay Effects */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                        
                        {/* Status Badge */}
                        <div className="absolute top-4 right-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${
                            game.status === 'available' ? 'bg-green-500/80' :
                            game.status === 'beta' ? 'bg-blue-500/80' :
                            game.status === 'development' ? 'bg-yellow-500/80' :
                            'bg-gray-500/80'
                          }`}>
                            {game.status === 'available' ? '✅ Available' :
                             game.status === 'beta' ? '🧪 Beta' :
                             game.status === 'development' ? '🚧 Dev' :
                             '⏳ Soon'}
                          </span>
                        </div>
                        
                        {/* Difficulty Badge */}
                        <div className="absolute top-4 left-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${getDifficultyColor(game.difficulty)}`}>
                            {game.difficulty}
                          </span>
                        </div>
                        
                        {/* Rating */}
                        {game.rating > 0 && (
                          <div className="absolute bottom-4 left-4 flex items-center space-x-1">
                            <span className="text-yellow-400 text-sm">⭐</span>
                            <span className="text-white text-sm font-bold">{game.rating}</span>
                          </div>
                        )}
                        
                        {/* Players Count */}
                        {game.currentPlayers > 0 && (
                          <div className="absolute bottom-4 right-4">
                            <span className="text-white/80 text-xs">
                              👥 {game.currentPlayers.toLocaleString()}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Game Content */}
                      <div className="p-6">
                        {/* Game Icon and Title */}
                        <div className="flex items-center mb-3">
                          <div className="text-3xl mr-3">{game.icon}</div>
                          <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors duration-300">
                            {game.title}
                          </h3>
                        </div>
                        
                        {/* Description */}
                        <p className="text-white/80 text-sm mb-4 line-clamp-2">
                          {game.shortDescription}
                        </p>
                        
                        {/* Game Stats */}
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <div className="text-center p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors duration-300">
                            <div className="text-xs text-white/60 mb-1">⏱️ Time</div>
                            <div className="text-sm text-white font-semibold">{game.estimatedTime}</div>
                          </div>
                          <div className="text-center p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors duration-300">
                            <div className="text-xs text-white/60 mb-1">🏆 Rewards</div>
                            <div className="text-sm text-white font-semibold">{game.rewards}</div>
                          </div>
                        </div>
                        
                        {/* Features Preview */}
                        <div className="mb-4">
                          <div className="text-xs text-white/60 mb-2">🎯 Key Features:</div>
                          <div className="flex flex-wrap gap-1">
                            {game.features.slice(0, 2).map((feature, index) => (
                              <span key={index} className="px-2 py-1 bg-cyan-500/20 text-cyan-300 text-xs rounded-full border border-cyan-400/30">
                                {feature}
                              </span>
                            ))}
                            {game.features.length > 2 && (
                              <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full border border-purple-400/30">
                                +{game.features.length - 2} more
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {/* Progress Bar for Development Games */}
                        {game.status !== 'available' && (
                          <div className="mb-4">
                            <div className="flex justify-between text-xs text-white/60 mb-1">
                              <span>Development Progress</span>
                              <span>{game.progress}%</span>
                            </div>
                            <div className="w-full bg-white/10 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full bg-gradient-to-r ${getProgressColor(game.progress)} transition-all duration-500`}
                                style={{ width: `${game.progress}%` }}
                              ></div>
                            </div>
                            <p className="text-xs text-white/60 mt-1">Est. Release: {game.estimatedRelease}</p>
                          </div>
                        )}

                        {/* Play Button - Show for available and beta games */}
                        {(game.status === 'available' || game.status === 'beta') && (
                          <button
                            onClick={() => handlePlayGame(game)}
                            className={`w-full py-3 px-4 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 ${
                              game.status === 'available'
                                ? 'bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white shadow-lg hover:shadow-cyan-500/25'
                                : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-blue-500/25'
                            }`}
                          >
                            {game.status === 'available' ? '🎮 Play Now' : '🧪 Try Beta'}
                          </button>
                        )}
                      </div>

                      {/* Donate Button - Outside the Blur/Opacity Effects */}
                      {game.status !== 'available' && game.donationGoal > 0 && (
                        <div className="p-6 pt-0">
                          <button
                            onClick={() => handleDonate(game)}
                            className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-sm font-bold rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-purple-500/25 border border-purple-400/50"
                          >
                            💝 Donate to Speed Up Development
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* No Results */}
                {filteredGames.length === 0 && (
                  <div className="text-center py-16">
                    <div className="text-8xl mb-6 animate-bounce">🔍</div>
                    <h3 className="text-3xl font-bold text-white mb-4">No Epic Games Found</h3>
                    <p className="text-white/70 text-lg max-w-md mx-auto">
                      Try adjusting your search or filters to discover amazing web3 learning adventures!
                    </p>
                  </div>
                )}

              </div>
            </div>
          </main>

          {/* Nexus Prime */}
          <NexusPrime currentPage="mini-games" />
          
          <Footer />
        </div>

        {/* Enhanced Donation Modal with Game Info */}
        {showDonationModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl border border-white/20 shadow-2xl max-w-lg w-full p-8">
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">🚀</div>
                <h3 className="text-2xl font-bold text-white mb-2">Speed Up Game Development</h3>
                <p className="text-white/70 text-sm">
                  Help us reach our funding goal faster and unlock exclusive rewards!
                </p>
              </div>

              {/* Game Info Section */}
              {(() => {
                const game = miniGames.find(g => g.id === showDonationModal)
                if (!game) return null
                return (
                  <div className="mb-6 p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl border border-purple-400/20">
                    <div className="text-center mb-4">
                      <div className="text-3xl mb-2">{game.icon}</div>
                      <h4 className="text-xl font-semibold text-white mb-2">{game.title}</h4>
                      
                      <div className="flex items-center justify-between text-sm text-white/80 mb-3">
                        <span>💰 Current: ${game.currentDonations}</span>
                        <span>🎯 Goal: ${game.donationGoal}</span>
                      </div>
                      
                      <div className="w-full bg-white/10 rounded-full h-3 mb-3">
                        <div 
                          className="h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 shadow-lg"
                          style={{ width: `${Math.min((game.currentDonations / game.donationGoal) * 100, 100)}%` }}
                        ></div>
                      </div>
                      
                      <p className="text-sm text-purple-200 font-medium mb-2">
                        {Math.round((game.currentDonations / game.donationGoal) * 100)}% funded
                      </p>
                      
                      <p className="text-xs text-white/60">
                        Your donation helps accelerate development and unlock exclusive features!
                      </p>
                    </div>
                  </div>
                )
              })()}

              {/* Donation Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Donation Amount (USD)
                  </label>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                  />
                </div>
                
                <div className="flex space-x-3">
                  <button className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-xl transition-all duration-300">
                    💝 Donate Now
                  </button>
                  <button
                    onClick={closeDonationModal}
                    className="flex-1 py-3 px-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-all duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </EscrowProvider>
    </WalletProvider>
  )
}
