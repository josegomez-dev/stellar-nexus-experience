// Centralized configuration for the Trustless Work application
// This file provides a single source of truth for all environment variables

export const config = {
  // Stellar Network Configuration
  stellar: {
    network: process.env.NEXT_PUBLIC_STELLAR_NETWORK || 'TESTNET',
    horizonUrl: process.env.NEXT_PUBLIC_STELLAR_NETWORK === 'PUBLIC' 
      ? process.env.NEXT_PUBLIC_STELLAR_HORIZON_PUBLIC || 'https://horizon.stellar.org'
      : process.env.NEXT_PUBLIC_STELLAR_HORIZON_TESTNET || 'https://horizon-testnet.stellar.org',
  },

  // Asset Configuration
  asset: {
    defaultAsset: {
      code: process.env.NEXT_PUBLIC_DEFAULT_ASSET_CODE || 'USDC',
      issuer: process.env.NEXT_PUBLIC_DEFAULT_ASSET_ISSUER || 'CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA',
      decimals: 10000000
    },
    platformFee: parseInt(process.env.NEXT_PUBLIC_PLATFORM_FEE_PERCENTAGE || '4'),
    defaultEscrowDeadlineDays: parseInt(process.env.NEXT_PUBLIC_DEFAULT_ESCROW_DEADLINE_DAYS || '7'),
  },

  // App Configuration
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || 'Stellar Nexus',
    version: process.env.NEXT_PUBLIC_APP_VERSION || '0.1.0',
    debugMode: process.env.NEXT_PUBLIC_DEBUG_MODE === 'true',
    platformPublicKey: process.env.NEXT_PUBLIC_PLATFORM_PUBLIC_KEY || '',
  },

  // Development Configuration
  development: {
    nodeEnv: process.env.NODE_ENV || 'development',
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
  }
}

// Validation function to ensure required configuration is present
export const validateConfig = () => {
  const errors: string[] = []

  if (!config.stellar.network) {
    errors.push('NEXT_PUBLIC_STELLAR_NETWORK is required')
  }

  if (!config.asset.defaultAsset.code) {
    errors.push('NEXT_PUBLIC_DEFAULT_ASSET_CODE is required')
  }

  if (!config.asset.defaultAsset.issuer) {
    errors.push('NEXT_PUBLIC_DEFAULT_ASSET_ISSUER is required')
  }

  if (config.asset.platformFee < 0 || config.asset.platformFee > 100) {
    errors.push('NEXT_PUBLIC_PLATFORM_FEE_PERCENTAGE must be between 0 and 100')
  }

  if (config.asset.defaultEscrowDeadlineDays < 1) {
    errors.push('NEXT_PUBLIC_DEFAULT_ESCROW_DEADLINE_DAYS must be at least 1')
  }

  if (errors.length > 0) {
    console.error('Configuration validation failed:', errors)
    return false
  }

  return true
}

// Export individual config sections for convenience
export const { stellar, asset, app, development } = config

// Default export
export default config
