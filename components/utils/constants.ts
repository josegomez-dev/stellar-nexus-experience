// Animation durations
export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 1000,
} as const;

// Z-index values
export const Z_INDEX = {
  DROPDOWN: 50,
  MODAL: 100,
  TOOLTIP: 200,
  OVERLAY: 300,
  MAX: 9999,
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  DEMOS_PAGE_LOADED: 'demosPageLoaded',
  MINI_GAMES_PAGE_LOADED: 'miniGamesPageLoaded',
  DOCS_PAGE_LOADED: 'docsPageLoaded',
  DEMO_CLAPS: 'demoClaps',
  USER_CLAPPED: 'userClapped',
  DEMO_COMPLETIONS: 'demoCompletions',
  DEMO_FEEDBACK: 'demoFeedback',
  WALLET_PREFERENCES: 'walletPreferences',
  USER_SETTINGS: 'userSettings',
} as const;

// Demo configuration
export const DEMO_CONFIG = {
  DEFAULT_TIMEOUT: 30000,
  MAX_RETRIES: 3,
  PROGRESS_UPDATE_INTERVAL: 100,
} as const;

// UI Constants
export const UI_CONSTANTS = {
  MOBILE_BREAKPOINT: 768,
  TABLET_BREAKPOINT: 1024,
  DESKTOP_BREAKPOINT: 1280,
  MAX_CONTENT_WIDTH: 1200,
  HEADER_HEIGHT: 64,
  SIDEBAR_WIDTH: 320,
} as const;

// Network configuration
export const NETWORK_CONFIG = {
  TESTNET: 'TESTNET',
  PUBLICNET: 'PUBLICNET',
  DEFAULT_NETWORK: 'TESTNET',
} as const;

// Achievement types
export const ACHIEVEMENT_TYPES = {
  DEMO_COMPLETION: 'demo_completion',
  ESCROW_EXPERT: 'escrow_expert',
  STELLAR_CHAMPION: 'stellar_champion',
  TRUST_GUARDIAN: 'trust_guardian',
  THE_GEEK: 'the_geek',
  BLOCKCHAIN_PIONEER: 'blockchain_pioneer',
  DEFI_EXPLORER: 'defi_explorer',
  SMART_CONTRACT_MASTER: 'smart_contract_master',
  FIRST_TRANSACTION: 'first_transaction',
} as const;

// Points configuration
export const POINTS_CONFIG = {
  DEMO_COMPLETION: 100,
  ESCROW_EXPERT: 500,
  STELLAR_CHAMPION: 1000,
  TRUST_GUARDIAN: 2000,
  THE_GEEK_THRESHOLD: 100000,
} as const;

// Feature flags
export const FEATURE_FLAGS = {
  IMMERSIVE_DEMO: true,
  TECH_TREE: true,
  ACHIEVEMENTS: true,
  POINTS_SYSTEM: true,
  TUTORIAL_TTS: false,
} as const;

