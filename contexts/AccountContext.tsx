'use client';

import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { UserAccount, PointsTransaction } from '@/utils/types/account';
import { accountService } from '@/lib/services/account-service';
import { useGlobalWallet } from './WalletContext';
import { useToast } from './ToastContext';
import { useBadgeAnimation } from './BadgeAnimationContext';
import { getAllBadges } from '@/lib/firebase/firebase-types';

interface AccountContextType {
  account: UserAccount | null;
  loading: boolean;
  error: string | null;
  pointsTransactions: PointsTransaction[];
  createAccount: () => Promise<void>;
  updateProfile: (updates: Partial<UserAccount['profile']>) => Promise<void>;
  updateSettings: (updates: Partial<UserAccount['settings']>) => Promise<void>;
  startDemo: (demoId: string) => Promise<void>;
  completeDemo: (demoId: string, score: number) => Promise<void>;
  refreshAccount: () => Promise<void>;
  getTotalPoints: () => number;
  getLevel: () => number;
  getExperienceProgress: () => { current: number; next: number };
  getAvailableDemos: () => string[];
  getCompletedDemos: () => string[];
  getMainDemoProgress: () => { completed: number; total: number };
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

export const useAccount = () => {
  const context = useContext(AccountContext);
  if (context === undefined) {
    throw new Error('useAccount must be used within an AccountProvider');
  }
  return context;
};

interface AccountProviderProps {
  children: ReactNode;
}

export const AccountProvider: React.FC<AccountProviderProps> = ({ children }) => {
  const [account, setAccount] = useState<UserAccount | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pointsTransactions, setPointsTransactions] = useState<PointsTransaction[]>([]);

  // Track demo completions in progress to prevent duplicates
  const completionInProgress = useRef(new Set<string>()).current;

  const { walletData, isConnected } = useGlobalWallet();
  const { addToast } = useToast();
  const { showBadgeAnimation } = useBadgeAnimation();

  // Load account when wallet connects
  useEffect(() => {
    if (isConnected && walletData?.publicKey) {
      // User info set (Bugfender removed)
      loadAccount();
    } else {
      setAccount(null);
      setPointsTransactions([]);
    }
  }, [isConnected, walletData?.publicKey]);

