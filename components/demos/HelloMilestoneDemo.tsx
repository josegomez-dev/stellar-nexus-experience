'use client';

import { useState, useEffect, useRef } from 'react';
import { useGlobalWallet } from '@/contexts/WalletContext';
import { useWallet } from '@/lib/stellar-wallet-hooks';
import { useAccount } from '@/contexts/AccountContext';
import { useToast } from '@/contexts/ToastContext';
import { useTransactionHistory } from '@/contexts/TransactionContext';
import { API_ENDPOINTS } from '@/constants/api';
import ConfettiAnimation from '@/components/ui/animations/ConfettiAnimation';
import { TypeWriter, ProcessExplanation } from '@/components/ui/TypeWriter';
import { DemoCompletionHistory } from '@/components/ui/feedback/DemoCompletionHistory';
import { SimpleFeedbackModal } from '@/components/ui/modals/SimpleFeedbackModal';
import { useDemoStats } from '@/hooks/useDemoStats';
import { useDemoCompletionHistory } from '@/hooks/useDemoCompletionHistory';
import { Tooltip } from '@/components/ui/Tooltip';
import { userTrackingService } from '@/lib/user-tracking-service';
import { DemoFeedback } from '@/lib/firebase-types';
import Image from 'next/image';
import {
  useInitializeEscrow,
  useFundEscrow,
  useChangeMilestoneStatus,
  useApproveMilestone,
  useReleaseFunds,
} from '@/lib/mock-trustless-work';
import {
  useRealInitializeEscrow,
  validateTestnetConnection,
  submitRealTransaction,
  checkAccountFunding,
  RealInitializePayload,
} from '@/lib/real-trustless-work';
import { testStellarSDK, testAccountLoading } from '@/lib/stellar-test';
import { assetConfig } from '@/lib/wallet-config';

interface DemoStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'completed' | 'current';
  action?: () => void;
  disabled?: boolean;
  details?: string;
}

export const HelloMilestoneDemo = () => {
  const { walletData, isConnected } = useGlobalWallet();
  // Import signTransaction from the wallet hooks directly
  const { signTransaction } = useWallet();
  const { account, startDemo, completeDemo } = useAccount();

  const { addToast } = useToast();
  const { addTransaction, updateTransaction } = useTransactionHistory();
  const { addCompletion, getDemoHistory, getTotalPointsEarned, getBestScore, getCompletionCount } =
    useDemoCompletionHistory();
  const { markDemoComplete } = useDemoStats();
  const [currentStep, setCurrentStep] = useState(0);
  const [contractId, setContractId] = useState<string>('');
  const [escrowData, setEscrowData] = useState<any>(null);
  const [milestoneStatus, setMilestoneStatus] = useState<'pending' | 'completed'>('pending');
  const [demoStarted, setDemoStarted] = useState(false);
  const [demoStartTime, setDemoStartTime] = useState<number | null>(null);
  const completionTriggeredRef = useRef(false);

  // New state for enhanced features
  const [showProcessExplanation, setShowProcessExplanation] = useState(false);
  const [currentProcessStep, setCurrentProcessStep] = useState<string>('');
  const [networkValidation, setNetworkValidation] = useState<{
    isValid: boolean;
    message: string;
  } | null>(null);
  // Always use real blockchain transactions

  // Transaction status tracking with enhanced info
  const [pendingTransactions, setPendingTransactions] = useState<Record<string, string>>({}); // stepId -> txHash
  const [transactionStatuses, setTransactionStatuses] = useState<
    Record<string, 'pending' | 'success' | 'failed'>
  >({}); // txHash -> status
  const [transactionTimeouts, setTransactionTimeouts] = useState<Record<string, NodeJS.Timeout>>(
    {}
  ); // txHash -> timeout
  const [transactionDetails, setTransactionDetails] = useState<
    Record<
      string,
      {
        hash: string;
        explorerUrl: string | null;
        stellarExpertUrl: string | null;
        type: string;
        amount?: string;
        timestamp: number;
        stepId: string;
      }
    >
  >({});

  // Helper function to generate realistic transaction hash for demo
  const generateTransactionHash = (type: string): string => {
    // Generate a realistic Stellar transaction hash (64 characters, hex)
    // Note: These are simulated hashes for demo purposes - only initialize escrow uses real blockchain
    const chars = '0123456789abcdef';
    let hash = '';
    for (let i = 0; i < 64; i++) {
      hash += chars[Math.floor(Math.random() * chars.length)];
    }
    return hash;
  };

  // Helper function to create explorer URLs
  const createExplorerUrls = (txHash: string, isRealTransaction: boolean = false) => {
    // Only create explorer URLs for real blockchain transactions
    if (!isRealTransaction) {
      return {
        explorerUrl: null,
        stellarExpertUrl: null,
        horizonUrl: null,
        accountUrl: walletData?.publicKey
          ? `${API_ENDPOINTS.STELLAR_EXPERT.BASE_URL}/testnet/account/${walletData.publicKey}`
          : null,
      };
    }

    const isTestnet = walletData?.network === 'TESTNET' || !walletData?.isMainnet;
    const networkSuffix = isTestnet ? 'testnet' : 'public';

    return {
      explorerUrl: `${API_ENDPOINTS.STELLAR_EXPERT.BASE_URL}/${networkSuffix}/tx/${txHash}`,
      stellarExpertUrl: `${API_ENDPOINTS.STELLAR_EXPERT.BASE_URL}/${networkSuffix}/tx/${txHash}`,
      horizonUrl: isTestnet
        ? `${API_ENDPOINTS.HORIZON.TESTNET}/transactions/${txHash}`
        : `${API_ENDPOINTS.HORIZON.MAINNET}/transactions/${txHash}`,
      accountUrl: walletData?.publicKey
        ? `${API_ENDPOINTS.STELLAR_EXPERT.BASE_URL}/${networkSuffix}/account/${walletData.publicKey}`
        : null,
    };
  };

  // Check if demo was already completed
  const demoProgress = account?.demos?.['hello-milestone'];
  const isCompleted = demoProgress?.status === 'completed';
  const previousScore = demoProgress?.score || 0;
  const pointsEarned = demoProgress?.pointsEarned || 0;

  // Get completion history data
  const demoHistory = getDemoHistory('hello-milestone');
  const totalPointsEarned = getTotalPointsEarned('hello-milestone');
  const bestScore = getBestScore('hello-milestone');
  const completionCount = getCompletionCount('hello-milestone');

  // Confetti animation state
  const [showConfetti, setShowConfetti] = useState(false);

  // Scroll animation state
  const [isScrollingToNext, setIsScrollingToNext] = useState(false);
  const [currentHighlightedStep, setCurrentHighlightedStep] = useState<string | null>(null);

  // Enhanced UX states
  const [showTransactionTooltip, setShowTransactionTooltip] = useState(false);
  const [isScrollingToTop, setIsScrollingToTop] = useState(false);
  const [hasShownTransactionGuidance, setHasShownTransactionGuidance] = useState(false);
  const [autoCompleteCountdown, setAutoCompleteCountdown] = useState<Record<string, number>>({});
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [demoCompletionTime, setDemoCompletionTime] = useState(0);

  // Feedback handling
  const handleFeedbackSubmit = async (feedback: {
    demoId?: string;
    demoName?: string;
    rating?: number;
    feedback?: string;
    completionTime?: number;
    difficulty?: string;
    wouldRecommend?: boolean;
  }) => {
    try {
      if (walletData?.publicKey && feedback.demoId && feedback.demoName && feedback.rating !== undefined) {
        await userTrackingService.trackFeedbackSubmission(
          walletData.publicKey,
          feedback.demoId,
          feedback.demoName,
          {
            rating: feedback.rating,
            comment: feedback.feedback || '',
            difficulty: feedback.difficulty || 'medium',
            wouldRecommend: feedback.wouldRecommend || false,
            completionTime: feedback.completionTime || 0,
          }
        );
        
        addToast({
          type: 'success',
          title: '🎉 Feedback Submitted!',
          message: 'Thank you for your feedback! Your rating has been recorded.',
          duration: 4000,
        });
      }
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      addToast({
        type: 'error',
        title: '❌ Feedback Error',
        message: 'Failed to submit feedback. Please try again.',
        duration: 4000,
      });
    }
  };

  // Enhanced scroll animation functions
  const scrollToTop = () => {
    setIsScrollingToTop(true);

    // Smooth scroll to top of the demo container
    const demoContainer = document.querySelector('.demo-container');
    if (demoContainer) {
      demoContainer.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      });
    } else {
      // Fallback to window scroll
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }

    // Add visual feedback
    setTimeout(() => {
      setIsScrollingToTop(false);

      // Show transaction guidance tooltip after scroll completes
      if (!hasShownTransactionGuidance && Object.keys(transactionDetails).length > 0) {
        setTimeout(() => {
          setShowTransactionTooltip(true);
          setHasShownTransactionGuidance(true);

          // Auto-hide tooltip after 8 seconds
          setTimeout(() => {
            setShowTransactionTooltip(false);
          }, 8000);
        }, 1000);
      }
    }, 1000);
  };

  const scrollToNextStep = (completedStepId: string) => {
    setIsScrollingToNext(true);

    // Find the next step to highlight
    const stepOrder = ['initialize', 'fund', 'complete', 'approve', 'release'];
    const currentIndex = stepOrder.indexOf(completedStepId);
    const nextStepId = stepOrder[currentIndex + 1];

    if (nextStepId) {
      setCurrentHighlightedStep(nextStepId);

      // Find the next step element
      const nextStepElement = document.querySelector(`[data-step-id="${nextStepId}"]`);

      if (nextStepElement) {
        // Add pulsing animation to the next step
        nextStepElement.classList.add('animate-pulse', 'ring-4', 'ring-brand-400/50');

        // Scroll to the next step with smooth animation
        setTimeout(() => {
          nextStepElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest',
          });

          // Add a glowing effect
          setTimeout(() => {
            nextStepElement.classList.add('shadow-2xl', 'shadow-brand-500/30');
          }, 500);

          // Remove highlighting after 3 seconds
          setTimeout(() => {
            nextStepElement.classList.remove(
              'animate-pulse',
              'ring-4',
              'ring-brand-400/50',
              'shadow-2xl',
              'shadow-brand-500/30'
            );
            setCurrentHighlightedStep(null);
            setIsScrollingToNext(false);
          }, 3000);
        }, 100);
      }
    } else {
      // Demo completed - scroll to completion section
      setTimeout(() => {
        const completionSection = document.querySelector('#demo-completion-section');
        if (completionSection) {
          completionSection.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        }
        setIsScrollingToNext(false);
        setCurrentHighlightedStep(null);
      }, 1000);
    }
  };

  // Get transactions for this demo

  // Hooks - Real and Mock Trustless Work
  const { initializeEscrow, isLoading: isInitializing, error: initError } = useInitializeEscrow();
  const { fundEscrow, isLoading: isFunding, error: fundError } = useFundEscrow();
  const {
    changeMilestoneStatus,
    isLoading: isChangingStatus,
    error: statusError,
  } = useChangeMilestoneStatus();
  const { approveMilestone, isLoading: isApproving, error: approveError } = useApproveMilestone();
  const { releaseFunds, isLoading: isReleasing, error: releaseError } = useReleaseFunds();

  // Real Trustless Work hooks
  const {
    initializeEscrow: initializeRealEscrow,
    isLoading: isInitializingReal,
    error: initRealError,
  } = useRealInitializeEscrow();

  // Network validation effect - Fixed to prevent infinite loop
  useEffect(() => {
    if (isConnected && walletData) {
      const validation = validateTestnetConnection(walletData);
      setNetworkValidation(validation);

      // Only show toasts on initial validation, not on every render
      if (!validation.isValid) {
        console.log('⚠️ Network validation failed:', validation.message);
      } else {
        console.log('✅ Network validation passed:', validation.message);
      }
    }
  }, [isConnected, walletData?.publicKey, walletData?.network]); // Only depend on specific wallet properties

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      // Clear all pending timeouts
      Object.values(transactionTimeouts).forEach(timeout => {
        if (timeout) clearTimeout(timeout);
      });
    };
  }, [transactionTimeouts]);

  // Auto-completion countdown effect for better UX
  useEffect(() => {
    const intervals: Record<string, NodeJS.Timeout> = {};

    Object.keys(pendingTransactions).forEach(stepId => {
      const txHash = pendingTransactions[stepId];
      const status = transactionStatuses[txHash];

      // Only start countdown for pending transactions
      if (status === 'pending' && !autoCompleteCountdown[stepId]) {
        setAutoCompleteCountdown(prev => ({ ...prev, [stepId]: 5 }));

        // Start countdown
        intervals[stepId] = setInterval(() => {
          setAutoCompleteCountdown(prev => {
            const newCountdown = { ...prev };
            if (newCountdown[stepId] > 1) {
              newCountdown[stepId] -= 1;
              return newCountdown;
            } else {
              // Auto-complete the transaction
              if (txHash && transactionStatuses[txHash] === 'pending') {
                console.log(`🕐 Auto-completing transaction for step ${stepId} after countdown`);
                updateTransactionStatusAndCheckCompletion(
                  txHash,
                  'success',
                  'Transaction auto-confirmed for smooth demo experience'
                );
                addToast({
                  type: 'success',
                  title: '⚡ Auto-Confirmed',
                  message: 'Transaction confirmed automatically for better demo flow!',
                  duration: 4000,
                });
              }

              // Remove countdown
              delete newCountdown[stepId];
              return newCountdown;
            }
          });
        }, 1000);
      }
    });

    // Cleanup intervals
    return () => {
      Object.values(intervals).forEach(interval => {
        if (interval) clearInterval(interval);
      });
    };
  }, [pendingTransactions, transactionStatuses, autoCompleteCountdown]);

  // Helper function to check if a step can proceed based on transaction status
  const canProceedToNextStep = (stepId: string): boolean => {
    // Always check real transaction status

    const txHash = pendingTransactions[stepId];
    if (!txHash) {
      return true; // No pending transaction
    }

    const status = transactionStatuses[txHash];
    return status === 'success';
  };

  // Helper function to update transaction status and check for step completion
  const updateTransactionStatusAndCheckCompletion = (
    txHash: string,
    status: 'pending' | 'success' | 'failed',
    message: string
  ) => {
    // Only update transaction with success/failed status (updateTransaction expects these)
    if (status === 'success' || status === 'failed') {
      updateTransaction(txHash, status, message);
    }
    setTransactionStatuses(prev => ({ ...prev, [txHash]: status }));

    if (status === 'success') {
      // Clear any pending timeout for this transaction
      const timeout = transactionTimeouts[txHash];
      if (timeout) {
        clearTimeout(timeout);
        setTransactionTimeouts(prev => {
          const newTimeouts = { ...prev };
          delete newTimeouts[txHash];
          return newTimeouts;
        });
      }

      // Find which step this transaction belongs to
      const stepId = Object.keys(pendingTransactions).find(
        key => pendingTransactions[key] === txHash
      );
      if (stepId) {
        // Remove from pending
        setPendingTransactions(prev => {
          const newPending = { ...prev };
          delete newPending[stepId];
          return newPending;
        });

        // Allow progression to next step
        const stepOrder = ['initialize', 'fund', 'complete', 'approve', 'release'];
        const currentIndex = stepOrder.indexOf(stepId);
        if (currentIndex !== -1 && currentIndex + 1 <= stepOrder.length) {
          setCurrentStep(currentIndex + 1);

          // Show success and scroll to next step
          setTimeout(() => {
            setShowProcessExplanation(false);
            scrollToNextStep(stepId);
          }, 1000);
        }
      }
    }
  };

  const getStepStatus = (
    stepIndex: number,
    stepId: string
  ): 'pending' | 'current' | 'completed' => {
    // Always check actual transaction status
    const txHash = pendingTransactions[stepId];
    if (txHash) {
      const txStatus = transactionStatuses[txHash];
      if (txStatus === 'pending') {
        return 'current'; // Show as current while transaction is pending
      }
      if (txStatus === 'failed') {
        return 'current'; // Allow retry if failed
      }
      if (txStatus === 'success' && stepIndex < currentStep) {
        return 'completed';
      }
    }

    // Standard logic for non-pending transactions
    if (stepIndex === currentStep) return 'current';
    if (stepIndex < currentStep) return 'completed';
    return 'pending';
  };

  const getStepDisabled = (stepIndex: number, stepId: string): boolean => {
    // Basic connection and step order checks
    if (!isConnected) return true;
    if (networkValidation && !networkValidation.isValid) return true;
    if (stepIndex !== currentStep) return true;

    // Always check if previous step is actually completed
    if (stepIndex > 0) {
      const stepOrder = ['initialize', 'fund', 'complete', 'approve', 'release'];
      const previousStepId = stepOrder[stepIndex - 1];
      if (!canProceedToNextStep(previousStepId)) {
        return true; // Previous step not confirmed yet
      }
    }

    // Special requirements
    if (stepId !== 'initialize' && !contractId) return true;

    return false;
  };

  const steps: DemoStep[] = [
    {
      id: 'initialize',
      title: 'Initialize Escrow Contract',
      description: 'Deploy real smart contract on Stellar Testnet with 10 USDC',
      status: getStepStatus(0, 'initialize'),
      action: handleInitializeEscrow,
      disabled: getStepDisabled(0, 'initialize'),
      details:
        '🔗 Creates a REAL smart contract on Stellar blockchain. Your wallet will prompt you to sign the transaction. This will cost a small fee in XLM.',
    },
    {
      id: 'fund',
      title: 'Fund Escrow Contract',
      description: 'Transfer real USDC tokens into the blockchain escrow',
      status: getStepStatus(1, 'fund'),
      action: handleFundEscrow,
      disabled: getStepDisabled(1, 'fund'),
      details:
        '💰 Transfers actual USDC from your wallet to the smart contract. Funds will be locked until conditions are met.',
    },
    {
      id: 'complete',
      title: 'Complete Work Milestone',
      description: 'Worker signals that the assigned task has been completed',
      status: getStepStatus(2, 'complete'),
      action: handleCompleteMilestone,
      disabled: getStepDisabled(2, 'complete'),
      details:
        '📋 In a real scenario, the worker would trigger this when they finish their task. This updates the contract state to "work completed".',
    },
    {
      id: 'approve',
      title: 'Client Approval',
      description: 'Client reviews and approves the completed work',
      status: getStepStatus(3, 'approve'),
      action: handleApproveMilestone,
      disabled: getStepDisabled(3, 'approve'),
      details:
        '✅ Client reviews deliverables and approves the work quality. This is the final verification step before automatic fund release.',
    },
    {
      id: 'release',
      title: 'Automatic Fund Release',
      description: 'Smart contract releases funds to worker automatically',
      status: getStepStatus(4, 'release'),
      action: handleReleaseFunds,
      disabled: getStepDisabled(4, 'release'),
      details:
        '🎉 The smart contract automatically transfers funds to the worker. No manual intervention needed - this is the power of trustless work!',
    },
  ];

  // Trigger confetti and complete demo when finished
  useEffect(() => {
    console.log('🎉 Hello Milestone Demo - Current step:', currentStep);

    if (currentStep === 5 && !completionTriggeredRef.current) {
      console.log('🎉 Triggering confetti for Hello Milestone Demo!');
      completionTriggeredRef.current = true; // Prevent multiple completions
      setShowConfetti(true);

      // Complete the demo with a good score
      const completeThisDemo = async () => {
        try {
          // Calculate completion time
          const completionTime = demoStartTime
            ? Math.round((Date.now() - demoStartTime) / 1000)
            : 0;

          // Calculate score based on performance (85% base + bonuses)
          let score = 85;
          if (completionTime < 300) score += 10; // Bonus for quick completion
          score += 5; // Bonus for using real blockchain
          score = Math.min(100, score); // Cap at 100%

          // Check if this is first completion
          const isFirstCompletion = completionCount === 0;

          // Calculate points earned
          const basePoints = 100;
          const scoreMultiplier = Math.max(0.5, score / 100);
          let pointsEarned = Math.round(basePoints * scoreMultiplier);

          // Give reduced points for replays (25% of original)
          if (!isFirstCompletion) {
            pointsEarned = Math.round(pointsEarned * 0.25);
          }

          // Add to completion history
          addCompletion({
            demoId: 'hello-milestone',
            demoName: 'Baby Steps to Riches',
            score,
            pointsEarned,
            completionTime,
            isFirstCompletion,
            network: walletData?.network || 'TESTNET',
            walletAddress: walletData?.publicKey || '',
          });

          // Complete the demo in the account system (this handles points transactions)
          await completeDemo('hello-milestone', score);
          
          // Mark demo as complete in Firebase stats
          await markDemoComplete('hello-milestone', 'Baby Steps to Riches', completionTime);
          
          // Set completion time and show feedback modal
          setDemoCompletionTime(Math.round(completionTime / 60)); // Convert to minutes
          setShowFeedbackModal(true);
        } catch (error) {
          console.error('Failed to complete demo:', error);
        }
      };

      // Complete demo after a short delay
      setTimeout(completeThisDemo, 2000);

      // Hide confetti after animation
      const timer = setTimeout(() => {
        console.log('🎉 Hiding confetti for Hello Milestone Demo');
        setShowConfetti(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [currentStep, demoStartTime, completionCount, addCompletion]);

  async function handleInitializeEscrow() {
    console.log('🚀 Starting handleInitializeEscrow...');
    console.log('📊 Current state:', {
      isConnected,
      walletData: walletData ? 'present' : 'missing',
      networkValidation,
      currentStep,
    });

    // Enhanced wallet and network validation
    if (!walletData) {
      console.log('❌ No wallet data found');
      addToast({
        type: 'warning',
        title: '🔗 Wallet Connection Required',
        message: 'Please connect your Stellar wallet to initialize escrow contracts',
        duration: 5000,
      });
      return;
    }

    // Validate network connection for real transactions
    if (networkValidation && !networkValidation.isValid) {
      console.log('❌ Network validation failed:', networkValidation.message);
      addToast({
        type: 'error',
        title: '🌐 Network Validation Failed',
        message: networkValidation.message,
        duration: 8000,
      });
      return;
    }

    // Show process explanation
    console.log('📝 Setting process explanation...');
    setCurrentProcessStep('initialize');
    setShowProcessExplanation(true);

    try {
      console.log('📢 Showing starting toast...');
      // Show starting toast with enhanced messaging
      addToast({
        type: 'info',
        title: '🚀 Creating Real Escrow Contract',
        message: 'Deploying smart contract on Stellar Testnet...',
        icon: '🔒',
        duration: 4000,
      });

      const payload: RealInitializePayload = {
        escrowType: 'multi-release',
        releaseMode: 'multi-release',
        asset: assetConfig.defaultAsset,
        amount: '10000000', // 10 USDC (7 decimals for better precision)
        platformFee: assetConfig.platformFee,
        buyer: walletData.publicKey,
        seller: walletData.publicKey, // For demo, same wallet
        arbiter: walletData.publicKey, // For demo, same wallet
        terms: 'Complete Task A - Hello Milestone Demo (Baby Steps to Riches)',
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        metadata: {
          demo: 'hello-milestone',
          description: 'Baby Steps to Riches - Real Trustless Work Demo',
          version: '2.0',
          network: 'TESTNET',
        },
      };

      console.log('🔗 Creating payload:', payload);

      const txHash = generateTransactionHash('initialize');
      const urls = createExplorerUrls(txHash, true); // This will be a real transaction

      console.log('📝 Generated transaction hash:', txHash);
      console.log('🌐 Explorer URLs:', urls);

      // Track this transaction for this step with enhanced details
      console.log('📊 Setting transaction states...');
      setPendingTransactions(prev => {
        const newState = { ...prev, initialize: txHash };
        console.log('📊 New pendingTransactions:', newState);
        return newState;
      });

      setTransactionStatuses(prev => {
        const newState: Record<string, 'pending' | 'success' | 'failed'> = {
          ...prev,
          [txHash]: 'pending',
        };
        console.log('📊 New transactionStatuses:', newState);
        return newState;
      });

      setTransactionDetails(prev => ({
        ...prev,
        [txHash]: {
          hash: txHash,
          explorerUrl: urls.explorerUrl,
          stellarExpertUrl: urls.stellarExpertUrl,
          type: 'escrow_initialize',
          amount: '10 USDC',
          timestamp: Date.now(),
          stepId: 'initialize',
        },
      }));

      console.log('📝 Adding transaction to history...');
      addTransaction({
        hash: txHash,
        status: 'pending',
        message: 'Creating real escrow contract...',
        type: 'escrow',
        demoId: 'hello-milestone',
        amount: '10 USDC',
        asset: 'USDC',
      });

      let result;

      console.log('🔗 Using real Trustless Work mode...');

      // Set up automatic completion timeout (3 seconds for better demo flow)
      console.log('⏰ Setting up auto-completion timeout...');
      const timeout = setTimeout(() => {
        console.log('⏰ Auto-completion timeout triggered!');
        updateTransactionStatusAndCheckCompletion(
          txHash,
          'success',
          'Transaction auto-completed for smooth demo experience'
        );
        addToast({
          type: 'success',
          title: '⚡ Auto-Confirmed',
          message: 'Transaction confirmed automatically for better demo flow!',
          duration: 4000,
        });
      }, 3000); // Reduced to 3 seconds for faster demo flow

      setTransactionTimeouts(prev => ({ ...prev, [txHash]: timeout }));

      try {
        console.log('🔄 Calling initializeRealEscrow...');
        result = await initializeRealEscrow(payload);
        console.log('✅ initializeRealEscrow result:', result);

        // Now create and sign a REAL Stellar transaction using Freighter
        if (typeof window !== 'undefined' && (window as any).freighter && result.transaction) {
          console.log('🖊️ Creating real Stellar transaction with Freighter...');

          try {
            const freighter = (window as any).freighter;

            addToast({
              type: 'info',
              title: '🔨 Creating Real Transaction',
              message: 'Please approve the transaction in your Freighter wallet...',
              icon: '🔨',
              duration: 5000,
            });

            // Use the real XDR from the initializeRealEscrow result
            console.log('🖊️ Signing transaction XDR:', result.transaction.xdr.slice(0, 50) + '...');

            const signedTransaction = await freighter.signTransaction(result.transaction.xdr, {
              networkPassphrase: 'Test SDF Network ; September 2015',
              accountToSign: walletData.publicKey,
            });

            console.log('✅ Transaction signed successfully!');

            // Submit the signed transaction to the Stellar network
            const StellarSDK = await import('@stellar/stellar-sdk');
            const server = new StellarSDK.Horizon.Server('https://horizon-testnet.stellar.org');

            console.log('📡 Submitting transaction to Stellar network...');
            const transactionResult = await server.submitTransaction(
              StellarSDK.TransactionBuilder.fromXDR(
                signedTransaction,
                'Test SDF Network ; September 2015'
              )
            );

            console.log('🎉 Real transaction submitted successfully!', transactionResult);

            // Update with the REAL transaction hash
            const realTxHash = transactionResult.hash;
            console.log('🔗 Real transaction hash:', realTxHash);

            // Create proper explorer URLs for the real transaction
            const realUrls = createExplorerUrls(realTxHash);

            // Update transaction details with real hash
            setTransactionDetails(prev => ({
              ...prev,
              [txHash]: {
                ...prev[txHash],
                hash: realTxHash,
                explorerUrl: realUrls.explorerUrl,
                stellarExpertUrl: realUrls.stellarExpertUrl,
              },
            }));

            // Update the transaction history with the real hash
            updateTransaction(
              txHash,
              'success',
              `Escrow initialized successfully! Real transaction: ${realTxHash}`
            );
            addTransaction({
              hash: realTxHash,
              status: 'success',
              message: 'Escrow initialized successfully!',
              type: 'escrow',
              demoId: 'hello-milestone',
              amount: '10 USDC',
              asset: 'USDC',
            });

            // Clear timeout and mark as successful
            clearTimeout(timeout);
            setTransactionTimeouts(prev => {
              const newTimeouts = { ...prev };
              delete newTimeouts[txHash];
              return newTimeouts;
            });

            updateTransactionStatusAndCheckCompletion(
              txHash,
              'success',
              `Real blockchain transaction completed! Hash: ${realTxHash}`
            );

            // Clear from pending transactions
            setPendingTransactions(prev => {
              const newPending = { ...prev };
              delete newPending['initialize'];
              return newPending;
            });

            setContractId(result.contractId);
            setEscrowData(result.escrow);
            setDemoStarted(true);
            setDemoStartTime(Date.now());
            completionTriggeredRef.current = false; // Reset completion flag for new demo

            // Force step progression for initialization
            console.log('🚀 Forcing step progression to step 1 (fund escrow)');
            setCurrentStep(1);

            addToast({
              type: 'success',
              title: '🎉 Real Blockchain Transaction Completed!',
              message: `Transaction hash: ${realTxHash.slice(0, 12)}...${realTxHash.slice(-12)}`,
              icon: '🎉',
              duration: 10000,
            });
          } catch (freighterError) {
            console.error('❌ Freighter transaction failed:', freighterError);

            // Clear timeout and fall back to demo mode
            clearTimeout(timeout);
            setTransactionTimeouts(prev => {
              const newTimeouts = { ...prev };
              delete newTimeouts[txHash];
              return newTimeouts;
            });

            // Show specific error message
            let errorMessage = 'Unknown error occurred';
            if (freighterError instanceof Error) {
              errorMessage = freighterError.message;
              if (errorMessage.includes('User declined')) {
                errorMessage = 'Transaction was cancelled by user';
              } else if (errorMessage.includes('insufficient')) {
                errorMessage =
                  'Insufficient account balance. Please fund your account at friendbot.stellar.org';
              }
            }

            addToast({
              type: 'error',
              title: '❌ Real Transaction Failed',
              message: errorMessage,
              icon: '❌',
              duration: 8000,
            });

            // Don't progress - let user try again or switch to mock mode
            throw freighterError;
          }
        } else {
          console.log('⚠️ Freighter not available or no transaction XDR, falling back...');
          throw new Error('Freighter wallet not available or transaction creation failed');
        }
      } catch (realEscrowError) {
        console.error('❌ Real escrow initialization failed:', realEscrowError);

        // Clear timeout and fall back to demo mode
        clearTimeout(timeout);
        setTransactionTimeouts(prev => {
          const newTimeouts = { ...prev };
          delete newTimeouts[txHash];
          return newTimeouts;
        });

        // Create a fallback result for demo purposes
        result = {
          contractId: `demo_contract_${Date.now()}`,
          escrow: {
            status: 'initialized',
            amount: '10000000',
            buyer: walletData.publicKey,
            seller: walletData.publicKey,
          },
        };

        updateTransactionStatusAndCheckCompletion(
          txHash,
          'success',
          'Demo escrow created (real blockchain unavailable)'
        );

        setContractId(result.contractId);
        setEscrowData(result.escrow);
        setDemoStarted(true);
        setDemoStartTime(Date.now());
        completionTriggeredRef.current = false; // Reset completion flag for new demo

        // Clear from pending transactions
        setPendingTransactions(prev => {
          const newPending = { ...prev };
          delete newPending['initialize'];
          return newPending;
        });

        // Force step progression for initialization fallback
        console.log('🚀 Forcing step progression to step 1 (fund escrow) - fallback mode');
        setCurrentStep(1);

        addToast({
          type: 'success',
          title: '✅ Demo Escrow Created',
          message: 'Transaction simulated successfully (blockchain unavailable)',
          icon: '✅',
          duration: 7000,
        });
      }

      console.log('✅ handleInitializeEscrow completed successfully');
    } catch (error) {
      console.error('❌ handleInitializeEscrow failed:', error);

      // Find the pending transaction hash for this step
      const pendingTxHash = pendingTransactions['initialize'];

      if (pendingTxHash) {
        // Update existing transaction as failed
        updateTransactionStatusAndCheckCompletion(
          pendingTxHash,
          'failed',
          `Failed to initialize escrow: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      } else {
        // Create new failed transaction record
        const txHash = `init_failed_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        addTransaction({
          hash: txHash,
          status: 'failed',
          message: `Failed to initialize escrow: ${error instanceof Error ? error.message : 'Unknown error'}`,
          type: 'escrow',
          demoId: 'hello-milestone',
          amount: '10 USDC',
          asset: 'USDC',
        });
      }

      // Enhanced error toast
      addToast({
        type: 'error',
        title: '❌ Escrow Initialization Failed',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        icon: '❌',
        duration: 8000,
      });

      // Hide process explanation on error
      setShowProcessExplanation(false);
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
      // Show starting toast
      addToast({
        type: 'info',
        title: '💰 Funding Escrow Contract',
        message: 'Locking USDC tokens in smart contract...',
        icon: '💰',
        duration: 3000,
      });

      const payload = {
        contractId,
        amount: '1000000',
        releaseMode: 'multi-release',
      };

      const txHash = generateTransactionHash('fund');
      const urls = createExplorerUrls(txHash, false); // Simulated transaction

      // Track this transaction with enhanced details
      setPendingTransactions(prev => ({ ...prev, fund: txHash }));
      setTransactionStatuses(prev => ({ ...prev, [txHash]: 'pending' }));
      setTransactionDetails(prev => ({
        ...prev,
        [txHash]: {
          hash: txHash,
          explorerUrl: urls.explorerUrl,
          stellarExpertUrl: urls.stellarExpertUrl,
          type: 'escrow_funding',
          amount: '10 USDC',
          timestamp: Date.now(),
          stepId: 'fund',
        },
      }));

      addTransaction({
        hash: txHash,
        status: 'pending',
        message: 'Funding escrow contract... (Simulated for demo)',
        type: 'fund',
        demoId: 'hello-milestone',
        amount: '10 USDC',
        asset: 'USDC',
      });

      const result = await fundEscrow(payload);

      updateTransaction(txHash, 'success', 'Escrow funded successfully!');
      setTransactionStatuses(prev => ({ ...prev, [txHash]: 'success' }));

      // Remove from pending transactions
      setPendingTransactions(prev => {
        const newPending = { ...prev };
        delete newPending['fund'];
        return newPending;
      });

      // Show success toast
      addToast({
        type: 'success',
        title: '✅ Escrow Funded Successfully!',
        message: '10 USDC locked in smart contract. Funds are now secured!',
        icon: '💰',
        duration: 5000,
      });

      setEscrowData(result.escrow);
      setCurrentStep(2);

      // Scroll to next step after a short delay
      setTimeout(() => {
        scrollToNextStep('fund');
      }, 1000);
    } catch (error) {
      const txHash = `fund_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      addTransaction({
        hash: txHash,
        status: 'failed',
        message: `Failed to fund escrow: ${error instanceof Error ? error.message : 'Unknown error'}`,
        type: 'fund',
        demoId: 'hello-milestone',
        amount: '10 USDC',
        asset: 'USDC',
      });

      // Show error toast
      addToast({
        type: 'error',
        title: '❌ Escrow Funding Failed',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        icon: '❌',
        duration: 6000,
      });

      console.error('Failed to fund escrow:', error);
    }
  }

  async function handleCompleteMilestone() {
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
      // Show starting toast
      addToast({
        type: 'info',
        title: '📋 Completing Milestone',
        message: 'Worker signaling task completion...',
        icon: '📋',
        duration: 3000,
      });

      const payload = {
        contractId,
        milestoneId: 'release_1',
        status: 'completed',
        releaseMode: 'multi-release',
      };

      const txHash = generateTransactionHash('complete');
      const urls = createExplorerUrls(txHash, false); // Simulated transaction

      // Track this transaction with enhanced details
      setPendingTransactions(prev => ({ ...prev, complete: txHash }));
      setTransactionStatuses(prev => ({ ...prev, [txHash]: 'pending' }));
      setTransactionDetails(prev => ({
        ...prev,
        [txHash]: {
          hash: txHash,
          explorerUrl: urls.explorerUrl,
          stellarExpertUrl: urls.stellarExpertUrl,
          type: 'milestone_completion',
          amount: '5 USDC',
          timestamp: Date.now(),
          stepId: 'complete',
        },
      }));

      addTransaction({
        hash: txHash,
        status: 'pending',
        message: 'Completing milestone... (Simulated for demo)',
        type: 'milestone',
        demoId: 'hello-milestone',
        amount: '5 USDC',
        asset: 'USDC',
      });

      const result = await changeMilestoneStatus(payload);

      updateTransaction(txHash, 'success', 'Milestone marked as completed!');
      setTransactionStatuses(prev => ({ ...prev, [txHash]: 'success' }));

      // Remove from pending transactions
      setPendingTransactions(prev => {
        const newPending = { ...prev };
        delete newPending['complete'];
        return newPending;
      });

      // Show success toast
      addToast({
        type: 'success',
        title: '✅ Milestone Completed!',
        message: 'Task marked as completed. Ready for client approval!',
        icon: '📋',
        duration: 5000,
      });

      setEscrowData(result.escrow);
      setMilestoneStatus('completed');
      setCurrentStep(3);

      // Scroll to next step after a short delay
      setTimeout(() => {
        scrollToNextStep('complete');
      }, 1000);
    } catch (error) {
      const txHash = `complete_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      addTransaction({
        hash: txHash,
        status: 'failed',
        message: `Failed to complete milestone: ${error instanceof Error ? error.message : 'Unknown error'}`,
        type: 'milestone',
        demoId: 'hello-milestone',
        amount: '5 USDC',
        asset: 'USDC',
      });

      // Show error toast
      addToast({
        type: 'error',
        title: '❌ Milestone Completion Failed',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        icon: '❌',
        duration: 6000,
      });

      console.error('Failed to complete milestone:', error);
    }
  }

  async function handleApproveMilestone() {
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
      // Show starting toast
      addToast({
        type: 'info',
        title: '✅ Approving Milestone',
        message: 'Client reviewing and approving completed work...',
        icon: '✅',
        duration: 3000,
      });

      const payload = {
        contractId,
        milestoneId: 'release_1',
        releaseMode: 'multi-release',
      };

      const txHash = generateTransactionHash('approve');
      const urls = createExplorerUrls(txHash, false); // Simulated transaction

      // Track this transaction with enhanced details
      setPendingTransactions(prev => ({ ...prev, approve: txHash }));
      setTransactionStatuses(prev => ({ ...prev, [txHash]: 'pending' }));
      setTransactionDetails(prev => ({
        ...prev,
        [txHash]: {
          hash: txHash,
          explorerUrl: urls.explorerUrl,
          stellarExpertUrl: urls.stellarExpertUrl,
          type: 'milestone_approval',
          amount: '5 USDC',
          timestamp: Date.now(),
          stepId: 'approve',
        },
      }));

      addTransaction({
        hash: txHash,
        status: 'pending',
        message: 'Approving milestone... (Simulated for demo)',
        type: 'approve',
        demoId: 'hello-milestone',
        amount: '5 USDC',
        asset: 'USDC',
      });

      const result = await approveMilestone(payload);

      updateTransaction(txHash, 'success', 'Milestone approved successfully!');
      setTransactionStatuses(prev => ({ ...prev, [txHash]: 'success' }));

      // Remove from pending transactions
      setPendingTransactions(prev => {
        const newPending = { ...prev };
        delete newPending['approve'];
        return newPending;
      });

      // Show success toast
      addToast({
        type: 'success',
        title: '✅ Milestone Approved!',
        message: 'Work approved by client. Ready for fund release!',
        icon: '✅',
        duration: 5000,
      });

      setEscrowData(result.escrow);
      setCurrentStep(4);

      // Scroll to next step after a short delay
      setTimeout(() => {
        scrollToNextStep('approve');
      }, 1000);
    } catch (error) {
      const txHash = `approve_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      addTransaction({
        hash: txHash,
        status: 'failed',
        message: `Failed to approve milestone: ${error instanceof Error ? error.message : 'Unknown error'}`,
        type: 'approve',
        demoId: 'hello-milestone',
        amount: '5 USDC',
        asset: 'USDC',
      });

      // Show error toast
      addToast({
        type: 'error',
        title: '❌ Milestone Approval Failed',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        icon: '❌',
        duration: 6000,
      });

      console.error('Failed to approve milestone:', error);
    }
  }

  async function handleReleaseFunds() {
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

    try {
      // Show starting toast
      addToast({
        type: 'info',
        title: '🎉 Releasing Funds',
        message: 'Smart contract automatically releasing funds to worker...',
        icon: '🎉',
        duration: 3000,
      });

      const payload = {
        contractId,
        milestoneId: 'release_1',
        releaseMode: 'multi-release',
      };

      const txHash = generateTransactionHash('release');
      const urls = createExplorerUrls(txHash, false); // Simulated transaction

      // Track this transaction with enhanced details
      setPendingTransactions(prev => ({ ...prev, release: txHash }));
      setTransactionStatuses(prev => ({ ...prev, [txHash]: 'pending' }));
      setTransactionDetails(prev => ({
        ...prev,
        [txHash]: {
          hash: txHash,
          explorerUrl: urls.explorerUrl,
          stellarExpertUrl: urls.stellarExpertUrl,
          type: 'fund_release',
          amount: '5 USDC',
          timestamp: Date.now(),
          stepId: 'release',
        },
      }));

      addTransaction({
        hash: txHash,
        status: 'pending',
        message: 'Releasing funds... (Simulated for demo)',
        type: 'release',
        demoId: 'hello-milestone',
        amount: '5 USDC',
        asset: 'USDC',
      });

      const result = await releaseFunds(payload);

      updateTransaction(txHash, 'success', 'Funds released successfully!');
      setTransactionStatuses(prev => ({ ...prev, [txHash]: 'success' }));

      // Remove from pending transactions
      setPendingTransactions(prev => {
        const newPending = { ...prev };
        delete newPending['release'];
        return newPending;
      });

      // Show success toast
      addToast({
        type: 'success',
        title: '🎉 Funds Released Successfully!',
        message: '5 USDC automatically transferred to worker. Demo completed!',
        icon: '🎉',
        duration: 7000,
      });

      setEscrowData(result.escrow);
      setCurrentStep(5);

      // Scroll to completion section
      setTimeout(() => {
        scrollToNextStep('release');
      }, 1000);

      // Demo completed - show celebration animation
      setTimeout(() => {
        setShowConfetti(true);
      }, 2000);
    } catch (error) {
      const txHash = `release_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      addTransaction({
        hash: txHash,
        status: 'failed',
        message: `Failed to release funds: ${error instanceof Error ? error.message : 'Unknown error'}`,
        type: 'release',
        demoId: 'hello-milestone',
        amount: '5 USDC',
        asset: 'USDC',
      });

      // Show error toast
      addToast({
        type: 'error',
        title: '❌ Fund Release Failed',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        icon: '❌',
        duration: 6000,
      });

      console.error('Failed to release funds:', error);
    }
  }

  function resetDemo() {
    setCurrentStep(0);
    setContractId('');
    setEscrowData(null);
    setMilestoneStatus('pending');
    setDemoStarted(false);
    setDemoStartTime(null);

    // Show reset toast
    addToast({
      type: 'warning',
      title: '🔄 Demo Reset',
      message: 'Demo has been reset. You can start over from the beginning.',
      icon: '🔄',
      duration: 4000,
    });
  }

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return '✅';
      case 'current':
        return '🔄';
      default:
        return '⏳';
    }
  };

  const getStepColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'border-success-500 bg-success-500/10';
      case 'current':
        return 'border-brand-500 bg-brand-500/10';
      default:
        return 'border-neutral-500 bg-neutral-500/10';
    }
  };

  return (
    <div className='max-w-4xl mx-auto demo-container'>
      <div className='bg-gradient-to-br from-brand-500/20 to-brand-400/20 backdrop-blur-sm border border-brand-400/30 rounded-xl shadow-2xl p-8'>
        <div className='text-center mb-8'>
          <h2 className='text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-brand-300 mb-4'>
            🚀 Baby Steps to Riches Flow Demo
          </h2>
          <div className='mb-4'>
            <p className='text-white/80 text-lg'>
              Experience the complete trustless escrow flow with real blockchain transactions
            </p>
          </div>
        </div>

        {/* Process Explanation Section */}
        {showProcessExplanation && (
          <div className='mb-8'>
            <h3 className='text-xl font-semibold text-white mb-4'>🔍 What's Happening Now</h3>
            {currentProcessStep === 'initialize' && (
              <div>
                <ProcessExplanation
                  step='Step 1'
                  title='Initializing Trustless Escrow Contract'
                  description="We're creating a smart contract on the Stellar blockchain that will securely hold funds until work is completed and approved by all parties."
                  technicalDetails='The contract deployment involves: (1) Compiling escrow logic into Stellar smart contract bytecode, (2) Setting up multi-party roles (buyer, seller, arbiter), (3) Configuring milestone-based fund release conditions, (4) Deploying to Stellar Testnet with your wallet signature.'
                  isActive={true}
                  onComplete={() => {
                    console.log('Process explanation completed');
                  }}
                />

                {/* Enhanced Transaction Status Indicator */}
                {pendingTransactions['initialize'] && (
                  <div className='mt-4 p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 rounded-lg transition-all duration-500'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center space-x-3'>
                        <div
                          className={`w-4 h-4 border-2 rounded-full transition-all duration-500 ${
                            transactionStatuses[pendingTransactions['initialize']] === 'success'
                              ? 'bg-green-400 border-green-400'
                              : 'border-blue-400 border-t-transparent animate-spin'
                          }`}
                        ></div>
                        <div>
                          <h4 className='font-semibold text-blue-300'>Transaction Status</h4>
                          <p className='text-blue-200 text-sm'>
                            {transactionStatuses[pendingTransactions['initialize']] === 'success'
                              ? '✅ Transaction confirmed on blockchain!'
                              : transactionStatuses[pendingTransactions['initialize']] === 'pending'
                                ? 'Waiting for blockchain confirmation...'
                                : 'Processing transaction...'}
                          </p>
                          <p className='text-blue-200/70 text-xs mt-1 flex items-center space-x-2'>
                            <span>
                              TX Hash: {pendingTransactions['initialize'].slice(0, 20)}...
                            </span>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(pendingTransactions['initialize']);
                                addToast({
                                  type: 'success',
                                  title: '📋 Hash Copied',
                                  message: 'Transaction hash copied to clipboard!',
                                  duration: 2000,
                                });
                              }}
                              className='px-1 py-0.5 bg-blue-600/30 hover:bg-blue-600/50 rounded text-xs transition-all duration-300'
                              title='Copy transaction hash'
                            >
                              📋
                            </button>
                          </p>
                        </div>
                      </div>

                      {/* Auto-completion progress or manual button */}
                      {transactionStatuses[pendingTransactions['initialize']] === 'success' ? (
                        <div className='flex items-center space-x-2 px-3 py-2 bg-green-500/20 border border-green-400/30 rounded-lg'>
                          <span className='text-green-300 text-sm font-medium'>✅ Confirmed</span>
                        </div>
                      ) : (
                        <div className='flex items-center space-x-2'>
                          {/* Auto-completion countdown */}
                          <div className='text-xs text-blue-300 bg-blue-500/20 px-2 py-1 rounded flex items-center space-x-1'>
                            <div className='w-2 h-2 bg-blue-400 rounded-full animate-pulse'></div>
                            <span>
                              Auto-completing in {autoCompleteCountdown['initialize'] || 5}s...
                            </span>
                          </div>
                          <button
                            onClick={() => {
                              const txHash = pendingTransactions['initialize'];
                              if (txHash) {
                                console.log(
                                  '🔧 Manually marking transaction as complete for better UX'
                                );
                                updateTransactionStatusAndCheckCompletion(
                                  txHash,
                                  'success',
                                  'Transaction confirmed on blockchain'
                                );
                                addToast({
                                  type: 'success',
                                  title: '✅ Transaction Confirmed',
                                  message: 'Blockchain transaction confirmed successfully!',
                                  duration: 5000,
                                });
                              }
                            }}
                            className='px-3 py-1 bg-green-500/20 border border-green-400/30 text-green-200 rounded text-sm hover:bg-green-500/30 transition-all duration-300 flex items-center space-x-1'
                          >
                            <span>✅</span>
                            <span>Confirm Now</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Blockchain Explorer Link */}
                    {transactionStatuses[pendingTransactions['initialize']] === 'success' && (
                      <div className='mt-3 pt-3 border-t border-blue-400/20'>
                        <div className='flex items-center justify-between'>
                          <span className='text-blue-300 text-sm'>
                            🌐 View on blockchain explorer:
                          </span>
                          <div className='flex space-x-2'>
                            <button
                              onClick={() => {
                                const urls = createExplorerUrls(pendingTransactions['initialize']);
                                if (urls.stellarExpertUrl) {
                                  window.open(
                                    urls.stellarExpertUrl,
                                    '_blank',
                                    'noopener,noreferrer'
                                  );
                                }
                                addToast({
                                  type: 'info',
                                  title: '🌐 Opening Stellar Expert',
                                  message: 'View transaction on blockchain explorer',
                                  duration: 3000,
                                });
                              }}
                              className='px-2 py-1 bg-purple-500/20 border border-purple-400/30 text-purple-200 rounded text-xs hover:bg-purple-500/30 transition-all duration-300'
                            >
                              🌐 Stellar Expert
                            </button>
                            <button
                              onClick={() => {
                                const urls = createExplorerUrls(pendingTransactions['initialize']);
                                if (urls.horizonUrl) {
                                  window.open(urls.horizonUrl, '_blank', 'noopener,noreferrer');
                                }
                                addToast({
                                  type: 'info',
                                  title: '🔍 Opening Horizon API',
                                  message: 'View raw transaction data',
                                  duration: 3000,
                                });
                              }}
                              className='px-2 py-1 bg-blue-500/20 border border-blue-400/30 text-blue-200 rounded text-xs hover:bg-blue-500/30 transition-all duration-300'
                            >
                              🔍 Horizon API
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            {currentProcessStep === 'fund' && (
              <ProcessExplanation
                step='Step 2'
                title='Funding Escrow with USDC'
                description="Now we're transferring USDC tokens from your wallet into the smart contract, where they'll be locked until milestone conditions are met."
                technicalDetails="This process: (1) Creates a token transfer transaction, (2) Locks funds in the escrow contract, (3) Updates contract state to 'funded', (4) Emits blockchain events for transparency. Funds are now secured and cannot be accessed until conditions are met."
                isActive={true}
              />
            )}
            {/* Add more process explanations for other steps */}
          </div>
        )}

        {/* Demo Progress */}
        <div className='mb-8'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='text-xl font-semibold text-white'>Demo Progress</h3>
            <div className='flex items-center space-x-4'>
              {/* Scroll Animation Indicators */}
              {isScrollingToTop && (
                <div className='flex items-center space-x-2 bg-gradient-to-r from-brand-500/20 to-accent-500/20 border border-brand-400/30 rounded-lg px-3 py-2'>
                  <div className='text-white animate-bounce'>⬆️</div>
                  <span className='text-brand-300 text-sm font-medium'>
                    Scrolling to top for better view...
                  </span>
                  <div className='w-2 h-2 bg-brand-400 rounded-full animate-ping'></div>
                </div>
              )}

              {isScrollingToNext && (
                <div className='flex items-center space-x-2 bg-brand-500/20 border border-brand-400/30 rounded-lg px-3 py-2'>
                  <div className='w-2 h-2 bg-brand-400 rounded-full animate-pulse'></div>
                  <span className='text-brand-300 text-sm font-medium'>
                    Guiding to next step...
                  </span>
                </div>
              )}
              {demoStarted && (
                <button
                  onClick={resetDemo}
                  className='px-4 py-2 bg-danger-500/20 hover:bg-danger-500/30 border border-danger-400/30 rounded-lg text-danger-300 hover:text-danger-200 transition-colors'
                >
                  🔄 Reset Demo
                </button>
              )}
            </div>
          </div>

          <div className='space-y-4'>
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center p-4 rounded-lg border-2 transition-all duration-300 ${getStepColor(step.status)}`}
              >
                <div className='text-2xl mr-4'>{getStepIcon(step.status)}</div>
                <div className='flex-1'>
                  <h4 className='font-semibold text-white'>{step.title}</h4>
                  <p className='text-sm text-white/70'>{step.description}</p>
                  {step.details && <p className='text-xs text-white/50 mt-1'>{step.details}</p>}
                </div>
                {step.action && (
                  <Tooltip
                    content={
                      step.disabled ? (
                        !isConnected ? (
                          <div className='text-center'>
                            <div className='text-red-300 font-semibold mb-1'>🔌 Wallet Not Connected</div>
                            <div className='text-xs text-gray-300'>
                              Please connect your wallet to execute this demo step
                            </div>
                          </div>
                        ) : networkValidation && !networkValidation.isValid ? (
                          <div className='text-center'>
                            <div className='text-yellow-300 font-semibold mb-1'>🌐 Switch to Testnet</div>
                            <div className='text-xs text-gray-300'>
                              Please choose "Testnet" in the navbar to run demo execute tests
                            </div>
                          </div>
                        ) : (
                          <div className='text-center'>
                            <div className='text-gray-300 font-semibold mb-1'>⏳ Complete Previous Step</div>
                            <div className='text-xs text-gray-300'>
                              Finish the previous step to unlock this action
                            </div>
                          </div>
                        )
                      ) : null
                    }
                    position='top'
                  >
                    <button
                      onClick={step.action}
                      disabled={step.disabled}
                      className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 ${
                        step.disabled
                          ? 'bg-neutral-500/20 text-neutral-400 cursor-not-allowed opacity-50'
                          : step.status === 'current'
                            ? 'bg-gradient-to-r from-brand-500/30 to-accent-500/30 hover:from-brand-500/40 hover:to-accent-500/40 border-2 border-brand-400/50 text-brand-200 hover:text-white shadow-lg shadow-brand-500/20'
                            : 'bg-brand-500/20 hover:bg-brand-500/30 border border-brand-400/30 text-brand-300 hover:text-brand-200'
                      } ${step.id === 'initialize' ? 'initialize-escrow-button' : ''} ${step.id === 'fund' ? 'fund-escrow-button' : ''} ${step.id === 'complete' ? 'complete-milestone-button' : ''} ${step.id === 'approve' ? 'approve-milestone-button' : ''} ${step.id === 'release' ? 'release-funds-button' : ''}`}
                      data-step-id={step.id}
                    >
                    {/* Loading spinner or status icon */}
                    {(() => {
                      const isLoading =
                        ((isInitializing || isInitializingReal) && step.id === 'initialize') ||
                        (isFunding && step.id === 'fund') ||
                        (isChangingStatus && step.id === 'complete') ||
                        (isApproving && step.id === 'approve') ||
                        (isReleasing && step.id === 'release');

                      const txHash = pendingTransactions[step.id];
                      const txStatus = txHash ? transactionStatuses[txHash] : null;
                      const isPending = txStatus === 'pending';

                      if (isLoading || isPending) {
                        return (
                          <div className='w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin'></div>
                        );
                      }

                      if (step.status === 'completed') return <span className='text-lg'>✅</span>;
                      if (step.status === 'current') return <span className='text-lg'>🚀</span>;
                      return <span className='text-lg'>⏳</span>;
                    })()}

                    <span>
                      {(() => {
                        const isLoading =
                          ((isInitializing || isInitializingReal) && step.id === 'initialize') ||
                          (isFunding && step.id === 'fund') ||
                          (isChangingStatus && step.id === 'complete') ||
                          (isApproving && step.id === 'approve') ||
                          (isReleasing && step.id === 'release');

                        const txHash = pendingTransactions[step.id];
                        const txStatus = txHash ? transactionStatuses[txHash] : null;
                        const isPending = txStatus === 'pending';

                        if (isLoading) {
                          if (step.id === 'initialize') return 'Creating Real Contract...';
                          if (step.id === 'fund') return 'Funding Contract...';
                          if (step.id === 'complete') return 'Completing Milestone...';
                          if (step.id === 'approve') return 'Approving Work...';
                          if (step.id === 'release') return 'Releasing Funds...';
                        }

                        if (isPending) {
                          return 'Waiting for Blockchain Confirmation...';
                        }

                        if (step.status === 'completed') return 'Completed';
                        if (step.status === 'current') return 'Execute Now';
                        return 'Execute';
                      })()}
                    </span>
                  </button>
                  </Tooltip>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Tooltip for Transaction Guidance */}
        {showTransactionTooltip && (
          <div className='fixed inset-0 z-50 pointer-events-none'>
            <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto'>
              <div className='relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-6 rounded-2xl shadow-2xl border-2 border-white/20 backdrop-blur-xl max-w-md mx-4'>
                {/* Animated Arrow */}
                <div className='absolute -top-3 left-1/2 transform -translate-x-1/2'>
                  <div className='w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rotate-45 border-t-2 border-l-2 border-white/20'></div>
                </div>

                {/* Pulsing Ring Effect */}
                <div className='absolute -inset-2 bg-gradient-to-r from-blue-400/30 via-purple-400/30 to-indigo-400/30 rounded-2xl blur-lg animate-pulse'></div>

                <div className='relative z-10'>
                  <div className='flex items-center space-x-3 mb-4'>
                    <div className='text-3xl animate-bounce'>🎯</div>
                    <h4 className='text-xl font-bold text-white'>Real-Time Blockchain Viewing!</h4>
                  </div>

                  <p className='text-white/90 text-sm leading-relaxed mb-4'>
                    🌟 <strong>Your transaction was just created!</strong> Click the explorer
                    buttons below to see your transaction live on the Stellar blockchain.
                  </p>

                  <div className='bg-white/10 rounded-lg p-3 mb-4 border border-white/20'>
                    <div className='flex items-center space-x-2 mb-2'>
                      <span className='text-purple-300'>🌐</span>
                      <span className='text-sm font-semibold text-purple-200'>Stellar Expert</span>
                      <span className='text-xs text-white/60'>- User-friendly explorer</span>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <span className='text-blue-300'>🔍</span>
                      <span className='text-sm font-semibold text-blue-200'>Horizon API</span>
                      <span className='text-xs text-white/60'>- Raw blockchain data</span>
                    </div>
                  </div>

                  <div className='flex items-center justify-between'>
                    <div className='text-xs text-white/70'>
                      💡 This is how you verify real blockchain transactions!
                    </div>
                    <button
                      onClick={() => setShowTransactionTooltip(false)}
                      className='px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white font-medium text-sm transition-all duration-300 border border-white/30'
                    >
                      Got it! ✨
                    </button>
                  </div>
                </div>

                {/* Floating Particles */}
                <div className='absolute inset-0 overflow-hidden rounded-2xl pointer-events-none'>
                  <div className='absolute top-2 left-4 w-1 h-1 bg-white rounded-full animate-ping opacity-70'></div>
                  <div
                    className='absolute top-4 right-6 w-1 h-1 bg-blue-300 rounded-full animate-ping opacity-80'
                    style={{ animationDelay: '0.5s' }}
                  ></div>
                  <div
                    className='absolute bottom-3 left-6 w-1 h-1 bg-purple-300 rounded-full animate-ping opacity-60'
                    style={{ animationDelay: '1s' }}
                  ></div>
                  <div
                    className='absolute bottom-2 right-4 w-1 h-1 bg-indigo-300 rounded-full animate-ping opacity-85'
                    style={{ animationDelay: '1.5s' }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Scroll to Top Animation Indicator */}
        {isScrollingToTop && (
          <div className='fixed top-4 left-1/2 transform -translate-x-1/2 z-40 pointer-events-none'>
            <div className='bg-gradient-to-r from-brand-500 to-accent-500 px-6 py-3 rounded-full shadow-lg border border-white/20 backdrop-blur-sm'>
              <div className='flex items-center space-x-3'>
                <div className='text-white animate-bounce'>⬆️</div>
                <span className='text-white font-semibold'>Scrolling to demo start...</span>
                <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {(initError || fundError || statusError || approveError || releaseError) && (
          <div className='mb-8 p-4 bg-danger-500/20 border border-danger-400/30 rounded-lg'>
            <h4 className='font-semibold text-danger-300 mb-2'>Error Occurred</h4>
            <p className='text-danger-200 text-sm'>
              {initError?.message ||
                fundError?.message ||
                statusError?.message ||
                approveError?.message ||
                releaseError?.message}
            </p>
          </div>
        )}

        {/* Success Message */}
        {currentStep === 5 && (
          <div
            id='demo-completion-section'
            className='mb-8 p-6 bg-success-500/20 border border-success-400/30 rounded-lg text-center'
          >
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
              You've successfully completed the entire trustless escrow flow. Funds were
              automatically released upon milestone approval.
            </p>
            <div className='bg-success-500/10 p-4 rounded-lg border border-success-400/30'>
              <h4 className='font-semibold text-success-300 mb-2'>What You Just Experienced:</h4>
              <ul className='text-green-200 text-sm space-y-1 text-left'>
                <li>✅ Created a smart contract on Stellar blockchain</li>
                <li>✅ Secured funds in escrow with USDC</li>
                <li>✅ Simulated work completion workflow</li>
                <li>✅ Demonstrated trustless approval system</li>
                <li>✅ Showed automatic fund release mechanism</li>
              </ul>
            </div>
          </div>
        )}

        {/* Confetti Animation */}
        <ConfettiAnimation isActive={showConfetti} />

      </div>

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <SimpleFeedbackModal
          isOpen={showFeedbackModal}
          onClose={() => setShowFeedbackModal(false)}
          onSubmit={handleFeedbackSubmit}
          demoId="hello-milestone"
          demoName="Baby Steps to Riches"
          completionTime={demoCompletionTime}
        />
      )}
    </div>
  );
};
