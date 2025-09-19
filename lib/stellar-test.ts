'use client';

import { loadStellarSDK, getStellarServer, isStellarSDKAvailable } from './stellar-sdk-loader';

// Simple Stellar SDK test to verify functionality
export const testStellarSDK = async () => {
  try {
    console.log('🧪 Testing Stellar SDK functionality...');
    
    if (!isStellarSDKAvailable()) {
      return {
        success: false,
        message: 'Stellar SDK not available in this environment'
      };
    }
    
    const StellarSDK = await loadStellarSDK();
    
    const { Server, Keypair, Networks } = StellarSDK;
    
    // Test 1: Create a random keypair
    const testKeypair = Keypair.random();
    console.log('✅ Keypair generation works:', testKeypair.publicKey());
    
    // Test 2: Connect to Horizon using optimized loader
    const server = await getStellarServer('https://horizon-testnet.stellar.org');
    console.log('✅ Server connection created');
    
    // Test 3: Check network passphrase
    console.log('✅ Testnet passphrase:', Networks.TESTNET);
    
    return {
      success: true,
      message: 'Stellar SDK is working correctly',
      testKeypair: testKeypair.publicKey(),
    };
    
  } catch (error) {
    console.error('❌ Stellar SDK test failed:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
      error,
    };
  }
};

// Test account loading with a known testnet account
export const testAccountLoading = async (publicKey: string) => {
  try {
    console.log('🔍 Testing account loading for:', publicKey);
    
    let StellarSDK: any;
    try {
      StellarSDK = await import('@stellar/stellar-sdk');
    } catch {
      StellarSDK = await import('stellar-sdk');
    }
    
    const { Server } = StellarSDK;
    const server = await getStellarServer('https://horizon-testnet.stellar.org');
    
    const account = await server.loadAccount(publicKey);
    console.log('✅ Account loaded:', {
      accountId: account.accountId(),
      sequence: account.sequenceNumber(),
      balances: account.balances.length
    });
    
    return {
      success: true,
      account,
      balances: account.balances,
    };
    
  } catch (error) {
    console.error('❌ Account loading failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};
