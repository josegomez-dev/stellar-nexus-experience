'use client';

import React, { useState, useEffect } from 'react';
import { PlatformStats, UserEngagementMetrics } from '../types';
import { AnalyticsService } from '../services/analyticsService';

interface PlatformAnalyticsProps {
  className?: string;
}

export const PlatformAnalytics: React.FC<PlatformAnalyticsProps> = ({ className = '' }) => {
  const [platformStats, setPlatformStats] = useState<PlatformStats | null>(null);
  const [userEngagement, setUserEngagement] = useState<UserEngagementMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [stats, engagement] = await Promise.all([
        AnalyticsService.getPlatformStats(),
        AnalyticsService.getUserEngagementMetrics(),
      ]);
      
      setPlatformStats(stats);
      setUserEngagement(engagement);
    } catch (err) {
      console.error('Error loading platform analytics:', err);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`p-6 bg-white/5 rounded-lg border border-white/20 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-white/10 rounded w-1/3"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-20 bg-white/10 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-6 bg-white/5 rounded-lg border border-white/20 ${className}`}>
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={loadAnalytics}
            className="px-4 py-2 bg-blue-500/20 border border-blue-400/50 text-blue-300 rounded-lg hover:bg-blue-500/30"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!platformStats || !userEngagement) {
    return (
      <div className={`p-6 bg-white/5 rounded-lg border border-white/20 ${className}`}>
        <p className="text-gray-400">No analytics data available</p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Platform Overview */}
      <div className="p-6 bg-white/5 rounded-lg border border-white/20">
        <h2 className="text-xl font-semibold text-white mb-6">Platform Overview</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            title="Total Users"
            value={platformStats.totalUsers.toLocaleString()}
            icon="👥"
            color="blue"
          />
          <StatCard
            title="Demos Completed"
            value={platformStats.totalDemosCompleted.toLocaleString()}
            icon="🎮"
            color="green"
          />
          <StatCard
            title="Total Feedback"
            value={platformStats.totalFeedback.toLocaleString()}
            icon="💬"
            color="purple"
          />
          <StatCard
            title="Badges Earned"
            value={platformStats.totalBadgesEarned.toLocaleString()}
            icon="🏆"
            color="yellow"
          />
        </div>
      </div>

      {/* User Engagement */}
      <div className="p-6 bg-white/5 rounded-lg border border-white/20">
        <h2 className="text-xl font-semibold text-white mb-6">User Engagement</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            title="Active Users (7d)"
            value={userEngagement.activeUsers.toLocaleString()}
            icon="🔥"
            color="red"
          />
          <StatCard
            title="New Users (7d)"
            value={userEngagement.newUsers.toLocaleString()}
            icon="✨"
            color="green"
          />
          <StatCard
            title="Retention Rate"
            value={`${userEngagement.userRetentionRate.toFixed(1)}%`}
            icon="📈"
            color="blue"
          />
          <StatCard
            title="Engagement Score"
            value={userEngagement.engagementScore.toFixed(0)}
            icon="⚡"
            color="purple"
          />
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="p-6 bg-white/5 rounded-lg border border-white/20">
        <h2 className="text-xl font-semibold text-white mb-6">Performance Metrics</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            title="Average Rating"
            value={`${platformStats.averageRating.toFixed(1)}/5`}
            icon="⭐"
            color="yellow"
          />
          <StatCard
            title="Avg Completion Time"
            value={`${platformStats.averageCompletionTime.toFixed(1)} min`}
            icon="⏱️"
            color="blue"
          />
          <StatCard
            title="Completion Rate"
            value={`${(platformStats.completionRate * 100).toFixed(1)}%`}
            icon="🎯"
            color="green"
          />
          <StatCard
            title="Feedback Rate"
            value={`${(platformStats.feedbackRate * 100).toFixed(1)}%`}
            icon="📊"
            color="purple"
          />
        </div>
      </div>

      {/* Top Performing Users */}
      <div className="p-6 bg-white/5 rounded-lg border border-white/20">
        <h2 className="text-xl font-semibold text-white mb-6">Top Performing Users</h2>
        
        <div className="space-y-3">
          {userEngagement.topPerformingUsers.slice(0, 5).map((user, index) => (
            <div key={user.userId} className="flex items-center justify-between p-3 bg-white/5 rounded border border-white/10">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-sm font-bold text-black">
                  {index + 1}
                </div>
                <div>
                  <p className="text-white font-medium">{user.displayName}</p>
                  <p className="text-gray-400 text-sm">Level {user.level}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-medium">{user.totalPoints.toLocaleString()} pts</p>
                <p className="text-gray-400 text-sm">{user.demosCompleted} demos, {user.badgesEarned} badges</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  icon: string;
  color: 'blue' | 'green' | 'purple' | 'yellow' | 'red';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    yellow: 'from-yellow-500 to-yellow-600',
    red: 'from-red-500 to-red-600',
  };

  return (
    <div className="p-4 bg-white/5 rounded-lg border border-white/20 hover:bg-white/10 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${colorClasses[color]}`}></div>
      </div>
      <p className="text-2xl font-bold text-white mb-1">{value}</p>
      <p className="text-sm text-gray-400">{title}</p>
    </div>
  );
};
