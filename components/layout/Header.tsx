'use client'

import { useState } from 'react'
import { useGlobalWallet } from '@/contexts/WalletContext'
import { appConfig, stellarConfig } from '@/lib/wallet-config'
import { Tooltip } from '@/components/ui/Tooltip'
import { UserDropdown } from '@/components/ui/UserDropdown'
import Image from 'next/image'

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)



  return (
    <header className="bg-white/10 backdrop-blur-md fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and App Name */}
          <div className="flex items-center space-x-1">
            <div className="flex items-center space-x-2">
              <a href="/" className="hover:opacity-80 transition-opacity duration-300">
                <Image 
                  src="/images/logo/iconletter.png"
                  alt="STELLAR NEXUS"
                  width={80}
                  height={24}
                />
              </a>
              <p className="text-xs text-white/60">v{appConfig.version}</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <div className="flex items-center space-x-8">
                  {/* Demos */}
                  <Tooltip 
                    content={
                      <div>
                        <p className="text-white/90 text-sm font-medium">
                          Interactive Demo Suite
                        </p>
                        <p className="text-cyan-300 text-xs mt-1">
                          Experience trustless escrow workflows
                        </p>
                      </div>
                    }
                    position="bottom"
                  >
                    <a 
                      href="/demos" 
                      className="group relative transition-all duration-300 hover:scale-105"
                    >
                      <div className="relative flex items-center">
                        <Image 
                          src="/images/icons/demos.png"
                          alt="Demos"
                          width={50}
                          height={24}
                        />
                      </div>
                    </a>
                  </Tooltip>

                  {/* Games */}
                  <Tooltip 
                    content={
                      <div>
                        <p className="text-white/90 text-sm font-medium">
                          Mini-Games Collection
                        </p>
                        <p className="text-purple-300 text-xs mt-1">
                          Learn Web3 through interactive games
                        </p>
                      </div>
                    }
                    position="bottom"
                  >
                    <a 
                      href="/mini-games" 
                      className="group relative transition-all duration-300 hover:scale-105"
                    >
                      <div className="relative flex items-center">
                        <Image 
                          src="/images/icons/console.png"
                          alt="Store"
                          width={50}
                          height={24}
                        />
                      </div>
                    </a>
                  </Tooltip>

                  {/* Docs */}
                  <Tooltip 
                    content={
                      <div>
                        <p className="text-white/90 text-sm font-medium">
                          Documentation Hub
                        </p>
                        <p className="text-orange-300 text-xs mt-1">
                          Technical guides and API references
                        </p>
                      </div>
                    }
                    position="bottom"
                  >
                    <a 
                      href="/docs" 
                      className="group relative transition-all duration-300 hover:scale-105"
                    >
                      <div className="relative flex items-center">
                        <Image 
                          src="/images/icons/docs.png"
                          alt="Docs"
                          width={50}
                          height={24}
                        />
                      </div>
                    </a>
                  </Tooltip>
            </div>
          </nav>

          {/* Header Controls */}
          <div className="flex items-center space-x-4">
            {/* Network Indicator */}
            <div className="hidden sm:flex items-center space-x-2">
              <span className="text-xs text-white/60">Network:</span>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                stellarConfig.network === 'TESTNET' 
                  ? 'bg-warning-500/30 text-warning-200 border border-warning-400/30'
                  : 'bg-success-500/30 text-success-200 border border-success-400/30'
              }`}>
                {stellarConfig.network}
              </span>
            </div>

            {/* User Dropdown */}
            <UserDropdown />

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-white/80 hover:text-white transition-colors"
            >
              {isMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white/10 backdrop-blur-md border-t border-white/20 shadow-xl z-50">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <a
              href="/demos"
              className="block px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-md transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center space-x-2">
                <Image 
                  src="/images/icons/demos.png"
                  alt="Demos"
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
                <span>Demos</span>
              </div>
            </a>
            <a
              href="/mini-games"
              className="block px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-md transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center space-x-2">
                <Image 
                  src="/images/icons/store.png"
                  alt="Store"
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
                <span>Store</span>
              </div>
            </a>
            <a
              href="/mini-games/web3-basics-adventure"
              className="block px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-md transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center space-x-2">
                <Image 
                  src="/images/icons/console.png"
                  alt="Console"
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
                <span>Console</span>
              </div>
            </a>

            <a
              href="/docs"
              className="block px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-md transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center space-x-2">
                <Image 
                  src="/images/icons/docs.png"
                  alt="Docs"
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
                <span>Docs</span>
              </div>
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
