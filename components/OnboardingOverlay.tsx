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
          }
        ]

      case 'milestone-voting':
        return [
          ...baseSteps,
          {
            id: 'multi-approval',
            title: 'Multi-Stakeholder Approval System 🗳️',
            description: 'This demo shows how multiple people must approve milestones before funds are released. Perfect for complex projects!',
            target: '.demo-card[data-demo-id="milestone-voting"]',
            position: 'bottom',
            characterPosition: 'right',
            highlightElement: true
          },
          {
            id: 'stakeholders',
            title: 'Meet Your Stakeholders 👥',
            description: 'You\'ll see different roles: Client, Technical Reviewer, Design Reviewer, and Project Manager. Each must approve.',
            target: '.stakeholders-section',
            position: 'left',
            characterPosition: 'right',
            highlightElement: true
          },
          {
            id: 'voting-process',
            title: 'The Voting Process 📊',
            description: 'Work through each milestone. Multiple stakeholders must approve before funds can be released.',
            target: '.voting-process',
            position: 'bottom',
            characterPosition: 'left',
            highlightElement: true
          }
        ]

      case 'dispute-resolution':
        return [
          ...baseSteps,
          {
            id: 'dispute-system',
            title: 'Dispute Resolution System ⚖️',
            description: 'When things go wrong, this system provides fair arbitration. Learn how to handle conflicts professionally.',
            target: '.demo-card[data-demo-id="dispute-resolution"]',
            position: 'bottom',
            characterPosition: 'right',
            highlightElement: true
          },
          {
            id: 'raise-dispute',
            title: 'Raising a Dispute 🚨',
            description: 'Click "Raise Dispute" if you\'re not satisfied with the work. Provide clear reasons for the best outcome.',
            target: '.raise-dispute-button',
            position: 'top',
            characterPosition: 'left',
            highlightElement: true
          },
          {
            id: 'arbitration',
            title: 'Arbitration Process 👨‍⚖️',
            description: 'An arbitrator will review both sides and make a fair decision. This ensures trust in the system.',
            target: '.arbitration-section',
            position: 'bottom',
            characterPosition: 'right',
            highlightElement: true
          }
        ]

      case 'micro-marketplace':
        return [
          ...baseSteps,
          {
            id: 'marketplace',
            title: 'Micro-Task Marketplace 🛒',
            description: 'Browse tasks, post your own, and manage work with built-in escrow protection. The future of gig work!',
            target: '.demo-card[data-demo-id="micro-marketplace"]',
            position: 'bottom',
            characterPosition: 'right',
            highlightElement: true
          },
          {
            id: 'browse-tasks',
            title: 'Browse Available Tasks 🔍',
            description: 'Switch to the "Browse" tab to see available tasks. Filter by category to find work that matches your skills.',
            target: '.browse-tasks-tab',
            position: 'top',
            characterPosition: 'left',
            highlightElement: true
          },
          {
            id: 'post-task',
            title: 'Post Your Own Task 📝',
            description: 'Need work done? Post a task with your budget and requirements. The escrow system protects both parties.',
            target: '.post-task-tab',
            position: 'bottom',
            characterPosition: 'right',
            highlightElement: true
          },
          {
            id: 'manage-tasks',
            title: 'Manage Your Tasks 📋',
            description: 'Track progress, approve deliverables, and release payments all in one place.',
            target: '.manage-tasks-tab',
            position: 'top',
            characterPosition: 'left',
            highlightElement: true
          }
        ]

      default:
        return baseSteps
    }
  }

  const steps = getOnboardingSteps(currentDemo)

  useEffect(() => {
    if (!isActive || currentStep >= steps.length) return

    const step = steps[currentStep]
    
    // Remove previous highlight
    if (highlightedElement) {
      highlightedElement.classList.remove('onboarding-highlight')
    }

    // Add new highlight
    if (step.highlightElement && step.target !== 'body') {
      const targetElement = document.querySelector(step.target) as HTMLElement
      if (targetElement) {
        targetElement.classList.add('onboarding-highlight')
        setHighlightedElement(targetElement)
      }
    }

    return () => {
      if (highlightedElement) {
        highlightedElement.classList.remove('onboarding-highlight')
      }
    }
  }, [currentStep, isActive, currentDemo, steps])

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const skipOnboarding = () => {
    onComplete()
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!isActive) return
      
      switch (event.key) {
        case 'ArrowRight':
        case ' ':
          event.preventDefault()
          nextStep()
          break
        case 'ArrowLeft':
          event.preventDefault()
          previousStep()
          break
        case 'Escape':
          event.preventDefault()
          onComplete()
          break
      }
    }

    if (isActive) {
      document.addEventListener('keydown', handleKeyPress)
      return () => document.removeEventListener('keydown', handleKeyPress)
    }
  }, [isActive, currentStep, nextStep, previousStep, onComplete])

  if (!isActive) return null

  const currentStepData = steps[currentStep]
  const isLastStep = currentStep === steps.length - 1
  const progress = ((currentStep + 1) / steps.length) * 100

  return (
    <>
      {/* Dark overlay */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50" 
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-title"
        aria-describedby="onboarding-description"
      />
      
      {/* Onboarding content */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border-2 border-brand-500/30 shadow-2xl overflow-hidden">
          {/* Progress bar */}
          <div className="h-2 bg-slate-700">
            <div 
              className="h-full bg-gradient-to-r from-brand-500 to-accent-600 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          {/* Logo in top-right corner */}
          <div className="absolute top-4 right-4">
            <Image
              src="/images/logo/logoicon.png"
              alt="STELLAR NEXUS"
              width={24}
              height={24}
              className="w-6 h-6 opacity-60"
            />
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="flex items-start space-x-6">
              {/* Character image */}
              <div className={`flex-shrink-0 ${currentStepData.characterPosition === 'left' ? 'order-1' : 'order-2'}`}>
                <div className="relative">
                  <Image
                    src="/images/character/character.png"
                    alt="Guide Character"
                    width={120}
                    height={120}
                    className="rounded-full border-4 border-brand-500/50 shadow-lg"
                  />
                  {/* Speech bubble pointer */}
                  <div className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-slate-800 rotate-45 ${
                    currentStepData.characterPosition === 'left' 
                      ? 'right-0 translate-x-1/2' 
                      : 'left-0 -translate-x-1/2'
                  }`} />
                </div>
              </div>

              {/* Text content */}
              <div className={`flex-1 ${currentStepData.characterPosition === 'left' ? 'order-2' : 'order-1'}`}>
                <div className="bg-slate-800 rounded-xl p-6 border border-brand-500/30 relative">
                  {/* Speech bubble pointer */}
                  <div className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-slate-800 rotate-45 ${
                    currentStepData.characterPosition === 'left' 
                      ? 'left-0 -translate-x-1/2' 
                      : 'right-0 translate-x-1/2'
                  }`} />
                  
                  <h2 id="onboarding-title" className="text-2xl font-bold text-white mb-3">
                    {currentStepData.title}
                  </h2>
                  <p id="onboarding-description" className="text-lg text-white/80 leading-relaxed">
                    {currentStepData.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8">
              <div className="flex items-center space-x-4">
                <button
                  onClick={skipOnboarding}
                  className="px-4 py-2 text-white/60 hover:text-white transition-colors"
                >
                  Skip Tutorial
                </button>
                <span className="text-white/40 text-sm">
                  Step {currentStep + 1} of {steps.length}
                </span>
                <span className="text-white/30 text-xs">
                  Use ← → arrows or spacebar to navigate
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={previousStep}
                  disabled={currentStep === 0}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    currentStep === 0
                      ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                      : 'bg-slate-700 hover:bg-slate-600 text-white'
                  }`}
                >
                  ← Previous
                </button>
                <button
                  onClick={nextStep}
                  className="px-6 py-3 bg-gradient-to-r from-brand-500 to-accent-600 hover:from-brand-600 hover:to-accent-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105"
                >
                  {isLastStep ? 'Finish Tutorial' : 'Next →'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
