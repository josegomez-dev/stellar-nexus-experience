import env from './env';

// Centralized configuration for the Trustless Work application
// This file provides a single source of truth for all environment variables

export const config = {
  // Stellar Network Configuration
  stellar: {
    network: env.NEXT_PUBLIC_STELLAR_NETWORK,
    horizonUrl:
      env.NEXT_PUBLIC_STELLAR_NETWORK === 'PUBLIC'
        ? env.NEXT_PUBLIC_STELLAR_HORIZON_PUBLIC
        : env.NEXT_PUBLIC_STELLAR_HORIZON_TESTNET,
  },

  // Asset Configuration
  asset: {
    defaultAsset: {
      code: env.NEXT_PUBLIC_DEFAULT_ASSET_CODE,
      issuer: env.NEXT_PUBLIC_DEFAULT_ASSET_ISSUER,
      decimals: env.NEXT_PUBLIC_DEFAULT_ASSET_DECIMALS,
    },
    platformFee: env.NEXT_PUBLIC_PLATFORM_FEE_PERCENTAGE,
    defaultEscrowDeadlineDays: env.NEXT_PUBLIC_DEFAULT_ESCROW_DEADLINE_DAYS,
  },

  // App Configuration
  app: {
    name: env.NEXT_PUBLIC_APP_NAME,
    version: env.NEXT_PUBLIC_APP_VERSION,
    debugMode: env.NEXT_PUBLIC_DEBUG_MODE || false,
    platformPublicKey: env.NEXT_PUBLIC_PLATFORM_PUBLIC_KEY,
  },

  // Development Configuration
  development: {
    nodeEnv: env.NODE_ENV,
    isDevelopment: env.NODE_ENV === 'development',
    isProduction: env.NODE_ENV === 'production',
    isTest: env.NODE_ENV === 'test',
  },

  // Feature Flags
  features: {
    escrow: env.NEXT_PUBLIC_ESCROW_FEATURES_ENABLED,
    wallet: env.NEXT_PUBLIC_WALLET_FEATURES_ENABLED,
    demo: env.NEXT_PUBLIC_DEMO_FEATURES_ENABLED,
    ai: env.NEXT_PUBLIC_AI_FEATURES_ENABLED,
  },

  // UI Configuration
  ui: {
    animations: env.NEXT_PUBLIC_ANIMATIONS_ENABLED,
    glassmorphism: env.NEXT_PUBLIC_GLASSMORPHISM_ENABLED,
    gradientEffects: env.NEXT_PUBLIC_GRADIENT_EFFECTS_ENABLED,
  },

  // Performance Configuration
  performance: {
    lazyLoading: env.NEXT_PUBLIC_LAZY_LOADING_ENABLED,
    imageOptimization: env.NEXT_PUBLIC_IMAGE_OPTIMIZATION_ENABLED,
    codeSplitting: env.NEXT_PUBLIC_CODE_SPLITTING_ENABLED,
  },

  // Security Configuration
  security: {
    contentSecurityPolicy: env.NEXT_PUBLIC_CONTENT_SECURITY_POLICY_ENABLED,
    xssProtection: env.NEXT_PUBLIC_XSS_PROTECTION_ENABLED,
    frameOptions: env.NEXT_PUBLIC_FRAME_OPTIONS_ENABLED,
    jwtSecret: env.JWT_SECRET,
    sessionSecret: env.SESSION_SECRET,
  },

  // Analytics & Monitoring
  analytics: {
    enabled: env.NEXT_PUBLIC_ANALYTICS_ENABLED,
    id: env.NEXT_PUBLIC_ANALYTICS_ID,
    errorReporting: {
      enabled: env.NEXT_PUBLIC_ERROR_REPORTING_ENABLED,
      endpoint: env.NEXT_PUBLIC_ERROR_REPORTING_ENDPOINT,
    },
  },

  // AI Assistant Configuration
  ai: {
    enabled: env.NEXT_PUBLIC_AI_ASSISTANT_ENABLED,
    name: env.NEXT_PUBLIC_AI_ASSISTANT_NAME,
    voiceEnabled: env.NEXT_PUBLIC_AI_ASSISTANT_VOICE_ENABLED,
  },

  // Demo Configuration
  demo: {
    modeEnabled: env.NEXT_PUBLIC_DEMO_MODE_ENABLED,
    dataEnabled: env.NEXT_PUBLIC_DEMO_DATA_ENABLED,
  },

  // Wallet Configuration
  wallet: {
    freighterAppId: env.NEXT_PUBLIC_FREIGHTER_APP_ID,
    albedoAppName: env.NEXT_PUBLIC_ALBEDO_APP_NAME,
  },

  // API Configuration
  api: {
    baseUrl: env.NEXT_PUBLIC_API_BASE_URL,
    externalKey: env.EXTERNAL_API_KEY,
  },

  // Database Configuration
  database: {
    url: env.DATABASE_URL,
  },
};

// Export individual config sections for convenience
export const {
  stellar,
  asset,
  app,
  development,
  features,
  ui,
  performance,
  security,
  analytics,
  ai,
  demo,
  wallet,
  api,
  database,
} = config;

// Default export
export default config;
