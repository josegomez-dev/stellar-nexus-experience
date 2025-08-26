'use client'

import { useState } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { NexusPrime } from '@/components/NexusPrime'
import { EscrowProvider } from '@/contexts/EscrowContext'
import { WalletProvider } from '@/contexts/WalletContext'
import Image from 'next/image'

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('overview')

  const sections = [
    { id: 'overview', title: 'Project Overview', icon: '🚀' },
    { id: 'technology', title: 'Technology Stack', icon: '⚡' },
    { id: 'architecture', title: 'System Architecture', icon: '🏗️' },
    { id: 'demos', title: 'Demo Suite', icon: '🧪' },
    { id: 'benefits', title: 'Benefits & Use Cases', icon: '💡' },
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
                      width={80} 
                      height={80}
                      className="w-20 h-20"
                    />
                  </div>
                  <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-accent-400 mb-6">
                    Trustless Work Documentation
                  </h1>
                  <p className="text-xl text-white/80 max-w-3xl mx-auto">
                    A comprehensive guide to building decentralized work platforms on the Stellar blockchain
                  </p>
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
                  
                  {/* Project Overview */}
                  {activeSection === 'overview' && (
                    <div className="space-y-8">
                      <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-white mb-4">Project Overview</h2>
                        <p className="text-lg text-white/80">
                          Trustless Work is a revolutionary platform that enables decentralized work management 
                          through smart contract-powered escrow systems on the Stellar blockchain.
                        </p>
                      </div>

                      <div className="grid md:grid-cols-3 gap-6">
                        <div className="text-center p-6 bg-gradient-to-br from-brand-500/20 to-brand-400/20 rounded-xl border border-brand-400/30">
                          <div className="text-4xl mb-4">🔐</div>
                          <h3 className="text-xl font-semibold text-white mb-3">Trustless Escrow</h3>
                          <p className="text-white/80">
                            Automated fund management with no third-party intermediaries required
                          </p>
                        </div>
                        <div className="text-center p-6 bg-gradient-to-br from-success-500/20 to-success-400/20 rounded-xl border border-success-400/30">
                          <div className="text-4xl mb-4">⚡</div>
                          <h3 className="text-xl font-semibold text-white mb-3">Stellar Powered</h3>
                          <p className="text-white/80">
                            Built on Stellar's fast, low-cost, and environmentally friendly blockchain
                          </p>
                        </div>
                        <div className="text-center p-6 bg-gradient-to-br from-accent-500/20 to-accent-400/20 rounded-xl border border-accent-400/30">
                          <div className="text-4xl mb-4">🌐</div>
                          <h3 className="text-xl font-semibold text-white mb-3">Developer First</h3>
                          <p className="text-white/80">
                            Comprehensive SDK and tools for building decentralized work applications
                          </p>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-white/5 to-white/10 rounded-xl p-6 border border-white/20">
                        <h3 className="text-2xl font-bold text-white mb-4">What is Trustless Work?</h3>
                        <p className="text-white/80 leading-relaxed mb-4">
                          Trustless Work eliminates the need for traditional intermediaries in work relationships 
                          by using smart contracts to automatically manage payments, milestone tracking, and 
                          dispute resolution. This creates a more efficient, transparent, and fair system for 
                          both workers and clients.
                        </p>
                        <p className="text-white/80 leading-relaxed">
                          By leveraging the Stellar blockchain, the platform provides instant settlements, 
                          minimal transaction costs, and global accessibility while maintaining the security 
                          and transparency that blockchain technology offers.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Technology Stack */}
                  {activeSection === 'technology' && (
                    <div className="space-y-8">
                      <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-white mb-4">Technology Stack</h2>
                        <p className="text-lg text-white/80">
                          Built with modern, scalable technologies for optimal performance and developer experience
                        </p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                          <h3 className="text-2xl font-bold text-brand-300">Blockchain Layer</h3>
                          <div className="space-y-4">
                            <div className="bg-gradient-to-br from-brand-500/20 to-brand-400/20 rounded-lg p-4 border border-brand-400/30">
                              <h4 className="font-semibold text-white mb-2">Stellar Network</h4>
                              <p className="text-white/80 text-sm">
                                Fast, low-cost transactions with built-in asset support and smart contract capabilities
                              </p>
                            </div>
                            <div className="bg-gradient-to-br from-brand-500/20 to-brand-400/20 rounded-lg p-4 border border-brand-400/30">
                              <h4 className="font-semibold text-white mb-2">Smart Contracts</h4>
                              <p className="text-white/80 text-sm">
                                Automated escrow management, milestone tracking, and dispute resolution
                              </p>
                            </div>
                            <div className="bg-gradient-to-br from-brand-500/20 to-brand-400/20 rounded-lg p-4 border border-brand-400/30">
                              <h4 className="font-semibold text-white mb-2">Multi-Asset Support</h4>
                              <p className="text-white/80 text-sm">
                                Native support for various Stellar assets including USDC, XLM, and custom tokens
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-6">
                          <h3 className="text-2xl font-bold text-accent-300">Application Layer</h3>
                          <div className="space-y-4">
                            <div className="bg-gradient-to-br from-accent-500/20 to-accent-400/20 rounded-lg p-4 border border-accent-400/30">
                              <h4 className="font-semibold text-white mb-2">React SDK</h4>
                              <p className="text-white/80 text-sm">
                                Comprehensive hooks and components for building decentralized work applications
                              </p>
                            </div>
                            <div className="bg-gradient-to-br from-accent-500/20 to-accent-400/20 rounded-lg p-4 border border-accent-400/30">
                              <h4 className="font-semibold text-white mb-2">TypeScript</h4>
                              <p className="text-white/80 text-sm">
                                Full type safety and excellent developer experience with comprehensive interfaces
                              </p>
                            </div>
                            <div className="bg-gradient-to-br from-accent-500/20 to-accent-400/20 rounded-lg p-4 border border-accent-400/30">
                              <h4 className="font-semibold text-white mb-2">Wallet Integration</h4>
                              <p className="text-white/80 text-sm">
                                Seamless integration with popular Stellar wallets and browser extensions
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-white/5 to-white/10 rounded-xl p-6 border border-white/20">
                        <h3 className="text-2xl font-bold text-white mb-4">Architecture Benefits</h3>
                        <ul className="text-white/80 space-y-2">
                          <li>• <strong>Scalability:</strong> Stellar's high-throughput network handles thousands of transactions per second</li>
                          <li>• <strong>Cost Efficiency:</strong> Minimal transaction fees (0.00001 XLM per operation)</li>
                          <li>• <strong>Global Access:</strong> Borderless transactions with instant settlement</li>
                          <li>• <strong>Security:</strong> Cryptographic security with no single point of failure</li>
                          <li>• <strong>Interoperability:</strong> Easy integration with existing financial systems</li>
                        </ul>
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
                        <h3 className="text-2xl font-bold text-white mb-6 text-center">📊 Interactive Architecture Diagram</h3>
                        <div className="bg-white/5 rounded-lg p-4 border border-white/20 overflow-x-auto">
                          <div className="mermaid-diagram min-w-[800px] text-sm">
                            <div className="text-center text-white/60 mb-4">
                              <p>System Component Relationships & Data Flow</p>
                              <p className="text-xs">Hover over components to see relationships</p>
                            </div>
                            
                            {/* Architecture Diagram using Mermaid-like structure */}
                            <div className="architecture-diagram space-y-6">
                              {/* User Layer */}
                              <div className="text-center">
                                <div className="inline-block bg-gradient-to-r from-brand-500/30 to-accent-500/30 px-6 py-3 rounded-lg border border-brand-400/50">
                                  <div className="text-2xl mb-2">👤</div>
                                  <div className="font-semibold text-white">User (External Actor)</div>
                                  <div className="text-xs text-white/70">Interacts with the system</div>
                                </div>
                              </div>

                              {/* Build and Configuration System */}
                              <div className="text-center">
                                <div className="inline-block bg-gradient-to-r from-success-500/30 to-success-400/30 px-6 py-3 rounded-lg border border-success-400/50">
                                  <div className="text-2xl mb-2">⚙️</div>
                                  <div className="font-semibold text-white">Build & Configuration System</div>
                                  <div className="text-xs text-white/70">Various Technologies</div>
                                </div>
                                <div className="grid grid-cols-4 gap-3 mt-4 max-w-2xl mx-auto">
                                  <div className="bg-white/10 px-3 py-2 rounded border border-white/20">
                                    <div className="text-xs text-white/80">Project Config</div>
                                    <div className="text-xs text-white/60">NPM/JSON</div>
                                  </div>
                                  <div className="bg-white/10 px-3 py-2 rounded border border-white/20">
                                    <div className="text-xs text-white/80">Next.js Config</div>
                                    <div className="text-xs text-white/60">Next.js/TS</div>
                                  </div>
                                  <div className="bg-white/10 px-3 py-2 rounded border border-white/20">
                                    <div className="text-xs text-white/80">Styling Config</div>
                                    <div className="text-xs text-white/60">Tailwind/PostCSS</div>
                                  </div>
                                  <div className="bg-white/10 px-3 py-2 rounded border border-white/20">
                                    <div className="text-xs text-white/80">TypeScript Config</div>
                                    <div className="text-xs text-white/60">TypeScript</div>
                                  </div>
                                </div>
                              </div>

                              {/* Core Logic and Utilities */}
                              <div className="text-center">
                                <div className="inline-block bg-gradient-to-r from-accent-500/30 to-accent-400/30 px-6 py-3 rounded-lg border border-accent-400/50">
                                  <div className="text-2xl mb-2">🔧</div>
                                  <div className="font-semibold text-white">Core Logic & Utilities System</div>
                                  <div className="text-xs text-white/70">TypeScript</div>
                                </div>
                                <div className="grid grid-cols-3 gap-3 mt-4 max-w-xl mx-auto">
                                  <div className="bg-white/10 px-3 py-2 rounded border border-white/20">
                                    <div className="text-xs text-white/80">Stellar Wallet</div>
                                    <div className="text-xs text-white/60">Stellar SDK</div>
                                  </div>
                                  <div className="bg-white/10 px-3 py-2 rounded border border-white/20">
                                    <div className="text-xs text-white/80">Mock Data & Contracts</div>
                                    <div className="text-xs text-white/60">TypeScript</div>
                                  </div>
                                  <div className="bg-white/10 px-3 py-2 rounded border border-white/20">
                                    <div className="text-xs text-white/80">Type Definitions</div>
                                    <div className="text-xs text-white/60">TypeScript</div>
                                  </div>
                                </div>
                              </div>

                              {/* Frontend Application System */}
                              <div className="text-center">
                                <div className="inline-block bg-gradient-to-r from-warning-500/30 to-warning-400/30 px-6 py-3 rounded-lg border border-warning-400/50">
                                  <div className="text-2xl mb-2">🚀</div>
                                  <div className="font-semibold text-white">Frontend Application System</div>
                                  <div className="text-xs text-white/70">Next.js</div>
                                </div>
                                
                                {/* Page Routing & State Management */}
                                <div className="grid grid-cols-2 gap-4 mt-4 max-w-lg mx-auto">
                                  <div className="bg-white/10 px-3 py-2 rounded border border-white/20">
                                    <div className="text-xs text-white/80">Page Routing & Layout</div>
                                    <div className="text-xs text-white/60">Next.js</div>
                                  </div>
                                  <div className="bg-white/10 px-3 py-2 rounded border border-white/20">
                                    <div className="text-xs text-white/80">State Management</div>
                                    <div className="text-xs text-white/60">React Context</div>
                                  </div>
                                </div>

                                {/* UI Components */}
                                <div className="mt-4">
                                  <div className="text-sm text-white/70 mb-3">UI Components (React)</div>
                                  <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
                                    <div className="bg-white/10 px-3 py-2 rounded border border-white/20">
                                      <div className="text-xs text-white/80">Wallet Integration</div>
                                      <div className="text-xs text-white/60">React</div>
                                    </div>
                                    <div className="bg-white/10 px-3 py-2 rounded border border-white/20">
                                      <div className="text-xs text-white/80">Dispute Resolution</div>
                                      <div className="text-xs text-white/60">React</div>
                                    </div>
                                    <div className="bg-white/10 px-3 py-2 rounded border border-white/20">
                                      <div className="text-xs text-white/80">Escrow Lifecycle</div>
                                      <div className="text-xs text-white/60">React</div>
                                    </div>
                                    <div className="bg-white/10 px-3 py-2 rounded border border-white/20">
                                      <div className="text-xs text-white/80">Milestone Management</div>
                                      <div className="text-xs text-white/60">React</div>
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
                                    <span>Configured by</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 bg-accent-400 rounded-full"></div>
                                    <span>Consumes state from</span>
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
                              <li>• <strong>User Layer:</strong> External actors interacting with the system</li>
                              <li>• <strong>Configuration Layer:</strong> Build tools and project setup</li>
                              <li>• <strong>Core Logic Layer:</strong> Business logic and utilities</li>
                              <li>• <strong>Frontend Layer:</strong> User interface and state management</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold text-accent-300 mb-3">Key Relationships</h4>
                            <ul className="text-white/80 text-sm space-y-2">
                              <li>• <strong>Frontend → Core Logic:</strong> Uses wallet integration and contract interactions</li>
                              <li>• <strong>Core Logic → Configuration:</strong> Configured by build and project settings</li>
                              <li>• <strong>State Management → Core Logic:</strong> Consumes data from utility systems</li>
                              <li>• <strong>Components → State:</strong> React components consume context state</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Demo Suite */}
                  {activeSection === 'demos' && (
                    <div className="space-y-8">
                      <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-white mb-4">Interactive Demo Suite</h2>
                        <p className="text-lg text-white/80">
                          Experience the full capabilities of Trustless Work through our comprehensive demo applications
                        </p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-gradient-to-br from-success-500/20 to-success-400/20 rounded-xl p-6 border border-success-400/30">
                          <h3 className="text-xl font-semibold text-white mb-3">🍼 Baby Steps to Riches</h3>
                          <p className="text-white/80 mb-4">
                            Learn the fundamentals of trustless escrow with automatic milestone completion.
                          </p>
                          <ul className="text-white/70 text-sm space-y-1">
                            <li>• Escrow initialization and funding</li>
                            <li>• Milestone completion and approval</li>
                            <li>• Automatic fund release</li>
                          </ul>
                        </div>

                        <div className="bg-gradient-to-br from-success-500/20 to-success-400/20 rounded-xl p-6 border border-success-400/30">
                          <h3 className="text-xl font-semibold text-white mb-3">🗳️ Democracy in Action</h3>
                          <p className="text-white/80 mb-4">
                            Multi-stakeholder approval system for complex projects requiring multiple sign-offs.
                          </p>
                          <ul className="text-white/70 text-sm space-y-1">
                            <li>• Multi-party milestone approval</li>
                            <li>• Consensus-based decision making</li>
                            <li>• Transparent voting process</li>
                          </ul>
                        </div>

                        <div className="bg-gradient-to-br from-warning-500/20 to-warning-400/20 rounded-xl p-6 border border-warning-400/30">
                          <h3 className="text-xl font-semibold text-white mb-3">👑 Drama Queen Escrow</h3>
                          <p className="text-white/80 mb-4">
                            Full dispute resolution workflow with evidence presentation and arbitration.
                          </p>
                          <ul className="text-white/70 text-sm space-y-1">
                            <li>• Dispute initiation and evidence</li>
                            <li>• Arbitrator selection and review</li>
                            <li>• Fair resolution outcomes</li>
                          </ul>
                        </div>

                        <div className="bg-gradient-to-br from-accent-500/20 to-accent-400/20 rounded-xl p-6 border border-accent-400/30">
                          <h3 className="text-xl font-semibold text-white mb-3">🛒 Gig Economy Madness</h3>
                          <p className="text-white/80 mb-4">
                            Micro-task marketplace with built-in escrow protection for both clients and workers.
                          </p>
                          <ul className="text-white/70 text-sm space-y-1">
                            <li>• Task posting and browsing</li>
                            <li>• Micro-work management</li>
                            <li>• Built-in escrow protection</li>
                          </ul>
                        </div>
                      </div>

                      <div className="text-center">
                        <a 
                          href="/demos" 
                          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-brand-500 to-accent-600 hover:from-brand-600 hover:to-accent-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                        >
                          🧪 Try the Demos
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Benefits & Use Cases */}
                  {activeSection === 'benefits' && (
                    <div className="space-y-8">
                      <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-white mb-4">Benefits & Use Cases</h2>
                        <p className="text-lg text-white/80">
                          Discover how Trustless Work can transform various industries and work relationships
                        </p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                          <h3 className="text-2xl font-bold text-brand-300">For Workers</h3>
                          <div className="space-y-4">
                            <div className="bg-gradient-to-br from-brand-500/20 to-brand-400/20 rounded-lg p-4 border border-brand-400/30">
                              <h4 className="font-semibold text-white mb-2">Guaranteed Payment</h4>
                              <p className="text-white/80 text-sm">
                                Funds are locked in escrow and automatically released upon milestone completion
                              </p>
                            </div>
                            <div className="bg-gradient-to-br from-brand-500/20 to-brand-400/20 rounded-lg p-4 border border-brand-400/30">
                              <h4 className="font-semibold text-white mb-2">Transparent Process</h4>
                              <p className="text-white/80 text-sm">
                                Clear milestone requirements and payment schedules visible on the blockchain
                              </p>
                            </div>
                            <div className="bg-gradient-to-br from-brand-500/20 to-brand-400/20 rounded-lg p-4 border border-brand-400/30">
                              <h4 className="font-semibold text-white mb-2">Global Opportunities</h4>
                              <p className="text-white/80 text-sm">
                                Access to international clients without currency conversion or banking barriers
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-6">
                          <h3 className="text-2xl font-bold text-accent-300">For Clients</h3>
                          <div className="space-y-4">
                            <div className="bg-gradient-to-br from-accent-500/20 to-accent-400/20 rounded-lg p-4 border border-accent-400/30">
                              <h4 className="font-semibold text-white mb-2">Quality Assurance</h4>
                              <p className="text-white/80 text-sm">
                                Milestone-based payments ensure work meets requirements before funds are released
                              </p>
                            </div>
                            <div className="bg-gradient-to-br from-accent-500/20 to-accent-400/20 rounded-lg p-4 border border-accent-400/30">
                              <h4 className="font-semibold text-white mb-2">Cost Control</h4>
                              <p className="text-white/80 text-sm">
                                Predictable payment schedules and no hidden fees or intermediary costs
                              </p>
                            </div>
                            <div className="bg-gradient-to-br from-accent-500/20 to-accent-400/20 rounded-lg p-4 border border-accent-400/30">
                              <h4 className="font-semibold text-white mb-2">Dispute Resolution</h4>
                              <p className="text-white/80 text-sm">
                                Built-in arbitration system for fair conflict resolution when issues arise
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-white/5 to-white/10 rounded-xl p-6 border border-white/20">
                        <h3 className="text-2xl font-bold text-white mb-4">Industry Applications</h3>
                        <div className="grid md:grid-cols-3 gap-6">
                          <div className="text-center">
                            <div className="text-3xl mb-3">💻</div>
                            <h4 className="font-semibold text-white mb-2">Software Development</h4>
                            <p className="text-white/80 text-sm">
                              Milestone-based payments for development projects, bug fixes, and maintenance
                            </p>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl mb-3">🎨</div>
                            <h4 className="font-semibold text-white mb-2">Creative Services</h4>
                            <p className="text-white/80 text-sm">
                              Design projects, content creation, and creative work with clear deliverables
                            </p>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl mb-3">📊</div>
                            <h4 className="font-semibold text-white mb-2">Consulting</h4>
                            <p className="text-white/80 text-sm">
                              Professional services, research, and advisory work with structured outcomes
                            </p>
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
                            <h4 className="font-semibold text-white mb-3">Core Concept</h4>
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
