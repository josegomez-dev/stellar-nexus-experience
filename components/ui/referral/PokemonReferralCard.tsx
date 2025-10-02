'use client';

import React, { useState, useRef } from 'react';
import { Account } from '@/lib/firebase/firebase-types';
import { PixelArtAvatar } from '@/components/ui/avatar/PixelArtAvatar';
import { BadgeEmblem } from '@/components/ui/badges/BadgeEmblem';
import { useGlobalWallet } from '@/contexts/wallet/WalletContext';
import { useAuth } from '@/contexts/auth/AuthContext';
import Image from 'next/image';
import html2canvas from 'html2canvas';
import { leaderboardService } from '@/lib/services/leaderboard-service';
import GIF from 'gif.js';

interface PokemonReferralCardProps {
  account: Account | null;
  referralCode: string;
  level: number;
  onShare?: (platform: string) => void;
  className?: string;
}

export interface PokemonReferralCardRef {
  shareCardImage: (platform: 'twitter' | 'linkedin' | 'facebook') => Promise<void>;
  downloadCardImage: () => Promise<void>;
  downloadCardGif: () => Promise<void>;
}

type CardLevel = 'bronze' | 'silver' | 'gold' | 'regular';
type SocialPlatform = 'twitter' | 'linkedin' | 'facebook' | 'copy';
type PhaseLevel = 'baby' | 'teen' | 'adult';

// Get card level based on leaderboard ranking
const getCardLevelFromRank = (rank: number | null): CardLevel => {
  if (rank === 3) return 'bronze';
  if (rank === 2) return 'silver';
  if (rank === 1) return 'gold';
  return 'regular';
};

// Get display level (1, 2, or 3) based on experience
const getDisplayLevel = (experience: number): number => {
  if (experience < 1000) return 1;
  if (experience < 2000) return 2;
  return 3;
};

// Video phase mapping based on card level
const getPhaseFromCardLevel = (cardLevel: CardLevel): PhaseLevel => {
  switch (cardLevel) {
    case 'bronze': return 'baby';
    case 'silver': return 'teen';
    case 'gold': return 'adult';
    case 'regular': return 'baby';
    default: return 'baby';
  }
};

// Video file mapping - using numbered files for better organization
const phaseVideos = {
  baby: '/videos/phases/baby-full.mp4',     // Phase 1
  teen: '/videos/phases/teen-full.mp4',     // Phase 2  
  adult: '/videos/phases/adullt-full.mp4',  // Phase 3
};

