// Comprehensive user tracking service for analytics, leaderboards, and progress
import {
  userService,
  demoProgressService,
  badgeService,
  demoStatsService,
  demoClapService,
  demoFeedbackService,
  firebaseUtils,
} from './firebase-service';
import {
  UserProfile,
  DemoProgress,
  DemoFeedback,
  UserBadge,
} from './firebase-types';

export interface TrackingEvent {
  type:
    | 'demo_started'
    | 'demo_completed'
    | 'demo_clapped'
    | 'feedback_submitted'
    | 'badge_earned'
    | 'transaction_completed';
  userId: string;
  demoId?: string;
  demoName?: string;
  metadata?: Record<string, any>;
  timestamp: Date;
}

export interface UserProgress {
  totalXp: number;
  level: number;
  demosCompleted: number;
  badgesEarned: number;
  totalTimeSpent: number;
  streak: number;
  completionRate: number;
}

export interface DemoAnalytics {
  demoId: string;
  demoName: string;
  totalCompletions: number;
  totalClaps: number;
  averageRating: number;
  averageCompletionTime: number;
  completionRate: number;
  userFeedback: {
    positive: number;
    negative: number;
    suggestions: string[];
  };
}

class UserTrackingService {
  private eventQueue: TrackingEvent[] = [];
  private readonly BATCH_SIZE = 10;
  private readonly FLUSH_INTERVAL = 5000; // 5 seconds

  constructor() {
    // Start periodic event flushing
    setInterval(() => {
      this.flushEvents();
    }, this.FLUSH_INTERVAL);
  }

  // ===== USER ACCOUNT MANAGEMENT =====

  /**
   * Create user account when wallet connects (automatically called)
   */
  async createUserAccount(
    walletAddress: string,
    username: string,
    walletType: string,
    walletName: string
  ): Promise<void> {
    try {
      console.log(`🔐 Creating user account for ${walletAddress}`);

      // Check if user already exists
      const existingUser = await userService.getUserByWalletAddress(walletAddress);
      if (existingUser) {
        console.log(`👤 User ${walletAddress} already exists, updating last login`);
        await userService.createOrUpdateUser({
          id: walletAddress,
          lastLoginAt: new Date(),
        });
        return;
      }

      // Initialize new user with default stats
      await firebaseUtils.initializeUser(walletAddress, username, walletType, walletName);

      // Add welcome badge
      await this.awardBadge(walletAddress, 'welcome_explorer');

      // Track account creation
      await this.trackEvent({
        type: 'demo_started', // Using demo_started as generic user action
        userId: walletAddress,
        metadata: { action: 'account_created', walletType, walletName },
        timestamp: new Date(),
      });

      console.log(`✅ User account created successfully for ${walletAddress}`);
    } catch (error) {
      console.error('❌ Failed to create user account:', error);
      throw error;
    }
  }

  // ===== DEMO TRACKING =====

  /**
   * Track demo start
   */
  async trackDemoStart(userId: string, demoId: string, demoName: string): Promise<void> {
    try {
      // Create or update demo progress
      await demoProgressService.createOrUpdateProgress({
        userId,
        demoId,
        demoName,
        status: 'in_progress',
        currentStep: 0,
        totalSteps: this.getDemoSteps(demoId),
        startedAt: new Date(),
        timeSpent: 0,
        metadata: { startTime: Date.now() },
      });

      // Track event
      await this.trackEvent({
        type: 'demo_started',
        userId,
        demoId,
        demoName,
        metadata: { timestamp: Date.now() },
        timestamp: new Date(),
      });

      console.log(`🎯 Demo started: ${demoName} by ${userId}`);
    } catch (error) {
      console.error('❌ Failed to track demo start:', error);
    }
  }

