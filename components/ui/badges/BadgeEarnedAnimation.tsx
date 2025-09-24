'use client';

import React, { useEffect, useState } from 'react';
import { BadgeConfig, rarityStyles } from '@/lib/badge-config';

// Badge SVG emblems (reused from Badge3D component)
const BadgeEmblem: React.FC<{ id: string }> = ({ id }) => {
  switch (id) {
    case "trust-guardian":
      return (
        <svg viewBox="0 0 64 64" className="w-32 h-32 drop-shadow-2xl">
          <defs>
            <linearGradient id={`anim-g1-${id}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#00E5FF" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
          <path d="M32 4l20 8v14c0 14-9.2 26.7-20 34-10.8-7.3-20-20-20-34V12l20-8z" fill={`url(#anim-g1-${id})`} opacity="0.85" />
          <path d="M22 30l8 8 12-12" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "escrow-expert":
      return (
        <svg viewBox="0 0 64 64" className="w-32 h-32 drop-shadow-2xl">
          <defs>
            <linearGradient id={`anim-g2-${id}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#67e8f9" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
          <circle cx="32" cy="32" r="26" fill={`url(#anim-g2-${id})`} opacity="0.9" />
          <path d="M18 28h28v8H18z" fill="#0ea5e9" opacity="0.8" />
          <path d="M22 22h20v6H22zM22 36h20v6H22z" fill="#fff" opacity="0.9" />
        </svg>
      );
    case "blockchain-pioneer":
      return (
        <svg viewBox="0 0 64 64" className="w-32 h-32 drop-shadow-2xl">
          <defs>
            <linearGradient id={`anim-g3-${id}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#c084fc" />
              <stop offset="100%" stopColor="#818cf8" />
            </linearGradient>
          </defs>
          <path d="M32 6l18 10v20L32 56 14 36V16z" fill={`url(#anim-g3-${id})`} opacity="0.9" />
          <g stroke="#fff" strokeWidth="3" opacity="0.95" strokeLinecap="round">
            <path d="M22 24h20" />
            <path d="M22 32h20" />
            <path d="M22 40h20" />
          </g>
        </svg>
      );
    case "dispute-detective":
      return (
        <svg viewBox="0 0 64 64" className="w-32 h-32 drop-shadow-2xl">
          <defs>
            <linearGradient id={`anim-g4-${id}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#a78bfa" />
              <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>
          </defs>
          <circle cx="28" cy="28" r="16" fill={`url(#anim-g4-${id})`} opacity="0.9" />
          <path d="M40 40l10 10" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
          <path d="M24 28h8M28 24v8" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case "gig-economy-guru":
      return (
        <svg viewBox="0 0 64 64" className="w-32 h-32 drop-shadow-2xl">
          <defs>
            <linearGradient id={`anim-g5-${id}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fde68a" />
              <stop offset="100%" stopColor="#fb923c" />
            </linearGradient>
          </defs>
          <path d="M8 44h48l-6 10H14z" fill="#fdba74" opacity="0.95" />
          <rect x="12" y="12" width="40" height="30" rx="6" fill={`url(#anim-g5-${id})`} />
          <path d="M20 20h24M20 28h24M20 36h14" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case "stellar-champion":
      return (
        <svg viewBox="0 0 64 64" className="w-32 h-32 drop-shadow-2xl">
          <defs>
            <radialGradient id={`anim-g6-${id}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fff7ed" />
              <stop offset="55%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#fb7185" />
            </radialGradient>
          </defs>
          <path d="M12 52l20-40 20 40H12z" fill={`url(#anim-g6-${id})`} opacity="0.95" />
          <circle cx="32" cy="28" r="8" fill="#fff" opacity="0.95" />
          <path d="M32 18v20M22 28h20" stroke="#f59e0b" strokeWidth="3" />
        </svg>
      );
    default:
      return (
        <div className="w-32 h-32 bg-gray-600 rounded-full flex items-center justify-center text-white text-6xl drop-shadow-2xl">
          🏆
        </div>
      );
  }
};

interface BadgeEarnedAnimationProps {
  badge: BadgeConfig;
  isVisible: boolean;
  onComplete: () => void;
  points?: number;
}

export const BadgeEarnedAnimation: React.FC<BadgeEarnedAnimationProps> = ({
  badge,
  isVisible,
  onComplete,
  points = 0
}) => {
  const [progress, setProgress] = useState(0);
  const [animationPhase, setAnimationPhase] = useState<'enter' | 'display' | 'exit'>('enter');
  const { ring, glow, text } = rarityStyles[badge.rarity];

  useEffect(() => {
    if (!isVisible) {
      setProgress(0);
      setAnimationPhase('enter');
      return;
    }

    // Phase 1: Enter animation (0.5s)
    const enterTimer = setTimeout(() => {
      setAnimationPhase('display');
    }, 500);

    // Phase 2: Display with progress bar (4s)
    const progressTimer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (100 / 40); // 100% over 4 seconds (40 intervals of 100ms)
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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Animated Background */}
      <div 
        className={`absolute inset-0 transition-all duration-500 ${
          animationPhase === 'enter' ? 'bg-black/0' : 'bg-black/80'
        }`}
        style={{
          background: animationPhase !== 'enter' 
            ? `radial-gradient(circle at center, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.95) 100%)`
            : 'transparent'
        }}
      />

      {/* Particle Effects Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 bg-gradient-to-r ${ring} rounded-full opacity-70 animate-float-particle`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
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
          <div className={`absolute -inset-8 rounded-full bg-gradient-to-tr ${ring} opacity-60 blur-lg animate-pulse-slow`} />
          <div className={`absolute -inset-4 rounded-full bg-gradient-to-tr ${ring} opacity-40 blur-md animate-spin-slow`} />
          
          {/* Badge */}
          <div className="relative transform animate-bounce-gentle">
            <BadgeEmblem id={badge.id} />
            
            {/* Sparkle Effects */}
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full animate-sparkle"
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: `${20 + Math.random() * 60}%`,
                  animationDelay: `${i * 0.2}s`
                }}
              />
            ))}
          </div>
        </div>

        {/* Badge Info */}
        <div className="space-y-4 max-w-lg mx-auto px-8">
          <div className={`text-6xl font-black tracking-tight ${text} animate-text-glow`}>
            BADGE EARNED!
          </div>
          
          <div className="space-y-2">
            <h2 className="text-4xl font-bold text-white animate-slide-up">
              {badge.name}
            </h2>
            <p className="text-xl text-gray-300 animate-slide-up animation-delay-200">
              {badge.description}
            </p>
          </div>

          {/* Rarity & Points */}
          <div className="flex items-center justify-center gap-6 animate-slide-up animation-delay-400">
            <div className={`px-4 py-2 rounded-full bg-gradient-to-r ${ring} text-black font-bold text-lg`}>
              {badge.rarity.toUpperCase()}
            </div>
            <div className="text-2xl font-bold text-green-400">
              +{points || badge.pointsValue} pts
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-8 animate-slide-up animation-delay-600">
            <div className="w-80 h-2 bg-gray-700 rounded-full mx-auto overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${ring} transition-all duration-100 ease-linear rounded-full`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-sm text-gray-400 mt-2">
              Auto-closing in {Math.ceil((100 - progress) / 25)} seconds...
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes float-particle {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.7; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
        }
        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-10px) scale(1.05); }
        }
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1); }
        }
        @keyframes text-glow {
          0%, 100% { text-shadow: 0 0 20px currentColor; }
          50% { text-shadow: 0 0 30px currentColor, 0 0 40px currentColor; }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.9; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .animate-float-particle { animation: float-particle 4s ease-in-out infinite; }
        .animate-bounce-gentle { animation: bounce-gentle 2s ease-in-out infinite; }
        .animate-sparkle { animation: sparkle 1.5s ease-in-out infinite; }
        .animate-text-glow { animation: text-glow 2s ease-in-out infinite; }
        .animate-slide-up { animation: slide-up 0.6s ease-out; }
        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
        
        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-400 { animation-delay: 0.4s; }
        .animation-delay-600 { animation-delay: 0.6s; }

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
