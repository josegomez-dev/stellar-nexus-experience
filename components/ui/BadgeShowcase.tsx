'use client';

import { useState, useEffect } from 'react';
import { useFirebase } from '@/contexts/FirebaseContext';
import { useGlobalWallet } from '@/contexts/WalletContext';
import { UserBadge, Badge, getAllBadges } from '@/lib/firebase-types';
import { BadgeEmblem } from '@/components/ui/badges/BadgeEmblem';

interface BadgeShowcaseProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BadgeShowcase = ({ isOpen, onClose }: BadgeShowcaseProps) => {
  const { userBadges, badges } = useFirebase();
  const { walletData } = useGlobalWallet();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRarity, setSelectedRarity] = useState<string>('all');
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  const earnedBadgeIds = userBadges.map(ub => ub.badgeId);
  const allBadges = badges.length > 0 ? badges : getAllBadges();

  // Filter badges based on category and rarity
  const filteredBadges = allBadges.filter(badge => {
    const categoryMatch = selectedCategory === 'all' || badge.category === selectedCategory;
    const rarityMatch = selectedRarity === 'all' || badge.rarity === selectedRarity;
    return categoryMatch && rarityMatch;
  });

  const getBadgeProgress = (badgeId: string): number => {
    const userBadge = userBadges.find(ub => ub.badgeId === badgeId);
    return userBadge ? 100 : 0; // In new system, badges are either earned (100%) or not earned (0%)
  };

  const isBadgeEarned = (badgeId: string): boolean => {
    return earnedBadgeIds.includes(badgeId);
  };

  const getCompletionPercentage = (): number => {
    return Math.round((earnedBadgeIds.length / allBadges.length) * 100);
  };

  const getRarityStyle = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'text-gray-400 bg-gray-100 border-gray-300';
      case 'rare':
        return 'text-blue-500 bg-blue-100 border-blue-300';
      case 'epic':
        return 'text-purple-500 bg-purple-100 border-purple-300';
      case 'legendary':
        return 'text-orange-500 bg-orange-100 border-orange-300';
      default:
        return 'text-gray-400 bg-gray-100 border-gray-300';
    }
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4'>
      <div className='bg-gradient-to-br from-neutral-900 via-brand-900 to-neutral-900 border border-brand-400/30 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col'>
        {/* Header */}
        <div className='bg-gradient-to-r from-brand-500/20 to-accent-500/20 border-b border-brand-400/30 p-6 flex-shrink-0'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='text-4xl'>🏆</div>
              <div>
                <h2 className='text-2xl font-bold text-white'>Badge Collection</h2>
                <p className='text-brand-300 text-sm'>
                  {earnedBadgeIds.length} of {allBadges.length} badges earned (
                  {getCompletionPercentage()}%)
                </p>
              </div>
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

          {/* Progress Bar */}
          <div className='mt-4'>
            <div className='flex justify-between text-sm text-white/70 mb-2'>
              <span>Collection Progress</span>
              <span>
                {earnedBadgeIds.length}/{allBadges.length}
              </span>
            </div>
            <div className='w-full h-3 bg-white/10 rounded-full overflow-hidden'>
              <div
                className='h-full bg-gradient-to-r from-brand-500 to-accent-500 transition-all duration-500'
                style={{ width: `${getCompletionPercentage()}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className='p-4 border-b border-white/10 bg-white/5'>
          <div className='flex flex-wrap gap-4'>
            {/* Category Filter */}
            <div className='flex items-center space-x-2'>
              <span className='text-white/70 text-sm'>Category:</span>
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className='px-3 py-1 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-brand-400'
              >
                <option value='all'>All Categories</option>
                <option value='achievement'>🏆 Achievement</option>
                <option value='demo'>🎯 Demo</option>
                <option value='special'>⭐ Special</option>
              </select>
            </div>

            {/* Rarity Filter */}
            <div className='flex items-center space-x-2'>
              <span className='text-white/70 text-sm'>Rarity:</span>
              <select
                value={selectedRarity}
                onChange={e => setSelectedRarity(e.target.value)}
                className='px-3 py-1 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-brand-400'
              >
                <option value='all'>All Rarities</option>
                <option value='common'>Common</option>
                <option value='rare'>Rare</option>
                <option value='epic'>Epic</option>
                <option value='legendary'>Legendary</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className='flex-1 overflow-y-auto p-6'>
          {/* Badge Grid */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
            {filteredBadges.map(badge => {
              const isEarned = isBadgeEarned(badge.id);
              const progress = getBadgeProgress(badge.id);

              // Simple rarity styling
              const getRarityStyle = (rarity: string) => {
                switch (rarity) {
                  case 'common':
                    return 'text-gray-400 bg-gray-100 border-gray-300';
                  case 'rare':
                    return 'text-blue-500 bg-blue-100 border-blue-300';
                  case 'epic':
                    return 'text-purple-500 bg-purple-100 border-purple-300';
                  case 'legendary':
                    return 'text-orange-500 bg-orange-100 border-orange-300';
                  default:
                    return 'text-gray-400 bg-gray-100 border-gray-300';
                }
              };

              return (
                <div
                  key={badge.id}
                  onClick={() => setSelectedBadge({ ...badge, createdAt: new Date() })}
                  className={`relative p-4 rounded-xl border cursor-pointer transition-all duration-300 hover:scale-105 ${
                    isEarned
                      ? 'bg-gradient-to-br from-brand-500/20 to-accent-500/20 border-brand-400/50 border-2 shadow-lg'
                      : 'bg-white/5 border-white/20 hover:bg-white/10'
                  }`}
                >
                  {/* Badge Icon */}
                  <div className='text-center mb-3'>
                    <div className={`mb-2 ${isEarned ? '' : 'grayscale opacity-50'}`}>
                      <BadgeEmblem id={badge.id} size='lg' />
                    </div>

                    {/* Rarity Indicator */}
                    <div
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRarityStyle(badge.rarity)}`}
                    >
                      {badge.rarity.charAt(0).toUpperCase() + badge.rarity.slice(1)}
                    </div>
                  </div>

                  {/* Badge Info */}
                  <div className='text-center'>
                    <h3
                      className={`font-semibold mb-1 ${isEarned ? 'text-white' : 'text-white/60'}`}
                    >
                      {badge.name}
                    </h3>
                    <p className={`text-xs mb-3 ${isEarned ? 'text-white/80' : 'text-white/40'}`}>
                      {badge.description}
                    </p>

                    {/* Points Reward */}
                    <div
                      className={`text-xs font-medium ${isEarned ? 'text-brand-300' : 'text-white/40'}`}
                    >
                      +{badge.earningPoints} Points
                    </div>

                    {/* Progress Bar for unearned badges */}
                    {!isEarned && progress > 0 && (
                      <div className='mt-2'>
                        <div className='w-full h-1 bg-white/10 rounded-full overflow-hidden'>
                          <div
                            className='h-full bg-gradient-to-r from-brand-500 to-accent-500 transition-all duration-300'
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        <div className='text-xs text-white/50 mt-1'>{progress}%</div>
                      </div>
                    )}

                    {/* Earned Indicator */}
                    {isEarned && (
                      <div className='absolute top-2 right-2'>
                        <div className='w-6 h-6 bg-green-500 rounded-full flex items-center justify-center'>
                          <span className='text-white text-xs'>✓</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {filteredBadges.length === 0 && (
            <div className='text-center py-12'>
              <div className='text-6xl mb-4'>🔍</div>
              <h3 className='text-xl font-semibold text-white mb-2'>No Badges Found</h3>
              <p className='text-white/70'>Try adjusting your filters to see more badges.</p>
            </div>
          )}
        </div>
      </div>

      {/* Badge Detail Modal */}
      {selectedBadge && (
        <div className='fixed inset-0 z-[10000] bg-black/95 backdrop-blur-md flex items-center justify-center p-4'>
          <div className='bg-gradient-to-br from-neutral-900 via-brand-900 to-neutral-900 border border-brand-400/30 rounded-2xl shadow-2xl max-w-md w-full p-6'>
            <div className='text-center'>
              {/* Badge Icon */}
              <div className='text-6xl mb-4'>
                <BadgeEmblem id={selectedBadge.id} size='xl' />
              </div>

              {/* Badge Name */}
              <h3 className='text-2xl font-bold text-white mb-2'>{selectedBadge.name}</h3>

              {/* Rarity */}
              <div
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-4 ${getRarityStyle(selectedBadge.rarity)}`}
              >
                {selectedBadge.rarity.charAt(0).toUpperCase() + selectedBadge.rarity.slice(1)}
              </div>

              {/* Description */}
              <p className='text-white/80 mb-6'>{selectedBadge.description}</p>

              {/* Points Reward */}
              <div className='p-4 bg-brand-500/20 border border-brand-400/30 rounded-lg mb-6'>
                <div className='text-2xl font-bold text-brand-300'>
                  +{selectedBadge.earningPoints} Points
                </div>
                <p className='text-white/70 text-sm'>Reward for earning this badge</p>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setSelectedBadge(null)}
                className='w-full px-6 py-3 bg-gradient-to-r from-brand-500 to-accent-500 hover:from-brand-600 hover:to-accent-600 text-white font-semibold rounded-lg transition-all duration-300'
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
