// Firebase Firestore service functions
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  serverTimestamp,
  Timestamp,
  DocumentData,
  QuerySnapshot,
  DocumentSnapshot,
} from 'firebase/firestore';
import { db } from './firebase';
import {
  UserProfile,
  DemoProgress,
  Badge,
  UserBadge,
  Transaction,
  LeaderboardEntry,
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

// User Profile Operations
export const userService = {
  // Create or update user profile
  async createOrUpdateUser(userData: Partial<UserProfile>): Promise<void> {
    const userRef = doc(db, COLLECTIONS.USERS, userData.id!);
    const userDoc = {
      ...userData,
      updatedAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
    };
    await setDoc(userRef, userDoc, { merge: true });
  },

  // Get user profile by wallet address
  async getUserByWalletAddress(walletAddress: string): Promise<UserProfile | null> {
    const userRef = doc(db, COLLECTIONS.USERS, walletAddress);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return convertTimestamps(userSnap.data()) as UserProfile;
    }
    return null;
  },

  // Update user stats
  async updateUserStats(walletAddress: string, stats: Partial<UserProfile['stats']>): Promise<void> {
    const userRef = doc(db, COLLECTIONS.USERS, walletAddress);
    await updateDoc(userRef, {
      'stats': stats,
      updatedAt: serverTimestamp(),
    });
  },

  // Update user preferences
  async updateUserPreferences(walletAddress: string, preferences: Partial<UserProfile['preferences']>): Promise<void> {
    const userRef = doc(db, COLLECTIONS.USERS, walletAddress);
    await updateDoc(userRef, {
      'preferences': preferences,
      updatedAt: serverTimestamp(),
    });
  },
};

// Demo Progress Operations
export const demoProgressService = {
  // Create or update demo progress
  async createOrUpdateProgress(progress: Partial<DemoProgress>): Promise<void> {
    const progressRef = doc(db, COLLECTIONS.DEMO_PROGRESS, `${progress.userId}_${progress.demoId}`);
    const progressDoc = {
      ...progress,
      updatedAt: serverTimestamp(),
    };
    await setDoc(progressRef, progressDoc, { merge: true });
  },

  // Get user's demo progress
  async getUserDemoProgress(userId: string): Promise<DemoProgress[]> {
    const q = query(
      collection(db, COLLECTIONS.DEMO_PROGRESS),
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => 
      convertTimestamps({ id: doc.id, ...doc.data() })
    ) as DemoProgress[];
  },

  // Get specific demo progress
  async getDemoProgress(userId: string, demoId: string): Promise<DemoProgress | null> {
    const progressRef = doc(db, COLLECTIONS.DEMO_PROGRESS, `${userId}_${demoId}`);
    const progressSnap = await getDoc(progressRef);
    
    if (progressSnap.exists()) {
      return convertTimestamps({ id: progressSnap.id, ...progressSnap.data() }) as DemoProgress;
    }
    return null;
  },

  // Update demo step
  async updateDemoStep(userId: string, demoId: string, step: number, status?: DemoProgress['status']): Promise<void> {
    const progressRef = doc(db, COLLECTIONS.DEMO_PROGRESS, `${userId}_${demoId}`);
    const updateData: any = {
      currentStep: step,
      updatedAt: serverTimestamp(),
    };
    
    if (status) {
      updateData.status = status;
      if (status === 'completed') {
        updateData.completedAt = serverTimestamp();
      }
    }
    
    await updateDoc(progressRef, updateData);
  },
};

