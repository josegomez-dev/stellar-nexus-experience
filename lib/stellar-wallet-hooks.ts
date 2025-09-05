import { useState, useEffect, useCallback, useRef } from 'react';
import { SendTransactionResponse } from '@/types/trustless-work';
import { stellarConfig, assetConfig } from './wallet-config';
import { validateStellarAddress } from './stellar-address-validation';
import { 
  StellarWalletsKit, 
  WalletNetwork, 
  FreighterModule,
  AlbedoModule,
  RabetModule,
  LobstrModule,
  ISupportedWallet 
} from '@creit.tech/stellar-wallets-kit';

// POC Mode - No Stellar Wallets Kit initialization to avoid custom element conflicts
const POC_MODE = process.env.NODE_ENV === 'development';

// Network configurations
const NETWORK_CONFIGS = {
  TESTNET: {
    passphrase: 'Test SDF Network ; September 2015',
    horizonUrl: 'https://horizon-testnet.stellar.org',
    isMainnet: false,
  },
  PUBLIC: {
    passphrase: 'Public Global Stellar Network ; September 2015',
    horizonUrl: 'https://horizon.stellar.org',
    isMainnet: true,
  },
};

// Helper function to get network configuration
const getNetworkConfig = (network: string) => {
  return NETWORK_CONFIGS[network as keyof typeof NETWORK_CONFIGS] || NETWORK_CONFIGS.TESTNET;
};

export interface WalletData {
  publicKey: string;
  network: string;
  isConnected: boolean;
  networkPassphrase: string;
  horizonUrl: string;
  isMainnet: boolean;
  walletName: string;
  walletType: string;
  walletId: string;
  walletIcon?: string;
  walletUrl?: string;
}

export interface UseWalletReturn {
  walletData: WalletData | null;
  isConnected: boolean;
  isLoading: boolean;
  error: Error | null;
  connect: (walletId?: string) => Promise<void>;
  connectManualAddress: (address: string) => Promise<void>;
  disconnect: () => Promise<void>;
  signTransaction: (xdr: string) => Promise<{ signedTxXdr: string; signerAddress?: string }>;
  sendTransaction: (signedXdr: string) => Promise<SendTransactionResponse>;
  getAvailableWallets: () => Promise<ISupportedWallet[]>;
  isFreighterAvailable: boolean;
  currentNetwork: string;
  switchNetwork: (network: 'TESTNET' | 'PUBLIC') => Promise<void>;
  detectNetworkChange: () => Promise<void>;
  walletKit: StellarWalletsKit | null;
  openWalletModal: () => Promise<void>;
}

