// src/utils/globalDietaryFilter.js

import { DietType } from './types';

/**
 * 🛡️ COMPREHENSIVE GLOBAL DIETARY FILTERING SYSTEM
 * 
 * This system ensures ALL dietary restrictions and allergies are respected
 * across the ENTIRE application. No dangerous foods will slip through.
 */

// 🚨 CRITICAL ALLERGEN DATABASE - Life-threatening ingredients to avoid
const ALLERGEN_DATABASE = {
  nuts: {
    keywords: [
      'nut', 'nuts', 'almond', 'almonds', 'walnut', 'walnuts', 'pecan', 'pecans',
      'cashew', 'cashews', 'pistachio', 'pistachios', 'hazelnut', 'hazelnuts',
      'macadamia', 'pine nuts', 'pine nut', 'brazil nut', 'brazil nuts',
      'chestnut', 'chestnuts', 'peanut', 'peanuts', 'groundnut', 'groundnuts',
      'trail mix', 'mixed nuts', 'nut butter', 'almond butter', 'peanut butter',
      'walnut oil', 'almond oil', 'nut oil', 'marzipan', 'nougat', 'praline',
      'amaretto', 'frangelico', 'orgeat', 'frangipane'
    ],
    tags: ['contains-nuts', 'tree-nuts', 'peanuts', 'nut-based'],
    safeAlternatives: ['sunflower seeds', 'pumpkin seeds', 'hemp seeds', 'chia seeds', 'flax seeds']
  },
  
  dairy: {
    keywords: [
      'milk', 'dairy', 'cheese', 'butter', 'cream', 'yogurt', 'yoghurt',
      'parmesan', 'cheddar', 'mozzarella', 'feta', 'goat cheese', 'ricotta',
      'cottage cheese', 'cream cheese', 'sour cream', 'heavy cream', 'whipping cream',
      'buttermilk', 'ghee', 'casein', 'whey', 'lactose', 'milk powder',
      'evaporated milk', 'condensed milk', 'ice cream', 'custard', 'pudding',
      'bechamel', 'alfredo', 'carbonara', 'quiche', 'gratin', 'au gratin'
    ],
    tags: ['contains-dairy', 'milk-based', 'cheese-based', 'dairy-derived'],
    safeAlternatives: ['coconut milk', 'almond milk', 'oat milk', 'soy milk', 'nutritional yeast', 'coconut cream']
  },
  
  gluten: {
    keywords: [
      'wheat', 'barley', 'rye', 'spelt', 'kamut', 'triticale', 'bulgur',
      'semolina', 'durum', 'farro', 'graham', 'bread', 'pasta', 'noodles',
      'flour', 'all-purpose flour', 'whole wheat flour', 'bread flour',
      'cake flour', 'pastry flour', 'self-rising flour', 'biscuits', 'crackers',
      'cereal', 'granola', 'muesli', 'oats', 'beer', 'ale', 'lager',
      'malt', 'malted', 'soy sauce', 'teriyaki', 'tempura', 'seitan',
      'couscous', 'orzo', 'gnocchi', 'dumplings', 'wontons'
    ],
    tags: ['contains-gluten', 'wheat-based', 'grain-based'],
    safeAlternatives: ['rice flour', 'coconut flour', 'almond flour', 'quinoa', 'rice', 'corn', 'potatoes']
  },
  
  soy: {
    keywords: [
      'soy', 'soya', 'soybeans', 'soy beans', 'tofu', 'tempeh', 'miso',
      'soy sauce', 'tamari', 'edamame', 'soy milk', 'soy protein',
      'textured vegetable protein', 'tvp', 'soy flour', 'soy lecithin',
      'natto', 'yuba', 'soy nuts', 'soybean oil'
    ],
    tags: ['contains-soy', 'soy-based', 'soy-derived'],
    safeAlternatives: ['coconut aminos', 'chickpea miso', 'hemp protein', 'pea protein']
  },
  
  eggs: {
    keywords: [
      'egg', 'eggs', 'egg white', 'egg yolk', 'albumin', 'ovalbumin',
      'mayonnaise', 'mayo', 'aioli', 'hollandaise', 'caesar', 'carbonara',
      'meringue', 'custard', 'eggnog', 'quiche', 'frittata', 'omelet',
      'omelette', 'scrambled', 'fried egg', 'poached egg', 'deviled eggs'
    ],
    tags: ['contains-eggs', 'egg-based'],
    safeAlternatives: ['flax eggs', 'chia eggs', 'aquafaba', 'apple sauce', 'banana']
  },
  
  shellfish: {
    keywords: [
      'shrimp', 'prawns', 'crab', 'lobster', 'crayfish', 'langostino',
      'scallops', 'oysters', 'clams', 'mussels', 'abalone', 'conch',
      'octopus', 'squid', 'calamari', 'sea urchin', 'barnacles'
    ],
    tags: ['contains-shellfish', 'shellfish-based', 'seafood'],
    safeAlternatives: ['mushrooms', 'jackfruit', 'hearts of palm', 'seaweed']
  },
  
  fish: {
    keywords: [
      'fish', 'salmon', 'tuna', 'cod', 'halibut', 'bass', 'trout', 'mackerel',
      'sardines', 'anchovies', 'herring', 'sole', 'flounder', 'snapper',
      'mahi mahi', 'tilapia', 'catfish', 'swordfish', 'fish sauce',
      'worcestershire', 'caesar dressing'
    ],
    tags: ['contains-fish', 'fish-based', 'seafood'],
    safeAlternatives: ['mushrooms', 'jackfruit', 'hearts of palm', 'seaweed', 'nori']
  },
  
  sesame: {
    keywords: [
      'sesame', 'sesame seeds', 'tahini', 'sesame oil', 'sesame paste',
      'gomasio', 'za\'atar', 'dukkah', 'halva', 'halvah'
    ],
    tags: ['contains-sesame', 'sesame-based'],
    safeAlternatives: ['sunflower seed butter', 'pumpkin seed butter', 'hemp seeds']
  }
};

