'use client'

import { useEffect, useState } from 'react'

interface XboxStyleConsoleProps {
  loadingState: 'initializing' | 'loading' | 'ready' | 'error'
  loadingProgress: number
  gameTitle?: string
}

export default function XboxStyleConsole({ loadingState, loadingProgress, gameTitle }: XboxStyleConsoleProps) {
  const [particlePositions, setParticlePositions] = useState<Array<{ x: number; y: number; delay: number; duration: number }>>([])

  useEffect(() => {
    // Generate random particle positions
    const particles = Array.from({ length: 20 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 2 + Math.random() * 2
    }))
    setParticlePositions(particles)
  }, [])

  if (loadingState === 'ready') return null

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Plasma Background Effects */}
      <div className="absolute inset-0">
        {/* Plasma Orbs */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full opacity-30 animate-pulse blur-xl"></div>
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full opacity-40 animate-pulse blur-xl" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-20 h-20 bg-gradient-to-r from-green-400 to-cyan-500 rounded-full opacity-35 animate-pulse blur-xl" style={{ animationDelay: '2s' }}></div>
        
        {/* Energy Grid */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse"></div>
          <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute top-2/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-pink-400 to-transparent animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        </div>
        
        {/* Floating Particles */}
        {particlePositions.map((particle, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-cyan-400 rounded-full animate-ping opacity-60"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`
            }}
          ></div>
        ))}
      </div>

      {/* Main Console */}
      <div className="relative z-10">
        {/* Console Base */}
        <div className="relative">
          {/* Console Stand */}
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-96 h-8 bg-gradient-to-r from-slate-700 via-slate-800 to-slate-700 rounded-b-2xl shadow-2xl"></div>
          <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 w-80 h-4 bg-gradient-to-r from-slate-600 via-slate-700 to-slate-600 rounded-b-xl shadow-xl"></div>
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 w-64 h-2 bg-gradient-to-r from-slate-500 via-slate-600 to-slate-500 rounded-b-lg shadow-lg"></div>
          
          {/* Main Console Body */}
          <div className="relative bg-gradient-to-br from-slate-900 via-black to-slate-800 rounded-3xl border-4 border-cyan-400 shadow-2xl shadow-cyan-400/50 overflow-hidden" style={{width: 'auto', height: '300px', marginTop: '-420px'}}>
            {/* Console Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 via-purple-400/5 to-pink-400/10 opacity-60"></div>
            
            {/* Console Screen */}
            <div className="absolute inset-6 bg-gradient-to-br from-black via-slate-900 to-black rounded-2xl border border-cyan-400/30 flex items-center justify-center relative overflow-hidden">
              {/* Screen Scan Lines */}
              <div className="absolute inset-0 opacity-20">
                {Array.from({ length: 30 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
                    style={{ top: `${i * 3.33}%` }}
                  />
                ))}
              </div>
              
              {/* Screen Content */}
              <div className="relative z-10 text-center px-8">
                {loadingState === 'initializing' && (
                  <div className="space-y-6">
                    {/* Console Logo */}
                    <div className="relative">
                      {/* <div className="text-8xl mb-4 animate-pulse">🕹️</div> */}
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent text-6xl font-bold animate-pulse">
                        ARCADE
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="text-cyan-400 font-mono text-2xl animate-pulse font-bold">
                        INITIALIZING CONSOLE...
                      </div>
                      <div className="text-white/80 text-lg">
                        Powering up gaming engine
                      </div>
                      <div className="text-white/60 text-sm">
                        Loading system components...
                      </div>
                    </div>
                    
                    {/* Loading Dots */}
                    <div className="flex justify-center space-x-2">
                      <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce"></div>
                      <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                )}
                
                {loadingState === 'loading' && (
                  <div className="space-y-6">
                    {/* Game Icon */}
                    {/* <div className="text-6xl mb-4 animate-bounce">🎮</div> */}
                    
                    {/* Game Title */}
                    <div className="space-y-2">
                      <h2 className="text-cyan-400 font-mono text-xl font-bold">
                        LOADING GAME
                      </h2>
                      <h1 className="text-white text-2xl font-bold">
                        {gameTitle?.toUpperCase() || 'GAME'}
                      </h1>
                    </div>
                    
                    {/* Epic Progress Bar */}
                    <div className="space-y-3">
                      <div className="w-full bg-white/10 rounded-full h-4 border border-cyan-400/30 overflow-hidden">
                        <div 
                          className="h-4 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-full transition-all duration-500 shadow-lg shadow-cyan-400/50 relative overflow-hidden"
                          style={{ width: `${loadingProgress}%` }}
                        >
                          {/* Progress Bar Shine Effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                        </div>
                      </div>
                      
                      <div className="text-white/80 text-lg font-mono">
                        {Math.round(loadingProgress)}% Complete
                      </div>
                    </div>
                    
                    {/* Dynamic Loading Messages */}
                    <div className="space-y-2">
                      <div className="text-white/60 text-sm font-mono">
                        {loadingProgress > 10 && '🔄 Initializing game engine...'}
                      </div>
                      <div className="text-white/60 text-sm font-mono">
                        {loadingProgress > 25 && '🌐 Connecting to blockchain...'}
                      </div>
                      <div className="text-white/60 text-sm font-mono">
                        {loadingProgress > 40 && '⚡ Loading smart contracts...'}
                      </div>
                      <div className="text-white/60 text-sm font-mono">
                        {loadingProgress > 60 && '🎯 Preparing game world...'}
                      </div>
                      <div className="text-white/60 text-sm font-mono">
                        {loadingProgress > 80 && '🚀 Finalizing setup...'}
                      </div>
                      <div className="text-white/60 text-sm font-mono">
                        {loadingProgress > 95 && '✨ Almost ready to play!'}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Console Control Panel */}
            <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 flex space-x-6">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full border-2 border-red-400 shadow-lg animate-pulse"></div>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full border-2 border-blue-400 shadow-lg animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full border-2 border-green-400 shadow-lg animate-pulse" style={{ animationDelay: '1s' }}></div>
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full border-2 border-purple-400 shadow-lg animate-pulse" style={{ animationDelay: '1.5s' }}></div>
            </div>
            
            {/* Console Side Vents */}
            <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-1 h-20 bg-gradient-to-b from-cyan-400 to-transparent opacity-60"></div>
            <div className="absolute right-2 top-1/2 transform -translate-x-1/2 w-1 h-20 bg-gradient-to-b from-purple-400 to-transparent opacity-60"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

