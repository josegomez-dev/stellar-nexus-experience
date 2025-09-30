// Firebase Firestore data models and types

// Transaction record for user history
export interface TransactionRecord {
  id: string; // Transaction hash or unique ID
  hash: string;
  status: 'pending' | 'success' | 'failed';
  message: string;
  timestamp: Date;
  type:
    | 'escrow'
    | 'milestone'
    | 'fund'
    | 'approve'
    | 'release'
    | 'dispute'
    | 'demo_completion'
    | 'badge_earned';
  demoId?: string;
  amount?: string;
  asset?: string;
  explorerUrl?: string;
  stellarExpertUrl?: string;
  points?: number; // Points earned from this transaction
  badgeId?: string; // If this transaction earned a badge
  walletAddress: string; // Reference to the account that owns this transaction
}

// Account - Single collection for all user data
export interface Account {
  id: string; // Wallet address as ID
  displayName: string;
  walletAddress: string;
  network: string; // 'testnet' | 'mainnet'
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date;

  // Progress tracking
  level: number;
  experience: number; // XP points
  totalPoints: number; // Accumulated points from badges
  demosCompleted: string[]; // Array of demo IDs completed
  badgesEarned: string[]; // Array of badge IDs earned
  clappedDemos: string[]; // Array of demo IDs that the user has clapped for

  // Quest system
  completedQuests: string[]; // Array of quest IDs completed
  questProgress: Record<string, number>; // Progress tracking for multi-step quests

  // Referral system
  referrals: {
    totalReferrals: number;
    successfulReferrals: number; // Referrals that completed account creation
    referralCode: string; // Unique referral code for this user
    referredBy?: string; // Referral code of the user who referred this user
    referralHistory: ReferralRecord[];
  };

  // Transaction history - now stored in separate collection
}

// Demo statistics for tracking completion and engagement
export interface DemoStats {
  id: string; // demoId
  demoId: string;
  demoName: string;
  totalCompletions: number;
  totalClaps: number;
  totalRatings: number;
  averageRating: number;
  averageCompletionTime: number; // in minutes
  createdAt: Date;
  updatedAt: Date;
}

// Collection names
export const COLLECTIONS = {
  ACCOUNTS: 'accounts',
  TRANSACTIONS: 'transactions',
  DEMO_STATS: 'demo_stats',
  QUESTS: 'quests',
  REFERRAL_INVITATIONS: 'referral_invitations',
} as const;

// Predefined demos configuration (static data)
export const PREDEFINED_DEMOS = [
  {
    id: 'hello-milestone',
    name: 'Baby Steps to Riches',
    subtitle: 'Learn the basics of milestone-based escrow',
    description:
      'Master the fundamental escrow flow with milestone payments. Perfect for beginners to understand how trustless transactions work.',
  },
  {
    id: 'dispute-resolution',
    name: 'Drama Queen Escrow',
    subtitle: 'Navigate complex dispute scenarios',
    description:
      'Experience real-world dispute resolution scenarios. Learn how to handle conflicts and make fair decisions in escrow disputes.',
  },
  {
    id: 'micro-marketplace',
    name: 'Gig Economy Madness',
    subtitle: 'Build a micro-task marketplace',
    description:
      'Create and manage a micro-task marketplace. Learn about task creation, worker assignment, and payment distribution.',
  },
];

// Demo feedback interface
export interface DemoFeedback {
  rating: number; // 1-5 stars
  feedback: string; // Text feedback
  difficulty: 'easy' | 'medium' | 'hard'; // Difficulty level
  wouldRecommend: boolean; // Would recommend to others
  mostHelpfulFeature: string; // Most helpful feature
  suggestions: string; // Suggestions for improvement
  demoId: string; // Associated demo ID
  demoName: string; // Demo name for context
  completionTime?: number; // Time taken in minutes
}

// Quest system interfaces
export interface Quest {
  id: string;
  title: string;
  description: string;
  category: 'social' | 'referral' | 'engagement' | 'community';
  type: 'follow' | 'post' | 'join' | 'refer' | 'complete';
  requirements: {
    action: string; // What the user needs to do
    target?: string; // Target (e.g., account to follow, hashtag to use)
    count?: number; // How many times (for multi-step quests)
    verification?: 'manual' | 'automatic'; // How completion is verified
  };
  rewards: {
    experience: number;
    points: number;
    badgeId?: string; // Badge earned for completion
  };
  isActive: boolean;
  isRepeatable: boolean;
  unlockRequirements?: string[]; // Badge IDs required to unlock this quest
}

