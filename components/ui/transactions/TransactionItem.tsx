'use client';

import React from 'react';
import { TransactionStatus } from '@/contexts/data/TransactionContext';
import { BadgeEmblem } from '../badges/BadgeEmblem';

interface TransactionItemProps {
  transaction: TransactionStatus;
  showDemoInfo?: boolean;
  compact?: boolean;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  showDemoInfo = true,
  compact = false,
}) => {
  const getTransactionIcon = (type: TransactionStatus['type']) => {
    switch (type) {
      case 'escrow':
        return '🔒';
      case 'milestone':
        return '🎯';
      case 'fund':
        return '💰';
      case 'approve':
        return '✅';
      case 'release':
        return '🎉';
      case 'dispute':
        return '⚖️';
      case 'demo_completion':
        return '🏆';
      case 'badge_earned':
        return '⭐';
      default:
        return '📝';
    }
  };

  const getStatusColor = (status: TransactionStatus['status']) => {
    switch (status) {
      case 'success':
        return 'text-green-400';
      case 'failed':
        return 'text-red-400';
      case 'pending':
        return 'text-yellow-400';
      default:
        return 'text-gray-400';
    }
  };

  const getTypeColor = (type: TransactionStatus['type']) => {
    switch (type) {
      case 'escrow':
        return 'text-blue-400';
      case 'milestone':
        return 'text-purple-400';
      case 'fund':
        return 'text-green-400';
      case 'approve':
        return 'text-green-500';
      case 'release':
        return 'text-emerald-400';
      case 'dispute':
        return 'text-red-400';
      case 'demo_completion':
        return 'text-yellow-400';
      case 'badge_earned':
        return 'text-amber-400';
      default:
        return 'text-gray-400';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return timestamp.toLocaleDateString();
  };

  const formatHash = (hash: string) => {
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  };

  if (compact) {
    return (
      <div className='flex items-center justify-between p-2 bg-black/20 rounded-lg border border-white/10'>
        <div className='flex items-center gap-2 min-w-0 flex-1'>
          <span className='text-lg'>{getTransactionIcon(transaction.type)}</span>
          <div className='min-w-0 flex-1'>
            <p className='text-sm font-medium text-white truncate'>{transaction.message}</p>
            <p className='text-xs text-gray-400'>{formatTimestamp(transaction.timestamp)}</p>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          {transaction.points && (
            <span className='text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded'>
              +{transaction.points}pts
            </span>
          )}
          <span className={`text-xs ${getStatusColor(transaction.status)}`}>
            {transaction.status}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className='p-4 bg-black/20 rounded-lg border border-white/10 hover:bg-black/30 transition-colors'>
      <div className='flex items-start justify-between gap-3'>
        <div className='flex items-start gap-3 min-w-0 flex-1'>
          <span className='text-2xl'>{getTransactionIcon(transaction.type)}</span>

          <div className='min-w-0 flex-1'>
            <div className='flex items-center gap-2 mb-1'>
              <h4 className='font-medium text-white truncate'>{transaction.message}</h4>
              {transaction.badgeId && <BadgeEmblem id={transaction.badgeId} size='sm' />}
            </div>

            <div className='flex items-center gap-4 text-xs text-gray-400 mb-2'>
              <span className={`font-medium ${getTypeColor(transaction.type)}`}>
                {transaction.type.replace('_', ' ').toUpperCase()}
              </span>
              <span>{formatTimestamp(transaction.timestamp)}</span>
              {transaction.demoId && showDemoInfo && (
                <span className='bg-blue-500/20 text-blue-400 px-2 py-1 rounded'>
                  {transaction.demoId.replace('-', ' ')}
                </span>
              )}
            </div>

            {transaction.amount && (
              <p className='text-sm text-gray-300 mb-1'>
                Amount: {transaction.amount} {transaction.asset || 'XLM'}
              </p>
            )}

            <div className='flex items-center gap-2 text-xs'>
              <span className='font-mono text-gray-500'>Hash: {formatHash(transaction.hash)}</span>
              {transaction.explorerUrl && (
                <a
                  href={transaction.explorerUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-blue-400 hover:text-blue-300 underline'
                >
                  View
                </a>
              )}
            </div>
          </div>
        </div>

        <div className='flex flex-col items-end gap-2'>
          {transaction.points && (
            <span className='bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-sm font-medium'>
              +{transaction.points} pts
            </span>
          )}

          <span
            className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
              transaction.status === 'success'
                ? 'bg-green-500/20 text-green-400'
                : transaction.status === 'failed'
                  ? 'bg-red-500/20 text-red-400'
                  : 'bg-yellow-500/20 text-yellow-400'
            }`}
          >
            {transaction.status}
          </span>
        </div>
      </div>
    </div>
  );
};
