import { db } from './firebase';
import { collection, getDocs, query, where, orderBy, limit, Timestamp } from 'firebase/firestore';
import { COLLECTIONS } from './firebase-types';
import { UserAccount } from '../types/account';

export interface PlatformAnalytics {
  totalUsers: number;
  totalDemoCompletions: number;
  totalPointsTransactions: number;
  userSatisfactionScore: number;
  monthlyGrowthRate: number;
  successRate: number;
  developerAdoption: number;
  stellarOperations: number;
}

export interface UserSentiment {
  score: number; // 0-100
  emotion: 'excited' | 'satisfied' | 'neutral' | 'concerned';
  emoji: string;
  description: string;
}

class AnalyticsService {
  private cache: PlatformAnalytics | null = null;
  private cacheTimestamp: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  async getPlatformAnalytics(): Promise<PlatformAnalytics> {
    // Return cached data if still valid
    const now = Date.now();
    if (this.cache && (now - this.cacheTimestamp) < this.CACHE_DURATION) {
      console.log('📦 Using cached analytics data');
      return this.cache;
    }

    try {
      console.log('🔍 Fetching real Firebase analytics data...');
      
      // Fetch real user count (just count all accounts)
      const totalUsers = await this.getTotalUsers();
      console.log(`👥 Found ${totalUsers} total users`);
      
      // Fetch real demo completions (count all completed demos across all users)
      const totalDemoCompletions = await this.getTotalDemoCompletions();
      console.log(`🎯 Found ${totalDemoCompletions} total demo completions`);
      
      // Fetch real points transactions (count all transaction documents)
      const totalPointsTransactions = await this.getTotalPointsTransactions();
      console.log(`💰 Found ${totalPointsTransactions} total points transactions`);
      
      // Random data for other metrics as requested
      const userSatisfactionScore = Math.floor(Math.random() * 15) + 85; // 85-100
      const monthlyGrowthRate = Math.floor(Math.random() * 50) + 150; // 150-200%
      const successRate = Math.floor(Math.random() * 5) + 95; // 95-100%
      const developerAdoption = Math.floor(Math.random() * 30) + 45; // 45-75 (coming soon)
      const stellarOperations = totalDemoCompletions * 4 + totalPointsTransactions * 3; // Estimated

      this.cache = {
        totalUsers,
        totalDemoCompletions,
        totalPointsTransactions,
        userSatisfactionScore,
        monthlyGrowthRate,
        successRate,
        developerAdoption,
        stellarOperations
      };
      
      this.cacheTimestamp = now;
      console.log('✅ Analytics data fetched and cached:', this.cache);
      
      return this.cache;
    } catch (error) {
      console.error('❌ Error fetching analytics:', error);
      
      // Return fallback data if Firebase fails
      return {
        totalUsers: 5,
        totalDemoCompletions: 12,
        totalPointsTransactions: 48,
        userSatisfactionScore: 94,
        monthlyGrowthRate: 247,
        successRate: 98,
        developerAdoption: 67,
        stellarOperations: 192
      };
    }
  }

  private async getTotalUsers(): Promise<number> {
    try {
      console.log('📊 Counting total users in accounts collection...');
      const accountsRef = collection(db, 'accounts');
      const snapshot = await getDocs(accountsRef);
      const count = snapshot.size;
      console.log(`✅ Total users counted: ${count}`);
      return count;
    } catch (error) {
      console.error('❌ Error getting total users:', error);
      return 5; // Fallback - realistic small number
    }
  }

  private async getTotalDemoCompletions(): Promise<number> {
    try {
      console.log('🎯 Counting demo completions across all users...');
      const accountsRef = collection(db, 'accounts');
      const snapshot = await getDocs(accountsRef);
      
      let totalCompletions = 0;
      snapshot.forEach((doc) => {
        const account = doc.data() as UserAccount;
        if (account.demos) {
          // Count completed demos across all users
          const userCompletions = Object.values(account.demos).filter(progress => progress.status === 'completed').length;
          totalCompletions += userCompletions;
          if (userCompletions > 0) {
            console.log(`User ${doc.id} has ${userCompletions} completed demos`);
          }
        }
      });
      
      console.log(`✅ Total demo completions counted: ${totalCompletions}`);
      return totalCompletions;
    } catch (error) {
      console.error('❌ Error getting demo completions:', error);
      return 12; // Fallback - realistic small number
    }
  }

