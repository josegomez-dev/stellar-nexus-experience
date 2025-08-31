'use client'

import { useEffect, useState } from 'react'

interface XboxStyleConsoleProps {
  loadingState: 'initializing' | 'loading' | 'ready' | 'error'
  loadingProgress: number
  gameTitle?: string
}

export default function XboxStyleConsole({ loadingState, loadingProgress, gameTitle }: XboxStyleConsoleProps) {
  if (loadingState === 'ready') return null

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      

      {/* Main Console */}
      <div className="relative z-10" style={{marginTop: '-350px'}}>
        {/* Console Base */}
        <div className="relative">
          {/* Console Stand */}
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-96 h-8 bg-gradient-to-r from-slate-700 via-slate-800 to-slate-700 rounded-b-2xl shadow-2xl"></div>
          <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 w-80 h-4 bg-gradient-to-r from-slate-600 via-slate-700 to-slate-600 rounded-b-xl shadow-xl"></div>
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 w-64 h-2 bg-gradient-to-r from-slate-500 via-slate-600 to-slate-500 rounded-b-lg shadow-lg"></div>
          
          {/* Main Console Body */}
          <div className="relative bg-gradient-to-br from-slate-900 via-black to-slate-800 rounded-3xl border-4 border-cyan-400 shadow-2xl shadow-cyan-400/50 overflow-hidden" style={{width: '400px', height: '300px'}}>
            {/* Console Screen */}
            <div className="absolute inset-6 bg-gradient-to-br from-black via-slate-900 to-black rounded-2xl border border-cyan-400/30 flex items-center justify-center relative overflow-hidden">
              {/* Simple Scan Lines */}
              <div className="absolute inset-0 opacity-10">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
                    style={{ top: `${i * 10}%` }}
                  />
                ))}
              </div>
              
              {/* Screen Content */}
              <div className="relative z-10 text-center px-6 w-full">
                {loadingState === 'initializing' && (
                  <div className="flex flex-col items-center justify-center h-full space-y-8">
                    {/* Console Logo */}
                    <div className="flex flex-col items-center space-y-4">
                      <div className="flex justify-center">
                        <img 
                          src="/images/logo/logoicon.png" 
                          alt="STELLAR NEXUS" 
                          width={200} 
                          height={80} 
                          className="object-contain"
                        />
                      </div>
                      <div className="text-cyan-400 font-mono text-lg font-bold text-center">
                        INITIALIZING CONSOLE...
                      </div>
                    </div>
                    
                    <div className="space-y-3 text-center">
                      <div className="text-white/80 text-sm">
                        Powering up gaming engine
                      </div>
                      <div className="text-white/60 text-xs">
                        Loading system components...
                      </div>
                    </div>
                    
                    {/* Simple Loading Dots */}
                    <div className="flex justify-center space-x-2">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                    </div>
                  </div>
                )}
                
                {loadingState === 'loading' && (
                  <div className="flex flex-col items-center justify-center h-full space-y-6">
                    {/* Game Title */}
                    <div className="space-y-2">
                      <h2 className="text-cyan-400 font-mono text-lg font-bold">
                        LOADING GAME
                      </h2>
                      <h1 className="text-white text-xl font-bold">
                        {gameTitle?.toUpperCase() || 'GAME'}
                      </h1>
                    </div>
                    
                    {/* Simple Progress Bar */}
                    <div className="space-y-3 w-full max-w-xs">
                      <div className="w-full bg-white/10 rounded-full h-3 border border-cyan-400/30 overflow-hidden">
                        <div 
                          className="h-3 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-full transition-all duration-500"
                          style={{ width: `${loadingProgress}%` }}
                        >
                        </div>
                      </div>
                      
                      <div className="text-white/80 text-base font-mono">
                        {Math.round(loadingProgress)}% Complete
                      </div>
                    </div>
                    
                    {/* Simple Loading Messages */}
                    <div className="space-y-1 text-sm">
                      <div className="text-white/60 font-mono">
                        {loadingProgress > 10 && '🔄 Initializing game engine...'}
                      </div>
                      <div className="text-white/60 font-mono">
                        {loadingProgress > 25 && '🌐 Connecting to blockchain...'}
                      </div>
                      <div className="text-white/60 font-mono">
                        {loadingProgress > 40 && '⚡ Loading smart contracts...'}
                      </div>
                      <div className="text-white/60 font-mono">
                        {loadingProgress > 60 && '🎯 Preparing game world...'}
                      </div>
                      <div className="text-white/60 font-mono">
                        {loadingProgress > 80 && '🚀 Finalizing setup...'}
                      </div>
                      <div className="text-white/60 font-mono">
                        {loadingProgress > 95 && '✨ Almost ready to play!'}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Simple Console Control Panel */}
            <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 flex space-x-6">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full border-2 border-red-400 shadow-lg"></div>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full border-2 border-blue-400 shadow-lg"></div>
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full border-2 border-green-400 shadow-lg"></div>
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full border-2 border-purple-400 shadow-lg"></div>
            </div>
            
            {/* Simple Console Side Vents */}
            <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-1 h-20 bg-gradient-to-b from-cyan-400 to-transparent opacity-60"></div>
            <div className="absolute right-2 top-1/2 transform -translate-x-1/2 w-1 h-20 bg-gradient-to-b from-purple-400 to-transparent opacity-60"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

