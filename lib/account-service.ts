import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  addDoc, 
  query, 
  where, 
  getDocs,
  orderBy,
  limit,
  Timestamp,
  serverTimestamp,
  increment
} from 'firebase/firestore';
import { db } from './firebase';
import { v4 as uuidv4 } from 'uuid';
import { 
  UserAccount, 
  DemoProgress, 
  NFTBadge, 
  Reward, 
  PointsTransaction,
  Achievement 
} from '@/types/account';
import { getBadgeById } from './badge-config';

export class AccountService {
  private static instance: AccountService;
  
  public static getInstance(): AccountService {
    if (!AccountService.instance) {
      AccountService.instance = new AccountService();
    }
    return AccountService.instance;
  }

  // Create new account
  async createAccount(walletAddress: string, publicKey: string, network: string): Promise<UserAccount> {
    console.log('🔄 AccountService: Creating account...');
    console.log('Parameters:', { walletAddress, publicKey, network });
    
    const accountId = uuidv4();
    console.log('Generated UUID:', accountId);
    
    const now = Timestamp.now();
    
    const newAccount: UserAccount = {
      id: accountId,
      walletAddress,
      publicKey,
      network,
      createdAt: now,
      updatedAt: now,
      lastLoginAt: now,
      
      profile: {
        level: 1,
        totalPoints: 100, // Account creation bonus
        experience: 100, // Experience points (same as points for now)
      },
      
      demos: {
        demo1: {
          demoId: 'demo1',
          demoName: 'Baby Steps to Riches',
          status: 'available',
          attempts: 0,
          pointsEarned: 0,
        },
        demo2: {
          demoId: 'demo2',
          demoName: 'Milestone Voting',
          status: 'locked',
          attempts: 0,
          pointsEarned: 0,
        },
        demo3: {
          demoId: 'demo3',
          demoName: 'Dispute Resolution',
          status: 'locked',
          attempts: 0,
          pointsEarned: 0,
        },
        demo4: {
          demoId: 'demo4',
          demoName: 'Micro Task Marketplace',
          status: 'locked',
          attempts: 0,
          pointsEarned: 0,
        },
      },
      
      badges: [
        // Award Trust Guardian badge for account creation
        {
          id: uuidv4(),
          name: 'Trust Guardian',
          description: 'Welcome to the world of trustless work! Your journey begins here.',
          imageUrl: '/images/badges/placeholder-trust-guardian.svg',
          rarity: 'common' as const,
          earnedAt: now,
          pointsValue: 50,
        }
      ],
      rewards: [],
      
      stats: {
        totalDemosCompleted: 0,
        totalPointsEarned: 100, // Account creation bonus
        totalTimeSpent: 0,
        streakDays: 1, // Start with 1 day streak
        lastActiveDate: new Date().toISOString().split('T')[0],
      },
      
      settings: {
        notifications: true,
        publicProfile: false,
        shareProgress: true,
      },
    };

    console.log('📝 Saving account to Firestore...');
    console.log('Account data:', newAccount);
    
    try {
      await setDoc(doc(db, 'accounts', accountId), newAccount);
      console.log('✅ Account saved to Firestore successfully!');
      
      // Log the account creation
      console.log('💰 Adding account creation bonus...');
      await this.logPointsTransaction(accountId, 'bonus', 100, 'Account Creation Bonus');
      console.log('✅ Account creation bonus added!');
      
      console.log('🎉 Account creation completed!');
      return newAccount;
      
    } catch (error) {
      console.error('❌ Error saving to Firestore:', error);
      throw error;
    }
  }

  // Get account by wallet address
  async getAccountByWallet(walletAddress: string): Promise<UserAccount | null> {
    const accountsRef = collection(db, 'accounts');
    const q = query(accountsRef, where('walletAddress', '==', walletAddress));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    return querySnapshot.docs[0].data() as UserAccount;
  }

  // Get account by ID
  async getAccountById(accountId: string): Promise<UserAccount | null> {
    const docRef = doc(db, 'accounts', accountId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }
    
    return docSnap.data() as UserAccount;
  }

