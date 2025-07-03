import { useState, useCallback } from 'react';
import EmailService from '../services/EmailService';

export const useEmailService = () => {
  const [sending, setSending] = useState(false);
  const [lastResult, setLastResult] = useState(null);

  const sendEmail = useCallback(async (type, userEmail, data = {}) => {
    setSending(true);
    setLastResult(null);

    try {
      let result;
      
      switch (type) {
        case 'email-verification':
          result = await EmailService.sendEmailVerification(
            userEmail, 
            data.userName, 
            data.verificationToken
          );
          break;
          
        case 'welcome':
          result = await EmailService.sendWelcomeEmail(
            userEmail, 
            data.userName
          );
          break;
          
        case 'password-reset':
          result = await EmailService.sendPasswordReset(
            userEmail, 
            data.userName, 
            data.resetToken
          );
          break;
          
        case 'password-changed':
          result = await EmailService.sendPasswordChanged(
            userEmail, 
            data.userName
          );
          break;
          
        case 'trial-started':
          result = await EmailService.sendTrialStarted(
            userEmail, 
            data.userName, 
            data.trialEndDate
          );
          break;
          
        case 'trial-ending':
          result = await EmailService.sendTrialEnding(
            userEmail, 
            data.userName, 
            data.daysLeft
          );
          break;
          
        case 'payment-successful':
          result = await EmailService.sendPaymentSuccessful(
            userEmail, 
            data.userName, 
            data.planName, 
            data.amount, 
            data.nextBillingDate
          );
          break;
          
        case 'payment-failed':
          result = await EmailService.sendPaymentFailed(
            userEmail, 
            data.userName, 
            data.planName, 
            data.amount
          );
          break;
          
        case 'onboarding-complete':
          result = await EmailService.sendOnboardingComplete(
            userEmail, 
            data.userName
          );
          break;
          
        case 'weekly-health-summary':
          result = await EmailService.sendWeeklyHealthSummary(
            userEmail, 
            data.userName, 
            data.summaryData
          );
          break;
          
        case 'new-meal-plan':
          result = await EmailService.sendNewMealPlan(
            userEmail, 
            data.userName, 
            data.mealPlanName
          );
          break;
          
        default:
          throw new Error(`Unknown email type: ${type}`);
      }
      
      setLastResult(result);
      return result;
      
    } catch (error) {
      const errorResult = { success: false, error: error.message };
      setLastResult(errorResult);
      return errorResult;
    } finally {
      setSending(false);
    }
  }, []);

  const clearResult = useCallback(() => {
    setLastResult(null);
  }, []);

  return {
    sendEmail,
    sending,
    lastResult,
    clearResult,
    isConfigured: EmailService.isConfigured
  };
};

export default useEmailService;