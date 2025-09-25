'use client';

import { ReactNode, useEffect } from 'react';
import { useAccount } from '@/contexts/AccountContext';
import { useGlobalWallet } from '@/contexts/WalletContext';
import { getAllBadges } from '@/lib/badge-config';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface ProtectedMiniGamesAccessProps {
  children: ReactNode;
}

export const ProtectedMiniGamesAccess: React.FC<ProtectedMiniGamesAccessProps> = ({ children }) => {
  const { account, loading } = useAccount();
  const { isConnected } = useGlobalWallet();
  const router = useRouter();

  // Check if user has unlocked mini-games access (completed all 3 demos + all 5 main achievement badges)
  const hasUnlockedMiniGames = () => {
    if (!account) return false;

    // Check if all 3 main demos are completed
    const mainDemoIds = ['hello-milestone', 'dispute-resolution', 'micro-marketplace'];
    const allDemosCompleted = mainDemoIds.every(
      demoId => (account.demos as any)[demoId]?.completed === true
    );

    // Check if all 5 main achievement badges are earned
    const allBadges = getAllBadges();
    const mainAchievementBadges = allBadges.filter(badge => badge.category === 'main_achievement');
    const allBadgesEarned = mainAchievementBadges.every(badge =>
      account.badges.some(userBadge => userBadge.name === badge.name)
    );

    return allDemosCompleted && allBadgesEarned;
  };

  const miniGamesUnlocked = hasUnlockedMiniGames();

  // Redirect to main page if access is not unlocked
  useEffect(() => {
    if (!loading && (!isConnected || !miniGamesUnlocked)) {
      router.push('/');
    }
  }, [loading, isConnected, miniGamesUnlocked, router]);

  // Show loading state
  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-neutral-900 via-brand-900 to-neutral-900 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4'></div>
          <p className='text-white/70'>Checking access...</p>
        </div>
      </div>
    );
  }

  // Show access denied screen
  if (!isConnected || !miniGamesUnlocked) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-neutral-900 via-brand-900 to-neutral-900 flex items-center justify-center p-4'>
        <div className='max-w-2xl mx-auto text-center'>
          {/* Lock Icon */}
          <div className='mb-8'>
            <div className='text-8xl mb-4'>🔒</div>
            <h1 className='text-4xl font-bold text-white mb-4'>Access Restricted</h1>
            <p className='text-xl text-white/70 mb-8'>
              The Nexus Web3 Playground is locked until you complete the full Stellar Nexus
              Experience!
            </p>
          </div>

          {/* Requirements */}
          <div className='bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 mb-8'>
            <h2 className='text-2xl font-bold text-white mb-6'>🎯 Unlock Requirements</h2>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 text-left'>
              {/* Complete Demos */}
              <div>
                <h3 className='text-lg font-semibold text-blue-400 mb-4'>Complete All 3 Demos</h3>
                <div className='space-y-3'>
                  <div className='flex items-center space-x-3'>
                    <span className='text-2xl'>🎮</span>
                    <span className='text-white'>1. Baby Steps to Riches</span>
                  </div>
                  <div className='flex items-center space-x-3'>
                    <span className='text-2xl'>🎮</span>
                    <span className='text-white'>2. Drama Queen Escrow</span>
                  </div>
                  <div className='flex items-center space-x-3'>
                    <span className='text-2xl'>🎮</span>
                    <span className='text-white'>3. Gig Economy Madness</span>
                  </div>
                </div>
              </div>

              {/* Earn Badges */}
              <div>
                <h3 className='text-lg font-semibold text-purple-400 mb-4'>
                  Earn All 5 Main Achievement Badges
                </h3>
                <div className='space-y-3'>
                  <div className='flex items-center space-x-3'>
                    <span className='text-2xl'>🌟</span>
                    <span className='text-white'>Welcome Explorer</span>
                  </div>
                  <div className='flex items-center space-x-3'>
                    <span className='text-2xl'>🔒</span>
                    <span className='text-white'>Escrow Expert</span>
                  </div>
                  <div className='flex items-center space-x-3'>
                    <span className='text-2xl'>⚖️</span>
                    <span className='text-white'>Trust Guardian</span>
                  </div>
                  <div className='flex items-center space-x-3'>
                    <span className='text-2xl'>🏆</span>
                    <span className='text-white'>Stellar Champion</span>
                  </div>
                  <div className='flex items-center space-x-3'>
                    <span className='text-2xl'>👑</span>
                    <span className='text-white'>Nexus Master</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Current Progress */}
          {account && (
            <div className='bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 mb-8'>
              <h3 className='text-lg font-semibold text-white mb-4'>📊 Your Current Progress</h3>

              {/* Demo Progress */}
              <div className='mb-4'>
                <div className='flex justify-between items-center mb-2'>
                  <span className='text-white/80'>Demos Completed:</span>
                  <span className='text-white font-semibold'>
                    {(() => {
                      const mainDemoIds = [
                        'hello-milestone',
                        'dispute-resolution',
                        'micro-marketplace',
                      ];
                       const completedCount = mainDemoIds.filter(
                         demoId => (account.demos as any)[demoId]?.completed === true
                       ).length;
                      return `${completedCount}/3`;
                    })()}
                  </span>
                </div>
                <div className='w-full bg-gray-700 rounded-full h-2'>
                  <div
                    className='bg-blue-500 h-2 rounded-full transition-all duration-300'
                    style={{
                      width: `${(() => {
                        const mainDemoIds = [
                          'hello-milestone',
                          'dispute-resolution',
                          'micro-marketplace',
                        ];
                       const completedCount = mainDemoIds.filter(
                         demoId => (account.demos as any)[demoId]?.completed === true
                       ).length;
                        return (completedCount / 3) * 100;
                      })()}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Badge Progress */}
              <div>
                <div className='flex justify-between items-center mb-2'>
                  <span className='text-white/80'>Main Achievement Badges:</span>
                  <span className='text-white font-semibold'>{account.badges.length}/5</span>
                </div>
                <div className='w-full bg-gray-700 rounded-full h-2'>
                  <div
                    className='bg-purple-500 h-2 rounded-full transition-all duration-300'
                    style={{
                      width: `${(account.badges.length / 5) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <button
              onClick={() => router.push('/')}
              className='px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border-2 border-white/20 hover:border-white/40'
            >
              🎮 Start Your Journey
            </button>

            <button
              onClick={() => {
                // Dispatch custom event to open rewards sidebar
                window.dispatchEvent(new CustomEvent('toggleRewardsSidebar'));
                router.push('/');
              }}
              className='px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border-2 border-white/20 hover:border-white/40'
            >
              🏆 View Progress
            </button>
          </div>

          {/* Footer */}
          <div className='mt-8 text-center'>
            <p className='text-white/50 text-sm'>
              Complete the full Stellar Nexus Experience to unlock a world of Web3 gaming
              possibilities! 🚀
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Render the protected content
  return <>{children}</>;
};
