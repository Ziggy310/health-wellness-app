const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const authMiddleware = require('../middleware/auth.middleware');
const groceryController = require('../controllers/grocery.controller');

// Get available grocery providers
router.get('/providers', authMiddleware, groceryController.getGroceryProviders);

// Connect grocery provider
router.post(
  '/connect',
  authMiddleware,
  [
    body('providerId').notEmpty().withMessage('Provider ID is required'),
    body('credentials').isObject().withMessage('Credentials must be an object')
  ],
  groceryController.connectGroceryProvider
);

// Get current shopping list
router.get('/shopping-list', authMiddleware, groceryController.getShoppingList);

// Generate shopping list from meal plan
router.post(
  '/shopping-list',
  authMiddleware,
  [
    body('mealPlanId').notEmpty().withMessage('Meal plan ID is required')
  ],
  groceryController.generateShoppingList
);

// Process checkout with grocery provider
router.post(
  '/checkout',
  authMiddleware,
  [
    body('listId').notEmpty().withMessage('Shopping list ID is required'),
    body('providerId').notEmpty().withMessage('Provider ID is required')
  ],
  groceryController.checkout
);

// Get order history
router.get('/orders', authMiddleware, groceryController.getOrderHistory);

// Get order details
router.get(
  '/orders/:orderId',
  authMiddleware,
  [
    param('orderId').notEmpty().withMessage('Order ID is required')
  ],
  groceryController.getOrderDetails
);

module.exports = router;
