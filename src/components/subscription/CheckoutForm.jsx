import React, { useState } from 'react';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { getStripe, redirectToCheckout, SUBSCRIPTION_PLANS } from '../../services/StripeService';
import { useAuth } from '../../hooks/useAuth';
import { useSubscription } from '../../contexts/SubscriptionContext';

const CheckoutFormContent = ({ selectedPlan, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const { refreshSubscription } = useSubscription();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const plan = SUBSCRIPTION_PLANS[selectedPlan?.toUpperCase()];

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || !plan) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // For free trial, no payment required
      if (plan.id === 'free_trial') {
        await refreshSubscription();
        onSuccess?.();
        return;
      }

      // Redirect to Stripe Checkout for paid plans
      await redirectToCheckout(plan.id, user?.email);
      
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message || 'An error occurred during payment processing');
    } finally {
      setLoading(false);
    }
  };

  if (!plan) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Invalid subscription plan selected.</p>
        <button 
          onClick={onCancel}
          className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Subscribe to {plan.name}
        </h2>
        <div className="text-3xl font-bold text-purple-600">
          {plan.price === 0 ? 'FREE' : `$${plan.price}`}
          <span className="text-lg font-normal text-gray-600">/{plan.period}</span>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold mb-3">What's included:</h3>
        <ul className="space-y-2">
          {plan.features.slice(0, 4).map((feature, index) => (
            <li key={index} className="flex items-start">
              <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">{feature}</span>
            </li>
          ))}
          {plan.features.length > 4 && (
            <li className="text-sm text-gray-600 ml-7">
              + {plan.features.length - 4} more features
            </li>
          )}
        </ul>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {plan.id !== 'free_trial' && (
          <div className="p-4 border border-gray-300 rounded-md">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                },
              }}
            />
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="flex space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || (!stripe && plan.id !== 'free_trial')}
            className={`flex-1 py-2 px-4 rounded-md text-white font-medium transition-colors ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              plan.id === 'free_trial' ? 'Start Free Trial' : `Subscribe for $${plan.price}/${plan.period}`
            )}
          </button>
        </div>
      </form>

      {plan.id === 'free_trial' && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            ✅ No credit card required<br/>
            ✅ Full access for 7 days<br/>
            ✅ Cancel anytime
          </p>
        </div>
      )}

      {plan.id !== 'free_trial' && (
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Secure payment powered by Stripe. Cancel anytime from your account settings.
          </p>
        </div>
      )}
    </div>
  );
};

const CheckoutForm = ({ selectedPlan, onSuccess, onCancel }) => {
  return (
    <Elements stripe={getStripe()}>
      <CheckoutFormContent 
        selectedPlan={selectedPlan}
        onSuccess={onSuccess}
        onCancel={onCancel}
      />
    </Elements>
  );
};

export default CheckoutForm;