// Referral system interfaces
export interface ReferralRecord {
  id: string;
  referredUserWallet: string;
  referredUserName: string;
  referralDate: Date;
  status: 'pending' | 'completed' | 'failed';
  bonusEarned: number; // XP bonus earned
}

export interface ReferralInvitation {
  id: string;
  referrerWallet: string;
  referrerName: string;
  email: string;
  referralCode: string;
  invitationDate: Date;
  status: 'sent' | 'opened' | 'completed' | 'expired';
  expiresAt: Date;
}

// Predefined badges configuration (static data)
export const PREDEFINED_BADGES = [
  // Demo Badges (Main Badges)
  {
    id: 'welcome_explorer',
    name: 'Welcome Explorer',
    description: 'Joined the Nexus Experience community',
    earningPoints: 10,
    baseColor: '#10B981',
    icon: 'explorer',
    category: 'achievement',
    rarity: 'common',
  },
  {
    id: 'escrow_expert',
    name: 'Escrow Expert',
    description: 'Mastered the basic escrow flow',
    earningPoints: 30,
    baseColor: '#3B82F6',
    icon: 'escrow',
    category: 'demo',
    rarity: 'rare',
  },
  {
    id: 'trust_guardian',
    name: 'Trust Guardian',
    description: 'Resolved conflicts like a true arbitrator',
    earningPoints: 50,
    baseColor: '#8B5CF6',
    icon: 'guardian',
    category: 'demo',
    rarity: 'epic',
  },
  {
    id: 'stellar_champion',
    name: 'Stellar Champion',
    description: 'Mastered the micro-task marketplace',
    earningPoints: 100,
    baseColor: '#F59E0B',
    icon: 'champion',
    category: 'demo',
    rarity: 'epic',
  },
  {
    id: 'nexus_master',
    name: 'Nexus Master',
    description: 'Master of all trustless work demos',
    earningPoints: 200,
    baseColor: '#EF4444',
    icon: 'master',
    category: 'special',
    rarity: 'legendary',
  },
  
  // Quest Badges (Extra Badges)
  {
    id: 'social_butterfly',
    name: 'Social Butterfly',
    description: 'Followed Trustless Work and Stellar on X',
    earningPoints: 25,
    baseColor: '#1DA1F2',
    icon: 'social',
    category: 'quest',
    rarity: 'common',
  },
  {
    id: 'hashtag_hero',
    name: 'Hashtag Hero',
    description: 'Posted about Trustless Work with hashtags',
    earningPoints: 30,
    baseColor: '#E1306C',
    icon: 'hashtag',
    category: 'quest',
    rarity: 'common',
  },
  {
    id: 'discord_warrior',
    name: 'Discord Warrior',
    description: 'Joined the Trustless Work Discord server',
    earningPoints: 35,
    baseColor: '#5865F2',
    icon: 'discord',
    category: 'quest',
    rarity: 'common',
  },
  {
    id: 'quest_master',
    name: 'Quest Master',
    description: 'Completed all available quests',
    earningPoints: 100,
    baseColor: '#FF6B35',
    icon: 'quest',
    category: 'quest',
    rarity: 'epic',
  },
  
  // Referral Badges (Extra Badges)
  {
    id: 'first_referral',
    name: 'First Referral',
    description: 'Successfully referred your first friend',
    earningPoints: 50,
    baseColor: '#10B981',
    icon: 'referral',
    category: 'referral',
    rarity: 'rare',
  },
  {
    id: 'referral_champion',
    name: 'Referral Champion',
    description: 'Successfully referred 5 friends',
    earningPoints: 150,
    baseColor: '#8B5CF6',
    icon: 'champion',
    category: 'referral',
    rarity: 'epic',
  },
  {
    id: 'referral_legend',
    name: 'Referral Legend',
    description: 'Successfully referred 10+ friends',
    earningPoints: 300,
    baseColor: '#F59E0B',
    icon: 'legend',
    category: 'referral',
    rarity: 'legendary',
  },
  {
    id: 'community_builder',
    name: 'Community Builder',
    description: 'Built a thriving community through referrals',
    earningPoints: 500,
    baseColor: '#EF4444',
    icon: 'community',
    category: 'referral',
    rarity: 'legendary',
  },
];

// Helper functions
export const getDemoById = (id: string) => {
  return PREDEFINED_DEMOS.find(demo => demo.id === id);
};

export const getBadgeById = (id: string) => {
  return PREDEFINED_BADGES.find(badge => badge.id === id);
};