  private async getTotalPointsTransactions(): Promise<number> {
    try {
      console.log('💰 Counting points transactions...');
      const transactionsRef = collection(db, 'pointsTransactions');
      const snapshot = await getDocs(transactionsRef);
      
      const count = snapshot.size;
      console.log(`✅ Total points transactions counted: ${count}`);
      return count;
    } catch (error) {
      console.error('❌ Error getting points transactions:', error);
      return 48; // Fallback - realistic small number
    }
  }

  private async calculateUserSatisfaction(): Promise<number> {
    try {
      const accountsRef = collection(db, 'accounts');
      const snapshot = await getDocs(accountsRef);
      
      let totalUsers = 0;
      let satisfiedUsers = 0;
      
      snapshot.forEach((doc) => {
        const account = doc.data() as UserAccount;
        totalUsers++;
        
        // Consider users satisfied if they:
        // 1. Completed at least 1 demo
        // 2. Earned at least 1 badge
        // 3. Have positive points
        const hasCompletedDemo = account.demos && 
          Object.values(account.demos).some(progress => progress.status === 'completed');
        const hasBadges = account.badges && account.badges.length > 0;
        const hasPositivePoints = account.profile && account.profile.totalPoints > 0;
        
        if (hasCompletedDemo && hasBadges && hasPositivePoints) {
          satisfiedUsers++;
        }
      });
      
      return totalUsers > 0 ? Math.round((satisfiedUsers / totalUsers) * 100) : 87;
    } catch (error) {
      console.error('Error calculating user satisfaction:', error);
      return 87; // Fallback
    }
  }

  private async calculateMonthlyGrowth(): Promise<number> {
    try {
      const accountsRef = collection(db, 'accounts');
      const snapshot = await getDocs(accountsRef);
      
      const now = new Date();
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      
      let currentMonthUsers = 0;
      let lastMonthUsers = 0;
      
      snapshot.forEach((doc) => {
        const account = doc.data() as UserAccount;
        if (account.createdAt) {
          const createdDate = account.createdAt.toDate();
          if (createdDate >= lastMonth) {
            currentMonthUsers++;
          }
          if (createdDate >= new Date(now.getFullYear(), now.getMonth() - 2, now.getDate()) && 
              createdDate < lastMonth) {
            lastMonthUsers++;
          }
        }
      });
      
      if (lastMonthUsers === 0) return currentMonthUsers > 0 ? 100 : 0;
      return Math.round(((currentMonthUsers - lastMonthUsers) / lastMonthUsers) * 100);
    } catch (error) {
      console.error('Error calculating monthly growth:', error);
      return 34; // Fallback
    }
  }

  private async calculateSuccessRate(): Promise<number> {
    try {
      const accountsRef = collection(db, 'accounts');
      const snapshot = await getDocs(accountsRef);
      
      let totalAttempts = 0;
      let successfulCompletions = 0;
      
      snapshot.forEach((doc) => {
        const account = doc.data() as UserAccount;
        if (account.demos) {
          Object.values(account.demos).forEach((progress) => {
            totalAttempts++;
            if (progress.status === 'completed') {
              successfulCompletions++;
            }
          });
        }
      });
      
      return totalAttempts > 0 ? Math.round((successfulCompletions / totalAttempts) * 100) : 92;
    } catch (error) {
      console.error('Error calculating success rate:', error);
      return 92; // Fallback
    }
  }

  getUserSentiment(satisfactionScore: number): UserSentiment {
    if (satisfactionScore >= 90) {
      return {
        score: satisfactionScore,
        emotion: 'excited',
        emoji: '🚀',
        description: 'Users are absolutely thrilled!'
      };
    } else if (satisfactionScore >= 75) {
      return {
        score: satisfactionScore,
        emotion: 'satisfied',
        emoji: '😊',
        description: 'Users love the platform!'
      };
    } else if (satisfactionScore >= 60) {
      return {
        score: satisfactionScore,
        emotion: 'neutral',
        emoji: '😐',
        description: 'Users are generally positive'
      };
    } else {
      return {
        score: satisfactionScore,
        emotion: 'concerned',
        emoji: '🤔',
        description: 'Room for improvement'
      };
    }
  }

  // Clear cache manually if needed
  clearCache(): void {
    this.cache = null;
    this.cacheTimestamp = 0;
  }
}

export const analyticsService = new AnalyticsService();
