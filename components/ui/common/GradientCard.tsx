import React from 'react';

interface GradientCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'brand' | 'accent' | 'success' | 'warning' | 'error';
  blur?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  border?: boolean;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
}

const gradientVariants = {
  default: 'bg-gradient-to-br from-white/5 to-white/10',
  brand: 'bg-gradient-to-br from-brand-500/20 to-brand-400/20',
  accent: 'bg-gradient-to-br from-accent-500/20 to-accent-600/20',
  success: 'bg-gradient-to-br from-green-500/20 to-emerald-500/20',
  warning: 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20',
  error: 'bg-gradient-to-br from-red-500/20 to-pink-500/20',
};

const blurVariants = {
  none: '',
  sm: 'backdrop-blur-sm',
  md: 'backdrop-blur-md',
  lg: 'backdrop-blur-lg',
  xl: 'backdrop-blur-xl',
};

const borderVariants = {
  default: 'border border-white/20',
  brand: 'border border-brand-400/30',
  accent: 'border border-accent-400/30',
  success: 'border border-green-400/30',
  warning: 'border border-yellow-400/30',
  error: 'border border-red-400/30',
};

const paddingVariants = {
  sm: 'p-3',
  md: 'p-6',
  lg: 'p-8',
  xl: 'p-12',
};

const roundedVariants = {
  sm: 'rounded',
  md: 'rounded-lg',
  lg: 'rounded-xl',
  xl: 'rounded-2xl',
  '2xl': 'rounded-3xl',
  '3xl': 'rounded-3xl',
};

export const GradientCard: React.FC<GradientCardProps> = ({
  children,
  className = '',
  variant = 'default',
  blur = 'sm',
  border = true,
  hover = true,
  padding = 'md',
  rounded = 'xl',
}) => {
  const baseClasses = [
    gradientVariants[variant],
    blurVariants[blur],
    border && borderVariants[variant],
    paddingVariants[padding],
    roundedVariants[rounded],
    'shadow-2xl',
    hover && 'transition-all duration-300 transform hover:scale-105 hover:shadow-2xl',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <div className={baseClasses}>{children}</div>;
};

