'use client'

import { useGlobalWallet } from '@/contexts/WalletContext'

interface UserAvatarProps {
  onClick?: () => void
  size?: 'sm' | 'md' | 'lg'
  showStatus?: boolean
}

export const UserAvatar = ({ onClick, size = 'md', showStatus = true }: UserAvatarProps) => {
  const { isConnected, walletData } = useGlobalWallet()

  // Generate initials from a two-word name (using wallet address as fallback)
  const generateInitials = (address: string) => {
    if (!address) return 'GU' // Guest User
    // Use the last 8 characters to create a two-word name
    const last8 = address.slice(-8)
    const word1 = last8.slice(0, 4)
    const word2 = last8.slice(4, 8)
    return `${word1.charAt(0).toUpperCase()}${word2.charAt(0).toUpperCase()}`
  }

  const initials = generateInitials(walletData?.publicKey || '')

  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg'
  }

  return (
    <div className="relative">
      <div
        onClick={onClick}
        className={`${sizeClasses[size]} bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl ${
          onClick ? 'hover:from-cyan-600 hover:to-purple-600' : ''
        }`}
      >
        {initials}
      </div>
      {showStatus && isConnected && (
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900 flex items-center justify-center">
          <span className="text-xs">✓</span>
        </div>
      )}
    </div>
  )
}
