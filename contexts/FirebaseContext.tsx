// Firebase context for managing user data and database operations
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useGlobalWallet } from './WalletContext';
import { 
  userService, 
  demoProgressService, 
  badgeService, 
  transactionService,
  firebaseUtils 
} from '../lib/firebase-service';
import { 
  UserProfile, 
  DemoProgress, 
  UserBadge, 
  Transaction
} from '../lib/firebase-types';

interface FirebaseContextType {
  // User data
  userProfile: UserProfile | null;
  userBadges: UserBadge[];
  userTransactions: Transaction[];
  
  // Demo progress
  demoProgress: DemoProgress[];
  currentDemoProgress: DemoProgress | null;
  
  // Leaderboard functionality removed
  
  // Loading states
  isLoading: boolean;
  isInitialized: boolean;
  
  // Actions
  initializeUser: (username: string) => Promise<void>;
  updateDemoProgress: (demoId: string, step: number, status?: DemoProgress['status']) => Promise<void>;
  completeDemo: (demoId: string, demoName: string, score?: number) => Promise<void>;
  addTransaction: (transaction: Partial<Transaction>) => Promise<string>;
  updateUserStats: (stats: Partial<UserProfile['stats']>) => Promise<void>;
  refreshUserData: () => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};

interface FirebaseProviderProps {
  children: ReactNode;
}

export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const { walletData } = useGlobalWallet();
  
  // State
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userBadges, setUserBadges] = useState<UserBadge[]>([]);
  const [userTransactions, setUserTransactions] = useState<Transaction[]>([]);
  // User rank removed (was tied to leaderboard)
  const [demoProgress, setDemoProgress] = useState<DemoProgress[]>([]);
  const [currentDemoProgress, setCurrentDemoProgress] = useState<DemoProgress | null>(null);
  // Leaderboard state removed
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize user data when wallet connects
  useEffect(() => {
    const initializeUserData = async () => {
      if (!walletData?.publicKey || !user?.username) return;
      
      setIsLoading(true);
      try {
        // Check if user exists in Firebase
        const existingUser = await userService.getUserByWalletAddress(walletData.publicKey);
        
        if (!existingUser) {
          // Initialize new user
          await firebaseUtils.initializeUser(
            walletData.publicKey,
            user.username,
            walletData.walletType || 'manual',
            walletData.walletName || 'Unknown Wallet'
          );
        } else {
          // Update last login
          await userService.createOrUpdateUser({
            id: walletData.publicKey,
            lastLoginAt: new Date(),
          });
        }
        
        // Load user data
        await loadUserData();
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeUserData();
  }, [walletData?.publicKey, user?.username]);

  // Load user data
  const loadUserData = async () => {
    if (!walletData?.publicKey) return;
    
    try {
      const [profile, badges, transactions, progress] = await Promise.all([
        userService.getUserByWalletAddress(walletData.publicKey),
        badgeService.getUserBadges(walletData.publicKey),
        transactionService.getUserTransactions(walletData.publicKey),
        demoProgressService.getUserDemoProgress(walletData.publicKey),
      ]);
      
      setUserProfile(profile);
      setUserBadges(badges);
      setUserTransactions(transactions);
      setDemoProgress(progress);
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  // Initialize user (called from AuthModal)
  const initializeUser = async (username: string) => {
    if (!walletData?.publicKey) throw new Error('Wallet not connected');
    
    setIsLoading(true);
    try {
      await firebaseUtils.initializeUser(
        walletData.publicKey,
        username,
        walletData.walletType || 'manual',
        walletData.walletName || 'Unknown Wallet'
      );
      
      await loadUserData();
      setIsInitialized(true);
    } catch (error) {
      console.error('Failed to initialize user:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Update demo progress
  const updateDemoProgress = async (demoId: string, step: number, status?: DemoProgress['status']) => {
    if (!walletData?.publicKey) return;
    
    try {
      await demoProgressService.updateDemoStep(walletData.publicKey, demoId, step, status);
      
      // Update local state
      const updatedProgress = await demoProgressService.getDemoProgress(walletData.publicKey, demoId);
      setCurrentDemoProgress(updatedProgress);
      
      // Update demo progress list
      await loadUserData();
    } catch (error) {
      console.error('Failed to update demo progress:', error);
    }
  };

  // Complete demo
  const completeDemo = async (demoId: string, demoName: string, score?: number) => {
    if (!walletData?.publicKey) return;
    
    try {
      // Update user stats (demo progress is handled by markDemoComplete)
      const newStats = {
        demosCompleted: (userProfile?.stats.demosCompleted || 0) + 1,
        totalXp: (userProfile?.stats.totalXp || 0) + (score || 50),
        level: firebaseUtils.calculateLevel((userProfile?.stats.totalXp || 0) + (score || 50)),
        lastActivityAt: new Date(),
      };
      
      await userService.updateUserStats(walletData.publicKey, newStats);
      
      // Refresh data
      await loadUserData();
    } catch (error) {
      console.error('Failed to complete demo:', error);
    }
  };

  // Add transaction
  const addTransaction = async (transaction: Partial<Transaction>): Promise<string> => {
    if (!walletData?.publicKey) throw new Error('Wallet not connected');
    
    try {
      const transactionId = await transactionService.createTransaction({
        ...transaction,
        userId: walletData.publicKey,
      });
      
      // Refresh transactions
      const transactions = await transactionService.getUserTransactions(walletData.publicKey);
      setUserTransactions(transactions);
      
      return transactionId;
    } catch (error) {
      console.error('Failed to add transaction:', error);
      throw error;
    }
  };

  // Update user stats
  const updateUserStats = async (stats: Partial<UserProfile['stats']>) => {
    if (!walletData?.publicKey) return;
    
    try {
      await userService.updateUserStats(walletData.publicKey, stats);
      await loadUserData();
    } catch (error) {
      console.error('Failed to update user stats:', error);
    }
  };

  // Refresh user data
  const refreshUserData = async () => {
    await loadUserData();
  };

  // Leaderboard functionality removed

  const value: FirebaseContextType = {
    userProfile,
    userBadges,
    userTransactions,
    demoProgress,
    currentDemoProgress,
    isLoading,
    isInitialized,
    initializeUser,
    updateDemoProgress,
    completeDemo,
    addTransaction,
    updateUserStats,
    refreshUserData,
  };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
};
