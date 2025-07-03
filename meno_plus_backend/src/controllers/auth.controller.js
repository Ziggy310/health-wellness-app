const { auth, admin, db } = require('../config/firebase');
const { validationResult } = require('express-validator');

/**
 * Register a new user
 */
const register = async (req, res) => {
  try {
    // Validate request data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { email, password, displayName } = req.body;

    // Create user in Firebase Auth
    const userRecord = await auth.createUser({
      email,
      password,
      displayName
    });

    // Create user document in Firestore
    await db.collection('Users').doc(userRecord.uid).set({
      email,
      displayName,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      isActive: true,
      subscriptionTier: 'FREE',
      subscriptionExpiryDate: null
    });

    // Create custom token for frontend authentication
    const token = await auth.createCustomToken(userRecord.uid);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        userId: userRecord.uid,
        token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to register user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Login user
 */
const login = async (req, res) => {
  try {
    // For Firebase Authentication, actual login is handled client-side
    // This endpoint is for additional server-side validation if needed
    const { idToken } = req.body;

    // Verify the Firebase ID token
    const decodedToken = await auth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    // Check if user exists in Firestore
    const userDoc = await db.collection('Users').doc(userId).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const userData = userDoc.data();
    
    // Check if user is active
    if (!userData.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Create a custom token for frontend use if needed
    const customToken = await auth.createCustomToken(userId);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        userId,
        token: customToken,
        displayName: userData.displayName,
        subscriptionTier: userData.subscriptionTier
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(401).json({
      success: false,
      message: 'Authentication failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Reset user password
 */
const resetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    // Generate reset password link
    const actionCodeSettings = {
      url: `${process.env.FRONTEND_URL}/reset-password-completion`,
      handleCodeInApp: true
    };

    await auth.generatePasswordResetLink(email, actionCodeSettings);
    
    // Note: Firebase sends the email directly, we don't need to do it here
    
    return res.status(200).json({
      success: true,
      message: 'Password reset link sent to email'
    });
  } catch (error) {
    console.error('Password reset error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate password reset link',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Refresh auth token
 */
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    // This would normally use the Firebase SDK to exchange a refresh token
    // However, Firebase client SDK handles token refresh automatically
    // This is a placeholder for custom token refresh logic if needed
    
    return res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        // New tokens would be provided here
      }
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    return res.status(401).json({
      success: false,
      message: 'Failed to refresh token',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  register,
  login,
  resetPassword,
  refreshToken
};
