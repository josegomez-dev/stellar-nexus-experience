'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Account } from '@/lib/firebase/firebase-types';
import { useFirebase } from '@/contexts/data/FirebaseContext';
import { useToast } from '@/contexts/ui/ToastContext';
import { BadgeEmblem } from '@/components/ui/badges/BadgeEmblem';
import { UserAvatar } from '@/components/ui/navigation/UserAvatar';
import { useGlobalWallet } from '@/contexts/wallet/WalletContext';
import { useAuth } from '@/contexts/auth/AuthContext';
import html2canvas from 'html2canvas';
import Image from 'next/image';
import GIF from 'gif.js';

interface PokemonReferralCardProps {
  account: Account | null;
  className?: string;
}

export const PokemonReferralCard: React.FC<PokemonReferralCardProps> = ({
  account,
  className = '',
}) => {
  const { addToast } = useToast();
  const { walletData } = useGlobalWallet();
  const { user } = useAuth();
  const [isGeneratingPng, setIsGeneratingPng] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isGeneratingGif, setIsGeneratingGif] = useState(false);
  const [gifProgress, setGifProgress] = useState(0);
  const [selectedPhase, setSelectedPhase] = useState(0); // 0: baby, 1: teen, 2: adult
  const [selectedBackground, setSelectedBackground] = useState(0); // 0: explorer, 1: mid-level, 2: expert
  const [selectedForm, setSelectedForm] = useState(0); // 0: initial, 1: mid, 2: final
  const [selectedLayout, setSelectedLayout] = useState(0); // 0: classic, 1: modern, 2: minimal
  const cardRef = useRef<HTMLDivElement>(null);

  if (!account) {
    return null;
  }

  // Generate referral code from account data
  const referralCode = account.walletAddress
    ? account.walletAddress.slice(-8).toUpperCase()
    : 'NEXUS001';
  const referralLink = `${window.location.origin}/?ref=${referralCode}`;

  // Get user level and ranking
  const userLevel = Math.floor((account.experience || 0) / 1000) + 1;

  // Mock ranking based on total points (in a real app, this would come from a leaderboard)
  const mockRanking = Math.min(3, Math.max(1, Math.floor((account.totalPoints || 0) / 100) + 1));

  // Define ranking themes
  const rankingThemes = {
    1: {
      // Gold
      //   background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)',
      border: '#FFD700',
      text: '#000000',
      shadow: 'shadow-yellow-500/50',
      glow: 'from-yellow-400/50 to-orange-400/50',
    },
    2: {
      // Silver
      //   background: 'linear-gradient(135deg, #C0C0C0 0%, #A8A8A8 50%, #808080 100%)',
      border: '#C0C0C0',
      text: '#000000',
      shadow: 'shadow-gray-400/50',
      glow: 'from-gray-300/50 to-gray-500/50',
    },
    3: {
      // Bronze
      //   background: 'linear-gradient(135deg, #CD7F32 0%, #B8860B 50%, #8B4513 100%)',
      border: '#CD7F32',
      text: '#FFFFFF',
      shadow: 'shadow-orange-600/50',
      glow: 'from-orange-400/50 to-red-600/50',
    },
  };

  const currentTheme = rankingThemes[mockRanking as keyof typeof rankingThemes];

  // Define phases with images
  const phases = [
    {
      id: 0,
      name: 'Explorer',
      level: 1,
      backgroundImage: '/images/games/escrow-puzzle-master.png',
      avatarImage: '/images/character/baby.png',
      available: true,
    },
    {
      id: 1,
      name: 'Mid-Level',
      level: 2,
      backgroundImage: '/images/games/defi-trading-arena.png',
      avatarImage: '/images/character/teen.png',
      available: userLevel >= 2,
    },
    {
      id: 2,
      name: 'Expert',
      level: 3,
      backgroundImage: '/images/character/character.png',
      avatarImage: '/images/character/character.png',
      available: userLevel >= 3,
    },
  ];

  // Define background options
  const backgroundOptions = [
    {
      id: 0,
      name: 'Explorer',
      level: 1,
      image: '/images/games/escrow-puzzle-master.png',
      available: true,
    },
    {
      id: 1,
      name: 'Mid-Level',
      level: 2,
      image: '/images/games/defi-trading-arena.png',
      available: userLevel >= 2,
    },
    {
      id: 2,
      name: 'Expert',
      level: 3,
      image: '/images/character/character.png',
      available: userLevel >= 3,
    },
  ];

  // Define form options
  const formOptions = [
    {
      id: 0,
      name: 'Initial Form',
      level: 1,
      image: '/images/character/baby.png',
      available: true,
    },
    {
      id: 1,
      name: 'Mid Form',
      level: 2,
      image: '/images/character/teen.png',
      available: userLevel >= 2,
    },
    {
      id: 2,
      name: 'Final Form',
      level: 3,
      image: '/images/character/character.png',
      available: userLevel >= 3,
    },
  ];

  // Define layout options
  const layoutOptions = [
    {
      id: 0,
      name: 'Classic',
      level: 1,
      description: 'Traditional 2-column layout',
      available: true,
    },
    {
      id: 1,
      name: 'Modern',
      level: 2,
      description: 'Centered single-column layout',
      available: userLevel >= 2,
    },
    {
      id: 2,
      name: 'Minimal',
      level: 3,
      description: 'Clean minimal design',
      available: userLevel >= 3,
    },
  ];

  const currentPhase = phases[selectedPhase];
  const currentBackground = backgroundOptions[selectedBackground];
  const currentForm = formOptions[selectedForm];
  const currentLayout = layoutOptions[selectedLayout];

  // Get earned badges for display
  const earnedBadges = Array.isArray(account.badgesEarned)
    ? account.badgesEarned
    : account.badgesEarned && typeof account.badgesEarned === 'object'
      ? Object.values(account.badgesEarned)
      : [];

  // Navigation functions
  const handlePreviousPhase = () => {
    const prevIndex = selectedPhase > 0 ? selectedPhase - 1 : phases.length - 1;
    if (phases[prevIndex].available) {
      setSelectedPhase(prevIndex);
    }
  };

  const handleNextPhase = () => {
    const nextIndex = selectedPhase < phases.length - 1 ? selectedPhase + 1 : 0;
    if (phases[nextIndex].available) {
      setSelectedPhase(nextIndex);
    }
  };

  const handleDownloadPng = async () => {
    if (!cardRef.current) return;

    setIsGeneratingPng(true);
    try {
      // Create a canvas from the card
      const canvas = await html2canvas(cardRef.current, {
        useCORS: true,
        allowTaint: true,
      });

      // Convert canvas to blob
      const blob = await new Promise<Blob>(resolve => {
        canvas.toBlob(blob => {
          if (blob) resolve(blob);
        }, 'image/png');
      });

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `nexus-referral-card-${referralCode}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      addToast({
        type: 'success',
        title: '🎉 Card Downloaded!',
        message: 'Your Nexus card has been saved!',
        duration: 3000,
      });
    } catch (error) {
      console.error('Error generating card:', error);
      addToast({
        type: 'error',
        title: '❌ Download Failed',
        message: 'Failed to generate Nexus card. Please try again.',
        duration: 3000,
      });
    } finally {
      setIsGeneratingPng(false);
    }
  };

  const handleDownloadGif = async () => {
    if (!cardRef.current) return;

    setIsGeneratingGif(true);
    setGifProgress(0);

    try {
      const frames = [];
      const totalFrames = 12; // Number of frames for the GIF
      const delay = 100; // Delay between frames in ms

      // Generate frames with slight variations for animation

      for (let i = 0; i < totalFrames; i++) {
        // Create a temporary clone of the card with slight modifications
        const clonedCard = cardRef.current.cloneNode(true) as HTMLElement;
        
        // Add slight rotation and glow effect for animation
        clonedCard.style.transform = `rotate(${Math.sin(i * 0.5) * 2}deg)`;
        clonedCard.style.boxShadow = `0 0 ${20 + Math.sin(i * 0.8) * 10}px rgba(255, 215, 0, 0.5)`;
        
        // Temporarily add to DOM for capture
        clonedCard.style.cssText += `
          position: absolute;
          top: -9999px;
          left: -9999px;
          visibility: hidden;
          pointer-events: none;
        `;
        document.body.appendChild(clonedCard);

        try {
          const canvas = await html2canvas(clonedCard, {
            width: 400,
            height: 520,
            background: 'transparent',
            useCORS: true,
            allowTaint: true,
          });
          
          frames.push(canvas);
          const progress = ((i + 1) / totalFrames) * 100;
          setGifProgress(progress);
          
          // Small delay to show progress
          await new Promise(resolve => setTimeout(resolve, 50));
        } finally {
          document.body.removeChild(clonedCard);
        }
      }

      // Create GIF
      const gif = new GIF({
        workers: 2,
        quality: 10,
        width: 400,
        height: 520,
        workerScript: '/gif.worker.js',
      });

      // Add frames to GIF
      frames.forEach(frame => {
        gif.addFrame(frame, { delay: delay });
      });

      // Render GIF
      gif.on('finished', (blob: Blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `nexus-card-${account.displayName || 'anonymous'}-${Date.now()}.gif`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        setIsGeneratingGif(false);
        setGifProgress(0);
        addToast({
          type: 'success',
          title: '🎭 GIF Downloaded!',
          message: 'Your animated Nexus card is ready!',
          duration: 3000,
        });
      });

      gif.on('progress', (progress: number) => {
        setGifProgress(progress * 100);
      });

      gif.render();
      
    } catch (error) {
      console.error('Error generating GIF:', error);
      setIsGeneratingGif(false);
      setGifProgress(0);
      addToast({
        type: 'error',
        title: 'GIF Generation Failed',
        message: 'Unable to create animated GIF. Please try again.',
        duration: 3000,
      });
    }
  };



  const handleShare = async (platform: 'twitter' | 'facebook' | 'linkedin' | 'copy') => {
    setIsSharing(true);
    try {
      const text = `🚀 Join me on Stellar Nexus Experience! Master Trustless Work on Stellar blockchain and earn badges! 🏆`;
      const url = referralLink;
      const hashtags = 'StellarNexus,TrustlessWork,Web3,Blockchain';

      switch (platform) {
        case 'twitter':
          window.open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}&hashtags=${encodeURIComponent(hashtags)}`,
            '_blank'
          );
          break;
        case 'facebook':
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
            '_blank'
          );
          break;
        case 'linkedin':
          window.open(
            `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
            '_blank'
          );
          break;
        case 'copy':
          await navigator.clipboard.writeText(`${text} ${url}`);
          addToast({
            type: 'success',
            title: '📋 Copied!',
            message: 'Referral link copied to clipboard!',
            duration: 2000,
          });
          break;
      }
    } catch (error) {
      console.error('Error sharing:', error);
      addToast({
        type: 'error',
        title: '❌ Share Failed',
        message: 'Failed to share referral link. Please try again.',
        duration: 3000,
      });
    } finally {
      setIsSharing(false);
    }
  };

  const handleMint = () => {
    addToast({
      type: 'info',
      title: '🚀 Coming Soon!',
      message: 'NFT minting functionality will be available soon. Stay tuned!',
      duration: 4000,
    });
  };

  return (
    <div className={`relative ${className}`}>
      {/* Main Container - 2 Column Grid */}
      <div className='grid grid-cols-2 gap-6 items-start'>
        {/* Left Column - Pokemon Style Nexus Card */}
        <div className='flex justify-center'>
          <div className='relative'>
            {/* Ranking Medal */}
            {mockRanking <= 3 && (
              <div className='absolute -top-4 left-1/2 transform -translate-x-1/2 z-30'>
                <div
                  className={`relative w-16 h-16 rounded-full border-4 shadow-2xl ${
                    mockRanking === 1
                      ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 border-yellow-300'
                      : mockRanking === 2
                        ? 'bg-gradient-to-br from-gray-300 to-gray-500 border-gray-200'
                        : 'bg-gradient-to-br from-orange-400 to-orange-600 border-orange-300'
                  }`}
                >
                  {/* Medal Number */}
                  <div className='absolute inset-0 flex items-center justify-center'>
                    <span
                      className={`text-2xl font-bold ${
                        mockRanking === 1
                          ? 'text-yellow-900'
                          : mockRanking === 2
                            ? 'text-gray-900'
                            : 'text-orange-900'
                      }`}
                    >
                      {mockRanking === 1 ? '🥇' : mockRanking === 2 ? '🥈' : '🥉'}
                    </span>
                  </div>

                  {/* Medal Glow Effect */}
                  <div
                    className={`absolute inset-0 rounded-full blur-lg opacity-50 ${
                      mockRanking === 1
                        ? 'bg-yellow-400'
                        : mockRanking === 2
                          ? 'bg-gray-300'
                          : 'bg-orange-400'
                    }`}
                  ></div>

                  {/* Animated Ring */}
                  <div
                    className={`absolute -inset-2 rounded-full border-2 animate-ping opacity-75 ${
                      mockRanking === 1
                        ? 'border-yellow-400'
                        : mockRanking === 2
                          ? 'border-gray-300'
                          : 'border-orange-400'
                    }`}
                  ></div>
                </div>
              </div>
            )}

            {/* Pokemon Style Nexus Card */}
            <div
              ref={cardRef}
              className={`relative w-80 h-[430px] rounded-2xl border-4 shadow-2xl overflow-hidden ${currentTheme.shadow}`}
              style={{
                background: (currentTheme as any).background || '',
                borderColor: currentTheme.border,
              }}
            >
              {/* Character Background Image */}
              <div className='absolute inset-0'>
                <img
                  src={currentBackground.image}
                  alt={`${currentBackground.name} Background`}
                  className='w-full h-full object-cover'
                />
              </div>

              <br/>

              {/* Top Section - Dynamic Layout */}
              <div className='relative z-10 p-4'>
                {currentLayout.id === 0 && (
                  /* Classic Layout - 2 Column Grid */
                  <div className='grid grid-cols-2 gap-4 items-start'>
                    {/* Left Column - Nexus Card Info */}
                    <div className='flex flex-col items-center'>
                      <div className='text-center mb-3'>
                        <div className='text-sm font-bold' style={{ color: currentTheme.text }}>
                          NEXUS CARD
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Account Info */}
                    <div className='flex flex-col items-center'>
                      <div className='text-center mb-3'>
                        <div className='text-sm font-bold' style={{ color: currentTheme.text }}>
                          ACCOUNT INFO
                        </div>
                      </div>

                      {/* Avatar */}
                      <div className='relative mb-3'>
                        <div className='scale-125'>
                          <UserAvatar size='lg' showStatus={false} />
                        </div>
                        <div className='absolute -bottom-1 -right-1 bg-white rounded-full px-1.5 py-0.5'>
                          <div className='text-xs font-bold' style={{ color: 'black' }}>
                            Lv.{userLevel}
                          </div>
                        </div>
                      </div>

                      {/* Name and Ranking */}
                      <div className='text-center'>
                        <div className='text-sm font-bold' style={{ color: currentTheme.text }}>
                          {account.displayName || 'Nexus Explorer'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {currentLayout.id === 1 && (
                  /* Modern Layout - Centered Single Column */
                  <div className='flex flex-col items-center text-center space-y-4'>
                    <div className='text-sm font-bold' style={{ color: currentTheme.text }}>
                      NEXUS CARD
                    </div>
                    
                    {/* Avatar */}
                    <div className='relative'>
                      <div className='scale-125'>
                        <UserAvatar size='lg' showStatus={false} />
                      </div>
                      <div className='absolute -bottom-1 -right-1 bg-white rounded-full px-1.5 py-0.5'>
                        <div className='text-xs font-bold' style={{ color: 'black' }}>
                          Lv.{userLevel}
                        </div>
                      </div>
                    </div>

                    <div className='text-lg font-bold' style={{ color: currentTheme.text }}>
                      {account.displayName || 'Nexus Explorer'}
                    </div>
                    <div className='text-xs opacity-80' style={{ color: currentTheme.text }}>
                      {account.totalPoints || 0} points
                    </div>
                  </div>
                )}

                {currentLayout.id === 2 && (
                  /* Minimal Layout - Clean Design */
                  <div className='flex flex-col items-center text-center space-y-2'>
                    <div className='text-xs font-medium opacity-60' style={{ color: currentTheme.text }}>
                      NEXUS
                    </div>
                    
                    {/* Avatar */}
                    <div className='relative'>
                      <div className='scale-110'>
                        <UserAvatar size='md' showStatus={false} />
                      </div>
                      <div className='absolute -bottom-1 -right-1 bg-white rounded-full px-1 py-0.5'>
                        <div className='text-xs font-bold' style={{ color: 'black' }}>
                          {userLevel}
                        </div>
                      </div>
                    </div>

                    <div className='text-base font-bold' style={{ color: currentTheme.text }}>
                      {account.displayName || 'Nexus Explorer'}
                    </div>
                    <div className='text-xs opacity-50' style={{ color: currentTheme.text }}>
                      {account.totalPoints || 0} pts
                    </div>
                  </div>
                )}

                <br/>
                <br/>
                <br/>

                {/* Earned Badges */}
                {earnedBadges.length > 0 && (
                  <div className='relative z-10 px-6 mb-4'>
                    <div className='bg-black/30 backdrop-blur-sm rounded-lg p-3 border border-white/30'>
                      {/* <div
                        className='text-center text-sm font-bold mb-2'
                        style={{ color: currentTheme.text }}
                      >
                        Earned Badges ({earnedBadges.length})
                      </div> */}
                      <div className='flex flex-wrap justify-center gap-2'>
                        {earnedBadges.slice(0, 5).map((badgeId, index) => (
                          <div key={index} className='w-6 h-6'>
                            <BadgeEmblem
                              id={badgeId as string}
                              size='sm'
                              className='w-full h-full'
                            />
                          </div>
                        ))}
                        {earnedBadges.length > 6 && (
                          <div
                            className='w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs font-bold'
                            style={{ color: currentTheme.text }}
                          >
                            +{earnedBadges.length - 6}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Stats and Referral Code */}
                <div className='relative z-10 px-6 mb-4 space-y-3'>
                  {/* Stats */}
                  <div className='bg-black/30 backdrop-blur-sm rounded-lg p-3 border border-white/30'>
                    <div
                      className='grid grid-cols-3 gap-2 text-sm'
                      style={{ color: currentTheme.text }}
                    >
                      <div className='text-center'>
                        <div className='font-bold text-lg'>{account.totalPoints || 0}</div>
                        <div className='text-xs opacity-80'>Points</div>
                      </div>
                      <div className='text-center'>
                        <div className='font-bold text-lg'>{account.experience || 0}</div>
                        <div className='text-xs opacity-80'>Experience</div>
                      </div>
                      <div className='text-center'>
                        <div className='font-bold text-lg'>{earnedBadges.length}</div>
                        <div className='text-xs opacity-80'>Badges</div>
                      </div>
                    </div>
                  </div>
                </div>

                <br/>

                {/* Footer */}
                <div className='absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 via-black/40 to-transparent backdrop-blur-sm rounded-b-2xl'>
                  <div className='text-center text-xs' style={{ color: currentTheme.text }}>
                    <div className='font-bold mb-1'>Join the Nexus Experience!</div>
                    <div className='opacity-80'>Master Trustless Work on Stellar</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Left Column - Layout, Background & Form Selection Rows */}
        <div className='space-y-6'>
          {/* Layout Selection Row */}
          <div>
            <p className='text-white/80 text-sm font-bold mb-3 text-center'>
              Card Layout
            </p>
            <div className='grid grid-cols-3 gap-2'>
              {layoutOptions.map((option, index) => (
                <button
                  key={option.id}
                  onClick={() => option.available && setSelectedLayout(index)}
                  disabled={!option.available}
                  className={`relative group rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                    selectedLayout === index
                      ? 'border-yellow-400 shadow-lg shadow-yellow-400/50 scale-105'
                      : option.available
                        ? 'border-white/30 hover:border-white/60 hover:scale-105'
                        : 'border-gray-600 opacity-50 cursor-not-allowed'
                  }`}
                  title={
                    option.available
                      ? `${option.name} - ${option.description}`
                      : `Locked - Requires Level ${option.level}`
                  }
                >
                  {/* Layout Preview */}
                  <div className='aspect-square relative bg-gradient-to-br from-gray-800 to-gray-900 p-2'>
                    {option.id === 0 && (
                      /* Classic Layout Preview */
                      <div className='w-full h-full flex flex-col space-y-1'>
                        <div className='h-2 bg-white/60 rounded'></div>
                        <div className='flex-1 grid grid-cols-2 gap-1'>
                          <div className='bg-white/40 rounded'></div>
                          <div className='bg-white/40 rounded'></div>
                        </div>
                      </div>
                    )}
                    {option.id === 1 && (
                      /* Modern Layout Preview */
                      <div className='w-full h-full flex flex-col items-center justify-center space-y-1'>
                        <div className='w-3/4 h-2 bg-white/60 rounded'></div>
                        <div className='w-2/3 h-2 bg-white/40 rounded'></div>
                        <div className='w-1/2 h-2 bg-white/40 rounded'></div>
                      </div>
                    )}
                    {option.id === 2 && (
                      /* Minimal Layout Preview */
                      <div className='w-full h-full flex flex-col items-center justify-center space-y-1'>
                        <div className='w-1/2 h-1 bg-white/40 rounded'></div>
                        <div className='w-2/3 h-1 bg-white/60 rounded'></div>
                        <div className='w-1/2 h-1 bg-white/40 rounded'></div>
                      </div>
                    )}
                    
                    {/* Overlay for locked layouts */}
                    {!option.available && (
                      <div className='absolute inset-0 bg-black/60 flex items-center justify-center'>
                        <div className='text-center'>
                          <div className='text-white text-xs font-bold'>🔒</div>
                          <div className='text-white text-xs'>Level {option.level}</div>
                        </div>
                      </div>
                    )}
                    
                    {/* Selected indicator */}
                    {selectedLayout === index && (
                      <div className='absolute inset-0 bg-yellow-400/20 flex items-center justify-center'>
                        <div className='w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center'>
                          <svg className='w-4 h-4 text-black' fill='currentColor' viewBox='0 0 20 20'>
                            <path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd' />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Layout Info */}
                  <div className='absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm p-1'>
                    <div className={`text-xs font-bold text-center ${
                      option.available ? 'text-white' : 'text-gray-400'
                    }`}>
                      {option.name}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Background Selection Row */}
          <div>
            <p className='text-white/80 text-sm font-bold mb-3 text-center'>
              Background Themes
            </p>
            <div className='grid grid-cols-3 gap-2'>
              {backgroundOptions.map((option, index) => (
                <button
                  key={option.id}
                  onClick={() => option.available && setSelectedBackground(index)}
                  disabled={!option.available}
                  className={`relative group rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                    selectedBackground === index
                      ? 'border-yellow-400 shadow-lg shadow-yellow-400/50 scale-105'
                      : option.available
                        ? 'border-white/30 hover:border-white/60 hover:scale-105'
                        : 'border-gray-600 opacity-50 cursor-not-allowed'
                  }`}
                  title={
                    option.available
                      ? `${option.name} Background`
                      : `Locked - Requires Level ${option.level}`
                  }
                >
                  {/* Background Image */}
                  <div className='aspect-square relative'>
                    <img
                      src={option.image}
                      alt={`${option.name} Background`}
                      className={`w-full h-full object-cover transition-all duration-300 ${
                        option.available ? '' : 'grayscale brightness-50'
                      }`}
                    />
                    
                    {/* Overlay for locked backgrounds */}
                    {!option.available && (
                      <div className='absolute inset-0 bg-black/60 flex items-center justify-center'>
                        <div className='text-center'>
                          <div className='text-white text-xs font-bold'>🔒</div>
                          <div className='text-white text-xs'>Level {option.level}</div>
                        </div>
                      </div>
                    )}
                    
                    {/* Selected indicator */}
                    {selectedBackground === index && (
                      <div className='absolute inset-0 bg-yellow-400/20 flex items-center justify-center'>
                        <div className='w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center'>
                          <svg className='w-4 h-4 text-black' fill='currentColor' viewBox='0 0 20 20'>
                            <path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd' />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Background Info */}
                  <div className='absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm p-1'>
                    <div className={`text-xs font-bold text-center ${
                      option.available ? 'text-white' : 'text-gray-400'
                    }`}>
                      {option.name}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Social Sharing Buttons */}
          <div className='mt-6'>
            <p className='text-white/60 text-xs text-center mb-3'>
              Share your Nexus Experience on social media
            </p>
            <div className='grid grid-cols-2 gap-2'>
              <button
                onClick={() => handleShare('twitter')}
                disabled={isSharing}
                className='bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-3 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-1'
              >
                <span>🐦</span>
                <span className='text-xs'>Twitter</span>
              </button>
              <button
                onClick={() => handleShare('facebook')}
                disabled={isSharing}
                className='bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-3 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-1'
              >
                <span>📘</span>
                <span className='text-xs'>Facebook</span>
              </button>
              <button
                onClick={() => handleShare('linkedin')}
                disabled={isSharing}
                className='bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 px-3 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-1'
              >
                <span>💼</span>
                <span className='text-xs'>LinkedIn</span>
              </button>
              <button
                onClick={() => handleShare('copy')}
                disabled={isSharing}
                className='bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-3 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-1'
              >
                <span>📋</span>
                <span className='text-xs'>Copy Link</span>
              </button>
            </div>
          </div>
        </div>

      </div>
      
      <br/>
      <hr/>
      <br/>

          {/* Right Column - Download Buttons */}
          <div className='space-y-4'>
            {/* Download PNG Button */}
            <button
              onClick={handleDownloadPng}
              disabled={isGeneratingPng}
              className='bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2 w-full'
            >
              {isGeneratingPng ? (
                <>
                  <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <span>📱</span>
                  <span>Download PNG</span>
                </>
              )}
            </button>

            {/* Download GIF Button */}
            <button
              onClick={handleDownloadGif}
              disabled={isGeneratingGif}
              className='bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2 w-full'
            >
              {isGeneratingGif ? (
                <>
                  <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                  <span>Creating GIF...</span>
                  <div className='animate-pulse text-xs ml-2'>
                    ({Math.round(gifProgress)}%)
                  </div>
                </>
              ) : (
                <>
                  <span>🎭</span>
                  <span>Download GIF</span>
                </>
              )}
            </button>

            {/* GIF Progress Bar */}
            {isGeneratingGif && (
              <div className='w-full bg-gray-700 rounded-full h-2 overflow-hidden'>
                <div
                  className='bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300 ease-out'
                  style={{ width: `${gifProgress}%` }}
                />
              </div>
            )}
          </div>
    </div>
  );
};

export default PokemonReferralCard;
