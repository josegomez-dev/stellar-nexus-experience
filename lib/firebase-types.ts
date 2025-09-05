// Firebase Firestore data models and types

export interface UserProfile {
  id: string; // Wallet address
  username: string;
  email?: string;
  walletAddress: string;
  walletType: 'freighter' | 'albedo' | 'rabet' | 'lobstr' | 'manual';
  walletName: string;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date;
  isActive: boolean;
  preferences: UserPreferences;
  stats: UserStats;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    demoUpdates: boolean;
    badgeEarned: boolean;
  };
  privacy: {
    showProfile: boolean;
    showStats: boolean;
    showBadges: boolean;
  };
}

export interface UserStats {
  totalXp: number;
  level: number;
  demosCompleted: number;
  badgesEarned: number;
  totalTimeSpent: number; // in minutes
  streak: number; // consecutive days
  lastActivityAt: Date;
}

export interface DemoProgress {
  id: string;
  userId: string; // Wallet address
  demoId: string;
  demoName: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'failed';
  currentStep: number;
  totalSteps: number;
  startedAt: Date;
  completedAt?: Date;
  timeSpent: number; // in minutes
  score?: number;
  notes?: string;
  metadata: Record<string, any>;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'demo' | 'achievement' | 'social' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  requirements: BadgeRequirement[];
  xpReward: number;
  createdAt: Date;
}

export interface BadgeRequirement {
  type: 'demo_completion' | 'xp_threshold' | 'streak' | 'time_spent' | 'custom';
  value: number;
  description: string;
}

export interface UserBadge {
  id: string;
  userId: string;
  badgeId: string;
  earnedAt: Date;
  progress: number; // 0-100
  isCompleted: boolean;
}

export interface Transaction {
  id: string;
  userId: string;
  demoId: string;
  type: 'escrow_init' | 'escrow_fund' | 'milestone_complete' | 'milestone_approve' | 'fund_release' | 'dispute';
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  amount?: number;
  assetCode?: string;
  hash?: string;
  createdAt: Date;
  completedAt?: Date;
  metadata: Record<string, any>;
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  walletAddress: string;
  totalXp: number;
  level: number;
  demosCompleted: number;
  badgesEarned: number;
  rank: number;
  lastUpdated: Date;
}

// Collection names
export const COLLECTIONS = {
  USERS: 'users',
  DEMO_PROGRESS: 'demo_progress',
  BADGES: 'badges',
  USER_BADGES: 'user_badges',
  TRANSACTIONS: 'transactions',
  LEADERBOARD: 'leaderboard',
} as const;

// Firestore document references
export type CollectionName = typeof COLLECTIONS[keyof typeof COLLECTIONS];
