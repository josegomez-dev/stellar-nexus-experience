'use client';

import Image from "next/image";

interface PreloaderScreenProps {
  isLoading: boolean;
}

export const PreloaderScreen: React.FC<PreloaderScreenProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[99999] bg-gradient-to-br from-neutral-900 via-brand-900 to-neutral-900 flex items-center justify-center">
      {/* Simple animated background */}
      <div className='absolute inset-0 opacity-20 bg-gradient-to-r from-brand-500/10 via-transparent to-accent-500/10'></div>
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Loading Content */}
      <div className="relative z-10 text-center">
        {/* Image Logo */}
        <div className="flex justify-center">
          <Image className="animate-pulse" src="/images/logo/logoicon.png" alt="Stellar Nexus" width={150} height={150} />
        </div>
        {/* Title Text */}
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 mb-2">
          Stellar Nexus Experience
        </h2>
        <p className="text-white/70 text-lg animate-pulse">
          Web3 Early Adopters Program
        </p>

        {/* Pulsing Dots */}
        <div className="flex justify-center space-x-2 mt-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-brand-400 rounded-full animate-pulse"
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: '1s',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
