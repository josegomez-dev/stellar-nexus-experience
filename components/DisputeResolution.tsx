'use client';

import { useState } from 'react';
import { useWallet } from '@/lib/stellar-wallet-hooks';
import { useResolveDispute } from '@/lib/mock-trustless-work';
import { useEscrowContext } from '@/contexts/EscrowContext';
import { MultiReleaseResolveDisputePayload } from '@/types/trustless-work';

export const DisputeResolution = () => {
  const { walletData, isConnected, signTransaction, sendTransaction } = useWallet();
  const { escrowData, setEscrowData } = useEscrowContext();
  const { resolveDispute, isLoading, error } = useResolveDispute();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resolutionResult, setResolutionResult] = useState<{
    success: boolean;
    message: string;
    hash?: string;
    milestoneId?: string;
    resolution?: string;
    reason?: string;
  } | null>(null);
  const [selectedMilestone, setSelectedMilestone] = useState<string>('');
  const [resolution, setResolution] = useState<'approve' | 'reject' | 'modify'>('approve');
  const [resolutionReason, setResolutionReason] = useState<string>('');

  const handleResolveDispute = async () => {
    if (!isConnected || !walletData?.publicKey) {
      alert('Please connect your wallet first');
      return;
    }

    if (!escrowData) {
      alert('No escrow contract available');
      return;
    }

    if (!selectedMilestone) {
      alert('Please select a milestone to resolve');
      return;
    }

    if (resolution === 'modify' && !resolutionReason.trim()) {
      alert('Please provide a reason for modification');
      return;
    }

    setIsSubmitting(true);
    setResolutionResult(null);

    try {
      // Create the MultiReleaseResolveDisputePayload
      const payload: MultiReleaseResolveDisputePayload = {
        contractId: escrowData.contractId,
        milestoneId: selectedMilestone,
        releaseMode: 'multi-release',
        resolution,
        reason: resolutionReason.trim() || undefined,
      };

      // Step 1: Execute function from Trustless Work
      const escrowResult = await resolveDispute(payload);

      if (!escrowResult) {
        throw new Error('Failed to resolve dispute');
      }

      // Step 2: Sign transaction with wallet
      const signedTransaction = await signTransaction(JSON.stringify(escrowResult.transaction));

      if (!signedTransaction) {
        throw new Error('Failed to sign transaction');
      }

      // Step 3: Send transaction
      const sendResult = await sendTransaction(signedTransaction.signedTxXdr);

      if (sendResult.success) {
        // Update the escrow data in context with the resolved dispute
        setEscrowData({
          contractId: escrowData.contractId,
          status: escrowData.status,
          message: escrowData.message,
          escrow: escrowResult.escrow,
        });

        setResolutionResult({
          success: true,
          message: `Dispute resolved successfully for milestone ${selectedMilestone}!`,
          hash: sendResult.hash,
          milestoneId: selectedMilestone,
          resolution,
          reason: resolutionReason,
        });

        // Reset form
        setSelectedMilestone('');
        setResolution('approve');
        setResolutionReason('');
      } else {
        throw new Error('Failed to send transaction');
      }
    } catch (err) {
      console.error('Error resolving dispute:', err);
      setResolutionResult({
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

  const canResolveDispute = (milestone: any) => {
    // Only show resolve options for milestones that are disputed
    return milestone.status === 'disputed';
  };

  const getResolutionDescription = (resolution: string) => {
    switch (resolution) {
      case 'approve':
        return 'Approve the milestone and allow funds to be released';
      case 'reject':
        return 'Reject the milestone and cancel the funding';
      case 'modify':
        return 'Modify the milestone requirements and return to pending status';
      default:
        return '';
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

  return (
    <div className='max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg'>
      <h2 className='text-2xl font-bold text-gray-800 mb-6 text-center'>Dispute Resolution</h2>

      {/* Contract Information */}
      <div className='bg-indigo-50 p-4 rounded-md mb-6'>
        <h3 className='font-semibold text-indigo-800 mb-3'>Contract Information:</h3>
        <div className='grid grid-cols-2 gap-2 text-sm text-indigo-700'>
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

      {/* Dispute Resolution Form */}
      <div className='bg-gray-50 p-6 rounded-lg mb-6'>
        <h3 className='text-lg font-semibold text-gray-800 mb-4'>Resolve a Dispute</h3>

        <div className='space-y-4'>
          {/* Milestone Selection */}
          <div>
            <label
              htmlFor='milestone-select'
              className='block text-sm font-medium text-gray-700 mb-2'
            >
              Select Disputed Milestone to Resolve:
            </label>
            <select
              id='milestone-select'
              value={selectedMilestone}
              onChange={e => setSelectedMilestone(e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
            >
              <option value=''>Choose a disputed milestone...</option>
              {escrowData.escrow.releases
                .filter(milestone => canResolveDispute(milestone))
                .map((milestone, index) => (
                  <option key={milestone.id} value={milestone.id}>
                    Milestone {index + 1} -{' '}
                    {formatAmount(milestone.amount, escrowData.escrow.asset.decimals)}{' '}
                    {escrowData.escrow.asset.code}
                  </option>
                ))}
            </select>
            {escrowData.escrow.releases.filter(milestone => canResolveDispute(milestone)).length ===
              0 && (
              <p className='text-sm text-gray-500 mt-1'>
                No disputed milestones available for resolution
              </p>
            )}
          </div>

          {/* Resolution Type */}
          <div>
            <label
              htmlFor='resolution-select'
              className='block text-sm font-medium text-gray-700 mb-2'
            >
              Resolution Type:
            </label>
            <select
              id='resolution-select'
              value={resolution}
              onChange={e => setResolution(e.target.value as 'approve' | 'reject' | 'modify')}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
            >
              <option value='approve'>Approve</option>
              <option value='reject'>Reject</option>
              <option value='modify'>Modify</option>
            </select>
            <p className='text-sm text-gray-600 mt-1'>{getResolutionDescription(resolution)}</p>
          </div>

          {/* Resolution Reason (for modify) */}
          {resolution === 'modify' && (
            <div>
              <label
                htmlFor='resolution-reason'
                className='block text-sm font-medium text-gray-700 mb-2'
              >
                Modification Reason:
              </label>
              <textarea
                id='resolution-reason'
                value={resolutionReason}
                onChange={e => setResolutionReason(e.target.value)}
                placeholder='Please provide a detailed reason for the modification...'
                rows={3}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleResolveDispute}
            disabled={
              isSubmitting ||
              isLoading ||
              !selectedMilestone ||
              (resolution === 'modify' && !resolutionReason.trim())
            }
            className='w-full bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium'
          >
            {isSubmitting ? 'Resolving Dispute...' : 'Resolve Dispute'}
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
                {milestone.resolvedAt && (
                  <div className='mt-2 p-2 bg-indigo-100 rounded border border-indigo-200'>
                    <p className='text-sm text-indigo-800 font-medium'>
                      Resolved: {new Date(milestone.resolvedAt).toLocaleString()}
                    </p>
                    {milestone.resolution && (
                      <p className='text-sm text-indigo-700 mt-1'>
                        Resolution:{' '}
                        {milestone.resolution.charAt(0).toUpperCase() +
                          milestone.resolution.slice(1)}
                      </p>
                    )}
                    {milestone.resolutionReason && (
                      <p className='text-sm text-indigo-700 mt-1'>
                        Reason: {milestone.resolutionReason}
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

            {/* Resolution Status */}
            {milestone.status === 'disputed' && (
              <div className='text-sm text-orange-600 italic'>
                This milestone is currently under dispute and requires resolution
              </div>
            )}
            {milestone.status === 'approved' && milestone.resolvedAt && (
              <div className='text-sm text-green-600 italic'>
                Dispute resolved: Milestone approved and can now have funds released
              </div>
            )}
            {milestone.status === 'cancelled' && milestone.resolvedAt && (
              <div className='text-sm text-red-600 italic'>
                Dispute resolved: Milestone rejected and funding cancelled
              </div>
            )}
            {milestone.status === 'pending' && milestone.resolvedAt && (
              <div className='text-sm text-blue-600 italic'>
                Dispute resolved: Milestone modified and returned to pending status
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

      {/* Resolution Result */}
      {resolutionResult && (
        <div
          className={`mt-6 border rounded-md p-4 ${resolutionResult.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}
        >
          {resolutionResult.success ? (
            <div>
              <h3 className='font-semibold text-green-800 mb-2'>Dispute Resolved Successfully!</h3>
              <div className='space-y-2'>
                <p className='text-green-700'>{resolutionResult.message}</p>
                {resolutionResult.milestoneId && (
                  <p className='text-green-700'>
                    <span className='font-medium'>Milestone:</span> {resolutionResult.milestoneId}
                  </p>
                )}
                {resolutionResult.resolution && (
                  <p className='text-green-700'>
                    <span className='font-medium'>Resolution:</span>{' '}
                    {resolutionResult.resolution.charAt(0).toUpperCase() +
                      resolutionResult.resolution.slice(1)}
                  </p>
                )}
                {resolutionResult.reason && (
                  <p className='text-green-700'>
                    <span className='font-medium'>Reason:</span> {resolutionResult.reason}
                  </p>
                )}
                {resolutionResult.hash && (
                  <p className='text-green-700'>
                    <span className='font-medium'>Transaction Hash:</span> {resolutionResult.hash}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div>
              <h3 className='font-semibold text-red-800 mb-2'>Dispute Resolution Failed</h3>
              <p className='text-red-700'>{resolutionResult.message}</p>
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      <div className='mt-6 text-sm text-gray-600'>
        <h4 className='font-medium text-gray-800 mb-2'>How dispute resolution works:</h4>
        <ul className='list-disc list-inside space-y-1'>
          <li>
            <strong>Approve:</strong> Approves the disputed milestone and allows funds to be
            released
          </li>
          <li>
            <strong>Reject:</strong> Rejects the milestone and cancels the funding
          </li>
          <li>
            <strong>Modify:</strong> Modifies the milestone requirements and returns it to pending
            status
          </li>
          <li>
            <strong>Resolution Process:</strong> Creates a transaction that resolves the dispute
          </li>
          <li>
            <strong>Status Updates:</strong> Milestone status is updated based on the resolution
          </li>
        </ul>
      </div>

      {/* Resolution Summary */}
      <div className='mt-6 bg-indigo-50 p-4 rounded-md'>
        <h4 className='font-medium text-indigo-800 mb-2'>Dispute Resolution Summary:</h4>
        <div className='grid grid-cols-2 gap-4 text-sm text-indigo-700'>
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
            <span className='font-medium'>Resolvable Disputes:</span>
            <br />
            {escrowData.escrow.releases.filter(r => canResolveDispute(r)).length}
          </div>
          <div>
            <span className='font-medium'>Last Resolution:</span>
            <br />
            {escrowData.escrow.metadata?.lastResolution
              ? new Date(escrowData.escrow.metadata.lastResolution).toLocaleDateString()
              : 'None'}
          </div>
        </div>
      </div>
    </div>
  );
};
