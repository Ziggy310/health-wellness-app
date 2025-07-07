import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { redirectToCheckout } from '../../services/StripeService';

const PlanSelector = ({ plans, onPlanSelect }) => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { startFreeTrial, hasStartedTrial, isPremium } = useSubscription();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePlanClick = async (plan) => {
    if (!isAuthenticated) {
      // Store selected plan and redirect to auth
      localStorage.setItem('selectedPlan', plan.id);
      navigate('/auth?mode=signup');
      return;
    }

    setSelectedPlan(plan);
    setLoading(true);

    try {
      if (plan.id === 'free_trial') {
        if (hasStartedTrial()) {
          alert('You have already used your free trial. Please select a paid plan.');
          return;
        }
        await startFreeTrial();
        navigate('/dashboard');
      } else {
        // Redirect to Stripe Checkout
        await redirectToCheckout(plan.id, user.email);
      }
    } catch (error) {
      console.error('Error selecting plan:', error);
      alert('Unable to process your selection. Please try again.');
    } finally {
      setLoading(false);
      setSelectedPlan(null);
    }
  };

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
      {plans.map((plan, index) => (
        <div 
          key={index} 
          className={`rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ${
            isPremium && plan.id === 'free_trial' ? 'opacity-50' : ''
          }`}
        >
          <div className={`${plan.color} p-6 text-white relative`}>
            {plan.recommended && (
              <div className="absolute -top-3 left-0 right-0 flex justify-center">
                <span className="bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-bold py-1 px-4 rounded-full shadow-lg">
                  MOST POPULAR
                </span>
              </div>
            )}
            <h3 className="text-2xl font-bold text-center mt-4">{plan.name}</h3>
            <div className="text-center my-4">
              <span className="text-4xl font-bold">{plan.price}</span>
              <span className="text-sm">/{plan.period}</span>
            </div>
            <p className="text-center text-sm text-purple-200">{plan.bestFor}</p>
          </div>
          
          <div className="bg-white p-6 flex flex-col h-80">
            <ul className="space-y-2 flex-grow">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start text-sm">
                  <svg className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            
            <button 
              onClick={() => handlePlanClick(plan)}
              disabled={loading || (plan.id === 'free_trial' && hasStartedTrial()) || (isPremium && plan.id === 'free_trial')}
              className={`w-full mt-6 py-3 rounded-lg font-bold transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed ${
                selectedPlan?.id === plan.id && loading
                  ? 'bg-gray-400 text-white' 
                  : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
              }`}
            >
              {loading && selectedPlan?.id === plan.id ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                plan.id === 'free_trial' && hasStartedTrial() 
                  ? 'Trial Used' 
                  : isPremium && plan.id === 'free_trial'
                    ? 'Current Plan'
                    : plan.id === 'free_trial'
                      ? 'Start Free Trial'
                      : 'Select Plan'
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PlanSelector;