  // Update account
  async updateAccount(accountId: string, updates: Partial<UserAccount>): Promise<void> {
    const accountRef = doc(db, 'accounts', accountId);
    await updateDoc(accountRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  }

  // Update last login
  async updateLastLogin(accountId: string): Promise<void> {
    const accountRef = doc(db, 'accounts', accountId);
    await updateDoc(accountRef, {
      lastLoginAt: serverTimestamp(),
      'stats.lastActiveDate': new Date().toISOString().split('T')[0],
    });
  }

  // Start demo
  async startDemo(accountId: string, demoId: string): Promise<void> {
    const accountRef = doc(db, 'accounts', accountId);
    await updateDoc(accountRef, {
      [`demos.${demoId}.status`]: 'in_progress',
      [`demos.${demoId}.lastAttemptedAt`]: serverTimestamp(),
      [`demos.${demoId}.attempts`]: increment(1),
      updatedAt: serverTimestamp(),
    });
  }

  // Complete demo
  async completeDemo(accountId: string, demoId: string, score: number): Promise<void> {
    const pointsEarned = this.calculateDemoPoints(demoId, score);
    
    const accountRef = doc(db, 'accounts', accountId);
    await updateDoc(accountRef, {
      [`demos.${demoId}.status`]: 'completed',
      [`demos.${demoId}.completedAt`]: serverTimestamp(),
      [`demos.${demoId}.score`]: score,
      [`demos.${demoId}.pointsEarned`]: pointsEarned,
      'profile.totalPoints': increment(pointsEarned),
      'profile.experience': increment(pointsEarned * 2), // Experience is 2x points
      'stats.totalDemosCompleted': increment(1),
      'stats.totalPointsEarned': increment(pointsEarned),
      updatedAt: serverTimestamp(),
    });

    // Log points transaction
    await this.logPointsTransaction(accountId, 'earn', pointsEarned, `Completed ${demoId}`, demoId);
    
    // Check for badge rewards
    await this.checkAndAwardBadges(accountId, demoId, score);
    
    // Unlock next demo if applicable
    await this.unlockNextDemo(accountId, demoId);
  }

  // Calculate demo points based on demo and score
  private calculateDemoPoints(demoId: string, score: number): number {
    const basePoints = {
      demo1: 100,
      demo2: 150,
      demo3: 200,
      demo4: 250,
    };
    
    const base = basePoints[demoId as keyof typeof basePoints] || 100;
    const scoreMultiplier = Math.max(0.5, score / 100); // Minimum 50% points
    
    return Math.round(base * scoreMultiplier);
  }

  // Award badge
  async awardBadge(accountId: string, badge: NFTBadge): Promise<void> {
    const accountRef = doc(db, 'accounts', accountId);
    await updateDoc(accountRef, {
      badges: [...badge], // Add to badges array
      'profile.totalPoints': increment(badge.pointsValue),
      updatedAt: serverTimestamp(),
    });

    // Log points transaction
    await this.logPointsTransaction(accountId, 'earn', badge.pointsValue, `Badge: ${badge.name}`);
  }

  // Check and award badges based on demo completion
  private async checkAndAwardBadges(accountId: string, demoId: string, score: number): Promise<void> {
    // Get the account to check which badges are already earned
    const accountDoc = await getDoc(doc(db, 'accounts', accountId));
    const account = accountDoc.data() as UserAccount;
    const earnedBadgeIds = account.badges.map(b => b.name); // Use name to match our badge config
    
    // Map demo IDs to our badge system
    const demoBadgeMapping: { [key: string]: string } = {
      'demo1': 'escrow-expert',
      'hello-milestone': 'escrow-expert',
      'demo2': 'blockchain-pioneer', 
      'milestone-voting': 'blockchain-pioneer',
      'demo3': 'dispute-detective',
      'dispute-resolution': 'dispute-detective',
      'demo4': 'gig-economy-guru',
      'micro-task-marketplace': 'gig-economy-guru',
    };

    const badgeId = demoBadgeMapping[demoId];
    if (!badgeId) {
      console.log(`No badge mapping found for demo: ${demoId}`);
      return;
    }

    const badgeConfig = getBadgeById(badgeId);
    if (!badgeConfig) {
      console.log(`Badge config not found for: ${badgeId}`);
      return;
    }

    // Check if badge is already earned
    if (earnedBadgeIds.includes(badgeConfig.name)) {
      console.log(`Badge ${badgeConfig.name} already earned`);
      return;
    }

    // Create the badge to award
    const badge: NFTBadge = {
      id: uuidv4(),
      name: badgeConfig.name,
      description: badgeConfig.description,
      imageUrl: badgeConfig.imageUrl,
      rarity: badgeConfig.rarity,
      earnedAt: Timestamp.now(),
      demoId,
      pointsValue: badgeConfig.pointsValue,
    };

    await this.awardBadge(accountId, badge);

    // Check for Stellar Champion badge (all demos completed)
    await this.checkStellarChampionBadge(accountId);
  }

  // Check if user deserves Stellar Champion badge
  private async checkStellarChampionBadge(accountId: string): Promise<void> {
    const accountDoc = await getDoc(doc(db, 'accounts', accountId));
    const account = accountDoc.data() as UserAccount;
    
    const earnedBadgeNames = account.badges.map(b => b.name);
    const requiredBadges = ['Escrow Expert', 'Blockchain Pioneer', 'Dispute Detective', 'Gig Economy Guru'];
    
    // Check if all required badges are earned
    const hasAllBadges = requiredBadges.every(badgeName => earnedBadgeNames.includes(badgeName));
    
    if (hasAllBadges && !earnedBadgeNames.includes('Stellar Champion')) {
      const stellarBadgeConfig = getBadgeById('stellar-champion');
      if (stellarBadgeConfig) {
        const badge: NFTBadge = {
          id: uuidv4(),
          name: stellarBadgeConfig.name,
          description: stellarBadgeConfig.description,
          imageUrl: stellarBadgeConfig.imageUrl,
          rarity: stellarBadgeConfig.rarity,
          earnedAt: Timestamp.now(),
          pointsValue: stellarBadgeConfig.pointsValue,
        };

        await this.awardBadge(accountId, badge);
      }
    }
  }

  // Unlock next demo
  private async unlockNextDemo(accountId: string, completedDemoId: string): Promise<void> {
    const nextDemoMap: Record<string, string> = {
      demo1: 'demo2',
      demo2: 'demo3',
      demo3: 'demo4',
    };
    
    const nextDemo = nextDemoMap[completedDemoId];
    if (nextDemo) {
      const accountRef = doc(db, 'accounts', accountId);
      await updateDoc(accountRef, {
        [`demos.${nextDemo}.status`]: 'available',
        updatedAt: serverTimestamp(),
      });
    }
  }

  // Log points transaction
  async logPointsTransaction(
    userId: string, 
    type: 'earn' | 'spend' | 'bonus' | 'penalty',
    amount: number,
    reason: string,
    demoId?: string
  ): Promise<void> {
    console.log('💰 Logging points transaction:', { userId, type, amount, reason, demoId });
    
    // Create transaction object, only including demoId if it's defined
    const transaction: PointsTransaction = {
      id: uuidv4(),
      userId,
      type,
      amount,
      reason,
      timestamp: Timestamp.now(),
    };
    
    // Only add demoId if it's defined (not undefined)
    if (demoId !== undefined && demoId !== null) {
      transaction.demoId = demoId;
    }
    
    try {
      console.log('📝 Adding transaction document to Firestore...');
      console.log('Transaction data being saved:', transaction);
      const docRef = await addDoc(collection(db, 'pointsTransactions'), transaction);
      console.log('✅ Points transaction logged successfully! Doc ID:', docRef.id);
    } catch (error) {
      console.error('❌ Error logging points transaction:', error);
      console.error('Transaction data:', transaction);
      console.error('Firebase error details:', {
        code: (error as any)?.code,
        message: (error as any)?.message,
        details: error
      });
      throw error;
    }
  }

  // Get points transactions for user
  async getPointsTransactions(userId: string, limitCount: number = 50): Promise<PointsTransaction[]> {
    const transactionsRef = collection(db, 'pointsTransactions');
    const q = query(
      transactionsRef,
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as PointsTransaction);
  }

  // Get leaderboard
  async getLeaderboard(limitCount: number = 10): Promise<UserAccount[]> {
    const accountsRef = collection(db, 'accounts');
    const q = query(
      accountsRef,
      orderBy('profile.totalPoints', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as UserAccount);
  }

  // Update profile
  async updateProfile(accountId: string, profileUpdates: Partial<UserAccount['profile']>): Promise<void> {
    const accountRef = doc(db, 'accounts', accountId);
    await updateDoc(accountRef, {
      profile: profileUpdates,
      updatedAt: serverTimestamp(),
    });
  }

  // Update settings
  async updateSettings(accountId: string, settingsUpdates: Partial<UserAccount['settings']>): Promise<void> {
    const accountRef = doc(db, 'accounts', accountId);
    await updateDoc(accountRef, {
      settings: settingsUpdates,
      updatedAt: serverTimestamp(),
    });
  }
}

// Export singleton instance
export const accountService = AccountService.getInstance();
