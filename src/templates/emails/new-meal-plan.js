import { baseTemplate } from './base-template.js';

export const template = (data) => {
  const { userName, mealPlanName, mealPlanUrl, supportEmail } = data;
  
  const content = `
    <h2 style="color: #1f2937; margin-bottom: 20px;">Your personalized meal plan is ready! 🍽️</h2>
    
    <p style="margin-bottom: 20px;">
        Great news! We've created a new personalized meal plan just for you: <strong>"${mealPlanName}"</strong>. 
        This plan is tailored to your dietary preferences, menopause stage, and wellness goals.
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
        <a href="${mealPlanUrl}" class="button">View Your New Meal Plan</a>
    </div>
    
    <h3 style="color: #8b5cf6; margin: 30px 0 15px 0;">What makes this meal plan special:</h3>
    
    <div style="margin: 20px 0;">
        <div style="display: flex; align-items: flex-start; margin-bottom: 15px;">
            <div style="background: #dcfce7; color: #16a34a; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px; flex-shrink: 0;">🎯</div>
            <div>
                <strong>Personalized for you</strong> - Based on your dietary preferences, allergies, and menopause symptoms
            </div>
        </div>
        
        <div style="display: flex; align-items: flex-start; margin-bottom: 15px;">
            <div style="background: #dcfce7; color: #16a34a; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px; flex-shrink: 0;">🔬</div>
            <div>
                <strong>Science-backed nutrition</strong> - Includes foods that may help manage menopause symptoms
            </div>
        </div>
        
        <div style="display: flex; align-items: flex-start; margin-bottom: 15px;">
            <div style="background: #dcfce7; color: #16a34a; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px; flex-shrink: 0;">⏰</div>
            <div>
                <strong>Time-conscious recipes</strong> - Designed to fit your lifestyle and cooking preferences
            </div>
        </div>
        
        <div style="display: flex; align-items: flex-start;">
            <div style="background: #dcfce7; color: #16a34a; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px; flex-shrink: 0;">📋</div>
            <div>
                <strong>Shopping lists included</strong> - Complete ingredient lists to make grocery shopping easy
            </div>
        </div>
    </div>
    
    <div class="health-tip">
        <h3 style="color: #8b5cf6; margin-bottom: 10px;">🌟 Key nutrients for menopause</h3>
        <p style="margin: 0;">
            Your meal plan includes foods rich in calcium, vitamin D, omega-3 fatty acids, and phytoestrogens - 
            all important nutrients that may help support your body during menopause and promote overall wellness.
        </p>
    </div>
    
    <h3 style="color: #8b5cf6; margin: 30px 0 15px 0;">Getting started with your meal plan:</h3>
    
    <div style="margin: 20px 0;">
        <div style="display: flex; align-items: flex-start; margin-bottom: 15px;">
            <div style="background: #f3e8ff; color: #8b5cf6; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px; flex-shrink: 0;">1</div>
            <div>
                <strong>Review your meal plan</strong> - Browse through the recipes and pick your favorites to start with
            </div>
        </div>
        
        <div style="display: flex; align-items: flex-start; margin-bottom: 15px;">
            <div style="background: #f3e8ff; color: #8b5cf6; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px; flex-shrink: 0;">2</div>
            <div>
                <strong>Download your shopping list</strong> - We've organized all ingredients by category for easy shopping
            </div>
        </div>
        
        <div style="display: flex; align-items: flex-start; margin-bottom: 15px;">
            <div style="background: #f3e8ff; color: #8b5cf6; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px; flex-shrink: 0;">3</div>
            <div>
                <strong>Start cooking</strong> - Begin with simpler recipes and gradually try more adventurous ones
            </div>
        </div>
        
        <div style="display: flex; align-items: flex-start;">
            <div style="background: #f3e8ff; color: #8b5cf6; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px; flex-shrink: 0;">4</div>
            <div>
                <strong>Track your experience</strong> - Log how you feel after meals to help us refine future plans
            </div>
        </div>
    </div>
    
    <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0 0 10px 0; font-size: 14px;">
            <strong>Remember:</strong> You can customize any recipe to better suit your taste preferences. 
            Don't like an ingredient? Feel free to substitute with something you prefer!
        </p>
        <p style="margin: 0; font-size: 14px;">
            <strong>Need help?</strong> Each recipe includes preparation tips and nutritional information to help you succeed.
        </p>
    </div>
    
    <p style="margin: 20px 0 0 0;">
        We hope you enjoy exploring these new recipes! Remember, good nutrition is one of the most powerful tools 
        for managing menopause symptoms and supporting overall health.
    </p>
  `;
  
  return baseTemplate(content, { userName, supportEmail });
};