// Types Export
// This file provides a centralized export for all types

// Account Types
export * from './account';

// Trustless Work Types
export * from './trustless-work';

// UI Component Types
export * from './ui';

// Re-export commonly used types for convenience
export type {
  DemoProgress,
  NFTBadge,
  Reward,
  UserAccount,
  DemoConfig,
  PointsTransaction,
  Achievement,
} from './account';
