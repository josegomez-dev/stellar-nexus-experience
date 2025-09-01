'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { NexusPrime } from '@/components/layout/NexusPrime'
import { EscrowProvider } from '@/contexts/EscrowContext'
import { useState, useEffect } from 'react'
import Image from 'next/image'



function HomeContent() {
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [showPreloader, setShowPreloader] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Handle preloader redirect
  useEffect(() => {
    if (showPreloader) {
      const timer = setTimeout(() => {
        window.location.href = '/demos'
      }, 3000)

      // Update countdown timer
      const countdown = setInterval(() => {
        const timerElement = document.getElementById('redirect-timer')
        if (timerElement) {
          const currentTime = parseInt(timerElement.textContent || '3')
          if (currentTime > 1) {
            timerElement.textContent = (currentTime - 1).toString()
          }
        }
      }, 1000)

      return () => {
        clearTimeout(timer)
        clearInterval(countdown)
      }
    }
  }, [showPreloader])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Mouse following plasma ball effect
  useEffect(() => {
    const plasmaBall = document.getElementById('plasma-ball')
    if (!plasmaBall) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = plasmaBall.getBoundingClientRect()
      const containerRect = plasmaBall.parentElement?.getBoundingClientRect()
      
      if (containerRect) {
        // Calculate relative position within the character container
        const relativeX = e.clientX - containerRect.left
        const relativeY = e.clientY - containerRect.top
        
        // Constrain the plasma ball to stay within the character area
        const maxX = containerRect.width - 48 // 48px is the plasma ball width
        const maxY = containerRect.height - 48 // 48px is the plasma ball height
        
        const constrainedX = Math.max(0, Math.min(relativeX, maxX))
        const constrainedY = Math.max(0, Math.min(relativeY, maxY))
        
        // Apply smooth movement with easing
        plasmaBall.style.transform = `translate(${constrainedX}px, ${constrainedY}px)`
        plasmaBall.style.transition = 'transform 0.1s ease-out'
      }
    }

    // Add mouse move listener to the character container
    const characterContainer = plasmaBall.parentElement
    if (characterContainer) {
      characterContainer.addEventListener('mousemove', handleMouseMove)
      
      // Reset position when mouse leaves
      const handleMouseLeave = () => {
        plasmaBall.style.transform = 'translate(-50%, -50%)'
        plasmaBall.style.transition = 'transform 0.5s ease-out'
      }
      
      characterContainer.addEventListener('mouseleave', handleMouseLeave)
      
      return () => {
        characterContainer.removeEventListener('mousemove', handleMouseMove)
        characterContainer.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, [])

  return (
    <EscrowProvider>
      <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-brand-900 to-neutral-900 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20 bg-gradient-to-r from-brand-500/10 via-transparent to-accent-500/10"></div>
        
        {/* Main Content */}
        <main className="relative z-10 pb-16 pt-20">

          {/* Demos Section */}
          <section className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">

              {/* add logo letter here */}
              <div className="flex justify-center ">
                <Image src="/images/logo/iconletter.png" alt="STELLAR NEXUS" width={300} height={100} />
              </div>

              <div className="max-w-4xl mx-auto p-6 relative">
                {/* Floating Particles */}
                <div className="epic-particle"></div>
                <div className="epic-particle"></div>
                <div className="epic-particle"></div>
                <div className="epic-particle"></div>
                <div className="epic-particle"></div>
                
                <p className="epic-text text-2xl md:text-3xl text-center leading-relaxed">
                  Experience the future of decentralized work with the ESCROW ARSENAL on the Stellar blockchain
                </p>
                
                {/* Epic Subtitle */}
                <p className="text-brand-300 text-lg text-center mt-4 font-medium animate-pulse">
                  ✨ Where Trust Meets Innovation ✨
                </p>
              </div>

  
              <div className="flex justify-center -mb-10 relative group">
                {/* Super Powerful Fire Plasma Energy Background Effect */}
                <div className="absolute inset-0 flex justify-center items-center pointer-events-none z-0">
                  {/* Primary Fire Plasma Core */}
                  <div className="relative w-96 h-96">
                    {/* Inner Fire Ring - Most Intense */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500 via-red-600 to-yellow-400 opacity-80 blur-sm scale-110" style={{ animation: 'firePulse 4s ease-in-out infinite' }}></div>
                    
                    {/* Middle Fire Ring - Medium Intensity */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500 via-orange-600 to-yellow-500 opacity-60 blur-md scale-125" style={{ animation: 'firePulse 3s ease-in-out infinite' }}></div>
                    
                    {/* Outer Fire Ring - Subtle Glow */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-400 via-orange-500 to-yellow-300 animate-pulse opacity-40 blur-lg scale-150" style={{ animationDuration: '3s' }}></div>
                  </div>
                  
                  {/* Floating Fire Particles */}
                  <div className="absolute inset-0">
                    {/* Particle 1 - Top Left */}
                    <div className="absolute top-8 left-16 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-70" style={{ animation: 'fireParticle 2s ease-in-out infinite' }}></div>
                    {/* Particle 2 - Top Right */}
                    <div className="absolute top-12 right-20 w-2 h-2 bg-gradient-to-r from-orange-400 to-red-500 rounded-full animate-ping opacity-80" style={{ animationDelay: '0.5s' }}></div>
                    {/* Particle 3 - Bottom Left */}
                    <div className="absolute bottom-16 left-24 w-2.5 h-2.5 bg-gradient-to-r from-red-400 to-orange-500 rounded-full animate-ping opacity-60" style={{ animationDelay: '1s' }}></div>
                    {/* Particle 4 - Bottom Right */}
                    <div className="absolute bottom-20 right-16 w-3 h-3 bg-gradient-to-r from-yellow-500 to-red-400 rounded-full animate-ping opacity-90" style={{ animationDelay: '1.5s' }}></div>
                  </div>
                  
                  {/* Energy Wave Rings */}
                  <div className="absolute inset-0">
                    {/* Wave 1 - Fast */}
                    <div className="absolute inset-0 rounded-full border-2 border-orange-400/50 animate-ping scale-110" style={{ animationDuration: '1.5s' }}></div>
                    {/* Wave 2 - Medium */}
                    <div className="absolute inset-0 rounded-full border border-red-400/40 animate-ping scale-130" style={{ animationDuration: '2.5s' }}></div>
                    {/* Wave 3 - Slow */}
                    <div className="absolute inset-0 rounded-full border border-yellow-400/30 animate-ping scale-150" style={{ animationDuration: '3.5s' }}></div>
                  </div>
                  
                  {/* Plasma Energy Streams */}
                  <div className="absolute inset-0">
                    {/* Stream 1 - Left */}
                    <div className="absolute left-0 top-1/2 w-1 h-20 bg-gradient-to-b from-transparent via-orange-400 to-transparent animate-pulse opacity-70" style={{ animationDuration: '1.8s' }}></div>
                    {/* Stream 2 - Right */}
                    <div className="absolute right-0 top-1/2 w-1 h-16 bg-gradient-to-b from-transparent via-red-400 to-transparent animate-pulse opacity-80" style={{ animationDuration: '2.2s' }}></div>
                    {/* Stream 3 - Top */}
                    <div className="absolute top-0 left-1/2 w-20 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent animate-pulse opacity-60" style={{ animationDuration: '1.6s' }}></div>
                    {/* Stream 4 - Bottom */}
                    <div className="absolute bottom-0 left-1/2 w-16 h-1 bg-gradient-to-r from-transparent via-orange-400 to-transparent animate-pulse opacity-75" style={{ animationDuration: '2.4s' }}></div>
                  </div>
                  
                  {/* Electric Arc Effects */}
                  <div className="absolute inset-0">
                    {/* Arc 1 */}
                    <div className="absolute top-1/4 left-1/4 w-8 h-8 border border-orange-400/60 rounded-full animate-spin" style={{ animationDuration: '4s' }}></div>
                    {/* Arc 2 */}
                    <div className="absolute top-1/3 right-1/3 w-6 h-6 border border-red-400/50 rounded-full animate-spin" style={{ animationDuration: '3s', animationDirection: 'reverse' }}></div>
                    {/* Arc 3 */}
                    <div className="absolute bottom-1/4 right-1/4 w-10 h-10 border border-yellow-400/40 rounded-full animate-spin" style={{ animationDuration: '5s' }}></div>
                  </div>
                </div>
                
                <Image src="/images/character/character.png" alt="Nexus Prime" width={350} height={200} className="relative z-10 transition-all duration-500 ease-out group-hover:scale-110" />
                
                {/* Alternative Plasma Ball Positions - Uncomment one to try different looks */}
                {/* Position 1: Perfect Center (Current) */}
                {/* Position 2: Slightly above center */}
                {/* <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 animate-float"> */}
                {/* Position 3: Floating above character */}
                {/* <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 animate-float"> */}
                {/* Position 4: Dynamic floating position */}
                {/* <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 animate-float"> */}
                
                {/* Plasma Ball Effect - Mouse Following Interactive */}
                <div 
                  id="plasma-ball"
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 animate-float -ml-[90px] mt-[55px] transition-all duration-300 ease-out pointer-events-none z-10"
                  style={{
                    filter: 'drop-shadow(0 0 20px rgba(14, 165, 233, 0.6)) drop-shadow(0 0 40px rgba(59, 130, 246, 0.4))'
                  }}
                >
                  {/* Core Plasma Ball */}
                  <div className="plasma-core absolute inset-0 rounded-full bg-gradient-to-r from-brand-400 via-brand-500 to-accent-600 animate-pulse"></div>
                  
                  {/* Energy Rings */}
                  <div className="plasma-ring-1 absolute inset-0 rounded-full border-2 border-brand-300/60 animate-spin" style={{ animationDuration: '3s' }}></div>
                  <div className="plasma-ring-2 absolute inset-0 rounded-full border border-brand-400/40 animate-spin" style={{ animationDuration: '4s', animationDirection: 'reverse' }}></div>
                  <div className="plasma-ring-3 absolute inset-0 rounded-full border border-accent-500/50 animate-spin group-hover:border-accent-400/80 group-hover:border-2 transition-all duration-500" style={{ animationDuration: '5s' }}></div>
                  
                  {/* Energy Particles */}
                  <div className="plasma-particle-1 absolute top-0 left-1/2 w-2 h-2 bg-brand-300 rounded-full animate-bounce group-hover:w-3 group-hover:h-3 group-hover:bg-brand-200 transition-all duration-500" style={{ animationDelay: '0s' }}></div>
                  <div className="plasma-particle-2 absolute top-1/4 right-0 w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce group-hover:w-2.5 group-hover:h-2.5 group-hover:bg-brand-300 transition-all duration-500" style={{ animationDelay: '0.5s' }}></div>
                  <div className="plasma-particle-3 absolute bottom-1/4 left-0 w-1 h-1 bg-accent-400 rounded-full animate-bounce group-hover:w-2 group-hover:h-2 group-hover:bg-accent-300 transition-all duration-500" style={{ animationDelay: '1s' }}></div>
                  <div className="plasma-particle-4 absolute bottom-0 right-1/4 w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce group-hover:w-2.5 group-hover:h-2.5 group-hover:bg-brand-300 transition-all duration-500" style={{ animationDelay: '1.5s' }}></div>
                  
                  {/* Glow Effect */}
                  <div className="plasma-glow absolute inset-0 rounded-full bg-gradient-to-r from-brand-400/20 via-brand-500/20 to-accent-600/20 blur-xl animate-pulse group-hover:from-brand-300/40 group-hover:via-brand-400/40 group-hover:to-accent-500/40 group-hover:blur-2xl transition-all duration-500"></div>
                  
                  {/* Electric Arcs */}
                  <div className="plasma-arc-1 absolute top-0 left-0 w-full h-full">
                    <div className="absolute top-1/2 left-1/2 w-1 h-8 bg-gradient-to-b from-brand-300 to-transparent animate-pulse group-hover:w-1.5 group-hover:h-10 group-hover:from-brand-200 transition-all duration-500" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <div className="plasma-arc-2 absolute top-0 left-0 w-full h-full">
                    <div className="absolute top-1/2 left-1/2 w-1 h-6 bg-gradient-to-b from-brand-400 to-transparent animate-pulse group-hover:w-1.5 group-hover:h-8 group-hover:from-brand-300 transition-all duration-500" style={{ animationDelay: '0.7s' }}></div>
                  </div>
                  <div className="plasma-arc-3 absolute top-0 left-0 w-full h-full">
                    <div className="absolute top-1/2 left-1/2 w-1 h-10 bg-gradient-to-b from-accent-500 to-transparent animate-pulse group-hover:w-1.5 group-hover:h-12 group-hover:from-accent-400 transition-all duration-500" style={{ animationDelay: '1.2s' }}></div>
                  </div>
                </div>
              </div>
                             <button
                 onClick={() => setShowPreloader(true)}
                 className="w-full px-8 py-4 bg-gradient-to-r from-brand-500 to-accent-600 hover:from-brand-600 hover:to-accent-700 text-white font-semibold rounded-lg transition-all duration-500 ease-out transform hover:scale-110 shadow-lg flex items-center justify-center space-x-3 relative z-50 overflow-hidden group/button"
                                >
                  {/* Shiny Glass Reflection Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent transform -skew-x-12 -translate-x-full group-hover/button:translate-x-full transition-transform duration-1000 ease-out"></div>
                  
                  {/* Additional Shine Layer */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-full group-hover/button:-translate-x-full transition-transform duration-800 ease-out delay-200"></div>
                  
                  {/* Subtle Inner Glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover/button:translate-x-full transition-transform duration-1200 ease-out delay-100"></div>
                  
                  {/* Button Content with Special START Animation */}
                  <span className="relative z-10">
                    <span className='text-2xl font-bold text-yellow-300 group-hover/button:text-yellow-100 group-hover/button:scale-110 transition-all duration-300 ease-out inline-block drop-shadow-lg'>START</span>
                    <br/> 
                    <span className="animate-pulse group-hover/button:animate-bounce">ESCROW ARSENAL</span>
                  </span>
                </button>

                {/* Powered by Trustless Work */}
                <div className="text-center mt-4">
                  <p className="text-brand-300/70 text-sm font-medium animate-pulse">
                    Powered by <span className="text-brand-200 font-semibold">Trustless Work</span>
                  </p>
                </div>

              {/* add logo letter here */}
              <div className="flex justify-center ">
                <Image src="/images/logo/logoicon.png" alt="STELLAR NEXUS" width={300} height={100} />
              </div>

              <br />
              <br />


            </div>
          </section>

        </main>

        {/* Back to Top Button */}
        {showBackToTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-brand-500 to-accent-600 text-white p-3 rounded-full shadow-lg hover:from-brand-600 hover:to-accent-700 transition-all duration-300 transform hover:scale-110 backdrop-blur-sm border border-brand-400/30"
            title="Back to top"
          >
            <span className="text-xl font-bold">↑</span>
          </button>
        )}

      </div>

      {/* Epic Preloader Screen */}
      {showPreloader && (
        <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-neutral-900 via-brand-900 to-neutral-900 flex items-center justify-center">
          {/* Animated Background */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Floating Energy Orbs */}
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-brand-400/20 rounded-full animate-ping"></div>
            <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-accent-400/20 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute bottom-1/3 left-1/3 w-28 h-28 bg-brand-500/20 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-1/4 right-1/3 w-20 h-20 bg-accent-500/20 rounded-full animate-ping" style={{ animationDelay: '1.5s' }}></div>
            
            {/* Energy Grid */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(14,165,233,0.1)_0%,_transparent_70%)] animate-pulse"></div>
          </div>

          {/* Main Content */}
          <div className="relative z-10 text-center">
            {/* Logo Animation */}
            <div className="mb-8 animate-bounce">
              <Image 
                src="/images/logo/logoicon.png" 
                alt="STELLAR NEXUS" 
                width={120} 
                height={120} 
                className="w-30 h-30"
              />
            </div>

            {/* Loading Text */}
            <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-brand-500 to-accent-600 mb-6 animate-pulse">
              INITIALIZING ESCROW ARSENAL
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-brand-300 mb-8 animate-pulse">
              Preparing your trustless work experience...
            </p>

            {/* Loading Bar */}
            <div className="w-80 h-3 bg-white/10 rounded-full overflow-hidden mx-auto mb-8">
              <div className="h-full bg-gradient-to-r from-brand-500 via-brand-600 to-accent-600 rounded-full animate-loading-bar"></div>
            </div>

            {/* Loading Steps */}
            <div className="space-y-2 text-white/80">
              <p className="animate-fadeInUp" style={{ animationDelay: '0.5s' }}>🔐 Connecting to Stellar Network...</p>
              <p className="animate-fadeInUp" style={{ animationDelay: '1s' }}>⚡ Loading Smart Contracts...</p>
              <p className="animate-fadeInUp" style={{ animationDelay: '1.5s' }}>🎯 Preparing Demo Suite...</p>
              <p className="animate-fadeInUp" style={{ animationDelay: '2s' }}>🚀 Launching ESCROW ARSENAL...</p>
            </div>

            {/* Redirect Timer */}
            <div className="mt-8 text-brand-300 text-lg">
              Redirecting in <span className="font-bold" id="redirect-timer">3</span> seconds...
            </div>
          </div>
        </div>
      )}

      {/* NEXUS PRIME Character */}
      <NexusPrime 
        currentPage="home"
        walletConnected={false}
      />
    </EscrowProvider>
  );
}

export default function Home() {
  return <HomeContent />
}
