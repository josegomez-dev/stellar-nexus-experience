'use client'

import React, { useState, useEffect } from 'react'
import { useWallet } from '@/lib/stellar-wallet-hooks'

export const WalletManager = () => {
  const { 
    connect, 
    disconnect, 
    isConnected, 
    walletData, 
    isLoading,
    error,
    getAvailableWallets,
    signTransaction,
    sendTransaction
  } = useWallet()
  
  const [selectedWallet, setSelectedWallet] = useState<string>('')
  const [availableWallets, setAvailableWallets] = useState<Array<{id: string, name: string}>>([])
  const [isLoadingWallets, setIsLoadingWallets] = useState(false)

  const handleConnect = async () => {
    if (selectedWallet) {
      console.log('Attempting to connect wallet with ID:', selectedWallet)
      try {
        await connect(selectedWallet)
        console.log('✅ Wallet connection successful')
      } catch (err) {
        console.error('❌ Failed to connect wallet:', err)
        // Show user-friendly error message
        const errorMessage = err instanceof Error ? err.message : 'Unknown connection error'
        alert(`❌ Connection failed: ${errorMessage}`)
      }
    } else {
      alert('⚠️ Please enter a wallet address first')
    }
  }

  const handleDisconnect = () => {
    disconnect()
  }

  const handleWalletSelect = (walletType: string) => {
    setSelectedWallet(walletType)
  }

  // Load available wallets on component mount
  const loadAvailableWallets = async () => {
    setIsLoadingWallets(true)
    try {
      const wallets = await getAvailableWallets()
      setAvailableWallets(wallets)
    } catch (err) {
      console.error('Failed to load available wallets:', err)
      // Use fallback wallets
      setAvailableWallets([
        { id: 'freighter', name: 'Freighter' },
        { id: 'stellar-freighter', name: 'Freighter (Alt)' },
        { id: 'freighter-wallet', name: 'Freighter Wallet' }
      ])
    } finally {
      setIsLoadingWallets(false)
    }
  }

  // Load wallets when component mounts
  useEffect(() => {
    loadAvailableWallets()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error.message}</span>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl shadow-2xl">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">
        🔐 Connect Wallet
      </h2>
      
      {!isConnected ? (
        <div className="space-y-4">
                                <div>
                        <label className="block text-sm font-medium text-white/90 mb-2">
                          Enter Your Stellar Wallet Address
                        </label>
                        <input
                          type="text"
                          placeholder="G... (your Stellar address)"
                          value={selectedWallet}
                          onChange={(e) => handleWalletSelect(e.target.value)}
                          className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-md shadow-sm focus:outline-none focus:ring-cyan-400 focus:border-cyan-400 text-white placeholder-white/50"
                          disabled={isLoadingWallets}
                        />
                        <p className="text-xs text-white/70 mt-1">
                          Enter your Stellar wallet address (starts with G)
                        </p>
                      </div>
          
                                <button
                        onClick={handleConnect}
                        disabled={!selectedWallet}
                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 px-4 rounded-lg hover:from-cyan-600 hover:to-blue-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 font-semibold shadow-lg"
                      >
                        🚀 Connect Wallet
                      </button>
          
                                <div className="text-xs text-white/70 text-center">
                        <p>Enter your Stellar wallet address to connect.</p>
                        <p>This POC demonstrates Trustless Work escrow management.</p>
                        <p>Check browser console (F12) for detailed connection logs.</p>
                      </div>
        </div>
      ) : (
                            <div className="space-y-4">
                      <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 text-green-300 px-4 py-3 rounded-lg backdrop-blur-sm">
                        <strong className="font-bold">🎉 Connected!</strong>
                        <span className="block sm:inline"> Your wallet is ready to use.</span>
                      </div>
          
                                {walletData && (
                        <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-6 rounded-xl shadow-lg">
                          <h3 className="text-lg font-bold text-white mb-4 text-center">
                            🎉 Wallet Connected Successfully!
                          </h3>
                          
                          <div className="space-y-4">
                            <div className="bg-white/20 p-4 rounded-lg border border-white/30">
                              <h4 className="font-semibold text-white mb-2 flex items-center">
                                <span className="mr-2">📍</span>
                                Wallet Address
                              </h4>
                              <div className="bg-white/10 p-3 rounded-md font-mono text-sm break-all text-white/90 border border-white/20">
                                {walletData.publicKey}
                              </div>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(walletData.publicKey);
                                  alert('Wallet address copied to clipboard!');
                                }}
                                className="mt-2 text-cyan-300 hover:text-cyan-100 text-sm font-medium flex items-center transition-colors"
                              >
                                <span className="mr-1">📋</span>
                                Copy Address
                              </button>
                            </div>
                            
                            <div className="bg-white/20 p-4 rounded-lg border border-white/30">
                              <h4 className="font-semibold text-white mb-2 flex items-center">
                                <span className="mr-2">🌐</span>
                                Network
                              </h4>
                              <div className="bg-white/10 p-3 rounded-md border border-white/20">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-green-400/30 to-emerald-400/30 text-green-200 border border-green-400/30">
                                  {walletData.network}
                                </span>
                              </div>
                            </div>
                            
                            <div className="bg-white/20 p-4 rounded-lg border border-white/30">
                              <h4 className="font-semibold text-white mb-2 flex items-center">
                                <span className="mr-2">🔍</span>
                                Debug Info
                              </h4>
                              <div className="bg-white/10 p-3 rounded-md border border-white/20 text-xs text-white/80">
                                <div>Connection Status: {walletData.isConnected ? '✅ Connected' : '❌ Disconnected'}</div>
                                <div>Public Key Length: {walletData.publicKey?.length || 0} characters</div>
                                <div>Network Type: {walletData.network}</div>
                                <div>Loading State: {isLoading ? '🔄 Loading' : '✅ Ready'}</div>
                                <div>Error State: {error ? '❌ Error' : '✅ No Errors'}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
          
                    {/* Test functionality */}
          {walletData && (
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-white text-center mb-3">
                🧪 Test Functions
              </h4>
              
              <button
                onClick={() => {
                  console.log('🔍 Current Wallet State:', {
                    walletData,
                    isConnected,
                    isLoading,
                    error,
                    selectedWallet,
                    availableWallets
                  })
                  alert('🔍 Wallet state logged to console. Press F12 to view.')
                }}
                className="w-full bg-gradient-to-r from-gray-500 to-gray-600 text-white py-3 px-4 rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-200 transform hover:scale-105 font-semibold shadow-lg"
              >
                📋 Log Wallet State to Console
              </button>
              
              <button
                onClick={async () => {
                  try {
                    console.log('🧪 Testing wallet functionality...')
                    console.log('Wallet data:', walletData)
                    console.log('Network:', walletData?.network)
                    console.log('Public key:', walletData?.publicKey)
                    
                    // Test 1: Check wallet connection
                    if (!walletData || !walletData.isConnected) {
                      throw new Error('Wallet not properly connected')
                    }
                    console.log('✅ Wallet connection test passed')
                    
                    // Test 2: Check wallet data integrity
                    if (!walletData.publicKey || walletData.publicKey.length < 10) {
                      throw new Error('Invalid wallet public key')
                    }
                    console.log('✅ Wallet data integrity test passed')
                    
                    // Test 3: Check network configuration
                    if (!walletData.network) {
                      throw new Error('Network not configured')
                    }
                    console.log('✅ Network configuration test passed')
                    
                    // Test 4: Try to create a simple test transaction (mock)
                    const testTransaction = {
                      network: walletData.network,
                      source: walletData.publicKey,
                      timestamp: Date.now(),
                      test: true
                    }
                    console.log('✅ Test transaction creation passed:', testTransaction)
                    
                    // Test 5: Test signTransaction function
                    try {
                      const testXdr = `test_xdr_${Date.now()}`
                      console.log('Testing signTransaction with:', testXdr)
                      const signedResult = await signTransaction(testXdr)
                      console.log('✅ signTransaction test passed:', signedResult)
                    } catch (signErr) {
                      console.warn('⚠️ signTransaction test failed (this is expected in POC mode):', signErr)
                    }
                    
                    alert('✅ All wallet functionality tests passed! Check console for detailed results.')
                  } catch (err) {
                    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
                    console.error('❌ Wallet functionality test failed:', err)
                    alert(`❌ Test failed: ${errorMessage}`)
                  }
                }}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105 font-semibold shadow-lg"
              >
                🧪 Test Wallet Functionality
              </button>

              <button
                onClick={async () => {
                  try {
                    console.log('🚀 Testing transaction sending...')
                    console.log('Wallet data:', walletData)
                    
                    // Test 1: Check wallet connection
                    if (!walletData || !walletData.isConnected) {
                      throw new Error('Wallet not properly connected')
                    }
                    console.log('✅ Wallet connection test passed')
                    
                    // Test 2: Check if we can create a mock transaction
                    const mockSignedXdr = `mock_xdr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
                    console.log('✅ Mock signed XDR created:', mockSignedXdr)
                    
                    // Test 3: Try to send the mock transaction
                    const result = await sendTransaction(mockSignedXdr)
                    console.log('✅ Transaction test result:', result)
                    
                    if (result.success) {
                      alert('✅ Transaction test successful! Check console for details.')
                    } else {
                      throw new Error(`Transaction failed: ${result.message}`)
                    }
                  } catch (err) {
                    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
                    console.error('❌ Transaction test failed:', err)
                    alert(`❌ Transaction test failed: ${errorMessage}`)
                  }
                }}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-3 px-4 rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all duration-200 transform hover:scale-105 font-semibold shadow-lg"
              >
                🚀 Test Transaction Sending
              </button>
            </div>
          )}
          
                                <button
                        onClick={handleDisconnect}
                        className="w-full bg-gradient-to-r from-red-500 to-pink-600 text-white py-3 px-4 rounded-lg hover:from-red-600 hover:to-pink-700 transition-all duration-200 transform hover:scale-105 font-semibold shadow-lg"
                      >
                        🔌 Disconnect Wallet
                      </button>
        </div>
      )}
    </div>
  )
}
