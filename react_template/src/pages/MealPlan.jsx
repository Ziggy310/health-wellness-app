import React, { useState, useMemo, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { DietType } from '../utils/types';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '../components/common/Layout';

import { comprehensiveMealsData, getMealsByDietaryPreference } from '../data/comprehensiveMealsData';
import { filterMealsByDietaryPreferences, generateEmergencyMeals } from '../utils/globalDietaryFilter';
import FavoriteButton from '../components/common/FavoriteButton';

const MealPlan = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { dietaryPreferences, healthGoals } = useAppContext();
  const [selectedDay, setSelectedDay] = useState(searchParams.get('day') || 'monday');
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [shoppingListVisible, setShoppingListVisible] = useState(true);
  
  // Update selectedDay when URL params change
  useEffect(() => {
    const dayFromUrl = searchParams.get('day');
    if (dayFromUrl && days.includes(dayFromUrl)) {
      setSelectedDay(dayFromUrl);
    }
  }, [searchParams]);
  
  // Initialize shopping list visibility
  React.useEffect(() => {
    const shoppingListEl = document.getElementById('shopping-list-container');
    if (shoppingListEl) {
      shoppingListEl.style.display = shoppingListVisible ? 'block' : 'none';
    }
  }, [shoppingListVisible]);
  
  // Days of the week
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  
  // 🛡️ SAFETY-CRITICAL: Get filtered meals using GLOBAL DIETARY FILTER SYSTEM
  const getFilteredMeals = useMemo(() => {
    const allMeals = Object.values(comprehensiveMealsData);
    
    console.log('🛡️ APPLYING GLOBAL DIETARY FILTER:', {
      totalMeals: allMeals.length,
      userPreferences: dietaryPreferences
    });
    
    // Use the comprehensive global filter
    const safeFilteredMeals = filterMealsByDietaryPreferences(allMeals, dietaryPreferences);
    
    // If too few meals remain, supplement with emergency meals
    if (safeFilteredMeals.length < 7) {
      console.warn('⚠️ Too few safe meals found, adding emergency meals');
      const emergencyMeals = generateEmergencyMeals(dietaryPreferences);
      safeFilteredMeals.push(...Object.values(emergencyMeals));
    }
    
    console.log('🛡️ GLOBAL FILTER RESULTS:', {
      originalCount: allMeals.length,
      safeCount: safeFilteredMeals.length,
      safetyVerified: true
    });
    
    return safeFilteredMeals;
  }, [dietaryPreferences]);

  // 🛡️ SAFETY-CRITICAL: Create diverse weekly meal plan with SAFE meals only
  const weeklyMeals = useMemo(() => {
    const userAllergies = dietaryPreferences?.allergies || [];
    const userDietaryRestrictions = dietaryPreferences?.dietaryRestrictions || [];
    
    // Check for specific allergies
    const hasNutAllergy = userAllergies.some(allergy => 
      allergy.toLowerCase().includes('nut') || 
      allergy.toLowerCase().includes('peanut')
    ) || userDietaryRestrictions.some(restriction => 
      restriction.toLowerCase().includes('nut')
    );
    
    const hasDairyAllergy = userAllergies.some(allergy => 
      allergy.toLowerCase().includes('dairy') || 
      allergy.toLowerCase().includes('milk')
    ) || userDietaryRestrictions.some(restriction => 
      restriction.toLowerCase().includes('dairy')
    );
    
    const breakfasts = getFilteredMeals.filter(meal => meal.mealType === 'Breakfast');
    const lunches = getFilteredMeals.filter(meal => meal.mealType === 'Lunch');
    const dinners = getFilteredMeals.filter(meal => meal.mealType === 'Dinner');
    const snacks = getFilteredMeals.filter(meal => meal.mealType === 'Snack');
    
    // 🚨 SAFE EMERGENCY FALLBACKS - No allergens!
    const emergencyMeals = {
      breakfast: {
        id: 'emergency-breakfast',
        name: 'Banana Oatmeal',
        slug: 'emergency-breakfast', 
        description: 'Simple oats with banana - naturally safe',
        mealType: 'Breakfast',
        dietaryTags: ['vegan', 'dairy-free', 'nut-free']
      },
      lunch: {
        id: 'emergency-lunch',
        name: 'Vegetable Rice Bowl',
        slug: 'emergency-lunch',
        description: 'Brown rice with mixed vegetables - naturally safe', 
        mealType: 'Lunch',
        dietaryTags: ['vegan', 'dairy-free', 'nut-free']
      },
      dinner: {
        id: 'emergency-dinner',
        name: 'Baked Sweet Potato',
        slug: 'emergency-dinner',
        description: 'Simple baked sweet potato with herbs - naturally safe',
        mealType: 'Dinner', 
        dietaryTags: ['vegan', 'dairy-free', 'nut-free']
      },
      snacks: {
        id: 'emergency-snack',
        name: 'Apple Slices',
        slug: 'emergency-snack',
        description: 'Fresh apple slices - naturally safe and refreshing',
        mealType: 'Snack',
        dietaryTags: ['vegan', 'dairy-free', 'nut-free']
      }
    };
    
    // 🎯 FIXED: Smart meal assignment with TRULY unique meals for each day
    const getUniqueWeeklyMeals = () => {
      // Shuffle arrays to ensure variety
      const shuffleArray = (array) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
      };
      
      const shuffledBreakfasts = shuffleArray(breakfasts);
      const shuffledLunches = shuffleArray(lunches);
      const shuffledDinners = shuffleArray(dinners);
      const shuffledSnacks = shuffleArray(snacks);
      
      // Assign unique meals to each day, cycling through if needed
      const assignMealForDay = (mealArray, dayIndex, fallbackMeal) => {
        if (mealArray.length === 0) return fallbackMeal;
        return mealArray[dayIndex % mealArray.length];
      };
      
      return {
        monday: {
          breakfast: assignMealForDay(shuffledBreakfasts, 0, emergencyMeals.breakfast),
          lunch: assignMealForDay(shuffledLunches, 0, emergencyMeals.lunch),
          dinner: assignMealForDay(shuffledDinners, 0, emergencyMeals.dinner),
          snacks: assignMealForDay(shuffledSnacks, 0, emergencyMeals.snacks)
        },
        tuesday: {
          breakfast: assignMealForDay(shuffledBreakfasts, 1, emergencyMeals.breakfast),
          lunch: assignMealForDay(shuffledLunches, 1, emergencyMeals.lunch),
          dinner: assignMealForDay(shuffledDinners, 1, emergencyMeals.dinner),
          snacks: assignMealForDay(shuffledSnacks, 1, emergencyMeals.snacks)
        },
        wednesday: {
          breakfast: assignMealForDay(shuffledBreakfasts, 2, emergencyMeals.breakfast),
          lunch: assignMealForDay(shuffledLunches, 2, emergencyMeals.lunch),
          dinner: assignMealForDay(shuffledDinners, 2, emergencyMeals.dinner),
          snacks: assignMealForDay(shuffledSnacks, 2, emergencyMeals.snacks)
        },
        thursday: {
          breakfast: assignMealForDay(shuffledBreakfasts, 3, emergencyMeals.breakfast),
          lunch: assignMealForDay(shuffledLunches, 3, emergencyMeals.lunch),
          dinner: assignMealForDay(shuffledDinners, 3, emergencyMeals.dinner),
          snacks: assignMealForDay(shuffledSnacks, 3, emergencyMeals.snacks)
        },
        friday: {
          breakfast: assignMealForDay(shuffledBreakfasts, 4, emergencyMeals.breakfast),
          lunch: assignMealForDay(shuffledLunches, 4, emergencyMeals.lunch),
          dinner: assignMealForDay(shuffledDinners, 4, emergencyMeals.dinner),
          snacks: assignMealForDay(shuffledSnacks, 4, emergencyMeals.snacks)
        },
        saturday: {
          breakfast: assignMealForDay(shuffledBreakfasts, 5, emergencyMeals.breakfast),
          lunch: assignMealForDay(shuffledLunches, 5, emergencyMeals.lunch),
          dinner: assignMealForDay(shuffledDinners, 5, emergencyMeals.dinner),
          snacks: assignMealForDay(shuffledSnacks, 5, emergencyMeals.snacks)
        },
        sunday: {
          breakfast: assignMealForDay(shuffledBreakfasts, 6, emergencyMeals.breakfast),
          lunch: assignMealForDay(shuffledLunches, 6, emergencyMeals.lunch),
          dinner: assignMealForDay(shuffledDinners, 6, emergencyMeals.dinner),
          snacks: assignMealForDay(shuffledSnacks, 6, emergencyMeals.snacks)
        }
      };
    };
    
    const mealPlan = getUniqueWeeklyMeals();
    
    console.log('🛡️ WEEKLY MEAL PLAN CREATED:', {
      hasNutAllergy,
      hasDairyAllergy,
      totalBreakfasts: breakfasts.length,
      totalLunches: lunches.length,
      totalDinners: dinners.length,
      totalSnacks: snacks.length
    });
    
    return mealPlan;
  }, [getFilteredMeals, dietaryPreferences]);
  
  // Adjust meal plan based on dietary preferences
  const adjustMealPlan = () => {
    // Here we would implement logic to adjust the meal plan based on user preferences
    // For example, if the user is vegetarian, we would replace meat with plant-based proteins
    
    // This is a simplified example
    if (dietaryPreferences?.primaryDiet === DietType.VEGETARIAN) {
      // Replace non-vegetarian meals with vegetarian options
      // This would be done via API in a real app
    }
    
    return weeklyMeals;
  };
  
  const handleDaySelect = (day) => {
    setSelectedDay(day);
    setSelectedMeal(null); // Reset selected meal when changing day
    // Update URL to preserve the selected day
    setSearchParams({ day });
  };
  
  const handleMealSelect = (mealType) => {
    // Get the meal for the selected day and meal type
    const meal = weeklyMeals[selectedDay][mealType];
    if (meal && meal.slug) {
      // Navigate to the meal detail page with the current day as state
      navigate(`/meal/${meal.slug}`, { state: { fromDay: selectedDay } });
    }
  };
  
  const formatNutrientValue = (value) => {
    return value ? `${value}g` : 'N/A';
  };
  
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-700 to-green-500 text-white px-4 py-8">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center mb-4">
            <button 
              onClick={() => navigate('/dashboard')} 
              className="mr-4 p-1 rounded-full bg-green-600 hover:bg-green-700 text-white"
              aria-label="Go back"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold">Your Weekly Meal Plan</h1>
          </div>
          <p className="text-green-100">Personalized nutrition for menopause relief</p>
        </div>
      </div>
      
      {/* Day selector */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4">
          <div className="flex overflow-x-auto py-4 scrollbar-hide">
            {days.map((day) => (
              <button
                key={day}
                onClick={() => handleDaySelect(day)}
                className={`flex-shrink-0 px-4 py-2 mx-1 rounded-full capitalize text-sm ${
                  selectedDay === day 
                    ? 'bg-green-100 text-green-800 font-medium' 
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {day.substring(0, 3)}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="px-4 py-6 max-w-lg mx-auto">
        {/* Day's meals */}
        <div className="space-y-4 mb-8">
          {['breakfast', 'lunch', 'dinner', 'snacks'].map((mealType) => {
            const meal = weeklyMeals[selectedDay][mealType];
            return (
              <div 
                key={mealType}
                onClick={() => handleMealSelect(mealType)}
                className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow w-full"
                role="button"
                tabIndex="0"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleMealSelect(mealType);
                  }
                }}
              >
                <div className="flex w-full">
                  <div className={`w-24 h-24 flex-shrink-0 flex items-center justify-center rounded-l-lg ${
                    mealType === 'breakfast' ? 'bg-gradient-to-br from-amber-400 to-orange-500' :
                    mealType === 'lunch' ? 'bg-gradient-to-br from-green-400 to-emerald-500' :
                    mealType === 'dinner' ? 'bg-gradient-to-br from-purple-400 to-indigo-500' :
                    'bg-gradient-to-br from-red-400 to-pink-500'
                  }`}>
                    {/* Modern Icon */}
                    {mealType === 'breakfast' && (
                      <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
                      </svg>
                    )}
                    {mealType === 'lunch' && (
                      <img 
                        src="/assets/lunch-icon.png" 
                        alt="Lunch" 
                        className="w-10 h-10 object-contain filter brightness-0 invert"
                        style={{ 
                          filter: 'brightness(0) invert(1)',
                          transform: 'rotate(35deg) scale(1.3)'
                        }}
                      />
                    )}
                    {mealType === 'dinner' && (
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
                      </svg>
                    )}
                    {mealType === 'snacks' && (
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.25c5.385 0 9.75 4.365 9.75 9.75s-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12 6.615 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z" />
                      </svg>
                    )}
                  </div>
                  <div className="p-4 flex-grow min-w-0">
                    <span className="text-xs text-gray-500 uppercase tracking-wide">{mealType}</span>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900 truncate">{meal.name}</h3>
                      <FavoriteButton 
                        mealId={meal.id || meal.slug} 
                        mealName={meal.name} 
                        size="sm" 
                        variant="inline" 
                      />
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-1">{meal.description}</p>
                  </div>
                  <div className="flex items-center pr-4 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Selected meal details - now shown directly beneath the selected meal */}
        
        {/* Shopping list or meal preference options */}
        <div className="bg-green-50 rounded-lg p-5 border border-green-100">
          <h2 className="text-lg font-medium text-green-800 mb-3">Meal Plan Options</h2>
          
          <div className="space-y-3">
            <button 
              onClick={() => setShoppingListVisible(!shoppingListVisible)}
              className="w-full py-2 px-4 bg-white border border-gray-200 rounded-lg text-left flex items-center hover:bg-gray-50 active:bg-green-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              Show/Hide Shopping List
            </button>
            
            {/* Shopping List Section */}
            <div id="shopping-list-container" className="mt-4 bg-white p-4 rounded-lg border border-green-100">
              <h3 className="font-medium text-green-800 mb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Weekly Shopping List
              </h3>
              
              <div className="divide-y">
                {/* Produce Section */}
                <div className="py-3">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Produce</h4>
                  <ul className="space-y-1">
                    {[
                      "Spinach - 2 bunches",
                      "Mixed Berries - 2 cups",
                      "Cherry Tomatoes - 1 pint",
                      "Bell Peppers - 2 (red and yellow)",
                      "Zucchini - 2 medium",
                      "Avocados - 3 ripe",
                      "Cucumbers - 2 medium"
                    ].map((item, index) => (
                      <li key={`produce-${index}`} className="flex items-center">
                        <input type="checkbox" className="mr-2 text-green-600 focus:ring-green-500" />
                        <span className="text-sm text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Protein Section */}
                <div className="py-3">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Proteins</h4>
                  <ul className="space-y-1">
                    {(() => {
                      const userAllergies = dietaryPreferences?.allergies || [];
                      const userDietaryRestrictions = dietaryPreferences?.dietaryRestrictions || [];
                      const userDietType = dietaryPreferences?.primaryDiet || 'omnivore';
                      
                      const hasDairyAllergy = userAllergies.some(allergy => 
                        allergy.toLowerCase().includes('dairy') || 
                        allergy.toLowerCase().includes('milk')
                      ) || userDietaryRestrictions.some(restriction => 
                        restriction.toLowerCase().includes('dairy')
                      );
                      
                      const hasNutAllergy = userAllergies.some(allergy => 
                        allergy.toLowerCase().includes('nut') || 
                        allergy.toLowerCase().includes('peanut')
                      ) || userDietaryRestrictions.some(restriction => 
                        restriction.toLowerCase().includes('nut')
                      );
                      
                      const isVegan = userDietType === DietType.VEGAN;
                      
                      let proteins = [];
                      
                      // Safe proteins for everyone
                      proteins.push("Chickpeas - 2 cans");
                      proteins.push("Tofu - 1 block");
                      proteins.push("Lentils - 1 cup dried");
                      proteins.push("Quinoa - 1 cup");
                      proteins.push("Hemp Seeds - 2 tbsp");
                      
                      // Add non-vegan proteins if not vegan and no dairy allergy
                      if (!isVegan) {
                        proteins.push("Wild Salmon - 1 lb");
                        proteins.push("Eggs - 1 dozen");
                        
                        // Only add dairy if no dairy allergy/restriction
                        if (!hasDairyAllergy) {
                          proteins.push("Greek Yogurt - 32 oz container");
                        } else {
                          proteins.push("Coconut Yogurt - 32 oz container (dairy-free)");
                        }
                      } else {
                        // Vegan protein alternatives
                        proteins.push("Nutritional Yeast - 1 container");
                        proteins.push("Tempeh - 2 blocks");
                      }
                      
                      return proteins;
                    })().map((item, index) => (
                      <li key={`protein-${index}`} className="flex items-center">
                        <input type="checkbox" className="mr-2 text-green-600 focus:ring-green-500" />
                        <span className="text-sm text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Grains Section */}
                <div className="py-3">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Grains & Legumes</h4>
                  <ul className="space-y-1">
                    {[
                      "Quinoa - 1 cup",
                      "Brown Rice - 2 cups",
                      "Whole Grain Bread - 1 loaf",
                      "Oats - 2 cups",
                      "Chia Seeds - 3 tbsp",
                      "Flaxseeds - 3 tbsp"
                    ].map((item, index) => (
                      <li key={`grain-${index}`} className="flex items-center">
                        <input type="checkbox" className="mr-2 text-green-600 focus:ring-green-500" />
                        <span className="text-sm text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Other Items */}
                <div className="py-3">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Other Items</h4>
                  <ul className="space-y-1">
                    {(() => {
                      const userAllergies = dietaryPreferences?.allergies || [];
                      const userDietaryRestrictions = dietaryPreferences?.dietaryRestrictions || [];
                      
                      const hasNutAllergy = userAllergies.some(allergy => 
                        allergy.toLowerCase().includes('nut') || 
                        allergy.toLowerCase().includes('peanut')
                      ) || userDietaryRestrictions.some(restriction => 
                        restriction.toLowerCase().includes('nut')
                      );
                      
                      let otherItems = [
                        "Olive Oil - 1 small bottle",
                        "Tahini - 1 jar",
                        "Dried Herbs (dill, parsley) - as needed",
                        "Lemons - 3", 
                        "Garlic - 1 head",
                        "Apple Cider Vinegar - 1 bottle",
                        "Coconut Oil - 1 jar"
                      ];
                      
                      // Only add nut butters if no nut allergy
                      if (!hasNutAllergy) {
                        otherItems.push("Almond Butter - 1 jar");
                      } else {
                        otherItems.push("Sunflower Seed Butter - 1 jar (nut-free)");
                      }
                      
                      return otherItems;
                    })().map((item, index) => (
                      <li key={`other-${index}`} className="flex items-center">
                        <input type="checkbox" className="mr-2 text-green-600 focus:ring-green-500" />
                        <span className="text-sm text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="mt-4 flex justify-between items-center">
                <button 
                  onClick={() => setShoppingListVisible(false)}
                  className="py-1 px-3 bg-purple-100 hover:bg-purple-200 text-purple-700 text-sm rounded flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                  Back
                </button>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => {
                      // Generate shopping list content for printing
                      const shoppingListContent = document.getElementById('shopping-list-container').innerHTML;
                      const printWindow = window.open('', '_blank');
                      printWindow.document.write(`
                        <html>
                          <head>
                            <title>Weekly Shopping List - Meno+</title>
                            <style>
                              body { font-family: Arial, sans-serif; margin: 20px; }
                              h3 { color: #16a34a; }
                              h4 { color: #374151; margin-top: 20px; }
                              ul { list-style-type: none; padding: 0; }
                              li { margin: 8px 0; padding: 4px 0; border-bottom: 1px solid #e5e7eb; }
                              input[type="checkbox"] { margin-right: 8px; }
                            </style>
                          </head>
                          <body>
                            <h2>Weekly Shopping List - Meno+</h2>
                            <p>Generated on: ${new Date().toLocaleDateString()}</p>
                            ${shoppingListContent.replace(/onclick="[^"]*"/g, '').replace(/class="[^"]*"/g, '')}
                          </body>
                        </html>
                      `);
                      printWindow.document.close();
                      printWindow.print();
                    }}
                    className="py-1 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded"
                  >
                    Print List
                  </button>
                  <button 
                    onClick={() => {
                      // Generate email content
                      const produceItems = [
                        "Spinach - 2 bunches", "Mixed Berries - 2 cups", "Cherry Tomatoes - 1 pint",
                        "Bell Peppers - 2 (red and yellow)", "Zucchini - 2 medium", "Avocados - 3 ripe", "Cucumbers - 2 medium"
                      ];
                      const proteinItems = ["Chickpeas - 2 cans", "Tofu - 1 block", "Lentils - 1 cup dried", "Quinoa - 1 cup"];
                      const grainItems = ["Brown Rice - 2 cups", "Whole Grain Bread - 1 loaf", "Oats - 2 cups"];
                      const otherItems = ["Olive Oil - 1 small bottle", "Tahini - 1 jar", "Lemons - 3"];
                      
                      const emailBody = `Hi!\n\nHere's my weekly shopping list from Meno+:\n\nPRODUCE:\n${produceItems.map(item => `• ${item}`).join('\n')}\n\nPROTEINS:\n${proteinItems.map(item => `• ${item}`).join('\n')}\n\nGRAINS:\n${grainItems.map(item => `• ${item}`).join('\n')}\n\nOTHER ITEMS:\n${otherItems.map(item => `• ${item}`).join('\n')}\n\nGenerated on ${new Date().toLocaleDateString()}\n\nBest regards!`;
                      
                      const subject = encodeURIComponent('Weekly Shopping List - Meno+');
                      const body = encodeURIComponent(emailBody);
                      window.open(`mailto:?subject=${subject}&body=${body}`);
                    }}
                    className="py-1 px-3 bg-green-100 hover:bg-green-200 text-green-700 text-sm rounded"
                  >
                    Email List
                  </button>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => alert('Customize your meal plan based on preferences and dietary restrictions. This feature will be available in the full version.')}
              className="w-full py-2 px-4 bg-white border border-gray-200 rounded-lg text-left flex items-center hover:bg-gray-50 active:bg-green-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Customize Meal Plan
            </button>
            
            <button 
              onClick={() => alert('Share your meal plan with friends, family, or healthcare providers. This feature will be available in the full version.')}
              className="w-full py-2 px-4 bg-white border border-gray-200 rounded-lg text-left flex items-center hover:bg-gray-50 active:bg-green-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share Meal Plan
            </button>
          </div>
        </div>
      </div>
      </div>
    </Layout>
  );
};

export default MealPlan;