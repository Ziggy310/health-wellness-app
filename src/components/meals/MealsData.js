// This file contains all meal image URLs for the application
// Import the meal image mapping from the JSON file
import mealImageMapping from '../../../public/data/mealImageMap.json';

// Create a normalized mapping for easy meal name lookups
const createNormalizedMealMapping = () => {
  const normalized = {};
  
  // Process the meal image mapping and normalize meal names for lookup
  try {
    Object.entries(mealImageMapping).forEach(([key, value]) => {
      // Convert meal name to lowercase for case-insensitive matching
      normalized[key.toLowerCase()] = value;
    });
  } catch (error) {
    console.error('Error processing meal image mapping:', error);
  }
  
  return normalized;
};

// Initialize the normalized meal images object
const mealImages = createNormalizedMealMapping();

// Add local meal image paths
const localMealImages = {
  // Breakfast meals
  'greek yogurt with berries and flaxseeds': {
    thumbnail: '/assets/images/meals/real/greek-yogurt-with-berries.jpg',
    header: '/assets/images/meals/real/greek-yogurt-with-berries-large.jpg',
    alt: 'Greek Yogurt with Berries and Flaxseeds'
  },
  'avocado toast with egg': {
    thumbnail: '/assets/images/meals/real/avocado-toast-with-egg.jpg',
    header: '/assets/images/meals/real/avocado-toast-with-egg.jpg',
    alt: 'Avocado Toast with Egg'
  },
  'oatmeal with fruits and nuts': {
    thumbnail: '/assets/images/meals/real/oatmeal-with-fruits.jpg',
    header: '/assets/images/meals/real/oatmeal-with-fruits.jpg',
    alt: 'Oatmeal with Fruits and Nuts'
  },
  
  // Lunch meals
  'mediterranean quinoa salad': {
    thumbnail: '/assets/images/meals/real/mediterranean-quinoa-salad.jpg',
    header: '/assets/images/meals/real/mediterranean-quinoa-salad-large.jpg',
    alt: 'Mediterranean Quinoa Salad'
  },
  'grilled chicken wrap': {
    thumbnail: '/assets/images/meals/real/grilled-chicken-wrap.jpg',
    header: '/assets/images/meals/real/grilled-chicken-wrap.jpg',
    alt: 'Grilled Chicken Wrap'
  },
  
  // Dinner meals
  'baked salmon with roasted vegetables': {
    thumbnail: '/assets/images/meals/real/grilled-salmon-with-vegetables.jpg',
    header: '/assets/images/meals/real/grilled-salmon-with-vegetables-large.jpg',
    alt: 'Baked Salmon with Roasted Vegetables'
  },
  
  // Snack meals
  'apple slices with almond butter': {
    thumbnail: '/assets/images/meals/real/apple-with-almond-butter.jpg',
    header: '/assets/images/meals/real/apple-with-almond-butter-large.jpg',
    alt: 'Apple Slices with Almond Butter'
  },
  'mixed nuts and dried fruits': {
    thumbnail: '/assets/images/meals/real/mixed-nuts-and-dried-fruits.jpg',
    header: '/assets/images/meals/real/mixed-nuts-and-dried-fruits.jpg',
    alt: 'Mixed Nuts and Dried Fruits'
  }
};

// Merge local images into the normalized mapping
Object.entries(localMealImages).forEach(([key, value]) => {
  mealImages[key.toLowerCase()] = value;
});

