'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const handleStart = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      setIsVisible(false);
      onStart();
    }, 800);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`
        fixed inset-0 z-[9999] 
        bg-gradient-to-br from-neutral-900 via-brand-900 to-neutral-900
        transition-opacity duration-800 ease-in-out
        ${isFadingOut ? 'opacity-0' : 'opacity-100'}
      `}
    >
      {/* Animated background elements */}
      <div className='absolute inset-0 opacity-20 bg-gradient-to-r from-brand-500/10 via-transparent to-accent-500/10'></div>
      
      {/* Floating particles */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className='absolute w-1 h-1 bg-white rounded-full animate-twinkle'
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className='relative z-10 h-full flex flex-col items-center justify-center text-center px-4'>
        {/* Logo */}
        <div className='mb-8 animate-fadeInUp' style={{ animationDelay: '0.2s' }}>
          <Image
            src='/images/logo/logoicon.png'
            alt='STELLAR NEXUS'
            width={200}
            height={200}
            priority
            className='w-48 h-48 md:w-64 md:h-64 drop-shadow-2xl'
          />
        </div>

        {/* Main Title */}
        <h1
          className={`
            text-4xl md:text-6xl lg:text-7xl font-bold 
            text-transparent bg-clip-text 
            bg-gradient-to-r from-brand-400 via-accent-400 to-brand-400
            mb-6
            animate-fadeInUp
            drop-shadow-[0_0_30px_rgba(14,165,233,0.5)]
          `}
          style={{ animationDelay: '0.4s' }}
        >
          NEXUS STELLAR
        </h1>

        {/* Subtitle */}
        <p
          className={`
            text-xl md:text-2xl lg:text-3xl 
            text-white/90 
            mb-12
            animate-fadeInUp
            drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]
          `}
          style={{ animationDelay: '0.6s' }}
        >
          Web3 Early Adopters Program
        </p>

        {/* Start Button */}
        <div
          className='animate-fadeInUp'
          style={{ animationDelay: '0.8s' }}
        >
          <button
            onClick={handleStart}
            className={`
              relative px-12 py-6 font-bold rounded-xl 
              transition-all duration-500 transform 
              shadow-2xl border-2 text-2xl
              hover:scale-110 hover:rotate-1
              bg-gradient-to-r from-brand-500 via-accent-500 to-brand-600
              hover:from-brand-600 hover:via-accent-600 hover:to-brand-700
              text-white border-white/30 hover:border-white/60
              hover:shadow-brand-500/50
            `}
          >
            {/* Button Content */}
            <div className='flex items-center space-x-4'>
              <span className='text-2xl font-bold'>START</span>
              <span className='text-xl'>🚀</span>
            </div>

            {/* Hover Effects */}
            <div className='absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300'></div>
            
            {/* Floating particles around button */}
            <div className='absolute inset-0 overflow-hidden rounded-xl pointer-events-none'>
              <div className='absolute top-2 left-1/4 w-1 h-1 bg-brand-400 rounded-full animate-ping opacity-70'></div>
              <div
                className='absolute top-4 right-1/3 w-1 h-1 bg-accent-400 rounded-full animate-ping opacity-80'
                style={{ animationDelay: '0.5s' }}
              ></div>
              <div
                className='absolute bottom-2 left-1/3 w-1 h-1 bg-brand-300 rounded-full animate-ping opacity-60'
                style={{ animationDelay: '1s' }}
              ></div>
              <div
                className='absolute bottom-4 right-1/4 w-1 h-1 bg-accent-300 rounded-full animate-ping opacity-90'
                style={{ animationDelay: '1.5s' }}
              ></div>
            </div>
          </button>
        </div>

        {/* Glowing Ring Animation */}
        <div className='absolute inset-0 flex items-center justify-center pointer-events-none'>
          <div className='relative w-80 h-80 md:w-96 md:h-96'>
            <div className='absolute inset-0 rounded-full border-2 border-brand-400/30 animate-ping' />
            <div
              className='absolute inset-4 rounded-full border-2 border-accent-400/30 animate-ping'
              style={{ animationDelay: '0.5s' }}
            />
            <div
              className='absolute inset-8 rounded-full border-2 border-brand-300/30 animate-ping'
              style={{ animationDelay: '1s' }}
            />
          </div>
        </div>
      </div>

      {/* Vignette Effect */}
      <div className='absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.4)_100%)]' />
    </div>
  );
};
