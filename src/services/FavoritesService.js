// FavoritesService.js - Service for managing meal favorites with localStorage persistence
class FavoritesService {
  static STORAGE_KEY = 'meal_favorites';

  // Get all favorite meal IDs from localStorage
  static getFavorites() {
    try {
      const favorites = localStorage.getItem(this.STORAGE_KEY);
      return favorites ? JSON.parse(favorites) : [];
    } catch (error) {
      console.error('Error loading favorites:', error);
      return [];
    }
  }

  // Save favorites array to localStorage
  static saveFavorites(favorites) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favorites));
      return true;
    } catch (error) {
      console.error('Error saving favorites:', error);
      return false;
    }
  }

  // Add a meal to favorites
  static addFavorite(mealId) {
    const favorites = this.getFavorites();
    if (!favorites.includes(mealId)) {
      favorites.push(mealId);
      return this.saveFavorites(favorites);
    }
    return true;
  }

  // Remove a meal from favorites
  static removeFavorite(mealId) {
    const favorites = this.getFavorites();
    const updatedFavorites = favorites.filter(id => id !== mealId);
    return this.saveFavorites(updatedFavorites);
  }

  // Check if a meal is favorited
  static isFavorite(mealId) {
    const favorites = this.getFavorites();
    return favorites.includes(mealId);
  }

  // Toggle favorite status
  static toggleFavorite(mealId) {
    if (this.isFavorite(mealId)) {
      return this.removeFavorite(mealId);
    } else {
      return this.addFavorite(mealId);
    }
  }

  // Clear all favorites
  static clearFavorites() {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing favorites:', error);
      return false;
    }
  }

  // Get count of favorites
  static getFavoritesCount() {
    return this.getFavorites().length;
  }
}

export default FavoritesService;