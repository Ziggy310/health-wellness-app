const { db, admin } = require('../config/firebase');
const { validationResult } = require('express-validator');
const aiService = require('../services/ai/meal-ai.service');

/**
 * Get current active meal plan for user
 */
const getCurrentMealPlan = async (req, res) => {
  try {
    const userId = req.userId;
    
    // Get active meal plan
    const mealPlansSnapshot = await db.collection('MealPlans')
      .where('userId', '==', userId)
      .where('isActive', '==', true)
      .orderBy('startDate', 'desc')
      .limit(1)
      .get();
    
    if (mealPlansSnapshot.empty) {
      return res.status(404).json({
        success: false,
        message: 'No active meal plan found'
      });
    }
    
    const mealPlanDoc = mealPlansSnapshot.docs[0];
    const mealPlan = {
      id: mealPlanDoc.id,
      ...mealPlanDoc.data()
    };
    
    // Get meals for this plan
    const mealsSnapshot = await db.collection('Meals')
      .where('planId', '==', mealPlanDoc.id)
      .get();
    
    const meals = [];
    mealsSnapshot.forEach(doc => {
      meals.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    // Organize meals by day
    const mealsByDay = {};
    meals.forEach(meal => {
      if (!meal.dayNumber) return;
      
      if (!mealsByDay[meal.dayNumber]) {
        mealsByDay[meal.dayNumber] = {
          breakfast: null,
          lunch: null,
          dinner: null,
          snacks: []
        };
      }
      
      switch(meal.type) {
        case 'BREAKFAST':
          mealsByDay[meal.dayNumber].breakfast = meal;
          break;
        case 'LUNCH':
          mealsByDay[meal.dayNumber].lunch = meal;
          break;
        case 'DINNER':
          mealsByDay[meal.dayNumber].dinner = meal;
          break;
        case 'SNACK':
          mealsByDay[meal.dayNumber].snacks.push(meal);
          break;
      }
    });
    
    return res.status(200).json({
      success: true,
      data: {
        planId: mealPlan.id,
        startDate: mealPlan.startDate ? mealPlan.startDate.toDate() : null,
        endDate: mealPlan.endDate ? mealPlan.endDate.toDate() : null,
        isActive: mealPlan.isActive,
        days: mealsByDay
      }
    });
  } catch (error) {
    console.error('Error getting current meal plan:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve meal plan',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Generate new meal plan for user
 */
const generateMealPlan = async (req, res) => {
  try {
    const userId = req.userId;
    const { days = 7 } = req.body;
    
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    // Set existing active meal plans to inactive
    const activePlansSnapshot = await db.collection('MealPlans')
      .where('userId', '==', userId)
      .where('isActive', '==', true)
      .get();
    
    const batch = db.batch();
    activePlansSnapshot.forEach(doc => {
      batch.update(doc.ref, { isActive: false });
    });
    
    // Create new meal plan
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + days - 1);
    
    const newMealPlanRef = db.collection('MealPlans').doc();
    batch.set(newMealPlanRef, {
      userId,
      startDate: admin.firestore.Timestamp.fromDate(startDate),
      endDate: admin.firestore.Timestamp.fromDate(endDate),
      isActive: true,
      adherenceRate: 0,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    // Commit batch
    await batch.commit();
    
    // Generate personalized meal plan using AI
    const aiGeneratedMealPlan = await aiService.generateMealPlan(userId, days);
    
    // Store generated meals in Firestore
    const mealBatch = db.batch();
    let mealCount = 0;
    
    if (aiGeneratedMealPlan && aiGeneratedMealPlan.days) {
      aiGeneratedMealPlan.days.forEach((dayPlan) => {
        const dayNumber = dayPlan.day || 1;
        
        // Process main meals
        ['breakfast', 'lunch', 'dinner'].forEach(mealType => {
          const meal = dayPlan[mealType];
          if (meal) {
            const mealRef = db.collection('Meals').doc();
            mealBatch.set(mealRef, {
              planId: newMealPlanRef.id,
              userId,
              dayNumber,
              name: meal.name || `Day ${dayNumber} ${mealType}`,
              type: mealType.toUpperCase(),
              ingredients: meal.ingredients || [],
              instructions: meal.instructions || [],
              targetedSymptoms: meal.benefits ? meal.benefits.map(b => b.toLowerCase()) : [],
              benefitExplanations: meal.benefits || [],
              prepTimeMinutes: meal.prepTime || 30,
              isFavorited: false,
              createdAt: admin.firestore.FieldValue.serverTimestamp(),
              updatedAt: admin.firestore.FieldValue.serverTimestamp()
            });
            mealCount++;
          }
        });
        
        // Process snacks
        if (dayPlan.snacks && Array.isArray(dayPlan.snacks)) {
          dayPlan.snacks.forEach((snack, index) => {
            if (snack) {
              const snackRef = db.collection('Meals').doc();
              mealBatch.set(snackRef, {
                planId: newMealPlanRef.id,
                userId,
                dayNumber,
                name: snack.name || `Day ${dayNumber} Snack ${index + 1}`,
                type: 'SNACK',
                ingredients: snack.ingredients || [],
                instructions: snack.instructions || [],
                targetedSymptoms: snack.benefits ? snack.benefits.map(b => b.toLowerCase()) : [],
                benefitExplanations: snack.benefits || [],
                prepTimeMinutes: snack.prepTime || 15,
                isFavorited: false,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
              });
              mealCount++;
            }
          });
        }
      });
    }
    
    // Commit the meal batch
    await mealBatch.commit();
    
    return res.status(201).json({
      success: true,
      message: `Successfully generated meal plan with ${mealCount} meals`,
      data: {
        planId: newMealPlanRef.id,
        startDate,
        endDate
      }
    });
  } catch (error) {
    console.error('Error generating meal plan:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate meal plan',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get details of a specific meal
 */
const getMealDetails = async (req, res) => {
  try {
    const { mealId } = req.params;
    
    // Get meal from Firestore
    const mealRef = db.collection('Meals').doc(mealId);
    const mealDoc = await mealRef.get();
    
    if (!mealDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Meal not found'
      });
    }
    
    const meal = mealDoc.data();
    
    // Ensure user has permission to view this meal
    if (meal.userId !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to view this meal'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: {
        id: mealDoc.id,
        ...meal
      }
    });
  } catch (error) {
    console.error('Error getting meal details:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve meal details',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Mark a meal as favorite
 */
const favoriteMeal = async (req, res) => {
  try {
    const userId = req.userId;
    const { mealId } = req.params;
    
    // Check if meal exists and belongs to user
    const mealRef = db.collection('Meals').doc(mealId);
    const mealDoc = await mealRef.get();
    
    if (!mealDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Meal not found'
      });
    }
    
    const meal = mealDoc.data();
    if (meal.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to modify this meal'
      });
    }
    
    // Update meal as favorited
    await mealRef.update({
      isFavorited: true,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    // Add to favorite meals collection
    await db.collection('FavoriteMeals').add({
      userId,
      mealId,
      dateFavorited: admin.firestore.FieldValue.serverTimestamp()
    });
    
    return res.status(200).json({
      success: true,
      message: 'Meal added to favorites'
    });
  } catch (error) {
    console.error('Error favoriting meal:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to favorite meal',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Remove a meal from favorites
 */
const unfavoriteMeal = async (req, res) => {
  try {
    const userId = req.userId;
    const { mealId } = req.params;
    
    // Check if meal exists
    const mealRef = db.collection('Meals').doc(mealId);
    const mealDoc = await mealRef.get();
    
    if (!mealDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Meal not found'
      });
    }
    
    // Update meal as not favorited
    await mealRef.update({
      isFavorited: false,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    // Remove from favorite meals collection
    const favoriteSnapshot = await db.collection('FavoriteMeals')
      .where('userId', '==', userId)
      .where('mealId', '==', mealId)
      .get();
    
    if (!favoriteSnapshot.empty) {
      const batch = db.batch();
      favoriteSnapshot.forEach(doc => {
        batch.delete(doc.ref);
      });
      await batch.commit();
    }
    
    return res.status(200).json({
      success: true,
      message: 'Meal removed from favorites'
    });
  } catch (error) {
    console.error('Error unfavoriting meal:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to remove meal from favorites',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get user's favorite meals
 */
const getFavoriteMeals = async (req, res) => {
  try {
    const userId = req.userId;
    
    // Get favorite meals from collection
    const favoriteSnapshot = await db.collection('FavoriteMeals')
      .where('userId', '==', userId)
      .orderBy('dateFavorited', 'desc')
      .get();
    
    if (favoriteSnapshot.empty) {
      return res.status(200).json({
        success: true,
        data: []
      });
    }
    
    // Get meal IDs from favorites
    const mealIds = [];
    favoriteSnapshot.forEach(doc => {
      mealIds.push(doc.data().mealId);
    });
    
    // Get meal details
    const meals = [];
    for (let i = 0; i < mealIds.length; i += 10) {
      // Firestore has a limit of 10 items for 'in' queries
      const batch = mealIds.slice(i, i + 10);
      if (batch.length > 0) {
        const mealsSnapshot = await db.collection('Meals')
          .where('__name__', 'in', batch)
          .get();
          
        mealsSnapshot.forEach(doc => {
          meals.push({
            id: doc.id,
            ...doc.data()
          });
        });
      }
    }
    
    return res.status(200).json({
      success: true,
      data: meals
    });
  } catch (error) {
    console.error('Error getting favorite meals:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve favorite meals',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getCurrentMealPlan,
  generateMealPlan,
  getMealDetails,
  favoriteMeal,
  unfavoriteMeal,
  getFavoriteMeals
};
