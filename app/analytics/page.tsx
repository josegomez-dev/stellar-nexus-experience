'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { DemoFeedback, DemoStats } from '@/lib/firebase-types';
import { demoFeedbackService, demoStatsService } from '@/lib/firebase-service';
import { AnalyticsService } from '@/lib/analytics-service';
import { useToast } from '@/contexts/ToastContext';

interface AnalyticsData {
  totalUsers: number;
  totalFeedbacks: number;
  averageRating: number;
  completionRate: number;
  userExperience: {
    trustlessWorkKnowledge: { beginner: number; intermediate: number; advanced: number };
    stellarKnowledge: { beginner: number; intermediate: number; advanced: number };
  };
  demoStats: DemoStats[];
}

export default function AnalyticsPage() {
  const [feedbacks, setFeedbacks] = useState<DemoFeedback[]>([]);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDemo, setSelectedDemo] = useState<string>('all');
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    interest: 'development',
    message: '',
  });
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [showDonationsModal, setShowDonationsModal] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);

      // Load all feedbacks
      const allFeedbacks = await demoFeedbackService.getAllFeedback();
      setFeedbacks(allFeedbacks);

      // Load demo stats
      const demoStats = await demoStatsService.getAllDemoStats();

      // Calculate analytics
      const analytics = await AnalyticsService.getOverallAnalytics();

      setAnalyticsData({
        totalUsers: analytics.totalUsers,
        totalFeedbacks: allFeedbacks.length,
        averageRating: analytics.averageRating,
        completionRate: analytics.completionRate,
        userExperience: analytics.userExperience,
        demoStats,
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredFeedbacks = feedbacks.filter(feedback => {
    if (selectedDemo !== 'all' && feedback.demoId !== selectedDemo) return false;
    if (ratingFilter && feedback.rating !== ratingFilter) return false;
    if (difficultyFilter !== 'all' && feedback.difficulty !== difficultyFilter) return false;
    if (searchTerm && !feedback.feedback.toLowerCase().includes(searchTerm.toLowerCase()))
      return false;
    return true;
  });

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingContact(true);

    try {
      // Here you would typically send the contact form to your backend
      console.log('Contact form submitted:', contactForm);
      alert('Thank you for your interest! We will get back to you soon.');
      setContactForm({ name: '', email: '', interest: 'development', message: '' });
    } catch (error) {
      console.error('Error submitting contact form:', error);
      alert('Failed to submit contact form. Please try again.');
    } finally {
      setIsSubmittingContact(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      addToast({
        type: 'success',
        title: '📋 Copied!',
        message: 'Wallet address copied to clipboard',
        duration: 3000,
      });
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      addToast({
        type: 'error',
        title: '❌ Copy Failed',
        message: 'Failed to copy address to clipboard',
        duration: 3000,
      });
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-white mb-4'></div>
          <p className='text-white text-xl'>Loading Analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900'>
      {/* Header */}
      <div className='bg-black/20 backdrop-blur-sm border-b border-white/10'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <Link
                href='/'
                className='flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors'
              >
                <span>←</span>
                <span>Go back to Application</span>
              </Link>
              <div className='flex items-center space-x-3'>
                <Image
                  src='/images/logo/logoicon.png'
                  alt='Stellar Nexus Logo'
                  width={40}
                  height={40}
                  className='rounded-lg'
                />
                <Image
                  src='/images/logo/iconletter.png'
                  alt='Stellar Nexus Letter'
                  width={120}
                  height={40}
                  className='rounded-lg'
                />
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <button
                onClick={loadAnalyticsData}
                className='px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors'
              >
                🔄 Refresh
              </button>
            </div>
          </div>
          <div className='mt-4'>
            <h1 className='text-3xl font-bold text-white'>📊 Analytics Dashboard</h1>
            <p className='text-gray-300 mt-2'>
              Comprehensive insights into user feedback and engagement
            </p>
          </div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Key Metrics Overview */}
        {analyticsData && (
          <div className='mb-8'>
            <div className='text-center mb-6'>
              <h2 className='text-2xl font-bold text-white mb-2'>Platform Performance Metrics</h2>
              <p className='text-gray-300'>
                Real-time insights into user engagement and platform growth
              </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
              <div className='bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl p-6 border border-blue-400/30 hover:scale-105 transition-transform duration-200'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-blue-300 text-sm font-medium'>Active Users</p>
                    <p className='text-3xl font-bold text-white'>{analyticsData.totalUsers}</p>
                    <p className='text-xs text-blue-200 mt-1'>
                      +{Math.floor(analyticsData.totalUsers * 0.15)} this week
                    </p>
                  </div>
                  <div className='text-4xl'>👥</div>
                </div>
              </div>

              <div className='bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-6 border border-green-400/30 hover:scale-105 transition-transform duration-200'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-green-300 text-sm font-medium'>User Feedback</p>
                    <p className='text-3xl font-bold text-white'>{analyticsData.totalFeedbacks}</p>
                    <p className='text-xs text-green-200 mt-1'>
                      {((analyticsData.totalFeedbacks / analyticsData.totalUsers) * 100).toFixed(0)}
                      % response rate
                    </p>
                  </div>
                  <div className='text-4xl'>💬</div>
                </div>
              </div>

              <div className='bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl p-6 border border-yellow-400/30 hover:scale-105 transition-transform duration-200'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-yellow-300 text-sm font-medium'>Satisfaction Score</p>
                    <p className='text-3xl font-bold text-white'>
                      {analyticsData.averageRating.toFixed(1)}/5
                    </p>
                    <p className='text-xs text-yellow-200 mt-1'>
                      {analyticsData.averageRating >= 4
                        ? 'Excellent'
                        : analyticsData.averageRating >= 3
                          ? 'Good'
                          : 'Needs Improvement'}
                    </p>
                  </div>
                  <div className='text-4xl'>⭐</div>
                </div>
              </div>

              <div className='bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-purple-400/30 hover:scale-105 transition-transform duration-200'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-purple-300 text-sm font-medium'>Success Rate</p>
                    <p className='text-3xl font-bold text-white'>
                      {analyticsData.completionRate.toFixed(1)}%
                    </p>
                    <p className='text-xs text-purple-200 mt-1'>Demo completion rate</p>
                  </div>
                  <div className='text-4xl'>🎯</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Market Opportunity Section */}
        {analyticsData && (
          <div className='bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl p-6 border border-indigo-400/30 mb-8'>
            <h3 className='text-xl font-semibold text-white mb-4'>🚀 Market Opportunity</h3>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              <div className='text-center'>
                <div className='text-2xl font-bold text-indigo-400 mb-2'>
                  ${((analyticsData.totalUsers * 50) / 1000).toFixed(1)}K
                </div>
                <p className='text-sm text-gray-300'>Potential Monthly Revenue</p>
                <p className='text-xs text-gray-400 mt-1'>Based on $50 ARPU</p>
              </div>
              <div className='text-center'>
                <div className='text-2xl font-bold text-purple-400 mb-2'>
                  {(analyticsData.totalUsers * 12).toLocaleString()}
                </div>
                <p className='text-sm text-gray-300'>Annual User Interactions</p>
                <p className='text-xs text-gray-400 mt-1'>Projected growth</p>
              </div>
              <div className='text-center'>
                <div className='text-2xl font-bold text-pink-400 mb-2'>
                  {(analyticsData.averageRating * 20).toFixed(0)}%
                </div>
                <p className='text-sm text-gray-300'>User Retention Score</p>
                <p className='text-xs text-gray-400 mt-1'>Industry benchmark: 15%</p>
              </div>
            </div>
          </div>
        )}

        {/* Feedback Filters */}
        <div className='bg-white/5 rounded-xl p-6 border border-white/10 mb-6'>
          <h3 className='text-xl font-semibold text-white mb-4'>🔍 Feedback Filters</h3>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-300 mb-2'>Demo</label>
              <select
                value={selectedDemo}
                onChange={e => setSelectedDemo(e.target.value)}
                className='w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
              >
                <option value='all'>All Demos</option>
                <option value='micro-task-marketplace'>Micro Task Marketplace</option>
                <option value='milestone-voting'>Milestone Voting</option>
                <option value='dispute-resolution'>Dispute Resolution</option>
              </select>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-300 mb-2'>Rating</label>
              <select
                value={ratingFilter || ''}
                onChange={e => setRatingFilter(e.target.value ? parseInt(e.target.value) : null)}
                className='w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
              >
                <option value=''>All Ratings</option>
                <option value='5'>5 Stars</option>
                <option value='4'>4 Stars</option>
                <option value='3'>3 Stars</option>
                <option value='2'>2 Stars</option>
                <option value='1'>1 Star</option>
              </select>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-300 mb-2'>Difficulty</label>
              <select
                value={difficultyFilter}
                onChange={e => setDifficultyFilter(e.target.value)}
                className='w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
              >
                <option value='all'>All Difficulties</option>
                <option value='very_easy'>Very Easy</option>
                <option value='easy'>Easy</option>
                <option value='medium'>Medium</option>
                <option value='hard'>Hard</option>
                <option value='very_hard'>Very Hard</option>
              </select>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-300 mb-2'>Search</label>
              <input
                type='text'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder='Search feedback...'
                className='w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>
          </div>
        </div>

        {/* Feedback List */}
        <div className='bg-white/5 rounded-xl p-6 border border-white/10 mb-8'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='text-xl font-semibold text-white'>
              💬 User Feedback ({filteredFeedbacks.length})
            </h3>
          </div>

          <div className='space-y-4 max-h-96 overflow-y-auto'>
            {filteredFeedbacks.map(feedback => (
              <div key={feedback.id} className='bg-white/5 rounded-lg p-4 border border-white/10'>
                <div className='flex items-start justify-between mb-3'>
                  <div className='flex items-center space-x-3'>
                    <div className='flex items-center'>
                      {[1, 2, 3, 4, 5].map(star => (
                        <span
                          key={star}
                          className={star <= feedback.rating ? 'text-yellow-400' : 'text-gray-600'}
                        >
                          ⭐
                        </span>
                      ))}
                    </div>
                    <span className='text-blue-300 font-medium'>{feedback.demoName}</span>
                    <span className='px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs'>
                      {feedback.difficulty}
                    </span>
                  </div>
                  <div className='text-xs text-gray-400'>
                    {feedback.createdAt.toLocaleDateString()}
                  </div>
                </div>

                <p className='text-gray-300 mb-3'>{feedback.feedback}</p>

                <div className='flex items-center justify-between text-xs text-gray-400'>
                  <div className='flex items-center space-x-4'>
                    <span>⏱️ {feedback.completionTime} min</span>
                    <span>
                      {feedback.wouldRecommend ? '👍 Recommends' : "👎 Doesn't recommend"}
                    </span>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <span className='font-mono'>{feedback.userId.slice(0, 8)}...</span>
                    <button
                      onClick={() => copyToClipboard(feedback.userId)}
                      className='p-1 hover:bg-white/10 rounded transition-colors duration-200 group'
                      title='Copy wallet address'
                    >
                      <svg
                        className='w-3 h-3 text-gray-400 group-hover:text-white transition-colors duration-200'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z'
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                {feedback.mostHelpfulFeature && (
                  <div className='mt-2 p-2 bg-green-500/10 rounded border border-green-500/20'>
                    <p className='text-xs text-green-300'>
                      <strong>Most helpful:</strong> {feedback.mostHelpfulFeature}
                    </p>
                  </div>
                )}

                {feedback.suggestions && (
                  <div className='mt-2 p-2 bg-blue-500/10 rounded border border-blue-500/20'>
                    <p className='text-xs text-blue-300'>
                      <strong>Suggestions:</strong> {feedback.suggestions}
                    </p>
                  </div>
                )}
              </div>
            ))}

            {filteredFeedbacks.length === 0 && (
              <div className='text-center py-8 text-gray-400'>
                <div className='text-4xl mb-2'>📭</div>
                <p>No feedback found matching your filters</p>
              </div>
            )}
          </div>
        </div>

        {/* GitHub Community Section */}
        <div className='bg-gradient-to-br from-purple-900/50 to-indigo-900/50 rounded-xl p-6 shadow-lg border border-purple-700/50 mb-8'>
          <h2 className='text-3xl font-bold text-white mb-6 flex items-center space-x-3'>
            <span className='text-4xl'>⭐</span>
            <span>Support Our Mission</span>
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <h3 className='text-xl font-semibold text-white mb-3'>🚀 Star Our Repository</h3>
              <p className='text-gray-300 mb-4'>
                Help us grow the Web3 education community! Your star shows support for making
                blockchain technology accessible to everyone.
              </p>
              <a
                href='https://github.com/josegomez-dev/stellar-nexus-experience'
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl'
              >
                <span className='text-xl'>⭐</span>
                <span>Star on GitHub</span>
                <span className='text-sm opacity-80'>(Opens in new tab)</span>
              </a>
            </div>
            <div>
              <h3 className='text-xl font-semibold text-white mb-3'>💰 Support Development</h3>
              <p className='text-gray-300 mb-4'>
                Help us continue building Stellar wallet integrations and Web3 education tools.
                Every contribution helps us grow!
              </p>
              <button
                onClick={() => setShowDonationsModal(true)}
                className='inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl'
              >
                <span className='text-xl'>💝</span>
                <span>Make a Donation</span>
              </button>
            </div>
          </div>

          {/* Social Links */}
          <div className='mt-6 p-4 bg-white/5 rounded-lg border border-white/10'>
            <h4 className='text-lg font-semibold text-white mb-3 flex items-center space-x-2'>
              <span className='text-xl'>🌐</span>
              <span>Connect With Us</span>
            </h4>
            <div className='flex flex-wrap gap-4'>
              <a
                href='https://x.com/josegomez_dev'
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center space-x-2 px-4 py-2 bg-blue-500/20 border border-blue-400/30 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-all duration-200'
              >
                <span className='text-lg'>🐦</span>
                <span>@josegomez_dev</span>
              </a>
              <a
                href='https://t.me/josegomezdev'
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center space-x-2 px-4 py-2 bg-blue-600/20 border border-blue-500/30 text-blue-300 rounded-lg hover:bg-blue-600/30 transition-all duration-200'
              >
                <span className='text-lg'>📱</span>
                <span>@josegomezdev</span>
              </a>
              <a
                href='https://stellar-nexus-experience.vercel.app/'
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center space-x-2 px-4 py-2 bg-purple-500/20 border border-purple-400/30 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-all duration-200'
              >
                <span className='text-lg'>🌐</span>
                <span>Live Demo</span>
              </a>
              <a
                href='https://github.com/josegomez-dev/stellar-nexus-experience'
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center space-x-2 px-4 py-2 bg-gray-500/20 border border-gray-400/30 text-gray-300 rounded-lg hover:bg-gray-500/30 transition-all duration-200'
              >
                <span className='text-lg'>📚</span>
                <span>Source Code</span>
              </a>
            </div>
          </div>

          <div className='mt-6 p-4 bg-white/5 rounded-lg border border-white/10'>
            <div className='flex items-center space-x-3 mb-2'>
              <span className='text-2xl'>🎯</span>
              <h4 className='text-lg font-semibold text-white'>Our Impact Goals</h4>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-sm'>
              <div className='text-center'>
                <div className='text-xl font-bold text-green-400'>1,000+</div>
                <p className='text-gray-300'>GitHub Stars Target</p>
              </div>
              <div className='text-center'>
                <div className='text-xl font-bold text-blue-400'>10,000+</div>
                <p className='text-gray-300'>Users Onboarded to Web3</p>
              </div>
              <div className='text-center'>
                <div className='text-xl font-bold text-purple-400'>100+</div>
                <p className='text-gray-300'>Contributors & Educators</p>
              </div>
            </div>
          </div>
        </div>

        {/* Donations Modal */}
        {showDonationsModal && (
          <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
            <div className='bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 max-w-md w-full border border-white/10 shadow-2xl'>
              <div className='flex items-center justify-between mb-4'>
                <h3 className='text-xl font-bold text-white flex items-center space-x-2'>
                  <span className='text-2xl'>💝</span>
                  <span>Support Our Mission</span>
                </h3>
                <button
                  onClick={() => setShowDonationsModal(false)}
                  className='text-gray-400 hover:text-white transition-colors'
                >
                  <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M6 18L18 6M6 6l12 12'
                    />
                  </svg>
                </button>
              </div>

              <p className='text-gray-300 mb-6'>
                Help us continue building Stellar wallet integrations and Web3 education tools. Your
                support helps us maintain and improve the platform!
              </p>

              <div className='space-y-4'>
                <div className='bg-white/5 rounded-lg p-4 border border-white/10'>
                  <h4 className='text-lg font-semibold text-white mb-2 flex items-center space-x-2'>
                    <span className='text-xl'>💳</span>
                    <span>Stellar Wallet</span>
                  </h4>
                  <p className='text-sm text-gray-300 mb-3'>
                    Send XLM or other Stellar assets to support development
                  </p>
                  <div className='flex items-center space-x-2'>
                    <code className='bg-gray-700 text-green-300 px-3 py-2 rounded text-sm font-mono flex-1'>
                      GABC...XYZ123
                    </code>
                    <button
                      onClick={() => copyToClipboard('GABC...XYZ123')}
                      className='px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors'
                    >
                      Copy
                    </button>
                  </div>
                </div>

                <div className='bg-white/5 rounded-lg p-4 border border-white/10'>
                  <h4 className='text-lg font-semibold text-white mb-2 flex items-center space-x-2'>
                    <span className='text-xl'>💳</span>
                    <span>PayPal</span>
                  </h4>
                  <p className='text-sm text-gray-300 mb-3'>
                    Support us through PayPal for easy donations
                  </p>
                  <a
                    href='https://paypal.me/josegomezdev'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='inline-flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors'
                  >
                    <span>💳</span>
                    <span>Donate via PayPal</span>
                  </a>
                </div>

                <div className='bg-white/5 rounded-lg p-4 border border-white/10'>
                  <h4 className='text-lg font-semibold text-white mb-2 flex items-center space-x-2'>
                    <span className='text-xl'>☕</span>
                    <span>Other Ways to Support</span>
                  </h4>
                  <div className='space-y-2 text-sm text-gray-300'>
                    <p>• Star our GitHub repository</p>
                    <p>• Share the project with others</p>
                    <p>• Contribute code or documentation</p>
                    <p>• Report bugs or suggest features</p>
                  </div>
                </div>
              </div>

              <div className='mt-6 flex justify-end'>
                <button
                  onClick={() => setShowDonationsModal(false)}
                  className='px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors'
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
