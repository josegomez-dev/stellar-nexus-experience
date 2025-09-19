/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimized for Vercel deployment
  poweredByHeader: false,
  compress: true,
  generateEtags: false,
  
  // Webpack configuration to suppress Stellar SDK warnings and optimize build
  webpack: (config, { dev, isServer }) => {
    // Suppress critical dependency warnings from stellar-sdk and related packages
    config.module.exprContextCritical = false;
    config.module.unknownContextCritical = false;
    config.module.wrappedContextCritical = false;
    
    // Add fallbacks for Node.js modules that aren't available in the browser
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
      stream: false,
      url: false,
      zlib: false,
      http: false,
      https: false,
      assert: false,
      os: false,
      path: false,
      buffer: false,
      process: false,
      util: false,
    };

    // Ignore specific warnings from stellar-sdk dependencies
    config.ignoreWarnings = [
      // Ignore critical dependency warnings from stellar-sdk
      /Critical dependency: require function is used in a way in which dependencies cannot be statically extracted/,
      // Ignore warnings from specific modules
      /require-addon/,
      /sodium-native/,
      /@stellar\/stellar-base/,
      /stellar-sdk/,
      // Additional common warnings to ignore
      /Module not found: Can't resolve/,
      /export .* was not found in/,
    ];

    // Optimize for client-side builds
    if (!isServer) {
      // Exclude server-only modules from client bundle
      config.externals = config.externals || [];
      config.externals.push({
        'sodium-native': 'sodium-native',
        'require-addon': 'require-addon',
      });
    }

    // Additional optimization for stellar-sdk (removed alias to prevent module resolution issues)

    return config;
  },
  
  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ['stellar-sdk', '@stellar/stellar-sdk'],
  },
};

module.exports = nextConfig;
