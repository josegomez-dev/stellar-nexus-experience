'use client';

import { useState, useEffect } from 'react';

interface TypeWriterProps {
  text: string;
  speed?: number;
  delay?: number;
  onComplete?: () => void;
  className?: string;
  showCursor?: boolean;
  cursorChar?: string;
  loop?: boolean;
}

export const TypeWriter = ({
  text,
  speed = 50,
  delay = 0,
  onComplete,
  className = '',
  showCursor = true,
  cursorChar = '|',
  loop = false,
}: TypeWriterProps) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [showCursorBlink, setShowCursorBlink] = useState(true);

  useEffect(() => {
    if (delay > 0) {
      const delayTimer = setTimeout(() => {
        setIsTyping(true);
      }, delay);
      return () => clearTimeout(delayTimer);
    } else {
      setIsTyping(true);
    }
  }, [delay]);

  useEffect(() => {
    if (!isTyping) return;

    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(text.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, speed);
      return () => clearTimeout(timer);
    } else {
      // Typing complete
      if (onComplete) {
        onComplete();
      }
      
      if (loop) {
        // Reset after a pause for looping
        setTimeout(() => {
          setDisplayText('');
          setCurrentIndex(0);
        }, 2000);
      }
    }
  }, [currentIndex, text, speed, isTyping, onComplete, loop]);

  useEffect(() => {
    if (!showCursor) return;
    
    const cursorTimer = setInterval(() => {
      setShowCursorBlink(prev => !prev);
    }, 500);
    
    return () => clearInterval(cursorTimer);
  }, [showCursor]);

  return (
    <span className={className}>
      {displayText}
      {showCursor && (
        <span 
          className={`${showCursorBlink ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100`}
        >
          {cursorChar}
        </span>
      )}
    </span>
  );
};

interface ProcessExplanationProps {
  step: string;
  title: string;
  description: string;
  technicalDetails: string;
  isActive: boolean;
  onComplete?: () => void;
}

export const ProcessExplanation = ({
  step,
  title,
  description,
  technicalDetails,
  isActive,
  onComplete,
}: ProcessExplanationProps) => {
  const [stage, setStage] = useState<'title' | 'description' | 'technical' | 'complete'>('title');

  const handleTitleComplete = () => {
    setTimeout(() => setStage('description'), 500);
  };

  const handleDescriptionComplete = () => {
    setTimeout(() => setStage('technical'), 500);
  };

  const handleTechnicalComplete = () => {
    setStage('complete');
    if (onComplete) {
      setTimeout(onComplete, 1000);
    }
  };

  if (!isActive) {
    return (
      <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 opacity-50">
        <div className="flex items-center space-x-3 mb-2">
          <span className="text-2xl">⏳</span>
          <h3 className="text-lg font-semibold text-white/70">{title}</h3>
        </div>
        <p className="text-white/50 text-sm">{description}</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-brand-500/20 to-accent-500/20 backdrop-blur-sm rounded-lg p-6 border border-brand-400/30 shadow-2xl shadow-brand-500/20">
      <div className="flex items-center space-x-3 mb-4">
        <span className="text-3xl animate-pulse">🔄</span>
        <div className="flex-1">
          {stage === 'title' && (
            <TypeWriter
              text={`${step}: ${title}`}
              speed={30}
              className="text-xl font-bold text-brand-300"
              onComplete={handleTitleComplete}
              showCursor={true}
              cursorChar="▋"
            />
          )}
          {stage !== 'title' && (
            <h3 className="text-xl font-bold text-brand-300">{step}: {title}</h3>
          )}
        </div>
      </div>

      {(stage === 'description' || stage === 'technical' || stage === 'complete') && (
        <div className="mb-4">
          {stage === 'description' && (
            <TypeWriter
              text={description}
              speed={25}
              className="text-white/90 leading-relaxed"
              onComplete={handleDescriptionComplete}
              showCursor={true}
              cursorChar="▋"
            />
          )}
          {(stage === 'technical' || stage === 'complete') && (
            <p className="text-white/90 leading-relaxed mb-3">{description}</p>
          )}
        </div>
      )}

      {(stage === 'technical' || stage === 'complete') && (
        <div className="bg-white/10 rounded-lg p-4 border border-white/20">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-sm">🔧</span>
            <span className="text-sm font-medium text-brand-200">Technical Process:</span>
          </div>
          {stage === 'technical' && (
            <TypeWriter
              text={technicalDetails}
              speed={20}
              className="text-white/80 text-sm leading-relaxed"
              onComplete={handleTechnicalComplete}
              showCursor={true}
              cursorChar="▋"
            />
          )}
          {stage === 'complete' && (
            <p className="text-white/80 text-sm leading-relaxed">{technicalDetails}</p>
          )}
        </div>
      )}

      {stage === 'complete' && (
        <div className="mt-4 flex items-center space-x-2 text-green-400">
          <span className="text-sm">✅</span>
          <span className="text-sm font-medium">Process explanation complete</span>
        </div>
      )}
    </div>
  );
};