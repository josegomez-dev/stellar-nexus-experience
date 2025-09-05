// Bugfender configuration
const BUGFENDER_CONFIG = {
  appKey: process.env.NEXT_PUBLIC_ERROR_REPORTING_API_KEY || '',
  overrideConsoleMethods: true,
  printToConsole: process.env.NODE_ENV === 'development',
  registerErrorHandler: true,
  logBrowserEvents: true,
  logUIEvents: true,
  version: process.env.NEXT_PUBLIC_APP_VERSION || '0.1.0',
  build: process.env.NEXT_PUBLIC_APP_VERSION || '0.1.0',
};

// Initialize Bugfender
let isInitialized = false;
let Bugfender: any = null;

export const initBugfender = async () => {
  if (typeof window === 'undefined' || isInitialized) {
    return; // Skip on server-side or if already initialized
  }

  try {
    // Dynamic import to avoid SSR issues
    const { Bugfender: BugfenderSDK } = await import('@bugfender/sdk');
    Bugfender = BugfenderSDK;
    
    Bugfender.init(BUGFENDER_CONFIG);
    isInitialized = true;
    
    // Log initialization
    Bugfender.log('🐛 Bugfender initialized successfully');
    Bugfender.log(`App Version: ${BUGFENDER_CONFIG.version}`);
    Bugfender.log(`Environment: ${process.env.NODE_ENV}`);
    
    // Set initial device information
    Bugfender.setDeviceKey('app_name', 'Trustless Work');
    Bugfender.setDeviceKey('app_version', BUGFENDER_CONFIG.version);
    Bugfender.setDeviceKey('environment', process.env.NODE_ENV || 'unknown');
    Bugfender.setDeviceKey('platform', 'web');
    Bugfender.setDeviceKey('user_agent', navigator.userAgent);
    Bugfender.setDeviceKey('url', window.location.href);
    
    console.log('✅ Bugfender initialized and configured');
  } catch (error) {
    console.error('❌ Failed to initialize Bugfender:', error);
  }
};

// Helper functions for logging
export const logInfo = (message: string, data?: any) => {
  if (!isInitialized || !Bugfender) return;
  
  try {
    if (data) {
      Bugfender.log(`ℹ️ ${message}`, data);
    } else {
      Bugfender.log(`ℹ️ ${message}`);
    }
  } catch (error) {
    console.error('Failed to log info:', error);
  }
};

export const logWarning = (message: string, data?: any) => {
  if (!isInitialized || !Bugfender) return;
  
  try {
    if (data) {
      Bugfender.warn(`⚠️ ${message}`, data);
    } else {
      Bugfender.warn(`⚠️ ${message}`);
    }
  } catch (error) {
    console.error('Failed to log warning:', error);
  }
};

export const logError = (message: string, error?: any) => {
  if (!isInitialized || !Bugfender) return;
  
  try {
    if (error) {
      Bugfender.error(`❌ ${message}`, {
        error: error.message || error,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });
    } else {
      Bugfender.error(`❌ ${message}`);
    }
  } catch (err) {
    console.error('Failed to log error:', err);
  }
};

// Set user information when wallet connects
export const setUserInfo = (walletAddress?: string, network?: string) => {
  if (!isInitialized || !walletAddress) return;
  
  try {
    Bugfender.setDeviceKey('wallet_address', walletAddress);
    Bugfender.setDeviceKey('stellar_network', network || 'unknown');
    Bugfender.setDeviceKey('user_id', walletAddress.substring(0, 8)); // First 8 chars as user ID
    
    logInfo('User information set', {
      wallet_address: walletAddress.substring(0, 8) + '...',
      network: network,
    });
  } catch (error) {
    console.error('Failed to set user info:', error);
  }
};

// Set account information when account is created/loaded
export const setAccountInfo = (accountId?: string, totalPoints?: number, level?: number) => {
  if (!isInitialized || !accountId) return;
  
  try {
    Bugfender.setDeviceKey('account_id', accountId);
    Bugfender.setDeviceKey('account_points', totalPoints?.toString() || '0');
    Bugfender.setDeviceKey('account_level', level?.toString() || '1');
    
    logInfo('Account information set', {
      account_id: accountId.substring(0, 8) + '...',
      points: totalPoints,
      level: level,
    });
  } catch (error) {
    console.error('Failed to set account info:', error);
  }
};

// Log page visits
export const logPageVisit = (pageName: string, path?: string) => {
  if (!isInitialized) return;
  
  try {
    logInfo(`Page Visit: ${pageName}`, {
      page: pageName,
      path: path || window.location.pathname,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Failed to log page visit:', error);
  }
};

// Log demo actions
export const logDemoAction = (demoId: string, action: string, data?: any) => {
  if (!isInitialized) return;
  
  try {
    logInfo(`Demo Action: ${demoId} - ${action}`, {
      demo_id: demoId,
      action: action,
      data: data,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Failed to log demo action:', error);
  }
};

// Export removed - use dynamic imports to avoid SSR issues
// Example: const { Bugfender } = await import('@bugfender/sdk');