  /**
   * Track demo completion
   */
  async trackDemoCompletion(
    userId: string,
    demoId: string,
    demoName: string,
    completionTime: number,
    score?: number
  ): Promise<void> {
    try {
      console.log(`🎯 Starting demo completion tracking for ${demoName} by ${userId}`);

      // Calculate XP based on demo complexity and completion time
      const xpReward = this.calculateDemoXp(demoId, completionTime, score);
      console.log(`💰 Calculated XP reward: ${xpReward} for demo ${demoId}`);

      // Update demo progress
      console.log('📝 Updating demo progress...');
      await demoProgressService.createOrUpdateProgress({
        userId,
        demoId,
        demoName,
        status: 'completed',
        currentStep: this.getDemoSteps(demoId),
        completedAt: new Date(),
        timeSpent: completionTime,
        score: xpReward,
        metadata: { completionTime, score: xpReward },
      });
      console.log('✅ Demo progress updated');

      // Update user stats
      console.log('👤 Updating user stats...');
      const user = await userService.getUserByWalletAddress(userId);
      if (user) {
        const newStats = {
          demosCompleted: (user.stats.demosCompleted || 0) + 1,
          totalXp: (user.stats.totalXp || 0) + xpReward,
          level: firebaseUtils.calculateLevel((user.stats.totalXp || 0) + xpReward),
          totalTimeSpent: (user.stats.totalTimeSpent || 0) + completionTime,
          lastActivityAt: new Date(),
        };

        await userService.updateUserStats(userId, newStats);
        console.log('✅ User stats updated');

        // Leaderboard functionality removed
      } else {
        console.log('⚠️ User not found, skipping user stats update');
      }

      // Update demo stats
      console.log('📊 Updating demo stats...');
      await demoStatsService.incrementCompletion(demoId, completionTime);
      console.log('✅ Demo stats updated');

      // Check for badge eligibility
      console.log('🏆 Checking badge eligibility...');
      await this.checkBadgeEligibility(userId, demoId, 'demo_completion');
      console.log('✅ Badge eligibility checked');

      // Track event
      console.log('📈 Tracking completion event...');
      await this.trackEvent({
        type: 'demo_completed',
        userId,
        demoId,
        demoName,
        metadata: { completionTime, xpReward, score },
        timestamp: new Date(),
      });
      console.log('✅ Event tracked');

      console.log(`🎉 Demo completed: ${demoName} by ${userId} (+${xpReward} XP)`);
    } catch (error) {
      console.error('❌ Failed to track demo completion:', error);
      // Don't throw the error to prevent breaking the demo completion flow
      console.log('⚠️ Continuing with demo completion despite tracking error');
    }
  }

  /**
   * Track demo clap
   */
  async trackDemoClap(userId: string, demoId: string): Promise<void> {
    try {
      // Add clap
      await demoClapService.addClap(userId, demoId);

      // Award small XP for engagement
      const user = await userService.getUserByWalletAddress(userId);
      if (user) {
        const clapXp = 5; // Small XP reward for engagement
        const newStats = {
          totalXp: (user.stats.totalXp || 0) + clapXp,
          level: firebaseUtils.calculateLevel((user.stats.totalXp || 0) + clapXp),
          lastActivityAt: new Date(),
        };

        await userService.updateUserStats(userId, newStats);
      }

      // Track event
      await this.trackEvent({
        type: 'demo_clapped',
        userId,
        demoId,
        metadata: { clapXp: 5 },
        timestamp: new Date(),
      });

      console.log(`👏 Demo clapped: ${demoId} by ${userId}`);
    } catch (error) {
      console.error('❌ Failed to track demo clap:', error);
    }
  }

  // ===== FEEDBACK TRACKING =====

  /**
   * Track mandatory feedback submission
   */
  async trackFeedbackSubmission(
    userId: string,
    demoId: string,
    demoName: string,
    feedback: {
      rating: number;
      comment: string;
      difficulty: string;
      wouldRecommend: boolean;
      completionTime: number;
    }
  ): Promise<void> {
    try {
      // Submit feedback
      await demoFeedbackService.submitFeedback({
        userId,
        demoId,
        demoName,
        rating: feedback.rating,
        feedback: feedback.comment,
        difficulty: feedback.difficulty as any,
        wouldRecommend: feedback.wouldRecommend,
        completionTime: feedback.completionTime,
      });

      // Award XP based on feedback quality
      const feedbackXp = this.calculateFeedbackXp(feedback.rating, feedback.comment.length);

      const user = await userService.getUserByWalletAddress(userId);
      if (user) {
        const newStats = {
          totalXp: (user.stats.totalXp || 0) + feedbackXp,
          level: firebaseUtils.calculateLevel((user.stats.totalXp || 0) + feedbackXp),
          lastActivityAt: new Date(),
        };

        await userService.updateUserStats(userId, newStats);
      }

      // Check for feedback badge
      await this.checkBadgeEligibility(userId, demoId, 'feedback_submission');

      // Track event
      await this.trackEvent({
        type: 'feedback_submitted',
        userId,
        demoId,
        demoName,
        metadata: {
          rating: feedback.rating,
          difficulty: feedback.difficulty,
          wouldRecommend: feedback.wouldRecommend,
          feedbackXp,
        },
        timestamp: new Date(),
      });

      console.log(`📝 Feedback submitted: ${demoName} by ${userId} (+${feedbackXp} XP)`);
    } catch (error) {
      console.error('❌ Failed to track feedback submission:', error);
    }
  }

