export interface InitializePayload {
  // Escrow configuration
  escrowType: 'multi-release' | 'single-release';
  releaseMode: 'multi-release' | 'single-release';

  // Asset configuration
  asset: {
    code: string;
    issuer: string;
    decimals: number;
  };

  // Amount and fees
  amount: string;
  platformFee: number;

  // Roles - all set to connected user's wallet address
  buyer: string;
  seller: string;
  arbiter: string;

  // Escrow terms
  terms: string;
  deadline: string;

  // Additional metadata
  metadata?: Record<string, any>;
}

export interface EscrowContract {
  contractId: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface TransactionResult {
  success: boolean;
  contractId?: string;
  error?: string;
  hash?: string;
}

export interface SendTransactionResponse {
  success: boolean;
  hash?: string;
  status: string;
  message?: string;
  contractId: string;
  escrow: any;
}

export interface FundEscrowPayload {
  contractId: string;
  amount: string;
  releaseMode: 'multi-release';
}

export interface ChangeMilestoneStatusPayload {
  contractId: string;
  milestoneId: string;
  status: 'pending' | 'released' | 'cancelled';
  releaseMode: 'multi-release';
}

export interface ApproveMilestonePayload {
  contractId: string;
  milestoneId: string;
  releaseMode: 'multi-release';
}

export interface MultiReleaseReleaseFundsPayload {
  contractId: string;
  milestoneId: string;
  releaseMode: 'multi-release';
}

export interface MultiReleaseStartDisputePayload {
  contractId: string;
  milestoneId: string;
  releaseMode: 'multi-release';
  reason: string;
}

export interface MultiReleaseResolveDisputePayload {
  contractId: string;
  milestoneId: string;
  releaseMode: 'multi-release';
  resolution: 'approve' | 'reject' | 'modify';
  reason?: string;
}
