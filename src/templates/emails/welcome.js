import { baseTemplate } from './base-template.js';

export const template = (data) => {
  const { userName, dashboardUrl, supportEmail } = data;
  
  const content = `
    <h2 style="color: #1f2937; margin-bottom: 20px;">Welcome to your wellness journey! 🌸</h2>
    
    <p style="margin-bottom: 20px;">
        Congratulations on taking this important step towards better menopause health management. 
        Your email has been verified and your Meno+ account is now active!
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
        <a href="${dashboardUrl}" class="button">Get Started with Your Dashboard</a>
    </div>
    
    <h3 style="color: #8b5cf6; margin: 30px 0 15px 0;">What's next?</h3>
    
    <div style="margin: 20px 0;">
        <div style="display: flex; align-items: flex-start; margin-bottom: 15px;">
            <div style="background: #f3e8ff; color: #8b5cf6; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px; flex-shrink: 0;">1</div>
            <div>
                <strong>Complete your health profile</strong> - Help us personalize your experience by sharing your menopause stage and symptoms.
            </div>
        </div>
        
        <div style="display: flex; align-items: flex-start; margin-bottom: 15px;">
            <div style="background: #f3e8ff; color: #8b5cf6; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px; flex-shrink: 0;">2</div>
            <div>
                <strong>Set your food preferences</strong> - Get meal plans tailored to your dietary needs and taste preferences.
            </div>
        </div>
        
        <div style="display: flex; align-items: flex-start; margin-bottom: 15px;">
            <div style="background: #f3e8ff; color: #8b5cf6; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px; flex-shrink: 0;">3</div>
            <div>
                <strong>Define your wellness goals</strong> - Whether it's better sleep, mood stability, or energy levels, we'll help you track progress.
            </div>
        </div>
    </div>
    
    <div class="health-tip">
        <h3 style="color: #8b5cf6; margin-bottom: 10px;">🎯 Your 7-Day Free Trial</h3>
        <p style="margin: 0;">
            You now have full access to all Meno+ features for the next 7 days. Explore personalized meal planning, 
            symptom tracking, and evidence-based wellness insights - all designed specifically for women navigating menopause.
        </p>
    </div>
    
    <h3 style="color: #8b5cf6; margin: 30px 0 15px 0;">Need help getting started?</h3>
    
    <p style="margin-bottom: 15px;">
        Our support team is here to help you make the most of your Meno+ experience. Feel free to reach out with any questions!
    </p>
    
    <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0; font-size: 14px;">
            <strong>Quick tip:</strong> The more consistently you track your symptoms and follow your personalized recommendations, 
            the better insights you'll gain into your unique menopause experience.
        </p>
    </div>
  `;
  
  return baseTemplate(content, { userName, supportEmail });
};