  // ===== BADGE SYSTEM =====

  /**
   * Award badge to user
   */
  async awardBadge(userId: string, badgeId: string): Promise<void> {
    try {
      await badgeService.awardBadge(userId, badgeId);

      // Award XP for badge
      const user = await userService.getUserByWalletAddress(userId);
      if (user) {
        const badgeXp = this.getBadgeXp(badgeId);
        const newStats = {
          badgesEarned: (user.stats.badgesEarned || 0) + 1,
          totalXp: (user.stats.totalXp || 0) + badgeXp,
          level: firebaseUtils.calculateLevel((user.stats.totalXp || 0) + badgeXp),
          lastActivityAt: new Date(),
        };

        await userService.updateUserStats(userId, newStats);
      }

      // Track event
      await this.trackEvent({
        type: 'badge_earned',
        userId,
        metadata: { badgeId, badgeXp: this.getBadgeXp(badgeId) },
        timestamp: new Date(),
      });

      console.log(`🏆 Badge awarded: ${badgeId} to ${userId}`);
    } catch (error) {
      console.error('❌ Failed to award badge:', error);
    }
  }

  /**
   * Check badge eligibility based on user actions
   */
  async checkBadgeEligibility(userId: string, demoId: string, action: string): Promise<void> {
    try {
      const user = await userService.getUserByWalletAddress(userId);
      if (!user) return;

      const userBadges = await badgeService.getUserBadges(userId);
      const earnedBadgeIds = userBadges.map(ub => ub.badgeId);

      // Demo completion badges
      if (action === 'demo_completion') {
        // First demo completion
        if (user.stats.demosCompleted === 1 && !earnedBadgeIds.includes('first_demo')) {
          await this.awardBadge(userId, 'first_demo');
        }

        // All demos completed
        if (user.stats.demosCompleted === 4 && !earnedBadgeIds.includes('demo_master')) {
          await this.awardBadge(userId, 'demo_master');
        }

        // Specific demo badges
        const demoBadges = {
          'hello-milestone': 'escrow_beginner',
          'milestone-voting': 'democracy_champion',
          'dispute-resolution': 'dispute_resolver',
          'micro-marketplace': 'gig_economy_expert',
        };

        const badgeId = demoBadges[demoId as keyof typeof demoBadges];
        if (badgeId && !earnedBadgeIds.includes(badgeId)) {
          await this.awardBadge(userId, badgeId);
        }
      }

      // Level-based badges
      if (user.stats.level >= 5 && !earnedBadgeIds.includes('level_5_explorer')) {
        await this.awardBadge(userId, 'level_5_explorer');
      }

      if (user.stats.level >= 10 && !earnedBadgeIds.includes('level_10_veteran')) {
        await this.awardBadge(userId, 'level_10_veteran');
      }

      // XP milestones
      if (user.stats.totalXp >= 500 && !earnedBadgeIds.includes('xp_collector')) {
        await this.awardBadge(userId, 'xp_collector');
      }

      if (user.stats.totalXp >= 1000 && !earnedBadgeIds.includes('xp_master')) {
        await this.awardBadge(userId, 'xp_master');
      }
    } catch (error) {
      console.error('❌ Failed to check badge eligibility:', error);
    }
  }

  // ===== ANALYTICS AND LEADERBOARD =====

  /**
   * Get user progress summary
   */
  async getUserProgress(userId: string): Promise<UserProgress | null> {
    try {
      const user = await userService.getUserByWalletAddress(userId);
      if (!user) return null;

      // Leaderboard functionality removed
      const demoProgress = await demoProgressService.getUserDemoProgress(userId);

      const totalAttempts = demoProgress.length;
      const completedAttempts = demoProgress.filter(p => p.status === 'completed').length;
      const completionRate = totalAttempts > 0 ? (completedAttempts / totalAttempts) * 100 : 0;

      return {
        totalXp: user.stats.totalXp,
        level: user.stats.level,
        demosCompleted: user.stats.demosCompleted,
        badgesEarned: user.stats.badgesEarned,
        totalTimeSpent: user.stats.totalTimeSpent,
        streak: user.stats.streak,
        completionRate,
      };
    } catch (error) {
      console.error('❌ Failed to get user progress:', error);
      return null;
    }
  }

