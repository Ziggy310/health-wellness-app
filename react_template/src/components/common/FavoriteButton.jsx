import React, { useState } from 'react';
import { useFavorites } from '../../hooks/useFavorites';

const FavoriteButton = ({ 
  mealId, 
  mealName = '', 
  size = 'md', 
  className = '',
  showLabel = false,
  variant = 'default'
}) => {
  const { checkIsFavorite, toggleFavoriteStatus } = useFavorites();
  const [isAnimating, setIsAnimating] = useState(false);
  
  const isFavorited = checkIsFavorite(mealId);

  // Size configurations
  const sizeConfig = {
    sm: {
      icon: 'w-4 h-4',
      button: 'p-1.5',
      text: 'text-xs'
    },
    md: {
      icon: 'w-5 h-5',
      button: 'p-2',
      text: 'text-sm'
    },
    lg: {
      icon: 'w-6 h-6',
      button: 'p-2.5',
      text: 'text-base'
    }
  };

  // Variant configurations
  const variantConfig = {
    default: {
      base: 'rounded-full transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50',
      active: 'bg-pink-100 text-pink-600 hover:bg-pink-200',
      inactive: 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600'
    },
    minimal: {
      base: 'transition-all duration-200 hover:scale-110 focus:outline-none',
      active: 'text-pink-600',
      inactive: 'text-gray-400 hover:text-gray-600'
    },
    card: {
      base: 'absolute top-2 right-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50',
      active: 'bg-white text-pink-600 hover:bg-pink-50',
      inactive: 'bg-white/80 text-gray-400 hover:bg-white hover:text-gray-600'
    },
    inline: {
      base: 'transition-all duration-200 hover:scale-110 focus:outline-none',
      active: 'text-pink-600',
      inactive: 'text-gray-400 hover:text-gray-600'
    }
  };

  const currentSize = sizeConfig[size] || sizeConfig.md;
  const currentVariant = variantConfig[variant] || variantConfig.default;

  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    try {
      await toggleFavoriteStatus(mealId, mealName);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setTimeout(() => setIsAnimating(false), 200);
    }
  };

  const buttonClasses = `
    ${currentVariant.base}
    ${isFavorited ? currentVariant.active : currentVariant.inactive}
    ${currentSize.button}
    ${isAnimating ? 'animate-pulse' : ''}
    ${className}
  `.trim();

  return (
    <button
      onClick={handleToggleFavorite}
      className={buttonClasses}
      title={isFavorited ? `Remove ${mealName} from favorites` : `Add ${mealName} to favorites`}
      aria-label={isFavorited ? `Remove ${mealName} from favorites` : `Add ${mealName} to favorites`}
      disabled={isAnimating}
    >
      <div className="flex items-center gap-1.5">
        <svg 
          className={`
            ${currentSize.icon}
            transition-all duration-200
            ${isFavorited ? 'fill-current' : 'fill-none'}
            ${isAnimating ? 'scale-125' : ''}
          `}
          viewBox="0 0 24 24" 
          stroke="currentColor" 
          strokeWidth="2"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
        {showLabel && (
          <span className={`${currentSize.text} font-medium`}>
            {isFavorited ? 'Favorited' : 'Favorite'}
          </span>
        )}
      </div>
    </button>
  );
};

export default FavoriteButton;