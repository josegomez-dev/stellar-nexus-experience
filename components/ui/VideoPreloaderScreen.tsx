'use client';

import { useState, useEffect, useRef } from 'react';

interface VideoPreloaderScreenProps {
  isLoading: boolean;
  videoPath?: string;
  audioPath?: string;
  secondaryAudioPath?: string;
  title?: string;
  subtitle?: string;
  showText?: boolean;
  showVideoAfterLoad?: boolean; // Play video after loading completes
  minDuration?: number; // Minimum duration to show preloader (ms)
  audioVolumes?: {
    primary: number;
    secondary: number;
  };
  onComplete?: () => void; // Callback when everything is complete
}

export const VideoPreloaderScreen: React.FC<VideoPreloaderScreenProps> = ({
  isLoading,
  videoPath = '/videos/preloader.mp4',
  audioPath = '/sounds/intro.mp3',
  secondaryAudioPath = '/sounds/nexus_voice.mp3',
  title = 'STELLAR NEXUS EXPERIENCE',
  subtitle = 'Web3 Early Adopters Program',
  showText = true,
  showVideoAfterLoad = true,
  minDuration = 2000,
  audioVolumes = { primary: 0.3, secondary: 0.5 },
  onComplete,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [starPositions, setStarPositions] = useState<Array<{left: string, top: string, delay: string, duration: string}>>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioPlayedRef = useRef(false);

  // Generate star positions on client side only
  useEffect(() => {
    const positions = [...Array(20)].map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 3}s`,
      duration: `${2 + Math.random() * 3}s`,
    }));
    setStarPositions(positions);
  }, []);

  // Handle loading complete
  useEffect(() => {
    if (!isLoading && !loadingComplete) {
      setLoadingComplete(true);
      
      if (showVideoAfterLoad) {
        // Start playing video immediately for fluid transition
        setTimeout(() => {
          setIsVideoPlaying(true);
          
          // Play audio when video starts (only once)
          if (!audioPlayedRef.current) {
            audioPlayedRef.current = true;
            try {
              if (audioPath) {
                const audio = new Audio(audioPath);
                audio.volume = audioVolumes.primary;
                audio.play().catch(() => {}); // Silent fallback
              }
              
              if (secondaryAudioPath) {
                const audio2 = new Audio(secondaryAudioPath);
                audio2.volume = audioVolumes.secondary;
                audio2.play().catch(() => {}); // Silent fallback
              }
            } catch (error) {
              // Silent fallback if audio fails
            }
          }
        }, 100);
      } else {
        // No video, just fade out
        handleComplete();
      }
    }
  }, [isLoading, loadingComplete, showVideoAfterLoad, audioPath, secondaryAudioPath, audioVolumes]);

  // Handle video ended
  const handleVideoEnded = () => {
    handleComplete();
  };

  // Handle completion
  const handleComplete = () => {
    setIsFadingOut(true);
    
    setTimeout(() => {
      setIsVisible(false);
      setIsFadingOut(false);
      onComplete?.();
    }, 800); // Smooth and quick fade out
  };

  if (!isVisible) return null;

  return (
    <div
      className={`
        fixed inset-0 z-[99999] 
        bg-black
        transition-opacity duration-1000 ease-in-out
        ${isFadingOut ? 'opacity-0' : 'opacity-100'}
      `}
    >
      {/* Full-screen Video Background */}
      {showVideoAfterLoad && isVideoPlaying && (
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          onLoadedData={() => setVideoLoaded(true)}
          onEnded={handleVideoEnded}
          className={`
            absolute inset-0 w-full h-full object-cover
            transition-opacity duration-1000
            ${videoLoaded ? 'opacity-100' : 'opacity-0'}
          `}
        >
          <source src={videoPath} type='video/mp4' />
          Your browser does not support the video tag.
        </video>
      )}

      {/* Background for loading phase (when video isn't playing yet) */}
      {!isVideoPlaying && (
        <div className='absolute inset-0 bg-gradient-to-br from-neutral-900 via-brand-900 to-neutral-900' />
      )}

      {/* Gradient Overlay for better text readability */}
      {showText && (
        <div className='absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 z-10' />
      )}

      {/* Animated Particles Overlay */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none z-20'>
        {starPositions.map((position, i) => (
          <div
            key={i}
            className='absolute w-1 h-1 bg-white rounded-full animate-twinkle'
            style={{
              left: position.left,
              top: position.top,
              animationDelay: position.delay,
              animationDuration: position.duration,
            }}
          />
        ))}
      </div>

      {/* Content Overlay */}
      {showText && (
        <div className='absolute inset-0 z-30 flex flex-col items-center justify-center text-center px-4'>
          {/* Main Title */}
          <h1
            className={`
              text-5xl md:text-7xl lg:text-8xl font-bold 
              text-transparent bg-clip-text 
              bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600
              mb-6
              animate-fadeInUp
              drop-shadow-[0_0_30px_rgba(59,130,246,0.5)]
              transition-opacity duration-500
              ${isVideoPlaying && videoLoaded ? 'opacity-100' : isLoading ? 'opacity-0' : 'opacity-100'}
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
              transition-opacity duration-500
              ${isVideoPlaying && videoLoaded ? 'opacity-100' : 'opacity-90'}
            `}
            style={{ animationDelay: '0.4s' }}
          >
            {subtitle}
          </p>

          {/* Loading Indicator - Only show during loading */}
          {isLoading && (
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
          )}

          {/* Glowing Ring Animation - Only show during loading */}
          {isLoading && (
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
          )}
        </div>
      )}

      {/* Vignette Effect */}
      <div className='absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.4)_100%)] z-20' />
    </div>
  );
};

