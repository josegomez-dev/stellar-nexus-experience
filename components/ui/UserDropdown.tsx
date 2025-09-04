'use client'

import { useState, useRef, useEffect } from 'react'
import { useGlobalWallet } from '@/contexts/WalletContext'
import { appConfig, stellarConfig } from '@/lib/wallet-config'
import { UserAvatar } from './UserAvatar'

export const UserDropdown = () => {
  const { isConnected, walletData, disconnect } = useGlobalWallet()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Generate display name from wallet address
  const generateDisplayName = (address: string) => {
    if (!address) return 'Guest User'
    const last8 = address.slice(-8)
    const word1 = last8.slice(0, 4)
    const word2 = last8.slice(4, 8)
    return `${word1.charAt(0).toUpperCase()}${word1.slice(1)} ${word2.charAt(0).toUpperCase()}${word2.slice(1)}`
  }

  const displayName = generateDisplayName(walletData?.publicKey || '')

  const handleDisconnect = () => {
    disconnect()
    setIsOpen(false)
  }

  const copyWalletAddress = () => {
    if (walletData?.publicKey) {
      navigator.clipboard.writeText(walletData.publicKey)
      // You could add a toast notification here
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Button */}
      <UserAvatar 
        onClick={() => setIsOpen(!isOpen)}
        size="md"
        showStatus={true}
      />

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl z-50 overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <UserAvatar size="lg" showStatus={false} />
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold text-sm truncate">
                  {displayName}
                </h3>
                <p className="text-white/60 text-xs truncate">
                  {isConnected ? `${walletData?.publicKey?.slice(0, 6)}...${walletData?.publicKey?.slice(-4)}` : 'Not Connected'}
                </p>
              </div>
            </div>
          </div>

          {/* Network Status */}
          <div className="px-4 py-2 border-b border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-white/60 text-xs">Network:</span>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                stellarConfig.network === 'TESTNET' 
                  ? 'bg-warning-500/30 text-warning-200 border border-warning-400/30'
                  : 'bg-success-500/30 text-success-200 border border-success-400/30'
              }`}>
                {stellarConfig.network}
              </span>
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-2">
            {isConnected ? (
              <>
                <button
                  onClick={copyWalletAddress}
                  className="w-full flex items-center space-x-3 px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200 text-sm"
                >
                  <span className="text-lg">📋</span>
                  <span>Copy Address</span>
                </button>
                
                <button
                  onClick={handleDisconnect}
                  className="w-full flex items-center space-x-3 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors duration-200 text-sm"
                >
                  <span className="text-lg">🔌</span>
                  <span>Disconnect</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  // Dispatch custom event to open wallet sidebar
                  window.dispatchEvent(new CustomEvent('toggleWalletSidebar'))
                  // Also dispatch an event to expand the sidebar
                  setTimeout(() => {
                    window.dispatchEvent(new CustomEvent('expandWalletSidebar'))
                  }, 100)
                  setIsOpen(false)
                }}
                className="w-full flex items-center space-x-3 px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200 text-sm"
              >
                <span className="text-lg">🔗</span>
                <span>Connect Wallet</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
