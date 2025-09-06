import React, { useRef, useState } from "react";
import { BadgeConfig, rarityStyles } from "@/lib/badge-config";

// Custom hook for 3D tilt effect
function useTilt() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [transform, setTransform] = useState<string>("perspective(900px) rotateX(0) rotateY(0)");

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
    setTransform("perspective(900px) rotateX(0) rotateY(0)");
  }

  return { ref, transform, onMouseMove, onMouseLeave };
}

// Badge SVG emblems
const BadgeEmblem: React.FC<{ id: string; size?: 'sm' | 'md' | 'lg' }> = ({ id, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-20 h-20'
  };

  const sizeClass = sizeClasses[size];

  switch (id) {
    case "trust-guardian":
      return (
        <svg viewBox="0 0 64 64" className={`${sizeClass} drop-shadow`}>
          <defs>
            <linearGradient id={`g1-${id}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#00E5FF" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
          <path d="M32 4l20 8v14c0 14-9.2 26.7-20 34-10.8-7.3-20-20-20-34V12l20-8z" fill={`url(#g1-${id})`} opacity="0.85" />
          <path d="M22 30l8 8 12-12" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "escrow-expert":
      return (
        <svg viewBox="0 0 64 64" className={sizeClass}>
          <defs>
            <linearGradient id={`g2-${id}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#67e8f9" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
          <circle cx="32" cy="32" r="26" fill={`url(#g2-${id})`} opacity="0.9" />
          <path d="M18 28h28v8H18z" fill="#0ea5e9" opacity="0.8" />
          <path d="M22 22h20v6H22zM22 36h20v6H22z" fill="#fff" opacity="0.9" />
        </svg>
      );
    case "blockchain-pioneer":
      return (
        <svg viewBox="0 0 64 64" className={sizeClass}>
          <defs>
            <linearGradient id={`g3-${id}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#c084fc" />
              <stop offset="100%" stopColor="#818cf8" />
            </linearGradient>
          </defs>
          <path d="M32 6l18 10v20L32 56 14 36V16z" fill={`url(#g3-${id})`} opacity="0.9" />
          <g stroke="#fff" strokeWidth="3" opacity="0.95" strokeLinecap="round">
            <path d="M22 24h20" />
            <path d="M22 32h20" />
            <path d="M22 40h20" />
          </g>
        </svg>
      );
    case "dispute-detective":
      return (
        <svg viewBox="0 0 64 64" className={sizeClass}>
          <defs>
            <linearGradient id={`g4-${id}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#a78bfa" />
              <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>
          </defs>
          <circle cx="28" cy="28" r="16" fill={`url(#g4-${id})`} opacity="0.9" />
          <path d="M40 40l10 10" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
          <path d="M24 28h8M28 24v8" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case "gig-economy-guru":
      return (
        <svg viewBox="0 0 64 64" className={sizeClass}>
          <defs>
            <linearGradient id={`g5-${id}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fde68a" />
              <stop offset="100%" stopColor="#fb923c" />
            </linearGradient>
          </defs>
          <path d="M8 44h48l-6 10H14z" fill="#fdba74" opacity="0.95" />
          <rect x="12" y="12" width="40" height="30" rx="6" fill={`url(#g5-${id})`} />
          <path d="M20 20h24M20 28h24M20 36h14" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case "stellar-champion":
      return (
        <svg viewBox="0 0 64 64" className={sizeClass}>
          <defs>
            <radialGradient id={`g6-${id}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fff7ed" />
              <stop offset="55%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#fb7185" />
            </radialGradient>
          </defs>
          <path d="M12 52l20-40 20 40H12z" fill={`url(#g6-${id})`} opacity="0.95" />
          <circle cx="32" cy="28" r="8" fill="#fff" opacity="0.95" />
          <path d="M32 18v20M22 28h20" stroke="#f59e0b" strokeWidth="3" />
        </svg>
      );
    default:
      return (
        <div className={`${sizeClass} bg-gray-600 rounded-full flex items-center justify-center text-white text-2xl`}>
          🏆
        </div>
      );
  }
};

// 3D Badge Card Component
interface Badge3DProps {
  badge: BadgeConfig & { isEarned?: boolean };
  size?: 'sm' | 'md' | 'lg';
  compact?: boolean;
}

export const Badge3D: React.FC<Badge3DProps> = ({ badge, size = 'md', compact = false }) => {
  const { ring, glow, text } = rarityStyles[badge.rarity];
  const { ref, transform, onMouseLeave, onMouseMove } = useTilt();

  const rarityLabel = badge.rarity.toUpperCase();
  
  if (compact) {
    return (
      <div
        className={`relative group select-none ${badge.isEarned ? '' : 'opacity-50 grayscale'}`}
      >
        {/* Compact version for smaller displays */}
        <div className={`relative rounded-xl bg-white/5 border border-white/10 backdrop-blur-xl p-3 ${badge.isEarned ? glow : ''}`}>
          <div className="flex items-center gap-3">
            <BadgeEmblem id={badge.id} size="sm" />
            <div className="min-w-0 flex-1">
              <h4 className={`font-medium text-sm ${badge.isEarned ? text : 'text-gray-400'}`}>
                {badge.name}
              </h4>
              <p className={`text-xs ${badge.isEarned ? 'text-white/60' : 'text-gray-500'}`}>
                +{badge.pointsValue} pts
              </p>
            </div>
            {!badge.isEarned && (
              <div className="text-gray-400 text-xs">🔒</div>
            )}
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
      style={{ transform, transition: "transform 300ms cubic-bezier(.2,.8,.2,1)" }}
    >
      {/* Outer holo ring */}
      {badge.isEarned && (
        <div className={`absolute -inset-0.5 rounded-2xl bg-gradient-to-tr ${ring} opacity-80 blur-sm group-hover:opacity-100 transition-opacity`} />
      )}

      {/* Card */}
      <div className="relative rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-5 overflow-hidden">
        {/* Holographic sheen - only for earned badges */}
        {badge.isEarned && (
          <div className="pointer-events-none absolute -inset-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden>
            <div className="absolute -inset-1 [background:conic-gradient(from_0deg,rgba(255,255,255,.08),rgba(255,255,255,0)_30%,rgba(255,255,255,.08)_60%,rgba(255,255,255,0)_90%)] animate-spin-slow" />
          </div>
        )}

        {/* Floating particles - only for earned badges */}
        {badge.isEarned && (
          <div className="pointer-events-none absolute inset-0 mix-blend-screen opacity-70" aria-hidden>
            <div className="absolute w-40 h-40 -top-10 -left-10 bg-cyan-400/20 rounded-full blur-3xl animate-float-slow" />
            <div className="absolute w-40 h-40 -bottom-10 -right-10 bg-fuchsia-400/20 rounded-full blur-3xl animate-float-slower" />
          </div>
        )}

        {/* Lock overlay for unearned badges */}
        {!badge.isEarned && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl">
            <div className="text-4xl text-gray-400">🔒</div>
          </div>
        )}

        {/* Emblem + title */}
        <div className="relative z-10 flex items-center gap-4">
          <div className="shrink-0">
            <BadgeEmblem id={badge.id} size={size} />
          </div>
          <div className="min-w-0">
            <h3 className={`text-lg font-semibold tracking-tight ${badge.isEarned ? text : 'text-gray-400'}`}>
              {badge.name}
            </h3>
            <p className={`text-sm leading-snug ${badge.isEarned ? 'text-white/70' : 'text-gray-500'}`}>
              {badge.description}
            </p>
          </div>
        </div>

        {/* Meta */}
        <div className="relative z-10 mt-4 grid grid-cols-3 gap-2 text-xs text-white/80">
          <div className="rounded-lg bg-white/5 px-2 py-1 border border-white/10">{rarityLabel}</div>
          <div className="rounded-lg bg-white/5 px-2 py-1 border border-white/10 text-center">{badge.pointsValue} pts</div>
          <div className="rounded-lg bg-white/5 px-2 py-1 border border-white/10 text-right capitalize">{badge.category}</div>
        </div>

        {/* Requirement */}
        <div className="relative z-10 mt-3 text-xs text-white/70">
          <span className="opacity-80">
            {badge.isEarned ? 'Earned: ' : 'Unlock: '}
          </span>
          <span className="font-medium">{badge.requirement}</span>
        </div>

        {/* Shine sweep - only for earned badges */}
        {badge.isEarned && (
          <div className="pointer-events-none absolute -inset-1 opacity-0 group-hover:opacity-100 [mask-image:radial-gradient(transparent,black)]">
            <div className="absolute inset-0 -skew-y-6 translate-x-[-120%] group-hover:translate-x-[120%] transition-transform duration-[1800ms] ease-out bg-gradient-to-r from-transparent via-white/20 to-transparent" />
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
      .animate-spin-slow, .animate-float-slow, .animate-float-slower { animation: none !important; }
    }
    @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    @keyframes float-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
    @keyframes float-slower { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(6px); } }
    .animate-spin-slow { animation: spin-slow 18s linear infinite; }
    .animate-float-slow { animation: float-slow 6s ease-in-out infinite; }
    .animate-float-slower { animation: float-slower 7.5s ease-in-out infinite; }
  `}</style>
);

export default Badge3D;
