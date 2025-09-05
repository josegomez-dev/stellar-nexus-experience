'use client';

import { useState, useEffect } from 'react';
import { useGlobalWallet } from '@/contexts/WalletContext';

import { useToast } from '@/contexts/ToastContext';
import { useTransactionHistory } from '@/contexts/TransactionContext';
import ConfettiAnimation from '@/components/ui/ConfettiAnimation';
import Image from 'next/image';
import {
  useInitializeEscrow,
  useFundEscrow,
  useChangeMilestoneStatus,
  useApproveMilestone,
  useReleaseFunds,
} from '@/lib/mock-trustless-work';
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

  const { addToast } = useToast();
  const { addTransaction, updateTransaction } = useTransactionHistory();
  const [currentStep, setCurrentStep] = useState(0);
  const [contractId, setContractId] = useState<string>('');
  const [escrowData, setEscrowData] = useState<any>(null);
  const [milestoneStatus, setMilestoneStatus] = useState<'pending' | 'completed'>('pending');
  const [demoStarted, setDemoStarted] = useState(false);

  // Confetti animation state
  const [showConfetti, setShowConfetti] = useState(false);

  // Scroll animation state
  const [isScrollingToNext, setIsScrollingToNext] = useState(false);
  const [currentHighlightedStep, setCurrentHighlightedStep] = useState<string | null>(null);

  // Scroll animation function
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
            inline: 'nearest'
          });
          
          // Add a glowing effect
          setTimeout(() => {
            nextStepElement.classList.add('shadow-2xl', 'shadow-brand-500/30');
          }, 500);
          
          // Remove highlighting after 3 seconds
          setTimeout(() => {
            nextStepElement.classList.remove('animate-pulse', 'ring-4', 'ring-brand-400/50', 'shadow-2xl', 'shadow-brand-500/30');
            setCurrentHighlightedStep(null);
            setIsScrollingToNext(false);
          }, 3000);
        }, 100);
      }
    } else {
      // Demo completed
      setIsScrollingToNext(false);
      setCurrentHighlightedStep(null);
    }
  };

  // Get transactions for this demo

  // Hooks
  const { initializeEscrow, isLoading: isInitializing, error: initError } = useInitializeEscrow();
  const { fundEscrow, isLoading: isFunding, error: fundError } = useFundEscrow();
  const {
    changeMilestoneStatus,
    isLoading: isChangingStatus,
    error: statusError,
  } = useChangeMilestoneStatus();
  const { approveMilestone, isLoading: isApproving, error: approveError } = useApproveMilestone();
  const { releaseFunds, isLoading: isReleasing, error: releaseError } = useReleaseFunds();

  const steps: DemoStep[] = [
    {
      id: 'initialize',
      title: 'Initialize Escrow',
      description: 'Create a new escrow contract with USDC',
      status: currentStep === 0 ? 'current' : currentStep > 0 ? 'completed' : 'pending',
      action: handleInitializeEscrow,
      disabled: !isConnected || currentStep !== 0, // Require wallet connection
      details:
        'Creates a smart contract on Stellar blockchain that will hold funds in escrow until work is completed and approved.',
    },
    {
      id: 'fund',
      title: 'Fund Escrow',
      description: 'Deposit USDC into the escrow contract',
      status: currentStep === 1 ? 'current' : currentStep > 1 ? 'completed' : 'pending',
      action: handleFundEscrow,
      disabled: !contractId || currentStep !== 1,
      details:
        'Locks USDC tokens in the smart contract. Funds are now secured and cannot be accessed until conditions are met.',
    },
    {
      id: 'complete',
      title: 'Complete Milestone',
      description: 'Worker signals task completion',
      status: currentStep === 2 ? 'current' : currentStep > 2 ? 'completed' : 'pending',
      action: handleCompleteMilestone,
      disabled: !contractId || currentStep !== 2,
      details:
        'Simulates a worker completing their assigned task. In a real scenario, this would be triggered by the worker.',
    },
    {
      id: 'approve',
      title: 'Approve Milestone',
      description: 'Client approves the completed work',
      status: currentStep === 3 ? 'current' : currentStep > 3 ? 'completed' : 'pending',
      action: handleApproveMilestone,
      disabled: !contractId || currentStep !== 3,
      details:
        'Client reviews the completed work and approves it. This is the final step before funds can be released.',
    },
    {
      id: 'release',
      title: 'Release Funds',
      description: 'Automatically release funds to worker',
      status: currentStep === 4 ? 'current' : currentStep > 4 ? 'completed' : 'pending',
      action: handleReleaseFunds,
      disabled: !contractId || currentStep !== 4,
      details:
        'Smart contract automatically releases funds to the worker once approval is given. No manual intervention needed.',
    },
  ];

  // Trigger confetti when demo is completed
  useEffect(() => {
    console.log('🎉 Hello Milestone Demo - Current step:', currentStep);

    if (currentStep === 5) {
      console.log('🎉 Triggering confetti for Hello Milestone Demo!');
      setShowConfetti(true);
      // Hide confetti after animation
      const timer = setTimeout(() => {
        console.log('🎉 Hiding confetti for Hello Milestone Demo');
        setShowConfetti(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  async function handleInitializeEscrow() {
    if (!walletData) {
      addToast({
        type: 'warning',
        title: '🔗 Wallet Connection Required',
        message: 'Please connect your Stellar wallet to initialize escrow contracts',
        duration: 5000,
      });
      return;
    }

    try {
      // Show starting toast
      addToast({
        type: 'info',
        title: '🚀 Starting Escrow Initialization',
        message: 'Creating smart contract on Stellar blockchain...',
        icon: '🔒',
        duration: 3000,
      });

      const payload = {
        escrowType: 'multi-release',
        releaseMode: 'multi-release',
        asset: assetConfig.defaultAsset,
        amount: '1000000', // 10 USDC (6 decimals)
        platformFee: assetConfig.platformFee,
        buyer: walletData.publicKey,
        seller: walletData.publicKey, // For demo, same wallet
        arbiter: walletData.publicKey, // For demo, same wallet
        terms: 'Complete Task A - Hello Milestone Demo',
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        metadata: {
          demo: 'hello-milestone',
          description: 'Simple milestone completion demo',
        },
      };

      const txHash = `init_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      addTransaction({
        hash: txHash,
        status: 'pending',
        message: 'Initializing escrow contract...',
        type: 'escrow',
        demoId: 'hello-milestone',
        amount: '10 USDC',
        asset: 'USDC',
      });

      const result = await initializeEscrow(payload);

      updateTransaction(txHash, 'success', 'Escrow contract created successfully!');

      // Show success toast
      addToast({
        type: 'success',
        title: '✅ Escrow Contract Created!',
        message: `Contract ID: ${result.contractId.slice(0, 8)}... | Amount: 10 USDC`,
        icon: '🔒',
        duration: 5000,
      });

      setContractId(result.contractId);
      setEscrowData(result.escrow);
      setCurrentStep(1);
      setDemoStarted(true);
      
      // Scroll to next step after a short delay
      setTimeout(() => {
        scrollToNextStep('initialize');
      }, 1000);
    } catch (error) {
      const txHash = `init_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      addTransaction({
        hash: txHash,
        status: 'failed',
        message: `Failed to initialize escrow: ${error instanceof Error ? error.message : 'Unknown error'}`,
        type: 'escrow',
        demoId: 'hello-milestone',
        amount: '10 USDC',
        asset: 'USDC',
      });

      // Show error toast
      addToast({
        type: 'error',
        title: '❌ Escrow Initialization Failed',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        icon: '❌',
        duration: 6000,
      });

      console.error('Failed to initialize escrow:', error);
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

      const txHash = `fund_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      addTransaction({
        hash: txHash,
        status: 'pending',
        message: 'Funding escrow contract...',
        type: 'fund',
        demoId: 'hello-milestone',
        amount: '10 USDC',
        asset: 'USDC',
      });

      const result = await fundEscrow(payload);

      updateTransaction(txHash, 'success', 'Escrow funded successfully!');

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

      const txHash = `complete_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      addTransaction({
        hash: txHash,
        status: 'pending',
        message: 'Completing milestone...',
        type: 'milestone',
        demoId: 'hello-milestone',
        amount: '5 USDC',
        asset: 'USDC',
      });

      const result = await changeMilestoneStatus(payload);

      updateTransaction(txHash, 'success', 'Milestone marked as completed!');

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

      const txHash = `approve_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      addTransaction({
        hash: txHash,
        status: 'pending',
        message: 'Approving milestone...',
        type: 'approve',
        demoId: 'hello-milestone',
        amount: '5 USDC',
        asset: 'USDC',
      });

      const result = await approveMilestone(payload);

      updateTransaction(txHash, 'success', 'Milestone approved successfully!');

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

      const txHash = `release_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      addTransaction({
        hash: txHash,
        status: 'pending',
        message: 'Releasing funds...',
        type: 'release',
        demoId: 'hello-milestone',
        amount: '5 USDC',
        asset: 'USDC',
      });

      const result = await releaseFunds(payload);

      updateTransaction(txHash, 'success', 'Funds released successfully!');

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
      
      // Demo completed - show celebration animation
      setTimeout(() => {
        setShowConfetti(true);
        setIsScrollingToNext(false);
        setCurrentHighlightedStep(null);
        
        // Scroll to top to show completion
        setTimeout(() => {
          const demoContainer = document.querySelector('.demo-container');
          if (demoContainer) {
            demoContainer.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        }, 500);
      }, 1000);
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
            🚀 Hello Milestone Demo
          </h2>
          <p className='text-white/80 text-lg'>
            Experience the complete trustless escrow flow from start to finish
          </p>
          {!isConnected && (
            <div className='mt-4 p-4 bg-warning-500/20 border border-warning-400/30 rounded-lg'>
              <p className='text-warning-300'>
                ⚠️ <strong>Wallet Required</strong> - Please asdasd your Stellar wallet to start the
                demo
              </p>
            </div>
          )}
          {isConnected && (
            <div className='mt-4 p-4 bg-success-500/20 border border-success-400/30 rounded-lg'>
              <p className='text-success-300'>
                ✅ <strong>Wallet Connected</strong> - Ready to test! Click "Execute" on the first
                step to begin
              </p>
            </div>
          )}
        </div>

        {/* Demo Progress */}
        <div className='mb-8'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='text-xl font-semibold text-white'>Demo Progress</h3>
            <div className='flex items-center space-x-4'>
              {/* Scroll Animation Indicator */}
              {isScrollingToNext && (
                <div className='flex items-center space-x-2 bg-brand-500/20 border border-brand-400/30 rounded-lg px-3 py-2'>
                  <div className='w-2 h-2 bg-brand-400 rounded-full animate-pulse'></div>
                  <span className='text-brand-300 text-sm font-medium'>Guiding to next step...</span>
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
                  <button
                    onClick={step.action}
                    disabled={step.disabled}
                    className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                      step.disabled
                        ? 'bg-neutral-500/20 text-neutral-400 cursor-not-allowed'
                        : 'bg-brand-500/20 hover:bg-brand-500/30 border border-brand-400/30 text-brand-300 hover:text-brand-200'
                    } ${step.id === 'initialize' ? 'initialize-escrow-button' : ''} ${step.id === 'fund' ? 'fund-escrow-button' : ''} ${step.id === 'complete' ? 'complete-milestone-button' : ''} ${step.id === 'approve' ? 'approve-milestone-button' : ''} ${step.id === 'release' ? 'release-funds-button' : ''}`}
                    data-step-id={step.id}
                  >
                    {isInitializing && step.id === 'initialize'
                      ? 'Initializing...'
                      : isFunding && step.id === 'fund'
                        ? 'Funding...'
                        : isChangingStatus && step.id === 'complete'
                          ? 'Completing...'
                          : isApproving && step.id === 'approve'
                            ? 'Approving...'
                            : isReleasing && step.id === 'release'
                              ? 'Releasing...'
                              : 'Execute'}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contract Information */}
        {contractId && (
          <div className='mb-8 p-6 bg-white/5 rounded-lg border border-white/20'>
            <h3 className='text-xl font-semibold text-white mb-4'>Contract Information</h3>
            <div className='grid md:grid-cols-2 gap-4 text-sm'>
              <div>
                <p className='text-white/70'>Contract ID:</p>
                <p className='font-mono text-brand-300 bg-brand-900/30 px-2 py-1 rounded'>
                  {contractId.slice(0, 20)}...
                </p>
              </div>
              <div>
                <p className='text-white/70'>Status:</p>
                <p className='text-brand-300'>{escrowData?.status || 'Active'}</p>
              </div>
              <div>
                <p className='text-white/70'>Amount:</p>
                <p className='text-brand-300'>10 USDC</p>
              </div>
              <div>
                <p className='text-white/70'>Milestone Status:</p>
                <p
                  className={`${milestoneStatus === 'completed' ? 'text-success-300' : 'text-warning-300'}`}
                >
                  {milestoneStatus === 'completed' ? 'Completed' : 'Pending'}
                </p>
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

        {/* Demo Instructions */}
        <div className='mt-8 p-6 bg-brand-500/10 border border-brand-400/30 rounded-lg'>
          <h3 className='text-lg font-semibold text-brand-300 mb-3'>📚 How This Demo Works</h3>
          <ul className='text-brand-200 text-sm space-y-2'>
            <li>
              • <strong>Initialize:</strong> Creates a smart contract on Stellar for the escrow
            </li>
            <li>
              • <strong>Fund:</strong> Locks USDC tokens in the escrow contract
            </li>
            <li>
              • <strong>Complete:</strong> Worker signals task completion (simulated)
            </li>
            <li>
              • <strong>Approve:</strong> Client approves the completed work
            </li>
            <li>
              • <strong>Release:</strong> Smart contract automatically releases funds to worker
            </li>
          </ul>
          <p className='text-brand-200 text-sm mt-3'>
            This demonstrates the core trustless escrow flow where no third party is needed - the
            smart contract handles everything automatically once conditions are met.
          </p>
          <div className='mt-4 p-3 bg-white/5 rounded-lg border border-white/10'>
            <p className='text-xs text-white/60'>
              💡 <strong>Tip:</strong> View your transaction history in the wallet sidebar (🔐) to
              track all demo progress!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
