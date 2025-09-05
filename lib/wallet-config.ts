import { config } from './config';

export const walletConfig = {
  network: config.stellar.network,
  appName: config.app.name,
  appIcon: '/icon.png', // Optional: path to your app icon
};

// Stellar network configuration
export const stellarConfig = {
  network: config.stellar.network,
  horizonUrl: config.stellar.horizonUrl,
};

// Asset configuration
export const assetConfig = {
  defaultAsset: config.asset.defaultAsset,
  platformFee: config.asset.platformFee,
  defaultEscrowDeadlineDays: config.asset.defaultEscrowDeadlineDays,
};

// App configuration
export const appConfig = {
  name: config.app.name,
  version: config.app.version,
  debugMode: config.app.debugMode,
  platformPublicKey: config.app.platformPublicKey,
};
