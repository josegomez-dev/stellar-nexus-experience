'use client';

import React, { useState, useEffect } from 'react';
import { Badge } from '@/contexts/AuthContext';

interface BadgeNotificationProps {
  badge: Badge;
  onClose: () => void;
}

export const BadgeNotification: React.FC<BadgeNotificationProps> = ({ badge, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [animationPhase, setAnimationPhase] = useState<'enter' | 'show' | 'exit'>('enter');

  useEffect(() => {
    // Start animation sequence
    setIsVisible(true);
    
    const enterTimer = setTimeout(() => {
      setAnimationPhase('show');
    }, 100);

    const exitTimer = setTimeout(() => {
      setAnimationPhase('exit');
    }, 4000);

    const closeTimer = setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 5000);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(exitTimer);
      clearTimeout(closeTimer);
    };
  }, [onClose]);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return 'from-yellow-500 to-orange-500';
      case 'epic':
        return 'from-purple-500 to-pink-500';
      case 'rare':
        return 'from-blue-500 to-cyan-500';
      case 'common':
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return 'shadow-yellow-500/50';
      case 'epic':
        return 'shadow-purple-500/50';
      case 'rare':
        return 'shadow-blue-500/50';
      case 'common':
      default:
        return 'shadow-gray-500/50';
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] max-w-sm">
      <div
        className={`transform transition-all duration-500 ease-out ${
          animationPhase === 'enter'
            ? 'translate-x-full opacity-0'
            : animationPhase === 'show'
            ? 'translate-x-0 opacity-100'
            : 'translate-x-full opacity-0'
        }`}
      >
        <div className={`bg-gradient-to-r ${getRarityColor(badge.rarity)} rounded-2xl border-2 border-white/20 shadow-2xl ${getRarityGlow(badge.rarity)} overflow-hidden`}>
          {/* Animated background */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-2 left-1/4 w-1 h-1 bg-white rounded-full animate-ping opacity-70"></div>
            <div
              className="absolute top-4 right-1/3 w-1 h-1 bg-white rounded-full animate-ping opacity-80"
              style={{ animationDelay: '0.5s' }}
            ></div>
            <div
              className="absolute bottom-2 left-1/3 w-1 h-1 bg-white rounded-full animate-ping opacity-60"
              style={{ animationDelay: '1s' }}
            ></div>
          </div>

          <div className="relative z-10 p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="text-2xl animate-bounce">{badge.icon}</div>
                <div>
                  <h3 className="text-white font-bold text-sm">Badge Earned!</h3>
                  <p className="text-white/80 text-xs">Congratulations!</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1 text-white/60 hover:text-white/80 hover:bg-white/10 rounded transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Badge Info */}
            <div className="mb-3">
              <h4 className="text-white font-semibold text-base mb-1">{badge.name}</h4>
              <p className="text-white/90 text-sm">{badge.description}</p>
            </div>

            {/* Rarity Badge */}
            <div className="flex items-center justify-between">
              <div className={`px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white border border-white/30`}>
                {badge.rarity.charAt(0).toUpperCase() + badge.rarity.slice(1)}
              </div>
              <div className="text-white/70 text-xs">
                Earned: {new Date(badge.earnedAt).toLocaleTimeString()}
              </div>
            </div>

            {/* Confetti effect */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute top-0 left-1/4 w-1 h-1 bg-white rounded-full animate-ping opacity-60"></div>
              <div
                className="absolute top-2 right-1/3 w-1 h-1 bg-white rounded-full animate-ping opacity-70"
                style={{ animationDelay: '0.3s' }}
              ></div>
              <div
                className="absolute bottom-1 left-1/3 w-1 h-1 bg-white rounded-full animate-ping opacity-50"
                style={{ animationDelay: '0.6s' }}
              ></div>
              <div
                className="absolute bottom-3 right-1/4 w-1 h-1 bg-white rounded-full animate-ping opacity-80"
                style={{ animationDelay: '0.9s' }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
