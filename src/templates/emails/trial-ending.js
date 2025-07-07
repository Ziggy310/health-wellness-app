import { baseTemplate } from './base-template.js';

export const template = (data) => {
  const { userName, daysLeft, upgradeUrl, supportEmail } = data;
  
  const content = `
    <h2 style="color: #1f2937; margin-bottom: 20px;">Your free trial ends in ${daysLeft} days</h2>
    
    <p style="margin-bottom: 20px;">
        We hope you've been enjoying your Meno+ experience! Your 7-day free trial will end soon, 
        and we wanted to give you a gentle reminder so you don't miss out on continued access to your personalized menopause support.
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
        <a href="${upgradeUrl}" class="button">Continue with Meno+ Premium</a>
    </div>
    
    <h3 style="color: #8b5cf6; margin: 30px 0 15px 0;">Don't lose access to:</h3>
    
    <div style="margin: 20px 0;">
        <div style="display: flex; align-items: flex-start; margin-bottom: 15px;">
            <div style="background: #fef3c7; color: #d97706; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px; flex-shrink: 0;">🍽️</div>
            <div>
                <strong>Your personalized meal plans</strong> - Tailored nutrition support for your menopause journey
            </div>
        </div>
        
        <div style="display: flex; align-items: flex-start; margin-bottom: 15px;">
            <div style="background: #fef3c7; color: #d97706; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px; flex-shrink: 0;">📊</div>
            <div>
                <strong>Your symptom tracking history</strong> - Valuable insights into your health patterns
            </div>
        </div>
        
        <div style="display: flex; align-items: flex-start; margin-bottom: 15px;">
            <div style="background: #fef3c7; color: #d97706; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px; flex-shrink: 0;">🎯</div>
            <div>
                <strong>Goal tracking and progress insights</strong> - Stay motivated and see your improvements
            </div>
        </div>
        
        <div style="display: flex; align-items: flex-start;">
            <div style="background: #fef3c7; color: #d97706; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px; flex-shrink: 0;">💡</div>
            <div>
                <strong>AI-powered wellness recommendations</strong> - Personalized advice based on your unique profile
            </div>
        </div>
    </div>
    
    <div class="health-tip">
        <h3 style="color: #8b5cf6; margin-bottom: 10px;">🌟 Special offer for you</h3>
        <p style="margin: 0;">
            As a valued trial member, you're eligible for our launch pricing - save 50% on your first 3 months when you subscribe before your trial ends. 
            This offer is exclusive to our early supporters!
        </p>
    </div>
    
    <h3 style="color: #8b5cf6; margin: 30px 0 15px 0;">What happens if I don't upgrade?</h3>
    
    <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0;">
            No worries! Your account will remain active with limited features. You'll keep access to basic symptom logging, 
            but premium features like personalized meal plans, advanced insights, and unlimited tracking will be paused. 
            You can upgrade anytime to regain full access.
        </p>
    </div>
    
    <p style="margin: 20px 0 0 0;">
        Questions about continuing your subscription? Our support team is here to help you choose the best plan for your needs.
    </p>
  `;
  
  return baseTemplate(content, { userName, supportEmail });
};