import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useAppContext } from '../contexts/AppContext';
import Navigation from '../components/common/Navigation';

const Profile = () => {
  const navigate = useNavigate();
  const { user, profile, logout } = useAuth();
  const { dietaryPreferences, resetPreferences } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Get user data from multiple sources
  const getUserData = () => {
    // Try profile first
    if (profile) {
      return {
        name: profile.name || user?.name || 'User',
        email: profile.email || user?.email || 'user@example.com',
        menopauseStage: profile.menopause_stage || 'Not specified',
        energyLevel: profile.energy_level || 'Not specified',
        primaryDiet: profile.primary_diet || dietaryPreferences?.primaryDiet || 'Not specified',
        allergies: profile.allergies || dietaryPreferences?.allergies || [],
        restrictions: profile.dietary_restrictions || dietaryPreferences?.restrictions || [],
        spiceTolerance: profile.spice_tolerance || dietaryPreferences?.spiceLevel || 'medium'
      };
    }

    // Fallback to localStorage and context
    try {
      const storedData = localStorage.getItem('onboardingData');
      const storedPrefs = localStorage.getItem('userPreferences');
      
      const onboardingData = storedData ? JSON.parse(storedData) : {};
      const userPrefs = storedPrefs ? JSON.parse(storedPrefs) : {};

      return {
        name: user?.name || onboardingData.profile?.name || 'User',
        email: user?.email || 'user@example.com',
        menopauseStage: onboardingData.profile?.menopause_stage || 'Not specified',
        energyLevel: onboardingData.profile?.energy_level || 'Not specified',
        primaryDiet: onboardingData.preferences?.primary_diet || dietaryPreferences?.primaryDiet || 'Not specified',
        allergies: userPrefs.allergies || dietaryPreferences?.allergies || [],
        restrictions: userPrefs.dietaryRestrictions || dietaryPreferences?.restrictions || [],
        spiceTolerance: userPrefs.spicePreference || dietaryPreferences?.spiceLevel || 'medium'
      };
    } catch (e) {
      console.error('Error reading user data:', e);
      return {
        name: user?.name || 'User',
        email: user?.email || 'user@example.com',
        menopauseStage: 'Not specified',
        energyLevel: 'Not specified',
        primaryDiet: 'Not specified',
        allergies: [],
        restrictions: [],
        spiceTolerance: 'medium'
      };
    }
  };

  const userData = getUserData();

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
    setIsLoading(false);
    setShowLogoutConfirm(false);
  };

  const handleResetPreferences = async () => {
    setIsLoading(true);
    try {
      await resetPreferences();
      // Clear localStorage
      localStorage.removeItem('onboardingData');
      localStorage.removeItem('userPreferences');
      // Navigate to onboarding
      navigate('/onboarding');
    } catch (error) {
      console.error('Reset preferences error:', error);
    }
    setIsLoading(false);
  };

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const formatList = (items) => {
    if (!items || items.length === 0) return 'None';
    return items.join(', ');
  };

  const capitalizeFirst = (str) => {
    if (!str || typeof str !== 'string') return 'Not specified';
    return str.charAt(0).toUpperCase() + str.slice(1).replace(/([A-Z])/g, ' $1');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-700 to-purple-500 text-white px-4 pt-8 pb-16">
        <div className="flex items-center max-w-lg mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 hover:bg-purple-800/30 rounded-lg transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Profile</h1>
            <p className="text-purple-100 mt-1">Manage your account and preferences</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 max-w-lg mx-auto -mt-10">
        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold mr-4">
              {userData.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{userData.name}</h2>
              <p className="text-gray-600">{userData.email}</p>
            </div>
          </div>

          {/* Health Profile Section */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Health Profile</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Menopause Stage:</span>
                <span className="font-medium">{capitalizeFirst(userData.menopauseStage)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Energy Level:</span>
                <span className="font-medium">{capitalizeFirst(userData.energyLevel)}</span>
              </div>
            </div>
          </div>

          {/* Dietary Preferences Section */}
          <div className="border-t pt-6 mt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Dietary Preferences</h3>
              <button
                onClick={() => navigate('/edit-dietary-preferences')}
                className="text-purple-600 text-sm font-medium hover:text-purple-700 transition-colors"
              >
                Edit
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Primary Diet:</span>
                <span className="font-medium">{capitalizeFirst(userData.primaryDiet)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Spice Tolerance:</span>
                <span className="font-medium">{capitalizeFirst(userData.spiceTolerance)}</span>
              </div>
              <div>
                <span className="text-gray-600">Allergies:</span>
                <p className="font-medium mt-1">{formatList(userData.allergies)}</p>
              </div>
              <div>
                <span className="text-gray-600">Dietary Restrictions:</span>
                <p className="font-medium mt-1">{formatList(userData.restrictions)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/my-favorites')}
              className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
                <span>My Favorites</span>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <button
              onClick={() => navigate('/meal-plan')}
              className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Meal Plans</span>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <button
              onClick={() => navigate('/edit-dietary-preferences')}
              className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Dietary Preferences</span>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Account Settings</h3>
          <div className="space-y-3">
            <button
              onClick={handleResetPreferences}
              disabled={isLoading}
              className="w-full flex items-center justify-between p-3 rounded-lg border border-orange-200 text-orange-600 hover:bg-orange-50 transition-colors disabled:opacity-50"
            >
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Reset All Preferences</span>
              </div>
            </button>

            <button
              onClick={() => setShowLogoutConfirm(true)}
              disabled={isLoading}
              className="w-full flex items-center justify-between p-3 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Sign Out</span>
              </div>
            </button>
          </div>
        </div>

        {/* App Info */}
        <div className="bg-gray-100 rounded-xl p-6 mb-6">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Menopause Meal Planner</h3>
            <p className="text-sm text-gray-600 mb-4">
              Personalized nutrition support for your menopause journey
            </p>
            <div className="text-xs text-gray-500">
              Version 1.0.0
            </div>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Sign Out</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to sign out?</p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="flex-1 px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Signing out...' : 'Sign Out'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <Navigation />
    </div>
  );
};

export default Profile;