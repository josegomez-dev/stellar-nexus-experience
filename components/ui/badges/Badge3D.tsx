import React, { useRef, useState } from 'react';
// Removed badge-config import - using inline rarity config
import { Badge } from '@/contexts/auth/AuthContext';
import { BadgeEmblem } from './BadgeEmblem';

// Extend Badge interface to include earningPoints
interface BadgeWithPoints extends Badge {
  earningPoints: number;
}

// Custom hook for 3D tilt effect
function useTilt() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [transform, setTransform] = useState<string>('perspective(900px) rotateX(0) rotateY(0)');

  function onMouseMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width; // 0..1
    const py = (e.clientY - rect.top) / rect.height; // 0..1
    const tiltX = (py - 0.5) * -14; // degrees
    const tiltY = (px - 0.5) * 14;
    setTransform(`perspective(900px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`);
  }

  function onMouseLeave() {
    setTransform('perspective(900px) rotateX(0) rotateY(0)');
  }

  return { ref, transform, onMouseMove, onMouseLeave };
}

// Using the centralized BadgeEmblem component for consistent SVG icons

// 3D Badge Card Component

interface Badge3DProps {
  badge: BadgeWithPoints & { isEarned?: boolean };
  size?: 'sm' | 'md' | 'lg';
  compact?: boolean;
}

