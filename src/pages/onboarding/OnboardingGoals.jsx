import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';

const OnboardingGoals = () => {
  const navigate = useNavigate();
  const { setHealthGoals } = useAppContext();
  
  const [formData, setFormData] = useState({
    primaryGoals: [],
    secondaryGoals: [],
    targetDate: null,
    improveSleep: false,
    reduceHotFlashes: false,
    stabilizeMood: false,
    improveCognition: false,
    maintainWeight: false,
    loseWeight: false,
  });
  
  // Common menopause-related goals
  const primaryGoalOptions = [
    { id: 'reduceSyptoms', label: 'Reduce menopause symptoms' },
    { id: 'maintainEnergy', label: 'Maintain consistent energy' },
    { id: 'nutritionBalance', label: 'Better nutritional balance' },
    { id: 'preventHealth', label: 'Prevent long-term health issues' },
    { id: 'weightManagement', label: 'Weight management' },
    { id: 'boneHealth', label: 'Improve bone health' },
    { id: 'heartHealth', label: 'Support heart health' },
    { id: 'mentalClarity', label: 'Enhance mental clarity' },
    { id: 'emotionalBalance', label: 'Better emotional balance' },
    { id: 'sleepQuality', label: 'Improve sleep quality' },
  ];
  
  // Specific symptom management goals
  const symptomGoals = [
    { id: 'improveSleep', label: 'Improve sleep' },
    { id: 'reduceHotFlashes', label: 'Reduce hot flashes' },
    { id: 'stabilizeMood', label: 'Stabilize mood' },
    { id: 'improveCognition', label: 'Improve mental clarity' },
  ];
  
  // Weight management goals
  const weightGoals = [
    { id: 'maintainWeight', label: 'Maintain current weight' },
    { id: 'loseWeight', label: 'Lose weight' },
  ];
  
  // Handle primary goal selection
  const handlePrimaryGoalToggle = (goalId) => {
    const currentGoals = [...formData.primaryGoals];
    
    if (currentGoals.includes(goalId)) {
      // Remove if already selected
      setFormData({
        ...formData,
        primaryGoals: currentGoals.filter(id => id !== goalId)
      });
    } else {
      // Add if not selected (maximum 3 allowed)
      if (currentGoals.length < 3) {
        setFormData({
          ...formData,
          primaryGoals: [...currentGoals, goalId]
        });
      }
    }
  };
  
  // Handle symptom goal checkboxes
  const handleSymptomGoalChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked,
    });
  };
  
  // Handle weight goal selection (can only choose one)
  const handleWeightGoalChange = (e) => {
    const { name, checked } = e.target;
    
    if (name === 'maintainWeight' && checked) {
      setFormData({
        ...formData,
        maintainWeight: true,
        loseWeight: false,
      });
    } else if (name === 'loseWeight' && checked) {
      setFormData({
        ...formData,
        maintainWeight: false,
        loseWeight: true,
      });
    } else {
      setFormData({
        ...formData,
        [name]: checked,
      });
    }
  };
  
  // Handle target date selection
  const handleTargetDateChange = (e) => {
    setFormData({
      ...formData,
      targetDate: e.target.value,
    });
  };
  
  // Handle form submission
  const handleSubmit = () => {
    // Convert primary goal IDs to labels for easier reading
    const primaryGoalLabels = formData.primaryGoals.map(goalId => {
      const goal = primaryGoalOptions.find(g => g.id === goalId);
      return goal ? goal.label : goalId;
    });
    
    // Create health goals object
    const healthGoals = {
      ...formData,
      primaryGoals: primaryGoalLabels,
      targetDate: formData.targetDate ? new Date(formData.targetDate) : null,
    };
    
    // Save health goals to context
    setHealthGoals(healthGoals);
    
    // Navigate to final onboarding step
    navigate('/onboarding/preview');
  };

  return (
    <div className="min-h-screen flex flex-col px-4 py-8 max-w-lg mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-purple-600">Health Goals</h1>
        <p className="text-gray-600">Let us know what you'd like to achieve</p>
      </div>
      
      <div className="space-y-8 mb-8">
        {/* Primary health goals */}
        <div className="bg-white p-5 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-2">What are your top health goals?</h2>
          <p className="text-sm text-gray-500 mb-4">Select up to 3 that are most important to you</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {primaryGoalOptions.map(goal => (
              <button
                key={goal.id}
                onClick={() => handlePrimaryGoalToggle(goal.id)}
                className={`p-3 border rounded-lg text-left ${
                  formData.primaryGoals.includes(goal.id)
                    ? 'bg-purple-100 border-purple-300'
                    : formData.primaryGoals.length >= 3
                      ? 'bg-white border-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-white hover:bg-gray-50'
                }`}
                disabled={formData.primaryGoals.length >= 3 && !formData.primaryGoals.includes(goal.id)}
              >
                {goal.label}
                {formData.primaryGoals.includes(goal.id) && (
                  <span className="float-right text-purple-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </span>
                )}
              </button>
            ))}
          </div>
          
          {formData.primaryGoals.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                Selected: {formData.primaryGoals.length}/3
              </p>
            </div>
          )}
        </div>
        
        {/* Symptom management goals */}
        <div className="bg-white p-5 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-4">Which specific symptoms would you like to address?</h2>
          
          <div className="space-y-3">
            {symptomGoals.map(goal => (
              <label key={goal.id} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name={goal.id}
                  checked={formData[goal.id]}
                  onChange={handleSymptomGoalChange}
                  className="h-5 w-5 text-purple-600 rounded focus:ring-purple-500"
                />
                <span>{goal.label}</span>
              </label>
            ))}
          </div>
        </div>
        
        {/* Weight management goals */}
        <div className="bg-white p-5 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-4">Weight management goals</h2>
          
          <div className="space-y-3">
            {weightGoals.map(goal => (
              <label key={goal.id} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name={goal.id}
                  checked={formData[goal.id]}
                  onChange={handleWeightGoalChange}
                  className="h-5 w-5 text-purple-600 rounded focus:ring-purple-500"
                />
                <span>{goal.label}</span>
              </label>
            ))}
          </div>
        </div>
        
        {/* Target timeframe */}
        <div className="bg-white p-5 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-4">When would you like to start seeing results?</h2>
          
          <select
            value={formData.targetDate || ''}
            onChange={handleTargetDateChange}
            className="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="">Select a timeframe</option>
            <option value={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()}>Within a week</option>
            <option value={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()}>Within a month</option>
            <option value={new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()}>Within 3 months</option>
            <option value={new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString()}>Within 6 months</option>
          </select>
          
          <p className="text-sm text-gray-500 mt-2">
            Setting a realistic timeframe helps us create an achievable plan for you.
          </p>
        </div>
      </div>
      
      <div className="sticky bottom-0 bg-white pt-4 pb-8 -mx-4 px-4">
        <div className="flex justify-between">
          <button
            onClick={() => navigate('/onboarding/diet')}
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

export default OnboardingGoals;