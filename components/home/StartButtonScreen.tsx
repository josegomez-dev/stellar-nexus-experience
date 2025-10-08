'use client';

import Image from 'next/image';

interface StartButtonScreenProps {
  onStart: () => void;
}

export const StartButtonScreen = ({ onStart }: StartButtonScreenProps) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-[100000]">
      {/* Animated background elements */}
      <div className='absolute inset-0 opacity-20 bg-gradient-to-r from-brand-500/10 via-transparent to-accent-500/10'></div>
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
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

      <div className="text-center px-4 -mt-24 relative z-10">
        {/* Logo */}
        <div className='flex justify-center'>
          <Image
            src='/images/logo/logoicon.png'
            alt='STELLAR NEXUS'
            width={200}
            height={200}
            priority
            className="animate-pulse"
          />
        </div>

        <p className="text-xl md:text-2xl lg:text-3xl text-white/90 mb-6 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
          Web3 Early Adopters Program
        </p>
        
        {/* Start Button */}
        <div className="relative group">
          {/* Main Button */}
          <button
            onClick={onStart}
            className='relative px-12 py-6 hover:from-blue-700 hover:to-blue-800 font-bold rounded-2xl transition-all duration-500 transform shadow-2xl border-2 text-2xl hover:scale-110 text-white border-blue-400/50 hover:border-blue-300/70'
          >
            {/* Button Content */}
            <div className='flex items-center justify-center space-x-4'>
              <span>START EXPERIENCE</span>
            </div>

            {/* Hover Effects */}
            <div className='absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
          </button>
        </div>

        {/* Loading Indicator */}
        <div className="mt-8 animate-fadeInUp">
          <p className="text-white/60 text-sm mt-4">
            Click to begin your journey into the <span className="text-blue-300">Stellar Nexus Experience</span>
          </p>
        </div>

        {/* Powered by Trustless Work */}
        <div className='text-center mt-4'>
          <p className='text-blue-300/70 text-sm font-medium animate-pulse'>
            Powered by{' '}
            <span className='text-blue-200 font-semibold'>Trustless Work</span>
          </p>
        </div>
      </div>
    </div>
  );
};

