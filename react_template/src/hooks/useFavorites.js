import { useCallback } from 'react';
import { useFavoritesContext } from '../contexts/FavoritesContext';

// Custom hook for managing favorites with simplified interface
export const useFavorites = () => {
  const {
    favorites,
    isLoading,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    clearFavorites,
    getFavoritesCount
  } = useFavoritesContext();

  // Add favorite with success feedback
  const addToFavorites = useCallback(async (mealId, mealName = '') => {
    try {
      const success = addFavorite(mealId);
      if (success && mealName) {
        console.log(`✅ Added "${mealName}" to favorites`);
      }
      return success;
    } catch (error) {
      console.error('Error adding to favorites:', error);
      return false;
    }
  }, [addFavorite]);

  // Remove favorite with success feedback
  const removeFromFavorites = useCallback(async (mealId, mealName = '') => {
    try {
      const success = removeFavorite(mealId);
      if (success && mealName) {
        console.log(`❌ Removed "${mealName}" from favorites`);
      }
      return success;
    } catch (error) {
      console.error('Error removing from favorites:', error);
      return false;
    }
  }, [removeFavorite]);

  // Toggle favorite with feedback
  const toggleFavoriteStatus = useCallback(async (mealId, mealName = '') => {
    try {
      const wasActive = isFavorite(mealId);
      const success = toggleFavorite(mealId);
      
      if (success && mealName) {
        if (wasActive) {
          console.log(`❌ Removed "${mealName}" from favorites`);
        } else {
          console.log(`✅ Added "${mealName}" to favorites`);
        }
      }
      return success;
    } catch (error) {
      console.error('Error toggling favorite:', error);
      return false;
    }
  }, [toggleFavorite, isFavorite]);

  // Check if meal is favorited
  const checkIsFavorite = useCallback((mealId) => {
    try {
      return isFavorite(mealId);
    } catch (error) {
      console.error('Error checking favorite status:', error);
      return false;
    }
  }, [isFavorite]);

  // Get all favorite IDs
  const getAllFavorites = useCallback(() => {
    return favorites;
  }, [favorites]);

  // Get favorites count
  const getCount = useCallback(() => {
    return getFavoritesCount();
  }, [getFavoritesCount]);

  // Clear all favorites with confirmation
  const clearAllFavorites = useCallback(async () => {
    try {
      clearFavorites();
      console.log('🗑️ Cleared all favorites');
      return true;
    } catch (error) {
      console.error('Error clearing favorites:', error);
      return false;
    }
  }, [clearFavorites]);

  return {
    // State
    favorites,
    isLoading,
    count: getCount(),
    
    // Actions
    addToFavorites,
    removeFromFavorites,
    toggleFavoriteStatus,
    clearAllFavorites,
    
    // Queries
    checkIsFavorite,
    getAllFavorites,
    getCount,
    
    // Utilities
    isEmpty: getCount() === 0,
    hasAny: getCount() > 0
  };
};

export default useFavorites;