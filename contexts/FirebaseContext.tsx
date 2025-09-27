// Firebase context for managing user data and database operations
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useGlobalWallet } from './WalletContext';
import { 
  accountService,
  firebaseUtils
} from '../lib/firebase-service';
import { 
  Account,
  PREDEFINED_DEMOS,
  PREDEFINED_BADGES,
  getBadgeById
} from '../lib/firebase-types';
import { useBadgeAnimation } from './BadgeAnimationContext';
import { useToast } from './ToastContext';

interface FirebaseContextType {
  // Account data
  account: Account | null;
  
  // Static data
  demos: typeof PREDEFINED_DEMOS;
  badges: typeof PREDEFINED_BADGES;
  
  // Loading states
  isLoading: boolean;
  isInitialized: boolean;
  
  // Actions
  initializeAccount: (displayName: string) => Promise<void>;
  completeDemo: (demoId: string, score?: number) => Promise<void>;
  hasBadge: (badgeId: string) => Promise<boolean>;
  hasCompletedDemo: (demoId: string) => Promise<boolean>;
  refreshAccountData: () => Promise<void>;
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
  const { showBadgeAnimation } = useBadgeAnimation();
  const { addToast } = useToast();
  
  // State
  const [account, setAccount] = useState<Account | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize account data when wallet connects
  useEffect(() => {
    const initializeFirebase = async () => {
      if (!walletData?.publicKey) return;
      
      setIsLoading(true);
      try {
        // Check if account exists
        const existingAccount = await accountService.getAccountByWalletAddress(walletData.publicKey);
        
        if (!existingAccount) {
          // Create new account
          await firebaseUtils.createAccount(
            walletData.publicKey,
            user?.username || 'Anonymous User',
            walletData.network || 'testnet'
          );
          
          // Award Welcome Explorer badge for new account
          await accountService.addEarnedBadge(walletData.publicKey, 'welcome_explorer');
          
          // Add experience and points for account creation
          await accountService.addExperienceAndPoints(walletData.publicKey, 20, 10);
          
          // Show Welcome badge animation
          const welcomeBadge = getBadgeById('welcome_explorer');
          if (welcomeBadge) {
            showBadgeAnimation({
              ...welcomeBadge,
              createdAt: new Date(),
            }, welcomeBadge.earningPoints);
          }
        } else {
          // Update last login
          await accountService.createOrUpdateAccount({
            id: walletData.publicKey,
            lastLoginAt: new Date(),
          });
        }
        
        // Load account data
        await loadAccountData();
        setIsInitialized(true);
      } catch (error) {
        addToast({
          title: 'Error',
          message: 'Failed to initialize account.',
          type: 'error',
        });
      } finally {
        setIsLoading(false);
      }
    };

    initializeFirebase();
  }, [walletData?.publicKey, user?.username, addToast]);

  // Load account data
  const loadAccountData = async () => {
    if (!walletData?.publicKey) return;
    
    try {
      const accountData = await accountService.getAccountByWalletAddress(walletData.publicKey);
      setAccount(accountData);
    } catch (error) {
      console.error('Error loading account data:', error);
      addToast({
        title: 'Error',
        message: 'Failed to load account data.',
        type: 'error',
      });
    }
  };

  // Initialize account (called from AuthModal)
  const initializeAccount = async (displayName: string) => {
    if (!walletData?.publicKey) throw new Error('Wallet not connected');
    
    setIsLoading(true);
    try {
      // Check if account already exists
      const existingAccount = await accountService.getAccountByWalletAddress(walletData.publicKey);
      
      if (!existingAccount) {
        // Create new account
        await firebaseUtils.createAccount(
          walletData.publicKey,
          displayName,
          walletData.network || 'testnet'
        );
        
        // Award Welcome Explorer badge for new account
        await accountService.addEarnedBadge(walletData.publicKey, 'welcome_explorer');
        
        // Add experience and points for account creation
        await accountService.addExperienceAndPoints(walletData.publicKey, 20, 10);
        
        // Show Welcome badge animation
        const welcomeBadge = getBadgeById('welcome_explorer');
        if (welcomeBadge) {
          showBadgeAnimation({
            ...welcomeBadge,
            createdAt: new Date(),
          }, welcomeBadge.earningPoints);
        }
        
        addToast({
          title: 'Welcome!',
          message: `Account created for ${displayName}. You earned the Welcome Explorer badge!`,
          type: 'success',
        });
      } else {
        // Account already exists, just update last login
        await accountService.createOrUpdateAccount({
          id: walletData.publicKey,
          lastLoginAt: new Date(),
        });
        
        addToast({
          title: 'Welcome Back!',
          message: `Welcome back, ${displayName}!`,
          type: 'success',
        });
      }
      
      await loadAccountData();
      setIsInitialized(true);
    } catch (error) {
      addToast({
        title: 'Error',
        message: 'Failed to create account.',
        type: 'error',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Complete demo
  const completeDemo = async (demoId: string, score?: number) => {
    if (!walletData?.publicKey || !account) return;
    
    try {
      console.log('FirebaseContext: Starting completeDemo for:', demoId, 'with score:', score);
      
      // Handle both array and object formats for demosCompleted (Firebase sometimes stores arrays as objects)
      let demosCompletedArray: string[] = [];
      if (Array.isArray(account.demosCompleted)) {
        demosCompletedArray = account.demosCompleted;
      } else if (account.demosCompleted && typeof account.demosCompleted === 'object') {
        demosCompletedArray = Object.values(account.demosCompleted);
      }
      
      // Check if demo already completed
      if (demosCompletedArray.includes(demoId)) {
        console.log('FirebaseContext: Demo already completed, skipping');
        return;
      }

      // Calculate points based on score (default 100 if no score provided)
      const basePoints = 100;
      const finalScore = score || 85; // Default score if not provided
      const scoreMultiplier = Math.max(0.5, finalScore / 100);
      const pointsEarned = Math.round(basePoints * scoreMultiplier);
      
      // Add demo to completed list in account (but not for nexus-master as it's not a real demo)
      if (demoId !== 'nexus-master') {
        console.log('FirebaseContext: Adding demo to completed list:', demoId);
        await accountService.addCompletedDemo(walletData.publicKey, demoId);
      }
      
      // Add experience and points (experience is 2x points)
      console.log('FirebaseContext: Adding experience and points:', pointsEarned * 2, pointsEarned);
      await accountService.addExperienceAndPoints(walletData.publicKey, pointsEarned * 2, pointsEarned);
      
      // Award appropriate badge based on demo
      let badgeToAward = '';
      switch (demoId) {
        case 'hello-milestone':
          badgeToAward = 'escrow_expert';
          break;
        case 'dispute-resolution':
          badgeToAward = 'trust_guardian';
          break;
        case 'micro-marketplace':
          badgeToAward = 'stellar_champion';
          break;
        case 'nexus-master':
          badgeToAward = 'nexus_master';
          break;
      }
      
      if (badgeToAward) {
        console.log('FirebaseContext: Awarding badge:', badgeToAward);
        await accountService.addEarnedBadge(walletData.publicKey, badgeToAward);
        
        // Show badge animation
        const badge = getBadgeById(badgeToAward);
        if (badge) {
          showBadgeAnimation({
            ...badge,
            createdAt: new Date(),
          }, badge.earningPoints);
        }
      }

      // Check if all 3 demos completed to unlock Nexus Master demo card
      const updatedAccount = await accountService.getAccountByWalletAddress(walletData.publicKey);
      
      // Handle both array and object formats for demosCompleted
      let updatedDemosCompletedArray: string[] = [];
      if (Array.isArray(updatedAccount?.demosCompleted)) {
        updatedDemosCompletedArray = updatedAccount.demosCompleted;
      } else if (updatedAccount?.demosCompleted && typeof updatedAccount.demosCompleted === 'object') {
        updatedDemosCompletedArray = Object.values(updatedAccount.demosCompleted);
      }
      
      if (updatedAccount && updatedDemosCompletedArray.length === 3) {
        console.log('FirebaseContext: All 3 demos completed, Nexus Master demo card should now be unlocked');
        // Note: Nexus Master badge is NOT auto-awarded here
        // It will only be awarded when user manually claims it from the 4th demo card
      }
      
      // Refresh account data
      console.log('FirebaseContext: Refreshing account data');
      await loadAccountData();
      console.log('FirebaseContext: Demo completion process finished successfully');
    } catch (error) {
      console.error('FirebaseContext: Demo completion failed:', error);
      addToast({
        title: 'Error',
        message: 'Failed to complete demo.',
        type: 'error',
      });
    }
  };

  // Check if account has badge
  const hasBadge = async (badgeId: string): Promise<boolean> => {
    if (!walletData?.publicKey) return false;
    
    try {
      return await accountService.hasBadge(walletData.publicKey, badgeId);
    } catch (error) {
      return false;
    }
  };

  // Check if account has completed demo
  const hasCompletedDemo = async (demoId: string): Promise<boolean> => {
    if (!walletData?.publicKey) return false;
    
    try {
      return await accountService.hasCompletedDemo(walletData.publicKey, demoId);
    } catch (error) {
      return false;
    }
  };

  // Refresh account data
  const refreshAccountData = async () => {
    await loadAccountData();
  };

  const value: FirebaseContextType = {
    account,
    demos: PREDEFINED_DEMOS,
    badges: PREDEFINED_BADGES,
    isLoading,
    isInitialized,
    initializeAccount,
    completeDemo,
    hasBadge,
    hasCompletedDemo,
    refreshAccountData,
  };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
};