// Initialize the MealsData object
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
  'avocado-toast': {
    thumbnail: 'https://images.unsplash.com/photo-1603046891744-1f176fab3c75?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    header: 'https://images.unsplash.com/photo-1603046891744-1f176fab3c75?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    alt: 'Avocado Toast with Poached Egg'
  },
  'smoothie-bowl': {
    thumbnail: 'https://images.unsplash.com/photo-1504310578167-435ac09e69f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    header: 'https://images.unsplash.com/photo-1504310578167-435ac09e69f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    alt: 'Berry Smoothie Bowl'
  },
  'grain-pancakes': {
    thumbnail: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    header: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    alt: 'Whole Grain Pancakes with Berries'
  },
  'vegetable-frittata': {
    thumbnail: 'https://images.unsplash.com/photo-1568625365131-079e026a927d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    header: 'https://images.unsplash.com/photo-1568625365131-079e026a927d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    alt: 'Vegetable Frittata'
  },

  // Lunch options
  'quinoa-salad': {
    thumbnail: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    header: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    alt: 'Mediterranean Quinoa Salad'
  },
  'lentil-soup': {
    thumbnail: 'https://images.unsplash.com/photo-1583608205442-71b8677566eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    header: 'https://images.unsplash.com/photo-1583608205442-71b8677566eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    alt: 'Lentil Soup with Mixed Greens'
  },
  'chickpea-wrap': {
    thumbnail: 'https://images.unsplash.com/photo-1600850056064-a8b380df8395?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    header: 'https://images.unsplash.com/photo-1600850056064-a8b380df8395?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    alt: 'Chickpea and Avocado Wrap'
  },
  'poke-bowl': {
    thumbnail: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    header: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    alt: 'Salmon Poke Bowl'
  },
  'tuna-salad': {
    thumbnail: 'https://images.unsplash.com/photo-1599021456807-25db0f974333?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    header: 'https://images.unsplash.com/photo-1599021456807-25db0f974333?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    alt: 'Mediterranean Tuna Salad'
  },
  'veggie-sandwich': {
    thumbnail: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    header: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    alt: 'Grilled Vegetable and Mozzarella Sandwich'
  },
  'grain-bowl': {
    thumbnail: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    header: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    alt: 'Grain Bowl with Roasted Vegetables'
  },

  // Dinner options
  'salmon-veggies': {
    thumbnail: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    header: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    alt: 'Grilled Salmon with Roasted Vegetables'
  },
  'roasted-chicken': {
    thumbnail: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    header: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    alt: 'Herb-Roasted Chicken with Sweet Potatoes'
  },
  'baked-fish': {
    thumbnail: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    header: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    alt: 'Baked Cod with Quinoa and Broccoli'
  },
  'turkey-stirfry': {
    thumbnail: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    header: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    alt: 'Turkey and Vegetable Stir Fry'
  },
  'bean-chili': {
    thumbnail: 'https://images.unsplash.com/photo-1608037521244-f1c6c7635194?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    header: 'https://images.unsplash.com/photo-1608037521244-f1c6c7635194?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    alt: 'Vegetable and Bean Chili'
  },
  'shrimp-quinoa': {
    thumbnail: 'https://images.unsplash.com/photo-1551248429-40975aa4de74?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    header: 'https://images.unsplash.com/photo-1551248429-40975aa4de74?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    alt: 'Grilled Shrimp with Quinoa Tabbouleh'
  },
  'herb-fish': {
    thumbnail: 'https://images.unsplash.com/photo-1556040220-4096d522e6a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    header: 'https://images.unsplash.com/photo-1556040220-4096d522e6a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    alt: 'Herb-Baked Fish with Sweet Potato'
  },

  // Snacks options
  'apple-almond-butter': {
    thumbnail: 'https://images.unsplash.com/photo-1568909344368-6f14a07b56a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    header: 'https://images.unsplash.com/photo-1568909344368-6f14a07b56a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    alt: 'Apple with Almond Butter'
  },
  'nuts-berries': {
    thumbnail: 'https://images.unsplash.com/photo-1612706649829-ee8ea0093201?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    header: 'https://images.unsplash.com/photo-1612706649829-ee8ea0093201?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    alt: 'Mixed Nuts and Dried Berries'
  },
  'yogurt-walnuts': {
    thumbnail: 'https://images.unsplash.com/photo-1550461716-dbf266b2a8a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    header: 'https://images.unsplash.com/photo-1550461716-dbf266b2a8a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    alt: 'Greek Yogurt with Honey and Walnuts'
  },
  'hummus-veggies': {
    thumbnail: 'https://images.unsplash.com/photo-1505576633757-0ac1084af824?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    header: 'https://images.unsplash.com/photo-1505576633757-0ac1084af824?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    alt: 'Hummus with Vegetable Sticks'
  },
  'chocolate-almonds': {
    thumbnail: 'https://images.unsplash.com/photo-1548907040-4d42bdfccdd0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    header: 'https://images.unsplash.com/photo-1548907040-4d42bdfccdd0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    alt: 'Dark Chocolate and Almonds'
  },
  'baked-apple': {
    thumbnail: 'https://images.unsplash.com/photo-1569288063643-5d29ad6274f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    header: 'https://images.unsplash.com/photo-1569288063643-5d29ad6274f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    alt: 'Baked Apple with Cinnamon'
  },
  'trail-mix': {
    thumbnail: 'https://images.unsplash.com/photo-1594792432875-3b1e06b225cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    header: 'https://images.unsplash.com/photo-1594792432875-3b1e06b225cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    alt: 'Trail Mix with Dried Fruit'
  },

  // Special meals and specific IDs
  'breakfast-yogurt-bowl': {
    thumbnail: 'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    header: 'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    alt: 'Mediterranean Yogurt Bowl'
  },
  'lunch-spinach-salad': {
    thumbnail: 'https://images.unsplash.com/photo-1555243896-771a82ddb573?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    header: 'https://images.unsplash.com/photo-1555243896-771a82ddb573?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    alt: 'Spinach & Feta Salad with Walnuts'
  },
  'dinner-salmon-quinoa': {
    thumbnail: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    header: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    alt: 'Grilled Salmon with Quinoa'
  },
  'snack-apple-almond': {
    thumbnail: 'https://images.unsplash.com/photo-1568909344368-6f14a07b56a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    header: 'https://images.unsplash.com/photo-1568909344368-6f14a07b56a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    alt: 'Apple with Almond Butter'
  },
  'quinoa-bowl': {
    thumbnail: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    header: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    alt: 'Mediterranean Quinoa Bowl'
  },
  'salmon-bowl': {
    thumbnail: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    header: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    alt: 'Salmon & Avocado Power Bowl'
  }
};

/**
 * Helper function to get the image data based on meal name or ID
 * This function implements a multi-tiered approach to find the best matching image
 * @param {string} mealName - The name of the meal
 * @param {string} mealId - Optional meal ID or context
 * @param {string} imageType - Type of image (thumbnail or header)
 * @returns {object|string} - Image data object or fallback URL
 */
const getMealImageData = (mealName, mealId, imageType = 'thumbnail') => {
  try {
    console.log(`Fetching image for meal: ${mealName}, id: ${mealId}, type: ${imageType}`);
    
    // First try to find the meal by its exact name in the mapping
    if (mealName && typeof mealName === 'string' && mealImageMapping[mealName]) {
      console.log(`Found exact match in mealImageMapping for: ${mealName}`);
      return mealImageMapping[mealName];
    }
    
    // Next, check if a direct ID match exists in local MealsData
    if (mealId && MealsData[mealId]) {
      console.log(`Found direct ID match in MealsData for: ${mealId}`);
      return MealsData[mealId];
    }
    
    // Convert meal name to kebab case and look for match
    if (mealName && typeof mealName === 'string') {
      const kebabName = mealName.toLowerCase()
                               .replace(/[^\w\s-]/g, '') // Remove special chars
                               .replace(/\s+/g, '-'); // Replace spaces with hyphens
      
      console.log(`Checking for kebab match: ${kebabName}`);
      if (MealsData[kebabName]) {
        console.log(`Found kebab match in MealsData: ${kebabName}`);
        return MealsData[kebabName];
      }
      
      // Try partial matching for meal names
      const possibleMatches = Object.keys(mealImageMapping).filter(key => 
        key.toLowerCase().includes(mealName.toLowerCase())
      );
      
      if (possibleMatches.length > 0) {
        console.log(`Found partial match in mealImageMapping: ${possibleMatches[0]}`);
        return mealImageMapping[possibleMatches[0]];
      }
    }
    
    // Extract meal type from ID and use as fallback (breakfast, lunch, dinner, snacks)
    if (mealId && typeof mealId === 'string') {
      const mealTypes = ['breakfast', 'lunch', 'dinner', 'snacks'];
      for (const type of mealTypes) {
        if (mealId.toLowerCase().includes(type)) {
          console.log(`Using meal type fallback for: ${type}`);
          return mealImageMapping[type] || MealsData[`${type}-default`] || MealsData.defaultImages;
        }
      }
      
      // Try to extract day-meal pattern (e.g., monday-breakfast)
      const dayMealMatch = mealId.match(/([a-z]+)-([a-z]+)/);
      if (dayMealMatch && dayMealMatch.length === 3) {
        const mealType = dayMealMatch[2];
        if (mealTypes.includes(mealType)) {
          console.log(`Using day-meal pattern fallback for: ${mealType}`);
          return mealImageMapping[mealType] || MealsData[`${mealType}-default`] || MealsData.defaultImages;
        }
      }
    }
    
    // Default to a generic meal image if nothing else matches
    console.log('No match found, using default image');
    return MealsData.defaultImages;
  } catch (error) {
    console.error('Error getting meal image:', error);
    return MealsData.defaultImages;
  }
};

