'use client';

import React, { useState } from 'react';
import { useAccount } from '@/contexts/AccountContext';
import { AVAILABLE_BADGES, getRarityColor, getRarityTextColor, type BadgeConfig } from '@/lib/badge-config';
import { Badge3D, Badge3DStyles } from '@/components/ui/Badge3D';

interface RewardsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RewardsSidebar: React.FC<RewardsSidebarProps> = ({ isOpen, onClose }) => {
  const { account, pointsTransactions, getLevel, getExperienceProgress, getMainDemoProgress } = useAccount();
  const [activeTab, setActiveTab] = useState<'overview' | 'badges' | 'transactions' | 'leaderboard'>('overview');

  // Only show when account exists - consistent with UserProfile
  if (!account) {
    return null;
  }

  const level = getLevel();
  const expProgress = getExperienceProgress();
  const expPercentage = (expProgress.current / expProgress.next) * 100;
  const mainDemoProgress = getMainDemoProgress();

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'badges', label: 'Badges', icon: '🏆' },
    { id: 'transactions', label: 'History', icon: '📜' },
    { id: 'leaderboard', label: 'Ranking', icon: '🥇' },
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Level and Experience */}
      <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg p-4 border border-purple-400/30">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-white">Level {level}</h3>
          <div className="text-sm text-gray-300">
            {expProgress.current} / {expProgress.next} XP
          </div>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${expPercentage}%` }}
          />
        </div>
      </div>

      {/* Points Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg p-4 border border-green-400/30">
          <div className="text-2xl font-bold text-green-400">{account.profile.totalPoints}</div>
          <div className="text-sm text-gray-300">Total Points</div>
        </div>
        <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-lg p-4 border border-yellow-400/30">
          <div className="text-2xl font-bold text-yellow-400">{mainDemoProgress.completed} / {mainDemoProgress.total}</div>
          <div className="text-sm text-gray-300">Demos Completed</div>
        </div>
      </div>

      {/* Recent Badges */}
      <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-lg p-4 border border-indigo-400/30">
        <h3 className="text-lg font-semibold text-white mb-3">Recent Badges</h3>
        <div className="space-y-2">
          {account.badges.slice(-3).map((badge) => (
            <div key={badge.id} className="flex items-center space-x-3 p-2 bg-black/20 rounded-lg">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-sm">
                🏆
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-white">{badge.name}</div>
                <div className="text-xs text-gray-400">{badge.description}</div>
              </div>
              <div className="text-xs text-gray-300">{badge.pointsValue} pts</div>
            </div>
          ))}
          {account.badges.length === 0 && (
            <div className="text-center text-gray-400 py-4">
              Complete demos to earn badges!
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderBadges = () => {
    // Check which badges are earned by the user (match by name since that's how they're stored)
    const earnedBadgeNames = account.badges.map(badge => badge.name);
    const badgesWithStatus = AVAILABLE_BADGES.map(badge => ({
      ...badge,
      isEarned: earnedBadgeNames.includes(badge.name),
      earnedAt: account.badges.find(b => b.name === badge.name)?.earnedAt
    }));

    const earnedCount = earnedBadgeNames.length;
    const totalCount = AVAILABLE_BADGES.length;

    return (
      <div className="space-y-4">
        <div className="text-center mb-4">
          <div className="text-2xl font-bold text-white">{earnedCount} / {totalCount}</div>
          <div className="text-sm text-gray-400">Badges Collected</div>
          <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
            <div 
              className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(earnedCount / totalCount) * 100}%` }}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
          {badgesWithStatus.map((badge) => (
            <Badge3D
              key={badge.id}
              badge={badge}
              size="sm"
              compact={true}
            />
          ))}
        </div>
      </div>
    );
  };

  const renderTransactions = () => (
    <div className="space-y-3">
      <div className="text-center mb-4">
        <div className="text-lg font-semibold text-white">Points History</div>
        <div className="text-sm text-gray-400">Recent {pointsTransactions.length} transactions</div>
      </div>
      
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {pointsTransactions.map((transaction) => (
          <div key={transaction.id} className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-lg p-3 border border-gray-600/30">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-sm font-medium text-white">{transaction.reason}</div>
                <div className="text-xs text-gray-400">
                  {transaction.timestamp.toDate().toLocaleString()}
                  {transaction.demoId && ` • ${transaction.demoId}`}
                </div>
              </div>
              <div className={`text-sm font-semibold ${
                transaction.type === 'earn' || transaction.type === 'bonus' 
                  ? 'text-green-400' 
                  : 'text-red-400'
              }`}>
                {transaction.type === 'earn' || transaction.type === 'bonus' ? '+' : '-'}{transaction.amount}
              </div>
            </div>
          </div>
        ))}
        
        {pointsTransactions.length === 0 && (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">📜</div>
            <div className="text-gray-400 mb-2">No transactions yet</div>
            <div className="text-sm text-gray-500">Start earning points by completing demos!</div>
          </div>
        )}
      </div>
    </div>
  );

  const renderLeaderboard = () => (
    <div className="space-y-4">
      <div className="text-center mb-4 relative">
        <div className="text-lg font-semibold text-white">Global Leaderboard</div>
        <div className="text-sm text-gray-400">Top players by points</div>
        
        {/* Coming Soon Badge */}
        <div className="absolute -top-2 -right-2">
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-3 py-1 rounded-full font-bold text-xs shadow-lg animate-pulse">
            🚧 Coming Soon
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        {/* Enhanced placeholder with blur effect */}
        <div className="relative overflow-hidden rounded-lg">
          {/* Blur Overlay */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md rounded-lg z-10"></div>
          
          {/* Content with reduced opacity */}
          <div className="relative z-20 opacity-30">
            <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-lg p-4 border border-gray-600/30">
              <div className="space-y-3">
                {/* Mock leaderboard entries */}
                {[1, 2, 3, 4, 5].map((position) => (
                  <div key={position} className="flex items-center justify-between p-2 bg-black/20 rounded">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-xs font-bold">
                        {position}
                      </div>
                      <div className="text-sm text-white font-medium">Player {position}</div>
                    </div>
                    <div className="text-sm text-gray-300">{(1000 - position * 150).toLocaleString()} pts</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Center message */}
          <div className="absolute inset-0 flex items-center justify-center z-30">
            <div className="text-center">
              <div className="text-4xl mb-2">🏆</div>
              <div className="text-white font-semibold mb-1">Leaderboard Coming Soon!</div>
              <div className="text-sm text-gray-400">Compete with other players</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'badges':
        return renderBadges();
      case 'transactions':
        return renderTransactions();
      case 'leaderboard':
        return renderLeaderboard();
      default:
        return renderOverview();
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`absolute h-100 w-80 bg-gradient-to-b from-gray-900 to-gray-800 border-r border-gray-700 z-50 transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">🎮 Rewards</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-white bg-gray-700/50 border-b-2 border-blue-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <div className="flex flex-col items-center space-y-1">
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-4 h-full overflow-y-auto">
          {renderContent()}
        </div>
      </div>
      <Badge3DStyles />
    </>
  );
};

