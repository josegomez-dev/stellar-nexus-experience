'use client'

import { useState } from 'react'
import { useWallet } from '@/lib/stellar-wallet-hooks'
import { 
  useInitializeEscrow, 
  useFundEscrow, 
  useChangeMilestoneStatus, 
  useApproveMilestone, 
  useReleaseFunds 
} from '@/lib/mock-trustless-work'
import { assetConfig } from '@/lib/wallet-config'

interface Stakeholder {
  id: string
  name: string
  role: string
  address: string
  hasApproved: boolean
  approvalTime?: string
}

interface Milestone {
  id: string
  title: string
  description: string
  amount: string
  status: 'pending' | 'approved' | 'released'
  approvals: string[]
  requiredApprovals: number
}

export const MilestoneVotingDemo = () => {
  const { walletData, isConnected } = useWallet()
  const [contractId, setContractId] = useState<string>('')
  const [escrowData, setEscrowData] = useState<any>(null)
  const [currentMilestone, setCurrentMilestone] = useState<Milestone | null>(null)
  const [activeStakeholder, setActiveStakeholder] = useState<string>('')

  // Hooks
  const { initializeEscrow, isLoading: isInitializing, error: initError } = useInitializeEscrow()
  const { fundEscrow, isLoading: isFunding, error: fundError } = useFundEscrow()
  const { changeMilestoneStatus, isLoading: isChangingStatus, error: statusError } = useChangeMilestoneStatus()
  const { approveMilestone, isLoading: isApproving, error: approveError } = useApproveMilestone()
  const { releaseFunds, isLoading: isReleasing, error: releaseError } = useReleaseFunds()

  // Mock stakeholders for demo
  const [stakeholders] = useState<Stakeholder[]>([
    {
      id: 'client',
      name: 'Project Client',
      role: 'Primary Client',
      address: 'client_wallet_address',
      hasApproved: false
    },
    {
      id: 'reviewer1',
      name: 'Technical Reviewer',
      role: 'Code Quality',
      address: 'reviewer1_wallet_address',
      hasApproved: false
    },
    {
      id: 'reviewer2',
      name: 'Design Reviewer',
      role: 'UI/UX Quality',
      address: 'reviewer2_wallet_address',
      hasApproved: false
    },
    {
      id: 'manager',
      name: 'Project Manager',
      role: 'Overall Approval',
      address: 'manager_wallet_address',
      hasApproved: false
    }
  ])

  // Mock milestones
  const [milestones] = useState<Milestone[]>([
    {
      id: 'milestone_1',
      title: 'Frontend Development',
      description: 'Complete React components and styling',
      amount: '500000', // 5 USDC
      status: 'pending',
      approvals: [],
      requiredApprovals: 3 // Need 3 out of 4 stakeholders to approve
    },
    {
      id: 'milestone_2',
      title: 'Backend API',
      description: 'Implement REST API endpoints',
      amount: '300000', // 3 USDC
      status: 'pending',
      approvals: [],
      requiredApprovals: 2 // Need 2 out of 4 stakeholders to approve
    },
    {
      id: 'milestone_3',
      title: 'Testing & Deployment',
      description: 'QA testing and production deployment',
      amount: '200000', // 2 USDC
      status: 'pending',
      approvals: [],
      requiredApprovals: 2 // Need 2 out of 4 stakeholders to approve
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
        terms: 'Multi-stakeholder milestone approval system demo',
        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        metadata: {
          demo: 'milestone-voting',
          description: 'Multi-stakeholder approval demo',
          stakeholders: stakeholders.length,
          milestones: milestones.length
        }
      }

      const result = await initializeEscrow(payload)
      setContractId(result.contractId)
      setEscrowData(result.escrow)
      setCurrentMilestone(milestones[0])
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
        m.id === milestoneId ? { ...m, status: 'pending' as const } : m
      )
      setCurrentMilestone(updatedMilestones.find(m => m.id === milestoneId) || null)
    } catch (error) {
      console.error('Failed to complete milestone:', error)
    }
  }

  async function handleApproveMilestone(milestoneId: string, stakeholderId: string) {
    if (!contractId) return

    try {
      const payload = {
        contractId,
        milestoneId,
        releaseMode: 'multi-release'
      }

      const result = await approveMilestone(payload)
      setEscrowData(result.escrow)
      
      // Update stakeholder approval
      const updatedStakeholders = stakeholders.map(s => 
        s.id === stakeholderId ? { ...s, hasApproved: true, approvalTime: new Date().toISOString() } : s
      )
      
      // Update milestone approvals
      const updatedMilestones = milestones.map(m => {
        if (m.id === milestoneId) {
          const newApprovals = [...m.approvals, stakeholderId]
          const newStatus = newApprovals.length >= m.requiredApprovals ? 'approved' as const : 'pending'
          return { ...m, approvals: newApprovals, status: newStatus }
        }
        return m
      })
      
      // Check if milestone is ready for release
      const milestone = updatedMilestones.find(m => m.id === milestoneId)
      if (milestone && milestone.status === 'approved') {
        setCurrentMilestone(milestone as Milestone)
      }
    } catch (error) {
      console.error('Failed to approve milestone:', error)
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
      setCurrentMilestone(updatedMilestones.find(m => m.id === milestoneId) || null)
    } catch (error) {
      console.error('Failed to release funds:', error)
    }
  }

  function resetDemo() {
    setContractId('')
    setEscrowData(null)
    setCurrentMilestone(null)
    setActiveStakeholder('')
    
    // Reset stakeholder approvals
    stakeholders.forEach(s => {
      s.hasApproved = false
      delete s.approvalTime
    })
    
    // Reset milestone statuses
    milestones.forEach(m => {
      m.status = 'pending'
      m.approvals = []
    })
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

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border border-blue-400/30 rounded-xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-4">
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
                onClick={handleInitializeEscrow}
                disabled={!isConnected || isInitializing}
                className="px-8 py-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 rounded-lg text-blue-300 hover:text-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isInitializing ? 'Initializing...' : 'Initialize Multi-Stakeholder Escrow'}
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
                <p className="font-mono text-blue-300 bg-blue-900/30 px-2 py-1 rounded">
                  {contractId.slice(0, 20)}...
                </p>
              </div>
              <div>
                <p className="text-white/70">Status:</p>
                <p className="text-blue-300">{escrowData?.status || 'Active'}</p>
              </div>
              <div>
                <p className="text-white/70">Total Amount:</p>
                <p className="text-blue-300">10 USDC</p>
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
                        <span className="text-blue-300">{(parseInt(milestone.amount) / 100000).toFixed(1)} USDC</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          milestone.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' :
                          milestone.status === 'approved' ? 'bg-green-500/20 text-green-300' :
                          'bg-blue-500/20 text-blue-300'
                        }`}>
                          {milestone.status.charAt(0).toUpperCase() + milestone.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <button
                        onClick={() => handleCompleteMilestone(milestone.id)}
                        disabled={milestone.status !== 'pending' || isChangingStatus}
                        className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-400/30 rounded-lg text-green-300 hover:text-green-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-2"
                      >
                        {isChangingStatus ? 'Completing...' : 'Mark Complete'}
                      </button>
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
                                disabled={stakeholder.hasApproved || isApproving}
                                className={`px-3 py-1 rounded text-xs transition-colors ${
                                  stakeholder.hasApproved
                                    ? 'bg-green-500/20 text-green-300 cursor-not-allowed'
                                    : 'bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 text-blue-300 hover:text-blue-200'
                                }`}
                              >
                                {stakeholder.hasApproved ? '✅ Approved' : 'Approve'}
                              </button>
                            )}
                            {stakeholder.hasApproved && (
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

        {/* Demo Instructions */}
        <div className="mt-8 p-6 bg-blue-500/10 border border-blue-400/30 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-300 mb-3">📚 How This Demo Works</h3>
          <ul className="text-blue-200 text-sm space-y-2">
            <li>• <strong>Multi-Stakeholder:</strong> 4 different roles must approve milestones</li>
            <li>• <strong>Consensus Required:</strong> Each milestone needs a specific number of approvals</li>
            <li>• <strong>Progressive Release:</strong> Funds are released per milestone upon approval</li>
            <li>• <strong>Trustless Governance:</strong> Smart contract enforces approval rules automatically</li>
            <li>• <strong>Transparent Process:</strong> All approvals and progress are visible on-chain</li>
          </ul>
          <p className="text-blue-200 text-sm mt-3">
            This demonstrates how complex approval workflows can be automated on Stellar, 
            ensuring transparency and reducing the need for manual intervention.
          </p>
        </div>
      </div>
    </div>
  )
}
