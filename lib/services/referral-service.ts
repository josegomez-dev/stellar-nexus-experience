import { 
  Account, 
  ReferralRecord,
  InvitationRecord,
  getQuestById 
} from '@/lib/firebase/firebase-types';
import { db } from '@/lib/firebase/firebase';
import { 
  doc, 
  updateDoc, 
  arrayUnion, 
  increment, 
  collection, 
  query, 
  where, 
  getDocs,
  getDoc 
} from 'firebase/firestore';
import emailjs from '@emailjs/browser';

export class ReferralService {
  /**
   * Generate a unique referral code for a user
   */
  static generateReferralCode(walletAddress: string): string {
    // Use first 6 characters of wallet address + random string
    const prefix = walletAddress.substring(0, 6).toUpperCase();
    const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}-${randomSuffix}`;
  }

  /**
   * Initialize referral system for a new user
   */
  static async initializeReferralSystem(account: Account, referredByCode?: string, userEmail?: string): Promise<{
    success: boolean;
    message: string;
    referralCode?: string;
    bonusEarned?: number;
  }> {
    try {
      const accountRef = doc(db, 'accounts', account.id);
      const referralCode = this.generateReferralCode(account.walletAddress);
      
      const updateData: any = {
        'referrals.referralCode': referralCode,
        'referrals.totalReferrals': 0,
        'referrals.successfulReferrals': 0,
        'referrals.referralHistory': [],
        'referrals.invitees': [], // Track all invitations sent
        'referrals.dismissedReferralPanel': false, // Default to false so new users see the panel
        updatedAt: new Date(),
      };

      let bonusEarned = 0;

      // If user was referred by someone, add the referrer info
      if (referredByCode) {
        updateData['referrals.referredBy'] = referredByCode;
        
        // Find and update the referrer's stats
        const referrerResult = await this.findReferrerByCode(referredByCode);
        if (referrerResult.success && referrerResult.referrer) {
          // Track email invitation if user email is provided
          if (userEmail) {
            try {
              await this.trackEmailInvitation(userEmail, referredByCode, account.walletAddress);
            } catch (emailError) {
              console.error('Error tracking email invitation:', emailError);
              // Don't fail the whole process if email tracking fails
            }
          }

          // Update referrer's stats and give bonus to new user
          await this.updateReferrerStats(referrerResult.referrer, account);
          bonusEarned = 25; // 25 XP bonus for being referred
          
          // Add bonus XP to the new user
          await updateDoc(accountRef, {
            experience: increment(25),
            totalPoints: increment(25),
          });
        }
      }

      await updateDoc(accountRef, updateData);

      return {
        success: true,
        message: 'Referral system initialized',
        referralCode,
        bonusEarned,
      };
    } catch (error) {
      console.error('Error initializing referral system:', error);
      return { success: false, message: 'Failed to initialize referral system' };
    }
  }

  /**
   * Find referrer by referral code
   */
  static async findReferrerByCode(referralCode: string): Promise<{
    success: boolean;
    referrer?: Account;
    message: string;
  }> {
    try {
      const accountsRef = collection(db, 'accounts');
      const q = query(accountsRef, where('referrals.referralCode', '==', referralCode));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return { success: false, message: 'Invalid referral code' };
      }

      const referrerDoc = querySnapshot.docs[0];
      const referrer = { id: referrerDoc.id, ...referrerDoc.data() } as Account;

      return { success: true, referrer, message: 'Referrer found' };
    } catch (error) {
      console.error('Error finding referrer:', error);
      return { success: false, message: 'Failed to find referrer' };
    }
  }

  /**
   * Update referrer's stats when someone uses their code
   */
  static async updateReferrerStats(referrer: Account, referredUser: Account): Promise<void> {
    try {
      const referrerRef = doc(db, 'accounts', referrer.id);
      
      const referralRecord: ReferralRecord = {
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
        referredUserWallet: referredUser.walletAddress,
        referredUserName: referredUser.displayName,
        referralDate: new Date(),
        status: 'completed',
        bonusEarned: 50, // 50 XP bonus for successful referral
      };

      await updateDoc(referrerRef, {
        'referrals.totalReferrals': increment(1),
        'referrals.successfulReferrals': increment(1),
        'referrals.referralHistory': arrayUnion(referralRecord),
        experience: increment(50), // 50 XP bonus
        totalPoints: increment(50), // 50 points bonus
        updatedAt: new Date(),
      });

      // Check if referrer completed any referral quests
      await this.checkReferralQuests(referrer);
    } catch (error) {
      console.error('Error updating referrer stats:', error);
    }
  }

  /**
   * Check and complete referral quests
   */
  static async checkReferralQuests(account: Account): Promise<void> {
    try {
      const referralQuests = [
        { id: 'refer_1_friend', count: 1, badgeId: 'first_referral' },
        { id: 'refer_5_friends', count: 5, badgeId: 'referral_champion' },
        { id: 'refer_10_friends', count: 10, badgeId: 'referral_legend' },
      ];

      for (const quest of referralQuests) {
        const questData = getQuestById(quest.id);
        if (!questData) continue;

        // Check if user has completed this quest
        const completedQuests = account.completedQuests || [];
        if (completedQuests.includes(quest.id)) continue;

        // Check if user has reached the required count
        if (account.referrals?.successfulReferrals >= quest.count) {
          const accountRef = doc(db, 'accounts', account.id);
          
          const updateData: any = {
            completedQuests: arrayUnion(quest.id),
            experience: increment(questData.rewards.experience),
            totalPoints: increment(questData.rewards.points),
            updatedAt: new Date(),
          };

          if (quest.badgeId) {
            updateData.badgesEarned = arrayUnion(quest.badgeId);
          }

          await updateDoc(accountRef, updateData);
        }
      }

      // Check for Quest Master badge (complete all available quests)
      await this.checkQuestMasterBadge(account);
    } catch (error) {
      console.error('Error checking referral quests:', error);
    }
  }

  /**
   * Check if user deserves Quest Master badge
   */
  static async checkQuestMasterBadge(account: Account): Promise<void> {
    try {
      const allQuests = [
        'follow_both_accounts',
        'post_hashtags', 
        'join_discord',
        'refer_1_friend',
        'refer_5_friends',
        'refer_10_friends'
      ];

      const completedQuests = account.completedQuests || [];
      const hasAllQuests = allQuests.every(questId => completedQuests.includes(questId));

      // Check if user already has Quest Master badge
      const badgesEarned = account.badgesEarned || [];
      if (hasAllQuests && !badgesEarned.includes('quest_master')) {
        const accountRef = doc(db, 'accounts', account.id);
        const questMasterQuest = getQuestById('quest_master');
        
        if (questMasterQuest) {
          await updateDoc(accountRef, {
            badgesEarned: arrayUnion('quest_master'),
            completedQuests: arrayUnion('quest_master'),
            experience: increment(questMasterQuest.rewards.experience),
            totalPoints: increment(questMasterQuest.rewards.points),
            updatedAt: new Date(),
          });
        }
      }
    } catch (error) {
      console.error('Error checking Quest Master badge:', error);
    }
  }

  /**
   * Send referral invitation email
   */
  static async sendReferralInvitation(
    referrer: Account,
    email: string,
    message?: string
  ): Promise<{ success: boolean; message: string; invitationId?: string }> {
    try {
      const referralCode = referrer.referrals?.referralCode;
      if (!referralCode) {
        return { success: false, message: 'Referral code not found' };
      }

      const referralLink = `${window.location.origin}?ref=${referralCode}`;
      
      // Create invitation record
      const invitationId = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
      const invitation: InvitationRecord = {
        id: invitationId,
        email,
        invitationDate: new Date(),
        status: 'sent',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      };

      // Save invitation to account's referrals.invitees
      const referrerRef = doc(db, 'accounts', referrer.id);
      await updateDoc(referrerRef, {
        'referrals.invitees': arrayUnion(invitation),
        'referrals.totalReferrals': increment(1), // Count sent invitations
        updatedAt: new Date(),
      });

      // Send email using EmailJS
      try {
        // Initialize EmailJS with your service ID
        const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'service_vgxzzks';
        const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'template_uxr204w';
        const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '7r0MFDYv8obebfCn5';

        // Prepare template parameters
        const templateParams = {
          user_email: email,
          referrer_name: referrer.displayName,
          referrer_name_initial: referrer.displayName.charAt(0).toUpperCase(),
          personal_message: message || 'Join me on Trustless Work and discover the future of trustless work on Stellar!',
          referral_code: referralCode,
          referral_link: referralLink,
        };

        // Debug: Log the parameters being sent
        console.log('EmailJS Parameters:', {
          serviceId,
          templateId,
          templateParams,
          email
        });

        // Send email
        await emailjs.send(serviceId, templateId, templateParams, publicKey);

        return {
          success: true,
          message: 'Referral invitation sent successfully',
          invitationId,
        };
      } catch (emailError) {
        console.error('EmailJS error:', emailError);
        
        // Update invitation status to failed in account's invitees
        const invitees = referrer.referrals?.invitees || [];
        const updatedInvitees = invitees.map(inv => 
          inv.id === invitationId ? { ...inv, status: 'failed' as const } : inv
        );
        
        await updateDoc(referrerRef, {
          'referrals.invitees': updatedInvitees,
          updatedAt: new Date(),
        });

        // Fallback: log the invitation details for manual sending
        console.log('Referral invitation details (EmailJS failed):', {
          to: email,
          from: referrer.displayName,
          referralLink,
          message: message || 'Join me on Trustless Work!',
          templateParams: {
            referrer_name: referrer.displayName,
            referrer_name_initial: referrer.displayName.charAt(0).toUpperCase(),
            personal_message: message || 'Join me on Trustless Work and discover the future of trustless work on Stellar!',
            referral_code: referralCode,
            referral_link: referralLink,
          }
        });

        return {
          success: false,
          message: 'Failed to send email, but invitation was recorded. Please check EmailJS configuration.',
          invitationId,
        };
      }
    } catch (error) {
      console.error('Error sending referral invitation:', error);
      return { success: false, message: 'Failed to send referral invitation' };
    }
  }

  /**
   * Get referral statistics for a user
   */
  static getReferralStats(account: Account): {
    totalReferrals: number;
    successfulReferrals: number;
    referralCode: string;
    totalBonusEarned: number;
    recentReferrals: ReferralRecord[];
  } {
    const referrals = account.referrals || {
      totalReferrals: 0,
      successfulReferrals: 0,
      referralCode: '',
      referralHistory: [],
    };

    // Ensure referralHistory is an array
    const referralHistory = Array.isArray(referrals.referralHistory) 
      ? referrals.referralHistory 
      : [];

    const totalBonusEarned = referralHistory.reduce(
      (sum, record) => sum + (record.bonusEarned || 0),
      0
    );

    const recentReferrals = referralHistory.slice(-5);

    return {
      totalReferrals: referrals.totalReferrals || 0,
      successfulReferrals: referrals.successfulReferrals || 0,
      referralCode: referrals.referralCode || '',
      totalBonusEarned,
      recentReferrals,
    };
  }

  /**
   * Check if user has unlocked referral system (completed top 5 badges)
   */
  static isReferralSystemUnlocked(account: Account): boolean {
    const requiredBadges = ['welcome_explorer', 'escrow_expert', 'trust_guardian', 'stellar_champion', 'nexus_master'];
    
    // Handle both array and object formats for badgesEarned
    let badgesEarnedArray: string[] = [];
    if (Array.isArray(account.badgesEarned)) {
      badgesEarnedArray = account.badgesEarned;
    } else if (account.badgesEarned && typeof account.badgesEarned === 'object') {
      badgesEarnedArray = Object.values(account.badgesEarned);
    }

    return requiredBadges.every(badgeId => badgesEarnedArray.includes(badgeId));
  }

  /**
   * Get referral link for a user
   */
  static getReferralLink(account: Account): string {
    const referralCode = account.referrals?.referralCode;
    if (!referralCode) return '';
    
    return `${window.location.origin}?ref=${referralCode}`;
  }

  /**
   * Copy referral link to clipboard
   */
  static async copyReferralLink(account: Account): Promise<{ success: boolean; message: string }> {
    try {
      const referralLink = this.getReferralLink(account);
      if (!referralLink) {
        return { success: false, message: 'Referral code not found' };
      }

      await navigator.clipboard.writeText(referralLink);
      return { success: true, message: 'Referral link copied to clipboard' };
    } catch (error) {
      console.error('Error copying referral link:', error);
      return { success: false, message: 'Failed to copy referral link' };
    }
  }

  /**
   * Track email invitation when user creates account
   */
  static async trackEmailInvitation(email: string, referralCode: string, newUserWallet?: string): Promise<{
    success: boolean;
    message: string;
    invitationId?: string;
  }> {
    try {
      // Find referrer account by referral code
      const referrerResult = await this.findReferrerByCode(referralCode);
      if (!referrerResult.success || !referrerResult.referrer) {
        return { success: false, message: 'Referrer not found' };
      }

      const referrer = referrerResult.referrer;
      const invitees = referrer.referrals?.invitees || [];
      
      // Find matching invitation
      const invitation = invitees.find(inv => inv.email === email && inv.status === 'sent');
      if (!invitation) {
        return { success: false, message: 'No matching invitation found' };
      }

      // Update invitation status to completed
      const updatedInvitees = invitees.map(inv => 
        inv.id === invitation.id 
          ? { 
              ...inv, 
              status: 'completed' as const, 
              completedAt: new Date(),
              referredUserWallet: newUserWallet 
            } 
          : inv
      );

      const referrerRef = doc(db, 'accounts', referrer.id);
      await updateDoc(referrerRef, {
        'referrals.invitees': updatedInvitees,
        updatedAt: new Date(),
      });

      return {
        success: true,
        message: 'Email invitation tracked successfully',
        invitationId: invitation.id,
      };
    } catch (error) {
      console.error('Error tracking email invitation:', error);
      return { success: false, message: 'Failed to track email invitation' };
    }
  }

  /**
   * Check if user has a pending email invitation
   */
  static async checkPendingInvitation(email: string): Promise<{
    success: boolean;
    hasInvitation: boolean;
    referralCode?: string;
    referrerName?: string;
  }> {
    try {
      // Search all accounts for an invitation with this email
      const accountsRef = collection(db, 'accounts');
      const querySnapshot = await getDocs(accountsRef);

      for (const docSnap of querySnapshot.docs) {
        const account = docSnap.data() as Account;
        const invitees = account.referrals?.invitees || [];
        
        // Find matching invitation
        const invitation = invitees.find(inv => 
          inv.email === email && 
          inv.status === 'sent' &&
          new Date() <= inv.expiresAt
        );

        if (invitation) {
          return {
            success: true,
            hasInvitation: true,
            referralCode: account.referrals?.referralCode,
            referrerName: account.displayName,
          };
        }
      }

      return { success: true, hasInvitation: false };
    } catch (error) {
      console.error('Error checking pending invitation:', error);
      return { success: false, hasInvitation: false };
    }
  }

  /**
   * Copy referral code to clipboard
   */
  static async copyReferralCode(account: Account): Promise<{ success: boolean; message: string }> {
    try {
      const referralCode = account.referrals?.referralCode;
      if (!referralCode) {
        return { success: false, message: 'Referral code not found' };
      }

      await navigator.clipboard.writeText(referralCode);
      return { success: true, message: 'Referral code copied to clipboard' };
    } catch (error) {
      console.error('Error copying referral code:', error);
      return { success: false, message: 'Failed to copy referral code' };
    }
  }


  /**
   * Check for new successful referrals and update stats
   * This method syncs completed invitees to referralHistory
   */
  static async checkForNewReferrals(account: Account): Promise<{
    success: boolean;
    newReferrals: number;
    message: string;
  }> {
    try {
      const invitees = account.referrals?.invitees || [];
      const completedInvitees = invitees.filter(inv => inv.status === 'completed');
      
      // Check which completed invitations are not yet in the referral history
      const referralHistory = account.referrals?.referralHistory || [];
      const existingReferralWallets = referralHistory.map(record => record.referredUserWallet);
      
      const newCompletedInvitations = completedInvitees.filter(invitation => 
        invitation.referredUserWallet && !existingReferralWallets.includes(invitation.referredUserWallet)
      );

      if (newCompletedInvitations.length > 0) {
        // Update account with new referrals
        const accountRef = doc(db, 'accounts', account.id);
        
        const newReferralRecords = newCompletedInvitations.map(invitation => ({
          id: invitation.id,
          referredUserWallet: invitation.referredUserWallet || invitation.email,
          referredUserName: invitation.email.split('@')[0], // Extract name from email
          referralDate: invitation.invitationDate,
          status: 'completed' as const,
          bonusEarned: 50,
        }));

        await updateDoc(accountRef, {
          'referrals.referralHistory': arrayUnion(...newReferralRecords),
          'referrals.successfulReferrals': increment(newCompletedInvitations.length),
          experience: increment(50 * newCompletedInvitations.length),
          totalPoints: increment(50 * newCompletedInvitations.length),
          updatedAt: new Date(),
        });

        // Check for new badges
        const updatedAccount = { 
          ...account, 
          referrals: { 
            ...account.referrals, 
            successfulReferrals: (account.referrals?.successfulReferrals || 0) + newCompletedInvitations.length 
          } 
        };
        await this.checkReferralQuests(updatedAccount);

        return {
          success: true,
          newReferrals: newCompletedInvitations.length,
          message: `Found ${newCompletedInvitations.length} new successful referral(s)!`,
        };
      }

      return {
        success: true,
        newReferrals: 0,
        message: 'No new referrals found.',
      };
    } catch (error) {
      console.error('Error checking for new referrals:', error);
      return {
        success: false,
        newReferrals: 0,
        message: 'Failed to check for new referrals.',
      };
    }
  }

  /**
   * Get pending invitations for display in referral history
   */
  static getPendingInvitations(account: Account): InvitationRecord[] {
    try {
      const invitees = account.referrals?.invitees || [];
      
      // Filter for pending invitations that haven't expired
      const pendingInvitations = invitees.filter(inv => 
        inv.status === 'sent' && 
        new Date() <= inv.expiresAt
      );

      return pendingInvitations;
    } catch (error) {
      console.error('Error getting pending invitations:', error);
      return [];
    }
  }

  /**
   * Get all referral history (pending + completed) for display
   */
  static getReferralHistory(account: Account): {
    pendingInvitations: InvitationRecord[];
    completedReferrals: ReferralRecord[];
  } {
    try {
      const invitees = account.referrals?.invitees || [];
      const referralHistory = account.referrals?.referralHistory || [];
      
      // Get pending invitations
      const pendingInvitations = invitees.filter(inv => 
        inv.status === 'sent' && 
        new Date() <= inv.expiresAt
      );

      // Get completed referrals
      const completedReferrals = referralHistory.filter(record => 
        record.status === 'completed'
      );

      return {
        pendingInvitations,
        completedReferrals,
      };
    } catch (error) {
      console.error('Error getting referral history:', error);
      return {
        pendingInvitations: [],
        completedReferrals: [],
      };
    }
  }
}
