// Mock Data Constants for Development and Testing
export const MOCK_DATA = {
  // Test Wallet Addresses
  WALLET_ADDRESSES: {
    TEST_BUYER: 'GABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890',
    TEST_SELLER: 'GZYXWVUTSRQPONMLKJIHGFEDCBA0987654321ZYXWVUTSRQPONMLKJIHGFEDCBA0987654321',
    TEST_ARBITER: 'G1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  },

  // Mock Transaction Data
  TRANSACTIONS: {
    SAMPLE_HASH: 'tx_sample_hash_1234567890abcdef',
    SAMPLE_CONTRACT_ID: 'contract_sample_1234567890abcdef',
    SAMPLE_RELEASE_ID: 'release_sample_1234567890abcdef',
  },

  // Mock Escrow Data
  ESCROW: {
    DEFAULT_AMOUNT: '1000000',
    DEFAULT_PLATFORM_FEE: '40000', // 4%
    DEFAULT_DEADLINE_DAYS: 7,
    SAMPLE_TERMS: 'Sample escrow terms for demonstration purposes',
  },

  // Mock User Data
  USERS: {
    SAMPLE_USERNAME: 'TestUser',
    SAMPLE_EMAIL: 'test@example.com',
    SAMPLE_DISPLAY_NAME: 'Test User',
  },

  // Mock Demo Data
  DEMOS: {
    SAMPLE_SCORE: 85,
    SAMPLE_ATTEMPTS: 3,
    SAMPLE_COMPLETION_TIME: 300, // 5 minutes in seconds
  },

  // Mock Network Data
  NETWORKS: {
    DEFAULT_NETWORK: 'TESTNET',
    DEFAULT_PASSPHRASE: 'Test SDF Network ; September 2015',
  },
} as const;

// Mock API Response Templates
export const MOCK_API_RESPONSES = {
  SUCCESS: {
    status: 'success',
    message: 'Operation completed successfully',
  },
  ERROR: {
    status: 'error',
    message: 'An error occurred',
  },
  LOADING: {
    status: 'loading',
    message: 'Processing...',
  },
} as const;

// Mock Delay Constants for Simulating API Calls
export const MOCK_DELAYS = {
  FAST: 500,
  NORMAL: 1500,
  SLOW: 3000,
  VERY_SLOW: 5000,
} as const;

// Mock Error Messages
export const MOCK_ERRORS = {
  NETWORK_ERROR: 'Network connection failed',
  WALLET_ERROR: 'Wallet connection failed',
  TRANSACTION_ERROR: 'Transaction failed',
  VALIDATION_ERROR: 'Validation failed',
  UNKNOWN_ERROR: 'Unknown error occurred',
} as const;
