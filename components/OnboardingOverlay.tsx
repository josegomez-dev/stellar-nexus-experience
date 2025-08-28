'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface OnboardingStep {
  id: string
  title: string
  description: string
  target: string
  position: 'top' | 'bottom' | 'left' | 'right'
  characterPosition: 'left' | 'right'
  highlightElement?: boolean
}

interface OnboardingOverlayProps {
  isActive: boolean
  onComplete: () => void
  currentDemo: string
}

export const OnboardingOverlay = ({ isActive, onComplete, currentDemo }: OnboardingOverlayProps) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [highlightedElement, setHighlightedElement] = useState<HTMLElement | null>(null)
  const [activeTab, setActiveTab] = useState('hello-milestone')
  const [ttsEnabled, setIsTtsEnabled] = useState(true)
  const [isSpeaking, setIsSpeaking] = useState(false)

  // Text-to-Speech functionality
  const speakMessage = (text: string) => {
    if (!ttsEnabled || !('speechSynthesis' in window)) return
    
    // Stop any current speech
    window.speechSynthesis.cancel()
    
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 1.2
    utterance.pitch = 1.4
    utterance.volume = 0.9
    
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

  // Toggle TTS on/off
  const toggleTts = () => {
    if (ttsEnabled) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
    setIsTtsEnabled(!ttsEnabled)
  }

  // Demo-specific onboarding steps
  const getOnboardingSteps = (demoId: string): OnboardingStep[] => {
    const baseSteps: OnboardingStep[] = [
      {
        id: 'welcome',
        title: 'Welcome to Trustless Work! 🎉',
        description: 'I\'m your guide to exploring escrow-powered work on Stellar blockchain. Let me show you around!',
        target: 'body',
        position: 'top',
        characterPosition: 'right'
      }
    ]

    switch (demoId) {
      case 'hello-milestone':
        return [
          ...baseSteps,
          {
            id: 'connect-wallet',
            title: 'Step 1: Connect Your Wallet 🔗',
            description: 'First, you need to connect your Stellar wallet to interact with the demos. Click the "Connect Wallet" button above.',
            target: '.wallet-connect-button',
            position: 'top',
            characterPosition: 'left',
            highlightElement: true
          },
          {
            id: 'select-demo',
            title: 'Step 2: Choose Your Demo 🎯',
            description: 'You\'re currently in the "Baby Steps to Riches" demo. This teaches you the basics of escrow flow.',
            target: '.demo-card[data-demo-id="hello-milestone"]',
            position: 'bottom',
            characterPosition: 'right',
            highlightElement: true
          },
          {
            id: 'initialize-escrow',
            title: 'Step 3: Initialize Escrow 📝',
            description: 'Click "Initialize Escrow" to create a new escrow contract. This sets up the basic structure for your trustless work.',
            target: '.initialize-escrow-button',
            position: 'top',
            characterPosition: 'left',
            highlightElement: true
          },
          {
            id: 'fund-escrow',
            title: 'Step 4: Fund the Escrow 💰',
            description: 'Once initialized, fund your escrow with USDC. This locks the funds until work is completed and approved.',
            target: '.fund-escrow-button',
            position: 'bottom',
            characterPosition: 'right',
            highlightElement: true
          },
          {
            id: 'complete-milestone',
            title: 'Step 5: Complete Milestone ✅',
            description: 'Signal that your work is done by clicking "Complete Milestone". This moves the escrow to the approval phase.',
            target: '.complete-milestone-button',
            position: 'top',
            characterPosition: 'left',
            highlightElement: true
          },
          {
            id: 'approve-work',
            title: 'Step 6: Approve the Work 👍',
            description: 'As the client, approve the completed work. This triggers the automatic fund release.',
            target: '.approve-milestone-button',
            position: 'bottom',
            characterPosition: 'right',
            highlightElement: true
          },
          {
            id: 'release-funds',
            title: 'Step 7: Funds Released! 🎊',
            description: 'Congratulations! The funds are automatically released to the worker. You\'ve completed your first trustless work flow!',
            target: '.release-funds-button',
            position: 'top',
            characterPosition: 'left',
            highlightElement: true
          },
          {
            id: 'completion-requirements',
            title: '🎯 Demo Completion Requirements',
            description: 'To complete this demo successfully, you need to: 1) Initialize escrow, 2) Fund escrow, 3) Complete milestone, 4) Approve milestone, 5) Release funds. Complete all steps to see the success box!',
            target: 'body',
            position: 'top',
            characterPosition: 'right'
          }
        ]

      case 'milestone-voting':
        return [
          ...baseSteps,
          {
            id: 'connect-wallet',
            title: 'Step 1: Connect Your Wallet 🔗',
            description: 'First, connect your Stellar wallet to access the multi-stakeholder approval system.',
            target: '.wallet-connect-button',
            position: 'top',
            characterPosition: 'left',
            highlightElement: true
          },
          {
            id: 'select-demo',
            title: 'Step 2: Democracy in Action 🗳️',
            description: 'This demo shows how multiple stakeholders must approve milestones before funds are released.',
            target: '.demo-card[data-demo-id="milestone-voting"]',
            position: 'bottom',
            characterPosition: 'right',
            highlightElement: true
          },
          {
            id: 'initialize-contract',
            title: 'Step 3: Initialize Contract 📝',
            description: 'Create a new escrow contract with multiple approval requirements.',
            target: '.initialize-escrow-button',
            position: 'top',
            characterPosition: 'left',
            highlightElement: true
          },
          {
            id: 'fund-escrow',
            title: 'Step 4: Fund Escrow 💰',
            description: 'Deposit funds into the escrow contract. Multiple stakeholders will need to approve before release.',
            target: '.fund-escrow-button',
            position: 'bottom',
            characterPosition: 'right',
            highlightElement: true
          },
          {
            id: 'complete-milestones',
            title: 'Step 5: Complete Milestones ✅',
            description: 'Mark milestones as complete. Each milestone requires multiple stakeholder approvals.',
            target: '.complete-milestone-button',
            position: 'top',
            characterPosition: 'left',
            highlightElement: true
          },
          {
            id: 'get-approvals',
            title: 'Step 6: Get Stakeholder Approvals 👍',
            description: 'All required stakeholders must approve the completed milestones before funds can be released.',
            target: '.approve-milestone-button',
            position: 'bottom',
            characterPosition: 'right',
            highlightElement: true
          },
          {
            id: 'release-funds',
            title: 'Step 7: Release Funds 🎊',
            description: 'Once all approvals are received, release the funds to complete the demo!',
            target: '.release-funds-button',
            position: 'top',
            characterPosition: 'left',
            highlightElement: true
          },
          {
            id: 'completion-requirements',
            title: '🎯 Demo Completion Requirements',
            description: 'To complete this demo successfully, you need to: 1) Initialize contract, 2) Fund escrow, 3) Complete milestones, 4) Get all stakeholder approvals, 5) Release funds. Complete all steps to see the success box!',
            target: 'body',
            position: 'top',
            characterPosition: 'right'
          }
        ]

      case 'dispute-resolution':
        return [
          ...baseSteps,
          {
            id: 'connect-wallet',
            title: 'Step 1: Connect Your Wallet 🔗',
            description: 'Connect your Stellar wallet to experience the full dispute resolution workflow.',
            target: '.wallet-connect-button',
            position: 'top',
            characterPosition: 'left',
            highlightElement: true
          },
          {
            id: 'select-demo',
            title: 'Step 2: Drama Queen Escrow 👑',
            description: 'This demo showcases the complete dispute resolution and arbitration system.',
            target: '.demo-card[data-demo-id="dispute-resolution"]',
            position: 'bottom',
            characterPosition: 'right',
            highlightElement: true
          },
          {
            id: 'initialize-escrow',
            title: 'Step 3: Initialize Escrow 📝',
            description: 'Create an escrow contract that includes dispute resolution mechanisms.',
            target: '.initialize-escrow-button',
            position: 'top',
            characterPosition: 'left',
            highlightElement: true
          },
          {
            id: 'fund-escrow',
            title: 'Step 4: Fund Escrow 💰',
            description: 'Deposit funds into the escrow contract. Disputes can arise during milestone completion.',
            target: '.fund-escrow-button',
            position: 'bottom',
            characterPosition: 'right',
            highlightElement: true
          },
          {
            id: 'complete-milestones',
            title: 'Step 5: Complete Milestones ✅',
            description: 'Mark milestones as complete. Workers can raise disputes if they disagree with the status.',
            target: '.complete-milestone-button',
            position: 'top',
            characterPosition: 'left',
            highlightElement: true
          },
          {
            id: 'raise-disputes',
            title: 'Step 6: Raise Disputes ⚖️',
            description: 'Workers can raise disputes if they disagree with milestone status or need arbitration.',
            target: '.raise-dispute-button',
            position: 'bottom',
            characterPosition: 'right',
            highlightElement: true
          },
          {
            id: 'resolve-disputes',
            title: 'Step 7: Resolve Disputes 🧑‍⚖️',
            description: 'Act as an arbitrator to resolve disputes and make fair decisions based on evidence.',
            target: '.resolve-dispute-button',
            position: 'top',
            characterPosition: 'left',
            highlightElement: true
          },
          {
            id: 'release-funds',
            title: 'Step 8: Release Funds 🎊',
            description: 'Once all disputes are resolved, release the funds to complete the demo!',
            target: '.release-funds-button',
            position: 'bottom',
            characterPosition: 'right',
            highlightElement: true
          },
          {
            id: 'completion-requirements',
            title: '🎯 Demo Completion Requirements',
            description: 'To complete this demo successfully, you need to: 1) Initialize escrow, 2) Fund escrow, 3) Complete milestones, 4) Raise disputes, 5) Resolve disputes as arbitrator, 6) Release funds. Complete all steps to see the success box!',
            target: 'body',
            position: 'top',
            characterPosition: 'right'
          }
        ]

      case 'micro-marketplace':
        return [
          ...baseSteps,
          {
            id: 'connect-wallet',
            title: 'Step 1: Connect Your Wallet 🔗',
            description: 'Connect your Stellar wallet to access the micro-task marketplace with built-in escrow.',
            target: '.wallet-connect-button',
            position: 'top',
            characterPosition: 'left',
            highlightElement: true
          },
          {
            id: 'select-demo',
            title: 'Step 2: Gig Economy Madness 🛒',
            description: 'This demo shows how micro-tasks can be managed with escrow protection for both clients and workers.',
            target: '.demo-card[data-demo-id="micro-marketplace"]',
            position: 'bottom',
            characterPosition: 'right',
            highlightElement: true
          },
          {
            id: 'post-tasks',
            title: 'Step 3: Post Tasks 📋',
            description: 'As a client, post micro-tasks that workers can browse and accept.',
            target: '.post-task-button',
            position: 'top',
            characterPosition: 'left',
            highlightElement: true
          },
          {
            id: 'browse-tasks',
            title: 'Step 4: Browse Tasks 🔍',
            description: 'As a worker, browse available tasks and accept ones that match your skills.',
            target: '.browse-tasks-button',
            position: 'bottom',
            characterPosition: 'right',
            highlightElement: true
          },
          {
            id: 'complete-tasks',
            title: 'Step 5: Complete Tasks ✅',
            description: 'Complete accepted tasks and submit them for approval.',
            target: '.complete-task-button',
            position: 'top',
            characterPosition: 'left',
            highlightElement: true
          },
          {
            id: 'approve-tasks',
            title: 'Step 6: Approve Tasks 👍',
            description: 'As a client, review and approve completed tasks to release escrow funds.',
            target: '.approve-task-button',
            position: 'bottom',
            characterPosition: 'right',
            highlightElement: true
          },
          {
            id: 'release-funds',
            title: 'Step 7: Release Funds 🎊',
            description: 'Release funds to workers for completed tasks and complete the demo!',
            target: '.release-funds-button',
            position: 'top',
            characterPosition: 'left',
            highlightElement: true
          },
          {
            id: 'completion-requirements',
            title: '🎯 Demo Completion Requirements',
            description: 'To complete this demo successfully, you need to: 1) Post at least 1 task, 2) Complete at least 3 tasks, 3) Get all tasks approved. Complete all steps to see the success box!',
            target: 'body',
            position: 'top',
            characterPosition: 'right'
          }
        ]

      default:
        return baseSteps
    }
  }

  const steps = getOnboardingSteps(activeTab)

  // Demo tabs configuration
  const demoTabs = [
    {
      id: 'hello-milestone',
      title: '1. Baby Steps',
      icon: '🍼',
      color: 'from-brand-500 to-brand-400'
    },
    {
      id: 'milestone-voting',
      title: '2. Democracy',
      icon: '🗳️',
      color: 'from-success-500 to-success-400'
    },
    {
      id: 'dispute-resolution',
      title: '3. Drama Queen',
      icon: '👑',
      color: 'from-warning-500 to-warning-400'
    },
    {
      id: 'micro-marketplace',
      title: '4. Gig Economy',
      icon: '🛒',
      color: 'from-accent-500 to-accent-400'
    }
  ]

  // Handle tab change
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    setCurrentStep(0)
    // Speak the new demo description
    const newSteps = getOnboardingSteps(tabId)
    if (newSteps.length > 0) {
      speakMessage(`Welcome to ${newSteps[0].title}. ${newSteps[0].description}`)
    }
  }

  // Handle step navigation
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      const nextStepIndex = currentStep + 1
      setCurrentStep(nextStepIndex)
      const step = steps[nextStepIndex]
      speakMessage(`${step.title}. ${step.description}`)
    } else {
      onComplete()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      const prevStepIndex = currentStep - 1
      setCurrentStep(prevStepIndex)
      const step = steps[prevStepIndex]
      speakMessage(`${step.title}. ${step.description}`)
    }
  }

  // Auto-speak current step
  useEffect(() => {
    if (isActive && steps.length > 0) {
      const step = steps[currentStep]
      speakMessage(`${step.title}. ${step.description}`)
    }
  }, [currentStep, activeTab, isActive])

  // Cleanup TTS on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  if (!isActive) return null

  const currentStepData = steps[currentStep]

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-white/20 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-500/20 to-accent-500/20 p-6 border-b border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Image
                src="/images/logo/logoicon.png"
                alt="Trustless Work"
                width={32}
                height={32}
                className="w-8 h-8"
              />
              <h2 className="text-2xl font-bold text-white">Interactive Tutorial</h2>
            </div>
            
            {/* TTS Controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleTts}
                className={`px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105 text-sm ${
                  ttsEnabled 
                    ? 'bg-gradient-to-r from-green-500/20 to-emerald-600/20 border border-green-400/50 text-green-300' 
                    : 'bg-gradient-to-r from-red-500/20 to-pink-600/20 border border-red-400/50 text-red-300'
                }`}
                title={ttsEnabled ? "Disable Voice" : "Enable Voice"}
              >
                {ttsEnabled ? "🔊 ON" : "🔇 OFF"}
              </button>
              <button
                onClick={() => speakMessage(`${currentStepData.title}. ${currentStepData.description}`)}
                disabled={!ttsEnabled || isSpeaking}
                className={`px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105 text-sm ${
                  !ttsEnabled || isSpeaking
                    ? 'bg-gray-500/20 text-gray-400 border border-gray-400/30 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500/20 to-indigo-600/20 border border-blue-400/50 text-blue-300 hover:bg-gradient-to-r hover:from-blue-500/30 hover:to-indigo-600/30'
                }`}
                title={!ttsEnabled ? "Voice is disabled" : isSpeaking ? "Already speaking" : "Replay current step"}
              >
                {isSpeaking ? "⏸️" : "▶️"}
              </button>
            </div>
          </div>
        </div>

        {/* Demo Tabs */}
        <div className="bg-white/5 p-4 border-b border-white/10">
          <div className="flex flex-wrap gap-2">
            {demoTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`px-4 py-2 rounded-lg border transition-all duration-300 flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? `bg-gradient-to-r ${tab.color} text-white border-white/50 shadow-lg`
                    : 'bg-white/5 border-white/20 text-white/70 hover:bg-white/10 hover:border-white/30'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="font-medium">{tab.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-white mb-2">{currentStepData.title}</h3>
            <p className="text-white/80 leading-relaxed">{currentStepData.description}</p>
          </div>

          {/* Step Progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-sm text-white/60 mb-2">
              <span>Step {currentStep + 1} of {steps.length}</span>
              <span>{Math.round(((currentStep + 1) / steps.length) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-brand-500 to-accent-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                currentStep === 0
                  ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white hover:scale-105'
              }`}
            >
              ← Previous
            </button>

            <button
              onClick={nextStep}
              className="px-6 py-3 bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105"
            >
              {currentStep === steps.length - 1 ? 'Complete Tutorial' : 'Next →'}
            </button>
          </div>
        </div>

        {/* Close Button */}
        <div className="p-4 border-t border-white/10 text-center">
          <button
            onClick={onComplete}
            className="px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg transition-all duration-300 hover:border-white/40"
          >
            Close Tutorial
          </button>
        </div>
      </div>
    </div>
  )
}
