'use client';

import { useEffect, useState, useMemo } from 'react';
import { WalletSidebar } from '@/components/ui/wallet/WalletSidebar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { NexusPrime } from '@/components/layout/NexusPrime';
import { useGlobalWallet } from '@/contexts/wallet/WalletContext';
import { useAuth } from '@/contexts/auth/AuthContext';
import { HelloMilestoneDemo } from '@/components/demos/HelloMilestoneDemo';
import { MilestoneVotingDemo } from '@/components/demos/MilestoneVotingDemo';
import { DisputeResolutionDemo } from '@/components/demos/DisputeResolutionDemo';
import { MicroTaskMarketplaceDemo } from '@/components/demos/MicroTaskMarketplaceDemo';
import { SimpleFeedbackModal } from '@/components/ui/modals/SimpleFeedbackModal';
import { useToast } from '@/contexts/ui/ToastContext';
import { useBadgeAnimation } from '@/contexts/ui/BadgeAnimationContext';
import { useFirebase } from '@/contexts/data/FirebaseContext';
import { BadgeEmblem } from '@/components/ui/badges/BadgeEmblem';
import { OnboardingOverlay } from '@/components/OnboardingOverlay';
import { ImmersiveDemoModal } from '@/components/ui/modals/ImmersiveDemoModal';
import { TechTreeModal } from '@/components/ui/modals/TechTreeModal';
import { ToastContainer } from '@/components/ui/Toast';
import { AuthBanner } from '@/components/ui/auth/AuthBanner';
import { AuthModal } from '@/components/ui/auth/AuthModal';
import { UserProfile } from '@/components/ui/navigation/UserProfile';
import { AccountStatusIndicator } from '@/components/ui/AccountStatusIndicator';
import { Tooltip } from '@/components/ui/Tooltip';
import { LeaderboardSidebar } from '@/components/ui/LeaderboardSidebar';
import { VideoPreloaderScreen } from '@/components/ui/VideoPreloaderScreen';
import Image from 'next/image';
// Remove unused nexusCodex import
import { getBadgeById, Account, DemoStats, PREDEFINED_DEMOS } from '@/lib/firebase/firebase-types';
import { getBadgeIcon, BADGE_SIZES } from '@/utils/constants/badges/assets';
import { QuestAndReferralSection } from '@/components/ui/quest/QuestAndReferralSection';

// Demo Selection Component
interface DemoCard {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  color: string;
  isReady: boolean;
  multiStakeholderRequired: boolean;
}

// Demo configurations
const demos: DemoCard[] = [
  {
    id: 'hello-milestone',
    title: '1. Baby Steps to Riches',
    subtitle: 'Basic Escrow Flow Demo',
    description:
      'Simple escrow flow with automatic milestone completion. Learn the fundamentals of trustless work: initialize escrow, fund it, complete milestones, approve work, and automatically release funds.',
    icon: '🎮',
    color: 'from-brand-500 to-brand-400',
    isReady: true,
    multiStakeholderRequired: false,
  },
  {
    id: 'dispute-resolution',
    title: '2. Drama Queen Escrow',
    subtitle: 'Dispute Resolution & Arbitration',
    description:
      'Arbitration drama - who will win the trust battle? Experience the full dispute resolution workflow: raise disputes, present evidence, and let arbitrators decide the outcome.',
    icon: '🎮',
    color: 'from-warning-500 to-warning-400',
    isReady: true,
    multiStakeholderRequired: false,
  },
  {
    id: 'micro-marketplace',
    title: '3. Gig Economy Madness',
    subtitle: 'Micro-Task Marketplace',
    description:
      'Lightweight gig-board with escrow! Post tasks, browse opportunities, and manage micro-work with built-in escrow protection for both clients and workers.',
    icon: '🎮',
    color: 'from-accent-500 to-accent-400',
    isReady: true,
    multiStakeholderRequired: false,
  },
  {
    id: 'nexus-master',
    title: 'Nexus Master Achievement',
    subtitle: 'Complete All Main Badges',
    description:
      'The ultimate achievement! Complete all three main demos to unlock the legendary Nexus Master badge and claim your place among the elite.',
    icon: '/images/demos/economy.png', // Using same icon for now
    color: 'from-gray-500 to-gray-400',
    isReady: false, // This will be a special card
    multiStakeholderRequired: false,
  },
];