// Add default placeholder images using our local real image files
MealsData.defaultImages = {
  thumbnail: '/assets/images/meals/real/greek-yogurt-with-berries.jpg', // Default to a real image
  header: '/assets/images/meals/real/greek-yogurt-with-berries-large.jpg',
  alt: 'Healthy Meal'
};

// Add meal type defaults using our local real images
MealsData['breakfast-default'] = {
  thumbnail: '/assets/images/meals/real/greek-yogurt-with-berries.jpg',
  header: '/assets/images/meals/real/greek-yogurt-with-berries-large.jpg',
  alt: 'Breakfast Meal'
};

MealsData['lunch-default'] = {
  thumbnail: '/assets/images/meals/real/mediterranean-quinoa-salad.jpg',
  header: '/assets/images/meals/real/mediterranean-quinoa-salad-large.jpg',
  alt: 'Lunch Meal'
};

MealsData['dinner-default'] = {
  thumbnail: '/assets/images/meals/real/grilled-salmon-with-vegetables.jpg',
  header: '/assets/images/meals/real/grilled-salmon-with-vegetables-large.jpg',
  alt: 'Dinner Meal'
};

MealsData['snacks-default'] = {
  thumbnail: '/assets/images/meals/real/apple-with-almond-butter.jpg',
  header: '/assets/images/meals/real/apple-with-almond-butter-large.jpg',
  alt: 'Snack'
};

// Add helper function to the MealsData object
/**
 * Get image data for a meal with proper error handling
 * @param {string} mealName - The name of the meal
 * @param {string} mealId - Optional ID or context
 * @param {string} imageType - Type of image (thumbnail or header)
 * @returns {object|string} - Image data or fallback URL
 */
MealsData.getImageData = function(mealName, mealId = null, imageType = 'thumbnail') {
  try {
    // Call the helper function with all parameters
    const imageData = getMealImageData(mealName, mealId, imageType);
    
    // If we have image data and the requested type
    if (imageData && imageData[imageType]) {
      return imageData;
    }
    
    // If we only have the base data but not specific type
    if (imageData && !imageData[imageType]) {
      console.log(`Found image data but missing ${imageType}, using default fallback`);
      return MealsData.defaultImages;
    }
    
    // Default to fallback images
    return MealsData.defaultImages;
  } catch (error) {
    console.error(`Error in getImageData for ${mealName}:`, error);
    return MealsData.defaultImages;
  }
};

// Export the normalized meal images for direct use by our new image components
export { mealImages };

export default MealsData;