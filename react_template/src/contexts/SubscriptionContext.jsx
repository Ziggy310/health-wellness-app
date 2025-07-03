import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSubscriptionStatus, hasPremiumAccess, getFeatureAccess } from '../services/StripeService';
import { useAuth } from '../hooks/useAuth';

const SubscriptionContext = createContext();

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

export const SubscriptionProvider = ({ children }) => {
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isAuthenticated } = useAuth();

  // Fetch subscription status
  const fetchSubscriptionStatus = async () => {
    if (!isAuthenticated || !user?.id) {
      setSubscriptionStatus(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // First check localStorage for cached subscription data
      const cachedSubscription = localStorage.getItem(`subscription_${user.id}`);
      if (cachedSubscription) {
        const parsed = JSON.parse(cachedSubscription);
        // Check if cache is still valid (less than 5 minutes old)
        if (Date.now() - parsed.timestamp < 5 * 60 * 1000) {
          setSubscriptionStatus(parsed.data);
          setLoading(false);
          return;
        }
      }

      // Fetch from API
      const status = await getSubscriptionStatus(user.id);
      setSubscriptionStatus(status);
      
      // Cache the result
      localStorage.setItem(`subscription_${user.id}`, JSON.stringify({
        data: status,
        timestamp: Date.now()
      }));
      
    } catch (err) {
      console.error('Error fetching subscription status:', err);
      setError(err.message);
      
      // Fallback to free trial for new users
      const defaultStatus = {
        status: 'trialing',
        plan: 'free_trial',
        trialEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        customerId: null
      };
      setSubscriptionStatus(defaultStatus);
    } finally {
      setLoading(false);
    }
  };

  // Refresh subscription status
  const refreshSubscription = async () => {
    // Clear cache
    if (user?.id) {
      localStorage.removeItem(`subscription_${user.id}`);
    }
    await fetchSubscriptionStatus();
  };

  // Start free trial with auto-conversion setup
  const startFreeTrial = async (selectedPlan = 'premium') => {
    if (!user?.id) return;

    try {
      // Store the selected plan for auto-conversion
      localStorage.setItem(`trial_conversion_plan_${user.id}`, selectedPlan);
      
      const trialStatus = {
        status: 'trialing',
        plan: 'free_trial',
        trialEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        customerId: null,
        trialStarted: new Date().toISOString(),
        autoConvertToPlan: selectedPlan, // Track which plan to convert to
        paymentMethodRequired: true // Will need payment method for auto-conversion
      };

      setSubscriptionStatus(trialStatus);
      
      // Cache the trial status
      localStorage.setItem(`subscription_${user.id}`, JSON.stringify({
        data: trialStatus,
        timestamp: Date.now()
      }));

      // Store trial tracking
      localStorage.setItem(`trial_started_${user.id}`, new Date().toISOString());
      
      return trialStatus;
    } catch (error) {
      console.error('Error starting trial:', error);
      throw error;
    }
  };

  // Start trial with payment method for auto-conversion
  const startTrialWithPayment = async (selectedPlan, userEmail) => {
    if (!user?.id) return;

    try {
      // Import the service function
      const { startTrialWithAutoConversion } = await import('../services/StripeService');
      
      // Create subscription with trial that auto-converts
      const result = await startTrialWithAutoConversion(selectedPlan, userEmail);
      
      // Update local state
      const trialStatus = {
        status: 'trialing',
        plan: 'free_trial',
        trialEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        customerId: result.customerId,
        subscriptionId: result.subscriptionId,
        trialStarted: new Date().toISOString(),
        autoConvertToPlan: selectedPlan,
        paymentMethodAttached: true
      };

      setSubscriptionStatus(trialStatus);
      
      // Cache the trial status
      localStorage.setItem(`subscription_${user.id}`, JSON.stringify({
        data: trialStatus,
        timestamp: Date.now()
      }));

      localStorage.setItem(`trial_started_${user.id}`, new Date().toISOString());
      
      return trialStatus;
    } catch (error) {
      console.error('Error starting trial with payment:', error);
      throw error;
    }
  };

  // Check if user has started trial
  const hasStartedTrial = () => {
    if (!user?.id) return false;
    return localStorage.getItem(`trial_started_${user.id}`) !== null;
  };

  // Get days remaining in trial
  const getTrialDaysRemaining = () => {
    if (!subscriptionStatus) return 0;
    
    // Handle both free_trial plan and trialing status
    if (subscriptionStatus.plan === 'free_trial' || subscriptionStatus.status === 'trialing') {
      const trialEnd = new Date(subscriptionStatus.trialEnd);
      const now = new Date();
      const daysRemaining = Math.ceil((trialEnd - now) / (1000 * 60 * 60 * 24));
      
      return Math.max(0, daysRemaining);
    }
    
    return 0;
  };

  // Get hours remaining in trial (for more precise countdown)
  const getTrialHoursRemaining = () => {
    if (!subscriptionStatus) return 0;
    
    if (subscriptionStatus.plan === 'free_trial' || subscriptionStatus.status === 'trialing') {
      const trialEnd = new Date(subscriptionStatus.trialEnd);
      const now = new Date();
      const hoursRemaining = Math.ceil((trialEnd - now) / (1000 * 60 * 60));
      
      return Math.max(0, hoursRemaining);
    }
    
    return 0;
  };

  // Check if trial is expiring soon (within 24 hours)
  const isTrialExpiringSoon = () => {
    const hoursRemaining = getTrialHoursRemaining();
    return hoursRemaining > 0 && hoursRemaining <= 24;
  };

  // Get the plan user will convert to after trial
  const getAutoConvertPlan = () => {
    if (!user?.id) return null;
    return localStorage.getItem(`trial_conversion_plan_${user.id}`) || 
           subscriptionStatus?.autoConvertToPlan || 
           'premium'; // Default to premium
  };

  // Check premium access
  const isPremium = hasPremiumAccess(subscriptionStatus);
  
  // Get feature access levels
  const featureAccess = getFeatureAccess(subscriptionStatus);

  useEffect(() => {
    fetchSubscriptionStatus();
  }, [isAuthenticated, user?.id]);

  const value = {
    subscriptionStatus,
    loading,
    error,
    isPremium,
    featureAccess,
    refreshSubscription,
    startFreeTrial,
    startTrialWithPayment,
    hasStartedTrial,
    getTrialDaysRemaining,
    getTrialHoursRemaining,
    isTrialExpiringSoon,
    getAutoConvertPlan,
    // Helper methods
    isOnFreeTrial: (subscriptionStatus?.plan === 'free_trial' || subscriptionStatus?.status === 'trialing') && getTrialDaysRemaining() > 0,
    isTrialExpired: (subscriptionStatus?.plan === 'free_trial' || subscriptionStatus?.status === 'trialing') && getTrialDaysRemaining() === 0,
    currentPlan: subscriptionStatus?.plan || 'none',
    isActive: subscriptionStatus?.status === 'active',
    isTrialing: subscriptionStatus?.status === 'trialing',
    hasPaymentMethod: subscriptionStatus?.paymentMethodAttached || false,
    willAutoConvert: subscriptionStatus?.paymentMethodAttached && subscriptionStatus?.status === 'trialing'
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};