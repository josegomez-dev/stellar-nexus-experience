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
  increment,
  arrayUnion
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
        totalPoints: 150, // Account creation bonus (100) + Trust Guardian (50)
        experience: 150, // Experience points (same as points for now)
      },
      
      demos: {
        demo1: {
          demoId: 'demo1',
          demoName: 'Baby Steps to Riches',
          status: 'locked',
          attempts: 0,
          pointsEarned: 0,
        },
        'hello-milestone': {
          demoId: 'hello-milestone',
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
        'milestone-voting': {
          demoId: 'milestone-voting',
          demoName: 'Democracy in Action',
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
        'dispute-resolution': {
          demoId: 'dispute-resolution',
          demoName: 'Drama Queen Escrow',
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
        'micro-task-marketplace': {
          demoId: 'micro-task-marketplace',
          demoName: 'Gig Economy Madness',
          status: 'locked',
          attempts: 0,
          pointsEarned: 0,
        },
      },
      
      badges: [
        // Award Trust Guardian badge for account creation with 100+ bonus points
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
        totalPointsEarned: 150, // Account creation bonus (100) + Trust Guardian (50)
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
      
      // Log the account creation and badge rewards
      console.log('💰 Adding account creation bonus...');
      await this.logPointsTransaction(accountId, 'bonus', 100, 'Account Creation Bonus');
      console.log('✅ Account creation bonus added!');
      
      console.log('🏆 Adding Trust Guardian badge reward...');
      await this.logPointsTransaction(accountId, 'earn', 50, 'Badge: Trust Guardian');
      console.log('✅ Trust Guardian badge reward added!');
      
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
    // Get current account state to check if this is first completion
    const accountDoc = await getDoc(doc(db, 'accounts', accountId));
    const account = accountDoc.data() as UserAccount;
    
    const currentDemo = account.demos[demoId as keyof typeof account.demos];
    const isFirstCompletion = currentDemo?.status !== 'completed';
    
    const pointsEarned = this.calculateDemoPoints(demoId, score, isFirstCompletion);
    
    const updateData: any = {
      [`demos.${demoId}.status`]: 'completed',
      [`demos.${demoId}.completedAt`]: serverTimestamp(),
      [`demos.${demoId}.score`]: score,
      [`demos.${demoId}.pointsEarned`]: isFirstCompletion ? pointsEarned : currentDemo.pointsEarned, // Keep original points on replay
      'profile.totalPoints': increment(pointsEarned),
      'profile.experience': increment(pointsEarned * 2), // Experience is 2x points
      'stats.totalPointsEarned': increment(pointsEarned),
      updatedAt: serverTimestamp(),
    };

    // Only increment completed demos count on first completion
    if (isFirstCompletion) {
      updateData['stats.totalDemosCompleted'] = increment(1);
    }

    const accountRef = doc(db, 'accounts', accountId);
    await updateDoc(accountRef, updateData);

    // Log points transaction
    const transactionReason = isFirstCompletion 
      ? `Completed ${demoId}` 
      : `Replay bonus for ${demoId}`;
    await this.logPointsTransaction(accountId, 'earn', pointsEarned, transactionReason, demoId);
    
    // Only check for badge rewards on first completion
    if (isFirstCompletion) {
      await this.checkAndAwardBadges(accountId, demoId, score);
      // Unlock next demo if applicable
      await this.unlockNextDemo(accountId, demoId);
    }
  }

  // Calculate demo points based on demo and score
  private calculateDemoPoints(demoId: string, score: number, isFirstCompletion: boolean = true): number {
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
    const scoreMultiplier = Math.max(0.5, score / 100); // Minimum 50% points
    
    let points = Math.round(base * scoreMultiplier);
    
    // Give reduced points for replays (25% of original)
    if (!isFirstCompletion) {
      points = Math.round(points * 0.25);
    }
    
    return points;
  }

  // Award badge
  async awardBadge(accountId: string, badge: NFTBadge): Promise<void> {
    const accountRef = doc(db, 'accounts', accountId);
    await updateDoc(accountRef, {
      badges: arrayUnion(badge), // Add to badges array
      'profile.totalPoints': increment(badge.pointsValue),
      updatedAt: serverTimestamp(),
    });

    // Log points transaction
    await this.logPointsTransaction(accountId, 'earn', badge.pointsValue, `Badge: ${badge.name}`);
  }

  // Check and award badges based on demo completion order
  private async checkAndAwardBadges(accountId: string, demoId: string, score: number): Promise<void> {
    // Get the account to check current state
    const accountDoc = await getDoc(doc(db, 'accounts', accountId));
    const account = accountDoc.data() as UserAccount;
    const earnedBadgeNames = account.badges.map(b => b.name);
    
    // Count how many main demos have been completed (including this one)
    const mainDemoProgress = this.getMainDemoCompletionCount(account);
    const totalCompletedDemos = mainDemoProgress.completed;
    
    // Progressive badge awarding based on completion order:
    // 1st Demo → Escrow Expert
    // 2nd Demo → Blockchain Pioneer  
    // 3rd Demo → Dispute Detective
    // 4th Demo → Gig Economy Guru
    const progressiveBadges = [
      'escrow-expert',      // 1st demo completed
      'blockchain-pioneer', // 2nd demo completed
      'dispute-detective',  // 3rd demo completed
      'gig-economy-guru'    // 4th demo completed
    ];
    
    // Award badge based on completion count
    if (totalCompletedDemos > 0 && totalCompletedDemos <= 4) {
      const badgeId = progressiveBadges[totalCompletedDemos - 1];
      const badgeConfig = getBadgeById(badgeId);
      
      if (!badgeConfig) {
        console.log(`Badge config not found for: ${badgeId}`);
        return;
      }

      // Check if badge is already earned
      if (earnedBadgeNames.includes(badgeConfig.name)) {
        console.log(`Badge ${badgeConfig.name} already earned`);
        return;
      }

      // Create the badge to award
      const badge: NFTBadge = {
        id: uuidv4(),
        name: badgeConfig.name,
        description: badgeConfig.description,
        imageUrl: badgeConfig.imageUrl || '',
        rarity: badgeConfig.rarity,
        earnedAt: Timestamp.now(),
        demoId,
        pointsValue: badgeConfig.pointsValue,
      };

      console.log(`🏆 Awarding badge: ${badge.name} (${totalCompletedDemos} demos completed)`);
      await this.awardBadge(accountId, badge);
      
      // Check for Stellar Champion badge (all 4 demos completed)
      if (totalCompletedDemos === 4) {
        await this.checkStellarChampionBadge(accountId);
      }
    }
  }

  // Check if user deserves Stellar Champion badge (all 4 demos completed + invite friend)
  private async checkStellarChampionBadge(accountId: string): Promise<void> {
    const accountDoc = await getDoc(doc(db, 'accounts', accountId));
    const account = accountDoc.data() as UserAccount;
    
    const earnedBadgeNames = account.badges.map(b => b.name);
    
    // Check if all 4 demos are completed
    const mainDemoProgress = this.getMainDemoCompletionCount(account);
    const allDemosCompleted = mainDemoProgress.completed === 4;
    
    // TODO: Add invite friend check when invite system is implemented
    const hasInvitedFriend = true; // For now, award when all demos are completed
    
    if (allDemosCompleted && hasInvitedFriend && !earnedBadgeNames.includes('Stellar Champion')) {
      const stellarBadgeConfig = getBadgeById('stellar-champion');
      if (stellarBadgeConfig) {
        const badge: NFTBadge = {
          id: uuidv4(),
          name: stellarBadgeConfig.name,
          description: stellarBadgeConfig.description,
          imageUrl: stellarBadgeConfig.imageUrl || '',
          rarity: stellarBadgeConfig.rarity,
          earnedAt: Timestamp.now(),
          pointsValue: stellarBadgeConfig.pointsValue,
        };

        console.log(`🌟 Awarding Stellar Champion badge! All demos completed.`);
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

  // Get main demo completion count (only the 4 main demos)
  getMainDemoCompletionCount(account: UserAccount): { completed: number, total: number } {
    const mainDemos = ['hello-milestone', 'milestone-voting', 'dispute-resolution', 'micro-task-marketplace'];
    
    const completedCount = mainDemos.filter(demoId => 
      account.demos[demoId as keyof typeof account.demos]?.status === 'completed'
    ).length;
    
    return {
      completed: completedCount,
      total: 4
    };
  }
}

// Export singleton instance
export const accountService = AccountService.getInstance();
