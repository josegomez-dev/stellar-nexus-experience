'use client';

import { useState, useEffect } from 'react';
import { PixelArtAvatar, generateAvatarConfig } from '@/components/ui/avatar/PixelArtAvatar';
import { generateFunnyName, generateNameOptions, generateCategoryName } from '@/lib/funny-name-generator';
import { useAuth } from '@/contexts/AuthContext';
import { useGlobalWallet } from '@/contexts/WalletContext';
import { useToast } from '@/contexts/ToastContext';

interface ProfileUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileUpdateModal = ({ isOpen, onClose }: ProfileUpdateModalProps) => {
  const { user, updateUser } = useAuth();
  const { walletData } = useGlobalWallet();
  const { addToast } = useToast();
  
  const [customName, setCustomName] = useState(user?.customName || '');
  const [avatarSeed, setAvatarSeed] = useState(user?.avatarSeed || walletData?.publicKey || 'default');
  const [nameOptions, setNameOptions] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Generate name options when modal opens
  useEffect(() => {
    if (isOpen && walletData?.publicKey) {
      const options = generateNameOptions(walletData.publicKey, 8);
      setNameOptions(options);
    }
  }, [isOpen, walletData?.publicKey]);

  // Generate new avatar seed
  const generateNewAvatar = () => {
    const newSeed = Date.now().toString() + Math.random().toString();
    setAvatarSeed(newSeed);
  };

