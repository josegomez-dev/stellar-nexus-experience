'use client'

import { useState } from 'react'
import { useGlobalWallet } from '@/contexts/WalletContext'
import { useTransactionHistory } from '@/contexts/TransactionContext'
import { useToast } from '@/contexts/ToastContext'
import { 
  initializeContract, 
  fundEscrow, 
  changeMilestoneStatus, 
  approveMilestone, 
  releaseFunds 
} from '@/lib/mock-trustless-work'

interface Stakeholder {
  id: string
  name: string
  role: string
  approvedMilestones: string[] // Track which milestones this stakeholder has approved
  approvalTime?: string
}

interface Milestone {
  id: string
  title: string
  description: string
  amount: string
  requiredApprovals: number
  status: 'pending' | 'completed' | 'approved' | 'released'
  approvals: string[]
}

export const MilestoneVotingDemo = () => {
  const { walletData, isConnected } = useGlobalWallet()
  const { addTransaction, updateTransaction } = useTransactionHistory()
  const { addToast } = useToast()
  
  const [contractId, setContractId] = useState('')
  const [escrowData, setEscrowData] = useState<any>(null)
  const [currentMilestone, setCurrentMilestone] = useState<Milestone | null>(null)
  const [activeStakeholder, setActiveStakeholder] = useState('')
  
  // Per-milestone loading states to fix button text confusion
  const [milestoneLoadingStates, setMilestoneLoadingStates] = useState<Record<string, boolean>>({})
  const [isReleasing, setIsReleasing] = useState(false)
  
  // Error states
  const [initError, setInitError] = useState<Error | null>(null)
  const [fundError, setFundError] = useState<Error | null>(null)
  const [statusError, setStatusError] = useState<Error | null>(null)
  const [approveError, setApproveError] = useState<Error | null>(null)
  const [releaseError, setReleaseError] = useState<Error | null>(null)

  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([
    { id: 'stakeholder1', name: 'Alice Johnson', role: 'Project Manager', approvedMilestones: [] },
    { id: 'stakeholder2', name: 'Bob Smith', role: 'Technical Lead', approvedMilestones: [] },
    { id: 'stakeholder3', name: 'Carol Davis', role: 'Quality Assurance', approvedMilestones: [] },
    { id: 'stakeholder4', name: 'David Wilson', role: 'Client Representative', approvedMilestones: [] }
  ])

  const [milestones, setMilestones] = useState<Milestone[]>([
    {
      id: 'milestone1',
      title: 'Project Planning & Requirements',
      description: 'Complete project scope, timeline, and technical requirements documentation',
      amount: '500000', // 5 USDC
      requiredApprovals: 2,
      status: 'pending',
      approvals: []
    },
    {
      id: 'milestone2',
      title: 'Development & Testing',
      description: 'Core development, unit testing, and integration testing',
      amount: '1000000', // 10 USDC
      requiredApprovals: 3,
      status: 'pending',
      approvals: []
    },
    {
      id: 'milestone3',
      title: 'Deployment & Documentation',
      description: 'Production deployment, user documentation, and training materials',
      amount: '500000', // 5 USDC
      requiredApprovals: 2,
      status: 'pending',
      approvals: []
    }
  ])

  async function handleInitializeContract() {
    if (!isConnected) {
      console.error('Please connect your wallet first')
      return
    }

    try {
      setInitError(null)
      console.log('Initializing milestone voting contract...')
      
      const txHash = `init_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      addTransaction({
        hash: txHash,
        status: 'pending',
        message: 'Initializing milestone voting contract...',
        type: 'escrow',
        demoId: 'milestone-voting',
        amount: '20 USDC',
        asset: 'USDC'
      })
      
      const result = await initializeContract({
        asset: 'USDC',
        amount: '2000000',
        buyer: walletData?.publicKey || '',
        seller: walletData?.publicKey || '',
        arbiter: walletData?.publicKey || '',
        terms: 'Milestone-based escrow with stakeholder approval'
      })

      setContractId(result.contractId)
      setEscrowData(result.escrow)
      
      updateTransaction(txHash, 'success', 'Contract initialized successfully!')
      
      // Show success toast
      addToast({
        type: 'success',
        title: '✅ Contract Initialized!',
        message: 'Milestone voting contract created on Stellar blockchain',
        icon: '✅',
        duration: 5000
      })
      
      console.log('Contract initialized:', result.contractId)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setInitError(error as Error)
      
      const txHash = `init_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      addTransaction({
        hash: txHash,
        status: 'failed',
        message: `Failed to initialize contract: ${errorMessage}`,
        type: 'escrow',
        demoId: 'milestone-voting',
        amount: '20 USDC',
        asset: 'USDC'
      })
      
      // Show error toast
      addToast({
        type: 'error',
        title: '❌ Contract Initialization Failed',
        message: errorMessage,
        icon: '❌',
        duration: 6000
      })
      
      console.error('Failed to initialize contract:', errorMessage)
    }
  }

  async function handleFundEscrow() {
    if (!contractId) return

    try {
      setFundError(null)
      console.log('Funding escrow contract...')
      
      const txHash = `fund_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      addTransaction({
        hash: txHash,
        status: 'pending',
        message: 'Funding escrow contract...',
        type: 'fund',
        demoId: 'milestone-voting',
        amount: '20 USDC',
        asset: 'USDC'
      })
      
      const result = await fundEscrow({
        contractId,
        amount: '2000000',
        asset: 'USDC'
      })

      setEscrowData(result.escrow)
      
      updateTransaction(txHash, 'success', 'Escrow funded successfully!')
      
      // Show success toast
      addToast({
        type: 'success',
        title: '💰 Escrow Funded!',
        message: '20 USDC locked in escrow contract for milestone voting',
        icon: '💰',
        duration: 5000
      })
      
      console.log('Escrow funded:', result.escrow)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setFundError(error as Error)
      
      const txHash = `fund_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      addTransaction({
        hash: txHash,
        status: 'failed',
        message: `Failed to fund escrow: ${errorMessage}`,
        type: 'fund',
        demoId: 'milestone-voting',
        amount: '20 USDC',
        asset: 'USDC'
      })
      
      // Show error toast
      addToast({
        type: 'error',
        title: '❌ Escrow Funding Failed',
        message: errorMessage,
        icon: '❌',
        duration: 6000
      })
      
      console.error('Failed to fund escrow:', errorMessage)
    }
  }

  async function handleCompleteMilestone(milestoneId: string) {
    if (!contractId) return

    try {
      setStatusError(null)
      setMilestoneLoadingStates(prev => ({ ...prev, [milestoneId]: true }))
      console.log(`Marking milestone as completed...`)
      
      const milestone = milestones.find(m => m.id === milestoneId)
      const txHash = `complete_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      addTransaction({
        hash: txHash,
        status: 'pending',
        message: `Marking "${milestone?.title}" as completed...`,
        type: 'milestone',
        demoId: 'milestone-voting',
        amount: `${(parseInt(milestone?.amount || '0') / 100000).toFixed(1)} USDC`,
        asset: 'USDC'
      })
      
      const payload = {
        contractId,
        milestoneId,
        status: 'completed',
        releaseMode: 'multi-release'
      }

      const result = await changeMilestoneStatus(payload)
      setEscrowData(result.escrow)

      const updatedMilestones = milestones.map(m =>
        m.id === milestoneId ? { ...m, status: 'completed' as const } : m
      )
      setMilestones(updatedMilestones)

      if (currentMilestone?.id === milestoneId) {
        setCurrentMilestone({ ...currentMilestone, status: 'completed' as const })
      }
      
      updateTransaction(txHash, 'success', `Milestone "${milestone?.title}" completed successfully!`)
      
      // Show success toast
      addToast({
        type: 'success',
        title: '✅ Milestone Completed!',
        message: `"${milestone?.title}" marked as completed and ready for approval`,
        icon: '✅',
        duration: 5000
      })
      
      console.log(`Milestone ${milestoneId} marked as completed`)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setStatusError(error as Error)
      
      const milestone = milestones.find(m => m.id === milestoneId)
      const txHash = `complete_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      addTransaction({
        hash: txHash,
        status: 'failed',
        message: `Failed to complete "${milestone?.title}": ${errorMessage}`,
        type: 'milestone',
        demoId: 'milestone-voting',
        amount: `${(parseInt(milestone?.amount || '0') / 100000).toFixed(1)} USDC`,
        asset: 'USDC'
      })
      
      // Show error toast
      addToast({
        type: 'error',
        title: '❌ Milestone Completion Failed',
        message: errorMessage,
        icon: '❌',
        duration: 6000
      })
      
      console.error('Failed to complete milestone:', errorMessage)
    } finally {
      setMilestoneLoadingStates(prev => ({ ...prev, [milestoneId]: false }))
    }
  }

  async function handleApproveMilestone(milestoneId: string, stakeholderId: string) {
    if (!contractId) return

    try {
      setApproveError(null)
      console.log(`Processing stakeholder approval...`)
      
      const stakeholder = stakeholders.find(s => s.id === stakeholderId)
      const milestone = milestones.find(m => m.id === milestoneId)
      
      const txHash = `approve_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      addTransaction({
        hash: txHash,
        status: 'pending',
        message: `${stakeholder?.name} approving "${milestone?.title}"...`,
        type: 'approve',
        demoId: 'milestone-voting',
        amount: `${(parseInt(milestone?.amount || '0') / 100000).toFixed(1)} USDC`,
        asset: 'USDC'
      })
      
      const payload = {
        contractId,
        milestoneId,
        releaseMode: 'multi-release'
      }

      const result = await approveMilestone(payload)
      setEscrowData(result.escrow)

      // Update stakeholder approval for this specific milestone
      const updatedStakeholders = stakeholders.map(s =>
        s.id === stakeholderId ? { 
          ...s, 
          approvedMilestones: [...s.approvedMilestones, milestoneId],
          approvalTime: new Date().toISOString() 
        } : s
      )
      setStakeholders(updatedStakeholders)

      // Update milestone approvals
      const updatedMilestones = milestones.map(m => {
        if (m.id === milestoneId) {
          const newApprovals = [...m.approvals, stakeholderId]
          const newStatus: 'pending' | 'completed' | 'approved' | 'released' =
            newApprovals.length >= m.requiredApprovals ? 'approved' : 'pending'
          return { ...m, approvals: newApprovals, status: newStatus }
        }
        return m
      })
      setMilestones(updatedMilestones)

      // Check if milestone is ready for release
      const updatedMilestone = updatedMilestones.find(m => m.id === milestoneId)
      if (updatedMilestone && updatedMilestone.status === 'approved') {
        setCurrentMilestone(updatedMilestone as Milestone)
        
        updateTransaction(txHash, 'success', `"${milestone?.title}" approved by ${stakeholder?.name}! Milestone ready for release.`)
        
        // Show success toast
        addToast({
          type: 'success',
          title: '✅ Milestone Approved!',
          message: `"${milestone?.title}" has enough approvals and is ready for fund release`,
          icon: '✅',
          duration: 5000
        })
        
        console.log(`Milestone ${milestoneId} is now approved and ready for release!`)
      } else {
        updateTransaction(txHash, 'success', `"${milestone?.title}" approved by ${stakeholder?.name}. More approvals needed.`)
        
        // Show success toast
        addToast({
          type: 'success',
          title: '✅ Approval Recorded!',
          message: `${stakeholder?.name} approved "${milestone?.title}". ${updatedMilestone?.approvals.length}/${updatedMilestone?.requiredApprovals} approvals received.`,
          icon: '✅',
          duration: 4000
        })
        
        console.log(`Milestone ${milestoneId} needs more approvals: ${updatedMilestone?.approvals.length}/${updatedMilestone?.requiredApprovals}`)
      }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setApproveError(error as Error)
      
      const stakeholder = stakeholders.find(s => s.id === stakeholderId)
      const milestone = milestones.find(m => m.id === milestoneId)
      const txHash = `approve_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      addTransaction({
        hash: txHash,
        status: 'failed',
        message: `Failed to approve "${milestone?.title}": ${errorMessage}`,
        type: 'approve',
        demoId: 'milestone-voting',
        amount: `${(parseInt(milestone?.amount || '0') / 100000).toFixed(1)} USDC`,
        asset: 'USDC'
      })
      
      // Show error toast
      addToast({
        type: 'error',
        title: '❌ Approval Failed',
        message: errorMessage,
        icon: '❌',
        duration: 6000
      })
      
      console.error('Failed to approve milestone:', errorMessage)
    }
  }

  async function handleReleaseFunds(milestoneId: string) {
    if (!contractId) return

    try {
      setIsReleasing(true)
      setReleaseError(null)
      
      const milestone = milestones.find(m => m.id === milestoneId)
      console.log(`Releasing funds for milestone "${milestone?.title}"...`)
      
      const txHash = `release_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      addTransaction({
        hash: txHash,
        status: 'pending',
        message: `Releasing funds for "${milestone?.title}"...`,
        type: 'release',
        demoId: 'milestone-voting',
        amount: `${(parseInt(milestone?.amount || '0') / 100000).toFixed(1)} USDC`,
        asset: 'USDC'
      })
      
      const payload = {
        contractId,
        milestoneId,
        releaseMode: 'multi-release'
      }

      const result = await releaseFunds(payload)
      setEscrowData(result.escrow)

      // Update milestone status
      const updatedMilestones = milestones.map(m =>
        m.id === milestoneId ? { ...m, status: 'released' as const } : m
      )
      setMilestones(updatedMilestones)
      setCurrentMilestone(updatedMilestones.find(m => m.id === milestoneId) || null)
      
      updateTransaction(txHash, 'success', `Funds released successfully for "${milestone?.title}"!`)
      
      // Show success toast
      addToast({
        type: 'success',
        title: '💰 Funds Released!',
        message: `${(parseInt(milestone?.amount || '0') / 100000).toFixed(1)} USDC automatically transferred for "${milestone?.title}"`,
        icon: '💰',
        duration: 6000
      })
      
      console.log(`Funds released successfully for milestone "${milestone?.title}"!`)
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setReleaseError(error as Error)
      
      const milestone = milestones.find(m => m.id === milestoneId)
      const txHash = `release_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      addTransaction({
        hash: txHash,
        status: 'failed',
        message: `Failed to release funds for "${milestone?.title}": ${errorMessage}`,
        type: 'release',
        demoId: 'milestone-voting',
        amount: `${(parseInt(milestone?.amount || '0') / 100000).toFixed(1)} USDC`,
        asset: 'USDC'
      })
      
      // Show error toast
      addToast({
        type: 'error',
        title: '❌ Fund Release Failed',
        message: errorMessage,
        icon: '❌',
        duration: 6000
      })
      
      console.error('Failed to release funds:', errorMessage)
    } finally {
      setIsReleasing(false)
    }
  }

  function resetDemo() {
    setContractId('')
    setEscrowData(null)
    setCurrentMilestone(null)
    setActiveStakeholder('')
    setMilestoneLoadingStates({})
    
    // Reset stakeholder approvals
    const resetStakeholders = stakeholders.map(s => ({
      ...s,
      approvedMilestones: [],
      approvalTime: undefined
    }))
    setStakeholders(resetStakeholders)

    // Reset milestone statuses
    const resetMilestones = milestones.map(m => ({
      ...m,
      status: 'pending' as const,
      approvals: []
    }))
    setMilestones(resetMilestones)

    // Show reset toast
    addToast({
      type: 'warning',
      title: '🔄 Demo Reset',
      message: 'Demo has been reset. You can start over from the beginning.',
      icon: '🔄',
      duration: 4000
    })

    console.log('Demo reset successfully')
  }

  const getApprovalProgress = (milestone: Milestone) => {
    const approved = milestone.approvals.length
    const required = milestone.requiredApprovals
    const percentage = (approved / required) * 100
    return { approved, required, percentage }
  }

  const canReleaseMilestone = (milestone: Milestone) => {
    return milestone.status === 'approved' && milestone.approvals.length >= milestone.requiredApprovals
  }

  const getMilestoneButtonText = (milestone: Milestone) => {
    if (milestoneLoadingStates[milestone.id]) {
      return 'Completing...'
    }
    
    switch (milestone.status) {
      case 'pending':
        return 'Mark Complete'
      case 'completed':
        return 'Completed'
      case 'approved':
        return 'Ready for Release'
      case 'released':
        return 'Released'
      default:
        return 'Mark Complete'
    }
  }

  const getMilestoneButtonDisabled = (milestone: Milestone) => {
    return milestone.status !== 'pending' || milestoneLoadingStates[milestone.id]
  }

  const getMilestoneButtonClass = (milestone: Milestone) => {
    const baseClass = "px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-2"
    
    switch (milestone.status) {
      case 'pending':
        return `${baseClass} bg-success-500/20 hover:bg-success-500/30 border border-success-400/30 text-success-300 hover:text-success-200`
      case 'completed':
        return `${baseClass} bg-warning-500/20 border border-warning-400/30 text-warning-300 cursor-not-allowed`
      case 'approved':
        return `${baseClass} bg-info-500/20 border border-info-400/30 text-info-300 cursor-not-allowed`
      case 'released':
        return `${baseClass} bg-success-500/20 border border-success-400/30 text-success-300 cursor-not-allowed`
      default:
        return `${baseClass} bg-success-500/20 hover:bg-success-500/30 border border-success-400/30 text-success-300 hover:text-success-200`
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-gradient-to-br from-success-500/20 to-success-400/20 backdrop-blur-sm border border-success-400/30 rounded-xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-success-400 to-success-300 mb-4">
            🗳️ Milestone Voting Demo
          </h2>
          <p className="text-white/80 text-lg">
            Multi-stakeholder approval system requiring consensus before fund release
          </p>
        </div>

        {/* Demo Setup */}
        {!contractId && (
          <div className="mb-8 p-6 bg-white/5 rounded-lg border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-4">🚀 Setup Demo</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-blue-300 mb-3">Stakeholders</h4>
                <div className="space-y-2">
                  {stakeholders.map(stakeholder => (
                    <div key={stakeholder.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div>
                        <p className="font-medium text-white">{stakeholder.name}</p>
                        <p className="text-sm text-white/70">{stakeholder.role}</p>
                      </div>
                      <span className="text-xs text-white/50">Wallet</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-blue-300 mb-3">Milestones</h4>
                <div className="space-y-2">
                  {milestones.map(milestone => (
                    <div key={milestone.id} className="p-3 bg-white/5 rounded-lg">
                      <p className="font-medium text-white">{milestone.title}</p>
                      <p className="text-sm text-white/70">{milestone.description}</p>
                      <p className="text-xs text-blue-300 mt-1">
                        {milestone.requiredApprovals} approvals required • {(parseInt(milestone.amount) / 100000).toFixed(1)} USDC
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-6 text-center">
              <button
                onClick={handleInitializeContract}
                disabled={!isConnected}
                className="px-8 py-3 bg-success-500/20 hover:bg-success-500/30 border border-success-400/30 rounded-lg text-success-300 hover:text-success-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isConnected ? 'Initialize Multi-Stakeholder Escrow' : 'Connect Wallet'}
              </button>
            </div>
          </div>
        )}

        {/* Contract Information */}
        {contractId && (
          <div className="mb-8 p-6 bg-white/5 rounded-lg border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Contract Information</h3>
              <button
                onClick={resetDemo}
                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 rounded-lg text-red-300 hover:text-red-200 transition-colors"
              >
                🔄 Reset Demo
              </button>
            </div>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-white/70">Contract ID:</p>
                <p className="font-mono text-success-300 bg-success-900/30 px-2 py-1 rounded">
                  {contractId.slice(0, 20)}...
                </p>
              </div>
              <div>
                <p className="text-white/70">Status:</p>
                <p className="text-success-300">{escrowData?.status || 'Active'}</p>
              </div>
              <div>
                <p className="text-white/70">Total Amount:</p>
                <p className="text-success-300">10 USDC</p>
              </div>
            </div>
            
            {!escrowData?.funded && (
              <div className="mt-4 text-center">
                <button
                  onClick={handleFundEscrow}
                  disabled={false}
                  className="px-6 py-2 bg-success-500/20 hover:bg-success-500/30 border border-success-400/30 rounded-lg text-success-300 hover:text-success-200 transition-colors"
                >
                  {'Fund Escrow'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Milestones Management */}
        {contractId && escrowData?.funded && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-white mb-6">📋 Milestones Management</h3>
            <div className="space-y-6">
              {milestones.map(milestone => (
                <div key={milestone.id} className="p-6 bg-white/5 rounded-lg border border-white/20">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-white mb-2">{milestone.title}</h4>
                      <p className="text-white/70 mb-3">{milestone.description}</p>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="text-blue-300">{(parseInt(milestone.amount) / 100000).toFixed(1)} USDC</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                                          milestone.status === 'pending' ? 'bg-warning-500/20 text-warning-300' :
                milestone.status === 'approved' ? 'bg-success-500/20 text-success-300' :
                'bg-brand-500/20 text-brand-300'
                        }`}>
                          {milestone.status.charAt(0).toUpperCase() + milestone.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <button
                        onClick={() => handleCompleteMilestone(milestone.id)}
                        disabled={milestone.status !== 'pending' || milestoneLoadingStates[milestone.id]}
                        className={getMilestoneButtonClass(milestone)}
                      >
                        {getMilestoneButtonText(milestone)}
                      </button>
                      {canReleaseMilestone(milestone) && (
                        <button
                          onClick={() => handleReleaseFunds(milestone.id)}
                          disabled={isReleasing}
                          className="px-4 py-2 bg-brand-500/20 hover:bg-brand-500/30 border border-brand-400/30 rounded-lg text-brand-300 hover:text-brand-200 transition-colors block w-full"
                        >
                          {isReleasing ? 'Releasing...' : 'Release Funds'}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Approval Progress */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-white/70">Approval Progress</span>
                      <span className="text-sm text-blue-300">
                        {milestone.approvals.length} / {milestone.requiredApprovals} approved
                      </span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${getApprovalProgress(milestone).percentage}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Stakeholder Approvals */}
                  <div>
                    <h5 className="text-sm font-medium text-white/80 mb-3">Stakeholder Approvals</h5>
                    <div className="grid md:grid-cols-2 gap-3">
                      {stakeholders.map(stakeholder => (
                        <div key={stakeholder.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                          <div>
                            <p className="font-medium text-white text-sm">{stakeholder.name}</p>
                            <p className="text-xs text-white/50">{stakeholder.role}</p>
                          </div>
                          <div className="text-right">
                            {milestone.status === 'pending' && (
                              <button
                                onClick={() => handleApproveMilestone(milestone.id, stakeholder.id)}
                                disabled={stakeholder.approvedMilestones.includes(milestone.id)}
                                className={`px-3 py-1 rounded text-xs transition-colors ${
                                  stakeholder.approvedMilestones.includes(milestone.id)
                                                    ? 'bg-success-500/20 text-success-300 cursor-not-allowed'
                : 'bg-brand-500/20 hover:bg-brand-500/30 border border-brand-400/30 text-brand-300 hover:text-brand-200'
                                }`}
                              >
                                {stakeholder.approvedMilestones.includes(milestone.id) ? '✅ Approved' : 'Approve'}
                              </button>
                            )}
                            {stakeholder.approvedMilestones.includes(milestone.id) && (
                              <div className="text-xs text-green-300">
                                Approved {stakeholder.approvalTime ? new Date(stakeholder.approvalTime).toLocaleTimeString() : ''}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error Display */}
        {(initError || fundError || statusError || approveError || releaseError) && (
          <div className="p-4 bg-red-500/20 border border-red-400/30 rounded-lg">
            <h4 className="font-semibold text-red-300 mb-2">Error Occurred</h4>
            <p className="text-red-200 text-sm">
              {initError?.message || fundError?.message || statusError?.message || 
               approveError?.message || releaseError?.message}
            </p>
          </div>
        )}

        {/* Success Message - Demo Completion */}
        {milestones.every(m => m.status === 'released') && (
          <div className="mb-8 p-6 bg-success-500/20 border border-success-400/30 rounded-lg text-center">
            <div className="text-4xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-success-300 mb-2">Demo Completed Successfully!</h3>
            <p className="text-green-200 mb-4">
              You've successfully completed the entire multi-stakeholder milestone voting flow. 
              All milestones were approved and funds were automatically released.
            </p>
            <div className="bg-success-500/10 p-4 rounded-lg border border-success-400/30">
              <h4 className="font-semibold text-success-300 mb-2">What You Just Experienced:</h4>
              <ul className="text-green-200 text-sm space-y-1 text-left">
                <li>✅ Created a multi-stakeholder escrow contract on Stellar blockchain</li>
                <li>✅ Secured funds in escrow with USDC</li>
                <li>✅ Demonstrated milestone-based work completion workflow</li>
                <li>✅ Showed multi-stakeholder approval consensus system</li>
                <li>✅ Experienced automatic fund release per milestone approval</li>
                <li>✅ Proved trustless governance with smart contract automation</li>
              </ul>
            </div>
          </div>
        )}

        {/* Demo Instructions */}
        <div className="mt-8 p-6 bg-brand-500/10 border border-brand-400/30 rounded-lg">
          <h3 className="text-lg font-semibold text-brand-300 mb-3">📚 How This Demo Works</h3>
          <ul className="text-brand-200 text-sm space-y-2">
            <li>• <strong>Multi-Stakeholder:</strong> 4 different roles must approve milestones</li>
            <li>• <strong>Consensus Required:</strong> Each milestone needs a specific number of approvals</li>
            <li>• <strong>Progressive Release:</strong> Funds are released per milestone upon approval</li>
            <li>• <strong>Trustless Governance:</strong> Smart contract enforces approval rules automatically</li>
            <li>• <strong>Transparent Process:</strong> All approvals and progress are visible on-chain</li>
          </ul>
          <p className="text-brand-200 text-sm mt-3">
            This demonstrates how complex approval workflows can be automated on Stellar, 
            ensuring transparency and reducing the need for manual intervention.
          </p>
          <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
            <p className="text-xs text-white/60">
              💡 <strong>Tip:</strong> View your transaction history in the wallet sidebar (🔐) to track all demo progress!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