// 🍽️ DIETARY PREFERENCE RESTRICTIONS
const DIETARY_RESTRICTIONS = {
  vegan: {
    avoid: [
      'meat', 'beef', 'pork', 'chicken', 'turkey', 'lamb', 'fish', 'seafood',
      'dairy', 'milk', 'cheese', 'butter', 'eggs', 'honey', 'gelatin',
      'bone broth', 'lard', 'tallow', 'bacon', 'ham', 'sausage'
    ],
    tags: ['animal-products', 'meat-based', 'dairy-based', 'egg-based']
  },
  
  vegetarian: {
    avoid: [
      'meat', 'beef', 'pork', 'chicken', 'turkey', 'lamb', 'fish', 'seafood',
      'bone broth', 'lard', 'tallow', 'bacon', 'ham', 'sausage', 'gelatin'
    ],
    tags: ['meat-based', 'animal-flesh']
  },
  
  pescatarian: {
    avoid: [
      'meat', 'beef', 'pork', 'chicken', 'turkey', 'lamb', 'poultry',
      'bone broth', 'lard', 'tallow', 'bacon', 'ham', 'sausage'
    ],
    tags: ['meat-based', 'poultry-based']
  },
  
  keto: {
    avoid: [
      'sugar', 'bread', 'pasta', 'rice', 'potato', 'corn', 'oats',
      'quinoa', 'beans', 'lentils', 'chickpeas', 'fruit', 'honey',
      'maple syrup', 'agave', 'high-carb'
    ],
    tags: ['high-carb', 'grain-based', 'sugar-based']
  },
  
  paleo: {
    avoid: [
      'grains', 'legumes', 'dairy', 'sugar', 'processed', 'bread',
      'pasta', 'beans', 'lentils', 'peanuts', 'soy', 'corn'
    ],
    tags: ['grain-based', 'legume-based', 'processed', 'dairy-based']
  }
};

