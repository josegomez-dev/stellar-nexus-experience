import { z } from 'zod';

// Environment schema validation with comprehensive validation
const envSchema = z.object({
  // ============================================================================
  // CRITICAL STELLAR CONFIGURATION
  // ============================================================================

  // Stellar Network Configuration
  NEXT_PUBLIC_STELLAR_NETWORK: z
    .enum(['TESTNET', 'PUBLIC'])
    .default('TESTNET')
    .describe('Stellar network to use: TESTNET for development, PUBLIC for mainnet'),

  // Stellar Horizon Server URLs (CRITICAL - should be in env vars)
  NEXT_PUBLIC_STELLAR_HORIZON_TESTNET: z
    .string()
    .url('Invalid testnet horizon URL')
    .default('https://horizon-testnet.stellar.org')
    .describe('Stellar testnet horizon server URL'),

  NEXT_PUBLIC_STELLAR_HORIZON_PUBLIC: z
    .string()
    .url('Invalid mainnet horizon URL')
    .default('https://horizon.stellar.org')
    .describe('Stellar mainnet horizon server URL'),

  // ============================================================================
  // CRITICAL ASSET CONFIGURATION
  // ============================================================================

  // Default asset for escrow contracts (CRITICAL - should be in env vars)
  NEXT_PUBLIC_DEFAULT_ASSET_CODE: z
    .string()
    .min(1, 'Asset code cannot be empty')
    .default('USDC')
    .describe('Default asset code for escrow contracts (e.g., USDC)'),

  NEXT_PUBLIC_DEFAULT_ASSET_ISSUER: z
    .string()
    .min(1, 'Asset issuer cannot be empty')
    .regex(/^[A-Z0-9]{56}$/, 'Invalid Stellar public key format')
    .default('CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA')
    .describe('Default asset issuer public key'),

  NEXT_PUBLIC_DEFAULT_ASSET_DECIMALS: z
    .string()
    .regex(/^\d+$/)
    .transform(Number)
    .pipe(z.number().min(1).max(18))
    .default(() => 7)
    .describe('Default asset decimals (1-18)'),

  // ============================================================================
  // PLATFORM CONFIGURATION
  // ============================================================================

  // Platform fee configuration
  NEXT_PUBLIC_PLATFORM_FEE_PERCENTAGE: z
    .string()
    .regex(/^\d+(\.\d+)?$/, 'Fee must be a valid number')
    .transform(Number)
    .pipe(z.number().min(0).max(100))
    .default(() => 4)
    .describe('Platform fee percentage (0-100)'),

  NEXT_PUBLIC_PLATFORM_PUBLIC_KEY: z
    .string()
    .regex(/^[A-Z0-9]{56}$|^$/, 'Invalid Stellar public key format')
    .default('')
    .describe('Platform public key for receiving fees'),

  // ============================================================================
  // CONTRACT CONFIGURATION
  // ============================================================================

  NEXT_PUBLIC_DEFAULT_ESCROW_DEADLINE_DAYS: z
    .string()
    .regex(/^\d+$/)
    .transform(Number)
    .pipe(z.number().min(1).max(365))
    .default(() => 7)
    .describe('Default escrow deadline in days (1-365)'),

  // ============================================================================
  // APP CONFIGURATION
  // ============================================================================

  NEXT_PUBLIC_APP_NAME: z
    .string()
    .min(1, 'App name cannot be empty')
    .default('NEXUS EXPERIENCE')
    .describe('Application name'),

  NEXT_PUBLIC_APP_VERSION: z
    .string()
    .min(1, 'App version cannot be empty')
    .default('0.1.0')
    .describe('Application version'),

  NEXT_PUBLIC_DEBUG_MODE: z
    .string()
    .optional()
    .transform(val => val === 'true')
    .default(() => false)
    .describe('Enable debug mode'),

  // ============================================================================
  // SECURITY CONFIGURATION
  // ============================================================================

  // JWT and session secrets (server-side only)
  JWT_SECRET: z
    .string()
    .min(32, 'JWT secret must be at least 32 characters')
    .optional()
    .describe('JWT signing secret (server-side only)'),

  SESSION_SECRET: z
    .string()
    .min(32, 'Session secret must be at least 32 characters')
    .optional()
    .describe('Session encryption secret (server-side only)'),

  // ============================================================================
  // FEATURE FLAGS
  // ============================================================================

  NEXT_PUBLIC_ESCROW_FEATURES_ENABLED: z
    .string()
    .optional()
    .transform(val => val !== 'false')
    .default(() => true)
    .describe('Enable escrow features'),

  NEXT_PUBLIC_WALLET_FEATURES_ENABLED: z
    .string()
    .optional()
    .transform(val => val !== 'false')
    .default(() => true)
    .describe('Enable wallet features'),

  NEXT_PUBLIC_DEMO_FEATURES_ENABLED: z
    .string()
    .optional()
    .transform(val => val !== 'false')
    .default(() => true)
    .describe('Enable demo features'),

  NEXT_PUBLIC_AI_FEATURES_ENABLED: z
    .string()
    .optional()
    .transform(val => val !== 'false')
    .default(() => true)
    .describe('Enable AI features'),

  // ============================================================================
  // UI CONFIGURATION
  // ============================================================================

  NEXT_PUBLIC_ANIMATIONS_ENABLED: z
    .string()
    .optional()
    .transform(val => val !== 'false')
    .default(() => true)
    .describe('Enable UI animations'),

  NEXT_PUBLIC_GLASSMORPHISM_ENABLED: z
    .string()
    .optional()
    .transform(val => val !== 'false')
    .default(() => true)
    .describe('Enable glassmorphism effects'),

  NEXT_PUBLIC_GRADIENT_EFFECTS_ENABLED: z
    .string()
    .optional()
    .transform(val => val !== 'false')
    .default(() => true)
    .describe('Enable gradient effects'),

  // ============================================================================
  // PERFORMANCE CONFIGURATION
  // ============================================================================

  NEXT_PUBLIC_LAZY_LOADING_ENABLED: z
    .string()
    .optional()
    .transform(val => val !== 'false')
    .default(() => true)
    .describe('Enable lazy loading'),

  NEXT_PUBLIC_IMAGE_OPTIMIZATION_ENABLED: z
    .string()
    .optional()
    .transform(val => val !== 'false')
    .default(() => true)
    .describe('Enable image optimization'),

  NEXT_PUBLIC_CODE_SPLITTING_ENABLED: z
    .string()
    .optional()
    .transform(val => val !== 'false')
    .default(() => true)
    .describe('Enable code splitting'),

  // ============================================================================
  // SECURITY HEADERS
  // ============================================================================

  NEXT_PUBLIC_CONTENT_SECURITY_POLICY_ENABLED: z
    .string()
    .optional()
    .transform(val => val !== 'false')
    .default(() => true)
    .describe('Enable Content Security Policy'),

  NEXT_PUBLIC_XSS_PROTECTION_ENABLED: z
    .string()
    .optional()
    .transform(val => val !== 'false')
    .default(() => true)
    .describe('Enable XSS protection'),

  NEXT_PUBLIC_FRAME_OPTIONS_ENABLED: z
    .string()
    .optional()
    .transform(val => val !== 'false')
    .default(() => true)
    .describe('Enable frame options protection'),

  // ============================================================================
  // ANALYTICS & MONITORING
  // ============================================================================

  NEXT_PUBLIC_ANALYTICS_ENABLED: z
    .string()
    .optional()
    .transform(val => val === 'true')
    .default(() => false)
    .describe('Enable analytics'),

  NEXT_PUBLIC_ANALYTICS_ID: z.string().optional().describe('Analytics tracking ID'),

  NEXT_PUBLIC_ERROR_REPORTING_ENABLED: z
    .string()
    .optional()
    .transform(val => val === 'true')
    .default(() => false)
    .describe('Enable error reporting'),

  NEXT_PUBLIC_ERROR_REPORTING_ENDPOINT: z
    .string()
    .url('Invalid error reporting endpoint')
    .optional()
    .describe('Error reporting endpoint URL'),

  // ============================================================================
  // AI ASSISTANT CONFIGURATION
  // ============================================================================

  NEXT_PUBLIC_AI_ASSISTANT_ENABLED: z
    .string()
    .optional()
    .transform(val => val !== 'false')
    .default(() => true)
    .describe('Enable AI assistant'),

  NEXT_PUBLIC_AI_ASSISTANT_NAME: z
    .string()
    .min(1, 'AI assistant name cannot be empty')
    .default('NEXUS PRIME')
    .describe('AI assistant name'),

  NEXT_PUBLIC_AI_ASSISTANT_VOICE_ENABLED: z
    .string()
    .optional()
    .transform(val => val !== 'false')
    .default(() => true)
    .describe('Enable AI assistant voice'),

  // ============================================================================
  // DEMO CONFIGURATION
  // ============================================================================

  NEXT_PUBLIC_DEMO_MODE_ENABLED: z
    .string()
    .optional()
    .transform(val => val !== 'false')
    .default(() => true)
    .describe('Enable demo mode'),

  NEXT_PUBLIC_DEMO_DATA_ENABLED: z
    .string()
    .optional()
    .transform(val => val !== 'false')
    .default(() => true)
    .describe('Enable demo data'),

  // ============================================================================
  // WALLET CONFIGURATION
  // ============================================================================

  NEXT_PUBLIC_FREIGHTER_APP_ID: z
    .string()
    .min(1, 'Freighter app ID cannot be empty')
    .default('nexus-experience')
    .describe('Freighter wallet app ID'),

  NEXT_PUBLIC_ALBEDO_APP_NAME: z
    .string()
    .min(1, 'Albedo app name cannot be empty')
    .default('NEXUS EXPERIENCE')
    .describe('Albedo wallet app name'),

  // ============================================================================
  // NODE ENVIRONMENT
  // ============================================================================

  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development')
    .describe('Node environment'),
});

