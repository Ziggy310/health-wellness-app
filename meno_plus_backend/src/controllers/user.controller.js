const { db } = require('../config/firebase');

/**
 * Get user profile
 */
const getUserProfile = async (req, res) => {
  try {
    const userId = req.userId;
    
    // Get user profile from Firestore
    const userProfileRef = db.collection('UserProfiles').doc(userId);
    const userProfile = await userProfileRef.get();
    
    if (!userProfile.exists) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: userProfile.data()
    });
  } catch (error) {
    console.error('Error getting user profile:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve user profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Update user profile
 */
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const profileData = req.body;
    
    // Update user profile in Firestore
    const userProfileRef = db.collection('UserProfiles').doc(userId);
    await userProfileRef.update({
      ...profileData,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    return res.status(200).json({
      success: true,
      message: 'User profile updated successfully'
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update user profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Submit onboarding information
 */
const submitOnboarding = async (req, res) => {
  try {
    const userId = req.userId;
    const { 
      menopauseStage, 
      symptoms, 
      dietaryPreferences, 
      healthGoals 
    } = req.body;
    
    // Create batch to handle multiple writes atomically
    const batch = db.batch();
    
    // Create user profile
    const userProfileRef = db.collection('UserProfiles').doc(userId);
    batch.set(userProfileRef, {
      userId,
      menopauseStage,
      ...symptoms,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    // Create dietary preferences
    const dietaryPreferencesRef = db.collection('DietaryPreferences').doc(userId);
    batch.set(dietaryPreferencesRef, {
      userId,
      ...dietaryPreferences,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    // Create health goals
    const healthGoalsRef = db.collection('HealthGoals').doc(userId);
    batch.set(healthGoalsRef, {
      userId,
      ...healthGoals,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    // Commit the batch
    await batch.commit();
    
    return res.status(201).json({
      success: true,
      message: 'Onboarding information saved successfully'
    });
  } catch (error) {
    console.error('Error submitting onboarding information:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to save onboarding information',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  submitOnboarding
};
