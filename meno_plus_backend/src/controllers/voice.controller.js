const { validationResult } = require('express-validator');
const voiceService = require('../services/voice/voice.service');
const { db, admin } = require('../config/firebase');

/**
 * Get voice preferences for user
 */
const getVoicePreferences = async (req, res) => {
  try {
    const userId = req.userId;
    
    // Get preferences from database
    const preferencesRef = db.collection('VoicePreferences').doc(userId);
    const preferencesDoc = await preferencesRef.get();
    
    if (!preferencesDoc.exists) {
      // Return default preferences if not set
      return res.status(200).json({
        success: true,
        data: {
          voiceId: 'supportive-female-1',
          speechRate: 1.0,
          pitch: 1.0,
          accentPreference: 'neutral',
          backgroundMusicEnabled: true
        }
      });
    }
    
    return res.status(200).json({
      success: true,
      data: preferencesDoc.data()
    });
  } catch (error) {
    console.error('Error getting voice preferences:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve voice preferences',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Update voice preferences for user
 */
const updateVoicePreferences = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    const userId = req.userId;
    const {
      voiceId,
      speechRate,
      pitch,
      accentPreference,
      backgroundMusicEnabled
    } = req.body;
    
    // Update preferences in database
    const preferencesRef = db.collection('VoicePreferences').doc(userId);
    await preferencesRef.set({
      voiceId,
      speechRate,
      pitch,
      accentPreference,
      backgroundMusicEnabled,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    
    return res.status(200).json({
      success: true,
      message: 'Voice preferences updated successfully'
    });
  } catch (error) {
    console.error('Error updating voice preferences:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update voice preferences',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Process a voice query
 */
const processVoiceQuery = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    const userId = req.userId;
    const { query } = req.body;
    
    if (!query || query.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Query cannot be empty'
      });
    }
    
    // Process query with voice service
    const response = await voiceService.processVoiceQuery(query, userId);
    
    // Send audio response
    return res.status(200).json({
      success: true,
      data: {
        audio: Buffer.from(response.audioData).toString('base64'),
        contentType: response.contentType,
        text: response.text
      }
    });
  } catch (error) {
    console.error('Error processing voice query:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process voice query',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get meal explanation with voice
 */
const getMealExplanation = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    const userId = req.userId;
    const { mealId } = req.body;
    
    if (!mealId) {
      return res.status(400).json({
        success: false,
        message: 'Meal ID is required'
      });
    }
    
    // Generate meal explanation
    const explanation = await voiceService.generateMealExplanation(mealId, userId);
    
    // Send audio response
    return res.status(200).json({
      success: true,
      data: {
        audio: Buffer.from(explanation.audioData).toString('base64'),
        contentType: explanation.contentType,
        text: explanation.text
      }
    });
  } catch (error) {
    console.error('Error generating meal explanation:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate meal explanation',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get calming exercise with voice
 */
const getCalmingExercise = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    const userId = req.userId;
    const { symptomId } = req.body;
    
    // Generate calming exercise
    const exercise = await voiceService.generateCalmingExercise(symptomId, userId);
    
    // Send audio response
    return res.status(200).json({
      success: true,
      data: {
        audio: Buffer.from(exercise.audioData).toString('base64'),
        contentType: exercise.contentType,
        text: exercise.text,
        exerciseType: exercise.exerciseType
      }
    });
  } catch (error) {
    console.error('Error generating calming exercise:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate calming exercise',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getVoicePreferences,
  updateVoicePreferences,
  processVoiceQuery,
  getMealExplanation,
  getCalmingExercise
};
