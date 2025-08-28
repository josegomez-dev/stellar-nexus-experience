'use client'

import { useState } from 'react'
import Image from 'next/image'

interface MiniGame {
  id: string
  title: string
  description: string
  icon: string
  category: 'escrow' | 'blockchain' | 'trustless' | 'stellar'
  difficulty: 'easy' | 'medium' | 'hard'
  playTime: string
  techUsed: string[]
  status: 'available' | 'coming-soon' | 'beta' | 'in-development'
  progress: number
  estimatedRelease: string
  donationGoal: number
  currentDonations: number
}

const MiniGameStore = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [donationAmount, setDonationAmount] = useState<number>(5)
  const [showDonationModal, setShowDonationModal] = useState<string | null>(null)

  const miniGames: MiniGame[] = [
    {
      id: 'escrow-puzzle',
      title: 'Escrow Puzzle Master',
      description: 'Solve escrow contract puzzles by arranging milestones in the correct order. Learn how trustless agreements work through interactive challenges.',
      icon: '🧩',
      category: 'escrow',
      difficulty: 'easy',
      playTime: '5-10 min',
      techUsed: ['Smart Contracts', 'Milestones', 'Escrow Logic'],
      status: 'available',
      progress: 100,
      estimatedRelease: 'Available Now',
      donationGoal: 0,
      currentDonations: 0
    },
    {
      id: 'stellar-race',
      title: 'Stellar Speed Race',
      description: 'Race against time to complete Stellar blockchain transactions. Test your knowledge of blockchain operations and network speed.',
      icon: '🏁',
      category: 'stellar',
      difficulty: 'medium',
      playTime: '8-15 min',
      techUsed: ['Stellar Network', 'Transaction Speed', 'Blockchain'],
      status: 'available',
      progress: 100,
      estimatedRelease: 'Available Now',
      donationGoal: 0,
      currentDonations: 0
    },
    {
      id: 'trust-builder',
      title: 'Trust Builder',
      description: 'Build trust networks by connecting different parties in a trustless system. Understand how reputation and verification work.',
      icon: '🏗️',
      category: 'trustless',
      difficulty: 'medium',
      playTime: '10-20 min',
      techUsed: ['Trust Networks', 'Verification', 'Reputation'],
      status: 'available',
      progress: 100,
      estimatedRelease: 'Available Now',
      donationGoal: 0,
      currentDonations: 0
    },
    {
      id: 'milestone-maze',
      title: 'Milestone Maze',
      description: 'Navigate through a maze of milestones, each representing different stages of work completion. Learn milestone management.',
      icon: '🎯',
      category: 'escrow',
      difficulty: 'easy',
      playTime: '6-12 min',
      techUsed: ['Milestones', 'Workflow', 'Progress Tracking'],
      status: 'beta',
      progress: 85,
      estimatedRelease: '2 weeks',
      donationGoal: 100,
      currentDonations: 45
    },
    {
      id: 'dispute-solver',
      title: 'Dispute Solver Pro',
      description: 'Act as an arbitrator to resolve escrow disputes. Make fair decisions based on evidence and smart contract rules.',
      icon: '⚖️',
      category: 'escrow',
      difficulty: 'hard',
      playTime: '15-25 min',
      techUsed: ['Dispute Resolution', 'Arbitration', 'Smart Contracts'],
      status: 'in-development',
      progress: 65,
      estimatedRelease: '1 month',
      donationGoal: 250,
      currentDonations: 120
    },
    {
      id: 'blockchain-explorer',
      title: 'Blockchain Explorer',
      description: 'Explore the Stellar blockchain by solving cryptographic puzzles and understanding transaction structures.',
      icon: '🔍',
      category: 'blockchain',
      difficulty: 'hard',
      playTime: '20-30 min',
      techUsed: ['Cryptography', 'Blockchain', 'Stellar Protocol'],
      status: 'coming-soon',
      progress: 35,
      estimatedRelease: '2 months',
      donationGoal: 500,
      currentDonations: 75
    },
    {
      id: 'escrow-battles',
      title: 'Escrow Battles Arena',
      description: 'Compete against other players in real-time escrow challenges. Test your skills in a competitive environment.',
      icon: '⚔️',
      category: 'escrow',
      difficulty: 'hard',
      playTime: '25-40 min',
      techUsed: ['Real-time Gaming', 'Multiplayer', 'Escrow Challenges'],
      status: 'coming-soon',
      progress: 20,
      estimatedRelease: '3 months',
      donationGoal: 750,
      currentDonations: 25
    },
    {
      id: 'stellar-empire',
      title: 'Stellar Empire Builder',
      description: 'Build and manage your own Stellar-based empire. Learn governance, economics, and blockchain management.',
      icon: '🏰',
      category: 'stellar',
      difficulty: 'hard',
      playTime: '30-60 min',
      techUsed: ['Governance', 'Economics', 'Empire Management'],
      status: 'coming-soon',
      progress: 15,
      estimatedRelease: '4 months',
      donationGoal: 1000,
      currentDonations: 10
    }
  ]

  const categories = [
    { id: 'all', name: 'All Games', icon: '🎮' },
    { id: 'escrow', name: 'Escrow', icon: '🔒' },
    { id: 'blockchain', name: 'Blockchain', icon: '⛓️' },
    { id: 'trustless', name: 'Trustless', icon: '🤝' },
    { id: 'stellar', name: 'Stellar', icon: '⭐' }
  ]

  const difficulties = [
    { id: 'all', name: 'All Levels', icon: '📊' },
    { id: 'easy', name: 'Beginner', icon: '🟢' },
    { id: 'medium', name: 'Intermediate', icon: '🟡' },
    { id: 'hard', name: 'Advanced', icon: '🔴' }
  ]

  const filteredGames = miniGames.filter(game => {
    const matchesCategory = selectedCategory === 'all' || game.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === 'all' || game.difficulty === selectedDifficulty
    const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         game.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesCategory && matchesDifficulty && matchesSearch
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400 bg-green-500/20 border-green-400/30'
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-400/30'
      case 'hard': return 'text-red-400 bg-red-500/20 border-red-400/30'
      default: return 'text-gray-400 bg-gray-500/20 border-gray-400/30'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'text-green-400 bg-green-500/20 border-green-400/30'
      case 'beta': return 'text-blue-400 bg-blue-500/20 border-blue-400/30'
      case 'in-development': return 'text-orange-400 bg-orange-500/20 border-orange-400/30'
      case 'coming-soon': return 'text-purple-400 bg-purple-500/20 border-purple-400/30'
      default: return 'text-gray-400 bg-gray-500/20 border-gray-400/30'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available': return 'Available'
      case 'beta': return 'Beta'
      case 'in-development': return 'In Development'
      case 'coming-soon': return 'Coming Soon'
      default: return 'Unknown'
    }
  }

  const handlePlayGame = (game: MiniGame) => {
    if (game.status === 'available') {
      alert(`🎮 Launching ${game.title}...\n\nThis would open the interactive game in a new window or modal.`)
    } else if (game.status === 'beta') {
      alert(`🧪 ${game.title} is in beta!\n\nThis game is still being developed and may have some bugs.`)
    } else if (game.status === 'in-development') {
      alert(`🚧 ${game.title} is currently in development!\n\nHelp speed up development by donating!`)
    } else {
      alert(`⏳ ${game.title} is coming soon!\n\nHelp us reach our funding goal to speed up development.`)
    }
  }

  const handleDonate = (game: MiniGame) => {
    setShowDonationModal(game.id)
  }

  const confirmDonation = (game: MiniGame) => {
    // In a real implementation, this would integrate with a payment system
    alert(`🎉 Thank you for your donation of $${donationAmount} to ${game.title}!\n\nYour contribution will help speed up development.`)
    setShowDonationModal(null)
    setDonationAmount(5)
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'from-green-500 to-emerald-500'
    if (progress >= 60) return 'from-yellow-500 to-orange-500'
    if (progress >= 40) return 'from-orange-500 to-red-500'
    return 'from-red-500 to-pink-500'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-brand-900 to-neutral-900 text-white p-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Image
              src="/images/logo/logoicon.png"
              alt="Trustless Work"
              width={200}
              height={200}
            />
            <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-accent-400 to-brand-400 drop-shadow-2xl">
              MINI GAMES STORE
            </h1>
          </div>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Experience Trustless Work technology through interactive mini games. 
            Learn blockchain concepts while having fun!
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-brand-400 focus:bg-white/15 transition-all duration-300"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50">
                🔍
              </span>
            </div>
          </div>

          {/* Category and Difficulty Filters */}
          <div className="flex flex-wrap justify-center gap-4">
            {/* Categories */}
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg border transition-all duration-300 flex items-center space-x-2 ${
                    selectedCategory === category.id
                      ? 'bg-brand-500/30 border-brand-400 text-brand-200'
                      : 'bg-white/5 border-white/20 text-white/70 hover:bg-white/10 hover:border-white/30'
                  }`}
                >
                  <span>{category.icon}</span>
                  <span className="text-sm font-medium">{category.name}</span>
                </button>
              ))}
            </div>

            {/* Difficulties */}
            <div className="flex flex-wrap justify-center gap-2">
              {difficulties.map(difficulty => (
                <button
                  key={difficulty.id}
                  onClick={() => setSelectedDifficulty(difficulty.id)}
                  className={`px-4 py-2 rounded-lg border transition-all duration-300 flex items-center space-x-2 ${
                    selectedDifficulty === difficulty.id
                      ? 'bg-accent-500/30 border-accent-400 text-accent-200'
                      : 'bg-white/5 border-white/20 text-white/70 hover:bg-white/10 hover:border-white/30'
                  }`}
                >
                  <span>{difficulty.icon}</span>
                  <span className="text-sm font-medium">{difficulty.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames.map(game => (
            <div
              key={game.id}
              className="relative"
            >
              {/* Game Card with Opacity/Blur Effects */}
              <div className={`bg-white/5 border border-white/20 rounded-xl p-6 hover:bg-white/10 hover:border-white/30 transition-all duration-300 transform hover:scale-105 group relative overflow-hidden ${
                game.status === 'available' ? 'opacity-100' :
                game.status === 'beta' ? 'opacity-90 blur-[0.5px]' :
                game.status === 'in-development' ? 'opacity-75 blur-[1px]' :
                'opacity-60 blur-[1.5px]'
              }`}>
              {/* Status Badge */}
              <div className="absolute top-4 right-4 z-10">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(game.status)}`}>
                  {getStatusText(game.status)}
                </span>
              </div>

              {/* Progress Bar for In-Development Games */}
              {game.status === 'in-development' && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-white/10">
                  <div 
                    className={`h-full bg-gradient-to-r ${getProgressColor(game.progress)} transition-all duration-500`}
                    style={{ width: `${game.progress}%` }}
                  ></div>
                </div>
              )}

              {/* Game Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">{game.icon}</div>
              </div>

              {/* Game Info */}
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-brand-200 transition-colors">
                {game.title}
              </h3>
              <p className="text-white/70 text-sm mb-4 leading-relaxed">
                {game.description}
              </p>

              {/* Tech Used */}
              <div className="mb-4">
                <p className="text-xs text-white/50 mb-2 uppercase tracking-wide">Technology Used:</p>
                <div className="flex flex-wrap gap-1">
                  {game.techUsed.map((tech, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-brand-500/20 border border-brand-400/30 rounded text-xs text-brand-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Game Meta */}
              <div className="flex items-center justify-between mb-4 text-sm text-white/60">
                <span>⏱️ {game.playTime}</span>
                <span className={`capitalize ${getDifficultyColor(game.difficulty).split(' ')[0]}`}>
                  {game.difficulty}
                </span>
              </div>

              {/* Development Progress for Non-Available Games */}
              {game.status !== 'available' && (
                <div className="mb-4 p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-white/60">Development Progress</span>
                    <span className="text-xs text-white/80">{game.progress}%</span>
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
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                      game.status === 'available'
                        ? 'bg-gradient-to-r from-brand-500 to-accent-600 hover:from-brand-600 hover:to-accent-700 text-white shadow-lg hover:shadow-xl'
                        : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl'
                    }`}
                  >
                    {game.status === 'available' ? '🎮 Play Now' : '🧪 Try Beta'}
                  </button>
                )}
              </div>

              {/* Donate Button - Outside the Blur/Opacity Effects */}
              {game.status !== 'available' && game.donationGoal > 0 && (
                <div className="mt-4">
                  <button
                    onClick={() => handleDonate(game)}
                    className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-sm font-semibold rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl border border-purple-400/50"
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
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-white mb-2">No Games Found</h3>
            <p className="text-white/70">
              Try adjusting your search or filters to find more games.
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-white/20">
          <p className="text-white/60 text-sm mb-4">
            🎮 More games coming soon! These mini games demonstrate the power of Trustless Work technology.
          </p>
          <p className="text-purple-300 text-sm">
            💝 Support development by donating to your favorite games!
          </p>
        </div>
      </div>

      {/* Enhanced Donation Modal with Game Info */}
      {showDonationModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-white/20 shadow-2xl max-w-lg w-full p-6">
            <div className="text-center mb-6">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-bold text-white mb-2">Speed Up Game Development</h3>
              <p className="text-white/70 text-sm">
                Help us reach our funding goal faster!
              </p>
            </div>

            {/* Game Info Section */}
            {(() => {
              const game = miniGames.find(g => g.id === showDonationModal)
              if (!game) return null
              return (
                <div className="mb-6 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-400/20">
                  <div className="text-center mb-4">
                    <div className="text-2xl mb-2">{game.icon}</div>
                    <h4 className="text-lg font-semibold text-white mb-2">{game.title}</h4>
                    
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
                      Est. Release: {game.estimatedRelease}
                    </p>
                  </div>
                </div>
              )
            })()}

            <div className="mb-6">
              <label className="block text-sm font-medium text-white/80 mb-2">
                Donation Amount ($)
              </label>
              <input
                type="number"
                min="1"
                value={donationAmount}
                onChange={(e) => setDonationAmount(Number(e.target.value))}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:bg-white/15 transition-all duration-300"
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowDonationModal(null)}
                className="flex-1 py-3 px-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg transition-all duration-300 hover:border-white/40"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmDonation(miniGames.find(g => g.id === showDonationModal)!)}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105"
              >
                💝 Donate ${donationAmount}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MiniGameStore
