import { useState, useEffect, useCallback } from 'react'
import { SendTransactionResponse } from '@/types/trustless-work'
import { stellarConfig, assetConfig } from './wallet-config'
import { validateStellarAddress } from './stellar-address-validation'

// POC Mode - No Stellar Wallets Kit initialization to avoid custom element conflicts
const POC_MODE = process.env.NODE_ENV === 'development'

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
  const [walletData, setWalletData] = useState<WalletData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [isFreighterAvailable, setIsFreighterAvailable] = useState(false)

  // Check for Freighter wallet (but don't use Stellar Wallets Kit)
  useEffect(() => {
    const checkFreighter = () => {
      if (typeof window !== 'undefined' && (window as any).stellar) {
        setIsFreighterAvailable(true)
        console.log('Freighter wallet detected (POC mode)')
      } else {
        setIsFreighterAvailable(false)
        console.log('Freighter wallet not detected (POC mode)')
      }
    }
    
    checkFreighter()
    
    // Listen for Freighter installation
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'FREIGHTER_EXTENSION_READY') {
        setIsFreighterAvailable(true)
        console.log('Freighter wallet ready (POC mode)')
      }
    }
    
    window.addEventListener('message', handleMessage)
    
    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [])

  const connect = useCallback(async (walletId?: string) => {
    setIsLoading(true)
    setError(null)

    try {
      console.log('Attempting to connect wallet (POC mode)...')
      
      // Validate the Stellar address format
      if (walletId) {
        const validation = validateStellarAddress(walletId)
        if (!validation.isValid) {
          throw new Error(validation.error || 'Invalid Stellar address format')
        }
        
        console.log('Using manual wallet address:', walletId)
        setWalletData({
          publicKey: walletId,
          network: stellarConfig.network,
          isConnected: true
        })
        console.log('Manual connection successful!')
        return
      }
      
      // If no wallet ID provided, show error
      throw new Error('Please provide a Stellar wallet address to connect.')
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      const error = new Error(`Failed to connect wallet: ${errorMessage}`)
      setError(error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  const disconnect = useCallback(async () => {
    try {
      setWalletData(null)
      console.log('Wallet disconnected (POC mode)')
    } catch (err) {
      console.error('Error disconnecting wallet:', err)
    }
  }, [])

  const signTransaction = useCallback(async (xdr: string) => {
    if (!walletData) {
      throw new Error('Wallet not connected')
    }

    console.log('POC mode: Simulating transaction signing')
    await new Promise(resolve => setTimeout(resolve, 500)) // Simulate delay
    
    return {
      signedTxXdr: `signed_${xdr}_${Date.now()}`,
      signerAddress: walletData.publicKey
    }
  }, [walletData])

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
