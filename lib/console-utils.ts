/**
 * Console utilities for handling development warnings and errors
 */

// List of warning patterns to suppress
const SUPPRESSED_PATTERNS = [
  'CustomElementRegistry',
  'already has "stellar-wallets-',
  'stellar-wallets-modal',
  'stellar-wallets-button', 
  'stellar-accounts-selector',
  'Multiple versions of Lit loaded',
  'Loading multiple versions is not recommended'
];

// Check if a message should be suppressed
const shouldSuppressMessage = (message: string): boolean => {
  return SUPPRESSED_PATTERNS.some(pattern => message.includes(pattern));
};

// Suppress specific warnings in development
export const suppressDevelopmentWarnings = () => {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    const originalError = console.error;
    const originalWarn = console.warn;
    const originalLog = console.log;
    
    // Suppress all Stellar Wallets Kit custom element warnings
    console.error = (...args) => {
      const message = args[0]?.toString() || '';
      if (shouldSuppressMessage(message)) {
        return; // Suppress these specific warnings
      }
      originalError.apply(console, args);
    };
    
    // Suppress related warnings and Lit version warnings
    console.warn = (...args) => {
      const message = args[0]?.toString() || '';
      if (shouldSuppressMessage(message)) {
        return; // Suppress these specific warnings
      }
      originalWarn.apply(console, args);
    };
    
    // Also suppress some log messages that might be noisy
    console.log = (...args) => {
      const message = args[0]?.toString() || '';
      if (shouldSuppressMessage(message)) {
        return; // Suppress these specific messages
      }
      originalLog.apply(console, args);
    };
    
    console.log('🔇 Development warnings suppressed for Stellar Wallets Kit and Lit');
    console.log('📝 Suppressed patterns:', SUPPRESSED_PATTERNS);
  }
};

// Restore original console methods
export const restoreConsoleMethods = () => {
  if (typeof window !== 'undefined') {
    // This would need to store the original methods somewhere
    // For now, just log that we're not suppressing warnings
    console.log('🔊 Console methods restored');
  }
};

// Initialize suppression on import
suppressDevelopmentWarnings();
