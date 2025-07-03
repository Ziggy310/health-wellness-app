import { baseTemplate } from './base-template.js';

export const template = (data) => {
  const { userName, planName, amount, nextBillingDate, accountUrl, supportEmail } = data;
  
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
  
  const formattedDate = new Date(nextBillingDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const content = `
    <h2 style="color: #1f2937; margin-bottom: 20px;">Payment successful - Thank you! 💜</h2>
    
    <p style="margin-bottom: 20px;">
        Your payment has been processed successfully. Thank you for choosing Meno+ to support your menopause wellness journey!
    </p>
    
    <div style="background: #dcfce7; border-left: 4px solid #16a34a; padding: 20px; margin: 20px 0; border-radius: 0 8px 8px 0;">
        <h3 style="color: #15803d; margin-bottom: 15px;">✅ Payment Confirmed</h3>
        <div style="color: #166534;">
            <p style="margin: 5px 0;"><strong>Plan:</strong> ${planName}</p>
            <p style="margin: 5px 0;"><strong>Amount:</strong> ${formattedAmount}</p>
            <p style="margin: 5px 0;"><strong>Next billing date:</strong> ${formattedDate}</p>
        </div>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
        <a href="${accountUrl}" class="button">View Account Details</a>
    </div>
    
    <h3 style="color: #8b5cf6; margin: 30px 0 15px 0;">Your premium features are active:</h3>
    
    <div class="stats-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin: 20px 0;">
        <div class="stat-card" style="background: #f8fafc; padding: 15px; border-radius: 8px; text-align: center; border: 1px solid #e2e8f0;">
            <div class="stat-number" style="font-size: 24px; font-weight: bold; color: #8b5cf6;">∞</div>
            <div class="stat-label" style="font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Meal Plans</div>
        </div>
        
        <div class="stat-card" style="background: #f8fafc; padding: 15px; border-radius: 8px; text-align: center; border: 1px solid #e2e8f0;">
            <div class="stat-number" style="font-size: 24px; font-weight: bold; color: #8b5cf6;">24/7</div>
            <div class="stat-label" style="font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Support</div>
        </div>
        
        <div class="stat-card" style="background: #f8fafc; padding: 15px; border-radius: 8px; text-alignment: center; border: 1px solid #e2e8f0;">
            <div class="stat-number" style="font-size: 24px; font-weight: bold; color: #8b5cf6;">AI</div>
            <div class="stat-label" style="font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Insights</div>
        </div>
    </div>
    
    <div class="health-tip">
        <h3 style="color: #8b5cf6; margin-bottom: 10px;">🎯 Make the most of your subscription</h3>
        <ul style="margin: 10px 0 0 20px;">
            <li>Log symptoms daily for the most accurate pattern insights</li>
            <li>Try new meal plans weekly to expand your healthy eating options</li>
            <li>Set up goal reminders to stay motivated</li>
            <li>Explore the wellness tips section for evidence-based advice</li>
        </ul>
    </div>
    
    <h3 style="color: #8b5cf6; margin: 30px 0 15px 0;">Billing information:</h3>
    
    <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0 0 10px 0; font-size: 14px;">
            <strong>Automatic renewal:</strong> Your subscription will automatically renew on ${formattedDate}. 
            You can cancel or modify your subscription anytime in your account settings.
        </p>
        <p style="margin: 0; font-size: 14px;">
            <strong>Receipt:</strong> This email serves as your receipt. Keep it for your records.
        </p>
    </div>
    
    <p style="margin: 20px 0 0 0;">
        We're honored to be part of your menopause wellness journey. Thank you for trusting Meno+ with your health!
    </p>
  `;
  
  return baseTemplate(content, { userName, supportEmail });
};