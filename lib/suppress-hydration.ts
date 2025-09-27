// Utility to suppress hydration warnings
export function suppressHydrationWarning() {
  if (typeof window !== 'undefined') {
    // Hydration warnings suppressed
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
