const axios = require('axios');
const { db } = require('../../config/firebase');

/**
 * Grocery Service for integrating with grocery delivery providers
 * For MVP, this is a mock implementation that simulates the integration
 */
class GroceryService {
  constructor() {
    // Mock API configuration for supported providers
    this.providers = {
      INSTACART: {
        name: 'Instacart',
        baseUrl: process.env.INSTACART_API_URL || 'https://api.instacart.com',
        apiKey: process.env.INSTACART_API_KEY,
        logo: 'https://example.com/instacart-logo.png',
        isActive: true
      },
      WALMART: {
        name: 'Walmart Grocery',
        baseUrl: process.env.WALMART_API_URL || 'https://grocery-api.walmart.com',
        apiKey: process.env.WALMART_API_KEY,
        logo: 'https://example.com/walmart-logo.png',
        isActive: true
      },
      AMAZON_FRESH: {
        name: 'Amazon Fresh',
        baseUrl: process.env.AMAZON_FRESH_API_URL || 'https://fresh-api.amazon.com',
        apiKey: process.env.AMAZON_FRESH_API_KEY,
        logo: 'https://example.com/amazon-fresh-logo.png',
        isActive: false // Not implemented yet for MVP
      }
    };
  }

  /**
   * Get available grocery providers
   */
  async getAvailableProviders() {
    try {
      // Filter only active providers
      const availableProviders = Object.entries(this.providers)
        .filter(([_, provider]) => provider.isActive)
        .map(([id, provider]) => ({
          id,
          name: provider.name,
          logo: provider.logo
        }));
      
      return availableProviders;
    } catch (error) {
      console.error('Error getting available providers:', error);
      throw new Error('Failed to retrieve grocery providers');
    }
  }

  /**
   * Check if a provider is connected for a user
   */
  async isProviderConnected(userId, providerId) {
    try {
      const integrationSnapshot = await db.collection('GroceryIntegrations')
        .where('userId', '==', userId)
        .where('providerType', '==', providerId)
        .where('isConnected', '==', true)
        .limit(1)
        .get();
      
      return !integrationSnapshot.empty;
    } catch (error) {
      console.error('Error checking provider connection:', error);
      return false;
    }
  }