const DemoSelector = ({
  activeDemo,
  setActiveDemo,
  setShowImmersiveDemo,
  isConnected,
  addToast,
  account,
  demos,
  demoStats,
  completeDemo,
  hasBadge,
  hasClappedDemo,
  clapDemo,
  refreshAccountData,
}: {
  activeDemo: string;
  setActiveDemo: (demo: string) => void;
  setShowImmersiveDemo: (show: boolean) => void;
  isConnected: boolean;
  addToast: (toast: {
    title: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
  }) => void;
  account: Account | null;
  demos: DemoCard[];
  demoStats: DemoStats[];
  completeDemo: (demoId: string, score?: number, completionTimeMinutes?: number) => Promise<void>;
  hasBadge: (badgeId: string) => Promise<boolean>;
  hasClappedDemo: (demoId: string) => Promise<boolean>;
  clapDemo: (demoId: string) => Promise<void>;
  refreshAccountData: () => Promise<void>;
}) => {
  // Removed old AccountContext usage
  // Removed unused showBadgeAnimation
  const [isClaimingNexusMaster, setIsClaimingNexusMaster] = useState(false);

  // State for clap animations
  const [clapAnimations, setClapAnimations] = useState<Record<string, boolean>>({});

  // State for tracking which demos user has clapped for
  const [userClappedDemos, setUserClappedDemos] = useState<string[]>([]);

  // Load clapped demos when component mounts or account changes
  useEffect(() => {
    const loadClappedDemos = async () => {
      if (!isConnected || !account) {
        setUserClappedDemos([]);
        return;
      }

      try {
        // Extract clapped demos from account.clappedDemos
        let clappedArray: string[] = [];
        if (Array.isArray(account.clappedDemos)) {
          clappedArray = account.clappedDemos;
        } else if (account.clappedDemos && typeof account.clappedDemos === 'object') {
          clappedArray = Object.values(account.clappedDemos) as string[];
        }

        setUserClappedDemos(clappedArray);
      } catch (error) {
        // Error loading clapped demos - silently handled
        setUserClappedDemos([]);
      }
    };

    loadClappedDemos();
  }, [isConnected, account]);

  // Handle demo clapping with enhanced animations and sound
  const handleClapDemo = async (demoId: string, demoTitle: string) => {
    // Play clap sound
    const audio = new Audio('/sounds/clapSound.mp3');
    audio.volume = 0.6; // Adjust volume
    audio.play().catch(() => {}); // Silent fallback if audio fails

    // Trigger visual animation
    setClapAnimations(prev => ({ ...prev, [demoId]: true }));

    // Hide animation after 1.5 seconds
    setTimeout(() => {
      setClapAnimations(prev => ({ ...prev, [demoId]: false }));
    }, 1500);

    // Call the backend clap function
    await clapDemo(demoId);

    // Update local state to reflect the new clap
    setUserClappedDemos(prev => [...prev, demoId]);
  };

  // Get badge information for each demo - memoized to prevent setState during render
  const getDemoBadge = useMemo(() => {
    const badgeMap: Record<string, string> = {
      'hello-milestone': 'escrow_expert',
      'dispute-resolution': 'trust_guardian',
      'micro-marketplace': 'stellar_champion',
    };

    return (demoId: string) => {
      const badgeId = badgeMap[demoId];
      if (!badgeId) return null;

      return getBadgeById(badgeId);
    };
  }, []);

  // Check if user has earned the badge for this demo
  // Removed unused hasEarnedBadge function

  const getClapStats = (demoId: string) => {
    const demo = demos.find((d) => d.id === demoId);

    if (!demo) {
      return {
        claps: 0,
        hasClapped: false,
        completions: 0,
      };
    }

    // Find the demo stats from Firebase
    const stats = demoStats.find(stat => stat.demoId === demoId);

    // Show stats for non-connected users too (but no clap functionality)
    if (!isConnected) {
      return {
        claps: stats?.totalClaps || 0, // Show actual claps even when not connected
        hasClapped: false,
        completions: stats?.totalCompletions || 0, // Show actual completions even when not connected
      };
    }

    return {
      claps: stats?.totalClaps || 0,
      hasClapped: userClappedDemos.includes(demoId),
      completions: stats?.totalCompletions || 0,
    };
  };

  const getDemoButtonColors = (demoColor: string) => {
    // Map demo colors to button gradient colors
    switch (demoColor) {
      case 'from-brand-500 to-brand-400':
        return {
          gradient: 'from-brand-500 via-brand-400 to-brand-600',
          hoverGradient: 'hover:from-brand-600 hover:via-brand-500 hover:to-brand-700',
          shadow: 'hover:shadow-brand-500/50',
        };
      case 'from-success-500 to-success-400':
        return {
          gradient: 'from-success-500 via-success-400 to-success-600',
          hoverGradient: 'hover:from-success-600 hover:via-success-500 hover:to-success-700',
          shadow: 'hover:shadow-success-500/50',
        };
      case 'from-warning-500 to-warning-400':
        return {
          gradient: 'from-warning-500 via-warning-400 to-warning-600',
          hoverGradient: 'hover:from-warning-600 hover:via-warning-500 hover:to-warning-700',
          shadow: 'hover:shadow-warning-500/50',
        };
      case 'from-accent-500 to-accent-400':
        return {
          gradient: 'from-accent-500 via-accent-400 to-accent-600',
          hoverGradient: 'hover:from-accent-600 hover:via-accent-500 hover:to-accent-700',
          shadow: 'hover:shadow-accent-500/50',
        };
      default:
        return {
          gradient: 'from-brand-500 via-accent-500 to-brand-400',
          hoverGradient: 'hover:from-brand-600 hover:via-accent-600 hover:to-brand-500',
          shadow: 'hover:shadow-brand-500/50',
        };
    }
  };

  const getDemoBadgeColors = (demoColor: string) => {
    // Map demo colors to badge-specific colors
    switch (demoColor) {
      case 'from-brand-500 to-brand-400':
        return {
          gradient: 'from-brand-500 to-brand-400',
          background: 'from-brand-500/20 to-brand-400/20',
          border: 'border-brand-400/30',
          titleColor: 'text-brand-200',
          descriptionColor: 'text-brand-300/80',
        };
      case 'from-success-500 to-success-400':
        return {
          gradient: 'from-success-500 to-success-400',
          background: 'from-success-500/20 to-success-400/20',
          border: 'border-success-400/30',
          titleColor: 'text-success-200',
          descriptionColor: 'text-success-300/80',
        };
      case 'from-warning-500 to-warning-400':
        return {
          gradient: 'from-warning-500 to-warning-400',
          background: 'from-warning-500/20 to-warning-400/20',
          border: 'border-warning-400/30',
          titleColor: 'text-warning-200',
          descriptionColor: 'text-warning-300/80',
        };
      case 'from-accent-500 to-accent-400':
        return {
          gradient: 'from-accent-500 to-accent-400',
          background: 'from-accent-500/20 to-accent-400/20',
          border: 'border-accent-400/30',
          titleColor: 'text-accent-200',
          descriptionColor: 'text-accent-300/80',
        };
      default:
        return {
          gradient: 'from-brand-500 to-brand-400',
          background: 'from-brand-500/20 to-brand-400/20',
          border: 'border-brand-400/30',
          titleColor: 'text-brand-200',
          descriptionColor: 'text-brand-300/80',
        };
    }
  };

  const getDemoColorValue = (demoColor: string, variant: number) => {
    // Map demo colors to actual color values for CSS variables
    switch (demoColor) {
      case 'from-brand-500 to-brand-400':
        return variant === 1 ? '#0ea5e9' : variant === 2 ? '#38bdf8' : '#7dd3fc';
      case 'from-success-500 to-success-400':
        return variant === 1 ? '#22c55e' : variant === 2 ? '#4ade80' : '#86efac';
      case 'from-warning-500 to-warning-400':
        return variant === 1 ? '#f59e0b' : variant === 2 ? '#fbbf24' : '#fcd34d';
      case 'from-accent-500 to-accent-400':
        return variant === 1 ? '#d946ef' : variant === 2 ? '#e879f9' : '#f0abfc';
      default:
        return variant === 1 ? '#0ea5e9' : variant === 2 ? '#38bdf8' : '#7dd3fc';
    }
  };

  const getDemoCardColors = (demoColor: string, isCompleted: boolean = false) => {
    // Map demo colors to card background and title colors
    const baseOpacity = isCompleted ? 25 : 15;
    const hoverOpacity = isCompleted ? 35 : 20;
    const borderOpacity = isCompleted ? 60 : 30;
    const hoverBorderOpacity = isCompleted ? 80 : 50;
    const shadowOpacity = isCompleted ? 40 : 20;
    const hoverShadowOpacity = isCompleted ? 60 : 30;

    switch (demoColor) {
      case 'from-brand-500 to-brand-400':
        return {
          background: `bg-gradient-to-br from-brand-500/${baseOpacity} via-brand-400/${baseOpacity - 5} to-brand-600/${baseOpacity}`,
          hoverBackground: `hover:from-brand-500/${hoverOpacity} hover:via-brand-400/${hoverOpacity - 5} hover:to-brand-600/${hoverOpacity}`,
          border: `border-brand-400/${borderOpacity}`,
          hoverBorder: `hover:border-brand-400/${hoverBorderOpacity}`,
          titleColor: 'text-brand-200',
          hoverTitleColor: 'group-hover:text-brand-100',
          shadow: `shadow-brand-500/${shadowOpacity}`,
          hoverShadow: `hover:shadow-brand-500/${hoverShadowOpacity}`,
        };
      case 'from-success-500 to-success-400':
        return {
          background: `bg-gradient-to-br from-success-500/${baseOpacity} via-success-400/${baseOpacity - 5} to-success-600/${baseOpacity}`,
          hoverBackground: `hover:from-success-500/${hoverOpacity} hover:via-success-400/${hoverOpacity - 5} hover:to-success-600/${hoverOpacity}`,
          border: `border-success-400/${borderOpacity}`,
          hoverBorder: `hover:border-success-400/${hoverBorderOpacity}`,
          titleColor: 'text-success-200',
          hoverTitleColor: 'group-hover:text-success-100',
          shadow: `shadow-success-500/${shadowOpacity}`,
          hoverShadow: `hover:shadow-success-500/${hoverShadowOpacity}`,
        };
      case 'from-warning-500 to-warning-400':
        return {
          background: `bg-gradient-to-br from-warning-500/${baseOpacity} via-warning-400/${baseOpacity - 5} to-warning-600/${baseOpacity}`,
          hoverBackground: `hover:from-warning-500/${hoverOpacity} hover:via-warning-400/${hoverOpacity - 5} hover:to-warning-600/${hoverOpacity}`,
          border: `border-warning-400/${borderOpacity}`,
          hoverBorder: `hover:border-warning-400/${hoverBorderOpacity}`,
          titleColor: 'text-warning-200',
          hoverTitleColor: 'group-hover:text-warning-100',
          shadow: `shadow-warning-500/${shadowOpacity}`,
          hoverShadow: `hover:shadow-warning-500/${hoverShadowOpacity}`,
        };
      case 'from-accent-500 to-accent-400':
        return {
          background: `bg-gradient-to-br from-accent-500/${baseOpacity} via-accent-400/${baseOpacity - 5} to-accent-600/${baseOpacity}`,
          hoverBackground: `hover:from-accent-500/${hoverOpacity} hover:via-accent-400/${hoverOpacity - 5} hover:to-accent-600/${hoverOpacity}`,
          border: `border-accent-400/${borderOpacity}`,
          hoverBorder: `hover:border-accent-400/${hoverBorderOpacity}`,
          titleColor: 'text-accent-200',
          hoverTitleColor: 'group-hover:text-accent-100',
          shadow: `shadow-accent-500/${shadowOpacity}`,
          hoverShadow: `hover:shadow-accent-500/${hoverShadowOpacity}`,
        };
      default:
        return {
          background: 'bg-gradient-to-br from-white/5 to-white/10',
          hoverBackground: 'hover:from-white/10 hover:to-white/15',
          border: 'border-white/20',
          hoverBorder: 'hover:border-white/30',
          titleColor: 'text-white',
          hoverTitleColor: 'group-hover:text-brand-200',
          shadow: '',
          hoverShadow: '',
        };
    }
  };

  // Removed unused handleArticleClick function

  return (
    <div className='space-y-8'>
      {/* Demo Cards */}
      <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-2'>
        {demos.map((demo: DemoCard) => {
          // Handle both array and object formats for demosCompleted (Firebase sometimes stores arrays as objects)
          let demosCompletedArray: string[] = [];
          if (Array.isArray(account?.demosCompleted)) {
            demosCompletedArray = account.demosCompleted;
          } else if (account?.demosCompleted && typeof account.demosCompleted === 'object') {
            demosCompletedArray = Object.values(account.demosCompleted);
          }

          const isCompleted = demosCompletedArray.includes(demo.id);

          // Check if user has earned the badge for this demo synchronously
          const badgeMap: Record<string, string> = {
            'hello-milestone': 'escrow_expert',
            'dispute-resolution': 'trust_guardian',
            'micro-marketplace': 'stellar_champion',
          };
          const badgeId = badgeMap[demo.id];

          // Handle both array and object formats for badgesEarned (Firebase sometimes stores arrays as objects)
          let badgesEarnedArray: string[] = [];
          if (Array.isArray(account?.badgesEarned)) {
            badgesEarnedArray = account.badgesEarned;
          } else if (account?.badgesEarned && typeof account.badgesEarned === 'object') {
            badgesEarnedArray = Object.values(account.badgesEarned);
          }

          const earnedBadge = badgeId ? badgesEarnedArray.includes(badgeId) : false;
          const badge = getDemoBadge(demo.id);

          // Special logic for Nexus Master card
          const allDemosCompleted = demosCompletedArray.length === 3;
          const hasNexusMasterBadge = badgesEarnedArray.includes('nexus_master');
          const isNexusMasterCard = demo.id === 'nexus-master';
          const isNexusMasterReady = isNexusMasterCard && allDemosCompleted;
          const isNexusMasterCompleted = isNexusMasterCard && hasNexusMasterBadge;

          return (
            <div
              key={demo.id}
              className={`demo-card p-6 rounded-xl border-2 transition-all duration-500 ease-out transform hover:scale-105 min-h-[420px] relative overflow-hidden group ${
                isNexusMasterCard
                  ? // Nexus Master Card - Simple styling
                    `bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-600/50 hover:border-purple-400/50 ${allDemosCompleted ? 'hover:shadow-purple-500/20' : ''}`
                  : activeDemo === demo.id
                    ? `border-white/50 bg-gradient-to-br ${demo.color}/20`
                    : isCompleted || isNexusMasterCompleted
                      ? `${getDemoCardColors(demo.color, true).background} ${getDemoCardColors(demo.color, true).hoverBackground} ${getDemoCardColors(demo.color, true).border} ${getDemoCardColors(demo.color, true).hoverBorder} ${getDemoCardColors(demo.color, true).shadow} ${getDemoCardColors(demo.color, true).hoverShadow} completed ${
                          earnedBadge || isNexusMasterCompleted ? 'earned-badge' : ''
                        }`
                      : `${getDemoCardColors(demo.color, false).background} ${getDemoCardColors(demo.color, false).hoverBackground} ${getDemoCardColors(demo.color, false).border} ${getDemoCardColors(demo.color, false).hoverBorder} ${getDemoCardColors(demo.color, false).shadow} ${getDemoCardColors(demo.color, false).hoverShadow}`
              } ${!demo.isReady && !isNexusMasterReady ? 'pointer-events-none' : ''} ${
                // Ensure earned-badge class is applied for completed demos with badges (but not for Nexus Master card)
                (isCompleted && earnedBadge && !isNexusMasterCard) ||
                (isNexusMasterCompleted && !isNexusMasterCard)
                  ? 'earned-badge'
                  : ''
              }`}
              data-demo-id={demo.id}
              style={
                !isNexusMasterCard
                  ? ({
                      '--demo-color-1': getDemoColorValue(demo.color, 1),
                      '--demo-color-2': getDemoColorValue(demo.color, 2),
                      '--demo-color-3': getDemoColorValue(demo.color, 3),
                    } as React.CSSProperties)
                  : {}
              }
            >
              {/* Locked Badge for Nexus Master when not ready */}
              {isNexusMasterCard && !allDemosCompleted && !hasNexusMasterBadge && (
                <div className='absolute top-4 right-4 z-50'>
                  <div className='bg-gradient-to-r from-gray-600 to-gray-700 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg flex items-center gap-2'>
                    🔒 Locked
                  </div>
                </div>
              )}

              {/* Ready Badge for Nexus Master when ready */}
              {isNexusMasterCard && allDemosCompleted && !hasNexusMasterBadge && (
                <div className='absolute top-4 right-4 z-50'>
                  <div className='bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg flex items-center gap-2 animate-pulse'>
                    ✨ Ready to Claim
                  </div>
                </div>
              )}

              {/* Completed Badge for finished demos */}
              {demo.isReady && isCompleted && (
                <div className='absolute top-4 right-4 z-50'>
                  {earnedBadge && badge ? (
                    <div
                    // className={`bg-gradient-to-r ${getDemoBadgeColors(demo.color).gradient} text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg flex items-center gap-2 badge-shine`}
                    >
                      {/* <div className='badge-icon-bounce'>
                        <BadgeEmblem id={badge.id} size='sm' className='text-white' />
                      </div> */}
                      {/* <span>{badge.name}</span> */}
                    </div>
                  ) : (
                    <div
                      className={`bg-gradient-to-r ${getDemoBadgeColors(demo.color).gradient} text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg flex items-center gap-2`}
                    >
                      {getBadgeIcon('escrow_expert', BADGE_SIZES.sm) || (
                        <BadgeEmblem id='escrow_expert' size='sm' className='text-white' />
                      )}
                      <span>Completed</span>
                    </div>
                  )}
                </div>
              )}

              {/* Completed Badge for Nexus Master */}
              {isNexusMasterCard && hasNexusMasterBadge && (
                <div className='absolute top-4 right-4 z-50'>
                  <div className='bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg flex items-center gap-2 badge-shine'>
                    <div className='badge-icon-bounce'>
                      {getBadgeIcon('nexus_master', BADGE_SIZES.sm) || (
                        <BadgeEmblem id='nexus-master' size='sm' className='text-white' />
                      )}
                    </div>
                    <span>Nexus Master</span>
                  </div>
                </div>
              )}

              {/* Blur Overlay for non-ready demos */}
              {!demo.isReady && !isNexusMasterReady && (
                <div className='absolute inset-0 bg-black/60 backdrop-blur-md rounded-xl z-10'></div>
              )}

              {/* Floating particles for completed demos with badges */}
              {((isCompleted && earnedBadge) || isNexusMasterCompleted) && (
                <div className='absolute inset-0 pointer-events-none overflow-hidden'>
                  {(() => {
                    // Get the specific badge ID for this demo
                    let badgeId = 'nexus_master'; // Default for Nexus Master card

                    if (isNexusMasterCard) {
                      badgeId = 'nexus_master';
                    } else if (earnedBadge && badge) {
                      // Use the earned badge ID
                      badgeId = badge.id;
                    } else if (demo.id) {
                      // Map demo ID to badge ID
                      const demoBadgeMap: Record<string, string> = {
                        'hello-milestone': 'escrow_expert',
                        'dispute-resolution': 'trust_guardian',
                        'micro-marketplace': 'stellar_champion',
                      };
                      badgeId = demoBadgeMap[demo.id] || 'nexus_master';
                    }

                    return (
                      <>
                        {/* <div className='absolute top-4 left-4 floating-particle opacity-70'>
                          <BadgeEmblem id={badgeId} size='sm' className='text-yellow-400' />
                        </div> */}
                        {/* <div className='absolute top-8 right-8 floating-particle opacity-80' style={{ animationDelay: '0.5s' }}>
                          <BadgeEmblem id={badgeId} size='sm' className='text-orange-400' />
                        </div> */}
                        <div
                          className='absolute bottom-8 left-8 floating-particle opacity-60'
                          style={{ animationDelay: '1s' }}
                        >
                          {getBadgeIcon(badgeId, BADGE_SIZES.sm) || (
                            <BadgeEmblem id={badgeId} size='sm' className='text-yellow-300' />
                          )}
                        </div>
                        <div
                          className='absolute bottom-4 right-4 floating-particle opacity-90'
                          style={{ animationDelay: '1.5s' }}
                        >
                          {getBadgeIcon(badgeId, BADGE_SIZES.sm) || (
                            <BadgeEmblem id={badgeId} size='sm' className='text-orange-300' />
                          )}
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}

              {/* Content with reduced opacity for non-ready demos */}
              <div
                className={`relative ${!demo.isReady && !isNexusMasterReady ? 'z-20 opacity-30' : 'z-10'}`}
              >
                {/* Clap Statistics Box - Above start button (exclude for Nexus Master card) */}
                {!isNexusMasterCard && (
                  <div className={`mb-3 ${!demo.isReady && !isNexusMasterReady ? 'blur-sm' : ''}`}>
                    <div className='bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20'>
                      {(() => {
                        const stats = getClapStats(demo.id);
                        return (
                          <div className='grid grid-cols-3 gap-3 text-center'>
                            <div>
                              <div className='text-lg font-bold text-cyan-400'>{stats.claps}</div>
                              <div className='text-xs text-white/60'>Claps</div>
                            </div>
                            <div>
                              <div className='text-lg font-bold text-amber-400'>
                                {stats.completions}
                              </div>
                              <div className='text-xs text-white/60'>Completions:</div>
                            </div>
                            <div className='relative'>
                              <button
                                onClick={e => {
                                  e.stopPropagation();
                                  handleClapDemo(demo.id, demo.title);
                                }}
                                disabled={stats.hasClapped || !isConnected}
                                className={`w-full transition-all duration-200 hover:scale-105 ${
                                  stats.hasClapped
                                    ? 'text-emerald-400 cursor-not-allowed'
                                    : !isConnected
                                      ? 'text-gray-500 cursor-not-allowed'
                                      : 'text-emerald-400 hover:text-emerald-300'
                                } ${clapAnimations[demo.id] ? 'animate-bounce' : ''}`}
                                title={
                                  stats.hasClapped
                                    ? 'Already clapped!'
                                    : !isConnected
                                      ? 'Connect wallet to clap!'
                                      : 'Clap for this demo!'
                                }
                              >
                                <div
                                  className={`text-lg font-bold transition-transform duration-200 ${
                                    clapAnimations[demo.id] ? 'animate-pulse' : ''
                                  }`}
                                >
                                  {stats.hasClapped ? '✓' : '👏🏻'}
                                </div>
                                <div className='text-xs text-white/60'>
                                  {stats.hasClapped ? 'Clapped!' : 'Clap'}
                                </div>
                              </button>

                              {/* Animated sparks effect */}
                              {clapAnimations[demo.id] && (
                                <>
                                  <div className='absolute inset-0 pointer-events-none'>
                                    <div className='absolute top-0 left-1/2 w-1 h-1 bg-yellow-400 rounded-full animate-ping'></div>
                                    <div
                                      className='absolute top-1 left-1/3 w-0.5 h-0.5 bg-orange-400 rounded-full animate-ping'
                                      style={{ animationDelay: '0.1s' }}
                                    ></div>
                                    <div
                                      className='absolute top-1 right-1/3 w-0.5 h-0.5 bg-yellow-300 rounded-full animate-ping'
                                      style={{ animationDelay: '0.2s' }}
                                    ></div>
                                    <div
                                      className='absolute bottom-0 left-1/2 w-1 h-1 bg-emerald-400 rounded-full animate-ping'
                                      style={{ animationDelay: '0.3s' }}
                                    ></div>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                )}

                {/* Nexus Master Card - Simple Title */}
                {isNexusMasterCard ? (
                  <div className='flex flex-col items-center justify-center h-full text-center'>
                    {/* Big Crown Icon */}
                    <div className='text-6xl mb-4 animate-pulse'>👑</div>
                    <h3 className='text-xl font-bold text-white mb-2'>{demo.title}</h3>
                    <h4 className='text-sm text-gray-300 uppercase tracking-wide'>
                      {demo.subtitle}
                    </h4>
                  </div>
                ) : (
                  <>
                    {/* Epic Legendary Background for Demo Title */}
                    <div className='relative mb-3'>
                      {/* Energy Background */}
                      <div className='absolute inset-0 pointer-events-none'>
                        {/* Energy Core */}
                        <div
                          className='absolute inset-0 rounded-lg blur-sm'
                          style={{
                            background: `linear-gradient(to right, var(--demo-color-1)/20, var(--demo-color-2)/25, var(--demo-color-3)/20)`,
                          }}
                        ></div>

                        {/* Floating Particles */}
                        <div
                          className='absolute top-1 left-1/4 w-1 h-1 rounded-full animate-ping opacity-70'
                          style={{ backgroundColor: 'var(--demo-color-1)' }}
                        ></div>
                        <div
                          className='absolute top-2 right-1/3 w-1 h-1 rounded-full animate-ping opacity-80'
                          style={{
                            backgroundColor: 'var(--demo-color-2)',
                            animationDelay: '0.5s',
                          }}
                        ></div>
                        <div
                          className='absolute bottom-1 left-1/3 w-1 h-1 rounded-full animate-ping opacity-60'
                          style={{
                            backgroundColor: 'var(--demo-color-3)',
                            animationDelay: '1s',
                          }}
                        ></div>

                        {/* Energy Streams */}
                        <div
                          className='absolute left-0 top-1/2 w-1 h-6 bg-gradient-to-b from-transparent to-transparent animate-pulse opacity-50'
                          style={{
                            background: `linear-gradient(to bottom, transparent, var(--demo-color-1)/40, transparent)`,
                          }}
                        ></div>
                        <div
                          className='absolute right-0 top-1/2 w-1 h-4 bg-gradient-to-b from-transparent to-transparent animate-pulse opacity-60'
                          style={{
                            background: `linear-gradient(to bottom, transparent, var(--demo-color-2)/40, transparent)`,
                          }}
                        ></div>
                      </div>

                      {/* Demo Title with Enhanced Styling */}
                      <h3
                        className={`relative z-10 font-bold text-left text-lg leading-tight drop-shadow-lg group-hover:drop-shadow-2xl transition-all duration-500 ${getDemoCardColors(demo.color, isCompleted).titleColor} ${getDemoCardColors(demo.color, isCompleted).hoverTitleColor}`}
                      >
                        {demo.title}
                      </h3>
                    </div>

                    <h4
                      className={`font-semibold mb-3 text-left text-sm uppercase tracking-wide ${getDemoCardColors(demo.color, isCompleted).titleColor.replace('200', '300')}`}
                    >
                      {demo.subtitle}
                    </h4>

                    {/* Show badge info for completed demos with earned badges, otherwise show description */}
                    {isCompleted && earnedBadge && badge ? (
                      <div className='mb-4'>
                        <div
                          className={`bg-gradient-to-r ${getDemoBadgeColors(demo.color).background} border ${getDemoBadgeColors(demo.color).border} rounded-lg p-4 mb-3 relative`}
                        >
                          {/* Floating XP text in top right corner */}
                          <div className='absolute top-2 right-2'>
                            <span
                              className={`${getDemoBadgeColors(demo.color).descriptionColor} text-xs font-semibold bg-black/20 px-2 py-1 rounded-full backdrop-blur-sm`}
                            >
                              +{badge?.earningPoints || 0} XP
                            </span>
                          </div>
                          <div className='flex items-center gap-3 mb-2'>
                            <div>
                              <BadgeEmblem id={badge.id} size='lg' />
                            </div>
                            <div>
                              <h5
                                className={`font-bold ${getDemoBadgeColors(demo.color).titleColor} text-lg`}
                              >
                                {badge.name}
                              </h5>
                              <p
                                className={`${getDemoBadgeColors(demo.color).descriptionColor} text-sm`}
                              >
                                {badge.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p
                        className={`text-sm text-white/70 text-left leading-relaxed mb-4 ${!demo.isReady && !isNexusMasterReady ? 'blur-sm' : ''}`}
                      >
                        {demo.description}
                      </p>
                    )}
                  </>
                )}

                {/* Demo Action Section */}
                <div className='flex flex-col items-center space-y-2'>
                  {isNexusMasterCard ? (
                    /* Nexus Master Card - Simple Claim Button */
                    isNexusMasterCompleted ? (
                      /* Nexus Master Completed */
                      <div className='flex flex-col items-center justify-center h-full'>
                        <div className='text-4xl mb-4 animate-pulse'>👑</div>
                        <div className='text-xl font-bold text-green-400 mb-2'>NEXUS MASTER</div>
                        <div className='text-sm text-green-300/80'>Achievement Unlocked!</div>
                      </div>
                    ) : allDemosCompleted ? (
                      /* Ready to Claim Nexus Master */
                      <div className='flex flex-col items-center justify-center h-full'>
                        <div className='text-4xl mb-4 animate-bounce'>👑</div>
                        <div className='text-lg font-bold text-purple-300 mb-2'>NEXUS MASTER</div>
                        <div className='text-sm text-gray-300/80 mb-4 text-center px-2'>
                          Master of all trustless work demos
                        </div>
                        <div className='text-xs text-yellow-300/70 mb-4'>
                          Reward: 200 XP + Legendary Badge
                        </div>
                        <button
                          onClick={async () => {
                            if (isClaimingNexusMaster) return; // Prevent multiple clicks

                            setIsClaimingNexusMaster(true);
                            try {
                              // Use the completeDemo function to properly award the Nexus Master badge
                              // Note: completeDemo will automatically show the badge animation
                              await completeDemo('nexus-master', 100, 1); // Complete Nexus Master demo with perfect score and 1 minute completion time

                              // Show success toast
                              addToast({
                                type: 'success',
                                title: '👑 Nexus Master Unlocked!',
                                message:
                                  'You have mastered all trustless work demos! Earned 200 XP and the legendary Nexus Master badge!',
                              });

                              // Refresh account data to update UI
                              await refreshAccountData();
                            } catch (error) {
                              addToast({
                                type: 'error',
                                title: '❌ Claim Failed',
                                message: 'Failed to claim Nexus Master badge. Please try again.',
                              });
                            } finally {
                              setIsClaimingNexusMaster(false);
                            }
                          }}
                          disabled={isClaimingNexusMaster}
                          className={`px-6 py-3 font-bold rounded-lg transition-all duration-300 transform ${
                            isClaimingNexusMaster
                              ? 'scale-95 cursor-not-allowed opacity-75'
                              : 'hover:scale-105 cursor-pointer'
                          } bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-purple-500/50 border border-white/30 relative overflow-hidden`}
                        >
                          {isClaimingNexusMaster && (
                            <div className='absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 animate-pulse'></div>
                          )}
                          <div className='relative flex items-center justify-center space-x-2'>
                            {isClaimingNexusMaster ? (
                              <>
                                <div className='animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent'></div>
                                <span>PROCESSING...</span>
                              </>
                            ) : (
                              <>
                                <span>👑</span>
                                <span>CLAIM NEXUS MASTER</span>
                              </>
                            )}
                          </div>
                        </button>
                      </div>
                    ) : (
                      /* Nexus Master Locked */
                      <div className='flex flex-col items-center justify-center h-full'>
                        <div className='text-4xl mb-4 text-gray-400'>🔒</div>
                        <div className='text-sm text-gray-300/80 text-center'>
                          Complete all 3 demos to unlock
                        </div>
                        <div className='mt-2 text-xs text-gray-400/70'>
                          Progress: {account?.demosCompleted?.length || 0}/3
                        </div>
                      </div>
                    )
                  ) : demo.isReady ? (
                    isCompleted ? (
                      /* Completed Demo - Show colored text instead of button */
                      <div className='text-center'>
                        <div className='text-2xl font-bold text-green-400 mb-2 animate-pulse'>
                          ✅ COMPLETED
                        </div>
                        <div className='text-sm text-green-300/80 font-semibold'>
                          Demo Successfully Finished!
                        </div>

                        {/* Do Again Link */}
                        <div className='mt-4'>
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              if (isConnected) {
                                setActiveDemo(demo.id);
                                setShowImmersiveDemo(true);
                              }
                            }}
                            className={`text-sm font-semibold hover:underline transition-all duration-200 ${getDemoBadgeColors(demo.color).titleColor} hover:${getDemoBadgeColors(demo.color).titleColor.replace('300', '200')}`}
                          >
                            🔄 Do Again to Earn More XP!
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Incomplete Demo - Show launch button */
                      <div className='relative group'>
                        {/* Epic Background Glow */}
                        <div className='absolute inset-0 bg-gradient-to-r from-brand-500/30 via-accent-500/40 to-brand-400/30 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-500 animate-pulse'></div>

                        {/* Floating Particles */}
                        <div className='absolute inset-0 overflow-hidden rounded-xl'>
                          <div className='absolute top-2 left-1/4 w-1 h-1 bg-brand-400 rounded-full animate-ping opacity-70'></div>
                          <div
                            className='absolute top-4 right-1/3 w-1 h-1 bg-accent-400 rounded-full animate-ping opacity-80'
                            style={{ animationDelay: '0.5s' }}
                          ></div>
                          <div
                            className='absolute bottom-2 left-1/3 w-1 h-1 bg-brand-300 rounded-full animate-ping opacity-60'
                            style={{ animationDelay: '1s' }}
                          ></div>
                          <div
                            className='absolute bottom-4 right-1/4 w-1 h-1 bg-accent-300 rounded-full animate-ping opacity-90'
                            style={{ animationDelay: '1.5s' }}
                          ></div>
                        </div>

                        {/* Energy Streams */}
                        <div className='absolute inset-0 overflow-hidden rounded-xl'>
                          <div className='absolute left-0 top-1/2 w-1 h-8 bg-gradient-to-b from-transparent via-brand-400/50 to-transparent animate-pulse opacity-60'></div>
                          <div className='absolute right-0 top-1/2 w-1 h-6 bg-gradient-to-b from-transparent via-accent-400/50 to-transparent animate-pulse opacity-70'></div>
                        </div>
                        <br />

                        {/* Main Button */}
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            if (isConnected) {
                              setActiveDemo(demo.id);
                              setShowImmersiveDemo(true);
                            }
                          }}
                          disabled={!isConnected}
                          className={`relative px-8 py-4 font-bold rounded-xl transition-all duration-500 transform shadow-2xl border-2 text-lg ${
                            isConnected
                              ? `hover:scale-110 hover:rotate-1 ${getDemoButtonColors(demo.color).shadow} bg-gradient-to-r ${getDemoButtonColors(demo.color).gradient} ${getDemoButtonColors(demo.color).hoverGradient} text-white border-white/30 hover:border-white/60`
                              : 'bg-gradient-to-r from-gray-600 via-gray-700 to-gray-600 text-gray-400 border-gray-600 cursor-not-allowed opacity-60'
                          }`}
                        >
                          {/* Button Content */}
                          <div className='flex items-center'>
                            <div className='flex flex-col'>
                              <span className='text-lg font-bold'>
                                {!isConnected ? 'CONNECT WALLET' : 'LAUNCH DEMO'}
                              </span>
                              <span className='text-xs opacity-80'>
                                {!isConnected
                                  ? 'Required to launch demo'
                                  : 'Prepare for AWESOMENESS!'}
                              </span>
                            </div>
                          </div>

                          {/* Hover Effects - Only show when connected */}
                          {isConnected && (
                            <div className='absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                          )}
                        </button>
                      </div>
                    )
                  ) : !isNexusMasterCard ? (
                    <button
                      disabled={true}
                      className='px-6 py-3 font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border-2 bg-white/10 border border-white/20 text-white/40 cursor-not-allowed'
                    >
                      {!isConnected ? 'Connect Wallet' : 'Coming Soon'}
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function HomePageContent() {
  const { isConnected } = useGlobalWallet();
  // Removed unused authentication variables
  const {
    account,
    demoStats,
    completeDemo,
    hasBadge,
    hasClappedDemo,
    clapDemo,
    refreshAccountData,
    isLoading: firebaseLoading,
    isInitialized,
  } = useFirebase();
  const { addToast: addToastHook } = useToast();
  const [activeDemo, setActiveDemo] = useState('hello-milestone');
  // Note: submitFeedback removed from simplified Firebase context
  // Removed old AccountService usage

  // Check if user has unlocked mini-games access (earned all badges including Nexus Master)
  const miniGamesUnlocked = useMemo(() => {
    if (!account || !account.badgesEarned) return false;

    // Handle both array and object formats for badgesEarned (Firebase sometimes stores arrays as objects)
    let badgesEarnedArray: string[] = [];
    if (Array.isArray(account.badgesEarned)) {
      badgesEarnedArray = account.badgesEarned;
    } else if (typeof account.badgesEarned === 'object') {
      badgesEarnedArray = Object.values(account.badgesEarned);
    }

    // Check if user has earned all required badges
    const requiredBadges = ['welcome_explorer', 'escrow_expert', 'trust_guardian', 'stellar_champion', 'nexus_master'];
    const hasAllBadges = requiredBadges.every(badgeId => badgesEarnedArray.includes(badgeId));

    return hasAllBadges;
  }, [account]);

  const [walletSidebarOpen, setWalletSidebarOpen] = useState(false);
  const [walletExpanded, setWalletExpanded] = useState(false);
  const [leaderboardSidebarOpen, setLeaderboardSidebarOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  // Feedback modal state
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackDemoData, setFeedbackDemoData] = useState<{
    demoId: string;
    demoName: string;
    completionTime: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStep, setLoadingStep] = useState(0);
  const [showImmersiveDemo, setShowImmersiveDemo] = useState(false);
  const [showTechTree, setShowTechTree] = useState(false);

  // Authentication modals
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signup' | 'signin'>('signup');
  const [showUserProfile, setShowUserProfile] = useState(false);

  // Initialize Firebase data on app load
  useEffect(() => {
    // Firebase initialization is handled by FirebaseContext
  }, []);

  // Check if this is the first time loading the page
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasLoadedBefore = localStorage.getItem('homePageLoaded');
      if (hasLoadedBefore) {
        setIsLoading(false);
      }
    }
  }, []);

  // Preloader effect - track actual loading progress
  useEffect(() => {
    if (!isLoading) return; // Skip if already loaded

    const loadingSteps = [
      { progress: 10, message: 'Initializing STELLAR NEXUS...' },
      { progress: 25, message: 'Connecting to Stellar Network...' },
      { progress: 40, message: 'Loading Demo Suite...' },
      { progress: 60, message: 'Fetching Demo Statistics...' },
      { progress: 80, message: 'Preparing Smart Contracts...' },
      { progress: 95, message: 'Finalizing Experience...' },
      { progress: 100, message: 'Ready to Launch!' },
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < loadingSteps.length) {
        setLoadingStep(currentStep);
        setLoadingProgress(loadingSteps[currentStep].progress);
        currentStep++;
      } else {
        // Wait for Firebase initialization and demo stats to complete
        if (isInitialized && demoStats.length >= 0) {
          clearInterval(interval);
          setTimeout(() => {
            setIsLoading(false);
            // Mark that the page has been loaded
            if (typeof window !== 'undefined') {
              localStorage.setItem('homePageLoaded', 'true');
            }
          }, 500);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isLoading, isInitialized, demoStats]);

  // Fallback timeout to ensure preloader doesn't get stuck
  useEffect(() => {
    if (isLoading) {
      const timeout = setTimeout(() => {
        console.log('Preloader timeout - forcing completion');
        setIsLoading(false);
      }, 15000); // 15 second timeout

      return () => clearTimeout(timeout);
    }
  }, [isLoading]);

  // Listen for wallet sidebar state changes
  useEffect(() => {
    const handleWalletSidebarToggle = (event: CustomEvent) => {
      setWalletSidebarOpen(event.detail.isOpen);
      // Always ensure the sidebar is expanded when it opens
      if (event.detail.isOpen) {
        setWalletExpanded(true);
      } else {
        setWalletExpanded(event.detail.isExpanded);
      }
    };

    const handleOpenUserProfile = () => {
      setShowUserProfile(true);
    };

    window.addEventListener('walletSidebarToggle', handleWalletSidebarToggle as EventListener);
    window.addEventListener('openUserProfile', handleOpenUserProfile);
    return () => {
      window.removeEventListener('walletSidebarToggle', handleWalletSidebarToggle as EventListener);
      window.removeEventListener('openUserProfile', handleOpenUserProfile);
    };
  }, []);

  // Refresh account data when account changes (after demo completion)
  useEffect(() => {
    if (account) {
      // Firebase data is automatically refreshed by FirebaseContext
    }
  }, [account]);

  // Authentication handlers
  const handleSignUpClick = () => {
    setAuthModalMode('signup');
    setShowAuthModal(true);
  };

  const handleSignInClick = () => {
    setAuthModalMode('signin');
    setShowAuthModal(true);
  };

  // Removed unused handleUserProfileClick function

  // Handle demo completion and show feedback modal
  const handleDemoComplete = async (
    demoId: string,
    demoName: string,
    completionTime: number = 5
  ) => {
    // Demo completion is handled by the demo components themselves
    // No need to manually mark demo as complete here

    setFeedbackDemoData({
      demoId,
      demoName,
      completionTime,
    });
    setShowFeedbackModal(true);
  };

  // Handle feedback submission
  const handleFeedbackSubmit = async (feedback: {
    score?: number;
    rating?: number;
    comment?: string;
  }) => {
    try {
      if (feedbackDemoData) {
        // Complete the demo with the feedback score and completion time
        await completeDemo(
          feedbackDemoData.demoId,
          feedback.score || 85, // Default score if not provided
          feedbackDemoData.completionTime
        );

        addToastHook({
          title: '🎉 Demo Completed!',
          message: `Great job completing ${feedbackDemoData.demoName}!`,
          type: 'success',
          duration: 5000,
        });
      }
    } catch (error) {
      // Failed to complete demo - error is shown in toast
      addToastHook({
        title: 'Error',
        message: 'Failed to complete demo. Please try again.',
        type: 'error',
      });
    } finally {
      setShowFeedbackModal(false);
      setFeedbackDemoData(null);
    }
  };

  // Close feedback modal
  const handleFeedbackClose = () => {
    setShowFeedbackModal(false);
    setFeedbackDemoData(null);
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-neutral-900 via-brand-900 to-neutral-900 relative overflow-hidden'>
      {/* Header */}
      <Header />

      {/* Authentication Banner */}
      <AuthBanner onSignUpClick={handleSignUpClick} onSignInClick={handleSignInClick} />

      {/* Animated background elements */}
      <div className='absolute inset-0 opacity-20 bg-gradient-to-r from-brand-500/10 via-transparent to-accent-500/10'></div>

      {/* Main Content */}
      <main
        className={`relative z-10 pt-20 ${
          walletSidebarOpen && walletExpanded ? 'mr-96' : walletSidebarOpen ? 'mr-20' : 'mr-0'
        } ${!walletSidebarOpen ? 'pb-32' : 'pb-8'}`}
      >
        {/* Video Preloader Screen */}
        <VideoPreloaderScreen 
          isLoading={isLoading}
          title="STELLAR NEXUS"
          subtitle="Welcome to the future of Web3"
          showText={true}
          minDuration={5000}
        />


        {/* Main Content - Only show when not loading */}
        {!isLoading && (
          <>
            {/* Full-Screen Video Overlay */}
            <video
              autoPlay
              muted
              playsInline
              onEnded={() => {
                // Hide video after it ends
                const videoElement = document.querySelector('.fullscreen-video') as HTMLVideoElement;
                if (videoElement) {
                  videoElement.style.opacity = '0';
                  setTimeout(() => {
                    videoElement.style.display = 'none';
                  }, 1000);
                }
              }}
              className="fullscreen-video fixed inset-0 w-full h-full object-cover z-[99999] transition-opacity duration-1000"
            >
              <source src={'/videos/preloader.mp4'} type='video/mp4' />
              Your browser does not support the video tag.
            </video>
              
            {/* Hero Section */}
            <section className='container mx-auto px-4 py-16'>
              <div className='text-center'>
                {/* Page Header */}
                <div className='text-center mb-16'>
                  <div className='flex justify-center mb-6'>
                    <Image
                      src='/images/logo/logoicon.png'
                      alt='STELLAR NEXUS'
                      width={300}
                      height={300}
                      priority
                      style={{ zIndex: -1, position: 'relative', width: 'auto', height: 'auto' }}
                    />
                  </div>

                  {/* Epic Legendary Background for Title */}
                  <div className='relative mb-8'>
                    {/* Legendary Energy Background */}
                    <div className='absolute inset-0 flex justify-center items-center pointer-events-none'>
                      {/* Primary Energy Core */}
                      <div className='relative w-[500px] h-40'>
                        {/* Inner Energy Ring */}
                        <div className='absolute inset-0 rounded-full bg-gradient-to-r from-brand-500/40 via-accent-500/50 to-brand-400/40 blur-lg scale-150'></div>

                        {/* Middle Energy Ring */}
                        <div className='absolute inset-0 rounded-full bg-gradient-to-r from-accent-500/30 via-brand-500/40 to-accent-400/30 blur-xl scale-200'></div>

                        {/* Outer Energy Ring */}
                        <div className='absolute inset-0 rounded-full bg-gradient-to-r from-brand-400/20 via-accent-500/30 to-brand-300/20 blur-2xl scale-250'></div>
                      </div>

                      {/* Floating Energy Particles */}
                      <div className='absolute inset-0'>
                        <div className='absolute top-6 left-1/4 w-3 h-3 bg-brand-400 rounded-full animate-ping opacity-80'></div>
                        <div
                          className='absolute top-12 right-1/3 w-2 h-2 bg-accent-400 rounded-full animate-ping opacity-90'
                          style={{ animationDelay: '0.5s' }}
                        ></div>
                        <div
                          className='absolute bottom-8 left-1/3 w-2.5 h-2.5 bg-brand-300 rounded-full animate-ping opacity-70'
                          style={{ animationDelay: '1s' }}
                        ></div>
                        <div
                          className='absolute bottom-12 right-1/4 w-2 h-2 bg-accent-300 rounded-full animate-ping opacity-85'
                          style={{ animationDelay: '1.5s' }}
                        ></div>
                        <div
                          className='absolute top-1/2 left-1/6 w-1.5 h-1.5 bg-brand-200 rounded-full animate-ping opacity-60'
                          style={{ animationDelay: '2s' }}
                        ></div>
                        <div
                          className='absolute top-1/2 right-1/6 w-2 h-2 bg-accent-200 rounded-full animate-ping opacity-75'
                          style={{ animationDelay: '2.5s' }}
                        ></div>
                      </div>

                      {/* Energy Wave Rings */}
                      <div className='absolute inset-0'>
                        <div
                          className='absolute inset-0 rounded-full border-2 border-brand-400/40 animate-ping scale-150'
                          style={{ animationDuration: '4s' }}
                        ></div>
                        <div
                          className='absolute inset-0 rounded-full border border-accent-400/30 animate-ping scale-200'
                          style={{ animationDuration: '5s' }}
                        ></div>
                        <div
                          className='absolute inset-0 rounded-full border border-brand-300/25 animate-ping scale-250'
                          style={{ animationDuration: '6s' }}
                        ></div>
                      </div>
                    </div>

                    {/* Title with Enhanced Styling */}
                    <h1
                      className='relative z-10 text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-accent-400 to-brand-400 mb-6 drop-shadow-2xl'
                      style={{ zIndex: 1000, marginTop: '-243.5px' }}
                    >
                      STELLAR NEXUS EXPERIENCE
                    </h1>
                  </div>

                  <br />
                  <br />

                  <p className='text-xl text-white/80 max-w-3xl mx-auto mb-6'>
                    Master the art of trustless work with our demo suite on Stellar blockchain
                  </p>

                  {/* Tutorial Buttons */}
                  <div className='flex justify-center gap-6 mb-8'>
                    <Tooltip content='Scroll down to the tutorial section'>
                      <button
                        onClick={() => {
                          const tutorialSection = document.getElementById('interactive-tutorial');
                          if (tutorialSection) {
                            tutorialSection.scrollIntoView({
                              behavior: 'smooth',
                              block: 'start',
                            });
                          }
                        }}
                        className='px-8 py-4 bg-gradient-to-r from-brand-500 to-accent-500 hover:from-brand-600 hover:to-accent-600 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border-2 border-white/20 hover:border-white/40 flex items-center space-x-3'
                      >
                        <span className='text-xl'>👨‍🏫&nbsp;</span>
                        <span>Tutorial</span>
                        <span className='text-xl'>&nbsp;→</span>
                      </button>
                    </Tooltip>

                    <Tooltip content='Join the Challenge!'>
                      <button
                        onClick={() => setLeaderboardSidebarOpen(true)}
                        className='px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border-2 border-white/20 hover:border-white/40 flex items-center space-x-3'
                      >
                        <span className='text-xl'>🏆&nbsp;</span>
                        <span>Leaderboard</span>
                        <span className='text-xl'>&nbsp;→</span>
                      </button>
                    </Tooltip>

                    <Tooltip content='Explore the Trustless Work Tech Tree'>
                      <button
                        onClick={() => setShowTechTree(true)}
                        disabled={false}
                        className='px-8 py-4 font-bold rounded-xl transition-all duration-300 flex items-center space-x-3 bg-gradient-to-r from-brand-500/20 to-accent-500/20 hover:from-brand-800/50 hover:to-accent-800/50 text-white transform hover:scale-105 shadow-lg hover:shadow-xl border-2 border-white/20 hover:border-white/40'
                      >
                        <span>Trustless Work Tech Tree</span>
                        <span className='text-xl'>
                          <Image
                            src='/images/icons/demos.png'
                            alt='Trustless Work Tech Tree'
                            width={50}
                            height={20}
                            style={{ width: 'auto', height: 'auto' }}
                          />
                        </span>
                        {!isConnected && (
                          <span className='absolute -top-1 -right-1 text-xs bg-blue-500 text-white px-2 py-1 rounded-full font-medium shadow-lg'>
                            👁️ View
                          </span>
                        )}
                      </button>
                    </Tooltip>

                    <Tooltip
                      position='bottom'
                      content={
                        miniGamesUnlocked
                          ? 'Explore the Nexus Web3 Playground'
                          : 'Complete all demos and earn all badges to unlock the Nexus Web3 Playground'
                      }
                    >
                      <a
                        href={miniGamesUnlocked ? '/mini-games' : '#'}
                        onClick={e => {
                          if (!miniGamesUnlocked) {
                            e.preventDefault();
                          }
                        }}
                        className={`px-8 py-4 font-bold rounded-xl transition-all duration-300 flex items-center space-x-3 transform shadow-lg border-2 ${
                          miniGamesUnlocked
                            ? 'bg-gradient-to-r from-brand-500 to-accent-500 hover:from-brand-600 hover:to-accent-600 text-white hover:scale-105 hover:shadow-xl border-white/20 hover:border-white/40 cursor-pointer'
                            : 'bg-gray-600 text-gray-400 border-gray-600 cursor-not-allowed'
                        }`}
                        title={
                          miniGamesUnlocked
                            ? 'Explore the Nexus Web3 Playground'
                            : 'Complete all demos and earn all badges to unlock the Nexus Web3 Playground'
                        }
                      >
                        <span>
                          {miniGamesUnlocked ? 'Nexus Web3 Playground' : '🔒 Nexus Web3 Playground'}
                        </span>
                        <span className='text-xl'>
                          <Image
                            src={'/images/icons/console.png'}
                            alt='Nexus Web3 Playground'
                            width={50}
                            height={20}
                            className={miniGamesUnlocked ? '' : 'grayscale'}
                            style={{ width: 'auto', height: 'auto' }}
                          />
                        </span>
                      </a>
                    </Tooltip>
                  </div>
                </div>

                {/* Powered by Trustless Work */}
                <div className='text-center mt-4'>
                  <p className='text-brand-300/70 text-sm font-medium animate-pulse'>
                    Powered by <span className='text-brand-200 font-semibold'>Trustless Work</span>
                  </p>
                </div>
              </div>
            </section>

            <section className=' mx-auto px-4'>
              <div className=' mx-auto'>
                {isConnected && firebaseLoading && !isInitialized && (
                  <div className='text-center py-16'>
                    {/* Loading Spinner */}
                    <div className='inline-block'>
                      <div className='animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400 mb-4'></div>
                    </div>

                    {/* Loading Title */}
                    <h3 className='text-lg font-semibold text-white mb-2'>
                      Loading Your Account...
                    </h3>

                    {/* Loading Description */}
                    <p className='text-white/70 text-sm mb-6'>
                      Preparing demo cards and loading your progress data
                    </p>

                    {/* Animated Loading Dots */}
                    <div className='flex justify-center items-center space-x-2'>
                      <div className='animate-pulse bg-blue-400/30 rounded-full h-3 w-3'></div>
                      <div
                        className='animate-pulse bg-blue-400/50 rounded-full h-3 w-3'
                        style={{ animationDelay: '0.3s' }}
                      ></div>
                      <div
                        className='animate-pulse bg-blue-400/30 rounded-full h-3 w-3'
                        style={{ animationDelay: '0.6s' }}
                      ></div>
                    </div>

                    {/* Progress Steps */}
                    <div className='mt-6 space-y-2'>
                      <div className='text-xs text-white/60'>• Loading account information</div>
                      <div className='text-xs text-white/60'>• Fetching demo statistics</div>
                      <div className='text-xs text-white/60'>• Preparing demo interfaces</div>
                    </div>
                  </div>
                )}

                {(!isConnected || !firebaseLoading || isInitialized) && (
                  <DemoSelector
                    activeDemo={activeDemo}
                    setActiveDemo={setActiveDemo}
                    setShowImmersiveDemo={setShowImmersiveDemo}
                    isConnected={isConnected}
                    addToast={(toast) => addToastHook({ ...toast, duration: 5000 })}
                    account={account}
                    demos={demos}
                    demoStats={demoStats}
                    completeDemo={completeDemo}
                    hasBadge={hasBadge}
                    hasClappedDemo={hasClappedDemo}
                    clapDemo={clapDemo}
                    refreshAccountData={refreshAccountData}
                  />
                )}
              </div>
            </section>

            {/* Quest and Referral System Section */}
            <section className="container mx-auto px-4 py-16">
              <QuestAndReferralSection
                account={account}
                onQuestComplete={(questId, rewards) => {
                  addToastHook({
                    type: 'success',
                    title: '🎯 Quest Completed!',
                    message: `Earned ${rewards.experience} XP and ${rewards.points} points!`,
                    duration: 5000,
                  });
                }}
                onReferralComplete={(referralData) => {
                  addToastHook({
                    type: 'success',
                    title: '👥 Referral Sent!',
                    message: `Invitation sent to ${referralData.email}`,
                    duration: 5000,
                  });
                }}
                refreshAccountData={refreshAccountData}
              />
            </section>

            {/* Interactive Tutorial Section - Full Width with Irregular Shape */}
            <section
              id='interactive-tutorial'
              className='relative w-full py-16 overflow-hidden -mb-20 mt-20'
            >
              {/* Irregular Background Shape - Full Width */}
              <div className='absolute inset-0'>
                {/* Main irregular shape using clip-path */}
                <div
                  className='absolute inset-0 bg-gradient-to-br from-brand-500/20 via-accent-500/25 to-brand-400/20'
                  style={{
                    clipPath: 'polygon(0% 0%, 100% 8%, 92% 100%, 0% 92%)',
                  }}
                ></div>

                {/* Secondary irregular shape overlay */}
                <div
                  className='absolute inset-0 bg-gradient-to-tr from-accent-500/15 via-transparent to-brand-500/15'
                  style={{
                    clipPath: 'polygon(8% 0%, 100% 0%, 88% 100%, 0% 100%)',
                  }}
                ></div>

                {/* Floating geometric elements */}
                <div className='absolute top-16 left-16 w-40 h-40 bg-gradient-to-r from-brand-400/25 to-accent-400/25 rounded-full blur-2xl animate-pulse'></div>
                <div
                  className='absolute top-24 right-24 w-32 h-32 bg-gradient-to-r from-accent-400/25 to-brand-400/25 rounded-full blur-2xl animate-pulse'
                  style={{ animationDelay: '1s' }}
                ></div>
                <div
                  className='absolute bottom-24 left-24 w-36 h-36 bg-gradient-to-r from-brand-500/25 to-accent-500/25 rounded-full blur-2xl animate-pulse'
                  style={{ animationDelay: '2s' }}
                ></div>
                <div
                  className='absolute bottom-16 right-16 w-28 h-28 bg-gradient-to-r from-accent-500/25 to-brand-500/25 rounded-full blur-2xl animate-pulse'
                  style={{ animationDelay: '3s' }}
                ></div>

                {/* Diagonal lines for texture */}
                <div className='absolute inset-0 opacity-15'>
                  <div className='absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white to-transparent transform rotate-12'></div>
                  <div className='absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-white to-transparent transform -rotate-6'></div>
                  <div className='absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white to-transparent transform rotate-8'></div>
                  <div className='absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-white to-transparent transform -rotate-4'></div>
                  <div className='absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white to-transparent transform rotate-15'></div>
                </div>

                {/* Corner accents */}
                <div className='absolute top-0 left-0 w-40 h-40 border-l-4 border-t-4 border-brand-400/40 rounded-tl-3xl'></div>
                <div className='absolute top-0 right-0 w-40 h-40 border-r-4 border-t-4 border-accent-400/40 rounded-tr-3xl'></div>
                <div className='absolute bottom-0 left-0 w-40 h-40 border-l-4 border-b-4 border-accent-400/40 rounded-bl-3xl'></div>
                <div className='absolute bottom-0 right-0 w-40 h-40 border-r-4 border-b-4 border-brand-400/40 rounded-br-3xl'></div>
              </div>

              {/* Content */}
              <div className='relative z-10 max-w-6xl mx-auto px-4 text-center'>
                {/* Additional Floating Decorative Elements - Repositioned for better balance */}
                <div className='absolute top-20 left-1/4 w-6 h-6 bg-gradient-to-r from-brand-400/40 to-accent-400/40 rounded-full blur-sm animate-pulse opacity-60'></div>
                <div
                  className='absolute top-32 right-1/3 w-4 h-4 bg-gradient-to-r from-accent-400/40 to-brand-400/40 rounded-full blur-sm animate-pulse opacity-70'
                  style={{ animationDelay: '1.5s' }}
                ></div>
                <div
                  className='absolute bottom-32 left-1/3 w-5 h-5 bg-gradient-to-r from-brand-500/40 to-accent-500/40 rounded-full blur-sm animate-pulse opacity-50'
                  style={{ animationDelay: '2s' }}
                ></div>
                <div
                  className='absolute bottom-24 right-1/4 w-4 h-4 bg-gradient-to-r from-accent-500/40 to-brand-500/40 rounded-full blur-sm animate-pulse opacity-65'
                  style={{ animationDelay: '2.5s' }}
                ></div>

                {/* Floating Character Images - Left and Right - Repositioned for bottom alignment */}

                <div className='absolute bottom-8 -right-8 opacity-80 pointer-events-none'>
                  <div className='relative w-full h-full'>
                    <Image
                      src='/images/character/character.png'
                      alt='Guide Character Right'
                      width={200}
                      height={200}
                      className='w-full h-full object-contain drop-shadow-2xl animate-float mr-40 -mb-40'
                    />
                    {/* Floating sparkles around right character */}
                    <div className='absolute top-4 left-4 w-3 h-3 bg-brand-400 rounded-full animate-ping opacity-70'></div>
                    <div
                      className='absolute top-8 right-6 w-2 h-2 bg-accent-400 rounded-full animate-ping opacity-80'
                      style={{ animationDelay: '0.5s' }}
                    ></div>
                    <div
                      className='absolute bottom-6 left-8 w-2.5 h-2.5 bg-brand-300 rounded-full animate-ping opacity-60'
                      style={{ animationDelay: '1s' }}
                    ></div>
                    <div
                      className='absolute bottom-8 right-4 w-2 h-2 bg-accent-300 rounded-full animate-ping opacity-85'
                      style={{ animationDelay: '1.5s' }}
                    ></div>
                  </div>
                </div>

                <div className='mb-12'>
                  <h3 className='text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-accent-400 mb-6 drop-shadow-2xl'>
                    🎓 Tutorial
                  </h3>
                  <p className='text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed'>
                    New to trustless work? <br /> Start with our tutorial to learn how everything
                    works!
                  </p>
                </div>

                <div className='mb-8'>
                  <button
                    onClick={() => setShowOnboarding(true)}
                    className='px-8 py-4 bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border-2 border-white/20 hover:border-white/40'
                  >
                    <div className='flex items-center space-x-2'>
                      <Image
                        src='/images/logo/logoicon.png'
                        alt='Tutorial'
                        width={20}
                        height={20}
                        className='w-5 h-5'
                        style={{ width: 'auto', height: 'auto' }}
                      />
                      <span>Start Tutorial</span>
                    </div>
                  </button>
                  {!hasSeenOnboarding && (
                    <div className='mt-4 text-center'>
                      <p className='text-brand-300 text-sm animate-pulse'>
                        💡 New here? Start with the tutorial to learn how everything works!
                      </p>
                    </div>
                  )}
                </div>

                <div className='grid md:grid-cols-3 gap-8 text-sm'>
                  <div className='group p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl relative overflow-hidden'>
                    {/* Card background effect */}
                    <div className='absolute inset-0 bg-gradient-to-br from-brand-500/5 to-accent-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>

                    <div className='relative z-10'>
                      <div className='text-4xl mb-4 group-hover:scale-110 transition-transform duration-300'>
                        ⚡
                      </div>
                      <div className='font-semibold text-white/90 mb-2 text-base'>Quick Start</div>
                      <div className='text-white/70'>Learn the basics in just a few minutes</div>
                    </div>
                  </div>

                  <div className='group p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl relative overflow-hidden'>
                    {/* Card background effect */}
                    <div className='absolute inset-0 bg-gradient-to-br from-accent-500/5 to-brand-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>

                    <div className='relative z-10'>
                      <div className='text-4xl mb-4 group-hover:scale-105 transition-transform duration-300'>
                        🎯
                      </div>
                      <div className='font-semibold text-white/90 mb-2 text-base'>Hands-on</div>
                      <div className='text-white/70'>Interactive examples and real scenarios</div>
                    </div>
                  </div>

                  <div className='group p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl relative overflow-hidden'>
                    {/* Card background effect */}
                    <div className='absolute inset-0 bg-gradient-to-br from-brand-500/5 to-accent-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>

                    <div className='relative z-10'>
                      <div className='text-4xl mb-4 group-hover:scale-110 transition-transform duration-300'>
                        💡
                      </div>
                      <div className='font-semibold text-white/90 mb-2 text-base'>Smart Tips</div>
                      <div className='text-white/70'>Pro tips and best practices included</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Wallet Sidebar */}
      <WalletSidebar
        isOpen={walletSidebarOpen}
        onToggle={() => {
          const newOpenState = !walletSidebarOpen;
          setWalletSidebarOpen(newOpenState);
          // Always ensure it's expanded when opening
          if (newOpenState) {
            setWalletExpanded(true);
          }
        }}
        showBanner={true}
      />

      {/* NEXUS PRIME Character */}
      <NexusPrime currentPage='home' currentDemo={activeDemo} walletConnected={isConnected} />

      {/* Onboarding Overlay */}
      <OnboardingOverlay
        isActive={showOnboarding}
        onComplete={() => {
          setShowOnboarding(false);
          setHasSeenOnboarding(true);
        }}
      />

      {/* Immersive Demo Modal */}
      {showImmersiveDemo && (
        <ImmersiveDemoModal
          isOpen={showImmersiveDemo}
          onClose={() => setShowImmersiveDemo(false)}
          demoId={activeDemo}
          demoTitle={demos.find(d => d.id === activeDemo)?.title || 'Demo'}
          demoDescription={demos.find(d => d.id === activeDemo)?.subtitle || 'Demo Description'}
          estimatedTime={
            activeDemo === 'hello-milestone' ? 1 : activeDemo === 'dispute-resolution' ? 3 : 2
          }
          demoColor={demos.find(d => d.id === activeDemo)?.color || 'from-brand-500 to-brand-400'}
          onDemoComplete={handleDemoComplete}
        >
          {activeDemo === 'hello-milestone' && (
            <HelloMilestoneDemo onDemoComplete={handleDemoComplete} />
          )}
          {activeDemo === 'dispute-resolution' && <DisputeResolutionDemo />}
          {activeDemo === 'milestone-voting' && <MilestoneVotingDemo />}
          {activeDemo === 'micro-marketplace' && (
            <MicroTaskMarketplaceDemo onDemoComplete={handleDemoComplete} />
          )}
        </ImmersiveDemoModal>
      )}

      {/* Tech Tree Modal */}
      <TechTreeModal isOpen={showTechTree} onClose={() => setShowTechTree(false)} />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authModalMode}
      />

      {/* User Profile Modal */}
      <UserProfile isOpen={showUserProfile} onClose={() => setShowUserProfile(false)} />

      {/* Account Status Indicator */}
      <AccountStatusIndicator />

      {/* Demo Feedback Modal */}
      {showFeedbackModal && feedbackDemoData && (
        <SimpleFeedbackModal
          isOpen={showFeedbackModal}
          onClose={handleFeedbackClose}
          onSubmit={handleFeedbackSubmit}
          demoId={feedbackDemoData.demoId}
          demoName={feedbackDemoData.demoName}
          completionTime={feedbackDemoData.completionTime}
        />
      )}

      {/* Leaderboard Sidebar */}
      <LeaderboardSidebar
        isOpen={leaderboardSidebarOpen}
        onClose={() => setLeaderboardSidebarOpen(false)}
      />

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
}
