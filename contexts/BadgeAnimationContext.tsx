'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { BadgeConfig } from '@/lib/badge-config';
import { BadgeEarnedAnimation } from '@/components/ui/BadgeEarnedAnimation';

interface BadgeAnimationState {
  badge: BadgeConfig;
  points?: number;
}

interface BadgeAnimationContextType {
  showBadgeAnimation: (badge: BadgeConfig, points?: number) => void;
  isAnimationVisible: boolean;
}

const BadgeAnimationContext = createContext<BadgeAnimationContextType | undefined>(undefined);

export const useBadgeAnimation = () => {
  const context = useContext(BadgeAnimationContext);
  if (!context) {
    // During SSR or if provider is missing, return a no-op function
    return {
      showBadgeAnimation: () => {
        console.warn('useBadgeAnimation: BadgeAnimationProvider not found, badge animation skipped');
      }
    };
  }
  return context;
};

interface BadgeAnimationProviderProps {
  children: ReactNode;
}

export const BadgeAnimationProvider: React.FC<BadgeAnimationProviderProps> = ({ children }) => {
  const [animationState, setAnimationState] = useState<BadgeAnimationState | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const showBadgeAnimation = (badge: BadgeConfig, points?: number) => {
    setAnimationState({ badge, points });
    setIsVisible(true);
  };

  const handleAnimationComplete = () => {
    setIsVisible(false);
    setTimeout(() => {
      setAnimationState(null);
    }, 100);
  };

  return (
    <BadgeAnimationContext.Provider 
      value={{ 
        showBadgeAnimation, 
        isAnimationVisible: isVisible 
      }}
    >
      {children}
      
      {/* Badge Animation Overlay */}
      {animationState && (
        <BadgeEarnedAnimation
          badge={animationState.badge}
          isVisible={isVisible}
          onComplete={handleAnimationComplete}
          points={animationState.points}
        />
      )}
    </BadgeAnimationContext.Provider>
  );
};

export default BadgeAnimationProvider;
