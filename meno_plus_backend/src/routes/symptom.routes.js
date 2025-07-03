const express = require('express');
const { authMiddleware } = require('../middleware/auth.middleware');
const symptomController = require('../controllers/symptom.controller');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

/**
 * @route   GET /api/symptoms
 * @desc    Get available symptoms list
 * @access  Private
 */
router.get('/', symptomController.getSymptoms);

/**
 * @route   GET /api/symptoms/user
 * @desc    Get user's tracked symptoms
 * @access  Private
 */
router.get('/user', symptomController.getUserSymptoms);

/**
 * @route   POST /api/symptoms/record
 * @desc    Record symptom occurrence
 * @access  Private
 */
router.post('/record', symptomController.recordSymptom);

/**
 * @route   GET /api/symptoms/history
 * @desc    Get symptom history
 * @access  Private
 * @query   startDate, endDate, symptomName (optional)
 */
router.get('/history', symptomController.getSymptomHistory);

/**
 * @route   POST /api/symptoms/mood/check-in
 * @desc    Submit mood check-in
 * @access  Private
 */
router.post('/mood/check-in', symptomController.moodCheckIn);

/**
 * @route   GET /api/symptoms/mood/history
 * @desc    Get mood history
 * @access  Private
 * @query   startDate, endDate
 */
router.get('/mood/history', symptomController.getMoodHistory);

/**
 * @route   GET /api/symptoms/daily-summary
 * @desc    Get daily symptom summary for dashboard
 * @access  Private
 */
router.get('/daily-summary', symptomController.getDailySummary);

module.exports = router;
