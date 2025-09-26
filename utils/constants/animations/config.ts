// Animation Constants and Configuration
export const ANIMATION_CONSTANTS = {
  // Animation Durations
  DURATION: {
    FAST: '150ms',
    NORMAL: '300ms',
    SLOW: '500ms',
    VERY_SLOW: '1000ms',
    EXTRA_SLOW: '2000ms',
  },

  // Animation Easing Functions
  EASING: {
    LINEAR: 'linear',
    EASE_IN: 'ease-in',
    EASE_OUT: 'ease-out',
    EASE_IN_OUT: 'ease-in-out',
    CUBIC_BEZIER: 'cubic-bezier(0.4, 0, 0.2, 1)',
    BOUNCE: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },

  // Keyframe Animations
  KEYFRAMES: {
    FADE_IN: {
      '0%': { opacity: '0' },
      '100%': { opacity: '1' },
    },
    FADE_OUT: {
      '0%': { opacity: '1' },
      '100%': { opacity: '0' },
    },
    SLIDE_UP: {
      '0%': { transform: 'translateY(100%)', opacity: '0' },
      '100%': { transform: 'translateY(0)', opacity: '1' },
    },
    SLIDE_DOWN: {
      '0%': { transform: 'translateY(-100%)', opacity: '0' },
      '100%': { transform: 'translateY(0)', opacity: '1' },
    },
    BOUNCE_GENTLE: {
      '0%, 100%': { transform: 'translateY(0px)' },
      '50%': { transform: 'translateY(-10px)' },
    },
    FLOAT_SLOW: {
      '0%, 100%': { transform: 'translateY(0px)' },
      '50%': { transform: 'translateY(-8px)' },
    },
    FLOAT_SLOWER: {
      '0%, 100%': { transform: 'translateY(0px)' },
      '50%': { transform: 'translateY(6px)' },
    },
    SPIN_SLOW: {
      '0%': { transform: 'rotate(0deg)' },
      '100%': { transform: 'rotate(360deg)' },
    },
    PULSE_SLOW: {
      '0%, 100%': { opacity: '0.6' },
      '50%': { opacity: '0.9' },
    },
    SPARKLE: {
      '0%': { opacity: '0', transform: 'scale(0)' },
      '50%': { opacity: '1', transform: 'scale(1)' },
      '100%': { opacity: '0', transform: 'scale(0)' },
    },
  },

  // Animation Delays
  DELAY: {
    NONE: '0ms',
    SHORT: '100ms',
    MEDIUM: '200ms',
    LONG: '300ms',
    EXTRA_LONG: '500ms',
  },

  // Animation Classes (Tailwind CSS compatible)
  CLASSES: {
    FADE_IN: 'animate-fade-in',
    FADE_OUT: 'animate-fade-out',
    SLIDE_UP: 'animate-slide-up',
    SLIDE_DOWN: 'animate-slide-down',
    BOUNCE_GENTLE: 'animate-bounce-gentle',
    FLOAT_SLOW: 'animate-float-slow',
    FLOAT_SLOWER: 'animate-float-slower',
    SPIN_SLOW: 'animate-spin-slow',
    PULSE_SLOW: 'animate-pulse-slow',
    SPARKLE: 'animate-sparkle',
  },
} as const;

// Animation Performance Settings
export const ANIMATION_PERFORMANCE = {
  REDUCE_MOTION: 'prefers-reduced-motion: reduce',
  GPU_ACCELERATION: 'transform3d(0,0,0)',
  WILL_CHANGE: 'will-change: transform, opacity',
} as const;