export const getAllDemos = () => {
  return PREDEFINED_DEMOS;
};

export const getAllBadges = () => {
  return PREDEFINED_BADGES;
};

// Predefined quests configuration
export const PREDEFINED_QUESTS: Quest[] = [
  {
    id: 'follow_both_accounts',
    title: 'Social Butterfly',
    description: 'Follow both @TrustlessWork and @StellarOrg on X to stay updated with the latest news and learn about the Stellar ecosystem',
    category: 'social',
    type: 'follow',
    requirements: {
      action: 'Follow both @TrustlessWork and @StellarOrg on X',
      target: 'https://x.com/TrustlessWork and https://x.com/StellarOrg',
      verification: 'manual',
    },
    rewards: {
      experience: 250,
      points: 25,
      badgeId: 'social_butterfly',
    },
    isActive: true,
    isRepeatable: false,
    unlockRequirements: ['escrow_expert', 'trust_guardian', 'stellar_champion', 'nexus_master'],
  },
  {
    id: 'post_hashtags',
    title: 'Share the Love',
    description: 'Post about Trustless Work using hashtags #escrow-master #nexus-master',
    category: 'social',
    type: 'post',
    requirements: {
      action: 'Post about Trustless Work with hashtags',
      target: '#escrow-master #nexus-master #trustless-work #stellar',
      verification: 'manual',
    },
    rewards: {
      experience: 250,
      points: 25,
      badgeId: 'hashtag_hero',
    },
    isActive: true,
    isRepeatable: true,
    unlockRequirements: ['escrow_expert', 'trust_guardian', 'stellar_champion', 'nexus_master'],
  },
  {
    id: 'join_discord',
    title: 'Join the Community',
    description: 'Join the Trustless Work Discord server to see weekly leaderboard updates',
    category: 'community',
    type: 'join',
    requirements: {
      action: 'Join the Trustless Work Discord server',
      target: 'https://discord.gg/trustlesswork',
      verification: 'manual',
    },
    rewards: {
      experience: 250,
      points: 25,
      badgeId: 'discord_warrior',
    },
    isActive: true,
    isRepeatable: false,
    unlockRequirements: ['escrow_expert', 'trust_guardian', 'stellar_champion', 'nexus_master'],
  },
  {
    id: 'refer_1_friend',
    title: 'First Referral',
    description: 'Invite 1 friend to join Trustless Work',
    category: 'referral',
    type: 'refer',
    requirements: {
      action: 'Invite 1 friend',
      count: 1,
      verification: 'automatic',
    },
    rewards: {
      experience: 250,
      points: 25,
      badgeId: 'first_referral',
    },
    isActive: true,
    isRepeatable: false,
    unlockRequirements: ['escrow_expert', 'trust_guardian', 'stellar_champion', 'nexus_master'],
  },
  {
    id: 'refer_5_friends',
    title: 'Referral Champion',
    description: 'Invite 5 friends to join Trustless Work',
    category: 'referral',
    type: 'refer',
    requirements: {
      action: 'Invite 5 friends',
      count: 5,
      verification: 'automatic',
    },
    rewards: {
      experience: 250,
      points: 25,
      badgeId: 'referral_champion',
    },
    isActive: true,
    isRepeatable: false,
    unlockRequirements: ['first_referral'],
  },
  {
    id: 'refer_10_friends',
    title: 'Referral Legend',
    description: 'Invite 10 friends to join Trustless Work',
    category: 'referral',
    type: 'refer',
    requirements: {
      action: 'Invite 10 friends',
      count: 10,
      verification: 'automatic',
    },
    rewards: {
      experience: 250,
      points: 25,
      badgeId: 'referral_legend',
    },
    isActive: true,
    isRepeatable: false,
    unlockRequirements: ['referral_champion'],
  },
];

// Helper functions for quests
export const getQuestById = (id: string) => {
  return PREDEFINED_QUESTS.find(quest => quest.id === id);
};

export const getAllQuests = () => {
  return PREDEFINED_QUESTS;
};

export const getQuestsByCategory = (category: string) => {
  return PREDEFINED_QUESTS.filter(quest => quest.category === category);
};

export const getAvailableQuests = (completedBadges: string[]) => {
  return PREDEFINED_QUESTS.filter(quest => {
    if (!quest.isActive) return false;
    if (!quest.unlockRequirements) return true;
    return quest.unlockRequirements.every(badgeId => completedBadges.includes(badgeId));
  });
};
