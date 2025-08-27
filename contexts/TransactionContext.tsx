'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

export interface TransactionStatus {
  hash: string
  status: 'pending' | 'success' | 'failed'
  message: string
  timestamp: Date
  type: 'escrow' | 'milestone' | 'fund' | 'approve' | 'release' | 'dispute'
  demoId?: string
  amount?: string
  asset?: string
}

interface TransactionContextType {
  transactions: TransactionStatus[]
  addTransaction: (transaction: Omit<TransactionStatus, 'timestamp'>) => void
  updateTransaction: (hash: string, status: 'success' | 'failed', message: string) => void
  clearTransactions: () => void
  getTransactionsByDemo: (demoId: string) => TransactionStatus[]
  getRecentTransactions: (limit?: number) => TransactionStatus[]
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined)

export const useTransactionHistory = () => {
  const context = useContext(TransactionContext)
  if (context === undefined) {
    throw new Error('useTransactionHistory must be used within a TransactionProvider')
  }
  return context
}

interface TransactionProviderProps {
  children: ReactNode
}

export const TransactionProvider = ({ children }: TransactionProviderProps) => {
  const [transactions, setTransactions] = useState<TransactionStatus[]>([])

  const addTransaction = (transaction: Omit<TransactionStatus, 'timestamp'>) => {
    const newTransaction: TransactionStatus = {
      ...transaction,
      timestamp: new Date()
    }
    setTransactions(prev => [newTransaction, ...prev])
  }

  const updateTransaction = (hash: string, status: 'success' | 'failed', message: string) => {
    setTransactions(prev => 
      prev.map(tx => 
        tx.hash === hash ? { ...tx, status, message } : tx
      )
    )
  }

  const clearTransactions = () => {
    setTransactions([])
  }

  const getTransactionsByDemo = (demoId: string) => {
    return transactions.filter(tx => tx.demoId === demoId)
  }

  const getRecentTransactions = (limit: number = 10) => {
    return transactions.slice(0, limit)
  }

  const value: TransactionContextType = {
    transactions,
    addTransaction,
    updateTransaction,
    clearTransactions,
    getTransactionsByDemo,
    getRecentTransactions
  }

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  )
}
