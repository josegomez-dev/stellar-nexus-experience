'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserAccount, PointsTransaction } from '@/types/account';
import { accountService } from '@/lib/account-service';
import { useGlobalWallet } from './WalletContext';
import { useToast } from './ToastContext';
import { logInfo, logError, logWarning, setAccountInfo, setUserInfo } from '@/lib/bugfender';

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
  
  const { walletData, isConnected } = useGlobalWallet();
  const { addToast } = useToast();

  // Load account when wallet connects
  useEffect(() => {
    if (isConnected && walletData?.publicKey) {
      logInfo('Wallet connected, loading account', {
        publicKey: walletData.publicKey.substring(0, 8) + '...',
        network: walletData.network
      });
      setUserInfo(walletData.publicKey, walletData.network);
      loadAccount();
    } else {
      logInfo('Wallet disconnected, clearing account data');
      setAccount(null);
      setPointsTransactions([]);
    }
  }, [isConnected, walletData?.publicKey]);

  const loadAccount = async () => {
    if (!walletData?.publicKey) return;
    
    setLoading(true);
    setError(null);
    
    try {
      logInfo('Loading account for wallet', { publicKey: walletData.publicKey.substring(0, 8) + '...' });
      
      // Try to find existing account
      let userAccount = await accountService.getAccountByWallet(walletData.publicKey);
      
      if (!userAccount) {
        // Account doesn't exist, create one automatically
        logInfo('No existing account found, creating new account automatically');
        
        addToast({
          type: 'info',
          title: 'Creating Account',
          message: 'Setting up your Trustless Work account...',
          duration: 3000,
        });
        
        logInfo('Auto-creating account for new wallet connection');
        
        await createAccountInternal();
      } else {
        // Account exists, update last login
        await accountService.updateLastLogin(userAccount.id);
        userAccount.lastLoginAt = new Date() as any; // Update local state
        
        logInfo('Existing account found and loaded', {
          accountId: userAccount.id.substring(0, 8) + '...',
          points: userAccount.profile.totalPoints,
          level: userAccount.profile.level
        });
        
        setAccount(userAccount);
        setAccountInfo(userAccount.id, userAccount.profile.totalPoints, userAccount.profile.level);
        
        // Load points transactions
        const transactions = await accountService.getPointsTransactions(userAccount.id);
        setPointsTransactions(transactions);
        
        logInfo('Points transactions loaded', { count: transactions.length });
        
        // Welcome back message
        addToast({
          type: 'success',
          title: 'Welcome Back!',
          message: `Account loaded with ${userAccount.profile.totalPoints} points`,
          duration: 4000,
        });
      }
    } catch (err) {
      console.error('Error loading account:', err);
      logError('Failed to load account', err);
      setError(err instanceof Error ? err.message : 'Failed to load account');
    } finally {
      setLoading(false);
    }
  };

  const createAccountInternal = async () => {
    if (!walletData?.publicKey || !walletData?.network) {
      const error = 'Wallet not connected';
      logError('Account creation failed - wallet not connected', { walletData });
      throw new Error(error);
    }
    
    logInfo('Starting account creation', {
      publicKey: walletData.publicKey.substring(0, 8) + '...',
      network: walletData.network
    });
    
    setLoading(true);
    setError(null);
    
    try {
      logInfo('Calling account service to create account');
      
      // Add timeout to prevent hanging
      const accountCreationPromise = accountService.createAccount(
        walletData.publicKey,
        walletData.publicKey,
        walletData.network
      );
      
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Account creation timed out after 30 seconds')), 30000);
      });
      
      const newAccount = await Promise.race([accountCreationPromise, timeoutPromise]) as UserAccount;
      
      logInfo('Account created successfully', {
        accountId: newAccount.id.substring(0, 8) + '...',
        points: newAccount.profile.totalPoints,
        level: newAccount.profile.level
      });
      
      setAccount(newAccount);
      setAccountInfo(newAccount.id, newAccount.profile.totalPoints, newAccount.profile.level);
      
      // Load initial points transactions with timeout
      logInfo('Loading initial points transactions');
      try {
        const transactionPromise = accountService.getPointsTransactions(newAccount.id);
        const transactionTimeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Loading transactions timed out after 15 seconds')), 15000);
        });
        
        const transactions = await Promise.race([transactionPromise, transactionTimeoutPromise]) as PointsTransaction[];
        logInfo('Points transactions loaded successfully', { count: transactions.length });
        setPointsTransactions(transactions);
      } catch (transactionError) {
        logWarning('Could not load points transactions', transactionError);
        setPointsTransactions([]);
      }
      
      logInfo('Account creation completed successfully');
      
      // Success message for new account
      addToast({
        type: 'success',
        title: '🎉 Account Created!',
        message: 'Welcome to Trustless Work! You earned 100 bonus points.',
        duration: 5000,
      });
      
    } catch (err) {
      // More specific error messages
      let errorMessage = 'Failed to create account';
      if (err instanceof Error) {
        if (err.message.includes('timeout')) {
          errorMessage = 'Account creation timed out. Please check your internet connection and try again.';
        } else if (err.message.includes('Firebase') || err.message.includes('Firestore')) {
          errorMessage = 'Database connection failed. Please try again later.';
        } else {
          errorMessage = err.message;
        }
      }
      
      logError('Account creation failed', {
        error: errorMessage,
        originalError: err instanceof Error ? err.message : err,
        stack: err instanceof Error ? err.stack : undefined
      });
      
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
      setAccount(prev => prev ? { ...prev, profile: { ...prev.profile, ...updates } } : null);
    } catch (err) {
      console.error('Error updating profile:', err);
      throw err;
    }
  };

  const updateSettings = async (updates: Partial<UserAccount['settings']>) => {
    if (!account) throw new Error('No account found');
    
    try {
      await accountService.updateSettings(account.id, updates);
      setAccount(prev => prev ? { ...prev, settings: { ...prev.settings, ...updates } } : null);
    } catch (err) {
      console.error('Error updating settings:', err);
      throw err;
    }
  };

  const startDemo = async (demoId: string) => {
    if (!account) throw new Error('No account found');
    
    try {
      logInfo(`Starting demo: ${demoId}`, { 
        accountId: account.id.substring(0, 8) + '...',
        demoId 
      });
      
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
            }
          }
        };
      });
      
      logInfo(`Demo started successfully: ${demoId}`);
    } catch (err) {
      logError(`Failed to start demo: ${demoId}`, err);
      throw err;
    }
  };

  const completeDemo = async (demoId: string, score: number) => {
    if (!account) throw new Error('No account found');
    
    try {
      logInfo(`Completing demo: ${demoId}`, { 
        accountId: account.id.substring(0, 8) + '...',
        demoId,
        score 
      });

      // Calculate points that will be earned
      const basePoints = {
        'demo1': 100,
        'hello-milestone': 100,
        'demo2': 150,
        'milestone-voting': 150,
        'demo3': 200,
        'dispute-resolution': 200,
        'demo4': 250,
        'micro-task-marketplace': 250,
      };
      
      const base = basePoints[demoId as keyof typeof basePoints] || 100;
      const scoreMultiplier = Math.max(0.5, score / 100);
      const pointsEarned = Math.round(base * scoreMultiplier);

      // Show completion toast
      addToast({ 
        type: 'success', 
        title: '🎉 Demo Completed!', 
        message: `Earned ${pointsEarned} points with ${score}% score`, 
        duration: 4000 
      });
      
      await accountService.completeDemo(account.id, demoId, score);
      
      // Refresh account data to get new badges and points
      await refreshAccount();
      
      // Refresh points transactions
      const transactions = await accountService.getPointsTransactions(account.id);
      setPointsTransactions(transactions);

      // Check if a new badge was earned (after refresh)
      const updatedAccount = await accountService.getAccount(account.id);
      if (updatedAccount && updatedAccount.badges.length > account.badges.length) {
        const newBadges = updatedAccount.badges.filter(
          newBadge => !account.badges.some(oldBadge => oldBadge.name === newBadge.name)
        );
        
        newBadges.forEach(badge => {
          addToast({ 
            type: 'success', 
            title: '🏆 New Badge Earned!', 
            message: `${badge.name} - ${badge.description}`, 
            duration: 6000 
          });
        });
      }
      
      logInfo(`Demo completed successfully: ${demoId}`, { 
        score,
        pointsEarned,
        newTransactionCount: transactions.length 
      });
      
    } catch (err) {
      logError(`Failed to complete demo: ${demoId}`, err);
      addToast({ 
        type: 'error', 
        title: 'Demo Completion Failed', 
        message: 'Unable to save your progress. Please try again.', 
        duration: 5000 
      });
      throw err;
    }
  };

  const refreshAccount = async () => {
    if (!account) return;
    
    try {
      const updatedAccount = await accountService.getAccountById(account.id);
      if (updatedAccount) {
        setAccount(updatedAccount);
      }
    } catch (err) {
      console.error('Error refreshing account:', err);
    }
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
  };

  return (
    <AccountContext.Provider value={value}>
      {children}
    </AccountContext.Provider>
  );
};