export const Badge3D: React.FC<Badge3DProps> = ({ badge, size = 'md', compact = false }) => {
  // Inline rarity config
  const getRarityConfig = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return { color: 'gray', glow: 'shadow-gray-400/20' };
      case 'rare':
        return { color: 'blue', glow: 'shadow-blue-400/20' };
      case 'epic':
        return { color: 'purple', glow: 'shadow-purple-400/20' };
      case 'legendary':
        return { color: 'orange', glow: 'shadow-orange-400/20' };
      default:
        return { color: 'gray', glow: 'shadow-gray-400/20' };
    }
  };

  const rarityConfig = getRarityConfig(badge.rarity);
  const { ref, transform, onMouseLeave, onMouseMove } = useTilt();

  // Create custom badge-specific colors
  const getBadgeStyles = (badgeId: string) => {
    switch (badgeId) {
      case 'welcome_explorer':
        return {
          ring: 'from-gray-400 to-gray-600',
          glow: 'shadow-gray-400/20',
          text: 'text-gray-400',
        };
      case 'escrow-expert':
        return {
          ring: 'from-blue-400 to-blue-600',
          glow: 'shadow-blue-400/20',
          text: 'text-blue-400',
        };
      case 'trust-guardian':
        return {
          ring: 'from-orange-400 to-yellow-500',
          glow: 'shadow-orange-400/20',
          text: 'text-orange-400',
        };
      case 'stellar-champion':
        return {
          ring: 'from-pink-400 to-rose-500',
          glow: 'shadow-pink-400/20',
          text: 'text-pink-400',
        };
      case 'nexus-master':
        return {
          ring: 'from-green-400 to-emerald-500',
          glow: 'shadow-green-400/20',
          text: 'text-green-400',
        };
      default:
        return {
          ring: 'from-gray-400 to-gray-600',
          glow: 'shadow-gray-400/20',
          text: 'text-gray-400',
        };
    }
  };

  const { ring, glow, text } = getBadgeStyles(badge.id);
  const rarityLabel = badge.rarity.toUpperCase();

  if (compact) {
    return (
      <div className={`relative group select-none ${badge.isEarned ? '' : 'opacity-50 grayscale'}`}>
        {/* Compact version for smaller displays */}
        <div
          className={`relative rounded-xl bg-white/5 border border-white/10 backdrop-blur-xl p-3 ${badge.isEarned ? glow : ''}`}
        >
          <div className='flex items-center gap-3'>
            <BadgeEmblem id={badge.id} size='sm' />
            <div className='min-w-0 flex-1'>
              <h4 className={`font-medium text-sm ${badge.isEarned ? text : 'text-gray-400'}`}>
                {badge.name}
              </h4>
              <p className={`text-xs ${badge.isEarned ? 'text-white/60' : 'text-gray-500'}`}>
                +{badge.earningPoints} pts
              </p>
            </div>
            {!badge.isEarned && <div className='text-gray-400 text-xs'>🔒</div>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={`relative group select-none [transform-style:preserve-3d] ${badge.isEarned ? glow : 'opacity-50 grayscale'}`}
      style={{ transform, transition: 'transform 300ms cubic-bezier(.2,.8,.2,1)' }}
    >
      {/* Outer holo ring */}
      {badge.isEarned && (
        <div
          className={`absolute -inset-0.5 rounded-2xl bg-gradient-to-tr ${ring} opacity-80 blur-sm group-hover:opacity-100 transition-opacity`}
        />
      )}

      {/* Card */}
      <div className='relative rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-5 overflow-hidden'>
        {/* Holographic sheen - only for earned badges */}
        {badge.isEarned && (
          <div
            className='pointer-events-none absolute -inset-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500'
            aria-hidden
          >
            <div className='absolute -inset-1 [background:conic-gradient(from_0deg,rgba(255,255,255,.08),rgba(255,255,255,0)_30%,rgba(255,255,255,.08)_60%,rgba(255,255,255,0)_90%)] animate-spin-slow' />
          </div>
        )}

        {/* Floating particles - only for earned badges */}
        {badge.isEarned && (
          <div
            className='pointer-events-none absolute inset-0 mix-blend-screen opacity-70'
            aria-hidden
          >
            <div className='absolute w-40 h-40 -top-10 -left-10 bg-cyan-400/20 rounded-full blur-3xl animate-float-slow' />
            <div className='absolute w-40 h-40 -bottom-10 -right-10 bg-fuchsia-400/20 rounded-full blur-3xl animate-float-slower' />
          </div>
        )}

        {/* Lock overlay for unearned badges */}
        {!badge.isEarned && (
          <div className='absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl'>
            <div className='text-4xl text-gray-400'>🔒</div>
          </div>
        )}

        {/* Emblem + title */}
        <div className='relative z-10 flex items-center gap-4'>
          <div className='shrink-0'>
            <BadgeEmblem id={badge.id} size={size} />
          </div>
          <div className='min-w-0'>
            <h3
              className={`text-lg font-semibold tracking-tight ${badge.isEarned ? text : 'text-gray-400'}`}
            >
              {badge.name}
            </h3>
            <p
              className={`text-sm leading-snug ${badge.isEarned ? 'text-white/70' : 'text-gray-500'}`}
            >
              {badge.description}
            </p>
          </div>
        </div>

        {/* Meta */}
        <div className='relative z-10 mt-4 grid grid-cols-3 gap-2 text-xs text-white/80'>
          <div className='rounded-lg bg-white/5 px-2 py-1 border border-white/10'>
            {rarityLabel}
          </div>
          <div className='rounded-lg bg-white/5 px-2 py-1 border border-white/10 text-center'>
            {badge.earningPoints} pts
          </div>
          <div className='rounded-lg bg-white/5 px-2 py-1 border border-white/10 text-right capitalize'>
            {badge.category}
          </div>
        </div>

        {/* Requirement */}
        <div className='relative z-10 mt-3 text-xs text-white/70'>
          <span className='opacity-80'>{badge.isEarned ? 'Earned: ' : 'Unlock: '}</span>
          <span className='font-medium'>Complete demo</span>
        </div>

        {/* Shine sweep - only for earned badges */}
        {badge.isEarned && (
          <div className='pointer-events-none absolute -inset-1 opacity-0 group-hover:opacity-100 [mask-image:radial-gradient(transparent,black)]'>
            <div className='absolute inset-0 -skew-y-6 translate-x-[-120%] group-hover:translate-x-[120%] transition-transform duration-[1800ms] ease-out bg-gradient-to-r from-transparent via-white/20 to-transparent' />
          </div>
        )}
      </div>
    </div>
  );
};

// CSS animations - add this to your global styles or include in the component
export const Badge3DStyles = () => (
  <style jsx global>{`
    @media (prefers-reduced-motion: reduce) {
      .animate-spin-slow,
      .animate-float-slow,
      .animate-float-slower {
        animation: none !important;
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
    @keyframes float-slow {
      0%,
      100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-8px);
      }
    }
    @keyframes float-slower {
      0%,
      100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(6px);
      }
    }
    .animate-spin-slow {
      animation: spin-slow 18s linear infinite;
    }
    .animate-float-slow {
      animation: float-slow 6s ease-in-out infinite;
    }
    .animate-float-slower {
      animation: float-slower 7.5s ease-in-out infinite;
    }
  `}</style>
);

export default Badge3D;
