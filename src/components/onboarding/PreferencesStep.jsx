import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Utensils, Clock, AlertCircle, Sparkles, Star, Heart, Leaf, Shield } from 'lucide-react';

const PreferencesStep = ({ data, onDataChange }) => {
  const [formData, setFormData] = useState({
    primary_diet: 'OMNIVORE',
    allergies: [],
    dislikes: [],
    preferences: [],
    is_gluten_free: false,
    is_dairy_free: false,
    is_nut_free: false,
    prep_time_preference: 30
  });

  const isInitialized = useRef(false);

  // Initialize form data from props only once
  useEffect(() => {
    if (!isInitialized.current && data.preferences && Object.keys(data.preferences).length > 0) {
      setFormData(prev => ({ ...prev, ...data.preferences }));
      isInitialized.current = true;
    }
  }, [data.preferences]);

  // Direct state change handlers that update parent immediately
  const handleDataChange = useCallback((field, value) => {
    const newFormData = {
      ...formData,
      [field]: value
    };
    setFormData(newFormData);
    
    // 🛡️ SAFETY: Store preferences in localStorage as backup
    try {
      // Transform data to match filtering expectations
      const safetyData = {
        primaryDiet: newFormData.primary_diet,
        allergies: newFormData.allergies,
        dietaryRestrictions: newFormData.dislikes,
        spicePreference: newFormData.dislikes.includes('Spicy Food') ? 'none' : 'medium',
        isNutFree: newFormData.is_nut_free,
        isGlutenFree: newFormData.is_gluten_free,
        isDairyFree: newFormData.is_dairy_free
      };
      localStorage.setItem('userPreferences', JSON.stringify(safetyData));
      console.log('✅ User preferences saved to localStorage:', safetyData);
    } catch (e) {
      console.error('Failed to save preferences to localStorage:', e);
    }
    
    onDataChange('preferences', newFormData);
  }, [formData, onDataChange]);

  const handleArrayToggleWithCallback = useCallback((field, item) => {
    const newArray = formData[field].includes(item)
      ? formData[field].filter(i => i !== item)
      : [...formData[field], item];
    
    const newFormData = {
      ...formData,
      [field]: newArray
    };
    setFormData(newFormData);
    
    // 🛡️ SAFETY: Store preferences in localStorage as backup
    try {
      // Transform data to match filtering expectations
      const safetyData = {
        primaryDiet: newFormData.primary_diet,
        allergies: newFormData.allergies,
        dietaryRestrictions: newFormData.dislikes,
        spicePreference: newFormData.dislikes.includes('Spicy Food') ? 'none' : 'medium',
        isNutFree: newFormData.is_nut_free,
        isGlutenFree: newFormData.is_gluten_free,
        isDairyFree: newFormData.is_dairy_free
      };
      localStorage.setItem('userPreferences', JSON.stringify(safetyData));
      console.log('✅ User preferences saved to localStorage:', safetyData);
    } catch (e) {
      console.error('Failed to save preferences to localStorage:', e);
    }
    
    onDataChange('preferences', newFormData);
  }, [formData, onDataChange]);

  const dietTypes = [
    { 
      value: 'OMNIVORE', 
      label: 'Omnivore', 
      desc: 'I eat everything', 
      icon: '🍽️', 
      color: 'from-emerald-400 to-teal-400',
      bgColor: 'bg-emerald-50'
    },
    { 
      value: 'VEGETARIAN', 
      label: 'Vegetarian', 
      desc: 'No meat or fish', 
      icon: '🥬', 
      color: 'from-green-400 to-emerald-400',
      bgColor: 'bg-green-50'
    },
    { 
      value: 'VEGAN', 
      label: 'Vegan', 
      desc: 'No animal products', 
      icon: '🌱', 
      color: 'from-lime-400 to-green-400',
      bgColor: 'bg-lime-50'
    },
    { 
      value: 'PESCATARIAN', 
      label: 'Pescatarian', 
      desc: 'Fish but no meat', 
      icon: '🐟', 
      color: 'from-cyan-400 to-blue-400',
      bgColor: 'bg-cyan-50'
    },
    { 
      value: 'MEDITERRANEAN', 
      label: 'Mediterranean', 
      desc: 'Mediterranean-style eating', 
      icon: '🫒', 
      color: 'from-amber-400 to-orange-400',
      bgColor: 'bg-amber-50'
    },
    { 
      value: 'LOW_CARB', 
      label: 'Low Carb', 
      desc: 'Reduced carbohydrates', 
      icon: '🥩', 
      color: 'from-red-400 to-pink-400',
      bgColor: 'bg-red-50'
    },
    { 
      value: 'PALEO', 
      label: 'Paleo', 
      desc: 'Whole foods, no processed', 
      icon: '🦴', 
      color: 'from-stone-400 to-amber-400',
      bgColor: 'bg-stone-50'
    },
    { 
      value: 'KETO', 
      label: 'Keto', 
      desc: 'Very low carb, high fat', 
      icon: '🥑', 
      color: 'from-purple-400 to-pink-400',
      bgColor: 'bg-purple-50'
    }
  ];

  const commonAllergies = [
    { name: 'Nuts', color: 'bg-red-100 text-red-800 border-red-300', emoji: '🥜' },
    { name: 'Dairy', color: 'bg-blue-100 text-blue-800 border-blue-300', emoji: '🥛' },
    { name: 'Gluten', color: 'bg-amber-100 text-amber-800 border-amber-300', emoji: '🌾' },
    { name: 'Shellfish', color: 'bg-orange-100 text-orange-800 border-orange-300', emoji: '🦐' },
    { name: 'Eggs', color: 'bg-yellow-100 text-yellow-800 border-yellow-300', emoji: '🥚' },
    { name: 'Soy', color: 'bg-green-100 text-green-800 border-green-300', emoji: '🫘' },
    { name: 'Fish', color: 'bg-cyan-100 text-cyan-800 border-cyan-300', emoji: '🐠' },
    { name: 'Sesame', color: 'bg-purple-100 text-purple-800 border-purple-300', emoji: '🌰' }
  ];

  const commonDislikes = [
    { name: 'Spicy Food', color: 'bg-red-100 text-red-800 border-red-300', emoji: '🌶️' },
    { name: 'Fish', color: 'bg-blue-100 text-blue-800 border-blue-300', emoji: '🐟' },
    { name: 'Mushrooms', color: 'bg-gray-100 text-gray-800 border-gray-300', emoji: '🍄' },
    { name: 'Onions', color: 'bg-purple-100 text-purple-800 border-purple-300', emoji: '🧅' },
    { name: 'Cilantro', color: 'bg-green-100 text-green-800 border-green-300', emoji: '🌿' },
    { name: 'Coconut', color: 'bg-amber-100 text-amber-800 border-amber-300', emoji: '🥥' },
    { name: 'Olives', color: 'bg-emerald-100 text-emerald-800 border-emerald-300', emoji: '🫒' },
    { name: 'Blue Cheese', color: 'bg-indigo-100 text-indigo-800 border-indigo-300', emoji: '🧀' }
  ];

  const foodPreferences = [
    { name: 'Organic', color: 'bg-green-100 text-green-800 border-green-300', emoji: '🌱' },
    { name: 'Local/Seasonal', color: 'bg-amber-100 text-amber-800 border-amber-300', emoji: '🏡' },
    { name: 'Anti-inflammatory', color: 'bg-red-100 text-red-800 border-red-300', emoji: '🔥' },
    { name: 'High Protein', color: 'bg-purple-100 text-purple-800 border-purple-300', emoji: '💪' },
    { name: 'High Fiber', color: 'bg-emerald-100 text-emerald-800 border-emerald-300', emoji: '🌾' },
    { name: 'Low Sodium', color: 'bg-blue-100 text-blue-800 border-blue-300', emoji: '🧂' },
    { name: 'Superfoods', color: 'bg-indigo-100 text-indigo-800 border-indigo-300', emoji: '⭐' },
    { name: 'Comfort Foods', color: 'bg-orange-100 text-orange-800 border-orange-300', emoji: '🤗' }
  ];

  const prepTimes = [
    { value: 15, label: '15 minutes', desc: 'Quick & easy', icon: '⚡', color: 'from-yellow-400 to-orange-400' },
    { value: 30, label: '30 minutes', desc: 'Moderate prep', icon: '⏰', color: 'from-blue-400 to-cyan-400' },
    { value: 45, label: '45 minutes', desc: 'More involved', icon: '🍳', color: 'from-purple-400 to-pink-400' },
    { value: 60, label: '1+ hours', desc: 'I love cooking', icon: '👨‍🍳', color: 'from-green-400 to-emerald-400' }
  ];

  return (
    <div className="space-y-12">
      {/* Beautiful Header */}
      <div className="text-center mb-12">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 rounded-full blur-lg opacity-30 animate-pulse"></div>
          <div className="relative bg-white rounded-full p-4 shadow-lg">
            <Utensils className="w-8 h-8 text-teal-600" />
          </div>
        </div>
        <h2 className="text-4xl font-bold bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 bg-clip-text text-transparent mt-6 mb-4">
          Dietary Preferences
        </h2>
        <p className="text-xl text-gray-600 max-w-lg mx-auto leading-relaxed">
          Tell us about your food preferences and restrictions so we can create meals you'll absolutely love
        </p>
      </div>

      {/* Primary Diet - Enhanced */}
      <div className="space-y-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
            <Leaf className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">What best describes your diet?</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dietTypes.map((diet, index) => (
            <div
              key={diet.value}
              className={`group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
                formData.primary_diet === diet.value
                  ? 'ring-4 ring-emerald-400 ring-opacity-50 shadow-2xl'
                  : 'hover:shadow-xl'
              }`}
              onClick={() => handleDataChange('primary_diet', diet.value)}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${diet.color} opacity-10`}></div>
              <div className={`relative p-6 bg-white border-2 ${formData.primary_diet === diet.value ? 'border-emerald-300' : 'border-gray-100'} rounded-2xl transition-all duration-300`}>
                <div className="flex items-center space-x-4">
                  <div className={`text-3xl p-2 rounded-full ${diet.bgColor}`}>
                    {diet.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        checked={formData.primary_diet === diet.value}
                        onChange={() => handleDataChange('primary_diet', diet.value)}
                        className="w-5 h-5 text-emerald-600 border-2 border-gray-300 focus:ring-emerald-500"
                      />
                      <h4 className="text-lg font-semibold text-gray-900">{diet.label}</h4>
                    </div>
                    <p className="text-gray-600 mt-1">{diet.desc}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Allergies & Restrictions - Enhanced */}
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Food allergies or restrictions?</h3>
        </div>
        
        <div className="space-y-6">
          {/* Common allergies */}
          <div>
            <div className="text-sm font-medium text-gray-700 mb-4 flex items-center">
              <AlertCircle className="w-4 h-4 mr-2 text-red-500" />
              Select any allergies (important for safety):
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {commonAllergies.map((allergy, index) => (
                <button
                  key={allergy.name}
                  type="button"
                  onClick={() => handleArrayToggleWithCallback('allergies', allergy.name)}
                  className={`group relative overflow-hidden rounded-xl p-4 text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                    formData.allergies.includes(allergy.name)
                      ? `${allergy.color} shadow-lg ring-2 ring-red-400 ring-opacity-50`
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-2 border-gray-200'
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-pink-400 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                  <div className="relative flex flex-col items-center space-y-2">
                    <span className="text-2xl">{allergy.emoji}</span>
                    <span>{allergy.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Special diet toggles */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Additional dietary needs:</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { key: 'is_gluten_free', label: 'Gluten-Free', icon: '🌾' },
                { key: 'is_dairy_free', label: 'Dairy-Free', icon: '🥛' },
                { key: 'is_nut_free', label: 'Nut-Free', icon: '🥜' }
              ].map((option) => (
                <label key={option.key} className="group flex items-center p-4 bg-white rounded-xl border-2 border-gray-100 hover:border-blue-200 cursor-pointer transition-all duration-300">
                  <input
                    type="checkbox"
                    checked={formData[option.key]}
                    onChange={(e) => handleDataChange(option.key, e.target.checked)}
                    className="w-5 h-5 mr-3 text-blue-600 focus:ring-blue-500 border-2 border-gray-300"
                  />
                  <span className="text-2xl mr-3">{option.icon}</span>
                  <span className="text-sm font-medium text-gray-900">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Food Dislikes - Enhanced */}
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold">❌</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Foods you prefer to avoid?</h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {commonDislikes.map((dislike, index) => (
            <button
              key={dislike.name}
              type="button"
              onClick={() => handleArrayToggleWithCallback('dislikes', dislike.name)}
              className={`group relative overflow-hidden rounded-xl p-4 text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                formData.dislikes.includes(dislike.name)
                  ? `${dislike.color} shadow-lg ring-2 ring-orange-400 ring-opacity-50`
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-2 border-gray-200'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-400 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <div className="relative flex flex-col items-center space-y-2">
                <span className="text-2xl">{dislike.emoji}</span>
                <span>{dislike.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Food Preferences - Enhanced */}
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
            <Heart className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">What food qualities do you prioritize?</h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {foodPreferences.map((preference, index) => (
            <button
              key={preference.name}
              type="button"
              onClick={() => handleArrayToggleWithCallback('preferences', preference.name)}
              className={`group relative overflow-hidden rounded-xl p-4 text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                formData.preferences.includes(preference.name)
                  ? `${preference.color} shadow-lg ring-2 ring-green-400 ring-opacity-50`
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-2 border-gray-200'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <div className="relative flex flex-col items-center space-y-2">
                <span className="text-2xl">{preference.emoji}</span>
                <span>{preference.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Prep Time - Enhanced */}
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <Clock className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">How much time do you prefer for meal prep?</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {prepTimes.map((time, index) => (
            <div
              key={time.value}
              className={`group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
                formData.prep_time_preference === time.value
                  ? 'ring-4 ring-purple-400 ring-opacity-50 shadow-2xl'
                  : 'hover:shadow-xl'
              }`}
              onClick={() => handleDataChange('prep_time_preference', time.value)}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${time.color} opacity-10`}></div>
              <div className={`relative p-6 bg-white border-2 ${formData.prep_time_preference === time.value ? 'border-purple-300' : 'border-gray-100'} rounded-2xl transition-all duration-300`}>
                <div className="flex items-center space-x-4">
                  <div className="text-3xl p-2 bg-purple-50 rounded-full">
                    {time.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        checked={formData.prep_time_preference === time.value}
                        onChange={() => handleDataChange('prep_time_preference', time.value)}
                        className="w-5 h-5 text-purple-600 border-2 border-gray-300 focus:ring-purple-500"
                      />
                      <h4 className="text-lg font-semibold text-gray-900">{time.label}</h4>
                    </div>
                    <p className="text-gray-600 mt-1">{time.desc}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Completion Encouragement */}
      <div className="bg-gradient-to-r from-teal-500 via-emerald-500 to-green-500 rounded-2xl p-8 text-white text-center shadow-2xl">
        <div className="flex justify-center mb-4">
          <div className="flex space-x-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-3 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: `${i * 200}ms` }}></div>
            ))}
          </div>
        </div>
        <h3 className="text-2xl font-bold mb-2">Fantastic Choices! 🍃</h3>
        <p className="text-emerald-100 text-lg">
          We're learning so much about your preferences. This will help us recommend meals that perfectly match your taste and dietary needs.
        </p>
      </div>
    </div>
  );
};

export default PreferencesStep;