'use client';

import { useState } from 'react';
import { useWallet } from '@/lib/stellar-wallet-hooks';
import { useApproveMilestone } from '@/lib/mock-trustless-work';
import { useEscrowContext } from '@/contexts/EscrowContext';
import { ApproveMilestonePayload } from '@/types/trustless-work';

export const MilestoneApproval = () => {
  const { walletData, isConnected, signTransaction, sendTransaction } = useWallet();
  const { escrowData, setEscrowData } = useEscrowContext();
  const { approveMilestone, isLoading, error } = useApproveMilestone();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [approvalResult, setApprovalResult] = useState<{
    success: boolean;
    message: string;
    hash?: string;
    milestoneId?: string;
  } | null>(null);

  const handleApproveMilestone = async (milestoneId: string) => {
    if (!isConnected || !walletData?.publicKey) {
      alert('Please connect your wallet first');
      return;
    }

    if (!escrowData) {
      alert('No escrow contract available');
      return;
    }

    setIsSubmitting(true);
    setApprovalResult(null);

    try {
      // Create the ApproveMilestonePayload
      const payload: ApproveMilestonePayload = {
        contractId: escrowData.contractId,
        milestoneId,
        releaseMode: 'multi-release',
      };

      // Step 1: Execute function from Trustless Work
      const escrowResult = await approveMilestone(payload);

      if (!escrowResult) {
        throw new Error('Failed to approve milestone');
      }

      // Step 2: Sign transaction with wallet
      const signedTransaction = await signTransaction(JSON.stringify(escrowResult.transaction));

      if (!signedTransaction) {
        throw new Error('Failed to sign transaction');
      }

      // Step 3: Send transaction
      const sendResult = await sendTransaction(signedTransaction.signedTxXdr);

      if (sendResult.success) {
        // Update the escrow data in context with the approved milestone
        setEscrowData({
          contractId: escrowData.contractId,
          status: escrowData.status,
          message: escrowData.message,
          escrow: escrowResult.escrow,
        });

        setApprovalResult({
          success: true,
          message: `Milestone ${milestoneId} approved successfully!`,
          hash: sendResult.hash,
          milestoneId,
        });
      } else {
        throw new Error('Failed to send transaction');
      }
    } catch (err) {
      console.error('Error approving milestone:', err);
      setApprovalResult({
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

  const canApproveMilestone = (milestone: any) => {
    // Only show approve button for milestones that are pending
    return milestone.status === 'pending';
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
      <h2 className='text-2xl font-bold text-gray-800 mb-6 text-center'>Approve Milestones</h2>

      {/* Contract Information */}
      <div className='bg-blue-50 p-4 rounded-md mb-6'>
        <h3 className='font-semibold text-blue-800 mb-3'>Contract Information:</h3>
        <div className='grid grid-cols-2 gap-2 text-sm text-blue-700'>
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

      {/* Milestones Approval */}
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
              </div>

              <div className='text-right'>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(milestone.status)}`}
                >
                  {milestone.status.charAt(0).toUpperCase() + milestone.status.slice(1)}
                </span>
              </div>
            </div>

            {/* Approval Button */}
            {canApproveMilestone(milestone) && (
              <div className='space-y-2'>
                <h5 className='text-sm font-medium text-gray-700'>Actions:</h5>
                <button
                  onClick={() => handleApproveMilestone(milestone.id)}
                  disabled={isSubmitting || isLoading}
                  className='bg-green-600 text-white px-4 py-2 text-sm rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {isSubmitting ? 'Approving...' : 'Approve Milestone'}
                </button>
              </div>
            )}

            {!canApproveMilestone(milestone) && (
              <div className='text-sm text-gray-500 italic'>
                {milestone.status === 'approved'
                  ? 'Milestone already approved'
                  : milestone.status === 'released'
                    ? 'Milestone already released'
                    : 'Milestone cannot be approved'}
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

      {/* Approval Result */}
      {approvalResult && (
        <div
          className={`mt-6 border rounded-md p-4 ${approvalResult.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}
        >
          {approvalResult.success ? (
            <div>
              <h3 className='font-semibold text-green-800 mb-2'>
                Milestone Approved Successfully!
              </h3>
              <div className='space-y-2'>
                <p className='text-green-700'>{approvalResult.message}</p>
                {approvalResult.milestoneId && (
                  <p className='text-green-700'>
                    <span className='font-medium'>Milestone:</span> {approvalResult.milestoneId}
                  </p>
                )}
                {approvalResult.hash && (
                  <p className='text-green-700'>
                    <span className='font-medium'>Transaction Hash:</span> {approvalResult.hash}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div>
              <h3 className='font-semibold text-red-800 mb-2'>Approval Failed</h3>
              <p className='text-red-700'>{approvalResult.message}</p>
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      <div className='mt-6 text-sm text-gray-600'>
        <h4 className='font-medium text-gray-800 mb-2'>How milestone approval works:</h4>
        <ul className='list-disc list-inside space-y-1'>
          <li>
            <strong>Pending Milestones:</strong> Can be approved to move to the next stage
          </li>
          <li>
            <strong>Approved Milestones:</strong> Have been approved and are ready for release
          </li>
          <li>
            <strong>Released Milestones:</strong> Funds have been released to the recipient
          </li>
          <li>
            <strong>Approval Process:</strong> Creates a transaction that marks the milestone as
            approved
          </li>
        </ul>
      </div>
    </div>
  );
};