  // Generate new name options
  const generateNewNames = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const options = generateNameOptions(avatarSeed, 8);
      setNameOptions(options);
      setIsGenerating(false);
    }, 500);
  };

  // Generate name from specific category
  const generateCategoryNames = (category: 'web3' | 'stellar' | 'trustless' | 'tech' | 'creative') => {
    setIsGenerating(true);
    setTimeout(() => {
      const options = Array.from({ length: 8 }, (_, i) => 
        generateCategoryName(avatarSeed + i.toString(), category)
      );
      setNameOptions(options);
      setIsGenerating(false);
    }, 500);
  };

  // Save profile updates
  const handleSave = async () => {
    if (!walletData?.publicKey) {
      addToast({
        type: 'error',
        title: '❌ No Wallet Connected',
        message: 'Please connect your wallet first',
        duration: 3000,
      });
      return;
    }
    
    setIsSaving(true);
    try {
      if (user) {
        // Update existing user
        await updateUser({
          customName: customName.trim() || undefined,
          avatarSeed: avatarSeed,
        });
      } else {
        // Create new user with profile data
        // For now, we'll store in localStorage until user signs up
        const profileData = {
          customName: customName.trim() || undefined,
          avatarSeed: avatarSeed,
          walletAddress: walletData.publicKey,
        };
        localStorage.setItem(`profile_${walletData.publicKey}`, JSON.stringify(profileData));
      }
      
      addToast({
        type: 'success',
        title: '🎉 Profile Updated!',
        message: 'Your profile has been updated successfully',
        duration: 3000,
      });
      
      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
      addToast({
        type: 'error',
        title: '❌ Update Failed',
        message: 'Failed to update profile. Please try again.',
        duration: 3000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
      <div className='bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 max-w-2xl w-full border border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto'>
        {/* Header */}
        <div className='flex items-center justify-between mb-6'>
          <h3 className='text-2xl font-bold text-white flex items-center space-x-2'>
            <span className='text-3xl'>🎨</span>
            <span>Customize Your Profile</span>
          </h3>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-white transition-colors'
          >
            <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
            </svg>
          </button>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {/* Avatar Section */}
          <div className='space-y-4'>
            <h4 className='text-lg font-semibold text-white flex items-center space-x-2'>
              <span className='text-xl'>👤</span>
              <span>Your Avatar</span>
            </h4>
            
            <div className='bg-white/5 rounded-lg p-4 border border-white/10'>
              <div className='flex items-center justify-center mb-4'>
                <PixelArtAvatar seed={avatarSeed} size={120} className='rounded-lg' />
              </div>
              
              <button
                onClick={generateNewAvatar}
                className='w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105'
              >
                🎲 Generate New Avatar
              </button>
              
              <p className='text-xs text-gray-400 mt-2 text-center'>
                Each avatar is unique and generated from your seed
              </p>
            </div>
          </div>

          {/* Name Section */}
          <div className='space-y-4'>
            <h4 className='text-lg font-semibold text-white flex items-center space-x-2'>
              <span className='text-xl'>🏷️</span>
              <span>Your Name</span>
            </h4>
            
            <div className='bg-white/5 rounded-lg p-4 border border-white/10'>
              <div className='mb-4'>
                <label className='block text-sm font-medium text-gray-300 mb-2'>
                  Custom Name
                </label>
                <input
                  type='text'
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder='Enter your custom name...'
                  className='w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>

              <div className='mb-4'>
                <label className='block text-sm font-medium text-gray-300 mb-2'>
                  Or choose from generated names:
                </label>
                
                {/* Category buttons */}
                <div className='flex flex-wrap gap-2 mb-3'>
                  <button
                    onClick={() => generateCategoryNames('web3')}
                    className='px-3 py-1 bg-blue-500/20 border border-blue-400/30 text-blue-300 rounded text-xs hover:bg-blue-500/30 transition-colors'
                  >
                    Web3
                  </button>
                  <button
                    onClick={() => generateCategoryNames('stellar')}
                    className='px-3 py-1 bg-purple-500/20 border border-purple-400/30 text-purple-300 rounded text-xs hover:bg-purple-500/30 transition-colors'
                  >
                    Stellar
                  </button>
                  <button
                    onClick={() => generateCategoryNames('trustless')}
                    className='px-3 py-1 bg-green-500/20 border border-green-400/30 text-green-300 rounded text-xs hover:bg-green-500/30 transition-colors'
                  >
                    Trustless
                  </button>
                  <button
                    onClick={() => generateCategoryNames('tech')}
                    className='px-3 py-1 bg-orange-500/20 border border-orange-400/30 text-orange-300 rounded text-xs hover:bg-orange-500/30 transition-colors'
                  >
                    Tech
                  </button>
                  <button
                    onClick={() => generateCategoryNames('creative')}
                    className='px-3 py-1 bg-pink-500/20 border border-pink-400/30 text-pink-300 rounded text-xs hover:bg-pink-500/30 transition-colors'
                  >
                    Creative
                  </button>
                </div>

                {/* Name options */}
                <div className='space-y-2 max-h-32 overflow-y-auto'>
                  {isGenerating ? (
                    <div className='text-center py-4'>
                      <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-white mx-auto mb-2'></div>
                      <p className='text-gray-400 text-sm'>Generating names...</p>
                    </div>
                  ) : (
                    nameOptions.map((name, index) => (
                      <button
                        key={index}
                        onClick={() => setCustomName(name)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          customName === name
                            ? 'bg-blue-500/30 text-blue-200 border border-blue-400/50'
                            : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                        }`}
                      >
                        {name}
                      </button>
                    ))
                  )}
                </div>

                <button
                  onClick={generateNewNames}
                  disabled={isGenerating}
                  className='w-full mt-3 px-3 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-700 disabled:opacity-50 text-white rounded-lg text-sm transition-colors'
                >
                  {isGenerating ? 'Generating...' : '🎲 Generate More Names'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div className='mt-6 p-4 bg-white/5 rounded-lg border border-white/10'>
          <h4 className='text-lg font-semibold text-white mb-3 flex items-center space-x-2'>
            <span className='text-xl'>👁️</span>
            <span>Preview</span>
          </h4>
          
          <div className='flex items-center space-x-4'>
            <PixelArtAvatar seed={avatarSeed} size={64} className='rounded-lg' />
            <div>
              <h5 className='text-white font-semibold'>
                {customName || 'Your Custom Name'}
              </h5>
              <p className='text-gray-400 text-sm'>
                {user?.walletAddress?.slice(0, 6)}...{user?.walletAddress?.slice(-4)}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='mt-6 flex justify-end space-x-3'>
          <button
            onClick={onClose}
            className='px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors'
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className='px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:from-gray-600 disabled:to-gray-700 disabled:opacity-50 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105'
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};
