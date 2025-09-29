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
  currentStep?: number;
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
  currentStep = 0,
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
        <p className='text-xl text-brand-300 mb-8 animate-pulse'>{subtitle}</p>

        {/* Enhanced Loading Bar */}
        <div className='w-96 h-4 bg-white/10 rounded-full overflow-hidden mx-auto mb-8 relative'>
          <div
            className='h-full bg-gradient-to-r from-brand-500 via-brand-600 to-accent-600 rounded-full transition-all duration-700 ease-out relative'
            style={{ width: `${loadingProgress}%` }}
          >
            {/* Shimmer effect */}
            <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse'></div>
          </div>
          {/* Progress bar glow */}
          <div 
            className='absolute top-0 h-full bg-gradient-to-r from-brand-400/50 to-accent-400/50 rounded-full blur-sm transition-all duration-700 ease-out'
            style={{ width: `${loadingProgress}%` }}
          ></div>
        </div>

        {/* Current Loading Step */}
        <div className='mb-6'>
          <p className='text-lg text-brand-300 font-medium animate-pulse'>
            {loadingSteps[currentStep] || loadingSteps[loadingSteps.length - 1]}
          </p>
        </div>

        {/* Loading Steps Progress */}
        <div className='space-y-1 text-white/60 max-w-md mx-auto'>
          {loadingSteps.map((step, index) => (
            <div
              key={index}
              className={`flex items-center space-x-2 transition-all duration-300 ${
                index <= currentStep ? 'text-brand-300' : 'text-white/40'
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index < currentStep 
                    ? 'bg-brand-400' 
                    : index === currentStep 
                    ? 'bg-brand-400 animate-pulse' 
                    : 'bg-white/20'
                }`}
              ></div>
              <span className='text-sm'>{step}</span>
            </div>
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
