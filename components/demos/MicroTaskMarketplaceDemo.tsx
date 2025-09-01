'use client'

import { useState } from 'react'
import { useGlobalWallet } from '@/contexts/WalletContext'
import { useToast } from '@/contexts/ToastContext'
import { useTransactionHistory } from '@/contexts/TransactionContext'
import { 
  useInitializeEscrow, 
  useFundEscrow, 
  useChangeMilestoneStatus,
  useApproveMilestone, 
  useReleaseFunds 
} from '@/lib/mock-trustless-work'
import { assetConfig } from '@/lib/wallet-config'

interface MicroTask {
  id: string
  title: string
  description: string
  category: string
  budget: string
  deadline: string
  status: 'open' | 'in-progress' | 'completed' | 'approved' | 'released'
  client: string
  worker?: string
  deliverables?: string
  createdAt: string
  escrowId?: string
}

interface TaskCategory {
  id: string
  name: string
  icon: string
  color: string
}

export const MicroTaskMarketplaceDemo = () => {
  const { walletData, isConnected } = useGlobalWallet()
  const { addToast } = useToast()
  const { addTransaction } = useTransactionHistory()
  const [activeTab, setActiveTab] = useState<'browse' | 'my-tasks' | 'post-task'>('browse')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    category: '',
    budget: '',
    deadline: ''
  })
  const [deliverable, setDeliverable] = useState('')
  const [selectedTask, setSelectedTask] = useState<MicroTask | null>(null)
  
  // Progress tracking for demo completion
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set())
  const [postedTasks, setPostedTasks] = useState<Set<string>>(new Set())
  
  // Individual loading states for each task
  const [taskLoadingStates, setTaskLoadingStates] = useState<Record<string, boolean>>({})

  // Hooks
  const { initializeEscrow, isLoading: isInitializing, error: initError } = useInitializeEscrow()
  const { fundEscrow, isLoading: isFunding, error: fundError } = useFundEscrow()
  const { changeMilestoneStatus, isLoading: isChangingStatus, error: statusError } = useChangeMilestoneStatus()
  const { approveMilestone, isLoading: isApproving, error: approveError } = useApproveMilestone()
  const { releaseFunds, isLoading: isReleasing, error: releaseError } = useReleaseFunds()

  // Mock task categories
  const [categories] = useState<TaskCategory[]>([
    { id: 'design', name: 'Design', icon: '🎨', color: 'from-pink-500 to-rose-500' },
    { id: 'development', name: 'Development', icon: '💻', color: 'from-blue-500 to-cyan-500' },
    { id: 'writing', name: 'Writing', icon: '✍️', color: 'from-green-500 to-emerald-500' },
    { id: 'marketing', icon: '📢', name: 'Marketing', color: 'from-purple-500 to-violet-500' },
    { id: 'research', name: 'Research', icon: '🔍', color: 'from-orange-500 to-amber-500' }
  ])

  // Helper functions for demo completion
  const canCompleteDemo = () => {
    return postedTasks.size >= 1 && completedTasks.size >= 3
  }

  const getDemoProgress = () => {
    const totalSteps = 4 // Post 1 task + Complete 3 tasks
    const completedSteps = postedTasks.size + completedTasks.size
    return Math.min((completedSteps / totalSteps) * 100, 100)
  }

  // Mock micro-tasks
  const [tasks, setTasks] = useState<MicroTask[]>([
    {
      id: 'task_1',
      title: 'Logo Design for Startup',
      description: 'Need a modern, minimalist logo for a tech startup. Should be scalable and work well in both light and dark themes.',
      category: 'design',
      budget: '500000', // 5 USDC
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'open',
      client: 'client_wallet_address',
      createdAt: new Date().toISOString()
    },
    {
      id: 'task_2',
      title: 'React Component Library',
      description: 'Create a reusable component library with 10+ components including buttons, forms, and navigation elements.',
      category: 'development',
      budget: '800000', // 8 USDC
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'open',
      client: 'client_wallet_address',
      createdAt: new Date().toISOString()
    },
    {
      id: 'task_3',
      title: 'Blog Post Series',
      description: 'Write 5 blog posts about blockchain technology trends. Each post should be 800-1000 words with SEO optimization.',
      category: 'writing',
      budget: '300000', // 3 USDC
      deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'open',
      client: 'client_wallet_address',
      createdAt: new Date().toISOString()
    },
    {
      id: 'task_4',
      title: 'Social Media Strategy',
      description: 'Develop a comprehensive social media strategy for a B2B SaaS company. Include content calendar and engagement tactics.',
      category: 'marketing',
      budget: '400000', // 4 USDC
      deadline: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'open',
      client: 'client_wallet_address',
      createdAt: new Date().toISOString()
    }
  ])

  async function handlePostTask() {
    if (!walletData || !newTask.title || !newTask.description || !newTask.category || !newTask.budget || !newTask.deadline) return

    try {
      const task: MicroTask = {
        id: `task_${Date.now()}`,
        title: newTask.title,
        description: newTask.description,
        category: newTask.category,
        budget: (parseInt(newTask.budget) * 100000).toString(), // Convert to USDC decimals
        deadline: newTask.deadline,
        status: 'open',
        client: walletData.publicKey,
        createdAt: new Date().toISOString()
      }

      setTasks([...tasks, task])
      
      // Track posted task for demo completion
      setPostedTasks(prev => new Set(Array.from(prev).concat(task.id)))
      
      addTransaction({
        hash: `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        status: 'success',
        message: `Task "${task.title}" posted successfully`,
        type: 'milestone',
        demoId: 'micro-marketplace',
        amount: `${(parseInt(task.budget) / 100000).toFixed(1)} USDC`,
        asset: 'USDC'
      })
      
      addToast({
        type: 'success',
        title: '✅ Task Posted!',
        message: `"${task.title}" has been posted to the marketplace`,
        duration: 5000
      })
      
      // Reset form
      setNewTask({
        title: '',
        description: '',
        category: '',
        budget: '',
        deadline: ''
      })
      
      setActiveTab('browse')
    } catch (error) {
      console.error('Failed to post task:', error)
      addToast({
        type: 'error',
        title: '❌ Task Posting Failed',
        message: error instanceof Error ? error.message : 'Failed to post task',
        duration: 5000
      })
    }
  }

  async function handleAcceptTask(taskId: string) {
    if (!walletData) return

    try {
      // Set loading state for this specific task
      setTaskLoadingStates(prev => ({ ...prev, [taskId]: true }))
      
      // Initialize escrow for the task
      const task = tasks.find(t => t.id === taskId)
      if (!task) return

      const payload = {
        escrowType: 'multi-release',
        releaseMode: 'multi-release',
        asset: assetConfig.defaultAsset,
        amount: task.budget,
        platformFee: assetConfig.platformFee,
        buyer: task.client,
        seller: walletData.publicKey,
        arbiter: walletData.publicKey, // For demo, same wallet
        terms: `Micro-task: ${task.title}`,
        deadline: task.deadline,
        metadata: {
          demo: 'micro-marketplace',
          description: 'Micro-task marketplace escrow',
          taskId: task.id,
          category: task.category
        }
      }

      const result = await initializeEscrow(payload)
      
      // Update task status
      const updatedTasks = tasks.map(t => 
        t.id === taskId ? { ...t, status: 'in-progress' as const, worker: walletData.publicKey, escrowId: result.contractId } : t
      )
      setTasks(updatedTasks)
      
      addTransaction({
        hash: `accept_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        status: 'success',
        message: `Task "${task.title}" accepted and escrow created`,
        type: 'escrow',
        demoId: 'micro-marketplace',
        amount: `${(parseInt(task.budget) / 100000).toFixed(1)} USDC`,
        asset: 'USDC'
      })
      
      addToast({
        type: 'success',
        title: '✅ Task Accepted!',
        message: `"${task.title}" has been accepted and escrow created`,
        duration: 5000
      })
      
      // Fund the escrow
      await handleFundEscrow(result.contractId, task.budget)
    } catch (error) {
      console.error('Failed to accept task:', error)
      addToast({
        type: 'error',
        title: '❌ Task Acceptance Failed',
        message: error instanceof Error ? error.message : 'Failed to accept task',
        duration: 5000
      })
    } finally {
      // Clear loading state for this specific task
      setTaskLoadingStates(prev => ({ ...prev, [taskId]: false }))
    }
  }

  async function handleFundEscrow(escrowId: string, amount: string) {
    try {
      const payload = {
        contractId: escrowId,
        amount,
        releaseMode: 'multi-release'
      }

      await fundEscrow(payload)
    } catch (error) {
      console.error('Failed to fund escrow:', error)
    }
  }

  async function handleSubmitDeliverable(taskId: string) {
    if (!deliverable.trim()) return

    try {
      const task = tasks.find(t => t.id === taskId)
      if (!task || !task.escrowId) return

      // Update task with deliverable
      const updatedTasks = tasks.map(t => 
        t.id === taskId ? { ...t, status: 'completed' as const, deliverables: deliverable } : t
      )
      setTasks(updatedTasks)
      
      addTransaction({
        hash: `submit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        status: 'success',
        message: `Deliverable submitted for "${task.title}"`,
        type: 'milestone',
        demoId: 'micro-marketplace',
        amount: `${(parseInt(task.budget) / 100000).toFixed(1)} USDC`,
        asset: 'USDC'
      })
      
      addToast({
        type: 'success',
        title: '✅ Deliverable Submitted!',
        message: `Work has been submitted for "${task.title}"`,
        duration: 5000
      })
      
      // Mark milestone as completed
      const payload = {
        contractId: task.escrowId,
        milestoneId: 'release_1',
        status: 'completed',
        releaseMode: 'multi-release'
      }

      await changeMilestoneStatus(payload)
      setDeliverable('')
    } catch (error) {
      console.error('Failed to submit deliverable:', error)
      addToast({
        type: 'error',
        title: '❌ Submission Failed',
        message: error instanceof Error ? error.message : 'Failed to submit deliverable',
        duration: 5000
      })
    }
  }

  async function handleApproveTask(taskId: string) {
    try {
      const task = tasks.find(t => t.id === taskId)
      if (!task || !task.escrowId) return

      // Approve milestone
      const payload = {
        contractId: task.escrowId,
        milestoneId: 'release_1',
        releaseMode: 'multi-release'
      }

      await approveMilestone(payload)
      
      addTransaction({
        hash: `approve_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        status: 'success',
        message: `Task "${task.title}" approved successfully`,
        type: 'approve',
        demoId: 'micro-marketplace',
        amount: `${(parseInt(task.budget) / 100000).toFixed(1)} USDC`,
        asset: 'USDC'
      })
      
      addToast({
        type: 'success',
        title: '✅ Task Approved!',
        message: `"${task.title}" has been approved`,
        duration: 5000
      })
      
      // Update task status
      const updatedTasks = tasks.map(t => 
        t.id === taskId ? { ...t, status: 'approved' as const } : t
      )
      setTasks(updatedTasks)
      
      // Track completed task for demo completion
      setCompletedTasks(prev => new Set(Array.from(prev).concat(taskId)))
    } catch (error) {
      console.error('Failed to approve task:', error)
      addToast({
        type: 'error',
        title: '❌ Approval Failed',
        message: error instanceof Error ? error.message : 'Failed to approve task',
        duration: 5000
      })
    }
  }

  async function handleReleaseFunds(taskId: string) {
    try {
      // Set loading state for this specific task
      setTaskLoadingStates(prev => ({ ...prev, [taskId]: true }))
      
      const task = tasks.find(t => t.id === taskId)
      if (!task || !task.escrowId) return

      // Release funds
      const payload = {
        contractId: task.escrowId,
        milestoneId: 'release_1',
        releaseMode: 'multi-release'
      }

      await releaseFunds(payload)
      
      addTransaction({
        hash: `release_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        status: 'success',
        message: `Funds released for "${task.title}"`,
        type: 'release',
        demoId: 'micro-marketplace',
        amount: `${(parseInt(task.budget) / 100000).toFixed(1)} USDC`,
        asset: 'USDC'
      })
      
      addToast({
        type: 'success',
        title: '💰 Funds Released!',
        message: `Funds have been released for "${task.title}"`,
        duration: 5000
      })
      
      // Update task status
      const updatedTasks = tasks.map(t => 
        t.id === taskId ? { ...t, status: 'released' as const } : t
      )
      setTasks(updatedTasks)
    } catch (error) {
      console.error('Failed to release funds:', error)
      addToast({
        type: 'error',
        title: '❌ Release Failed',
        message: error instanceof Error ? error.message : 'Failed to release funds',
        duration: 5000
      })
    } finally {
      // Clear loading state for this specific task
      setTaskLoadingStates(prev => ({ ...prev, [taskId]: false }))
    }
  }

  async function handleCompleteTask(taskId: string) {
    try {
      // Set loading state for this specific task
      setTaskLoadingStates(prev => ({ ...prev, [taskId]: true }))
      
      const task = tasks.find(t => t.id === taskId)
      if (!task) return

      // Update task status to completed
      const updatedTasks = tasks.map(t => 
        t.id === taskId ? { ...t, status: 'completed' as const } : t
      )
      setTasks(updatedTasks)
      
      addTransaction({
        hash: `complete_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        status: 'success',
        message: `Task "${task.title}" completed successfully`,
        type: 'milestone',
        demoId: 'micro-marketplace',
        amount: `${(parseInt(task.budget) / 100000).toFixed(1)} USDC`,
        asset: 'USDC'
      })
      
      addToast({
        type: 'success',
        title: '✅ Task Completed!',
        message: `"${task.title}" has been completed successfully`,
        duration: 5000
      })
      
      // Track completed task for demo completion
      setCompletedTasks(prev => new Set(Array.from(prev).concat(taskId)))
    } catch (error) {
      console.error('Failed to complete task:', error)
      addToast({
        type: 'error',
        title: '❌ Completion Failed',
        message: error instanceof Error ? error.message : 'Failed to complete task',
        duration: 5000
      })
    } finally {
      // Clear loading state for this specific task
      setTaskLoadingStates(prev => ({ ...prev, [taskId]: false }))
    }
  }

  const filteredTasks = tasks.filter(task => 
    selectedCategory === 'all' || task.category === selectedCategory
  )

  const myTasks = tasks.filter(task => 
    task.client === walletData?.publicKey || task.worker === walletData?.publicKey
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-success-500/20 text-success-300'
      case 'in-progress':
        return 'bg-brand-500/20 text-brand-300'
      case 'completed':
        return 'bg-warning-500/20 text-warning-300'
      case 'approved':
        return 'bg-accent-500/20 text-accent-300'
      case 'released':
        return 'bg-neutral-500/20 text-neutral-300'
      default:
        return 'bg-neutral-500/20 text-neutral-300'
    }
  }

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId)
    return category?.icon || '📋'
  }

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId)
    return category?.color || 'from-gray-500 to-gray-600'
  }

  function resetDemo() {
    setActiveTab('browse')
    setSelectedCategory('all')
    setNewTask({
      title: '',
      description: '',
      category: '',
      budget: '',
      deadline: ''
    })
    setDeliverable('')
    setSelectedTask(null)
    
    // Reset all tasks to open status
    const resetTasks = tasks.map(t => ({ ...t, status: 'open' as const, worker: undefined, escrowId: undefined, deliverables: undefined }))
    setTasks(resetTasks)
    
    // Reset progress tracking
    setCompletedTasks(new Set())
    setPostedTasks(new Set())
    
    addToast({
      type: 'warning',
      title: '🔄 Demo Reset',
      message: 'Demo has been reset. You can start over from the beginning.',
      duration: 4000
    })
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-gradient-to-br from-accent-500/20 to-accent-600/20 backdrop-blur-sm border border-accent-400/30 rounded-xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-between mb-4">
            <div></div>
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent-400 to-accent-500">
              🛒 Micro-Task Marketplace Demo
            </h2>
            <button
              onClick={resetDemo}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 rounded-lg text-red-300 hover:text-red-200 transition-colors"
            >
              🔄 Reset Demo
            </button>
          </div>
          <p className="text-white/80 text-lg">
            Lightweight gig-board with escrow functionality for micro-tasks
          </p>
          
          {/* Wallet Connection Required Message */}
          {!isConnected && (
            <div className="mt-6 p-4 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/30 rounded-lg text-center">
              <div className="flex items-center justify-center space-x-2 mb-3">
                <span className="text-2xl">🔐</span>
                <h4 className="text-lg font-semibold text-cyan-300">Wallet Connection Required</h4>
              </div>
              <p className="text-white/80 text-sm mb-4">
                You need to connect your Stellar wallet to post tasks, accept work, and manage escrow contracts.
              </p>
              <button
                onClick={() => {
                  // Dispatch custom event to open wallet sidebar
                  window.dispatchEvent(new CustomEvent('toggleWalletSidebar'))
                }}
                className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border border-white/20 hover:border-white/40"
              >
                🔗 Connect Wallet
              </button>
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex space-x-2 bg-white/5 rounded-lg p-1">
            {(['browse', 'my-tasks', 'post-task'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-4 py-2 rounded-md font-medium transition-all duration-300 ${
                  activeTab === tab
                    ? 'bg-purple-500/30 text-purple-200 shadow-lg'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab === 'browse' && '🔍 Browse Tasks'}
                {tab === 'my-tasks' && '📋 My Tasks'}
                {tab === 'post-task' && '➕ Post Task'}
              </button>
            ))}
          </div>
        </div>

        {/* Demo Progress Indicator */}
        <div className="mb-8 p-6 bg-white/5 rounded-lg border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4">📊 Demo Progress</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-white/70">Overall Progress</span>
              <span className="text-accent-300 font-semibold">{Math.round(getDemoProgress())}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-accent-400 to-accent-500 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${getDemoProgress()}%` }}
              ></div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-white/60">Tasks Posted:</span>
                <span className={`font-semibold ${postedTasks.size >= 1 ? 'text-green-400' : 'text-white/40'}`}>
                  {postedTasks.size}/1 ✅
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60">Tasks Completed:</span>
                <span className={`font-semibold ${completedTasks.size >= 3 ? 'text-green-400' : 'text-white/40'}`}>
                  {completedTasks.size}/3 ✅
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Completion Success Box */}
        {canCompleteDemo() && (
          <div className="mb-8 p-6 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-lg">
            <div className="text-center">
              <div className="text-4xl mb-4">🎉</div>
              <h3 className="text-xl font-bold text-green-300 mb-2">Demo Successfully Completed!</h3>
              <p className="text-green-200 mb-4">
                Congratulations! You've successfully demonstrated the micro-task marketplace workflow:
              </p>
              <ul className="text-green-200 text-sm space-y-1 mb-4">
                <li>✅ Posted at least 1 new task</li>
                <li>✅ Completed and approved 3 tasks</li>
                <li>✅ Experienced the full escrow workflow</li>
              </ul>
              <p className="text-green-200 text-sm">
                You've mastered the micro-task marketplace! Try different roles or reset the demo to explore more scenarios.
              </p>
            </div>
          </div>
        )}

        {/* Browse Tasks Tab */}
        {activeTab === 'browse' && (
          <div>
            {/* Category Filter */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">Filter by Category</h3>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    selectedCategory === 'all'
                      ? 'bg-purple-500/30 border-2 border-purple-400/50 text-purple-200'
                      : 'bg-white/5 border border-white/20 text-white/70 hover:bg-white/10 hover:border-white/30'
                  }`}
                >
                  🌟 All Categories
                </button>
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                      selectedCategory === category.id
                        ? 'bg-purple-500/30 border-2 border-purple-400/50 text-purple-200'
                        : 'bg-white/5 border border-white/20 text-white/70 hover:bg-white/10 hover:border-white/30'
                    }`}
                  >
                    {category.icon} {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Tasks Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {filteredTasks.map(task => (
                <div key={task.id} className="p-6 bg-white/5 rounded-lg border border-white/20 hover:border-white/40 transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-2xl">{getCategoryIcon(task.category)}</span>
                        <h4 className="text-lg font-semibold text-white">{task.title}</h4>
                      </div>
                      <p className="text-white/70 text-sm mb-3">{task.description}</p>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="text-purple-300">{(parseInt(task.budget) / 100000).toFixed(1)} USDC</span>
                        <span className={`px-2 py-1 rounded text-xs ${getStatusColor(task.status)}`}>
                          {task.status.replace('-', ' ').charAt(0).toUpperCase() + task.status.replace('-', ' ').slice(1)}
                        </span>
                      </div>
                      <p className="text-xs text-white/50 mt-2">
                        Posted {new Date(task.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Task Actions */}
                  <div className="space-y-2">
                    {task.status === 'open' && (
                                              <button
                          onClick={() => handleAcceptTask(task.id)}
                          disabled={!isConnected || taskLoadingStates[task.id]}
                          className="w-full px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/30 rounded-lg text-purple-300 hover:text-purple-200 transition-colors"
                        >
                          {taskLoadingStates[task.id] ? 'Accepting...' : 'Accept Task'}
                        </button>
                    )}
                    
                    {task.status === 'in-progress' && task.worker === walletData?.publicKey && (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={deliverable}
                          onChange={(e) => setDeliverable(e.target.value)}
                          placeholder="Submit your deliverable..."
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400/50"
                        />
                        <button
                          onClick={() => handleSubmitDeliverable(task.id)}
                          disabled={!deliverable.trim() || taskLoadingStates[task.id]}
                          className="w-full px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-400/30 rounded-lg text-green-300 hover:text-green-200 transition-colors"
                        >
                          {taskLoadingStates[task.id] ? 'Submitting...' : 'Submit Deliverable'}
                        </button>
                      </div>
                    )}
                    
                    {task.status === 'completed' && task.client === walletData?.publicKey && (
                      <div className="space-y-2">
                        <div className="p-3 bg-white/5 rounded-lg">
                          <p className="text-sm text-white/70 mb-2">Deliverable:</p>
                          <p className="text-white text-sm">{task.deliverables}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => handleApproveTask(task.id)}
                            disabled={taskLoadingStates[task.id]}
                            className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-400/30 rounded-lg text-green-300 hover:text-green-200 transition-colors text-sm"
                          >
                            {taskLoadingStates[task.id] ? 'Approving...' : 'Approve'}
                          </button>
                          <button
                            onClick={() => handleReleaseFunds(task.id)}
                            disabled={taskLoadingStates[task.id]}
                            className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 rounded-lg text-blue-300 hover:text-blue-200 transition-colors text-sm"
                          >
                            {taskLoadingStates[task.id] ? 'Releasing...' : 'Release Funds'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* My Tasks Tab */}
        {activeTab === 'my-tasks' && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">My Tasks</h3>
            {myTasks.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">📋</div>
                <p className="text-white/70">No tasks found. Start by browsing available tasks or posting a new one!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {myTasks.map(task => (
                  <div key={task.id} className="p-6 bg-white/5 rounded-lg border border-white/20">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-white mb-2">{task.title}</h4>
                        <p className="text-white/70 text-sm mb-3">{task.description}</p>
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="text-purple-300">{(parseInt(task.budget) / 100000).toFixed(1)} USDC</span>
                          <span className={`px-2 py-1 rounded text-xs ${getStatusColor(task.status)}`}>
                            {task.status.replace('-', ' ').charAt(0).toUpperCase() + task.status.replace('-', ' ').slice(1)}
                          </span>
                          <span className="text-white/50">
                            {task.client === walletData?.publicKey ? '👔 Client' : '👷 Worker'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Task Actions for My Tasks */}
                    <div className="mt-4 space-y-2">
                      {task.status === 'in-progress' && task.worker === walletData?.publicKey && (
                        <button
                          onClick={() => handleCompleteTask(task.id)}
                          disabled={taskLoadingStates[task.id]}
                          className="w-full px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-400/30 rounded-lg text-green-300 hover:text-green-200 transition-colors"
                        >
                          {taskLoadingStates[task.id] ? 'Completing...' : 'Complete Task'}
                        </button>
                      )}
                      
                      {task.status === 'completed' && task.client === walletData?.publicKey && (
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => handleApproveTask(task.id)}
                            disabled={taskLoadingStates[task.id]}
                            className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-400/30 rounded-lg text-green-300 hover:text-green-200 transition-colors text-sm"
                          >
                            {taskLoadingStates[task.id] ? 'Approving...' : 'Approve'}
                          </button>
                          <button
                            onClick={() => handleReleaseFunds(task.id)}
                            disabled={taskLoadingStates[task.id]}
                            className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 rounded-lg text-blue-300 hover:text-blue-200 transition-colors text-sm"
                          >
                            {taskLoadingStates[task.id] ? 'Releasing...' : 'Release Funds'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Post Task Tab */}
        {activeTab === 'post-task' && (
          <div className="max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-white mb-6">Post New Task</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Task Title</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="Enter task title..."
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400/50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Description</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Describe the task requirements..."
                  rows={4}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400/50"
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Category</label>
                  <select
                    value={newTask.category}
                    onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400/50"
                  >
                    <option value="">Select category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.icon} {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Budget (USDC)</label>
                  <input
                    type="number"
                    value={newTask.budget}
                    onChange={(e) => setNewTask({ ...newTask, budget: e.target.value })}
                    placeholder="0.0"
                    step="0.1"
                    min="0.1"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400/50"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Deadline</label>
                <input
                  type="date"
                  value={newTask.deadline}
                  onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400/50"
                />
              </div>
              
              <button
                onClick={handlePostTask}
                disabled={!isConnected || !newTask.title || !newTask.description || !newTask.category || !newTask.budget || !newTask.deadline}
                className="w-full px-6 py-3 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/30 rounded-lg text-purple-300 hover:text-purple-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Post Task
              </button>
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
        <div className="mt-8 p-6 bg-purple-500/10 border border-purple-400/30 rounded-lg">
          <h3 className="text-lg font-semibold text-purple-300 mb-3">📚 How This Demo Works</h3>
          <ul className="text-purple-200 text-sm space-y-2">
            <li>• <strong>Browse Tasks:</strong> View available micro-tasks by category</li>
            <li>• <strong>Post Tasks:</strong> Clients can create new tasks with budgets and deadlines</li>
            <li>• <strong>Accept Tasks:</strong> Workers can accept tasks, automatically creating escrow</li>
            <li>• <strong>Submit Deliverables:</strong> Workers submit work for review</li>
            <li>• <strong>Approve & Release:</strong> Clients approve work and release funds automatically</li>
          </ul>
          <p className="text-purple-200 text-sm mt-3">
            This demonstrates how a marketplace can integrate with Stellar escrow functionality, 
            providing trustless payment processing for micro-tasks and gig work.
          </p>
        </div>
      </div>
    </div>
  )
}
