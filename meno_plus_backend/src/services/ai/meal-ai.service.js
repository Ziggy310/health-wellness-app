const axios = require('axios');
const { db } = require('../../config/firebase');

/**
 * AI Service for integrating with GPT-4o to generate personalized meal plans
 */
class AIService {
  constructor() {
    // Initialize OpenAI configuration
    this.openaiConfig = {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    };
  }

  /**
   * Generate a personalized meal plan
   */
  async generateMealPlan(userId, days = 7) {
    try {
      // Fetch user's profile data
      const userProfile = await this.getUserProfileData(userId);
      
      // Construct prompt for GPT-4o
      const prompt = this.constructMealPlanPrompt(userProfile, days);
      
      // Call OpenAI API
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: "You are a specialized nutritionist for women experiencing perimenopause and menopause. " +
                       "Your expertise is creating personalized meal plans that help address specific menopausal symptoms."
            },
            { role: "user", content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 2000
        },
        this.openaiConfig
      );
      
      // Parse the response
      return this.parseMealPlanResponse(response.data.choices[0].message.content);
    } catch (error) {
      console.error('Error generating meal plan:', error);
      throw new Error('Failed to generate meal plan');
    }
  }

  /**
   * Get user profile data needed for meal planning
   */
  async getUserProfileData(userId) {
    try {
      // Get user profile
      const userProfileRef = db.collection('UserProfiles').doc(userId);
      const userProfileDoc = await userProfileRef.get();
      const userProfile = userProfileDoc.exists ? userProfileDoc.data() : {};
      
      // Get dietary preferences
      const dietaryPrefsRef = db.collection('DietaryPreferences').doc(userId);
      const dietaryPrefsDoc = await dietaryPrefsRef.get();
      const dietaryPreferences = dietaryPrefsDoc.exists ? dietaryPrefsDoc.data() : {};
      
      // Get health goals
      const healthGoalsRef = db.collection('HealthGoals').doc(userId);
      const healthGoalsDoc = await healthGoalsRef.get();
      const healthGoals = healthGoalsDoc.exists ? healthGoalsDoc.data() : {};
      
      // Get symptoms
      const symptomProfileRef = db.collection('SymptomProfiles').doc(userId);
      const symptomProfileDoc = await symptomProfileRef.get();
      const symptomProfile = symptomProfileDoc.exists ? symptomProfileDoc.data() : { topSymptoms: [] };
      
      // Get symptom details
      const topSymptoms = [];
      if (symptomProfile.topSymptoms && symptomProfile.topSymptoms.length > 0) {
        const symptomsSnapshot = await db.collection('Symptoms')
          .where('__name__', 'in', symptomProfile.topSymptoms)
          .get();
        
        symptomsSnapshot.forEach(doc => {
          topSymptoms.push({
            id: doc.id,
            ...doc.data()
          });
        });
      }
      
      return {
        profile: userProfile,
        dietaryPreferences,
        healthGoals,
        topSymptoms
      };
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  }

  /**
   * Construct prompt for meal plan generation
   */
  constructMealPlanPrompt(userData, days) {
    const { profile, dietaryPreferences, healthGoals, topSymptoms } = userData;
    
    // Format symptoms into readable text
    const symptomsText = topSymptoms.length > 0
      ? topSymptoms.map(s => `${s.name} (${s.category.toLowerCase()})`).join(', ')
      : 'No specific symptoms reported';
    
    // Format dietary preferences
    const dietText = dietaryPreferences.primaryDiet 
      ? `Primary diet: ${dietaryPreferences.primaryDiet}` 
      : 'No specific diet';
    
    const allergiesText = dietaryPreferences.allergies && dietaryPreferences.allergies.length > 0
      ? `Allergies: ${dietaryPreferences.allergies.join(', ')}`
      : 'No allergies reported';
    
    // Construct the prompt
    return `
Please create a personalized ${days}-day meal plan for a woman in ${profile.menopauseStage || 'perimenopause'} with the following profile:

SYMPTOMS:
${symptomsText}

DIETARY INFORMATION:
${dietText}
${allergiesText}
${dietaryPreferences.isGlutenFree ? 'Gluten-free' : ''}
${dietaryPreferences.isDairyFree ? 'Dairy-free' : ''}
${dietaryPreferences.isNutFree ? 'Nut-free' : ''}

HEALTH GOALS:
${healthGoals.primaryGoals ? healthGoals.primaryGoals.join(', ') : 'None specified'}
${healthGoals.improveSleep ? 'Improve sleep quality' : ''}
${healthGoals.reduceHotFlashes ? 'Reduce hot flashes' : ''}

For each day, provide breakfast, lunch, dinner, and 1-2 snacks. For each meal include:
- Name of the dish
- Brief list of ingredients
- Simple preparation instructions
- Benefits relating to menopausal symptoms

Format the response as a structured JSON object with this structure:
{
  "days": [
    {
      "day": 1,
      "breakfast": { "name": "", "ingredients": [], "instructions": [], "benefits": [] },
      "lunch": { "name": "", "ingredients": [], "instructions": [], "benefits": [] },
      "dinner": { "name": "", "ingredients": [], "instructions": [], "benefits": [] },
      "snacks": [{ "name": "", "ingredients": [], "instructions": [], "benefits": [] }]
    }
  ]
}
`;
  }

  /**
   * Parse GPT-4o response into a structured meal plan
   */
  parseMealPlanResponse(responseText) {
    try {
      // Attempt to extract JSON from response
      const jsonMatch = responseText.match(/```json
([\s\S]*?)
```/) || 
                        responseText.match(/```
([\s\S]*?)
```/) ||
                        [null, responseText];
      
      let cleanedJson = jsonMatch[1] || responseText;
      
      // Parse JSON
      const mealPlan = JSON.parse(cleanedJson);
      return mealPlan;
    } catch (error) {
      console.error('Error parsing meal plan response:', error);
      // Return basic structure if parsing fails
      return {
        days: []
      };
    }
  }
}

module.exports = new AIService();
