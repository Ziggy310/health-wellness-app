import { useSubscription } from '../contexts/SubscriptionContext';

/**
 * Custom hook to check premium feature access
 * @param {string} featureType - Type of feature (symptomTracking, mealPlanning, community, insights, support)
 * @param {string} requiredLevel - Required access level (basic, standard, advanced, personalized, comprehensive, priority)
 * @returns {object} Feature access information
 */
export const usePremiumFeature = (featureType, requiredLevel = 'premium') => {
  const { isPremium, isOnFreeTrial, featureAccess, currentPlan } = useSubscription();

  // Feature access levels hierarchy
  const accessLevels = {
    basic: 1,
    standard: 2,
    limited: 2,
    readonly: 2,
    advanced: 3,
    personalized: 3,
    full: 3,
    comprehensive: 4,
    priority: 4
  };

  // Get current access level for the feature
  const currentAccess = featureAccess[featureType] || 'basic';
  const currentLevel = accessLevels[currentAccess] || 1;
  const requiredAccessLevel = accessLevels[requiredLevel] || 1;

  // Check if user has access
  const hasAccess = currentLevel >= requiredAccessLevel;

  // Additional checks
  const isFreeTrial = isOnFreeTrial;
  const isPremiumPlan = isPremium;

  return {
    hasAccess,
    currentAccess,
    requiredLevel,
    isFreeTrial,
    isPremiumPlan,
    currentPlan,
    // Helper methods
    canUseFeature: hasAccess || isFreeTrial,
    needsUpgrade: !hasAccess && !isFreeTrial,
    accessMessage: getAccessMessage(hasAccess, isFreeTrial, currentPlan, featureType)
  };
};

const getAccessMessage = (hasAccess, isFreeTrial, currentPlan, featureType) => {
  if (hasAccess || isFreeTrial) {
    return null; // No message needed
  }

  const featureMessages = {
    symptomTracking: 'Advanced symptom tracking is available with Premium plans',
    mealPlanning: 'Personalized meal planning requires a Premium subscription',
    community: 'Full community participation is a Premium feature',
    insights: 'Comprehensive health insights are available with Premium plans',
    support: 'Priority support is included with Premium subscriptions'
  };

  return featureMessages[featureType] || 'This feature requires a Premium subscription';
};

export default usePremiumFeature;