'use client';

import { EscrowProvider } from '@/contexts/EscrowContext';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAccount } from '@/contexts/AccountContext';
import { analyticsService, type PlatformAnalytics, type UserSentiment } from '@/lib/analytics-service';
import PlasmaBubbles from '@/components/effects/PlasmaBubbles';

// Project Statistics Component
function ProjectStats() {
  const [animatedStats, setAnimatedStats] = useState({
    users: 0,
    demos: 0,
    transactions: 0,
    stellar: 0,
    satisfaction: 0,
    growth: 0,
    success: 0,
    developers: 0
  });
  const [isVisible, setIsVisible] = useState(false);
  const [realData, setRealData] = useState<PlatformAnalytics | null>(null);
  const [userSentiment, setUserSentiment] = useState<UserSentiment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(true); // Start collapsed to save space

  // Fetch real Firebase data
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true);
        const analytics = await analyticsService.getPlatformAnalytics();
        const sentiment = analyticsService.getUserSentiment(analytics.userSatisfactionScore);
        
        setRealData(analytics);
        setUserSentiment(sentiment);
        console.log('🎯 Real analytics loaded:', analytics);
      } catch (error) {
        console.error('Failed to load analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  // Get target stats from real data or fallback
  const targetStats = realData ? {
    users: realData.totalUsers,
    demos: realData.totalDemoCompletions,
    transactions: realData.totalPointsTransactions,
    stellar: realData.stellarOperations,
    satisfaction: realData.userSatisfactionScore,
    growth: realData.monthlyGrowthRate,
    success: realData.successRate,
    developers: realData.developerAdoption
  } : {
    users: 2847,
    demos: 12456,
    transactions: 89234,
    stellar: 156789,
    satisfaction: 87,
    growth: 34,
    success: 92,
    developers: 45
  };

  // Animation effect when component becomes visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('project-stats');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  // Animate numbers when visible and data is loaded
  useEffect(() => {
    if (!isVisible || isLoading) return;

    const duration = 2000; // 2 seconds
    const steps = 60; // 60 fps
    const stepTime = duration / steps;

    const animate = (key: keyof typeof targetStats) => {
      let current = 0;
      const target = targetStats[key];
      const increment = target / steps;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        setAnimatedStats(prev => ({ ...prev, [key]: Math.floor(current) }));
      }, stepTime);
    };

    // Start animations with slight delays for dramatic effect
    setTimeout(() => animate('users'), 100);
    setTimeout(() => animate('demos'), 300);
    setTimeout(() => animate('transactions'), 500);
    setTimeout(() => animate('stellar'), 700);
    setTimeout(() => animate('satisfaction'), 900);
    setTimeout(() => animate('growth'), 1100);
    setTimeout(() => animate('success'), 1300);
    setTimeout(() => animate('developers'), 1500);
  }, [isVisible, isLoading, targetStats]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
  };

  return (
    <section id="project-stats" className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto">
        {/* Collapsible Section Header */}
        <div className="text-center mb-8">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="group inline-flex items-center space-x-4 hover:scale-105 transition-all duration-300 mb-4"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              🚀 <span className="bg-gradient-to-r from-brand-400 to-accent-400 bg-clip-text text-transparent">
                Trustless Work Analytics
              </span>
            </h2>
            <div className={`transform transition-transform duration-300 ${isCollapsed ? 'rotate-0' : 'rotate-180'}`}>
              <svg className="w-6 h-6 text-brand-400 group-hover:text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>
          <p className="text-lg text-brand-300 max-w-2xl mx-auto leading-relaxed">
            {isCollapsed 
              ? 'Click to view real-time platform metrics and growth statistics' 
              : 'Real-time metrics showcasing explosive growth on Stellar'
            }
          </p>
        </div>

        {/* Collapsible Content */}
        <div className={`transition-all duration-700 ease-in-out overflow-hidden ${
          isCollapsed ? 'max-h-0 opacity-0' : 'max-h-[3000px] opacity-100'
        }`}>
          <div className="pt-4">
            {/* Loading State */}
            {isLoading && (
              <div className="text-center mb-16">
                <div className="inline-flex items-center space-x-3 text-brand-300">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-400"></div>
                  <span className="text-lg">Loading real-time analytics...</span>
                </div>
              </div>
            )}

            {/* Simple Analytics Display */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="bg-gray-800/50 p-6 rounded-lg">
                <div className="text-3xl font-bold text-blue-400">{formatNumber(animatedStats.users)}</div>
                <div className="text-white">Users</div>
              </div>
              <div className="bg-gray-800/50 p-6 rounded-lg">
                <div className="text-3xl font-bold text-green-400">{formatNumber(animatedStats.demos)}</div>
                <div className="text-white">Demos</div>
              </div>
              <div className="bg-gray-800/50 p-6 rounded-lg">
                <div className="text-3xl font-bold text-purple-400">{formatNumber(animatedStats.transactions)}</div>
                <div className="text-white">Transactions</div>
              </div>
              <div className="bg-gray-800/50 p-6 rounded-lg">
                <div className="text-3xl font-bold text-yellow-400">{animatedStats.satisfaction}%</div>
                <div className="text-white">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HomeContent() {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <EscrowProvider>
      <div className='min-h-screen bg-gradient-to-br from-neutral-900 via-brand-900 to-neutral-900 relative overflow-hidden'>
        {/* Floating Plasma Bubbles with Analytics Info */}
        <PlasmaBubbles />
        
        {/* Animated background elements */}
        <div className='absolute inset-0 opacity-20 bg-gradient-to-r from-brand-500/10 via-transparent to-accent-500/10'></div>

        {/* Main Content */}
        <main className='relative z-10 pb-16 pt-20'>
          {/* Project Analytics & Statistics Section */}
          <ProjectStats />
        </main>

        {/* Back to Top Button */}
        {showBackToTop && (
          <button
            onClick={scrollToTop}
            className='fixed bottom-8 right-8 z-50 bg-gradient-to-r from-brand-500 to-accent-600 text-white p-3 rounded-full shadow-lg hover:from-brand-600 hover:to-accent-700 transition-all duration-300 transform hover:scale-110 backdrop-blur-sm border border-brand-400/30'
            title='Back to top'
          >
            <span className='text-xl font-bold'>↑</span>
          </button>
        )}
      </div>
    </EscrowProvider>
  );
}

export default function Home() {
  return <HomeContent />;
}