// Badge Operations
export const badgeService = {
  // Get all available badges
  async getAllBadges(): Promise<Badge[]> {
    const q = query(collection(db, COLLECTIONS.BADGES), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => 
      convertTimestamps({ id: doc.id, ...doc.data() })
    ) as Badge[];
  },

  // Get user's earned badges
  async getUserBadges(userId: string): Promise<UserBadge[]> {
    const q = query(
      collection(db, COLLECTIONS.USER_BADGES),
      where('userId', '==', userId),
      orderBy('earnedAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => 
      convertTimestamps({ id: doc.id, ...doc.data() })
    ) as UserBadge[];
  },

  // Award badge to user
  async awardBadge(userId: string, badgeId: string): Promise<void> {
    const badgeRef = doc(db, COLLECTIONS.USER_BADGES, `${userId}_${badgeId}`);
    await setDoc(badgeRef, {
      userId,
      badgeId,
      earnedAt: serverTimestamp(),
      progress: 100,
      isCompleted: true,
    });
  },

  // Update badge progress
  async updateBadgeProgress(userId: string, badgeId: string, progress: number): Promise<void> {
    const badgeRef = doc(db, COLLECTIONS.USER_BADGES, `${userId}_${badgeId}`);
    await setDoc(badgeRef, {
      userId,
      badgeId,
      progress,
      isCompleted: progress >= 100,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  },
};

// Transaction Operations
export const transactionService = {
  // Create transaction record
  async createTransaction(transaction: Partial<Transaction>): Promise<string> {
    const transactionRef = await addDoc(collection(db, COLLECTIONS.TRANSACTIONS), {
      ...transaction,
      createdAt: serverTimestamp(),
    });
    return transactionRef.id;
  },

  // Update transaction status
  async updateTransactionStatus(transactionId: string, status: Transaction['status']): Promise<void> {
    const transactionRef = doc(db, COLLECTIONS.TRANSACTIONS, transactionId);
    const updateData: any = {
      status,
      updatedAt: serverTimestamp(),
    };
    
    if (status === 'completed') {
      updateData.completedAt = serverTimestamp();
    }
    
    await updateDoc(transactionRef, updateData);
  },

  // Get user transactions
  async getUserTransactions(userId: string, limitCount: number = 50): Promise<Transaction[]> {
    const q = query(
      collection(db, COLLECTIONS.TRANSACTIONS),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => 
      convertTimestamps({ id: doc.id, ...doc.data() })
    ) as Transaction[];
  },

  // Get demo transactions
  async getDemoTransactions(demoId: string): Promise<Transaction[]> {
    const q = query(
      collection(db, COLLECTIONS.TRANSACTIONS),
      where('demoId', '==', demoId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => 
      convertTimestamps({ id: doc.id, ...doc.data() })
    ) as Transaction[];
  },
};

// Leaderboard Operations
export const leaderboardService = {
  // Update leaderboard entry
  async updateLeaderboardEntry(entry: Partial<LeaderboardEntry>): Promise<void> {
    const leaderboardRef = doc(db, COLLECTIONS.LEADERBOARD, entry.userId!);
    await setDoc(leaderboardRef, {
      ...entry,
      lastUpdated: serverTimestamp(),
    }, { merge: true });
  },

  // Get top users
  async getTopUsers(limitCount: number = 10): Promise<LeaderboardEntry[]> {
    const q = query(
      collection(db, COLLECTIONS.LEADERBOARD),
      orderBy('totalXp', 'desc'),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map((doc, index) => 
      convertTimestamps({ 
        id: doc.id, 
        rank: index + 1,
        ...doc.data() 
      })
    ) as LeaderboardEntry[];
  },

  // Get user rank
  async getUserRank(userId: string): Promise<number> {
    const q = query(
      collection(db, COLLECTIONS.LEADERBOARD),
      orderBy('totalXp', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    const docs = querySnapshot.docs;
    const userIndex = docs.findIndex(doc => doc.id === userId);
    
    return userIndex >= 0 ? userIndex + 1 : -1;
  },
};

// Utility functions
export const firebaseUtils = {
  // Check if user exists
  async userExists(walletAddress: string): Promise<boolean> {
    const user = await userService.getUserByWalletAddress(walletAddress);
    return user !== null;
  },

  // Initialize user data
  async initializeUser(walletAddress: string, username: string, walletType: string, walletName: string): Promise<void> {
    const userData: Partial<UserProfile> = {
      id: walletAddress,
      username,
      walletAddress,
      walletType: walletType as UserProfile['walletType'],
      walletName,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLoginAt: new Date(),
      isActive: true,
      preferences: {
        theme: 'auto',
        language: 'en',
        notifications: {
          email: false,
          push: true,
          demoUpdates: true,
          badgeEarned: true,
        },
        privacy: {
          showProfile: true,
          showStats: true,
          showBadges: true,
        },
      },
      stats: {
        totalXp: 0,
        level: 1,
        demosCompleted: 0,
        badgesEarned: 0,
        totalTimeSpent: 0,
        streak: 0,
        lastActivityAt: new Date(),
      },
    };

    await userService.createOrUpdateUser(userData);
  },

  // Calculate user level from XP
  calculateLevel(totalXp: number): number {
    // Simple level calculation: 100 XP per level
    return Math.floor(totalXp / 100) + 1;
  },

  // Calculate XP needed for next level
  calculateXpToNextLevel(totalXp: number): number {
    const currentLevel = this.calculateLevel(totalXp);
    const nextLevelXp = currentLevel * 100;
    return nextLevelXp - totalXp;
  },
};
