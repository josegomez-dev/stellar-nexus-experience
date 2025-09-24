// Network Configuration Constants
export const NETWORKS = {
  TESTNET: 'TESTNET',
  MAINNET: 'PUBLIC',
} as const;

export type NetworkType = typeof NETWORKS[keyof typeof NETWORKS];

// Network Passphrases
export const NETWORK_PASSPHRASES = {
  TESTNET: 'Test SDF Network ; September 2015',
  MAINNET: 'Public Global Stellar Network ; September 2015',
} as const;

// Network Configuration Objects
export const NETWORK_CONFIGS = {
  TESTNET: {
    network: NETWORKS.TESTNET,
    passphrase: NETWORK_PASSPHRASES.TESTNET,
    horizonUrl: 'https://horizon-testnet.stellar.org',
    isMainnet: false,
  },
  MAINNET: {
    network: NETWORKS.MAINNET,
    passphrase: NETWORK_PASSPHRASES.MAINNET,
    horizonUrl: 'https://horizon.stellar.org',
    isMainnet: true,
  },
} as const;

// Default Network Selection
export const DEFAULT_NETWORK = NETWORKS.TESTNET;

// Network Display Names
export const NETWORK_DISPLAY_NAMES = {
  [NETWORKS.TESTNET]: 'Stellar Testnet',
  [NETWORKS.MAINNET]: 'Stellar Mainnet',
} as const;
