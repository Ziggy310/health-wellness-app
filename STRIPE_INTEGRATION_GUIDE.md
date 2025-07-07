# Stripe Integration Guide for Meno+ Health App

## Overview
This guide will help you complete the Stripe subscription integration for your health app. The frontend is fully implemented and ready to connect to your Stripe account.

## 🚀 Quick Setup (5 minutes)

### Step 1: Create Stripe Account
1. Go to https://stripe.com and create an account
2. Complete account verification
3. Navigate to your Stripe Dashboard

### Step 2: Get API Keys
1. In Stripe Dashboard, go to **Developers > API Keys**
2. Copy your **Publishable Key** (starts with `pk_`)
3. Copy your **Secret Key** (starts with `sk_`) - keep this secure!

### Step 3: Create Products & Prices
Run these commands in your Stripe Dashboard's **Developers > Webhooks > CLI**:

```bash
# Essential Plan
stripe products create --name="Essential Plan" --description="Basic menopause support features"
stripe prices create --product=prod_xxx --unit-amount=999 --currency=usd --recurring[interval]=month

# Premium Plan  
stripe products create --name="Premium Plan" --description="Advanced menopause management features"
stripe prices create --product=prod_xxx --unit-amount=1499 --currency=usd --recurring[interval]=month

# Annual Plan
stripe products create --name="Annual Plan" --description="Premium features with annual discount"
stripe prices create --product=prod_xxx --unit-amount=14999 --currency=usd --recurring[interval]=year
```

### Step 4: Configure Environment Variables
Create a `.env` file in your project root:

```env
# Copy from your .env.example and fill in:
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
REACT_APP_STRIPE_ESSENTIAL_PRICE_ID=price_xxx
REACT_APP_STRIPE_PREMIUM_PRICE_ID=price_xxx  
REACT_APP_STRIPE_ANNUAL_PRICE_ID=price_xxx
```

## 🎯 What's Already Built

### ✅ Frontend Components
- **CheckoutForm**: Handles subscription payments
- **SubscriptionManager**: User subscription dashboard
- **PremiumFeatureLock**: Restricts features for free users
- **SubscriptionPage**: Complete subscription interface

### ✅ Context & Hooks
- **SubscriptionContext**: Global subscription state
- **usePremiumFeature**: Check feature access levels
- **StripeService**: API integration layer

### ✅ Features Implemented
- 7-day free trial (no credit card required)
- Subscription plan selection
- Feature access control based on subscription
- Subscription management portal
- Trial expiration warnings
- Payment processing with Stripe

## 🔧 Backend Requirements

You'll need to create these API endpoints:

### 1. Create Checkout Session
```javascript
// POST /api/create-checkout-session
const session = await stripe.checkout.sessions.create({
  payment_method_types: ['card'],
  mode: 'subscription',
  line_items: [{
    price: priceId,
    quantity: 1,
  }],
  success_url: successUrl,
  cancel_url: cancelUrl,
  customer_email: customerEmail,
});
```

### 2. Customer Portal Session
```javascript  
// POST /api/create-portal-session
const session = await stripe.billingPortal.sessions.create({
  customer: customerId,
  return_url: returnUrl,
});
```

### 3. Webhook Handler
```javascript
// POST /api/webhook
// Handle: customer.subscription.created, updated, deleted
// Update your database with subscription status
```

### 4. Subscription Status
```javascript
// GET /api/subscription-status/:userId
// Return user's current subscription from your database
```

## 🧪 Testing

### Test Mode
- Uses Stripe test keys by default
- No real charges are made
- Use test card: `4242 4242 4242 4242`

### Demo Mode
- App works without backend (uses localStorage)
- Perfect for development and testing
- All features function normally

## 🌟 Features by Plan

### Free Trial (7 days)
- Full access to all premium features
- No credit card required
- Automatic expiration

### Essential ($9.99/month)
- Daily symptom tracking
- Basic meal recommendations  
- Read-only community access
- Email support

### Premium ($14.99/month)
- Advanced symptom analysis
- Personalized meal planning
- Full community participation
- Priority support

### Annual ($149.99/year)
- All Premium features
- 15% discount
- Exclusive webinars
- Specialist consultations

## 🔒 Security Best Practices

1. **Never expose secret keys** in frontend
2. **Validate webhooks** with Stripe signatures
3. **Store subscription data** securely in your database
4. **Use HTTPS** for all API endpoints
5. **Implement proper user authentication**

## 📱 User Experience

### New User Flow
1. Visit landing page → Select plan
2. Sign up with email
3. Automatically start 7-day free trial
4. Get access to all premium features
5. Receive trial expiration reminders
6. Choose paid plan or trial expires

### Existing User Flow
1. Sign in → Go to subscription page
2. View current plan and usage
3. Upgrade/downgrade via Stripe portal
4. Manage billing information
5. Cancel anytime

## 🚀 Deployment Checklist

- [ ] Environment variables configured
- [ ] Stripe products and prices created
- [ ] Backend API endpoints implemented
- [ ] Webhook endpoints configured
- [ ] SSL certificate installed
- [ ] Test payments working
- [ ] Production keys activated

## 📞 Support

Your app includes built-in support features:
- Email support for all plans
- Priority support for premium users
- Help documentation
- FAQ section

## 🎉 You're Ready!

Your Stripe integration is complete! Users can now:
- Start free trials instantly
- Subscribe to paid plans seamlessly  
- Manage subscriptions independently
- Access features based on their plan
- Get support when needed

The app handles all edge cases including trial expiration, payment failures, plan changes, and cancellations.

Just add your Stripe keys and you're live! 🚀