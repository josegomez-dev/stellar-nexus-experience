'use client';

import { useState, useEffect } from 'react';
import { useGlobalWallet } from '@/contexts/WalletContext';
import {
  useInitializeEscrow as useMockInitializeEscrow,
  useFundEscrow as useMockFundEscrow,
  useChangeMilestoneStatus as useMockChangeMilestoneStatus,
  useApproveMilestone as useMockApproveMilestone,
  useReleaseFunds as useMockReleaseFunds,
  useStartDispute as useMockStartDispute,
  useResolveDispute as useMockResolveDispute,
} from '@/lib/mock-trustless-work';
import { useRealInitializeEscrow } from '@/lib/real-trustless-work';
import { assetConfig } from '@/lib/wallet-config';
import { useAccount } from '@/contexts/AccountContext';
import { useToast } from '@/contexts/ToastContext';
import { useTransactionHistory } from '@/contexts/TransactionContext';
import { useDemoStats } from '@/hooks/useDemoStats';
import { useDemoCompletionHistory } from '@/hooks/useDemoCompletionHistory';
import { Tooltip } from '@/components/ui/Tooltip';
import ConfettiAnimation from '@/components/ui/animations/ConfettiAnimation';
import Image from 'next/image';

interface Dispute {
  id: string;
  milestoneId: string;
  raisedBy: string;
  reason: string;
  status: 'open' | 'resolved';
  raisedAt: string;
  resolvedAt?: string;
  resolution?: 'approve' | 'reject' | 'modify';
  resolutionReason?: string;
  arbitrator?: string;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  amount: string;
  status: 'pending' | 'completed' | 'approved' | 'disputed' | 'released' | 'cancelled';
  worker: string;
  client: string;
}

export const DisputeResolutionDemo = () => {
  const { walletData, isConnected } = useGlobalWallet();
  const { addToast } = useToast();
  const { addTransaction, updateTransaction } = useTransactionHistory();
  const { addCompletion, getDemoHistory, getTotalPointsEarned, getBestScore, getCompletionCount } =
    useDemoCompletionHistory();
  const { completeDemo: completeDemoInAccount } = useAccount();
  const { markDemoComplete } = useDemoStats();
  const [contractId, setContractId] = useState<string>('');
  const [escrowData, setEscrowData] = useState<any>(null);
  const [currentRole, setCurrentRole] = useState<'client' | 'worker' | 'arbitrator'>('client');
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [newDisputeReason, setNewDisputeReason] = useState('');
  const [resolutionReason, setResolutionReason] = useState('');

  // Individual dispute input states
  const [disputeReasons, setDisputeReasons] = useState<Record<string, string>>({});
  const [resolutionReasons, setResolutionReasons] = useState<Record<string, string>>({});

  // Individual loading states for each milestone
  const [milestoneLoadingStates, setMilestoneLoadingStates] = useState<Record<string, boolean>>({});

  // Confetti animation state
  const [showConfetti, setShowConfetti] = useState(false);

  // Demo completion tracking
  const [demoStartTime, setDemoStartTime] = useState<number>(Date.now());

  // Mock hooks
  const mockHooks = {
    initializeEscrow: useMockInitializeEscrow(),
    fundEscrow: useMockFundEscrow(),
    changeMilestoneStatus: useMockChangeMilestoneStatus(),
    approveMilestone: useMockApproveMilestone(),
    releaseFunds: useMockReleaseFunds(),
    startDispute: useMockStartDispute(),
    resolveDispute: useMockResolveDispute(),
  };

  // Real hooks (only initializeEscrow is available)
  const realHooks = {
    initializeEscrow: useRealInitializeEscrow(),
    fundEscrow: useMockFundEscrow(),
    changeMilestoneStatus: useMockChangeMilestoneStatus(),
    approveMilestone: useMockApproveMilestone(),
    releaseFunds: useMockReleaseFunds(),
    startDispute: useMockStartDispute(),
    resolveDispute: useMockResolveDispute(),
  };

  // Always use real blockchain transactions
  const hooks = realHooks;

  // Mock milestones - make mutable so we can update statuses
  const [milestones, setMilestones] = useState<Milestone[]>([
    {
      id: 'milestone_1',
      title: 'Website Design',
      description: 'Complete responsive website design with modern UI',
      amount: '800000', // 8 USDC
      status: 'pending',
      worker: 'worker_wallet_address',
      client: 'client_wallet_address',
    },
    {
      id: 'milestone_2',
      title: 'Content Creation',
      description: 'Write engaging content for all pages',
      amount: '200000', // 2 USDC
      status: 'pending',
      worker: 'worker_wallet_address',
      client: 'client_wallet_address',
    },
  ]);
  const [isCompleted, setIsCompleted] = useState(false);

  // Trigger confetti when demo is completed
  useEffect(() => {
    const allReleased = milestones.every(m => m.status === 'released');
    console.log('🎉 Dispute Resolution Demo - All milestones released:', allReleased);
    console.log(
      '🎉 Milestone statuses:',
      milestones.map(m => ({ id: m.id, status: m.status }))
    );

    // Only complete if all milestones are released AND demo hasn't been completed yet
    if (allReleased && !isCompleted) {
      console.log('🎉 Triggering confetti for Dispute Resolution Demo!');
      setShowConfetti(true);
      setIsCompleted(true); // Mark as completed to prevent multiple executions

      // Complete the demo using the centralized account system
      const completeDemo = async () => {
        try {
          const score = 95; // High score for completing dispute resolution
          const completionTime = Math.floor((Date.now() - demoStartTime) / 1000); // Calculate completion time in seconds

          // Use the centralized account system for completion
          await completeDemoInAccount('dispute-resolution', score);

          // Mark demo as complete in Firebase stats
          await markDemoComplete('dispute-resolution', 'Drama Queen Escrow', completionTime);

          console.log('✅ Dispute Resolution Demo completed successfully');
        } catch (error) {
          console.error('❌ Failed to complete Dispute Resolution Demo:', error);
          addToast({
            type: 'error',
            title: '❌ Demo Completion Failed',
            message: 'Failed to complete demo. Please try again.',
            duration: 5000,
          });
        }
      };

      // Complete demo after a short delay
      setTimeout(completeDemo, 2000);

      // Hide confetti after animation
      const timer = setTimeout(() => {
        console.log('🎉 Hiding confetti for Dispute Resolution Demo');
        setShowConfetti(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [milestones, walletData, isCompleted]); // Removed function dependencies to prevent infinite loops

  async function handleInitializeEscrow() {
    if (!walletData) {
      addToast({
        type: 'warning',
        title: '🔗 Wallet Connection Required',
        message: 'Please connect your Stellar wallet to initialize dispute resolution escrow',
        duration: 5000,
      });
      return;
    }

    // Always use real blockchain initialization

    try {
      const payload = {
        escrowType: 'multi-release' as const,
        releaseMode: 'multi-release' as const,
        asset: assetConfig.defaultAsset,
        amount: '1000000', // 10 USDC (6 decimals)
        platformFee: assetConfig.platformFee,
        buyer: walletData.publicKey,
        seller: walletData.publicKey, // For demo, same wallet
        arbiter: walletData.publicKey, // For demo, same wallet
        terms: 'Dispute resolution escrow system demo',
        deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
        metadata: {
          demo: 'dispute-resolution',
          description: 'Dispute resolution and arbitration demo',
          milestones: milestones.length,
        },
      };

      const txHash = `init_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      addTransaction({
        hash: txHash,
        status: 'pending',
        message: 'Initializing dispute resolution escrow...',
        type: 'escrow',
        demoId: 'dispute-resolution',
        amount: '10',
        asset: 'USDC',
      });

      const result = await hooks.initializeEscrow.initializeEscrow(payload);
      setContractId(result.contractId);
      setEscrowData(result.escrow);

      updateTransaction(txHash, 'success', 'Dispute resolution escrow initialized successfully');

      addToast({
        type: 'success',
        title: 'Escrow Initialized!',
        message: 'Dispute resolution escrow has been successfully created.',
        duration: 5000,
      });
    } catch (error) {
      console.error('Failed to initialize escrow:', error);
      const txHash = `init_failed_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      addTransaction({
        hash: txHash,
        status: 'failed',
        message: `Failed to initialize dispute resolution escrow: ${error instanceof Error ? error.message : 'Unknown error'}`,
        type: 'escrow',
        demoId: 'dispute-resolution',
      });

      addToast({
        type: 'error',
        title: 'Initialization Failed',
        message: 'Failed to initialize dispute resolution escrow.',
        duration: 5000,
      });
    }
  }

  async function handleFundEscrow() {
    if (!walletData) {
      addToast({
        type: 'warning',
        title: '🔗 Wallet Connection Required',
        message: 'Please connect your Stellar wallet to fund escrow contracts',
        duration: 5000,
      });
      return;
    }
    if (!contractId) return;

    try {
      const payload = {
        contractId,
        amount: '1000000',
        releaseMode: 'multi-release',
      };

      const txHash = `fund_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      addTransaction({
        hash: txHash,
        status: 'pending',
        message: 'Funding dispute resolution escrow...',
        type: 'fund',
        demoId: 'dispute-resolution',
        amount: '10',
        asset: 'USDC',
      });

      const result = await hooks.fundEscrow.fundEscrow(payload);
      setEscrowData(result.escrow);

      updateTransaction(txHash, 'success', 'Dispute resolution escrow funded with 10 USDC');

      addToast({
        type: 'success',
        title: 'Escrow Funded!',
        message: 'Dispute resolution escrow has been successfully funded with 10 USDC.',
        duration: 5000,
      });
    } catch (error) {
      console.error('Failed to fund escrow:', error);
      const txHash = `fund_failed_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      addTransaction({
        hash: txHash,
        status: 'failed',
        message: `Failed to fund dispute resolution escrow: ${error instanceof Error ? error.message : 'Unknown error'}`,
        type: 'fund',
        demoId: 'dispute-resolution',
      });

      addToast({
        type: 'error',
        title: 'Funding Failed',
        message: 'Failed to fund the dispute resolution escrow.',
        duration: 5000,
      });
    }
  }

  async function handleCompleteMilestone(milestoneId: string) {
    if (!walletData) {
      addToast({
        type: 'warning',
        title: '🔗 Wallet Connection Required',
        message: 'Please connect your Stellar wallet to complete milestones',
        duration: 5000,
      });
      return;
    }
    if (!contractId) return;

    try {
      // Set loading state for this specific milestone
      setMilestoneLoadingStates(prev => ({ ...prev, [milestoneId]: true }));

      const milestone = milestones.find(m => m.id === milestoneId);
      const txHash = `complete_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      addTransaction({
        hash: txHash,
        status: 'pending',
        message: `Completing milestone "${milestone?.title}"...`,
        type: 'milestone',
        demoId: 'dispute-resolution',
        amount: milestone?.amount ? (parseInt(milestone.amount) / 100000).toFixed(1) : '0',
        asset: 'USDC',
      });

      const payload = {
        contractId,
        milestoneId,
        status: 'completed',
        releaseMode: 'multi-release',
      };

      const result = await hooks.changeMilestoneStatus.changeMilestoneStatus(payload);
      setEscrowData(result.escrow);

      // Update milestone status
      const updatedMilestones = milestones.map(m =>
        m.id === milestoneId ? { ...m, status: 'completed' as const } : m
      );
      setMilestones(updatedMilestones);

      updateTransaction(
        txHash,
        'success',
        `Milestone "${milestone?.title}" completed successfully`
      );

      addToast({
        type: 'success',
        title: 'Milestone Completed!',
        message: `${milestone?.title} has been marked as completed.`,
        duration: 5000,
      });
    } catch (error) {
      console.error('Failed to complete milestone:', error);
      const milestone = milestones.find(m => m.id === milestoneId);
      const txHash = `complete_failed_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      addTransaction({
        hash: txHash,
        status: 'failed',
        message: `Failed to complete milestone "${milestone?.title}": ${error instanceof Error ? error.message : 'Unknown error'}`,
        type: 'milestone',
        demoId: 'dispute-resolution',
      });

      addToast({
        type: 'error',
        title: 'Completion Failed',
        message: 'Failed to mark milestone as completed.',
        duration: 5000,
      });
    } finally {
      // Clear loading state for this specific milestone
      setMilestoneLoadingStates(prev => ({ ...prev, [milestoneId]: false }));
    }
  }

  async function handleApproveMilestone(milestoneId: string) {
    if (!walletData) {
      addToast({
        type: 'warning',
        title: '🔗 Wallet Connection Required',
        message: 'Please connect your Stellar wallet to approve milestones',
        duration: 5000,
      });
      return;
    }
    if (!contractId) return;

    try {
      // Set loading state for this specific milestone
      setMilestoneLoadingStates(prev => ({ ...prev, [milestoneId]: true }));

      const milestone = milestones.find(m => m.id === milestoneId);
      const txHash = `approve_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      addTransaction({
        hash: txHash,
        status: 'pending',
        message: `Approving milestone "${milestone?.title}"...`,
        type: 'approve',
        demoId: 'dispute-resolution',
        amount: milestone?.amount ? (parseInt(milestone.amount) / 100000).toFixed(1) : '0',
        asset: 'USDC',
      });

      const payload = {
        contractId,
        milestoneId,
        releaseMode: 'multi-release',
      };

      const result = await hooks.approveMilestone.approveMilestone(payload);
      setEscrowData(result.escrow);

      // Update milestone status
      const updatedMilestones = milestones.map(m =>
        m.id === milestoneId ? { ...m, status: 'approved' as const } : m
      );
      setMilestones(updatedMilestones);

      updateTransaction(txHash, 'success', `Milestone "${milestone?.title}" approved successfully`);

      addToast({
        type: 'success',
        title: 'Milestone Approved!',
        message: `${milestone?.title} has been approved and is ready for fund release.`,
        duration: 5000,
      });
    } catch (error) {
      console.error('Failed to approve milestone:', error);
      const milestone = milestones.find(m => m.id === milestoneId);
      const txHash = `approve_failed_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      addTransaction({
        hash: txHash,
        status: 'failed',
        message: `Failed to approve milestone "${milestone?.title}": ${error instanceof Error ? error.message : 'Unknown error'}`,
        type: 'approve',
        demoId: 'dispute-resolution',
      });

      addToast({
        type: 'error',
        title: 'Approval Failed',
        message: 'Failed to approve the milestone.',
        duration: 5000,
      });
    } finally {
      // Clear loading state for this specific milestone
      setMilestoneLoadingStates(prev => ({ ...prev, [milestoneId]: false }));
    }
  }

  async function handleStartDispute(milestoneId: string) {
    if (!walletData) {
      addToast({
        type: 'warning',
        title: '🔗 Wallet Connection Required',
        message: 'Please connect your Stellar wallet to start disputes',
        duration: 5000,
      });
      return;
    }
    const disputeReason = disputeReasons[milestoneId] || '';
    if (!contractId || !disputeReason.trim()) return;

    try {
      // Set loading state for this specific milestone
      setMilestoneLoadingStates(prev => ({ ...prev, [milestoneId]: true }));

      const milestone = milestones.find(m => m.id === milestoneId);
      const txHash = `dispute_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      addTransaction({
        hash: txHash,
        status: 'pending',
        message: `Raising dispute for "${milestone?.title}"...`,
        type: 'dispute',
        demoId: 'dispute-resolution',
        amount: milestone?.amount ? (parseInt(milestone.amount) / 100000).toFixed(1) : '0',
        asset: 'USDC',
      });

      const payload = {
        contractId,
        milestoneId,
        releaseMode: 'multi-release',
        reason: disputeReason,
      };

      const result = await hooks.startDispute.startDispute(payload);
      setEscrowData(result.escrow);

      // Create new dispute
      const newDispute: Dispute = {
        id: `dispute_${Date.now()}`,
        milestoneId,
        raisedBy: currentRole,
        reason: disputeReason,
        status: 'open',
        raisedAt: new Date().toISOString(),
      };

      setDisputes([...disputes, newDispute]);

      // Clear the specific dispute reason
      setDisputeReasons(prev => ({ ...prev, [milestoneId]: '' }));

      // Update milestone status
      const updatedMilestones = milestones.map(m =>
        m.id === milestoneId ? { ...m, status: 'disputed' as const } : m
      );
      setMilestones(updatedMilestones);

      updateTransaction(
        txHash,
        'success',
        `Dispute raised for "${milestone?.title}" - awaiting arbitrator resolution`
      );

      addToast({
        type: 'warning',
        title: 'Dispute Raised!',
        message: `Dispute has been raised for ${milestone?.title}. Awaiting arbitrator resolution.`,
        duration: 5000,
      });
    } catch (error) {
      console.error('Failed to start dispute:', error);
      const milestone = milestones.find(m => m.id === milestoneId);
      const txHash = `dispute_failed_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      addTransaction({
        hash: txHash,
        status: 'failed',
        message: `Failed to raise dispute for "${milestone?.title}": ${error instanceof Error ? error.message : 'Unknown error'}`,
        type: 'dispute',
        demoId: 'dispute-resolution',
      });

      addToast({
        type: 'error',
        title: 'Dispute Failed',
        message: 'Failed to raise the dispute.',
        duration: 5000,
      });
    } finally {
      // Clear loading state for this specific milestone
      setMilestoneLoadingStates(prev => ({ ...prev, [milestoneId]: false }));
    }
  }

  async function handleResolveDispute(
    disputeId: string,
    resolution: 'approve' | 'reject' | 'modify'
  ) {
    if (!walletData) {
      addToast({
        type: 'warning',
        title: '🔗 Wallet Connection Required',
        message: 'Please connect your Stellar wallet to resolve disputes',
        duration: 5000,
      });
      return;
    }
    if (!contractId) return;

    try {
      const dispute = disputes.find(d => d.id === disputeId);
      if (!dispute) return;

      const milestone = milestones.find(m => m.id === dispute.milestoneId);
      const txHash = `resolve_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      addTransaction({
        hash: txHash,
        status: 'pending',
        message: `Resolving dispute for "${milestone?.title}" (${resolution})...`,
        type: 'dispute',
        demoId: 'dispute-resolution',
        amount: milestone?.amount ? (parseInt(milestone.amount) / 100000).toFixed(1) : '0',
        asset: 'USDC',
      });

      const resolutionReason =
        resolutionReasons[disputeId] || `Resolved by arbitrator: ${resolution}`;

      const payload = {
        contractId,
        milestoneId: dispute.milestoneId,
        releaseMode: 'multi-release',
        resolution,
        reason: resolutionReason,
      };

      const result = await hooks.resolveDispute.resolveDispute(payload);
      setEscrowData(result.escrow);

      // Update dispute status
      const updatedDisputes = disputes.map(d =>
        d.id === disputeId
          ? {
              ...d,
              status: 'resolved' as const,
              resolvedAt: new Date().toISOString(),
              resolution,
              resolutionReason: payload.reason,
              arbitrator: currentRole,
            }
          : d
      );
      setDisputes(updatedDisputes);

      // Update milestone status based on resolution
      const updatedMilestones = milestones.map(m => {
        if (m.id === dispute.milestoneId) {
          if (resolution === 'approve') {
            return { ...m, status: 'approved' as const };
          } else if (resolution === 'reject') {
            return { ...m, status: 'cancelled' as const };
          } else {
            return { ...m, status: 'pending' as const };
          }
        }
        return m;
      });
      setMilestones(updatedMilestones);

      updateTransaction(
        txHash,
        'success',
        `Dispute for "${milestone?.title}" resolved: ${resolution}`
      );

      addToast({
        type: 'success',
        title: 'Dispute Resolved!',
        message: `Dispute for ${milestone?.title} has been resolved: ${resolution}.`,
        duration: 5000,
      });

      // Clear the specific resolution reason
      setResolutionReasons(prev => ({ ...prev, [disputeId]: '' }));
    } catch (error) {
      console.error('Failed to resolve dispute:', error);
      const dispute = disputes.find(d => d.id === disputeId);
      const milestone = milestones.find(m => m.id === dispute?.milestoneId);
      const txHash = `resolve_failed_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      addTransaction({
        hash: txHash,
        status: 'failed',
        message: `Failed to resolve dispute for "${milestone?.title}": ${error instanceof Error ? error.message : 'Unknown error'}`,
        type: 'dispute',
        demoId: 'dispute-resolution',
      });

      addToast({
        type: 'error',
        title: 'Resolution Failed',
        message: 'Failed to resolve the dispute.',
        duration: 5000,
      });
    }
  }

  async function handleReleaseAllFunds() {
    if (!walletData) {
      addToast({
        type: 'warning',
        title: '🔗 Wallet Connection Required',
        message: 'Please connect your Stellar wallet to release funds',
        duration: 5000,
      });
      return;
    }
    if (!contractId) return;

    // Check if all milestones are approved
    const allApproved = milestones.every(m => m.status === 'approved');
    if (!allApproved) {
      addToast({
        type: 'warning',
        title: '⚠️ Not Ready',
        message: 'All milestones must be approved before releasing funds',
        duration: 5000,
      });
      return;
    }

    try {
      // Set loading state for all milestones
      setMilestoneLoadingStates(prev => {
        const newState = { ...prev };
        milestones.forEach(m => {
          newState[m.id] = true;
        });
        return newState;
      });

      const txHash = `release_all_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      addTransaction({
        hash: txHash,
        status: 'pending',
        message: 'Releasing all funds...',
        type: 'release',
        demoId: 'dispute-resolution',
        amount: milestones.reduce((total, m) => total + (parseInt(m.amount) / 100000), 0).toFixed(1),
        asset: 'USDC',
      });

      const payload = {
        contractId,
        milestoneIds: milestones.map(m => m.id),
        releaseMode: 'single-release', // Changed to single release
      };

      const result = await hooks.releaseFunds.releaseFunds(payload);
      setEscrowData(result.escrow);

      // Update all milestone statuses to released
      const updatedMilestones = milestones.map(m => ({ ...m, status: 'released' as const }));
      setMilestones(updatedMilestones);

      updateTransaction(txHash, 'success', 'All funds released successfully');

      addToast({
        type: 'success',
        title: '💰 All Funds Released!',
        message: 'All milestone funds have been released successfully',
        duration: 5000,
      });
    } catch (error) {
      console.error('Failed to release all funds:', error);
      const txHash = `release_all_failed_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      addTransaction({
        hash: txHash,
        status: 'failed',
        message: `Failed to release all funds: ${error instanceof Error ? error.message : 'Unknown error'}`,
        type: 'release',
        demoId: 'dispute-resolution',
      });

      addToast({
        type: 'error',
        title: 'Release Failed',
        message: 'Failed to release all funds. Please try again.',
        duration: 5000,
      });
    } finally {
      // Clear loading state for all milestones
      setMilestoneLoadingStates(prev => {
        const newState = { ...prev };
        milestones.forEach(m => {
          newState[m.id] = false;
        });
        return newState;
      });
    }
  }

  function resetDemo() {
    setContractId('');
    setEscrowData(null);
    setCurrentRole('client');
    setDisputes([]);
    setNewDisputeReason('');
    setResolutionReason('');

    // Reset milestone statuses
    const resetMilestones = milestones.map(m => ({ ...m, status: 'pending' as const }));
    setMilestones(resetMilestones);

    // Clear all loading states
    setMilestoneLoadingStates({});

    // Clear individual dispute input states
    setDisputeReasons({});
    setResolutionReasons({});

    addToast({
      type: 'info',
      title: 'Demo Reset',
      message: 'Dispute resolution demo has been reset to initial state.',
      duration: 3000,
    });
  }

  const getMilestoneStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-warning-500/20 text-warning-300';
      case 'completed':
        return 'bg-brand-500/20 text-brand-300';
      case 'approved':
        return 'bg-success-500/20 text-success-300';
      case 'disputed':
        return 'bg-danger-500/20 text-danger-300';
      case 'released':
        return 'bg-accent-500/20 text-accent-300';
      case 'cancelled':
        return 'bg-neutral-500/20 text-neutral-300';
      default:
        return 'bg-neutral-500/20 text-neutral-300';
    }
  };

  const canReleaseAllFunds = () => {
    return (
      milestones.every(m => m.status === 'approved') &&
      !disputes.some(d => d.status === 'open')
    );
  };

  return (
    <div className='max-w-6xl mx-auto relative'>
      {/* Main Content */}
      <div className='bg-gradient-to-br from-warning-500/20 to-warning-600/20 backdrop-blur-sm border border-warning-400/30 rounded-xl shadow-2xl p-8 relative'>
        {/* Content */}
        <div className='relative z-10'>
          <div className='text-center mb-8'>
            <h2 className='text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-warning-400 to-warning-500 mb-4'>
              ⚖️ Dispute Resolution Demo
            </h2>
            <p className='text-white/80 text-lg'>
              Arbitration and conflict resolution system for handling escrow disputes
            </p>
          </div>

          {/* Main Demo Content */}

          {/* Role Selection */}
          <div className='mb-8 p-6 bg-white/5 rounded-lg border border-white/20'>
            <h3 className='text-xl font-semibold text-white mb-4'>👤 Select Your Role</h3>
            <div className='flex space-x-4'>
              {(['client', 'worker', 'arbitrator'] as const).map(role => (
                <button
                  key={role}
                  onClick={() => setCurrentRole(role)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                    currentRole === role
                      ? 'bg-warning-500/30 border-2 border-warning-400/50 text-warning-200'
                      : 'bg-white/5 border border-white/20 text-white/70 hover:bg-white/10 hover:border-white/30'
                  }`}
                >
                  {role === 'client' && '👔 Client'}
                  {role === 'worker' && '👷 Worker'}
                  {role === 'arbitrator' && '⚖️ Arbitrator'}
                </button>
              ))}
            </div>
            <p className='text-sm text-white/60 mt-3'>
              Current role: <span className='text-warning-300 capitalize'>{currentRole}</span>
            </p>
          </div>

          {/* Demo Setup */}
          {!contractId && (
            <div className='mb-8 p-6 bg-white/5 rounded-lg border border-white/20'>
              <h3 className='text-xl font-semibold text-white mb-4'>🚀 Setup Demo</h3>

              {/* Wallet Connection Required Message */}
              {!isConnected && (
                <div className='mb-6 p-4 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/30 rounded-lg text-center'>
                  <div className='flex items-center justify-center space-x-2 mb-3'>
                    <span className='text-2xl'>🔐</span>
                    <h4 className='text-lg font-semibold text-cyan-300'>
                      Wallet Connection Required
                    </h4>
                  </div>
                  <p className='text-white/80 text-sm mb-4'>
                    You need to connect your Stellar wallet to initialize the escrow contract and
                    use this demo.
                  </p>
                  <button
                    onClick={() => {
                      // Dispatch custom event to open wallet sidebar
                      window.dispatchEvent(new CustomEvent('toggleWalletSidebar'));
                    }}
                    className='px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border border-white/20 hover:border-white/40'
                  >
                    🔗 Connect Wallet
                  </button>
                </div>
              )}

              <div className='grid md:grid-cols-2 gap-6'>
                <div>
                  <h4 className='font-semibold text-warning-300 mb-3'>Milestones</h4>
                  <div className='space-y-2'>
                    {milestones.map(milestone => (
                      <div key={milestone.id} className='p-3 bg-white/5 rounded-lg'>
                        <p className='font-medium text-white'>{milestone.title}</p>
                        <p className='text-sm text-white/70'>{milestone.description}</p>
                        <p className='text-xs text-warning-300 mt-1'>
                          {(parseInt(milestone.amount) / 100000).toFixed(1)} USDC
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className='font-semibold text-warning-300 mb-3'>Dispute Flow</h4>
                  <div className='space-y-2 text-sm text-white/70'>
                    <p>• Worker completes milestone</p>
                    <p>• Client can approve or dispute</p>
                    <p>• Arbitrator resolves disputes</p>
                    <p>• Funds released based on resolution</p>
                  </div>
                </div>
              </div>
              <div className='mt-6 text-center'>
                <Tooltip
                  content={
                    (!isConnected || hooks.initializeEscrow.isLoading) ? (
                      !isConnected ? (
                        <div className='text-center'>
                          <div className='text-red-300 font-semibold mb-1'>🔌 Wallet Not Connected</div>
                          <div className='text-xs text-gray-300'>
                            Please connect your wallet to execute this demo step
                          </div>
                        </div>
                      ) : (
                        <div className='text-center'>
                          <div className='text-yellow-300 font-semibold mb-1'>🌐 Switch to Testnet</div>
                          <div className='text-xs text-gray-300'>
                            Please choose "Testnet" in the navbar to run demo execute tests
                          </div>
                        </div>
                      )
                    ) : null
                  }
                  position='top'
                >
                  <button
                    onClick={handleInitializeEscrow}
                    disabled={!isConnected || hooks.initializeEscrow.isLoading}
                    className='px-8 py-3 bg-warning-500/20 hover:bg-warning-500/30 border border-warning-400/30 rounded-lg text-warning-300 hover:text-warning-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    {hooks.initializeEscrow.isLoading
                      ? 'Initializing...'
                      : 'Initialize Dispute Resolution Escrow'}
                  </button>
                </Tooltip>
              </div>
            </div>
          )}

          {/* Contract Information */}
          {contractId && (
            <div className='mb-8 p-6 bg-white/5 rounded-lg border border-white/20'>
              <div className='flex items-center justify-between mb-4'>
                <h3 className='text-xl font-semibold text-white'>Contract Information</h3>
                <button
                  onClick={resetDemo}
                  className='px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 rounded-lg text-red-300 hover:text-red-200 transition-colors'
                >
                  🔄 Reset Demo
                </button>
              </div>
              <div className='grid md:grid-cols-3 gap-4 text-sm'>
                <div>
                  <p className='text-white/70'>Contract ID:</p>
                  <p className='font-mono text-warning-300 bg-warning-900/30 px-2 py-1 rounded'>
                    {contractId.slice(0, 20)}...
                  </p>
                </div>
                <div>
                  <p className='text-white/70'>Status:</p>
                  <p className='text-warning-300'>{escrowData?.status || 'Active'}</p>
                </div>
                <div>
                  <p className='text-white/70'>Total Amount:</p>
                  <p className='text-warning-300'>10 USDC</p>
                </div>
              </div>

              {!escrowData?.metadata?.funded && (
                <div className='mt-4 text-center'>
                  <button
                    onClick={handleFundEscrow}
                    disabled={hooks.fundEscrow.isLoading}
                    className='px-6 py-2 bg-warning-500/20 hover:bg-warning-500/30 border border-warning-400/30 rounded-lg text-warning-300 hover:text-warning-200 transition-colors'
                  >
                    {hooks.fundEscrow.isLoading ? 'Funding...' : 'Fund Escrow'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Milestones Management */}
          {contractId && escrowData?.metadata?.funded && (
            <div className='mb-8'>
              <h3 className='text-xl font-semibold text-white mb-6'>📋 Milestones Management</h3>
              <div className='space-y-6'>
                {milestones.map(milestone => (
                  <div
                    key={milestone.id}
                    className='p-6 bg-white/5 rounded-lg border border-white/20'
                  >
                    <div className='flex items-start justify-between mb-4'>
                      <div className='flex-1'>
                        <h4 className='text-lg font-semibold text-white mb-2'>{milestone.title}</h4>
                        <p className='text-white/70 mb-3'>{milestone.description}</p>
                        <div className='flex items-center space-x-4 text-sm'>
                          <span className='text-warning-300'>
                            {(parseInt(milestone.amount) / 100000).toFixed(1)} USDC
                          </span>
                          <span
                            className={`px-2 py-1 rounded text-xs ${getMilestoneStatusColor(milestone.status)}`}
                          >
                            {milestone.status.charAt(0).toUpperCase() + milestone.status.slice(1)}
                          </span>
                        </div>
                      </div>
                      <div className='text-right space-y-2'>
                        {/* Worker Actions */}
                        {currentRole === 'worker' && milestone.status === 'pending' && (
                          <button
                            onClick={() => handleCompleteMilestone(milestone.id)}
                            disabled={milestoneLoadingStates[milestone.id]}
                            className='px-4 py-2 bg-warning-500/20 hover:bg-warning-500/30 border border-warning-400/30 rounded-lg text-warning-300 hover:text-warning-200 transition-colors block w-full'
                          >
                            {milestoneLoadingStates[milestone.id]
                              ? 'Completing...'
                              : 'Mark Complete'}
                          </button>
                        )}

                        {/* Client Actions */}
                        {currentRole === 'client' && milestone.status === 'completed' && (
                          <div className='space-y-2'>
                            <button
                              onClick={() => handleApproveMilestone(milestone.id)}
                              disabled={milestoneLoadingStates[milestone.id]}
                              className='px-4 py-2 bg-warning-500/20 hover:bg-warning-500/30 border border-warning-400/30 rounded-lg text-warning-300 hover:text-warning-200 transition-colors block w-full'
                            >
                              {milestoneLoadingStates[milestone.id] ? 'Approving...' : 'Approve'}
                            </button>
                            <button
                              onClick={() => handleStartDispute(milestone.id)}
                              disabled={
                                milestoneLoadingStates[milestone.id] ||
                                !(disputeReasons[milestone.id] || '').trim()
                              }
                              className='px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 rounded-lg text-red-300 hover:text-red-200 transition-colors block w-full'
                            >
                              {milestoneLoadingStates[milestone.id] ? 'Starting...' : 'Dispute'}
                            </button>
                          </div>
                        )}

                      </div>
                    </div>

                    {/* Dispute Input for Client */}
                    {currentRole === 'client' && milestone.status === 'completed' && (
                      <div className='mt-4 p-4 bg-red-500/10 border border-red-400/30 rounded-lg'>
                        <h5 className='text-sm font-medium text-red-300 mb-2'>Raise Dispute</h5>
                        <div className='flex space-x-2'>
                          <input
                            type='text'
                            value={disputeReasons[milestone.id] || ''}
                            onChange={e =>
                              setDisputeReasons(prev => ({
                                ...prev,
                                [milestone.id]: e.target.value,
                              }))
                            }
                            placeholder='Enter dispute reason...'
                            className='flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-red-400/50'
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Disputes Management */}
          {disputes.length > 0 && (
            <div className='mb-8'>
              <h3 className='text-xl font-semibold text-white mb-6'>⚖️ Active Disputes</h3>
              <div className='space-y-4'>
                {disputes.map(dispute => (
                  <div
                    key={dispute.id}
                    className='p-6 bg-white/5 rounded-lg border border-white/20'
                  >
                    <div className='flex items-start justify-between mb-4'>
                      <div className='flex-1'>
                        <h4 className='text-lg font-semibold text-white mb-2'>
                          Dispute for {milestones.find(m => m.id === dispute.milestoneId)?.title}
                        </h4>
                        <p className='text-white/70 mb-3'>{dispute.reason}</p>
                        <div className='flex items-center space-x-4 text-sm'>
                          <span className='text-red-300'>Raised by: {dispute.raisedBy}</span>
                          <span className='text-red-300'>Status: {dispute.status}</span>
                          <span className='text-red-300'>
                            Raised: {new Date(dispute.raisedAt).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Arbitrator Actions */}
                      {currentRole === 'arbitrator' && dispute.status === 'open' && (
                        <div className='space-y-2'>
                          <div className='mb-3'>
                            <input
                              type='text'
                              value={resolutionReasons[dispute.id] || ''}
                              onChange={e =>
                                setResolutionReasons(prev => ({
                                  ...prev,
                                  [dispute.id]: e.target.value,
                                }))
                              }
                              placeholder='Enter resolution reason...'
                              className='w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-orange-400/50'
                            />
                          </div>
                          <div className='grid grid-cols-3 gap-2'>
                            <button
                              onClick={() => handleResolveDispute(dispute.id, 'approve')}
                              disabled={hooks.resolveDispute.isLoading}
                              className='px-3 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-400/30 rounded-lg text-green-300 hover:text-green-200 transition-colors text-sm'
                            >
                              {hooks.resolveDispute.isLoading ? '...' : 'Approve'}
                            </button>
                            <button
                              onClick={() => handleResolveDispute(dispute.id, 'reject')}
                              disabled={hooks.resolveDispute.isLoading}
                              className='px-3 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 rounded-lg text-red-300 hover:text-red-200 transition-colors text-sm'
                            >
                              {hooks.resolveDispute.isLoading ? '...' : 'Reject'}
                            </button>
                            <button
                              onClick={() => handleResolveDispute(dispute.id, 'modify')}
                              disabled={hooks.resolveDispute.isLoading}
                              className='px-3 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-400/30 rounded-lg text-yellow-300 hover:text-yellow-200 transition-colors text-sm'
                            >
                              {hooks.resolveDispute.isLoading ? '...' : 'Modify'}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Resolved Dispute Info */}
                      {dispute.status === 'resolved' && (
                        <div className='text-right'>
                          <div
                            className={`px-3 py-2 rounded text-sm ${
                              dispute.resolution === 'approve'
                                ? 'bg-green-500/20 text-green-300'
                                : dispute.resolution === 'reject'
                                  ? 'bg-red-500/20 text-red-300'
                                  : 'bg-yellow-500/20 text-yellow-300'
                            }`}
                          >
                            {dispute.resolution?.toUpperCase()}
                          </div>
                          <p className='text-xs text-white/60 mt-1'>
                            Resolved by {dispute.arbitrator}
                          </p>
                          <p className='text-xs text-white/60'>
                            {dispute.resolvedAt
                              ? new Date(dispute.resolvedAt).toLocaleString()
                              : ''}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Release All Funds Button */}
          {contractId && escrowData?.metadata?.funded && !milestones.every(m => m.status === 'released') && (
            <div className='mb-8 p-6 bg-gradient-to-r from-warning-500/20 to-warning-600/20 border border-warning-400/30 rounded-lg text-center'>
              <h3 className='text-xl font-semibold text-warning-300 mb-4'>💰 Release All Funds</h3>
              <p className='text-warning-200 mb-4'>
                {canReleaseAllFunds() 
                  ? 'All milestones have been approved and disputes resolved. Ready to release all funds!'
                  : 'Complete all milestones and resolve any disputes to release funds.'
                }
              </p>
              
              {/* Milestone Status Summary */}
              <div className='mb-4 p-4 bg-white/5 rounded-lg'>
                <h4 className='text-sm font-semibold text-white mb-2'>Milestone Status:</h4>
                <div className='grid grid-cols-2 gap-2 text-sm'>
                  {milestones.map(milestone => (
                    <div key={milestone.id} className='flex items-center justify-between'>
                      <span className='text-white/70'>{milestone.title}</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        milestone.status === 'approved' ? 'bg-green-500/20 text-green-300' :
                        milestone.status === 'completed' ? 'bg-blue-500/20 text-blue-300' :
                        milestone.status === 'pending' ? 'bg-gray-500/20 text-gray-300' :
                        milestone.status === 'released' ? 'bg-purple-500/20 text-purple-300' :
                        'bg-red-500/20 text-red-300'
                      }`}>
                        {milestone.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <Tooltip
                content={
                  (!canReleaseAllFunds() || Object.values(milestoneLoadingStates).some(loading => loading)) ? (
                    Object.values(milestoneLoadingStates).some(loading => loading) ? (
                      <div className='text-center'>
                        <div className='text-blue-300 font-semibold mb-1'>⏳ Processing...</div>
                        <div className='text-xs text-gray-300'>
                          Please wait for the current operation to complete
                        </div>
                      </div>
                    ) : (
                      <div className='text-center'>
                        <div className='text-gray-300 font-semibold mb-1'>⏳ Complete All Milestones First</div>
                        <div className='text-xs text-gray-300'>
                          All milestones must be completed before releasing funds
                        </div>
                      </div>
                    )
                  ) : null
                }
                position='top'
              >
                <button
                  onClick={handleReleaseAllFunds}
                  disabled={!canReleaseAllFunds() || Object.values(milestoneLoadingStates).some(loading => loading)}
                  className={`px-8 py-4 font-bold rounded-xl transition-all duration-300 transform shadow-lg border-2 ${
                    canReleaseAllFunds()
                      ? 'bg-gradient-to-r from-warning-500 to-warning-600 hover:from-warning-600 hover:to-warning-700 text-white border-warning-400 hover:border-warning-300 hover:scale-105 hover:shadow-warning-500/50'
                      : 'bg-gray-600 text-gray-400 border-gray-600 cursor-not-allowed'
                  }`}
                >
                  {Object.values(milestoneLoadingStates).some(loading => loading) 
                    ? 'Releasing All Funds...' 
                    : canReleaseAllFunds() 
                      ? '🚀 Release All Funds' 
                      : '⏳ Complete All Milestones First'
                  }
                </button>
              </Tooltip>
            </div>
          )}

          {/* Success Message - Demo Completion */}
          {milestones.every(m => m.status === 'released') && (
            <div className='mb-8 p-6 bg-success-500/20 border border-success-400/30 rounded-lg text-center'>
              <div className='flex justify-center mb-4'>
                <Image
                  src='/images/logo/logoicon.png'
                  alt='Stellar Nexus Logo'
                  width={80}
                  height={80}
                  className='animate-bounce'
                />
              </div>
              <h3 className='text-2xl font-bold text-success-300 mb-2'>
                Demo Completed Successfully!
              </h3>
              <p className='text-green-200 mb-4'>
                You've successfully completed the entire dispute resolution and arbitration flow.
                All milestones were processed and funds were automatically released.
              </p>
              <div className='bg-success-500/10 p-4 rounded-lg border border-success-400/30'>
                <h4 className='font-semibold text-success-300 mb-2'>What You Just Experienced:</h4>
                <ul className='text-green-200 text-sm space-y-1 text-left'>
                  <li>✅ Created a dispute resolution escrow contract on Stellar blockchain</li>
                  <li>✅ Secured funds in escrow with USDC</li>
                  <li>✅ Demonstrated milestone completion and approval workflow</li>
                  <li>✅ Experienced dispute creation and resolution system</li>
                  <li>✅ Showed arbitrator intervention and decision-making process</li>
                  <li>✅ Proved automatic fund release based on dispute resolution</li>
                  <li>✅ Established transparent dispute history and timeline tracking</li>
                </ul>
              </div>
            </div>
          )}

          {/* Confetti Animation */}
          <ConfettiAnimation isActive={showConfetti} />

          {/* Error Display */}
          {(hooks.initializeEscrow.error ||
            hooks.fundEscrow.error ||
            hooks.changeMilestoneStatus.error ||
            hooks.approveMilestone.error ||
            hooks.releaseFunds.error ||
            hooks.startDispute.error ||
            hooks.resolveDispute.error) && (
            <div className='p-4 bg-red-500/20 border border-red-400/30 rounded-lg'>
              <h4 className='font-semibold text-red-300 mb-2'>Error Occurred</h4>
              <p className='text-red-200 text-sm'>
                {hooks.initializeEscrow.error?.message ||
                  hooks.fundEscrow.error?.message ||
                  hooks.changeMilestoneStatus.error?.message ||
                  hooks.approveMilestone.error?.message ||
                  hooks.releaseFunds.error?.message ||
                  hooks.startDispute.error?.message ||
                  hooks.resolveDispute.error?.message ||
                  'An unknown error occurred'}
              </p>
            </div>
          )}

          {/* Demo Instructions */}
          <div className='mt-8 p-6 bg-warning-500/10 border border-warning-400/30 rounded-lg'>
            <h3 className='text-lg font-semibold text-warning-300 mb-3'>📚 How This Demo Works</h3>
            <ul className='text-warning-200 text-sm space-y-2'>
              <li>
                • <strong>Role-Based Actions:</strong> Switch between client, worker, and arbitrator
                roles
              </li>
              <li>
                • <strong>Dispute Creation:</strong> Clients can dispute completed milestones with
                reasons
              </li>
              <li>
                • <strong>Arbitration Process:</strong> Arbitrators resolve disputes with three
                options
              </li>
              <li>
                • <strong>Smart Contract Enforcement:</strong> All resolutions are enforced on-chain
              </li>
              <li>
                • <strong>Transparent History:</strong> Complete dispute timeline and resolution
                tracking
              </li>
            </ul>
            <p className='text-warning-200 text-sm mt-3'>
              This demonstrates how complex dispute resolution workflows can be automated on
              Stellar, providing transparency and reducing the need for traditional legal
              intervention.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
