'use client';

import { useEscrowContext } from '@/contexts/EscrowContext';
import { MultiReleaseEscrow } from '@/contexts/EscrowContext';

export const EscrowDisplay = () => {
  const { escrowData } = useEscrowContext();

  if (!escrowData) {
    return null;
  }

  const formatAmount = (amount: string, decimals: number) => {
    const numericAmount = parseInt(amount) / decimals;
    return numericAmount.toFixed(6);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-8)}`;
  };

  return (
    <div className='max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg'>
      <h2 className='text-2xl font-bold text-gray-800 mb-6 text-center'>Escrow Contract Details</h2>

      {/* Contract Overview */}
      <div className='grid md:grid-cols-2 gap-6 mb-8'>
        <div className='bg-blue-50 p-4 rounded-lg'>
          <h3 className='font-semibold text-blue-800 mb-3'>Contract Information</h3>
          <div className='space-y-2 text-sm'>
            <div>
              <span className='font-medium'>Contract ID:</span> {escrowData.contractId}
            </div>
            <div>
              <span className='font-medium'>Status:</span>
              <span
                className={`ml-2 px-2 py-1 rounded text-xs ${
                  escrowData.status === 'success'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {escrowData.status}
              </span>
            </div>
            {escrowData.message && (
              <div>
                <span className='font-medium'>Message:</span> {escrowData.message}
              </div>
            )}
          </div>
        </div>

        <div className='bg-green-50 p-4 rounded-lg'>
          <h3 className='font-semibold text-green-800 mb-3'>Asset Details</h3>
          <div className='space-y-2 text-sm'>
            <div>
              <span className='font-medium'>Asset:</span> {escrowData.escrow.asset.code}
            </div>
            <div>
              <span className='font-medium'>Issuer:</span>{' '}
              {formatAddress(escrowData.escrow.asset.issuer)}
            </div>
            <div>
              <span className='font-medium'>Decimals:</span>{' '}
              {escrowData.escrow.asset.decimals.toLocaleString()}
            </div>
            <div>
              <span className='font-medium'>Amount:</span>{' '}
              {formatAmount(escrowData.escrow.amount, escrowData.escrow.asset.decimals)}{' '}
              {escrowData.escrow.asset.code}
            </div>
          </div>
        </div>
      </div>

      {/* Roles and Terms */}
      <div className='grid md:grid-cols-2 gap-6 mb-8'>
        <div className='bg-purple-50 p-4 rounded-lg'>
          <h3 className='font-semibold text-purple-800 mb-3'>Roles</h3>
          <div className='space-y-2 text-sm'>
            <div>
              <span className='font-medium'>Buyer:</span> {formatAddress(escrowData.escrow.buyer)}
            </div>
            <div>
              <span className='font-medium'>Seller:</span> {formatAddress(escrowData.escrow.seller)}
            </div>
            <div>
              <span className='font-medium'>Arbiter:</span>{' '}
              {formatAddress(escrowData.escrow.arbiter)}
            </div>
          </div>
        </div>

        <div className='bg-orange-50 p-4 rounded-lg'>
          <h3 className='font-semibold text-orange-800 mb-3'>Terms & Fees</h3>
          <div className='space-y-2 text-sm'>
            <div>
              <span className='font-medium'>Platform Fee:</span> {escrowData.escrow.platformFee}%
            </div>
            <div>
              <span className='font-medium'>Deadline:</span>{' '}
              {formatDate(escrowData.escrow.deadline)}
            </div>
            <div>
              <span className='font-medium'>Terms:</span> {escrowData.escrow.terms}
            </div>
          </div>
        </div>
      </div>

      {/* Releases */}
      <div className='bg-gray-50 p-4 rounded-lg mb-8'>
        <h3 className='font-semibold text-gray-800 mb-3'>Releases</h3>
        <div className='space-y-3'>
          {escrowData.escrow.releases.map((release, index) => (
            <div key={release.id} className='bg-white p-3 rounded border'>
              <div className='flex justify-between items-center'>
                <div className='text-sm'>
                  <span className='font-medium'>Release {index + 1}:</span>{' '}
                  {formatAmount(release.amount, escrowData.escrow.asset.decimals)}{' '}
                  {escrowData.escrow.asset.code}
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    release.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : release.status === 'released'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                  }`}
                >
                  {release.status}
                </span>
              </div>
              <div className='text-xs text-gray-500 mt-1'>
                Created: {formatDate(release.createdAt)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Metadata */}
      {escrowData.escrow.metadata && Object.keys(escrowData.escrow.metadata).length > 0 && (
        <div className='bg-indigo-50 p-4 rounded-lg mb-8'>
          <h3 className='font-semibold text-indigo-800 mb-3'>Metadata</h3>
          <div className='grid md:grid-cols-2 gap-4'>
            {Object.entries(escrowData.escrow.metadata).map(([key, value]) => (
              <div key={key} className='text-sm'>
                <span className='font-medium capitalize'>{key}:</span> {String(value)}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timestamps */}
      <div className='bg-gray-50 p-4 rounded-lg'>
        <h3 className='font-semibold text-gray-800 mb-3'>Timestamps</h3>
        <div className='grid md:grid-cols-2 gap-4 text-sm'>
          <div>
            <span className='font-medium'>Created:</span> {formatDate(escrowData.escrow.createdAt)}
          </div>
          <div>
            <span className='font-medium'>Updated:</span> {formatDate(escrowData.escrow.updatedAt)}
          </div>
        </div>
      </div>

      {/* Stellar Viewer Link */}
      <div className='mt-6 text-center'>
        <a
          href={`https://stellar.expert/explorer/testnet/contract/${escrowData.contractId}`}
          target='_blank'
          rel='noopener noreferrer'
          className='inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors'
        >
          View in Stellar Viewer
          <svg className='w-4 h-4 ml-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
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
  );
};