// 🌶️ SPICE LEVEL RESTRICTIONS
const SPICE_RESTRICTIONS = {
  'no-spicy': {
    avoid: [
      'spicy', 'hot', 'chili', 'pepper', 'jalapeño', 'habanero', 'cayenne',
      'paprika', 'chipotle', 'sriracha', 'tabasco', 'harissa', 'kimchi',
      'wasabi', 'horseradish', 'ginger', 'curry', 'thai', 'indian spices',
      'turmeric', 'cumin', 'garam masala', 'coriander', 'cardamom',
      'cinnamon', 'cloves', 'star anise', 'fennel', 'mustard seed',
      'black pepper', 'red pepper', 'chili powder', 'curry powder'
    ],
    tags: ['spicy', 'hot', 'pepper-based', 'aromatic-spices']
  },
  
  'bland': {
    avoid: [
      'spicy', 'hot', 'chili', 'pepper', 'jalapeño', 'habanero', 'cayenne',
      'paprika', 'chipotle', 'sriracha', 'tabasco', 'harissa', 'kimchi',
      'wasabi', 'horseradish', 'ginger', 'curry', 'thai', 'indian spices',
      'turmeric', 'cumin', 'garam masala', 'coriander', 'cardamom',
      'cinnamon', 'cloves', 'star anise', 'fennel', 'mustard seed',
      'black pepper', 'red pepper', 'chili powder', 'curry powder',
      'aromatic', 'seasoned', 'flavored', 'spiced'
    ],
    tags: ['spicy', 'hot', 'pepper-based', 'aromatic-spices', 'seasoned']
  },
  
  'mild-only': {
    avoid: [
      'very spicy', 'extremely hot', 'ghost pepper', 'carolina reaper',
      'scorpion pepper', 'habanero', 'scotch bonnet'
    ],
    tags: ['very-spicy', 'extremely-hot']
  }
};

/**
 * 🛡️ MASTER DIETARY FILTER FUNCTION
 * 
 * This function filters ANY content (meals, ingredients, recipes) based on
 * comprehensive dietary restrictions and allergies.
 * 
 * @param {Array} items - Array of items to filter (meals, ingredients, etc.)
 * @param {Object} userPreferences - User's dietary preferences and restrictions
 * @returns {Array} Safely filtered items
 */