export const useWallet = (): UseWalletReturn => {
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isFreighterAvailable, setIsFreighterAvailable] = useState(false);
  const [currentNetwork, setCurrentNetwork] = useState<string>('TESTNET');
  const [walletKit, setWalletKit] = useState<StellarWalletsKit | null>(null);
  const [availableWallets, setAvailableWallets] = useState<ISupportedWallet[]>([]);

  // Use refs to prevent repeated checks
  const hasCheckedFreighter = useRef(false);
  const checkInterval = useRef<NodeJS.Timeout | null>(null);

  // Initialize Stellar Wallets Kit
  useEffect(() => {
    const initializeWalletKit = async () => {
      try {
        console.log('🚀 Initializing Stellar Wallets Kit...');
        
        // Create wallet modules
        const modules = [
          new FreighterModule(),
          new AlbedoModule(),
          new RabetModule(),
          new LobstrModule(),
        ];

        // Initialize the kit
        const kit = new StellarWalletsKit({
          network: WalletNetwork.TESTNET,
          modules,
        });

        setWalletKit(kit);

        // Get available wallets
        const supportedWallets = await kit.getSupportedWallets();
        setAvailableWallets(supportedWallets);
        
        // Check if Freighter is available
        const freighterWallet = supportedWallets.find(wallet => wallet.id === 'freighter');
        setIsFreighterAvailable(freighterWallet?.isAvailable || false);
        
        console.log('✅ Stellar Wallets Kit initialized');
        console.log('📱 Available wallets:', supportedWallets.map(w => `${w.name} (${w.isAvailable ? '✅' : '❌'})`));
        
        // Check if already connected
        await checkConnectionStatus(kit);
        
      } catch (error) {
        console.error('❌ Failed to initialize Stellar Wallets Kit:', error);
        console.log('🔄 Falling back to direct Freighter API...');
        
        // Fallback to direct Freighter detection
        const freighterDetected = typeof window !== 'undefined' && (window as any).stellar;
        setIsFreighterAvailable(freighterDetected);

      if (freighterDetected) {
          console.log('✅ Freighter detected via fallback method');
      } else {
          console.log('❌ No Freighter wallet detected');
        }
      }
    };

    const checkConnectionStatus = async (kit: StellarWalletsKit) => {
      try {
        // Try to get address to check if already connected
        const addressResponse = await kit.getAddress();
        if (addressResponse.address) {
          // Get network info
          const networkResponse = await kit.getNetwork();
          
          setCurrentNetwork(networkResponse.network);
          
          const networkConfig = getNetworkConfig(networkResponse.network);
          
          // Get wallet info from the kit's selected module
          const selectedModule = kit['selectedModule'];
          const connectedWallet = selectedModule ? {
            id: selectedModule.productId,
            name: selectedModule.productName,
            type: 'unknown',
            icon: selectedModule.productIcon,
            url: selectedModule.productUrl,
          } : null;
          
          setWalletData({
            publicKey: addressResponse.address,
            network: networkResponse.network,
            isConnected: true,
            networkPassphrase: networkResponse.networkPassphrase,
            horizonUrl: networkConfig.horizonUrl,
            isMainnet: networkConfig.isMainnet,
            walletName: connectedWallet?.name || 'Unknown Wallet',
            walletType: connectedWallet?.type || 'unknown',
            walletId: connectedWallet?.id || 'unknown',
            walletIcon: connectedWallet?.icon,
            walletUrl: connectedWallet?.url,
          });
          
          console.log('✅ Wallet already connected:', { 
            address: addressResponse.address, 
            network: networkResponse.network,
            wallet: connectedWallet?.name 
          });
        }
      } catch (error) {
        console.log('No wallet connected or error checking status:', error);
      }
    };

    initializeWalletKit();
  }, []);

  const connect = useCallback(async (walletId?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Attempting to connect wallet...', walletId ? `to ${walletId}` : '');

      // Try Stellar Wallets Kit first
      if (walletKit) {
        try {
          // If walletId is provided, set the wallet
          if (walletId) {
            walletKit.setWallet(walletId);
          } else {
            // If no walletId provided, try to use the first available wallet
            const supportedWallets = await walletKit.getSupportedWallets();
            const availableWallet = supportedWallets.find(w => w.isAvailable);
            
            if (!availableWallet) {
              throw new Error('No wallet available. Please install a Stellar wallet like Freighter.');
            }
            
            console.log('Auto-selecting wallet:', availableWallet.name);
            walletKit.setWallet(availableWallet.id);
          }

          // Get wallet information
          const addressResponse = await walletKit.getAddress();
          const networkResponse = await walletKit.getNetwork();
          
          setCurrentNetwork(networkResponse.network);
          
          const networkConfig = getNetworkConfig(networkResponse.network);
          
          // Get wallet info from the kit's selected module
          const selectedModule = walletKit['selectedModule'];
          const connectedWallet = selectedModule ? {
            id: selectedModule.productId,
            name: selectedModule.productName,
            type: 'unknown',
            icon: selectedModule.productIcon,
            url: selectedModule.productUrl,
          } : null;
          
          setWalletData({
            publicKey: addressResponse.address,
            network: networkResponse.network,
            isConnected: true,
            networkPassphrase: networkResponse.networkPassphrase,
            horizonUrl: networkConfig.horizonUrl,
            isMainnet: networkConfig.isMainnet,
            walletName: connectedWallet?.name || 'Unknown Wallet',
            walletType: connectedWallet?.type || 'unknown',
            walletId: connectedWallet?.id || 'unknown',
            walletIcon: connectedWallet?.icon,
            walletUrl: connectedWallet?.url,
          });
          
          console.log('✅ Wallet connected successfully via Stellar Wallets Kit:', { 
            address: addressResponse.address, 
            network: networkResponse.network,
            wallet: connectedWallet?.name 
          });
          return;
        } catch (kitError) {
          console.log('Stellar Wallets Kit failed, trying fallback...', kitError);
        }
      }

      // Fallback to direct Freighter API
      if (typeof window !== 'undefined' && (window as any).stellar) {
        console.log('🔄 Using direct Freighter API fallback...');
        const stellar = (window as any).stellar;
        
        // Request access to Freighter
        await stellar.requestAccess();
        
        // Get wallet information
        const publicKey = await stellar.getPublicKey();
        const network = await stellar.getNetwork();
        
        setCurrentNetwork(network);
        
        const networkConfig = getNetworkConfig(network);
        setWalletData({
          publicKey,
          network,
          isConnected: true,
          networkPassphrase: networkConfig.passphrase,
          horizonUrl: networkConfig.horizonUrl,
          isMainnet: networkConfig.isMainnet,
          walletName: 'Freighter',
          walletType: 'freighter',
          walletId: 'freighter',
        });
        
        console.log('✅ Wallet connected successfully via Freighter fallback:', { publicKey, network });
      } else {
        throw new Error('No wallet available. Please install Freighter browser extension.');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      const error = new Error(`Failed to connect wallet: ${errorMessage}`);
      setError(error);
      console.error('Wallet connection error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [walletKit]);

  const connectManualAddress = useCallback(async (address: string) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Attempting to connect manual address:', address);

      // For manual addresses, we'll simulate a connection by setting the wallet data directly
      // This is useful for testing or when users want to use a specific address
      const network = 'TESTNET'; // Default to testnet for manual addresses
      setCurrentNetwork(network);
      
      const networkConfig = getNetworkConfig(network);
      setWalletData({
        publicKey: address,
        network,
        isConnected: true,
        networkPassphrase: networkConfig.passphrase,
        horizonUrl: networkConfig.horizonUrl,
        isMainnet: networkConfig.isMainnet,
        walletName: 'Manual Address',
        walletType: 'manual',
        walletId: 'manual',
      });
      
      console.log('✅ Manual address connected successfully:', { address, network });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      const error = new Error(`Failed to connect manual address: ${errorMessage}`);
      setError(error);
      console.error('Manual address connection error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const disconnect = useCallback(async () => {
    try {
      if (walletKit) {
        await walletKit.disconnect();
      }
      setWalletData(null);
      console.log('✅ Wallet disconnected');
    } catch (err) {
      console.error('Error disconnecting wallet:', err);
    }
  }, [walletKit]);

  const signTransaction = useCallback(
    async (xdr: string) => {
      if (!walletKit || !walletData) {
        throw new Error('Wallet not connected');
      }

      try {
        console.log('Signing transaction with wallet...');
        
        const result = await walletKit.signTransaction(xdr, {
          networkPassphrase: walletData.networkPassphrase,
          address: walletData.publicKey,
        });
        
        console.log('✅ Transaction signed successfully');
        return result;
      } catch (err) {
        console.error('Error signing transaction:', err);
        throw err;
      }
    },
    [walletKit, walletData]
  );

  const sendTransaction = useCallback(
    async (signedXdr: string) => {
      // Mock implementation for POC
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));

        const hash = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const contractId = `contract_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        return {
          success: true,
          hash,
          status: 'success',
          message: 'Transaction successful (POC)',
          contractId,
          escrow: {
            id: contractId,
            type: 'multi-release',
            asset: {
              code: assetConfig.defaultAsset.code,
              issuer: assetConfig.defaultAsset.issuer,
              decimals: assetConfig.defaultAsset.decimals,
            },
            amount: '1000000',
            platformFee: assetConfig.platformFee,
            buyer: walletData?.publicKey || '',
            seller: walletData?.publicKey || '',
            arbiter: walletData?.publicKey || '',
            terms: 'POC escrow contract',
            deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            releases: [
              {
                id: `release_${Date.now()}_1`,
                amount: '1000000',
                status: 'pending' as const,
                createdAt: new Date().toISOString(),
              },
            ],
            metadata: {
              description: 'POC escrow contract',
              category: 'demo',
            },
          },
        };
      } catch (err) {
        return {
          success: false,
          status: 'error',
          message: 'Failed to send transaction',
          contractId: '',
          escrow: null,
        };
      }
    },
    [walletData?.publicKey]
  );

  const getAvailableWallets = useCallback(async () => {
    if (!walletKit) {
      return [];
    }
    
    try {
      const supportedWallets = await walletKit.getSupportedWallets();
      return supportedWallets;
    } catch (error) {
      console.error('Error getting available wallets:', error);
    return [];
    }
  }, [walletKit]);

  // Network detection function
  const detectNetworkChange = useCallback(async () => {
    if (!walletKit || !walletData) {
      return;
    }

    try {
      console.log('🔍 Detecting network change...');
      
      // Get current network from wallet kit
      const networkResponse = await walletKit.getNetwork();
      
      if (networkResponse.network !== currentNetwork) {
        console.log(`🔄 Network changed from ${currentNetwork} to ${networkResponse.network}`);
        setCurrentNetwork(networkResponse.network);
        
        // Update wallet data with new network info
        const networkConfig = getNetworkConfig(networkResponse.network);
        setWalletData(prev => prev ? {
          ...prev,
          network: networkResponse.network,
          networkPassphrase: networkResponse.networkPassphrase,
          horizonUrl: networkConfig.horizonUrl,
          isMainnet: networkConfig.isMainnet,
        } : null);
        
        // Dispatch custom event for other components to listen
        window.dispatchEvent(new CustomEvent('networkChanged', {
          detail: {
            network: networkResponse.network,
            isMainnet: networkConfig.isMainnet,
            horizonUrl: networkConfig.horizonUrl,
          }
        }));
      }
    } catch (err) {
      console.error('Error detecting network change:', err);
    }
  }, [walletKit, walletData, currentNetwork]);

  // Network switching function
  const switchNetwork = useCallback(async (network: 'TESTNET' | 'PUBLIC') => {
    if (!walletKit || !walletData) {
      throw new Error('No wallet connected');
    }

    try {
      console.log(`🔄 Switching to ${network} network...`);
      
      // Update the wallet kit network
      const walletNetwork = network === 'TESTNET' ? WalletNetwork.TESTNET : WalletNetwork.PUBLIC;
      
      // Create new kit instance with updated network
      const modules = [
        new FreighterModule(),
        new AlbedoModule(),
        new RabetModule(),
        new LobstrModule(),
      ];
      
      const newKit = new StellarWalletsKit({
        network: walletNetwork,
        modules,
      });
      
      setWalletKit(newKit);
      setCurrentNetwork(network);
      
      // Update wallet data
      const networkConfig = getNetworkConfig(network);
      setWalletData({
        ...walletData,
        network,
        networkPassphrase: networkConfig.passphrase,
        horizonUrl: networkConfig.horizonUrl,
        isMainnet: networkConfig.isMainnet,
      });
      
      // Dispatch custom event
      window.dispatchEvent(new CustomEvent('networkChanged', {
        detail: {
          network,
          isMainnet: networkConfig.isMainnet,
          horizonUrl: networkConfig.horizonUrl,
        }
      }));
      
      console.log(`✅ Successfully switched to ${network} network`);
    } catch (err) {
      console.error('Error switching network:', err);
      throw err;
    }
  }, [walletKit, walletData]);

  // Open wallet modal function
  const openWalletModal = useCallback(async () => {
    if (!walletKit) {
      throw new Error('Wallet kit not initialized');
    }

    try {
      await walletKit.openModal({
        onWalletSelected: async (wallet: ISupportedWallet) => {
          console.log('Wallet selected:', wallet);
          await connect(wallet.id);
        },
        onClosed: (err: Error) => {
          if (err) {
            console.error('Modal closed with error:', err);
          } else {
            console.log('Modal closed');
          }
        },
        modalTitle: 'Connect Wallet',
        notAvailableText: 'Wallet not available',
      });
    } catch (err) {
      console.error('Error opening wallet modal:', err);
      throw err;
    }
  }, [walletKit, connect]);

  // Listen for wallet network changes
  useEffect(() => {
    if (!isFreighterAvailable || !walletData) return;

    // Listen for wallet network change events
    const handleNetworkChange = (event: any) => {
      console.log('📡 Received network change event:', event.detail);
      detectNetworkChange();
    };

    // Listen for Freighter network changes
    window.addEventListener('freighter:networkChanged', handleNetworkChange);
    
    // Also listen for our custom network change events
    window.addEventListener('networkChanged', handleNetworkChange);

    // Periodic network check (every 10 seconds)
    const networkCheckInterval = setInterval(() => {
      if (walletData?.isConnected) {
        detectNetworkChange();
      }
    }, 10000);

    return () => {
      window.removeEventListener('freighter:networkChanged', handleNetworkChange);
      window.removeEventListener('networkChanged', handleNetworkChange);
      clearInterval(networkCheckInterval);
    };
  }, [isFreighterAvailable, walletData, detectNetworkChange]);

  return {
    walletData,
    isConnected: !!walletData?.isConnected,
    isLoading,
    error,
    connect,
    connectManualAddress,
    disconnect,
    signTransaction,
    sendTransaction,
    getAvailableWallets,
    isFreighterAvailable,
    currentNetwork,
    switchNetwork,
    detectNetworkChange,
    walletKit,
    openWalletModal,
  };
};
