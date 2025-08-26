'use client'

import { appConfig, stellarConfig } from '@/lib/wallet-config'
import Image from 'next/image'

export const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white/5 backdrop-blur-md border-t border-white/20 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          {/* App Information */}
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="">
                <Image 
                  src="/images/logo/logoicon.png"
                  alt="STELLAR NEXUS"
                  width={152}
                  height={152}
                />
              </div>
              <div>
                <Image 
                  src="/images/logo/iconletter.png"
                  alt="STELLAR NEXUS"
                  width={100}
                  height={24}
                />
                <p className="text-sm text-white/60">v{appConfig.version}</p>
              </div>
            </div>
            <p className="text-white/80 text-sm mb-4">
              A proof-of-concept application demonstrating Trustless Work escrow management 
              on the Stellar blockchain. Experience the future of decentralized work.
            </p>
            <div className="flex items-center justify-center space-x-4">
              <span className="text-xs text-white/60">Network:</span>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                stellarConfig.network === 'TESTNET' 
                  ? 'bg-warning-500/30 text-warning-200 border border-warning-400/30'
                  : 'bg-success-500/30 text-success-200 border border-success-400/30'
              }`}>
                {stellarConfig.network}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/20 mt-8 pt-8">
          <div className="text-center space-y-4">
            <div className="text-white/60 text-sm">
              © {currentYear} {appConfig.name}. All rights reserved.
            </div>
            
            <div className="flex items-center justify-center space-x-6">
              <span className="text-white/60 text-sm">
                Built with ❤️ on Stellar
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-white/40">Status:</span>
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-xs text-white/40">Live</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
