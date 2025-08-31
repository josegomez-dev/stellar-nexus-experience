'use client'

import { useState, useEffect } from 'react'
import { useGlobalWallet } from '@/contexts/WalletContext'

interface Web3OnboardingModalProps {
  isOpen: boolean
  onClose: () => void
}

export const Web3OnboardingModal = ({ isOpen, onClose }: Web3OnboardingModalProps) => {
  const { isFreighterAvailable } = useGlobalWallet()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  if (!isVisible) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Modal */}
      <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      }`}>
        <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 border border-white/20 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="p-6 border-b border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-xl">🌟</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">New to Web3?</h2>
                  <p className="text-sm text-white/70">Start Here!</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
              >
                ×
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Freighter Recommendation */}
            <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 rounded-xl p-4">
              <div className="flex items-center space-x-3 mb-3">
                <span className="text-2xl">🔗</span>
                <div>
                  <h3 className="text-lg font-semibold text-cyan-200">Recommended: Freighter Wallet</h3>
                  <p className="text-sm text-cyan-100/80">The most popular Stellar wallet with browser extension support</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <a
                  href="https://www.freighter.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg text-center"
                >
                  🚀 Install Freighter
                </a>
                <div className="text-center text-sm text-cyan-200/80">
                  Free • Secure • Easy to use
                </div>
              </div>
            </div>

            {/* Other Wallet Options */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-3">Other Stellar Wallets:</h3>
              
              <div className="grid grid-cols-2 gap-3">
                <a
                  href="https://albedo.link/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg p-3 text-center transition-all duration-300 hover:border-white/40 group"
                >
                  <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-200">🌅</div>
                  <div className="text-sm font-medium text-white">Albedo</div>
                  <div className="text-xs text-white/60 mt-1">Web-based</div>
                </a>

                <a
                  href="https://xbull.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg p-3 text-center transition-all duration-300 hover:border-white/40 group"
                >
                  <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-200">🐂</div>
                  <div className="text-sm font-medium text-white">xBull</div>
                  <div className="text-xs text-white/60 mt-1">Mobile & Web</div>
                </a>

                <a
                  href="https://rabet.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg p-3 text-center transition-all duration-300 hover:border-white/40 group"
                >
                  <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-200">🐰</div>
                  <div className="text-sm font-medium text-white">Rabet</div>
                  <div className="text-xs text-white/60 mt-1">Browser Extension</div>
                </a>

                <a
                  href="https://stellar.org/ecosystem/wallets"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg p-3 text-center transition-all duration-300 hover:border-white/40 group"
                >
                  <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-200">📚</div>
                  <div className="text-sm font-medium text-white">More Options</div>
                  <div className="text-xs text-white/60 mt-1">Official List</div>
                </a>
              </div>
            </div>

            {/* Status Info */}
            {isFreighterAvailable && (
              <div className="bg-green-500/20 border border-green-400/30 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <span className="text-green-400">✅</span>
                  <span className="text-sm text-green-200">Freighter is already installed!</span>
                </div>
              </div>
            )}

            {/* Help Text */}
            <div className="bg-blue-500/10 border border-blue-400/20 rounded-lg p-3">
              <p className="text-sm text-blue-200">
                💡 <strong>Tip:</strong> After installing a wallet, refresh this page and try connecting again.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-white/20">
            <button
              onClick={onClose}
              className="w-full bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300"
            >
              Got it, thanks!
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
