# Meno+ Meal Image Implementation Guide

## Introduction

This document provides a comprehensive implementation guide for resolving the meal image display issues in the Meno+ application. Based on thorough analysis of the current implementation and research into best practices, this guide outlines a complete solution with code examples, error handling strategies, and a reference guide.

## Implementation Strategy Overview

After evaluating multiple approaches, the recommended solution is a **Multi-Tiered Fallback Strategy** that provides the best balance of reliability, scalability, and user experience. This approach combines:

1. **Local Image Mapping**: For common meals with predefined images
2. **API Integration**: For dynamically retrieving images for any meal
3. **Category-based Fallbacks**: When specific images aren't available 
4. **Generic Placeholders**: As a final safety net

## Step-by-Step Implementation

### 1. Fix JSON Structure Issues

Repair the mealImageMap.json file to ensure it's valid JSON:

```json
{
  "Greek Yogurt with Berries and Flaxseeds": {
    "thumbnail": "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    "header": "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "alt": "Greek Yogurt with Berries and Flaxseeds"
  },
  "Mediterranean Yogurt Bowl": {
    "thumbnail": "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    "header": "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "alt": "Mediterranean Yogurt Bowl"
  },
  "Spinach and Mushroom Omelette": {
    "thumbnail": "https://images.unsplash.com/photo-1510693206972-df098062cb71?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    "header": "https://images.unsplash.com/photo-1510693206972-df098062cb71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "alt": "Spinach and Mushroom Omelette"
  }
}
```

### 2. Create MealImageService.js

Create a dedicated service for handling meal images:

```javascript
// src/services/MealImageService.js
import axios from 'axios';

// API configuration - use environment variables
const API_KEY = process.env.REACT_APP_SPOONACULAR_API_KEY || 'YOUR_API_KEY';
const API_URL = 'https://api.spoonacular.com/recipes';

// Constants
const PUBLIC_URL = process.env.PUBLIC_URL || '';
const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days

// Import MealsData for direct mappings
import MealsData from '../components/meals/MealsData';

/**
 * Initialize and manage image cache
 */
class ImageCacheManager {
  constructor() {
    this.cache = this.loadCache();
    this.cleanCache();
  }

  loadCache() {
    try {
      const cachedData = localStorage.getItem('mealImageCache');
      return cachedData ? JSON.parse(cachedData) : { images: {}, timestamp: Date.now() };
    } catch (error) {
      console.error('Error loading image cache:', error);
      return { images: {}, timestamp: Date.now() };
    }
  }

  saveCache() {
    try {
      localStorage.setItem('mealImageCache', JSON.stringify(this.cache));
    } catch (error) {
      console.error('Error saving image cache:', error);
      // Handle storage quota exceeded
    }
  }

  cleanCache() {
    const now = Date.now();
    if (now - this.cache.timestamp > CACHE_EXPIRY) {
      this.cache = { images: {}, timestamp: now };
      this.saveCache();
    }
  }

  getImage(key) {
    return this.cache.images[key] || null;
  }

  setImage(key, url) {
    this.cache.images[key] = url;
    this.saveCache();
  }
}

// Create cache instance
const cacheManager = new ImageCacheManager();

/**
 * Get meal image using multi-tiered fallback strategy
 * @param {string} mealId - ID or name of the meal (will be normalized)
 * @param {string} type - Image type (thumbnail or header)
 * @returns {Promise<string>} - URL of the image
 */
export async function getMealImage(mealId, type = 'thumbnail') {
  try {
    // Normalize mealId (convert to kebab-case)
    const normalizedId = normalizeId(mealId);
    
    // Create cache key
    const cacheKey = `${normalizedId}-${type}`;
    
    // TIER 1: Check cache
    const cachedImage = cacheManager.getImage(cacheKey);
    if (cachedImage) {
      return cachedImage;
    }
    
    // TIER 2: Check hardcoded MealsData
    if (MealsData[normalizedId] && MealsData[normalizedId][type]) {
      const imageUrl = MealsData[normalizedId][type];
      cacheManager.setImage(cacheKey, imageUrl);
      return imageUrl;
    }
    
    // TIER 3: Try API if we have a key
    if (API_KEY && API_KEY !== 'YOUR_API_KEY') {
      const searchName = normalizedId.replace(/-/g, ' ');
      const apiImage = await fetchFromSpoonacular(searchName, type);
      
      if (apiImage) {
        cacheManager.setImage(cacheKey, apiImage);
        return apiImage;
      }
    }
    
    // TIER 4: Try category-based fallback image
    const category = getMealCategory(normalizedId);
    const categoryImagePath = `${PUBLIC_URL}/assets/images/meals/${category}-${type}.jpg`;
    
    // Check if the category image exists
    if (await checkImageExists(categoryImagePath)) {
      return categoryImagePath;
    }
    
    // TIER 5: Final generic fallback
    return `${PUBLIC_URL}/assets/images/meals/placeholder-meal${type === 'header' ? '-large' : ''}.jpg`;
  } catch (error) {
    console.error(`Error getting image for meal ${mealId}:`, error);
    // Ultimate fallback
    return `${PUBLIC_URL}/assets/images/meals/placeholder-meal${type === 'header' ? '-large' : ''}.jpg`;
  }
}

/**
 * Convert a meal name or ID to normalized kebab-case
 * @param {string} input - Meal name or ID
 * @returns {string} - Normalized ID
 */
function normalizeId(input) {
  if (!input) return 'default-meal';
  
  // If already kebab case, return as is
  if (/^[a-z0-9]+(-[a-z0-9]+)*$/.test(input)) {
    return input;
  }
  
  // Convert to kebab case
  return input
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special chars
    .replace(/[\s_]+/g, '-')   // Replace spaces and underscores with hyphens
    .replace(/--+/g, '-')      // Replace multiple hyphens with single
    .trim('-');                // Trim hyphens from start and end
}

/**
 * Determine meal category based on ID or name
 * @param {string} mealId - Normalized meal ID
 * @returns {string} - Category name
 */
function getMealCategory(mealId) {
  // Check for breakfast indicators
  if ([
    'breakfast', 'yogurt', 'oatmeal', 'cereal', 'pancake', 'waffle', 
    'toast', 'egg', 'smoothie', 'bowl', 'muffin', 'bagel'
  ].some(term => mealId.includes(term))) {
    return 'breakfast';
  }
  
  // Check for lunch indicators
  if ([
    'lunch', 'salad', 'sandwich', 'soup', 'wrap', 'bowl', 'pita',
    'hummus', 'taco', 'quesadilla'
  ].some(term => mealId.includes(term))) {
    return 'lunch';
  }
  
  // Check for dinner indicators
  if ([
    'dinner', 'steak', 'fish', 'chicken', 'pasta', 'rice', 'curry',
    'stir-fry', 'roast', 'casserole', 'lasagna'
  ].some(term => mealId.includes(term))) {
    return 'dinner';
  }
  
  // Check for snack indicators
  if ([
    'snack', 'bar', 'nuts', 'fruit', 'crackers', 'chips',
    'popcorn', 'pretzel', 'cookie'
  ].some(term => mealId.includes(term))) {
    return 'snack';
  }
  
  // Default to dinner if no match
  return 'dinner';
}

/**
 * Fetch meal image from Spoonacular API
 * @param {string} mealName - Name of the meal
 * @param {string} type - Image type (thumbnail or header)
 * @returns {Promise<string|null>} - URL of the image or null
 */
async function fetchFromSpoonacular(mealName, type) {
  try {
    const response = await axios.get(`${API_URL}/complexSearch`, {
      params: {
        apiKey: API_KEY,
        query: mealName,
        number: 1
      }
    });
    
    if (response.data.results && response.data.results.length > 0) {
      let imageUrl = response.data.results[0].image;
      
      // For headers, we want larger images when possible
      if (type === 'header' && imageUrl) {
        // Try to modify URL to get larger image (API specific)
        imageUrl = imageUrl.replace(/\d+x\d+/, '636x393');
      }
      
      return imageUrl;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching from Spoonacular:', error);
    return null;
  }
}

/**
 * Check if an image exists
 * @param {string} url - URL or path to image
 * @returns {Promise<boolean>} - Whether image exists
 */
function checkImageExists(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}
```

