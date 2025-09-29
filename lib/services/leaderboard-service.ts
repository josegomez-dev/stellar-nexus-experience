import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  where,
  startAfter,
  DocumentSnapshot,
} from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { UserAccount } from '@/utils/types/account';
import { Account } from '../firebase/firebase-types';

export interface LeaderboardEntry {
  id: string;
  walletAddress: string;
  displayName: string;
  level: number;
  totalPoints: number;
  demosCompleted: number;
  badgesEarned: number;
  rank: number;
  isCurrentUser?: boolean;
}

export interface LeaderboardStats {
  totalUsers: number;
  currentUserRank?: number;
  topUsers: LeaderboardEntry[];
}

export class LeaderboardService {
  private static instance: LeaderboardService;

  public static getInstance(): LeaderboardService {
    if (!LeaderboardService.instance) {
      LeaderboardService.instance = new LeaderboardService();
    }
    return LeaderboardService.instance;
  }

  // Get top users for leaderboard
  async getTopUsers(limitCount: number = 10): Promise<LeaderboardEntry[]> {
    try {
      const accountsRef = collection(db, 'accounts');
      
      // Try to query by profile.totalPoints first (UserAccount structure)
      let q = query(
        accountsRef,
        orderBy('profile.totalPoints', 'desc'),
        limit(limitCount)
      );

      let querySnapshot = await getDocs(q);
      console.log(`Leaderboard: Found ${querySnapshot.docs.length} users with profile.totalPoints structure`);
      
      // If no results, try querying by totalPoints directly (Account structure)
      if (querySnapshot.empty) {
        console.log('No results with profile.totalPoints, trying totalPoints directly...');
        q = query(
          accountsRef,
          orderBy('totalPoints', 'desc'),
          limit(limitCount)
        );
        querySnapshot = await getDocs(q);
        console.log(`Leaderboard: Found ${querySnapshot.docs.length} users with totalPoints structure`);
      }

      const entries: LeaderboardEntry[] = [];

      querySnapshot.docs.forEach((doc, index) => {
        const account = doc.data();
        console.log(`Leaderboard: User ${index + 1} - Wallet: ${account.walletAddress}, Points: ${account.profile?.totalPoints || account.totalPoints || 0}`);
        console.log(`Leaderboard: User ${index + 1} - Name fields:`, {
          displayName: account.displayName,
          username: account.username,
          customName: account.customName,
          profileDisplayName: account.profile?.displayName,
          profileUsername: account.profile?.username
        });
        const entry = this.transformAccountToLeaderboardEntry(account, index + 1);
        entries.push(entry);
      });

      console.log(`Leaderboard: Returning ${entries.length} entries`);
      return entries;
    } catch (error) {
      console.error('Error fetching top users:', error);
      return [];
    }
  }

  // Get leaderboard with current user context
  async getLeaderboardWithUser(
    currentUserWalletAddress: string,
    limitCount: number = 10
  ): Promise<LeaderboardStats> {
    try {
      // Get top users
      const topUsers = await this.getTopUsers(limitCount);

      // Get current user's rank
      const currentUserRank = await this.getUserRank(currentUserWalletAddress);

      // Get total user count
      const totalUsers = await this.getTotalUserCount();

      // Mark current user in the list if they're in top users
      const topUsersWithCurrentUser = topUsers.map(user => ({
        ...user,
        isCurrentUser: user.walletAddress === currentUserWalletAddress,
      }));

      return {
        totalUsers,
        currentUserRank,
        topUsers: topUsersWithCurrentUser,
      };
    } catch (error) {
      console.error('Error fetching leaderboard with user:', error);
      return {
        totalUsers: 0,
        topUsers: [],
      };
    }
  }

  // Get user's rank in leaderboard
  async getUserRank(walletAddress: string): Promise<number | undefined> {
    try {
      const accountsRef = collection(db, 'accounts');
      
      // Try to query by profile.totalPoints first (UserAccount structure)
      let q = query(
        accountsRef,
        orderBy('profile.totalPoints', 'desc')
      );

      let querySnapshot = await getDocs(q);
      
      // If no results, try querying by totalPoints directly (Account structure)
      if (querySnapshot.empty) {
        console.log('No results with profile.totalPoints in getUserRank, trying totalPoints directly...');
        q = query(
          accountsRef,
          orderBy('totalPoints', 'desc')
        );
        querySnapshot = await getDocs(q);
      }

      let rank = 0;

      for (const doc of querySnapshot.docs) {
        rank++;
        const account = doc.data();
        console.log(`Leaderboard: Checking user ${rank} - Wallet: ${account.walletAddress}, Looking for: ${walletAddress}`);
        if (account.walletAddress === walletAddress) {
          console.log(`Leaderboard: Found user at rank ${rank}`);
          return rank;
        }
      }

      console.log(`Leaderboard: User with wallet ${walletAddress} not found in leaderboard`);
      return undefined; // User not found
    } catch (error) {
      console.error('Error getting user rank:', error);
      return undefined;
    }
  }

