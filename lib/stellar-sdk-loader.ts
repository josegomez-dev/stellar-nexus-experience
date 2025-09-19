'use client';

// Optimized Stellar SDK loader to minimize warnings and improve performance
let stellarSDK: any = null;
let loadingPromise: Promise<any> | null = null;

export const loadStellarSDK = async () => {
  // Return cached SDK if already loaded
  if (stellarSDK) {
    return stellarSDK;
  }

  // Return existing loading promise if already loading
  if (loadingPromise) {
    return loadingPromise;
  }

  // Create new loading promise
  loadingPromise = (async () => {
    try {
      // Try loading the newer @stellar/stellar-sdk first
      stellarSDK = await import('@stellar/stellar-sdk');
      console.log('✅ Loaded @stellar/stellar-sdk');
      return stellarSDK;
    } catch (error) {
      try {
        // Fallback to legacy stellar-sdk
        stellarSDK = await import('stellar-sdk');
        console.log('✅ Loaded stellar-sdk (legacy)');
        return stellarSDK;
      } catch (fallbackError) {
        console.error('❌ Failed to load Stellar SDK:', fallbackError);
        throw new Error('Stellar SDK not available');
      }
    }
  })();

  return loadingPromise;
};

// Helper function to get Server class safely
export const getStellarServer = async (networkUrl: string) => {
  const SDK = await loadStellarSDK();
  return new SDK.Server(networkUrl);
};

// Helper function to get Keypair class safely
export const getStellarKeypair = async () => {
  const SDK = await loadStellarSDK();
  return SDK.Keypair;
};

// Helper function to get Networks safely
export const getStellarNetworks = async () => {
  const SDK = await loadStellarSDK();
  return SDK.Networks;
};

// Helper function to get TransactionBuilder safely
export const getStellarTransactionBuilder = async () => {
  const SDK = await loadStellarSDK();
  return SDK.TransactionBuilder;
};

// Helper function to check if Stellar SDK is available in browser
export const isStellarSDKAvailable = () => {
  return typeof window !== 'undefined';
};

// Preload Stellar SDK (optional, for better performance)
export const preloadStellarSDK = () => {
  if (typeof window !== 'undefined') {
    // Preload in background without blocking
    loadStellarSDK().catch(() => {
      // Silently fail - SDK will be loaded when needed
    });
  }
};
