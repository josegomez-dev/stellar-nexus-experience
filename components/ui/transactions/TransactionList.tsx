'use client';

import React, { useState } from 'react';
import { TransactionStatus } from '@/contexts/data/TransactionContext';
import { TransactionItem } from './TransactionItem';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface TransactionListProps {
  transactions: TransactionStatus[];
  isLoading?: boolean;
  compact?: boolean;
  showFilters?: boolean;
  limit?: number;
  emptyMessage?: string;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  isLoading = false,
  compact = false,
  showFilters = false,
  limit,
  emptyMessage = 'No transactions found',
}) => {
  const [filter, setFilter] = useState<TransactionStatus['type'] | 'all'>('all');

  const filteredTransactions = transactions.filter(tx => filter === 'all' || tx.type === filter);

  const displayTransactions = limit ? filteredTransactions.slice(0, limit) : filteredTransactions;

  const transactionTypes: Array<{ value: TransactionStatus['type'] | 'all'; label: string }> = [
    { value: 'all', label: 'All' },
    { value: 'escrow', label: 'Escrow' },
    { value: 'milestone', label: 'Milestone' },
    { value: 'demo_completion', label: 'Demo Completion' },
    { value: 'badge_earned', label: 'Badge Earned' },
    { value: 'fund', label: 'Funding' },
    { value: 'approve', label: 'Approval' },
    { value: 'release', label: 'Release' },
    { value: 'dispute', label: 'Dispute' },
  ];

  if (isLoading) {
    return (
      <div className='flex items-center justify-center p-8'>
        <LoadingSpinner size='md' />
      </div>
    );
  }

  if (displayTransactions.length === 0) {
    return (
      <div className='text-center p-8'>
        <div className='text-4xl mb-4'>📝</div>
        <p className='text-gray-400'>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {showFilters && (
        <div className='flex flex-wrap gap-2 mb-4'>
          {transactionTypes.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filter === value
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      <div className='space-y-3'>
        {displayTransactions.map(transaction => (
          <TransactionItem key={transaction.hash} transaction={transaction} compact={compact} />
        ))}
      </div>

      {limit && filteredTransactions.length > limit && (
        <div className='text-center pt-4'>
          <p className='text-sm text-gray-400'>
            Showing {limit} of {filteredTransactions.length} transactions
          </p>
        </div>
      )}
    </div>
  );
};
