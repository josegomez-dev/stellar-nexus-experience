// Utility to suppress hydration warnings
export function suppressHydrationWarning() {
  if (typeof window !== 'undefined') {
    const originalError = console.error;
    console.error = (...args) => {
      if (args[0]?.includes?.('Warning: Text content did not match')) {
        return;
      }
      if (args[0]?.includes?.('Warning: Expected server HTML to contain')) {
        return;
      }
      if (args[0]?.includes?.('Warning: Hydration failed')) {
        return;
      }
      originalError.apply(console, args);
    };
  }
}

// Utility to check if we're in the browser
export function isBrowser() {
  return typeof window !== 'undefined';
}

// Utility to check if we're in the server
export function isServer() {
  return typeof window === 'undefined';
}

// Utility to get safe environment value
export function getSafeEnvValue<T>(key: string, defaultValue: T): T {
  if (isServer()) {
    return defaultValue;
  }

  try {
    const value = process.env[key];
    return (value as T) || defaultValue;
  } catch {
    return defaultValue;
  }
}


