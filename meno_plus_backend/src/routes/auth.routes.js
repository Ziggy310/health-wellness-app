const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/auth.controller');

// User registration
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('displayName').notEmpty().withMessage('Display name is required')
  ],
  authController.register
);

// User login
router.post(
  '/login',
  [
    body('idToken').notEmpty().withMessage('ID token is required')
  ],
  authController.login
);

// Reset password request
router.post(
  '/reset-password',
  [
    body('email').isEmail().withMessage('Please enter a valid email')
  ],
  authController.resetPassword
);

// Refresh token
router.post(
  '/refresh-token',
  [
    body('refreshToken').notEmpty().withMessage('Refresh token is required')
  ],
  authController.refreshToken
);

module.exports = router;
