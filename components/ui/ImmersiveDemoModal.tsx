'use client'

import { useState, useEffect } from 'react'
import { useGlobalWallet } from '@/contexts/WalletContext'
import { useToast } from '@/contexts/ToastContext'
import Image from 'next/image'

interface ImmersiveDemoModalProps {
  isOpen: boolean
  onClose: () => void
  demoId: string
  demoTitle: string
  demoDescription: string
  estimatedTime: number // in minutes
  children: React.ReactNode
}

interface FeedbackData {
  rating: number
  comment: string
  difficulty: 'easy' | 'medium' | 'hard'
  wouldRecommend: boolean
}

export const ImmersiveDemoModal = ({ 
  isOpen, 
  onClose, 
  demoId, 
  demoTitle, 
  demoDescription, 
  estimatedTime,
  children 
}: ImmersiveDemoModalProps) => {
  const { isConnected } = useGlobalWallet()
  const { addToast } = useToast()
  
  const [currentStep, setCurrentStep] = useState<'warning' | 'demo' | 'feedback'>('warning')
  const [progress, setProgress] = useState(0)
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [feedback, setFeedback] = useState<FeedbackData>({
    rating: 0,
    comment: '',
    difficulty: 'medium',
    wouldRecommend: true
  })
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false)

  // Progress tracking
  useEffect(() => {
    if (currentStep === 'demo' && startTime) {
      const interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime.getTime()) / 1000)
        setElapsedTime(elapsed)
        
        // Calculate progress based on estimated time
        const estimatedSeconds = estimatedTime * 60
        const progressPercent = Math.min((elapsed / estimatedSeconds) * 100, 100)
        setProgress(progressPercent)
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [currentStep, startTime, estimatedTime])

  const handleStartDemo = () => {
    setCurrentStep('demo')
    setStartTime(new Date())
    setProgress(0)
    
    // Open wallet sidebar for better UX
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('toggleWalletSidebar'))
      // Auto-expand the sidebar when opening
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('expandWalletSidebar'))
      }, 100)
    }, 500)
    
    addToast({
      type: 'success',
      title: '🚀 Demo Started!',
      message: `You're now in immersive mode. Wallet sidebar opened for transaction tracking!`,
      duration: 3000
    })
  }

  const handleCompleteDemo = () => {
    setCurrentStep('feedback')
    addToast({
      type: 'success',
      title: '🎉 Demo Completed!',
      message: 'Please share your feedback to help us improve!',
      duration: 5000
    })
  }

  const handleSubmitFeedback = async () => {
    if (feedback.rating === 0) {
      addToast({
        type: 'warning',
        title: '⚠️ Rating Required',
        message: 'Please provide a rating before submitting feedback.',
        duration: 3000
      })
      return
    }

    setIsSubmittingFeedback(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Save feedback to localStorage
      const existingFeedback = JSON.parse(localStorage.getItem('demoFeedback') || '{}')
      existingFeedback[demoId] = {
        ...feedback,
        timestamp: new Date().toISOString(),
        elapsedTime,
        demoTitle
      }
      localStorage.setItem('demoFeedback', JSON.stringify(existingFeedback))
      
      addToast({
        type: 'success',
        title: '✅ Feedback Submitted!',
        message: 'Thank you for your valuable feedback!',
        duration: 3000
      })
      
      // Close modal after a short delay
      setTimeout(() => {
        onClose()
        setCurrentStep('warning')
        setProgress(0)
        setStartTime(null)
        setElapsedTime(0)
        setFeedback({
          rating: 0,
          comment: '',
          difficulty: 'medium',
          wouldRecommend: true
        })
      }, 2000)
      
    } catch (error) {
      addToast({
        type: 'error',
        title: '❌ Submission Failed',
        message: 'Failed to submit feedback. Please try again.',
        duration: 3000
      })
    } finally {
      setIsSubmittingFeedback(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-neutral-900 via-brand-900 to-neutral-900 border border-brand-400/30 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-500/20 to-accent-500/20 border-b border-brand-400/30 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Image
                src="/images/logo/logoicon.png"
                alt="Stellar Nexus"
                width={40}
                height={40}
                className="animate-pulse"
              />
              <div>
                <h2 className="text-xl font-bold text-white">{demoTitle}</h2>
                <p className="text-brand-300 text-sm">{demoDescription}</p>
              </div>
            </div>
            
            {/* Progress Bar */}
            {currentStep === 'demo' && (
              <div className="flex items-center space-x-3">
                <div className="text-sm text-white/70">
                  {formatTime(elapsedTime)}
                </div>
                <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-brand-500 to-accent-500 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="text-sm text-white/70">
                  {Math.round(progress)}%
                </div>
              </div>
            )}
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white transition-colors"
              disabled={currentStep === 'demo'}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {currentStep === 'warning' && (
            <div className="text-center space-y-6">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-2xl font-bold text-white mb-4">Immersive Demo Experience</h3>
              
              <div className="bg-white/5 rounded-xl p-6 border border-white/20">
                <h4 className="text-lg font-semibold text-brand-300 mb-4">What to Expect:</h4>
                <ul className="text-white/80 space-y-2 text-left">
                  <li className="flex items-center space-x-2">
                    <span className="text-brand-400">⏱️</span>
                    <span>Estimated time: <strong>{estimatedTime} minutes</strong></span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-brand-400">🎯</span>
                    <span>Full attention required - no distractions</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-brand-400">📊</span>
                    <span>Progress tracking throughout the experience</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-brand-400">💬</span>
                    <span>Mandatory feedback collection at the end</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-brand-400">🔐</span>
                    <span>Wallet sidebar will open for transaction tracking</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-brand-400">🔔</span>
                    <span>Toast notifications for important updates</span>
                  </li>
                </ul>
              </div>

              {!isConnected && (
                <div className="bg-yellow-500/20 border border-yellow-400/30 rounded-xl p-4">
                  <p className="text-yellow-300">
                    🔗 <strong>Wallet Required:</strong> Please connect your Stellar wallet to start the demo
                  </p>
                </div>
              )}

              <div className="flex justify-center space-x-4">
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-colors"
                >
                  Maybe Later
                </button>
                <button
                  onClick={handleStartDemo}
                  disabled={!isConnected}
                  className="px-6 py-3 bg-gradient-to-r from-brand-500 to-accent-500 hover:from-brand-600 hover:to-accent-600 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Start Immersive Demo
                </button>
              </div>
            </div>
          )}

          {currentStep === 'demo' && (
            <div className="space-y-4">
              {/* Wallet Sidebar Info */}
              <div className="bg-brand-500/10 border border-brand-400/30 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🔐</span>
                  <div>
                    <h4 className="text-brand-300 font-semibold">Wallet Sidebar Active</h4>
                    <p className="text-white/70 text-sm">Check the right sidebar for transaction history and wallet status</p>
                  </div>
                </div>
              </div>
              
              {/* Demo Content */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/20">
                {children}
              </div>
              
              {/* Complete Demo Button */}
              <div className="text-center">
                <button
                  onClick={handleCompleteDemo}
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  🎉 Complete Demo
                </button>
              </div>
            </div>
          )}

          {currentStep === 'feedback' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-2">Demo Completed!</h3>
                <p className="text-white/70">Time taken: {formatTime(elapsedTime)}</p>
              </div>

              {/* Rating */}
              <div className="space-y-3">
                <label className="block text-white font-semibold">
                  How would you rate this demo experience? 🤔
                </label>
                <div className="flex justify-center space-x-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setFeedback(prev => ({ ...prev, rating }))}
                      className={`text-3xl transition-all duration-200 hover:scale-110 ${
                        feedback.rating >= rating ? 'text-yellow-400' : 'text-white/30'
                      }`}
                    >
                      {feedback.rating >= rating ? '⭐' : '☆'}
                    </button>
                  ))}
                </div>
                <p className="text-center text-white/60 text-sm">
                  {feedback.rating === 0 && 'Click to rate'}
                  {feedback.rating === 1 && 'Poor'}
                  {feedback.rating === 2 && 'Fair'}
                  {feedback.rating === 3 && 'Good'}
                  {feedback.rating === 4 && 'Very Good'}
                  {feedback.rating === 5 && 'Excellent!'}
                </p>
              </div>

              {/* Difficulty */}
              <div className="space-y-3">
                <label className="block text-white font-semibold">
                  How difficult was this demo? 🧠
                </label>
                <div className="flex justify-center space-x-3">
                  {[
                    { value: 'easy', label: 'Easy', emoji: '😊' },
                    { value: 'medium', label: 'Medium', emoji: '🤔' },
                    { value: 'hard', label: 'Hard', emoji: '😅' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setFeedback(prev => ({ ...prev, difficulty: option.value as any }))}
                      className={`px-4 py-2 rounded-lg border transition-all duration-200 ${
                        feedback.difficulty === option.value
                          ? 'bg-brand-500/20 border-brand-400/50 text-brand-300'
                          : 'bg-white/5 border-white/20 text-white/70 hover:bg-white/10'
                      }`}
                    >
                      <div className="text-2xl mb-1">{option.emoji}</div>
                      <div className="text-sm">{option.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Would Recommend */}
              <div className="space-y-3">
                <label className="block text-white font-semibold">
                  Would you recommend this demo to others? 💭
                </label>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => setFeedback(prev => ({ ...prev, wouldRecommend: true }))}
                    className={`px-6 py-3 rounded-lg border transition-all duration-200 ${
                      feedback.wouldRecommend
                        ? 'bg-green-500/20 border-green-400/50 text-green-300'
                        : 'bg-white/5 border-white/20 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    <div className="text-2xl mb-1">👍</div>
                    <div className="text-sm">Yes!</div>
                  </button>
                  <button
                    onClick={() => setFeedback(prev => ({ ...prev, wouldRecommend: false }))}
                    className={`px-6 py-3 rounded-lg border transition-all duration-200 ${
                      !feedback.wouldRecommend
                        ? 'bg-red-500/20 border-red-400/50 text-red-300'
                        : 'bg-white/5 border-white/20 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    <div className="text-2xl mb-1">👎</div>
                    <div className="text-sm">No</div>
                  </button>
                </div>
              </div>

              {/* Comment */}
              <div className="space-y-3">
                <label className="block text-white font-semibold">
                  Any additional comments? 💬
                </label>
                <textarea
                  value={feedback.comment}
                  onChange={(e) => setFeedback(prev => ({ ...prev, comment: e.target.value }))}
                  placeholder="Share your thoughts about the demo experience..."
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-brand-400/50 resize-none"
                  rows={3}
                />
              </div>

              {/* Submit Button */}
              <div className="text-center">
                <button
                  onClick={handleSubmitFeedback}
                  disabled={isSubmittingFeedback || feedback.rating === 0}
                  className="px-8 py-3 bg-gradient-to-r from-brand-500 to-accent-500 hover:from-brand-600 hover:to-accent-600 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmittingFeedback ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
