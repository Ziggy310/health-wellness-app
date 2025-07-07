import { baseTemplate } from './base-template.js';

export const template = (data) => {
  const { userName, trialEndDate, dashboardUrl, supportEmail } = data;
  
  const formattedDate = new Date(trialEndDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const content = `
    <h2 style="color: #1f2937; margin-bottom: 20px;">Your 7-day free trial has started! 🎉</h2>
    
    <p style="margin-bottom: 20px;">
        Welcome to Meno+! You now have full access to all our premium features until <strong>${formattedDate}</strong>. 
        This is your opportunity to explore how personalized menopause support can transform your wellness journey.
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
        <a href="${dashboardUrl}" class="button">Explore Your Dashboard</a>
    </div>
    
    <h3 style="color: #8b5cf6; margin: 30px 0 15px 0;">What's included in your trial:</h3>
    
    <div class="stats-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin: 20px 0;">
        <div class="stat-card" style="background: #f8fafc; padding: 15px; border-radius: 8px; text-align: center; border: 1px solid #e2e8f0;">
            <div class="stat-number" style="font-size: 24px; font-weight: bold; color: #8b5cf6;">∞</div>
            <div class="stat-label" style="font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Meal Plans</div>
        </div>
        
        <div class="stat-card" style="background: #f8fafc; padding: 15px; border-radius: 8px; text-align: center; border: 1px solid #e2e8f0;">
            <div class="stat-number" style="font-size: 24px; font-weight: bold; color: #8b5cf6;">24/7</div>
            <div class="stat-label" style="font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Symptom Tracking</div>
        </div>
        
        <div class="stat-card" style="background: #f8fafc; padding: 15px; border-radius: 8px; text-align: center; border: 1px solid #e2e8f0;">
            <div class="stat-number" style="font-size: 24px; font-weight: bold; color: #8b5cf6;">AI</div>
            <div class="stat-label" style="font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Insights</div>
        </div>
    </div>
    
    <div class="health-tip">
        <h3 style="color: #8b5cf6; margin-bottom: 10px;">🚀 Get the most from your trial</h3>
        <ul style="margin: 10px 0 0 20px;">
            <li>Complete your health profile for personalized recommendations</li>
            <li>Try logging symptoms for 3-4 days to see pattern insights</li>
            <li>Generate your first custom meal plan</li>
            <li>Explore the mood tracking and wellness tips</li>
        </ul>
    </div>
    
    <h3 style="color: #8b5cf6; margin: 30px 0 15px 0;">Questions about your trial?</h3>
    
    <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0;">
            <strong>No commitment:</strong> Your trial is completely free with no credit card required. 
            You'll receive a gentle reminder before it expires, and you can choose to continue or cancel at any time.
        </p>
    </div>
    
    <p style="margin: 20px 0 0 0;">
        We're excited to support you on this journey towards better menopause health. 
        Take your time exploring all the features - you've got 7 full days!
    </p>
  `;
  
  return baseTemplate(content, { userName, supportEmail });
};