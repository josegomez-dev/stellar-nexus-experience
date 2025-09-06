'use client';

import { useState } from 'react';

interface CollapsibleHeaderProps {
  isCollapsed: boolean;
  onToggle: () => void;
  title: string;
  description: string;
  collapsedDescription: string;
}

export function CollapsibleHeader({ 
  isCollapsed, 
  onToggle, 
  title, 
  description, 
  collapsedDescription 
}: CollapsibleHeaderProps) {
  return (
    <div className="text-center mb-8">
      <button
        onClick={onToggle}
        className="group inline-flex items-center space-x-4 hover:scale-105 transition-all duration-300 mb-4"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-white">
          🚀 <span className="bg-gradient-to-r from-brand-400 to-accent-400 bg-clip-text text-transparent">
            {title}
          </span>
        </h2>
        <div className={`transform transition-transform duration-300 ${isCollapsed ? 'rotate-0' : 'rotate-180'}`}>
          <svg className="w-6 h-6 text-brand-400 group-hover:text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      <p className="text-lg text-brand-300 max-w-2xl mx-auto leading-relaxed">
        {isCollapsed ? collapsedDescription : description}
      </p>
    </div>
  );
}

interface BackToTopButtonProps {
  showBackToTop: boolean;
  scrollToTop: () => void;
}

export function BackToTopButton({ showBackToTop, scrollToTop }: BackToTopButtonProps) {
  if (!showBackToTop) return null;

  return (
    <button
      onClick={scrollToTop}
      className='fixed bottom-8 right-8 z-50 bg-gradient-to-r from-brand-500 to-accent-600 text-white p-3 rounded-full shadow-lg hover:from-brand-600 hover:to-accent-700 transition-all duration-300 transform hover:scale-110 backdrop-blur-sm border border-brand-400/30'
      title='Back to top'
    >
      <span className='text-xl font-bold'>↑</span>
    </button>
  );
}
