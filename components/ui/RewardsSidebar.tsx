'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAccount } from '@/contexts/AccountContext';
import { getAllBadges, getBadgeRarityConfig } from '@/lib/badge-config';
import { type Badge } from '@/lib/firebase-types';
import { Badge3D, Badge3DStyles } from '@/components/ui/badges/Badge3D';
import { Tooltip } from '@/components/ui/Tooltip';

interface RewardsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RewardsSidebar: React.FC<RewardsDropdownProps> = ({ isOpen, onClose }) => {
  const { account, pointsTransactions, getLevel, getExperienceProgress, getMainDemoProgress } =
    useAccount();
  const [activeTab, setActiveTab] = useState<
    'overview' | 'badges' | 'transactions'
  >('overview');
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

  // Helper functions for badge styling
  const getRarityColor = (rarity: string) => {
    const config = getBadgeRarityConfig(rarity);
    return config?.color || 'gray';
  };

  const getRarityTextColor = (rarity: string) => {
    const config = getBadgeRarityConfig(rarity);
    return config?.color || 'text-gray-300';
  };

  const AVAILABLE_BADGES = getAllBadges();

  // Only show when account exists - consistent with UserProfile
  if (!account || !isOpen) {
    return null;
  }

  // Ensure we have safe defaults for all data
  const safeAccount = {
    ...account,
    badges: account.badges || [],
    profile: account.profile || { level: 1, experience: 0, username: 'User' },
    settings: account.settings || { notifications: true, theme: 'dark' },
  };

  const safePointsTransactions = pointsTransactions || [];

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
      {/* Level and Experience */}
      <div className='bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg p-4 border border-purple-400/30'>
        <div className='flex items-center justify-between mb-3'>
          <h3 className='text-lg font-semibold text-white'>Level {level}</h3>
          <div className='text-sm text-gray-300'>
            {expProgress.current} / {expProgress.next} XP
          </div>
        </div>
        <div className='w-full bg-gray-700 rounded-full h-3'>
          <div
            className='bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-500'
            style={{ width: `${expPercentage}%` }}
          />
        </div>
      </div>

      {/* Points Summary */}
      <div className='grid grid-cols-2 gap-4'>
        <div className='bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg p-4 border border-green-400/30'>
          <div className='text-2xl font-bold text-green-400'>{account.profile.totalPoints}</div>
          <div className='text-sm text-gray-300'>Total Points</div>
        </div>
        <div className='bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-lg p-4 border border-yellow-400/30'>
          <div className='text-2xl font-bold text-yellow-400'>
            {mainDemoProgress.completed} / {mainDemoProgress.total}
          </div>
          <div className='text-sm text-gray-300'>Demos Completed</div>
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
            • <span className='text-purple-300'>Complete Demos 1, 2, 3 </span> →
            Nexus Master
          </div>
        </div>
      </div>

    </div>
  );

  const renderBadges = () => {
    try {
      // Check which badges are earned by the user (match by name since that's how they're stored)
      const earnedBadgeNames = safeAccount.badges?.map((badge: any) => badge.name) || [];
      const badgesWithStatus =
        AVAILABLE_BADGES?.map((badge: Badge) => ({
          ...badge,
          isEarned: earnedBadgeNames.includes(badge.name),
          earnedAt: safeAccount.badges?.find(b => b.name === badge.name)?.earnedAt,
        })) || [];

      const earnedCount = earnedBadgeNames.length;
      const totalCount = AVAILABLE_BADGES?.length || 0;
      const isAllMainBadgesEarned = earnedCount === 5; // All 5 main achievement badges

      return (
        <div className='space-y-4'>
          <div className='text-center mb-4'>
            <div className='text-2xl font-bold text-white'>
              {earnedCount} / {totalCount}
            </div>
            <div className='text-sm text-gray-400'>Main Achievement Badges</div>
            <div className='w-full bg-gray-700 rounded-full h-2 mt-2'>
              <div
                className='bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-500'
                style={{ width: `${(earnedCount / totalCount) * 100}%` }}
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
                  You've earned all 5 Main Achievement Badges and mastered the platform.
                </div>
              </div>
            </div>
          )}

          {/* Main Achievements Section */}
          <div className='space-y-3'>
            <div
              className='flex items-center space-x-2 mb-3 cursor-pointer hover:bg-gray-800/30 rounded-lg p-2 transition-colors'
              onClick={() => setIsMainAchievementsCollapsed(!isMainAchievementsCollapsed)}
            >
              <div className='w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full'></div>
              <h3 className='text-lg font-semibold text-white'>Main Achievements</h3>
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
                {badgesWithStatus.map(badge => (
                  <div key={badge.id} className='relative'>
                    <Tooltip
                      content={
                        <div className='text-center'>
                          <div className='text-lg font-bold text-white mb-1'>{badge.name}</div>
                          <div className='text-sm text-gray-300 mb-2'>{badge.description}</div>
                          <div className='text-xs text-cyan-300'>{badge.xpReward} pts</div>
                        </div>
                      }
                      position='top'
                    >
                      <div>
                        <Badge3D badge={badge} size='sm' compact={true} />
                        {/* Main Achievement Indicator */}
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
      console.error('❌ Error in renderBadges:', error);
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
    <div className='space-y-3'>
      <div className='text-center mb-4'>
        <div className='text-lg font-semibold text-white'>Points History</div>
        <div className='text-sm text-gray-400'>
          Recent {safePointsTransactions.length} transactions
        </div>
      </div>

      <div className='space-y-2 max-h-96 overflow-y-auto'>
        {safePointsTransactions.map(transaction => (
          <div
            key={transaction.id}
            className='bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-lg p-3 border border-gray-600/30'
          >
            <div className='flex items-center justify-between'>
              <div className='flex-1'>
                <div className='text-sm font-medium text-white'>{transaction.reason}</div>
                <div className='text-xs text-gray-400'>
                  {transaction.timestamp.toDate().toLocaleString()}
                  {transaction.demoId && ` • ${transaction.demoId}`}
                </div>
              </div>
              <div
                className={`text-sm font-semibold ${
                  transaction.type === 'earn' || transaction.type === 'bonus'
                    ? 'text-green-400'
                    : 'text-red-400'
                }`}
              >
                {transaction.type === 'earn' || transaction.type === 'bonus' ? '+' : '-'}
                {transaction.amount}
              </div>
            </div>
          </div>
        ))}

        {safePointsTransactions.length === 0 && (
          <div className='text-center py-8'>
            <div className='text-4xl mb-4'>📜</div>
            <div className='text-gray-400 mb-2'>No transactions yet</div>
            <div className='text-sm text-gray-500'>Start earning points by completing demos!</div>
          </div>
        )}
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
            <h2 className='text-xl font-bold text-white'>🎮 Rewards & Progress</h2>
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
          <div className='relative z-10 p-4 overflow-y-auto max-h-[60vh]'>
            {renderContent()}
          </div>
        </div>
      )}
      <Badge3DStyles />
    </>
  );
};
