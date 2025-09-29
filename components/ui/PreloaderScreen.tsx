'use client';

import Image from 'next/image';

interface PreloaderScreenProps {
  isLoading: boolean;
  loadingProgress: number;
  title?: string;
  subtitle?: string;
  loadingSteps?: string[];
  logoPath?: string;
  logoAlt?: string;
}

export const PreloaderScreen: React.FC<PreloaderScreenProps> = ({
  isLoading,
  loadingProgress,
  title = 'INITIALIZING STELLAR NEXUS EXPERIENCE',
  subtitle = 'Preparing your trustless work experience...',
  loadingSteps = [
    'Connecting to Stellar Network...',
    'Loading Smart Contracts...',
    'Preparing Demo Suite...',
    'Launching STELLAR NEXUS EXPERIENCE...',
  ],
  logoPath = '/images/logo/logoicon.png',
  logoAlt = 'STELLAR NEXUS',
}) => {
  if (!isLoading) return null;

  return (
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
            src={logoPath}
            alt={logoAlt}
            width={120}
            height={120}
            className='w-30 h-30'
            style={{ width: 'auto', height: 'auto' }}
          />
        </div>

        {/* Loading Text */}
        <h1 className='text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-brand-500 to-accent-600 mb-6 animate-pulse'>
          {title}
        </h1>

        {/* Subtitle */}
        <p className='text-xl text-brand-300 mb-8 animate-pulse'>
          {subtitle}
        </p>

        {/* Loading Bar */}
        <div className='w-80 h-3 bg-white/10 rounded-full overflow-hidden mx-auto mb-8'>
          <div
            className='h-full bg-gradient-to-r from-brand-500 via-brand-600 to-accent-600 rounded-full transition-all duration-500 ease-out'
            style={{ width: `${loadingProgress}%` }}
          ></div>
        </div>

        {/* Loading Steps */}
        <div className='space-y-2 text-white/80'>
          {loadingSteps.map((step, index) => (
            <p 
              key={index}
              className='animate-fadeInUp' 
              style={{ animationDelay: `${0.5 + (index * 0.5)}s` }}
            >
              {step}
            </p>
          ))}
        </div>

        {/* Progress Percentage */}
        <div className='mt-8 text-brand-300 text-lg'>
          <span className='font-bold'>{loadingProgress}%</span> Complete
        </div>
      </div>
    </div>
  );
};
