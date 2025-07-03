const express = require('express');
const router = express.Router();
const { body, query } = require('express-validator');
const authMiddleware = require('../middleware/auth.middleware');
const voiceController = require('../controllers/voice.controller');

// Get voice preferences
router.get('/preferences', authMiddleware, voiceController.getVoicePreferences);

// Update voice preferences
router.put(
  '/preferences',
  authMiddleware,
  [
    body('voiceId').optional().isString().withMessage('Voice ID must be a string'),
    body('speechRate').optional().isFloat({ min: 0.5, max: 2.0 }).withMessage('Speech rate must be between 0.5 and 2.0'),
    body('pitch').optional().isFloat({ min: 0.5, max: 2.0 }).withMessage('Pitch must be between 0.5 and 2.0'),
    body('backgroundMusicEnabled').optional().isBoolean().withMessage('Background music enabled must be a boolean')
  ],
  voiceController.updateVoicePreferences
);

// Process voice query
router.post(
  '/query',
  authMiddleware,
  [
    body('query').notEmpty().withMessage('Query is required')
  ],
  voiceController.processVoiceQuery
);

// Get meal explanation
router.post(
  '/meal-explanation',
  authMiddleware,
  [
    body('mealId').notEmpty().withMessage('Meal ID is required')
  ],
  voiceController.getMealExplanation
);

// Get calming exercise
router.post(
  '/calming-exercise',
  authMiddleware,
  [
    body('symptomId').optional().isString().withMessage('Symptom ID must be a string if provided')
  ],
  voiceController.getCalmingExercise
);

module.exports = router;
