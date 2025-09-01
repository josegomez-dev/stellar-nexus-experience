'use client'

import { useEffect, useState } from 'react'

interface ConfettiPiece {
  id: number
  x: number
  y: number
  rotation: number
  scale: number
  color: string
  velocity: {
    x: number
    y: number
    rotation: number
  }
}

interface ConfettiAnimationProps {
  isActive: boolean
  duration?: number
}

export default function ConfettiAnimation({ isActive, duration = 3000 }: ConfettiAnimationProps) {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([])

  const colors = [
    '#FF6B6B', // Red
    '#4ECDC4', // Teal
    '#45B7D1', // Blue
    '#96CEB4', // Green
    '#FFEAA7', // Yellow
    '#DDA0DD', // Plum
    '#98D8C8', // Mint
    '#F7DC6F', // Gold
  ]

  useEffect(() => {
    if (!isActive) {
      setConfetti([])
      return
    }

    console.log('🎉 Confetti animation triggered!')

    // Create confetti pieces
    const pieces: ConfettiPiece[] = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: -20,
      rotation: Math.random() * 360,
      scale: Math.random() * 0.5 + 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      velocity: {
        x: (Math.random() - 0.5) * 8,
        y: Math.random() * 3 + 2,
        rotation: (Math.random() - 0.5) * 10,
      },
    }))

    setConfetti(pieces)

    // Animate confetti
    const startTime = Date.now()
    const animate = () => {
      const elapsed = Date.now() - startTime
      
      if (elapsed < duration) {
        setConfetti(prev => 
          prev.map(piece => ({
            ...piece,
            x: piece.x + piece.velocity.x,
            y: piece.y + piece.velocity.y,
            rotation: piece.rotation + piece.velocity.rotation,
            velocity: {
              ...piece.velocity,
              y: piece.velocity.y + 0.1, // Gravity
            },
          }))
        )
        requestAnimationFrame(animate)
      } else {
        setConfetti([])
      }
    }

    requestAnimationFrame(animate)
  }, [isActive, duration])

  if (!isActive || confetti.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {confetti.map(piece => (
        <div
          key={piece.id}
          className="absolute w-2 h-2 rounded-sm"
          style={{
            left: `${piece.x}px`,
            top: `${piece.y}px`,
            transform: `rotate(${piece.rotation}deg) scale(${piece.scale})`,
            backgroundColor: piece.color,
            boxShadow: `0 0 4px ${piece.color}`,
          }}
        />
      ))}
    </div>
  )
}