### 3. Create a Custom React Hook

Implement a React hook for easy image loading in components:

```javascript
// src/hooks/useMealImage.js
import { useState, useEffect } from 'react';
import { getMealImage } from '../services/MealImageService';

/**
 * Custom hook for meal images with loading states
 * @param {string} mealId - ID or name of the meal
 * @param {string} type - Image type (thumbnail or header)
 * @param {object} options - Additional options
 * @returns {object} Image states and handlers
 */
export function useMealImage(mealId, type = 'thumbnail', options = {}) {
  const { lazyLoad = true } = options;
  
  const [imageSrc, setImageSrc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    let isMounted = true;
    let observer;
    const placeholderRef = { current: null };
    
    async function loadImage() {
      if (!mealId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const imageUrl = await getMealImage(mealId, type);
        
        if (isMounted) {
          setImageSrc(imageUrl);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error in useMealImage:', err);
          setError(err);
          setLoading(false);
          // Set fallback image
          setImageSrc(`/assets/images/meals/placeholder-meal${type === 'header' ? '-large' : ''}.jpg`);
        }
      }
    }
    
    // Handle lazy loading if enabled
    if (lazyLoad) {
      // Use Intersection Observer API for lazy loading
      if ('IntersectionObserver' in window) {
        observer = new IntersectionObserver(
          (entries) => {
            if (entries[0].isIntersecting) {
              loadImage();
              if (observer && placeholderRef.current) {
                observer.unobserve(placeholderRef.current);
              }
            }
          },
          { rootMargin: '100px' }
        );
        
        // Create a placeholder element to observe
        placeholderRef.current = document.createElement('div');
        observer.observe(placeholderRef.current);
      } else {
        // Fallback for browsers that don't support IntersectionObserver
        loadImage();
      }
    } else {
      loadImage();
    }
    
    return () => {
      isMounted = false;
      if (observer && placeholderRef.current) {
        observer.unobserve(placeholderRef.current);
        observer.disconnect();
      }
    };
  }, [mealId, type, lazyLoad]);
  
  // Handler for image loading errors
  const handleError = () => {
    setError(new Error('Image failed to load'));
    setImageSrc(`/assets/images/meals/placeholder-meal${type === 'header' ? '-large' : ''}.jpg`);
  };
  
  return {
    src: imageSrc,
    loading,
    error,
    handleError
  };
}
```

### 4. Update MealsData.js

Fix the implementation of MealsData.js:

```javascript
// src/components/meals/MealsData.js

// Define PUBLIC_URL for path resolution
const PUBLIC_URL = process.env.PUBLIC_URL || '';

/**
 * MealsData contains direct mappings for common meals in the application.
 * This serves as a primary source for meal images before falling back to APIs.
 */
const MealsData = {
  // Breakfast options
  'greek-yogurt-bowl': {
    thumbnail: 'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    header: 'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    alt: 'Greek Yogurt with Berries and Flaxseeds'
  },
  'spinach-omelette': {
    thumbnail: 'https://images.unsplash.com/photo-1510693206972-df098062cb71?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    header: 'https://images.unsplash.com/photo-1510693206972-df098062cb71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    alt: 'Spinach and Mushroom Omelette'
  },
  'chia-pudding': {
    thumbnail: 'https://images.unsplash.com/photo-1583269785229-55574474332e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    header: 'https://images.unsplash.com/photo-1583269785229-55574474332e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    alt: 'Overnight Chia Pudding'
  },
  
  // Add more hardcoded meal images here...
  
  /**
   * Get image data for a meal with fallback handling
   * @param {string} mealId - Meal ID or name
   * @param {string} imageType - Type of image (thumbnail or header)
   * @returns {string} - URL or path to image
   */
  getImageData: function(mealId, imageType = 'thumbnail') {
    try {
      // Normalize the meal ID to match our keys
      const normalizedId = this.normalizeMealId(mealId);
      
      // Check if we have this specific meal
      if (this[normalizedId] && this[normalizedId][imageType]) {
        return this[normalizedId][imageType];
      }
      
      // If not found, use placeholder based on image type
      return `${PUBLIC_URL}/assets/images/meals/placeholder-meal${imageType === 'header' ? '-large' : ''}.jpg`;
    } catch (error) {
      console.error(`Error in getImageData for ${mealId}:`, error);
      // Return fallback image on error
      return `${PUBLIC_URL}/assets/images/meals/placeholder-meal${imageType === 'header' ? '-large' : ''}.jpg`;
    }
  },
  
  /**
   * Convert a meal name to a normalized ID
   * @param {string} mealName - Name of the meal
   * @returns {string} - Normalized ID
   */
  normalizeMealId: function(mealName) {
    if (!mealName) return 'default-meal';
    
    // If already in kebab-case format, return as is
    if (/^[a-z0-9]+(-[a-z0-9]+)*$/.test(mealName)) {
      return mealName;
    }
    
    // Convert to kebab case
    return mealName
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/--+/g, '-')
      .trim('-');
  }
};

export default MealsData;
```

