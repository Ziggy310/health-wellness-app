import { baseTemplate } from './base-template.js';

export const template = (data) => {
  const { userName, summaryData, dashboardUrl, supportEmail } = data;
  
  const {
    weekRange = 'this week',
    totalSymptomLogs = 0,
    topSymptoms = [],
    moodAverage = 0,
    sleepAverage = 0,
    energyTrend = 'stable',
    mealsFollowed = 0,
    totalMeals = 7,
    achievements = []
  } = summaryData || {};
  
  const moodEmoji = moodAverage >= 4 ? '😊' : moodAverage >= 3 ? '😐' : '😔';
  const sleepEmoji = sleepAverage >= 7 ? '😴' : sleepAverage >= 6 ? '😌' : '😵';
  const energyEmoji = energyTrend === 'improving' ? '⬆️' : energyTrend === 'declining' ? '⬇️' : '➡️';
  
  const content = `
    <h2 style="color: #1f2937; margin-bottom: 20px;">Your weekly health summary 📊</h2>
    
    <p style="margin-bottom: 20px;">
        Here's how you're doing on your menopause wellness journey for ${weekRange}. 
        These insights help you understand patterns and celebrate your progress!
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
        <a href="${dashboardUrl}" class="button">View Full Dashboard</a>
    </div>
    
    <h3 style="color: #8b5cf6; margin: 30px 0 15px 0;">This week's highlights:</h3>
    
    <div class="stats-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin: 20px 0;">
        <div class="stat-card" style="background: #f8fafc; padding: 15px; border-radius: 8px; text-align: center; border: 1px solid #e2e8f0;">
            <div class="stat-number" style="font-size: 24px; font-weight: bold; color: #8b5cf6;">${totalSymptomLogs}</div>
            <div class="stat-label" style="font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Symptom Logs</div>
        </div>
        
        <div class="stat-card" style="background: #f8fafc; padding: 15px; border-radius: 8px; text-align: center; border: 1px solid #e2e8f0;">
            <div class="stat-number" style="font-size: 24px; font-weight: bold; color: #8b5cf6;">${moodEmoji}</div>
            <div class="stat-label" style="font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Avg Mood (${moodAverage}/5)</div>
        </div>
        
        <div class="stat-card" style="background: #f8fafc; padding: 15px; border-radius: 8px; text-align: center; border: 1px solid #e2e8f0;">
            <div class="stat-number" style="font-size: 24px; font-weight: bold; color: #8b5cf6;">${sleepEmoji}</div>
            <div class="stat-label" style="font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">${sleepAverage}h Sleep</div>
        </div>
        
        <div class="stat-card" style="background: #f8fafc; padding: 15px; border-radius: 8px; text-align: center; border: 1px solid #e2e8f0;">
            <div class="stat-number" style="font-size: 24px; font-weight: bold; color: #8b5cf6;">${energyEmoji}</div>
            <div class="stat-label" style="font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Energy ${energyTrend}</div>
        </div>
    </div>
    
    ${topSymptoms.length > 0 ? `
    <h3 style="color: #8b5cf6; margin: 30px 0 15px 0;">Top symptoms this week:</h3>
    
    <div style="margin: 20px 0;">
        ${topSymptoms.map((symptom, index) => `
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e2e8f0;">
            <span style="font-weight: 500;">${symptom.name}</span>
            <div style="display: flex; align-items: center;">
                <div style="width: 100px; height: 8px; background: #e2e8f0; border-radius: 4px; margin-right: 10px;">
                    <div style="width: ${(symptom.severity / 5) * 100}%; height: 100%; background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%); border-radius: 4px;"></div>
                </div>
                <span style="font-size: 12px; color: #64748b;">${symptom.severity}/5</span>
            </div>
        </div>
        `).join('')}
    </div>
    ` : ''}
    
    <div class="health-tip">
        <h3 style="color: #8b5cf6; margin-bottom: 10px;">🍽️ Meal Plan Progress</h3>
        <p style="margin: 0;">
            You followed ${mealsFollowed} out of ${totalMeals} recommended meals this week 
            (${Math.round((mealsFollowed / totalMeals) * 100)}%). 
            ${mealsFollowed >= totalMeals * 0.8 ? 'Excellent work! Consistent nutrition supports better symptom management.' : 
              mealsFollowed >= totalMeals * 0.6 ? 'Good progress! Try to aim for 80% of your meal plan next week.' : 
              'Consider meal prepping to make it easier to follow your personalized nutrition plan.'}
        </p>
    </div>
    
    ${achievements.length > 0 ? `
    <h3 style="color: #8b5cf6; margin: 30px 0 15px 0;">🏆 This week's achievements:</h3>
    
    <div style="margin: 20px 0;">
        ${achievements.map(achievement => `
        <div style="display: flex; align-items: center; margin-bottom: 10px;">
            <div style="background: #dcfce7; color: #16a34a; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px; flex-shrink: 0;">✓</div>
            <span>${achievement}</span>
        </div>
        `).join('')}
    </div>
    ` : ''}
    
    <h3 style="color: #8b5cf6; margin: 30px 0 15px 0;">💡 This week's wellness tip:</h3>
    
    <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0;">
            <strong>Consistency beats perfection:</strong> Small, consistent changes in your daily routine often lead to bigger improvements 
            than dramatic changes that are hard to maintain. Focus on one or two habits at a time and celebrate small wins!
        </p>
    </div>
    
    <p style="margin: 30px 0 0 0;">
        Keep up the great work! Remember, managing menopause is a journey, not a destination. 
        Every day you track and care for yourself is a step toward better health.
    </p>
  `;
  
  return baseTemplate(content, { userName, supportEmail });
};