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
  arrayUnion,
} from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { v4 as uuidv4 } from 'uuid';
import { UserAccount } from '@/utils/types/account';
import { getBadgeById } from '../firebase/firebase-types';
// Removed unused service imports

export class AccountService {
  private static instance: AccountService;

  public static getInstance(): AccountService {
    if (!AccountService.instance) {
      AccountService.instance = new AccountService();
    }
    return AccountService.instance;
  }

  // Create new account
  async createAccount(
    walletAddress: string,
    publicKey: string,
    network: string
  ): Promise<UserAccount> {
    const accountId = uuidv4();

    const now = Timestamp.now();

    const newAccount: UserAccount = {
      id: accountId,
      walletAddress,
      publicKey,
      network,
      createdAt: now,
      updatedAt: now,
      lastLoginAt: now,
      level: 1, // Root level for backward compatibility
      experience: 150, // Experience points
      totalPoints: 150, // Account creation bonus (100) + Welcome Explorer (10) + margin

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
        'micro-marketplace': {
          demoId: 'micro-marketplace',
          demoName: 'Gig Economy Madness',
          status: 'locked',
          attempts: 0,
          pointsEarned: 0,
        },
      },

      badges: [
        // Award Welcome Explorer badge for account creation
        {
          id: uuidv4(),
          name: 'Welcome Explorer',
          description: 'Joined the Nexus Experience community',
          imageUrl: '🌟',
          rarity: 'common' as const,
          earnedAt: now,
          pointsValue: 10,
        },
      ],
      rewards: [],

      stats: {
        totalDemosCompleted: 0,
        totalPointsEarned: 110, // Account creation bonus (100) + Welcome Explorer (10)
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

    await setDoc(doc(db, 'accounts', accountId), newAccount);

    // Log the account creation and badge rewards
    await this.logPointsTransaction(accountId, 'bonus', 100, 'Account Creation Bonus');

    await this.logPointsTransaction(accountId, 'earn', 10, 'Badge: Welcome Explorer');

    return newAccount;
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
    
    // Calculate new experience and level
    const currentExperience = account.profile?.experience || account.experience || 0;
    const experienceGained = pointsEarned * 2; // Experience is 2x points
    const newExperience = currentExperience + experienceGained;
    const newLevel = Math.floor(newExperience / 1000) + 1;

    const updateData: any = {
      [`demos.${demoId}.status`]: 'completed',
      [`demos.${demoId}.completedAt`]: serverTimestamp(),
      [`demos.${demoId}.score`]: score,
      [`demos.${demoId}.pointsEarned`]: isFirstCompletion ? pointsEarned : currentDemo.pointsEarned, // Keep original points on replay
      'profile.totalPoints': increment(pointsEarned),
      'profile.experience': increment(experienceGained),
      'profile.level': newLevel, // Update level in profile
      level: newLevel, // Update level at root for backward compatibility
      experience: newExperience, // Update experience at root for backward compatibility
      totalPoints: increment(pointsEarned), // Update totalPoints at root for backward compatibility
      'stats.totalPointsEarned': increment(pointsEarned),
      updatedAt: serverTimestamp(),
    };

    // Only increment completed demos count on first completion
    if (isFirstCompletion) {
      updateData['stats.totalDemosCompleted'] = increment(1);
    }

    const accountRef = doc(db, 'accounts', accountId);
    await updateDoc(accountRef, updateData);

    // Log points transaction (only if not already completed to prevent duplicates)
    if (isFirstCompletion || !currentDemo?.pointsEarned) {
      const transactionReason = isFirstCompletion
        ? `Completed ${demoId}`
        : `Replay bonus for ${demoId}`;
      await this.logPointsTransaction(accountId, 'earn', pointsEarned, transactionReason, demoId);
    }

    // Demo progress is tracked separately by markDemoComplete to avoid duplicates

    // Only check for badge rewards on first completion
    if (isFirstCompletion) {
      await this.checkAndAwardBadges(accountId, demoId, score);
      // Unlock next demo if applicable
      await this.unlockNextDemo(accountId, demoId);
    }
  }

  // Get demo name by demo ID
  private getDemoName(demoId: string): string {
    const demoNames: Record<string, string> = {
      'hello-milestone': 'Baby Steps to Riches',
      'milestone-voting': 'Democracy in Action',
      'dispute-resolution': 'Drama Queen Escrow',
      'micro-marketplace': 'Gig Economy Madness',
      demo1: 'Baby Steps to Riches',
      demo2: 'Democracy in Action',
      demo3: 'Drama Queen Escrow',
      demo4: 'Gig Economy Madness',
    };
    return demoNames[demoId] || 'Unknown Demo';
  }

  // Calculate demo points based on demo and score
  private calculateDemoPoints(
    demoId: string,
    score: number,
    isFirstCompletion: boolean = true
  ): number {
    const basePoints = {
      demo1: 100,
      'hello-milestone': 100,
      demo2: 150,
      'milestone-voting': 150,
      demo3: 200,
      'dispute-resolution': 200,
      demo4: 250,
      'micro-marketplace': 250,
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
  async awardBadge(accountId: string, badgeId: string): Promise<void> {
    const badge = getBadgeById(badgeId);
    const badgePoints = badge?.earningPoints || 0;
    
    // Get current account to calculate new level
    const accountDoc = await getDoc(doc(db, 'accounts', accountId));
    const account = accountDoc.data() as UserAccount;
    
    // Calculate new experience and level (badges give points but experience is 2x points)
    const currentExperience = account.profile?.experience || account.experience || 0;
    const experienceGained = badgePoints * 2; // Experience is 2x points
    const newExperience = currentExperience + experienceGained;
    const newLevel = Math.floor(newExperience / 1000) + 1;
    
    const accountRef = doc(db, 'accounts', accountId);
    await updateDoc(accountRef, {
      badgesEarned: arrayUnion(badgeId), // Add to badges array
      'profile.totalPoints': increment(badgePoints),
      'profile.experience': increment(experienceGained),
      'profile.level': newLevel, // Update level in profile
      level: newLevel, // Update level at root for backward compatibility
      experience: newExperience, // Update experience at root for backward compatibility
      totalPoints: increment(badgePoints), // Update totalPoints at root for backward compatibility
      updatedAt: serverTimestamp(),
    });

    // Log points transaction
    await this.logPointsTransaction(
      accountId,
      'earn',
      badgePoints,
      `Badge: ${badge?.name || badgeId}`
    );
  }

  // Check and award badges based on demo completion order
  private async checkAndAwardBadges(
    accountId: string,
    demoId: string,
    score: number
  ): Promise<void> {
    // Get the account to check current state
    const accountDoc = await getDoc(doc(db, 'accounts', accountId));
    const account = accountDoc.data() as UserAccount;
    const earnedBadgeNames = account.badges.map(b => b.name);

    // Check specific demo completions for badge awarding
    const completedDemos = this.getCompletedDemos(account);

    // Award badges based on specific demo completions
    await this.awardDemoBadge(accountId, demoId, earnedBadgeNames);

    // Note: Nexus Master badge is now claimed manually by user action, not automatically
  }

  // Award badge for specific demo completion
  private async awardDemoBadge(
    accountId: string,
    demoId: string,
    earnedBadgeNames: string[]
  ): Promise<void> {
    let badgeId: string | null = null;

    // Map demo IDs to badge IDs based on current demo configuration:
    // Demo 1 (Baby Steps to Riches) → Escrow Expert
    // Demo 2 (Drama Queen Escrow) → Trust Guardian
    // Demo 3 (Gig Economy Madness) → Stellar Champion
    switch (demoId) {
      case 'hello-milestone':
        badgeId = 'escrow-expert';
        break;
      case 'dispute-resolution':
        badgeId = 'trust-guardian';
        break;
      case 'micro-marketplace':
        badgeId = 'stellar-champion';
        break;
      // Legacy demo IDs (keeping for backward compatibility)
      case 'demo1':
        badgeId = 'escrow-expert';
        break;
      case 'demo3':
        badgeId = 'trust-guardian';
        break;
      case 'demo4':
        badgeId = 'stellar-champion';
        break;
    }

    if (!badgeId) {
      return;
    }

    const badgeConfig = getBadgeById(badgeId);

    if (!badgeConfig) {
      return;
    }

    // Check if badge is already earned
    if (earnedBadgeNames.includes(badgeConfig.name)) {
      return;
    }

    // Award the badge using badgeId
    await this.awardBadge(accountId, badgeConfig.id);
  }

  // Check if user deserves Nexus Master badge (completing demos 1, 3, and 4)
  private async checkNexusMasterBadge(
    accountId: string,
    earnedBadgeNames: string[]
  ): Promise<void> {
    const accountDoc = await getDoc(doc(db, 'accounts', accountId));
    const account = accountDoc.data() as UserAccount;

    // Check if all 3 main demos are completed (current configuration)
    const demo1Completed = account.demos['hello-milestone']?.status === 'completed';
    const demo2Completed = account.demos['dispute-resolution']?.status === 'completed';
    const demo3Completed = account.demos['micro-marketplace']?.status === 'completed';

    // Also check legacy demo IDs for backward compatibility
    const legacyDemo1Completed = account.demos.demo1?.status === 'completed';
    const legacyDemo3Completed = account.demos.demo3?.status === 'completed';
    const legacyDemo4Completed = account.demos.demo4?.status === 'completed';

    const hasRequiredDemos =
      (demo1Completed && demo2Completed && demo3Completed) ||
      (legacyDemo1Completed && legacyDemo3Completed && legacyDemo4Completed);

    if (hasRequiredDemos && !earnedBadgeNames.includes('Nexus Master')) {
      const nexusBadgeConfig = getBadgeById('nexus-master');
      if (nexusBadgeConfig) {
        await this.awardBadge(accountId, 'nexus-master');
      }
    }
  }

  // Helper method to get completed demos
  private getCompletedDemos(account: UserAccount): string[] {
    const completed: string[] = [];

    Object.entries(account.demos).forEach(([demoId, demo]) => {
      if (demo.status === 'completed') {
        completed.push(demoId);
      }
    });

    return completed;
  }

  // Check if user deserves Stellar Champion badge (all 4 demos completed + invite friend)
  private async checkStellarChampionBadge(accountId: string): Promise<void> {
    const accountDoc = await getDoc(doc(db, 'accounts', accountId));
    const account = accountDoc.data() as UserAccount;

    const earnedBadgeNames = account.badges.map(b => b.name);

    // Check if all 3 demos are completed
    const mainDemoProgress = this.getMainDemoCompletionCount(account);
    const allDemosCompleted = mainDemoProgress.completed === 3;

    // TODO: Add invite friend check when invite system is implemented
    const hasInvitedFriend = true; // For now, award when all demos are completed

    if (allDemosCompleted && hasInvitedFriend && !earnedBadgeNames.includes('Stellar Champion')) {
      const stellarBadgeConfig = getBadgeById('stellar-champion');
      if (stellarBadgeConfig) {
        await this.awardBadge(accountId, 'stellar-champion');
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
    // Create transaction object, only including demoId if it's defined
    const transaction: any = {
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

    await addDoc(collection(db, 'pointsTransactions'), transaction);
  }

  // Get points transactions for user
  async getPointsTransactions(userId: string, limitCount: number = 50): Promise<any[]> {
    const transactionsRef = collection(db, 'pointsTransactions');
    const q = query(
      transactionsRef,
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data());
  }

  // Leaderboard functionality removed - will be derived from accounts collection in the future

  // Update profile
  async updateProfile(
    accountId: string,
    profileUpdates: Partial<UserAccount['profile']>
  ): Promise<void> {
    const accountRef = doc(db, 'accounts', accountId);
    await updateDoc(accountRef, {
      profile: profileUpdates,
      updatedAt: serverTimestamp(),
    });
  }

  // Update settings
  async updateSettings(
    accountId: string,
    settingsUpdates: Partial<UserAccount['settings']>
  ): Promise<void> {
    const accountRef = doc(db, 'accounts', accountId);
    await updateDoc(accountRef, {
      settings: settingsUpdates,
      updatedAt: serverTimestamp(),
    });
  }

  // Add completed demo to demosCompleted array
  async addCompletedDemo(accountId: string, demoId: string): Promise<void> {
    const accountRef = doc(db, 'accounts', accountId);

    // Get current account to check existing demosCompleted
    const accountSnap = await getDoc(accountRef);
    if (!accountSnap.exists()) {
      throw new Error('Account not found');
    }

    const accountData = accountSnap.data();
    const currentDemosCompleted = accountData.demosCompleted || [];

    // Check if demo is already completed
    if (currentDemosCompleted.includes(demoId)) {
      return; // Already completed
    }

    // Add demo to completed list
    const updatedDemosCompleted = [...currentDemosCompleted, demoId];

    await updateDoc(accountRef, {
      demosCompleted: updatedDemosCompleted,
      updatedAt: serverTimestamp(),
    });
  }

  // Add earned badge to badgesEarned array
  async addEarnedBadge(accountId: string, badgeId: string): Promise<void> {
    const accountRef = doc(db, 'accounts', accountId);

    // Get current account to check existing badgesEarned
    const accountSnap = await getDoc(accountRef);
    if (!accountSnap.exists()) {
      throw new Error('Account not found');
    }

    const accountData = accountSnap.data();
    const currentBadgesEarned = accountData.badgesEarned || [];

    // Check if badge is already earned
    if (currentBadgesEarned.includes(badgeId)) {
      return; // Already earned
    }

    // Add badge to earned list
    const updatedBadgesEarned = [...currentBadgesEarned, badgeId];

    await updateDoc(accountRef, {
      badgesEarned: updatedBadgesEarned,
      updatedAt: serverTimestamp(),
    });
  }

  // Add experience and points to account
  async addExperienceAndPoints(
    accountId: string,
    experience: number,
    points: number
  ): Promise<void> {
    const accountRef = doc(db, 'accounts', accountId);

    // Get current account to check existing values
    const accountSnap = await getDoc(accountRef);
    if (!accountSnap.exists()) {
      throw new Error('Account not found');
    }

    const accountData = accountSnap.data();
    const currentExperience = accountData.experience || 0;
    const currentPoints = accountData.totalPoints || 0;

    // Calculate new level based on experience
    const newExperience = currentExperience + experience;
    const newLevel = Math.floor(newExperience / 1000) + 1;

    await updateDoc(accountRef, {
      experience: newExperience,
      totalPoints: currentPoints + points,
      level: newLevel, // Root level for backward compatibility
      'profile.level': newLevel, // Also update profile.level for consistency
      updatedAt: serverTimestamp(),
    });
  }

  // Get account by wallet address
  async getAccountByWalletAddress(walletAddress: string): Promise<any> {
    const accountRef = doc(db, 'accounts', walletAddress);
    const accountSnap = await getDoc(accountRef);

    if (!accountSnap.exists()) {
      return null;
    }

    return {
      id: accountSnap.id,
      ...accountSnap.data(),
    };
  }

  // Get main demo completion count (only the 3 available demos)
  getMainDemoCompletionCount(account: UserAccount): { completed: number; total: number } {
    const mainDemos = ['hello-milestone', 'dispute-resolution', 'micro-marketplace'];

    const completedCount = mainDemos.filter(
      demoId => account.demos[demoId as keyof typeof account.demos]?.status === 'completed'
    ).length;

    return {
      completed: completedCount,
      total: 3,
    };
  }
}

// Export singleton instance
export const accountService = AccountService.getInstance();
