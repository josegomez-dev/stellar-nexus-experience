'use client';

import { useEffect, useState, useRef } from 'react';
import { analyticsService, type PlatformAnalytics } from '@/lib/analytics-service';

interface PlasmaBubble {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  opacity: number;
  pulse: number;
  analyticsMessage: {
    icon: string;
    message: string;
    color: string;
  };
}

const ANALYTICS_MESSAGES = [
  { icon: "👥", message: "{users} Registered Users", color: "text-blue-400" },
  { icon: "🎯", message: "{demos} Demos Completed", color: "text-green-400" }, 
  { icon: "💰", message: "{transactions} Points Transactions", color: "text-purple-400" },
  { icon: "⭐", message: "{satisfaction}% User Satisfaction", color: "text-yellow-400" },
  { icon: "📈", message: "+{growth}% Monthly Growth", color: "text-emerald-400" },
  { icon: "✅", message: "{success}% Success Rate", color: "text-blue-400" },
  { icon: "🌟", message: "{stellar} Stellar Operations", color: "text-yellow-400" },
  { icon: "🚀", message: "Platform Growing Fast!", color: "text-brand-400" },
  { icon: "✨", message: "Decentralized Future", color: "text-accent-400" },
  { icon: "🔥", message: "{users} Onboarded Nexus Users", color: "text-orange-400" },
  { icon: "💎", message: "Trustless Innovation", color: "text-cyan-400" },
  { icon: "🌊", message: "Web3 Revolution", color: "text-teal-400" },
  { icon: "⚡", message: "Lightning Fast Transactions", color: "text-yellow-400" },
  { icon: "🛡️", message: "Secure & Trustless", color: "text-green-400" },
  { icon: "🎨", message: "Beautiful User Experience", color: "text-pink-400" },
  { icon: "🔮", message: "Future of Work", color: "text-purple-400" }
];

const BUBBLE_COLORS = [
  'from-blue-400 to-cyan-300',
  'from-purple-400 to-pink-300', 
  'from-green-400 to-emerald-300',
  'from-yellow-400 to-orange-300',
  'from-indigo-400 to-blue-300',
  'from-pink-400 to-rose-300',
  'from-teal-400 to-cyan-300'
];

