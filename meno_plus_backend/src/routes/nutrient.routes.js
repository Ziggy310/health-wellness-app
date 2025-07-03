const express = require('express');
const { authMiddleware } = require('../middleware/auth.middleware');
const nutrientController = require('../controllers/nutrient.controller');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

/**
 * @route   GET /api/nutrients/summary
 * @desc    Get nutrient summary for a specific time period
 * @access  Private
 * @query   startDate, endDate
 */
router.get('/summary', nutrientController.getNutrientSummary);

/**
 * @route   GET /api/nutrients/rings
 * @desc    Get micronutrient completion rings data for visualization
 * @access  Private
 * @query   date (optional)
 */
router.get('/rings', nutrientController.getMicronutrientRings);

/**
 * @route   GET /api/nutrients/deficiencies
 * @desc    Get identified nutrient deficiencies
 * @access  Private
 */
router.get('/deficiencies', nutrientController.getNutrientDeficiencies);

/**
 * @route   GET /api/nutrients/:nutrientId/sources
 * @desc    Get food sources and information for a specific nutrient
 * @access  Private
 * @param   nutrientId
 */
router.get('/:nutrientId/sources', nutrientController.getNutrientSources);

/**
 * @route   GET /api/nutrients/correlation
 * @desc    Analyze correlation between nutrients and symptoms
 * @access  Private
 * @query   symptom, daysOffset (optional)
 */
router.get('/correlation', nutrientController.analyzeNutrientSymptomCorrelation);

module.exports = router;
