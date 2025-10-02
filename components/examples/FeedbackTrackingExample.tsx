'use client';

import React, { useState, useEffect } from 'react';
import { useFirebase } from '@/contexts/data/FirebaseContext';
import { useGlobalWallet } from '@/contexts/wallet/WalletContext';

/**
 * Example component demonstrating how to use the new mandatory feedback tracking system
 * This shows how to check if a user has submitted feedback and retrieve feedback statistics
 */
export const FeedbackTrackingExample: React.FC = () => {
  const { 
    hasUserSubmittedFeedback, 
    getUserFeedback, 
    getDemoFeedbackStats,
    submitMandatoryFeedback 
  } = useFirebase();
  const { isConnected, walletData } = useGlobalWallet();
  
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [userFeedback, setUserFeedback] = useState<any[]>([]);
  const [demoStats, setDemoStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const demoId = 'hello-milestone'; // Example demo ID

  // Check if user has submitted feedback for this demo
  const checkFeedbackStatus = async () => {
    if (!isConnected || !walletData?.publicKey) return;
    
    setLoading(true);
    try {
      const submitted = await hasUserSubmittedFeedback(demoId);
      setHasSubmitted(submitted);
    } catch (error) {
      console.error('Error checking feedback status:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get user's feedback history
  const loadUserFeedback = async () => {
    if (!isConnected || !walletData?.publicKey) return;
    
    setLoading(true);
    try {
      const feedback = await getUserFeedback();
      setUserFeedback(feedback);
    } catch (error) {
      console.error('Error loading user feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get demo feedback statistics
  const loadDemoStats = async () => {
    setLoading(true);
    try {
      const stats = await getDemoFeedbackStats(demoId);
      setDemoStats(stats);
    } catch (error) {
      console.error('Error loading demo stats:', error);
    } finally {
      setLoading(false);
    }
  };

  // Example: Submit test feedback
  const submitTestFeedback = async () => {
    if (!isConnected || !walletData?.publicKey) return;
    
    setLoading(true);
    try {
      await submitMandatoryFeedback({
        demoId,
        demoName: 'Baby Steps to Riches',
        rating: 5,
        feedback: 'This is a test feedback submission from the example component.',
        difficulty: 'easy',
        wouldRecommend: true,
        completionTime: 15,
      });
      
      // Refresh the data
      await checkFeedbackStatus();
      await loadUserFeedback();
      await loadDemoStats();
    } catch (error) {
      console.error('Error submitting test feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected && walletData?.publicKey) {
      checkFeedbackStatus();
      loadUserFeedback();
      loadDemoStats();
    }
  }, [isConnected, walletData?.publicKey]);

  if (!isConnected) {
    return (
      <div className="p-6 bg-white/5 rounded-lg border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">Feedback Tracking Example</h3>
        <p className="text-gray-400">Please connect your wallet to see feedback tracking in action.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white/5 rounded-lg border border-white/20 space-y-6">
      <h3 className="text-lg font-semibold text-white mb-4">Feedback Tracking Example</h3>
      
      {/* Feedback Status */}
      <div className="space-y-2">
        <h4 className="text-md font-medium text-white">Feedback Status for Demo: {demoId}</h4>
        <p className="text-sm text-gray-300">
          Has submitted feedback: <span className={hasSubmitted ? 'text-green-400' : 'text-red-400'}>
            {hasSubmitted ? 'Yes' : 'No'}
          </span>
        </p>
      </div>

      {/* Demo Statistics */}
      {demoStats && (
        <div className="space-y-2">
          <h4 className="text-md font-medium text-white">Demo Statistics</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Total Feedback:</span>
              <span className="text-white ml-2">{demoStats.totalFeedback}</span>
            </div>
            <div>
              <span className="text-gray-400">Average Rating:</span>
              <span className="text-white ml-2">{demoStats.averageRating.toFixed(1)}/5</span>
            </div>
            <div>
              <span className="text-gray-400">Avg Completion Time:</span>
              <span className="text-white ml-2">{demoStats.averageCompletionTime.toFixed(1)} min</span>
            </div>
            <div>
              <span className="text-gray-400">Recommendation Rate:</span>
              <span className="text-white ml-2">{demoStats.recommendationRate.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      )}

      {/* User Feedback History */}
      <div className="space-y-2">
        <h4 className="text-md font-medium text-white">Your Feedback History</h4>
        {userFeedback.length > 0 ? (
          <div className="space-y-2">
            {userFeedback.slice(0, 3).map((feedback, index) => (
              <div key={feedback.id} className="p-3 bg-white/5 rounded border border-white/10">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-white font-medium">{feedback.demoName}</p>
                    <p className="text-xs text-gray-400">Rating: {feedback.rating}/5</p>
                    <p className="text-xs text-gray-400 mt-1">{feedback.feedback}</p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(feedback.timestamp).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
            {userFeedback.length > 3 && (
              <p className="text-xs text-gray-500">... and {userFeedback.length - 3} more</p>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-400">No feedback submitted yet.</p>
        )}
      </div>

      {/* Test Actions */}
      <div className="space-y-2">
        <h4 className="text-md font-medium text-white">Test Actions</h4>
        <div className="flex gap-2">
          <button
            onClick={submitTestFeedback}
            disabled={loading || hasSubmitted}
            className="px-4 py-2 bg-blue-500/20 border border-blue-400/50 text-blue-300 rounded-lg hover:bg-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {loading ? 'Loading...' : 'Submit Test Feedback'}
          </button>
          <button
            onClick={() => {
              checkFeedbackStatus();
              loadUserFeedback();
              loadDemoStats();
            }}
            disabled={loading}
            className="px-4 py-2 bg-green-500/20 border border-green-400/50 text-green-300 rounded-lg hover:bg-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {loading ? 'Loading...' : 'Refresh Data'}
          </button>
        </div>
      </div>
    </div>
  );
};
