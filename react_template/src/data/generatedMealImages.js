// src/data/generatedMealImages.js
/**
 * This file stores references to generated meal images
 * It serves as a persistent cache of images we've already generated
 * to avoid making unnecessary image generation requests
 */

// Sample data structure - this would be populated as images are generated
const generatedMealImages = {
  // Format: 'meal-name-key': { thumbnail: '/path/to/thumbnail.jpg', header: '/path/to/header.jpg' }
  'greek-yogurt-with-berries': {
    thumbnail: '/assets/images/meals/generated/greek-yogurt-with-berries.jpg',
    header: '/assets/images/meals/generated/greek-yogurt-with-berries-large.jpg'
  },
  'mediterranean-quinoa-salad': {
    thumbnail: '/assets/images/meals/generated/mediterranean-quinoa-salad.jpg',
    header: '/assets/images/meals/generated/mediterranean-quinoa-salad-large.jpg'
  },
  'grilled-salmon-with-vegetables': {
    thumbnail: '/assets/images/meals/generated/grilled-salmon-with-vegetables.jpg',
    header: '/assets/images/meals/generated/grilled-salmon-with-vegetables-large.jpg'
  },
  'avocado-toast': {
    thumbnail: '/assets/images/meals/generated/avocado-toast.jpg',
    header: '/assets/images/meals/generated/avocado-toast-large.jpg'
  }
};

/**
 * Get a generated image for a meal
 * @param {string} mealName - Name of the meal
 * @param {string} type - Type of image (thumbnail or header)
 * @returns {string|null} URL of the image or null if not found
 */
export function getGeneratedMealImage(mealName, type = 'thumbnail') {
  if (!mealName) return null;
  
  // Normalize the meal name to match our keys
  const normalizedName = mealName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  
  // Check if we have this exact meal
  if (generatedMealImages[normalizedName]?.[type]) {
    return generatedMealImages[normalizedName][type];
  }
  
  // Try partial matching
  for (const key in generatedMealImages) {
    if (key.includes(normalizedName) || normalizedName.includes(key)) {
      return generatedMealImages[key][type];
    }
  }
  
  return null;
}

/**
 * Add or update a generated meal image
 * @param {string} mealName - Name of the meal
 * @param {string} url - URL of the image
 * @param {string} type - Type of image (thumbnail or header)
 */
export function addGeneratedMealImage(mealName, url, type = 'thumbnail') {
  if (!mealName || !url) return;
  
  // Normalize the meal name
  const normalizedName = mealName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  
  // Add or update the entry
  if (!generatedMealImages[normalizedName]) {
    generatedMealImages[normalizedName] = {};
  }
  
  generatedMealImages[normalizedName][type] = url;
}

export default generatedMealImages;