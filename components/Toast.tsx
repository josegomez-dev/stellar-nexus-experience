'use client'

import { useEffect, useState } from 'react'
import { useToast } from '@/contexts/ToastContext'

export const ToastContainer = () => {
  const { toasts, removeToast } = useToast()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (toasts.length > 0) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }, [toasts.length])

  if (!isVisible) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  )
}

interface ToastItemProps {
  toast: any
  onRemove: (id: string) => void
}

const ToastItem = ({ toast, onRemove }: ToastItemProps) => {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Start entrance animation
    setIsAnimating(true)
    
    // Start exit animation before removal
    const timer = setTimeout(() => {
      setIsAnimating(false)
    }, toast.duration - 300 || 4700)
    
    return () => clearTimeout(timer)
  }, [toast.duration])

  const getToastStyles = () => {
    const baseStyles = "relative p-4 rounded-lg shadow-2xl border-2 backdrop-blur-sm transform transition-all duration-300 ease-out"
    
    switch (toast.type) {
      case 'success':
        return `${baseStyles} bg-gradient-to-r from-success-500/20 to-success-400/20 border-success-400/30 text-success-100`
      case 'error':
        return `${baseStyles} bg-gradient-to-r from-danger-500/20 to-danger-400/20 border-danger-400/30 text-danger-100`
      case 'warning':
        return `${baseStyles} bg-gradient-to-r from-warning-500/20 to-warning-400/20 border-warning-400/30 text-warning-100`
      case 'info':
        return `${baseStyles} bg-gradient-to-r from-brand-500/20 to-brand-400/20 border-brand-400/30 text-brand-100`
      default:
        return `${baseStyles} bg-gradient-to-r from-white/20 to-white/10 border-white/30 text-white`
    }
  }

  const getToastIcon = () => {
    if (toast.icon) return toast.icon
    
    switch (toast.type) {
      case 'success':
        return '✅'
      case 'error':
        return '❌'
      case 'warning':
        return '⚠️'
      case 'info':
        return 'ℹ️'
      default:
        return '📝'
    }
  }

  const getProgressColor = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-success-400'
      case 'error':
        return 'bg-danger-400'
      case 'warning':
        return 'bg-warning-400'
      case 'info':
        return 'bg-brand-400'
      default:
        return 'bg-white'
    }
  }

  return (
    <div
      className={`${getToastStyles()} ${
        isAnimating 
          ? 'translate-x-0 opacity-100 scale-100' 
          : 'translate-x-full opacity-0 scale-95'
      }`}
      style={{
        animation: isAnimating ? 'slideInRight 0.3s ease-out' : 'slideOutRight 0.3s ease-in'
      }}
    >
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 h-1 bg-white/20 rounded-t-lg overflow-hidden">
        <div 
          className={`h-full ${getProgressColor()} transition-all duration-300 ease-linear`}
          style={{
            width: isAnimating ? '0%' : '100%',
            animation: `progressBar ${toast.duration || 5000}ms linear forwards`
          }}
        />
      </div>

      {/* Toast Content */}
      <div className="flex items-start space-x-3">
        <div className="text-xl flex-shrink-0 mt-1">
          {getToastIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm mb-1 truncate">
            {toast.title}
          </h4>
          <p className="text-xs opacity-90 leading-relaxed">
            {toast.message}
          </p>
          <p className="text-xs opacity-60 mt-2">
            {toast.timestamp.toLocaleTimeString()}
          </p>
        </div>
        
        {/* Close Button */}
        <button
          onClick={() => onRemove(toast.id)}
          className="flex-shrink-0 text-white/60 hover:text-white hover:bg-white/10 rounded-full p-1 transition-all duration-200 hover:scale-110"
          title="Dismiss"
        >
          ✕
        </button>
      </div>

      {/* Glow Effect */}
      <div className="absolute inset-0 rounded-lg opacity-20 pointer-events-none">
        <div className={`absolute inset-0 rounded-lg bg-gradient-to-r ${
          toast.type === 'success' ? 'from-success-400 to-success-300' :
          toast.type === 'error' ? 'from-danger-400 to-danger-300' :
          toast.type === 'warning' ? 'from-warning-400 to-warning-300' :
          'from-brand-400 to-brand-300'
        } blur-xl`} />
      </div>
    </div>
  )
}

// Add CSS animations
const ToastStyles = () => (
  <style jsx global>{`
    @keyframes slideInRight {
      from {
        transform: translateX(100%) scale(0.95);
        opacity: 0;
      }
      to {
        transform: translateX(0) scale(1);
        opacity: 1;
      }
    }
    
    @keyframes slideOutRight {
      from {
        transform: translateX(0) scale(1);
        opacity: 1;
      }
      to {
        transform: translateX(100%) scale(0.95);
        opacity: 0;
      }
    }
    
    @keyframes progressBar {
      from {
        width: 100%;
      }
      to {
        width: 0%;
      }
    }
    
    .toast-enter {
      animation: slideInRight 0.3s ease-out;
    }
    
    .toast-exit {
      animation: slideOutRight 0.3s ease-in;
    }
  `}</style>
)

export { ToastStyles }
