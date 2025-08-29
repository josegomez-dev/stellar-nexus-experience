'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { NexusPrime } from '@/components/layout/NexusPrime'
import { EscrowProvider } from '@/contexts/EscrowContext'
import { WalletProvider } from '@/contexts/WalletContext'
import Image from 'next/image'

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('overview')

  const sections = [
    { id: 'overview', title: 'Technology Overview', icon: '🚀' },
    { id: 'stellar', title: 'Stellar Implementation', icon: '⭐' },
    { id: 'architecture', title: 'System Architecture', icon: '🏗️' },
    { id: 'feedback', title: 'Implementation Feedback', icon: '📝' }
  ]

  return (
    <WalletProvider>
      <EscrowProvider>
        <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-brand-900 to-neutral-900">
          <Header />
          
          {/* Main Content */}
          <main className="relative z-10 pt-20 pb-32">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                
                {/* Page Header */}
                <div className="text-center mb-16">
                  <div className="flex justify-center mb-6">
                    <Image 
                      src="/images/logo/logoicon.png" 
                      alt="STELLAR NEXUS" 
                      width={300} 
                      height={300}
                      style={{ zIndex: -1, position: 'relative' }}
                    />
                  </div>
                  
                  {/* Epic Legendary Background for Title */}
                  <div className="relative mb-8">
                    {/* Legendary Energy Background */}
                    <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
                      {/* Primary Energy Core */}
                      <div className="relative w-[500px] h-40">
                        {/* Inner Energy Ring */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-brand-500/40 via-accent-500/50 to-brand-400/40 blur-lg scale-150"></div>
                        
                        {/* Middle Energy Ring */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-accent-500/30 via-brand-500/40 to-accent-400/30 blur-xl scale-200"></div>
                        
                        {/* Outer Energy Ring */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-brand-400/20 via-accent-500/30 to-brand-300/20 blur-2xl scale-250"></div>
                      </div>
                      
                      {/* Floating Energy Particles */}
                      <div className="absolute inset-0">
                        <div className="absolute top-6 left-1/4 w-3 h-3 bg-brand-400 rounded-full animate-ping opacity-80"></div>
                        <div className="absolute top-12 right-1/3 w-2 h-2 bg-accent-400 rounded-full animate-ping opacity-90" style={{ animationDelay: '0.5s' }}></div>
                        <div className="absolute bottom-8 left-1/3 w-2.5 h-2.5 bg-brand-300 rounded-full animate-ping opacity-70" style={{ animationDelay: '1s' }}></div>
                        <div className="absolute bottom-12 right-1/4 w-2 h-2 bg-accent-300 rounded-full animate-ping opacity-85" style={{ animationDelay: '1.5s' }}></div>
                        <div className="absolute top-1/2 left-1/6 w-1.5 h-1.5 bg-brand-200 rounded-full animate-ping opacity-60" style={{ animationDelay: '2s' }}></div>
                        <div className="absolute top-1/2 right-1/6 w-2 h-2 bg-accent-200 rounded-full animate-ping opacity-75" style={{ animationDelay: '2.5s' }}></div>
                      </div>
                      
                      {/* Energy Wave Rings */}
                      <div className="absolute inset-0">
                        <div className="absolute inset-0 rounded-full border-2 border-brand-400/40 animate-ping scale-150" style={{ animationDuration: '4s' }}></div>
                        <div className="absolute inset-0 rounded-full border border-accent-400/30 animate-ping scale-200" style={{ animationDuration: '5s' }}></div>
                        <div className="absolute inset-0 rounded-full border border-brand-300/25 animate-ping scale-250" style={{ animationDuration: '6s' }}></div>
                      </div>
                      
                      {/* Plasma Energy Streams */}
                      <div className="absolute inset-0">
                        <div className="absolute left-0 top-1/2 w-1 h-24 bg-gradient-to-b from-transparent via-brand-400/50 to-transparent animate-pulse opacity-60" style={{ animationDuration: '3s' }}></div>
                        <div className="absolute right-0 top-1/2 w-1 h-20 bg-gradient-to-b from-transparent via-accent-400/50 to-transparent animate-pulse opacity-70" style={{ animationDuration: '2.5s' }}></div>
                        <div className="absolute top-0 left-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-brand-400/50 to-transparent animate-pulse opacity-50" style={{ animationDuration: '3.5s' }}></div>
                        <div className="absolute bottom-0 left-1/2 w-20 h-1 bg-gradient-to-r from-transparent via-brand-400/50 to-transparent animate-pulse opacity-65" style={{ animationDuration: '2.8s' }}></div>
                      </div>
                    </div>
                    
                    {/* Title with Enhanced Styling */}
                    <h1 className="relative z-10 text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-accent-400 to-brand-400 mb-6 drop-shadow-2xl" style={{ zIndex: 1000, marginTop: '-200px' }}>
                      NEXUS Documentation
                    </h1>
                  </div>

                  <br />
                  <br />
                  
                  <p className="text-xl text-white/80 max-w-3xl mx-auto">
                    Comprehensive technical guide to building decentralized work platforms on the Stellar blockchain
                  </p>

                  {/* Powered by Trustless Work */}
                  <div className="text-center mt-4">
                    <p className="text-brand-300/70 text-sm font-medium animate-pulse">
                      Powered by <span className="text-brand-200 font-semibold">Trustless Work</span>
                    </p>
                  </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex flex-wrap justify-center gap-2 mb-12">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                        activeSection === section.id
                          ? 'bg-gradient-to-r from-brand-500 to-accent-600 text-white shadow-lg'
                          : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                      }`}
                    >
                      <span className="mr-2">{section.icon}</span>
                      {section.title}
                    </button>
                  ))}
                </div>

                {/* Content Sections */}
                <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8">
                  
                  {/* Technology Overview */}
                  {activeSection === 'overview' && (
                    <div className="space-y-8">
                      <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-white mb-4">Technology Overview</h2>
                        <p className="text-lg text-white/80">
                          Trustless Work is a revolutionary technology stack that enables decentralized work management 
                          through smart contract-powered escrow systems on the Stellar blockchain.
                        </p>
                      </div>

                      <div className="grid md:grid-cols-3 gap-6">
                        <div className="text-center p-6 bg-gradient-to-br from-brand-500/20 to-brand-400/20 rounded-xl border border-brand-400/30">
                          <div className="text-4xl mb-4">🔐</div>
                          <h3 className="text-xl font-semibold text-white mb-3">Smart Contract Escrow</h3>
                          <p className="text-white/80">
                            Automated fund management with programmable logic and no third-party intermediaries
                          </p>
                        </div>
                        <div className="text-center p-6 bg-gradient-to-br from-success-500/20 to-success-400/20 rounded-xl border border-success-400/30">
                          <div className="text-4xl mb-4">⚡</div>
                          <h3 className="text-xl font-semibold text-white mb-3">Stellar Blockchain</h3>
                          <p className="text-white/80">
                            Built on Stellar's fast, low-cost, and environmentally friendly distributed ledger
                          </p>
                        </div>
                        <div className="text-center p-6 bg-gradient-to-br from-accent-500/20 to-accent-400/20 rounded-xl border border-accent-400/30">
                          <div className="text-4xl mb-4">🌐</div>
                          <h3 className="text-xl font-semibold text-white mb-3">Developer SDK</h3>
                          <p className="text-white/80">
                            Comprehensive React hooks and TypeScript interfaces for rapid development
                          </p>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-white/5 to-white/10 rounded-xl p-6 border border-white/20">
                        <h3 className="text-2xl font-bold text-white mb-4">Core Technology Stack</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold text-brand-300 mb-3">Blockchain Layer</h4>
                            <ul className="text-white/80 text-sm space-y-2">
                              <li>• <strong>Stellar Network:</strong> Consensus Protocol (SCP) with 3-5 second finality</li>
                              <li>• <strong>Smart Contracts:</strong> Stellar's native smart contract capabilities</li>
                              <li>• <strong>Multi-Asset Support:</strong> Native and custom token support</li>
                              <li>• <strong>Transaction Types:</strong> Payment, Path Payment, Manage Offer operations</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold text-accent-300 mb-3">Application Layer</h4>
                            <ul className="text-white/80 text-sm space-y-2">
                              <li>• <strong>React Hooks:</strong> useEscrow, useWallet, useTransaction hooks</li>
                              <li>• <strong>TypeScript:</strong> Full type safety with comprehensive interfaces</li>
                              <li>• <strong>Wallet Integration:</strong> Freighter, Albedo, and custom wallet support</li>
                              <li>• <strong>State Management:</strong> React Context for global state synchronization</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-brand-500/20 to-brand-400/20 rounded-xl p-6 border border-brand-400/30">
                        <h3 className="text-2xl font-bold text-white mb-4">Technical Advantages</h3>
                        <ul className="text-white/80 space-y-2">
                          <li>• <strong>Scalability:</strong> Stellar's 1000+ TPS capacity for high-volume applications</li>
                          <li>• <strong>Cost Efficiency:</strong> 0.00001 XLM per operation (~$0.000001)</li>
                          <li>• <strong>Global Access:</strong> Borderless transactions with instant settlement</li>
                          <li>• <strong>Security:</strong> Cryptographic security with Byzantine Fault Tolerance</li>
                          <li>• <strong>Interoperability:</strong> Built-in bridges to traditional financial systems</li>
                          <li>• <strong>Environmental:</strong> Carbon-neutral consensus mechanism</li>
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Stellar Implementation */}
                  {activeSection === 'stellar' && (
                    <div className="space-y-8">
                      <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-white mb-4">Stellar Implementation</h2>
                        <p className="text-lg text-white/80">
                          Deep dive into Stellar blockchain integration and smart contract implementation
                        </p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                          <h3 className="text-2xl font-bold text-brand-300">Stellar Network Features</h3>
                          <div className="space-y-4">
                            <div className="bg-gradient-to-br from-brand-500/20 to-brand-400/20 rounded-lg p-4 border border-brand-400/30">
                              <h4 className="font-semibold text-white mb-2">Consensus Protocol (SCP)</h4>
                              <p className="text-white/80 text-sm">
                                Stellar Consensus Protocol ensures network agreement in 3-5 seconds with Byzantine Fault Tolerance
                              </p>
                            </div>
                            <div className="bg-gradient-to-br from-brand-500/20 to-brand-400/20 rounded-lg p-4 border border-brand-400/30">
                              <h4 className="font-semibold text-white mb-2">Asset Management</h4>
                              <p className="text-white/80 text-sm">
                                Native support for XLM, USDC, and custom assets with built-in trustlines
                              </p>
                            </div>
                            <div className="bg-gradient-to-br from-brand-500/20 to-brand-400/20 rounded-lg p-4 border border-brand-400/30">
                              <h4 className="font-semibold text-white mb-2">Transaction Operations</h4>
                              <p className="text-white/80 text-sm">
                                Payment, Path Payment, Manage Offer, and Set Options for complex escrow logic
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-6">
                          <h3 className="text-2xl font-bold text-accent-300">Smart Contract Implementation</h3>
                          <div className="space-y-4">
                            <div className="bg-gradient-to-br from-accent-500/20 to-accent-400/20 rounded-lg p-4 border border-accent-400/30">
                              <h4 className="font-semibold text-white mb-2">Escrow Logic</h4>
                              <p className="text-white/80 text-sm">
                                Multi-signature accounts with time-locked releases and milestone-based payments
                              </p>
                            </div>
                            <div className="bg-gradient-to-br from-accent-500/20 to-accent-400/20 rounded-lg p-4 border border-accent-400/30">
                              <h4 className="font-semibold text-white mb-2">Dispute Resolution</h4>
                              <p className="text-white/80 text-sm">
                                Built-in arbitration system with multi-party consensus mechanisms
                              </p>
                            </div>
                            <div className="bg-gradient-to-br from-accent-500/20 to-accent-400/20 rounded-lg p-4 border border-accent-400/30">
                              <h4 className="font-semibold text-white mb-2">Multi-Party Support</h4>
                              <p className="text-white/80 text-sm">
                                Support for complex work relationships with multiple stakeholders
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-white/5 to-white/10 rounded-xl p-6 border border-white/20">
                        <h3 className="text-2xl font-bold text-white mb-4">Implementation Architecture</h3>
                        <div className="grid md:grid-cols-3 gap-6">
                          <div className="text-center">
                            <div className="text-3xl mb-3">🔑</div>
                            <h4 className="font-semibold text-white mb-2">Key Management</h4>
                            <p className="text-white/80 text-sm">
                              Hierarchical deterministic wallets with multi-signature support
                            </p>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl mb-3">📊</div>
                            <h4 className="font-semibold text-white mb-2">State Management</h4>
                            <p className="text-white/80 text-sm">
                              React Context with real-time blockchain state synchronization
                            </p>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl mb-3">🔗</div>
                            <h4 className="font-semibold text-white mb-2">Network Integration</h4>
                            <p className="text-white/80 text-sm">
                              Horizon API integration with WebSocket for live updates
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-success-500/20 to-success-400/20 rounded-xl p-6 border border-success-400/30">
                        <h3 className="text-2xl font-bold text-white mb-4">Stellar SDK Integration</h3>
                        <div className="bg-white/5 rounded-lg p-4 border border-white/20">
                          <pre className="text-white/80 text-sm overflow-x-auto">
{`// Example: Creating a Trustless Work escrow
import { useEscrow } from '@trustless-work/react';

const EscrowComponent = () => {
  const { createEscrow, escrowState } = useEscrow();
  
  const handleCreateEscrow = async () => {
    const escrow = await createEscrow({
      amount: '1000',
      asset: 'USDC',
      milestones: [
        { amount: '300', description: 'Project Setup' },
        { amount: '400', description: 'Core Development' },
        { amount: '300', description: 'Testing & Deployment' }
      ],
      clientWallet: clientAddress,
      workerWallet: workerAddress
    });
  };
  
  return (
    <div>
      <button onClick={handleCreateEscrow}>
        Create Escrow
      </button>
      <div>Status: {escrowState.status}</div>
    </div>
  );
};`}
                          </pre>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* System Architecture */}
                  {activeSection === 'architecture' && (
                    <div className="space-y-8">
                      <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-white mb-4">🏗️ System Architecture</h2>
                        <p className="text-lg text-white/80">
                          Comprehensive overview of the Trustless Work system architecture and component relationships
                        </p>
                      </div>

                      {/* Architecture Diagram */}
                      <div className="bg-gradient-to-br from-brand-500/10 to-accent-500/10 rounded-xl p-6 border border-brand-400/30">
                        <h3 className="text-2xl font-bold text-white mb-6 text-center">📊 System Architecture Overview</h3>
                        <div className="bg-white/5 rounded-lg p-4 border border-white/20 overflow-x-auto">
                          <div className="mermaid-diagram min-w-[800px] text-sm">
                            <div className="text-center text-white/60 mb-4">
                              <p>Trustless Work System Architecture & Data Flow</p>
                              <p className="text-xs">Component relationships and integration points</p>
                            </div>
                            
                            {/* Architecture Diagram using Mermaid-like structure */}
                            <div className="architecture-diagram space-y-6">
                              {/* User Layer */}
                              <div className="text-center">
                                <div className="inline-block bg-gradient-to-r from-brand-500/30 to-accent-500/30 px-6 py-3 rounded-lg border border-brand-400/50">
                                  <div className="text-2xl mb-2">👤</div>
                                  <div className="font-semibold text-white">User Interface Layer</div>
                                  <div className="text-xs text-white/70">React Components & Hooks</div>
                                </div>
                              </div>

                              {/* State Management Layer */}
                              <div className="text-center">
                                <div className="inline-block bg-gradient-to-r from-success-500/30 to-success-400/30 px-6 py-3 rounded-lg border border-success-400/50">
                                  <div className="text-2xl mb-2">⚙️</div>
                                  <div className="font-semibold text-white">State Management Layer</div>
                                  <div className="text-xs text-white/70">React Context & Hooks</div>
                                </div>
                                <div className="grid grid-cols-3 gap-3 mt-4 max-w-2xl mx-auto">
                                  <div className="bg-white/10 px-3 py-2 rounded border border-white/20">
                                    <div className="text-xs text-white/80">Wallet Context</div>
                                    <div className="text-xs text-white/60">Stellar Integration</div>
                                  </div>
                                  <div className="bg-white/10 px-3 py-2 rounded border border-white/20">
                                    <div className="text-xs text-white/80">Escrow Context</div>
                                    <div className="text-xs text-white/60">Smart Contract State</div>
                                  </div>
                                  <div className="bg-white/10 px-3 py-2 rounded border border-white/20">
                                    <div className="text-xs text-white/80">Transaction Context</div>
                                    <div className="text-xs text-white/60">Network Operations</div>
                                  </div>
                                </div>
                              </div>

                              {/* Business Logic Layer */}
                              <div className="text-center">
                                <div className="inline-block bg-gradient-to-r from-accent-500/30 to-accent-400/30 px-6 py-3 rounded-lg border border-accent-400/50">
                                  <div className="text-2xl mb-2">🔧</div>
                                  <div className="font-semibold text-white">Business Logic Layer</div>
                                  <div className="text-xs text-white/70">Trustless Work SDK</div>
                                </div>
                                <div className="grid grid-cols-3 gap-3 mt-4 max-w-xl mx-auto">
                                  <div className="bg-white/10 px-3 py-2 rounded border border-white/20">
                                    <div className="text-xs text-white/80">Escrow Management</div>
                                    <div className="text-xs text-white/60">Contract Logic</div>
                                  </div>
                                  <div className="bg-white/10 px-3 py-2 rounded border border-white/20">
                                    <div className="text-xs text-white/80">Wallet Operations</div>
                                    <div className="text-xs text-white/60">Key Management</div>
                                  </div>
                                  <div className="bg-white/10 px-3 py-2 rounded border border-white/20">
                                    <div className="text-xs text-white/80">Transaction Handling</div>
                                    <div className="text-xs text-white/60">Network Operations</div>
                                  </div>
                                </div>
                              </div>

                              {/* Blockchain Layer */}
                              <div className="text-center">
                                <div className="inline-block bg-warning-500/30 to-warning-400/30 px-6 py-3 rounded-lg border border-warning-400/50">
                                  <div className="text-2xl mb-2">🚀</div>
                                  <div className="font-semibold text-white">Blockchain Layer</div>
                                  <div className="text-xs text-white/70">Stellar Network</div>
                                </div>
                                
                                {/* Stellar Components */}
                                <div className="grid grid-cols-2 gap-4 mt-4 max-w-lg mx-auto">
                                  <div className="bg-white/10 px-3 py-2 rounded border border-white/20">
                                    <div className="text-xs text-white/80">Horizon API</div>
                                    <div className="text-xs text-white/60">Network Interface</div>
                                  </div>
                                  <div className="bg-white/10 px-3 py-2 rounded border border-white/20">
                                    <div className="text-xs text-white/80">Stellar SDK</div>
                                    <div className="text-xs text-white/60">Core Operations</div>
                                  </div>
                                </div>

                                {/* Smart Contract Components */}
                                <div className="mt-4">
                                  <div className="text-sm text-white/70 mb-3">Smart Contract Components</div>
                                  <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
                                    <div className="bg-white/10 px-3 py-2 rounded border border-white/20">
                                      <div className="text-xs text-white/80">Multi-Signature</div>
                                      <div className="text-xs text-white/60">Escrow Accounts</div>
                                    </div>
                                    <div className="bg-white/10 px-3 py-2 rounded border border-white/20">
                                      <div className="text-xs text-white/80">Time Locks</div>
                                      <div className="text-xs text-white/60">Release Conditions</div>
                                    </div>
                                    <div className="bg-white/10 px-3 py-2 rounded border border-white/20">
                                      <div className="text-xs text-white/80">Asset Management</div>
                                      <div className="text-xs text-white/60">Token Operations</div>
                                    </div>
                                    <div className="bg-white/10 px-3 py-2 rounded border border-white/20">
                                      <div className="text-xs text-white/80">Dispute Resolution</div>
                                      <div className="text-xs text-white/60">Arbitration Logic</div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Data Flow Indicators */}
                              <div className="text-center text-white/60 text-xs">
                                <div className="flex items-center justify-center space-x-8">
                                  <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 bg-brand-400 rounded-full"></div>
                                    <span>Uses</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 bg-success-400 rounded-full"></div>
                                    <span>Manages State</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 bg-accent-400 rounded-full"></div>
                                    <span>Executes Logic</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Architecture Description */}
                      <div className="bg-gradient-to-br from-white/5 to-white/10 rounded-xl p-6 border border-white/20">
                        <h3 className="text-2xl font-bold text-white mb-4">🏛️ Architecture Overview</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold text-brand-300 mb-3">System Layers</h4>
                            <ul className="text-white/80 text-sm space-y-2">
                              <li>• <strong>UI Layer:</strong> React components with hooks and state management</li>
                              <li>• <strong>State Layer:</strong> React Context for global state synchronization</li>
                              <li>• <strong>Logic Layer:</strong> Trustless Work SDK with business logic</li>
                              <li>• <strong>Blockchain Layer:</strong> Stellar network integration and smart contracts</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold text-accent-300 mb-3">Key Integration Points</h4>
                            <ul className="text-white/80 text-sm space-y-2">
                              <li>• <strong>UI → State:</strong> Components consume context state and dispatch actions</li>
                              <li>• <strong>State → Logic:</strong> Context uses SDK hooks for business operations</li>
                              <li>• <strong>Logic → Blockchain:</strong> SDK executes Stellar operations and contract logic</li>
                              <li>• <strong>Blockchain → State:</strong> Network events update application state</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Implementation Feedback */}
                  {activeSection === 'feedback' && (
                    <div className="space-y-8">
                      <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-white mb-4">Implementation Feedback</h2>
                        <p className="text-lg text-white/80">
                          Real developer feedback from building with Trustless Work technology
                        </p>
                      </div>

                      <div className="bg-gradient-to-br from-success-500/20 to-success-400/20 rounded-xl p-6 border border-success-400/30">
                        <h3 className="text-2xl font-bold text-white mb-4">🌟 What's Working Really Well</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold text-white mb-3">Core Technology</h4>
                            <ul className="text-white/80 text-sm space-y-2">
                              <li>• Multi-release escrow system is genuinely innovative</li>
                              <li>• Stellar integration choice is smart and developer-friendly</li>
                              <li>• React hooks approach matches modern developer expectations</li>
                              <li>• TypeScript support makes development smoother</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold text-white mb-3">Business Logic</h4>
                            <ul className="text-white/80 text-sm space-y-2">
                              <li>• Milestone-based releases match real work patterns</li>
                              <li>• Built-in dispute resolution is crucial for trust</li>
                              <li>• Multi-party support enables team collaboration</li>
                              <li>• Asset flexibility supports various payment methods</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-warning-500/20 to-warning-400/20 rounded-xl p-6 border border-warning-400/30">
                        <h3 className="text-2xl font-bold text-white mb-4">🚨 Critical Issues That Need Attention</h3>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold text-white mb-2">Package Availability</h4>
                            <p className="text-white/80 text-sm mb-3">
                              The npm package `@trustless-work/react@^1.0.0` doesn't exist in the registry, 
                              making it impossible for developers to install and use the library.
                            </p>
                            <p className="text-white/70 text-xs">
                              <strong>Impact:</strong> Developers cannot build real applications with the technology
                            </p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-white mb-2">Documentation Gap</h4>
                            <p className="text-white/80 text-sm mb-3">
                              Limited documentation on how to actually use the library, with missing examples, 
                              integration guides, and troubleshooting information.
                            </p>
                            <p className="text-white/70 text-xs">
                              <strong>Impact:</strong> Developers spend more time guessing than building
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-brand-500/20 to-brand-400/20 rounded-xl p-6 border border-brand-400/30">
                        <h3 className="text-2xl font-bold text-white mb-4">💡 Improvement Suggestions</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold text-white mb-3">Developer Onboarding</h4>
                            <ul className="text-white/80 text-sm space-y-2">
                              <li>• Create comprehensive "Getting Started" guide</li>
                              <li>• Provide working examples with real code</li>
                              <li>• Consider "Quick Start" template projects</li>
                              <li>• Step-by-step integration instructions</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold text-white mb-3">Error Handling</h4>
                            <ul className="text-white/80 text-sm space-y-2">
                              <li>• Specific error codes with clear meanings</li>
                              <li>• Suggested solutions for common problems</li>
                              <li>• Debug mode with detailed logging</li>
                              <li>• Fallback options when methods fail</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="text-center">
                        <a 
                          href="/TRUSTLESS_WORK_FEEDBACK.md" 
                          target="_blank"
                          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-brand-500 to-accent-600 hover:from-brand-600 hover:to-accent-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
                        >
                          📖 Read Full Feedback Document
                        </a>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </div>
          </main>

          {/* Nexus Prime */}
          <NexusPrime currentPage="docs" />
          
          <Footer />
        </div>
      </EscrowProvider>
    </WalletProvider>
  )
}