### 5. Update MealPlan.jsx

Update the MealPlan component with proper image handling:

```jsx
// src/pages/MealPlan.jsx
import React from 'react';
import { useMealImage } from '../hooks/useMealImage';
// Import other necessary components and styles

function MealCard({ meal, selectedDay, mealType }) {
  // Use our custom hook for image handling
  const { src: imageUrl, loading, error, handleError } = useMealImage(meal.name, 'thumbnail');
  
  return (
    <div className="meal-card">
      <div className="meal-image-container">
        {loading ? (
          <div className="meal-image-skeleton" />
        ) : (
          <img 
            src={imageUrl}
            alt={meal.title || 'Meal'}
            className="meal-image"
            onError={handleError}
          />
        )}
      </div>
      <div className="meal-info">
        <h3>{meal.title}</h3>
        {meal.description && <p>{meal.description}</p>}
      </div>
    </div>
  );
}

// Rest of the MealPlan component...

export default MealPlan;
```

### 6. Update MealDetail.jsx

Update the MealDetail component with proper image handling:

```jsx
// src/pages/MealDetail.jsx
import React from 'react';
import { useMealImage } from '../hooks/useMealImage';
// Import other necessary components and styles

function MealDetail({ mealId }) {
  // Fetch meal data...
  
  // Use our custom hook for the header image
  const { src: headerImageUrl, loading: headerLoading, handleError: handleHeaderError } = 
    useMealImage(mealId, 'header');
  
  return (
    <div className="meal-detail-container">
      {/* Header image section */}
      <div className="meal-header">
        {headerLoading ? (
          <div className="header-image-skeleton" />
        ) : (
          <div 
            className="header-image"
            style={{ backgroundImage: `url(${headerImageUrl})` }}
            role="img"
            aria-label={meal?.title || 'Meal'}
          />
        )}
        <h1 className="meal-title">{meal?.title}</h1>
      </div>
      
      {/* Rest of meal detail content... */}
    </div>
  );
}

export default MealDetail;
```

### 7. Add CSS Styles for Image States

Create styles for the image loading states:

```css
/* src/styles/MealImages.css */

/* Image container */
.meal-image-container {
  position: relative;
  width: 100%;
  height: 180px;
  overflow: hidden;
  border-radius: 8px;
  background-color: #f0f0f0;
}

/* Meal thumbnail image */
.meal-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.3s ease;
}

/* Loading skeleton animation */
.meal-image-skeleton {
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading-pulse 1.5s ease-in-out infinite;
}

/* Header image */
.header-image {
  width: 100%;
  height: 240px;
  background-position: center;
  background-size: cover;
  position: relative;
}

/* Header image loading skeleton */
.header-image-skeleton {
  width: 100%;
  height: 240px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading-pulse 1.5s ease-in-out infinite;
}

/* Loading animation */
@keyframes loading-pulse {
  0% { background-position: 0% 0; }
  100% { background-position: -200% 0; }
}
```

