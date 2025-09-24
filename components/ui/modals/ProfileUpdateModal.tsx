'use client';

import React, { useState, useEffect } from 'react';
import RandomPixelAvatar, { AvatarStyles } from './RandomPixelAvatar';
import { generateFunnyName, generateNameOptions, generateStellarName, generateWeb3Name, generateTrustlessName } from '@/lib/name-generator';

interface ProfileUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentName?: string;
  currentAvatarSeed?: number;
  onSave: (name: string, avatarSeed: number) => Promise<void>;
}

export const ProfileUpdateModal: React.FC<ProfileUpdateModalProps> = ({
  isOpen,
  onClose,
  currentName = '',
  currentAvatarSeed,
  onSave,
}) => {
  const [name, setName] = useState(currentName);
  const [avatarSeed, setAvatarSeed] = useState(currentAvatarSeed || Math.floor(Math.random() * 1000000));
  const [nameOptions, setNameOptions] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<keyof typeof AvatarStyles>('default');

  useEffect(() => {
    if (isOpen) {
      setName(currentName);
      setAvatarSeed(currentAvatarSeed || Math.floor(Math.random() * 1000000));
      setNameOptions(generateNameOptions(6));
    }
  }, [isOpen, currentName, currentAvatarSeed]);

  const handleGenerateName = () => {
    setNameOptions(generateNameOptions(6));
  };

  const handleGenerateStellarName = () => {
    setNameOptions([generateStellarName(), ...generateNameOptions(5)]);
  };

  const handleGenerateWeb3Name = () => {
    setNameOptions([generateWeb3Name(), ...generateNameOptions(5)]);
  };

  const handleGenerateTrustlessName = () => {
    setNameOptions([generateTrustlessName(), ...generateNameOptions(5)]);
  };

  const handleGenerateAvatar = () => {
    setAvatarSeed(Math.floor(Math.random() * 1000000));
  };

  const handleSave = async () => {
    if (!name.trim()) return;
    
    setIsSaving(true);
    try {
      await onSave(name.trim(), avatarSeed);
      onClose();
    } catch (error) {
      console.error('Failed to save profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 max-w-2xl w-full border border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-white flex items-center space-x-2">
            <span className="text-3xl">🎭</span>
            <span>Customize Your Profile</span>
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Avatar Section */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white flex items-center space-x-2">
              <span className="text-xl">🖼️</span>
              <span>Your Avatar</span>
            </h4>
            
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <RandomPixelAvatar
                  size={120}
                  seed={avatarSeed}
                  {...AvatarStyles[selectedStyle]}
                  className="rounded-lg border-2 border-white/20"
                />
                <button
                  onClick={handleGenerateAvatar}
                  className="absolute -top-2 -right-2 w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center text-sm transition-colors"
                  title="Generate new avatar"
                >
                  🔄
                </button>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Avatar Style</label>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(AvatarStyles).map((style) => (
                    <button
                      key={style}
                      onClick={() => setSelectedStyle(style as keyof typeof AvatarStyles)}
                      className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                        selectedStyle === style
                          ? 'bg-blue-600 text-white'
                          : 'bg-white/10 text-gray-300 hover:bg-white/20'
                      }`}
                    >
                      {style.charAt(0).toUpperCase() + style.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Name Section */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white flex items-center space-x-2">
              <span className="text-xl">📝</span>
              <span>Your Name</span>
            </h4>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Custom Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your custom name..."
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Or pick a generated name</label>
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {nameOptions.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => setName(option)}
                        className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                          name === option
                            ? 'bg-green-600 text-white'
                            : 'bg-white/10 text-gray-300 hover:bg-white/20'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    <button
                      onClick={handleGenerateName}
                      className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition-colors"
                    >
                      🎲 Random
                    </button>
                    <button
                      onClick={handleGenerateStellarName}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
                    >
                      ⭐ Stellar
                    </button>
                    <button
                      onClick={handleGenerateWeb3Name}
                      className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors"
                    >
                      🌐 Web3
                    </button>
                    <button
                      onClick={handleGenerateTrustlessName}
                      className="px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm transition-colors"
                    >
                      🔒 Trustless
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
          <h4 className="text-lg font-semibold text-white mb-3 flex items-center space-x-2">
            <span className="text-xl">👀</span>
            <span>Preview</span>
          </h4>
          <div className="flex items-center space-x-4">
            <RandomPixelAvatar
              size={60}
              seed={avatarSeed}
              {...AvatarStyles[selectedStyle]}
              className="rounded-lg border border-white/20"
            />
            <div>
              <p className="text-white font-medium">{name || 'Your Name'}</p>
              <p className="text-gray-400 text-sm">Stellar Nexus User</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim() || isSaving}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center space-x-2"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <span>💾</span>
                <span>Save Profile</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