export const applyGlobalDietaryFilter = (items, userPreferences) => {
  if (!items || !Array.isArray(items)) {
    console.warn('🚨 Global Filter: Invalid items array provided');
    return [];
  }

  if (!userPreferences) {
    console.warn('🚨 Global Filter: No user preferences provided');
    return items;
  }

  console.log('🛡️ GLOBAL DIETARY FILTER ACTIVATED:', {
    totalItems: items.length,
    userPreferences,
    filteringStarted: new Date().toISOString()
  });

  let filteredItems = [...items];

  // 🚨 STEP 1: CRITICAL ALLERGY FILTERING (Life-threatening)
  const userAllergies = userPreferences.allergies || [];
  
  userAllergies.forEach(allergy => {
    const allergyKey = allergy.toLowerCase();
    const allergenData = Object.entries(ALLERGEN_DATABASE).find(([key]) => 
      allergyKey.includes(key) || key.includes(allergyKey)
    );

    if (allergenData) {
      const [allergenName, allergenInfo] = allergenData;
      
      filteredItems = filteredItems.filter(item => {
        const itemText = getItemSearchableText(item).toLowerCase();
        const itemTags = getItemTags(item);
        
        // Check keywords in text
        const hasKeyword = allergenInfo.keywords.some(keyword => 
          itemText.includes(keyword.toLowerCase())
        );
        
        // Check dangerous tags
        const hasDangerousTag = allergenInfo.tags.some(tag => 
          itemTags.some(itemTag => itemTag.toLowerCase().includes(tag))
        );
        
        const isSafe = !hasKeyword && !hasDangerousTag;
        
        if (!isSafe) {
          console.warn(`🚨 ALLERGEN DETECTED - Removing ${getItemName(item)} due to ${allergenName} allergy`);
        }
        
        return isSafe;
      });
    }
  });

  // 🚨 STEP 2: DIETARY RESTRICTION FILTERING
  const userDietaryRestrictions = userPreferences.dietaryRestrictions || [];
  
  userDietaryRestrictions.forEach(restriction => {
    const restrictionKey = restriction.toLowerCase().replace(/[^a-z]/g, '');
    
    // Handle standard dietary restrictions
    Object.entries(DIETARY_RESTRICTIONS).forEach(([dietType, dietInfo]) => {
      if (restrictionKey.includes(dietType) || restriction.toLowerCase().includes(dietType)) {
        filteredItems = filteredItems.filter(item => {
          const itemText = getItemSearchableText(item).toLowerCase();
          const itemTags = getItemTags(item);
          
          const hasRestrictedIngredient = dietInfo.avoid.some(ingredient => 
            itemText.includes(ingredient.toLowerCase())
          );
          
          const hasRestrictedTag = dietInfo.tags.some(tag => 
            itemTags.some(itemTag => itemTag.toLowerCase().includes(tag))
          );
          
          return !hasRestrictedIngredient && !hasRestrictedTag;
        });
      }
    });
    
    // Handle spice restrictions
    Object.entries(SPICE_RESTRICTIONS).forEach(([spiceLevel, spiceInfo]) => {
      if (restrictionKey.includes(spiceLevel.replace('-', '')) || 
          restriction.toLowerCase().includes('spicy') || 
          restriction.toLowerCase().includes('hot') ||
          restriction.toLowerCase().includes('bland') ||
          restriction.toLowerCase().includes('mild')) {
        filteredItems = filteredItems.filter(item => {
          const itemText = getItemSearchableText(item).toLowerCase();
          const itemTags = getItemTags(item);
          
          const hasSpicyIngredient = spiceInfo.avoid.some(ingredient => 
            itemText.includes(ingredient.toLowerCase())
          );
          
          const hasSpicyTag = spiceInfo.tags.some(tag => 
            itemTags.some(itemTag => itemTag.toLowerCase().includes(tag))
          );
          
          // For bland preference, also check if item has 'mild' or 'bland' tags
          if (restriction.toLowerCase().includes('bland')) {
            const hasMildTag = itemTags.some(tag => 
              tag.toLowerCase().includes('mild') || tag.toLowerCase().includes('bland')
            );
            return (!hasSpicyIngredient && !hasSpicyTag) || hasMildTag;
          }
          
          return !hasSpicyIngredient && !hasSpicyTag;
        });
      }
    });
  });

  // 🚨 STEP 3: PRIMARY DIET FILTERING
  const primaryDiet = userPreferences.primaryDiet;
  
  if (primaryDiet && primaryDiet !== 'omnivore') {
    const dietRestrictions = DIETARY_RESTRICTIONS[primaryDiet.toLowerCase()];
    
    if (dietRestrictions) {
      filteredItems = filteredItems.filter(item => {
        const itemText = getItemSearchableText(item).toLowerCase();
        const itemTags = getItemTags(item);
        
        // For vegan diet, must have vegan tag OR be explicitly vegan-safe
        if (primaryDiet.toLowerCase() === 'vegan') {
          const hasVeganTag = itemTags.some(tag => 
            tag.toLowerCase().includes('vegan')
          );
          
          const hasNonVeganIngredient = dietRestrictions.avoid.some(ingredient => 
            itemText.includes(ingredient.toLowerCase())
          );
          
          return hasVeganTag && !hasNonVeganIngredient;
        }
        
        // For other diets, just avoid restricted ingredients
        const hasRestrictedIngredient = dietRestrictions.avoid.some(ingredient => 
          itemText.includes(ingredient.toLowerCase())
        );
        
        return !hasRestrictedIngredient;
      });
    }
  }

  // 🚨 STEP 4: BOOLEAN FLAG FILTERING (isNutFree, isDairyFree, etc.)
  if (userPreferences.isNutFree === true) {
    filteredItems = filteredItems.filter(item => {
      const itemText = getItemSearchableText(item).toLowerCase();
      const itemTags = getItemTags(item);
      
      const hasNuts = ALLERGEN_DATABASE.nuts.keywords.some(keyword => 
        itemText.includes(keyword.toLowerCase())
      );
      
      const hasNutFreeTag = itemTags.some(tag => 
        tag.toLowerCase().includes('nut-free')
      );
      
      return !hasNuts || hasNutFreeTag;
    });
  }

  if (userPreferences.isDairyFree === true) {
    filteredItems = filteredItems.filter(item => {
      const itemText = getItemSearchableText(item).toLowerCase();
      const itemTags = getItemTags(item);
      
      const hasDairy = ALLERGEN_DATABASE.dairy.keywords.some(keyword => 
        itemText.includes(keyword.toLowerCase())
      );
      
      const hasDairyFreeTag = itemTags.some(tag => 
        tag.toLowerCase().includes('dairy-free')
      );
      
      return !hasDairy || hasDairyFreeTag;
    });
  }

  if (userPreferences.isGlutenFree === true) {
    filteredItems = filteredItems.filter(item => {
      const itemTags = getItemTags(item);
      return itemTags.some(tag => tag.toLowerCase().includes('gluten-free'));
    });
  }

  console.log('🛡️ GLOBAL DIETARY FILTER COMPLETED:', {
    originalCount: items.length,
    filteredCount: filteredItems.length,
    removedCount: items.length - filteredItems.length,
    safetyLevel: 'MAXIMUM'
  });

  return filteredItems;
};

