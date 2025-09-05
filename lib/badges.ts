export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: 'demo' | 'milestone' | 'achievement' | 'special';
  requirements: {
    type: 'demo_completion' | 'milestone_completion' | 'time_spent' | 'level_reached' | 'custom';
    value?: any;
    condition?: string;
  };
  rewards?: {
    experience: number;
    special?: string;
  };
}

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  // Demo Completion Badges
  {
    id: 'demo-completed-hello-milestone',
    name: 'Baby Steps Master',
    description: 'Completed the Hello Milestone demo',
    icon: '🚀',
    rarity: 'common',
    category: 'demo',
    requirements: {
      type: 'demo_completion',
      value: 'hello-milestone',
    },
    rewards: {
      experience: 100,
    },
  },
  {
    id: 'demo-completed-milestone-voting',
    name: 'Democracy Champion',
    description: 'Completed the Milestone Voting demo',
    icon: '🗳️',
    rarity: 'rare',
    category: 'demo',
    requirements: {
      type: 'demo_completion',
      value: 'milestone-voting',
    },
    rewards: {
      experience: 150,
    },
  },
  {
    id: 'demo-completed-dispute-resolution',
    name: 'Drama Resolver',
    description: 'Completed the Dispute Resolution demo',
    icon: '⚖️',
    rarity: 'rare',
    category: 'demo',
    requirements: {
      type: 'demo_completion',
      value: 'dispute-resolution',
    },
    rewards: {
      experience: 150,
    },
  },
  {
    id: 'demo-completed-micro-marketplace',
    name: 'Gig Economy Expert',
    description: 'Completed the Micro Marketplace demo',
    icon: '💼',
    rarity: 'rare',
    category: 'demo',
    requirements: {
      type: 'demo_completion',
      value: 'micro-marketplace',
    },
    rewards: {
      experience: 150,
    },
  },

  // Milestone Badges
  {
    id: 'milestone-first-completion',
    name: 'First Steps',
    description: 'Completed your first milestone',
    icon: '👶',
    rarity: 'common',
    category: 'milestone',
    requirements: {
      type: 'milestone_completion',
      value: 1,
    },
    rewards: {
      experience: 50,
    },
  },
  {
    id: 'milestone-ten-completions',
    name: 'Milestone Master',
    description: 'Completed 10 milestones',
    icon: '🎯',
    rarity: 'epic',
    category: 'milestone',
    requirements: {
      type: 'milestone_completion',
      value: 10,
    },
    rewards: {
      experience: 300,
    },
  },
  {
    id: 'milestone-fifty-completions',
    name: 'Milestone Legend',
    description: 'Completed 50 milestones',
    icon: '👑',
    rarity: 'legendary',
    category: 'milestone',
    requirements: {
      type: 'milestone_completion',
      value: 50,
    },
    rewards: {
      experience: 1000,
    },
  },

  // Time-based Badges
  {
    id: 'time-spent-one-hour',
    name: 'Time Explorer',
    description: 'Spent 1 hour in demos',
    icon: '⏰',
    rarity: 'common',
    category: 'achievement',
    requirements: {
      type: 'time_spent',
      value: 3600, // 1 hour in seconds
    },
    rewards: {
      experience: 75,
    },
  },
  {
    id: 'time-spent-ten-hours',
    name: 'Time Master',
    description: 'Spent 10 hours in demos',
    icon: '⏳',
    rarity: 'epic',
    category: 'achievement',
    requirements: {
      type: 'time_spent',
      value: 36000, // 10 hours in seconds
    },
    rewards: {
      experience: 500,
    },
  },

  // Level Badges
  {
    id: 'level-five',
    name: 'Rising Star',
    description: 'Reached level 5',
    icon: '⭐',
    rarity: 'common',
    category: 'achievement',
    requirements: {
      type: 'level_reached',
      value: 5,
    },
    rewards: {
      experience: 200,
    },
  },
  {
    id: 'level-ten',
    name: 'Expert Explorer',
    description: 'Reached level 10',
    icon: '🌟',
    rarity: 'rare',
    category: 'achievement',
    requirements: {
      type: 'level_reached',
      value: 10,
    },
    rewards: {
      experience: 500,
    },
  },
  {
    id: 'level-twenty',
    name: 'Master Navigator',
    description: 'Reached level 20',
    icon: '💫',
    rarity: 'epic',
    category: 'achievement',
    requirements: {
      type: 'level_reached',
      value: 20,
    },
    rewards: {
      experience: 1000,
    },
  },

  // Special Badges
  {
    id: 'early-adopter',
    name: 'Early Adopter',
    description: 'One of the first users to join Nexus Experience',
    icon: '🚀',
    rarity: 'legendary',
    category: 'special',
    requirements: {
      type: 'custom',
      condition: 'early_user',
    },
    rewards: {
      experience: 500,
      special: 'Exclusive early adopter status',
    },
  },
  {
    id: 'perfect-score',
    name: 'Perfectionist',
    description: 'Achieved a perfect score in any demo',
    icon: '💯',
    rarity: 'epic',
    category: 'achievement',
    requirements: {
      type: 'custom',
      condition: 'perfect_score',
    },
    rewards: {
      experience: 300,
    },
  },
];

export const getBadgeById = (id: string): BadgeDefinition | undefined => {
  return BADGE_DEFINITIONS.find(badge => badge.id === id);
};

export const getBadgesByCategory = (category: string): BadgeDefinition[] => {
  return BADGE_DEFINITIONS.filter(badge => badge.category === category);
};

export const getBadgesByRarity = (rarity: string): BadgeDefinition[] => {
  return BADGE_DEFINITIONS.filter(badge => badge.rarity === rarity);
};

export const checkBadgeEligibility = (
  badge: BadgeDefinition,
  userStats: {
    completedDemos: string[];
    totalMilestones: number;
    totalTimeSpent: number;
    level: number;
    perfectScores: number;
  }
): boolean => {
  switch (badge.requirements.type) {
    case 'demo_completion':
      return userStats.completedDemos.includes(badge.requirements.value);

    case 'milestone_completion':
      return userStats.totalMilestones >= badge.requirements.value;

    case 'time_spent':
      return userStats.totalTimeSpent >= badge.requirements.value;

    case 'level_reached':
      return userStats.level >= badge.requirements.value;

    case 'custom':
      switch (badge.requirements.condition) {
        case 'early_user':
          // Check if user joined before a certain date
          return true; // For now, all users are early adopters
        case 'perfect_score':
          return userStats.perfectScores > 0;
        default:
          return false;
      }

    default:
      return false;
  }
};
