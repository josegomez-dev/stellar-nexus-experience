'use client';

import { useState } from 'react';
import Image from 'next/image';

interface TechNode {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  children?: TechNode[];
  isUnlocked?: boolean;
  isActive?: boolean;
}

interface TechTreeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TechTreeModal = ({ isOpen, onClose }: TechTreeModalProps) => {
  const [selectedNode, setSelectedNode] = useState<TechNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'tree' | 'diagram'>('tree');

  const techTree: TechNode[] = [
    {
      id: 'stellar-foundation',
      title: 'Stellar Foundation',
      description:
        'The base layer of our trustless work system, built on Stellar blockchain for fast, secure, and cost-effective transactions.',
      icon: '⭐',
      color: 'from-blue-500 to-cyan-500',
      isUnlocked: true,
      isActive: true,
      children: [
        {
          id: 'stellar-consensus',
          title: 'Stellar Consensus Protocol',
          description:
            'Federated Byzantine Agreement (FBA) ensures network security and transaction finality in seconds.',
          icon: '🔒',
          color: 'from-green-500 to-emerald-500',
          isUnlocked: true,
          isActive: true,
        },
        {
          id: 'stellar-transactions',
          title: 'Stellar Transactions',
          description:
            'Fast, low-cost transactions with built-in multi-signature support and atomic operations.',
          icon: '⚡',
          color: 'from-purple-500 to-pink-500',
          isUnlocked: true,
          isActive: true,
        },
      ],
    },
    {
      id: 'escrow-core',
      title: 'Escrow Core System',
      description:
        'The heart of trustless work - automated escrow contracts that hold funds until conditions are met.',
      icon: '🏦',
      color: 'from-yellow-500 to-orange-500',
      isUnlocked: true,
      isActive: true,
      children: [
        {
          id: 'multi-sig',
          title: 'Multi-Signature Wallets',
          description:
            'Multi-party signature requirements ensure no single party can access funds without consensus.',
          icon: '🔐',
          color: 'from-red-500 to-pink-500',
          isUnlocked: true,
          isActive: true,
        },
        {
          id: 'time-locks',
          title: 'Time-Locked Contracts',
          description:
            'Automated contract execution based on time conditions and milestone completion.',
          icon: '⏰',
          color: 'from-indigo-500 to-purple-500',
          isUnlocked: true,
          isActive: true,
        },
      ],
    },
    {
      id: 'work-protocols',
      title: 'Work Protocols',
      description:
        'Standardized protocols for different types of work arrangements and dispute resolution.',
      icon: '📋',
      color: 'from-teal-500 to-cyan-500',
      isUnlocked: true,
      isActive: true,
      children: [
        {
          id: 'milestone-protocol',
          title: 'Milestone Protocol',
          description:
            'Break down complex projects into verifiable milestones with automated payment triggers.',
          icon: '🎯',
          color: 'from-emerald-500 to-green-500',
          isUnlocked: true,
          isActive: true,
        },
        {
          id: 'dispute-resolution',
          title: 'Dispute Resolution',
          description:
            'Decentralized arbitration system with multi-stakeholder voting and automated enforcement.',
          icon: '⚖️',
          color: 'from-amber-500 to-yellow-500',
          isUnlocked: false,
          isActive: false,
        },
      ],
    },
    {
      id: 'smart-contracts',
      title: 'Smart Contracts',
      description:
        'Programmable contracts that automatically execute based on predefined conditions and triggers.',
      icon: '🤖',
      color: 'from-violet-500 to-purple-500',
      isUnlocked: true,
      isActive: true,
      children: [
        {
          id: 'contract-templates',
          title: 'Contract Templates',
          description:
            'Pre-built, audited contract templates for common work arrangements and use cases.',
          icon: '📄',
          color: 'from-sky-500 to-blue-500',
          isUnlocked: true,
          isActive: true,
        },
        {
          id: 'custom-contracts',
          title: 'Custom Contracts',
          description:
            'Build custom smart contracts with our visual contract builder and deployment tools.',
          icon: '🔧',
          color: 'from-rose-500 to-red-500',
          isUnlocked: false,
          isActive: false,
        },
      ],
    },
  ];

