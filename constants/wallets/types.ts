// Wallet Configuration Constants
export const WALLET_TYPES = {
  FREIGHTER: 'freighter',
  ALBEDO: 'albedo',
  XBULL: 'xbull',
  UNKNOWN: 'unknown',
} as const;

export type WalletType = typeof WALLET_TYPES[keyof typeof WALLET_TYPES];

// Supported Wallet Information
export const SUPPORTED_WALLETS = [
  {
    id: WALLET_TYPES.FREIGHTER,
    name: 'Freighter',
    type: WALLET_TYPES.FREIGHTER,
    icon: '🦝',
    url: 'https://freighter.app',
    description: 'Browser extension wallet for Stellar',
  },
  {
    id: WALLET_TYPES.ALBEDO,
    name: 'Albedo',
    type: WALLET_TYPES.ALBEDO,
    icon: '🌅',
    url: 'https://albedo.link/',
    description: 'Web-based wallet for Stellar',
  },
  {
    id: WALLET_TYPES.XBULL,
    name: 'xBull',
    type: WALLET_TYPES.XBULL,
    icon: '🐂',
    url: 'https://xbull.app/',
    description: 'Mobile wallet for Stellar',
  },
] as const;

// Wallet Connection States
export const WALLET_STATES = {
  DISCONNECTED: 'disconnected',
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  ERROR: 'error',
} as const;

export type WalletState = typeof WALLET_STATES[keyof typeof WALLET_STATES];

// Wallet Error Messages
export const WALLET_ERRORS = {
  NOT_INSTALLED: 'Wallet not installed',
  USER_REJECTED: 'User rejected connection',
  NETWORK_MISMATCH: 'Network mismatch',
  UNKNOWN_ERROR: 'Unknown error occurred',
  CONNECTION_FAILED: 'Connection failed',
} as const;
