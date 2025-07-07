import React, { useState } from 'react';
import { Send, Mail, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useEmailService } from '../../hooks/useEmailService';

const EmailTester = () => {
  const { sendEmail, sending, lastResult, clearResult, isConfigured } = useEmailService();
  const [testEmail, setTestEmail] = useState('');
  const [selectedEmailType, setSelectedEmailType] = useState('welcome');
  const [testUserName, setTestUserName] = useState('Test User');

  const emailTypes = [
    { value: 'email-verification', label: 'Email Verification', category: 'Authentication' },
    { value: 'welcome', label: 'Welcome Email', category: 'Authentication' },
    { value: 'password-reset', label: 'Password Reset', category: 'Authentication' },
    { value: 'password-changed', label: 'Password Changed', category: 'Authentication' },
    { value: 'trial-started', label: 'Trial Started', category: 'Subscription' },
    { value: 'trial-ending', label: 'Trial Ending', category: 'Subscription' },
    { value: 'payment-successful', label: 'Payment Successful', category: 'Subscription' },
    { value: 'payment-failed', label: 'Payment Failed', category: 'Subscription' },
    { value: 'onboarding-complete', label: 'Onboarding Complete', category: 'Health & Wellness' },
    { value: 'weekly-health-summary', label: 'Weekly Health Summary', category: 'Health & Wellness' },
    { value: 'new-meal-plan', label: 'New Meal Plan', category: 'Health & Wellness' },
  ];

  const getTestData = (emailType) => {
    const baseData = { userName: testUserName };
    
    switch (emailType) {
      case 'email-verification':
        return { ...baseData, verificationToken: 'test-token-123' };
      case 'password-reset':
        return { ...baseData, resetToken: 'reset-token-456' };
      case 'trial-started':
        return { ...baseData, trialEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) };
      case 'trial-ending':
        return { ...baseData, daysLeft: 2 };
      case 'payment-successful':
        return { 
          ...baseData, 
          planName: 'Meno+ Premium', 
          amount: 29.99, 
          nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) 
        };
      case 'payment-failed':
        return { ...baseData, planName: 'Meno+ Premium', amount: 29.99 };
      case 'weekly-health-summary':
        return {
          ...baseData,
          summaryData: {
            weekRange: 'this week',
            totalSymptomLogs: 5,
            topSymptoms: [
              { name: 'Hot Flashes', severity: 3 },
              { name: 'Sleep Issues', severity: 4 }
            ],
            moodAverage: 3.5,
            sleepAverage: 6.5,
            energyTrend: 'improving',
            mealsFollowed: 5,
            totalMeals: 7,
            achievements: ['Logged symptoms 5 days in a row', 'Tried 2 new recipes']
          }
        };
      case 'new-meal-plan':
        return { ...baseData, mealPlanName: 'Anti-Inflammatory Mediterranean Week' };
      default:
        return baseData;
    }
  };

  const handleSendTest = async (e) => {
    e.preventDefault();
    if (!testEmail || !selectedEmailType) return;
    
    clearResult();
    const testData = getTestData(selectedEmailType);
    await sendEmail(selectedEmailType, testEmail, testData);
  };

  const categories = [...new Set(emailTypes.map(type => type.category))];

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Send className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Email Tester</h2>
          <p className="text-gray-600">Send test emails to verify templates and functionality</p>
        </div>
      </div>

      {!isConfigured && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <span className="text-yellow-800 font-medium">Email service not configured</span>
          </div>
          <p className="text-yellow-700 text-sm mt-1">
            Add SMTP credentials to your environment variables to enable email sending.
          </p>
        </div>
      )}

      <form onSubmit={handleSendTest} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Test Email Address
          </label>
          <input
            type="email"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            placeholder="your-email@example.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Test User Name
          </label>
          <input
            type="text"
            value={testUserName}
            onChange={(e) => setTestUserName(e.target.value)}
            placeholder="Test User"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Template
          </label>
          <select
            value={selectedEmailType}
            onChange={(e) => setSelectedEmailType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            {categories.map(category => (
              <optgroup key={category} label={category}>
                {emailTypes
                  .filter(type => type.category === category)
                  .map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))
                }
              </optgroup>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={sending || !isConfigured}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          <Mail className="w-4 h-4" />
          <span>{sending ? 'Sending...' : 'Send Test Email'}</span>
        </button>
      </form>

      {lastResult && (
        <div className={`mt-4 p-4 rounded-lg ${
          lastResult.success 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-center space-x-2">
            {lastResult.success ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600" />
            )}
            <span className={`font-medium ${
              lastResult.success ? 'text-green-800' : 'text-red-800'
            }`}>
              {lastResult.success ? 'Email sent successfully!' : 'Email failed to send'}
            </span>
          </div>
          {lastResult.messageId && (
            <p className="text-green-700 text-sm mt-1">
              Message ID: {lastResult.messageId}
            </p>
          )}
          {lastResult.error && (
            <p className="text-red-700 text-sm mt-1">
              Error: {lastResult.error}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default EmailTester;