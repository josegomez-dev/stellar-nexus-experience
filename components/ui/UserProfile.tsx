'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ isOpen, onClose }) => {
  const { user, signOut, getUserStats } = useAuth();
  const [activeTab, setActiveTab] = useState<'stats' | 'badges' | 'progress'>('stats');

  if (!isOpen || !user) return null;

  const stats = getUserStats();

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getLevelProgress = () => {
    const currentLevelXP = (stats.level - 1) * 500;
    const nextLevelXP = stats.level * 500;
    const progress = ((stats.experience - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
    return Math.min(progress, 100);
  };

  return (
    <div className='fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm'>
      {/* Animated background */}
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute top-1/4 left-1/4 w-32 h-32 bg-brand-400/20 rounded-full animate-ping'></div>
        <div
          className='absolute top-1/3 right-1/4 w-24 h-24 bg-accent-400/20 rounded-full animate-ping'
          style={{ animationDelay: '0.5s' }}
        ></div>
        <div
          className='absolute bottom-1/3 left-1/3 w-28 h-28 bg-brand-500/20 rounded-full animate-ping'
          style={{ animationDelay: '1s' }}
        ></div>
      </div>

      <div className='relative z-10 w-full max-w-2xl mx-4'>
        {/* Modal content */}
        <div className='bg-gradient-to-br from-neutral-900 via-brand-900 to-neutral-900 rounded-2xl border border-white/20 shadow-2xl overflow-hidden'>
          {/* Header */}
          <div className='relative p-6 border-b border-white/10'>
            <div className='absolute inset-0 bg-gradient-to-r from-brand-500/10 via-accent-500/15 to-brand-400/10'></div>

            <div className='relative z-10 flex items-center space-x-4'>
              {/* Avatar */}
              <div className='relative'>
                <Image
                  src='/images/logo/logoicon.png'
                  alt='User Avatar'
                  width={48}
                  height={48}
                  className='rounded-full border-2 border-brand-400'
                />
                <div className='absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-neutral-900'></div>
              </div>

              {/* User info */}
              <div className='flex-1'>
                <h2 className='text-xl font-bold text-white'>{user.username}</h2>
                <p className='text-white/70 text-sm'>
                  Level {stats.level} • {stats.experience} XP
                </p>
                <p className='text-brand-300 text-xs font-mono'>
                  {user.walletAddress.slice(0, 12)}...{user.walletAddress.slice(-8)}
                </p>
              </div>

              {/* Close button */}
              <button
                onClick={onClose}
                className='p-2 text-white/60 hover:text-white/80 hover:bg-white/10 rounded-lg transition-all duration-200'
              >
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
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

          {/* Tabs */}
          <div className='flex border-b border-white/10'>
            {[
              { id: 'stats', label: '📊 Stats', icon: '📊' },
              { id: 'badges', label: '🏆 Badges', icon: '🏆' },
              { id: 'progress', label: '📈 Progress', icon: '📈' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'text-brand-300 border-b-2 border-brand-400 bg-white/5'
                    : 'text-white/60 hover:text-white/80 hover:bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className='p-6'>
            {activeTab === 'stats' && (
              <div className='space-y-6'>
                {/* Level Progress */}
                <div className='bg-white/5 rounded-lg p-4 border border-white/10'>
                  <div className='flex items-center justify-between mb-2'>
                    <h3 className='text-white font-semibold'>Level Progress</h3>
                    <span className='text-brand-300 text-sm'>Level {stats.level}</span>
                  </div>
                  <div className='w-full bg-white/10 rounded-full h-3'>
                    <div
                      className='bg-gradient-to-r from-brand-500 to-accent-500 h-3 rounded-full transition-all duration-500'
                      style={{ width: `${getLevelProgress()}%` }}
                    ></div>
                  </div>
                  <p className='text-white/70 text-xs mt-2'>
                    {stats.experience} XP • Next level at {stats.level * 500} XP
                  </p>
                </div>

                {/* Stats Grid */}
                <div className='grid grid-cols-2 gap-4'>
                  <div className='bg-white/5 rounded-lg p-4 border border-white/10 text-center'>
                    <div className='text-2xl font-bold text-brand-300'>
                      {stats.totalDemosCompleted}
                    </div>
                    <div className='text-white/70 text-sm'>Demos Completed</div>
                  </div>
                  <div className='bg-white/5 rounded-lg p-4 border border-white/10 text-center'>
                    <div className='text-2xl font-bold text-accent-300'>
                      {formatTime(stats.totalTimeSpent)}
                    </div>
                    <div className='text-white/70 text-sm'>Time Spent</div>
                  </div>
                  <div className='bg-white/5 rounded-lg p-4 border border-white/10 text-center'>
                    <div className='text-2xl font-bold text-yellow-300'>{stats.badgesEarned}</div>
                    <div className='text-white/70 text-sm'>Badges Earned</div>
                  </div>
                  <div className='bg-white/5 rounded-lg p-4 border border-white/10 text-center'>
                    <div className='text-2xl font-bold text-green-300'>{stats.experience}</div>
                    <div className='text-white/70 text-sm'>Total XP</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'badges' && (
              <div className='space-y-4'>
                {user.badges.length === 0 ? (
                  <div className='text-center py-8'>
                    <div className='text-4xl mb-4'>🏆</div>
                    <h3 className='text-white font-semibold mb-2'>No badges yet!</h3>
                    <p className='text-white/70 text-sm'>
                      Complete demos and achieve milestones to earn your first badges.
                    </p>
                  </div>
                ) : (
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {user.badges.map(badge => (
                      <div
                        key={badge.id}
                        className={`p-4 rounded-lg border ${
                          badge.rarity === 'legendary'
                            ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-400/30'
                            : badge.rarity === 'epic'
                              ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-400/30'
                              : badge.rarity === 'rare'
                                ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-400/30'
                                : 'bg-white/5 border-white/10'
                        }`}
                      >
                        <div className='flex items-center space-x-3'>
                          <div className='text-2xl'>{badge.icon}</div>
                          <div className='flex-1'>
                            <h4 className='text-white font-semibold'>{badge.name}</h4>
                            <p className='text-white/70 text-sm'>{badge.description}</p>
                            <p className='text-white/60 text-xs mt-1'>
                              Earned: {new Date(badge.earnedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'progress' && (
              <div className='space-y-4'>
                {Object.keys(user.demoProgress).length === 0 ? (
                  <div className='text-center py-8'>
                    <div className='text-4xl mb-4'>📈</div>
                    <h3 className='text-white font-semibold mb-2'>No progress yet!</h3>
                    <p className='text-white/70 text-sm'>
                      Start completing demos to track your progress here.
                    </p>
                  </div>
                ) : (
                  <div className='space-y-3'>
                    {Object.entries(user.demoProgress).map(([demoId, progress]) => (
                      <div
                        key={demoId}
                        className='bg-white/5 rounded-lg p-4 border border-white/10'
                      >
                        <div className='flex items-center justify-between mb-2'>
                          <h4 className='text-white font-semibold capitalize'>
                            {demoId.replace('-', ' ')} Demo
                          </h4>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              progress.completed
                                ? 'bg-green-500/20 text-green-300'
                                : 'bg-yellow-500/20 text-yellow-300'
                            }`}
                          >
                            {progress.completed ? 'Completed' : 'In Progress'}
                          </span>
                        </div>
                        <div className='flex items-center space-x-4 text-sm text-white/70'>
                          <span>
                            Steps: {progress.stepsCompleted}/{progress.totalSteps}
                          </span>
                          <span>Time: {formatTime(progress.timeSpent)}</span>
                          {progress.score && <span>Score: {progress.score}%</span>}
                        </div>
                        {progress.completedAt && (
                          <p className='text-white/60 text-xs mt-2'>
                            Completed: {new Date(progress.completedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className='px-6 py-4 bg-white/5 border-t border-white/10'>
            <div className='flex items-center justify-between'>
              <div className='text-white/60 text-xs'>
                Member since {new Date(user.createdAt).toLocaleDateString()}
              </div>
              <button
                onClick={signOut}
                className='px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 rounded-lg transition-all duration-200 text-sm'
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
