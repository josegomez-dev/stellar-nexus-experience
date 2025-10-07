'use client';

import Image from 'next/image';
import { Tooltip } from '@/components/ui/Tooltip';

interface HeroSectionProps {
  isVideoPlaying: boolean;
  miniGamesUnlocked: boolean;
  onTutorialClick: () => void;
  onTechTreeClick: () => void;
  isConnected: boolean;
}

export const HeroSection = ({
  isVideoPlaying,
  miniGamesUnlocked,
  onTutorialClick,
  onTechTreeClick,
  isConnected,
}: HeroSectionProps) => {
  return (
    <section className={`container mx-auto px-4 py-16 ${!isVideoPlaying ? 'animate-fadeIn' : 'opacity-0'}`}>
      <div className='text-center'>
        {/* Page Header */}
        <div className='text-center mb-16'>
          <div className='flex justify-center mb-6'>
            <Image
              src='/images/logo/logoicon.png'
              alt='STELLAR NEXUS'
              width={300}
              height={300}
              priority
              style={{ zIndex: -1, position: 'relative', width: 'auto', height: 'auto' }}
            />
          </div>

          {/* Epic Legendary Background for Title */}
          <div className='relative mb-8'>
            {/* Legendary Energy Background */}
            <div className='absolute inset-0 flex justify-center items-center pointer-events-none'>
              {/* Primary Energy Core */}
              <div className='relative w-[500px] h-40'>
                {/* Inner Energy Ring */}
                <div className='absolute inset-0 rounded-full bg-gradient-to-r from-brand-500/40 via-accent-500/50 to-brand-400/40 blur-lg scale-150'></div>

                {/* Middle Energy Ring */}
                <div className='absolute inset-0 rounded-full bg-gradient-to-r from-accent-500/30 via-brand-500/40 to-accent-400/30 blur-xl scale-200'></div>

                {/* Outer Energy Ring */}
                <div className='absolute inset-0 rounded-full bg-gradient-to-r from-brand-400/20 via-accent-500/30 to-brand-300/20 blur-2xl scale-250'></div>
              </div>

              {/* Energy Wave Rings */}
              <div className='absolute inset-0'>
                <div
                  className='absolute inset-0 rounded-full border-2 border-brand-400/40 animate-ping scale-150'
                  style={{ animationDuration: '4s' }}
                ></div>
                <div
                  className='absolute inset-0 rounded-full border border-accent-400/30 animate-ping scale-200'
                  style={{ animationDuration: '5s' }}
                ></div>
                <div
                  className='absolute inset-0 rounded-full border border-brand-300/25 animate-ping scale-250'
                  style={{ animationDuration: '6s' }}
                ></div>
              </div>
            </div>

            {/* Title with Enhanced Styling */}
            <h1
              className='relative z-10 text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-accent-400 to-brand-400 mb-6 drop-shadow-2xl'
              style={{ zIndex: 1000, marginTop: '-243.5px' }}
            >
              STELLAR NEXUS EXPERIENCE
            </h1>
          </div>

          <br />
          <br />
          <br />
          <div className='text-center mb-4'>
            <p className='text-brand-300/70 text-sm font-medium animate-pulse'>
              Early adopters. Real builders. Stellar impact.
            </p>
            <p className='text-xl text-white/80 max-w-3xl mx-auto mb-6'>
              Master the art of <span className='text-brand-200 font-semibold'>Trustless Work</span> with our demo suite on <span className='text-brand-200 font-semibold'>Stellar</span> blockchain
            </p>
          </div>
          <br />

          {/* Tutorial Buttons */}
          <div className='flex justify-center gap-6 mb-8'>
            <Tooltip content='Scroll down to the tutorial section'>
              <button
                onClick={() => {
                  const tutorialSection = document.getElementById('interactive-tutorial');
                  if (tutorialSection) {
                    tutorialSection.scrollIntoView({
                      behavior: 'smooth',
                      block: 'start',
                    });
                  }
                }}
                className='px-8 py-4 bg-gradient-to-r from-brand-500 to-accent-500 hover:from-brand-600 hover:to-accent-600 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border-2 border-white/20 hover:border-white/40 flex items-center space-x-3'
              >
                <span className='text-xl'>👨‍🏫&nbsp;</span>
                <span>Tutorial</span>
                <span className='text-xl'>&nbsp;→</span>
              </button>
            </Tooltip>

            <Tooltip content='Explore the Trustless Work Tech Tree'>
              <button
                onClick={onTechTreeClick}
                disabled={false}
                className='px-8 py-4 font-bold rounded-xl transition-all duration-300 flex items-center space-x-3 bg-gradient-to-r from-brand-500/20 to-accent-500/20 hover:from-brand-800/50 hover:to-accent-800/50 text-white transform hover:scale-105 shadow-lg hover:shadow-xl border-2 border-white/20 hover:border-white/40'
              >
                <span>Trustless Work Tech Tree</span>
                <span className='text-xl'>
                  <Image
                    src='/images/icons/demos.png'
                    alt='Trustless Work Tech Tree'
                    width={50}
                    height={20}
                    style={{ width: 'auto', height: 'auto' }}
                  />
                </span>
                {!isConnected && (
                  <span className='absolute -top-1 -right-1 text-xs bg-blue-500 text-white px-2 py-1 rounded-full font-medium shadow-lg'>
                    👁️ View
                  </span>
                )}
              </button>
            </Tooltip>

            <div className={`relative ${miniGamesUnlocked ? 'animate-pulse hover:animate-none cursor-pointer' : ''}`}>
              {/* Wave Effect - Only show when unlocked */}
              {miniGamesUnlocked && (
                <>
                  {/* Pulsing Ring Animation */}
                  <div className='absolute -inset-4 rounded-2xl bg-gradient-to-r from-brand-500/30 to-accent-500/30 blur-lg animate-ping opacity-75'></div>
                  <div className='absolute -inset-2 rounded-xl bg-gradient-to-r from-brand-400/40 to-accent-400/40 blur-md animate-pulse opacity-60'></div>
                  <div className='absolute -inset-1 rounded-lg bg-gradient-to-r from-brand-300/50 to-accent-300/50 blur-sm animate-pulse opacity-40'></div>
                </>
              )}

              <Tooltip
                position='bottom'
                content={
                  miniGamesUnlocked
                    ? 'Explore the Nexus Web3 Playground'
                    : 'Complete all demos and earn all badges to unlock the Nexus Web3 Playground'
                }
              >
                <a
                  href={miniGamesUnlocked ? '/mini-games' : '#'}
                  onClick={e => {
                    if (!miniGamesUnlocked) {
                      e.preventDefault();
                    }
                  }}
                  className={`relative px-8 py-4 font-bold rounded-xl transition-all duration-300 flex items-center space-x-3 transform shadow-lg border-2 ${
                    miniGamesUnlocked
                      ? 'bg-gradient-to-r from-brand-500 to-accent-500 hover:from-brand-600 hover:to-accent-600 text-white hover:scale-105 hover:shadow-xl border-white/20 hover:border-white/40 cursor-pointer hover:animate-none'
                      : 'bg-gray-600 text-gray-400 border-gray-600 cursor-not-allowed'
                  }`}
                  title={
                    miniGamesUnlocked
                      ? 'Explore the Nexus Web3 Playground'
                      : 'Complete all demos and earn all badges to unlock the Nexus Web3 Playground'
                  }
                >
                  <span>
                    {miniGamesUnlocked ? 'Nexus Web3 Playground' : '🔒 Nexus Web3 Playground'}
                  </span>
                  <span className='text-xl'>
                    <Image
                      src={'/images/icons/console.png'}
                      alt='Nexus Web3 Playground'
                      width={50}
                      height={20}
                      className={miniGamesUnlocked ? '' : 'grayscale'}
                      style={{ width: 'auto', height: 'auto' }}
                    />
                  </span>
                </a>
              </Tooltip>
            </div>
          </div>
        </div>

        {/* Powered by Trustless Work */}
        <div className='text-center mt-4'>
          <p className='text-brand-300/70 text-sm font-medium animate-pulse'>
            Powered by <span className='text-brand-200 font-semibold'>Trustless Work</span>
          </p>
        </div>
      </div>
    </section>
  );
};

