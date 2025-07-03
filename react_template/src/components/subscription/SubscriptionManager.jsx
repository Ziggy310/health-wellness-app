import React, { useState } from 'react';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { createCustomerPortalSession, SUBSCRIPTION_PLANS } from '../../services/StripeService';
import { useAuth } from '../../hooks/useAuth';

const SubscriptionManager = () => {
  const { user } = useAuth();
  const { 
    subscriptionStatus, 
    loading, 
    isPremium, 
    isOnFreeTrial, 
    isTrialExpired,
    getTrialDaysRemaining,
    currentPlan,
    refreshSubscription 
  } = useSubscription();
  const [managingSubscription, setManagingSubscription] = useState(false);

  const handleManageSubscription = async () => {
    if (!subscriptionStatus?.customerId) {
      alert('No active subscription to manage');
      return;
    }

    try {
      setManagingSubscription(true);
      const session = await createCustomerPortalSession(subscriptionStatus.customerId);
      window.location.href = session.url;
    } catch (error) {
      console.error('Error opening customer portal:', error);
      alert('Unable to open subscription management. Please try again.');
    } finally {
      setManagingSubscription(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCurrentPlanDetails = () => {
    return SUBSCRIPTION_PLANS[currentPlan?.toUpperCase()] || null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        <span className="ml-2">Loading subscription details...</span>
      </div>
    );
  }

  const planDetails = getCurrentPlanDetails();
  const trialDaysRemaining = getTrialDaysRemaining();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Subscription Details</h2>
        <button
          onClick={refreshSubscription}
          className="text-purple-600 hover:text-purple-800 text-sm font-medium"
        >
          Refresh
        </button>
      </div>

      {/* Current Plan Status */}
      <div className="mb-6">
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {planDetails?.name || 'No Active Plan'}
            </h3>
            <p className="text-gray-600">
              {subscriptionStatus?.status === 'active' && `$${planDetails?.price}/${planDetails?.period}`}
              {isOnFreeTrial && `Free Trial - ${trialDaysRemaining} days remaining`}
              {isTrialExpired && 'Trial Expired'}
              {!subscriptionStatus && 'No subscription found'}
            </p>
          </div>
          <div className="text-right">
            <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
              isPremium 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-600'
            }`}>
              {isPremium ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </div>

      {/* Trial Warning */}
      {isOnFreeTrial && trialDaysRemaining <= 3 && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <h4 className="font-medium text-yellow-800">Trial Ending Soon</h4>
              <p className="text-yellow-700 text-sm">
                Your free trial ends in {trialDaysRemaining} {trialDaysRemaining === 1 ? 'day' : 'days'}. 
                Subscribe now to continue enjoying all features.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Trial Expired */}
      {isTrialExpired && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <h4 className="font-medium text-red-800">Trial Expired</h4>
              <p className="text-red-700 text-sm">
                Your free trial has ended. Subscribe to continue using premium features.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Subscription Details */}
      {subscriptionStatus && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Plan Details</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <p><strong>Plan:</strong> {planDetails?.name}</p>
              <p><strong>Status:</strong> {subscriptionStatus.status}</p>
              {subscriptionStatus.currentPeriodEnd && (
                <p><strong>Next Billing:</strong> {formatDate(subscriptionStatus.currentPeriodEnd)}</p>
              )}
              {isOnFreeTrial && subscriptionStatus.trialEnd && (
                <p><strong>Trial Ends:</strong> {formatDate(subscriptionStatus.trialEnd)}</p>
              )}
            </div>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Feature Access</h4>
            <div className="space-y-1 text-sm">
              <div className="flex items-center">
                <span className={`w-3 h-3 rounded-full mr-2 ${isPremium ? 'bg-green-400' : 'bg-gray-300'}`}></span>
                Advanced Symptom Tracking
              </div>
              <div className="flex items-center">
                <span className={`w-3 h-3 rounded-full mr-2 ${isPremium ? 'bg-green-400' : 'bg-gray-300'}`}></span>
                Personalized Meal Planning
              </div>
              <div className="flex items-center">
                <span className={`w-3 h-3 rounded-full mr-2 ${isPremium ? 'bg-green-400' : 'bg-gray-300'}`}></span>
                Full Community Access
              </div>
              <div className="flex items-center">
                <span className={`w-3 h-3 rounded-full mr-2 ${isPremium ? 'bg-green-400' : 'bg-gray-300'}`}></span>
                Priority Support
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        {!isPremium && (
          <button
            onClick={() => window.location.href = '/#subscription-plans'}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Upgrade to Premium
          </button>
        )}
        
        {subscriptionStatus?.customerId && (
          <button
            onClick={handleManageSubscription}
            disabled={managingSubscription}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
          >
            {managingSubscription ? 'Opening...' : 'Manage Subscription'}
          </button>
        )}
      </div>

      {/* Help Text */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          Need help? Contact our support team at{' '}
          <a href="mailto:support@menoplus.com" className="text-purple-600 hover:text-purple-800">
            support@menoplus.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default SubscriptionManager;