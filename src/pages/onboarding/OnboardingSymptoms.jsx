import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import { MenopauseStage, SymptomCategory } from '../../utils/types';

const OnboardingSymptoms = () => {
  const navigate = useNavigate();
  const { setUserProfile, setTopSymptoms } = useAppContext();
  
  const [formData, setFormData] = useState({
    menopauseStage: MenopauseStage.UNKNOWN,
    lastPeriodDate: '',
    hasHotFlashes: false,
    hasSleepIssues: false,
    hasMoodChanges: false,
    hasCognitiveIssues: false,
    energyLevel: 3,
    otherSymptoms: []
  });
  
  const commonSymptoms = [
    { id: 'hotFlashes', name: 'Hot flashes', category: SymptomCategory.PHYSICAL },
    { id: 'nightSweats', name: 'Night sweats', category: SymptomCategory.PHYSICAL },
    { id: 'sleepIssues', name: 'Sleep issues', category: SymptomCategory.SLEEP },
    { id: 'fatigue', name: 'Fatigue', category: SymptomCategory.PHYSICAL },
    { id: 'moodChanges', name: 'Mood changes', category: SymptomCategory.EMOTIONAL },
    { id: 'irritability', name: 'Irritability', category: SymptomCategory.EMOTIONAL },
    { id: 'anxiety', name: 'Anxiety', category: SymptomCategory.EMOTIONAL },
    { id: 'depression', name: 'Depression', category: SymptomCategory.EMOTIONAL },
    { id: 'brainFog', name: 'Brain fog', category: SymptomCategory.COGNITIVE },
    { id: 'memoryIssues', name: 'Memory issues', category: SymptomCategory.COGNITIVE },
    { id: 'weightGain', name: 'Weight gain', category: SymptomCategory.PHYSICAL },
    { id: 'jointPain', name: 'Joint pain', category: SymptomCategory.PHYSICAL },
    { id: 'headaches', name: 'Headaches', category: SymptomCategory.PHYSICAL },
    { id: 'dryness', name: 'Vaginal dryness', category: SymptomCategory.PHYSICAL },
  ];
  
  // Handle checkbox changes
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked,
    });
  };
  
  // Handle radio button changes
  const handleRadioChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  // Handle slider changes
  const handleSliderChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: parseInt(value),
    });
  };
  
  // Handle date changes
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle symptom selection
  const handleSymptomSelection = (symptomId) => {
    const currentSymptoms = [...formData.otherSymptoms];
    
    if (currentSymptoms.includes(symptomId)) {
      // Remove if already selected
      setFormData({
        ...formData,
        otherSymptoms: currentSymptoms.filter(id => id !== symptomId)
      });
    } else {
      // Add if not selected
      setFormData({
        ...formData,
        otherSymptoms: [...currentSymptoms, symptomId]
      });
    }
  };
  
  // Handle form submission
  const handleSubmit = () => {
    // Create user profile from form data
    const userProfile = {
      menopauseStage: formData.menopauseStage,
      lastPeriodDate: formData.lastPeriodDate ? new Date(formData.lastPeriodDate) : null,
      hasHotFlashes: formData.hasHotFlashes,
      hasSleepIssues: formData.hasSleepIssues,
      hasMoodChanges: formData.hasMoodChanges,
      hasCognitiveIssues: formData.hasCognitiveIssues,
      energyLevel: formData.energyLevel,
      healthConditions: [], // Will be populated in a later step
    };
    
    // Create symptom list
    const topSymptoms = formData.otherSymptoms.map(sympId => {
      const symptom = commonSymptoms.find(s => s.id === sympId);
      return {
        id: symptom.id,
        name: symptom.name,
        category: symptom.category,
        severity: 3, // Default severity, could make this configurable
      };
    });
    
    // If specific symptoms are checked, make sure they're in the list
    if (formData.hasHotFlashes) {
      const hotFlash = commonSymptoms.find(s => s.id === 'hotFlashes');
      topSymptoms.push({
        id: hotFlash.id,
        name: hotFlash.name,
        category: hotFlash.category,
        severity: 4, // Critical symptom
      });
    }
    
    if (formData.hasSleepIssues) {
      const sleepIssues = commonSymptoms.find(s => s.id === 'sleepIssues');
      topSymptoms.push({
        id: sleepIssues.id,
        name: sleepIssues.name,
        category: sleepIssues.category,
        severity: 4, // Critical symptom
      });
    }
    
    if (formData.hasMoodChanges) {
      const moodChanges = commonSymptoms.find(s => s.id === 'moodChanges');
      topSymptoms.push({
        id: moodChanges.id,
        name: moodChanges.name,
        category: moodChanges.category,
        severity: 3, // Moderate symptom
      });
    }
    
    if (formData.hasCognitiveIssues) {
      const brainFog = commonSymptoms.find(s => s.id === 'brainFog');
      topSymptoms.push({
        id: brainFog.id,
        name: brainFog.name,
        category: brainFog.category,
        severity: 3, // Moderate symptom
      });
    }
    
    // Update context
    setUserProfile(userProfile);
    setTopSymptoms(topSymptoms);
    
    // Navigate to next step
    navigate('/onboarding/diet');
  };

  return (
    <div className="min-h-screen flex flex-col px-4 py-8 max-w-lg mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-purple-600">Your Symptoms</h1>
        <p className="text-gray-600">Tell us about what you're experiencing so we can personalize your support</p>
      </div>
      
      <div className="space-y-8 mb-8">
        {/* Menopause Stage */}
        <div className="bg-white p-5 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-4">Where are you in your menopause journey?</h2>
          
          <div className="space-y-3">
            <label className="flex items-center space-x-3 p-3 border rounded hover:bg-gray-50">
              <input
                type="radio"
                name="menopauseStage"
                value={MenopauseStage.PREMENOPAUSAL}
                checked={formData.menopauseStage === MenopauseStage.PREMENOPAUSAL}
                onChange={handleRadioChange}
                className="h-5 w-5 text-purple-600"
              />
              <span>
                <span className="block font-medium">Pre-menopause</span>
                <span className="text-sm text-gray-500">Still having regular periods</span>
              </span>
            </label>
            
            <label className="flex items-center space-x-3 p-3 border rounded hover:bg-gray-50">
              <input
                type="radio"
                name="menopauseStage"
                value={MenopauseStage.PERIMENOPAUSAL}
                checked={formData.menopauseStage === MenopauseStage.PERIMENOPAUSAL}
                onChange={handleRadioChange}
                className="h-5 w-5 text-purple-600"
              />
              <span>
                <span className="block font-medium">Perimenopause</span>
                <span className="text-sm text-gray-500">Periods becoming irregular, experiencing symptoms</span>
              </span>
            </label>
            
            <label className="flex items-center space-x-3 p-3 border rounded hover:bg-gray-50">
              <input
                type="radio"
                name="menopauseStage"
                value={MenopauseStage.MENOPAUSAL}
                checked={formData.menopauseStage === MenopauseStage.MENOPAUSAL}
                onChange={handleRadioChange}
                className="h-5 w-5 text-purple-600"
              />
              <span>
                <span className="block font-medium">Menopause</span>
                <span className="text-sm text-gray-500">No period for less than 12 months</span>
              </span>
            </label>
            
            <label className="flex items-center space-x-3 p-3 border rounded hover:bg-gray-50">
              <input
                type="radio"
                name="menopauseStage"
                value={MenopauseStage.POSTMENOPAUSAL}
                checked={formData.menopauseStage === MenopauseStage.POSTMENOPAUSAL}
                onChange={handleRadioChange}
                className="h-5 w-5 text-purple-600"
              />
              <span>
                <span className="block font-medium">Post-menopause</span>
                <span className="text-sm text-gray-500">No period for more than 12 months</span>
              </span>
            </label>
            
            <label className="flex items-center space-x-3 p-3 border rounded hover:bg-gray-50">
              <input
                type="radio"
                name="menopauseStage"
                value={MenopauseStage.UNKNOWN}
                checked={formData.menopauseStage === MenopauseStage.UNKNOWN}
                onChange={handleRadioChange}
                className="h-5 w-5 text-purple-600"
              />
              <span>
                <span className="block font-medium">Not sure</span>
                <span className="text-sm text-gray-500">We'll help you figure it out</span>
              </span>
            </label>
          </div>
        </div>
        
        {/* Last period date */}
        <div className="bg-white p-5 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-4">When was your last period?</h2>
          <p className="text-sm text-gray-500 mb-3">An approximate date is fine if you're unsure</p>
          
          <input
            type="date"
            name="lastPeriodDate"
            value={formData.lastPeriodDate}
            onChange={handleDateChange}
            className="w-full p-3 border rounded focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
        
        {/* Primary symptoms checkboxes */}
        <div className="bg-white p-5 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-4">Are you experiencing any of these common symptoms?</h2>
          
          <div className="space-y-4">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="hasHotFlashes"
                checked={formData.hasHotFlashes}
                onChange={handleCheckboxChange}
                className="h-5 w-5 text-purple-600 rounded focus:ring-purple-500"
              />
              <span>Hot flashes or night sweats</span>
            </label>
            
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="hasSleepIssues"
                checked={formData.hasSleepIssues}
                onChange={handleCheckboxChange}
                className="h-5 w-5 text-purple-600 rounded focus:ring-purple-500"
              />
              <span>Sleep problems</span>
            </label>
            
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="hasMoodChanges"
                checked={formData.hasMoodChanges}
                onChange={handleCheckboxChange}
                className="h-5 w-5 text-purple-600 rounded focus:ring-purple-500"
              />
              <span>Mood changes or irritability</span>
            </label>
            
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="hasCognitiveIssues"
                checked={formData.hasCognitiveIssues}
                onChange={handleCheckboxChange}
                className="h-5 w-5 text-purple-600 rounded focus:ring-purple-500"
              />
              <span>Brain fog or difficulty concentrating</span>
            </label>
          </div>
        </div>
        
        {/* Energy level slider */}
        <div className="bg-white p-5 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-4">How would you rate your energy level on most days?</h2>
          
          <input
            type="range"
            name="energyLevel"
            min="1"
            max="5"
            value={formData.energyLevel}
            onChange={handleSliderChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>Very low</span>
            <span>Low</span>
            <span>Average</span>
            <span>Good</span>
            <span>Excellent</span>
          </div>
        </div>
        
        {/* Other symptoms */}
        <div className="bg-white p-5 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-4">Any other symptoms you'd like to track?</h2>
          
          <div className="grid grid-cols-2 gap-3">
            {commonSymptoms
              .filter(s => 
                s.id !== 'hotFlashes' && 
                s.id !== 'sleepIssues' && 
                s.id !== 'moodChanges' && 
                s.id !== 'brainFog'
              )
              .map(symptom => (
                <button
                  key={symptom.id}
                  onClick={() => handleSymptomSelection(symptom.id)}
                  className={`p-3 border rounded-lg text-left ${
                    formData.otherSymptoms.includes(symptom.id)
                      ? 'bg-purple-100 border-purple-300'
                      : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  {symptom.name}
                </button>
              ))
            }
          </div>
        </div>
      </div>
      
      <div className="sticky bottom-0 bg-white pt-4 pb-8 -mx-4 px-4">
        <div className="flex justify-between">
          <button
            onClick={() => navigate('/onboarding')}
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

export default OnboardingSymptoms;