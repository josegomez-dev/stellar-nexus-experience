'use client';

import { useState, useEffect } from 'react';

interface VideoPreloaderScreenProps {
  isLoading: boolean;
  videoPath?: string;
  title?: string;
  subtitle?: string;
  showText?: boolean;
  minDuration?: number; // Minimum duration to show preloader (ms)
}

export const VideoPreloaderScreen: React.FC<VideoPreloaderScreenProps> = ({
  isLoading,
  videoPath = '/videos/preloader.mp4',
  title = 'STELLAR NEXUS',
  subtitle = 'Welcome to the future of trustless work',
  showText = true,
  minDuration = 2000, // Show for at least 2 seconds
}) => {
  const [isVisible, setIsVisible] = useState(isLoading);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    if (!isLoading && isVisible) {
      // Start fade out animation
      setIsFadingOut(true);
      
      // Wait for animation to complete before hiding
      const timer = setTimeout(() => {
        setIsVisible(false);
        setIsFadingOut(false);
      }, 800); // Match transition duration

      return () => clearTimeout(timer);
    } else if (isLoading && !isVisible) {
      setIsVisible(true);
    }
  }, [isLoading, isVisible]);

  // Ensure minimum display duration
  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        // Allow preloader to close after minimum duration
      }, minDuration);

      return () => clearTimeout(timer);
    }
  }, [isLoading, minDuration]);

  if (!isVisible) return null;

  return (
    <div
      className={`
        fixed inset-0 z-[9999] 
        bg-black
        transition-opacity duration-800 ease-in-out
        ${isFadingOut ? 'opacity-0' : 'opacity-100'}
      `}
    >
      {/* Full-screen Video Background */}
      <div className='absolute inset-0 overflow-hidden'>
        <video
          autoPlay
          loop
          muted
          playsInline
          onLoadedData={() => setVideoLoaded(true)}
          className={`
            absolute top-1/2 left-1/2 
            min-w-full min-h-full 
            w-auto h-auto 
            -translate-x-1/2 -translate-y-1/2
            object-cover
            transition-opacity duration-1000
            ${videoLoaded ? 'opacity-100' : 'opacity-0'}
          `}
        >
          <source src={videoPath} type='video/mp4' />
          Your browser does not support the video tag.
        </video>

        {/* Gradient Overlay for better text readability */}
        {showText && (
          <div className='absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60'></div>
        )}

        {/* Animated Particles Overlay */}
        <div className='absolute inset-0 overflow-hidden pointer-events-none'>
          {[...Array(20)].map((_, i) => (
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
      </div>

      {/* Content Overlay */}
      {showText && (
        <div className='relative z-10 h-full flex flex-col items-center justify-center text-center px-4'>
          {/* Main Title */}
          <h1
            className={`
              text-5xl md:text-7xl lg:text-8xl font-bold 
              text-transparent bg-clip-text 
              bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600
              mb-6
              animate-fadeInUp
              drop-shadow-[0_0_30px_rgba(59,130,246,0.5)]
            `}
            style={{ animationDelay: '0.2s' }}
          >
            {title}
          </h1>

          {/* Subtitle */}
          <p
            className={`
              text-xl md:text-2xl lg:text-3xl 
              text-white/90 
              mb-8
              animate-fadeInUp
              drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]
            `}
            style={{ animationDelay: '0.4s' }}
          >
            {subtitle}
          </p>

          {/* Loading Indicator */}
          <div
            className='animate-fadeInUp'
            style={{ animationDelay: '0.6s' }}
          >
            {/* Pulsing Dots */}
            <div className='flex space-x-2'>
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className='w-3 h-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse'
                  style={{
                    animationDelay: `${i * 0.2}s`,
                    animationDuration: '1s',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Glowing Ring Animation */}
          <div className='absolute inset-0 flex items-center justify-center pointer-events-none'>
            <div className='relative w-64 h-64 md:w-96 md:h-96'>
              <div className='absolute inset-0 rounded-full border-2 border-cyan-400/30 animate-ping' />
              <div
                className='absolute inset-4 rounded-full border-2 border-purple-400/30 animate-ping'
                style={{ animationDelay: '0.5s' }}
              />
              <div
                className='absolute inset-8 rounded-full border-2 border-blue-400/30 animate-ping'
                style={{ animationDelay: '1s' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Vignette Effect */}
      <div className='absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.4)_100%)]' />
    </div>
  );
};

