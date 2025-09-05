'use client';

import { useState } from 'react';
import { Modal } from './common/Modal';
import Image from 'next/image';

interface FreighterInstallationGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FreighterInstallationGuide = ({ isOpen, onClose }: FreighterInstallationGuideProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'Install Freighter Extension',
      content: (
        <div className="space-y-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔗</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Step 1: Install Freighter</h3>
            <p className="text-white/70 text-sm mb-4">
              Freighter is a secure Stellar wallet browser extension
            </p>
          </div>
          
          <div className="space-y-3">
            <a
              href="https://freighter.app"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-lg px-4 py-3 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
            >
              <span>🌐</span>
              <span>Visit freighter.app</span>
            </a>
            
            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
              <p className="text-white/80 text-sm">
                Click "Add to Browser" and follow the installation prompts
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Set Up Your Wallet',
      content: (
        <div className="space-y-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔐</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Step 2: Create Wallet</h3>
            <p className="text-white/70 text-sm mb-4">
              Set up your Stellar wallet for the first time
            </p>
          </div>
          
          <div className="space-y-3">
            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
              <div className="flex items-start space-x-3">
                <span className="text-green-400 text-lg">1️⃣</span>
                <div>
                  <p className="text-white/90 text-sm font-medium">Click the Freighter extension icon</p>
                  <p className="text-white/60 text-xs">Usually in your browser toolbar</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
              <div className="flex items-start space-x-3">
                <span className="text-green-400 text-lg">2️⃣</span>
                <div>
                  <p className="text-white/90 text-sm font-medium">Choose "Create New Wallet"</p>
                  <p className="text-white/60 text-xs">Or import existing wallet if you have one</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
              <div className="flex items-start space-x-3">
                <span className="text-green-400 text-lg">3️⃣</span>
                <div>
                  <p className="text-white/90 text-sm font-medium">Save your secret key safely</p>
                  <p className="text-white/60 text-xs">Never share this with anyone!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Connect to Nexus',
      content: (
        <div className="space-y-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🚀</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Step 3: Connect & Explore</h3>
            <p className="text-white/70 text-sm mb-4">
              You're ready to explore the Trustless Work demos!
            </p>
          </div>
          
          <div className="space-y-3">
            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
              <div className="flex items-start space-x-3">
                <span className="text-purple-400 text-lg">✨</span>
                <div>
                  <p className="text-white/90 text-sm font-medium">Refresh this page</p>
                  <p className="text-white/60 text-xs">To detect your newly installed wallet</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
              <div className="flex items-start space-x-3">
                <span className="text-purple-400 text-lg">🎮</span>
                <div>
                  <p className="text-white/90 text-sm font-medium">Try the demos</p>
                  <p className="text-white/60 text-xs">Experience trustless escrow workflows</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
              <div className="flex items-start space-x-3">
                <span className="text-purple-400 text-lg">🎯</span>
                <div>
                  <p className="text-white/90 text-sm font-medium">Get testnet tokens</p>
                  <p className="text-white/60 text-xs">Use Stellar Testnet Friendbot for free tokens</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-3 border border-purple-400/30">
            <div className="flex items-center space-x-2">
              <span className="text-purple-300 text-lg">💡</span>
              <p className="text-purple-200 text-sm">
                <strong>Pro Tip:</strong> Use the Stellar Testnet Friendbot to get free testnet tokens for trying out the demos!
              </p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setCurrentStep(0);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg border border-white/20 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-xl">🔗</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Install Freighter Wallet</h2>
              <p className="text-white/60 text-sm">Step {currentStep + 1} of {steps.length}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-white/60 hover:text-white hover:bg-white/10 rounded-lg p-2 transition-all duration-300"
          >
            <span className="text-xl">×</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {steps[currentStep].content}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-white/20">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <div className="flex space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600'
                    : 'bg-white/30'
                }`}
              />
            ))}
          </div>
          
          {currentStep < steps.length - 1 ? (
            <button
              onClick={nextStep}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg transition-all duration-300"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg transition-all duration-300"
            >
              Got it!
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};
