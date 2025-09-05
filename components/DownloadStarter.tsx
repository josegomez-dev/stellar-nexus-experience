'use client';

import { useState } from 'react';

export function DownloadStarter() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const handleDownload = async () => {
    setIsDownloading(true);
    setDownloadProgress(0);

    // Simulate download progress
    const progressInterval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsDownloading(false);
          return 100;
        }
        return prev + Math.random() * 20;
      });
    }, 200);

    // In a real implementation, this would trigger the actual download
    // For now, we'll simulate it and show a success message
    setTimeout(() => {
      clearInterval(progressInterval);
      setDownloadProgress(100);
      setIsDownloading(false);

      // Show success message
      alert('🎉 Nexus Game Starter downloaded successfully! Check your downloads folder.');
    }, 3000);
  };

  return (
    <div className='card max-w-2xl mx-auto text-center'>
      <div className='text-4xl mb-4'>🚀</div>
      <h3 className='text-2xl font-bold mb-4 text-gradient'>Download Nexus Game Starter</h3>
      <p className='text-white/70 mb-6'>
        Get the complete starter template with Trustless Work and Stellar integration. Everything
        you need to build blockchain-powered games!
      </p>

      <div className='mb-6'>
        <h4 className='text-lg font-semibold mb-3 text-white'>What's Included:</h4>
        <div className='grid grid-cols-2 gap-3 text-sm text-white/70'>
          <div className='flex items-center'>
            <span className='text-green-400 mr-2'>✓</span>
            Wallet Integration
          </div>
          <div className='flex items-center'>
            <span className='text-green-400 mr-2'>✓</span>
            Game Templates
          </div>
          <div className='flex items-center'>
            <span className='text-green-400 mr-2'>✓</span>
            Stellar Network
          </div>
          <div className='flex items-center'>
            <span className='text-green-400 mr-2'>✓</span>
            Modern UI Components
          </div>
          <div className='flex items-center'>
            <span className='text-green-400 mr-2'>✓</span>
            TypeScript Support
          </div>
          <div className='flex items-center'>
            <span className='text-green-400 mr-2'>✓</span>
            Responsive Design
          </div>
        </div>
      </div>

      {isDownloading ? (
        <div className='mb-4'>
          <div className='text-sm text-white/60 mb-2'>Downloading...</div>
          <div className='w-full bg-white/20 rounded-full h-2 overflow-hidden'>
            <div
              className='h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-300 ease-out'
              style={{ width: `${downloadProgress}%` }}
            />
          </div>
          <div className='text-xs text-white/50 mt-1'>{Math.round(downloadProgress)}%</div>
        </div>
      ) : (
        <button onClick={handleDownload} className='btn-primary text-lg w-full'>
          📥 Download Starter Template
        </button>
      )}

      <div className='text-xs text-white/50 mt-4'>Free • MIT License • Ready to use</div>

      <div className='mt-6 pt-4 border-t border-white/20'>
        <div className='text-sm text-white/60 mb-2'>Quick Start:</div>
        <div className='bg-white/10 rounded-lg p-3 text-left'>
          <div className='text-xs font-mono text-white/80'>
            <div>$ git clone [starter-url]</div>
            <div>$ cd nexus-game-starter</div>
            <div>$ npm install</div>
            <div>$ npm run dev</div>
          </div>
        </div>
      </div>
    </div>
  );
}