  const loadAccount = async () => {
    if (!walletData?.publicKey) return;

    setLoading(true);
    setError(null);

    try {
      // Try to find existing account
      let userAccount = await accountService.getAccountByWallet(walletData.publicKey);

      if (!userAccount) {
        // Account doesn't exist, create one automatically

        addToast({
          type: 'info',
          title: 'Creating Account',
          message: 'Setting up your Trustless Work account...',
          duration: 3000,
        });

        await createAccountInternal();
      } else {
        // Account exists, update last login
        await accountService.updateLastLogin(userAccount.id);
        userAccount.lastLoginAt = new Date() as any; // Update local state

        setAccount(userAccount);
        // Account info set (Bugfender removed)

        // Load points transactions
        const transactions = await accountService.getPointsTransactions(userAccount.id);
        setPointsTransactions(transactions);

        // Welcome back message
        // addToast({
        //   type: 'success',
        //   title: 'Welcome Back!',
        //   message: `Account loaded with ${userAccount.profile.totalPoints} points`,
        //   duration: 4000,
        // });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load account');
    } finally {
      setLoading(false);
    }
  };

  const createAccountInternal = async () => {
    if (!walletData?.publicKey || !walletData?.network) {
      const error = 'Wallet not connected';
      throw new Error(error);
    }

    setLoading(true);
    setError(null);

    try {
      // Add timeout to prevent hanging
      const accountCreationPromise = accountService.createAccount(
        walletData.publicKey,
        walletData.publicKey,
        walletData.network
      );

      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Account creation timed out after 30 seconds')), 30000);
      });

      const newAccount = (await Promise.race([
        accountCreationPromise,
        timeoutPromise,
      ])) as UserAccount;

      setAccount(newAccount);
      // Account info set (Bugfender removed)

      // Load initial points transactions with timeout
      try {
        const transactionPromise = accountService.getPointsTransactions(newAccount.id);
        const transactionTimeoutPromise = new Promise((_, reject) => {
          setTimeout(
            () => reject(new Error('Loading transactions timed out after 15 seconds')),
            15000
          );
        });

        const transactions = (await Promise.race([
          transactionPromise,
          transactionTimeoutPromise,
        ])) as PointsTransaction[];
        setPointsTransactions(transactions);
      } catch (transactionError) {
        setPointsTransactions([]);
      }

      // Success message for new account
      addToast({
        type: 'success',
        title: '🎉 Account Created!',
        message: 'Welcome to Trustless Work! You earned 150 points and the Welcome Explorer badge!',
        duration: 5000,
      });

      // Show epic badge animation for Welcome Explorer badge (client-side only)
      if (typeof window !== 'undefined') {
        setTimeout(() => {
          const welcomeExplorerBadge = getAllBadges().find(
            badge => badge.name === 'Welcome Explorer'
          );
          if (welcomeExplorerBadge) {
            showBadgeAnimation(welcomeExplorerBadge, 50);
          }
        }, 1000);
      }
    } catch (err) {
      // More specific error messages
      let errorMessage = 'Failed to create account';
      if (err instanceof Error) {
        if (err.message.includes('timeout')) {
          errorMessage =
            'Account creation timed out. Please check your internet connection and try again.';
        } else if (err.message.includes('Firebase') || err.message.includes('Firestore')) {
          errorMessage = 'Database connection failed. Please try again later.';
        } else {
          errorMessage = err.message;
        }
      }

      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Public function for manual account creation (if needed)
  const createAccount = async () => {
    await createAccountInternal();
  };

  const updateProfile = async (updates: Partial<UserAccount['profile']>) => {
    if (!account) throw new Error('No account found');

    try {
      await accountService.updateProfile(account.id, updates);
      setAccount(prev => (prev ? { ...prev, profile: { ...prev.profile, ...updates } } : null));
    } catch (err) {
      throw err;
    }
  };

  const updateSettings = async (updates: Partial<UserAccount['settings']>) => {
    if (!account) throw new Error('No account found');

    try {
      await accountService.updateSettings(account.id, updates);
      setAccount(prev => (prev ? { ...prev, settings: { ...prev.settings, ...updates } } : null));
    } catch (err) {
      throw err;
    }
  };

  const startDemo = async (demoId: string) => {
    if (!account) throw new Error('No account found');

    try {
      await accountService.startDemo(account.id, demoId);
      setAccount(prev => {
        if (!prev) return null;
        return {
          ...prev,
          demos: {
            ...prev.demos,
            [demoId]: {
              ...prev.demos[demoId as keyof typeof prev.demos],
              status: 'in_progress',
              attempts: prev.demos[demoId as keyof typeof prev.demos].attempts + 1,
            },
          },
        };
      });
    } catch (err) {
      throw err;
    }
  };

  const completeDemo = async (demoId: string, score: number) => {
    if (!account) throw new Error('No account found');

    // Prevent multiple simultaneous completions of the same demo
    const completionKey = `${account.id}-${demoId}`;
    if (completionInProgress.has(completionKey)) {
      return;
    }

    completionInProgress.add(completionKey);

    try {
      // Check if this is first completion for points calculation
      const currentDemo = account.demos[demoId as keyof typeof account.demos];
      const isFirstCompletion = currentDemo?.status !== 'completed';

      // Calculate points that will be earned (this mirrors the server logic)
      const basePoints = {
        demo1: 100,
        'hello-milestone': 100,
        demo2: 150,
        'milestone-voting': 150,
        demo3: 200,
        'dispute-resolution': 200,
        demo4: 250,
        'micro-task-marketplace': 250,
      };

      const base = basePoints[demoId as keyof typeof basePoints] || 100;
      const scoreMultiplier = Math.max(0.5, score / 100);
      let pointsEarned = Math.round(base * scoreMultiplier);

      // Give reduced points for replays (25% of original)
      if (!isFirstCompletion) {
        pointsEarned = Math.round(pointsEarned * 0.25);
      }

      // Show completion toast
      const toastTitle = isFirstCompletion ? '🎉 Demo Completed!' : '🔄 Demo Replayed!';
      const toastMessage = isFirstCompletion
        ? `Earned ${pointsEarned} points with ${score}% score`
        : `Earned ${pointsEarned} bonus points (${score}% score)`;

      addToast({
        type: 'success',
        title: toastTitle,
        message: toastMessage,
        duration: 4000,
      });

      await accountService.completeDemo(account.id, demoId, score);

      // Refresh account data to get new badges and points
      await refreshAccount();

      // Refresh points transactions
      const transactions = await accountService.getPointsTransactions(account.id);
      setPointsTransactions(transactions);

      // Check if a new badge was earned (only on first completion)
      if (isFirstCompletion && typeof window !== 'undefined') {
        const updatedAccount = await accountService.getAccountById(account.id);
        if (updatedAccount && updatedAccount.badges.length > account.badges.length) {
          const newBadges = updatedAccount.badges.filter(
            newBadge => !account.badges.some(oldBadge => oldBadge.name === newBadge.name)
          );

          // Show epic badge animations for newly earned badges (client-side only)
          newBadges.forEach((badge, index) => {
            setTimeout(
              () => {
                const badgeConfig = getAllBadges().find(b => b.name === badge.name);
                if (badgeConfig) {
                  showBadgeAnimation(badgeConfig, badge.pointsValue);
                }
              },
              2000 + index * 5500
            ); // Stagger multiple badge animations
          });
        }
      }
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Demo Completion Failed',
        message: 'Unable to save your progress. Please try again.',
        duration: 5000,
      });
      throw err;
    } finally {
      // Clean up completion tracking
      completionInProgress.delete(completionKey);
    }
  };

  const refreshAccount = async () => {
    if (!account) return;

    try {
      const updatedAccount = await accountService.getAccountById(account.id);
      if (updatedAccount) {
        setAccount(updatedAccount);
      }
    } catch (err) {}
  };

  // Helper functions
  const getTotalPoints = () => account?.profile.totalPoints || 0;

  const getLevel = () => {
    if (!account) return 1;
    const experience = account.profile.experience;
    return Math.floor(experience / 1000) + 1; // 1000 XP per level
  };

  const getExperienceProgress = () => {
    if (!account) return { current: 0, next: 1000 };
    const experience = account.profile.experience;
    const currentLevel = getLevel();
    const currentLevelXP = (currentLevel - 1) * 1000;
    const nextLevelXP = currentLevel * 1000;

    return {
      current: experience - currentLevelXP,
      next: nextLevelXP - currentLevelXP,
    };
  };

  const getAvailableDemos = () => {
    if (!account) return ['demo1'];
    return Object.entries(account.demos)
      .filter(([_, demo]) => demo.status === 'available' || demo.status === 'in_progress')
      .map(([demoId, _]) => demoId);
  };

  const getCompletedDemos = () => {
    if (!account) return [];
    return Object.entries(account.demos)
      .filter(([_, demo]) => demo.status === 'completed')
      .map(([demoId, _]) => demoId);
  };

  const getMainDemoProgress = () => {
    if (!account) return { completed: 0, total: 4 };
    return accountService.getMainDemoCompletionCount(account);
  };

  const value: AccountContextType = {
    account,
    loading,
    error,
    pointsTransactions,
    createAccount,
    updateProfile,
    updateSettings,
    startDemo,
    completeDemo,
    refreshAccount,
    getTotalPoints,
    getLevel,
    getExperienceProgress,
    getAvailableDemos,
    getCompletedDemos,
    getMainDemoProgress,
  };

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
};
