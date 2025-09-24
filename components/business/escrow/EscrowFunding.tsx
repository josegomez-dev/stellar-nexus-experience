'use client';

import { useState } from 'react';
import { useWallet } from '@/lib/stellar-wallet-hooks';
import { useFundEscrow } from '@/lib/mock-trustless-work';
import { useEscrowContext } from '@/contexts/EscrowContext';
import { FundEscrowPayload } from '@/types/trustless-work';

export const EscrowFunding = () => {
  const { walletData, isConnected, signTransaction, sendTransaction } = useWallet();
  const { escrowData, setEscrowData } = useEscrowContext();
  const { fundEscrow, isLoading, error } = useFundEscrow();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fundingResult, setFundingResult] = useState<{
    success: boolean;
    message: string;
    hash?: string;
  } | null>(null);

  const handleFundEscrow = async () => {
    if (!isConnected || !walletData?.publicKey) {
      alert('Please connect your wallet first');
      return;
    }

    if (!escrowData) {
      alert('No escrow contract available to fund');
      return;
    }

    setIsSubmitting(true);
    setFundingResult(null);

    try {
      // Calculate total amount from releases (milestones)
      const totalAmount = escrowData.escrow.releases
        .reduce((sum, release) => {
          return sum + parseInt(release.amount);
        }, 0)
        .toString();

      // Create the FundEscrowPayload
      const payload: FundEscrowPayload = {
        contractId: escrowData.contractId,
        amount: totalAmount,
        releaseMode: 'multi-release',
      };

      // Step 1: Execute function from Trustless Work
      const escrowResult = await fundEscrow(payload);

      if (!escrowResult) {
        throw new Error('Failed to fund escrow');
      }

      // Step 2: Sign transaction with wallet
      const signedTransaction = await signTransaction(JSON.stringify(escrowResult.transaction));

      if (!signedTransaction) {
        throw new Error('Failed to sign transaction');
      }

      // Step 3: Send transaction
      const sendResult = await sendTransaction(signedTransaction.signedTxXdr);

      if (sendResult.success) {
        // Update the escrow data in context with the funded escrow
        setEscrowData({
          contractId: escrowData.contractId,
          status: 'funded',
          message: 'Escrow successfully funded',
          escrow: escrowResult.escrow,
        });

        setFundingResult({
          success: true,
          message: 'Escrow funded successfully!',
          hash: sendResult.hash,
        });
      } else {
        throw new Error('Failed to send transaction');
      }
    } catch (err) {
      console.error('Error funding escrow:', err);
      setFundingResult({
        success: false,
        message: err instanceof Error ? err.message : 'Unknown error occurred',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!escrowData) {
    return (
      <div className='max-w-md mx-auto p-6 bg-gray-50 border border-gray-200 rounded-lg'>
        <p className='text-gray-600 text-center'>
          No escrow contract available. Please initialize an escrow first.
        </p>
      </div>
    );
  }

  // Calculate total amount from releases
  const totalAmount = escrowData.escrow.releases.reduce((sum, release) => {
    return sum + parseInt(release.amount);
  }, 0);

  const formatAmount = (amount: number, decimals: number) => {
    return (amount / decimals).toFixed(6);
  };

  return (
    <div className='max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg'>
      <h2 className='text-2xl font-bold text-gray-800 mb-6 text-center'>Fund Escrow Contract</h2>

      {/* Current Escrow Info */}
      <div className='bg-blue-50 p-4 rounded-md mb-6'>
        <h3 className='font-semibold text-blue-800 mb-3'>Contract to Fund:</h3>
        <div className='grid grid-cols-2 gap-2 text-sm text-blue-700'>
          <div>
            <span className='font-medium'>Contract ID:</span> {escrowData.contractId}
          </div>
          <div>
            <span className='font-medium'>Total Amount:</span>{' '}
            {formatAmount(totalAmount, escrowData.escrow.asset.decimals)}{' '}
            {escrowData.escrow.asset.code}
          </div>
          <div>
            <span className='font-medium'>Release Mode:</span> Multi-release
          </div>
          <div>
            <span className='font-medium'>Milestones:</span> {escrowData.escrow.releases.length}
          </div>
        </div>
      </div>

      {/* Milestone Breakdown */}
      <div className='bg-gray-50 p-4 rounded-md mb-6'>
        <h3 className='font-semibold text-gray-800 mb-3'>Milestone Breakdown:</h3>
        <div className='space-y-2'>
          {escrowData.escrow.releases.map((release, index) => (
            <div
              key={release.id}
              className='flex justify-between items-center bg-white p-2 rounded border'
            >
              <span className='text-sm font-medium'>Milestone {index + 1}:</span>
              <span className='text-sm text-gray-600'>
                {formatAmount(parseInt(release.amount), escrowData.escrow.asset.decimals)}{' '}
                {escrowData.escrow.asset.code}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Fund Button */}
      <div className='text-center mb-6'>
        <button
          onClick={handleFundEscrow}
          disabled={isSubmitting || isLoading}
          className='bg-green-600 text-white py-3 px-8 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-lg font-medium'
        >
          {isSubmitting ? 'Funding...' : isLoading ? 'Loading...' : 'Fund Escrow'}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>
          <strong className='font-bold'>Error: </strong>
          <span className='block sm:inline'>{error.message}</span>
        </div>
      )}

      {/* Funding Result */}
      {fundingResult && (
        <div
          className={`border rounded-md p-4 ${fundingResult.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}
        >
          {fundingResult.success ? (
            <div>
              <h3 className='font-semibold text-green-800 mb-2'>Funding Successful!</h3>
              <div className='space-y-2'>
                <p className='text-green-700'>{fundingResult.message}</p>
                {fundingResult.hash && (
                  <p className='text-green-700'>
                    <span className='font-medium'>Transaction Hash:</span> {fundingResult.hash}
                  </p>
                )}
                <p className='text-green-700'>
                  <span className='font-medium'>Amount Funded:</span>{' '}
                  {formatAmount(totalAmount, escrowData.escrow.asset.decimals)}{' '}
                  {escrowData.escrow.asset.code}
                </p>
              </div>
            </div>
          ) : (
            <div>
              <h3 className='font-semibold text-red-800 mb-2'>Funding Failed</h3>
              <p className='text-red-700'>{fundingResult.message}</p>
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      <div className='mt-6 text-sm text-gray-600'>
        <h4 className='font-medium text-gray-800 mb-2'>What happens when you click Fund:</h4>
        <ol className='list-decimal list-inside space-y-1'>
          <li>Trustless Work creates the funding transaction</li>
          <li>Your wallet signs the transaction</li>
          <li>Transaction is sent to the Stellar network</li>
          <li>Escrow is funded with the total milestone amount</li>
        </ol>
      </div>
    </div>
  );
};
