// Badge configuration system for achievements and rewards
import { Badge } from './firebase-types';

export const BADGE_CONFIG: Record<string, Badge> = {
  // Welcome and Onboarding Badges
  'welcome_explorer': {
    id: 'welcome_explorer',
    name: 'Welcome Explorer',
    description: 'Joined the Nexus Experience community',
    icon: '🌟',
    category: 'special',
    rarity: 'common',
    xpReward: 10,
    requirements: [
      {
        type: 'custom',
        value: 1,
        description: 'Create account and connect wallet'
      }
    ],
    createdAt: new Date(),
  },

  // Demo Completion Badges
  'first_demo': {
    id: 'first_demo',
    name: 'First Steps',
    description: 'Completed your first demo',
    icon: '👶',
    category: 'demo',
    rarity: 'common',
    xpReward: 25,
    requirements: [
      {
        type: 'demo_completion',
        value: 1,
        description: 'Complete any demo'
      }
    ],
    createdAt: new Date(),
  },

  'demo_master': {
    id: 'demo_master',
    name: 'Demo Master',
    description: 'Completed all available demos',
    icon: '🎓',
    category: 'achievement',
    rarity: 'epic',
    xpReward: 100,
    requirements: [
      {
        type: 'demo_completion',
        value: 4,
        description: 'Complete all 4 demos'
      }
    ],
    createdAt: new Date(),
  },

  // Specific Demo Badges
  'escrow_beginner': {
    id: 'escrow_beginner',
    name: 'Escrow Beginner',
    description: 'Mastered the basic escrow flow',
    icon: '🔒',
    category: 'demo',
    rarity: 'common',
    xpReward: 30,
    requirements: [
      {
        type: 'demo_completion',
        value: 1,
        description: 'Complete Baby Steps to Riches demo'
      }
    ],
    createdAt: new Date(),
  },

  'democracy_champion': {
    id: 'democracy_champion',
    name: 'Democracy Champion',
    description: 'Navigated multi-stakeholder approval systems',
    icon: '🗳️',
    category: 'demo',
    rarity: 'rare',
    xpReward: 40,
    requirements: [
      {
        type: 'demo_completion',
        value: 1,
        description: 'Complete Democracy in Action demo'
      }
    ],
    createdAt: new Date(),
  },

  'dispute_resolver': {
    id: 'dispute_resolver',
    name: 'Dispute Resolver',
    description: 'Resolved conflicts like a true arbitrator',
    icon: '⚖️',
    category: 'demo',
    rarity: 'rare',
    xpReward: 50,
    requirements: [
      {
        type: 'demo_completion',
        value: 1,
        description: 'Complete Drama Queen Escrow demo'
      }
    ],
    createdAt: new Date(),
  },

  'gig_economy_expert': {
    id: 'gig_economy_expert',
    name: 'Gig Economy Expert',
    description: 'Mastered the micro-task marketplace',
    icon: '💼',
    category: 'demo',
    rarity: 'rare',
    xpReward: 35,
    requirements: [
      {
        type: 'demo_completion',
        value: 1,
        description: 'Complete Gig Economy Madness demo'
      }
    ],
    createdAt: new Date(),
  },

  // Level-Based Badges
  'level_5_explorer': {
    id: 'level_5_explorer',
    name: 'Level 5 Explorer',
    description: 'Reached level 5 through active participation',
    icon: '⭐',
    category: 'achievement',
    rarity: 'rare',
    xpReward: 75,
    requirements: [
      {
        type: 'xp_threshold',
        value: 400,
        description: 'Reach level 5 (400+ XP)'
      }
    ],
    createdAt: new Date(),
  },

  'level_10_veteran': {
    id: 'level_10_veteran',
    name: 'Level 10 Veteran',
    description: 'Became a true veteran of the platform',
    icon: '🏆',
    category: 'achievement',
    rarity: 'epic',
    xpReward: 150,
    requirements: [
      {
        type: 'xp_threshold',
        value: 900,
        description: 'Reach level 10 (900+ XP)'
      }
    ],
    createdAt: new Date(),
  },

  'level_20_legend': {
    id: 'level_20_legend',
    name: 'Level 20 Legend',
    description: 'Achieved legendary status on the platform',
    icon: '👑',
    category: 'achievement',
    rarity: 'legendary',
    xpReward: 300,
    requirements: [
      {
        type: 'xp_threshold',
        value: 1900,
        description: 'Reach level 20 (1900+ XP)'
      }
    ],
    createdAt: new Date(),
  },

  // XP Milestone Badges
  'xp_collector': {
    id: 'xp_collector',
    name: 'XP Collector',
    description: 'Collected 500+ experience points',
    icon: '💎',
    category: 'achievement',
    rarity: 'rare',
    xpReward: 50,
    requirements: [
      {
        type: 'xp_threshold',
        value: 500,
        description: 'Accumulate 500+ XP'
      }
    ],
    createdAt: new Date(),
  },

  'xp_master': {
    id: 'xp_master',
    name: 'XP Master',
    description: 'Mastered the art of earning experience',
    icon: '🔥',
    category: 'achievement',
    rarity: 'epic',
    xpReward: 100,
    requirements: [
      {
        type: 'xp_threshold',
        value: 1000,
        description: 'Accumulate 1000+ XP'
      }
    ],
    createdAt: new Date(),
  },

  'xp_legend': {
    id: 'xp_legend',
    name: 'XP Legend',
    description: 'Became a legend through massive XP accumulation',
    icon: '⚡',
    category: 'achievement',
    rarity: 'legendary',
    xpReward: 200,
    requirements: [
      {
        type: 'xp_threshold',
        value: 2000,
        description: 'Accumulate 2000+ XP'
      }
    ],
    createdAt: new Date(),
  },

  // Engagement Badges
  'feedback_champion': {
    id: 'feedback_champion',
    name: 'Feedback Champion',
    description: 'Provided valuable feedback on multiple demos',
    icon: '💬',
    category: 'social',
    rarity: 'rare',
    xpReward: 40,
    requirements: [
      {
        type: 'custom',
        value: 3,
        description: 'Submit feedback for 3+ demos'
      }
    ],
    createdAt: new Date(),
  },

  'clap_enthusiast': {
    id: 'clap_enthusiast',
    name: 'Clap Enthusiast',
    description: 'Showed appreciation for great demos',
    icon: '👏',
    category: 'social',
    rarity: 'common',
    xpReward: 20,
    requirements: [
      {
        type: 'custom',
        value: 5,
        description: 'Clap for 5+ demos'
      }
    ],
    createdAt: new Date(),
  },

  'streak_master': {
    id: 'streak_master',
    name: 'Streak Master',
    description: 'Maintained activity for 7 consecutive days',
    icon: '🔥',
    category: 'achievement',
    rarity: 'epic',
    xpReward: 80,
    requirements: [
      {
        type: 'streak',
        value: 7,
        description: 'Maintain 7-day activity streak'
      }
    ],
    createdAt: new Date(),
  },

  // Special Badges
  'early_adopter': {
    id: 'early_adopter',
    name: 'Early Adopter',
    description: 'One of the first users on the platform',
    icon: '🚀',
    category: 'special',
    rarity: 'legendary',
    xpReward: 150,
    requirements: [
      {
        type: 'custom',
        value: 1,
        description: 'Join in the first 100 users'
      }
    ],
    createdAt: new Date(),
  },

  'bug_hunter': {
    id: 'bug_hunter',
    name: 'Bug Hunter',
    description: 'Helped improve the platform by reporting issues',
    icon: '🐛',
    category: 'special',
    rarity: 'rare',
    xpReward: 60,
    requirements: [
      {
        type: 'custom',
        value: 1,
        description: 'Report a significant bug or issue'
      }
    ],
    createdAt: new Date(),
  },

  'community_helper': {
    id: 'community_helper',
    name: 'Community Helper',
    description: 'Helped other users and contributed to the community',
    icon: '🤝',
    category: 'social',
    rarity: 'epic',
    xpReward: 90,
    requirements: [
      {
        type: 'custom',
        value: 1,
        description: 'Make significant community contributions'
      }
    ],
    createdAt: new Date(),
  },

  // Time-Based Badges
  'speed_demon': {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Completed a demo in record time',
    icon: '⚡',
    category: 'achievement',
    rarity: 'rare',
    xpReward: 45,
    requirements: [
      {
        type: 'custom',
        value: 1,
        description: 'Complete a demo in under 2 minutes'
      }
    ],
    createdAt: new Date(),
  },

  'marathon_runner': {
    id: 'marathon_runner',
    name: 'Marathon Runner',
    description: 'Spent over 2 hours learning on the platform',
    icon: '🏃',
    category: 'achievement',
    rarity: 'epic',
    xpReward: 120,
    requirements: [
      {
        type: 'time_spent',
        value: 120,
        description: 'Spend 120+ minutes on the platform'
      }
    ],
    createdAt: new Date(),
  },
};

// Badge categories for organization
export const BADGE_CATEGORIES = {
  demo: {
    name: 'Demo Achievements',
    description: 'Badges earned by completing demos',
    icon: '🎯',
    color: 'from-blue-500 to-blue-600',
  },
  achievement: {
    name: 'Achievements',
    description: 'Milestone and level-based badges',
    icon: '🏆',
    color: 'from-yellow-500 to-yellow-600',
  },
  social: {
    name: 'Social',
    description: 'Community and engagement badges',
    icon: '👥',
    color: 'from-green-500 to-green-600',
  },
  special: {
    name: 'Special',
    description: 'Rare and unique badges',
    icon: '✨',
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