export default function PlasmaBubbles() {
  const [bubbles, setBubbles] = useState<PlasmaBubble[]>([]);
  const [analytics, setAnalytics] = useState<PlatformAnalytics | null>(null);
  const [hoveredBubble, setHoveredBubble] = useState<string | null>(null);
  const animationRef = useRef<number>();
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  // Fetch analytics data for hover tooltips
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await analyticsService.getPlatformAnalytics();
        setAnalytics(data);
      } catch (error) {
        console.log('Using fallback analytics for bubbles');
      }
    };
    fetchAnalytics();
  }, []);

  // Initialize bubbles
  useEffect(() => {
    // Only run on client-side
    if (typeof window === 'undefined') return;
    
    const createBubbles = () => {
      const newBubbles: PlasmaBubble[] = [];
      const bubbleCount = 15; // More bubbles for better coverage

      for (let i = 0; i < bubbleCount; i++) {
        const bubble: PlasmaBubble = {
          id: `bubble-${i}`,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          vx: (Math.random() - 0.5) * 1.2, // More dynamic movement
          vy: (Math.random() - 0.5) * 1.2,
          size: Math.random() * 50 + 25, // 25-75px - more consistent sizes
          color: BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)],
          opacity: Math.random() * 0.3 + 0.2, // 0.2-0.5 - more visible
          pulse: Math.random() * Math.PI * 2,
          analyticsMessage: ANALYTICS_MESSAGES[Math.floor(Math.random() * ANALYTICS_MESSAGES.length)]
        };
        newBubbles.push(bubble);
      }
      setBubbles(newBubbles);
    };

    createBubbles();
  }, []);

  // Animation loop
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (bubbles.length === 0) return;

    const animate = () => {
      setBubbles(prevBubbles => 
        prevBubbles.map(bubble => {
          const container = containerRef.current;
          if (!container) return bubble;

          const rect = container.getBoundingClientRect();
          const mouseX = mouseRef.current.x;
          const mouseY = mouseRef.current.y;

          // Gravitational effect towards mouse
          const dx = mouseX - (bubble.x + rect.left);
          const dy = mouseY - (bubble.y + rect.top);
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxDistance = 250; // Larger attraction radius

          let newVx = bubble.vx;
          let newVy = bubble.vy;

          if (distance < maxDistance && distance > 0) {
            const force = (maxDistance - distance) / maxDistance * 0.002; // Stronger attraction
            newVx += (dx / distance) * force;
            newVy += (dy / distance) * force;
          }

          // Apply gentle damping and add floating motion
          newVx *= 0.98; // Less damping for more movement
          newVy *= 0.98;
          
          // Add natural floating motion
          const time = Date.now() * 0.001;
          const floatX = Math.sin(time + bubble.pulse) * 0.0005;
          const floatY = Math.cos(time + bubble.pulse * 0.7) * 0.0003;
          
          newVx += floatX + (Math.random() - 0.5) * 0.0005; // More random drift
          newVy += floatY + (Math.random() - 0.5) * 0.0005;

          // Update position
          let newX = bubble.x + newVx;
          let newY = bubble.y + newVy;

          // Bounce off edges with more realistic physics
          if (newX <= 0 || newX >= rect.width - bubble.size) {
            newVx *= -0.7; // More bouncy
            newX = Math.max(0, Math.min(rect.width - bubble.size, newX));
            // Add some random energy on bounce
            newVy += (Math.random() - 0.5) * 0.001;
          }
          if (newY <= 0 || newY >= rect.height - bubble.size) {
            newVy *= -0.7; // More bouncy
            newY = Math.max(0, Math.min(rect.height - bubble.size, newY));
            // Add some random energy on bounce
            newVx += (Math.random() - 0.5) * 0.001;
          }

          // Update pulse for breathing effect
          const newPulse = bubble.pulse + 0.02;

          return {
            ...bubble,
            x: newX,
            y: newY,
            vx: newVx,
            vy: newVy,
            pulse: newPulse,
            opacity: bubble.opacity + Math.sin(newPulse) * 0.1
          };
        })
      );

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [bubbles.length]);

  // Mouse tracking
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Format analytics data for display
  const formatAnalyticsMessage = (messageObj: { icon: string; message: string; color: string }): { icon: string; message: string; color: string } => {
    if (!analytics) return messageObj;

    const formattedMessage = messageObj.message
      .replace('{users}', analytics.totalUsers.toString())
      .replace('{demos}', analytics.totalDemoCompletions.toString())
      .replace('{transactions}', analytics.totalPointsTransactions.toString())
      .replace('{satisfaction}', analytics.userSatisfactionScore.toString())
      .replace('{growth}', analytics.monthlyGrowthRate.toString())
      .replace('{success}', analytics.successRate.toString())
      .replace('{stellar}', analytics.stellarOperations.toString());

    return {
      ...messageObj,
      message: formattedMessage
    };
  };

  // Don't render on server-side
  if (typeof window === 'undefined') {
    return null;
  }

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-20 overflow-hidden"
    >
      {bubbles.map(bubble => (
        <div
          key={bubble.id}
          className="absolute pointer-events-auto cursor-pointer group"
          style={{
            left: bubble.x,
            top: bubble.y,
            width: bubble.size,
            height: bubble.size,
          }}
          onMouseEnter={() => setHoveredBubble(bubble.id)}
          onMouseLeave={() => setHoveredBubble(null)}
        >
          {/* Enhanced Plasma Bubble with Better Hover Effects */}
          <div
            className={`w-full h-full rounded-full bg-gradient-to-br ${bubble.color} transition-all duration-500 shadow-lg ${
              hoveredBubble === bubble.id 
                ? 'blur-none animate-pulse' 
                : 'blur-sm hover:blur-none'
            }`}
            style={{
              opacity: bubble.opacity + (hoveredBubble === bubble.id ? 0.5 : 0),
              transform: `scale(${1 + Math.sin(bubble.pulse) * 0.15}) ${
                hoveredBubble === bubble.id ? 'scale(1.4) rotate(10deg)' : ''
              }`,
              boxShadow: hoveredBubble === bubble.id 
                ? `0 0 40px ${bubble.color.includes('blue') ? 'rgba(59, 130, 246, 0.8)' : 
                             bubble.color.includes('purple') ? 'rgba(168, 85, 247, 0.8)' : 
                             bubble.color.includes('green') ? 'rgba(52, 211, 153, 0.8)' : 
                             bubble.color.includes('pink') ? 'rgba(244, 114, 182, 0.8)' : 
                             bubble.color.includes('yellow') ? 'rgba(251, 191, 36, 0.8)' : 
                             'rgba(59, 130, 246, 0.8)'}, 0 0 80px ${bubble.color.includes('blue') ? 'rgba(59, 130, 246, 0.4)' : 
                             bubble.color.includes('purple') ? 'rgba(168, 85, 247, 0.4)' : 
                             bubble.color.includes('green') ? 'rgba(52, 211, 153, 0.4)' : 
                             bubble.color.includes('pink') ? 'rgba(244, 114, 182, 0.4)' : 
                             bubble.color.includes('yellow') ? 'rgba(251, 191, 36, 0.4)' : 
                             'rgba(59, 130, 246, 0.4)'}`
                : `0 0 15px rgba(59, 130, 246, 0.3)`
            }}
          />
          
          {/* Pulsing Ring Effect on Hover */}
          {hoveredBubble === bubble.id && (
            <>
              <div 
                className="absolute inset-0 rounded-full border-2 border-white/60 animate-ping"
                style={{
                  transform: 'scale(1.6)',
                  animationDuration: '1s'
                }}
              />
              <div 
                className="absolute inset-0 rounded-full border border-white/40 animate-ping"
                style={{
                  transform: 'scale(1.8)',
                  animationDuration: '1.5s',
                  animationDelay: '0.3s'
                }}
              />
            </>
          )}
          
          {/* Sparkle Effects */}
          {hoveredBubble === bubble.id && (
            <>
              <div className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full animate-ping" style={{ animationDelay: '0.2s' }} />
              <div className="absolute bottom-3 left-3 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
              <div className="absolute top-1/2 left-1 w-1.5 h-1.5 bg-white rounded-full animate-ping" style={{ animationDelay: '0.8s' }} />
              <div className="absolute top-3 left-1/2 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDelay: '1.1s' }} />
            </>
          )}

          {/* Hover Tooltip with Icon */}
          {hoveredBubble === bubble.id && (
            <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 z-[100] animate-bounce">
              <div className="bg-gradient-to-r from-gray-900/95 to-black/95 backdrop-blur-md text-white px-4 py-3 rounded-xl text-sm font-medium whitespace-nowrap border border-white/30 shadow-2xl">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl animate-pulse">{formatAnalyticsMessage(bubble.analyticsMessage).icon}</span>
                  <span className={`font-bold ${formatAnalyticsMessage(bubble.analyticsMessage).color}`}>
                    {formatAnalyticsMessage(bubble.analyticsMessage).message}
                  </span>
                </div>
                {/* Tooltip Arrow */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                  <div className="w-0 h-0 border-l-6 border-r-6 border-t-6 border-transparent border-t-gray-900/95"></div>
                </div>
                
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-sm -z-10"></div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
