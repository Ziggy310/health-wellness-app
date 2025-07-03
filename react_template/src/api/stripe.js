// Mock API endpoints for Stripe integration
// In production, these would be actual backend API calls

const API_BASE_URL = 'http://localhost:3001';

// Mock create checkout session
export const createCheckoutSession = async (data) => {
  // In development/demo mode, simulate successful session creation
  if (true) { // Always use demo mode for now
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      id: 'cs_mock_' + Math.random().toString(36).substr(2, 9),
      url: `${window.location.origin}/subscription/success?session_id=mock_session`
    };
  }

  const response = await fetch(`${API_BASE_URL}/api/create-checkout-session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to create checkout session');
  }

  return response.json();
};

// Mock create customer portal session
export const createCustomerPortalSession = async (customerId) => {
  // In development/demo mode, simulate portal session
  if (true) { // Always use demo mode for now
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      url: `${window.location.origin}/subscription`
    };
  }

  const response = await fetch(`${API_BASE_URL}/api/create-portal-session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ customerId }),
  });

  if (!response.ok) {
    throw new Error('Failed to create portal session');
  }

  return response.json();
};

// Mock get subscription status
export const getSubscriptionStatus = async (userId) => {
  // In development/demo mode, return mock subscription data
  if (true) { // Always use demo mode for now
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Check if user has active trial
    const trialData = localStorage.getItem(`subscription_${userId}`);
    if (trialData) {
      const parsed = JSON.parse(trialData);
      return parsed.data;
    }
    
    // Default to no subscription
    return null;
  }

  const response = await fetch(`${API_BASE_URL}/api/subscription-status/${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get subscription status');
  }

  return response.json();
};