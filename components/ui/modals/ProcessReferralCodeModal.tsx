'use client';

import React, { useState } from 'react';
import { useFirebase } from '@/contexts/data/FirebaseContext';
import { useToast } from '@/contexts/ui/ToastContext';
import { ReferralService } from '@/lib/services/referral-service';

interface ProcessReferralCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProcessReferralCodeModal: React.FC<ProcessReferralCodeModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { account, refreshAccountData } = useFirebase();
  const { addToast } = useToast();
  const [referralCode, setReferralCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [referrerInfo, setReferrerInfo] = useState<{
    name: string;
    code: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleCodeChange = async (code: string) => {
    setReferralCode(code);
    
    // Clear previous referrer info
    setReferrerInfo(null);
    
    // If code is long enough, try to find the referrer
    if (code.length >= 6) {
      try {
        const result = await ReferralService.findReferrerByCode(code);
        if (result.success && result.referrer) {
          setReferrerInfo({
            name: result.referrer.displayName,
            code: code,
          });
        }
      } catch (error) {
        // Silently handle error - user might still be typing
      }
    }
  };

  const handleProcessReferral = async () => {
    if (!account || !referralCode.trim()) {
      addToast({
        title: 'Invalid Input',
        message: 'Please enter a valid referral code',
        type: 'error',
      });
      return;
    }

    // Check if user already has a referral code (can't use referral if already referred)
    if (account.referrals?.referredBy) {
      addToast({
        title: 'Already Referred',
        message: 'You have already used a referral code',
        type: 'warning',
      });
      return;
    }

    setIsProcessing(true);
    try {
      // Find the referrer
      const referrerResult = await ReferralService.findReferrerByCode(referralCode.trim());
      
      if (!referrerResult.success || !referrerResult.referrer) {
        addToast({
          title: 'Invalid Code',
          message: 'Referral code not found. Please check and try again.',
          type: 'error',
        });
        return;
      }

      // Check if user is trying to use their own referral code
      if (referrerResult.referrer.walletAddress === account.walletAddress) {
        addToast({
          title: 'Invalid Code',
          message: 'You cannot use your own referral code',
          type: 'error',
        });
        return;
      }

      // Process the referral
      const referralResult = await ReferralService.initializeReferralSystem(
        account,
        referralCode.trim()
      );

      if (referralResult.success) {
        // Refresh account data to get updated information
        await refreshAccountData();

        addToast({
          title: 'Referral Processed!',
          message: `You earned ${referralResult.bonusEarned} XP from ${referrerResult.referrer.displayName}'s referral!`,
          type: 'success',
        });

        // Close modal and reset form
        setReferralCode('');
        setReferrerInfo(null);
        onClose();
      } else {
        addToast({
          title: 'Processing Failed',
          message: referralResult.message || 'Failed to process referral code',
          type: 'error',
        });
      }
    } catch (error) {
      console.error('Error processing referral code:', error);
      addToast({
        title: 'Error',
        message: 'An error occurred while processing the referral code',
        type: 'error',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setReferralCode('');
    setReferrerInfo(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 w-full max-w-md mx-4 border border-white/20 shadow-2xl relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-green-500/10"></div>
        <div className="absolute top-4 left-4 w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
        <div className="absolute top-8 right-6 w-1 h-1 bg-purple-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-6 left-8 w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce"></div>

        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="text-4xl mb-3">🎁</div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Process Referral Code
            </h2>
            <p className="text-white/70 text-sm">
              Enter a referral code to earn bonus XP and help a friend!
            </p>
          </div>

          {/* Referral Code Input */}
          <div className="mb-6">
            <label className="block text-white/80 text-sm font-medium mb-2">
              Referral Code
            </label>
            <input
              type="text"
              value={referralCode}
              onChange={(e) => handleCodeChange(e.target.value)}
              placeholder="Enter referral code (e.g., ABC123-XYZ789)"
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-200"
              disabled={isProcessing}
            />
          </div>

          {/* Referrer Info */}
          {referrerInfo && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-400/30 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">👤</div>
                <div>
                  <div className="text-green-300 font-semibold">
                    {referrerInfo.name}
                  </div>
                  <div className="text-green-200/70 text-sm">
                    Referral Code: {referrerInfo.code}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bonus Info */}
          <div className="mb-6 p-4 bg-blue-500/10 border border-blue-400/30 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">⭐</div>
              <div>
                <div className="text-blue-300 font-semibold">
                  +25 XP Bonus
                </div>
                <div className="text-blue-200/70 text-sm">
                  You'll receive 25 XP for using this referral code
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleProcessReferral}
              disabled={isProcessing || !referralCode.trim() || !referrerInfo}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                'Process Referral'
              )}
            </button>
            <button
              onClick={handleClose}
              disabled={isProcessing}
              className="px-4 py-3 bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white rounded-xl transition-all duration-300 border border-white/20"
            >
              ✕
            </button>
          </div>

          {/* Help Text */}
          <div className="mt-4 text-center">
            <p className="text-white/50 text-xs">
              Ask a friend for their referral code to get started!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessReferralCodeModal;
