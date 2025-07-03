// src/services/MealImageService.js
import MealImageGenerationService from './MealImageGenerationService';
import { mealImages } from '../components/meals/MealsData';

/**
 * Service for handling meal image retrieval with a multi-tiered fallback strategy:
 * 1. Custom image (if provided)
 * 2. Cached image (if already loaded)
 * 3. Image from mealImageMap.json
 * 4. Generated image (if generation is available)
 * 5. Placeholder image (as final fallback)
 */
class MealImageService {
  // Cache for storing image urls during the session to avoid repeated lookups
  static imageCache = new Map();

  /**
   * Determine meal type from meal name for placeholder selection
   * @param {string} mealName - Name of the meal
   * @returns {string} - Detected meal type (breakfast, lunch, dinner, snack) or 'default'
   */
  static detectMealType(mealName) {
    if (!mealName) return 'default';
    
    const lowerName = mealName.toLowerCase();
    
    // Check for breakfast indicators
    if (/breakfast|pancake|waffle|oatmeal|cereal|toast|egg|coffee|omelet|bacon|muffin|morning/i.test(lowerName)) {
      return 'breakfast';
    }
    
    // Special case - yogurt could be breakfast or snack
    // If it specifically mentions 'greek yogurt' or has terms like 'honey', classify as snack
    if (/greek yogurt|yogurt with/i.test(lowerName)) {
      return 'snack';
    }
    // Plain yogurt typically classifies as breakfast
    if (/yogurt/i.test(lowerName) && !/snack/i.test(lowerName)) {
      return 'breakfast';
    }
    
    // Check for lunch indicators
    if (/lunch|sandwich|salad|soup|wrap|bowl|burger|pasta|noon|midday/i.test(lowerName)) {
      return 'lunch';
    }
    
    // Check for dinner indicators
    if (/dinner|steak|roast|curry|casserole|stew|evening meal|supper|fish|salmon|chicken|beef|pork|lamb|evening/i.test(lowerName)) {
      return 'dinner';
    }
    
    // Check for snack indicators
    if (/snack|nuts|chips|fruit|peanut butter|cookie|bar|smoothie|shake|protein|trail mix|between meals/i.test(lowerName)) {
      return 'snack';
    }
    
    return 'default';
  }

  /**
   * Get appropriate placeholder image based on meal type
   * @param {string} mealName - Name of the meal
   * @param {string} type - Type of image ('thumbnail' or 'header')
   * @returns {string} - URL for the appropriate placeholder image
   */
  static getPlaceholderImage(mealName, type = 'thumbnail') {
    const mealType = this.detectMealType(mealName);
    const suffix = type === 'header' ? '-large.jpg' : '.jpg';
    
    // Map meal types to our actual image files
    const mealTypeImageMap = {
      'breakfast': `/assets/images/meals/real/greek-yogurt-with-berries${suffix}`,
      'lunch': `/assets/images/meals/real/mediterranean-quinoa-salad${suffix}`,
      'dinner': `/assets/images/meals/real/grilled-salmon-with-vegetables${suffix}`,
      'snack': `/assets/images/meals/real/apple-with-almond-butter${suffix}`,
      'default': `/assets/images/meals/real/greek-yogurt-with-berries${suffix}`
    };
    
    return mealTypeImageMap[mealType] || mealTypeImageMap['default'];
  }

  /**
   * Retrieve image URL for a meal
   * @param {string} mealName - Name of the meal
   * @param {string} mealId - Optional ID of the meal if name isn't available
   * @param {string} type - Type of image ('thumbnail' or 'header')
   * @param {boolean} forceReload - Whether to force reload bypassing cache
   * @returns {Promise<string>} - URL of the image
   */
  static async getImageUrl(mealName, mealId = null, type = 'thumbnail', forceReload = false) {
    // If there's no meal name or id, return placeholder immediately
    if (!mealName && !mealId) {
      console.log('No meal name or ID provided, returning placeholder');
      return this.getPlaceholderImage(null, type);
    }

    // Create a cache key for this meal
    const normalizedMealName = mealName?.toLowerCase().trim() || '';
    const cacheKey = `${normalizedMealName}-${mealId || ''}-${type}`;

    // Use cache if available and not forcing reload
    if (!forceReload && this.imageCache.has(cacheKey)) {
      console.log(`Using cached image for [${mealName || mealId}]`);
      return this.imageCache.get(cacheKey);
    }

    try {
      // First check in the standard meal images collection
      if (normalizedMealName && mealImages[normalizedMealName]) {
        const imageUrl = type === 'header'
          ? mealImages[normalizedMealName].large || mealImages[normalizedMealName].header
          : mealImages[normalizedMealName].thumbnail;

        if (imageUrl) {
          console.log(`Found image in mealImages for [${mealName}]`);
          this.imageCache.set(cacheKey, imageUrl);
          return imageUrl;
        }
      }

      // If not found in standard collection, try generating or retrieving from other sources
      console.log(`Generating/retrieving image for [${mealName || mealId}]`);
      const generatedUrl = await MealImageGenerationService.getMealImage(mealName, mealId, type);
      
      // Cache the result
      this.imageCache.set(cacheKey, generatedUrl);
      return generatedUrl;
    } catch (error) {
      console.error(`Error getting image for meal [${mealName || mealId}]:`, error);
      
      // Return specialized placeholder image as fallback
      const placeholderUrl = this.getPlaceholderImage(mealName, type);
      
      // Don't cache errors - we want to retry next time
      return placeholderUrl;
    }
  }

  /**
   * Generate a new image for a meal
   * @param {string} mealName - Name of the meal 
   * @param {string} type - Type of image to generate
   * @returns {Promise<string>} - URL of the generated image
   */
  static async generateImage(mealName, type = 'thumbnail') {
    if (!mealName) {
      throw new Error('Meal name is required for image generation');
    }

    try {
      console.log(`Generating new image for meal [${mealName}]`);
      
      // Use the image generation service
      const imageUrl = await MealImageGenerationService.generateMealImage(mealName, type, true);
      
      // Update cache with new image
      const normalizedMealName = mealName.toLowerCase().trim();
      const cacheKey = `${normalizedMealName}--${type}`;
      this.imageCache.set(cacheKey, imageUrl);
      
      return imageUrl;
    } catch (error) {
      console.error(`Failed to generate image for [${mealName}]:`, error);
      throw error;
    }
  }

  /**
   * Clear the image cache
   * @param {string} mealName - Optional specific meal to clear from cache 
   */
  static clearCache(mealName = null) {
    if (mealName) {
      const normalizedMealName = mealName.toLowerCase().trim();
      
      // Clear all variants for this meal
      [...this.imageCache.keys()]
        .filter(key => key.startsWith(`${normalizedMealName}-`))
        .forEach(key => this.imageCache.delete(key));
      
      console.log(`Cleared cache for meal: ${mealName}`);
    } else {
      this.imageCache.clear();
      console.log('Cleared entire image cache');
    }
  }
}

export default MealImageService;