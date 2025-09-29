'use client';

import { useState, useEffect } from 'react';
import { useFirebase } from '@/contexts/data/FirebaseContext';
import { useGlobalWallet } from '@/contexts/wallet/WalletContext';
// LeaderboardModal removed
import { BadgeShowcase } from './BadgeShowcase';

interface UserDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserDashboard = ({ isOpen, onClose }: UserDashboardProps) => {
  const { account, demos } = useFirebase();
  const { walletData, isConnected } = useGlobalWallet();
  // Leaderboard functionality removed
  const [showBadges, setShowBadges] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'demos' | 'achievements' | 'analytics'>(
    'overview'
  );

  // No need for separate user progress loading - data comes from Firebase context

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

  const getLevelProgress = (totalXp: number) => {
    const currentLevel = Math.floor(totalXp / 1000) + 1;
    const currentLevelXp = totalXp % 1000;
    const nextLevelXp = 1000 - currentLevelXp;
    return {
      currentLevel,
      currentLevelXp,
      nextLevelXp,
      progress: (currentLevelXp / 1000) * 100,
    };
  };

  if (!isOpen) return null;

  const levelProgress = account ? getLevelProgress(account.experience) : null;

  return (
    <div className='fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4'>
      <div className='bg-gradient-to-br from-neutral-900 via-brand-900 to-neutral-900 border border-brand-400/30 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col'>
        {/* Header */}
        <div className='bg-gradient-to-r from-brand-500/20 to-accent-500/20 border-b border-brand-400/30 p-6 flex-shrink-0'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='text-4xl'>📊</div>
              <div>
                <h2 className='text-2xl font-bold text-white'>User Dashboard</h2>
                <p className='text-brand-300 text-sm'>
                  {account?.displayName || 'User'} • Level {account?.level || 1}
                </p>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className='flex space-x-2'>
              {[
                { id: 'overview', label: 'Overview', icon: '📈' },
                { id: 'demos', label: 'Demos', icon: '🎯' },
                { id: 'achievements', label: 'Achievements', icon: '🏆' },
                { id: 'analytics', label: 'Analytics', icon: '📊' },
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
                  <span className='mr-2'>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            <button
              onClick={onClose}
              className='text-white/70 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10'
            >
              <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className='flex-1 overflow-y-auto p-6'>
          {activeTab === 'overview' && (
            <div className='space-y-6'>
              {/* User Stats Cards */}
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                <div className='bg-gradient-to-br from-brand-500/20 to-brand-600/20 border border-brand-400/30 rounded-xl p-6'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-brand-300 text-sm font-medium'>Total XP</p>
                      <p className='text-3xl font-bold text-white'>
                        {formatXp(account?.experience || 0)}
                      </p>
                    </div>
                    <div className='text-3xl'>⚡</div>
                  </div>
                </div>

                <div className='bg-gradient-to-br from-accent-500/20 to-accent-600/20 border border-accent-400/30 rounded-xl p-6'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-accent-300 text-sm font-medium'>Level</p>
                      <p className='text-3xl font-bold text-white'>{account?.level || 1}</p>
                    </div>
                    <div className='text-3xl'>🎯</div>
                  </div>
                </div>

                <div className='bg-gradient-to-br from-success-500/20 to-success-600/20 border border-success-400/30 rounded-xl p-6'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-success-300 text-sm font-medium'>Demos</p>
                      <p className='text-3xl font-bold text-white'>
                        {account?.demosCompleted?.length || 0}
                      </p>
                    </div>
                    <div className='text-3xl'>🎮</div>
                  </div>
                </div>

                <div className='bg-gradient-to-br from-warning-500/20 to-warning-600/20 border border-warning-400/30 rounded-xl p-6'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-warning-300 text-sm font-medium'>Badges</p>
                      <p className='text-3xl font-bold text-white'>
                        {account?.badgesEarned?.length || 0}
                      </p>
                    </div>
                    <div className='text-3xl'>🏆</div>
                  </div>
                </div>
              </div>

              {/* Level Progress */}
              {levelProgress && (
                <div className='bg-white/5 rounded-xl p-6 border border-white/20'>
                  <div className='flex items-center justify-between mb-4'>
                    <h3 className='text-lg font-semibold text-white'>Level Progress</h3>
                    <span className='text-brand-300 font-medium'>
                      Level {levelProgress.currentLevel} → {levelProgress.currentLevel + 1}
                    </span>
                  </div>
                  <div className='space-y-2'>
                    <div className='flex justify-between text-sm text-white/70'>
                      <span>{levelProgress.currentLevelXp}/1000 XP</span>
                      <span>{levelProgress.nextLevelXp} XP to next level</span>
                    </div>
                    <div className='w-full h-3 bg-white/10 rounded-full overflow-hidden'>
                      <div
                        className='h-full bg-gradient-to-r from-brand-500 to-accent-500 transition-all duration-500'
                        style={{ width: `${levelProgress.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                {/* Leaderboard functionality removed */}

                <button
                  onClick={() => setShowBadges(true)}
                  className='p-4 bg-gradient-to-r from-purple-500/20 to-purple-600/20 border border-purple-400/30 rounded-xl hover:from-purple-500/30 hover:to-purple-600/30 transition-all duration-300 text-left'
                >
                  <div className='flex items-center space-x-3'>
                    <div className='text-2xl'>🎖️</div>
                    <div>
                      <h4 className='font-semibold text-white'>Badges</h4>
                      <p className='text-purple-300 text-sm'>View achievements</p>
                    </div>
                  </div>
                </button>

                <div className='p-4 bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-400/30 rounded-xl'>
                  <div className='flex items-center space-x-3'>
                    <div className='text-2xl'>📈</div>
                    <div>
                      <h4 className='font-semibold text-white'>Progress</h4>
                      <p className='text-green-300 text-sm'>
                        {account ? ((account.demosCompleted.length / 3) * 100).toFixed(1) : 0}%
                        completion rate
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'demos' && (
            <div className='space-y-6'>
              <h3 className='text-xl font-semibold text-white mb-4'>Demo Progress</h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {demos.map(demo => (
                  <div key={demo.id} className='bg-white/5 rounded-xl p-6 border border-white/20'>
                    <div className='flex items-center justify-between mb-4'>
                      <h4 className='font-semibold text-white capitalize'>{demo.name}</h4>
                      <div className='flex items-center space-x-2'>
                        <span className='text-brand-300 text-sm'>Available Demo</span>
                        <button
                          onClick={() => {
                            /* Handle clap */
                          }}
                          className={`text-lg transition-all duration-300 ${'text-white/40 hover:text-yellow-400'}`}
                        >
                          👏
                        </button>
                      </div>
                    </div>
                    <div className='space-y-2'>
                      <div className='flex justify-between text-sm text-white/70'>
                        <span>Description</span>
                        <span>{demo.description}</span>
                      </div>
                      <div className='flex justify-between text-sm text-white/70'>
                        <span>Total Claps</span>
                        <span>0</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className='space-y-6'>
              <div className='flex items-center justify-between'>
                <h3 className='text-xl font-semibold text-white'>Recent Badges</h3>
                <button
                  onClick={() => setShowBadges(true)}
                  className='px-4 py-2 bg-brand-500/20 hover:bg-brand-500/30 border border-brand-400/30 rounded-lg text-brand-300 transition-colors'
                >
                  View All Badges
                </button>
              </div>

              {!account || account.badgesEarned.length === 0 ? (
                <div className='text-center py-12'>
                  <div className='text-6xl mb-4'>🏆</div>
                  <h4 className='text-xl font-semibold text-white mb-2'>No Badges Yet</h4>
                  <p className='text-white/70'>Complete demos to earn your first badges!</p>
                </div>
              ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                  {account?.badgesEarned.slice(0, 6).map(badgeId => (
                    <div
                      key={badgeId}
                      className='bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-400/30 rounded-xl p-4'
                    >
                      <div className='text-center'>
                        <div className='text-3xl mb-2'>🏆</div>
                        <h4 className='font-semibold text-white text-sm'>
                          {badgeId.replace('_', ' ')}
                        </h4>
                        <p className='text-yellow-300 text-xs mt-1'>
                          {new Date().toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className='space-y-6'>
              <h3 className='text-xl font-semibold text-white mb-4'>Analytics</h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='bg-white/5 rounded-xl p-6 border border-white/20'>
                  <h4 className='font-semibold text-white mb-4'>Time Spent</h4>
                  <div className='text-3xl font-bold text-brand-300 mb-2'>
                    {formatTime(0)} {/* TODO: Calculate total time spent from user data */}
                  </div>
                  <p className='text-white/70 text-sm'>Total learning time</p>
                </div>

                <div className='bg-white/5 rounded-xl p-6 border border-white/20'>
                  <h4 className='font-semibold text-white mb-4'>Current Streak</h4>
                  <div className='text-3xl font-bold text-success-300 mb-2'>
                    0 days {/* TODO: Calculate streak from user data */}
                  </div>
                  <p className='text-white/70 text-sm'>Consecutive activity</p>
                </div>

                <div className='bg-white/5 rounded-xl p-6 border border-white/20'>
                  <h4 className='font-semibold text-white mb-4'>Progress</h4>
                  <div className='text-3xl font-bold text-accent-300 mb-2'>
                    {account ? Math.round((account.demosCompleted.length / 3) * 100) : 0}%
                  </div>
                  <p className='text-white/70 text-sm'>Completion Rate</p>
                </div>

                <div className='bg-white/5 rounded-xl p-6 border border-white/20'>
                  <h4 className='font-semibold text-white mb-4'>Completion Rate</h4>
                  <div className='text-3xl font-bold text-warning-300 mb-2'>
                    {account ? ((account.demosCompleted.length / 3) * 100).toFixed(1) : 0}%
                  </div>
                  <p className='text-white/70 text-sm'>Demo success rate</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {/* Leaderboard modal removed */}

      {showBadges && <BadgeShowcase isOpen={showBadges} onClose={() => setShowBadges(false)} />}
    </div>
  );
};
