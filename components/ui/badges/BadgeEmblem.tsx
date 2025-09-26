'use client';

import React from 'react';

interface BadgeEmblemProps {
  id: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const BadgeEmblem: React.FC<BadgeEmblemProps> = ({ id, size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const sizeClass = sizeClasses[size];

  switch (id) {
    case 'demo-completed-hello-milestone':
    case 'escrow-expert':
      return (
        <svg viewBox='0 0 64 64' className={`${sizeClass} ${className}`}>
          <defs>
            <linearGradient id={`g-escrow-${id}`} x1='0' y1='0' x2='1' y2='1'>
              <stop offset='0%' stopColor='#67e8f9' />
              <stop offset='100%' stopColor='#3b82f6' />
            </linearGradient>
          </defs>
          <circle cx='32' cy='32' r='26' fill={`url(#g-escrow-${id})`} opacity='0.9' />
          <path d='M18 28h28v8H18z' fill='#0ea5e9' opacity='0.8' />
          <path d='M22 22h20v6H22zM22 36h20v6H22z' fill='#fff' opacity='0.9' />
        </svg>
      );

    case 'demo-completed-dispute-resolution':
    case 'trust-guardian':
      return (
        <svg viewBox='0 0 64 64' className={`${sizeClass} ${className}`}>
          <defs>
            <linearGradient id={`g-trust-${id}`} x1='0' y1='0' x2='1' y2='1'>
              <stop offset='0%' stopColor='#00E5FF' />
              <stop offset='100%' stopColor='#06b6d4' />
            </linearGradient>
          </defs>
          <path
            d='M32 4l20 8v14c0 14-9.2 26.7-20 34-10.8-7.3-20-20-20-34V12l20-8z'
            fill={`url(#g-trust-${id})`}
            opacity='0.85'
          />
          <path
            d='M22 30l8 8 12-12'
            fill='none'
            stroke='#fff'
            strokeWidth='4'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      );

    case 'demo-completed-micro-marketplace':
    case 'stellar-champion':
      return (
        <svg viewBox='0 0 64 64' className={`${sizeClass} ${className}`}>
          <defs>
            <radialGradient id={`g-stellar-${id}`} cx='50%' cy='50%' r='50%'>
              <stop offset='0%' stopColor='#fff7ed' />
              <stop offset='55%' stopColor='#fbbf24' />
              <stop offset='100%' stopColor='#fb7185' />
            </radialGradient>
          </defs>
          <path d='M12 52l20-40 20 40H12z' fill={`url(#g-stellar-${id})`} opacity='0.95' />
          <circle cx='32' cy='28' r='8' fill='#fff' opacity='0.95' />
          <path d='M32 18v20M22 28h20' stroke='#f59e0b' strokeWidth='3' />
        </svg>
      );

    case 'nexus-master':
      return (
        <svg viewBox='0 0 64 64' className={`${sizeClass} ${className}`}>
          <defs>
            <linearGradient id={`g-nexus-${id}`} x1='0' y1='0' x2='1' y2='1'>
              <stop offset='0%' stopColor='#10b981' />
              <stop offset='100%' stopColor='#059669' />
            </linearGradient>
          </defs>
          <circle cx='32' cy='32' r='28' fill={`url(#g-nexus-${id})`} opacity='0.9' />
          <circle cx='32' cy='32' r='20' fill='#ffffff' opacity='0.1' />
          <path d='M32 8l6 18 18 6-18 6-6 18-6-18-18-6 18-6 6-18z' fill='#ffffff' opacity='0.9' />
          <circle cx='32' cy='32' r='4' fill='#ffffff' opacity='0.8' />
        </svg>
      );

    case 'milestone-first-completion':
      return (
        <svg viewBox='0 0 64 64' className={`${sizeClass} ${className}`}>
          <defs>
            <linearGradient id={`g-milestone-${id}`} x1='0' y1='0' x2='1' y2='1'>
              <stop offset='0%' stopColor='#fbbf24' />
              <stop offset='100%' stopColor='#f59e0b' />
            </linearGradient>
          </defs>
          <circle cx='32' cy='32' r='24' fill={`url(#g-milestone-${id})`} opacity='0.9' />
          <path d='M32 16l4 12 12 4-12 4-4 12-4-12-12-4 12-4 4-12z' fill='#fff' opacity='0.9' />
        </svg>
      );

    case 'milestone-ten-completions':
      return (
        <svg viewBox='0 0 64 64' className={`${sizeClass} ${className}`}>
          <defs>
            <linearGradient id={`g-target-${id}`} x1='0' y1='0' x2='1' y2='1'>
              <stop offset='0%' stopColor='#8b5cf6' />
              <stop offset='100%' stopColor='#7c3aed' />
            </linearGradient>
          </defs>
          <circle cx='32' cy='32' r='24' fill={`url(#g-target-${id})`} opacity='0.9' />
          <circle cx='32' cy='32' r='16' fill='none' stroke='#fff' strokeWidth='3' opacity='0.8' />
          <circle cx='32' cy='32' r='8' fill='#fff' opacity='0.9' />
          <circle cx='32' cy='32' r='3' fill={`url(#g-target-${id})`} />
        </svg>
      );

    case 'milestone-fifty-completions':
      return (
        <svg viewBox='0 0 64 64' className={`${sizeClass} ${className}`}>
          <defs>
            <linearGradient id={`g-crown-${id}`} x1='0' y1='0' x2='1' y2='1'>
              <stop offset='0%' stopColor='#fbbf24' />
              <stop offset='100%' stopColor='#f59e0b' />
            </linearGradient>
          </defs>
          <path d='M32 8l8 16 16 4-16 4-8 16-8-16-16-4 16-4 8-16z' fill={`url(#g-crown-${id})`} opacity='0.9' />
          <circle cx='32' cy='32' r='6' fill='#fff' opacity='0.9' />
          <path d='M20 44h24v8H20z' fill={`url(#g-crown-${id})`} opacity='0.8' />
        </svg>
      );

    case 'time-spent-one-hour':
      return (
        <svg viewBox='0 0 64 64' className={`${sizeClass} ${className}`}>
          <defs>
            <linearGradient id={`g-clock-${id}`} x1='0' y1='0' x2='1' y2='1'>
              <stop offset='0%' stopColor='#6b7280' />
              <stop offset='100%' stopColor='#4b5563' />
            </linearGradient>
          </defs>
          <circle cx='32' cy='32' r='24' fill={`url(#g-clock-${id})`} opacity='0.9' />
          <circle cx='32' cy='32' r='20' fill='none' stroke='#fff' strokeWidth='2' opacity='0.8' />
          <path d='M32 20v12l8 8' stroke='#fff' strokeWidth='3' strokeLinecap='round' />
        </svg>
      );

    case 'time-spent-ten-hours':
      return (
        <svg viewBox='0 0 64 64' className={`${sizeClass} ${className}`}>
          <defs>
            <linearGradient id={`g-hourglass-${id}`} x1='0' y1='0' x2='1' y2='1'>
              <stop offset='0%' stopColor='#8b5cf6' />
              <stop offset='100%' stopColor='#7c3aed' />
            </linearGradient>
          </defs>
          <path d='M20 8h24v8H20z' fill={`url(#g-hourglass-${id})`} opacity='0.9' />
          <path d='M20 48h24v8H20z' fill={`url(#g-hourglass-${id})`} opacity='0.9' />
          <path d='M20 16l12 12-12 12v8h24V40l-12-12 12-12V16H20z' fill='#fff' opacity='0.8' />
        </svg>
      );

    case 'level-five':
      return (
        <svg viewBox='0 0 64 64' className={`${sizeClass} ${className}`}>
          <defs>
            <linearGradient id={`g-star-${id}`} x1='0' y1='0' x2='1' y2='1'>
              <stop offset='0%' stopColor='#fbbf24' />
              <stop offset='100%' stopColor='#f59e0b' />
            </linearGradient>
          </defs>
          <path d='M32 8l6 18 18 6-18 6-6 18-6-18-18-6 18-6 6-18z' fill={`url(#g-star-${id})`} opacity='0.9' />
        </svg>
      );

    case 'level-ten':
      return (
        <svg viewBox='0 0 64 64' className={`${sizeClass} ${className}`}>
          <defs>
            <radialGradient id={`g-star-burst-${id}`} cx='50%' cy='50%' r='50%'>
              <stop offset='0%' stopColor='#fbbf24' />
              <stop offset='100%' stopColor='#f59e0b' />
            </radialGradient>
          </defs>
          <path d='M32 4l8 20 20 8-20 8-8 20-8-20-20-8 20-8 8-20z' fill={`url(#g-star-burst-${id})`} opacity='0.9' />
          <circle cx='32' cy='32' r='8' fill='#fff' opacity='0.9' />
        </svg>
      );

    case 'level-twenty':
      return (
        <svg viewBox='0 0 64 64' className={`${sizeClass} ${className}`}>
          <defs>
            <radialGradient id={`g-sparkle-${id}`} cx='50%' cy='50%' r='50%'>
              <stop offset='0%' stopColor='#a78bfa' />
              <stop offset='100%' stopColor='#8b5cf6' />
            </radialGradient>
          </defs>
          <circle cx='32' cy='32' r='24' fill={`url(#g-sparkle-${id})`} opacity='0.9' />
          <path d='M32 12l4 12 12 4-12 4-4 12-4-12-12-4 12-4 4-12z' fill='#fff' opacity='0.9' />
          <circle cx='32' cy='32' r='4' fill='#fff' opacity='0.8' />
        </svg>
      );

    case 'early-adopter':
      return (
        <svg viewBox='0 0 64 64' className={`${sizeClass} ${className}`}>
          <defs>
            <linearGradient id={`g-rocket-${id}`} x1='0' y1='0' x2='1' y2='1'>
              <stop offset='0%' stopColor='#ef4444' />
              <stop offset='100%' stopColor='#dc2626' />
            </linearGradient>
          </defs>
          <path d='M32 48l-8-8 8-8 8 8-8 8z' fill={`url(#g-rocket-${id})`} opacity='0.9' />
          <path d='M32 32l-4-12 4-12 4 12-4 12z' fill='#fff' opacity='0.9' />
          <circle cx='32' cy='20' r='4' fill={`url(#g-rocket-${id})`} />
        </svg>
      );

    case 'perfect-score':
      return (
        <svg viewBox='0 0 64 64' className={`${sizeClass} ${className}`}>
          <defs>
            <linearGradient id={`g-perfect-${id}`} x1='0' y1='0' x2='1' y2='1'>
              <stop offset='0%' stopColor='#10b981' />
              <stop offset='100%' stopColor='#059669' />
            </linearGradient>
          </defs>
          <circle cx='32' cy='32' r='24' fill={`url(#g-perfect-${id})`} opacity='0.9' />
          <path d='M24 32l6 6 12-12' fill='none' stroke='#fff' strokeWidth='4' strokeLinecap='round' strokeLinejoin='round' />
          <text x='32' y='52' textAnchor='middle' fill='#fff' fontSize='16' fontWeight='bold'>100</text>
        </svg>
      );

    case 'welcome_explorer':
      return (
        <svg viewBox='0 0 64 64' className={`${sizeClass} ${className}`}>
          <defs>
            <radialGradient id={`g-welcome-${id}`} cx='50%' cy='50%' r='50%'>
              <stop offset='0%' stopColor='#fbbf24' />
              <stop offset='100%' stopColor='#f59e0b' />
            </radialGradient>
          </defs>
          <path d='M32 8l8 20 20 8-20 8-8 20-8-20-20-8 20-8 8-20z' fill={`url(#g-welcome-${id})`} opacity='0.9' />
          <circle cx='32' cy='32' r='8' fill='#fff' opacity='0.9' />
        </svg>
      );

    default:
      return (
        <div className={`${sizeClass} bg-gray-600 rounded-full flex items-center justify-center text-white text-xs ${className}`}>
          🏆
        </div>
      );
  }
};
