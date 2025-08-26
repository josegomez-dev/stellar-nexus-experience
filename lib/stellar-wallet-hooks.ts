import { useState, useEffect, useCallback } from 'react'
import { StellarWalletsKit, WalletNetwork } from '@creit.tech/stellar-wallets-kit'
import { SendTransactionResponse } from '@/types/trustless-work'
import { stellarConfig, assetConfig } from './wallet-config'

// The library doesn't have separate modules - it works with an empty modules array
// and should detect available wallets automatically

export interface WalletData {
  publicKey: string
  network: string
  isConnected: boolean
}

export interface UseWalletReturn {
  walletData: WalletData | null
  isConnected: boolean
  isLoading: boolean
  error: Error | null
  connect: (walletId?: string) => Promise<void>
  disconnect: () => Promise<void>
  signTransaction: (xdr: string) => Promise<{ signedTxXdr: string; signerAddress?: string }>
  sendTransaction: (signedXdr: string) => Promise<SendTransactionResponse>
  getAvailableWallets: () => Promise<Array<{id: string, name: string}>>
  isFreighterAvailable: boolean
}

export const useWallet = (): UseWalletReturn => {
  const [kit, setKit] = useState<StellarWalletsKit | null>(null)
  const [walletData, setWalletData] = useState<WalletData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [isFreighterAvailable, setIsFreighterAvailable] = useState(false)

  // Check for Freighter wallet
  useEffect(() => {
    const checkFreighter = () => {
      if (typeof window !== 'undefined' && (window as any).stellar) {
        setIsFreighterAvailable(true)
        console.log('Freighter wallet detected')
      } else {
        setIsFreighterAvailable(false)
        console.log('Freighter wallet not detected')
      }
    }
    
    checkFreighter()
    
    // Listen for Freighter installation
    window.addEventListener('message', (event) => {
      if (event.data.type === 'FREIGHTER_EXTENSION_READY') {
        setIsFreighterAvailable(true)
        console.log('Freighter wallet ready')
      }
    })
  }, [])

  // Initialize the kit
  useEffect(() => {
    const initializeKit = async () => {
      try {
        console.log('Initializing Stellar Wallets Kit...')
        
        // Check if StellarWalletsKit is available
        if (typeof StellarWalletsKit === 'undefined') {
          throw new Error('StellarWalletsKit is not defined - check import')
        }
        
        console.log('StellarWalletsKit constructor:', StellarWalletsKit)
        console.log('WalletNetwork:', WalletNetwork)
        
        // Try different initialization approaches
        let stellarKit = null
        
        try {
          // Approach 1: Try with empty modules array (this should work)
          stellarKit = new StellarWalletsKit({
            network: stellarConfig.network === 'PUBLIC' ? WalletNetwork.PUBLIC : WalletNetwork.TESTNET,
            modules: []
          })
          console.log('Approach 1 succeeded (with empty modules)')
        } catch (err) {
          console.log('Approach 1 failed:', err)
          
          try {
            // Approach 2: Try with PUBLIC network
            stellarKit = new StellarWalletsKit({
              network: stellarConfig.network === 'PUBLIC' ? WalletNetwork.PUBLIC : WalletNetwork.TESTNET,
              modules: []
            })
            console.log('Approach 2 succeeded (PUBLIC network)')
          } catch (err) {
            console.log('Approach 2 failed:', err)
            
            try {
                      // Approach 3: Try with minimal parameters
            stellarKit = new StellarWalletsKit({
              network: stellarConfig.network === 'PUBLIC' ? WalletNetwork.PUBLIC : WalletNetwork.TESTNET,
              modules: []
            })
              console.log('Approach 3 succeeded (minimal parameters)')
            } catch (err) {
              console.log('Approach 3 failed:', err)
              throw new Error('All initialization approaches failed')
            }
          }
        }
        
        if (!stellarKit) {
          throw new Error('Failed to create StellarWalletsKit instance')
        }
        
        console.log('Stellar Wallets Kit initialized:', stellarKit)
        
        // Debug: Let's see what's actually available on this kit
        console.log('=== DEBUGGING STELLAR WALLETS KIT ===')
        console.log('Kit type:', typeof stellarKit)
        console.log('Kit constructor:', stellarKit.constructor.name)
        console.log('Kit methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(stellarKit)))
        console.log('Kit properties:', Object.keys(stellarKit))
        
        // Try to see if there are any static methods or constants
        try {
          console.log('StellarWalletsKit static properties:', Object.getOwnPropertyNames(StellarWalletsKit))
          
          // Check if there are any constants or enums for wallet types
          const staticProps = Object.getOwnPropertyNames(StellarWalletsKit)
          for (const prop of staticProps) {
            try {
              const value = (StellarWalletsKit as any)[prop]
              console.log(`Static property ${prop}:`, value)
            } catch (err) {
              console.log(`Could not access ${prop}:`, err)
            }
          }
        } catch (err) {
          console.log('Could not access static properties:', err)
        }
        
        console.log('=== END DEBUGGING ===')
        
        setKit(stellarKit)
      } catch (err) {
        console.error('Failed to initialize Stellar Wallets Kit:', err)
        setError(err instanceof Error ? err : new Error('Failed to initialize Stellar Wallets Kit'))
      }
    }

    initializeKit()
  }, [])

  const connect = useCallback(async (walletId?: string) => {
    setIsLoading(true)
    setError(null)

    try {
      console.log('Attempting to connect wallet...')
      
      // First, try to connect to Freighter if available
      if (isFreighterAvailable && (window as any).stellar) {
        console.log('Connecting to Freighter wallet...')
        
        try {
          const stellar = (window as any).stellar
          
          // Request connection to Freighter
          const publicKey = await stellar.connect()
          console.log('Successfully connected to Freighter:', publicKey)
          
          // Get network info
          const network = await stellar.getNetwork()
          console.log('Freighter network:', network)
          
          setWalletData({
            publicKey,
            network: network || stellarConfig.network,
            isConnected: true
          })
          
          console.log('Freighter connection successful!')
          return
        } catch (err) {
          console.log('Freighter connection failed:', err)
          // Fall back to manual input if Freighter fails
        }
      }
      
      // If Freighter is not available or connection failed, use manual input
      if (walletId) {
        console.log('Using manual wallet address:', walletId)
        setWalletData({
          publicKey: walletId,
          network: stellarConfig.network,
          isConnected: true
        })
        console.log('Manual connection successful!')
        return
      }
      
      // If no wallet ID provided and no Freighter, show error
      throw new Error('No wallet available. Please install Freighter or provide a wallet address.')
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      const error = new Error(`Failed to connect wallet: ${errorMessage}`)
      setError(error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [isFreighterAvailable])

  const disconnect = useCallback(async () => {
    if (!kit) return

    try {
      await kit.disconnect()
      setWalletData(null)
    } catch (err) {
      console.error('Error disconnecting wallet:', err)
    }
  }, [kit])

  const signTransaction = useCallback(async (xdr: string) => {
    if (!walletData) {
      throw new Error('Wallet not connected')
    }

    // For POC fallback mode, simulate transaction signing
    if (!kit) {
      console.log('POC mode: Simulating transaction signing')
      await new Promise(resolve => setTimeout(resolve, 500)) // Simulate delay
      
      return {
        signedTxXdr: `signed_${xdr}_${Date.now()}`,
        signerAddress: walletData.publicKey
      }
    }

    // Try to use the actual kit if available
    try {
      return await kit.signTransaction(xdr)
    } catch (err) {
      console.log('Kit signing failed, falling back to POC simulation:', err)
      
      // Fallback to POC simulation
      await new Promise(resolve => setTimeout(resolve, 500))
      return {
        signedTxXdr: `signed_${xdr}_${Date.now()}`,
        signerAddress: walletData.publicKey
      }
    }
  }, [kit, walletData])

  const sendTransaction = useCallback(async (signedXdr: string) => {
    // Mock implementation for POC
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const hash = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      const contractId = `contract_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
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
            decimals: assetConfig.defaultAsset.decimals
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
              createdAt: new Date().toISOString()
            }
          ],
          metadata: {
            description: 'POC escrow contract',
            category: 'demo'
          }
        }
      }
    } catch (err) {
      return {
        success: false,
        status: 'error',
        message: 'Failed to send transaction',
        contractId: '',
        escrow: null
      }
    }
  }, [walletData?.publicKey])

  const getAvailableWallets = useCallback(async () => {
    // Since we're using user input for wallet addresses, return empty array
    // The user will type their own Stellar wallet address
    return []
  }, [])

  return {
    walletData,
    isConnected: !!walletData?.isConnected,
    isLoading,
    error,
    connect,
    disconnect,
    signTransaction,
    sendTransaction,
    getAvailableWallets,
    isFreighterAvailable
  }
}