  /**
   * Connect a grocery provider for a user (mock implementation)
   */
  async connectProvider(userId, providerId, credentials) {
    try {
      if (!this.providers[providerId] || !this.providers[providerId].isActive) {
        throw new Error(`Provider ${providerId} not available`);
      }
      
      // For MVP, we simulate a successful connection without actually calling the provider's API
      // In a real implementation, this would exchange the credentials for an access token
      
      // Check if integration exists
      const integrationSnapshot = await db.collection('GroceryIntegrations')
        .where('userId', '==', userId)
        .where('providerType', '==', providerId)
        .limit(1)
        .get();
      
      // Create a mock access token and expiry
      const mockToken = `mock_token_${userId}_${providerId}_${Date.now()}`;
      const tokenExpiry = new Date();
      tokenExpiry.setDate(tokenExpiry.getDate() + 30); // 30 days expiration
      
      if (integrationSnapshot.empty) {
        // Create new integration
        await db.collection('GroceryIntegrations').add({
          userId,
          providerType: providerId,
          accessToken: mockToken,
          tokenExpiry,
          isConnected: true,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      } else {
        // Update existing integration
        await integrationSnapshot.docs[0].ref.update({
          accessToken: mockToken,
          tokenExpiry,
          isConnected: true,
          updatedAt: new Date()
        });
      }
      
      return {
        connected: true,
        provider: this.providers[providerId].name,
        expiresAt: tokenExpiry
      };
    } catch (error) {
      console.error(`Error connecting to provider ${providerId}:`, error);
      throw new Error(`Failed to connect to grocery provider: ${error.message}`);
    }
  }

  /**
   * Generate shopping list from meal plan ingredients
   */
  async generateShoppingList(userId, mealPlanId) {
    try {
      // Get the meal plan
      const mealPlanRef = db.collection('MealPlans').doc(mealPlanId);
      const mealPlanDoc = await mealPlanRef.get();
      
      if (!mealPlanDoc.exists) {
        throw new Error('Meal plan not found');
      }
      
      const mealPlan = mealPlanDoc.data();
      
      // Check ownership
      if (mealPlan.userId !== userId) {
        throw new Error('User does not have access to this meal plan');
      }
      
      // Get all meals for this meal plan
      const mealsSnapshot = await db.collection('Meals')
        .where('planId', '==', mealPlanId)
        .get();
      
      // Extract ingredients from meals
      const ingredientsMap = new Map(); // Map to merge duplicate ingredients
      
      mealsSnapshot.forEach(doc => {
        const meal = doc.data();
        const mealId = doc.id;
        
        if (meal.ingredients && Array.isArray(meal.ingredients)) {
          meal.ingredients.forEach(ingredient => {
            // Parse ingredient text (simple parsing for MVP)
            const parsedIngredient = this.parseIngredient(ingredient);
            
            if (ingredientsMap.has(parsedIngredient.name)) {
              // Ingredient already exists, merge quantities
              const existingItem = ingredientsMap.get(parsedIngredient.name);
              existingItem.mealIds.push(mealId);
              // Only add quantity if units match and are numerical
              if (existingItem.unit === parsedIngredient.unit && !isNaN(parsedIngredient.quantity)) {
                existingItem.quantity += parsedIngredient.quantity;
              }
            } else {
              // New ingredient
              ingredientsMap.set(parsedIngredient.name, {
                ...parsedIngredient,
                mealIds: [mealId]
              });
            }
          });
        }
      });
      
      // Convert map to array
      const shoppingItems = Array.from(ingredientsMap.values());
      
      // Categorize items
      const categorizedItems = this.categorizeItems(shoppingItems);
      
      // Create shopping list in database
      const shoppingListRef = await db.collection('ShoppingLists').add({
        userId,
        mealPlanId,
        estimatedTotal: 0, // To be calculated when actually checking out
        isCustomized: false,
        created: new Date()
      });
      
      // Add items to the shopping list
      const batch = db.batch();
      
      categorizedItems.forEach((value, category) => {
        value.forEach(item => {
          const itemRef = db.collection('ShoppingItems').doc();
          batch.set(itemRef, {
            listId: shoppingListRef.id,
            name: item.name,
            category,
            quantity: item.quantity,
            unit: item.unit,
            isPantryStaple: this.isPantryStaple(item.name),
            isOptional: false,
            mealIds: item.mealIds
          });
        });
      });
      
      await batch.commit();
      
      return {
        listId: shoppingListRef.id,
        categorizedItems: Object.fromEntries(categorizedItems)
      };
    } catch (error) {
      console.error('Error generating shopping list:', error);
      throw new Error(`Failed to generate shopping list: ${error.message}`);
    }
  }

  /**
   * Parse an ingredient string into structured data
   */
  parseIngredient(ingredientString) {
    // Very basic parsing for MVP - in production, use a more sophisticated parser
    const regex = /^([\d.\/]+)?\s*(\w+)?\s*(.+)$/;
    const match = ingredientString.trim().match(regex);
    
    if (match) {
      const quantity = match[1] ? this.parseQuantity(match[1]) : 1;
      let unit = match[2] || '';
      let name = match[3] || '';
      
      // Handle case where there's no unit but a quantity
      if (!match[2] && match[3]) {
        name = match[3];
      }
      
      // Handle common unit abbreviations
      if (unit) {
        unit = unit.toLowerCase();
        // Add more mappings as needed
        const unitMap = {
          'tbsp': 'tablespoon',
          'tbs': 'tablespoon',
          'tb': 'tablespoon',
          'tsp': 'teaspoon',
          'oz': 'ounce',
          'lb': 'pound',
          'lbs': 'pound',
          'g': 'gram',
          'kg': 'kilogram'
        };
        
        unit = unitMap[unit] || unit;
      }
      
      return {
        name: name.trim(),
        quantity,
        unit: unit.trim()
      };
    }
    
    // If parsing fails, just use the whole string as the name
    return {
      name: ingredientString.trim(),
      quantity: 1,
      unit: ''
    };
  }

  /**
   * Parse quantity from string (e.g., "1.5", "1/2")
   */
  parseQuantity(quantityStr) {
    if (quantityStr.includes('/')) {
      const [numerator, denominator] = quantityStr.split('/');
      return parseFloat(numerator) / parseFloat(denominator);
    }
    return parseFloat(quantityStr);
  }

  /**
   * Categorize items into grocery departments
   */
  categorizeItems(items) {
    const categories = new Map();
    
    // Define common categories
    const categoryMap = {
      'Produce': ['apple', 'banana', 'orange', 'lettuce', 'spinach', 'kale', 'carrot', 'tomato', 'onion', 'garlic', 'potato', 'pepper', 'cucumber', 'zucchini', 'broccoli', 'cabbage', 'mushroom'],
      'Dairy': ['milk', 'cheese', 'yogurt', 'butter', 'cream', 'egg', 'sour cream', 'cottage cheese', 'cream cheese'],
      'Meat': ['chicken', 'beef', 'pork', 'turkey', 'lamb', 'sausage', 'bacon', 'ground'],
      'Seafood': ['fish', 'salmon', 'tuna', 'tilapia', 'shrimp', 'cod', 'crab', 'lobster'],
      'Bakery': ['bread', 'bun', 'roll', 'bagel', 'tortilla', 'pita'],
      'Pantry': ['rice', 'pasta', 'flour', 'sugar', 'salt', 'pepper', 'oil', 'vinegar', 'spice', 'herb', 'bean', 'lentil', 'canned', 'sauce', 'cereal'],
      'Frozen': ['frozen', 'ice cream', 'freezer']
    };
    
    // Create categories
    Object.keys(categoryMap).forEach(category => {
      categories.set(category, []);
    });
    
    // Categorize each item
    items.forEach(item => {
      let assigned = false;
      
      // Check each category
      for (const [category, keywords] of Object.entries(categoryMap)) {
        if (keywords.some(keyword => item.name.toLowerCase().includes(keyword))) {
          categories.get(category).push(item);
          assigned = true;
          break;
        }
      }
      
      // If not assigned to any category, put in Other
      if (!assigned) {
        if (!categories.has('Other')) {
          categories.set('Other', []);
        }
        categories.get('Other').push(item);
      }
    });
    
    return categories;
  }

  /**
   * Check if an item is a pantry staple
   */
  isPantryStaple(itemName) {
    const pantryStaples = [
      'salt', 'pepper', 'oil', 'flour', 'sugar', 'rice', 'pasta', 
      'vinegar', 'soy sauce', 'ketchup', 'mustard', 'mayonnaise',
      'spice', 'herb', 'baking powder', 'baking soda', 'vanilla'
    ];
    
    return pantryStaples.some(staple => 
      itemName.toLowerCase().includes(staple));
  }

  /**
   * Get current shopping list for user
   */
  async getCurrentShoppingList(userId) {
    try {
      // Get the most recent shopping list
      const listSnapshot = await db.collection('ShoppingLists')
        .where('userId', '==', userId)
        .orderBy('created', 'desc')
        .limit(1)
        .get();
      
      if (listSnapshot.empty) {
        return null;
      }
      
      const listDoc = listSnapshot.docs[0];
      const listId = listDoc.id;
      const listData = listDoc.data();
      
      // Get all items for this list
      const itemsSnapshot = await db.collection('ShoppingItems')
        .where('listId', '==', listId)
        .get();
      
      const items = [];
      itemsSnapshot.forEach(doc => {
        items.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      // Organize by category
      const categorizedItems = {};
      items.forEach(item => {
        if (!categorizedItems[item.category]) {
          categorizedItems[item.category] = [];
        }
        categorizedItems[item.category].push(item);
      });
      
      return {
        listId,
        mealPlanId: listData.mealPlanId,
        created: listData.created.toDate(),
        isCustomized: listData.isCustomized,
        estimatedTotal: listData.estimatedTotal,
        categorizedItems
      };
    } catch (error) {
      console.error('Error getting current shopping list:', error);
      throw new Error('Failed to retrieve shopping list');
    }
  }

  /**
   * Process checkout with grocery provider (mock implementation)
   */
  async processCheckout(userId, listId, providerId) {
    try {
      // Check if provider is connected
      const isConnected = await this.isProviderConnected(userId, providerId);
      
      if (!isConnected) {
        throw new Error(`Provider ${providerId} is not connected`);
      }
      
      // Check if shopping list exists and belongs to user
      const listRef = db.collection('ShoppingLists').doc(listId);
      const listDoc = await listRef.get();
      
      if (!listDoc.exists) {
        throw new Error('Shopping list not found');
      }
      
      const listData = listDoc.data();
      
      if (listData.userId !== userId) {
        throw new Error('User does not have access to this shopping list');
      }
      
      // Get items from list
      const itemsSnapshot = await db.collection('ShoppingItems')
        .where('listId', '==', listId)
        .get();
      
      // For MVP, we're just simulating the checkout
      // In a real implementation, we'd make API calls to the grocery provider
      
      // Create order record
      const orderRef = await db.collection('OrderStatuses').add({
        userId,
        providerId,
        listId,
        status: 'CREATED',
        orderTime: new Date(),
        estimatedDelivery: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
        total: this.calculateMockTotal(itemsSnapshot.size),
        trackingUrl: `https://example.com/${providerId.toLowerCase()}/track/${Date.now()}`,
        created: new Date(),
        updated: new Date()
      });
      
      return {
        orderId: orderRef.id,
        status: 'CREATED',
        estimatedDelivery: new Date(Date.now() + 24 * 60 * 60 * 1000),
        provider: this.providers[providerId].name
      };
    } catch (error) {
      console.error('Error processing checkout:', error);
      throw new Error(`Failed to process checkout: ${error.message}`);
    }
  }

  /**
   * Calculate a mock total based on number of items
   */
  calculateMockTotal(itemCount) {
    // Simple logic for mock pricing
    const basePrice = 15; // Base price
    const pricePerItem = 3.5; // Average price per item
    return basePrice + (itemCount * pricePerItem);
  }

  /**
   * Get order history for a user
   */
  async getOrderHistory(userId) {
    try {
      const ordersSnapshot = await db.collection('OrderStatuses')
        .where('userId', '==', userId)
        .orderBy('orderTime', 'desc')
        .limit(10)
        .get();
      
      const orders = [];
      ordersSnapshot.forEach(doc => {
        const data = doc.data();
        orders.push({
          id: doc.id,
          providerId: data.providerId,
          providerName: this.providers[data.providerId]?.name || data.providerId,
          status: data.status,
          orderTime: data.orderTime.toDate(),
          estimatedDelivery: data.estimatedDelivery.toDate(),
          total: data.total,
          trackingUrl: data.trackingUrl
        });
      });
      
      return orders;
    } catch (error) {
      console.error('Error getting order history:', error);
      throw new Error('Failed to retrieve order history');
    }
  }
}

module.exports = new GroceryService();
