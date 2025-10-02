'use client';

import React, { useState } from 'react';
import { Account } from '@/lib/firebase/firebase-types';
import { useToast } from '@/contexts/ui/ToastContext';
import { emailJSService } from '@/lib/services/emailjs-service';
import { PokemonReferralCard } from './PokemonReferralCard';

interface ReferralInvitationModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: Account | null;
}

export const ReferralInvitationModal: React.FC<ReferralInvitationModalProps> = ({
  isOpen,
  onClose,
  account,
}) => {
  const { addToast } = useToast();
  const [email, setEmail] = useState('');
  const [personalMessage, setPersonalMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [activeTab, setActiveTab] = useState<'email' | 'card'>('card');

  if (!isOpen || !account) return null;

  // Generate referral data
  const referralCode = account.walletAddress ? account.walletAddress.slice(-8).toUpperCase() : 'NEXUS001';
  const referralLink = `${window.location.origin}/?ref=${referralCode}`;
  const referrerName = account.displayName || 'Nexus Explorer';

  const handleSendInvitation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      addToast({
        type: 'error',
        title: '❌ Email Required',
        message: 'Please enter a valid email address.',
        duration: 3000,
      });
      return;
    }

    // Check if EmailJS is configured
    if (!emailJSService.isConfigured()) {
      // Fallback: Copy referral link to clipboard
      try {
        const referralLink = `${window.location.origin}/?ref=${referralCode}`;
        const message = `Hey! Join me on Stellar Nexus Experience! Master Trustless Work on Stellar blockchain and earn badges! 🏆\n\nUse my referral code: ${referralCode}\n\n${referralLink}`;
        
        await navigator.clipboard.writeText(message);
        addToast({
          type: 'success',
          title: '📋 Referral Link Copied!',
          message: 'Referral link copied to clipboard. You can paste it in any messaging app or email.',
          duration: 5000,
        });
        
        // Reset form
        setEmail('');
        setPersonalMessage('');
        onClose();
        return;
      } catch (error) {
        addToast({
          type: 'error',
          title: '❌ Copy Failed',
          message: 'Failed to copy referral link. Please try again.',
          duration: 3000,
        });
        return;
      }
    }

    setIsSending(true);
    try {
      const success = await emailJSService.sendReferralInvitation({
        user_email: email.trim(),
        referral_code: referralCode,
        referral_link: referralLink,
        referrer_name: referrerName,
        personal_message: personalMessage.trim() || 'Join me on this amazing Web3 journey!',
      });

      if (success) {
        addToast({
          type: 'success',
          title: '🎉 Invitation Sent!',
          message: `Referral invitation sent to ${email} successfully!`,
          duration: 4000,
        });
        
        // Reset form
        setEmail('');
        setPersonalMessage('');
        onClose();
      } else {
        throw new Error('Failed to send invitation');
      }
    } catch (error) {
      console.error('Error sending invitation:', error);
      addToast({
        type: 'error',
        title: '❌ Send Failed',
        message: error instanceof Error ? error.message : 'Failed to send referral invitation. Please try again.',
        duration: 5000,
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleClose = () => {
    if (!isSending) {
      setEmail('');
      setPersonalMessage('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ marginTop: '500px' }}
    >
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 w-full max-w-2xl mx-4 border border-white/20 shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10"></div>
        <div className="absolute top-4 left-4 w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
        <div className="absolute top-8 right-6 w-1 h-1 bg-purple-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-6 left-8 w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce"></div>
        <div className="absolute bottom-4 right-4 w-1 h-1 bg-blue-400 rounded-full animate-ping"></div>

        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">
                Referral Center
              </h2>
              <p className="text-white/70 text-sm">
                Invite friends and share your referral card!
              </p>
            </div>
            <button
              onClick={handleClose}
              disabled={isSending}
              className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
            >
              ✕
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-white/20 mb-6">
          <button
              onClick={() => setActiveTab('card')}
              className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'card'
                  ? 'text-white border-b-2 border-blue-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              🎴 Pokemon Card
            </button>
            <button
              onClick={() => setActiveTab('email')}
              className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'email'
                  ? 'text-white border-b-2 border-blue-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              📧 Email Invitation
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'email' ? (
            <>
              {/* Referral Info */}
              <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-4 mb-6 border border-blue-400/30">
                <div className="text-center">
                  <div className="text-lg font-bold text-white mb-2">Your Referral Code</div>
                  <div className="bg-yellow-400 text-black rounded-lg p-2 font-mono font-bold text-xl">
                    {referralCode}
                  </div>
                  <div className="text-xs text-white/70 mt-2">
                    Friends will get +25 XP bonus when they join!
                  </div>
                </div>
              </div>

              {/* Email Form */}
              <form onSubmit={handleSendInvitation} className="space-y-4">
                {/* Email Input */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                    Friend's Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="friend@example.com"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    required
                    disabled={isSending}
                  />
                </div>

                {/* Personal Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-white mb-2">
                    Personal Message (Optional)
                  </label>
                  <textarea
                    id="message"
                    value={personalMessage}
                    onChange={(e) => setPersonalMessage(e.target.value)}
                    placeholder="Hey! Join me on this amazing Web3 journey..."
                    rows={3}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                    disabled={isSending}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={isSending || !email.trim()}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                  >
                    {isSending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <span>{emailJSService.isConfigured() ? '📧' : '📋'}</span>
                        <span>{emailJSService.isConfigured() ? 'Send Invitation' : 'Copy Referral Link'}</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isSending}
                    className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-300 border border-white/20 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </>
          ) : (
            /* Pokemon Card Tab */
            <div className="flex justify-center">
              <PokemonReferralCard account={account} />
            </div>
          )}

          {/* EmailJS Configuration Status */}
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="text-xs text-white/60 text-center">
              {emailJSService.isConfigured() ? (
                <span className="text-green-400">✅ Email service ready</span>
              ) : (
                <div className="space-y-2">
                  <span className="text-yellow-400 block">⚠️ Email service not configured</span>
                  <p className="text-xs text-white/50">
                    To enable email invitations, configure EmailJS environment variables:
                    <br />
                    NEXT_PUBLIC_EMAILJS_SERVICE_ID, NEXT_PUBLIC_EMAILJS_TEMPLATE_ID, NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralInvitationModal;
