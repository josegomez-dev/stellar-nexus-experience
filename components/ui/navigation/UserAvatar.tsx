'use client';

import { useGlobalWallet } from '@/contexts/WalletContext';
import { useAuth } from '@/contexts/AuthContext';
import { PixelArtAvatar } from '@/components/ui/avatar/PixelArtAvatar';

interface UserAvatarProps {
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  showStatus?: boolean;
}

export const UserAvatar = ({ onClick, size = 'md', showStatus = true }: UserAvatarProps) => {
  const { isConnected, walletData } = useGlobalWallet();
  const { user } = useAuth();

  // Use custom avatar seed if available, otherwise fall back to wallet address
  const getAvatarSeed = () => {
    if (user?.avatarSeed) return user.avatarSeed;
    if (walletData?.publicKey) {
      // Check localStorage for profile data
      try {
        const profileData = localStorage.getItem(`profile_${walletData.publicKey}`);
        if (profileData) {
          const parsed = JSON.parse(profileData);
          return parsed.avatarSeed || walletData.publicKey;
        }
      } catch (error) {
        console.error('Error reading profile data:', error);
      }
      return walletData.publicKey;
    }
    return 'default';
  };

  const avatarSeed = getAvatarSeed();

  const sizeClasses = {
    sm: 32,
    md: 40,
    lg: 48,
  };

  const pixelSize = sizeClasses[size];

  return (
    <div className='relative'>
      <div
        onClick={onClick}
        className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl ${
          onClick ? 'hover:shadow-2xl' : ''
        }`}
      >
        <PixelArtAvatar 
          seed={avatarSeed} 
          size={pixelSize} 
          className='rounded-lg border-2 border-white/20 hover:border-white/40 transition-colors'
        />
      </div>
      {showStatus && isConnected && (
        <div className='absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900 flex items-center justify-center'>
          <span className='text-xs'>✓</span>
        </div>
      )}
    </div>
  );
};
