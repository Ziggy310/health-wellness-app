import React, { useState } from 'react';
import { Mail, Eye, Send, Download, Copy, Check } from 'lucide-react';

// Import all email templates
import { baseTemplate } from '../../templates/emails/base-template.js';
import { template as emailVerificationTemplate } from '../../templates/emails/email-verification.js';
import { template as welcomeTemplate } from '../../templates/emails/welcome.js';
import { template as passwordResetTemplate } from '../../templates/emails/password-reset.js';
import { template as passwordChangedTemplate } from '../../templates/emails/password-changed.js';
import { template as trialStartedTemplate } from '../../templates/emails/trial-started.js';
import { template as trialEndingTemplate } from '../../templates/emails/trial-ending.js';
import { template as paymentSuccessfulTemplate } from '../../templates/emails/payment-successful.js';
import { template as paymentFailedTemplate } from '../../templates/emails/payment-failed.js';
import { template as onboardingCompleteTemplate } from '../../templates/emails/onboarding-complete.js';
import { template as weeklyHealthSummaryTemplate } from '../../templates/emails/weekly-health-summary.js';
import { template as newMealPlanTemplate } from '../../templates/emails/new-meal-plan.js';

const EmailPreview = () => {
  const [selectedTemplate, setSelectedTemplate] = useState('email-verification');
  const [previewMode, setPreviewMode] = useState('desktop'); // desktop, mobile, html
  const [copySuccess, setCopySuccess] = useState(false);

  // Email template configurations with sample data
  const emailTemplates = {
    'email-verification': {
      name: 'Email Verification',
      category: 'Authentication',
      template: emailVerificationTemplate,
      sampleData: {
        userName: 'Sarah Johnson',
        verificationUrl: 'https://menoplus.com/verify-email?token=abc123xyz',
        supportEmail: 'support@menoplus.com'
      }
    },
    'welcome': {
      name: 'Welcome Email',
      category: 'Authentication',
      template: welcomeTemplate,
      sampleData: {
        userName: 'Sarah Johnson',
        dashboardUrl: 'https://menoplus.com/dashboard',
        supportEmail: 'support@menoplus.com'
      }
    },
    'password-reset': {
      name: 'Password Reset',
      category: 'Authentication',
      template: passwordResetTemplate,
      sampleData: {
        userName: 'Sarah Johnson',
        resetUrl: 'https://menoplus.com/reset-password?token=reset123',
        supportEmail: 'support@menoplus.com'
      }
    },
    'password-changed': {
      name: 'Password Changed',
      category: 'Authentication',
      template: passwordChangedTemplate,
      sampleData: {
        userName: 'Sarah Johnson',
        supportEmail: 'support@menoplus.com'
      }
    },
    'trial-started': {
      name: 'Trial Started',
      category: 'Subscription',
      template: trialStartedTemplate,
      sampleData: {
        userName: 'Sarah Johnson',
        trialEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        dashboardUrl: 'https://menoplus.com/dashboard',
        supportEmail: 'support@menoplus.com'
      }
    },
    'trial-ending': {
      name: 'Trial Ending',
      category: 'Subscription',
      template: trialEndingTemplate,
      sampleData: {
        userName: 'Sarah Johnson',
        daysLeft: 2,
        upgradeUrl: 'https://menoplus.com/subscription',
        supportEmail: 'support@menoplus.com'
      }
    },
    'payment-successful': {
      name: 'Payment Successful',
      category: 'Subscription',
      template: paymentSuccessfulTemplate,
      sampleData: {
        userName: 'Sarah Johnson',
        planName: 'Meno+ Premium',
        amount: 29.99,
        nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        accountUrl: 'https://menoplus.com/account',
        supportEmail: 'support@menoplus.com'
      }
    },
    'payment-failed': {
      name: 'Payment Failed',
      category: 'Subscription',
      template: paymentFailedTemplate,
      sampleData: {
        userName: 'Sarah Johnson',
        planName: 'Meno+ Premium',
        amount: 29.99,
        updatePaymentUrl: 'https://menoplus.com/account/billing',
        supportEmail: 'support@menoplus.com'
      }
    },
    'onboarding-complete': {
      name: 'Onboarding Complete',
      category: 'Health & Wellness',
      template: onboardingCompleteTemplate,
      sampleData: {
        userName: 'Sarah Johnson',
        dashboardUrl: 'https://menoplus.com/dashboard',
        supportEmail: 'support@menoplus.com'
      }
    },
    'weekly-health-summary': {
      name: 'Weekly Health Summary',
      category: 'Health & Wellness',
      template: weeklyHealthSummaryTemplate,
      sampleData: {
        userName: 'Sarah Johnson',
        summaryData: {
          weekRange: 'November 4-10, 2024',
          totalSymptomLogs: 6,
          topSymptoms: [
            { name: 'Hot Flashes', severity: 3 },
            { name: 'Sleep Issues', severity: 4 },
            { name: 'Mood Changes', severity: 2 }
          ],
          moodAverage: 3.5,
          sleepAverage: 6.5,
          energyTrend: 'improving',
          mealsFollowed: 5,
          totalMeals: 7,
          achievements: [
            'Logged symptoms 6 days in a row',
            'Tried 3 new healthy recipes',
            'Improved sleep quality by 15%'
          ]
        },
        dashboardUrl: 'https://menoplus.com/dashboard',
        supportEmail: 'support@menoplus.com'
      }
    },
    'new-meal-plan': {
      name: 'New Meal Plan',
      category: 'Health & Wellness',
      template: newMealPlanTemplate,
      sampleData: {
        userName: 'Sarah Johnson',
        mealPlanName: 'Anti-Inflammatory Mediterranean Week',
        mealPlanUrl: 'https://menoplus.com/meal-plans',
        supportEmail: 'support@menoplus.com'
      }
    }
  };

  const currentTemplate = emailTemplates[selectedTemplate];
  const emailHtml = currentTemplate.template(currentTemplate.sampleData);

  const handleCopyHtml = async () => {
    try {
      await navigator.clipboard.writeText(emailHtml);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy HTML:', err);
    }
  };

  const handleDownloadHtml = () => {
    const blob = new Blob([emailHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedTemplate}-email-template.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const categories = [...new Set(Object.values(emailTemplates).map(t => t.category))];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Mail className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Email Template Preview</h1>
                <p className="text-gray-600">Preview and test all Meno+ email templates</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopyHtml}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                {copySuccess ? (
                  <>
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-green-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy HTML</span>
                  </>
                )}
              </button>
              
              <button
                onClick={handleDownloadHtml}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Template Selector */}
          <div className="col-span-3">
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Email Templates</h3>
              
              {categories.map(category => (
                <div key={category} className="mb-4">
                  <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                    {category}
                  </h4>
                  
                  {Object.entries(emailTemplates)
                    .filter(([_, template]) => template.category === category)
                    .map(([key, template]) => (
                      <button
                        key={key}
                        onClick={() => setSelectedTemplate(key)}
                        className={`w-full text-left px-3 py-2 rounded-lg mb-1 transition-colors ${
                          selectedTemplate === key
                            ? 'bg-purple-100 text-purple-800 border-l-4 border-purple-600'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {template.name}
                      </button>
                    ))
                  }
                </div>
              ))}
            </div>
          </div>

          {/* Preview Controls and Content */}
          <div className="col-span-9">
            {/* Preview Controls */}
            <div className="bg-white rounded-lg shadow-sm border p-4 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <h3 className="font-semibold text-gray-900">
                    {currentTemplate.name}
                  </h3>
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                    {currentTemplate.category}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setPreviewMode('desktop')}
                    className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                      previewMode === 'desktop'
                        ? 'bg-purple-100 text-purple-800'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Desktop
                  </button>
                  <button
                    onClick={() => setPreviewMode('mobile')}
                    className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                      previewMode === 'mobile'
                        ? 'bg-purple-100 text-purple-800'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Mobile
                  </button>
                  <button
                    onClick={() => setPreviewMode('html')}
                    className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                      previewMode === 'html'
                        ? 'bg-purple-100 text-purple-800'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    HTML
                  </button>
                </div>
              </div>
            </div>

            {/* Email Preview */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              {previewMode === 'html' ? (
                <div className="p-4">
                  <pre className="bg-gray-50 p-4 rounded-lg overflow-auto text-sm">
                    <code>{emailHtml}</code>
                  </pre>
                </div>
              ) : (
                <div className={`${previewMode === 'mobile' ? 'max-w-sm mx-auto' : ''}`}>
                  <iframe
                    srcDoc={emailHtml}
                    className={`w-full border-0 ${
                      previewMode === 'mobile' ? 'h-screen' : 'h-screen'
                    }`}
                    title={`${currentTemplate.name} Preview`}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailPreview;