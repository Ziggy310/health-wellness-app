path='/data/chats/exn6ad/workspace/meal_image_solution.md' content='001|# Meal Image Solution Analysis and Implementation Guide\n002|\n003|## Executive Summary\n004|\n005|The Meno+ application is experiencing critical issues with meal image display. This document provides a comprehensive analysis of the root causes and outlines solution approaches to ensure robust image handling for the application.\n006|\n007|## Problem Analysis\n008|\n009|### Current Implementation Review\n010|\n011|#### MealsData.js Implementation\n012|- **Import Path Issue**: The file attempts to import `mealImageMapping` from a JSON file at `../../../public/data/mealImageMap.json` which has path resolution issues.\n013|- **Missing Function**: The `getImageData` function referenced in components is not defined in MealsData.js despite being called in MealPlan.jsx.\n014|- **Error Handling**: Missing error handling for image loading failures, resulting in broken images.\n015|- **Fallback Strategy**: No fallback images or placeholders defined when primary images fail to load.\n016|\n017|#### Component Integration Issues\n018|- **MealPlan.jsx**: References MealsData.getImageData() but doesn\'t properly import the MealsData module.\n019|- **MealDetail.jsx**: No integration with MealsData despite needing to display meal header images.\n020|- **Inconsistent Patterns**: Different approaches to image rendering between components.\n021|\n022|#### Data Structure Issues\n023|- **JSON Validation**: The mealImageMap.json file exists but has structural issues preventing proper parsing.\n024|- **Missing Standardization**: No consistent naming convention between meal IDs and image references.\n025|\n026|### Root Causes\n027|\n028|1. **Invalid JSON Structure**\n029|   - The mealImageMap.json file has formatting issues preventing proper parsing by JavaScript.\n030|   - Impact: This causes the meal image mapping to fail completely, resulting in no images being displayed.\n031|   - Evidence: JSON parse errors showing "Extra data: line 1 column 2 (char 1)" indicate structure problems.\n032|\n033|2. **Import Path Mismatch**\n034|   - The relative path to mealImageMap.json (`../../../public/data/mealImageMap.json`) is incorrect.\n035|   - Impact: Components cannot locate and load the JSON file, resulting in undefined data.\n036|   - Evidence: Directory checks confirm the import path doesn\'t resolve correctly.\n037|\n038|3. **Missing Function Implementation**\n039|   - The getImageData function referenced in components is not implemented in MealsData.js.\n040|   - Impact: Function calls fail silently, preventing image loading.\n041|   - Evidence: Code analysis shows the function is called but not defined.\n042|\n043|4. **Lack of Proper Component Integration**\n044|   - MealsData.js is not properly imported in components that use it.\n045|   - Impact: References to MealsData.getImageData() fail because the module isn\'t available.\n046|   - Evidence: No import statements for MealsData found in components that try to use it.\n047|\n048|5. **Inadequate Error Handling**\n049|   - Missing try/catch blocks for error handling when images fail to load.\n050|   - Impact: When image loading fails, no fallback mechanism is triggered.\n051|   - Evidence: No error handling code detected in image loading implementation.\n052|\n053|## Solution Architecture\n054|\n055|### 1. Fix Core Implementation Issues\n056|\n057|#### Repair MealsData.js Implementation\n058|- Create proper getImageData function with error handling\n059|- Fix import path for mealImageMap.json\n060|- Implement tiered fallback strategy for image loading\n061|\n062|#### Fix JSON Structure\n063|- Validate and repair mealImageMap.json to ensure proper JSON format\n064|- Implement consistent naming convention for meal images\n065|\n066|#### Component Integration\n067|- Add proper imports in MealPlan.jsx and MealDetail.jsx\n068|- Standardize image loading approach across components\n069|\n070|### 2. Enhanced Image Loading Architecture\n071|\n072|#### Tiered Fallback Strategy\n073|1. **Primary Source**: Properly structured JSON mapping file\n074|2. **Secondary Source**: Dynamic image retrieval based on meal name pattern\n075|3. **Tertiary Source**: Category-based placeholder images (breakfast, lunch, dinner)\n076|4. **Final Fallback**: Generic meal placeholder image\n077|\n078|#### Error Handling\n079|- Implement try/catch blocks around all image loading code\n080|- Add onError handlers to image components\n081|- Log errors for debugging purposes\n082|\n083|#### Path Resolution\n084|- Use proper React path resolution with PUBLIC_URL for static assets\n085|- Ensure consistent path handling across the application\n086|\n087|### 3. API Integration Options\n088|\n089|#### Food Image APIs\n090|1. **Spoonacular API** \n091|   - Provides food images based on recipe names\n092|   - Has free tier with limited requests\n093|   - Requires API key\n094|\n095|2. **TheMealDB API**\n096|   - Free API with food images organized by categories\n097|   - Simple integration with no authentication for basic tier\n098|   - Limited to their database of meals\n099|\n100|3. **Unsplash API** \n101|   - High-quality food photography\n102|   - Generous free tier (50 requests/hour)\n103|   - More generic food images rather than specific meals\n104|\n105|4. **Custom AWS S3 Bucket**\n106|   - Store pre-generated meal images\n107|   - Complete control over image quality and selection\n108|   - Requires additional infrastructure setup\n109|\n110|#### Implementation Strategy\n111|- Create adapter pattern for API integration\n112|- Implement caching mechanism for performance\n113|- Build flexible fallback chain between APIs\n114|\n115|## Implementation Guide\n116|\n117|### 1. Fix mealImageMap.json\n118|\n119|```json\n120|{\n121|  "Greek Yogurt with Berries and Flaxseeds": {\n122|    "thumbnail": "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",\n123|    "header": "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",\n124|    "alt": "Greek Yogurt with Berries and Flaxseeds"\n125|  },\n126|  "Mediterranean Yogurt Bowl": {\n127|    "thumbnail": "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",\n128|    "header": "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",\n129|    "alt": "Mediterranean Yogurt Bowl"\n130|  }\n131|}\n132|```\n133|\n134|### 2. Update MealsData.js\n135|\n136|```javascript\n137|// This file contains all meal image URLs for the application\n138|import { PUBLIC_URL } from \'../../../config\';\n139|\n140|const MealsData = {\n141|  // Meal image data directly defined\n142|  \'greek-yogurt-bowl\': {\n143|    thumbnail: \'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80\',\n144|    header: \'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80\',\n145|    alt: \'Greek Yogurt with Berries and Flaxseeds\'\n146|  },\n147|  \'spinach-omelette\': {\n148|    thumbnail: \'https://images.unsplash.com/photo-1510693206972-df098062cb71?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80\',\n149|    header: \'https://images.unsplash.com/photo-1510693206972-df098062cb71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80\',\n150|    alt: \'Spinach and Mushroom Omelette\'\n151|  },\n152|  \n153|  // Function to get image data with proper error handling\n154|  getImageData: function(mealId, context = \'thumbnail\') {\n155|    try {\n156|      // Try to get the meal data\n157|      const mealData = this[mealId] || {};\n158|      \n159|      // Return the requested image type or fallback\n160|      if (mealData[context]) {\n161|        return mealData[context];\n162|      }\n163|      \n164|      // Fallback to category-based images\n165|      const category = this.getMealCategory(mealId);\n166|      return this.getCategoryFallbackImage(category, context);\n167|      \n168|    } catch (error) {\n169|      console.error(`Error loading image for ${mealId}:`, error);\n170|      // Return placeholder image as final fallback\n171|      return `${PUBLIC_URL}/assets/images/meals/placeholder-meal${context === \'header\' ? \'-large\' : \'\'}.jpg`;\n172|    }\n173|  },\n174|  \n175|  // Helper functions\n176|  getMealCategory: function(mealId) {\n177|    // Logic to determine meal category\n178|    if (mealId.includes(\'yogurt\') || mealId.includes(\'smoothie\') || mealId.includes(\'breakfast\')) {\n179|      return \'breakfast\';\n180|    } else if (mealId.includes(\'salad\') || mealId.includes(\'bowl\') || mealId.includes(\'lunch\')) {\n181|      return \'lunch\';\n182|    } else {\n183|      return \'dinner\';\n184|    }\n185|  },\n186|  \n187|  getCategoryFallbackImage: function(category, context) {\n188|    // Return category-specific fallback images\n189|    return `${PUBLIC_URL}/assets/images/meals/${category}-${context}.jpg`;\n190|  }\n191|};\n192|\n193|export default MealsData;\n194|```\n195|\n196|### 3. Update MealPlan.jsx\n197|\n198|```jsx\n199|// In MealPlan.jsx\n200|import React, { useState, useEffect } from \'react\';\n201|import MealsData from \'../../components/meals/MealsData\';\n202|\n203|function MealCard({ meal, selectedDay, mealType }) {\n204|  // Get the meal image with proper error handling\n205|  const [imgSrc, setImgSrc] = useState(\n206|    MealsData.getImageData(meal.name, \'thumbnail\')\n207|  );\n208|  \n209|  // Handle image loading errors\n210|  const handleImgError = () => {\n211|    // Try to get a fallback image\n212|    setImgSrc(`/assets/images/meals/placeholder-meal.jpg`);\n213|  };\n214|  \n215|  return (\n216|    <div className="meal-card">\n217|      <img \n218|        src={imgSrc} \n219|        alt={meal.title || \'Meal image\'} \n220|        onError={handleImgError}\n221|      />\n222|      <h3>{meal.title}</h3>\n223|    </div>\n224|  );\n225|}\n226|```\n227|\n228|### 4. Update MealDetail.jsx\n229|\n230|```jsx\n231|// In MealDetail.jsx\n232|import React, { useState, useEffect } from \'react\';\n233|import MealsData from \'../../components/meals/MealsData\';\n234|\n235|function MealHeader({ meal }) {\n236|  // Get the meal header image with proper error handling\n237|  const [headerImgSrc, setHeaderImgSrc] = useState(\n238|    MealsData.getImageData(meal.name, \'header\')\n239|  );\n240|  \n241|  // Handle image loading errors\n242|  const handleImgError = () => {\n243|    // Try to get a fallback image\n244|    setHeaderImgSrc(`/assets/images/meals/placeholder-meal-large.jpg`);\n245|  };\n246|  \n247|  return (\n248|    <div className="meal-header">\n249|      <div className="meal-banner" \n250|        style={{ \n251|          backgroundImage: `url(${headerImgSrc})`\n252|        }}\n253|        onError={handleImgError}>\n254|        <h1>{meal.title}</h1>\n255|      </div>\n256|    </div>\n257|  );\n258|}\n259|```\n260|\n261|### 5. API Integration Example\n262|\n263|```javascript\n264|// API Integration Example\n265|import axios from \'axios\';\n266|\n267|const FOOD_API_KEY = process.env.REACT_APP_FOOD_API_KEY;\n268|const API_URL = \'https://api.spoonacular.com/recipes\';\n269|\n270|async function fetchMealImage(mealName) {\n271|  try {\n272|    // Make API request\n273|    const response = await axios.get(`${API_URL}/complexSearch`, {\n274|      params: {\n275|        apiKey: FOOD_API_KEY,\n276|        query: mealName,\n277|        number: 1\n278|      }\n279|    });\n280|    \n281|    // Return image URL if available\n282|    if (response.data.results && response.data.results.length > 0) {\n283|      return response.data.results[0].image;\n284|    }\n285|    \n286|    return null; // No image found\n287|  } catch (error) {\n288|    console.error(\'Error fetching meal image:\', error);\n289|    return null;\n290|  }\n291|}\n292|\n293|// Enhanced getImageData function with API integration\n294|getImageData: async function(mealId, context = \'thumbnail\') {\n295|  try {\n296|    // First check if we have the image locally\n297|    const mealData = this[mealId] || {};\n298|    if (mealData[context]) {\n299|      return mealData[context];\n300|    }\n301|    \n302|    // Try to fetch from API using the meal ID converted to a search term\n303|    const searchTerm = mealId.replace(/-/g, \' \');\n304|    const apiImage = await fetchMealImage(searchTerm);\n305|    if (apiImage) {\n306|      return apiImage;\n307|    }\n308|    \n309|    // Fallback to category image\n310|    const category = this.getMealCategory(mealId);\n311|    return this.getCategoryFallbackImage(category, context);\n312|    \n313|  } catch (error) {\n314|    console.error(`Error loading image for ${mealId}:`, error);\n315|    return `/assets/images/meals/placeholder-meal${context === \'header\' ? \'-large\' : \'\'}.jpg`;\n316|  }\n317|}\n318|```\n319|\n320|## Implementation Roadmap\n321|\n322|### Phase 1: Critical Fixes (1-2 days)\n323|1. Fix mealImageMap.json format\n324|2. Implement proper getImageData function in MealsData.js\n325|3. Update component imports and integration\n326|4. Add basic error handling\n327|\n328|### Phase 2: Enhanced Image Experience (3-5 days)\n329|1. Create comprehensive fallback strategy\n330|2. Design and add category-based placeholder images\n331|3. Implement image loading states and transitions\n332|4. Improve error boundaries and user feedback\n333|\n334|### Phase 3: API Integration (7-10 days)\n335|1. Research and select optimal food image API\n336|2. Implement API adapter and caching layer\n337|3. Build integration with meal planning system\n338|4. Add comprehensive logging and monitoring\n339|\n340|## Best Practices & Guidelines\n341|\n342|### Naming Conventions\n343|- Use kebab-case for meal IDs (e.g., \'greek-yogurt-bowl\')\n344|- Use descriptive alt text for all images\n345|- Follow consistent naming for image types (thumbnail, header)\n346|\n347|### Error Handling\n348|- Always implement onError handlers for image elements\n349|- Log errors with enough context for debugging\n350|- Provide visual feedback when images fail to load\n351|\n352|### Performance Considerations\n353|- Optimize image sizes for their display contexts\n354|- Implement lazy loading for meal images\n355|- Cache API responses to reduce redundant calls\n356|- Preload images for common meal selections\n357|\n358|## Reference Guide\n359|\n360|### Meal Categories and Image Types\n361|\n362|| Category | Required Image Types | Recommended Dimensions |\n363||----------|---------------------|-------------------------|\n364|| Breakfast | thumbnail, header | 400x300px, 1200x600px |\n365|| Lunch | thumbnail, header | 400x300px, 1200x600px |\n366|| Dinner | thumbnail, header | 400x300px, 1200x600px |\n367|| Snack | thumbnail | 400x300px |\n368|| Dessert | thumbnail, header | 400x300px, 1200x600px |\n369|\n370|### Fallback Image Strategy\n371|\n372|1. Use meal-specific image if available\n373|2. If not found, try API retrieval\n374|3. If API fails, use category fallback\n375|4. If all else fails, use generic placeholder\n376|\n377|## Conclusion\n378|\n379|The meal image display issues in Meno+ stem from multiple interconnected problems in the implementation. By addressing the JSON structure issues, implementing proper error handling, and creating a robust fallback strategy, we can provide a reliable image display experience for users. The long-term solution should include API integration to dynamically fetch meal images based on names, ensuring scalability as the meal database grows.'
## Research Findings

### Food Image API Options

After evaluating multiple API options, here are the most viable solutions for dynamically retrieving meal images:

| API | Free Tier | Strengths | Limitations |
|-----|-----------|-----------|------------|
| Spoonacular | Free tier: 150 requests/day | Extensive food database, Multiple image types | Limited free tier, Requires API key |
| TheMealDB | Free with no API key required (basic tier) | Completely free, Simple integration | Limited meal database, Less fine-grained control |
| Unsplash API | Free tier: 50 requests/hour | Beautiful images, Generous free tier | Not specific to recipes/meals, Generic food images |
| Pexels API | Free with API key | No request limits mentioned, Free to use | Not specific to recipes/meals, Generic food images |
| Custom AWS S3 Solution | Pay as you go (storage + bandwidth) | Complete control over images, Reliable CDN delivery | Requires manual image curation, Higher implementation effort |

**Recommended Primary API**: Spoonacular provides the best match for specific meal names, which is ideal for our use case.

### Fallback Strategy

A robust multi-tiered fallback approach is recommended:

1. **Tier 1**: Local predefined meal images in MealsData.js
2. **Tier 2**: API-sourced images (Spoonacular/TheMealDB)
3. **Tier 3**: Category-based fallback images (breakfast/lunch/dinner)
4. **Tier 4**: Generic meal placeholder image

### Implementation Approach

1. **Custom React Hook**: Create a reusable `useImageWithFallback` hook that handles loading states and fallback cascades
2. **Progressive Loading**: Implement placeholder animations during image loading
3. **Predictable Naming**: Use consistent kebab-case for meal IDs that map to image assets
4. **Error Handling**: Implement comprehensive error boundaries for all image components

## Sample Code Implementations

### API Integration - Spoonacular Example

```javascript
// MealImageService.js - Spoonacular API Integration Example

import axios from 'axios';

// Constants
const API_KEY = process.env.REACT_APP_SPOONACULAR_API_KEY;
const API_URL = 'https://api.spoonacular.com';
const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

// Initialize cache
const initializeCache = () => {
  // Check if we have a cache in localStorage
  const cachedData = localStorage.getItem('mealImageCache');
  return cachedData ? JSON.parse(cachedData) : { images: {}, timestamp: Date.now() };
};

let imageCache = initializeCache();

// Periodically clean old cache entries
const cleanCache = () => {
  const now = Date.now();
  if (now - imageCache.timestamp > CACHE_EXPIRY) {
    imageCache = { images: {}, timestamp: now };
    localStorage.setItem('mealImageCache', JSON.stringify(imageCache));
  }
};

// Save cache to localStorage
const saveCache = () => {
  localStorage.setItem('mealImageCache', JSON.stringify(imageCache));
};

/**
 * Get meal image from Spoonacular API with caching
 * @param {string} mealName - The name of the meal to search for
 * @param {string} imageType - Type of image (thumbnail or header)
 * @returns {Promise<string>} - URL of the meal image
 */
export const getMealImage = async (mealName, imageType = 'thumbnail') => {
  try {
    cleanCache();
    
    // Format key for cache
    const cacheKey = `${mealName}:${imageType}`;
    
    // Check if in cache
    if (imageCache.images[cacheKey]) {
      return imageCache.images[cacheKey];
    }
    
    // Make API request to Spoonacular
    const response = await axios.get(`${API_URL}/recipes/complexSearch`, {
      params: {
        apiKey: API_KEY,
        query: mealName,
        number: 1
      }
    });
    
    // Check if we got results
    if (response.data.results && response.data.results.length > 0) {
      let imageUrl = response.data.results[0].image;
      
      // Modify URL based on imageType (header needs larger image)
      if (imageType === 'header' && imageUrl) {
        // For Spoonacular, we can modify the size in the URL
        imageUrl = imageUrl.replace('312x231', '636x393');
      }
      
      // Save to cache
      imageCache.images[cacheKey] = imageUrl;
      saveCache();
      
      return imageUrl;
    }
    
    // Return null if no image found
    return null;
  } catch (error) {
    console.error('Error fetching meal image:', error);
    return null;
  }
};

/**
 * Enhanced getImageData function with tiered fallback strategy
 * @param {string} mealId - ID of the meal
 * @param {string} context - Type of image (thumbnail or header)
 * @returns {Promise<string>} - URL of the image with fallbacks
 */
export const getImageData = async (mealId, context = 'thumbnail') => {
  try {
    // Step 1: Try to get from local MealsData object
    const localMealData = MealsData[mealId];
    if (localMealData && localMealData[context]) {
      return localMealData[context];
    }
    
    // Step 2: Try to get from API
    const mealName = mealId.replace(/-/g, ' ');
    const apiImage = await getMealImage(mealName, context);
    if (apiImage) {
      return apiImage;
    }
    
    // Step 3: Try category-based fallback
    const category = getMealCategory(mealId);
    const categoryImage = `/assets/images/meals/${category}-${context}.jpg`;
    
    // Step 4: If all else fails, use generic placeholder
    return categoryImage || `/assets/images/meals/placeholder-meal${context === 'header' ? '-large' : ''}.jpg`;
  } catch (error) {
    console.error(`Error in getImageData for ${mealId}:`, error);
    // Final fallback
    return `/assets/images/meals/placeholder-meal${context === 'header' ? '-large' : ''}.jpg`;
  }
};
```

### Custom Image Loading Hook

```javascript
// useImageWithFallback.js - Custom React Hook for Image Loading with Fallbacks

import { useState, useEffect } from 'react';

/**
 * Custom hook for loading images with built-in fallback mechanism
 * @param {string} primarySrc - Primary image source URL
 * @param {string} fallbackSrc - Fallback image source URL
 * @param {boolean} lazyLoad - Whether to lazy load the image
 * @returns {Object} - Image state and handlers
 */
const useImageWithFallback = (primarySrc, fallbackSrc, lazyLoad = true) => {
  const [src, setSrc] = useState(lazyLoad ? null : primarySrc);
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Reset state when primary source changes
    setSrc(lazyLoad ? null : primarySrc);
    setError(false);
    setLoaded(false);
    
    // If lazy loading is enabled, use IntersectionObserver
    if (lazyLoad) {
      let observer;
      let imgElement;
      
      // Create a mock element for the observer to watch
      const target = document.createElement('div');
      
      observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Element is in viewport, load the image
            setSrc(primarySrc);
            // Cleanup observer
            if (observer && target) {
              observer.unobserve(target);
            }
          }
        });
      });
      
      observer.observe(target);
      
      return () => {
        if (observer && target) {
          observer.unobserve(target);
          observer.disconnect();
        }
      };
    }
  }, [primarySrc, lazyLoad]);
  
  const handleError = () => {
    if (!error && fallbackSrc) {
      setError(true);
      setSrc(fallbackSrc);
    }
  };
  
  const handleLoad = () => {
    setLoaded(true);
  };
  
  return { src, error, loaded, handleError, handleLoad };
};

export default useImageWithFallback;
```


## Comprehensive Implementation Recommendations

### 1. Fix the Current Implementation

1. **Repair JSON Structure**: Format mealImageMap.json correctly to ensure it's valid JSON
   ```json
   {
     "Greek Yogurt with Berries and Flaxseeds": {
       "thumbnail": "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
       "header": "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
       "alt": "Greek Yogurt with Berries and Flaxseeds"
     }
   }
   ```

2. **Add Missing Function**: Implement the missing getImageData function in MealsData.js
   ```javascript
   getImageData: function(mealId, context = 'thumbnail') {
     try {
       // Try to get the meal data
       const mealData = this[mealId] || {};
       
       // Return the requested image type or fallback
       if (mealData[context]) {
         return mealData[context];
       }
       
       // Use a category-based fallback
       return `/assets/images/meals/placeholder-meal${context === 'header' ? '-large' : ''}.jpg`;
     } catch (error) {
       console.error(`Error loading image for ${mealId}:`, error);
       return `/assets/images/meals/placeholder-meal${context === 'header' ? '-large' : ''}.jpg`;
     }
   }
   ```

3. **Fix Import Paths**: Ensure components correctly import MealsData
   ```javascript
   import MealsData from '../../components/meals/MealsData';
   ```

### 2. Implement Improved Architecture

1. **Create a Meal Image Service**: Separate image handling into a dedicated service
2. **Implement API Integration**: Use Spoonacular or TheMealDB for dynamic image retrieval
3. **Add Comprehensive Caching**: Cache API responses in localStorage
4. **Standardize Component Design**: Create consistent meal card components across the application

### 3. Strategies for Handling Thousands of Meals

1. **Dynamic API Loading**: Use APIs as the primary source for meal images
2. **Pattern-Based Fallbacks**: Create algorithms that match meal names to image categories
3. **Batch Pre-Processing**: Pre-generate mappings for common meals
4. **User-Generated Content**: Allow users to submit or vote on meal images

### 4. Error Handling Best Practices

1. **Implement Error Boundaries**: Catch errors at component level
2. **Visual Feedback**: Show friendly placeholders when images fail to load
3. **Logging**: Track image loading failures for future improvement
4. **Retry Mechanisms**: Automatically retry failed image loads with exponential backoff