export const PokemonReferralCard = React.forwardRef<PokemonReferralCardRef, PokemonReferralCardProps>(({
  account,
  referralCode,
  level,
  onShare,
  className = '',
}, ref) => {
  const { isConnected, walletData } = useGlobalWallet();
  const { user } = useAuth();
  const [shareSuccess, setShareSuccess] = useState<string | null>(null);
  const [customPhase, setCustomPhase] = useState<PhaseLevel | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [isLoadingRank, setIsLoadingRank] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Load user's leaderboard rank
  React.useEffect(() => {
    const loadUserRank = async () => {
      if (!account?.walletAddress) return;
      
      setIsLoadingRank(true);
      try {
        const rank = await leaderboardService.getUserRank(account.walletAddress);
        setUserRank(rank || null);
      } catch (error) {
        console.error('Error loading user rank:', error);
        setUserRank(null);
      } finally {
        setIsLoadingRank(false);
      }
    };

    loadUserRank();
  }, [account?.walletAddress]);

  // Expose functions to parent component via ref
  React.useImperativeHandle(ref, () => ({
    shareCardImage,
    downloadCardImage,
    downloadCardGif,
  }));

  // Ensure we have safe defaults for badgesEarned (same logic as RewardsSidebar)
  const safeBadgesEarned: string[] = (() => {
    if (Array.isArray(account?.badgesEarned)) {
      return account.badgesEarned;
    } else if (account?.badgesEarned && typeof account.badgesEarned === 'object') {
      // Convert object to array (Firebase sometimes stores arrays as objects)
      return Object.values(account.badgesEarned) as string[];
    }
    return [];
  })();

  // Determine card level based on leaderboard ranking
  const experience = account?.experience || 0;
  const cardLevel = getCardLevelFromRank(userRank);
  const displayLevel = getDisplayLevel(experience);
  
  // Get current phase (custom or auto-determined)
  const currentPhase = customPhase || getPhaseFromCardLevel(cardLevel);
  const currentVideo = phaseVideos[currentPhase];
  
  // Phase navigation functions
  const phases: PhaseLevel[] = ['baby', 'teen', 'adult'];
  const currentPhaseIndex = phases.indexOf(currentPhase);
  
  const handlePhaseChange = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'prev' 
      ? (currentPhaseIndex - 1 + phases.length) % phases.length
      : (currentPhaseIndex + 1) % phases.length;
    setCustomPhase(phases[newIndex]);
  };
  
  // Get user display name
  const displayName = account?.displayName || 
    (user ? user.customName || user.username : null) ||
    (account ? `${account.walletAddress.slice(0, 6)}...${account.walletAddress.slice(-4)}` : 'Guest User');

  // Get user avatar seed
  const getAvatarSeed = () => {
    if (user?.avatarSeed) return user.avatarSeed;
    if (account?.walletAddress) return account.walletAddress;
    if (walletData?.publicKey) return walletData.publicKey;
    return 'default';
  };

  // Get ranking display text
  const getRankingText = () => {
    if (isLoadingRank) return 'Loading...';
    if (!userRank) return 'TRUSTLESS WORKER';
    
    // Get medal emoji for top 3, otherwise show rank number
    const medalEmoji = leaderboardService.getMedalEmoji(userRank);
    return `${medalEmoji} RANK #${userRank}`;
  };

  // Card level configurations
  const levelConfigs: Record<CardLevel, {
    gradient: string;
    borderColor: string;
    glowColor: string;
    textColor: string;
    accentColor: string;
    bgPattern: string;
    rarity: string;
    rarityColor: string;
  }> = {
    bronze: {
      gradient: 'from-amber-600 via-orange-500 to-amber-400',
      borderColor: 'border-amber-400',
      glowColor: 'shadow-amber-500/50',
      textColor: 'text-amber-100',
      accentColor: 'text-amber-300',
      bgPattern: 'bg-gradient-to-br from-amber-900/30 via-orange-800/20 to-amber-900/30',
      rarity: 'BRONZE RANK',
      rarityColor: 'text-amber-300',
    },
    silver: {
      gradient: 'from-gray-400 via-gray-300 to-gray-200',
      borderColor: 'border-gray-300',
      glowColor: 'shadow-gray-400/60',
      textColor: 'text-brand-500',
      accentColor: 'text-gray-300',
      bgPattern: 'bg-gradient-to-br from-gray-800/30 via-slate-700/20 to-gray-800/30',
      rarity: 'SILVER RANK',
      rarityColor: 'text-gray-300',
    },
    gold: {
      gradient: 'from-yellow-400 via-yellow-300 to-yellow-200',
      borderColor: 'border-yellow-300',
      glowColor: 'shadow-yellow-400/70',
      textColor: 'text-yellow-100',
      accentColor: 'text-yellow-300',
      bgPattern: 'bg-gradient-to-br from-yellow-900/30 via-amber-800/20 to-yellow-900/30',
      rarity: 'GOLD RANK',
      rarityColor: 'text-yellow-300',
    },
    regular: {
      gradient: 'from-blue-500 via-purple-500 to-indigo-500',
      borderColor: 'border-blue-400',
      glowColor: 'shadow-blue-500/50',
      textColor: 'text-blue-100',
      accentColor: 'text-blue-300',
      bgPattern: 'bg-gradient-to-br from-blue-900/30 via-purple-800/20 to-indigo-900/30',
      rarity: 'TRUSTLESS WORKER',
      rarityColor: 'text-blue-300',
    },
  };

  const config = levelConfigs[cardLevel];

  // Social sharing functions
  const handleShare = async (platform: SocialPlatform) => {
    if (!referralCode) return;

    const shareText = `🎮 Check out my Trustless Work profile! I'm level ${level} with ${account?.experience || 0} XP. Join me and earn bonus XP with my referral code: ${referralCode}`;
    const shareUrl = `${window.location.origin}?ref=${referralCode}`;

    try {
      switch (platform) {
        case 'twitter':
          const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
          window.open(twitterUrl, '_blank');
          break;
        case 'linkedin':
          const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
          window.open(linkedinUrl, '_blank');
          break;
        case 'facebook':
          const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
          window.open(facebookUrl, '_blank');
          break;
        case 'copy':
          await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
          setShareSuccess('copied');
          setTimeout(() => setShareSuccess(null), 2000);
          break;
      }
      
      if (onShare) {
        onShare(platform);
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  // Generate card as image (for sharing)
  const generateCardImage = async () => {
    if (!cardRef.current) return;
    
    setIsGeneratingImage(true);
    try {
      // Find the card element (not the container with arrows)
      const cardElement = cardRef.current.querySelector('[data-card-content]') as HTMLElement;
      if (!cardElement) {
        console.error('Card content element not found');
        return null;
      }

      // Generate canvas from the card content
      const canvas = await html2canvas(cardElement, {
        background: '#0f172a', // Dark background
        useCORS: true,
        allowTaint: true,
        width: cardElement.offsetWidth,
        height: cardElement.offsetHeight,
        logging: false, // Disable console logs
      });

      // Convert canvas to blob
      return new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          }
        }, 'image/png', 0.9);
      });
    } catch (error) {
      console.error('Error generating card image:', error);
      return null;
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // Share card image to social media
  const shareCardImage = async (platform: 'twitter' | 'linkedin' | 'facebook') => {
    const imageBlob = await generateCardImage();
    if (!imageBlob) {
      setShareSuccess('error');
      setTimeout(() => setShareSuccess(null), 2000);
      return;
    }

    const shareText = `🚀 I'm building the future of work on Stellar! 

🎮 Level ${level} • ${account?.experience || 0} XP • ${userRank ? `#${userRank} Rank` : 'Trustless Worker'}
🏆 ${safeBadgesEarned.length}/13 Badges • ${account?.totalPoints || 0} Points

Join me on Trustless Work and discover:
✨ Trustless escrow mechanics
⚡ Interactive Stellar demos  
🎯 XP & badge system
👥 Community challenges

Use my referral code: ${referralCode}
#TrustlessWork #Stellar #Web3 #Blockchain #DeFi`;
    const shareUrl = `${window.location.origin}?ref=${referralCode}`;

    try {
      // Create a temporary URL for the image
      const imageUrl = URL.createObjectURL(imageBlob);
      
      // Try to use Web Share API if available (mobile)
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [new File([imageBlob], 'trustless-work-card.png', { type: 'image/png' })] })) {
        try {
          await navigator.share({
            title: 'My Trustless Work Profile',
            text: shareText,
            url: shareUrl,
            files: [new File([imageBlob], 'trustless-work-card.png', { type: 'image/png' })]
          });
          setShareSuccess('shared');
          setTimeout(() => setShareSuccess(null), 2000);
          return;
        } catch (error) {
          console.log('Web Share API failed, falling back to platform-specific sharing');
        }
      }

      // Fallback to platform-specific sharing
      switch (platform) {
        case 'twitter':
          const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
          window.open(twitterUrl, '_blank');
          break;
        case 'linkedin':
          const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
          window.open(linkedinUrl, '_blank');
          break;
        case 'facebook':
          const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
          window.open(facebookUrl, '_blank');
          break;
      }

      // Clean up the temporary URL
      URL.revokeObjectURL(imageUrl);
      
      setShareSuccess('shared');
      setTimeout(() => setShareSuccess(null), 2000);
    } catch (error) {
      console.error('Error sharing card:', error);
      setShareSuccess('error');
      setTimeout(() => setShareSuccess(null), 2000);
    }
  };

  // Download card image
  const downloadCardImage = async () => {
    const imageBlob = await generateCardImage();
    if (!imageBlob) {
      setShareSuccess('error');
      setTimeout(() => setShareSuccess(null), 2000);
      return;
    }

    try {
      const url = URL.createObjectURL(imageBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `trustless-work-profile-${displayName.replace(/[^a-zA-Z0-9]/g, '-')}-${referralCode}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setShareSuccess('downloaded');
      setTimeout(() => setShareSuccess(null), 2000);
    } catch (error) {
      console.error('Error downloading card:', error);
      setShareSuccess('error');
      setTimeout(() => setShareSuccess(null), 2000);
    }
  };

  // Download card as GIF (animated)
  const downloadCardGif = async () => {
    if (!cardRef.current) return;
    
    setIsGeneratingImage(true);
    try {
      // Find the card element
      const cardElement = cardRef.current.querySelector('[data-card-content]') as HTMLElement;
      if (!cardElement) {
        console.error('Card content element not found');
        return;
      }

      // Wait for all content to be fully loaded and stable
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second for everything to settle
      
      // Ensure referral code is visible and stable
      const referralCodeElement = cardElement.querySelector('[data-referral-code]');
      if (referralCodeElement) {
        // Wait for referral code to be fully rendered
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Create GIF instance
      const gif = new GIF({
        workers: 2,
        quality: 10,
        width: cardElement.offsetWidth,
        height: cardElement.offsetHeight,
        workerScript: '/gif.worker.js'
      });

      // Capture multiple frames for animation
      const frameCount = 6; // Reduced frames for stability
      const frameDelay = 300; // Increased delay for stability

      for (let i = 0; i < frameCount; i++) {
        // Wait between frames to ensure stability
        await new Promise(resolve => setTimeout(resolve, frameDelay));
        
        const canvas = await html2canvas(cardElement, {
          background: '#0f172a',
          useCORS: true,
          allowTaint: true,
          width: cardElement.offsetWidth,
          height: cardElement.offsetHeight,
          logging: false,
        });

        // Add frame to GIF
        gif.addFrame(canvas, { delay: frameDelay });
      }

      // Render the GIF
      gif.on('finished', (blob: Blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `trustless-work-profile-${displayName.replace(/[^a-zA-Z0-9]/g, '-')}-${referralCode}.gif`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        setShareSuccess('downloaded');
        setTimeout(() => setShareSuccess(null), 2000);
        setIsGeneratingImage(false);
      });

      // Handle any errors during GIF generation
      gif.on('abort', () => {
        console.error('GIF generation aborted');
        setShareSuccess('error');
        setTimeout(() => setShareSuccess(null), 2000);
        setIsGeneratingImage(false);
      });

      // Start rendering
      gif.render();
    } catch (error) {
      console.error('Error downloading card GIF:', error);
      setShareSuccess('error');
      setTimeout(() => setShareSuccess(null), 2000);
      setIsGeneratingImage(false);
    }
  };

  return (
    <div className={`w-full max-w-sm mx-auto ${className}`}>
      {/* Pokemon-Style Card with Side Arrows */}
     <p className="text-white/70 mb-6 text-center">
        You are a &nbsp;
        <strong className="text-brand-500">Level {displayLevel} 
            <span className="text-white/70"> with </span>
            {experience} XP 
        </strong>
        &nbsp;and you have earned&nbsp; 
        <strong className="text-brand-500">
            {account?.totalPoints || 0} Points.
        </strong>
      </p>
      <div className="relative flex items-center gap-4">
        {/* Left Arrow */}
        <button
          onClick={() => handlePhaseChange('prev')}
          className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 border border-white/30 flex items-center justify-center text-white transition-all duration-200 hover:scale-110 flex-shrink-0"
          title="Previous phase"
        >
          ←
        </button>

        {/* Pokemon Card */}
    <div
      ref={cardRef}
      className={`relative flex-1 aspect-[3/4] rounded-2xl border-4 ${config.borderColor} shadow-2xl ${config.glowColor} transition-all duration-500 hover:scale-105 hover:shadow-3xl overflow-hidden min-w-[320px] max-w-[400px]`}
    >
      {/* Card Content for Screenshot */}
      <div 
        data-card-content
        className={`relative flex-1 aspect-[3/4] rounded-2xl border-4 ${config.borderColor} shadow-2xl ${config.glowColor} overflow-hidden`}
      >
        {/* Video Background */}
        <div className="absolute inset-0">
          <video
            key={currentPhase} // Force re-render when phase changes
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src={currentVideo} type="video/mp4" />
          </video>
          {/* Enhanced color overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30"></div>
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-4 left-4 w-2 h-2 bg-white/30 rounded-full animate-ping"></div>
          <div className="absolute top-8 right-6 w-1 h-1 bg-white/40 rounded-full animate-pulse"></div>
          <div className="absolute bottom-6 left-8 w-1.5 h-1.5 bg-white/20 rounded-full animate-bounce"></div>
          <div className="absolute bottom-4 right-4 w-1 h-1 bg-white/50 rounded-full animate-ping"></div>
        </div>

        {/* Card Content */}
        <div className="relative z-10 p-6 h-full flex flex-col">
          {/* Avatar and Name Section - 2 Column Grid */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Left Column: Avatar */}
            <div className="flex justify-center">
              <div className="relative">
                <div className={`w-16 h-16 rounded-full border-3 ${config.borderColor}  backdrop-blur-sm flex items-center justify-center`}>
                  <PixelArtAvatar
                    seed={getAvatarSeed()}
                    size={48}
                    className="rounded-full"
                  />
                </div>
                {/* Level Badge */}
                <div className={`absolute -bottom-1 -left-5 w-6 h-6 border-2 ${config.borderColor} bg-gradient-to-br ${config.gradient} flex items-center justify-center text-xs font-bold ${config.textColor} shadow-lg px-4 border-r-10`}>
                  <span className="text-xs" style={{ color: 'black' }}>Lvl:{displayLevel}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Name and Rank */}
            <div className="flex flex-col justify-center">
              <h3 className={`text-base font-bold ${config.textColor} mb-1 truncate`}>
                {displayName}
              </h3>
              <div className={`text-xs ${config.accentColor} font-medium`}>
                {getRankingText()}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex-1 space-y-2">
            {/* XP */}
            <div className="flex justify-between items-center">
              <span className={`text-xs ${config.accentColor} font-medium`}>XP</span>
              <span className={`text-sm font-bold ${config.textColor}`}>
                {(account?.experience || 0).toLocaleString()}
              </span>
            </div>

            {/* Points */}
            <div className="flex justify-between items-center">
              <span className={`text-xs ${config.accentColor} font-medium`}>POINTS</span>
              <span className={`text-sm font-bold ${config.textColor}`}>
                {(account?.totalPoints || 0).toLocaleString()}
              </span>
            </div>

            {/* Badges */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className={`text-xs ${config.accentColor} font-medium`}>BADGES</span>
                <span className={`text-sm font-bold ${config.textColor}`}>
                  {safeBadgesEarned?.length || 0} / 13
                </span>
              </div>

              {/* Stellar Network */}
              <div className="flex justify-between items-center">
                <span className={`text-xs ${config.accentColor} font-medium`}>NETWORK</span>
                <span className={`text-sm font-bold ${config.textColor}`}>
                  Stellar
                </span>
              </div>
              
              {/* Badge Emblems */}
              {safeBadgesEarned && safeBadgesEarned.length > 0 && (
                <div className="flex flex-wrap gap-1 justify-center">
                  {safeBadgesEarned.slice(0, 6).map((badgeId) => (
                    <BadgeEmblem
                      key={badgeId}
                      id={badgeId}
                      size="sm"
                      className="hover:scale-110 transition-transform duration-200"
                    />
                  ))}
                  {safeBadgesEarned.length > 6 && (
                    <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs text-white">
                      +{safeBadgesEarned.length - 6}
                    </div>
                  )}
                </div>
              )}
              
              {/* No badges message */}
              {(!safeBadgesEarned || safeBadgesEarned.length === 0) && (
                <div className="text-xs text-white/50 text-center py-2">
                  0 / 13 badges earned
                </div>
              )}
            </div>
          </div>

          {/* Referral Code */}
          <div className="mt-4 p-3 bg-black/30 rounded-lg border border-white/20">
            <div className={`text-xs ${config.accentColor} font-medium mb-1 text-center`}>
              REFERRAL CODE
            </div>
            <div 
              data-referral-code
              className={`text-sm font-mono font-bold ${config.textColor} text-center tracking-wider`}
            >
              {referralCode}
            </div>
          </div>

          {/* Trustless Work & Stellar Branding */}
          <div className="mt-3 text-center">
            <div className={`text-xs ${config.accentColor} font-medium mb-1`}>
              Powered by Trustless Work
            </div>
            <div className="text-xs text-white/60">
              Built on Stellar Blockchain
            </div>
          </div>

        </div>
      </div>
      </div>

        {/* Right Arrow */}
        <button
          onClick={() => handlePhaseChange('next')}
          className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 border border-white/30 flex items-center justify-center text-white transition-all duration-200 hover:scale-110 flex-shrink-0"
          title="Next phase"
        >
          →
        </button>
      </div>

    </div>
  );
});

PokemonReferralCard.displayName = 'PokemonReferralCard';

export default PokemonReferralCard;
