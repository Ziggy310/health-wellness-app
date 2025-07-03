import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import { MenopauseStage } from '../../utils/types';

const OnboardingPreview = () => {
  const navigate = useNavigate();
  const { 
    userProfile, 
    dietaryPreferences, 
    healthGoals, 
    topSymptoms,
    setOnboardingComplete 
  } = useAppContext();

  // Get menopause stage text
  const getMenopauseStageText = () => {
    switch (userProfile?.menopauseStage) {
      case MenopauseStage.PREMENOPAUSAL:
        return 'Pre-menopause';
      case MenopauseStage.PERIMENOPAUSAL:
        return 'Perimenopause';
      case MenopauseStage.MENOPAUSAL:
        return 'Menopause';
      case MenopauseStage.POSTMENOPAUSAL:
        return 'Post-menopause';
      default:
        return 'Not specified';
    }
  };

  // Format date to readable format
  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  // Handle onboarding completion
  const handleComplete = () => {
    setOnboardingComplete(true);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col px-4 py-8 max-w-lg mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-purple-600">Your Personalized Plan</h1>
        <p className="text-gray-600">Here's what we've created based on your needs</p>
      </div>
      
      <div className="space-y-6 mb-8">
        {/* Profile Summary */}
        <div className="bg-white p-5 rounded-lg shadow-sm border-l-4 border-purple-600">
          <h2 className="text-lg font-medium mb-3">Your Profile</h2>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Menopause stage:</span>
              <span className="font-medium">{getMenopauseStageText()}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Last period:</span>
              <span className="font-medium">
                {userProfile?.lastPeriodDate ? formatDate(userProfile.lastPeriodDate) : 'Not specified'}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Energy level:</span>
              <span className="font-medium">
                {userProfile?.energyLevel ? `${userProfile.energyLevel}/5` : 'Not specified'}
              </span>
            </div>
          </div>
        </div>
        
        {/* Top Symptoms */}
        <div className="bg-white p-5 rounded-lg shadow-sm border-l-4 border-orange-500">
          <h2 className="text-lg font-medium mb-3">Your Top Symptoms</h2>
          
          {topSymptoms && topSymptoms.length > 0 ? (
            <div className="space-y-2">
              {topSymptoms.map((symptom, index) => (
                <div key={symptom.id} className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-orange-500 mr-3"></div>
                  <span>{symptom.name}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No specific symptoms selected</p>
          )}
        </div>
        
        {/* Dietary Preferences */}
        <div className="bg-white p-5 rounded-lg shadow-sm border-l-4 border-green-600">
          <h2 className="text-lg font-medium mb-3">Your Diet Plan</h2>
          
          <div className="space-y-2">
            {dietaryPreferences?.primaryDiet && (
              <div className="flex justify-between">
                <span className="text-gray-600">Primary diet:</span>
                <span className="font-medium capitalize">{dietaryPreferences.primaryDiet}</span>
              </div>
            )}
            
            <div className="flex flex-wrap gap-2 mt-2">
              {dietaryPreferences?.isGlutenFree && (
                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Gluten-free</span>
              )}
              
              {dietaryPreferences?.isDairyFree && (
                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Dairy-free</span>
              )}
              
              {dietaryPreferences?.isNutFree && (
                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Nut-free</span>
              )}
            </div>
            
            {dietaryPreferences?.preferences && dietaryPreferences.preferences.length > 0 && (
              <div className="mt-3">
                <span className="text-sm text-gray-600">Your preferences:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {dietaryPreferences.preferences.map((pref, i) => (
                    <span key={i} className="px-2 py-1 text-xs bg-green-50 border border-green-200 rounded-full">
                      {pref}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Health Goals */}
        <div className="bg-white p-5 rounded-lg shadow-sm border-l-4 border-blue-600">
          <h2 className="text-lg font-medium mb-3">Your Health Goals</h2>
          
          {healthGoals?.primaryGoals && healthGoals.primaryGoals.length > 0 ? (
            <div className="space-y-2">
              <span className="text-sm text-gray-600">Primary goals:</span>
              <ul className="list-disc pl-5">
                {healthGoals.primaryGoals.map((goal, i) => (
                  <li key={i}>{goal}</li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-gray-500">No specific goals selected</p>
          )}
          
          {healthGoals?.targetDate && (
            <div className="mt-3">
              <span className="text-sm text-gray-600">Target timeframe:</span>
              <p className="font-medium">{formatDate(healthGoals.targetDate)}</p>
            </div>
          )}
        </div>
      </div>
      
      {/* What you'll get section */}
      <div className="bg-purple-50 p-5 rounded-lg border border-purple-100 mb-8">
        <h2 className="text-lg font-medium mb-3 text-purple-800">What you'll get</h2>
        
        <div className="space-y-3">
          <div className="flex items-start">
            <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mr-3 mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <span className="font-medium">Personalized Meal Plans</span>
              <p className="text-sm text-gray-600">Weekly meal plans tailored to your nutritional needs</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mr-3 mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <span className="font-medium">Symptom Relief Tools</span>
              <p className="text-sm text-gray-600">Quick access to effective relief techniques</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mr-3 mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <span className="font-medium">Progress Tracking</span>
              <p className="text-sm text-gray-600">Monitor your symptoms and wellness journey</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mr-3 mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <span className="font-medium">Voice Assistant</span>
              <p className="text-sm text-gray-600">Get help and information using your voice</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="sticky bottom-0 bg-white pt-4 pb-8 -mx-4 px-4">
        <div className="flex justify-between">
          <button
            onClick={() => navigate('/onboarding/goals')}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Back
          </button>
          
          <button
            onClick={handleComplete}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Start Using Meno+
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPreview;