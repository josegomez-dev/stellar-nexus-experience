'use client'

import { useState } from 'react'
import { useWallet } from '@/lib/stellar-wallet-hooks'
import { 
  useInitializeEscrow, 
  useFundEscrow, 
  useChangeMilestoneStatus, 
  useApproveMilestone, 
  useReleaseFunds,
  useStartDispute,
  useResolveDispute
} from '@/lib/mock-trustless-work'
import { assetConfig } from '@/lib/wallet-config'

interface Dispute {
  id: string
  milestoneId: string
  raisedBy: string
  reason: string
  status: 'open' | 'resolved'
  raisedAt: string
  resolvedAt?: string
  resolution?: 'approve' | 'reject' | 'modify'
  resolutionReason?: string
  arbitrator?: string
}

interface Milestone {
  id: string
  title: string
  description: string
  amount: string
  status: 'pending' | 'completed' | 'approved' | 'disputed' | 'released' | 'cancelled'
  worker: string
  client: string
}

export const DisputeResolutionDemo = () => {
  const { walletData, isConnected } = useWallet()
  const [contractId, setContractId] = useState<string>('')
  const [escrowData, setEscrowData] = useState<any>(null)
  const [currentRole, setCurrentRole] = useState<'client' | 'worker' | 'arbitrator'>('client')
  const [disputes, setDisputes] = useState<Dispute[]>([])
  const [newDisputeReason, setNewDisputeReason] = useState('')
  const [resolutionReason, setResolutionReason] = useState('')

  // Hooks
  const { initializeEscrow, isLoading: isInitializing, error: initError } = useInitializeEscrow()
  const { fundEscrow, isLoading: isFunding, error: fundError } = useFundEscrow()
  const { changeMilestoneStatus, isLoading: isChangingStatus, error: statusError } = useChangeMilestoneStatus()
  const { approveMilestone, isLoading: isApproving, error: approveError } = useApproveMilestone()
  const { releaseFunds, isLoading: isReleasing, error: releaseError } = useReleaseFunds()
  const { startDispute, isLoading: isStartingDispute, error: disputeError } = useStartDispute()
  const { resolveDispute, isLoading: isResolvingDispute, error: resolveError } = useResolveDispute()

  // Mock milestones
  const [milestones] = useState<Milestone[]>([
    {
      id: 'milestone_1',
      title: 'Website Design',
      description: 'Complete responsive website design with modern UI',
      amount: '800000', // 8 USDC
      status: 'pending',
      worker: 'worker_wallet_address',
      client: 'client_wallet_address'
    },
    {
      id: 'milestone_2',
      title: 'Content Creation',
      description: 'Write engaging content for all pages',
      amount: '200000', // 2 USDC
      status: 'pending',
      worker: 'worker_wallet_address',
      client: 'client_wallet_address'
    }
  ])

  async function handleInitializeEscrow() {
    if (!walletData) return

    try {
      const payload = {
        escrowType: 'multi-release',
        releaseMode: 'multi-release',
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
          milestones: milestones.length
        }
      }

      const result = await initializeEscrow(payload)
      setContractId(result.contractId)
      setEscrowData(result.escrow)
    } catch (error) {
      console.error('Failed to initialize escrow:', error)
    }
  }

  async function handleFundEscrow() {
    if (!contractId) return

    try {
      const payload = {
        contractId,
        amount: '1000000',
        releaseMode: 'multi-release'
      }

      const result = await fundEscrow(payload)
      setEscrowData(result.escrow)
    } catch (error) {
      console.error('Failed to fund escrow:', error)
    }
  }

  async function handleCompleteMilestone(milestoneId: string) {
    if (!contractId) return

    try {
      const payload = {
        contractId,
        milestoneId,
        status: 'completed',
        releaseMode: 'multi-release'
      }

      const result = await changeMilestoneStatus(payload)
      setEscrowData(result.escrow)
      
      // Update milestone status
      const updatedMilestones = milestones.map(m => 
        m.id === milestoneId ? { ...m, status: 'completed' as const } : m
      )
    } catch (error) {
      console.error('Failed to complete milestone:', error)
    }
  }

  async function handleApproveMilestone(milestoneId: string) {
    if (!contractId) return

    try {
      const payload = {
        contractId,
        milestoneId,
        releaseMode: 'multi-release'
      }

      const result = await approveMilestone(payload)
      setEscrowData(result.escrow)
      
      // Update milestone status
      const updatedMilestones = milestones.map(m => 
        m.id === milestoneId ? { ...m, status: 'approved' as const } : m
      )
    } catch (error) {
      console.error('Failed to approve milestone:', error)
    }
  }

  async function handleStartDispute(milestoneId: string) {
    if (!contractId || !newDisputeReason.trim()) return

    try {
      const payload = {
        contractId,
        milestoneId,
        releaseMode: 'multi-release',
        reason: newDisputeReason
      }

      const result = await startDispute(payload)
      setEscrowData(result.escrow)
      
      // Create new dispute
      const newDispute: Dispute = {
        id: `dispute_${Date.now()}`,
        milestoneId,
        raisedBy: currentRole,
        reason: newDisputeReason,
        status: 'open',
        raisedAt: new Date().toISOString()
      }
      
      setDisputes([...disputes, newDispute])
      setNewDisputeReason('')
      
      // Update milestone status
      const updatedMilestones = milestones.map(m => 
        m.id === milestoneId ? { ...m, status: 'disputed' as const } : m
      )
    } catch (error) {
      console.error('Failed to start dispute:', error)
    }
  }

  async function handleResolveDispute(disputeId: string, resolution: 'approve' | 'reject' | 'modify') {
    if (!contractId) return

    try {
      const dispute = disputes.find(d => d.id === disputeId)
      if (!dispute) return

      const payload = {
        contractId,
        milestoneId: dispute.milestoneId,
        releaseMode: 'multi-release',
        resolution,
        reason: resolutionReason || `Resolved by arbitrator: ${resolution}`
      }

      const result = await resolveDispute(payload)
      setEscrowData(result.escrow)
      
      // Update dispute status
      const updatedDisputes = disputes.map(d => 
        d.id === disputeId ? { 
          ...d, 
          status: 'resolved' as const,
          resolvedAt: new Date().toISOString(),
          resolution,
          resolutionReason: payload.reason,
          arbitrator: currentRole
        } : d
      )
      setDisputes(updatedDisputes)
      
      // Update milestone status based on resolution
      const updatedMilestones = milestones.map(m => {
        if (m.id === dispute.milestoneId) {
          if (resolution === 'approve') {
            return { ...m, status: 'approved' as const }
          } else if (resolution === 'reject') {
            return { ...m, status: 'cancelled' as const }
          } else {
            return { ...m, status: 'pending' as const }
          }
        }
        return m
      })
      
      setResolutionReason('')
    } catch (error) {
      console.error('Failed to resolve dispute:', error)
    }
  }

  async function handleReleaseFunds(milestoneId: string) {
    if (!contractId) return

    try {
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
    } catch (error) {
      console.error('Failed to release funds:', error)
    }
  }

  function resetDemo() {
    setContractId('')
    setEscrowData(null)
    setCurrentRole('client')
    setDisputes([])
    setNewDisputeReason('')
    setResolutionReason('')
    
    // Reset milestone statuses
    milestones.forEach(m => {
      m.status = 'pending'
    })
  }

  const getMilestoneStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-warning-500/20 text-warning-300'
      case 'completed':
        return 'bg-brand-500/20 text-brand-300'
      case 'approved':
        return 'bg-success-500/20 text-success-300'
      case 'disputed':
        return 'bg-danger-500/20 text-danger-300'
      case 'released':
        return 'bg-accent-500/20 text-accent-300'
      case 'cancelled':
        return 'bg-neutral-500/20 text-neutral-300'
      default:
        return 'bg-neutral-500/20 text-neutral-300'
    }
  }

  const canReleaseMilestone = (milestone: Milestone) => {
    return milestone.status === 'approved' && !disputes.some(d => d.milestoneId === milestone.id && d.status === 'open')
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-gradient-to-br from-warning-500/20 to-danger-500/20 backdrop-blur-sm border border-warning-400/30 rounded-xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-warning-400 to-danger-400 mb-4">
            ⚖️ Dispute Resolution Demo
          </h2>
          <p className="text-white/80 text-lg">
            Arbitration and conflict resolution system for handling escrow disputes
          </p>
        </div>

        {/* Role Selection */}
        <div className="mb-8 p-6 bg-white/5 rounded-lg border border-white/20">
          <h3 className="text-xl font-semibold text-white mb-4">👤 Select Your Role</h3>
          <div className="flex space-x-4">
            {(['client', 'worker', 'arbitrator'] as const).map(role => (
              <button
                key={role}
                onClick={() => setCurrentRole(role)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  currentRole === role
                    ? 'bg-orange-500/30 border-2 border-orange-400/50 text-orange-200'
                    : 'bg-white/5 border border-white/20 text-white/70 hover:bg-white/10 hover:border-white/30'
                }`}
              >
                {role === 'client' && '👔 Client'}
                {role === 'worker' && '👷 Worker'}
                {role === 'arbitrator' && '⚖️ Arbitrator'}
              </button>
            ))}
          </div>
          <p className="text-sm text-white/60 mt-3">
            Current role: <span className="text-orange-300 capitalize">{currentRole}</span>
          </p>
        </div>

        {/* Demo Setup */}
        {!contractId && (
          <div className="mb-8 p-6 bg-white/5 rounded-lg border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-4">🚀 Setup Demo</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-orange-300 mb-3">Milestones</h4>
                <div className="space-y-2">
                  {milestones.map(milestone => (
                    <div key={milestone.id} className="p-3 bg-white/5 rounded-lg">
                      <p className="font-medium text-white">{milestone.title}</p>
                      <p className="text-sm text-white/70">{milestone.description}</p>
                      <p className="text-xs text-orange-300 mt-1">
                        {(parseInt(milestone.amount) / 100000).toFixed(1)} USDC
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-orange-300 mb-3">Dispute Flow</h4>
                <div className="space-y-2 text-sm text-white/70">
                  <p>• Worker completes milestone</p>
                  <p>• Client can approve or dispute</p>
                  <p>• Arbitrator resolves disputes</p>
                  <p>• Funds released based on resolution</p>
                </div>
              </div>
            </div>
            <div className="mt-6 text-center">
              <button
                onClick={handleInitializeEscrow}
                disabled={!isConnected || isInitializing}
                className="px-8 py-3 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-400/30 rounded-lg text-orange-300 hover:text-orange-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isInitializing ? 'Initializing...' : 'Initialize Dispute Resolution Escrow'}
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
                <p className="font-mono text-orange-300 bg-orange-900/30 px-2 py-1 rounded">
                  {contractId.slice(0, 20)}...
                </p>
              </div>
              <div>
                <p className="text-white/70">Status:</p>
                <p className="text-orange-300">{escrowData?.status || 'Active'}</p>
              </div>
              <div>
                <p className="text-white/70">Total Amount:</p>
                <p className="text-orange-300">10 USDC</p>
              </div>
            </div>
            
            {!escrowData?.metadata?.funded && (
              <div className="mt-4 text-center">
                <button
                  onClick={handleFundEscrow}
                  disabled={isFunding}
                  className="px-6 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-400/30 rounded-lg text-green-300 hover:text-green-200 transition-colors"
                >
                  {isFunding ? 'Funding...' : 'Fund Escrow'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Milestones Management */}
        {contractId && escrowData?.metadata?.funded && (
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
                        <span className="text-orange-300">{(parseInt(milestone.amount) / 100000).toFixed(1)} USDC</span>
                        <span className={`px-2 py-1 rounded text-xs ${getMilestoneStatusColor(milestone.status)}`}>
                          {milestone.status.charAt(0).toUpperCase() + milestone.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      {/* Worker Actions */}
                      {currentRole === 'worker' && milestone.status === 'pending' && (
                        <button
                          onClick={() => handleCompleteMilestone(milestone.id)}
                          disabled={isChangingStatus}
                          className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-400/30 rounded-lg text-green-300 hover:text-green-200 transition-colors block w-full"
                        >
                          {isChangingStatus ? 'Completing...' : 'Mark Complete'}
                        </button>
                      )}
                      
                      {/* Client Actions */}
                      {currentRole === 'client' && milestone.status === 'completed' && (
                        <div className="space-y-2">
                          <button
                            onClick={() => handleApproveMilestone(milestone.id)}
                            disabled={isApproving}
                            className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-400/30 rounded-lg text-green-300 hover:text-green-200 transition-colors block w-full"
                          >
                            {isApproving ? 'Approving...' : 'Approve'}
                          </button>
                          <button
                            onClick={() => handleStartDispute(milestone.id)}
                            disabled={isStartingDispute || !newDisputeReason.trim()}
                            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 rounded-lg text-red-300 hover:text-red-200 transition-colors block w-full"
                          >
                            {isStartingDispute ? 'Starting...' : 'Dispute'}
                          </button>
                        </div>
                      )}
                      
                      {/* Release Funds */}
                      {canReleaseMilestone(milestone) && (
                        <button
                          onClick={() => handleReleaseFunds(milestone.id)}
                          disabled={isReleasing}
                          className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 rounded-lg text-blue-300 hover:text-blue-200 transition-colors block w-full"
                        >
                          {isReleasing ? 'Releasing...' : 'Release Funds'}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Dispute Input for Client */}
                  {currentRole === 'client' && milestone.status === 'completed' && (
                    <div className="mt-4 p-4 bg-red-500/10 border border-red-400/30 rounded-lg">
                      <h5 className="text-sm font-medium text-red-300 mb-2">Raise Dispute</h5>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={newDisputeReason}
                          onChange={(e) => setNewDisputeReason(e.target.value)}
                          placeholder="Enter dispute reason..."
                          className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-red-400/50"
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
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-white mb-6">⚖️ Active Disputes</h3>
            <div className="space-y-4">
              {disputes.map(dispute => (
                <div key={dispute.id} className="p-6 bg-white/5 rounded-lg border border-white/20">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-white mb-2">
                        Dispute for {milestones.find(m => m.id === dispute.milestoneId)?.title}
                      </h4>
                      <p className="text-white/70 mb-3">{dispute.reason}</p>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="text-red-300">Raised by: {dispute.raisedBy}</span>
                        <span className="text-red-300">Status: {dispute.status}</span>
                        <span className="text-red-300">
                          Raised: {new Date(dispute.raisedAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    
                    {/* Arbitrator Actions */}
                    {currentRole === 'arbitrator' && dispute.status === 'open' && (
                      <div className="space-y-2">
                        <div className="mb-3">
                          <input
                            type="text"
                            value={resolutionReason}
                            onChange={(e) => setResolutionReason(e.target.value)}
                            placeholder="Enter resolution reason..."
                            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-orange-400/50"
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <button
                            onClick={() => handleResolveDispute(dispute.id, 'approve')}
                            disabled={isResolvingDispute}
                            className="px-3 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-400/30 rounded-lg text-green-300 hover:text-green-200 transition-colors text-sm"
                          >
                            {isResolvingDispute ? '...' : 'Approve'}
                          </button>
                          <button
                            onClick={() => handleResolveDispute(dispute.id, 'reject')}
                            disabled={isResolvingDispute}
                            className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 rounded-lg text-red-300 hover:text-red-200 transition-colors text-sm"
                          >
                            {isResolvingDispute ? '...' : 'Reject'}
                          </button>
                          <button
                            onClick={() => handleResolveDispute(dispute.id, 'modify')}
                            disabled={isResolvingDispute}
                            className="px-3 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-400/30 rounded-lg text-yellow-300 hover:text-yellow-200 transition-colors text-sm"
                          >
                            {isResolvingDispute ? '...' : 'Modify'}
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {/* Resolved Dispute Info */}
                    {dispute.status === 'resolved' && (
                      <div className="text-right">
                        <div className={`px-3 py-2 rounded text-sm ${
                          dispute.resolution === 'approve' ? 'bg-green-500/20 text-green-300' :
                          dispute.resolution === 'reject' ? 'bg-red-500/20 text-red-300' :
                          'bg-yellow-500/20 text-yellow-300'
                        }`}>
                          {dispute.resolution?.toUpperCase()}
                        </div>
                        <p className="text-xs text-white/60 mt-1">
                          Resolved by {dispute.arbitrator}
                        </p>
                        <p className="text-xs text-white/60">
                          {dispute.resolvedAt ? new Date(dispute.resolvedAt).toLocaleString() : ''}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error Display */}
        {(initError || fundError || statusError || approveError || releaseError || disputeError || resolveError) && (
          <div className="p-4 bg-red-500/20 border border-red-400/30 rounded-lg">
            <h4 className="font-semibold text-red-300 mb-2">Error Occurred</h4>
            <p className="text-red-200 text-sm">
              {initError?.message || fundError?.message || statusError?.message || 
               approveError?.message || releaseError?.message || disputeError?.message || resolveError?.message}
            </p>
          </div>
        )}

        {/* Demo Instructions */}
        <div className="mt-8 p-6 bg-orange-500/10 border border-orange-400/30 rounded-lg">
          <h3 className="text-lg font-semibold text-orange-300 mb-3">📚 How This Demo Works</h3>
          <ul className="text-orange-200 text-sm space-y-2">
            <li>• <strong>Role-Based Actions:</strong> Switch between client, worker, and arbitrator roles</li>
            <li>• <strong>Dispute Creation:</strong> Clients can dispute completed milestones with reasons</li>
            <li>• <strong>Arbitration Process:</strong> Arbitrators resolve disputes with three options</li>
            <li>• <strong>Smart Contract Enforcement:</strong> All resolutions are enforced on-chain</li>
            <li>• <strong>Transparent History:</strong> Complete dispute timeline and resolution tracking</li>
          </ul>
          <p className="text-orange-200 text-sm mt-3">
            This demonstrates how complex dispute resolution workflows can be automated on Stellar, 
            providing transparency and reducing the need for traditional legal intervention.
          </p>
        </div>
      </div>
    </div>
  )
}
