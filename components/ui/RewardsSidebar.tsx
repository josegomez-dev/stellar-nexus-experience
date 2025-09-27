'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useFirebase } from '@/contexts/data/FirebaseContext';
import { getAllBadges } from '@/lib/firebase/firebase-types';
import { Badge3D, Badge3DStyles } from '@/components/ui/badges/Badge3D';
import { Tooltip } from '@/components/ui/Tooltip';
import { getBadgeColors, BADGE_COLORS } from '@/utils/constants/badges/assets';
import { TransactionList } from './transactions/TransactionList';
import { useTransactionHistory } from '@/contexts/data/TransactionContext';

interface RewardsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RewardsSidebar: React.FC<RewardsDropdownProps> = ({ isOpen, onClose }) => {
  const { account, badges } = useFirebase();
  const { transactions, isLoading, refreshTransactions } = useTransactionHistory();
  const [activeTab, setActiveTab] = useState<'overview' | 'badges' | 'transactions'>('overview');
  const [isMainAchievementsCollapsed, setIsMainAchievementsCollapsed] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Helper functions for badge styling using centralized assets
  const getRarityColor = (rarity: string) => {
    const colors = BADGE_COLORS[rarity as keyof typeof BADGE_COLORS] || BADGE_COLORS.common;
    return colors.primary;
  };

  const getRarityTextColor = (rarity: string) => {
    const colors = BADGE_COLORS[rarity as keyof typeof BADGE_COLORS] || BADGE_COLORS.common;
    return colors.text;
  };

  const AVAILABLE_BADGES = badges.length > 0 ? badges : getAllBadges();

  // Only show when account exists - consistent with UserProfile
  if (!account || !isOpen) {
    return null;
  }

  // Ensure we have safe defaults for all data
  const safeAccount = {
    ...account,
    level: account?.level || 1,
    experience: account?.experience || 0,
    totalPoints: account?.totalPoints || 0,
    badgesEarned: (() => {
      if (Array.isArray(account?.badgesEarned)) {
        return account.badgesEarned;
      } else if (account?.badgesEarned && typeof account.badgesEarned === 'object') {
        // Convert object to array (Firebase sometimes stores arrays as objects)
        return Object.values(account.badgesEarned);
      }
      return [];
    })(),
    demosCompleted: (() => {
      if (Array.isArray(account?.demosCompleted)) {
        return account.demosCompleted;
      } else if (account?.demosCompleted && typeof account.demosCompleted === 'object') {
        // Convert object to array
        return Object.values(account.demosCompleted);
      }
      return [];
    })(),
  };

  // Initialize missing variables and functions
  const safePointsTransactions: any[] = []; // TODO: Implement points transactions

  // Helper functions for level and progress calculations
  const getLevel = () => {
    return safeAccount.level || 1;
  };

  const getExperienceProgress = () => {
    const currentLevel = getLevel();
    const currentExp = safeAccount.experience || 0;
    const expForCurrentLevel = (currentLevel - 1) * 1000;
    const expForNextLevel = currentLevel * 1000;
    const expInCurrentLevel = currentExp - expForCurrentLevel;

    return {
      current: expInCurrentLevel,
      next: expForNextLevel - expForCurrentLevel,
    };
  };

  const getMainDemoProgress = () => {
    const completedDemos = safeAccount.demosCompleted;
    let completedArray: string[] = [];
    
    if (Array.isArray(completedDemos)) {
      completedArray = completedDemos as string[];
    } else if (completedDemos && typeof completedDemos === 'object') {
      completedArray = Object.values(completedDemos) as string[];
    }
    
    // Filter out nexus-master from the count since it's not a real demo
    const mainDemosCompleted = completedArray.filter(demoId => 
      ['hello-milestone', 'dispute-resolution', 'micro-marketplace'].includes(demoId)
    );
    
    return {
      completed: mainDemosCompleted.length,
      total: 3, // Total number of main demos
    };
  };