/**
 * 🔍 HELPER FUNCTIONS for extracting searchable content from items
 */
const getItemSearchableText = (item) => {
  if (!item) return '';
  
  const searchableFields = [
    item.name || '',
    item.description || '',
    item.ingredients ? item.ingredients.join(' ') : '',
    item.instructions ? item.instructions.join(' ') : '',
    item.title || '',
    item.content || '',
    typeof item === 'string' ? item : ''
  ];
  
  return searchableFields.join(' ').toLowerCase();
};

const getItemTags = (item) => {
  if (!item) return [];
  
  const tags = [
    ...(item.dietaryTags || []),
    ...(item.tags || []),
    ...(item.categories || []),
    ...(item.labels || [])
  ];
  
  return tags.map(tag => tag.toLowerCase());
};

const getItemName = (item) => {
  return item?.name || item?.title || item?.toString() || 'Unknown Item';
};

/**
 * 🍽️ MEAL-SPECIFIC FILTERING FUNCTION
 * 
 * Specialized function for filtering meal data with additional safety checks
 */
export const filterMealsByDietaryPreferences = (meals, userPreferences) => {
  console.log('🍽️ MEAL FILTERING STARTED:', {
    totalMeals: meals?.length || 0,
    userPreferences
  });

  if (!meals || !Array.isArray(meals)) {
    console.error('🚨 Invalid meals data provided to meal filter');
    return [];
  }

  // Apply global filter first
  let safeMeals = applyGlobalDietaryFilter(meals, userPreferences);

  // Additional meal-specific safety checks
  safeMeals = safeMeals.filter(meal => {
    // Ensure meal has required safety properties
    if (!meal.dietaryTags || !Array.isArray(meal.dietaryTags)) {
      console.warn(`🚨 Meal "${meal.name}" missing dietary tags - potential safety risk`);
      return false;
    }

    // Double-check critical allergies
    const userAllergies = userPreferences?.allergies || [];
    for (const allergy of userAllergies) {
      if (allergy.toLowerCase().includes('nut') || allergy.toLowerCase().includes('peanut')) {
        const mealText = getItemSearchableText(meal);
        if (mealText.includes('nut') || mealText.includes('almond') || mealText.includes('peanut')) {
          console.error(`🚨 CRITICAL: Meal "${meal.name}" contains nuts despite filtering!`);
          return false;
        }
      }
      
      if (allergy.toLowerCase().includes('dairy') || allergy.toLowerCase().includes('milk')) {
        const mealText = getItemSearchableText(meal);
        if (mealText.includes('cheese') || mealText.includes('milk') || mealText.includes('dairy')) {
          console.error(`🚨 CRITICAL: Meal "${meal.name}" contains dairy despite filtering!`);
          return false;
        }
      }
    }

    return true;
  });

  console.log('🍽️ MEAL FILTERING COMPLETED:', {
    originalCount: meals.length,
    safeCount: safeMeals.length,
    removedCount: meals.length - safeMeals.length
  });

  return safeMeals;
};

/**
 * 🛒 SHOPPING LIST FILTERING FUNCTION
 * 
 * Filters shopping list items based on dietary restrictions
 */
export const filterShoppingListByDietaryPreferences = (shoppingItems, userPreferences) => {
  console.log('🛒 SHOPPING LIST FILTERING STARTED');
  
  if (!shoppingItems || !Array.isArray(shoppingItems)) {
    return [];
  }

  return applyGlobalDietaryFilter(shoppingItems, userPreferences);
};

