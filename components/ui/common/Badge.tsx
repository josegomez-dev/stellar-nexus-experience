import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'brand' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
}

const variantStyles = {
  default: 'bg-white/20 text-white border-white/30',
  success: 'bg-green-500/30 text-green-200 border-green-400/30',
  warning: 'bg-warning-500/30 text-warning-200 border-warning-400/30',
  error: 'bg-red-500/30 text-red-200 border-red-400/30',
  info: 'bg-blue-500/30 text-blue-200 border-blue-400/30',
  brand: 'bg-brand-500/30 text-brand-200 border-brand-400/30',
  accent: 'bg-accent-500/30 text-accent-200 border-accent-400/30',
};

const sizeStyles = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
  lg: 'px-4 py-2 text-base',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  animated = false,
  className = '',
}) => {
  const baseClasses = [
    'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border',
    variantStyles[variant],
    sizeStyles[size],
    animated && 'animate-pulse',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <span className={baseClasses}>{children}</span>;
};



