'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'

interface NexusPrimeProps {
  currentPage?: string
  currentDemo?: string
  walletConnected?: boolean
}

export const NexusPrime: React.FC<NexusPrimeProps> = ({ 
  currentPage = 'home', 
  currentDemo, 
  walletConnected = false 
}) => {
  const [isVisible, setIsVisible] = useState(true)
  const [isExpanded, setIsExpanded] = useState(false)
  const [currentMessage, setCurrentMessage] = useState('')
  const [messageQueue, setMessageQueue] = useState<string[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [showTutorial, setShowTutorial] = useState(false)
  const [tutorialStep, setTutorialStep] = useState(0)
  const [isSpeaking, setIsSpeaking] = useState(false)



  // Tutorial steps for interactive guidance
  const tutorialSteps = [
    {
      title: "Welcome to STELLAR NEXUS! 🚀",
      message: "I'm your AI Guardian, NEXUS PRIME. Let me show you around the ESCROW ARSENAL!",
      action: "Let's begin the journey!"
    },
    {
      title: "Step 1: Connect Your Wallet 🔗",
      message: "First, connect your Stellar wallet to unlock the full power of trustless work systems.",
      action: "Ready to connect!"
    },
    {
      title: "Step 2: Choose Your Demo 🎯",
      message: "Explore our demo suite: Baby Steps, Democracy in Action, Drama Queen Escrow, and Gig Economy Madness!",
      action: "Show me the demos!"
    },
    {
      title: "Step 3: Master the Flow ⚡",
      message: "Learn escrow initialization, milestone management, dispute resolution, and automatic fund release.",
      action: "Teach me more!"
    },
    {
      title: "Step 4: Become a Pro 🏆",
      message: "You're now ready to master trustless work on the Stellar blockchain. The future is yours!",
      action: "I'm ready!"
    }
  ]

  // Text-to-Speech functionality
  const speakMessage = (text: string) => {
    if ('speechSynthesis' in window) {
      // Stop any current speech
      window.speechSynthesis.cancel()
      
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 1.4  // Increased from 0.9 to 1.4 for faster speech
      utterance.pitch = 1.2  // Slightly higher pitch for more energy
      utterance.volume = 0.9  // Increased volume for better clarity
      
      // Try to use a male voice
      const voices = window.speechSynthesis.getVoices()
      const maleVoice = voices.find(voice => 
        voice.name.includes('Alex') || 
        voice.name.includes('Daniel') ||
        voice.name.includes('Google') ||
        voice.name.includes('Male') ||
        voice.name.includes('David') ||
        voice.name.includes('Tom') ||
        voice.name.includes('Mark') ||
        voice.name.includes('James') ||
        voice.name.includes('John') ||
        voice.name.includes('Michael')
      )
      if (maleVoice) {
        utterance.voice = maleVoice
      }
      
      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)
      
      window.speechSynthesis.speak(utterance)
    }
  }

  // Character messages based on context
  const characterMessages = {
    home: {
      welcome: "Greetings, mortal! I am NEXUS PRIME, guardian of the STELLAR NEXUS. Ready to explore the ESCROW ARSENAL?",
      wallet: "Connect your Stellar wallet to unlock the full power of trustless work systems!",
      demos: "The ESCROW ARSENAL awaits your command. Choose your weapon wisely!"
    },
    demos: {
      welcome: "Welcome to the ESCROW ARSENAL, warrior! Each demo is a weapon in your trustless work arsenal.",
      'hello-milestone': "Baby Steps to Riches 🍼💰 - Your first escrow adventure! Simple but oh-so-satisfying!",
      'milestone-voting': "Democracy in Action 🗳️ - When one person says no, get 10 more to say yes!",
      'dispute-resolution': "Drama Queen Escrow 👑🎭 - Arbitration drama at its finest! Who will win the trust battle?",
      'micro-marketplace': "Gig Economy Madness 🛒 - Where tasks meet escrow in beautiful chaos!"
    },
    wallet: {
      connected: "Excellent! Your Stellar wallet is now connected. The power of trustless systems is yours!",
      disconnected: "A Stellar wallet connection is required to access the ESCROW ARSENAL. Connect to proceed!"
    }
  }

  // Get appropriate message based on current context
  const getContextMessage = () => {
    let message = ''
    
    if (currentPage === 'home') {
      if (walletConnected) {
        message = characterMessages.home.demos
      } else {
        message = characterMessages.home.wallet
      }
    } else if (currentPage === 'demos') {
      if (currentDemo) {
        message = characterMessages.demos[currentDemo as keyof typeof characterMessages.demos] || characterMessages.demos.welcome
      } else {
        message = characterMessages.demos.welcome
      }
    } else if (currentPage === 'wallet') {
      message = walletConnected ? characterMessages.wallet.connected : characterMessages.wallet.disconnected
    } else {
      message = characterMessages.home.welcome
    }
    
    // Ensure message is a string and remove any undefined values
    return String(message).replace(/undefined/g, '').trim()
  }

  // Typewriter effect for messages
  useEffect(() => {
    const message = getContextMessage()
    if (message !== currentMessage) {
      setMessageQueue(prev => [...prev, message])
    }
  }, [currentPage, currentDemo, walletConnected])

  useEffect(() => {
    if (messageQueue.length > 0 && !isTyping) {
      const nextMessage = messageQueue[0]
      setMessageQueue(prev => prev.slice(1))
      setCurrentMessage('')
      setIsTyping(true)
      
      let index = 0
      const typeInterval = setInterval(() => {
        if (index < nextMessage.length) {
          const char = nextMessage[index]
          // Only add valid characters, skip undefined or null
          if (char && char !== 'undefined') {
            setCurrentMessage(prev => prev + char)
          }
          index++
        } else {
          setIsTyping(false)
          clearInterval(typeInterval)
        }
      }, 50)
    }
  }, [messageQueue, isTyping])

  // Auto-hide after 8 seconds
  useEffect(() => {
    if (currentMessage && !isTyping) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(() => setIsVisible(true), 2000) // Show again after 2 seconds
      }, 8000)
      
      return () => clearTimeout(timer)
    }
  }, [currentMessage, isTyping])

  // Tutorial navigation functions
  const startTutorial = () => {
    setShowTutorial(true)
    setTutorialStep(0)
    const firstStep = tutorialSteps[0]
    speakMessage(`${firstStep.title}. ${firstStep.message}`)
  }

  const nextTutorialStep = () => {
    if (tutorialStep < tutorialSteps.length - 1) {
      const nextStep = tutorialStep + 1
      setTutorialStep(nextStep)
      const step = tutorialSteps[nextStep]
      speakMessage(`${step.title}. ${step.message}`)
    } else {
      setShowTutorial(false)
      setTutorialStep(0)
      speakMessage("Tutorial completed! You're now ready to master the ESCROW ARSENAL!")
    }
  }

  const previousTutorialStep = () => {
    if (tutorialStep > 0) {
      const prevStep = tutorialStep - 1
      setTutorialStep(prevStep)
      const step = tutorialSteps[prevStep]
      speakMessage(`${step.title}. ${step.message}`)
    }
  }

  const skipTutorial = () => {
    setShowTutorial(false)
    setTutorialStep(0)
    speakMessage("Tutorial skipped. Feel free to ask me anything about the ESCROW ARSENAL!")
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-6 left-6 z-50 enhanced-float">

      {/* Character Avatar */}
      <div className="relative group">
        {/* Character Image/Icon */}
        <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-full border-2 border-cyan-400/50 shadow-2xl cursor-pointer transition-all duration-300 hover:scale-110 hover:border-cyan-300/70 backdrop-blur-sm relative"
             onClick={() => setIsExpanded(!isExpanded)}>
          
          {/* Voice Toggle Button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              if (isSpeaking) {
                window.speechSynthesis.cancel()
                setIsSpeaking(false)
              } else {
                speakMessage("Voice enabled! I'm ready to guide you through the ESCROW ARSENAL!")
              }
            }}
            className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full border-2 border-white shadow-lg hover:scale-110 transition-all duration-200 z-20"
            title={isSpeaking ? "Stop Voice" : "Enable Voice"}
          >
            <span className="text-xs text-white">
              {isSpeaking ? "🔇" : "🔊"}
            </span>
          </button>
          <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center relative overflow-hidden">
            {/* Stellar Network Pattern */}
            <div className="absolute inset-0 opacity-30">
              <div className="w-full h-full bg-[radial-gradient(circle_at_center,_rgba(56,189,248,0.3)_0%,_transparent_70%)]"></div>
            </div>
            {/* Character Image */}
            <Image
              src="/images/character/nexus-prime-chat.png"
              alt="NEXUS PRIME"
              width={48}
              height={48}
              className="w-12 h-12 rounded-full relative z-10 object-cover"
            />
            {/* Glowing Effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400/20 to-purple-400/20"></div>
          </div>
        </div>



                       {/* Speech Bubble */}
               {isExpanded && (
                 <div className="absolute bottom-20 left-0 w-80 bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl border border-cyan-400/30 rounded-2xl shadow-2xl p-4">
            {/* Arrow */}
            <div className="absolute -bottom-2 left-6 w-4 h-4 bg-slate-900/95 border-b border-r border-cyan-400/30 transform rotate-45"></div>
            
            {/* Character Header */}
            <div className="flex items-center space-x-3 mb-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-lg flex items-center justify-center overflow-hidden">
                    <Image
                      src="/images/character/nexus-prime-chat.png"
                      alt="NEXUS PRIME"
                      width={32}
                      height={32}
                      className="w-full h-full object-cover"
                    />
                  </div>
              <div>
                <h4 className="text-cyan-300 font-semibold text-sm">NEXUS PRIME</h4>
                <p className="text-white/60 text-xs">Guardian of STELLAR NEXUS</p>
              </div>
            </div>

            {/* Message */}
            <div className="mb-3">
              {showTutorial ? (
                <div>
                  <h5 className="text-cyan-300 font-semibold text-sm mb-2">
                    {tutorialSteps[tutorialStep].title}
                  </h5>
                  <p className="text-white/90 text-sm leading-relaxed">
                    {tutorialSteps[tutorialStep].message}
                  </p>
                  <div className="mt-2 p-2 bg-white/5 rounded-lg border border-white/10">
                    <p className="text-cyan-300 text-xs font-medium">
                      💡 {tutorialSteps[tutorialStep].action}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-white/90 text-sm leading-relaxed">
                  {currentMessage}
                  {isTyping && <span className="inline-block w-2 h-4 bg-cyan-400 ml-1"></span>}
                </p>
              )}
            </div>

            {/* Status Indicators */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-white/60">Online</span>
              </div>
              <div className="flex items-center space-x-2">
                {isSpeaking ? (
                  <>
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-purple-300">Speaking...</span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                    <span className="text-white/60">Stellar Network</span>
                  </>
                )}
              </div>
            </div>

            {/* Tutorial Actions */}
            <div className="mt-3 pt-3 border-t border-white/10">
              {!showTutorial ? (
                <div className="space-y-2">
                  <button 
                    onClick={() => setIsExpanded(false)}
                    className="w-full px-3 py-2 bg-white/10 hover:bg-white/20 text-white text-xs rounded-lg transition-colors border border-white/20 hover:border-white/30"
                  >
                    Dismiss
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {/* Tutorial Progress */}
                  <div className="text-center mb-2">
                    <div className="w-full bg-white/10 rounded-full h-1 mb-2">
                      <div 
                        className="bg-gradient-to-r from-cyan-500 to-purple-600 h-1 rounded-full"
                        style={{ width: `${((tutorialStep + 1) / tutorialSteps.length) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-white/60">
                      Step {tutorialStep + 1} of {tutorialSteps.length}
                    </span>
                  </div>
                  
                  {/* Tutorial Navigation */}
                  <div className="flex space-x-2">
                    <button 
                      onClick={previousTutorialStep}
                      disabled={tutorialStep === 0}
                      className={`flex-1 px-2 py-1.5 text-xs rounded-lg transition-colors border ${
                        tutorialStep === 0
                          ? 'bg-white/5 text-white/30 border-white/10 cursor-not-allowed'
                          : 'bg-white/10 hover:bg-white/20 text-white border-white/20 hover:border-white/30'
                      }`}
                    >
                      ← Previous
                    </button>
                    <button 
                      onClick={nextTutorialStep}
                      className="flex-1 px-2 py-1.5 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white text-xs font-semibold rounded-lg transition-all duration-300"
                    >
                      {tutorialStep === tutorialSteps.length - 1 ? 'Finish' : 'Next →'}
                    </button>
                  </div>
                  
                  <button 
                    onClick={skipTutorial}
                    className="w-full px-2 py-1.5 text-white/60 hover:text-white text-xs rounded-lg transition-colors"
                  >
                    Skip Tutorial
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Simple Hover Tooltip */}
        {!isExpanded && (
          <div className="absolute bottom-20 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl border border-cyan-400/30 rounded-xl shadow-2xl p-3 w-48">
              {/* Arrow */}
              <div className="absolute -bottom-2 left-6 w-3 h-3 bg-slate-900/95 border-b border-r border-cyan-400/30 transform rotate-45"></div>
              
              {/* Simple Message */}
              <div className="text-center">
                <p className="text-white/90 text-sm font-medium">
                  Click to chat with NEXUS PRIME
                </p>
                <p className="text-cyan-300 text-xs mt-1">
                  Your AI Guardian
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