  const renderNode = (node: TechNode, level: number = 0) => {
    const isSelected = selectedNode?.id === node.id;
    const isHovered = hoveredNode === node.id;

    return (
      <div key={node.id} className='relative'>
        {/* Node */}
        <div
          className={`relative group cursor-pointer transition-all duration-300 ${
            level === 0 ? 'mb-8' : 'mb-4'
          }`}
          onClick={() => setSelectedNode(node)}
          onMouseEnter={() => setHoveredNode(node.id)}
          onMouseLeave={() => setHoveredNode(null)}
        >
          {/* Node Background */}
          <div
            className={`
            relative p-6 rounded-2xl border-2 transition-all duration-300 transform
            ${
              node.isUnlocked
                ? `bg-gradient-to-r ${node.color} border-white/30 hover:border-white/50 hover:scale-105`
                : 'bg-gray-700/50 border-gray-600/50 opacity-50'
            }
            ${isSelected ? 'scale-110 shadow-2xl' : ''}
            ${isHovered ? 'shadow-lg' : ''}
          `}
          >
            {/* Node Content */}
            <div className='flex items-center space-x-4'>
              <div className={`text-4xl ${node.isUnlocked ? '' : 'grayscale'}`}>{node.icon}</div>
              <div className='flex-1'>
                <h3
                  className={`text-xl font-bold mb-2 ${
                    node.isUnlocked ? 'text-white' : 'text-gray-400'
                  }`}
                >
                  {node.title}
                  {!node.isUnlocked && (
                    <span className='ml-2 text-sm bg-gray-600/50 px-2 py-1 rounded-full'>
                      🔒 Locked
                    </span>
                  )}
                </h3>
                <p className={`text-sm ${node.isUnlocked ? 'text-white/80' : 'text-gray-500'}`}>
                  {node.description}
                </p>
              </div>
            </div>

            {/* Selection Indicator */}
            {isSelected && (
              <div className='absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse'>
                <span className='text-xs'>✓</span>
              </div>
            )}
          </div>
        </div>

        {/* Children */}
        {node.children && (
          <div
            className={`ml-8 border-l-2 border-white/20 pl-6 ${
              level === 0 ? 'space-y-4' : 'space-y-2'
            }`}
          >
            {node.children.map(child => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
      {/* Backdrop */}
      <div className='absolute inset-0 bg-black/80 backdrop-blur-sm' onClick={onClose} />

      {/* Modal */}
      <div className='relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl border border-white/20 shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden'>
        {/* Header */}
        <div className='bg-gradient-to-r from-brand-500/20 to-accent-500/20 p-6 border-b border-white/20'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-3'>
              <Image
                src='/images/logo/logoicon.png'
                alt='Trustless Work'
                width={50}
                height={50}
              />
              <h2 className='text-2xl font-bold text-white'>Trustless Work Tech Tree</h2>
            </div>
            <button
              onClick={onClose}
              className='p-2 hover:bg-white/10 rounded-lg transition-colors duration-200'
            >
              <span className='text-2xl'>✕</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className='p-6 overflow-y-auto max-h-[calc(90vh-120px)]'>
          {/* View Toggle */}
          <div className='flex justify-center mb-6'>
            <div className='bg-white/10 rounded-xl p-1 border border-white/20'>
              <button
                onClick={() => setActiveView('tree')}
                className={`px-6 py-2 rounded-lg transition-all duration-200 ${
                  activeView === 'tree'
                    ? 'bg-gradient-to-r from-brand-500 to-accent-500 text-white shadow-lg'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                🌳 Trustless Work Tech Tree
              </button>
              <button
                onClick={() => setActiveView('diagram')}
                className={`px-6 py-2 rounded-lg transition-all duration-200 ${
                  activeView === 'diagram'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                🏗️ Architecture
              </button>
            </div>
          </div>

          {activeView === 'tree' ? (
            <div className='grid lg:grid-cols-3 gap-6'>
              {/* Tech Tree */}
              <div className='lg:col-span-2'>
                <div className='mb-6'>
                  <h3 className='text-xl font-bold text-white mb-2'>Technology Stack</h3>
                  <p className='text-white/70 text-sm'>
                    Explore the technology behind Trustless Work. Click on nodes to learn more about
                    each component.
                  </p>
                </div>

                <div className='space-y-6 max-h-[calc(90vh-200px)] overflow-y-auto pr-4'>
                  {techTree.map(node => renderNode(node))}
                </div>
              </div>

              {/* Details Panel */}
              <div className='lg:col-span-1'>
                <div className='sticky top-6 bg-white/5 rounded-2xl p-6 border border-white/10 max-h-[calc(90vh-200px)] overflow-y-auto'>
                  <h3 className='text-lg font-bold text-white mb-4'>Technology Details</h3>

                  {selectedNode ? (
                    <div className='space-y-4'>
                      <div className='text-center'>
                        <div className='text-4xl mb-2'>{selectedNode.icon}</div>
                        <h4 className='text-xl font-bold text-white mb-2'>{selectedNode.title}</h4>
                        <p className='text-white/80 text-sm leading-relaxed'>
                          {selectedNode.description}
                        </p>
                      </div>

                      <div className='pt-4 border-t border-white/10'>
                        <div className='flex items-center justify-between text-sm'>
                          <span className='text-white/60'>Status:</span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              selectedNode.isUnlocked
                                ? 'bg-green-500/20 text-green-300'
                                : 'bg-gray-500/20 text-gray-300'
                            }`}
                          >
                            {selectedNode.isUnlocked ? '✅ Active' : '🔒 Locked'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className='text-center text-white/60'>
                      <div className='text-4xl mb-4'>👆</div>
                      <p>Click on a technology node to see detailed information</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Architecture Diagram using Mermaid-like structure */
            <div className='space-y-8'>
              <div className='text-center mb-8'>
                <h3 className='text-2xl font-bold text-white mb-2'>
                  🏗️ Trustless Work Architecture
                </h3>
                <p className='text-white/70 text-sm'>
                  Visual representation of the Trustless Work technology stack and data flow
                </p>
              </div>

              {/* Architecture Diagram */}
              <div className='bg-white/5 rounded-3xl p-8 border border-white/10 overflow-x-auto'>
                <div className='min-w-[800px] space-y-8'>
                  {/* Layer 1: User Interface */}
                  <div className='text-center'>
                    <div className='bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl p-6 border border-blue-400/30'>
                      <div className='text-3xl mb-2'>🖥️</div>
                      <h4 className='text-lg font-bold text-blue-300 mb-2'>User Interface Layer</h4>
                      <div className='flex justify-center space-x-4 text-sm text-blue-200'>
                        <span>React Components</span>
                        <span>•</span>
                        <span>Web3 Integration</span>
                        <span>•</span>
                        <span>Wallet Connect</span>
                      </div>
                    </div>
                  </div>

                  {/* Connection Arrow */}
                  <div className='flex justify-center'>
                    <div className='w-1 h-8 bg-gradient-to-b from-blue-400 to-purple-400'></div>
                  </div>

                  {/* Layer 2: Application Logic */}
                  <div className='text-center'>
                    <div className='bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-purple-400/30'>
                      <div className='text-3xl mb-2'>⚙️</div>
                      <h4 className='text-lg font-bold text-purple-300 mb-2'>
                        Application Logic Layer
                      </h4>
                      <div className='flex justify-center space-x-4 text-sm text-purple-200'>
                        <span>Smart Contracts</span>
                        <span>•</span>
                        <span>Escrow Logic</span>
                        <span>•</span>
                        <span>Dispute Resolution</span>
                      </div>
                    </div>
                  </div>

                  {/* Connection Arrow */}
                  <div className='flex justify-center'>
                    <div className='w-1 h-8 bg-gradient-to-b from-purple-400 to-green-400'></div>
                  </div>

                  {/* Layer 3: Stellar Blockchain */}
                  <div className='text-center'>
                    <div className='bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl p-6 border border-green-400/30'>
                      <div className='text-3xl mb-2'>⭐</div>
                      <h4 className='text-lg font-bold text-green-300 mb-2'>
                        Stellar Blockchain Layer
                      </h4>
                      <div className='flex justify-center space-x-4 text-sm text-green-200'>
                        <span>Consensus Protocol</span>
                        <span>•</span>
                        <span>Multi-Signature</span>
                        <span>•</span>
                        <span>Atomic Operations</span>
                      </div>
                    </div>
                  </div>

                  {/* Horizontal Flow Diagram */}
                  <div className='mt-12'>
                    <div className='bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-2xl p-6 border border-yellow-400/30'>
                      <h4 className='text-lg font-bold text-yellow-300 mb-4 text-center'>
                        🔄 Data Flow Process
                      </h4>

                      <div className='flex items-center justify-between space-x-4'>
                        {/* Step 1 */}
                        <div className='flex-1 text-center'>
                          <div className='bg-blue-500/20 rounded-xl p-4 border border-blue-400/30'>
                            <div className='text-2xl mb-2'>1️⃣</div>
                            <div className='text-sm text-blue-200'>User Initiates</div>
                            <div className='text-xs text-blue-300'>Escrow Creation</div>
                          </div>
                        </div>

                        {/* Arrow */}
                        <div className='text-2xl text-yellow-400'>→</div>

                        {/* Step 2 */}
                        <div className='flex-1 text-center'>
                          <div className='bg-purple-500/20 rounded-xl p-4 border border-purple-400/30'>
                            <div className='text-2xl mb-2'>2️⃣</div>
                            <div className='text-sm text-purple-200'>Smart Contract</div>
                            <div className='text-xs text-purple-300'>Validates & Executes</div>
                          </div>
                        </div>

                        {/* Arrow */}
                        <div className='text-2xl text-yellow-400'>→</div>

                        {/* Step 3 */}
                        <div className='flex-1 text-center'>
                          <div className='bg-green-500/20 rounded-xl p-4 border border-green-400/30'>
                            <div className='text-2xl mb-2'>3️⃣</div>
                            <div className='text-sm text-green-200'>Stellar Network</div>
                            <div className='text-xs text-green-300'>Processes Transaction</div>
                          </div>
                        </div>

                        {/* Arrow */}
                        <div className='text-2xl text-yellow-400'>→</div>

                        {/* Step 4 */}
                        <div className='flex-1 text-center'>
                          <div className='bg-emerald-500/20 rounded-xl p-4 border border-emerald-400/30'>
                            <div className='text-2xl mb-2'>4️⃣</div>
                            <div className='text-sm text-emerald-200'>Funds Released</div>
                            <div className='text-xs text-emerald-300'>To Recipient</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Security Features */}
                  <div className='mt-8'>
                    <div className='bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-2xl p-6 border border-red-400/30'>
                      <h4 className='text-lg font-bold text-red-300 mb-4 text-center'>
                        🔒 Security Features
                      </h4>

                      <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                        <div className='text-center'>
                          <div className='text-2xl mb-2'>🔐</div>
                          <div className='text-sm text-red-200'>Multi-Signature</div>
                        </div>
                        <div className='text-center'>
                          <div className='text-2xl mb-2'>⏰</div>
                          <div className='text-sm text-red-200'>Time-Locks</div>
                        </div>
                        <div className='text-center'>
                          <div className='text-2xl mb-2'>⚖️</div>
                          <div className='text-sm text-red-200'>Dispute Resolution</div>
                        </div>
                        <div className='text-center'>
                          <div className='text-2xl mb-2'>🔍</div>
                          <div className='text-sm text-red-200'>Audit Trail</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
