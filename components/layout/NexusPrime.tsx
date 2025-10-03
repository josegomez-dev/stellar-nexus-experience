'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Image from 'next/image';

interface NexusPrimeProps {
  currentPage?: string;
  currentDemo?: string;
  walletConnected?: boolean;
  autoOpen?: boolean;
}

export const NexusPrime: React.FC<NexusPrimeProps> = ({
  currentPage = 'home',
  currentDemo,
  walletConnected = false,
  autoOpen = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [hasShownWelcome, setHasShownWelcome] = useState(false);
  const [hasShownAutoWelcome, setHasShownAutoWelcome] = useState(false);
  const [showFollowUpMessage, setShowFollowUpMessage] = useState(false);
  const lastProcessedMessageRef = useRef('');
  const typewriterTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Tutorial steps for interactive guidance
  const tutorialSteps = [
    {
      title: 'Welcome to STELLAR NEXUS! 🚀',
      message: "I'm your AI Guardian, NEXUS PRIME. Let me show you around the ESCROW ARSENAL!",
      action: "Let's begin the journey!",
    },
    {
      title: 'Step 1: Connect Your Wallet 🔗',
      message:
        'First, connect your Stellar wallet to unlock the full power of trustless work systems.',
      action: 'Ready to connect!',
    },
    {
      title: 'Step 2: Choose Your Demo 🎯',
      message:
        'Explore our demo suite: Baby Steps, Democracy in Action, Drama Queen Escrow, and Gig Economy Madness!',
      action: 'Show me the demos!',
    },
    {
      title: 'Step 3: Master the Flow ⚡',
      message:
        'Learn escrow initialization, milestone management, dispute resolution, and automatic fund release.',
      action: 'Teach me more!',
    },
    {
      title: 'Step 4: Become a Pro 🏆',
      message:
        "You're now ready to master trustless work on the Stellar blockchain. The future is yours!",
      action: "I'm ready!",
    },
  ];


  // Character messages based on context
  const characterMessages = useMemo(() => ({
    home: {
      welcome:
        'Greetings, mortal! I am NEXUS PRIME, guardian of the STELLAR NEXUS. Ready to explore the ESCROW ARSENAL?',
      wallet: 'Connect your Stellar wallet to unlock the full power of trustless work systems!',
      demos: 'The ESCROW ARSENAL awaits your command. Choose your weapon wisely!',
      walletConnected: 'Excellent! Your Stellar wallet is now connected. The power of Trustless Work mechanics is yours! Welcome to the ESCROW ARSENAL!',
    },
    demos: {
      welcome:
        'Welcome to the ESCROW ARSENAL, warrior! Each demo is a weapon in your trustless work arsenal.',
      'hello-milestone':
        'Baby Steps to Riches 🍼💰 - Your first escrow adventure! Simple but oh-so-satisfying!',
      'milestone-voting':
        'Democracy in Action 🗳️ - When one person says no, get 10 more to say yes!',
      'dispute-resolution':
        'Drama Queen Escrow 👑🎭 - Arbitration drama at its finest! Who will win the trust battle?',
      'micro-marketplace': 'Gig Economy Madness 🛒 - Where tasks meet escrow in beautiful chaos!',
    },
    wallet: {
      connected:
        'Excellent! Your Stellar wallet is now connected. The power of trustless systems is yours!',
      disconnected:
        'A Stellar wallet connection is required to access the ESCROW ARSENAL. Connect to proceed!',
    },
  }), []);

  // Get appropriate message based on current context
  const getContextMessage = useCallback(() => {
    let message = '';

    if (currentPage === 'home') {
      if (walletConnected && hasShownWelcome) {
        // Show special welcome message for first-time wallet connection
        message = characterMessages.home.walletConnected;
      } else if (walletConnected) {
        message = characterMessages.home.demos;
      } else {
        message = characterMessages.home.wallet;
      }
    } else if (currentPage === 'demos') {
      if (currentDemo) {
        message =
          characterMessages.demos[currentDemo as keyof typeof characterMessages.demos] ||
          characterMessages.demos.welcome;
      } else {
        message = characterMessages.demos.welcome;
      }
    } else if (currentPage === 'wallet') {
      message = walletConnected
        ? characterMessages.wallet.connected
        : characterMessages.wallet.disconnected;
    } else {
      message = characterMessages.home.welcome;
    }

    // Ensure message is a string and remove any undefined values
    return String(message)
      .replace(/undefined/g, '')
      .trim();
  }, [currentPage, currentDemo, walletConnected, hasShownWelcome, characterMessages]);

  // Simple typewriter effect for messages
  const startTypewriter = useCallback((message: string, onComplete?: () => void) => {
    // Clear any existing timeout
    if (typewriterTimeoutRef.current) {
      clearTimeout(typewriterTimeoutRef.current);
    }

    setCurrentMessage('');
    setIsTyping(true);

    let index = 0;
    const typeNextChar = () => {
      if (index < message.length) {
        const char = message[index];
        if (char && char !== 'undefined') {
          setCurrentMessage(prev => prev + char);
        }
        index++;
        typewriterTimeoutRef.current = setTimeout(typeNextChar, 50);
      } else {
        setIsTyping(false);
        typewriterTimeoutRef.current = null;
        // Call onComplete callback if provided
        if (onComplete) {
          setTimeout(onComplete, 1000); // Wait 1 second before showing next message
        }
      }
    };

    // Start typing after a small delay
    typewriterTimeoutRef.current = setTimeout(typeNextChar, 100);
  }, []);


  // Effect to trigger typewriter when context changes
  useEffect(() => {
    const message = getContextMessage();
    if (message && message !== lastProcessedMessageRef.current) {
      lastProcessedMessageRef.current = message;
      startTypewriter(message);
    }
  }, [getContextMessage, startTypewriter]);

  // Effect to show welcome message when wallet first connects
  useEffect(() => {
    if (walletConnected && !hasShownWelcome) {
      setHasShownWelcome(true);
      // Auto-expand the chat panel when wallet connects for the first time
      setTimeout(() => {
        setIsExpanded(true);
      }, 1500); // Wait for the slide-in animation to complete
    } else if (!walletConnected) {
      setHasShownWelcome(false);
    }
  }, [walletConnected, hasShownWelcome]);

  // Effect to auto-open chat when autoOpen prop is true
  useEffect(() => {
    if (autoOpen && !isExpanded && !hasShownAutoWelcome) {
      setTimeout(() => {
        setIsExpanded(true);
        // Show welcome message when auto-opening
        const welcomeMessage = "Welcome to the STELLAR NEXUS Experience! 🌟 I'm NEXUS PRIME, your AI Guardian.";
        setTimeout(() => {
          startTypewriter(welcomeMessage, () => {
            // Show follow-up message after welcome
            if (!walletConnected) {
              const followUpMessage = "To unlock the full power of the ESCROW ARSENAL and experience Trustless Work mechanics, connect your Stellar wallet!";
              startTypewriter(followUpMessage);
            } else {
              const connectedMessage = "Excellent! Your Stellar wallet is connected. The ESCROW ARSENAL is ready for your command! Choose your demo and let's begin the journey! ⚡";
              startTypewriter(connectedMessage);
            }
          });
          setHasShownAutoWelcome(true);
        }, 500); // Small delay after panel opens
      }, 1000); // Small delay to let the component render
    }
  }, [autoOpen, isExpanded, hasShownAutoWelcome, startTypewriter, walletConnected]);


  // Effect to handle clicks outside the chat container
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        chatContainerRef.current &&
        !chatContainerRef.current.contains(event.target as Node) &&
        isExpanded
      ) {
        // Add a small delay to prevent accidental closes
        setTimeout(() => {
          setIsExpanded(false);
        }, 100);
      }
    };

    // Only add event listener when the chat is expanded
    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (typewriterTimeoutRef.current) {
        clearTimeout(typewriterTimeoutRef.current);
      }
    };
  }, []);

  // Removed problematic auto-hide mechanism that was causing button to disappear

  // Tutorial navigation functions
  const startTutorial = () => {
    setShowTutorial(true);
    setTutorialStep(0);
  };

  const nextTutorialStep = () => {
    if (tutorialSteps && tutorialStep < tutorialSteps.length - 1) {
      const nextStep = tutorialStep + 1;
      setTutorialStep(nextStep);
    } else {
      setShowTutorial(false);
      setTutorialStep(0);
    }
  };

  const previousTutorialStep = () => {
    if (tutorialSteps && tutorialStep > 0) {
      const prevStep = tutorialStep - 1;
      setTutorialStep(prevStep);
    }
  };

  const skipTutorial = () => {
    setShowTutorial(false);
    setTutorialStep(0);
  };

  return (
    <>

      <div className='fixed bottom-6 left-6 z-50'>
        {/* Character Avatar - Always visible */}
        <div ref={chatContainerRef} className='relative group animate-fadeIn'>
            {/* Character Image/Icon */}
            <div
              className='w-26 h-26 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-full border-2 border-cyan-400/50 shadow-2xl cursor-pointer transition-all duration-300 hover:scale-105 backdrop-blur-sm relative'
              onClick={() => {
                const newExpandedState = !isExpanded;
                setIsExpanded(newExpandedState);
                
                // If we're opening the chat and haven't shown auto welcome, start typewriter with context message
                if (newExpandedState && !hasShownAutoWelcome) {
                  const message = getContextMessage();
                  if (message) {
                    setTimeout(() => {
                      startTypewriter(message);
                    }, 300); // Small delay to let the panel animation start
                  }
                }
              }}
              style={{ 
                animation: 'fadeIn 0.8s ease-out',
                transform: 'translateX(-10px)',
                animationFillMode: 'forwards'
              }}
            >
              <div className='w-full h-full rounded-full bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center relative overflow-hidden'>
                {/* Stellar Network Pattern */}
                <div className='absolute inset-0 opacity-30'>
                  <div className='w-full h-full bg-[radial-gradient(circle_at_center,_rgba(56,189,248,0.3)_0%,_transparent_70%)]'></div>
                </div>
                {/* Character Image */}
                <Image
                  src='/images/character/nexus-prime-chat.png'
                  alt='NEXUS PRIME'
                  width={100}
                  height={100}
                  className='rounded-full relative z-10 object-cover'
                />
                {/* Glowing Effect */}
                <div className='absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400/20 to-purple-400/20'></div>
                
                {/* New Message Indicator */}
                {walletConnected && hasShownWelcome && (
                  <div className='absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full border-2 border-white shadow-lg animate-pulse'>
                    <div className='w-full h-full bg-green-400 rounded-full animate-ping opacity-75'></div>
                  </div>
                )}
                {/* Welcome indicator for non-connected users */}
                {!walletConnected && (
                  <div className='absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full border-2 border-white shadow-lg animate-pulse'>
                    <div className='w-full h-full bg-blue-400 rounded-full animate-ping opacity-75'></div>
                  </div>
                )}
              </div>
            </div>

            {/* Speech Bubble */}
            {isExpanded && (
              <div className='absolute bottom-20 left-0 w-80 bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl border border-cyan-400/30 rounded-2xl shadow-2xl p-4'>
                {/* Arrow */}
                <div className='absolute -bottom-2 left-6 w-4 h-4 bg-slate-900/95 border-b border-r border-cyan-400/30 transform rotate-45'></div>

                {/* Character Header */}
                <div className='flex items-center justify-between mb-3'>
                  <div className='flex items-center space-x-3'>
                    <div className='w-8 h-8 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-lg flex items-center justify-center overflow-hidden'>
                      <Image
                        src='/images/character/nexus-prime-chat.png'
                        alt='NEXUS PRIME'
                        width={32}
                        height={32}
                        className='w-full h-full object-cover'
                      />
                    </div>
                    <div>
                      <h4 className='text-cyan-300 font-semibold text-sm'>NEXUS PRIME</h4>
                      <p className='text-white/60 text-xs'>Guardian of STELLAR NEXUS</p>
                    </div>
                  </div>

                </div>

                {/* Message */}
                <div className='mb-3'>
                  {showTutorial ? (
                    <div>
                      <h5 className='text-cyan-300 font-semibold text-sm mb-2'>
                        {tutorialSteps[tutorialStep].title}
                      </h5>
                      <p className='text-white/90 text-sm leading-relaxed'>
                        {tutorialSteps[tutorialStep].message}
                      </p>
                      <div className='mt-2 p-2 bg-white/5 rounded-lg border border-white/10'>
                        <p className='text-cyan-300 text-xs font-medium'>
                          💡 {tutorialSteps[tutorialStep].action}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className='text-white/90 text-sm leading-relaxed'>
                        {currentMessage}
                        {isTyping && (
                          <span className='inline-block w-2 h-4 bg-cyan-400 ml-1'></span>
                        )}
                      </p>
                    </div>
                  )}
                </div>

                {/* Status Indicators */}
                <div className='flex items-center justify-between text-xs'>
                  <div className='flex items-center space-x-2'>
                    <div className='w-2 h-2 bg-green-400 rounded-full'></div>
                    <span className='text-white/60'>Online</span>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <div className='w-2 h-2 bg-cyan-400 rounded-full'></div>
                    <span className='text-white/60'>Stellar Network</span>
                  </div>
                </div>


                {/* Tutorial Actions */}
                <div className='mt-3 pt-3 border-t border-white/10'>
                  {!showTutorial ? (
                    <div className='space-y-2'>
                      <button
                        onClick={() => setIsExpanded(false)}
                        className='w-full px-3 py-2 bg-white/10 hover:bg-white/20 text-white text-xs rounded-lg transition-colors border border-white/20 hover:border-white/30'
                      >
                        Dismiss
                      </button>
                      <p className='text-center text-white/40 text-xs'>
                        Click outside to close
                      </p>
                    </div>
                  ) : (
                    <div className='space-y-2'>
                      {/* Tutorial Progress */}
                      <div className='flex items-center justify-center mb-2'>
                        <div className='flex-1 text-center'>
                          <div className='w-full bg-white/10 rounded-full h-1 mb-2'>
                            <div
                              className='bg-gradient-to-r from-cyan-500 to-purple-600 h-1 rounded-full'
                              style={{
                                width: `${((tutorialStep + 1) / tutorialSteps.length) * 100}%`,
                              }}
                            ></div>
                          </div>
                          <span className='text-xs text-white/60'>
                            Step {tutorialStep + 1} of {tutorialSteps.length}
                          </span>
                        </div>
                      </div>

                      {/* Tutorial Navigation */}
                      <div className='flex space-x-2'>
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
                          className='flex-1 px-2 py-1.5 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white text-xs font-semibold rounded-lg transition-all duration-300'
                        >
                          {tutorialStep === tutorialSteps.length - 1 ? 'Finish' : 'Next →'}
                        </button>
                      </div>

                      <button
                        onClick={skipTutorial}
                        className='w-full px-2 py-1.5 text-white/60 hover:text-white text-xs rounded-lg transition-colors'
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
              <div className='absolute bottom-20 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none'>
                <div className='bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl border border-cyan-400/30 rounded-xl shadow-2xl p-3 w-48'>
                  {/* Arrow */}
                  <div className='absolute -bottom-2 left-6 w-3 h-3 bg-slate-900/95 border-b border-r border-cyan-400/30 transform rotate-45'></div>

                  {/* Simple Message */}
                  <div className='text-center'>
                    <p className='text-white/90 text-sm font-medium'>
                      {walletConnected 
                        ? (hasShownWelcome ? 'Click to chat with NEXUS PRIME' : 'Welcome! Click to meet NEXUS PRIME')
                        : 'Welcome! Connect wallet to unlock full features'
                      }
                    </p>
                    <p className='text-cyan-300 text-xs mt-1'>
                      {walletConnected 
                        ? (hasShownWelcome ? 'Your AI Guardian' : 'Your Stellar AI Guardian 🚀')
                        : 'Your Stellar AI Guardian 🚀'
                      }
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
      </div>
    </>
  );
};
