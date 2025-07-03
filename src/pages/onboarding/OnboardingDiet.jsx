import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import { DietType } from '../../utils/types';

const OnboardingDiet = () => {
  const navigate = useNavigate();
  const { setDietaryPreferences } = useAppContext();
  
  const [formData, setFormData] = useState({
    primaryDiet: DietType.OMNIVORE,
    isGlutenFree: false,
    isDairyFree: false,
    isNutFree: false,
    allergies: [],
    dislikes: [],
    preferences: [],
    prepTimePreference: 30,
  });
  
  const [allergyInput, setAllergyInput] = useState('');
  const [dislikeInput, setDislikeInput] = useState('');
  const [preferenceInput, setPreferenceInput] = useState('');
  
  // Diet types with descriptions
  const dietTypes = [
    { value: DietType.OMNIVORE, label: 'Omnivore', description: 'Includes all food groups' },
    { value: DietType.VEGETARIAN, label: 'Vegetarian', description: 'No meat, but includes dairy and eggs' },
    { value: DietType.VEGAN, label: 'Vegan', description: 'Plant-based only, no animal products' },
    { value: DietType.PESCATARIAN, label: 'Pescatarian', description: 'Includes fish, but no other meat' },
    { value: DietType.MEDITERRANEAN, label: 'Mediterranean', description: 'Rich in vegetables, fruits, whole grains, seafood' },
    { value: DietType.LOW_CARB, label: 'Low carb', description: 'Reduced carbohydrate intake' },
    { value: DietType.PALEO, label: 'Paleo', description: 'Based on foods available to early humans' },
    { value: DietType.KETO, label: 'Keto', description: 'High fat, moderate protein, low carb' },
  ];
  
  // Suggested preferences for meal planning
  const suggestedPreferences = [
    'Mediterranean-inspired',
    'Anti-inflammatory',
    'High protein',
    'Plant-forward',
    'Quick meals',
    'High-calcium',
    'High-fiber',
    'Gut-friendly'
  ];
  
  // Handle primary diet selection
  const handleDietChange = (diet) => {
    setFormData({
      ...formData,
      primaryDiet: diet,
    });
  };
  
  // Handle checkbox changes
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked,
    });
  };
  
  // Handle adding an allergy
  const handleAddAllergy = () => {
    if (allergyInput.trim() && !formData.allergies.includes(allergyInput.trim())) {
      setFormData({
        ...formData,
        allergies: [...formData.allergies, allergyInput.trim()],
      });
      setAllergyInput('');
    }
  };
  
  // Handle removing an allergy
  const handleRemoveAllergy = (allergy) => {
    setFormData({
      ...formData,
      allergies: formData.allergies.filter(a => a !== allergy),
    });
  };
  
  // Handle adding a dislike
  const handleAddDislike = () => {
    if (dislikeInput.trim() && !formData.dislikes.includes(dislikeInput.trim())) {
      setFormData({
        ...formData,
        dislikes: [...formData.dislikes, dislikeInput.trim()],
      });
      setDislikeInput('');
    }
  };
  
  // Handle removing a dislike
  const handleRemoveDislike = (dislike) => {
    setFormData({
      ...formData,
      dislikes: formData.dislikes.filter(d => d !== dislike),
    });
  };
  
  // Handle toggling a preference
  const handleTogglePreference = (preference) => {
    if (formData.preferences.includes(preference)) {
      setFormData({
        ...formData,
        preferences: formData.preferences.filter(p => p !== preference),
      });
    } else {
      setFormData({
        ...formData,
        preferences: [...formData.preferences, preference],
      });
    }
  };
  
  // Handle adding a custom preference
  const handleAddPreference = () => {
    if (preferenceInput.trim() && !formData.preferences.includes(preferenceInput.trim())) {
      setFormData({
        ...formData,
        preferences: [...formData.preferences, preferenceInput.trim()],
      });
      setPreferenceInput('');
    }
  };
  
  // Handle prep time preference change
  const handlePrepTimeChange = (e) => {
    setFormData({
      ...formData,
      prepTimePreference: parseInt(e.target.value),
    });
  };
  
  // Handle form submission
  const handleSubmit = () => {
    // Save dietary preferences to context
    setDietaryPreferences(formData);
    
    // Navigate to next step
    navigate('/onboarding/goals');
  };

  return (
    <div className="min-h-screen flex flex-col px-4 py-8 max-w-lg mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-purple-600">Dietary Preferences</h1>
        <p className="text-gray-600">Help us create meal plans perfectly suited to your needs</p>
      </div>
      
      <div className="space-y-8 mb-8">
        {/* Primary diet */}
        <div className="bg-white p-5 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-4">What best describes your eating style?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {dietTypes.map(diet => (
              <button
                key={diet.value}
                onClick={() => handleDietChange(diet.value)}
                className={`p-3 border rounded-lg text-left ${
                  formData.primaryDiet === diet.value
                    ? 'bg-purple-100 border-purple-300'
                    : 'bg-white hover:bg-gray-50'
                }`}
              >
                <span className="block font-medium">{diet.label}</span>
                <span className="text-xs text-gray-500">{diet.description}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Dietary restrictions */}
        <div className="bg-white p-5 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-4">Any dietary restrictions?</h2>
          
          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="isGlutenFree"
                checked={formData.isGlutenFree}
                onChange={handleCheckboxChange}
                className="h-5 w-5 text-purple-600 rounded focus:ring-purple-500"
              />
              <span>Gluten-free</span>
            </label>
            
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="isDairyFree"
                checked={formData.isDairyFree}
                onChange={handleCheckboxChange}
                className="h-5 w-5 text-purple-600 rounded focus:ring-purple-500"
              />
              <span>Dairy-free</span>
            </label>
            
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="isNutFree"
                checked={formData.isNutFree}
                onChange={handleCheckboxChange}
                className="h-5 w-5 text-purple-600 rounded focus:ring-purple-500"
              />
              <span>Nut-free</span>
            </label>
          </div>
          
          {/* Allergies */}
          <div className="mt-5">
            <h3 className="font-medium mb-2">Any food allergies?</h3>
            
            <div className="flex space-x-2">
              <input
                type="text"
                value={allergyInput}
                onChange={(e) => setAllergyInput(e.target.value)}
                className="flex-grow p-2 border rounded focus:ring-purple-500 focus:border-purple-500"
                placeholder="Enter an allergy"
              />
              <button
                onClick={handleAddAllergy}
                className="px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 focus:outline-none"
              >
                Add
              </button>
            </div>
            
            {formData.allergies.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {formData.allergies.map(allergy => (
                  <div key={allergy} className="flex items-center bg-purple-100 px-3 py-1 rounded">
                    <span>{allergy}</span>
                    <button
                      onClick={() => handleRemoveAllergy(allergy)}
                      className="ml-2 text-gray-500 hover:text-red-500"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Food dislikes */}
        <div className="bg-white p-5 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-4">Any foods you dislike?</h2>
          
          <div className="flex space-x-2">
            <input
              type="text"
              value={dislikeInput}
              onChange={(e) => setDislikeInput(e.target.value)}
              className="flex-grow p-2 border rounded focus:ring-purple-500 focus:border-purple-500"
              placeholder="Enter a food you dislike"
            />
            <button
              onClick={handleAddDislike}
              className="px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 focus:outline-none"
            >
              Add
            </button>
          </div>
          
          {formData.dislikes.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {formData.dislikes.map(dislike => (
                <div key={dislike} className="flex items-center bg-purple-100 px-3 py-1 rounded">
                  <span>{dislike}</span>
                  <button
                    onClick={() => handleRemoveDislike(dislike)}
                    className="ml-2 text-gray-500 hover:text-red-500"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Meal preferences */}
        <div className="bg-white p-5 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-4">What kind of meals would you prefer?</h2>
          <p className="text-sm text-gray-500 mb-3">Select all that apply</p>
          
          <div className="grid grid-cols-2 gap-3 mb-4">
            {suggestedPreferences.map(preference => (
              <button
                key={preference}
                onClick={() => handleTogglePreference(preference)}
                className={`p-3 border rounded-lg text-center ${
                  formData.preferences.includes(preference)
                    ? 'bg-purple-100 border-purple-300'
                    : 'bg-white hover:bg-gray-50'
                }`}
              >
                {preference}
              </button>
            ))}
          </div>
          
          <div className="flex space-x-2">
            <input
              type="text"
              value={preferenceInput}
              onChange={(e) => setPreferenceInput(e.target.value)}
              className="flex-grow p-2 border rounded focus:ring-purple-500 focus:border-purple-500"
              placeholder="Add your own preference"
            />
            <button
              onClick={handleAddPreference}
              className="px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 focus:outline-none"
            >
              Add
            </button>
          </div>
        </div>
        
        {/* Prep time preference */}
        <div className="bg-white p-5 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-4">How much time do you want to spend preparing meals?</h2>
          
          <input
            type="range"
            min="15"
            max="60"
            step="5"
            value={formData.prepTimePreference}
            onChange={handlePrepTimeChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>15 minutes</span>
            <span>30 minutes</span>
            <span>45 minutes</span>
            <span>60 minutes</span>
          </div>
          
          <p className="mt-4 text-center font-medium">
            Preferred prep time: <span className="text-purple-600">{formData.prepTimePreference} minutes</span>
          </p>
        </div>
      </div>
      
      <div className="sticky bottom-0 bg-white pt-4 pb-8 -mx-4 px-4">
        <div className="flex justify-between">
          <button
            onClick={() => navigate('/onboarding/symptoms')}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Back
          </button>
          
          <button
            onClick={handleSubmit}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingDiet;