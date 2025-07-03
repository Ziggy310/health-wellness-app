const axios = require('axios');
const { db } = require('../../config/firebase');

/**
 * Voice Service for integrating with AudioFish API to provide
 * voice synthesis capabilities for the Meno+ app
 */
class VoiceService {
  constructor() {
    this.apiKey = process.env.AUDIOFISH_API_KEY;
    this.apiUrl = process.env.AUDIOFISH_API_URL || 'https://api.audiofish.com';
    this.defaultVoiceId = 'supportive-female-1'; // Default voice for most interactions
    this.calmingVoiceId = 'calming-female-1';    // Voice for calming exercises
  }

  /**
   * Initialize headers for API requests
   */
  getHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`
    };
  }

  /**
   * Get user voice preferences
   */
  async getUserVoicePreferences(userId) {
    try {
      const prefsRef = db.collection('VoicePreferences').doc(userId);
      const prefsDoc = await prefsRef.get();
      
      if (!prefsDoc.exists) {
        // Return default preferences if not set
        return {
          voiceId: this.defaultVoiceId,
          speechRate: 1.0,
          pitch: 1.0,
          backgroundMusicEnabled: true
        };
      }
      
      return prefsDoc.data();
    } catch (error) {
      console.error('Error getting voice preferences:', error);
      // Return defaults on error
      return {
        voiceId: this.defaultVoiceId,
        speechRate: 1.0,
        pitch: 1.0,
        backgroundMusicEnabled: true
      };
    }
  }

  /**
   * Generate speech from text using AudioFish API
   */
  async generateSpeech(text, options = {}) {
    try {
      const voiceOptions = {
        voiceId: options.voiceId || this.defaultVoiceId,
        speechRate: options.speechRate || 1.0,
        pitch: options.pitch || 1.0,
        backgroundMusicEnabled: options.backgroundMusicEnabled !== undefined ? 
          options.backgroundMusicEnabled : true,
        backgroundMusicId: options.backgroundMusicId || null,
        enhanceClarity: options.enhanceClarity !== undefined ? 
          options.enhanceClarity : true
      };

      // Make API request to AudioFish for speech generation
      const response = await axios.post(
        `${this.apiUrl}/v1/speech`,
        {
          text,
          ...voiceOptions
        },
        { 
          headers: this.getHeaders(),
          responseType: 'arraybuffer'
        }
      );

      // Return audio data and content type
      return {
        audioData: response.data,
        contentType: response.headers['content-type'] || 'audio/mpeg'
      };
    } catch (error) {
      console.error('Error generating speech:', error);
      throw new Error('Failed to generate speech audio');
    }
  }

  /**
   * Generate meal explanation with voice
   */
  async generateMealExplanation(mealId, userId) {
    try {
      // Get meal details
      const mealRef = db.collection('Meals').doc(mealId);
      const mealDoc = await mealRef.get();
      
      if (!mealDoc.exists) {
        throw new Error('Meal not found');
      }
      
      const meal = mealDoc.data();
      
      // Get user voice preferences
      const voicePrefs = await this.getUserVoicePreferences(userId);

      // Construct the explanation text
      let explanationText = `Let me explain how ${meal.name} can help with your symptoms. `;
      
      if (meal.benefitExplanations && meal.benefitExplanations.length > 0) {
        explanationText += meal.benefitExplanations.join(' ');
      } else {
        // Generate a generic explanation based on ingredients
        explanationText += `This meal contains ${meal.ingredients.slice(0, 3).join(', ')} `;
        explanationText += `which can provide nutrients that may help with your symptoms. `;
      }
      
      explanationText += `Would you like me to explain the preparation steps?`;

      // Generate speech audio
      const audioResult = await this.generateSpeech(explanationText, voicePrefs);

      // Log conversation for analysis
      await this.logConversation(userId, 'meal-explanation', {
        mealId,
        responseText: explanationText
      });

      return {
        audioData: audioResult.audioData,
        contentType: audioResult.contentType,
        text: explanationText
      };
    } catch (error) {
      console.error('Error generating meal explanation:', error);
      throw error;
    }
  }

  /**
   * Generate calming exercise with voice guidance
   */
  async generateCalmingExercise(symptomId, userId) {
    try {
      // Get symptom details if provided
      let symptomName = 'stress';
      let exerciseType = 'breathing';
      
      if (symptomId) {
        const symptomRef = db.collection('Symptoms').doc(symptomId);
        const symptomDoc = await symptomRef.get();
        
        if (symptomDoc.exists) {
          symptomName = symptomDoc.data().name.toLowerCase();
          
          // Determine best exercise type based on symptom
          if (['insomnia', 'night sweats', 'sleep issues'].includes(symptomName)) {
            exerciseType = 'sleep';
          } else if (['anxiety', 'irritability', 'mood swings'].includes(symptomName)) {
            exerciseType = 'calming';
          } else if (['brain fog', 'poor concentration'].includes(symptomName)) {
            exerciseType = 'focus';
          }
        }
      }
      
      // Get user voice preferences
      const voicePrefs = await this.getUserVoicePreferences(userId);
      
      // Use calming voice for exercises
      voicePrefs.voiceId = this.calmingVoiceId;
      
      // Select background music based on exercise type
      switch (exerciseType) {
        case 'sleep':
          voicePrefs.backgroundMusicId = 'gentle-sleep';
          voicePrefs.speechRate = 0.85; // Slower pace for sleep
          break;
        case 'focus':
          voicePrefs.backgroundMusicId = 'focus-enhance';
          voicePrefs.speechRate = 1.0;
          break;
        case 'calming':
        default:
          voicePrefs.backgroundMusicId = 'calm-nature';
          voicePrefs.speechRate = 0.9;
          break;
      }
      
      // Create appropriate exercise script based on type
      let exerciseText = '';
      
      if (exerciseType === 'breathing') {
        exerciseText = `Let's begin a brief breathing exercise to help with ${symptomName}. 
          Find a comfortable position. 
          Now, let's take a deep breath in through your nose for a count of 4... 2... 3... 4... 
          Hold your breath for a moment... 
          And slowly exhale through your mouth for a count of 6... 2... 3... 4... 5... 6... 
          Let's repeat this cycle a few more times. 
          Breathe in... 2... 3... 4... 
          Hold... 
          And exhale... 2... 3... 4... 5... 6... 
          Again, breathe in... 2... 3... 4... 
          Hold... 
          And exhale... 2... 3... 4... 5... 6...
          Last time, breathe in... 2... 3... 4... 
          Hold... 
          And exhale... 2... 3... 4... 5... 6... 
          Well done. Notice how your body feels a little more relaxed now.`;
      } else if (exerciseType === 'sleep') {
        exerciseText = `Let's prepare your mind and body for sleep with this brief relaxation exercise.
          Get comfortable in your bed or chair.
          Close your eyes and take a slow, deep breath in... and exhale completely.
          Focus on releasing tension from your body, beginning with your toes.
          Feel your toes becoming heavy and relaxed.
          Now move to your feet... ankles... calves...
          Allow the relaxation to flow up through your legs...
          Your thighs... hips... abdomen... 
          Feel your breathing becoming deeper and more regular.
          Let the relaxation move through your chest... shoulders... arms...
          Down to your hands and fingertips.
          Finally, feel the tension melting away from your neck... face... and scalp.
          Your whole body is now deeply relaxed.
          Continue breathing slowly and evenly as you drift toward sleep.`;
      } else if (exerciseType === 'focus') {
        exerciseText = `Let's do a quick mental clarity exercise to help with ${symptomName}.
          Sit comfortably with your back straight.
          Take three deep breaths to center yourself.
          Now, bring your full attention to this moment.
          Feel the weight of your body in your seat.
          Notice the sensations where your body makes contact with the chair or floor.
          Bring your awareness to your breath without trying to change it.
          Simply observe each inhale... and each exhale...
          If your mind begins to wander, gently guide your focus back to your breath.
          Now, count backwards from 5, bringing increased clarity with each number.
          5... becoming more alert...
          4... mind clearing...
          3... focus sharpening...
          2... fully present...
          1... ready to engage with renewed mental clarity.`;
      } else {
        exerciseText = `Let's do a brief calming exercise to help with ${symptomName}.
          Begin by taking a comfortable position.
          Close your eyes if that feels right for you.
          Take a slow, deep breath in through your nose...
          And exhale fully through your mouth.
          As you continue breathing deeply, imagine a wave of relaxation flowing through your body.
          With each breath, you're releasing tension and creating space for calm.
          Bring your awareness to any areas that feel particularly tense...
          And with your next exhale, imagine that tension dissolving away.
          Continue breathing slowly and mindfully for a few more breaths.
          When you're ready, gently open your eyes, carrying this sense of calm with you.`;
      }
      
      // Generate speech audio
      const audioResult = await this.generateSpeech(exerciseText, voicePrefs);
      
      // Log exercise session
      await db.collection('ReliefSessions').add({
        userId,
        toolId: 'voice-guided-exercise',
        timestamp: new Date(),
        category: exerciseType,
        targetSymptom: symptomId || null,
        completed: true,
        durationSeconds: Math.round(exerciseText.length / 15) // Estimate duration based on text length
      });

      return {
        audioData: audioResult.audioData,
        contentType: audioResult.contentType,
        text: exerciseText,
        exerciseType
      };
    } catch (error) {
      console.error('Error generating calming exercise:', error);
      throw error;
    }
  }

  /**
   * Process a voice query for the voice concierge
   */
  async processVoiceQuery(query, userId) {
    try {
      // Get user voice preferences
      const voicePrefs = await this.getUserVoicePreferences(userId);
      
      // For MVP, we'll use a basic response approach
      // In a full implementation, this would connect to GPT-4o for conversational responses
      
      // Check for common query types and provide responses
      let responseText = '';
      const queryLower = query.toLowerCase();
      
      // Sample query handling (placeholder for GPT-4o integration)
      if (queryLower.includes('hot flash') || queryLower.includes('hot flush')) {
        responseText = "Hot flashes can be challenging. Try foods rich in phytoestrogens like soy, flaxseed, and legumes. Staying hydrated and avoiding triggers like caffeine, alcohol, and spicy foods may help. Would you like me to suggest a meal plan focused on reducing hot flashes?";
      } else if (queryLower.includes('sleep') || queryLower.includes('insomnia')) {
        responseText = "Sleep disturbances are common during menopause. Consider foods with tryptophan like turkey, milk, and bananas, which may support melatonin production. Magnesium-rich foods like leafy greens, nuts, and seeds can also help relax muscles. Would you like me to recommend a pre-bedtime snack that might help with sleep?";
      } else if (queryLower.includes('mood') || queryLower.includes('depress') || queryLower.includes('anxiet')) {
        responseText = "Mood changes during menopause can be difficult. Foods rich in omega-3s like fatty fish, walnuts, and flaxseeds may help stabilize mood. Complex carbohydrates can boost serotonin levels. Would you like me to share some mood-supporting meal ideas?";
      } else if (queryLower.includes('brain fog') || queryLower.includes('memory') || queryLower.includes('focus')) {
        responseText = "Brain fog and cognitive changes are common concerns. Foods rich in antioxidants and omega-3 fatty acids like berries, leafy greens, and fatty fish may support brain health. Staying hydrated and maintaining stable blood sugar levels can also help. Would you like some cognitive-supporting recipe suggestions?";
      } else {
        responseText = "I'm here to help you navigate menopause with personalized nutrition guidance. You can ask me about specific symptoms, meal plans, or general nutrition advice for menopause. How can I assist you today?";
      }
      
      // Generate speech audio from response
      const audioResult = await this.generateSpeech(responseText, voicePrefs);
      
      // Log conversation for analysis
      await this.logConversation(userId, 'voice-query', {
        query,
        responseText
      });

      return {
        audioData: audioResult.audioData,
        contentType: audioResult.contentType,
        text: responseText
      };
    } catch (error) {
      console.error('Error processing voice query:', error);
      throw error;
    }
  }

  /**
   * Log conversation for analytics and improvement
   */
  async logConversation(userId, type, data) {
    try {
      await db.collection('ConversationHistories').add({
        userId,
        timestamp: new Date(),
        type,
        userQuery: data.query || null,
        systemResponse: data.responseText || null,
        entitiesDiscussed: this.extractEntities(data),
        wasHelpful: null // To be updated via feedback
      });
    } catch (error) {
      console.error('Error logging conversation:', error);
      // Non-critical, so we don't throw the error
    }
  }
  
  /**
   * Extract entities discussed in conversation
   */
  extractEntities(data) {
    const entities = [];
    const text = data.query || data.responseText || '';
    
    // Simple entity extraction based on keywords
    const symptomKeywords = ['hot flash', 'sleep', 'mood', 'anxiety', 'brain fog', 'fatigue', 'joint pain'];
    const nutrientKeywords = ['vitamin', 'mineral', 'omega', 'protein', 'calcium', 'magnesium'];
    const foodKeywords = ['vegetable', 'fruit', 'nut', 'seed', 'fish', 'meat', 'dairy'];
    
    // Check for symptoms
    symptomKeywords.forEach(keyword => {
      if (text.toLowerCase().includes(keyword)) {
        entities.push({ type: 'symptom', value: keyword });
      }
    });
    
    // Check for nutrients
    nutrientKeywords.forEach(keyword => {
      if (text.toLowerCase().includes(keyword)) {
        entities.push({ type: 'nutrient', value: keyword });
      }
    });
    
    // Check for foods
    foodKeywords.forEach(keyword => {
      if (text.toLowerCase().includes(keyword)) {
        entities.push({ type: 'food', value: keyword });
      }
    });
    
    return entities;
  }
}

module.exports = new VoiceService();
