const { db } = require('../config/firebase');
const SymptomService = require('../services/nutrient-tracking/symptom.service');

/**
 * Symptom tracking controller for the Meno+ app
 * Handles all symptom logging related API endpoints
 */

// Get list of available symptoms
exports.getSymptoms = async (req, res) => {
  try {
    const userId = req.userId;
    
    // Get all available symptoms including user-defined ones
    const symptoms = await SymptomService.getAvailableSymptoms(userId);
    
    return res.status(200).json({
      success: true,
      data: symptoms
    });
  } catch (error) {
    console.error('Error getting symptoms:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while retrieving symptoms'
    });
  }
};

// Get user's tracked symptoms
exports.getUserSymptoms = async (req, res) => {
  try {
    const userId = req.userId;
    
    // Get user's tracked symptoms and recent records
    const { topSymptoms, recentSymptoms } = await SymptomService.getUserSymptoms(userId);
    
    return res.status(200).json({
      success: true,
      data: {
        topSymptoms,
        recentSymptoms
      }
    });
  } catch (error) {
    console.error('Error getting user symptoms:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while retrieving user symptoms'
    });
  }
};

// Record a new symptom
exports.recordSymptom = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, severity, notes } = req.body;
    
    // Validate input
    if (!name || !severity || severity < 1 || severity > 5) {
      return res.status(400).json({
        success: false,
        message: 'Valid symptom name and severity (1-5) are required'
      });
    }
    
    // Record the new symptom
    const symptomRecord = await SymptomService.recordSymptomOccurrence(userId, name, severity, notes);
    
    return res.status(201).json({
      success: true,
      message: 'Symptom recorded successfully',
      data: symptomRecord
    });
  } catch (error) {
    console.error('Error recording symptom:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while recording symptom'
    });
  }
};

// Get symptom history
exports.getSymptomHistory = async (req, res) => {
  try {
    const userId = req.userId;
    const { startDate, endDate, symptomName } = req.query;
    
    // Validate dates
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Both startDate and endDate are required'
      });
    }
    
    // Get symptom history and trends
    const { symptoms, trends, period } = await SymptomService.getSymptomHistory(
      userId, startDate, endDate, symptomName
    );
    
    return res.status(200).json({
      success: true,
      data: {
        symptoms,
        trends,
        period
      }
    });
  } catch (error) {
    console.error('Error getting symptom history:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while retrieving symptom history'
    });
  }
};

// Submit mood check-in
exports.moodCheckIn = async (req, res) => {
  try {
    const userId = req.userId;
    const { mood, notes, relatedSymptoms } = req.body;
    
    // Validate input
    if (!mood) {
      return res.status(400).json({
        success: false,
        message: 'Mood value is required'
      });
    }
    
    // Record the mood check-in
    const moodRecord = await SymptomService.recordMoodCheckIn(userId, mood, notes, relatedSymptoms);
    
    return res.status(201).json({
      success: true,
      message: 'Mood check-in recorded successfully',
      data: moodRecord
    });
  } catch (error) {
    console.error('Error recording mood check-in:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while recording mood check-in'
    });
  }
};

// Get mood history
exports.getMoodHistory = async (req, res) => {
  try {
    const userId = req.userId;
    const { startDate, endDate } = req.query;
    
    // Validate dates
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Both startDate and endDate are required'
      });
    }
    
    // Get mood history
    const { moods, trends, period } = await SymptomService.getMoodHistory(userId, startDate, endDate);
    
    return res.status(200).json({
      success: true,
      data: {
        moods,
        trends,
        period
      }
    });
  } catch (error) {
    console.error('Error getting mood history:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while retrieving mood history'
    });
  }
};

// Get daily symptom summary for dashboard
exports.getDailySummary = async (req, res) => {
  try {
    const userId = req.userId;
    
    // Generate daily summary
    const summary = await SymptomService.generateDailySummary(userId);
    
    return res.status(200).json({
      success: true,
      data: summary
    });
  } catch (error) {
    console.error('Error generating daily summary:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while generating daily symptom summary'
    });
  }
};
