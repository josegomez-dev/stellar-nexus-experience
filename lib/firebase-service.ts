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
  DemoStats,
  DemoClap,
  DemoFeedback,
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

// Demo Stats Operations
export const demoStatsService = {
  // Get demo stats by demo ID
  async getDemoStats(demoId: string): Promise<DemoStats | null> {
    const statsRef = doc(db, COLLECTIONS.DEMO_STATS, demoId);
    const statsSnap = await getDoc(statsRef);
    
    if (statsSnap.exists()) {
      return convertTimestamps({ id: statsSnap.id, ...statsSnap.data() }) as DemoStats;
    }
    return null;
  },

  // Get all demo stats
  async getAllDemoStats(): Promise<DemoStats[]> {
    const q = query(
      collection(db, COLLECTIONS.DEMO_STATS),
      orderBy('totalCompletions', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => 
      convertTimestamps({ id: doc.id, ...doc.data() })
    ) as DemoStats[];
  },

  // Initialize demo stats (create if not exists)
  async initializeDemoStats(demoId: string, demoName: string): Promise<void> {
    const statsRef = doc(db, COLLECTIONS.DEMO_STATS, demoId);
    const statsSnap = await getDoc(statsRef);
    
    if (!statsSnap.exists()) {
      await setDoc(statsRef, {
        id: demoId,
        demoId,
        demoName,
        totalCompletions: 0,
        totalClaps: 0,
        averageRating: 0,
        totalRatings: 0,
        averageCompletionTime: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
  },

  // Increment demo completion count
  async incrementCompletion(demoId: string, completionTime: number): Promise<void> {
    const statsRef = doc(db, COLLECTIONS.DEMO_STATS, demoId);
    const statsSnap = await getDoc(statsRef);
    
    if (statsSnap.exists()) {
      const currentStats = statsSnap.data() as DemoStats;
      const newTotalCompletions = currentStats.totalCompletions + 1;
      const newAverageTime = ((currentStats.averageCompletionTime * currentStats.totalCompletions) + completionTime) / newTotalCompletions;
      
      await updateDoc(statsRef, {
        totalCompletions: newTotalCompletions,
        averageCompletionTime: newAverageTime,
        updatedAt: serverTimestamp(),
      });
    }
  },

  // Increment demo clap count
  async incrementClaps(demoId: string): Promise<void> {
    const statsRef = doc(db, COLLECTIONS.DEMO_STATS, demoId);
    const statsSnap = await getDoc(statsRef);
    
    if (statsSnap.exists()) {
      const currentStats = statsSnap.data() as DemoStats;
      await updateDoc(statsRef, {
        totalClaps: currentStats.totalClaps + 1,
        updatedAt: serverTimestamp(),
      });
    }
  },

  // Update demo rating
  async updateRating(demoId: string, newRating: number): Promise<void> {
    const statsRef = doc(db, COLLECTIONS.DEMO_STATS, demoId);
    const statsSnap = await getDoc(statsRef);
    
    if (statsSnap.exists()) {
      const currentStats = statsSnap.data() as DemoStats;
      const newTotalRatings = currentStats.totalRatings + 1;
      const newAverageRating = ((currentStats.averageRating * currentStats.totalRatings) + newRating) / newTotalRatings;
      
      await updateDoc(statsRef, {
        averageRating: newAverageRating,
        totalRatings: newTotalRatings,
        updatedAt: serverTimestamp(),
      });
    }
  },
};

// Demo Claps Operations
export const demoClapService = {
  // Add clap for demo
  async addClap(userId: string, demoId: string): Promise<void> {
    const clapId = `${userId}_${demoId}`;
    const clapRef = doc(db, COLLECTIONS.DEMO_CLAPS, clapId);
    
    // Check if user already clapped
    const clapSnap = await getDoc(clapRef);
    if (clapSnap.exists()) {
      throw new Error('User has already clapped for this demo');
    }
    
    // Add clap record
    await setDoc(clapRef, {
      id: clapId,
      userId,
      demoId,
      createdAt: serverTimestamp(),
    });
    
    // Increment clap count in demo stats
    await demoStatsService.incrementClaps(demoId);
  },

  // Check if user has clapped for demo
  async hasUserClapped(userId: string, demoId: string): Promise<boolean> {
    const clapId = `${userId}_${demoId}`;
    const clapRef = doc(db, COLLECTIONS.DEMO_CLAPS, clapId);
    const clapSnap = await getDoc(clapRef);
    
    return clapSnap.exists();
  },

  // Get all claps for a demo
  async getDemoClaps(demoId: string): Promise<DemoClap[]> {
    const q = query(
      collection(db, COLLECTIONS.DEMO_CLAPS),
      where('demoId', '==', demoId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => 
      convertTimestamps({ id: doc.id, ...doc.data() })
    ) as DemoClap[];
  },

  // Get user's claps
  async getUserClaps(userId: string): Promise<DemoClap[]> {
    const q = query(
      collection(db, COLLECTIONS.DEMO_CLAPS),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => 
      convertTimestamps({ id: doc.id, ...doc.data() })
    ) as DemoClap[];
  },
};

// Demo Feedback Operations
export const demoFeedbackService = {
  // Submit feedback for demo
  async submitFeedback(feedback: Partial<DemoFeedback>): Promise<string> {
    const feedbackRef = await addDoc(collection(db, COLLECTIONS.DEMO_FEEDBACK), {
      ...feedback,
      createdAt: serverTimestamp(),
    });
    
    // Update demo rating in stats
    if (feedback.rating && feedback.demoId) {
      await demoStatsService.updateRating(feedback.demoId, feedback.rating);
    }
    
    return feedbackRef.id;
  },

  // Get feedback for a demo
  async getDemoFeedback(demoId: string, limitCount: number = 50): Promise<DemoFeedback[]> {
    const q = query(
      collection(db, COLLECTIONS.DEMO_FEEDBACK),
      where('demoId', '==', demoId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => 
      convertTimestamps({ id: doc.id, ...doc.data() })
    ) as DemoFeedback[];
  },

  // Get user's feedback
  async getUserFeedback(userId: string): Promise<DemoFeedback[]> {
    const q = query(
      collection(db, COLLECTIONS.DEMO_FEEDBACK),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => 
      convertTimestamps({ id: doc.id, ...doc.data() })
    ) as DemoFeedback[];
  },

  // Check if user has submitted feedback for demo
  async hasUserSubmittedFeedback(userId: string, demoId: string): Promise<boolean> {
    const q = query(
      collection(db, COLLECTIONS.DEMO_FEEDBACK),
      where('userId', '==', userId),
      where('demoId', '==', demoId),
      limit(1)
    );
    const querySnapshot = await getDocs(q);
    
    return !querySnapshot.empty;
  },

  // Get feedback statistics for a demo
  async getFeedbackStats(demoId: string): Promise<{
    totalFeedback: number;
    averageRating: number;
    difficultyBreakdown: Record<string, number>;
    recommendationRate: number;
  }> {
    const feedback = await this.getDemoFeedback(demoId, 1000); // Get more for stats
    
    if (feedback.length === 0) {
      return {
        totalFeedback: 0,
        averageRating: 0,
        difficultyBreakdown: {},
        recommendationRate: 0,
      };
    }
    
    const totalRating = feedback.reduce((sum, f) => sum + f.rating, 0);
    const averageRating = totalRating / feedback.length;
    
    const difficultyBreakdown = feedback.reduce((acc, f) => {
      acc[f.difficulty] = (acc[f.difficulty] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const recommendCount = feedback.filter(f => f.wouldRecommend).length;
    const recommendationRate = (recommendCount / feedback.length) * 100;
    
    return {
      totalFeedback: feedback.length,
      averageRating,
      difficultyBreakdown,
      recommendationRate,
    };
  },
};
