import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from './firebase';
import { COLLECTIONS } from './firebase-types';

export interface OverallAnalytics {
  totalUsers: number;
  totalFeedbacks: number;
  averageRating: number;
  completionRate: number;
  userExperience: {
    trustlessWorkKnowledge: {
      beginner: number;
      intermediate: number;
      advanced: number;
    };
    stellarKnowledge: {
      beginner: number;
      intermediate: number;
      advanced: number;
    };
  };
}

export interface DemoAnalytics {
  demoId: string;
  demoName: string;
  totalCompletions: number;
  averageRating: number;
  averageCompletionTime: number;
  difficultyDistribution: {
    very_easy: number;
    easy: number;
    medium: number;
    hard: number;
    very_hard: number;
  };
  recommendationRate: number;
}

export interface UserEngagement {
  dailyActiveUsers: number;
  weeklyActiveUsers: number;
  monthlyActiveUsers: number;
  averageSessionTime: number;
  returnUserRate: number;
}

export class AnalyticsService {
  static async getOverallAnalytics(): Promise<OverallAnalytics> {
    try {
      // Get total users
      const usersSnapshot = await getDocs(collection(db, COLLECTIONS.USERS));
      const totalUsers = usersSnapshot.size;

      // Get all feedbacks
      const feedbacksSnapshot = await getDocs(collection(db, COLLECTIONS.DEMO_FEEDBACK));
      const feedbacks = feedbacksSnapshot.docs.map(doc => doc.data());
      const totalFeedbacks = feedbacks.length;

      // Calculate average rating
      const totalRating = feedbacks.reduce((sum, feedback) => sum + (feedback.rating || 0), 0);
      const averageRating = totalFeedbacks > 0 ? totalRating / totalFeedbacks : 0;

      // Get demo progress to calculate completion rate
      const progressSnapshot = await getDocs(collection(db, COLLECTIONS.DEMO_PROGRESS));
      const progressData = progressSnapshot.docs.map(doc => doc.data());
      const completedDemos = progressData.filter(progress => progress.status === 'completed').length;
      const totalDemoAttempts = progressData.length;
      const completionRate = totalDemoAttempts > 0 ? (completedDemos / totalDemoAttempts) * 100 : 0;

      // Simulate user experience data (in a real app, you'd collect this from user surveys)
      const userExperience = {
        trustlessWorkKnowledge: {
          beginner: Math.floor(totalUsers * 0.6),
          intermediate: Math.floor(totalUsers * 0.3),
          advanced: Math.floor(totalUsers * 0.1),
        },
        stellarKnowledge: {
          beginner: Math.floor(totalUsers * 0.7),
          intermediate: Math.floor(totalUsers * 0.25),
          advanced: Math.floor(totalUsers * 0.05),
        },
      };

      return {
        totalUsers,
        totalFeedbacks,
        averageRating,
        completionRate,
        userExperience,
      };
    } catch (error) {
      console.error('Error getting overall analytics:', error);
      throw error;
    }
  }

  static async getDemoAnalytics(demoId: string): Promise<DemoAnalytics> {
    try {
      // Get demo feedbacks
      const feedbackQuery = query(
        collection(db, COLLECTIONS.DEMO_FEEDBACK),
        where('demoId', '==', demoId)
      );
      const feedbackSnapshot = await getDocs(feedbackQuery);
      const feedbacks = feedbackSnapshot.docs.map(doc => doc.data());

      // Get demo stats
      const statsQuery = query(
        collection(db, COLLECTIONS.DEMO_STATS),
        where('demoId', '==', demoId)
      );
      const statsSnapshot = await getDocs(statsQuery);
      const stats = statsSnapshot.docs[0]?.data();

      // Calculate metrics
      const totalCompletions = stats?.totalCompletions || 0;
      const averageRating = stats?.averageRating || 0;
      const averageCompletionTime = stats?.averageCompletionTime || 0;

      // Calculate difficulty distribution
      const difficultyDistribution = {
        very_easy: 0,
        easy: 0,
        medium: 0,
        hard: 0,
        very_hard: 0,
      };

        feedbacks.forEach(feedback => {
          if (feedback.difficulty && Object.prototype.hasOwnProperty.call(difficultyDistribution, feedback.difficulty)) {
            difficultyDistribution[feedback.difficulty as keyof typeof difficultyDistribution]++;
          }
        });

      // Calculate recommendation rate
      const recommendingUsers = feedbacks.filter(feedback => feedback.wouldRecommend).length;
      const recommendationRate = feedbacks.length > 0 ? (recommendingUsers / feedbacks.length) * 100 : 0;

      return {
        demoId,
        demoName: stats?.demoName || 'Unknown Demo',
        totalCompletions,
        averageRating,
        averageCompletionTime,
        difficultyDistribution,
        recommendationRate,
      };
    } catch (error) {
      console.error('Error getting demo analytics:', error);
      throw error;
    }
  }

  static async getUserEngagement(): Promise<UserEngagement> {
    try {
      const now = new Date();
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      // Get user activity (this would typically be tracked in a separate collection)
      const usersSnapshot = await getDocs(collection(db, COLLECTIONS.USERS));
      const users = usersSnapshot.docs.map(doc => doc.data());

      // Simulate engagement metrics (in a real app, you'd track actual user activity)
      const totalUsers = users.length;
      const dailyActiveUsers = Math.floor(totalUsers * 0.15);
      const weeklyActiveUsers = Math.floor(totalUsers * 0.4);
      const monthlyActiveUsers = Math.floor(totalUsers * 0.7);
      const averageSessionTime = 25; // minutes
      const returnUserRate = 65; // percentage

      return {
        dailyActiveUsers,
        weeklyActiveUsers,
        monthlyActiveUsers,
        averageSessionTime,
        returnUserRate,
      };
    } catch (error) {
      console.error('Error getting user engagement:', error);
      throw error;
    }
  }

  static async getTopFeedback(limit: number = 10): Promise<any[]> {
    try {
      const feedbackQuery = query(
        collection(db, COLLECTIONS.DEMO_FEEDBACK),
        orderBy('rating', 'desc'),
        orderBy('createdAt', 'desc'),
        limit(limit)
      );
      const feedbackSnapshot = await getDocs(feedbackQuery);
      
      return feedbackSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error('Error getting top feedback:', error);
      throw error;
    }
  }

  static async getFeedbackTrends(days: number = 30): Promise<any[]> {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const feedbackQuery = query(
        collection(db, COLLECTIONS.DEMO_FEEDBACK),
        where('createdAt', '>=', startDate),
        orderBy('createdAt', 'asc')
      );
      const feedbackSnapshot = await getDocs(feedbackQuery);
      
      // Group feedback by date
      const feedbackByDate: { [key: string]: number } = {};
      feedbackSnapshot.docs.forEach(doc => {
        const data = doc.data();
        const date = data.createdAt?.toDate?.()?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0];
        feedbackByDate[date] = (feedbackByDate[date] || 0) + 1;
      });

      // Convert to array format for charts
      return Object.entries(feedbackByDate).map(([date, count]) => ({
        date,
        count,
      }));
    } catch (error) {
      console.error('Error getting feedback trends:', error);
      throw error;
    }
  }
}