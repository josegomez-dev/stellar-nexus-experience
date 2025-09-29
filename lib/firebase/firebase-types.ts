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

// Predefined badges configuration (static data)
export const PREDEFINED_BADGES = [
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
