import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { useAuth } from '../hooks/useAuth';

const EditDietaryPreferences = () => {
  const navigate = useNavigate();
  const { dietaryPreferences, updateDietaryPreferences } = useAppContext();
  const { profile, updateProfile } = useAuth();
  
  // Initialize state with current preferences
  const [formData, setFormData] = useState({
    primaryDiet: '',
    allergies: [],
    restrictions: [],
    spiceLevel: 'medium',
    customRestrictions: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Load current preferences on component mount
  useEffect(() => {
    // Try to get preferences from multiple sources
    let currentPrefs = {};
    
    if (profile?.dietary_restrictions || profile?.allergies) {
      currentPrefs = {
        primaryDiet: profile.primary_diet || '',
        allergies: profile.allergies || [],
        restrictions: profile.dietary_restrictions || [],
        spiceLevel: profile.spice_tolerance || 'medium',
        customRestrictions: profile.custom_restrictions || ''
      };
    } else if (dietaryPreferences) {
      currentPrefs = {
        primaryDiet: dietaryPreferences.primaryDiet || '',
        allergies: dietaryPreferences.allergies || [],
        restrictions: dietaryPreferences.restrictions || [],
        spiceLevel: dietaryPreferences.spiceLevel || 'medium',
        customRestrictions: dietaryPreferences.customRestrictions || ''
      };
    } else {
      // Try localStorage
      try {
        const storedPrefs = localStorage.getItem('userPreferences');
        if (storedPrefs) {
          const prefs = JSON.parse(storedPrefs);
          currentPrefs = {
            primaryDiet: prefs.primaryDiet || '',
            allergies: prefs.allergies || [],
            restrictions: prefs.dietaryRestrictions || [],
            spiceLevel: prefs.spicePreference || 'medium',
            customRestrictions: prefs.customRestrictions || ''
          };
        }
      } catch (e) {
        console.error('Error reading preferences from localStorage:', e);
      }
    }
    
    setFormData(currentPrefs);
  }, [profile, dietaryPreferences]);

  const dietaryOptions = [
    { value: 'omnivore', label: 'Omnivore', description: 'I eat all types of food' },
    { value: 'vegetarian', label: 'Vegetarian', description: 'I don\'t eat meat or fish' },
    { value: 'vegan', label: 'Vegan', description: 'I don\'t eat any animal products' },
    { value: 'pescatarian', label: 'Pescatarian', description: 'I eat fish but not other meat' },
    { value: 'keto', label: 'Keto', description: 'Low-carb, high-fat diet' },
    { value: 'paleo', label: 'Paleo', description: 'Whole foods, no processed foods' }
  ];

  const allergyOptions = [
    'Nuts', 'Dairy', 'Gluten', 'Soy', 'Eggs', 'Shellfish', 'Fish', 'Sesame'
  ];

  const restrictionOptions = [
    'Low sodium', 'Sugar-free', 'Low-fat', 'High-protein', 'Raw food', 'Organic only'
  ];

  const spiceLevels = [
    { value: 'none', label: 'No Spice', description: 'I prefer bland foods' },
    { value: 'mild', label: 'Mild', description: 'Light seasoning is fine' },
    { value: 'medium', label: 'Medium', description: 'I enjoy moderate spice' },
    { value: 'hot', label: 'Hot', description: 'I love spicy food' }
  ];

  const handleDietaryChange = (diet) => {
    setFormData(prev => ({ ...prev, primaryDiet: diet }));
  };

  const handleAllergyToggle = (allergy) => {
    setFormData(prev => ({
      ...prev,
      allergies: prev.allergies.includes(allergy)
        ? prev.allergies.filter(a => a !== allergy)
        : [...prev.allergies, allergy]
    }));
  };

  const handleRestrictionToggle = (restriction) => {
    setFormData(prev => ({
      ...prev,
      restrictions: prev.restrictions.includes(restriction)
        ? prev.restrictions.filter(r => r !== restriction)
        : [...prev.restrictions, restriction]
    }));
  };

  const handleSpiceLevelChange = (level) => {
    setFormData(prev => ({ ...prev, spiceLevel: level }));
  };

  const handleCustomRestrictionsChange = (e) => {
    setFormData(prev => ({ ...prev, customRestrictions: e.target.value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    setSuccessMessage('');

    try {
      // Update context
      if (updateDietaryPreferences) {
        updateDietaryPreferences(formData);
      }

      // Update profile if using Supabase
      if (updateProfile) {
        await updateProfile({
          primary_diet: formData.primaryDiet,
          allergies: formData.allergies,
          dietary_restrictions: formData.restrictions,
          spice_tolerance: formData.spiceLevel,
          custom_restrictions: formData.customRestrictions
        });
      }

      // Always update localStorage as backup
      localStorage.setItem('userPreferences', JSON.stringify({
        primaryDiet: formData.primaryDiet,
        allergies: formData.allergies,
        dietaryRestrictions: formData.restrictions,
        spicePreference: formData.spiceLevel,
        customRestrictions: formData.customRestrictions
      }));

      setSuccessMessage('Dietary preferences updated successfully!');
      
      // Navigate back to dashboard after a short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);

    } catch (error) {
      console.error('Error updating dietary preferences:', error);
      alert('Failed to update preferences. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-700 to-purple-500 text-white px-4 pt-8 pb-6">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center mb-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="mr-4 p-2 rounded-lg bg-purple-800/30 hover:bg-purple-800/50 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold">Edit Dietary Preferences</h1>
              <p className="text-purple-100 mt-1">Update your dietary restrictions and allergies</p>
            </div>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="max-w-lg mx-auto px-4 pt-4">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
            {successMessage}
          </div>
        </div>
      )}

      {/* Form Content */}
      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        
        {/* Primary Diet */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-medium mb-4">Primary Diet</h2>
          <div className="space-y-3">
            {dietaryOptions.map((option) => (
              <label key={option.value} className="flex items-start cursor-pointer">
                <input
                  type="radio"
                  name="primaryDiet"
                  value={option.value}
                  checked={formData.primaryDiet === option.value}
                  onChange={() => handleDietaryChange(option.value)}
                  className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                />
                <div className="ml-3">
                  <div className="font-medium text-gray-900">{option.label}</div>
                  <div className="text-sm text-gray-500">{option.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Allergies */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-medium mb-4">
            Allergies & Food Sensitivities
            <span className="text-sm font-normal text-red-600 ml-2">🛡️ Critical for your safety</span>
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {allergyOptions.map((allergy) => (
              <label key={allergy} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.allergies.includes(allergy)}
                  onChange={() => handleAllergyToggle(allergy)}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm font-medium text-gray-900">{allergy}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Additional Dietary Restrictions */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-medium mb-4">Additional Dietary Restrictions</h2>
          <div className="grid grid-cols-1 gap-3">
            {restrictionOptions.map((restriction) => (
              <label key={restriction} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.restrictions.includes(restriction)}
                  onChange={() => handleRestrictionToggle(restriction)}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm font-medium text-gray-900">{restriction}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Spice Preference */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-medium mb-4">Spice Preference</h2>
          <div className="space-y-3">
            {spiceLevels.map((level) => (
              <label key={level.value} className="flex items-start cursor-pointer">
                <input
                  type="radio"
                  name="spiceLevel"
                  value={level.value}
                  checked={formData.spiceLevel === level.value}
                  onChange={() => handleSpiceLevelChange(level.value)}
                  className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                />
                <div className="ml-3">
                  <div className="font-medium text-gray-900">{level.label}</div>
                  <div className="text-sm text-gray-500">{level.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Custom Restrictions */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-medium mb-4">Custom Dietary Restrictions</h2>
          <textarea
            value={formData.customRestrictions}
            onChange={handleCustomRestrictionsChange}
            placeholder="Any other dietary restrictions or preferences we should know about? (e.g., avoiding specific ingredients, cultural dietary requirements, etc.)"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            rows={3}
          />
        </div>

        {/* Save Button */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Saving...
              </div>
            ) : (
              'Save Dietary Preferences'
            )}
          </button>
        </div>

        {/* Safety Notice */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Important Safety Notice
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>
                  Please ensure all allergies and food sensitivities are accurately listed. 
                  Our meal recommendations are filtered based on this information to keep you safe.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditDietaryPreferences;