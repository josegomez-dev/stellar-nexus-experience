// Firebase Firestore service functions
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import {
  Account,
  COLLECTIONS,
} from './firebase-types';

// Helper function to convert Firestore timestamps to Date objects
const convertTimestamps = (data: any): any => {
  if (!data) return data;
  
  const converted = { ...data };
  Object.keys(converted).forEach(key => {
    if (converted[key] instanceof Timestamp) {
      converted[key] = converted[key].toDate();
    } else if (typeof converted[key] === 'object' && converted[key] !== null) {
      converted[key] = convertTimestamps(converted[key]);
    }
  });
  return converted;
};

// Account Service - Single service for all account operations
export const accountService = {
  // Create or update account
  async createOrUpdateAccount(accountData: Partial<Account>): Promise<void> {
    const accountRef = doc(db, COLLECTIONS.ACCOUNTS, accountData.id!);
    const accountDoc = {
      ...accountData,
      updatedAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
    };
    await setDoc(accountRef, accountDoc, { merge: true });
  },

  // Get account by wallet address
  async getAccountByWalletAddress(walletAddress: string): Promise<Account | null> {
    const accountRef = doc(db, COLLECTIONS.ACCOUNTS, walletAddress);
    const accountSnap = await getDoc(accountRef);
    
    if (accountSnap.exists()) {
      return convertTimestamps(accountSnap.data()) as Account;
    }
    return null;
  },

  // Update account progress
  async updateAccountProgress(walletAddress: string, progress: Partial<Pick<Account, 'level' | 'experience' | 'totalPoints' | 'demosCompleted' | 'badgesEarned'>>): Promise<void> {
    const accountRef = doc(db, COLLECTIONS.ACCOUNTS, walletAddress);
    await updateDoc(accountRef, {
      ...progress,
      updatedAt: serverTimestamp(),
    });
  },

  // Add completed demo
  async addCompletedDemo(walletAddress: string, demoId: string): Promise<void> {
    const account = await this.getAccountByWalletAddress(walletAddress);
    if (account) {
      let currentDemosCompleted: string[] = [];
      
      if (Array.isArray(account.demosCompleted)) {
        currentDemosCompleted = account.demosCompleted;
      } else if (account.demosCompleted && typeof account.demosCompleted === 'object') {
        // Convert object to array (Firebase sometimes stores arrays as objects)
        currentDemosCompleted = Object.values(account.demosCompleted);
      }
      
      if (!currentDemosCompleted.includes(demoId)) {
        const updatedDemosCompleted = [...currentDemosCompleted, demoId];
        await this.updateAccountProgress(walletAddress, {
          demosCompleted: updatedDemosCompleted,
        });
      }
    }
  },

  // Add earned badge
  async addEarnedBadge(walletAddress: string, badgeId: string): Promise<void> {
    const account = await this.getAccountByWalletAddress(walletAddress);
    if (account) {
      let currentBadgesEarned: string[] = [];
      
      if (Array.isArray(account.badgesEarned)) {
        currentBadgesEarned = account.badgesEarned;
      } else if (account.badgesEarned && typeof account.badgesEarned === 'object') {
        // Convert object to array (Firebase sometimes stores arrays as objects)
        currentBadgesEarned = Object.values(account.badgesEarned);
      }
      
      if (!currentBadgesEarned.includes(badgeId)) {
        const updatedBadgesEarned = [...currentBadgesEarned, badgeId];
        await this.updateAccountProgress(walletAddress, {
          badgesEarned: updatedBadgesEarned,
        });
      }
    }
  },

  // Add experience and points
  async addExperienceAndPoints(walletAddress: string, experience: number, points: number): Promise<void> {
    const account = await this.getAccountByWalletAddress(walletAddress);
    if (account) {
      const newExperience = account.experience + experience;
      const newTotalPoints = account.totalPoints + points;
      const newLevel = Math.floor(newExperience / 1000) + 1;
      
      await this.updateAccountProgress(walletAddress, {
        experience: newExperience,
        totalPoints: newTotalPoints,
        level: newLevel,
      });
    }
  },

  // Check if account has badge
  async hasBadge(walletAddress: string, badgeId: string): Promise<boolean> {
    const account = await this.getAccountByWalletAddress(walletAddress);
    return account && account.badgesEarned && Array.isArray(account.badgesEarned) 
      ? account.badgesEarned.includes(badgeId) 
      : false;
  },

  // Check if account has completed demo
  async hasCompletedDemo(walletAddress: string, demoId: string): Promise<boolean> {
    const account = await this.getAccountByWalletAddress(walletAddress);
    return account && account.demosCompleted && Array.isArray(account.demosCompleted) 
      ? account.demosCompleted.includes(demoId) 
      : false;
  },
};

// Firebase Utility Functions

// Utility functions
export const firebaseUtils = {
  // Calculate level from experience (1000 XP per level)
  calculateLevel(experience: number): number {
    return Math.floor(experience / 1000) + 1;
  },

  // Create account
  async createAccount(walletAddress: string, displayName: string, network: string = 'testnet'): Promise<void> {
    const accountData: Partial<Account> = {
      id: walletAddress,
      displayName,
      walletAddress,
      network,
      level: 1,
      experience: 0,
      totalPoints: 0,
      demosCompleted: [],
      badgesEarned: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLoginAt: new Date(),
    };

    await accountService.createOrUpdateAccount(accountData);
  },
};
