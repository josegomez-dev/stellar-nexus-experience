// Badge configuration system for achievements and rewards
import { Badge } from './firebase-types';

export const BADGE_CONFIG: Record<string, Badge> = {
  // Main Achievement Badges - The 5 core badges for the Stellar Nexus Experience
  welcome_explorer: {
    id: 'welcome_explorer',
    name: 'Welcome Explorer',
    description: 'Joined the Nexus Experience community',
    icon: '🌟',
    category: 'main_achievement',
    rarity: 'common',
    xpReward: 10,
    requirements: [
      {
        type: 'custom',
        value: 1,
        description: 'Create account and connect wallet',
      },
    ],
    createdAt: new Date(),
  },

  'escrow-expert': {
    id: 'escrow-expert',
    name: 'Escrow Expert',
    description: 'Mastered the basic escrow flow',
    icon: '🔒',
    category: 'main_achievement',
    rarity: 'common',
    xpReward: 30,
    requirements: [
      {
        type: 'demo_completion',
        value: 1,
        description: 'Complete Baby Steps to Riches demo',
      },
    ],
    createdAt: new Date(),
  },

  'trust-guardian': {
    id: 'trust-guardian',
    name: 'Trust Guardian',
    description: 'Resolved conflicts like a true arbitrator',
    icon: '⚖️',
    category: 'main_achievement',
    rarity: 'rare',
    xpReward: 50,
    requirements: [
      {
        type: 'demo_completion',
        value: 1,
        description: 'Complete Drama Queen Escrow demo',
      },
    ],
    createdAt: new Date(),
  },

  'stellar-champion': {
    id: 'stellar-champion',
    name: 'Stellar Champion',
    description: 'Mastered the micro-task marketplace',
    icon: '💼',
    category: 'main_achievement',
    rarity: 'epic',
    xpReward: 100,
    requirements: [
      {
        type: 'demo_completion',
        value: 1,
        description: 'Complete Gig Economy Madness demo',
      },
    ],
    createdAt: new Date(),
  },

  'nexus-master': {
    id: 'nexus-master',
    name: 'Nexus Master',
    description: 'Completed all key demos and achieved mastery',
    icon: '👑',
    category: 'main_achievement',
    rarity: 'legendary',
    xpReward: 200,
    requirements: [
      {
        type: 'custom',
        value: 3,
        description: 'Complete demos 1, 2, and 3',
      },
    ],
    createdAt: new Date(),
  },
};

// Badge categories for organization
export const BADGE_CATEGORIES = {
  main_achievement: {
    name: 'Main Achievements',
    description: 'The 5 core badges for the Stellar Nexus Experience',
    icon: '👑',
    color: 'from-purple-500 to-purple-600',
  },
} as const;

// Rarity configurations
export const BADGE_RARITY = {
  common: {
    name: 'Common',
    color: 'text-gray-400',
    bgColor: 'bg-gray-100',
    borderColor: 'border-gray-300',
    glowColor: 'shadow-gray-200',
  },
  rare: {
    name: 'Rare',
    color: 'text-blue-500',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-300',
    glowColor: 'shadow-blue-200',
  },
  epic: {
    name: 'Epic',
    color: 'text-purple-500',
    bgColor: 'bg-purple-100',
    borderColor: 'border-purple-300',
    glowColor: 'shadow-purple-200',
  },
  legendary: {
    name: 'Legendary',
    color: 'text-orange-500',
    bgColor: 'bg-orange-100',
    borderColor: 'border-orange-300',
    glowColor: 'shadow-orange-200',
  },
} as const;

// Helper functions
export const getBadgeById = (badgeId: string): Badge | undefined => {
  return BADGE_CONFIG[badgeId];
};

export const getBadgesByCategory = (category: string): Badge[] => {
  return Object.values(BADGE_CONFIG).filter(badge => badge.category === category);
};

export const getBadgesByRarity = (rarity: string): Badge[] => {
  return Object.values(BADGE_CONFIG).filter(badge => badge.rarity === rarity);
};

export const getAllBadges = (): Badge[] => {
  return Object.values(BADGE_CONFIG);
};

export const getBadgeRarityConfig = (rarity: string) => {
  return BADGE_RARITY[rarity as keyof typeof BADGE_RARITY] || BADGE_RARITY.common;
};

export const getCategoryConfig = (category: string) => {
  return BADGE_CATEGORIES[category as keyof typeof BADGE_CATEGORIES];
};
