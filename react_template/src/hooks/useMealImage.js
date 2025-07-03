// src/hooks/useMealImage.js
import { useState, useEffect } from 'react';
import MealImageGenerationService from '../services/MealImageGenerationService';

/**
 * Custom hook for fetching meal images with loading and error states
 * 
 * @param {string} mealName - The name of the meal to get an image for
 * @param {string} mealId - Optional meal ID to use if mealName is not provided
 * @param {string} type - Type of image to fetch (thumbnail or header)
 * @returns {Object} - Object containing imageUrl, loading state, error state, and reload function
 */
export const useMealImage = (mealName, mealId = null, type = 'thumbnail') => {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [attempts, setAttempts] = useState(0);

  // If null mealName is provided, this means we're using a custom image
  // and don't need to fetch anything
  const shouldFetch = mealName !== null;

  // Fetch the image using our service
  const fetchImage = async () => {
    // Skip if we're not supposed to fetch (using custom image)
    if (!shouldFetch) {
      return;
    }

    try {
      setLoading(true);
      setError(false);
      
      if (!mealName && !mealId) {
        throw new Error('No meal name or ID provided');
      }
      
      // Use the service to get the image URL
      const url = await MealImageGenerationService.getMealImage(mealName, mealId, type);
      
      setImageUrl(url);
      
    } catch (err) {
      console.error('Error fetching meal image:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };
  
  // Function to reload the image (useful after errors)
  const reloadImage = () => {
    setAttempts(prev => prev + 1);
  };
  
  // Fetch the image when the hook is first used or when inputs change
  useEffect(() => {
    // If we're not supposed to fetch, don't do anything
    if (shouldFetch) {
      fetchImage();
    }
  }, [mealName, mealId, type, attempts, shouldFetch]);
  
  // If we're not supposed to fetch, return empty states
  if (!shouldFetch) {
    return { imageUrl: null, loading: false, error: false, reloadImage };
  }
  
  return { imageUrl, loading, error, reloadImage };
};