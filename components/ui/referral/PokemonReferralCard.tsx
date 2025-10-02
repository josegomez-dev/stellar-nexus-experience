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
  const [isGeneratingMp4, setIsGeneratingMp4] = useState(false);
  const [mp4Progress, setMp4Progress] = useState(0);
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
      // Create canvas for high-quality rendering
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      
      // Set final render size (optimized for social sharing)
      const width = 640;
      const height = 1040;
      canvas.width = width;
      canvas.height = height;

      // GIF settings optimized for quality and size
      const gif = new GIF({
        workers: 4,
        quality: 2, // Lower = better quality (1-20)
        width,
        height,
        workerScript: '/gif.worker.js',
        dither: true, // Better gradient handling
        repeat: 0, // Loop forever
      });

      // Animation settings
      const durationSec = 4; // Keep it short for social sharing
      const fps = 15; // Sweet spot for quality/size
      const totalFrames = durationSec * fps;

      // Draw each frame directly on canvas
      for (let i = 0; i < totalFrames; i++) {
        const progress = i / (totalFrames - 1);
        const time = progress * Math.PI * 2;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Draw card background with gradient
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#1a1a2e');
        gradient.addColorStop(0.5, '#16213e');
        gradient.addColorStop(1, '#0f3460');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // Add animated border glow
        const glowIntensity = 0.3 + Math.sin(time * 2) * 0.2;
        const glowSize = 20 + Math.sin(time * 3) * 10;
        ctx.shadowColor = currentTheme.border;
        ctx.shadowBlur = glowSize;
        ctx.strokeStyle = currentTheme.border;
        ctx.lineWidth = 8;
        ctx.strokeRect(20, 20, width - 40, height - 40);
        ctx.shadowBlur = 0;
        
        // Draw character with phase transition
        const characterSize = 120;
        const characterX = width / 2 - characterSize / 2;
        const characterY = 200;
        
        // Phase selection based on animation progress
        let characterSrc = '/images/character/character.png';
        if (progress < 0.33) {
          characterSrc = '/images/character/baby.png';
        } else if (progress < 0.66) {
          characterSrc = '/images/character/teen.png';
        }
        
        // Load and draw character
        const characterImg = document.createElement('img');
        characterImg.crossOrigin = 'anonymous';
        await new Promise<void>((resolve) => {
          characterImg.onload = () => resolve();
          characterImg.src = characterSrc;
        });
        
        // Add character glow effect
        const charGlow = 0.5 + Math.sin(time * 4) * 0.3;
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 15 + charGlow * 10;
        ctx.drawImage(characterImg, characterX, characterY, characterSize, characterSize);
        ctx.shadowBlur = 0;
        
        // Draw user info
        ctx.fillStyle = currentTheme.text;
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(account.displayName || 'Nexus Explorer', width / 2, 380);
        
        // Draw level
        ctx.font = 'bold 18px Arial';
        ctx.fillText(`Level ${userLevel}`, width / 2, 410);
        
        // Draw stats with animation
        const statsY = 450;
        const stats = [
          { label: 'Points', value: account.totalPoints || 0 },
          { label: 'XP', value: account.experience || 0 },
          { label: 'Badges', value: earnedBadges.length }
        ];
        
        stats.forEach((stat, index) => {
          const statX = (width / 4) * (index + 1);
          const pulse = 1 + Math.sin(time * 6 + index) * 0.1;
          
          ctx.font = `bold ${16 * pulse}px Arial`;
          ctx.fillText(stat.value.toString(), statX, statsY);
          ctx.font = '12px Arial';
          ctx.fillText(stat.label, statX, statsY + 20);
        });
        
        // Draw badges with animation
        if (earnedBadges.length > 0) {
          const badgeSize = 40;
          const badgeY = 520;
          const badgeSpacing = 60;
          const startX = (width - (earnedBadges.length * badgeSpacing)) / 2;
          
          earnedBadges.slice(0, 6).forEach((badgeId, index) => {
            const badgeX = startX + index * badgeSpacing;
            const rotation = Math.sin(time * 3 + index * 0.5) * 0.1;
            const scale = 1 + Math.sin(time * 4 + index * 0.3) * 0.1;
            
            ctx.save();
            ctx.translate(badgeX + badgeSize / 2, badgeY + badgeSize / 2);
            ctx.rotate(rotation);
            ctx.scale(scale, scale);
            
            // Draw badge placeholder (you can replace with actual badge rendering)
            ctx.fillStyle = '#ffd700';
            ctx.beginPath();
            ctx.arc(0, 0, badgeSize / 2, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = '#000';
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('🏆', 0, 5);
            
            ctx.restore();
          });
        }
        
        // Draw referral code
        ctx.fillStyle = currentTheme.text;
        ctx.font = 'bold 20px Arial';
        ctx.fillText(`Referral: ${referralCode}`, width / 2, height - 100);
        
        // Draw footer text
        ctx.font = '14px Arial';
        ctx.fillText('Join the Nexus Experience!', width / 2, height - 60);
        ctx.font = '12px Arial';
        ctx.fillText('Master Trustless Work on Stellar', width / 2, height - 40);
        
        // Add frame to GIF
        gif.addFrame(ctx, { copy: true, delay: 1000 / fps });
        
        // Update progress
        const frameProgress = Math.round(((i + 1) / totalFrames) * 80);
        setGifProgress(frameProgress);
        
        // Small delay to prevent UI blocking
        await new Promise(resolve => setTimeout(resolve, 10));
      }
      
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
          title: '🎉 Premium GIF Downloaded!',
          message: 'Your high-quality referral card GIF is ready for social sharing!',
          duration: 4000,
        });

        setIsGeneratingGif(false);
        setGifProgress(0);
      });

      gif.on('progress', function (p) {
        const renderProgress = 80 + Math.round(p * 20);
        setGifProgress(renderProgress);
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

  const handleDownloadMp4 = async () => {
    if (!cardRef.current) return;

    setIsGeneratingMp4(true);
    setMp4Progress(0);
    
    try {
      // Create canvas for high-quality rendering
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      
      // Set final render size (optimized for social sharing)
      const width = 640;
      const height = 1040;
      canvas.width = width;
      canvas.height = height;

      // Animation settings
      const durationSec = 4;
      const fps = 30; // Higher FPS for MP4
      const totalFrames = durationSec * fps;

      // Create MediaRecorder for MP4/WebM
      const stream = canvas.captureStream(fps);
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9',
        videoBitsPerSecond: 2500000, // 2.5 Mbps for good quality
      });

      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `nexus-referral-card-${referralCode}.webm`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        addToast({
          type: 'success',
          title: '🎉 Premium Video Downloaded!',
          message: 'Your high-quality referral card video is ready for social sharing!',
          duration: 4000,
        });

        setIsGeneratingMp4(false);
        setMp4Progress(0);
      };

      // Start recording
      mediaRecorder.start();

      // Draw each frame directly on canvas
      for (let i = 0; i < totalFrames; i++) {
        const progress = i / (totalFrames - 1);
        const time = progress * Math.PI * 2;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Draw card background with gradient
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#1a1a2e');
        gradient.addColorStop(0.5, '#16213e');
        gradient.addColorStop(1, '#0f3460');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // Add animated border glow
        const glowIntensity = 0.3 + Math.sin(time * 2) * 0.2;
        const glowSize = 20 + Math.sin(time * 3) * 10;
        ctx.shadowColor = currentTheme.border;
        ctx.shadowBlur = glowSize;
        ctx.strokeStyle = currentTheme.border;
        ctx.lineWidth = 8;
        ctx.strokeRect(20, 20, width - 40, height - 40);
        ctx.shadowBlur = 0;
        
        // Draw character with phase transition
        const characterSize = 120;
        const characterX = width / 2 - characterSize / 2;
        const characterY = 200;
        
        // Phase selection based on animation progress
        let characterSrc = '/images/character/character.png';
        if (progress < 0.33) {
          characterSrc = '/images/character/baby.png';
        } else if (progress < 0.66) {
          characterSrc = '/images/character/teen.png';
        }
        
        // Load and draw character
        const characterImg = document.createElement('img');
        characterImg.crossOrigin = 'anonymous';
        await new Promise<void>((resolve) => {
          characterImg.onload = () => resolve();
          characterImg.src = characterSrc;
        });
        
        // Add character glow effect
        const charGlow = 0.5 + Math.sin(time * 4) * 0.3;
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 15 + charGlow * 10;
        ctx.drawImage(characterImg, characterX, characterY, characterSize, characterSize);
        ctx.shadowBlur = 0;
        
        // Draw user info
        ctx.fillStyle = currentTheme.text;
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(account.displayName || 'Nexus Explorer', width / 2, 380);
        
        // Draw level
        ctx.font = 'bold 18px Arial';
        ctx.fillText(`Level ${userLevel}`, width / 2, 410);
        
        // Draw stats with animation
        const statsY = 450;
        const stats = [
          { label: 'Points', value: account.totalPoints || 0 },
          { label: 'XP', value: account.experience || 0 },
          { label: 'Badges', value: earnedBadges.length }
        ];
        
        stats.forEach((stat, index) => {
          const statX = (width / 4) * (index + 1);
          const pulse = 1 + Math.sin(time * 6 + index) * 0.1;
          
          ctx.font = `bold ${16 * pulse}px Arial`;
          ctx.fillText(stat.value.toString(), statX, statsY);
          ctx.font = '12px Arial';
          ctx.fillText(stat.label, statX, statsY + 20);
        });
        
        // Draw badges with animation
        if (earnedBadges.length > 0) {
          const badgeSize = 40;
          const badgeY = 520;
          const badgeSpacing = 60;
          const startX = (width - (earnedBadges.length * badgeSpacing)) / 2;
          
          earnedBadges.slice(0, 6).forEach((badgeId, index) => {
            const badgeX = startX + index * badgeSpacing;
            const rotation = Math.sin(time * 3 + index * 0.5) * 0.1;
            const scale = 1 + Math.sin(time * 4 + index * 0.3) * 0.1;
            
            ctx.save();
            ctx.translate(badgeX + badgeSize / 2, badgeY + badgeSize / 2);
            ctx.rotate(rotation);
            ctx.scale(scale, scale);
            
            // Draw badge placeholder
            ctx.fillStyle = '#ffd700';
            ctx.beginPath();
            ctx.arc(0, 0, badgeSize / 2, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = '#000';
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('🏆', 0, 5);
            
            ctx.restore();
          });
        }
        
        // Draw referral code
        ctx.fillStyle = currentTheme.text;
        ctx.font = 'bold 20px Arial';
        ctx.fillText(`Referral: ${referralCode}`, width / 2, height - 100);
        
        // Draw footer text
        ctx.font = '14px Arial';
        ctx.fillText('Join the Nexus Experience!', width / 2, height - 60);
        ctx.font = '12px Arial';
        ctx.fillText('Master Trustless Work on Stellar', width / 2, height - 40);
        
        // Update progress
        const frameProgress = Math.round(((i + 1) / totalFrames) * 90);
        setMp4Progress(frameProgress);
        
        // Wait for next frame
        await new Promise(resolve => setTimeout(resolve, 1000 / fps));
      }

      // Stop recording
      mediaRecorder.stop();
      
    } catch (error) {
      console.error('Error generating MP4:', error);
      addToast({
        type: 'error',
        title: '❌ Video Generation Failed',
        message: 'Failed to generate animated video. Please try again.',
        duration: 3000,
      });
      setIsGeneratingMp4(false);
      setMp4Progress(0);
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
              <div className='absolute inset-0 '>
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
                        NEXUS CARD
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

          {/* Download MP4/WebM Button */}
          <button
            onClick={handleDownloadMp4}
            disabled={isGeneratingMp4}
            className='w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2 relative overflow-hidden'
          >
            {/* Animated background effect */}
            {isGeneratingMp4 && (
              <div className='absolute inset-0 bg-gradient-to-r from-green-400/20 to-teal-400/20 animate-pulse'></div>
            )}
            
            <div className='relative z-10 flex items-center space-x-2'>
              {isGeneratingMp4 ? (
                <>
                  <div className='relative'>
                    <div className='animate-spin rounded-full h-5 w-5 border-2 border-white/30'></div>
                    <div className='animate-spin rounded-full h-5 w-5 border-t-2 border-white absolute top-0 left-0' style={{ animationDirection: 'reverse' }}></div>
                  </div>
                  <div className='flex flex-col items-start'>
                    <span className='text-sm'>Creating Video...</span>
                    <div className='w-20 h-1 bg-white/20 rounded-full overflow-hidden mt-1'>
                      <div 
                        className='h-full bg-white rounded-full transition-all duration-300 ease-out'
                        style={{ width: `${mp4Progress}%` }}
                      ></div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <span className='text-lg'>🎥</span>
                  <span>Download Video</span>
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
