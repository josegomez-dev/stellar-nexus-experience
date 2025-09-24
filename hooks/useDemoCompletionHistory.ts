'use client';

import { useState, useEffect } from 'react';
import { useGlobalWallet } from '@/contexts/WalletContext';
import { useToast } from '@/contexts/ToastContext';

export interface DemoCompletionRecord {
  id: string;
  demoId: string;
  demoName: string;
  score: number;
  pointsEarned: number;
  completedAt: string;
  completionTime: number; // in seconds
  isFirstCompletion: boolean;
  network: string;
  walletAddress: string;
}

export interface UseDemoCompletionHistoryReturn {
  completionHistory: DemoCompletionRecord[];
  addCompletion: (record: Omit<DemoCompletionRecord, 'id' | 'completedAt'>) => void;
  getDemoHistory: (demoId: string) => DemoCompletionRecord[];
  getTotalPointsEarned: (demoId: string) => number;
  getBestScore: (demoId: string) => number;
  getAverageScore: (demoId: string) => number;
  getCompletionCount: (demoId: string) => number;
  isLoading: boolean;
  error: string | null;
}

const STORAGE_KEY = 'demo_completion_history';

export const useDemoCompletionHistory = (): UseDemoCompletionHistoryReturn => {
  const { walletData, isConnected } = useGlobalWallet();
  const { addToast } = useToast();
  const [completionHistory, setCompletionHistory] = useState<DemoCompletionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load completion history from localStorage
  const loadHistory = () => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (typeof window === 'undefined') {
        setCompletionHistory([]);
        return;
      }

      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const history = JSON.parse(stored) as DemoCompletionRecord[];
        setCompletionHistory(history);
      } else {
        setCompletionHistory([]);
      }
    } catch (err) {
      console.error('Error loading completion history:', err);
      setError(err instanceof Error ? err.message : 'Failed to load completion history');
      setCompletionHistory([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Save completion history to localStorage
  const saveHistory = (history: DemoCompletionRecord[]) => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
      }
    } catch (err) {
      console.error('Error saving completion history:', err);
      setError(err instanceof Error ? err.message : 'Failed to save completion history');
    }
  };

  // Add a new completion record
  const addCompletion = (record: Omit<DemoCompletionRecord, 'id' | 'completedAt'>) => {
    if (!isConnected || !walletData?.publicKey) {
      addToast({
        type: 'error',
        title: 'Wallet Required',
        message: 'Please connect your wallet to track completion history',
      });
      return;
    }

    try {
      const newRecord: DemoCompletionRecord = {
        ...record,
        id: `completion_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        completedAt: new Date().toISOString(),
        network: walletData.network || 'TESTNET',
        walletAddress: walletData.publicKey,
      };

      const updatedHistory = [...completionHistory, newRecord];
      setCompletionHistory(updatedHistory);
      saveHistory(updatedHistory);

      // Note: Demo completion notifications are handled by AccountContext.tsx

    } catch (err) {
      console.error('Error adding completion:', err);
      setError(err instanceof Error ? err.message : 'Failed to add completion');
      addToast({
        type: 'error',
        title: 'Tracking Failed',
        message: 'Failed to track completion history',
      });
    }
  };

  // Get completion history for a specific demo
  const getDemoHistory = (demoId: string): DemoCompletionRecord[] => {
    return completionHistory.filter(record => record.demoId === demoId);
  };

  // Get total points earned for a specific demo
  const getTotalPointsEarned = (demoId: string): number => {
    return completionHistory
      .filter(record => record.demoId === demoId)
      .reduce((total, record) => total + record.pointsEarned, 0);
  };

  // Get best score for a specific demo
  const getBestScore = (demoId: string): number => {
    const demoHistory = getDemoHistory(demoId);
    if (demoHistory.length === 0) return 0;
    return Math.max(...demoHistory.map(record => record.score));
  };

  // Get average score for a specific demo
  const getAverageScore = (demoId: string): number => {
    const demoHistory = getDemoHistory(demoId);
    if (demoHistory.length === 0) return 0;
    const totalScore = demoHistory.reduce((sum, record) => sum + record.score, 0);
    return Math.round(totalScore / demoHistory.length);
  };

  // Get completion count for a specific demo
  const getCompletionCount = (demoId: string): number => {
    return getDemoHistory(demoId).length;
  };

  // Load history on mount and when wallet changes
  useEffect(() => {
    loadHistory();
  }, [isConnected, walletData?.publicKey]);

  return {
    completionHistory,
    addCompletion,
    getDemoHistory,
    getTotalPointsEarned,
    getBestScore,
    getAverageScore,
    getCompletionCount,
    isLoading,
    error,
  };
};
