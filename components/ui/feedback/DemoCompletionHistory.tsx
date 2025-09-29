'use client';

import { useState } from 'react';
import {
  useDemoCompletionHistory,
  DemoCompletionRecord,
} from '@/hooks/demo/useDemoCompletionHistory';
import { formatDistanceToNow } from 'date-fns';

interface DemoCompletionHistoryProps {
  demoId: string;
  demoName: string;
  className?: string;
}

export const DemoCompletionHistory: React.FC<DemoCompletionHistoryProps> = ({
  demoId,
  demoName,
  className = '',
}) => {
  const {
    getDemoHistory,
    getTotalPointsEarned,
    getBestScore,
    getAverageScore,
    getCompletionCount,
  } = useDemoCompletionHistory();

  const [isExpanded, setIsExpanded] = useState(false);

  const demoHistory = getDemoHistory(demoId);
  const totalPoints = getTotalPointsEarned(demoId);
  const bestScore = getBestScore(demoId);
  const averageScore = getAverageScore(demoId);
  const completionCount = getCompletionCount(demoId);

  if (completionCount === 0) {
    return null;
  }

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return 'Unknown time';
    }
  };

  const formatCompletionTime = (seconds: number) => {
    if (seconds < 60) {
      return `${seconds}s`;
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return `${hours}h ${minutes}m`;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 70) return 'text-yellow-400';
    if (score >= 50) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 90) return 'bg-green-500/20 border-green-400/30 text-green-300';
    if (score >= 70) return 'bg-yellow-500/20 border-yellow-400/30 text-yellow-300';
    if (score >= 50) return 'bg-orange-500/20 border-orange-400/30 text-orange-300';
    return 'bg-red-500/20 border-red-400/30 text-red-300';
  };

  return (
    <div
      className={`bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-400/30 rounded-lg p-4 ${className}`}
    >
      {/* Header */}
      <div className='flex items-center justify-between mb-4'>
        <div className='flex items-center space-x-3'>
          <div className='text-2xl'>📊</div>
          <div>
            <h3 className='text-lg font-semibold text-white'>Completion History</h3>
            <p className='text-sm text-purple-300'>{demoName}</p>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className='px-3 py-1 bg-purple-500/20 border border-purple-400/30 text-purple-200 rounded text-sm hover:bg-purple-500/30 transition-all duration-300 flex items-center space-x-2'
        >
          <span>{isExpanded ? 'Hide' : 'Show'} Details</span>
          <span
            className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
          >
            ▼
          </span>
        </button>
      </div>

      {/* Stats Summary */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-4'>
        <div className='bg-white/5 rounded-lg p-3 border border-white/10'>
          <div className='text-xs text-white/60 mb-1'>Completions</div>
          <div className='text-lg font-semibold text-white'>{completionCount}</div>
        </div>

        <div className='bg-white/5 rounded-lg p-3 border border-white/10'>
          <div className='text-xs text-white/60 mb-1'>Total Points</div>
          <div className='text-lg font-semibold text-yellow-400'>{totalPoints}</div>
        </div>

        <div className='bg-white/5 rounded-lg p-3 border border-white/10'>
          <div className='text-xs text-white/60 mb-1'>Best Score</div>
          <div className={`text-lg font-semibold ${getScoreColor(bestScore)}`}>{bestScore}%</div>
        </div>

        <div className='bg-white/5 rounded-lg p-3 border border-white/10'>
          <div className='text-xs text-white/60 mb-1'>Average Score</div>
          <div className={`text-lg font-semibold ${getScoreColor(averageScore)}`}>
            {averageScore}%
          </div>
        </div>
      </div>

      {/* Detailed History */}
      {isExpanded && (
        <div className='space-y-3'>
          <h4 className='text-sm font-semibold text-white mb-3'>Previous Completions</h4>

          <div className='space-y-2 max-h-64 overflow-y-auto'>
            {demoHistory
              .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
              .map((record, index) => (
                <div
                  key={record.id}
                  className='bg-white/5 rounded-lg p-3 border border-white/10 hover:bg-white/10 transition-all duration-300'
                >
                  <div className='flex items-center justify-between mb-2'>
                    <div className='flex items-center space-x-3'>
                      <div className='text-lg'>{record.isFirstCompletion ? '🎉' : '🔄'}</div>
                      <div>
                        <div className='text-sm font-medium text-white'>
                          {record.isFirstCompletion ? 'First Completion' : `Replay #${index}`}
                        </div>
                        <div className='text-xs text-white/60'>
                          {formatDate(record.completedAt)}
                        </div>
                      </div>
                    </div>

                    <div className='flex items-center space-x-2'>
                      <div
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreBadgeColor(record.score)}`}
                      >
                        {record.score}%
                      </div>
                      <div className='text-xs text-yellow-400 font-medium'>
                        +{record.pointsEarned} pts
                      </div>
                    </div>
                  </div>

                  <div className='flex items-center justify-between text-xs text-white/60'>
                    <div className='flex items-center space-x-4'>
                      <span>⏱️ {formatCompletionTime(record.completionTime)}</span>
                      <span>🌐 {record.network}</span>
                    </div>
                    <div className='text-xs'>
                      {record.walletAddress.slice(0, 8)}...{record.walletAddress.slice(-8)}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Achievement Badges */}
      {completionCount > 0 && (
        <div className='mt-4 pt-4 border-t border-white/10'>
          <h4 className='text-sm font-semibold text-white mb-2'>Achievements</h4>
          <div className='flex flex-wrap gap-2'>
            {completionCount >= 1 && (
              <div className='px-2 py-1 bg-green-500/20 border border-green-400/30 text-green-300 rounded-full text-xs'>
                🏆 First Completion
              </div>
            )}
            {completionCount >= 3 && (
              <div className='px-2 py-1 bg-blue-500/20 border border-blue-400/30 text-blue-300 rounded-full text-xs'>
                🔥 Dedicated Learner
              </div>
            )}
            {completionCount >= 5 && (
              <div className='px-2 py-1 bg-purple-500/20 border border-purple-400/30 text-purple-300 rounded-full text-xs'>
                ⭐ Master Explorer
              </div>
            )}
            {bestScore >= 95 && (
              <div className='px-2 py-1 bg-yellow-500/20 border border-yellow-400/30 text-yellow-300 rounded-full text-xs'>
                🎯 Perfect Score
              </div>
            )}
            {averageScore >= 85 && (
              <div className='px-2 py-1 bg-orange-500/20 border border-orange-400/30 text-orange-300 rounded-full text-xs'>
                📈 Consistent Performer
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
