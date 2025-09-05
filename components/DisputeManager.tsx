'use client';

import { useState } from 'react';
import { useWallet } from '@/lib/stellar-wallet-hooks';
import { useStartDispute } from '@/lib/mock-trustless-work';
import { useEscrowContext } from '@/contexts/EscrowContext';
import { MultiReleaseStartDisputePayload } from '@/types/trustless-work';

export const DisputeManager = () => {
  const { walletData, isConnected, signTransaction, sendTransaction } = useWallet();
  const { escrowData, setEscrowData } = useEscrowContext();
  const { startDispute, isLoading, error } = useStartDispute();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [disputeResult, setDisputeResult] = useState<{
    success: boolean;
    message: string;
    hash?: string;
    milestoneId?: string;
    reason?: string;
  } | null>(null);
  const [selectedMilestone, setSelectedMilestone] = useState<string>('');
  const [disputeReason, setDisputeReason] = useState<string>('');

  const handleStartDispute = async () => {
    if (!isConnected || !walletData?.publicKey) {
      alert('Please connect your wallet first');
      return;
    }

    if (!escrowData) {
      alert('No escrow contract available');
      return;
    }

    if (!selectedMilestone) {
      alert('Please select a milestone to dispute');
      return;
    }

    if (!disputeReason.trim()) {
      alert('Please provide a reason for the dispute');
      return;
    }

    setIsSubmitting(true);
    setDisputeResult(null);

    try {
      // Create the MultiReleaseStartDisputePayload
      const payload: MultiReleaseStartDisputePayload = {
        contractId: escrowData.contractId,
        milestoneId: selectedMilestone,
        releaseMode: 'multi-release',
        reason: disputeReason.trim(),
      };

      // Step 1: Execute function from Trustless Work
      const escrowResult = await startDispute(payload);

      if (!escrowResult) {
        throw new Error('Failed to start dispute');
      }

      // Step 2: Sign transaction with wallet
      const signedTransaction = await signTransaction(JSON.stringify(escrowResult.transaction));

      if (!signedTransaction) {
        throw new Error('Failed to sign transaction');
      }

      // Step 3: Send transaction
      const sendResult = await sendTransaction(signedTransaction.signedTxXdr);

      if (sendResult.success) {
        // Update the escrow data in context with the dispute
        setEscrowData({
          contractId: escrowData.contractId,
          status: escrowData.status,
          message: escrowData.message,
          escrow: escrowResult.escrow,
        });

        setDisputeResult({
          success: true,
          message: `Dispute started successfully for milestone ${selectedMilestone}!`,
          hash: sendResult.hash,
          milestoneId: selectedMilestone,
          reason: disputeReason,
        });

        // Reset form
        setSelectedMilestone('');
        setDisputeReason('');
      } else {
        throw new Error('Failed to send transaction');
      }
    } catch (err) {
      console.error('Error starting dispute:', err);
      setDisputeResult({
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
      case 'disputed':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatAmount = (amount: string, decimals: number) => {
    const numericAmount = parseInt(amount) / decimals;
    return numericAmount.toFixed(6);
  };

  const canStartDispute = (milestone: any) => {
    // Can start dispute for milestones that are pending, approved, or released
    // but not already disputed or cancelled
    return ['pending', 'approved', 'released'].includes(milestone.status);
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
      <h2 className='text-2xl font-bold text-gray-800 mb-6 text-center'>Dispute Management</h2>

      {/* Contract Information */}
      <div className='bg-orange-50 p-4 rounded-md mb-6'>
        <h3 className='font-semibold text-orange-800 mb-3'>Contract Information:</h3>
        <div className='grid grid-cols-2 gap-2 text-sm text-orange-700'>
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

      {/* Dispute Form */}
      <div className='bg-gray-50 p-6 rounded-lg mb-6'>
        <h3 className='text-lg font-semibold text-gray-800 mb-4'>Start a Dispute</h3>

        <div className='space-y-4'>
          {/* Milestone Selection */}
          <div>
            <label
              htmlFor='milestone-select'
              className='block text-sm font-medium text-gray-700 mb-2'
            >
              Select Milestone to Dispute:
            </label>
            <select
              id='milestone-select'
              value={selectedMilestone}
              onChange={e => setSelectedMilestone(e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500'
            >
              <option value=''>Choose a milestone...</option>
              {escrowData.escrow.releases.map((milestone, index) => (
                <option
                  key={milestone.id}
                  value={milestone.id}
                  disabled={!canStartDispute(milestone)}
                >
                  Milestone {index + 1} - {milestone.status} -{' '}
                  {formatAmount(milestone.amount, escrowData.escrow.asset.decimals)}{' '}
                  {escrowData.escrow.asset.code}
                </option>
              ))}
            </select>
          </div>

          {/* Dispute Reason */}
          <div>
            <label
              htmlFor='dispute-reason'
              className='block text-sm font-medium text-gray-700 mb-2'
            >
              Dispute Reason:
            </label>
            <textarea
              id='dispute-reason'
              value={disputeReason}
              onChange={e => setDisputeReason(e.target.value)}
              placeholder='Please provide a detailed reason for the dispute...'
              rows={4}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500'
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleStartDispute}
            disabled={isSubmitting || isLoading || !selectedMilestone || !disputeReason.trim()}
            className='w-full bg-orange-600 text-white px-6 py-3 rounded-md hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium'
          >
            {isSubmitting ? 'Starting Dispute...' : 'Start Dispute'}
          </button>
        </div>
      </div>

      {/* Milestones Overview */}
      <div className='space-y-6'>
        <h3 className='text-lg font-semibold text-gray-800'>Milestones Overview:</h3>

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
                {milestone.disputedAt && (
                  <div className='mt-2 p-2 bg-orange-100 rounded border border-orange-200'>
                    <p className='text-sm text-orange-800 font-medium'>
                      Disputed: {new Date(milestone.disputedAt).toLocaleString()}
                    </p>
                    {milestone.disputeReason && (
                      <p className='text-sm text-orange-700 mt-1'>
                        Reason: {milestone.disputeReason}
                      </p>
                    )}
                  </div>
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

            {/* Dispute Status */}
            {milestone.status === 'disputed' && (
              <div className='text-sm text-orange-600 italic'>
                This milestone is currently under dispute and cannot be modified
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

      {/* Dispute Result */}
      {disputeResult && (
        <div
          className={`mt-6 border rounded-md p-4 ${disputeResult.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}
        >
          {disputeResult.success ? (
            <div>
              <h3 className='font-semibold text-green-800 mb-2'>Dispute Started Successfully!</h3>
              <div className='space-y-2'>
                <p className='text-green-700'>{disputeResult.message}</p>
                {disputeResult.milestoneId && (
                  <p className='text-green-700'>
                    <span className='font-medium'>Milestone:</span> {disputeResult.milestoneId}
                  </p>
                )}
                {disputeResult.reason && (
                  <p className='text-green-700'>
                    <span className='font-medium'>Reason:</span> {disputeResult.reason}
                  </p>
                )}
                {disputeResult.hash && (
                  <p className='text-green-700'>
                    <span className='font-medium'>Transaction Hash:</span> {disputeResult.hash}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div>
              <h3 className='font-semibold text-red-800 mb-2'>Dispute Failed</h3>
              <p className='text-red-700'>{disputeResult.message}</p>
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      <div className='mt-6 text-sm text-gray-600'>
        <h4 className='font-medium text-gray-800 mb-2'>How disputes work:</h4>
        <ul className='list-disc list-inside space-y-1'>
          <li>
            <strong>Dispute Eligibility:</strong> Can be started for pending, approved, or released
            milestones
          </li>
          <li>
            <strong>Dispute Process:</strong> Creates a transaction that marks the milestone as
            disputed
          </li>
          <li>
            <strong>Arbitration:</strong> Disputed milestones are sent to the arbiter for resolution
          </li>
          <li>
            <strong>Resolution:</strong> The arbiter can approve, reject, or modify the milestone
          </li>
          <li>
            <strong>Funds Protection:</strong> Disputed milestones cannot have funds released until
            resolved
          </li>
        </ul>
      </div>

      {/* Dispute Summary */}
      <div className='mt-6 bg-orange-50 p-4 rounded-md'>
        <h4 className='font-medium text-orange-800 mb-2'>Dispute Summary:</h4>
        <div className='grid grid-cols-2 gap-4 text-sm text-orange-700'>
          <div>
            <span className='font-medium'>Total Milestones:</span>
            <br />
            {escrowData.escrow.releases.length}
          </div>
          <div>
            <span className='font-medium'>Disputed Milestones:</span>
            <br />
            {escrowData.escrow.releases.filter(r => r.status === 'disputed').length}
          </div>
          <div>
            <span className='font-medium'>Disputable Milestones:</span>
            <br />
            {escrowData.escrow.releases.filter(r => canStartDispute(r)).length}
          </div>
          <div>
            <span className='font-medium'>Last Dispute:</span>
            <br />
            {escrowData.escrow.metadata?.lastDispute
              ? new Date(escrowData.escrow.metadata.lastDispute).toLocaleDateString()
              : 'None'}
          </div>
        </div>
      </div>
    </div>
  );
};
