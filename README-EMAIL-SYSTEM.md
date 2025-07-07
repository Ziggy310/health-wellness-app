# Meno+ Email System Documentation

## Overview

This comprehensive email system provides professional, branded email templates and automated workflows for the Meno+ menopause wellness application. The system includes 11+ email templates, a service layer for sending emails, preview functionality, and testing tools.

## 📧 Email Templates

### Authentication & Verification Emails
- **Email Verification** - Sent after user registration with verification link
- **Welcome Email** - Beautiful welcome after email confirmation  
- **Password Reset** - Secure password reset link delivery
- **Password Changed** - Security confirmation notifications

### Subscription & Billing Emails  
- **Trial Started** - "Welcome to your 7-day free trial!"
- **Trial Ending** - Gentle reminder 2 days before expiration
- **Payment Successful** - Subscription confirmation emails
- **Payment Failed** - Billing issue notifications

### Health & Wellness Emails
- **Onboarding Complete** - Congratulations on setup completion
- **Weekly Health Summary** - Personalized symptom tracking insights  
- **New Meal Plan** - "Your personalized meal plan is ready!"

## 🛠️ Technical Implementation

### Core Files Structure
```
src/
├── services/
│   └── EmailService.js           # Main email service with SMTP configuration
├── templates/emails/
│   ├── base-template.js          # Shared template with Meno+ branding
│   ├── email-verification.js     # Email verification template
│   ├── welcome.js                # Welcome email template
│   ├── password-reset.js         # Password reset template
│   ├── password-changed.js       # Password changed confirmation
│   ├── trial-started.js          # Trial started notification
│   ├── trial-ending.js           # Trial ending reminder
│   ├── payment-successful.js     # Payment success confirmation
│   ├── payment-failed.js         # Payment failure notification
│   ├── onboarding-complete.js    # Onboarding completion
│   ├── weekly-health-summary.js  # Weekly health insights
│   └── new-meal-plan.js          # New meal plan notification
├── components/email/
│   ├── EmailPreview.jsx          # Preview all email templates
│   └── EmailTester.jsx           # Send test emails
└── hooks/
    └── useEmailService.js        # React hook for email functionality
```

## ⚙️ Configuration

### Environment Variables
Add these to your `.env` file:

```env
# Email Service Configuration
VITE_SMTP_HOST=smtp.gmail.com
VITE_SMTP_PORT=587
VITE_SMTP_USER=your-email@gmail.com
VITE_SMTP_PASS=your-app-password

# Application URLs
VITE_APP_URL=http://localhost:3000
VITE_SUPPORT_EMAIL=support@menoplus.com
VITE_FROM_EMAIL=noreply@menoplus.com
```

### SMTP Setup
For Gmail:
1. Enable 2-factor authentication
2. Generate an App Password
3. Use the App Password as `VITE_SMTP_PASS`

## 📧 Usage Examples

### Basic Email Sending
```javascript
import EmailService from './services/EmailService';

// Send welcome email
await EmailService.sendWelcomeEmail(
  'user@example.com',
  'Sarah Johnson'
);

// Send email verification
await EmailService.sendEmailVerification(
  'user@example.com',
  'Sarah Johnson', 
  'verification-token-123'
);
```

### Using the React Hook
```javascript
import { useEmailService } from './hooks/useEmailService';

function MyComponent() {
  const { sendEmail, sending, lastResult } = useEmailService();
  
  const handleSendWelcome = async () => {
    const result = await sendEmail('welcome', 'user@example.com', {
      userName: 'Sarah Johnson'
    });
    
    if (result.success) {
      console.log('Email sent successfully!');
    }
  };
}
```

### Integration with Authentication
```javascript
// In your sign-up flow
const handleSignUp = async (userData) => {
  // Create user account
  const user = await createUser(userData);
  
  // Send verification email
  await EmailService.sendEmailVerification(
    user.email,
    user.name,
    user.verificationToken
  );
};

// After email verification
const handleEmailVerified = async (user) => {
  // Send welcome email
  await EmailService.sendWelcomeEmail(user.email, user.name);
  
  // Send trial started email
  await EmailService.sendTrialStarted(
    user.email, 
    user.name, 
    user.trialEndDate
  );
};
```

