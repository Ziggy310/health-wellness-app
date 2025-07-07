import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '../../contexts/SubscriptionContext';

const PremiumFeatureLock = ({ 
  feature, 
  children, 
  fallbackContent = null,
  showUpgrade = true,
  className = ""
}) => {
  const navigate = useNavigate();
  const { isPremium, isOnFreeTrial, getTrialDaysRemaining } = useSubscription();

  // Allow access if user has premium or is on active free trial
  if (isPremium || isOnFreeTrial) {
    return children;
  }

  // Show fallback content if provided
  if (fallbackContent) {
    return fallbackContent;
  }

  // Default premium lock UI
  return (
    <div className={`relative ${className}`}>
      {/* Blurred background content */}
      <div className="filter blur-sm pointer-events-none select-none">
        {children}
      </div>
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center">
        <div className="text-center p-6 max-w-sm">
          <div className="mb-4">
            <svg className="w-16 h-16 text-purple-600 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Premium Feature
          </h3>
          
          <p className="text-gray-600 mb-4">
            {feature} is available with our Premium plan. Unlock this and many more features to enhance your menopause journey.
          </p>
          
          <div className="space-y-3">
            {showUpgrade && (
              <>
                <button
                  onClick={() => navigate('/subscription')}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Upgrade to Premium
                </button>
                
                <button
                  onClick={() => navigate('/subscription')}
                  className="w-full border border-purple-600 text-purple-600 hover:bg-purple-50 font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Start Free Trial
                </button>
              </>
            )}
          </div>
          
          <p className="text-xs text-gray-500 mt-3">
            7-day free trial • No credit card required
          </p>
        </div>
      </div>
    </div>
  );
};

export default PremiumFeatureLock;