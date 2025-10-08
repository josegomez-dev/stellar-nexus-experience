'use client';

import { useEffect, useState, useMemo } from 'react';
import { WalletSidebar } from '@/components/ui/wallet/WalletSidebar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { NexusPrime } from '@/components/layout/NexusPrime';
import { useGlobalWallet } from '@/contexts/wallet/WalletContext';
import { HelloMilestoneDemo } from '@/components/demos/HelloMilestoneDemo';
import { MilestoneVotingDemo } from '@/components/demos/MilestoneVotingDemo';
import { DisputeResolutionDemo } from '@/components/demos/DisputeResolutionDemo';
import { MicroTaskMarketplaceDemo } from '@/components/demos/MicroTaskMarketplaceDemo';
import { SimpleFeedbackModal } from '@/components/ui/modals/SimpleFeedbackModal';
import { useToast } from '@/contexts/ui/ToastContext';
import { useFirebase } from '@/contexts/data/FirebaseContext';
import { OnboardingOverlay } from '@/components/OnboardingOverlay';
import { ImmersiveDemoModal } from '@/components/ui/modals/ImmersiveDemoModal';
import { InteractiveTutorialModal } from '@/components/ui/modals/InteractiveTutorialModal';
import { TechTreeModal } from '@/components/ui/modals/TechTreeModal';
import { ToastContainer } from '@/components/ui/Toast';
import { AuthBanner } from '@/components/ui/auth/AuthBanner';
import { AuthModal } from '@/components/ui/auth/AuthModal';
import { UserProfile } from '@/components/ui/navigation/UserProfile';
import { AccountStatusIndicator } from '@/components/ui/AccountStatusIndicator';
import { LeaderboardSidebar } from '@/components/ui/LeaderboardSidebar';
import { VideoPreloaderScreen } from '@/components/ui/VideoPreloaderScreen';
import { StartButtonScreen } from '@/components/home/StartButtonScreen';
import { QuestAndReferralSection } from '@/components/ui/quest/QuestAndReferralSection';
import { TOP_BADGES } from '@/utils/constants/demos';
import { 
  DemoSelector, 
  HeroSection, 
  InteractiveTutorialSection,
  LeaderboardSection
} from '@/components/home';
import { DEMO_CARDS } from '@/utils/constants/demos';
import { AUDIO_VOLUMES } from '@/utils/constants/ui';

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

  // Check if user has unlocked mini-games access (earned all 5 top badges)
  const miniGamesUnlocked = useMemo(() => {
    if (!account || !account.badgesEarned) return false;

    // Handle both array and object formats for badgesEarned (Firebase sometimes stores arrays as objects)
    let badgesEarnedArray: string[] = [];
    if (Array.isArray(account.badgesEarned)) {
      badgesEarnedArray = account.badgesEarned;
    } else if (typeof account.badgesEarned === 'object') {
      badgesEarnedArray = Object.values(account.badgesEarned);
    }

    // Check if user has earned all 5 top badges
    const hasAllTopBadges = TOP_BADGES.every(badgeId => badgesEarnedArray.includes(badgeId));

    return hasAllTopBadges;
  }, [account]);

  const [walletSidebarOpen, setWalletSidebarOpen] = useState(false);
  const [walletExpanded, setWalletExpanded] = useState(false);
  const [leaderboardSidebarOpen, setLeaderboardSidebarOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showInteractiveTutorial, setShowInteractiveTutorial] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  // Feedback modal state
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackDemoData, setFeedbackDemoData] = useState<{
    demoId: string;
    demoName: string;
    completionTime: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showImmersiveDemo, setShowImmersiveDemo] = useState(false);
  const [showTechTree, setShowTechTree] = useState(false);
  
  // Preloader flow state
  const [showStartButton, setShowStartButton] = useState(true);
  const [preloaderComplete, setPreloaderComplete] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [hasStartedExperience, setHasStartedExperience] = useState(false);

  // Authentication modals
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signup' | 'signin'>('signup');
  const [showUserProfile, setShowUserProfile] = useState(false);

  // Initialize Firebase data on app load
  useEffect(() => {
    // Firebase initialization is handled by FirebaseContext
  }, []);

  // Loading effect - simulate loading (auto-start when start button is clicked)
  useEffect(() => {
    if (!isLoading || showStartButton) return; // Skip if already loaded or start button is showing

    const loadingSteps = [
      { progress: 20, message: 'Loading Experience Engine...' },
      { progress: 40, message: 'Initializing Web3 Demos...' },
      { progress: 60, message: 'Preparing Trustless Work System...' },
      { progress: 80, message: 'Setting up Stellar Network...' },
      { progress: 100, message: 'Experience Ready to Launch!' },
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < loadingSteps.length) {
        setLoadingProgress(loadingSteps[currentStep].progress);
        currentStep++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsLoading(false);
        }, 200);
      }
    }, 400);

    return () => clearInterval(interval);
  }, [isLoading, showStartButton]);

  // Fallback timeout to ensure preloader doesn't get stuck
  useEffect(() => {
    if (isLoading && !showStartButton) {
      setIsLoading(false);
    }
  }, [isLoading, showStartButton]);

  // Check if this is user's first visit to the page or if wallet is already connected
  useEffect(() => {
    const hasVisitedHome = localStorage.getItem('hasVisitedHome');
    const hasWalletStored = localStorage.getItem('stellar-wallet-data');
    
    // If user has visited before OR has a wallet connected, skip the start button and preloader
    if (hasVisitedHome || hasWalletStored) {
      // User has visited before or has wallet stored, skip the start button and preloader for better UX
      setShowStartButton(false);
      setPreloaderComplete(true);
      setIsLoading(false);
    }
  }, []);

  // Start button handler
  const handleStartExperience = () => {
    setHasStartedExperience(true);
    setShowStartButton(false);
    // Mark that user has visited the home page
    localStorage.setItem('hasVisitedHome', 'true');
    // Trigger loading immediately for snappier experience
    setIsLoading(true);
  };

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
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Stellar Nexus Experience",
            "alternateName": "Stellar Nexus Experience Web3 Early Adopters Program",
            "description": "Join the Stellar Nexus Experience Web3 Early Adopters Program. Master trustless work on Stellar blockchain with interactive demos, earn badges, and compete on the global leaderboard.",
            "url": "https://stellar-nexus-experience.vercel.app",
            "applicationCategory": "EducationalApplication",
            "operatingSystem": "Web Browser",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "creator": {
              "@type": "Organization",
              "name": "Stellar Nexus Team",
              "url": "https://stellar-nexus-experience.vercel.app"
            },
            "featureList": [
              "Interactive Blockchain Demos",
              "Trustless Work Education",
              "Badge System",
              "Global Leaderboard",
              "Stellar Network Integration",
              "Web3 Wallet Connection"
            ],
            "screenshot": "https://stellar-nexus-experience.vercel.app/images/logo/logoicon.png",
            "softwareVersion": "0.1.0",
            "datePublished": "2024-01-01",
            "dateModified": new Date().toISOString().split('T')[0],
            "inLanguage": "en-US",
            "isAccessibleForFree": true,
            "browserRequirements": "Requires JavaScript. Requires HTML5.",
            "softwareRequirements": "Web Browser",
            "permissions": "Web3 Wallet Access"
          })
        }}
      />
      {/* Start Button Screen - Shows first */}
      {showStartButton && (
        <StartButtonScreen onStart={handleStartExperience} />
      )}

      {/* Unified Video Preloader Screen - Shows after start button is clicked */}
      {!showStartButton && !preloaderComplete && (
        <VideoPreloaderScreen 
          isLoading={isLoading}
          videoPath="/videos/preloader.mp4"
          audioPath="/sounds/home_welcome.mp3"
          secondaryAudioPath="/sounds/nexus_voice.mp3"
          title="STELLAR NEXUS EXPERIENCE"
          subtitle="Web3 Early Adopters Program"
          showText={true}
          showVideoAfterLoad={true}
          minDuration={1500}
          audioVolumes={{
            primary: AUDIO_VOLUMES.intro,
            secondary: AUDIO_VOLUMES.nexusVoice,
          }}
          onComplete={() => setPreloaderComplete(true)}
        />
      )}

      {/* Header */}
      {preloaderComplete && (
        <div className='animate-fadeIn'>
          <Header />
        </div>
      )}

      {/* Authentication Banner */}
      {preloaderComplete && (
        <div className='animate-fadeIn'>
          <AuthBanner onSignUpClick={handleSignUpClick} onSignInClick={handleSignInClick} />
        </div>
      )}

      {/* Animated background elements */}
      <div className='absolute inset-0 opacity-20 bg-gradient-to-r from-brand-500/10 via-transparent to-accent-500/10'></div>

      {/* Main Content */}
      <main
        className={`relative z-10 pt-20 ${
          walletSidebarOpen && walletExpanded ? 'mr-96' : walletSidebarOpen ? 'mr-20' : 'mr-0'
        } ${!walletSidebarOpen ? 'pb-32' : 'pb-8'}`}
      >
        {/* Main Content - Show after preloader is complete */}
        {preloaderComplete && (
          <>
            {/* Hero Section */}
            <HeroSection
              isVideoPlaying={false}
              miniGamesUnlocked={miniGamesUnlocked}
              onTutorialClick={() => {
                const tutorialSection = document.getElementById('interactive-tutorial');
                if (tutorialSection) {
                  tutorialSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                  });
                }
              }}
              onTechTreeClick={() => setShowTechTree(true)}
              isConnected={isConnected}
            />

            {/* Demo Cards Section - with fade-in animation */}
            <div className='text-center'>
              <p className=' text-white/80 max-w-3xl mx-auto mb-6'>
              The <span className='text-brand-200 font-semibold'>Escrow Arsenal</span> turns early adoption into an adventure—earn XP, unlock badges, and co-create the future of Web3 alongside the first wave of <span className='text-brand-200 font-semibold'>Founders, Builders, and Developers</span>.
              </p>
              <br />
            </div>


            <section className='mx-auto px-4 animate-fadeIn'>
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

            {/* Quest System Section */}
            <section className='container mx-auto px-4 py-16 animate-fadeIn'>
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
                refreshAccountData={refreshAccountData}
              />
            </section>

            {/* Interactive Tutorial Section */}
            <InteractiveTutorialSection
              isVideoPlaying={false}
              onStartTutorial={() => setShowInteractiveTutorial(true)}
            />
          </>
        )}
      </main>
      
      {/* Leaderboard Section */}
      {preloaderComplete && (
        <LeaderboardSection onOpenLeaderboard={() => setLeaderboardSidebarOpen(true)} />
      )}

      {/* Footer */}
      {preloaderComplete && (
        <div className='animate-fadeIn'>
          <Footer />
        </div>
      )}

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
        showBanner={preloaderComplete}
        hideFloatingButton={!preloaderComplete}
      />

      {/* NEXUS PRIME Character - Show during loading only after user starts experience */}
      <NexusPrime 
        currentPage='home' 
        currentDemo={activeDemo} 
        walletConnected={isConnected}
        autoOpen={false}
        showDuringLoading={!preloaderComplete && hasStartedExperience}
      />

      {/* Onboarding Overlay */}
      <OnboardingOverlay
        isActive={showOnboarding}
        onComplete={() => {
          setShowOnboarding(false);
          setHasSeenOnboarding(true);
        }}
      />

      {/* Interactive Tutorial Modal */}
      <InteractiveTutorialModal
        isOpen={showInteractiveTutorial}
        onClose={() => {
          setShowInteractiveTutorial(false);
          setHasSeenOnboarding(true);
        }}
      />

      {/* Immersive Demo Modal */}
      {showImmersiveDemo && (
        <ImmersiveDemoModal
          isOpen={showImmersiveDemo}
          onClose={() => setShowImmersiveDemo(false)}
          demoId={activeDemo}
          demoTitle={DEMO_CARDS.find(d => d.id === activeDemo)?.title || 'Demo'}
          demoDescription={DEMO_CARDS.find(d => d.id === activeDemo)?.subtitle || 'Demo Description'}
          estimatedTime={
            activeDemo === 'hello-milestone' ? 1 : activeDemo === 'dispute-resolution' ? 3 : 2
          }
          demoColor={DEMO_CARDS.find(d => d.id === activeDemo)?.color || 'from-brand-500 to-brand-400'}
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
      {preloaderComplete && <AccountStatusIndicator />}

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
      {preloaderComplete && <ToastContainer />}
    </div>
  );
}
