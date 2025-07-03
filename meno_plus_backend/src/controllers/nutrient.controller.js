const { db } = require('../config/firebase');
const NutrientService = require('../services/nutrient-tracking/nutrient.service');

/**
 * Nutrient tracking controller for the Meno+ app
 * Handles all nutrient tracking related API endpoints
 */

// Get nutrient summary for a period
exports.getNutrientSummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const userId = req.userId;
    
    // Validate dates
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Both startDate and endDate are required'
      });
    }
    
    // Get nutrient data using the nutrition service
    const nutrientData = await NutrientService.getNutrientDataForPeriod(userId, startDate, endDate);
    
    return res.status(200).json({
      success: true,
      data: {
        nutrients: nutrientData
      }
    });
  } catch (error) {
    console.error('Error getting nutrient summary:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while retrieving nutrient data'
    });
  }
};

// Get micronutrient completion rings data
exports.getMicronutrientRings = async (req, res) => {
  try {
    const { date } = req.query;
    const userId = req.userId;
    
    // Get micronutrient rings data
    const ringsData = await NutrientService.getMicronutrientRingsData(userId, date);
    
    return res.status(200).json({
      success: true,
      data: ringsData
    });
  } catch (error) {
    console.error('Error getting micronutrient rings:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while retrieving micronutrient data'
    });
  }
};

// Get nutrient deficiencies
exports.getNutrientDeficiencies = async (req, res) => {
  try {
    const userId = req.userId;
    
    // Get deficiencies using the nutrition service
    const { deficiencies, period } = await NutrientService.analyzeNutrientDeficiencies(userId);
    
    return res.status(200).json({
      success: true,
      data: {
        deficiencies,
        period
      }
    });
  } catch (error) {
    console.error('Error getting nutrient deficiencies:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while analyzing nutrient deficiencies'
    });
  }
};

// Get sources for a specific nutrient
exports.getNutrientSources = async (req, res) => {
  try {
    const { nutrientId } = req.params;
    
    // Get sources and info for the nutrient
    const nutrientInfo = await NutrientService.getNutrientInformation(nutrientId);
    
    if (!nutrientInfo) {
      return res.status(400).json({
        success: false,
        message: 'Invalid nutrient ID'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: nutrientInfo
    });
  } catch (error) {
    console.error('Error getting nutrient sources:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while retrieving nutrient sources'
    });
  }
};

// Analyze correlation between symptoms and nutrients
exports.analyzeNutrientSymptomCorrelation = async (req, res) => {
  try {
    const { symptom, daysOffset } = req.query;
    const userId = req.userId;
    
    // Validate input
    if (!symptom) {
      return res.status(400).json({
        success: false,
        message: 'Symptom name is required'
      });
    }
    
    // Parse days offset (default to 1)
    const offset = parseInt(daysOffset || '1');
    
    // Get correlation analysis
    const correlation = await NutrientService.analyzeNutrientSymptomCorrelation(userId, symptom, offset);
    
    return res.status(200).json({
      success: true,
      data: correlation
    });
  } catch (error) {
    console.error('Error analyzing symptom-nutrient correlation:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while analyzing correlation'
    });
  }
};