  // Get total user count
  async getTotalUserCount(): Promise<number> {
    try {
      const accountsRef = collection(db, 'accounts');
      const q = query(accountsRef);
      const querySnapshot = await getDocs(q);
      return querySnapshot.size;
    } catch (error) {
      console.error('Error getting total user count:', error);
      return 0;
    }
  }

  // Get users around current user (for pagination)
  async getUsersAroundUser(
    currentUserWalletAddress: string,
    range: number = 5
  ): Promise<LeaderboardEntry[]> {
    try {
      const currentUserRank = await this.getUserRank(currentUserWalletAddress);
      if (!currentUserRank) {
        return [];
      }

      const startRank = Math.max(1, currentUserRank - range);
      const endRank = currentUserRank + range;

      const accountsRef = collection(db, 'accounts');
      
      // Try to query by profile.totalPoints first (UserAccount structure)
      let q = query(
        accountsRef,
        orderBy('profile.totalPoints', 'desc'),
        limit(endRank)
      );

      let querySnapshot = await getDocs(q);
      
      // If no results, try querying by totalPoints directly (Account structure)
      if (querySnapshot.empty) {
        console.log('No results with profile.totalPoints in getUsersAroundUser, trying totalPoints directly...');
        q = query(
          accountsRef,
          orderBy('totalPoints', 'desc'),
          limit(endRank)
        );
        querySnapshot = await getDocs(q);
      }

      const entries: LeaderboardEntry[] = [];

      querySnapshot.docs.forEach((doc, index) => {
        const rank = index + 1;
        if (rank >= startRank && rank <= endRank) {
          const account = doc.data();
          const entry = this.transformAccountToLeaderboardEntry(account, rank);
          entries.push(entry);
        }
      });

      return entries;
    } catch (error) {
      console.error('Error getting users around user:', error);
      return [];
    }
  }

  // Transform UserAccount or Account to LeaderboardEntry
  private transformAccountToLeaderboardEntry(
    account: any, // Can be either UserAccount or Account structure
    rank: number
  ): LeaderboardEntry {
    // Handle both account structures
    const totalPoints = account.profile?.totalPoints || account.totalPoints || 0;
    const level = account.profile?.level || account.level || 1;
    
    // Try multiple name fields in order of preference
    const displayName = account.profile?.displayName || 
                       account.profile?.username || 
                       account.displayName || 
                       account.username || 
                       account.customName;
    
    console.log(`Leaderboard Transform: Wallet ${account.walletAddress} - Selected display name: "${displayName}"`);
    
    // Calculate demos completed - handle both structures
    let demosCompleted = 0;
    if (account.demos && typeof account.demos === 'object') {
      // UserAccount structure with demos object
      demosCompleted = Object.values(account.demos).filter(
        (demo: any) => demo.status === 'completed'
      ).length;
    } else if (account.demosCompleted && Array.isArray(account.demosCompleted)) {
      // Account structure with demosCompleted array
      demosCompleted = account.demosCompleted.length;
    } else if (account.demosCompleted && typeof account.demosCompleted === 'object') {
      // Account structure with demosCompleted as object (Firebase sometimes stores arrays as objects)
      demosCompleted = Object.values(account.demosCompleted).length;
    }

    // Calculate badges earned - handle both structures
    let badgesEarned = 0;
    if (account.badges && Array.isArray(account.badges)) {
      // UserAccount structure with badges array
      badgesEarned = account.badges.length;
    } else if (account.badgesEarned && Array.isArray(account.badgesEarned)) {
      // Account structure with badgesEarned array
      badgesEarned = account.badgesEarned.length;
    } else if (account.badgesEarned && typeof account.badgesEarned === 'object') {
      // Account structure with badgesEarned as object (Firebase sometimes stores arrays as objects)
      badgesEarned = Object.values(account.badgesEarned).length;
    }

    // Format wallet address for display
    const formattedAddress = this.formatWalletAddress(account.walletAddress);
    
    // Use the best available name, fallback to formatted address
    const finalDisplayName = displayName || formattedAddress || 'Anonymous User';
    
    console.log(`Leaderboard Transform: Final display name for ${account.walletAddress}: "${finalDisplayName}"`);

    return {
      id: account.id,
      walletAddress: account.walletAddress,
      displayName: finalDisplayName,
      level,
      totalPoints,
      demosCompleted,
      badgesEarned,
      rank,
    };
  }

  // Format wallet address for display
  private formatWalletAddress(address: string): string {
    if (!address) return 'Unknown';
    if (address.length <= 12) return address;
    
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  }

  // Get medal emoji based on rank
  getMedalEmoji(rank: number): string {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return `#${rank}`;
    }
  }

  // Get rank color based on position
  getRankColor(rank: number): string {
    switch (rank) {
      case 1:
        return 'text-yellow-400';
      case 2:
        return 'text-gray-300';
      case 3:
        return 'text-orange-400';
      case 4:
      case 5:
        return 'text-blue-400';
      default:
        return 'text-gray-400';
    }
  }
}

// Export singleton instance
export const leaderboardService = LeaderboardService.getInstance();
