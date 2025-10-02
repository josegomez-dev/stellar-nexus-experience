'use client';

import React, { useState, useRef } from 'react';
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
  const [isGeneratingGif, setIsGeneratingGif] = useState(false);
  const [gifProgress, setGifProgress] = useState(0);
  const [isGeneratingPng, setIsGeneratingPng] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [selectedPhase, setSelectedPhase] = useState(0); // 0: baby, 1: teen, 2: adult
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

  // Define phases with videos and images
  const phases = [
    {
      id: 0,
      name: 'Baby',
      level: 1,
      video: '/videos/phases/baby.mp4',
      image: '/images/character/baby.png',
      available: true,
    },
    {
      id: 1,
      name: 'Teen',
      level: 2,
      video: '/videos/phases/teen.mp4',
      image: '/images/character/teen.png',
      available: userLevel >= 2,
    },
    {
      id: 2,
      name: 'Adult',
      level: 3,
      video: '/videos/phases/adult.mp4',
      image: '/images/character/character.png',
      available: userLevel >= 3,
    },
  ];

  const currentPhase = phases[selectedPhase];

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
        message: 'Your Pokemon-style referral card has been saved!',
        duration: 3000,
      });
    } catch (error) {
      console.error('Error generating card:', error);
      addToast({
        type: 'error',
        title: '❌ Download Failed',
        message: 'Failed to generate referral card. Please try again.',
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
      // Create GIF instance with optimized settings
      const gif = new GIF({
        workers: 2,
        quality: 20, // Better quality
        width: 320,
        height: 520,
        workerScript: '/gif.worker.js',
      });

      // Create a simple static animation with 4 frames (no movement, just timing)
      const frames = 4;

      for (let i = 0; i < frames; i++) {
        // Capture the frame without any modifications
        const canvas = await html2canvas(cardRef.current, {
          useCORS: true,
          allowTaint: true,
        });

        // Add frame with appropriate delay
        gif.addFrame(canvas, { delay: 250 }); // Slightly longer delay for better visibility
        
        // Update progress
        setGifProgress(Math.round(((i + 1) / frames) * 50)); // 50% for frame capture
      }

      // Update progress to show rendering phase
      setGifProgress(75);
      
      // Render the GIF
      gif.on('finished', function (blob) {
        setGifProgress(100);
        // Create download link
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `nexus-referral-card-${referralCode}.gif`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        addToast({
          type: 'success',
          title: '🎉 GIF Downloaded!',
          message: 'Your referral card GIF has been saved!',
          duration: 3000,
        });

        setIsGeneratingGif(false);
        setGifProgress(0);
      });

      gif.render();
    } catch (error) {
      console.error('Error generating GIF:', error);
      addToast({
        type: 'error',
        title: '❌ GIF Generation Failed',
        message: 'Failed to generate animated GIF. Please try again.',
        duration: 3000,
      });
      setIsGeneratingGif(false);
      setGifProgress(0);
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

            {/* Pokemon Style Nexus Card Card */}
            <div
              ref={cardRef}
              className={`relative w-80 h-[520px] rounded-2xl border-4 shadow-2xl overflow-hidden ${currentTheme.shadow}`}
              style={{
                background: (currentTheme as any).background || '',
                borderColor: currentTheme.border,
              }}
            >
              {/* Video Background */}
              <div className='absolute inset-0 opacity-30'>
                <video
                  key={currentPhase.id}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className='w-full h-full object-cover'
                >
                  <source src={currentPhase.video} type='video/mp4' />
                  <img
                    src={currentPhase.image}
                    alt={`${currentPhase.name} Character`}
                    className='w-full h-full object-cover'
                  />
                </video>
              </div>

              <br/>

              {/* Top Section - 2 Column Grid */}
              <div className='relative z-10 p-4'>
                <div className='grid grid-cols-2 gap-4 items-start'>
                  {/* Left Column - Character Phases */}
                  <div className='flex flex-col items-center'>
                    <div className='text-center mb-3'>
                      <div className='text-sm font-bold' style={{ color: currentTheme.text }}>
                        NEXUS PRIME
                      </div>
                    </div>

                    {/* Character with Navigation */}
                    <div className='relative'>
                      {/* Navigation Arrows */}
                      <button
                        onClick={handlePreviousPhase}
                        className='absolute -left-3 top-1/2 transform -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full p-1.5 border border-white/30 transition-all duration-200 hover:scale-110'
                        disabled={
                          !phases[selectedPhase > 0 ? selectedPhase - 1 : phases.length - 1]
                            ?.available
                        }
                        title={`Previous phase (${phases[selectedPhase > 0 ? selectedPhase - 1 : phases.length - 1]?.name})`}
                      >
                        <svg
                          className='w-3 h-3 text-white'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M15 19l-7-7 7-7'
                          />
                        </svg>
                      </button>

                      <button
                        onClick={handleNextPhase}
                        className='absolute -right-3 top-1/2 transform -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full p-1.5 border border-white/30 transition-all duration-200 hover:scale-110'
                        disabled={
                          !phases[selectedPhase < phases.length - 1 ? selectedPhase + 1 : 0]
                            ?.available
                        }
                        title={`Next phase (${phases[selectedPhase < phases.length - 1 ? selectedPhase + 1 : 0]?.name})`}
                      >
                        <svg
                          className='w-3 h-3 text-white'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M9 5l7 7-7 7'
                          />
                        </svg>
                      </button>

                      <Image
                        src={currentPhase.image}
                        alt='Nexus Prime Character'
                        width={80}
                        height={80}
                        className='rounded-full border-3 border-white shadow-lg'
                      />
                      {/* Glow effect */}
                      <div
                        className={`absolute inset-0 rounded-full bg-gradient-to-r ${currentTheme.glow} blur-lg scale-110`}
                      ></div>
                    </div>

                    {/* Phase Info */}
                    <div className='text-center mt-2'>
                      <div className='text-xs font-semibold' style={{ color: currentTheme.text }}>
                        {currentPhase.name} Phase
                      </div>
                      {/* <div className='text-xs opacity-70' style={{ color: currentTheme.text }}>
                        Level {currentPhase.level}
                      </div> */}
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

                <br/>
                <br/>
                <br/>

                {/* Earned Badges */}
                {earnedBadges.length > 0 && (
                  <div className='relative z-10 px-6 mb-4'>
                    <div className='bg-black/30 backdrop-blur-sm rounded-lg p-3 border border-white/30'>
                      <div
                        className='text-center text-sm font-bold mb-2'
                        style={{ color: currentTheme.text }}
                      >
                        Earned Badges ({earnedBadges.length})
                      </div>
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
                <br/>
                <br/>

                {/* Footer */}
                <div className='absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/60 via-black/40 to-transparent backdrop-blur-sm rounded-b-2xl'>
                  <div className='text-center text-xs' style={{ color: currentTheme.text }}>
                    <div className='font-bold mb-1'>Join the Nexus Experience!</div>
                    <div className='opacity-80'>Master Trustless Work on Stellar</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Action Buttons */}
        <div className='flex flex-col justify-center space-y-4'>
            <p className='text-white/60 text-xs'>
               Download your Nexus Prime Character as PNG or GIF
            </p>
          {/* Download PNG Button */}
          <button
            onClick={handleDownloadPng}
            disabled={isGeneratingPng}
            className='w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2'
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
            className='w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2 relative overflow-hidden'
          >
            {/* Animated background effect */}
            {isGeneratingGif && (
              <div className='absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 animate-pulse'></div>
            )}
            
            <div className='relative z-10 flex items-center space-x-2'>
              {isGeneratingGif ? (
                <>
                  <div className='relative'>
                    <div className='animate-spin rounded-full h-5 w-5 border-2 border-white/30'></div>
                    <div className='animate-spin rounded-full h-5 w-5 border-t-2 border-white absolute top-0 left-0' style={{ animationDirection: 'reverse' }}></div>
                  </div>
                  <div className='flex flex-col items-start'>
                    <span className='text-sm'>Creating GIF...</span>
                    <div className='w-20 h-1 bg-white/20 rounded-full overflow-hidden mt-1'>
                      <div 
                        className='h-full bg-white rounded-full transition-all duration-300 ease-out'
                        style={{ width: `${gifProgress}%` }}
                      ></div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <span className='text-lg'>🎬</span>
                  <span>Download GIF</span>
                </>
              )}
            </div>
          </button>

            <p className='text-white/60 text-xs'>
                Mint your Nexus Prime Character as NFT (Coming Soon)
            </p>
          {/* Mint Button */}
          <button
            onClick={handleMint}
            className='w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 relative disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
            disabled={true}
          >
            <span>🎨</span>
            <span>Mint as NFT</span>
            {/* Coming Soon Badge */}
            <div className='absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full border-2 border-white animate-pulse'>
              Soon
            </div>
          </button>

            <hr/>
            <p className='text-white/60 text-xs'>
                Share your Nexus Experience on social media
            </p>
          {/* Social Sharing Buttons */}
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
  );
};

export default PokemonReferralCard;