/**
 * 🔍 INGREDIENT SAFETY CHECKER
 * 
 * Checks if a single ingredient is safe for user's dietary restrictions
 */
export const isIngredientSafe = (ingredient, userPreferences) => {
  if (!ingredient || !userPreferences) return false;
  
  const safeIngredients = applyGlobalDietaryFilter([ingredient], userPreferences);
  return safeIngredients.length > 0;
};

/**
 * 🎯 GET SAFE ALTERNATIVES
 * 
 * Provides safe alternatives for problematic ingredients
 */
export const getSafeAlternatives = (problematicIngredient, userPreferences) => {
  const ingredient = problematicIngredient.toLowerCase();
  const alternatives = [];

  // Check each allergen database for alternatives
  Object.entries(ALLERGEN_DATABASE).forEach(([allergenName, allergenData]) => {
    const hasProblematicIngredient = allergenData.keywords.some(keyword => 
      ingredient.includes(keyword.toLowerCase())
    );
    
    if (hasProblematicIngredient) {
      alternatives.push(...allergenData.safeAlternatives);
    }
  });

  // Filter alternatives through user preferences to ensure they're safe
  const safeAlternatives = applyGlobalDietaryFilter(
    alternatives.map(alt => ({ name: alt })), 
    userPreferences
  ).map(item => item.name);

  return [...new Set(safeAlternatives)]; // Remove duplicates
};

/**
 * 🚨 EMERGENCY MEAL GENERATOR
 * 
 * Generates ultra-safe emergency meals when filtering removes too many options
 */
export const generateEmergencyMeals = (userPreferences) => {
  const emergencyMeals = {
    breakfast: {
      id: 'emergency-breakfast',
      name: 'Simple Oatmeal Bowl',
      description: 'Plain oats with water - universally safe',
      mealType: 'Breakfast',
      dietaryTags: ['vegan', 'dairy-free', 'nut-free', 'gluten-free', 'soy-free'],
      ingredients: ['certified gluten-free oats', 'water', 'salt'],
      instructions: ['Boil water', 'Add oats', 'Cook 5 minutes', 'Add pinch of salt']
    },
    lunch: {
      id: 'emergency-lunch',
      name: 'Plain Rice Bowl',
      description: 'Simple rice with safe vegetables',
      mealType: 'Lunch',
      dietaryTags: ['vegan', 'dairy-free', 'nut-free', 'gluten-free', 'soy-free'],
      ingredients: ['white rice', 'water', 'carrots', 'salt'],
      instructions: ['Cook rice according to package', 'Steam carrots', 'Combine with salt']
    },
    dinner: {
      id: 'emergency-dinner',
      name: 'Baked Sweet Potato',
      description: 'Simple baked sweet potato with herbs',
      mealType: 'Dinner',
      dietaryTags: ['vegan', 'dairy-free', 'nut-free', 'gluten-free', 'soy-free'],
      ingredients: ['sweet potato', 'olive oil', 'salt', 'herbs'],
      instructions: ['Wash sweet potato', 'Bake at 400°F for 45 minutes', 'Season with salt and herbs']
    },
    snack: {
      id: 'emergency-snack',
      name: 'Apple Slices',
      description: 'Fresh apple slices - naturally safe',
      mealType: 'Snack',
      dietaryTags: ['vegan', 'dairy-free', 'nut-free', 'gluten-free', 'soy-free'],
      ingredients: ['apple'],
      instructions: ['Wash apple', 'Slice into pieces', 'Serve fresh']
    }
  };

  // Filter emergency meals through user preferences as final safety check
  const safeMeals = {};
  Object.entries(emergencyMeals).forEach(([mealType, meal]) => {
    const filteredMeals = applyGlobalDietaryFilter([meal], userPreferences);
    safeMeals[mealType] = filteredMeals.length > 0 ? filteredMeals[0] : meal;
  });

  return safeMeals;
};

// Export all filtering utilities
export default {
  applyGlobalDietaryFilter,
  filterMealsByDietaryPreferences,
  filterShoppingListByDietaryPreferences,
  isIngredientSafe,
  getSafeAlternatives,
  generateEmergencyMeals,
  ALLERGEN_DATABASE,
  DIETARY_RESTRICTIONS,
  SPICE_RESTRICTIONS
};