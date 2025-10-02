'use client';

import React, { useState, useEffect } from 'react';
import { PlatformAnalytics } from './PlatformAnalytics';
import { AccountAnalytics } from './AccountAnalytics';
import { FeedbackAnalytics } from './FeedbackAnalytics';
import { AnalyticsView } from '../types';

interface AnalyticsDashboardProps {
  className?: string;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ className = '' }) => {
  const [activeView, setActiveView] = useState<AnalyticsView>('overview');
  const [loading, setLoading] = useState(false);

  const views = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'feedback', label: 'Feedback', icon: '💬' },
    { id: 'demos', label: 'Demos', icon: '🎮' },
    { id: 'engagement', label: 'Engagement', icon: '⚡' },
  ] as const;

  const renderActiveView = () => {
    switch (activeView) {
      case 'overview':
        return <PlatformAnalytics />;
      case 'users':
        return <AccountAnalytics />;
      case 'feedback':
        return <FeedbackAnalytics />;
      case 'demos':
        return (
          <div className="p-6 bg-white/5 rounded-lg border border-white/20">
            <h2 className="text-xl font-semibold text-white mb-4">Demo Analytics</h2>
            <p className="text-gray-400">Demo analytics coming soon...</p>
          </div>
        );
      case 'engagement':
        return (
          <div className="p-6 bg-white/5 rounded-lg border border-white/20">
            <h2 className="text-xl font-semibold text-white mb-4">Engagement Analytics</h2>
            <p className="text-gray-400">Engagement analytics coming soon...</p>
          </div>
        );
      default:
        return <PlatformAnalytics />;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="p-6 bg-white/5 rounded-lg border border-white/20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Analytics Dashboard</h1>
            <p className="text-gray-400 mt-1">Platform insights and user analytics</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setLoading(true)}
              className="px-4 py-2 bg-blue-500/20 border border-blue-400/50 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors"
            >
              🔄 Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="p-6 bg-white/5 rounded-lg border border-white/20">
        <div className="flex flex-wrap gap-2">
          {views.map((view) => (
            <button
              key={view.id}
              onClick={() => setActiveView(view.id)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeView === view.id
                  ? 'bg-blue-500/20 border border-blue-400/50 text-blue-300'
                  : 'bg-white/5 border border-white/20 text-gray-300 hover:bg-white/10'
              }`}
            >
              <span className="mr-2">{view.icon}</span>
              {view.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="min-h-[600px]">
        {loading ? (
          <div className="p-6 bg-white/5 rounded-lg border border-white/20">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-white/10 rounded w-1/3"></div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-20 bg-white/10 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          renderActiveView()
        )}
      </div>
    </div>
  );
};
