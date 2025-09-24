'use client';

import { useState, useEffect } from 'react';
import { useFirebase } from '@/contexts/FirebaseContext';
import { useGlobalWallet } from '@/contexts/WalletContext';
import { LeaderboardEntry } from '@/lib/firebase-types';
import { userTrackingService } from '@/lib/user-tracking-service';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LeaderboardModal = ({ isOpen, onClose }: LeaderboardModalProps) => {
  const { leaderboard, userProfile, userRank } = useFirebase();
  const { walletData } = useGlobalWallet();
  const [activeTab, setActiveTab] = useState<'all' | 'weekly' | 'monthly'>('all');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      // Refresh leaderboard data when modal opens
      setTimeout(() => setIsLoading(false), 1000);
    }
  }, [isOpen]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return `#${rank}`;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/30';
      case 2:
        return 'text-gray-300 bg-gray-300/20 border-gray-300/30';
      case 3:
        return 'text-orange-400 bg-orange-400/20 border-orange-400/30';
      default:
        return 'text-white/70 bg-white/5 border-white/20';
    }
  };

  const formatXp = (xp: number) => {
    if (xp >= 1000) {
      return `${(xp / 1000).toFixed(1)}k`;
    }
    return xp.toString();
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-neutral-900 via-brand-900 to-neutral-900 border border-brand-400/30 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-500/20 to-accent-500/20 border-b border-brand-400/30 p-6 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">🏆</div>
              <div>
                <h2 className="text-2xl font-bold text-white">Leaderboard</h2>
                <p className="text-brand-300 text-sm">Top performers and community champions</p>
              </div>
            </div>
            
            {/* Tab Navigation */}
            <div className="flex space-x-2">
              {[
                { id: 'all', label: 'All Time', icon: '🌟' },
                { id: 'weekly', label: 'This Week', icon: '📅' },
                { id: 'monthly', label: 'This Month', icon: '📆' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-brand-500/30 border-2 border-brand-400/50 text-brand-300'
                      : 'bg-white/5 border border-white/20 text-white/70 hover:bg-white/10'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            <button
              onClick={onClose}
              className="text-white/70 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Current User Stats */}
          {userProfile && walletData && (
            <div className="mb-6 p-4 bg-gradient-to-r from-brand-500/10 to-accent-500/10 border border-brand-400/30 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-brand-500 to-accent-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {userProfile.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{userProfile.username}</h3>
                    <p className="text-brand-300 text-sm">
                      Level {userProfile.stats.level} • {formatXp(userProfile.stats.totalXp)} XP
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-brand-300">
                    {userRank > 0 ? `#${userRank}` : 'Unranked'}
                  </div>
                  <p className="text-white/70 text-sm">Your Rank</p>
                </div>
              </div>
              
              {/* User Stats Grid */}
              <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t border-white/10">
                <div className="text-center">
                  <div className="text-lg font-semibold text-white">{userProfile.stats.demosCompleted}</div>
                  <p className="text-xs text-white/60">Demos</p>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-white">{userProfile.stats.badgesEarned}</div>
                  <p className="text-xs text-white/60">Badges</p>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-white">{formatTime(userProfile.stats.totalTimeSpent)}</div>
                  <p className="text-xs text-white/60">Time</p>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-white">{userProfile.stats.streak}</div>
                  <p className="text-xs text-white/60">Streak</p>
                </div>
              </div>
            </div>
          )}

          {/* Leaderboard */}
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Top Performers</h3>
              <div className="text-sm text-white/60">
                {leaderboard.length} participants
              </div>
            </div>

            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/20 animate-pulse">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-white/20 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-white/20 rounded w-1/3 mb-2"></div>
                        <div className="h-3 bg-white/10 rounded w-1/2"></div>
                      </div>
                      <div className="h-6 bg-white/20 rounded w-16"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : leaderboard.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🏆</div>
                <h3 className="text-xl font-semibold text-white mb-2">No Data Yet</h3>
                <p className="text-white/70">
                  Complete demos to see the leaderboard in action!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {leaderboard.map((entry, index) => (
                  <div
                    key={entry.userId}
                    className={`p-4 rounded-xl border transition-all duration-300 hover:scale-[1.02] ${
                      entry.userId === walletData?.publicKey
                        ? 'bg-gradient-to-r from-brand-500/20 to-accent-500/20 border-brand-400/50 shadow-lg shadow-brand-500/20'
                        : getRankColor(entry.rank)
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {/* Rank */}
                        <div className="flex-shrink-0 w-10 text-center">
                          <span className="text-lg font-bold">
                            {getRankIcon(entry.rank)}
                          </span>
                        </div>

                        {/* User Info */}
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-brand-500 to-accent-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold">
                              {entry.username.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-white">{entry.username}</h4>
                            <p className="text-xs text-white/60">
                              Level {entry.level} • {entry.demosCompleted} demos
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center space-x-6 text-right">
                        <div>
                          <div className="text-lg font-bold text-brand-300">
                            {formatXp(entry.totalXp)}
                          </div>
                          <p className="text-xs text-white/60">XP</p>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-accent-300">
                            {entry.badgesEarned}
                          </div>
                          <p className="text-xs text-white/60">Badges</p>
                        </div>
                        <div className="text-xs text-white/50">
                          {new Date(entry.lastUpdated).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-white/60 mb-1">
                        <span>Progress to Level {entry.level + 1}</span>
                        <span>{formatXp(entry.totalXp % 100)}/100 XP</span>
                      </div>
                      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-brand-500 to-accent-500 transition-all duration-300"
                          style={{ width: `${(entry.totalXp % 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Stats */}
          <div className="mt-8 p-4 bg-white/5 rounded-xl border border-white/20">
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-brand-300">
                  {leaderboard.reduce((sum, entry) => sum + entry.totalXp, 0)}
                </div>
                <p className="text-sm text-white/60">Total XP Earned</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-accent-300">
                  {leaderboard.reduce((sum, entry) => sum + entry.demosCompleted, 0)}
                </div>
                <p className="text-sm text-white/60">Demos Completed</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-success-300">
                  {leaderboard.reduce((sum, entry) => sum + entry.badgesEarned, 0)}
                </div>
                <p className="text-sm text-white/60">Badges Earned</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
