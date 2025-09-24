'use client';

import { useState } from 'react';
import { useWallet } from '@/lib/stellar-wallet-hooks';
import { useChangeMilestoneStatus } from '@/lib/mock-trustless-work';
import { useEscrowContext } from '@/contexts/EscrowContext';
import { ChangeMilestoneStatusPayload } from '@/types/trustless-work';

export const MilestoneStatusManager = () => {
  const { walletData, isConnected, signTransaction, sendTransaction } = useWallet();
  const { escrowData, setEscrowData } = useEscrowContext();
  const { changeMilestoneStatus, isLoading, error } = useChangeMilestoneStatus();

  const [selectedMilestone, setSelectedMilestone] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusChangeResult, setStatusChangeResult] = useState<{
    success: boolean;
    message: string;
    hash?: string;
    milestoneId?: string;
    newStatus?: string;
  } | null>(null);

  const handleStatusChange = async (
    milestoneId: string,
    newStatus: 'pending' | 'released' | 'cancelled'
  ) => {
    if (!isConnected || !walletData?.publicKey) {
      alert('Please connect your wallet first');
      return;
    }

    if (!escrowData) {
      alert('No escrow contract available');
      return;
    }

    setIsSubmitting(true);
    setStatusChangeResult(null);

    try {
      // Create the ChangeMilestoneStatusPayload
      const payload: ChangeMilestoneStatusPayload = {
        contractId: escrowData.contractId,
        milestoneId,
        status: newStatus,
        releaseMode: 'multi-release',
      };

      // Step 1: Execute function from Trustless Work
      const escrowResult = await changeMilestoneStatus(payload);

      if (!escrowResult) {
        throw new Error('Failed to change milestone status');
      }

      // Step 2: Sign transaction with wallet
      const signedTransaction = await signTransaction(JSON.stringify(escrowResult.transaction));

      if (!signedTransaction) {
        throw new Error('Failed to sign transaction');
      }

      // Step 3: Send transaction
      const sendResult = await sendTransaction(signedTransaction.signedTxXdr);

      if (sendResult.success) {
        // Update the escrow data in context with the new milestone status
        setEscrowData({
          contractId: escrowData.contractId,
          status: escrowData.status,
          message: escrowData.message,
          escrow: escrowResult.escrow,
        });

        setStatusChangeResult({
          success: true,
          message: `Milestone status changed to ${newStatus} successfully!`,
          hash: sendResult.hash,
          milestoneId,
          newStatus,
        });
      } else {
        throw new Error('Failed to send transaction');
      }
    } catch (err) {
      console.error('Error changing milestone status:', err);
      setStatusChangeResult({
        success: false,
        message: err instanceof Error ? err.message : 'Unknown error occurred',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getValidStatusTransitions = (currentStatus: string) => {
    switch (currentStatus) {
      case 'pending':
        return [
          {
            status: 'released',
            label: 'Mark as Completed',
            color: 'bg-green-600 hover:bg-green-700',
          },
          { status: 'cancelled', label: 'Reject', color: 'bg-red-600 hover:bg-red-700' },
        ];
      case 'released':
        return [
          {
            status: 'cancelled',
            label: 'Mark as Cancelled',
            color: 'bg-yellow-600 hover:bg-yellow-700',
          },
        ];
      case 'cancelled':
        return [{ status: 'pending', label: 'Reactivate', color: 'bg-blue-600 hover:bg-blue-700' }];
      default:
        return [];
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'released':
        return 'bg-green-100 text-green-800 border-green-200';
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
        Manage Milestone Statuses
      </h2>

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

      {/* Milestones Management */}
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
              </div>

              <div className='text-right'>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(milestone.status)}`}
                >
                  {milestone.status.charAt(0).toUpperCase() + milestone.status.slice(1)}
                </span>
              </div>
            </div>

            {/* Status Change Buttons */}
            <div className='space-y-2'>
              <h5 className='text-sm font-medium text-gray-700'>Change Status:</h5>
              <div className='flex flex-wrap gap-2'>
                {getValidStatusTransitions(milestone.status).map(transition => (
                  <button
                    key={transition.status}
                    onClick={() =>
                      handleStatusChange(
                        milestone.id,
                        transition.status as 'pending' | 'released' | 'cancelled'
                      )
                    }
                    disabled={isSubmitting || isLoading}
                    className={`px-4 py-2 text-white text-sm rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${transition.color}`}
                  >
                    {isSubmitting ? 'Updating...' : transition.label}
                  </button>
                ))}

                {getValidStatusTransitions(milestone.status).length === 0 && (
                  <span className='text-sm text-gray-500 italic'>
                    No valid status transitions available
                  </span>
                )}
              </div>
            </div>
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

      {/* Status Change Result */}
      {statusChangeResult && (
        <div
          className={`mt-6 border rounded-md p-4 ${statusChangeResult.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}
        >
          {statusChangeResult.success ? (
            <div>
              <h3 className='font-semibold text-green-800 mb-2'>Status Change Successful!</h3>
              <div className='space-y-2'>
                <p className='text-green-700'>{statusChangeResult.message}</p>
                {statusChangeResult.milestoneId && (
                  <p className='text-green-700'>
                    <span className='font-medium'>Milestone:</span> {statusChangeResult.milestoneId}
                  </p>
                )}
                {statusChangeResult.newStatus && (
                  <p className='text-green-700'>
                    <span className='font-medium'>New Status:</span> {statusChangeResult.newStatus}
                  </p>
                )}
                {statusChangeResult.hash && (
                  <p className='text-green-700'>
                    <span className='font-medium'>Transaction Hash:</span> {statusChangeResult.hash}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div>
              <h3 className='font-semibold text-red-800 mb-2'>Status Change Failed</h3>
              <p className='text-red-700'>{statusChangeResult.message}</p>
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      <div className='mt-6 text-sm text-gray-600'>
        <h4 className='font-medium text-gray-800 mb-2'>How milestone status changes work:</h4>
        <ul className='list-disc list-inside space-y-1'>
          <li>
            <strong>Pending → Released:</strong> Mark milestone as completed and release funds
          </li>
          <li>
            <strong>Pending → Cancelled:</strong> Reject milestone and prevent fund release
          </li>
          <li>
            <strong>Released → Cancelled:</strong> Mark completed milestone as cancelled
          </li>
          <li>
            <strong>Cancelled → Pending:</strong> Reactivate a cancelled milestone
          </li>
        </ul>
      </div>
    </div>
  );
};