### 8. Create Placeholder Images

Add placeholder images to the public directory:

1. Create `/public/assets/images/meals/` directory
2. Add placeholder images:
   - `placeholder-meal.jpg` (400x300px for thumbnails)
   - `placeholder-meal-large.jpg` (1200x600px for headers)
   - `breakfast-thumbnail.jpg`, `lunch-thumbnail.jpg`, `dinner-thumbnail.jpg`, `snack-thumbnail.jpg`
   - `breakfast-header.jpg`, `lunch-header.jpg`, `dinner-header.jpg`, `snack-header.jpg`

## Error Handling Strategy

The solution implements a comprehensive error handling strategy:

1. **Service Level Error Handling**:
   - Try/catch blocks around all API calls
   - Fallback to next tier when any tier fails
   - Detailed error logging for debugging

2. **Component Level Error Handling**:
   - onError handlers for img tags
   - Loading state management
   - Visual feedback for users

3. **Cache Handling**:
   - Error handling for localStorage operations
   - Cache cleanup for stale entries
   - Graceful degradation when storage is full

## API Integration Guide

### Spoonacular API Integration

1. **Sign Up**: Create an account at [Spoonacular API](https://spoonacular.com/food-api)
2. **Get API Key**: Generate an API key from your dashboard
3. **Environment Setup**: Add your API key to `.env` file:
   ```
   REACT_APP_SPOONACULAR_API_KEY=your_api_key_here
   ```

### API Usage Guidelines

1. **Rate Limiting**: Respect the API rate limits (150 requests/day on free tier)
2. **Caching**: Implement aggressive caching to reduce API calls
3. **Error Handling**: Always handle API errors gracefully

## Reference Guide for Meal Categories

### Meal Categories and Image Requirements

| Category  | Required Images      | Recommended Dimensions  | Common Terms for Detection         |
|-----------|---------------------|-------------------------|-----------------------------------|
| Breakfast | thumbnail, header    | 400x300px, 1200x600px  | yogurt, oatmeal, pancake, eggs   |
| Lunch     | thumbnail, header    | 400x300px, 1200x600px  | salad, sandwich, soup, wrap      |
| Dinner    | thumbnail, header    | 400x300px, 1200x600px  | chicken, pasta, steak, fish      |
| Snack     | thumbnail, header    | 400x300px, 1200x600px  | bar, nuts, fruit, crackers       |

### Naming Conventions

1. **Meal IDs**: Use kebab-case for all meal IDs (e.g., `greek-yogurt-bowl`)
2. **Image Types**:
   - `thumbnail`: Smaller images for meal cards (400x300px)
   - `header`: Larger images for meal detail pages (1200x600px)

## Handling Thousands of Meals

To scale this solution for thousands of meals:

1. **API-First Approach**: Use API as the primary source for meal images
2. **Category-Based Fallbacks**: Use intelligent category detection
3. **Caching Strategy**: Implement tiered caching (localStorage, sessionStorage, memory)
4. **Lazy Loading**: Only load images that are visible in the viewport
5. **Batch Processing**: Pre-process most common meals for faster access

## Testing Strategy

1. **Unit Tests**:
   - Test the normalizeMealId function with various inputs
   - Test the getMealCategory function for accurate categorization
   - Test caching mechanisms for proper storage/retrieval

2. **Integration Tests**:
   - Test the complete fallback chain works correctly
   - Verify API integration with mock responses
   - Ensure proper image loading in components

3. **User Interface Tests**:
   - Verify loading states display correctly
   - Ensure fallback images appear when primaries fail
   - Test responsive behavior across devices

## Conclusion

This implementation guide provides a comprehensive solution for the meal image display issues in the Meno+ application. By implementing a multi-tiered fallback strategy with proper error handling, the application will reliably display meal images even when specific images are unavailable.

The solution is designed to scale with the application as the meal database grows, providing a consistent user experience while minimizing API usage through intelligent caching and category-based fallbacks.