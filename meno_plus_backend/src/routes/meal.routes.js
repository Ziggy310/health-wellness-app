const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authMiddleware = require('../middleware/auth.middleware');
const mealController = require('../controllers/meal.controller');

// Get current meal plan
router.get('/plans/current', authMiddleware, mealController.getCurrentMealPlan);

// Generate new meal plan
router.post(
  '/plans/generate', 
  authMiddleware,
  [
    body('days').optional().isInt({ min: 1, max: 14 }).withMessage('Days must be between 1 and 14')
  ],
  mealController.generateMealPlan
);

// Get details of a specific meal
router.get('/:mealId', authMiddleware, mealController.getMealDetails);

// Add meal to favorites
router.post('/:mealId/favorite', authMiddleware, mealController.favoriteMeal);

// Remove meal from favorites
router.delete('/:mealId/favorite', authMiddleware, mealController.unfavoriteMeal);

// Get all favorite meals
router.get('/favorites', authMiddleware, mealController.getFavoriteMeals);

module.exports = router;
