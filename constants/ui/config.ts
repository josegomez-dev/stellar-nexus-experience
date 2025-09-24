// UI Constants and Configuration
export const UI_CONSTANTS = {
  // Animation Durations (in milliseconds)
  ANIMATION_DURATION: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
    VERY_SLOW: 1000,
  },

  // Z-Index Layers
  Z_INDEX: {
    DROPDOWN: 50,
    MODAL: 9999,
    TOOLTIP: 100,
    HEADER: 10,
    SIDEBAR: 20,
  },

  // Breakpoints (matching Tailwind CSS)
  BREAKPOINTS: {
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
    '2XL': 1536,
  },

  // Component Sizes
  SIZES: {
    AVATAR: {
      SM: 'w-8 h-8',
      MD: 'w-10 h-10',
      LG: 'w-12 h-12',
      XL: 'w-16 h-16',
    },
    BUTTON: {
      SM: 'px-3 py-1.5 text-sm',
      MD: 'px-4 py-2 text-base',
      LG: 'px-6 py-3 text-lg',
    },
  },

  // Color Schemes
  COLORS: {
    PRIMARY: 'brand',
    SECONDARY: 'accent',
    SUCCESS: 'green',
    WARNING: 'yellow',
    ERROR: 'red',
    INFO: 'blue',
  },

  // Spacing Scale
  SPACING: {
    XS: '0.5rem',
    SM: '1rem',
    MD: '1.5rem',
    LG: '2rem',
    XL: '3rem',
  },
} as const;

// Toast Configuration
export const TOAST_CONFIG = {
  DURATION: {
    SHORT: 3000,
    MEDIUM: 5000,
    LONG: 8000,
  },
  POSITION: {
    TOP_RIGHT: 'top-right',
    TOP_LEFT: 'top-left',
    BOTTOM_RIGHT: 'bottom-right',
    BOTTOM_LEFT: 'bottom-left',
  },
} as const;

// Modal Configuration
export const MODAL_CONFIG = {
  BACKDROP_BLUR: 'backdrop-blur-sm',
  TRANSITION_DURATION: 300,
  MAX_WIDTH: {
    SM: 'max-w-sm',
    MD: 'max-w-md',
    LG: 'max-w-lg',
    XL: 'max-w-xl',
    '2XL': 'max-w-2xl',
  },
} as const;
