'use client';

import { useEffect, useState, useMemo } from 'react';
import { Account, DemoStats, getBadgeById } from '@/lib/firebase/firebase-types';
import { BadgeEmblem } from '@/components/ui/badges/BadgeEmblem';
import { getBadgeIcon, BADGE_SIZES } from '@/utils/constants/badges/assets';
import {
  DemoCard,
  DEMO_CARDS,
  DEMO_BADGE_MAP,
  getDemoButtonColors,
  getDemoBadgeColors,
  getDemoColorValue,
  getDemoCardColors,
} from '@/utils/constants/demos';

interface DemoSelectorProps {
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
  demoStats: DemoStats[];
  completeDemo: (demoId: string, score?: number, completionTimeMinutes?: number) => Promise<void>;
  hasBadge: (badgeId: string) => Promise<boolean>;
  hasClappedDemo: (demoId: string) => Promise<boolean>;
  clapDemo: (demoId: string) => Promise<void>;
  refreshAccountData: () => Promise<void>;
}

export const DemoSelector = ({
  activeDemo,
  setActiveDemo,
  setShowImmersiveDemo,
  isConnected,
  addToast,
  account,
  demoStats,
  completeDemo,
  hasBadge,
  hasClappedDemo,
  clapDemo,
  refreshAccountData,
}: DemoSelectorProps) => {
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
    return (demoId: string) => {
      const badgeId = DEMO_BADGE_MAP[demoId];
      if (!badgeId) return null;

      return getBadgeById(badgeId);
    };
  }, []);

  const getClapStats = (demoId: string) => {
    const demo = DEMO_CARDS.find((d) => d.id === demoId);

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

  return (
    <div className='space-y-8'>
      {/* Demo Cards */}
      <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-2'>
        {DEMO_CARDS.map((demo: DemoCard) => {
          // Handle both array and object formats for demosCompleted (Firebase sometimes stores arrays as objects)
          let demosCompletedArray: string[] = [];
          if (Array.isArray(account?.demosCompleted)) {
            demosCompletedArray = account.demosCompleted;
          } else if (account?.demosCompleted && typeof account.demosCompleted === 'object') {
            demosCompletedArray = Object.values(account.demosCompleted);
          }

          const isCompleted = demosCompletedArray.includes(demo.id);

          // Check if user has earned the badge for this demo synchronously
          const badgeId = DEMO_BADGE_MAP[demo.id];

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
                        <div
                          className='absolute bottom-4 right-4 opacity-90'
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
                        <div className='text-4xl mt-4 mb-4 animate-pulse'>🧑‍🚀 </div>
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

