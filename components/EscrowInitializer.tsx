'use client';

import { useState } from 'react';
import { useWallet } from '@/lib/stellar-wallet-hooks';
import { useInitializeEscrow } from '@/lib/mock-trustless-work';
import {
  InitializePayload,
  TransactionResult,
  SendTransactionResponse,
} from '@/types/trustless-work';
import { useEscrowContext } from '@/contexts/EscrowContext';
import { assetConfig, appConfig } from '@/lib/wallet-config';

export const EscrowInitializer = () => {
  const { walletData, isConnected, signTransaction, sendTransaction } = useWallet();
  const { initializeEscrow, isLoading, error } = useInitializeEscrow();
  const { setEscrowData } = useEscrowContext();

  const [transactionResult, setTransactionResult] = useState<TransactionResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInitializeEscrow = async () => {
    if (!isConnected || !walletData?.publicKey) {
      alert('Please connect your wallet first');
      return;
    }

    setIsSubmitting(true);
    setTransactionResult(null);

    try {
      // Create the InitializePayload with the specified requirements
      const payload: InitializePayload = {
        escrowType: 'multi-release',
        releaseMode: 'multi-release',
        asset: {
          code: assetConfig.defaultAsset.code,
          issuer: assetConfig.defaultAsset.issuer,
          decimals: assetConfig.defaultAsset.decimals,
        },
        amount: '1000000', // 0.1 USDC (mock amount)
        platformFee: assetConfig.platformFee,
        buyer: walletData.publicKey,
        seller: walletData.publicKey,
        arbiter: walletData.publicKey,
        terms: 'Sample escrow terms for demonstration purposes',
        deadline: new Date(
          Date.now() + assetConfig.defaultEscrowDeadlineDays * 24 * 60 * 60 * 1000
        ).toISOString(), // Configurable days from now
        metadata: {
          description: 'Sample escrow contract',
          category: 'demo',
        },
      };

      // Step 1: Execute function from Trustless Work
      const escrowResult = await initializeEscrow(payload);

      if (!escrowResult) {
        throw new Error('Failed to initialize escrow');
      }

      // Step 2: Sign transaction with wallet
      const signedTransaction = await signTransaction(JSON.stringify(escrowResult.transaction));

      if (!signedTransaction) {
        throw new Error('Failed to sign transaction');
      }

      // Step 3: Send transaction
      const sendResult: SendTransactionResponse = await sendTransaction(
        signedTransaction.signedTxXdr
      );

      if (sendResult.success) {
        // Store the full escrow response in context
        setEscrowData({
          contractId: sendResult.contractId,
          status: sendResult.status,
          message: sendResult.message,
          escrow: sendResult.escrow,
        });

        setTransactionResult({
          success: true,
          contractId: sendResult.contractId,
          hash: sendResult.hash,
        });
      } else {
        throw new Error('Failed to send transaction');
      }
    } catch (err) {
      console.error('Error initializing escrow:', err);
      setTransactionResult({
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error occurred',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStellarViewerUrl = (contractId: string) => {
    return `https://stellar.expert/explorer/testnet/contract/${contractId}`;
  };

  if (!isConnected) {
    return (
      <div className='max-w-md mx-auto p-6 bg-yellow-50 border border-yellow-200 rounded-lg'>
        <p className='hidden sm:block text-yellow-800 text-center'>
          Please connect your wallet to initialize escrow contracts
        </p>
      </div>
    );
  }

  return (
    <div className='max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg'>
      <h2 className='text-2xl font-bold text-gray-800 mb-6 text-center'>
        Initialize Escrow Contract
      </h2>

      {/* Configuration Display */}
      <div className='bg-gray-50 p-4 rounded-md mb-6'>
        <h3 className='font-semibold text-gray-800 mb-3'>Configuration:</h3>
        <div className='grid grid-cols-2 gap-2 text-sm text-gray-600'>
          <div>
            <span className='font-medium'>Asset:</span> {assetConfig.defaultAsset.code}
          </div>
          <div>
            <span className='font-medium'>Issuer:</span>{' '}
            {assetConfig.defaultAsset.issuer.slice(0, 20)}...
          </div>
          <div>
            <span className='font-medium'>Decimals:</span>{' '}
            {assetConfig.defaultAsset.decimals.toLocaleString()}
          </div>
          <div>
            <span className='font-medium'>Platform Fee:</span> {assetConfig.platformFee}%
          </div>
          <div>
            <span className='font-medium'>Release Mode:</span> Multi-release
          </div>
          <div>
            <span className='font-medium'>Wallet Address:</span>{' '}
            {walletData?.publicKey?.slice(0, 8)}...{walletData?.publicKey?.slice(-8)}
          </div>
        </div>
      </div>

      {/* Initialize Button */}
      <div className='text-center mb-6'>
        <button
          onClick={handleInitializeEscrow}
          disabled={isSubmitting || isLoading}
          className='bg-blue-600 text-white py-3 px-8 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-lg font-medium'
        >
          {isSubmitting ? 'Initializing...' : isLoading ? 'Loading...' : 'Initialize Escrow'}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>
          <strong className='font-bold'>Error: </strong>
          <span className='block sm:inline'>{error.message}</span>
        </div>
      )}

      {/* Transaction Result */}
      {transactionResult && (
        <div
          className={`border rounded-md p-4 ${transactionResult.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}
        >
          {transactionResult.success ? (
            <div>
              <h3 className='font-semibold text-green-800 mb-2'>
                Escrow Initialized Successfully!
              </h3>
              <div className='space-y-2'>
                <p className='text-green-700'>
                  <span className='font-medium'>Contract ID:</span> {transactionResult.contractId}
                </p>
                {transactionResult.hash && (
                  <p className='text-green-700'>
                    <span className='font-medium'>Transaction Hash:</span> {transactionResult.hash}
                  </p>
                )}
                <div className='pt-2'>
                  <a
                    href={getStellarViewerUrl(transactionResult.contractId!)}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='inline-flex items-center text-blue-600 hover:text-blue-800 font-medium'
                  >
                    View in Stellar Viewer
                    <svg
                      className='w-4 h-4 ml-1'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <h3 className='font-semibold text-red-800 mb-2'>Initialization Failed</h3>
              <p className='text-red-700'>{transactionResult.error}</p>
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      <div className='mt-6 text-sm text-gray-600'>
        <h4 className='font-medium text-gray-800 mb-2'>What happens when you click Initialize:</h4>
        <ol className='list-decimal list-inside space-y-1'>
          <li>Trustless Work creates the escrow contract</li>
          <li>Your wallet signs the transaction</li>
          <li>Transaction is sent to the Stellar network</li>
          <li>Contract ID is displayed with a link to Stellar Viewer</li>
        </ol>
      </div>
    </div>
  );
};
