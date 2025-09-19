'use client';

import { useState, useEffect } from 'react';
import { useGlobalWallet } from '@/contexts/WalletContext';
import { useToast } from '@/contexts/ToastContext';
import {
  demoStatsService,
  demoClapService,
  demoFeedbackService,
  demoProgressService,
} from '@/lib/firebase-service';
import { DemoStats, DemoFeedback } from '@/lib/firebase-types';

export interface DemoStatsData {
  totalCompletions: number;
  totalClaps: number;
  averageRating: number;
  hasUserClapped: boolean;
  isLoading: boolean;
}

export interface UseDemoStatsReturn {
  demoStats: Record<string, DemoStatsData>;
  clapDemo: (demoId: string, demoName: string) => Promise<void>;
  submitFeedback: (feedback: Partial<DemoFeedback>) => Promise<void>;
  markDemoComplete: (demoId: string, demoName: string, completionTime: number) => Promise<void>;
  refreshStats: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const DEMO_LIST = [
  { id: 'hello-milestone', name: 'Baby Steps to Riches' },
  { id: 'milestone-voting', name: 'Democracy in Action' },
  { id: 'dispute-resolution', name: 'Drama Queen Escrow' },
  { id: 'micro-marketplace', name: 'Gig Economy Madness' },
];

export const useDemoStats = (): UseDemoStatsReturn => {
  const { walletData, isConnected } = useGlobalWallet();
  const { addToast } = useToast();
  const [demoStats, setDemoStats] = useState<Record<string, DemoStatsData>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize demo stats structure
  const initializeDemoStats = () => {
    const initialStats: Record<string, DemoStatsData> = {};
    DEMO_LIST.forEach(demo => {
      initialStats[demo.id] = {
        totalCompletions: 0,
        totalClaps: 0,
        averageRating: 0,
        hasUserClapped: false,
        isLoading: true,
      };
    });
    return initialStats;
  };

  // Load stats for all demos
  const loadDemoStats = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const statsPromises = DEMO_LIST.map(async (demo) => {
        try {
          // Initialize demo stats if they don't exist
          await demoStatsService.initializeDemoStats(demo.id, demo.name);
          
          // Get demo stats
          const stats = await demoStatsService.getDemoStats(demo.id);
          
          // Check if user has clapped (only if wallet is connected)
          let hasUserClapped = false;
          if (isConnected && walletData?.publicKey) {
            hasUserClapped = await demoClapService.hasUserClapped(walletData.publicKey, demo.id);
          }
          
          return {
            demoId: demo.id,
            data: {
              totalCompletions: stats?.totalCompletions || 0,
              totalClaps: stats?.totalClaps || 0,
              averageRating: stats?.averageRating || 0,
              hasUserClapped,
              isLoading: false,
            },
          };
        } catch (err) {
          console.error(`Error loading stats for demo ${demo.id}:`, err);
          return {
            demoId: demo.id,
            data: {
              totalCompletions: 0,
              totalClaps: 0,
              averageRating: 0,
              hasUserClapped: false,
              isLoading: false,
            },
          };
        }
      });

      const results = await Promise.all(statsPromises);
      
      const newStats: Record<string, DemoStatsData> = {};
      results.forEach(result => {
        newStats[result.demoId] = result.data;
      });
      
      setDemoStats(newStats);
    } catch (err) {
      console.error('Error loading demo stats:', err);
      setError(err instanceof Error ? err.message : 'Failed to load demo stats');
      // Set default stats on error
      setDemoStats(initializeDemoStats());
    } finally {
      setIsLoading(false);
    }
  };

  // Clap for a demo
  const clapDemo = async (demoId: string, demoName: string): Promise<void> => {
    if (!isConnected || !walletData?.publicKey) {
      addToast({
        type: 'error',
        title: 'Wallet Required',
        message: 'Please connect your wallet to clap for demos',
      });
      return;
    }

    if (demoStats[demoId]?.hasUserClapped) {
      addToast({
        type: 'info',
        title: 'Already Clapped',
        message: 'You have already clapped for this demo!',
      });
      return;
    }

    try {
      await demoClapService.addClap(walletData.publicKey, demoId);
      
      // Update local state
      setDemoStats(prev => ({
        ...prev,
        [demoId]: {
          ...prev[demoId],
          totalClaps: prev[demoId].totalClaps + 1,
          hasUserClapped: true,
        },
      }));
      
      addToast({
        type: 'success',
        title: 'Clapped!',
        message: `Clapped for ${demoName}! 👏`,
      });
    } catch (err) {
      console.error('Error clapping for demo:', err);
      if (err instanceof Error && err.message.includes('already clapped')) {
        addToast({
          type: 'info',
          title: 'Already Clapped',
          message: 'You have already clapped for this demo!',
        });
        // Update local state to reflect the clap status
        setDemoStats(prev => ({
          ...prev,
          [demoId]: {
            ...prev[demoId],
            hasUserClapped: true,
          },
        }));
      } else {
        addToast({
          type: 'error',
          title: 'Failed to Clap',
          message: 'Failed to clap for demo',
        });
      }
    }
  };

  // Submit feedback for a demo
  const submitFeedback = async (feedback: Partial<DemoFeedback>): Promise<void> => {
    if (!isConnected || !walletData?.publicKey) {
      addToast({
        type: 'error',
        title: 'Wallet Required',
        message: 'Please connect your wallet to submit feedback',
      });
      return;
    }

    if (!feedback.demoId || !feedback.rating || !feedback.feedback) {
      addToast({
        type: 'error',
        title: 'Missing Information',
        message: 'Please provide all required feedback fields',
      });
      return;
    }

    try {
      const feedbackData: Partial<DemoFeedback> = {
        ...feedback,
        userId: walletData.publicKey,
      };

      await demoFeedbackService.submitFeedback(feedbackData);
      addToast({
        type: 'success',
        title: 'Feedback Submitted',
        message: 'Thank you for your feedback!',
      });
      
      // Refresh stats to get updated rating
      await refreshStats();
    } catch (err) {
      console.error('Error submitting feedback:', err);
      addToast({
        type: 'error',
        title: 'Submission Failed',
        message: 'Failed to submit feedback',
      });
    }
  };

  // Mark demo as complete
  const markDemoComplete = async (demoId: string, demoName: string, completionTime: number): Promise<void> => {
    if (!isConnected || !walletData?.publicKey) {
      return;
    }

    try {
      // Update demo progress
      await demoProgressService.createOrUpdateProgress({
        userId: walletData.publicKey,
        demoId,
        demoName,
        status: 'completed',
        currentStep: 100, // Assuming 100 means completed
        totalSteps: 100,
        startedAt: new Date(),
        completedAt: new Date(),
        timeSpent: completionTime,
        metadata: {},
      });

      // Increment completion count in stats
      await demoStatsService.incrementCompletion(demoId, completionTime);
      
      // Update local state
      setDemoStats(prev => ({
        ...prev,
        [demoId]: {
          ...prev[demoId],
          totalCompletions: prev[demoId].totalCompletions + 1,
        },
      }));

      addToast({
        type: 'success',
        title: 'Demo Completed!',
        message: `Completed ${demoName}! 🎉`,
      });
    } catch (err) {
      console.error('Error marking demo complete:', err);
      addToast({
        type: 'error',
        title: 'Update Failed',
        message: 'Failed to update demo completion',
      });
    }
  };

  // Refresh all stats
  const refreshStats = async (): Promise<void> => {
    await loadDemoStats();
  };

  // Load stats on mount and when wallet connection changes
  useEffect(() => {
    loadDemoStats();
  }, [isConnected, walletData?.publicKey]);

  return {
    demoStats,
    clapDemo,
    submitFeedback,
    markDemoComplete,
    refreshStats,
    isLoading,
    error,
  };
};