  const level = getLevel();
  const expProgress = getExperienceProgress();
  const expPercentage = (expProgress.current / expProgress.next) * 100;
  const mainDemoProgress = getMainDemoProgress();

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'badges', label: 'Badges', icon: '🏆' },
    { id: 'transactions', label: 'History', icon: '📜' },
  ];

  const renderOverview = () => (
    <div className='space-y-6'>
      {/* Unified Character & Level Progress */}
      <div className='bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-blue-500/20 rounded-xl p-6 border border-indigo-400/30 relative overflow-hidden'>
        {/* Background Effects */}
        <div className='absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5'></div>
        <div className='absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/10 to-transparent rounded-full blur-2xl'></div>
        <div className='absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-400/10 to-transparent rounded-full blur-xl'></div>
        
        <div className='relative z-10 flex items-center gap-6'>
          {/* Character Avatar - Bigger and Enhanced */}
          <div className='flex-shrink-0'>
            <div className='relative'>
              {level === 1 ? (
                <video
                  autoPlay
                  muted
                  playsInline
                  className='w-32 h-32 object-cover drop-shadow-2xl rounded-full border-2 border-purple-400/30'
                  style={{
                    animation: '4s ease-in-out infinite alternate'
                  }}
                  onEnded={(e) => {
                    const video = e.target as HTMLVideoElement;
                    video.currentTime = video.duration;
                    const reverseInterval = setInterval(() => {
                      if (video.currentTime <= 0) {
                        clearInterval(reverseInterval);
                        video.currentTime = 0;
                        video.play();
                      } else {
                        video.currentTime -= 0.1;
                      }
                    }, 100);
                  }}
                >
                  <source src='/videos/phases/baby.mp4' type='video/mp4' />
                  <img
                    src='/images/character/baby.png'
                    alt='Level 1 Character'
                    className='w-32 h-32 object-cover drop-shadow-2xl rounded-full border-2 border-purple-400/30'
                  />
                </video>
              ) : (
                <img
                  src={
                    level === 2 
                      ? '/images/character/teen.png'
                      : '/images/character/character.png'
                  }
                  alt={`Level ${level} Character`}
                  className='w-32 h-32 object-contain drop-shadow-2xl rounded-full border-2 border-purple-400/30'
                />
              )}
              
              {/* Level Badge */}
              <div className='absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-sm font-bold px-3 py-1 rounded-full shadow-lg border-2 border-white/20'>
                Lv.{level}
              </div>
              
              {/* Glow Effect */}
              <div className='absolute inset-0 bg-gradient-to-r from-purple-400/20 to-blue-400/20 rounded-full blur-lg scale-110'></div>
            </div>
          </div>

          {/* Level Progress Info */}
          <div className='flex-1 min-w-0'>
            <div className='mb-4'>
              <h3 className='text-2xl font-bold text-white mb-1'>Level {level}</h3>
              <p className='text-sm text-gray-300'>
                {expProgress.current} / {expProgress.next} XP
              </p>
            </div>
            
            {/* XP to Next Level */}
            <p className='text-xs text-gray-400'>
              <span className='text-brand-300 font-bold'>{expProgress.next - expProgress.current} XP</span> to next level!
            </p>
          </div>
        </div>
        
        {/* Full Width XP Progress Bar at Bottom */}
        <div className='relative z-10 mt-6'>
          <div className='w-full bg-gray-700/50 rounded-full h-6 border border-gray-600/30 overflow-hidden'>
            <div
              className='bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 h-6 rounded-full transition-all duration-700 ease-out relative'
              style={{ width: `${expPercentage}%` }}
            >
              {/* Animated shine effect */}
              <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse'></div>
            </div>
          </div>
        </div>
      </div>

      {/* Points Summary */}
      <div className='grid grid-cols-3 gap-3'>
        <div className='bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg p-3 border border-green-400/30'>
          <div className='text-xl font-bold text-green-400'>{account.totalPoints || 0}</div>
          <div className='text-xs text-gray-300'>Total Points</div>
        </div>
        <div className='bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-lg p-3 border border-yellow-400/30'>
          <div className='text-xl font-bold text-yellow-400'>
            {mainDemoProgress?.completed ?? 0} / {mainDemoProgress?.total ?? 3}
          </div>
          <div className='text-xs text-gray-300'>Demos Completed</div>
        </div>
        <div className='bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg p-3 border border-purple-400/30'>
          <div className='text-xl font-bold text-purple-400'>
            {safeAccount.badgesEarned?.length || 0} / 5
          </div>
          <div className='text-xs text-gray-300'>Badges Earned</div>
        </div>
      </div>

      {/* Achievement Guide */}
      <div className='bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg p-3 border border-blue-400/20 mt-4'>
        <h4 className='text-sm font-semibold text-blue-300 mb-2'>🎯 Achievement Guide</h4>
        <div className='text-xs text-gray-300 space-y-1'>
          <div>
            • <span>Account Creation</span> → Welcome Explorer
          </div>
          <div>
            • <span className='text-blue-300'>Complete Demo 1</span> → Escrow Expert
          </div>
          <div>
            • <span className='text-blue-300'>Complete Demo 2</span> → Trust Guardian
          </div>
          <div>
            • <span className='text-blue-300'>Complete Demo 3</span> → Stellar Champion
          </div>
          <div>
            • <span className='text-purple-300'>Complete Demos 1, 2, 3 </span> → Nexus Master
          </div>
        </div>
      </div>
    </div>
  );

  const renderBadges = () => {
    try {
      // Check which badges are earned by the user (using badgesEarned array)
      const earnedBadgeIds: string[] = Array.isArray(safeAccount.badgesEarned)
        ? safeAccount.badgesEarned as string[]
        : [];
      
      const badgesWithStatus =
        AVAILABLE_BADGES?.map(badge => ({
          ...badge,
          createdAt: new Date(), // Add createdAt to make it a complete Badge
          isEarned: earnedBadgeIds.includes(badge.id),
          earnedAt: earnedBadgeIds.includes(badge.id) ? new Date() : null,
        })) || [];

      // Filter to only count the 3 main demo badges (exclude welcome_explorer and nexus_master)
      const mainDemoBadges = AVAILABLE_BADGES?.filter(badge => 
        ['escrow_expert', 'trust_guardian', 'stellar_champion'].includes(badge.id)
      ) || [];
      
      const earnedMainBadges = earnedBadgeIds.filter(badgeId => 
        ['escrow_expert', 'trust_guardian', 'stellar_champion'].includes(badgeId)
      );
      
      const earnedCount = earnedMainBadges.length;
      const totalCount = mainDemoBadges.length; // Should be 3
      const isAllMainBadgesEarned = earnedCount === 3; // All 3 main demo badges

      return (
        <div className='space-y-4'>
          <div className='text-center mb-4'>
            <div className='text-2xl font-bold text-white'>
              {earnedBadgeIds.length} / 5
            </div>
            <div className='text-sm text-gray-400'>Top Badges</div>
            <div className='w-full bg-gray-700 rounded-full h-2 mt-2'>
              <div
                className='bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-500'
                style={{ width: `${(earnedBadgeIds.length / 5) * 100}%` }}
              />
            </div>
          </div>

          {/* Completion Celebration */}
          {isAllMainBadgesEarned && (
            <div className='bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-4 border border-purple-400/30 mb-4'>
              <div className='text-center'>
                <div className='text-4xl mb-2'>🎉</div>
                <div className='text-lg font-bold text-purple-300 mb-1'>Congratulations!</div>
                <div className='text-sm text-purple-200'>
                  You've completed the full Stellar Nexus Experience flow!
                </div>
                <div className='text-xs text-purple-300/80 mt-2'>
                  You've completed all 3 main demos and mastered the platform.
                </div>
              </div>
            </div>
          )}

          {/* Nexus Badges Section */}
          <div className='space-y-3'>
            <div className='flex items-center space-x-2 mb-3'>
              <div className='w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full'></div>
              <h3 className='text-lg font-semibold text-white'>Nexus Badges</h3>
              <div className='bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-2 py-1 rounded-full text-xs text-purple-300 border border-purple-400/30'>
                {earnedBadgeIds.filter(badgeId => 
                  ['welcome_explorer', 'nexus_master'].includes(badgeId)
                ).length} / 2
              </div>
            </div>

            <div className='space-y-2'>
              {badgesWithStatus.filter(badge => 
                ['welcome_explorer', 'nexus_master'].includes(badge.id)
              ).map(badge => (
                <div key={badge.id} className='relative'>
                  <Tooltip
                    content={
                      <div className='text-center'>
                        <div className='text-lg font-bold text-white mb-1'>{badge.name}</div>
                        <div className='text-sm text-gray-300 mb-2'>{badge.description}</div>
                        <div className='text-xs text-cyan-300'>{badge.earningPoints} pts</div>
                      </div>
                    }
                    position='top'
                  >
                    <div>
                      <Badge3D badge={badge} size='sm' compact={true} />
                      {/* Nexus Badge Indicator */}
                      <div className='absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full border border-white/20'></div>
                    </div>
                  </Tooltip>
                </div>
              ))}
            </div>
          </div>

          {/* Demo Badges Section */}
          <div className='space-y-3'>
            <div
              className='flex items-center space-x-2 mb-3 cursor-pointer hover:bg-gray-800/30 rounded-lg p-2 transition-colors'
              onClick={() => setIsMainAchievementsCollapsed(!isMainAchievementsCollapsed)}
            >
              <div className='w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full'></div>
              <h3 className='text-lg font-semibold text-white'>Demo Badges</h3>
              <div className='bg-gradient-to-r from-blue-500/20 to-purple-500/20 px-2 py-1 rounded-full text-xs text-blue-300 border border-blue-400/30'>
                {earnedCount} / {totalCount}
              </div>
              <div className='ml-auto'>
                {isMainAchievementsCollapsed ? (
                  <span className='text-gray-400 text-lg'>▶</span>
                ) : (
                  <span className='text-gray-400 text-lg'>▼</span>
                )}
              </div>
            </div>

            {!isMainAchievementsCollapsed && (
              <div className='space-y-2'>
                {badgesWithStatus.filter(badge => 
                  ['escrow_expert', 'trust_guardian', 'stellar_champion'].includes(badge.id)
                ).map(badge => (
                  <div key={badge.id} className='relative'>
                    <Tooltip
                      content={
                        <div className='text-center'>
                          <div className='text-lg font-bold text-white mb-1'>{badge.name}</div>
                          <div className='text-sm text-gray-300 mb-2'>{badge.description}</div>
                          <div className='text-xs text-cyan-300'>{badge.earningPoints} pts</div>
                        </div>
                      }
                      position='top'
                    >
                      <div>
                        <Badge3D badge={badge} size='sm' compact={true} />
                        {/* Demo Badge Indicator */}
                        <div className='absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full border border-white/20'></div>
                      </div>
                    </Tooltip>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    } catch (error) {
      return (
        <div className='text-center py-8 text-red-400'>
          <div className='text-4xl mb-2'>⚠️</div>
          <div className='text-sm'>Error loading badges</div>
          <div className='text-xs mt-2 text-red-300'>
            {error instanceof Error ? error.message : 'Unknown error'}
          </div>
        </div>
      );
    }
  };

  const renderTransactions = () => (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div>
          <div className='text-lg font-semibold text-white'>Transaction History</div>
          <div className='text-sm text-gray-400'>
            {transactions.length} total transactions
          </div>
        </div>
        <button
          onClick={refreshTransactions}
          disabled={isLoading}
          className='px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-sm hover:bg-blue-500/30 transition-colors disabled:opacity-50'
        >
          {isLoading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      <div className='max-h-96 overflow-y-auto'>
        <TransactionList
          transactions={transactions}
          isLoading={isLoading}
          showFilters={true}
          emptyMessage="No transactions found. Complete some demos to see your transaction history!"
        />
      </div>
    </div>
  );

  // Leaderboard functionality removed

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'badges':
        return renderBadges();
      case 'transactions':
        return renderTransactions();
      // Leaderboard functionality removed
      default:
        return renderOverview();
    }
  };

  return (
    <>
      {/* Dropdown Menu */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className='absolute right-0 mt-2 w-80 bg-black/80 backdrop-blur-2xl border border-white/30 rounded-2xl shadow-2xl z-50 overflow-hidden max-h-[80vh]'
        >
          {/* Enhanced background blur overlay */}
          <div className='absolute inset-0 bg-gradient-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-3xl'></div>
          <div className='absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/20'></div>

          {/* Header */}
          <div className='relative z-10 flex items-center justify-between p-4 border-b border-white/10'>
            <h2 className='text-xl font-bold text-white'>Nexus Account</h2>
            <button onClick={onClose} className='text-gray-400 hover:text-white transition-colors'>
              ✕
            </button>
          </div>

          {/* Tabs */}
          <div className='relative z-10 flex border-b border-white/10'>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 px-3 py-2 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-white bg-white/10 border-b-2 border-blue-500'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className='flex flex-col items-center space-y-1'>
                  <span className='text-lg'>{tab.icon}</span>
                  <span>{tab.label}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Content */}
          <div className='relative z-10 p-4 overflow-y-auto max-h-[60vh]'>{renderContent()}</div>
        </div>
      )}
      <Badge3DStyles />
    </>
  );
};
