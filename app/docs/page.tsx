'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { NexusPrime } from '@/components/layout/NexusPrime';
import { EscrowProvider } from '@/contexts/EscrowContext';
import { WalletProvider } from '@/contexts/WalletContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { TransactionProvider } from '@/contexts/TransactionContext';
import { AccountProvider } from '@/contexts/AccountContext';
import Image from 'next/image';

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('overview');
  const [isLoading, setIsLoading] = useState(() => {
    // Check if this is the first time loading the page
    if (typeof window !== 'undefined') {
      const hasLoadedBefore = localStorage.getItem('docsPageLoaded');
      return !hasLoadedBefore;
    }
    return true;
  });
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Loading effect - only on first load
  useEffect(() => {
    if (!isLoading) return; // Skip if already loaded

    const loadingSteps = [
      { progress: 20, message: 'Loading Documentation...' },
      { progress: 40, message: 'Initializing Tech Stack...' },
      { progress: 60, message: 'Preparing Code Examples...' },
      { progress: 80, message: 'Setting up API References...' },
      { progress: 100, message: 'Documentation Ready!' },
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < loadingSteps.length) {
        setLoadingProgress(loadingSteps[currentStep].progress);
        currentStep++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsLoading(false);
          // Mark that the page has been loaded
          if (typeof window !== 'undefined') {
            localStorage.setItem('docsPageLoaded', 'true');
          }
        }, 500);
      }
    }, 800);

    return () => clearInterval(interval);
  }, [isLoading]);

  const sections = [
    { id: 'overview', title: 'Technology Overview', icon: '🚀' },
    { id: 'stellar', title: 'Stellar Implementation', icon: '⭐' },
    { id: 'architecture', title: 'System Architecture', icon: '🏗️' },
    { id: 'starters', title: 'Nexus Starters', icon: '👨🏻‍💻' },
  ];

  return (
    <WalletProvider>
      <AuthProvider>
        <ToastProvider>
          <TransactionProvider>
            <AccountProvider>
              <EscrowProvider>
              <div className='min-h-screen bg-gradient-to-br from-neutral-900 via-brand-900 to-neutral-900'>
                <Header />

                {/* Loading Screen */}
                {isLoading && (
                  <div className='fixed inset-0 z-[9999] bg-gradient-to-br from-neutral-900 via-brand-900 to-neutral-900 flex items-center justify-center'>
                    {/* Animated Background */}
                    <div className='absolute inset-0 overflow-hidden'>
                      {/* Floating Energy Orbs */}
                      <div className='absolute top-1/4 left-1/4 w-32 h-32 bg-brand-400/20 rounded-full animate-ping'></div>
                      <div
                        className='absolute top-1/3 right-1/4 w-24 h-24 bg-accent-400/20 rounded-full animate-ping'
                        style={{ animationDelay: '0.5s' }}
                      ></div>
                      <div
                        className='absolute bottom-1/3 left-1/3 w-28 h-28 bg-brand-500/20 rounded-full animate-ping'
                        style={{ animationDelay: '1s' }}
                      ></div>
                      <div
                        className='absolute bottom-1/4 right-1/3 w-20 h-20 bg-accent-500/20 rounded-full animate-ping'
                        style={{ animationDelay: '1.5s' }}
                      ></div>

                      {/* Energy Grid */}
                      <div className='absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(14,165,233,0.1)_0%,_transparent_70%)] animate-pulse'></div>
                    </div>

                    {/* Main Content */}
                    <div className='relative z-10 text-center'>
                      {/* Logo Animation */}
                      <div className='mb-8 animate-bounce'>
                        <Image
                          src='/images/logo/logoicon.png'
                          alt='STELLAR NEXUS'
                          width={120}
                          height={120}
                          className='w-30 h-30'
                        />
                      </div>

                      {/* Loading Text */}
                      <div className='mb-8'>
                        <h2 className='text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-accent-400 to-brand-400 mb-4'>
                          Loading Documentation
                        </h2>
                        <p className='text-white/70 text-lg animate-pulse'>
                          Preparing comprehensive technical guides...
                        </p>
                      </div>

                      {/* Loading Bar */}
                      <div className='w-80 bg-white/10 rounded-full h-3 overflow-hidden mb-6'>
                        <div
                          className='bg-gradient-to-r from-brand-400 via-accent-400 to-brand-400 h-3 rounded-full transition-all duration-500'
                          style={{ width: `${loadingProgress}%` }}
                        ></div>
                      </div>

                      {/* Loading Steps */}
                      <div className='space-y-2'>
                        <p className='animate-fadeInUp' style={{ animationDelay: '1s' }}>
                          Loading Documentation...
                        </p>
                        <p className='animate-fadeInUp' style={{ animationDelay: '2s' }}>
                          Initializing Tech Stack...
                        </p>
                        <p className='animate-fadeInUp' style={{ animationDelay: '3s' }}>
                          Preparing Code Examples...
                        </p>
                        <p className='animate-fadeInUp' style={{ animationDelay: '4s' }}>
                          Setting up API References...
                        </p>
                        <p className='animate-fadeInUp' style={{ animationDelay: '5s' }}>
                          Documentation Ready!
                        </p>
                      </div>

                      {/* Progress Percentage */}
                      <div className='mt-6 text-white/60'>
                        <span className='font-bold'>{loadingProgress}%</span> Complete
                      </div>
                    </div>
                  </div>
                )}

                {/* Main Content */}
                <main className='relative z-10 pt-20 '>
                  <div className='container mx-auto px-4'>
                    <div className='max-w-6xl mx-auto'>
                      {/* Page Header */}
                      <div className='text-center mb-16'>
                        <div className='flex justify-center mb-6'>
                          <Image
                            src='/images/logo/logoicon.png'
                            alt='STELLAR NEXUS'
                            width={300}
                            height={300}
                            style={{ zIndex: -1, position: 'relative' }}
                          />
                        </div>

                        {/* Epic Legendary Background for Title */}
                        <div className='relative mb-8'>
                          {/* Legendary Energy Background */}
                          <div className='absolute inset-0 flex justify-center items-center pointer-events-none'>
                            {/* Primary Energy Core */}
                            <div className='relative w-[500px] h-40'>
                              {/* Inner Energy Ring */}
                              <div className='absolute inset-0 rounded-full bg-gradient-to-r from-brand-500/40 via-accent-500/50 to-brand-400/40 blur-lg scale-150'></div>

                              {/* Middle Energy Ring */}
                              <div className='absolute inset-0 rounded-full bg-gradient-to-r from-accent-500/30 via-brand-500/40 to-accent-400/30 blur-xl scale-200'></div>

                              {/* Outer Energy Ring */}
                              <div className='absolute inset-0 rounded-full bg-gradient-to-r from-brand-400/20 via-accent-500/30 to-brand-300/20 blur-2xl scale-250'></div>
                            </div>

                            {/* Floating Energy Particles */}
                            <div className='absolute inset-0'>
                              <div className='absolute top-6 left-1/4 w-3 h-3 bg-brand-400 rounded-full animate-ping opacity-80'></div>
                              <div
                                className='absolute top-12 right-1/3 w-2 h-2 bg-accent-400 rounded-full animate-ping opacity-90'
                                style={{ animationDelay: '0.5s' }}
                              ></div>
                              <div
                                className='absolute bottom-8 left-1/3 w-2.5 h-2.5 bg-brand-300 rounded-full animate-ping opacity-70'
                                style={{ animationDelay: '1s' }}
                              ></div>
                              <div
                                className='absolute bottom-12 right-1/4 w-2 h-2 bg-accent-300 rounded-full animate-ping opacity-85'
                                style={{ animationDelay: '1.5s' }}
                              ></div>
                              <div
                                className='absolute top-1/2 left-1/6 w-1.5 h-1.5 bg-brand-200 rounded-full animate-ping opacity-60'
                                style={{ animationDelay: '2s' }}
                              ></div>
                              <div
                                className='absolute top-1/2 right-1/6 w-2 h-2 bg-accent-200 rounded-full animate-ping opacity-75'
                                style={{ animationDelay: '2.5s' }}
                              ></div>
                            </div>

                            {/* Energy Wave Rings */}
                            <div className='absolute inset-0'>
                              <div
                                className='absolute inset-0 rounded-full border-2 border-brand-400/40 animate-ping scale-150'
                                style={{ animationDuration: '4s' }}
                              ></div>
                              <div
                                className='absolute inset-0 rounded-full border border-accent-400/30 animate-ping scale-200'
                                style={{ animationDuration: '5s' }}
                              ></div>
                              <div
                                className='absolute inset-0 rounded-full border border-brand-300/25 animate-ping scale-250'
                                style={{ animationDuration: '6s' }}
                              ></div>
                            </div>

                            {/* Plasma Energy Streams */}
                            <div className='absolute inset-0'>
                              <div
                                className='absolute left-0 top-1/2 w-1 h-24 bg-gradient-to-b from-transparent via-brand-400/50 to-transparent animate-pulse opacity-60'
                                style={{ animationDuration: '3s' }}
                              ></div>
                              <div
                                className='absolute right-0 top-1/2 w-1 h-20 bg-gradient-to-b from-transparent via-accent-400/50 to-transparent animate-pulse opacity-70'
                                style={{ animationDuration: '2.5s' }}
                              ></div>
                              <div
                                className='absolute top-0 left-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-brand-400/50 to-transparent animate-pulse opacity-50'
                                style={{ animationDuration: '3.5s' }}
                              ></div>
                              <div
                                className='absolute bottom-0 left-1/2 w-20 h-1 bg-gradient-to-r from-transparent via-brand-400/50 to-transparent animate-pulse opacity-65'
                                style={{ animationDuration: '2.8s' }}
                              ></div>
                            </div>
                          </div>

                          {/* Title with Enhanced Styling */}
                          <h1
                            className='relative z-10 text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-accent-400 to-brand-400 mb-6 drop-shadow-2xl'
                            style={{ zIndex: 1000, marginTop: '-200px' }}
                          >
                            DOCS
                          </h1>
                        </div>

                        <br />
                        <br />

                        <p className='text-xl text-white/80 max-w-3xl mx-auto'>
                          Comprehensive technical guide to building decentralized work platforms on
                          the Stellar blockchain
                        </p>

                        {/* Powered by Trustless Work */}
                        <div className='text-center mt-4'>
                          <p className='text-brand-300/70 text-sm font-medium animate-pulse'>
                            Powered by{' '}
                            <span className='text-brand-200 font-semibold'>Trustless Work</span>
                          </p>
                        </div>
                      </div>

                      {/* Navigation Tabs */}
                      <div className='flex flex-wrap justify-center gap-2 mb-12'>
                        {sections.map(section => (
                          <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                              activeSection === section.id
                                ? 'bg-gradient-to-r from-brand-500 to-accent-600 text-white shadow-lg'
                                : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                            }`}
                          >
                            <span className='mr-2'>{section.icon}</span>
                            {section.title}
                          </button>
                        ))}
                      </div>

                      {/* Content Sections */}
                      <div className='bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8'>
                        {/* Technology Overview */}
                        {activeSection === 'overview' && (
                          <div className='space-y-8'>
                            <div className='text-center mb-8'>
                              <h2 className='text-3xl font-bold text-white mb-4'>
                                Technology Overview
                              </h2>
                              <p className='text-lg text-white/80'>
                                Trustless Work is a revolutionary technology stack that enables
                                decentralized work management through smart contract-powered escrow
                                systems on the Stellar blockchain.
                              </p>
                            </div>

                            <div className='grid md:grid-cols-3 gap-6'>
                              <div className='text-center p-6 bg-gradient-to-br from-brand-500/20 to-brand-400/20 rounded-xl border border-brand-400/30'>
                                <div className='text-4xl mb-4'>🔐</div>
                                <h3 className='text-xl font-semibold text-white mb-3'>
                                  Smart Contract Escrow
                                </h3>
                                <p className='text-white/80'>
                                  Automated fund management with programmable logic and no
                                  third-party intermediaries
                                </p>
                              </div>
                              <div className='text-center p-6 bg-gradient-to-br from-success-500/20 to-success-400/20 rounded-xl border border-success-400/30'>
                                <div className='text-4xl mb-4'>⚡</div>
                                <h3 className='text-xl font-semibold text-white mb-3'>
                                  Stellar Blockchain
                                </h3>
                                <p className='text-white/80'>
                                  Built on Stellar's fast, low-cost, and environmentally friendly
                                  distributed ledger
                                </p>
                              </div>
                              <div className='text-center p-6 bg-gradient-to-br from-accent-500/20 to-accent-400/20 rounded-xl border border-accent-400/30'>
                                <div className='text-4xl mb-4'>🌐</div>
                                <h3 className='text-xl font-semibold text-white mb-3'>
                                  Developer SDK
                                </h3>
                                <p className='text-white/80'>
                                  Comprehensive React hooks and TypeScript interfaces for rapid
                                  development
                                </p>
                              </div>
                            </div>

                            <div className='bg-gradient-to-br from-white/5 to-white/10 rounded-xl p-6 border border-white/20'>
                              <h3 className='text-2xl font-bold text-white mb-4'>
                                Core Technology Stack
                              </h3>
                              <div className='grid md:grid-cols-2 gap-6'>
                                <div>
                                  <h4 className='font-semibold text-brand-300 mb-3'>
                                    Blockchain Layer
                                  </h4>
                                  <ul className='text-white/80 text-sm space-y-2'>
                                    <li>
                                      • <strong>Stellar Network:</strong> Consensus Protocol (SCP)
                                      with 3-5 second finality
                                    </li>
                                    <li>
                                      • <strong>Smart Contracts:</strong> Stellar's native smart
                                      contract capabilities
                                    </li>
                                    <li>
                                      • <strong>Multi-Asset Support:</strong> Native and custom
                                      token support
                                    </li>
                                    <li>
                                      • <strong>Transaction Types:</strong> Payment, Path Payment,
                                      Manage Offer operations
                                    </li>
                                  </ul>
                                </div>
                                <div>
                                  <h4 className='font-semibold text-accent-300 mb-3'>
                                    Application Layer
                                  </h4>
                                  <ul className='text-white/80 text-sm space-y-2'>
                                    <li>
                                      • <strong>React Hooks:</strong> useEscrow, useWallet,
                                      useTransaction hooks
                                    </li>
                                    <li>
                                      • <strong>TypeScript:</strong> Full type safety with
                                      comprehensive interfaces
                                    </li>
                                    <li>
                                      • <strong>Wallet Integration:</strong> Freighter, Albedo, and
                                      custom wallet support
                                    </li>
                                    <li>
                                      • <strong>State Management:</strong> React Context for global
                                      state synchronization
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>

                            <div className='bg-gradient-to-br from-brand-500/20 to-brand-400/20 rounded-xl p-6 border border-brand-400/30'>
                              <h3 className='text-2xl font-bold text-white mb-4'>
                                Technical Advantages
                              </h3>
                              <ul className='text-white/80 space-y-2'>
                                <li>
                                  • <strong>Scalability:</strong> Stellar's 1000+ TPS capacity for
                                  high-volume applications
                                </li>
                                <li>
                                  • <strong>Cost Efficiency:</strong> 0.00001 XLM per operation
                                  (~$0.000001)
                                </li>
                                <li>
                                  • <strong>Global Access:</strong> Borderless transactions with
                                  instant settlement
                                </li>
                                <li>
                                  • <strong>Security:</strong> Cryptographic security with Byzantine
                                  Fault Tolerance
                                </li>
                                <li>
                                  • <strong>Interoperability:</strong> Built-in bridges to
                                  traditional financial systems
                                </li>
                                <li>
                                  • <strong>Environmental:</strong> Carbon-neutral consensus
                                  mechanism
                                </li>
                              </ul>
                            </div>
                          </div>
                        )}

                        {/* Stellar Implementation */}
                        {activeSection === 'stellar' && (
                          <div className='space-y-8'>
                            <div className='text-center mb-8'>
                              <h2 className='text-3xl font-bold text-white mb-4'>
                                Stellar Implementation
                              </h2>
                              <p className='text-lg text-white/80'>
                                Deep dive into Stellar blockchain integration and smart contract
                                implementation
                              </p>
                            </div>

                            <div className='grid md:grid-cols-2 gap-8'>
                              <div className='space-y-6'>
                                <h3 className='text-2xl font-bold text-brand-300'>
                                  Stellar Network Features
                                </h3>
                                <div className='space-y-4'>
                                  <div className='bg-gradient-to-br from-brand-500/20 to-brand-400/20 rounded-lg p-4 border border-brand-400/30'>
                                    <h4 className='font-semibold text-white mb-2'>
                                      Consensus Protocol (SCP)
                                    </h4>
                                    <p className='text-white/80 text-sm'>
                                      Stellar Consensus Protocol ensures network agreement in 3-5
                                      seconds with Byzantine Fault Tolerance
                                    </p>
                                  </div>
                                  <div className='bg-gradient-to-br from-brand-500/20 to-brand-400/20 rounded-lg p-4 border border-brand-400/30'>
                                    <h4 className='font-semibold text-white mb-2'>
                                      Asset Management
                                    </h4>
                                    <p className='text-white/80 text-sm'>
                                      Native support for XLM, USDC, and custom assets with built-in
                                      trustlines
                                    </p>
                                  </div>
                                  <div className='bg-gradient-to-br from-brand-500/20 to-brand-400/20 rounded-lg p-4 border border-brand-400/30'>
                                    <h4 className='font-semibold text-white mb-2'>
                                      Transaction Operations
                                    </h4>
                                    <p className='text-white/80 text-sm'>
                                      Payment, Path Payment, Manage Offer, and Set Options for
                                      complex escrow logic
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div className='space-y-6'>
                                <h3 className='text-2xl font-bold text-accent-300'>
                                  Smart Contract Implementation
                                </h3>
                                <div className='space-y-4'>
                                  <div className='bg-gradient-to-br from-accent-500/20 to-accent-400/20 rounded-lg p-4 border border-accent-400/30'>
                                    <h4 className='font-semibold text-white mb-2'>Escrow Logic</h4>
                                    <p className='text-white/80 text-sm'>
                                      Multi-signature accounts with time-locked releases and
                                      milestone-based payments
                                    </p>
                                  </div>
                                  <div className='bg-gradient-to-br from-accent-500/20 to-accent-400/20 rounded-lg p-4 border border-accent-400/30'>
                                    <h4 className='font-semibold text-white mb-2'>
                                      Dispute Resolution
                                    </h4>
                                    <p className='text-white/80 text-sm'>
                                      Built-in arbitration system with multi-party consensus
                                      mechanisms
                                    </p>
                                  </div>
                                  <div className='bg-gradient-to-br from-accent-500/20 to-accent-400/20 rounded-lg p-4 border border-accent-400/30'>
                                    <h4 className='font-semibold text-white mb-2'>
                                      Multi-Party Support
                                    </h4>
                                    <p className='text-white/80 text-sm'>
                                      Support for complex work relationships with multiple
                                      stakeholders
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className='bg-gradient-to-br from-white/5 to-white/10 rounded-xl p-6 border border-white/20'>
                              <h3 className='text-2xl font-bold text-white mb-4'>
                                Implementation Architecture
                              </h3>
                              <div className='grid md:grid-cols-3 gap-6'>
                                <div className='text-center'>
                                  <div className='text-3xl mb-3'>🔑</div>
                                  <h4 className='font-semibold text-white mb-2'>Key Management</h4>
                                  <p className='text-white/80 text-sm'>
                                    Hierarchical deterministic wallets with multi-signature support
                                  </p>
                                </div>
                                <div className='text-center'>
                                  <div className='text-3xl mb-3'>📊</div>
                                  <h4 className='font-semibold text-white mb-2'>
                                    State Management
                                  </h4>
                                  <p className='text-white/80 text-sm'>
                                    React Context with real-time blockchain state synchronization
                                  </p>
                                </div>
                                <div className='text-center'>
                                  <div className='text-3xl mb-3'>🔗</div>
                                  <h4 className='font-semibold text-white mb-2'>
                                    Network Integration
                                  </h4>
                                  <p className='text-white/80 text-sm'>
                                    Horizon API integration with WebSocket for live updates
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className='bg-gradient-to-br from-success-500/20 to-success-400/20 rounded-xl p-6 border border-success-400/30'>
                              <h3 className='text-2xl font-bold text-white mb-4'>
                                Stellar SDK Integration
                              </h3>
                              <div className='bg-white/5 rounded-lg p-4 border border-white/20'>
                                <pre className='text-white/80 text-sm overflow-x-auto'>
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
                          <div className='space-y-8'>
                            <div className='text-center mb-8'>
                              <h2 className='text-3xl font-bold text-white mb-4'>
                                🏗️ System Architecture
                              </h2>
                              <p className='text-lg text-white/80'>
                                Comprehensive overview of the Trustless Work system architecture and
                                component relationships
                              </p>
                            </div>

                            {/* Architecture Diagram */}
                            <div className='bg-gradient-to-br from-brand-500/10 to-accent-500/10 rounded-xl p-6 border border-brand-400/30'>
                              <h3 className='text-2xl font-bold text-white mb-6 text-center'>
                                📊 System Architecture Overview
                              </h3>
                              <div className='bg-white/5 rounded-lg p-4 border border-white/20 overflow-x-auto'>
                                <div className='mermaid-diagram min-w-[800px] text-sm'>
                                  <div className='text-center text-white/60 mb-4'>
                                    <p>Trustless Work System Architecture & Data Flow</p>
                                    <p className='text-xs'>
                                      Component relationships and integration points
                                    </p>
                                  </div>

                                  {/* Architecture Diagram using Mermaid-like structure */}
                                  <div className='architecture-diagram space-y-6'>
                                    {/* User Layer */}
                                    <div className='text-center'>
                                      <div className='inline-block bg-gradient-to-r from-brand-500/30 to-accent-500/30 px-6 py-3 rounded-lg border border-brand-400/50'>
                                        <div className='text-2xl mb-2'>👤</div>
                                        <div className='font-semibold text-white'>
                                          User Interface Layer
                                        </div>
                                        <div className='text-xs text-white/70'>
                                          React Components & Hooks
                                        </div>
                                      </div>
                                    </div>

                                    {/* State Management Layer */}
                                    <div className='text-center'>
                                      <div className='inline-block bg-gradient-to-r from-success-500/30 to-success-400/30 px-6 py-3 rounded-lg border border-success-400/50'>
                                        <div className='text-2xl mb-2'>⚙️</div>
                                        <div className='font-semibold text-white'>
                                          State Management Layer
                                        </div>
                                        <div className='text-xs text-white/70'>
                                          React Context & Hooks
                                        </div>
                                      </div>
                                      <div className='grid grid-cols-3 gap-3 mt-4 max-w-2xl mx-auto'>
                                        <div className='bg-white/10 px-3 py-2 rounded border border-white/20'>
                                          <div className='text-xs text-white/80'>
                                            Wallet Context
                                          </div>
                                          <div className='text-xs text-white/60'>
                                            Stellar Integration
                                          </div>
                                        </div>
                                        <div className='bg-white/10 px-3 py-2 rounded border border-white/20'>
                                          <div className='text-xs text-white/80'>
                                            Escrow Context
                                          </div>
                                          <div className='text-xs text-white/60'>
                                            Smart Contract State
                                          </div>
                                        </div>
                                        <div className='bg-white/10 px-3 py-2 rounded border border-white/20'>
                                          <div className='text-xs text-white/80'>
                                            Transaction Context
                                          </div>
                                          <div className='text-xs text-white/60'>
                                            Network Operations
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Business Logic Layer */}
                                    <div className='text-center'>
                                      <div className='inline-block bg-gradient-to-r from-accent-500/30 to-accent-400/30 px-6 py-3 rounded-lg border border-accent-400/50'>
                                        <div className='text-2xl mb-2'>🔧</div>
                                        <div className='font-semibold text-white'>
                                          Business Logic Layer
                                        </div>
                                        <div className='text-xs text-white/70'>
                                          Trustless Work SDK
                                        </div>
                                      </div>
                                      <div className='grid grid-cols-3 gap-3 mt-4 max-w-xl mx-auto'>
                                        <div className='bg-white/10 px-3 py-2 rounded border border-white/20'>
                                          <div className='text-xs text-white/80'>
                                            Escrow Management
                                          </div>
                                          <div className='text-xs text-white/60'>
                                            Contract Logic
                                          </div>
                                        </div>
                                        <div className='bg-white/10 px-3 py-2 rounded border border-white/20'>
                                          <div className='text-xs text-white/80'>
                                            Wallet Operations
                                          </div>
                                          <div className='text-xs text-white/60'>
                                            Key Management
                                          </div>
                                        </div>
                                        <div className='bg-white/10 px-3 py-2 rounded border border-white/20'>
                                          <div className='text-xs text-white/80'>
                                            Transaction Handling
                                          </div>
                                          <div className='text-xs text-white/60'>
                                            Network Operations
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Blockchain Layer */}
                                    <div className='text-center'>
                                      <div className='inline-block bg-warning-500/30 to-warning-400/30 px-6 py-3 rounded-lg border border-warning-400/50'>
                                        <div className='text-2xl mb-2'>🚀</div>
                                        <div className='font-semibold text-white'>
                                          Blockchain Layer
                                        </div>
                                        <div className='text-xs text-white/70'>Stellar Network</div>
                                      </div>

                                      {/* Stellar Components */}
                                      <div className='grid grid-cols-2 gap-4 mt-4 max-w-lg mx-auto'>
                                        <div className='bg-white/10 px-3 py-2 rounded border border-white/20'>
                                          <div className='text-xs text-white/80'>Horizon API</div>
                                          <div className='text-xs text-white/60'>
                                            Network Interface
                                          </div>
                                        </div>
                                        <div className='bg-white/10 px-3 py-2 rounded border border-white/20'>
                                          <div className='text-xs text-white/80'>Stellar SDK</div>
                                          <div className='text-xs text-white/60'>
                                            Core Operations
                                          </div>
                                        </div>
                                      </div>

                                      {/* Smart Contract Components */}
                                      <div className='mt-4'>
                                        <div className='text-sm text-white/70 mb-3'>
                                          Smart Contract Components
                                        </div>
                                        <div className='grid grid-cols-2 gap-4 max-w-2xl mx-auto'>
                                          <div className='bg-white/10 px-3 py-2 rounded border border-white/20'>
                                            <div className='text-xs text-white/80'>
                                              Multi-Signature
                                            </div>
                                            <div className='text-xs text-white/60'>
                                              Escrow Accounts
                                            </div>
                                          </div>
                                          <div className='bg-white/10 px-3 py-2 rounded border border-white/20'>
                                            <div className='text-xs text-white/80'>Time Locks</div>
                                            <div className='text-xs text-white/60'>
                                              Release Conditions
                                            </div>
                                          </div>
                                          <div className='bg-white/10 px-3 py-2 rounded border border-white/20'>
                                            <div className='text-xs text-white/80'>
                                              Asset Management
                                            </div>
                                            <div className='text-xs text-white/60'>
                                              Token Operations
                                            </div>
                                          </div>
                                          <div className='bg-white/10 px-3 py-2 rounded border border-white/20'>
                                            <div className='text-xs text-white/80'>
                                              Dispute Resolution
                                            </div>
                                            <div className='text-xs text-white/60'>
                                              Arbitration Logic
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Data Flow Indicators */}
                                    <div className='text-center text-white/60 text-xs'>
                                      <div className='flex items-center justify-center space-x-8'>
                                        <div className='flex items-center space-x-2'>
                                          <div className='w-3 h-3 bg-brand-400 rounded-full'></div>
                                          <span>Uses</span>
                                        </div>
                                        <div className='flex items-center space-x-2'>
                                          <div className='w-3 h-3 bg-success-400 rounded-full'></div>
                                          <span>Manages State</span>
                                        </div>
                                        <div className='flex items-center space-x-2'>
                                          <div className='w-3 h-3 bg-accent-400 rounded-full'></div>
                                          <span>Executes Logic</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Architecture Description */}
                            <div className='bg-gradient-to-br from-white/5 to-white/10 rounded-xl p-6 border border-white/20'>
                              <h3 className='text-2xl font-bold text-white mb-4'>
                                🏛️ Architecture Overview
                              </h3>
                              <div className='grid md:grid-cols-2 gap-6'>
                                <div>
                                  <h4 className='font-semibold text-brand-300 mb-3'>
                                    System Layers
                                  </h4>
                                  <ul className='text-white/80 text-sm space-y-2'>
                                    <li>
                                      • <strong>UI Layer:</strong> React components with hooks and
                                      state management
                                    </li>
                                    <li>
                                      • <strong>State Layer:</strong> React Context for global state
                                      synchronization
                                    </li>
                                    <li>
                                      • <strong>Logic Layer:</strong> Trustless Work SDK with
                                      business logic
                                    </li>
                                    <li>
                                      • <strong>Blockchain Layer:</strong> Stellar network
                                      integration and smart contracts
                                    </li>
                                  </ul>
                                </div>
                                <div>
                                  <h4 className='font-semibold text-accent-300 mb-3'>
                                    Key Integration Points
                                  </h4>
                                  <ul className='text-white/80 text-sm space-y-2'>
                                    <li>
                                      • <strong>UI → State:</strong> Components consume context
                                      state and dispatch actions
                                    </li>
                                    <li>
                                      • <strong>State → Logic:</strong> Context uses SDK hooks for
                                      business operations
                                    </li>
                                    <li>
                                      • <strong>Logic → Blockchain:</strong> SDK executes Stellar
                                      operations and contract logic
                                    </li>
                                    <li>
                                      • <strong>Blockchain → State:</strong> Network events update
                                      application state
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Nexus Starters */}
                        {activeSection === 'starters' && (
                          <div className='space-y-8'>
                            <div className='text-center mb-8'>
                              <h2 className='text-3xl font-bold text-white mb-4'>
                                👨🏻‍💻 Nexus Starters
                              </h2>
                              <p className='text-lg text-white/80 max-w-2xl mx-auto'>
                                Build on Stellar with Trustless Work — comprehensive starter kits
                                for innovative apps using advanced escrow mechanics and enhanced
                                Stellar integrations.
                              </p>
                            </div>

                            <div className='grid md:grid-cols-3 gap-6'>
                              {/* DeFi Starter */}
                              <div className='bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-400/30 rounded-2xl p-6 hover:border-cyan-400/50 transition-all duration-300 group relative'>
                                <div className='text-center mb-4'>
                                  <div className='text-4xl mb-3 group-hover:scale-110 transition-transform duration-300'>
                                    💎
                                  </div>
                                  <h4 className='text-xl font-bold text-white mb-2'>
                                    DeFi Starter
                                  </h4>
                                  <p className='text-white/70 text-sm mb-4'>
                                    Create decentralized financial apps with escrow contracts and
                                    yield optimization.
                                  </p>
                                </div>

                                <div className='space-y-2 mb-4'>
                                  <div className='flex items-center text-sm text-cyan-300'>
                                    <span className='mr-2'>•</span>
                                    <span>Yield farming protocols</span>
                                  </div>
                                  <div className='flex items-center text-sm text-cyan-300'>
                                    <span className='mr-2'>•</span>
                                    <span>Liquidity provision</span>
                                  </div>
                                  <div className='flex items-center text-sm text-cyan-300'>
                                    <span className='mr-2'>•</span>
                                    <span>Cross-chain bridges</span>
                                  </div>
                                  <div className='flex items-center text-sm text-cyan-300'>
                                    <span className='mr-2'>•</span>
                                    <span>Risk management tools</span>
                                  </div>
                                </div>

                                <a
                                  href='https://nexus-starter.vercel.app/'
                                  target='_blank'
                                  rel='noopener noreferrer'
                                  className='block w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 text-center'
                                >
                                  💎 Explore DeFi Starter
                                </a>
                              </div>

                              {/* Gaming Starter */}
                              <div className='bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-400/30 rounded-2xl p-6 hover:border-purple-400/50 transition-all duration-300 group relative'>
                                <div className='text-center mb-4'>
                                  <div className='text-4xl mb-3 group-hover:scale-110 transition-transform duration-300'>
                                    🎮
                                  </div>
                                  <h4 className='text-xl font-bold text-white mb-2'>
                                    Gaming Starter
                                  </h4>
                                  <p className='text-white/70 text-sm mb-4'>
                                    Build play-to-earn games with secure escrow for tournaments,
                                    rewards, and trading.
                                  </p>
                                </div>

                                <div className='space-y-2 mb-4'>
                                  <div className='flex items-center text-sm text-purple-300'>
                                    <span className='mr-2'>•</span>
                                    <span>Tournament prize pools</span>
                                  </div>
                                  <div className='flex items-center text-sm text-purple-300'>
                                    <span className='mr-2'>•</span>
                                    <span>NFT marketplace integration</span>
                                  </div>
                                  <div className='flex items-center text-sm text-purple-300'>
                                    <span className='mr-2'>•</span>
                                    <span>Cross-game asset transfers</span>
                                  </div>
                                  <div className='flex items-center text-sm text-purple-300'>
                                    <span className='mr-2'>•</span>
                                    <span>Automated reward distribution</span>
                                  </div>
                                </div>

                                <a
                                  href='https://nexus-starter.vercel.app/'
                                  target='_blank'
                                  rel='noopener noreferrer'
                                  className='block w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 text-center'
                                >
                                  🎮 Explore Gaming Starter
                                </a>
                              </div>

                              {/* Unicorn Starter */}
                              <div className='bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-400/30 rounded-2xl p-6 hover:border-green-400/50 transition-all duration-300 group relative'>
                                <div className='text-center mb-4'>
                                  <div className='text-4xl mb-3 group-hover:scale-110 transition-transform duration-300'>
                                    🦄
                                  </div>
                                  <h4 className='text-xl font-bold text-white mb-2'>
                                    Unicorn Starter
                                  </h4>
                                  <p className='text-white/70 text-sm mb-4'>
                                    Build "unicorn" apps with cutting-edge features and disruptive
                                    tech.
                                  </p>
                                </div>

                                <div className='space-y-2 mb-4'>
                                  <div className='flex items-center text-sm text-green-300'>
                                    <span className='mr-2'>•</span>
                                    <span>AI-powered features</span>
                                  </div>
                                  <div className='flex items-center text-sm text-green-300'>
                                    <span className='mr-2'>•</span>
                                    <span>Cross-chain interoperability</span>
                                  </div>
                                  <div className='flex items-center text-sm text-green-300'>
                                    <span className='mr-2'>•</span>
                                    <span>Advanced tokenomics</span>
                                  </div>
                                  <div className='flex items-center text-sm text-green-300'>
                                    <span className='mr-2'>•</span>
                                    <span>Revolutionary UX/UI</span>
                                  </div>
                                </div>

                                <a
                                  href='https://nexus-starter.vercel.app/'
                                  target='_blank'
                                  rel='noopener noreferrer'
                                  className='block w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 text-center'
                                >
                                  🦄 Explore Unicorn Starter
                                </a>
                              </div>
                            </div>

                            <div className='bg-gradient-to-br from-brand-500/20 to-brand-400/20 rounded-xl p-6 border border-brand-400/30'>
                              <h3 className='text-2xl font-bold text-white mb-4'>
                                🚀 Getting Started
                              </h3>
                              <div className='grid md:grid-cols-2 gap-6'>
                                <div>
                                  <h4 className='font-semibold text-brand-300 mb-3'>Quick Start</h4>
                                  <ul className='text-white/80 text-sm space-y-2'>
                                    <li>• Clone the starter repository</li>
                                    <li>• Install dependencies with npm</li>
                                    <li>• Configure your Stellar wallet</li>
                                    <li>• Deploy to your preferred platform</li>
                                  </ul>
                                </div>
                                <div>
                                  <h4 className='font-semibold text-accent-300 mb-3'>
                                    Features Included
                                  </h4>
                                  <ul className='text-white/80 text-sm space-y-2'>
                                    <li>• Pre-configured Trustless Work integration</li>
                                    <li>• Stellar wallet connection setup</li>
                                    <li>• Example escrow contracts</li>
                                    <li>• TypeScript support and documentation</li>
                                  </ul>
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
                <NexusPrime currentPage='docs' />

                <Footer />
              </div>
              </EscrowProvider>
            </AccountProvider>
          </TransactionProvider>
        </ToastProvider>
      </AuthProvider>
    </WalletProvider>
  );
}
