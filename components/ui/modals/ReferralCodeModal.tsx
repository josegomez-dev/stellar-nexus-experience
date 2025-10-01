'use client';

import React, { useState, useEffect } from 'react';
import { ReferralService } from '@/lib/services/referral-service';
import { Account } from '@/lib/firebase/firebase-types';

interface ReferralCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReferralCodeSubmit: (referralCode: string) => Promise<void>;
  userEmail?: string;
}

export const ReferralCodeModal: React.FC<ReferralCodeModalProps> = ({
  isOpen,
  onClose,
  onReferralCodeSubmit,
  userEmail,
}) => {
  const [referralCode, setReferralCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [hasPendingInvitation, setHasPendingInvitation] = useState(false);
  const [pendingReferralCode, setPendingReferralCode] = useState('');
  const [referrerName, setReferrerName] = useState('');

  useEffect(() => {
    if (isOpen && userEmail) {
      checkPendingInvitation();
    }
  }, [isOpen, userEmail]);

  const checkPendingInvitation = async () => {
    if (!userEmail) return;

    try {
      const result = await ReferralService.checkPendingInvitation(userEmail);
      if (result.success && result.hasInvitation) {
        setHasPendingInvitation(true);
        setPendingReferralCode(result.referralCode || '');
        setReferrerName(result.referrerName || '');
        setReferralCode(result.referralCode || '');
      }
    } catch (error) {
      console.error('Error checking pending invitation:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!referralCode.trim()) {
      setError('Please enter a referral code');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await onReferralCodeSubmit(referralCode.trim());
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid referral code');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 w-full max-w-md border border-white/20 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">🎁</div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {hasPendingInvitation ? 'Welcome!' : 'Have a Referral Code?'}
          </h2>
          <p className="text-white/70 text-sm">
            {hasPendingInvitation
              ? `${referrerName} invited you to join Trustless Work!`
              : 'Enter a referral code to earn bonus XP when you create your account.'}
          </p>
        </div>

        {/* Referral Code Input */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Referral Code
            </label>
            <div className="relative">
              <input
                type="text"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                placeholder="Enter referral code (e.g., ABC123-XYZ789)"
                className="w-full bg-black/20 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-blue-400 transition-colors font-mono text-center"
                maxLength={15}
                disabled={isSubmitting}
              />
              {hasPendingInvitation && (
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
            </div>
            {hasPendingInvitation && (
              <p className="text-green-400 text-xs mt-1">
                This code was found for your email address
              </p>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Benefits Info */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <h3 className="text-blue-300 font-medium text-sm mb-2">🎯 Referral Benefits</h3>
            <ul className="text-blue-200/80 text-xs space-y-1">
              <li>• You get <span className="font-bold text-blue-300">+25 XP</span> bonus</li>
              <li>• Your referrer gets <span className="font-bold text-blue-300">+50 XP</span></li>
              <li>• Unlock special referral badges</li>
              <li>• Join the community together!</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleSkip}
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              Skip
            </button>
            <button
              type="submit"
              disabled={!referralCode.trim() || isSubmitting}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isSubmitting ? 'Processing...' : 'Apply Code'}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-white/50 text-xs">
            You can always add a referral code later in your account settings
          </p>
        </div>
      </div>
    </div>
  );
};
