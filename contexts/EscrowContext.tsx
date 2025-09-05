'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface MultiReleaseEscrow {
  contractId: string;
  status: string;
  message?: string;
  escrow: {
    id: string;
    type: 'multi-release';
    asset: {
      code: string;
      issuer: string;
      decimals: number;
    };
    amount: string;
    platformFee: number;
    buyer: string;
    seller: string;
    arbiter: string;
    terms: string;
    deadline: string;
    createdAt: string;
    updatedAt: string;
    releases: Array<{
      id: string;
      amount: string;
      status: 'pending' | 'approved' | 'released' | 'cancelled' | 'disputed';
      createdAt: string;
      updatedAt?: string;
      approvedAt?: string;
      releasedAt?: string;
      disputedAt?: string;
      disputeReason?: string;
      resolvedAt?: string;
      resolution?: 'approve' | 'reject' | 'modify';
      resolutionReason?: string;
    }>;
    metadata?: Record<string, any>;
  };
}

interface EscrowContextType {
  escrowData: MultiReleaseEscrow | null;
  setEscrowData: (escrow: MultiReleaseEscrow | null) => void;
  clearEscrowData: () => void;
}

const EscrowContext = createContext<EscrowContextType | undefined>(undefined);

export const useEscrowContext = () => {
  const context = useContext(EscrowContext);
  if (context === undefined) {
    throw new Error('useEscrowContext must be used within an EscrowProvider');
  }
  return context;
};

interface EscrowProviderProps {
  children: ReactNode;
}

export const EscrowProvider: React.FC<EscrowProviderProps> = ({ children }) => {
  const [escrowData, setEscrowData] = useState<MultiReleaseEscrow | null>(null);

  const clearEscrowData = () => {
    setEscrowData(null);
  };

  return (
    <EscrowContext.Provider value={{ escrowData, setEscrowData, clearEscrowData }}>
      {children}
    </EscrowContext.Provider>
  );
};
