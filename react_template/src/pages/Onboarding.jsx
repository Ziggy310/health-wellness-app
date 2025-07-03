import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { MenopauseStage, DietType, SymptomCategory } from '../utils/types';

const Onboarding = () => {
  const navigate = useNavigate();
  const { completeOnboarding } = useAppContext();
  const [currentStep, setCurrentStep] = useState(0);

  // Onboarding data state
  const [profile, setProfile] = useState({
    name: '',
    age: '',
    menopauseStage: MenopauseStage.UNKNOWN,
    lastPeriodDate: null,
    hasHotFlashes: false,
    hasSleepIssues: false,
    hasMoodChanges: false,
    energyLevel: 3,
    hasCognitiveIssues: false,
    healthConditions: [],
  });

  const [dietary, setDietary] = useState({
    primaryDiet: DietType.OMNIVORE,
    allergies: [],
    dislikes: [],
    preferences: [],
    isGlutenFree: false,
    isDairyFree: false,
    isNutFree: false,
    prepTimePreference: 30,
  });

  const [goals, setGoals] = useState({
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

  const [symptoms, setSymptoms] = useState([
    { id: 'hotFlashes', name: 'Hot Flashes', category: SymptomCategory.PHYSICAL, selected: false },
    { id: 'nightSweats', name: 'Night Sweats', category: SymptomCategory.SLEEP, selected: false },
    { id: 'sleepIssues', name: 'Sleep Issues', category: SymptomCategory.SLEEP, selected: false },
    { id: 'fatigue', name: 'Fatigue', category: SymptomCategory.PHYSICAL, selected: false },
    { id: 'moodSwings', name: 'Mood Swings', category: SymptomCategory.EMOTIONAL, selected: false },
    { id: 'anxiety', name: 'Anxiety', category: SymptomCategory.EMOTIONAL, selected: false },
    { id: 'depression', name: 'Depression', category: SymptomCategory.EMOTIONAL, selected: false },
    { id: 'brainFog', name: 'Brain Fog', category: SymptomCategory.COGNITIVE, selected: false },
    { id: 'memoryIssues', name: 'Memory Issues', category: SymptomCategory.COGNITIVE, selected: false },
    { id: 'jointPain', name: 'Joint Pain', category: SymptomCategory.PHYSICAL, selected: false },
  ]);

  // Handle form submissions for each step
  const handleProfileSubmit = (updatedProfile) => {
    setProfile({ ...profile, ...updatedProfile });
    setCurrentStep(1); // Move to symptoms step
  };

  const handleSymptomsSubmit = (selectedSymptoms) => {
    setSymptoms(selectedSymptoms);
    setCurrentStep(2); // Move to dietary step
  };

  const handleDietarySubmit = (updatedDietary) => {
    setDietary({ ...dietary, ...updatedDietary });
    setCurrentStep(3); // Move to goals step
  };

  const handleGoalsSubmit = (updatedGoals) => {
    setGoals({ ...goals, ...updatedGoals });
    setCurrentStep(4); // Move to preview step
  };

  const handleFinish = () => {
    // Process selected symptoms
    const selectedSymptoms = symptoms
      .filter(symptom => symptom.selected)
      .map(({ id, name, category }) => ({ id, name, category }));

    // Complete onboarding with all collected data
    completeOnboarding({ 
      profile, 
      dietary, 
      goals,
      symptoms: selectedSymptoms,
    });
    
    // Redirect to dashboard
    navigate('/');
  };

  // Define the steps content
  const steps = [
    {
      title: 'Welcome to Meno+',
      description: 'Let\'s get to know you better to personalize your experience.',
      component: (
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center">
            <span className="text-3xl font-bold text-white">M+</span>
          </div>
          <h2 className="text-2xl font-semibold mb-4">Welcome to Your Menopause Journey</h2>
          <p className="mb-8 text-gray-600">
            We'll ask you a few questions to personalize your experience and help you manage your symptoms effectively.
          </p>
          <button
            onClick={() => navigate('/onboarding/symptoms')}
            className="w-full py-3 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 transition duration-300"
          >
            Let's Get Started
          </button>
        </div>
      ),
    },
    {
      title: 'Your Symptoms',
      description: 'Select the symptoms you experience.',
      component: (
        <div>
          <h2 className="text-xl font-semibold mb-4">Which symptoms do you experience?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {symptoms.map((symptom) => (
              <div
                key={symptom.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  symptom.selected ? 'border-purple-500 bg-purple-50' : 'border-gray-200'
                }`}
                onClick={() => {
                  const updatedSymptoms = symptoms.map((s) =>
                    s.id === symptom.id ? { ...s, selected: !s.selected } : s
                  );
                  setSymptoms(updatedSymptoms);
                }}
              >
                <div className="flex items-center">
                  <div className={`w-5 h-5 rounded-full border ${
                    symptom.selected ? 'border-purple-500 bg-purple-500' : 'border-gray-300'
                  } flex items-center justify-center mr-3`}>
                    {symptom.selected && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <span className="font-medium">{symptom.name}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-8">
            <button
              onClick={() => navigate('/onboarding')}
              className="px-6 py-2 rounded-lg border border-purple-600 text-purple-600 hover:bg-purple-50"
            >
              Back
            </button>
            <button
              onClick={() => navigate('/onboarding/diet')}
              className="px-6 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
            >
              Continue
            </button>
          </div>
        </div>
      ),
    },
    {
      title: 'Dietary Preferences',
      description: 'Tell us about your diet.',
      component: (
        <div>
          <h2 className="text-xl font-semibold mb-4">Dietary Preferences</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              What type of diet do you follow?
            </label>
            <select
              value={dietary.primaryDiet}
              onChange={(e) => setDietary({ ...dietary, primaryDiet: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
            >
              {Object.entries(DietType).map(([key, value]) => (
                <option key={key} value={value}>
                  {key.charAt(0) + key.slice(1).toLowerCase().replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Do you have any dietary restrictions?
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isGlutenFree"
                  checked={dietary.isGlutenFree}
                  onChange={() => setDietary({ ...dietary, isGlutenFree: !dietary.isGlutenFree })}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor="isGlutenFree" className="ml-2 text-sm text-gray-700">
                  Gluten Free
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isDairyFree"
                  checked={dietary.isDairyFree}
                  onChange={() => setDietary({ ...dietary, isDairyFree: !dietary.isDairyFree })}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor="isDairyFree" className="ml-2 text-sm text-gray-700">
                  Dairy Free
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isNutFree"
                  checked={dietary.isNutFree}
                  onChange={() => setDietary({ ...dietary, isNutFree: !dietary.isNutFree })}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor="isNutFree" className="ml-2 text-sm text-gray-700">
                  Nut Free
                </label>
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Maximum meal preparation time (minutes):
            </label>
            <input
              type="range"
              min="10"
              max="60"
              step="5"
              value={dietary.prepTimePreference}
              onChange={(e) => setDietary({ ...dietary, prepTimePreference: parseInt(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>10 min</span>
              <span>{dietary.prepTimePreference} min</span>
              <span>60 min</span>
            </div>
          </div>

          <div className="flex justify-between mt-8">
            <button
              onClick={() => navigate('/onboarding/symptoms')}
              className="px-6 py-2 rounded-lg border border-purple-600 text-purple-600 hover:bg-purple-50"
            >
              Back
            </button>
            <button
              onClick={() => navigate('/onboarding/goals')}
              className="px-6 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
            >
              Continue
            </button>
          </div>
        </div>
      ),
    },
    {
      title: 'Health Goals',
      description: 'Set your health goals.',
      component: (
        <div>
          <h2 className="text-xl font-semibold mb-4">Health Goals</h2>
          <p className="mb-4 text-gray-600">Select all that apply to you:</p>
          
          <div className="space-y-3">
            <div className="p-3 border rounded-lg cursor-pointer transition-colors hover:bg-purple-50"
                onClick={() => setGoals({ ...goals, improveSleep: !goals.improveSleep })}>
              <div className="flex items-center">
                <div className={`w-5 h-5 rounded-full border ${
                  goals.improveSleep ? 'border-purple-500 bg-purple-500' : 'border-gray-300'
                } flex items-center justify-center mr-3`}>
                  {goals.improveSleep && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <span>Improve sleep quality</span>
              </div>
            </div>
            
            <div className="p-3 border rounded-lg cursor-pointer transition-colors hover:bg-purple-50"
                onClick={() => setGoals({ ...goals, reduceHotFlashes: !goals.reduceHotFlashes })}>
              <div className="flex items-center">
                <div className={`w-5 h-5 rounded-full border ${
                  goals.reduceHotFlashes ? 'border-purple-500 bg-purple-500' : 'border-gray-300'
                } flex items-center justify-center mr-3`}>
                  {goals.reduceHotFlashes && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <span>Reduce hot flashes</span>
              </div>
            </div>
            
            <div className="p-3 border rounded-lg cursor-pointer transition-colors hover:bg-purple-50"
                onClick={() => setGoals({ ...goals, stabilizeMood: !goals.stabilizeMood })}>
              <div className="flex items-center">
                <div className={`w-5 h-5 rounded-full border ${
                  goals.stabilizeMood ? 'border-purple-500 bg-purple-500' : 'border-gray-300'
                } flex items-center justify-center mr-3`}>
                  {goals.stabilizeMood && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <span>Stabilize mood</span>
              </div>
            </div>
            
            <div className="p-3 border rounded-lg cursor-pointer transition-colors hover:bg-purple-50"
                onClick={() => setGoals({ ...goals, improveCognition: !goals.improveCognition })}>
              <div className="flex items-center">
                <div className={`w-5 h-5 rounded-full border ${
                  goals.improveCognition ? 'border-purple-500 bg-purple-500' : 'border-gray-300'
                } flex items-center justify-center mr-3`}>
                  {goals.improveCognition && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <span>Improve cognitive function</span>
              </div>
            </div>
            
            <div className="p-3 border rounded-lg cursor-pointer transition-colors hover:bg-purple-50"
                onClick={() => {
                  if (goals.loseWeight) {
                    setGoals({ ...goals, loseWeight: false, maintainWeight: false });
                  } else {
                    setGoals({ ...goals, loseWeight: true, maintainWeight: false });
                  }
                }}>
              <div className="flex items-center">
                <div className={`w-5 h-5 rounded-full border ${
                  goals.loseWeight ? 'border-purple-500 bg-purple-500' : 'border-gray-300'
                } flex items-center justify-center mr-3`}>
                  {goals.loseWeight && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <span>Lose weight</span>
              </div>
            </div>
            
            <div className="p-3 border rounded-lg cursor-pointer transition-colors hover:bg-purple-50"
                onClick={() => {
                  if (goals.maintainWeight) {
                    setGoals({ ...goals, maintainWeight: false, loseWeight: false });
                  } else {
                    setGoals({ ...goals, maintainWeight: true, loseWeight: false });
                  }
                }}>
              <div className="flex items-center">
                <div className={`w-5 h-5 rounded-full border ${
                  goals.maintainWeight ? 'border-purple-500 bg-purple-500' : 'border-gray-300'
                } flex items-center justify-center mr-3`}>
                  {goals.maintainWeight && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <span>Maintain weight</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-8">
            <button
              onClick={() => navigate('/onboarding/diet')}
              className="px-6 py-2 rounded-lg border border-purple-600 text-purple-600 hover:bg-purple-50"
            >
              Back
            </button>
            <button
              onClick={() => navigate('/onboarding/preview')}
              className="px-6 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
            >
              Continue
            </button>
          </div>
        </div>
      ),
    },
    {
      title: 'Review & Finish',
      description: 'Review your choices before finishing.',
      component: (
        <div>
          <h2 className="text-xl font-semibold mb-2">Almost there!</h2>
          <p className="mb-6 text-gray-600">We've personalized Meno+ for you based on your information.</p>
          
          <div className="mb-6 bg-purple-50 rounded-lg p-4">
            <h3 className="font-medium mb-2">Your Selected Symptoms:</h3>
            <div className="flex flex-wrap gap-2">
              {symptoms.filter(s => s.selected).length > 0 ? (
                symptoms
                  .filter(s => s.selected)
                  .map(symptom => (
                    <span key={symptom.id} className="px-3 py-1 bg-white border border-purple-200 rounded-full text-sm">
                      {symptom.name}
                    </span>
                  ))
              ) : (
                <span className="text-gray-500 italic">No symptoms selected</span>
              )}
            </div>
          </div>
          
          <div className="mb-6 bg-purple-50 rounded-lg p-4">
            <h3 className="font-medium mb-2">Your Diet:</h3>
            <p className="text-gray-700">{dietary.primaryDiet.charAt(0) + dietary.primaryDiet.slice(1).toLowerCase().replace('_', ' ')}</p>
            <div className="mt-1 flex flex-wrap gap-2">
              {dietary.isGlutenFree && <span className="px-3 py-1 bg-white border border-purple-200 rounded-full text-sm">Gluten Free</span>}
              {dietary.isDairyFree && <span className="px-3 py-1 bg-white border border-purple-200 rounded-full text-sm">Dairy Free</span>}
              {dietary.isNutFree && <span className="px-3 py-1 bg-white border border-purple-200 rounded-full text-sm">Nut Free</span>}
            </div>
          </div>
          
          <div className="mb-8 bg-purple-50 rounded-lg p-4">
            <h3 className="font-medium mb-2">Your Goals:</h3>
            <div className="flex flex-wrap gap-2">
              {goals.improveSleep && <span className="px-3 py-1 bg-white border border-purple-200 rounded-full text-sm">Improve Sleep</span>}
              {goals.reduceHotFlashes && <span className="px-3 py-1 bg-white border border-purple-200 rounded-full text-sm">Reduce Hot Flashes</span>}
              {goals.stabilizeMood && <span className="px-3 py-1 bg-white border border-purple-200 rounded-full text-sm">Stabilize Mood</span>}
              {goals.improveCognition && <span className="px-3 py-1 bg-white border border-purple-200 rounded-full text-sm">Improve Cognition</span>}
              {goals.loseWeight && <span className="px-3 py-1 bg-white border border-purple-200 rounded-full text-sm">Lose Weight</span>}
              {goals.maintainWeight && <span className="px-3 py-1 bg-white border border-purple-200 rounded-full text-sm">Maintain Weight</span>}
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => navigate('/onboarding/goals')}
              className="px-6 py-2 rounded-lg border border-purple-600 text-purple-600 hover:bg-purple-50"
            >
              Back
            </button>
            <button
              onClick={handleFinish}
              className="px-8 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 font-medium"
            >
              Start My Journey
            </button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 py-6 px-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          {/* Progress indicator */}
          <div className="flex mb-6 justify-between">
            {steps.map((step, index) => (
              <div 
                key={index}
                className="flex flex-col items-center"
                style={{ width: `${100 / steps.length}%` }}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                  index === currentStep ? 'bg-purple-600 text-white' : 
                  index < currentStep ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {index < currentStep ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                <span className="text-xs hidden md:block">{step.title}</span>
              </div>
            ))}
          </div>
          
          {/* Step content */}
          <div>
            {steps[currentStep].component}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;