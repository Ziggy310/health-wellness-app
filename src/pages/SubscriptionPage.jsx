import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useSubscription } from '../contexts/SubscriptionContext';
import CheckoutForm from '../components/subscription/CheckoutForm';
import SubscriptionManager from '../components/subscription/SubscriptionManager';
import Layout from '../components/common/Layout';

const SubscriptionPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { isPremium, startFreeTrial, hasStartedTrial } = useSubscription();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);

  // Subscription plans matching the landing page
  const subscriptionPlans = [
    {
      id: 'free_trial',
      name: '7-Day Free Trial',
      price: 'FREE',
      period: '7 days',
      features: [
        'Full access to all premium features',
        'Personalized symptom tracking',
        'Detailed health insights',
        'Community participation',
        'Personalized meal planning',
        'Email support',
        'No credit card required',
        'Cancel anytime'
      ],
      bestFor: 'Try all features with no commitment',
      color: 'bg-gradient-to-r from-green-500 to-green-600',
      recommended: false
    },
    {
      id: 'essential',
      name: 'Essential',
      price: '$9.99',
      period: 'monthly',
      features: [
        'Daily symptom tracking',
        'Weekly symptom reports',
        'Basic meal recommendations',
        'Community access (read-only)',
        'Limited health insights',
        'Email support (48h response)'
      ],
      bestFor: 'Best for those beginning their menopause journey',
      color: 'bg-gradient-to-r from-purple-400 to-purple-500',
      recommended: false
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '$14.99',
      period: 'monthly',
      features: [
        'Advanced symptom analysis',
        'Personalized meal planning',
        'Detailed nutrient tracking',
        'Full community participation',
        'Comprehensive health reports',
        'Relief tools & resources',
        'Priority email support (24h response)',
        'Personalized wellness tips'
      ],
      bestFor: 'Best for active symptom management and support',
      color: 'bg-gradient-to-r from-purple-600 to-purple-700',
      recommended: true
    },
    {
      id: 'annual',
      name: 'Annual Plan',
      price: '$149.99',
      period: 'yearly',
      features: [
        'All Premium features',
        'Save over 15% vs monthly',
        'Exclusive monthly webinars',
        'Quarterly consultation with specialist',
        'Custom wellness plans',
        'Priority support',
        'Early access to new features',
        'Ad-free experience'
      ],
      bestFor: 'Best value for long-term support',
      color: 'bg-gradient-to-r from-purple-800 to-purple-900',
      recommended: false
    },
  ];

  const handlePlanSelect = (plan) => {
    if (!isAuthenticated) {
      navigate('/auth?mode=signup');
      return;
    }

    setSelectedPlan(plan);
    
    if (plan.id === 'free_trial') {
      if (hasStartedTrial()) {
        alert('You have already used your free trial. Please select a paid plan.');
        return;
      }
      handleStartFreeTrial();
    } else {
      setShowCheckout(true);
    }
  };

  const handleStartFreeTrial = async () => {
    try {
      await startFreeTrial();
      navigate('/dashboard');
    } catch (error) {
      console.error('Error starting free trial:', error);
      alert('Unable to start free trial. Please try again.');
    }
  };

  const handleCheckoutSuccess = () => {
    setShowCheckout(false);
    setSelectedPlan(null);
    navigate('/dashboard');
  };

  const handleCheckoutCancel = () => {
    setShowCheckout(false);
    setSelectedPlan(null);
  };

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Please sign in to view subscription options
            </h1>
            <button
              onClick={() => navigate('/auth?mode=signin')}
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-lg"
            >
              Sign In
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  if (showCheckout && selectedPlan) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="container mx-auto px-4">
            <CheckoutForm
              selectedPlan={selectedPlan.id}
              onSuccess={handleCheckoutSuccess}
              onCancel={handleCheckoutCancel}
            />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Choose Your Perfect Plan</h1>
            <p className="text-xl text-purple-200">
              Find the right level of support for your menopause journey
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          {/* Current Subscription Status */}
          {isPremium && (
            <div className="mb-12">
              <SubscriptionManager />
            </div>
          )}

          {/* Plan Selection */}
          <div className="mb-12">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {subscriptionPlans.map((plan, index) => (
                <div 
                  key={index} 
                  className={`rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ${
                    selectedPlan?.id === plan.id ? 'ring-4 ring-purple-300 transform scale-105' : ''
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
                      onClick={() => handlePlanSelect(plan)}
                      className={`w-full mt-6 py-3 rounded-lg font-bold transition-all shadow-md ${
                        selectedPlan?.id === plan.id
                          ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white' 
                          : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                      }`}
                      disabled={plan.id === 'free_trial' && hasStartedTrial()}
                    >
                      {plan.id === 'free_trial' && hasStartedTrial() 
                        ? 'Trial Used' 
                        : selectedPlan?.id === plan.id 
                          ? 'Selected' 
                          : 'Select Plan'
                      }
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="font-semibold text-lg mb-2">Can I cancel my subscription anytime?</h3>
                <p className="text-gray-600">
                  Yes, you can cancel your subscription at any time. If you cancel during your free trial, 
                  you won't be charged. If you cancel a paid subscription, you'll continue to have access 
                  until the end of your billing period.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="font-semibold text-lg mb-2">What happens after my free trial ends?</h3>
                <p className="text-gray-600">
                  Your free trial lasts 7 days with full access to all premium features. After the trial, 
                  you'll need to choose a paid plan to continue using premium features. Your data and 
                  progress will be saved.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="font-semibold text-lg mb-2">Is my payment information secure?</h3>
                <p className="text-gray-600">
                  Absolutely. We use Stripe for payment processing, which is trusted by millions of 
                  businesses worldwide. Your payment information is encrypted and never stored on our servers.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="font-semibold text-lg mb-2">Can I change my plan later?</h3>
                <p className="text-gray-600">
                  Yes, you can upgrade or downgrade your plan at any time from your account settings. 
                  Changes will be prorated and reflected in your next billing cycle.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SubscriptionPage;