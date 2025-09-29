'use client';

import React, { useEffect, useState } from 'react';
import { Badge } from '@/contexts/auth/AuthContext';

// Extend Badge interface to include earningPoints
interface BadgeWithPoints extends Badge {
  earningPoints: number;
}
import {
  getBadgeIcon,
  getBadgeColors,
  playBadgeSound,
  BADGE_SIZES,
} from '@/utils/constants/badges/assets';

// Badge SVG emblem using centralized assets
const BadgeEmblem: React.FC<{ id: string }> = ({ id }) => {
  const icon = getBadgeIcon(id, BADGE_SIZES['3xl']);

  if (icon) {
    return <div className='drop-shadow-2xl'>{icon}</div>;
  }

  // Fallback for unknown badges
  return (
    <div className='w-32 h-32 bg-gray-600 rounded-full flex items-center justify-center text-white text-6xl drop-shadow-2xl'>
      🏆
    </div>
  );
};

interface BadgeEarnedAnimationProps {
  badge: BadgeWithPoints;
  isVisible: boolean;
  onComplete: () => void;
  points?: number;
}

// Helper function to get badge-specific styles using centralized assets
const getBadgeStyles = (badgeId: string) => {
  const colors = getBadgeColors(badgeId);
  return {
    ring: colors.gradient,
    glow: colors.glow,
    text: colors.text,
  };
};

export const BadgeEarnedAnimation: React.FC<BadgeEarnedAnimationProps> = ({
  badge,
  isVisible,
  onComplete,
  points = 0,
}) => {
  const [progress, setProgress] = useState(0);
  const [animationPhase, setAnimationPhase] = useState<'enter' | 'display' | 'exit'>('enter');
  const { ring, glow, text } = getBadgeStyles(badge.id);

  useEffect(() => {
    if (!isVisible) {
      setProgress(0);
      setAnimationPhase('enter');
      return;
    }

    // Play badge sound when animation starts
    playBadgeSound();

    // Phase 1: Enter animation (0.5s)
    const enterTimer = setTimeout(() => {
      setAnimationPhase('display');
    }, 500);

    // Phase 2: Display with progress bar (4s)
    const progressTimer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 100 / 40; // 100% over 4 seconds (40 intervals of 100ms)
        if (newProgress >= 100) {
          clearInterval(progressTimer);
          setAnimationPhase('exit');
          // Phase 3: Exit animation (0.5s)
          setTimeout(() => {
            onComplete();
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 100);

    // Start progress after enter animation
    setTimeout(() => {
      setProgress(0);
    }, 500);

    return () => {
      clearTimeout(enterTimer);
      clearInterval(progressTimer);
    };
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <div className='fixed inset-0 z-[9999] flex items-center justify-center'>
      {/* Animated Background */}
      <div
        className={`absolute inset-0 transition-all duration-500 ${
          animationPhase === 'enter' ? 'bg-black/0' : 'bg-black/80'
        }`}
        style={{
          background:
            animationPhase !== 'enter'
              ? `radial-gradient(circle at center, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.95) 100%)`
              : 'transparent',
        }}
      />

      {/* Particle Effects Background */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 bg-gradient-to-r ${ring} rounded-full opacity-70 animate-float-particle`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div
        className={`relative z-10 text-center transform transition-all duration-500 ${
          animationPhase === 'enter'
            ? 'scale-0 rotate-180 opacity-0'
            : animationPhase === 'exit'
              ? 'scale-110 opacity-0 translate-y-8'
              : 'scale-100 rotate-0 opacity-100'
        }`}
      >
        {/* Epic Badge Container */}
        <div className={`relative mb-8 ${glow}`}>
          {/* Outer Holographic Ring */}
          <div
            className={`absolute -inset-8 rounded-full bg-gradient-to-tr ${ring} opacity-60 blur-lg animate-pulse-slow`}
          />
          <div
            className={`absolute -inset-4 rounded-full bg-gradient-to-tr ${ring} opacity-40 blur-md animate-spin-slow`}
          />

          {/* Badge */}
          <div className='relative transform animate-bounce-gentle'>
            <BadgeEmblem id={badge.id} />

            {/* Sparkle Effects */}
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className='absolute w-1 h-1 bg-white rounded-full animate-sparkle'
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: `${20 + Math.random() * 60}%`,
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Badge Info */}
        <div className='space-y-4 max-w-lg mx-auto px-8'>
          <div className={`text-6xl font-black tracking-tight ${text} animate-text-glow`}>
            BADGE EARNED!
          </div>

          <div className='space-y-2'>
            <h2 className='text-4xl font-bold text-white animate-slide-up'>{badge.name}</h2>
            <p className='text-xl text-gray-300 animate-slide-up animation-delay-200'>
              {badge.description}
            </p>
          </div>

          {/* Rarity & Points */}
          <div className='flex items-center justify-center gap-6 animate-slide-up animation-delay-400'>
            <div
              className={`px-4 py-2 rounded-full bg-gradient-to-r ${ring} text-black font-bold text-lg`}
            >
              {badge.rarity.toUpperCase()}
            </div>
            <div className='text-2xl font-bold text-green-400'>
              +{points || badge.earningPoints} pts
            </div>
          </div>

          {/* Progress Bar */}
          <div className='mt-8 animate-slide-up animation-delay-600'>
            <div className='w-80 h-2 bg-gray-700 rounded-full mx-auto overflow-hidden'>
              <div
                className={`h-full bg-gradient-to-r ${ring} transition-all duration-100 ease-linear rounded-full`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className='text-sm text-gray-400 mt-2'>
              Auto-closing in {Math.ceil((100 - progress) / 25)} seconds...
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes float-particle {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.7;
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
            opacity: 1;
          }
        }
        @keyframes bounce-gentle {
          0%,
          100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-10px) scale(1.05);
          }
        }
        @keyframes sparkle {
          0%,
          100% {
            opacity: 0;
            transform: scale(0);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes text-glow {
          0%,
          100% {
            text-shadow: 0 0 20px currentColor;
          }
          50% {
            text-shadow:
              0 0 30px currentColor,
              0 0 40px currentColor;
          }
        }
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.6;
          }
          50% {
            opacity: 0.9;
          }
        }
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-float-particle {
          animation: float-particle 4s ease-in-out infinite;
        }
        .animate-bounce-gentle {
          animation: bounce-gentle 2s ease-in-out infinite;
        }
        .animate-sparkle {
          animation: sparkle 1.5s ease-in-out infinite;
        }
        .animate-text-glow {
          animation: text-glow 2s ease-in-out infinite;
        }
        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
        .animation-delay-600 {
          animation-delay: 0.6s;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-float-particle,
          .animate-bounce-gentle,
          .animate-sparkle,
          .animate-text-glow,
          .animate-pulse-slow,
          .animate-spin-slow {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default BadgeEarnedAnimation;
