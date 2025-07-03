const { validationResult } = require('express-validator');
const groceryService = require('../services/grocery/grocery.service');
const { db } = require('../config/firebase');

/**
 * Get available grocery providers
 */
const getGroceryProviders = async (req, res) => {
  try {
    const providers = await groceryService.getAvailableProviders();
    
    // For each provider, check if user has connected it
    const userId = req.userId;
    
    const providersWithStatus = await Promise.all(providers.map(async provider => {
      const isConnected = await groceryService.isProviderConnected(userId, provider.id);
      return {
        ...provider,
        isConnected
      };
    }));
    
    return res.status(200).json({
      success: true,
      data: providersWithStatus
    });
  } catch (error) {
    console.error('Error getting grocery providers:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve grocery providers',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Connect grocery provider
 */
const connectGroceryProvider = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    const userId = req.userId;
    const { providerId, credentials } = req.body;
    
    const result = await groceryService.connectProvider(userId, providerId, credentials);
    
    return res.status(200).json({
      success: true,
      message: `Successfully connected to ${result.provider}`,
      data: result
    });
  } catch (error) {
    console.error('Error connecting grocery provider:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to connect grocery provider',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get current shopping list
 */
const getShoppingList = async (req, res) => {
  try {
    const userId = req.userId;
    
    const shoppingList = await groceryService.getCurrentShoppingList(userId);
    
    if (!shoppingList) {
      return res.status(404).json({
        success: false,
        message: 'No shopping list found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: shoppingList
    });
  } catch (error) {
    console.error('Error getting shopping list:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve shopping list',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Generate shopping list from meal plan
 */
const generateShoppingList = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    const userId = req.userId;
    const { mealPlanId } = req.body;
    
    const result = await groceryService.generateShoppingList(userId, mealPlanId);
    
    return res.status(201).json({
      success: true,
      message: 'Shopping list generated successfully',
      data: result
    });
  } catch (error) {
    console.error('Error generating shopping list:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate shopping list',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Process checkout with grocery provider
 */
const checkout = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    const userId = req.userId;
    const { listId, providerId } = req.body;
    
    const result = await groceryService.processCheckout(userId, listId, providerId);
    
    return res.status(200).json({
      success: true,
      message: 'Checkout processed successfully',
      data: result
    });
  } catch (error) {
    console.error('Error processing checkout:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process checkout',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get order history
 */
const getOrderHistory = async (req, res) => {
  try {
    const userId = req.userId;
    
    const orders = await groceryService.getOrderHistory(userId);
    
    return res.status(200).json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error('Error getting order history:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve order history',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get order details
 */
const getOrderDetails = async (req, res) => {
  try {
    const userId = req.userId;
    const { orderId } = req.params;
    
    // Get order from database
    const orderRef = db.collection('OrderStatuses').doc(orderId);
    const orderDoc = await orderRef.get();
    
    if (!orderDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    const order = orderDoc.data();
    
    // Ensure user owns this order
    if (order.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to view this order'
      });
    }
    
    // Get shopping list items
    const itemsSnapshot = await db.collection('ShoppingItems')
      .where('listId', '==', order.listId)
      .get();
    
    const items = [];
    itemsSnapshot.forEach(doc => {
      items.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return res.status(200).json({
      success: true,
      data: {
        order: {
          id: orderId,
          providerId: order.providerId,
          providerName: order.providerId, // Would normally map to provider name
          status: order.status,
          orderTime: order.orderTime.toDate(),
          estimatedDelivery: order.estimatedDelivery.toDate(),
          total: order.total,
          trackingUrl: order.trackingUrl
        },
        items
      }
    });
  } catch (error) {
    console.error('Error getting order details:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve order details',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getGroceryProviders,
  connectGroceryProvider,
  getShoppingList,
  generateShoppingList,
  checkout,
  getOrderHistory,
  getOrderDetails
};
