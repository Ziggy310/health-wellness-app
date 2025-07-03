import { useState, useEffect } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import AuthService from '../services/AuthService';
import UserProfileService from '../services/UserProfileService';

export const useAuth = () => {
  const context = useAuthContext();
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const { user, profile, loading, setUser, setProfile, setLoading } = context;

  const signUp = async (email, password, metadata = {}) => {
    try {
      const { user: newUser } = await AuthService.signUp(email, password, metadata);
      
      if (newUser) {
        // Don't immediately set the user state here - let the auth state change listener handle it
        // This prevents the loop caused by multiple state updates
        
        // Create initial profile
        const profileData = {
          menopause_stage: 'UNKNOWN',
          has_hot_flashes: false,
          has_sleep_issues: false,
          has_mood_changes: false,
          energy_level: 3,
          has_cognitive_issues: false,
          health_conditions: [],
          is_onboarded: false
        };
        
        try {
          await UserProfileService.createProfile(newUser.id, profileData);
        } catch (profileError) {
          console.error('Error creating profile during signup:', profileError);
          // Don't throw here - the user is still created, profile can be created later
        }
      }
      
      return newUser;
    } catch (error) {
      // Only set loading to false on error, let the auth state listener handle success
      setLoading(false);
      throw error;
    }
  };

  const signIn = async (email, password) => {
    try {
      const { user: signedInUser } = await AuthService.signIn(email, password);
      return signedInUser;
    } catch (error) {
      // Only set loading to false on error, let the auth state listener handle success
      setLoading(false);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await AuthService.signOut();
      setUser(null);
      setProfile(null);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates) => {
    try {
      if (!user) throw new Error('No user found');
      
      const updatedProfile = await UserProfileService.updateProfile(user.id, updates);
      setProfile(updatedProfile);
      return updatedProfile;
    } catch (error) {
      throw error;
    }
  };

  const completeOnboarding = async (onboardingData) => {
    try {
      if (!user) throw new Error('No user found');
      
      const { profile: profileData, preferences, goals } = onboardingData;
      
      // Update profile
      const updatedProfile = await UserProfileService.updateProfile(user.id, {
        ...profileData,
        is_onboarded: true
      });
      
      // Save dietary preferences
      if (preferences) {
        await UserProfileService.saveDietaryPreferences(user.id, preferences);
      }
      
      // Save health goals
      if (goals) {
        await UserProfileService.saveHealthGoals(user.id, goals);
      }
      
      setProfile(updatedProfile);
      return updatedProfile;
    } catch (error) {
      throw error;
    }
  };

  const refreshProfile = async () => {
    try {
      if (!user) return null;
      
      const updatedProfile = await UserProfileService.getProfile(user.id);
      setProfile(updatedProfile);
      return updatedProfile;
    } catch (error) {
      console.error('Error refreshing profile:', error);
      return null;
    }
  };

  return {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    completeOnboarding,
    refreshProfile,
    isAuthenticated: !!user,
    isOnboarded: !!(profile?.is_onboarded)
  };
};