// Parse and validate environment variables with clean warnings
const parseEnv = () => {
  // Track missing variables for clean warning messages
  const missingVars: string[] = [];
  const optionalVars: string[] = [];

  // Define which variables are truly required vs optional
  const requiredVars = [
    'NEXT_PUBLIC_STELLAR_NETWORK',
    'NEXT_PUBLIC_STELLAR_HORIZON_TESTNET',
    'NEXT_PUBLIC_STELLAR_HORIZON_PUBLIC',
    'NEXT_PUBLIC_DEFAULT_ASSET_CODE',
    'NEXT_PUBLIC_DEFAULT_ASSET_ISSUER',
    'NEXT_PUBLIC_DEFAULT_ASSET_DECIMALS',
    'NEXT_PUBLIC_APP_NAME',
    'NEXT_PUBLIC_APP_VERSION',
  ];

  const optionalVarsList = [
    'NEXT_PUBLIC_PLATFORM_FEE_PERCENTAGE',
    'NEXT_PUBLIC_PLATFORM_PUBLIC_KEY',
    'NEXT_PUBLIC_DEFAULT_ESCROW_DEADLINE_DAYS',
    'NEXT_PUBLIC_DEBUG_MODE',
    'NEXT_PUBLIC_ESCROW_FEATURES_ENABLED',
    'NEXT_PUBLIC_WALLET_FEATURES_ENABLED',
    'NEXT_PUBLIC_DEMO_FEATURES_ENABLED',
    'NEXT_PUBLIC_AI_FEATURES_ENABLED',
    'NEXT_PUBLIC_ANIMATIONS_ENABLED',
    'NEXT_PUBLIC_GLASSMORPHISM_ENABLED',
    'NEXT_PUBLIC_GRADIENT_EFFECTS_ENABLED',
    'NEXT_PUBLIC_LAZY_LOADING_ENABLED',
    'NEXT_PUBLIC_IMAGE_OPTIMIZATION_ENABLED',
    'NEXT_PUBLIC_CODE_SPLITTING_ENABLED',
    'NEXT_PUBLIC_CONTENT_SECURITY_POLICY_ENABLED',
    'NEXT_PUBLIC_XSS_PROTECTION_ENABLED',
    'NEXT_PUBLIC_FRAME_OPTIONS_ENABLED',
    'NEXT_PUBLIC_ANALYTICS_ENABLED',
    'NEXT_PUBLIC_ANALYTICS_ID',
    'NEXT_PUBLIC_ERROR_REPORTING_ENABLED',
    'NEXT_PUBLIC_ERROR_REPORTING_ENDPOINT',
    'NEXT_PUBLIC_AI_ASSISTANT_ENABLED',
    'NEXT_PUBLIC_AI_ASSISTANT_NAME',
    'NEXT_PUBLIC_AI_ASSISTANT_VOICE_ENABLED',
    'NEXT_PUBLIC_DEMO_MODE_ENABLED',
    'NEXT_PUBLIC_DEMO_DATA_ENABLED',
    'NEXT_PUBLIC_FREIGHTER_APP_ID',
    'NEXT_PUBLIC_ALBEDO_APP_NAME',
    'JWT_SECRET',
    'SESSION_SECRET',
  ];

  // Check for missing required variables
  requiredVars.forEach(varName => {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  });

  // Check for missing optional variables (for informational purposes)
  optionalVarsList.forEach(varName => {
    if (!process.env[varName]) {
      optionalVars.push(varName);
    }
  });

  // Create a comprehensive fallback object with all possible defaults
  const envWithDefaults = {
    ...process.env,
    // Critical variables with defaults
    NEXT_PUBLIC_STELLAR_NETWORK: process.env.NEXT_PUBLIC_STELLAR_NETWORK || 'TESTNET',
    NEXT_PUBLIC_STELLAR_HORIZON_TESTNET:
      process.env.NEXT_PUBLIC_STELLAR_HORIZON_TESTNET || 'https://horizon-testnet.stellar.org',
    NEXT_PUBLIC_STELLAR_HORIZON_PUBLIC:
      process.env.NEXT_PUBLIC_STELLAR_HORIZON_PUBLIC || 'https://horizon.stellar.org',
    NEXT_PUBLIC_DEFAULT_ASSET_CODE: process.env.NEXT_PUBLIC_DEFAULT_ASSET_CODE || 'USDC',
    NEXT_PUBLIC_DEFAULT_ASSET_ISSUER:
      process.env.NEXT_PUBLIC_DEFAULT_ASSET_ISSUER ||
      'CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA',
    NEXT_PUBLIC_DEFAULT_ASSET_DECIMALS: process.env.NEXT_PUBLIC_DEFAULT_ASSET_DECIMALS || '7',
    NEXT_PUBLIC_PLATFORM_FEE_PERCENTAGE: process.env.NEXT_PUBLIC_PLATFORM_FEE_PERCENTAGE || '4',
    NEXT_PUBLIC_PLATFORM_PUBLIC_KEY: process.env.NEXT_PUBLIC_PLATFORM_PUBLIC_KEY || '',
    NEXT_PUBLIC_DEFAULT_ESCROW_DEADLINE_DAYS:
      process.env.NEXT_PUBLIC_DEFAULT_ESCROW_DEADLINE_DAYS || '7',
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'NEXUS EXPERIENCE',
    NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION || '0.1.0',
    NEXT_PUBLIC_DEBUG_MODE: process.env.NEXT_PUBLIC_DEBUG_MODE || 'false',
    NEXT_PUBLIC_ESCROW_FEATURES_ENABLED: process.env.NEXT_PUBLIC_ESCROW_FEATURES_ENABLED || 'true',
    NEXT_PUBLIC_WALLET_FEATURES_ENABLED: process.env.NEXT_PUBLIC_WALLET_FEATURES_ENABLED || 'true',
    NEXT_PUBLIC_DEMO_FEATURES_ENABLED: process.env.NEXT_PUBLIC_DEMO_FEATURES_ENABLED || 'true',
    NEXT_PUBLIC_AI_FEATURES_ENABLED: process.env.NEXT_PUBLIC_AI_FEATURES_ENABLED || 'true',
    NEXT_PUBLIC_ANIMATIONS_ENABLED: process.env.NEXT_PUBLIC_ANIMATIONS_ENABLED || 'true',
    NEXT_PUBLIC_GLASSMORPHISM_ENABLED: process.env.NEXT_PUBLIC_GLASSMORPHISM_ENABLED || 'true',
    NEXT_PUBLIC_GRADIENT_EFFECTS_ENABLED:
      process.env.NEXT_PUBLIC_GRADIENT_EFFECTS_ENABLED || 'true',
    NEXT_PUBLIC_LAZY_LOADING_ENABLED: process.env.NEXT_PUBLIC_LAZY_LOADING_ENABLED || 'true',
    NEXT_PUBLIC_IMAGE_OPTIMIZATION_ENABLED:
      process.env.NEXT_PUBLIC_IMAGE_OPTIMIZATION_ENABLED || 'true',
    NEXT_PUBLIC_CODE_SPLITTING_ENABLED: process.env.NEXT_PUBLIC_CODE_SPLITTING_ENABLED || 'true',
    NEXT_PUBLIC_CONTENT_SECURITY_POLICY_ENABLED:
      process.env.NEXT_PUBLIC_CONTENT_SECURITY_POLICY_ENABLED || 'true',
    NEXT_PUBLIC_XSS_PROTECTION_ENABLED: process.env.NEXT_PUBLIC_XSS_PROTECTION_ENABLED || 'true',
    NEXT_PUBLIC_FRAME_OPTIONS_ENABLED: process.env.NEXT_PUBLIC_FRAME_OPTIONS_ENABLED || 'true',
    NEXT_PUBLIC_ANALYTICS_ENABLED: process.env.NEXT_PUBLIC_ANALYTICS_ENABLED || 'false',
    NEXT_PUBLIC_ANALYTICS_ID: process.env.NEXT_PUBLIC_ANALYTICS_ID || '',
    NEXT_PUBLIC_ERROR_REPORTING_ENABLED: process.env.NEXT_PUBLIC_ERROR_REPORTING_ENABLED || 'false',
    NEXT_PUBLIC_ERROR_REPORTING_ENDPOINT: process.env.NEXT_PUBLIC_ERROR_REPORTING_ENDPOINT || '',
    NEXT_PUBLIC_AI_ASSISTANT_ENABLED: process.env.NEXT_PUBLIC_AI_ASSISTANT_ENABLED || 'true',
    NEXT_PUBLIC_AI_ASSISTANT_NAME: process.env.NEXT_PUBLIC_AI_ASSISTANT_NAME || 'NEXUS PRIME',
    NEXT_PUBLIC_AI_ASSISTANT_VOICE_ENABLED:
      process.env.NEXT_PUBLIC_AI_ASSISTANT_VOICE_ENABLED || 'true',
    NEXT_PUBLIC_DEMO_MODE_ENABLED: process.env.NEXT_PUBLIC_DEMO_MODE_ENABLED || 'true',
    NEXT_PUBLIC_DEMO_DATA_ENABLED: process.env.NEXT_PUBLIC_DEMO_DATA_ENABLED || 'true',
    NEXT_PUBLIC_FREIGHTER_APP_ID: process.env.NEXT_PUBLIC_FREIGHTER_APP_ID || 'nexus-experience',
    NEXT_PUBLIC_ALBEDO_APP_NAME: process.env.NEXT_PUBLIC_ALBEDO_APP_NAME || 'NEXUS EXPERIENCE',
    NODE_ENV: process.env.NODE_ENV || 'development',
  };

  try {
    const result = envSchema.parse(envWithDefaults);

    // Show clean, informative warnings about missing variables
    if (missingVars.length > 0 || optionalVars.length > 0) {
      console.log('\n🌟 NEXUS EXPERIENCE Environment Status:');

      if (missingVars.length > 0) {
        console.log('⚠️  Missing required variables (using defaults):');
        missingVars.forEach(varName => {
          console.log(`   • ${varName}`);
        });
      }

      if (optionalVars.length > 0) {
        console.log('ℹ️  Optional variables not set (features disabled):');
        optionalVars.forEach(varName => {
          console.log(`   • ${varName}`);
        });
      }

      console.log('\n✨ Application running with fallback configuration');
      console.log('📖 See env.example for complete variable list\n');
    } else {
      console.log('✅ All environment variables configured correctly\n');
    }

    return result;
  } catch (error) {
    // If validation still fails, provide a comprehensive fallback
    console.log('\n🌟 NEXUS EXPERIENCE Environment Status:');
    console.log('⚠️  Environment validation failed, using comprehensive fallback configuration');

    if (missingVars.length > 0) {
      console.log('Missing required variables:');
      missingVars.forEach(varName => console.log(`   • ${varName}`));
    }

    if (optionalVars.length > 0) {
      console.log('Optional variables not set:');
      optionalVars.forEach(varName => console.log(`   • ${varName}`));
    }

    console.log('\n✨ Application running with fallback configuration');
    console.log('📖 See env.example for complete variable list\n');

    // Return comprehensive fallback configuration
    return {
      NEXT_PUBLIC_STELLAR_NETWORK: 'TESTNET',
      NEXT_PUBLIC_STELLAR_HORIZON_TESTNET: 'https://horizon-testnet.stellar.org',
      NEXT_PUBLIC_STELLAR_HORIZON_PUBLIC: 'https://horizon.stellar.org',
      NEXT_PUBLIC_DEFAULT_ASSET_CODE: 'USDC',
      NEXT_PUBLIC_DEFAULT_ASSET_ISSUER: 'CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA',
      NEXT_PUBLIC_DEFAULT_ASSET_DECIMALS: 7,
      NEXT_PUBLIC_PLATFORM_FEE_PERCENTAGE: 4,
      NEXT_PUBLIC_PLATFORM_PUBLIC_KEY: '',
      NEXT_PUBLIC_DEFAULT_ESCROW_DEADLINE_DAYS: 7,
      NEXT_PUBLIC_APP_NAME: 'NEXUS EXPERIENCE',
      NEXT_PUBLIC_APP_VERSION: '0.1.0',
      NEXT_PUBLIC_DEBUG_MODE: false,
      NEXT_PUBLIC_ESCROW_FEATURES_ENABLED: true,
      NEXT_PUBLIC_WALLET_FEATURES_ENABLED: true,
      NEXT_PUBLIC_DEMO_FEATURES_ENABLED: true,
      NEXT_PUBLIC_AI_FEATURES_ENABLED: true,
      NEXT_PUBLIC_ANIMATIONS_ENABLED: true,
      NEXT_PUBLIC_GLASSMORPHISM_ENABLED: true,
      NEXT_PUBLIC_GRADIENT_EFFECTS_ENABLED: true,
      NEXT_PUBLIC_LAZY_LOADING_ENABLED: true,
      NEXT_PUBLIC_IMAGE_OPTIMIZATION_ENABLED: true,
      NEXT_PUBLIC_CODE_SPLITTING_ENABLED: true,
      NEXT_PUBLIC_CONTENT_SECURITY_POLICY_ENABLED: true,
      NEXT_PUBLIC_XSS_PROTECTION_ENABLED: true,
      NEXT_PUBLIC_FRAME_OPTIONS_ENABLED: true,
      NEXT_PUBLIC_ANALYTICS_ENABLED: false,
      NEXT_PUBLIC_ANALYTICS_ID: '',
      NEXT_PUBLIC_ERROR_REPORTING_ENABLED: false,
      NEXT_PUBLIC_ERROR_REPORTING_ENDPOINT: '',
      NEXT_PUBLIC_AI_ASSISTANT_ENABLED: true,
      NEXT_PUBLIC_AI_ASSISTANT_NAME: 'NEXUS PRIME',
      NEXT_PUBLIC_AI_ASSISTANT_VOICE_ENABLED: true,
      NEXT_PUBLIC_DEMO_MODE_ENABLED: true,
      NEXT_PUBLIC_DEMO_DATA_ENABLED: true,
      NEXT_PUBLIC_FREIGHTER_APP_ID: 'nexus-experience',
      NEXT_PUBLIC_ALBEDO_APP_NAME: 'NEXUS EXPERIENCE',
      NODE_ENV: 'development',
    } as any;
  }
};

// Parse environment variables
const env = parseEnv();

// Export validated environment
export default env;

// Export type for TypeScript
export type Env = z.infer<typeof envSchema>;

// Export schema for testing and documentation
export { envSchema };
