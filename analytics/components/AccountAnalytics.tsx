'use client';

import React, { useState, useEffect } from 'react';
import { AccountAnalytics, SortField, SortOrder } from '../types';
import { AnalyticsService } from '../services/analyticsService';

interface AccountAnalyticsProps {
  className?: string;
}

export const AccountAnalytics: React.FC<AccountAnalyticsProps> = ({ className = '' }) => {
  const [accounts, setAccounts] = useState<AccountAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>('totalPoints');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadAccountAnalytics();
  }, []);

  const loadAccountAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const accountData = await AnalyticsService.getAccountAnalytics();
      setAccounts(accountData);
    } catch (err) {
      console.error('Error loading account analytics:', err);
      setError('Failed to load account analytics');
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const filteredAndSortedAccounts = accounts
    .filter(account => {
      // Filter by active/inactive status
      if (filter === 'active' && !account.isActive) return false;
      if (filter === 'inactive' && account.isActive) return false;
      
      // Filter by search term
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          account.displayName.toLowerCase().includes(searchLower) ||
          account.walletAddress.toLowerCase().includes(searchLower)
        );
      }
      
      return true;
    })
    .sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortField) {
        case 'totalPoints':
          aValue = a.totalPoints;
          bValue = b.totalPoints;
          break;
        case 'level':
          aValue = a.level;
          bValue = b.level;
          break;
        case 'demosCompleted':
          aValue = a.demosCompleted.length;
          bValue = b.demosCompleted.length;
          break;
        case 'rating':
          aValue = a.averageRating;
          bValue = b.averageRating;
          break;
        case 'createdAt':
          aValue = a.createdAt.getTime();
          bValue = b.createdAt.getTime();
          break;
        case 'lastLoginAt':
          aValue = a.lastLoginAt.getTime();
          bValue = b.lastLoginAt.getTime();
          break;
        default:
          aValue = a.totalPoints;
          bValue = b.totalPoints;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  if (loading) {
    return (
      <div className={`p-6 bg-white/5 rounded-lg border border-white/20 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-white/10 rounded w-1/3"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-white/10 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-6 bg-white/5 rounded-lg border border-white/20 ${className}`}>
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={loadAccountAnalytics}
            className="px-4 py-2 bg-blue-500/20 border border-blue-400/50 text-blue-300 rounded-lg hover:bg-blue-500/30"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header and Filters */}
      <div className="p-6 bg-white/5 rounded-lg border border-white/20">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h2 className="text-xl font-semibold text-white">Account Analytics</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-400">Filter:</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as 'all' | 'active' | 'inactive')}
                className="px-3 py-1 bg-white/5 border border-white/20 rounded text-white text-sm"
              >
                <option value="all">All Users</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-400">Search:</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search users..."
                className="px-3 py-1 bg-white/5 border border-white/20 rounded text-white text-sm placeholder-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="p-3 bg-white/5 rounded border border-white/10">
            <p className="text-2xl font-bold text-white">{accounts.length}</p>
            <p className="text-sm text-gray-400">Total Users</p>
          </div>
          <div className="p-3 bg-white/5 rounded border border-white/10">
            <p className="text-2xl font-bold text-green-400">
              {accounts.filter(a => a.isActive).length}
            </p>
            <p className="text-sm text-gray-400">Active Users</p>
          </div>
          <div className="p-3 bg-white/5 rounded border border-white/10">
            <p className="text-2xl font-bold text-blue-400">
              {accounts.reduce((sum, a) => sum + a.totalPoints, 0).toLocaleString()}
            </p>
            <p className="text-sm text-gray-400">Total Points</p>
          </div>
          <div className="p-3 bg-white/5 rounded border border-white/10">
            <p className="text-2xl font-bold text-purple-400">
              {accounts.reduce((sum, a) => sum + a.demosCompleted.length, 0)}
            </p>
            <p className="text-sm text-gray-400">Demos Completed</p>
          </div>
        </div>

        {/* Accounts Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/20">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                  <button
                    onClick={() => handleSort('displayName')}
                    className="hover:text-white transition-colors"
                  >
                    User
                  </button>
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                  <button
                    onClick={() => handleSort('level')}
                    className="hover:text-white transition-colors"
                  >
                    Level
                  </button>
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                  <button
                    onClick={() => handleSort('totalPoints')}
                    className="hover:text-white transition-colors"
                  >
                    Points
                  </button>
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                  <button
                    onClick={() => handleSort('demosCompleted')}
                    className="hover:text-white transition-colors"
                  >
                    Demos
                  </button>
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                  <button
                    onClick={() => handleSort('rating')}
                    className="hover:text-white transition-colors"
                  >
                    Avg Rating
                  </button>
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                  Engagement
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                  <button
                    onClick={() => handleSort('lastLoginAt')}
                    className="hover:text-white transition-colors"
                  >
                    Last Login
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedAccounts.map((account) => (
                <tr key={account.userId} className="border-b border-white/10 hover:bg-white/5">
                  <td className="py-3 px-4">
                    <div>
                      <p className="text-white font-medium">{account.displayName}</p>
                      <p className="text-xs text-gray-400 font-mono">
                        {account.walletAddress.slice(0, 8)}...{account.walletAddress.slice(-8)}
                      </p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300">
                      Level {account.level}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-white font-medium">
                    {account.totalPoints.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-white">
                    {account.demosCompleted.length}
                  </td>
                  <td className="py-3 px-4 text-white">
                    {account.averageRating > 0 ? account.averageRating.toFixed(1) : 'N/A'}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
                          style={{ width: `${account.engagementScore}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-400">{account.engagementScore.toFixed(0)}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      account.isActive 
                        ? 'bg-green-500/20 text-green-300' 
                        : 'bg-gray-500/20 text-gray-300'
                    }`}>
                      {account.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-400">
                    {account.daysSinceLastLogin === 0 
                      ? 'Today' 
                      : `${account.daysSinceLastLogin}d ago`
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAndSortedAccounts.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-400">No accounts found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};
