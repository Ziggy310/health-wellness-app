import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with publishable key
const STRIPE_PUBLISHABLE_KEY = 'pk_test_51N99MfARLfS9vMwlvlvxV3CiDQrATyQ3fZoB9DcRyVTBavpka2Lp8ISh9jH2dguVhB8i78zH2G71kyT1smpRZ7bd00JI9W1Lai';
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

export const getStripe = () => stripePromise;

// Subscription plans configuration
export const SUBSCRIPTION_PLANS = {
  FREE_TRIAL: {
    id: 'free_trial',
    name: '7-Day Free Trial',
    price: 0,
    period: '7 days',
    stripeProductId: null,
    stripePriceId: null,
    features: [
      'Full access to all premium features',
      'Personalized symptom tracking',
      'Detailed health insights',
      'Community participation',
      'Personalized meal planning',
      'Email support',
      'Auto-converts to chosen plan after trial',
      'Cancel anytime before trial ends'
    ]
  },

  PREMIUM: {
    id: 'premium',
    name: 'Monthly Plan',
    price: 19.99,
    period: 'monthly',
    stripePriceId: 'price_premium_monthly',
    features: [
      'Advanced symptom analysis',
      'Personalized meal planning',
      'Detailed nutrient tracking',
      'Full community participation',
      'Comprehensive health reports',
      'Relief tools & resources',
      'Personalized wellness tips'
    ]
  },
  ANNUAL: {
    id: 'annual',
    name: 'Annual Plan',
    price: 199.99,
    period: 'yearly',
    stripePriceId: 'price_annual_yearly',
    features: [
      'All Premium features',
      'Save over 15% vs monthly',
      'Exclusive monthly webinars',
      'Quarterly consultation with specialist',
      'Custom wellness plans',
      'Priority support',
      'Early access to new features',
      'Ad-free experience'
    ]
  }
};

// Create checkout session for subscription with trial
export const createCheckoutSession = async (planId, userEmail, includeTrialEnd = false) => {
  try {
    const plan = SUBSCRIPTION_PLANS[planId.toUpperCase()];
    if (!plan || !plan.stripePriceId) {
      throw new Error('Invalid subscription plan');
    }

    const requestBody = {
      priceId: plan.stripePriceId,
      customerEmail: userEmail,
      planId: planId,
      successUrl: `${window.location.origin}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${window.location.origin}/subscription/cancel`,
    };

    // Add 7-day trial configuration for auto-conversion
    if (includeTrialEnd) {
      requestBody.trialPeriodDays = 7;
      requestBody.paymentMethodCollection = 'always'; // Required for auto-billing after trial
    }

    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const session = await response.json();
    
    if (!response.ok) {
      throw new Error(session.error || 'Failed to create checkout session');
    }

    return session;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

// Create subscription with trial that auto-converts
export const createTrialSubscription = async (planId, userEmail) => {
  try {
    const plan = SUBSCRIPTION_PLANS[planId.toUpperCase()];
    if (!plan || !plan.stripePriceId) {
      throw new Error('Invalid subscription plan');
    }

    const response = await fetch('/api/create-trial-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId: plan.stripePriceId,
        customerEmail: userEmail,
        planId: planId,
        trialPeriodDays: 7,
      }),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to create trial subscription');
    }

    return result;
  } catch (error) {
    console.error('Error creating trial subscription:', error);
    throw error;
  }
};

// Redirect to Stripe Checkout
export const redirectToCheckout = async (planId, userEmail, withTrial = false) => {
  try {
    const stripe = await getStripe();
    const session = await createCheckoutSession(planId, userEmail, withTrial);
    
    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      throw new Error(result.error.message);
    }
  } catch (error) {
    console.error('Error redirecting to checkout:', error);
    throw error;
  }
};

// Start trial with auto-conversion setup
export const startTrialWithAutoConversion = async (planId, userEmail) => {
  try {
    // Create subscription with trial that will auto-convert
    const result = await createTrialSubscription(planId, userEmail);
    return result;
  } catch (error) {
    console.error('Error starting trial with auto-conversion:', error);
    throw error;
  }
};

// Create customer portal session for subscription management
export const createCustomerPortalSession = async (customerId) => {
  try {
    const response = await fetch('/api/create-portal-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerId: customerId,
        returnUrl: `${window.location.origin}/dashboard`,
      }),
    });

    const session = await response.json();
    
    if (!response.ok) {
      throw new Error(session.error || 'Failed to create portal session');
    }

    return session;
  } catch (error) {
    console.error('Error creating portal session:', error);
    throw error;
  }
};

// Get subscription status
export const getSubscriptionStatus = async (userId) => {
  try {
    const response = await fetch(`/api/subscription-status/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to get subscription status');
    }

    return data;
  } catch (error) {
    console.error('Error getting subscription status:', error);
    throw error;
  }
};

// Check if user has access to premium features
export const hasPremiumAccess = (subscriptionStatus) => {
  if (!subscriptionStatus) return false;
  
  const { status, plan, trialEnd } = subscriptionStatus;
  
  // Free trial access (including trialing status)
  if ((plan === 'free_trial' || status === 'trialing') && trialEnd && new Date(trialEnd) > new Date()) {
    return true;
  }
  
  // Active subscription access
  return status === 'active' && ['premium', 'annual'].includes(plan);
};

// Calculate days remaining in trial or subscription
export const getDaysRemaining = (subscriptionStatus) => {
  if (!subscriptionStatus) return 0;
  
  const { status, trialEnd, currentPeriodEnd } = subscriptionStatus;
  
  // For trial periods
  if (status === 'trialing' && trialEnd) {
    const endDate = new Date(trialEnd);
    const now = new Date();
    const daysRemaining = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
    return Math.max(0, daysRemaining);
  }
  
  // For active subscriptions
  if (status === 'active' && currentPeriodEnd) {
    const endDate = new Date(currentPeriodEnd);
    const now = new Date();
    const daysRemaining = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
    return Math.max(0, daysRemaining);
  }
  
  return 0;
};

// Check if trial is about to expire (24-48 hours warning)
export const isTrialExpiringSoon = (subscriptionStatus) => {
  if (!subscriptionStatus || subscriptionStatus.status !== 'trialing') return false;
  
  const daysRemaining = getDaysRemaining(subscriptionStatus);
  return daysRemaining <= 2 && daysRemaining > 0;
};

// Get feature access level based on subscription
export const getFeatureAccess = (subscriptionStatus) => {
  if (!subscriptionStatus) {
    return {
      symptomTracking: 'basic',
      mealPlanning: 'basic',
      community: 'readonly',
      insights: 'basic',
      support: 'standard'
    };
  }

  const { status, plan, trialEnd } = subscriptionStatus;
  
  // Free trial - full access
  if (plan === 'free_trial' && trialEnd && new Date(trialEnd) > new Date()) {
    return {
      symptomTracking: 'advanced',
      mealPlanning: 'personalized',
      community: 'full',
      insights: 'comprehensive',
      support: 'priority'
    };
  }
  
  // Premium plan
  if (status === 'active' && (plan === 'premium' || plan === 'annual')) {
    return {
      symptomTracking: 'advanced',
      mealPlanning: 'personalized',
      community: 'full',
      insights: 'comprehensive',
      support: 'priority'
    };
  }
  
  // Default to basic access
  return {
    symptomTracking: 'basic',
    mealPlanning: 'basic',
    community: 'readonly',
    insights: 'basic',
    support: 'standard'
  };
};