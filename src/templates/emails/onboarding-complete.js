import { baseTemplate } from './base-template.js';

export const template = (data) => {
  const { userName, dashboardUrl, supportEmail } = data;
  
  const content = `
    <h2 style="color: #1f2937; margin-bottom: 20px;">Congratulations! Your health profile is complete 🎉</h2>
    
    <p style="margin-bottom: 20px;">
        You've successfully completed your Meno+ health profile setup! This is a huge step towards 
        taking control of your menopause journey with personalized, science-backed support.
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
        <a href="${dashboardUrl}" class="button">View Your Personalized Dashboard</a>
    </div>
    
    <h3 style="color: #8b5cf6; margin: 30px 0 15px 0;">Your personalized experience is now ready:</h3>
    
    <div style="margin: 20px 0;">
        <div style="display: flex; align-items: flex-start; margin-bottom: 15px;">
            <div style="background: #dcfce7; color: #16a34a; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px; flex-shrink: 0;">✓</div>
            <div>
                <strong>Custom meal plans</strong> tailored to your dietary preferences and menopause stage
            </div>
        </div>
        
        <div style="display: flex; align-items: flex-start; margin-bottom: 15px;">
            <div style="background: #dcfce7; color: #16a34a; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px; flex-shrink: 0;">✓</div>
            <div>
                <strong>Targeted symptom tracking</strong> based on your specific menopause symptoms
            </div>
        </div>
        
        <div style="display: flex; align-items: flex-start; margin-bottom: 15px;">
            <div style="background: #dcfce7; color: #16a34a; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px; flex-shrink: 0;">✓</div>
            <div>
                <strong>Goal-focused insights</strong> to help you achieve your wellness objectives
            </div>
        </div>
        
        <div style="display: flex; align-items: flex-start;">
            <div style="background: #dcfce7; color: #16a34a; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px; flex-shrink: 0;">✓</div>
            <div>
                <strong>Evidence-based recommendations</strong> designed for your unique profile
            </div>
        </div>
    </div>
    
    <div class="health-tip">
        <h3 style="color: #8b5cf6; margin-bottom: 10px;">🌟 Your journey starts now</h3>
        <p style="margin: 0;">
            Remember, consistency is key in menopause management. Try to log your symptoms daily, 
            follow your meal plans when possible, and check in with your progress regularly. 
            Small, consistent actions lead to meaningful improvements in how you feel.
        </p>
    </div>
    
    <h3 style="color: #8b5cf6; margin: 30px 0 15px 0;">What to expect next:</h3>
    
    <p style="margin-bottom: 15px;">📧 <strong>Weekly health summaries</strong> - We'll send you insights about your symptom patterns and progress</p>
    <p style="margin-bottom: 15px;">🍽️ <strong>New meal plan notifications</strong> - Fresh, personalized recipes delivered to your inbox</p>
    <p style="margin-bottom: 15px;">💡 <strong>Wellness tips</strong> - Evidence-based advice tailored to your menopause stage</p>
    
    <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0; font-size: 14px;">
            <strong>Pro tip:</strong> Your dashboard is now your menopause command center. 
            Bookmark it and make it part of your daily routine for the best results!
        </p>
    </div>
  `;
  
  return baseTemplate(content, { userName, supportEmail });
};