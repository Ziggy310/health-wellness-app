import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import FavoritesService from '../services/FavoritesService';

// Create the Favorites Context
const FavoritesContext = createContext();

// Provider component
export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const loadFavorites = () => {
      try {
        const savedFavorites = FavoritesService.getFavorites();
        setFavorites(savedFavorites);
      } catch (error) {
        console.error('Error loading favorites:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFavorites();
  }, []);

  // Add a meal to favorites
  const addFavorite = useCallback((mealId) => {
    if (!favorites.includes(mealId)) {
      const newFavorites = [...favorites, mealId];
      setFavorites(newFavorites);
      FavoritesService.saveFavorites(newFavorites);
      return true;
    }
    return false;
  }, [favorites]);

  // Remove a meal from favorites
  const removeFavorite = useCallback((mealId) => {
    const newFavorites = favorites.filter(id => id !== mealId);
    setFavorites(newFavorites);
    FavoritesService.saveFavorites(newFavorites);
    return true;
  }, [favorites]);

  // Toggle favorite status
  const toggleFavorite = useCallback((mealId) => {
    if (favorites.includes(mealId)) {
      return removeFavorite(mealId);
    } else {
      return addFavorite(mealId);
    }
  }, [favorites, addFavorite, removeFavorite]);

  // Check if a meal is favorited
  const isFavorite = useCallback((mealId) => {
    return favorites.includes(mealId);
  }, [favorites]);

  // Clear all favorites
  const clearFavorites = useCallback(() => {
    setFavorites([]);
    FavoritesService.clearFavorites();
  }, []);

  // Get favorites count
  const getFavoritesCount = useCallback(() => {
    return favorites.length;
  }, [favorites]);

  const value = {
    favorites,
    isLoading,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    clearFavorites,
    getFavoritesCount
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

// Custom hook to use favorites context
export const useFavoritesContext = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavoritesContext must be used within a FavoritesProvider');
  }
  return context;
};

export default FavoritesContext;