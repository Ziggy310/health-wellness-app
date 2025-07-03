// src/services/MealImageGenerationService.js
import ImageGetter from './ImageGetter';

/**
 * Service for generating and retrieving meal images from various sources
 */
class MealImageGenerationService {
  // Store generated image URLs to avoid regenerating the same image
  static generatedImages = {};
  
  // External image map data (loaded lazily)
  static mealImageMap = null;
  static isLoadingMap = false;
  static mapLoadPromise = null;

  /**
   * Get an image for a meal using multiple strategies
   * 
   * @param {string} mealName - Name of the meal
   * @param {string} mealId - Optional meal ID if name isn't available
   * @param {string} type - Type of image ('thumbnail' or 'header')
   * @returns {Promise<string>} - URL to the meal image
   */
  static async getMealImage(mealName, mealId = null, type = 'thumbnail') {
    try {
      // First check if we have already generated this image
      const cacheKey = `${mealName || mealId}-${type}`;
      if (this.generatedImages[cacheKey]) {
        return this.generatedImages[cacheKey];
      }

      // Try to find image in meal image map
      const imageFromMap = await this.getImageFromMap(mealName);
      if (imageFromMap) {
        // Store in cache
        this.generatedImages[cacheKey] = type === 'header' ? 
          imageFromMap.replace('.jpg', '-large.jpg') : 
          imageFromMap;
        return this.generatedImages[cacheKey];
      }
      
      // If no image found in map, generate one
      const generatedUrl = await this.generateMealImage(mealName, type);
      this.generatedImages[cacheKey] = generatedUrl;
      return generatedUrl;
    } catch (error) {
      console.error('Error getting meal image:', error);
      
      // Return real image as fallback
      return type === 'header' 
        ? '/assets/images/meals/real/greek-yogurt-with-berries-large.jpg'
        : '/assets/images/meals/real/greek-yogurt-with-berries.jpg';
    }
  }

  /**
   * Generate a new image for a meal
   * 
   * @param {string} mealName - Name of the meal
   * @param {string} type - Type of image ('thumbnail' or 'header')
   * @param {boolean} forceGenerate - Whether to force generation even if already cached
   * @returns {Promise<string>} - URL to the generated image
   */
  static async generateMealImage(mealName, type = 'thumbnail', forceGenerate = false) {
    if (!mealName) {
      throw new Error('Meal name is required for image generation');
    }

    const cacheKey = `${mealName}-${type}`;
    
    // Check if we already have this image generated and not forcing regeneration
    if (!forceGenerate && this.generatedImages[cacheKey]) {
      return this.generatedImages[cacheKey];
    }

    try {
      // Create safe filename from meal name
      const filename = mealName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      
      // Determine the file path for saving
      const isLarge = type === 'header';
      const saveFilename = isLarge ? `${filename}-large.jpg` : `${filename}.jpg`;
      const savePath = `/data/chats/exn6ad/workspace/react_template/public/assets/images/meals/generated/${saveFilename}`;
      
      // Generate the search term based on the meal type
      let searchTerm;
      if (isLarge) {
        searchTerm = `Professional food photography of ${mealName}, gourmet meal, overhead view, beautiful plating, high resolution`;
      } else {
        searchTerm = `Healthy ${mealName} meal, food photography, top view, high quality`;
      }
      
      // Use ImageGetter to get/generate the image
      const relativePath = await ImageGetter.get(
        searchTerm,
        savePath,
        "search" // Use search mode as it falls back to generation if needed
      );
      
      // Store the URL for future reference
      this.generatedImages[cacheKey] = relativePath;
      return relativePath;
    } catch (error) {
      console.error(`Failed to generate image for ${mealName}:`, error);
      
      // Return real image as fallback
      return type === 'header'
        ? '/assets/images/meals/real/greek-yogurt-with-berries-large.jpg'
        : '/assets/images/meals/real/greek-yogurt-with-berries.jpg';
    }
  }

  /**
   * Load the meal image mapping data
   * @private
   * @returns {Promise<Object>} - The meal image mapping data
   */
  static async loadMealImageMap() {
    // If we're already loading, return the existing promise
    if (this.isLoadingMap) {
      return this.mapLoadPromise;
    }
    
    // If we already have the data, return it
    if (this.mealImageMap !== null) {
      return this.mealImageMap;
    }
    
    // Start loading
    this.isLoadingMap = true;
    
    this.mapLoadPromise = new Promise((resolve, reject) => {
      fetch('/data/mealImageMap.json')
        .then(response => {
          if (!response.ok) {
            throw new Error(`Failed to load meal image map: ${response.status} ${response.statusText}`);
          }
          return response.json();
        })
        .then(data => {
          this.mealImageMap = data;
          this.isLoadingMap = false;
          resolve(data);
        })
        .catch(error => {
          console.error('Error loading meal image map:', error);
          this.isLoadingMap = false;
          this.mealImageMap = {}; // Empty object as fallback
          resolve({}); // Resolve with empty map rather than rejecting
        });
    });
    
    return this.mapLoadPromise;
  }

  /**
   * Get an image URL from the meal image map
   * @private
   * @param {string} mealName - Name of the meal
   * @returns {Promise<string|null>} - URL to the image or null if not found
   */
  static async getImageFromMap(mealName) {
    if (!mealName) return null;
    
    try {
      const imageMap = await this.loadMealImageMap();
      const normalizedMealName = mealName.toLowerCase().trim();
      
      // Try exact match
      if (imageMap[normalizedMealName]) {
        return imageMap[normalizedMealName];
      }
      
      // Try partial match
      const keys = Object.keys(imageMap);
      for (const key of keys) {
        if (normalizedMealName.includes(key) || key.includes(normalizedMealName)) {
          return imageMap[key];
        }
      }
      
      // No match found
      return null;
    } catch (error) {
      console.error('Error getting image from map:', error);
      return null;
    }
  }
}

export default MealImageGenerationService;