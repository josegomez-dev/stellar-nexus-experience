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
    { id: 'overview', title: 'Project Overview', icon: '🚀' },
    { id: 'technology', title: 'Technology Stack', icon: '⚡' },
    { id: 'architecture', title: 'System Architecture', icon: '🏗️' },
    { id: 'benefits', title: 'Benefits & Use Cases', icon: '💡' },
    { id: 'repository', title: 'Repository & Code', icon: '📦' },
    { id: 'feedback', title: 'Implementation Feedback', icon: '📝' },
    { id: 'tasks', title: 'Task List & Updates', icon: '📋' }
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
                        <div className="absolute bottom-0 left-1/2 w-20 h-1 bg-gradient-to-r from-transparent via-accent-400/50 to-transparent animate-pulse opacity-65" style={{ animationDuration: '2.8s' }}></div>
                      </div>
                    </div>
                    
                    {/* Title with Enhanced Styling */}
                    <h1 className="relative z-10 text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-accent-400 to-brand-400 mb-6 drop-shadow-2xl" style={{ zIndex: 1000, marginTop: '-200px' }}>
                      Trustless Work Documentation
                    </h1>
                  </div>

                  <br />
                  <br />
                  
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

                  {/* Repository & Code */}
                  {activeSection === 'repository' && (
                    <div className="space-y-8">
                      <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-white mb-4">📦 Repository & Code</h2>
                        <p className="text-lg text-white/80">
                          Access the source code, contribute to development, and explore the project structure
                        </p>
                      </div>

                      {/* Repository Overview */}
                      <div className="bg-gradient-to-br from-brand-500/20 to-brand-400/20 rounded-xl p-6 border border-brand-400/30">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="text-2xl font-bold text-white">🚀 STELLAR NEXUS | ESCROW ARSENAL</h3>
                          <a 
                            href="https://github.com/josegomez-dev/trustless-poc" 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-6 py-3 bg-gradient-to-r from-brand-500 to-accent-600 hover:from-brand-600 hover:to-accent-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
                          >
                            <span>📦</span>
                            <span>View on GitHub</span>
                          </a>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold text-brand-300 mb-3">Repository Details</h4>
                            <ul className="text-white/80 text-sm space-y-2">
                              <li>• <strong>Name:</strong> trustless-poc</li>
                              <li>• <strong>Type:</strong> Proof of Concept</li>
                              <li>• <strong>Platform:</strong> Stellar Blockchain</li>
                              <li>• <strong>Language:</strong> TypeScript/React</li>
                              <li>• <strong>License:</strong> MIT</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold text-accent-300 mb-3">Quick Stats</h4>
                            <ul className="text-white/80 text-sm space-y-2">
                              <li>• <strong>Framework:</strong> Next.js 14</li>
                              <li>• <strong>Styling:</strong> Tailwind CSS</li>
                              <li>• <strong>State:</strong> React Context</li>
                              <li>• <strong>Wallet:</strong> Stellar SDK</li>
                              <li>• <strong>Deployment:</strong> Vercel</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Project Structure */}
                      <div className="bg-gradient-to-br from-accent-500/20 to-accent-400/20 rounded-xl p-6 border border-accent-400/30">
                        <h3 className="text-2xl font-bold text-white mb-6">🏗️ Project Structure</h3>
                        <div className="bg-white/5 rounded-lg p-4 border border-white/20 overflow-x-auto">
                          <div className="text-sm font-mono text-white/80 min-w-[600px]">
                            <div className="grid grid-cols-1 gap-1">
                              <div className="flex items-center space-x-2">
                                <span className="text-accent-400">📁</span>
                                <span className="text-white">trustless-poc/</span>
                              </div>
                              <div className="flex items-center space-x-2 ml-4">
                                <span className="text-accent-400">📁</span>
                                <span className="text-white">app/</span>
                                <span className="text-white/60"># Next.js app router</span>
                              </div>
                              <div className="flex items-center space-x-2 ml-8">
                                <span className="text-accent-400">📄</span>
                                <span className="text-white">page.tsx</span>
                                <span className="text-white/60"># Home page</span>
                              </div>
                              <div className="flex items-center space-x-2 ml-8">
                                <span className="text-accent-400">📄</span>
                                <span className="text-white">demos/page.tsx</span>
                                <span className="text-white/60"># Demo suite</span>
                              </div>
                              <div className="flex items-center space-x-2 ml-8">
                                <span className="text-accent-400">📄</span>
                                <span className="text-white">developer-portal/page.tsx</span>
                                <span className="text-white/60"># Developer portal</span>
                              </div>
                              <div className="flex items-center space-x-2 ml-8">
                                <span className="text-accent-400">📄</span>
                                <span className="text-white">admin/page.tsx</span>
                                <span className="text-white/60"># Admin dashboard</span>
                              </div>
                              <div className="flex items-center space-x-2 ml-4">
                                <span className="text-accent-400">📁</span>
                                <span className="text-white">components/</span>
                                <span className="text-white/60"># React components</span>
                              </div>
                              <div className="flex items-center space-x-2 ml-8">
                                <span className="text-accent-400">📁</span>
                                <span className="text-white">demos/</span>
                                <span className="text-white/60"># Demo components</span>
                              </div>
                              <div className="flex items-center space-x-2 ml-8">
                                <span className="text-accent-400">📁</span>
                                <span className="text-white">developer/</span>
                                <span className="text-white/60"># Developer portal</span>
                              </div>
                              <div className="flex items-center space-x-2 ml-8">
                                <span className="text-accent-400">📁</span>
                                <span className="text-white">admin/</span>
                                <span className="text-white/60"># Admin components</span>
                              </div>
                              <div className="flex items-center space-x-2 ml-8">
                                <span className="text-accent-400">📁</span>
                                <span className="text-white">layout/</span>
                                <span className="text-white/60"># Layout components</span>
                              </div>
                              <div className="flex items-center space-x-2 ml-8">
                                <span className="text-accent-400">📁</span>
                                <span className="text-white">ui/</span>
                                <span className="text-white/60"># UI components</span>
                              </div>
                              <div className="flex items-center space-x-2 ml-4">
                                <span className="text-accent-400">📁</span>
                                <span className="text-white">contexts/</span>
                                <span className="text-white/60"># React contexts</span>
                              </div>
                              <div className="flex items-center space-x-2 ml-4">
                                <span className="text-accent-400">📁</span>
                                <span className="text-white">lib/</span>
                                <span className="text-white/60"># Utility functions</span>
                              </div>
                              <div className="flex items-center space-x-2 ml-4">
                                <span className="text-accent-400">📁</span>
                                <span className="text-white">types/</span>
                                <span className="text-white/60"># TypeScript types</span>
                              </div>
                              <div className="flex items-center space-x-2 ml-4">
                                <span className="text-accent-400">📁</span>
                                <span className="text-white">public/</span>
                                <span className="text-white/60"># Static assets</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* README Content */}
                      <div className="bg-gradient-to-br from-success-500/20 to-success-400/20 rounded-xl p-6 border border-success-400/30">
                        <h3 className="text-2xl font-bold text-white mb-6">📖 README.md</h3>
                        <div className="bg-white/5 rounded-lg p-4 border border-white/20 max-h-96 overflow-y-auto">
                          <div className="prose prose-invert max-w-none">
                            <div className="text-white/90 text-sm leading-relaxed space-y-4">
                              <h4 className="text-xl font-bold text-white mb-3">🚀 STELLAR NEXUS | ESCROW ARSENAL</h4>
                              <p>
                                A <strong>revolutionary proof-of-concept</strong> application demonstrating the future of Trustless Work escrow management on the Stellar blockchain. This POC features a comprehensive demo suite, real Freighter wallet integration, interactive AI tutorials, and a modern, responsive interface with global state management.
                              </p>
                              
                              <h5 className="text-lg font-semibold text-white mb-2">🌟 What This POC Demonstrates</h5>
                              <ul className="list-disc list-inside space-y-1 ml-4">
                                <li><strong>🔐 Real Wallet Integration:</strong> Connect Freighter wallet or enter any Stellar wallet address</li>
                                <li><strong>🧪 Interactive Demo Suite:</strong> 4 comprehensive demos showcasing different escrow scenarios</li>
                                <li><strong>🤖 AI Guardian Tutorial:</strong> NEXUS PRIME AI assistant with voice-guided tutorials</li>
                                <li><strong>⭐ Stellar Integration:</strong> Built on the Stellar blockchain for fast, low-cost transactions</li>
                                <li><strong>🌐 Global State Management:</strong> Shared wallet state across all components</li>
                                <li><strong>🎨 Modern UI:</strong> Beautiful gradient design with glassmorphism effects and smooth animations</li>
                                <li><strong>📱 Responsive Design:</strong> Works seamlessly on desktop and mobile devices</li>
                                <li><strong>⚡ Real-Time Updates:</strong> Live wallet state synchronization across the entire application</li>
                                <li><strong>🎭 Epic Visual Effects:</strong> Legendary animations and professional branding</li>
                              </ul>

                              <h5 className="text-lg font-semibold text-white mb-2">🎯 Use Cases</h5>
                              <ul className="list-disc list-inside space-y-1 ml-4">
                                <li><strong>Developers:</strong> Test Stellar wallet integration and blockchain functionality</li>
                                <li><strong>Users:</strong> Experience Trustless Work escrow management concepts through interactive demos</li>
                                <li><strong>Businesses:</strong> Explore decentralized work and payment solutions</li>
                                <li><strong>Educators:</strong> Demonstrate blockchain technology in action with hands-on examples</li>
                                <li><strong>Researchers:</strong> Study different escrow models and consensus mechanisms</li>
                              </ul>

                              <h5 className="text-lg font-semibold text-white mb-2">🚀 Key Features</h5>
                              <h6 className="text-md font-semibold text-white mb-1">🤖 AI Guardian - NEXUS PRIME</h6>
                              <ul className="list-disc list-inside space-y-1 ml-4">
                                <li><strong>Interactive Tutorials:</strong> Step-by-step guidance through the ESCROW ARSENAL</li>
                                <li><strong>Voice Navigation:</strong> AI voice reads tutorial content with male voice</li>
                                <li><strong>Smart Assistance:</strong> Context-aware help based on current demo and wallet status</li>
                                <li><strong>Floating Magic Button:</strong> Always-accessible AI guardian with epic animations</li>
                              </ul>

                              <h6 className="text-md font-semibold text-white mb-1">🎭 Epic Visual Experience</h6>
                              <ul className="list-disc list-inside space-y-1 ml-4">
                                <li><strong>Legendary Animations:</strong> Professional-grade animations and transitions</li>
                                <li><strong>Gradient Mastery:</strong> Beautiful color schemes and glassmorphism effects</li>
                                <li><strong>Responsive Design:</strong> Seamless experience across all devices</li>
                                <li><strong>Professional Branding:</strong> STELLAR NEXUS logo integration throughout</li>
                              </ul>

                              <h6 className="text-md font-semibold text-white mb-1">🔐 Advanced Wallet Management</h6>
                              <ul className="list-disc list-inside space-y-1 ml-4">
                                <li><strong>Freighter Integration:</strong> Native support for popular Stellar wallet</li>
                                <li><strong>Manual Address Input:</strong> Support for any Stellar wallet address</li>
                                <li><strong>Real-time Status:</strong> Live wallet connection status with smooth transitions</li>
                                <li><strong>Network Detection:</strong> Automatic Stellar network detection and switching</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Getting Started */}
                      <div className="bg-gradient-to-br from-warning-500/20 to-warning-400/20 rounded-xl p-6 border border-warning-400/30">
                        <h3 className="text-2xl font-bold text-white mb-6">🚀 Getting Started</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold text-warning-300 mb-3">For Developers</h4>
                            <div className="bg-white/5 rounded-lg p-4 border border-white/20">
                              <pre className="text-white/80 text-sm overflow-x-auto">
{`# Clone the repository
git clone https://github.com/josegomez-dev/trustless-poc.git
cd trustless-poc

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build`}
                              </pre>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold text-warning-300 mb-3">For Users</h4>
                            <div className="space-y-3">
                              <div className="bg-white/5 rounded-lg p-4 border border-white/20">
                                <h5 className="font-semibold text-white mb-2">1. Connect Wallet</h5>
                                <p className="text-white/80 text-sm">Use Freighter wallet or enter any Stellar address</p>
                              </div>
                              <div className="bg-white/5 rounded-lg p-4 border border-white/20">
                                <h5 className="font-semibold text-white mb-2">2. Explore Demos</h5>
                                <p className="text-white/80 text-sm">Try the interactive escrow demos to learn</p>
                              </div>
                              <div className="bg-white/5 rounded-lg p-4 border border-white/20">
                                <h5 className="font-semibold text-white mb-2">3. Use AI Assistant</h5>
                                <p className="text-white/80 text-sm">Get help from NEXUS PRIME AI guardian</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Contributing */}
                      <div className="bg-gradient-to-br from-info-500/20 to-info-400/20 rounded-xl p-6 border border-info-400/30">
                        <h3 className="text-2xl font-bold text-white mb-6">🤝 Contributing</h3>
                        <p className="text-white/80 mb-4">
                          We welcome contributions from the community! Whether you're a developer, designer, or blockchain enthusiast, 
                          there are many ways to help improve Trustless Work.
                        </p>
                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="text-center">
                            <div className="text-3xl mb-3">🐛</div>
                            <h4 className="font-semibold text-white mb-2">Report Issues</h4>
                            <p className="text-white/80 text-sm">Help us identify bugs and improve the platform</p>
                          </div>
                          <div className="text-center">
                            <div className="text-4xl mb-3">💡</div>
                            <h4 className="font-semibold text-white mb-2">Suggest Features</h4>
                            <p className="text-white/80 text-sm">Share your ideas for new functionality</p>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl mb-3">🔧</div>
                            <h4 className="font-semibold text-white mb-2">Submit Code</h4>
                            <p className="text-white/80 text-sm">Contribute improvements and new features</p>
                          </div>
                        </div>
                        <div className="text-center mt-6">
                          <a 
                            href="https://github.com/josegomez-dev/trustless-poc/issues" 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-info-500 to-info-600 hover:from-info-600 hover:to-info-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
                          >
                            📋 View Issues on GitHub
                          </a>
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

                  {/* Task List & Updates */}
                  {activeSection === 'tasks' && (
                    <div className="space-y-8">
                      <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-white mb-4">📋 Task List & Latest Updates</h2>
                        <p className="text-lg text-white/80">
                          Organized list of pending tasks and recent project updates
                        </p>
                      </div>

                      {/* Critical Priority Tasks */}
                      <div className="bg-gradient-to-br from-red-500/20 to-red-400/20 rounded-xl p-6 border border-red-400/30">
                        <h3 className="text-2xl font-bold text-white mb-4">🚨 Critical Priority - Blocking Development</h3>
                        <div className="space-y-4">
                          <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-white">Publish NPM Package</h4>
                              <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">BLOCKER</span>
                            </div>
                            <p className="text-white/80 text-sm mb-3">
                              The npm package `@trustless-work/react@^1.0.0` doesn't exist in the registry
                            </p>
                            <div className="flex items-center space-x-4 text-xs text-white/70">
                              <span>📅 Due: ASAP</span>
                              <span>👤 Owner: Core Team</span>
                              <span>🏷️ Type: Infrastructure</span>
                            </div>
                          </div>
                          
                          <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-white">Create Installation Guide</h4>
                              <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">BLOCKER</span>
                            </div>
                            <p className="text-white/80 text-sm mb-3">
                              Developers need clear instructions on how to install and set up the library
                            </p>
                            <div className="flex items-center space-x-4 text-xs text-white/70">
                              <span>📅 Due: After NPM publish</span>
                              <span>👤 Owner: Documentation Team</span>
                              <span>🏷️ Type: Documentation</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* High Priority Tasks */}
                      <div className="bg-gradient-to-br from-orange-500/20 to-orange-400/20 rounded-xl p-6 border border-orange-400/30">
                        <h3 className="text-2xl font-bold text-white mb-4">🔥 High Priority - Developer Experience</h3>
                        <div className="space-y-4">
                          <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-white">Comprehensive Getting Started Guide</h4>
                              <span className="px-2 py-1 bg-orange-500 text-white text-xs rounded-full">HIGH</span>
                            </div>
                            <p className="text-white/80 text-sm mb-3">
                              Step-by-step integration guide with real code examples
                            </p>
                            <div className="flex items-center space-x-4 text-xs text-white/70">
                              <span>📅 Due: Week 1</span>
                              <span>👤 Owner: Documentation Team</span>
                              <span>🏷️ Type: Documentation</span>
                            </div>
                          </div>
                          
                          <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-white">Error Handling Documentation</h4>
                              <span className="px-2 py-1 bg-orange-500 text-white text-xs rounded-full">HIGH</span>
                            </div>
                            <p className="text-white/80 text-sm mb-3">
                              Specific error codes, solutions, and troubleshooting guides
                            </p>
                            <div className="flex items-center space-x-4 text-xs text-white/70">
                              <span>📅 Due: Week 1</span>
                              <span>👤 Owner: Core Team</span>
                              <span>🏷️ Type: Documentation</span>
                            </div>
                          </div>
                          
                          <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-white">Quick Start Template</h4>
                              <span className="px-2 py-1 bg-orange-500 text-white text-xs rounded-full">HIGH</span>
                            </div>
                            <p className="text-white/80 text-sm mb-3">
                              Pre-configured Next.js/React project template for developers
                            </p>
                            <div className="flex items-center space-x-4 text-xs text-white/70">
                              <span>📅 Due: Week 2</span>
                              <span>👤 Owner: Developer Relations</span>
                              <span>🏷️ Type: Developer Tools</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Medium Priority Tasks */}
                      <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-400/20 rounded-xl p-6 border border-yellow-400/30">
                        <h3 className="text-2xl font-bold text-white mb-4">⚡ Medium Priority - Enhancement</h3>
                        <div className="space-y-4">
                          <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-white">Wallet Integration Examples</h4>
                              <span className="px-2 py-1 bg-yellow-500 text-white text-xs rounded-full">MEDIUM</span>
                            </div>
                            <p className="text-white/80 text-sm mb-3">
                              Multiple wallet integration examples and fallback mechanisms
                            </p>
                            <div className="flex items-center space-x-4 text-xs text-white/70">
                              <span>📅 Due: Week 3</span>
                              <span>👤 Owner: Core Team</span>
                              <span>🏷️ Type: Examples</span>
                            </div>
                          </div>
                          
                          <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-white">API Reference Documentation</h4>
                              <span className="px-2 py-1 bg-yellow-500 text-white text-xs rounded-full">MEDIUM</span>
                            </div>
                            <p className="text-white/80 text-sm mb-3">
                              Complete API reference with all hooks, parameters, and return types
                            </p>
                            <div className="flex items-center space-x-4 text-xs text-white/70">
                              <span>📅 Due: Week 3</span>
                              <span>👤 Owner: Documentation Team</span>
                              <span>🏷️ Type: Documentation</span>
                            </div>
                          </div>
                          
                          <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-white">Debug Mode Implementation</h4>
                              <span className="px-2 py-1 bg-yellow-500 text-white text-xs rounded-full">MEDIUM</span>
                            </div>
                            <p className="text-white/80 text-sm mb-3">
                              Detailed logging and debugging capabilities for development
                            </p>
                            <div className="flex items-center space-x-4 text-xs text-white/70">
                              <span>📅 Due: Week 4</span>
                              <span>👤 Owner: Core Team</span>
                              <span>🏷️ Type: Feature</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Recent Updates */}
                      <div className="bg-gradient-to-br from-green-500/20 to-green-400/20 rounded-xl p-6 border border-green-400/30">
                        <h3 className="text-2xl font-bold text-white mb-4">✅ Recent Updates & Progress</h3>
                        <div className="space-y-4">
                          <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-white">POC Application Completed</h4>
                              <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">COMPLETED</span>
                            </div>
                            <p className="text-white/80 text-sm mb-3">
                              Full-featured demo application built with mock implementations
                            </p>
                            <div className="flex items-center space-x-4 text-xs text-white/70">
                              <span>📅 Completed: Today</span>
                              <span>👤 Owner: Developer</span>
                              <span>🏷️ Type: Demo</span>
                            </div>
                          </div>
                          
                          <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-white">User Experience Feedback Document</h4>
                              <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">COMPLETED</span>
                            </div>
                            <p className="text-white/80 text-sm mb-3">
                              Comprehensive feedback document with improvement suggestions
                            </p>
                            <div className="flex items-center space-x-4 text-xs text-white/70">
                              <span>📅 Completed: Today</span>
                              <span>👤 Owner: Developer</span>
                              <span>🏷️ Type: Feedback</span>
                            </div>
                          </div>
                          
                          <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-white">Mock Implementation Strategy</h4>
                              <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">COMPLETED</span>
                            </div>
                            <p className="text-white/80 text-sm mb-3">
                              All hooks implemented with realistic data structures and error simulation
                            </p>
                            <div className="flex items-center space-x-4 text-xs text-white/70">
                              <span>📅 Completed: Today</span>
                              <span>👤 Owner: Developer</span>
                              <span>🏷️ Type: Development</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Next Steps */}
                      <div className="bg-gradient-to-br from-blue-500/20 to-blue-400/20 rounded-xl p-6 border border-blue-400/30">
                        <h3 className="text-2xl font-bold text-white mb-4">🎯 Next Steps & Timeline</h3>
                        <div className="grid md:grid-cols-3 gap-6">
                          <div className="text-center">
                            <div className="text-3xl mb-3">🚀</div>
                            <h4 className="font-semibold text-white mb-2">Week 1</h4>
                            <p className="text-white/80 text-sm">
                              Publish NPM package and create basic installation guide
                            </p>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl mb-3">📚</div>
                            <h4 className="font-semibold text-white mb-2">Week 2</h4>
                            <p className="text-white/80 text-sm">
                              Complete documentation and create quick start template
                            </p>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl mb-3">🔧</div>
                            <h4 className="font-semibold text-white mb-2">Week 3-4</h4>
                            <p className="text-white/80 text-sm">
                              Implement debug mode and enhance error handling
                            </p>
                          </div>
                        </div>
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