  /**
   * Get demo analytics
   */
  async getDemoAnalytics(demoId: string): Promise<DemoAnalytics | null> {
    try {
      const stats = await demoStatsService.getDemoStats(demoId);
      if (!stats) return null;

      const feedback = await demoFeedbackService.getDemoFeedback(demoId);
      const positiveFeedback = feedback.filter(f => f.rating >= 4).length;
      const negativeFeedback = feedback.filter(f => f.rating <= 2).length;
      const suggestions = feedback
        .filter(f => f.suggestions && f.suggestions.length > 0)
        .map(f => f.suggestions)
        .flat()
        .filter((suggestion): suggestion is string => suggestion !== undefined);

      return {
        demoId: stats.demoId,
        demoName: stats.demoName,
        totalCompletions: stats.totalCompletions,
        totalClaps: stats.totalClaps,
        averageRating: stats.averageRating,
        averageCompletionTime: stats.averageCompletionTime,
        completionRate:
          stats.totalCompletions > 0
            ? (stats.totalCompletions / (stats.totalCompletions * 1.2)) * 100
            : 0, // Estimate
        userFeedback: {
          positive: positiveFeedback,
          negative: negativeFeedback,
          suggestions,
        },
      };
    } catch (error) {
      console.error('❌ Failed to get demo analytics:', error);
      return null;
    }
  }

  // ===== UTILITY METHODS =====

  private async trackEvent(event: TrackingEvent): Promise<void> {
    this.eventQueue.push(event);

    // Flush immediately if queue is full
    if (this.eventQueue.length >= this.BATCH_SIZE) {
      await this.flushEvents();
    }
  }

  private async flushEvents(): Promise<void> {
    if (this.eventQueue.length === 0) return;

    const events = [...this.eventQueue];
    this.eventQueue = [];

    try {
      // Here you could send events to analytics service, external tracking, etc.
      console.log(`📊 Flushing ${events.length} tracking events`);

      // For now, just log the events
      events.forEach(event => {
        console.log(`📈 Event: ${event.type} - ${event.userId}`, event.metadata);
      });
    } catch (error) {
      console.error('❌ Failed to flush events:', error);
      // Re-add events to queue for retry
      this.eventQueue.unshift(...events);
    }
  }

  private getDemoSteps(demoId: string): number {
    const steps = {
      'hello-milestone': 5,
      'milestone-voting': 6,
      'dispute-resolution': 7,
      'micro-marketplace': 6,
    };
    return steps[demoId as keyof typeof steps] || 5;
  }

  private calculateDemoXp(demoId: string, completionTime: number, score?: number): number {
    const baseXp = {
      'hello-milestone': 50,
      'milestone-voting': 75,
      'dispute-resolution': 100,
      'micro-marketplace': 60,
    };

    const base = baseXp[demoId as keyof typeof baseXp] || 50;
    const timeBonus = Math.max(0, 20 - completionTime / 60); // Bonus for fast completion
    const scoreBonus = score ? score * 0.5 : 0;

    return Math.round(base + timeBonus + scoreBonus);
  }

  private calculateFeedbackXp(rating: number, commentLength: number): number {
    const ratingXp = rating * 5; // 5-25 XP based on rating
    const commentXp = Math.min(15, commentLength / 10); // Up to 15 XP for detailed feedback
    return Math.round(ratingXp + commentXp);
  }

  private getBadgeXp(badgeId: string): number {
    const badgeXp = {
      welcome_explorer: 10,
      first_demo: 25,
      demo_master: 100,
      escrow_beginner: 30,
      democracy_champion: 40,
      dispute_resolver: 50,
      gig_economy_expert: 35,
      level_5_explorer: 75,
      level_10_veteran: 150,
      xp_collector: 50,
      xp_master: 100,
    };
    return badgeXp[badgeId as keyof typeof badgeXp] || 10;
  }
}

export const userTrackingService = new UserTrackingService();
