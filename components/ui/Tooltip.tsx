'use client';

import { ReactNode } from 'react';

interface TooltipProps {
  children: ReactNode;
  content: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export const Tooltip = ({ children, content, position = 'top', className = '' }: TooltipProps) => {
  const getPositionClasses = () => {
    switch (position) {
      case 'bottom':
        return 'top-full left-1/2 transform -translate-x-1/2 mt-3';
      case 'left':
        return 'right-full top-1/2 transform -translate-y-1/2 mr-3';
      case 'right':
        return 'left-full top-1/2 transform -translate-y-1/2 ml-3';
      default: // top
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-3';
    }
  };

  const getArrowClasses = () => {
    switch (position) {
      case 'bottom':
        return 'absolute -top-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-slate-900/95 border-t border-l border-cyan-400/30 rotate-45';
      case 'left':
        return 'absolute -right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-slate-900/95 border-t border-r border-cyan-400/30 rotate-45';
      case 'right':
        return 'absolute -left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-slate-900/95 border-b border-l border-cyan-400/30 rotate-45';
      default: // top
        return 'absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-slate-900/95 border-b border-r border-cyan-400/30 rotate-45';
    }
  };

  return (
    <div className={`group relative ${className}`}>
      {children}

      {/* Tooltip */}
      <div
        className={`absolute ${getPositionClasses()} opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-[9999]`}
      >
        <div className='bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl border border-cyan-400/30 rounded-xl shadow-2xl p-3 min-w-48'>
          {/* Arrow */}
          <div className={getArrowClasses()}></div>

          {/* Content */}
          <div className='text-center'>{content}</div>
        </div>
      </div>
    </div>
  );
};
