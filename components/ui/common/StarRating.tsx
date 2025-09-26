'use client';

import { useState } from 'react';

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
  disabled?: boolean;
}

const StarIcon = ({ filled, size }: { filled: boolean; size: 'sm' | 'md' | 'lg' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <svg
      className={`${sizeClasses[size]} transition-all duration-300`}
      fill={filled ? 'currentColor' : 'none'}
      stroke={filled ? 'currentColor' : 'currentColor'}
      strokeWidth={filled ? 0 : 1.5}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
      />
    </svg>
  );
};

const ratingLabels = {
  0: 'No rating',
  1: 'Poor',
  2: 'Fair', 
  3: 'Good',
  4: 'Very Good',
  5: 'Excellent',
};

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  onRatingChange,
  maxRating = 5,
  size = 'md',
  showLabels = true,
  disabled = false,
}) => {
  const [hoveredRating, setHoveredRating] = useState<number>(0);

  const handleMouseEnter = (starRating: number) => {
    if (!disabled) {
      setHoveredRating(starRating);
    }
  };

  const handleMouseLeave = () => {
    if (!disabled) {
      setHoveredRating(0);
    }
  };

  const handleClick = (starRating: number) => {
    if (!disabled) {
      onRatingChange(starRating);
    }
  };

  const displayRating = hoveredRating || rating;

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="flex items-center space-x-1">
        {Array.from({ length: maxRating }, (_, index) => {
          const starRating = index + 1;
          const isFilled = starRating <= displayRating;
          const isHovered = hoveredRating > 0;
          
          return (
            <button
              key={starRating}
              type="button"
              onClick={() => handleClick(starRating)}
              onMouseEnter={() => handleMouseEnter(starRating)}
              onMouseLeave={handleMouseLeave}
              disabled={disabled}
              className={`
                relative group transition-all duration-300 transform
                ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                ${isHovered ? 'hover:scale-125' : 'hover:scale-110'}
                ${isFilled ? 'animate-pulse' : ''}
                focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-transparent rounded-sm
              `}
            >
              {/* Glow effect for filled stars */}
              {isFilled && (
                <div className="absolute inset-0 animate-ping">
                  <StarIcon filled={true} size={size} />
                </div>
              )}
              
              {/* Main star */}
              <div className={`
                relative z-10 transition-all duration-300
                ${isFilled 
                  ? 'text-yellow-400 drop-shadow-lg' 
                  : isHovered 
                    ? 'text-yellow-300/70' 
                    : 'text-gray-400 hover:text-yellow-300/50'
                }
              `}>
                <StarIcon filled={isFilled} size={size} />
              </div>

              {/* Hover effect overlay */}
              {isHovered && !isFilled && (
                <div className="absolute inset-0 opacity-50">
                  <div className="w-full h-full bg-yellow-300/20 rounded-full blur-sm"></div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {showLabels && (
        <div className="text-center min-h-[1.25rem]">
          <p className={`
            text-sm transition-all duration-300 font-medium
            ${displayRating > 0 
              ? 'text-yellow-400 animate-fade-in' 
              : 'text-gray-400'
            }
          `}>
            {ratingLabels[displayRating as keyof typeof ratingLabels] || ratingLabels[0]}
          </p>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};
