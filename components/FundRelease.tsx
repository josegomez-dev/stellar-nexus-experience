'use client';

import { useState } from 'react';
import { useWallet } from '@/lib/stellar-wallet-hooks';
import { useReleaseFunds } from '@/lib/mock-trustless-work';
import { useEscrowContext } from '@/contexts/EscrowContext';
import { MultiReleaseReleaseFundsPayload } from '@/types/trustless-work';

export const FundRelease = () => {
  const { walletData, isConnected, signTransaction, sendTransaction } = useWallet();
  const { escrowData, setEscrowData } = useEscrowContext();
  const { releaseFunds, isLoading, error } = useReleaseFunds();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [releaseResult, setReleaseResult] = useState<{
    success: boolean;
    message: string;
    hash?: string;
    milestoneId?: string;
    amount?: string;
  } | null>(null);

  const handleReleaseFunds = async (milestoneId: string) => {
    if (!isConnected || !walletData?.publicKey) {
      alert('Please connect your wallet first');
      return;
    }

    if (!escrowData) {
      alert('No escrow contract available');
      return;
    }

    setIsSubmitting(true);
    setReleaseResult(null);

    try {
      // Create the MultiReleaseReleaseFundsPayload
      const payload: MultiReleaseReleaseFundsPayload = {
        contractId: escrowData.contractId,
        milestoneId,
        releaseMode: 'multi-release',
      };

      // Step 1: Execute function from Trustless Work
      const escrowResult = await releaseFunds(payload);

      if (!escrowResult) {
        throw new Error('Failed to release funds');
      }

      // Step 2: Sign transaction with wallet
      const signedTransaction = await signTransaction(JSON.stringify(escrowResult.transaction));

      if (!signedTransaction) {
        throw new Error('Failed to sign transaction');
      }

      // Step 3: Send transaction
      const sendResult = await sendTransaction(signedTransaction.signedTxXdr);

      if (sendResult.success) {
        // Update the escrow data in context with the released milestone
        setEscrowData({
          contractId: escrowData.contractId,
          status: escrowData.status,
          message: escrowData.message,
          escrow: escrowResult.escrow,
        });

        // Find the milestone amount for the success message
        const milestone = escrowData.escrow.releases.find(r => r.id === milestoneId);
        const amount = milestone ? milestone.amount : '0';

        setReleaseResult({
          success: true,
          message: `Funds released successfully for milestone ${milestoneId}!`,
          hash: sendResult.hash,
          milestoneId,
          amount,
        });
      } else {
        throw new Error('Failed to send transaction');
      }
    } catch (err) {
      console.error('Error releasing funds:', err);
      setReleaseResult({
        success: false,
        message: err instanceof Error ? err.message : 'Unknown error occurred',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'released':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatAmount = (amount: string, decimals: number) => {
    const numericAmount = parseInt(amount) / decimals;
    return numericAmount.toFixed(6);
  };

  const canReleaseFunds = (milestone: any) => {
    // Only show release button for milestones that are approved
    return milestone.status === 'approved';
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

  return (
    <div className='max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg'>
      <h2 className='text-2xl font-bold text-gray-800 mb-6 text-center'>
        Release Funds for Milestones
      </h2>

      {/* Contract Information */}
      <div className='bg-purple-50 p-4 rounded-md mb-6'>
        <h3 className='font-semibold text-purple-800 mb-3'>Contract Information:</h3>
        <div className='grid grid-cols-2 gap-2 text-sm text-purple-700'>
          <div>
            <span className='font-medium'>Contract ID:</span> {escrowData.contractId}
          </div>
          <div>
            <span className='font-medium'>Asset:</span> {escrowData.escrow.asset.code}
          </div>
          <div>
            <span className='font-medium'>Total Amount:</span>{' '}
            {formatAmount(escrowData.escrow.amount, escrowData.escrow.asset.decimals)}{' '}
            {escrowData.escrow.asset.code}
          </div>
          <div>
            <span className='font-medium'>Milestones:</span> {escrowData.escrow.releases.length}
          </div>
        </div>
      </div>

      {/* Milestones Fund Release */}
      <div className='space-y-6'>
        <h3 className='text-lg font-semibold text-gray-800'>Milestones:</h3>

        {escrowData.escrow.releases.map((milestone, index) => (
          <div key={milestone.id} className='border rounded-lg p-4 bg-gray-50'>
            <div className='flex justify-between items-start mb-4'>
              <div>
                <h4 className='font-medium text-gray-800'>Milestone {index + 1}</h4>
                <p className='text-sm text-gray-600'>ID: {milestone.id}</p>
                <p className='text-sm text-gray-600'>
                  Amount: {formatAmount(milestone.amount, escrowData.escrow.asset.decimals)}{' '}
                  {escrowData.escrow.asset.code}
                </p>
                {milestone.approvedAt && (
                  <p className='text-sm text-green-600'>
                    Approved: {new Date(milestone.approvedAt).toLocaleString()}
                  </p>
                )}
                {milestone.releasedAt && (
                  <p className='text-sm text-blue-600'>
                    Released: {new Date(milestone.releasedAt).toLocaleString()}
                  </p>
                )}
              </div>

              <div className='text-right'>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(milestone.status)}`}
                >
                  {milestone.status.charAt(0).toUpperCase() + milestone.status.slice(1)}
                </span>
              </div>
            </div>

            {/* Release Funds Button */}
            {canReleaseFunds(milestone) && (
              <div className='space-y-2'>
                <h5 className='text-sm font-medium text-gray-700'>Actions:</h5>
                <button
                  onClick={() => handleReleaseFunds(milestone.id)}
                  disabled={isSubmitting || isLoading}
                  className='bg-purple-600 text-white px-4 py-2 text-sm rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {isSubmitting ? 'Releasing Funds...' : 'Release Funds'}
                </button>
              </div>
            )}

            {!canReleaseFunds(milestone) && (
              <div className='text-sm text-gray-500 italic'>
                {milestone.status === 'pending'
                  ? 'Milestone must be approved before funds can be released'
                  : milestone.status === 'released'
                    ? 'Funds already released for this milestone'
                    : 'Milestone cannot have funds released'}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Error Display */}
      {error && (
        <div className='mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded'>
          <strong className='font-bold'>Error: </strong>
          <span className='block sm:inline'>{error.message}</span>
        </div>
      )}

      {/* Release Result */}
      {releaseResult && (
        <div
          className={`mt-6 border rounded-md p-4 ${releaseResult.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}
        >
          {releaseResult.success ? (
            <div>
              <h3 className='font-semibold text-green-800 mb-2'>Funds Released Successfully!</h3>
              <div className='space-y-2'>
                <p className='text-green-700'>{releaseResult.message}</p>
                {releaseResult.milestoneId && (
                  <p className='text-green-700'>
                    <span className='font-medium'>Milestone:</span> {releaseResult.milestoneId}
                  </p>
                )}
                {releaseResult.amount && (
                  <p className='text-green-700'>
                    <span className='font-medium'>Amount Released:</span>{' '}
                    {formatAmount(releaseResult.amount, escrowData.escrow.asset.decimals)}{' '}
                    {escrowData.escrow.asset.code}
                  </p>
                )}
                {releaseResult.hash && (
                  <p className='text-green-700'>
                    <span className='font-medium'>Transaction Hash:</span> {releaseResult.hash}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div>
              <h3 className='font-semibold text-red-800 mb-2'>Fund Release Failed</h3>
              <p className='text-red-700'>{releaseResult.message}</p>
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      <div className='mt-6 text-sm text-gray-600'>
        <h4 className='font-medium text-gray-800 mb-2'>How fund release works:</h4>
        <ul className='list-disc list-inside space-y-1'>
          <li>
            <strong>Pending Milestones:</strong> Must be approved before funds can be released
          </li>
          <li>
            <strong>Approved Milestones:</strong> Can have funds released to the recipient
          </li>
          <li>
            <strong>Released Milestones:</strong> Funds have been transferred to the recipient
          </li>
          <li>
            <strong>Release Process:</strong> Creates a transaction that transfers funds for the
            approved milestone
          </li>
          <li>
            <strong>Fund Transfer:</strong> The milestone amount is sent to the seller/recipient
            address
          </li>
        </ul>
      </div>

      {/* Fund Release Summary */}
      <div className='mt-6 bg-blue-50 p-4 rounded-md'>
        <h4 className='font-medium text-blue-800 mb-2'>Fund Release Summary:</h4>
        <div className='grid grid-cols-2 gap-4 text-sm text-blue-700'>
          <div>
            <span className='font-medium'>Total Escrow Amount:</span>
            <br />
            {formatAmount(escrowData.escrow.amount, escrowData.escrow.asset.decimals)}{' '}
            {escrowData.escrow.asset.code}
          </div>
          <div>
            <span className='font-medium'>Released Amount:</span>
            <br />
            {escrowData.escrow.releases
              .filter(r => r.status === 'released')
              .reduce((sum, r) => sum + parseInt(r.amount), 0) /
              escrowData.escrow.asset.decimals}{' '}
            {escrowData.escrow.asset.code}
          </div>
          <div>
            <span className='font-medium'>Pending Amount:</span>
            <br />
            {escrowData.escrow.releases
              .filter(r => r.status === 'pending' || r.status === 'approved')
              .reduce((sum, r) => sum + parseInt(r.amount), 0) /
              escrowData.escrow.asset.decimals}{' '}
            {escrowData.escrow.asset.code}
          </div>
          <div>
            <span className='font-medium'>Milestones Released:</span>
            <br />
            {escrowData.escrow.releases.filter(r => r.status === 'released').length} of{' '}
            {escrowData.escrow.releases.length}
          </div>
        </div>
      </div>
    </div>
  );
};
