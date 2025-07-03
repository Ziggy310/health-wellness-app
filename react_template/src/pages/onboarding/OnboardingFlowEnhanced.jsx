import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import { MenopauseStage, SymptomCategory } from '../../utils/types';

const OnboardingFlowEnhanced = () => {
  const navigate = useNavigate();
  const { user, completeOnboarding, logout } = useAppContext();
  
  // State for tracking onboarding step
  const [step, setStep] = useState(1);
  const totalSteps = 5;
  
  // State for collecting user data
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [selectedDiet, setSelectedDiet] = useState('balanced');
  const [selectedGoals, setSelectedGoals] = useState([]);
  
  // Navigate to previous step
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Navigate to next step
  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  // Complete onboarding
  const handleComplete = () => {
    // Prepare user profile data
    const profileData = {
      profile: {
        menopauseStage: MenopauseStage.PERIMENOPAUSAL,
        hasHotFlashes: selectedSymptoms.includes('hotFlashes'),
        hasSleepIssues: selectedSymptoms.includes('sleepIssues'),
        hasMoodChanges: selectedSymptoms.includes('moodChanges'),
      },
      dietary: {
        primaryDiet: selectedDiet,
        preferences: [],
      },
      goals: {
        primaryGoals: selectedGoals,
        reduceHotFlashes: selectedGoals.includes('Reduce hot flashes'),
        improveSleep: selectedGoals.includes('Improve sleep'),
        stabilizeMood: selectedGoals.includes('Stabilize mood'),
      },
      symptoms: [
        { id: 'hotFlashes', name: 'Hot Flashes', category: SymptomCategory.PHYSICAL },
        { id: 'sleepIssues', name: 'Sleep Issues', category: SymptomCategory.SLEEP },
        { id: 'moodChanges', name: 'Mood Changes', category: SymptomCategory.EMOTIONAL },
      ].filter(symptom => selectedSymptoms.includes(symptom.id))
    };
    
    // Call the completeOnboarding function with the profile data
    completeOnboarding(profileData);
    
    // Use setTimeout to ensure the state gets updated before navigation
    setTimeout(() => {
      // Navigate to the dashboard directly after onboarding completion
      navigate('/dashboard');
    }, 100);
  };

  // Available common symptoms
  const commonSymptoms = [
    { id: 'hotFlashes', name: 'Hot Flashes', emoji: '🔥' },
    { id: 'nightSweats', name: 'Night Sweats', emoji: '💧' },
    { id: 'sleepIssues', name: 'Sleep Issues', emoji: '😴' },
    { id: 'moodChanges', name: 'Mood Changes', emoji: '😔' },
    { id: 'irritability', name: 'Irritability', emoji: '😠' },
    { id: 'vaginalDryness', name: 'Vaginal Dryness', emoji: '🌵' },
    { id: 'jointPain', name: 'Joint Pain', emoji: '🦴' },
    { id: 'brainFog', name: 'Brain Fog', emoji: '🧠' },
    { id: 'headaches', name: 'Headaches', emoji: '🤕' },
    { id: 'fatigue', name: 'Fatigue', emoji: '😩' },
  ];

  // Diet options
  const dietOptions = [
    { id: 'balanced', name: 'Balanced', description: 'A mix of all food groups' },
    { id: 'vegetarian', name: 'Vegetarian', description: 'No meat, but includes dairy and eggs' },
    { id: 'vegan', name: 'Vegan', description: 'No animal products' },
    { id: 'lowCarb', name: 'Low Carb', description: 'Reduced carbohydrate intake' },
    { id: 'mediterranean', name: 'Mediterranean', description: 'Rich in vegetables, olive oil, and fish' },
  ];

  // Health goal options
  const goalOptions = [
    'Reduce hot flashes',
    'Improve sleep',
    'Stabilize mood',
    'Increase energy',
    'Manage weight',
    'Strengthen bones',
    'Improve cognitive function'
  ];

  // Toggle symptom selection
  const toggleSymptom = (symptomId) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptomId)
        ? prev.filter(id => id !== symptomId)
        : [...prev, symptomId]
    );
  };

  // Toggle goal selection
  const toggleGoal = (goal) => {
    setSelectedGoals(prev => 
      prev.includes(goal)
        ? prev.filter(g => g !== goal)
        : [...prev, goal]
    );
  };

  // Render the appropriate step content
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="text-center">
            <div className="w-24 h-24 mb-6 mx-auto rounded-full bg-purple-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold mb-4">Welcome to Meno+</h2>
            <p className="text-gray-600 mb-6">
              We're here to support you through your menopause journey with personalized recommendations.
            </p>
            
            <div className="bg-purple-50 rounded-lg p-6 mb-6">
              <h3 className="font-medium text-purple-800 mb-2">What you'll get:</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="mr-2 text-purple-600">✓</span>
                  <span>Personalized symptom tracking</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-purple-600">✓</span>
                  <span>Nutrition and meal recommendations</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-purple-600">✓</span>
                  <span>Evidence-based relief strategies</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-purple-600">✓</span>
                  <span>Community support and resources</span>
                </li>
              </ul>
            </div>
            
            <p className="text-sm text-gray-500 mb-6">
              This will only take about 2 minutes to set up.
            </p>
          </div>
        );
        
      case 2:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-center">Which symptoms are you experiencing?</h2>
            <p className="text-gray-600 mb-6 text-center">
              Select all that apply. You can update these later.
            </p>
            
            <div className="overflow-x-auto -mx-4 px-4 pb-2 mb-4">
              <div className="flex flex-wrap gap-2">
                {commonSymptoms.map(symptom => (
                  <button
                    key={symptom.id}
                    className={`py-2 px-4 rounded-full flex items-center transition-colors ${
                      selectedSymptoms.includes(symptom.id)
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => toggleSymptom(symptom.id)}
                  >
                    <span className="mr-2">{symptom.emoji}</span>
                    {symptom.name}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mt-4">
              <h3 className="font-medium text-gray-700 mb-2">Selected symptoms:</h3>
              {selectedSymptoms.length > 0 ? (
                <div className="bg-purple-50 p-4 rounded-lg">
                  <ul className="space-y-1">
                    {selectedSymptoms.map(symptomId => {
                      const symptom = commonSymptoms.find(s => s.id === symptomId);
                      return (
                        <li key={symptomId} className="flex items-center">
                          <span className="mr-2">{symptom.emoji}</span>
                          {symptom.name}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : (
                <p className="text-gray-500 italic">No symptoms selected yet</p>
              )}
            </div>
          </div>
        );
        
      case 3:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-center">Dietary Preferences</h2>
            <p className="text-gray-600 mb-6 text-center">
              Select the diet that best matches your preferences.
            </p>
            
            <div className="space-y-3 mb-6">
              {dietOptions.map(diet => (
                <div 
                  key={diet.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                    selectedDiet === diet.id
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedDiet(diet.id)}
                >
                  <div className="flex items-center">
                    <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                      selectedDiet === diet.id ? 'border-purple-600' : 'border-gray-400'
                    }`}>
                      {selectedDiet === diet.id && (
                        <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">{diet.name}</h3>
                      <p className="text-sm text-gray-600">{diet.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800 flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Your dietary preferences will help us recommend meals that may help reduce menopause symptoms.
              </p>
            </div>
          </div>
        );
        
      case 4:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-center">Health Goals</h2>
            <p className="text-gray-600 mb-6 text-center">
              What would you like to focus on? Select all that apply.
            </p>
            
            <div className="space-y-2 mb-6">
              {goalOptions.map(goal => (
                <div 
                  key={goal}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedGoals.includes(goal)
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => toggleGoal(goal)}
                >
                  <div className="flex items-center">
                    <div className={`w-5 h-5 rounded flex items-center justify-center mr-3 ${
                      selectedGoals.includes(goal) ? 'bg-purple-600 text-white' : 'border border-gray-400'
                    }`}>
                      {selectedGoals.includes(goal) && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span>{goal}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-purple-800">
                We'll use your goals to personalize your dashboard and recommendations. You can change these anytime.
              </p>
            </div>
          </div>
        );
        
      case 5:
        return (
          <div className="text-center">
            <div className="w-24 h-24 mb-6 mx-auto rounded-full bg-purple-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold mb-4">You're all set!</h2>
            <p className="text-gray-600 mb-6">
              Your personalized Meno+ experience is ready. Here's what you've told us:
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="font-medium text-purple-800 mb-2">Symptoms</h3>
                <div className="flex flex-wrap gap-1">
                  {selectedSymptoms.length > 0 ? (
                    selectedSymptoms.map(symptomId => {
                      const symptom = commonSymptoms.find(s => s.id === symptomId);
                      return (
                        <span key={symptomId} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {symptom.emoji} {symptom.name}
                        </span>
                      );
                    })
                  ) : (
                    <span className="text-gray-500 italic">No symptoms selected</span>
                  )}
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="font-medium text-purple-800 mb-2">Diet Preference</h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {dietOptions.find(d => d.id === selectedDiet)?.name || 'Not specified'}
                </span>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="font-medium text-purple-800 mb-2">Health Goals</h3>
                <div className="flex flex-wrap gap-1">
                  {selectedGoals.length > 0 ? (
                    selectedGoals.map(goal => (
                      <span key={goal} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {goal}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 italic">No goals selected</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  // Percent complete
  const percentComplete = (step / totalSteps) * 100;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="py-4 px-4 border-b border-gray-200">
        <div className="max-w-lg mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <div className="text-lg font-bold text-purple-600">Meno+</div>
          </div>
          {step > 1 && step < totalSteps && (
            <button 
              onClick={logout}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          )}
        </div>
      </header>
      
      {/* Progress bar */}
      <div className="bg-gray-100 h-1">
        <div 
          className="bg-purple-600 h-1 transition-all duration-500 ease-out"
          style={{ width: `${percentComplete}%` }}
        ></div>
      </div>
      
      {/* Content */}
      <div className="flex-grow overflow-y-auto">
        <div className="max-w-lg mx-auto px-4 py-6">
          {renderStepContent()}
        </div>
      </div>
      
      {/* Footer */}
      <footer className="py-4 px-4 border-t border-gray-200">
        <div className="max-w-lg mx-auto flex justify-between">
          {step > 1 ? (
            <button
              onClick={handleBack}
              className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-md transition-colors"
            >
              Back
            </button>
          ) : (
            <div></div>
          )}
          
          {step < totalSteps ? (
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
            >
              {step === 1 ? "Let's Get Started" : "Continue"}
            </button>
          ) : (
            <button
              onClick={handleComplete}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
            >
              Get Started
            </button>
          )}
        </div>
      </footer>
    </div>
  );
};

export default OnboardingFlowEnhanced;