### Integration with Subscription System
```javascript
// After successful payment
const handlePaymentSuccess = async (user, subscription) => {
  await EmailService.sendPaymentSuccessful(
    user.email,
    user.name,
    subscription.planName,
    subscription.amount,
    subscription.nextBillingDate
  );
};

// When payment fails
const handlePaymentFailed = async (user, subscription) => {
  await EmailService.sendPaymentFailed(
    user.email,
    user.name,
    subscription.planName,
    subscription.amount
  );
};
```

## 🎨 Template Customization

### Modifying Base Template
The `base-template.js` contains the shared branding and layout. Customize:
- Colors and gradients
- Logo and tagline
- Footer links
- Typography

### Creating New Templates
1. Create a new file in `src/templates/emails/`
2. Import and use the base template
3. Add the template to `EmailService.js`
4. Update the preview component

Example:
```javascript
import { baseTemplate } from './base-template.js';

export const template = (data) => {
  const { userName, customData } = data;
  
  const content = `
    <h2>Your Custom Email</h2>
    <p>Hello ${userName}!</p>
    <!-- Your email content -->
  `;
  
  return baseTemplate(content, { userName });
};
```

## 🔍 Testing & Preview

### Email Preview Component
Access the preview at `/email-preview` to:
- View all email templates
- Test desktop/mobile layouts
- Copy HTML source code
- Download templates

### Email Tester Component
Use the email tester to:
- Send test emails to any address
- Test different email types
- Verify SMTP configuration
- Debug email delivery

## 📊 Automation & Scheduling

### Recommended Automation Points

1. **User Registration Flow**
   ```javascript
   // After user signs up
   sendEmailVerification() → sendWelcomeEmail() → sendTrialStarted()
   ```

2. **Subscription Management**
   ```javascript
   // Trial ending (automated job)
   if (trialEndsIn2Days) sendTrialEnding()
   
   // Payment processing
   paymentSuccess() → sendPaymentSuccessful()
   paymentFails() → sendPaymentFailed()
   ```

3. **Health Engagement**
   ```javascript
   // Weekly automation (cron job)
   generateWeeklyHealthSummary() → sendWeeklyHealthSummary()
   
   // Meal plan generation
   createNewMealPlan() → sendNewMealPlan()
   ```

## 🔒 Security & Compliance

### Email Security
- All emails include unsubscribe links
- SMTP credentials are environment-based
- No sensitive data stored in email content
- Links include secure tokens with expiration

### Privacy Compliance
- GDPR-compliant unsubscribe handling
- Clear data usage explanation
- Privacy policy links in all emails
- User preference management

## 🚀 Deployment Considerations

### Production Setup
1. Configure production SMTP service (SendGrid, AWS SES, etc.)
2. Set up proper DNS records (SPF, DKIM, DMARC)
3. Monitor email delivery rates
4. Set up email analytics tracking

### Performance Optimization
- Use email queuing for bulk sends
- Implement retry logic for failed sends
- Cache email templates
- Monitor SMTP connection limits

## 📈 Analytics & Monitoring

### Recommended Tracking
- Email delivery rates
- Open rates (with pixel tracking)
- Click-through rates on email links
- Unsubscribe rates
- Email bounce rates

### Error Handling
- Log all email sending attempts
- Alert on high failure rates
- Implement fallback SMTP providers
- Monitor template rendering errors

## 🔧 Troubleshooting

### Common Issues

**Emails not sending:**
- Check SMTP credentials
- Verify firewall/network settings
- Test with email tester component
- Check email service logs

**Templates not rendering:**
- Validate HTML structure
- Check for JavaScript errors
- Test with different email clients
- Verify template data format

**High bounce rates:**
- Validate email addresses before sending
- Check sender reputation
- Review email content for spam triggers
- Monitor blacklist status

---

## 🎯 Next Steps

1. **Configure SMTP credentials** in your environment
2. **Test email sending** using the EmailTester component
3. **Preview all templates** using the EmailPreview component
4. **Integrate email sending** into your authentication and subscription flows
5. **Set up automated email workflows** for user engagement

The email system is now ready for production use and provides a professional email experience for your Meno+ users!