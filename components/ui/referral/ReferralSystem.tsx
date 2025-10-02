'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Account } from '@/lib/firebase/firebase-types';
import { ReferralService } from '@/lib/services/referral-service';
import { BadgeEmblem } from '@/components/ui/badges/BadgeEmblem';
import { getBadgeIcon, BADGE_SIZES } from '@/utils/constants/badges/assets';
import { useToast } from '@/contexts/ui/ToastContext';
import { PokemonReferralCard, PokemonReferralCardRef } from './PokemonReferralCard';

interface ReferralSystemProps {
  account: Account | null;
  onReferralComplete?: (referralData: any) => void;
  onAccountRefresh?: () => Promise<void>;
}

export const ReferralSystem: React.FC<ReferralSystemProps> = ({ account, onReferralComplete, onAccountRefresh }) => {
  const { addToast } = useToast();
  const pokemonCardRef = useRef<PokemonReferralCardRef>(null);
  const [referralStats, setReferralStats] = useState({
    totalReferrals: 0,
    successfulReferrals: 0,
    referralCode: '',
    totalBonusEarned: 0,
    recentReferrals: [] as any[],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteMessage, setInviteMessage] = useState('');
  const [isSendingInvite, setIsSendingInvite] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [copyCodeSuccess, setCopyCodeSuccess] = useState(false);
  const [pendingInvitations, setPendingInvitations] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);
  const [showPokemonCard, setShowPokemonCard] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  useEffect(() => {
    if (account) {
      loadReferralData();
    }
  }, [account]);

  const loadReferralData = async () => {
    if (!account) {
      setIsLoading(false);
      return;
    }

    try {
      const stats = ReferralService.getReferralStats(account);
      
      // If no referral code exists, try to initialize the referral system
      if (!stats.referralCode) {
        try {
          const result = await ReferralService.initializeReferralSystem(account);
          if (result.success && result.referralCode) {
            // Refresh account data to get the updated referral code
            if (onAccountRefresh) {
              await onAccountRefresh();
              // After refresh, the account prop will be updated by the parent component
              // We'll get the updated stats in the next render cycle
              return; // Exit early, let the useEffect re-run with updated account
            }
            // Fallback: use the result directly if no refresh function
            setReferralStats({
              ...stats,
              referralCode: result.referralCode,
            });
          } else {
            setReferralStats(stats);
          }
        } catch (initError) {
          console.error('Error initializing referral system:', initError);
          setReferralStats(stats);
        }
      } else {
        setReferralStats(stats);
      }
      
      // Load referral history (pending + completed)
      const history = ReferralService.getReferralHistory(account);
      setPendingInvitations(history.pendingInvitations);
    } catch (error) {
      console.error('Error loading referral data:', error);
      // Set default stats if there's an error
      setReferralStats({
        totalReferrals: 0,
        successfulReferrals: 0,
        referralCode: '',
        totalBonusEarned: 0,
        recentReferrals: [],
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendInvite = async () => {
    if (!account || !inviteEmail.trim()) return;

    setIsSendingInvite(true);
    try {
      const result = await ReferralService.sendReferralInvitation(
        account,
        inviteEmail.trim(),
        inviteMessage.trim() || undefined
      );

      if (result.success) {
        setShowInviteModal(false);
        setInviteEmail('');
        setInviteMessage('');
        if (onReferralComplete) {
          onReferralComplete({ type: 'invite_sent', email: inviteEmail });
        }
      }
    } catch (error) {
      console.error('Error sending invite:', error);
    } finally {
      setIsSendingInvite(false);
    }
  };

  const handleCopyReferralLink = async () => {
    if (!account) return;

    try {
      const result = await ReferralService.copyReferralLink(account);
      if (result.success) {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      }
    } catch (error) {
      console.error('Error copying referral link:', error);
    }
  };

  const handleCopyReferralCode = async () => {
    if (!account) return;

    try {
      const result = await ReferralService.copyReferralCode(account);
      if (result.success) {
        setCopyCodeSuccess(true);
        setTimeout(() => setCopyCodeSuccess(false), 2000);
      }
    } catch (error) {
      console.error('Error copying referral code:', error);
    }
  };

  const handleRefreshReferrals = async () => {
    if (!account) return;

    setIsRefreshing(true);
    try {
      const result = await ReferralService.checkForNewReferrals(account);
      
      if (result.success) {
        if (result.newReferrals > 0) {
          addToast({
            title: 'New Referrals Found!',
            message: result.message,
            type: 'success',
          });
          
          // Refresh account data to show updated stats
          if (onAccountRefresh) {
            await onAccountRefresh();
          }
          
          // Reload data to show updated stats
          await loadReferralData();
          
          if (onReferralComplete) {
            onReferralComplete({ type: 'new_referrals', count: result.newReferrals });
          }
        } else {
          addToast({
            title: 'No New Referrals',
            message: result.message,
            type: 'info',
          });
        }
      } else {
        addToast({
          title: 'Refresh Failed',
          message: result.message,
          type: 'error',
        });
      }
    } catch (error) {
      console.error('Error refreshing referrals:', error);
      addToast({
        title: 'Error',
        message: 'Failed to refresh referrals',
        type: 'error',
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleGenerateCode = async () => {
    if (!account) return;

    setIsGeneratingCode(true);
    try {
      const result = await ReferralService.initializeReferralSystem(account);
      
      if (result.success && result.referralCode) {
        addToast({
          title: 'Referral Code Generated!',
          message: `Your new referral code is: ${result.referralCode}`,
          type: 'success',
        });
        
        // Refresh account data to get the updated referral code
        if (onAccountRefresh) {
          await onAccountRefresh();
        }
        
        // Update stats with the new referral code
        setReferralStats(prev => ({
          ...prev,
          referralCode: result.referralCode!,
        }));
      } else {
        addToast({
          title: 'Generation Failed',
          message: result.message,
          type: 'error',
        });
      }
    } catch (error) {
      console.error('Error generating referral code:', error);
      addToast({
        title: 'Error',
        message: 'Failed to generate referral code',
        type: 'error',
      });
    } finally {
      setIsGeneratingCode(false);
    }
  };

  const getReferralBadge = (count: number) => {
    if (count >= 10) return { id: 'referral_legend', name: 'Referral Legend' };
    if (count >= 5) return { id: 'referral_champion', name: 'Referral Champion' };
    if (count >= 1) return { id: 'first_referral', name: 'First Referral' };
    return null;
  };

  const getNextMilestone = (current: number) => {
    if (current < 1) return { target: 1, reward: 'First Referral Badge' };
    if (current < 5) return { target: 5, reward: 'Referral Champion Badge' };
    if (current < 10) return { target: 10, reward: 'Referral Legend Badge' };
    return { target: 15, reward: 'Community Builder Badge' };
  };

  // Calculate user level based on experience
  const getUserLevel = () => {
    if (!account?.experience) return 1;
    return Math.floor(account.experience / 100) + 1;
  };

  // Handle Pokemon card sharing
  const handleShareCard = async (platform: 'twitter' | 'linkedin' | 'facebook') => {
    if (pokemonCardRef.current) {
      try {
        await pokemonCardRef.current.shareCardImage(platform);
        addToast({
          title: 'Card Shared!',
          message: `Your referral card has been shared on ${platform}`,
          type: 'success',
        });
      } catch (error) {
        console.error('Error sharing card:', error);
        addToast({
          title: 'Share Failed',
          message: 'Failed to share your referral card',
          type: 'error',
        });
      }
    }
  };

  // Handle Pokemon card download
  const handleDownloadCard = async () => {
    if (pokemonCardRef.current) {
      try {
        await pokemonCardRef.current.downloadCardImage();
        addToast({
          title: 'Card Downloaded!',
          message: 'Your referral card has been saved to your device',
          type: 'success',
        });
      } catch (error) {
        console.error('Error downloading card:', error);
        addToast({
          title: 'Download Failed',
          message: 'Failed to download your referral card',
          type: 'error',
        });
      }
    }
  };

  // Handle Pokemon card GIF download
  const handleDownloadCardGif = async () => {
    if (pokemonCardRef.current) {
      setIsGeneratingImage(true);
      try {
        await pokemonCardRef.current.downloadCardGif();
        addToast({
          title: 'Card GIF Downloaded!',
          message: 'Your animated referral card has been saved to your device',
          type: 'success',
        });
      } catch (error) {
        console.error('Error downloading card GIF:', error);
        addToast({
          title: 'Download Failed',
          message: 'Failed to download your animated referral card',
          type: 'error',
        });
      } finally {
        setIsGeneratingImage(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
        <span className="ml-2 text-white/70">Loading referral data...</span>
      </div>
    );
  }

  const nextMilestone = getNextMilestone(referralStats.successfulReferrals);
  const currentBadge = getReferralBadge(referralStats.successfulReferrals);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">👥 Referral System</h2>
        <p className="text-white/70">Invite friends and earn bonus XP and special badges!</p>
      </div>

      {/* Referral Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/10 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">{referralStats.totalReferrals}</div>
          <div className="text-sm text-white/70">Total Invites</div>
        </div>
        <div className="bg-white/10 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-400">{referralStats.successfulReferrals}</div>
          <div className="text-sm text-white/70">Successful</div>
        </div>
        <div className="bg-white/10 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-400">+{referralStats.totalBonusEarned}</div>
          <div className="text-sm text-white/70">Bonus XP</div>
        </div>
        <div className="bg-white/10 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-400">
            {Math.round((referralStats.successfulReferrals / Math.max(referralStats.totalReferrals, 1)) * 100)}%
          </div>
          <div className="text-sm text-white/70">Success Rate</div>
        </div>
      </div>


      {/* Current Badge */}
      {currentBadge && (
        <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl p-4 border border-green-400/30">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🏆</div>
            <div>
              <h3 className="text-lg font-semibold text-white">Current Badge</h3>
              <div className="flex items-center gap-2">
                {getBadgeIcon(currentBadge.id, BADGE_SIZES.sm) || (
                  <BadgeEmblem id={currentBadge.id} size="sm" />
                )}
                <span className="text-green-300 font-medium">{currentBadge.name}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Next Milestone */}
      <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-4 border border-purple-400/30">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Next Milestone</h3>
            <p className="text-white/70">
              {nextMilestone.target - referralStats.successfulReferrals} more referrals to unlock
            </p>
            <p className="text-purple-300 font-medium">{nextMilestone.reward}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-purple-400">
              {referralStats.successfulReferrals}/{nextMilestone.target}
            </div>
            <div className="w-24 bg-white/20 rounded-full h-2 mt-2">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(referralStats.successfulReferrals / nextMilestone.target) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Two-Column Grid Layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Column: Pokemon Referral Card */}
        {referralStats.referralCode && (
          <div 
            className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-purple-400/30 relative overflow-hidden"
            style={{
              backgroundImage: 'url(/images/bg/space.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            {/* Pokemon Card */}
            <div className="flex justify-center mb-4">
              <PokemonReferralCard
                ref={pokemonCardRef}
                account={account}
                referralCode={referralStats.referralCode}
                level={getUserLevel()}
                className="transform hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Download Buttons */}
            <div className="space-y-3">
              <div className="text-sm text-white/70 text-center mb-3">
                Download your card to share your progress:
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleDownloadCard}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium py-2 px-3 rounded-lg transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2 text-sm"
                >
                  <span>💾</span>
                  <span>PNG</span>
                </button>
                <button
                  onClick={handleDownloadCardGif}
                  disabled={isGeneratingImage}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-purple-400 disabled:to-pink-400 text-white font-medium py-2 px-3 rounded-lg transition-all duration-200 hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                >
                  {isGeneratingImage ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <span>🎬</span>
                      <span>GIF</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>
        )}

        {/* Right Column: Referral Code & Actions */}
        <div className="bg-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Your Referral Code</h3>
            <p className="text-sm text-white/70">
              Share your code or link with friends to earn 50 XP for each successful referral!
            </p>
            {!referralStats.referralCode && (
              <button
                onClick={handleGenerateCode}
                disabled={isGeneratingCode}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
              >
                {isGeneratingCode ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <span>⚡</span>
                    <span>Generate Code</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Referral Code Display */}
          <div className="space-y-4 mb-4">
            <div className="bg-black/20 rounded-lg p-4 border border-white/20">
              <div className="text-sm text-white/70 mb-2">Referral Code</div>
              <div className="text-lg font-mono font-bold text-blue-400 mb-3">
                {referralStats.referralCode || 'Generating...'}
              </div>
              <button
                onClick={handleCopyReferralCode}
                disabled={!referralStats.referralCode}
                className={`w-full px-3 py-2 rounded-lg font-medium transition-all duration-200 text-sm ${
                  copyCodeSuccess
                    ? 'bg-green-500 text-white'
                    : referralStats.referralCode
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white hover:scale-105'
                    : 'bg-gray-500 text-gray-300 cursor-not-allowed'
                }`}
              >
                {copyCodeSuccess ? '✓ Copied!' : '📋 Copy Code'}
              </button>
            </div>

            <div className="bg-black/20 rounded-lg p-4 border border-white/20">
              <div className="text-sm text-white/70 mb-2">Referral Link</div>
              <div className="text-sm font-mono text-blue-300 truncate mb-3">
                {referralStats.referralCode ? `${window.location.origin}?ref=${referralStats.referralCode}` : 'Generating...'}
              </div>
              <button
                onClick={handleCopyReferralLink}
                disabled={!referralStats.referralCode}
                className={`w-full px-3 py-2 rounded-lg font-medium transition-all duration-200 text-sm ${
                  copySuccess
                    ? 'bg-green-500 text-white'
                    : referralStats.referralCode
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white hover:scale-105'
                    : 'bg-gray-500 text-gray-300 cursor-not-allowed'
                }`}
              >
                {copySuccess ? '✓ Copied!' : '🔗 Copy Link'}
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <p className="text-sm text-white/70 mb-3 text-center">
            Send an email invitation to a friend to join the referral program
          </p>
          <div className="grid grid-cols-1 gap-3 mb-4">
            <button
              onClick={() => setShowInviteModal(true)}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium py-2 px-3 rounded-lg transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2 text-sm"
            >
              <span>📧</span>
              <span>Send Email Invitation</span>
            </button>
          </div>

          {/* Social Sharing */}
          {referralStats.referralCode && (
            <div className="mb-4">
              <div className="text-sm text-white/70 mb-3 text-center">
                Share your card directly on social media:
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleShareCard('twitter')}
                  className="bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-medium py-2 px-2 rounded-lg transition-all duration-200 hover:scale-105 flex items-center justify-center gap-1 text-xs"
                >
                  <span>🐦</span>
                  <span>Twitter</span>
                </button>
                <button
                  onClick={() => handleShareCard('linkedin')}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-2 px-2 rounded-lg transition-all duration-200 hover:scale-105 flex items-center justify-center gap-1 text-xs"
                >
                  <span>💼</span>
                  <span>LinkedIn</span>
                </button>
                <button
                  onClick={() => handleShareCard('facebook')}
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-medium py-2 px-2 rounded-lg transition-all duration-200 hover:scale-105 flex items-center justify-center gap-1 text-xs"
                >
                  <span>📘</span>
                  <span>Facebook</span>
                </button>
              </div>
            </div>
          )}

          <div className="text-sm text-white/60 text-center">
            Share your code or link with friends to earn 50 XP for each successful referral!
          </div>
        </div>
      </div>


      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-6 w-full max-w-md mx-4 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4">Send Referral Invite</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Friend's Email
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="friend@example.com"
                  className="w-full bg-black/20 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:border-blue-400"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Personal Message (Optional)
                </label>
                <textarea
                  value={inviteMessage}
                  onChange={(e) => setInviteMessage(e.target.value)}
                  placeholder="Hey! Check out this amazing platform for trustless work..."
                  rows={3}
                  className="w-full bg-black/20 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:border-blue-400 resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowInviteModal(false)}
                className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSendInvite}
                disabled={!inviteEmail.trim() || isSendingInvite}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSendingInvite ? 'Sending...' : 'Send Invite'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
