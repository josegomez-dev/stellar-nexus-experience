'use client';

import React from 'react';
import { getBadgeIcon, BADGE_SIZES } from '@/utils/constants/badges/assets';

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

  // Use the centralized SVG icons from the constants file
  const svgIcon = getBadgeIcon(id, sizeClass);
  
  if (svgIcon) {
    return (
      <div className={className}>
        {svgIcon}
      </div>
    );
  }

  // Fallback for unknown badges
  return (
    <div
      className={`${sizeClass} bg-gray-600 rounded-full flex items-center justify-center text-white text-xs ${className}`}
    >
      🏆
    </div>
  );
};
