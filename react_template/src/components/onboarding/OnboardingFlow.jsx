import React, { useState, useCallback, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Check, Star, Sparkles, Heart, Target, Utensils } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useAppContext } from '../../contexts/AppContext';
import StepIndicator from './StepIndicator';
import ProfileStep from './ProfileStep';
import PreferencesStep from './PreferencesStep';
import GoalsStep from './GoalsStep';

const OnboardingFlow = ({ onComplete }) => {
  const navigate = useNavigate();
  const { markOnboardingComplete, user } = useAuth();
  const { setDietaryPreferences } = useAppContext();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    profile: {},
    preferences: {},
    goals: {}
  });
  const [isAnimating, setIsAnimating] = useState(false);
  const lastDataRef = useRef({});

  const steps = [
    {
      id: 'profile',
      title: 'Health Profile',
      subtitle: 'Your menopause journey',
      component: ProfileStep,
      icon: Heart,
      color: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50'
    },
    {
      id: 'preferences',
      title: 'Food Preferences',
      subtitle: 'What you love to eat',
      component: PreferencesStep,
      icon: Utensils,
      color: 'from-emerald-500 to-teal-500',
      bgGradient: 'from-emerald-50 to-teal-50'
    },
    {
      id: 'goals',
      title: 'Health Goals',
      subtitle: 'Your wellness vision',
      component: GoalsStep,
      icon: Target,
      color: 'from-indigo-500 to-purple-500',
      bgGradient: 'from-indigo-50 to-purple-50'
    }
  ];

  // Handle data changes from child components
  const handleDataChange = useCallback((section, data) => {
    if (JSON.stringify(data) !== JSON.stringify(lastDataRef.current[section])) {
      setFormData(prev => ({
        ...prev,
        [section]: data
      }));
      lastDataRef.current[section] = data;
    }
  }, []);

  const goToStep = useCallback((stepIndex) => {
    if (stepIndex >= 0 && stepIndex < steps.length && !isAnimating) {
      setIsAnimating(true);
      setCurrentStep(stepIndex);
      
      // Force immediate scroll to top - more reliable than smooth scrolling
      setTimeout(() => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }, 0);
      
      setTimeout(() => setIsAnimating(false), 300);
    }
  }, [steps.length, isAnimating]);

  const handleNext = useCallback(() => {
    if (currentStep < steps.length - 1) {
      goToStep(currentStep + 1);
    }
  }, [currentStep, steps.length, goToStep]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      goToStep(currentStep - 1);
    }
  }, [currentStep, goToStep]);

  // Development bypass function with default data
  const handleDevBypass = useCallback(async () => {
    console.log('🚀 DEV BYPASS: Skipping onboarding with default data');
    
    const defaultData = {
      profile: {
        name: user?.name || 'Test User',
        age: '45',
        menopause_stage: 'perimenopause',
        energy_level: 'moderate',
        email: user?.email || 'test@example.com'
      },
      preferences: {
        primary_diet: 'balanced',
        allergies: [],
        dietaryRestrictions: [],
        spicePreference: 'medium'
      },
      goals: {
        primary_goals: ['energy', 'mood'],
        health_focus: 'overall_wellness'
      }
    };
    
    // Store default data in localStorage
    try {
      localStorage.setItem('onboardingCompleted', 'true');
      localStorage.setItem('onboardingData', JSON.stringify(defaultData));
      localStorage.setItem('userPreferences', JSON.stringify({
        allergies: [],
        dietaryRestrictions: [],
        spicePreference: 'medium',
        primaryDiet: 'balanced'
      }));
      console.log('✅ Default onboarding data saved to localStorage');
    } catch (e) {
      console.error('Failed to save default onboarding data:', e);
    }
    
    // Set dietary preferences in context
    if (setDietaryPreferences) {
      setDietaryPreferences({
        primaryDiet: 'balanced',
        allergies: [],
        restrictions: [],
        spiceLevel: 'medium'
      });
    }
    
    // Mark onboarding as complete
    if (markOnboardingComplete) {
      await markOnboardingComplete();
    }
    
    // Call the onComplete callback if provided
    if (onComplete) {
      onComplete(defaultData);
    }
    
    // Navigate to dashboard
    console.log('🚀 Navigating to dashboard...');
    navigate('/dashboard');
  }, [user, markOnboardingComplete, setDietaryPreferences, onComplete, navigate]);

  const handleComplete = useCallback(async () => {
    console.log('🎉 Onboarding completed with data:', formData);
    
    // Save onboarding data to localStorage
    try {
      localStorage.setItem('onboardingCompleted', 'true');
      localStorage.setItem('onboardingData', JSON.stringify(formData));
      
      // Also store user preferences separately for easy access
      if (formData.preferences) {
        localStorage.setItem('userPreferences', JSON.stringify({
          allergies: formData.preferences.allergies || [],
          dietaryRestrictions: formData.preferences.dietaryRestrictions || [],
          spicePreference: formData.preferences.spicePreference || 'medium',
          primaryDiet: formData.preferences.primary_diet || 'balanced'
        }));
      }
      
      console.log('✅ Onboarding data saved to localStorage');
    } catch (e) {
      console.error('Failed to save onboarding data:', e);
    }
    
    // Set dietary preferences in context
    if (setDietaryPreferences && formData.preferences) {
      setDietaryPreferences({
        primaryDiet: formData.preferences.primary_diet || 'balanced',
        allergies: formData.preferences.allergies || [],
        restrictions: formData.preferences.dietaryRestrictions || [],
        spiceLevel: formData.preferences.spicePreference || 'medium'
      });
    }
    
    // Mark onboarding as complete
    if (markOnboardingComplete) {
      await markOnboardingComplete();
    }
    
    // Call the onComplete callback if provided
    if (onComplete) {
      onComplete(formData);
    }
    
    // Navigate to dashboard
    console.log('🚀 Navigating to dashboard...');
    navigate('/dashboard');
  }, [formData, markOnboardingComplete, setDietaryPreferences, onComplete, navigate]);

  const currentStepData = steps[currentStep];
  const StepComponent = currentStepData.component;

  const isStepComplete = (stepIndex) => {
    const step = steps[stepIndex];
    const data = formData[step.id];
    
    if (!data || Object.keys(data).length === 0) return false;
    
    switch (step.id) {
      case 'profile':
        return !!(data.menopause_stage && data.energy_level);
      case 'preferences':
        return !!(data.primary_diet);
      case 'goals':
        return !!(data.primary_goals?.length > 0);
      default:
        return false;
    }
  };

  const canProceed = isStepComplete(currentStep);
  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full blur-3xl opacity-5 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        {/* Header with Step Indicator */}
        <div className="text-center mb-12">
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 rounded-full blur-lg opacity-20 animate-pulse"></div>
            <div className="relative bg-white rounded-full p-6 shadow-2xl">
              <Sparkles className="w-12 h-12 text-purple-600" />
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-4 mb-4">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
              Welcome to Your Journey
            </h1>
            
            {/* DEV BYPASS BUTTON */}
            <button
              onClick={handleDevBypass}
              className="px-4 py-2 bg-red-500 text-white text-sm rounded-full hover:bg-red-600 transition-colors shadow-lg font-medium flex items-center gap-2"
              title="Development bypass - skip onboarding with default data"
            >
              <span className="text-xs">⚡</span>
              Skip (Dev)
            </button>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-8">
            Let's create a personalized menopause nutrition plan that's perfectly tailored to your unique needs and goals
          </p>
          
          <StepIndicator 
            steps={steps} 
            currentStep={currentStep} 
            onStepClick={goToStep}
            isStepComplete={isStepComplete}
          />
        </div>

        {/* Current Step Content */}
        <div className={`bg-gradient-to-r ${currentStepData.bgGradient} rounded-3xl shadow-2xl border border-white/50 backdrop-blur-sm`}>
          <div className="p-8 md:p-12">
            {/* Step Header */}
            <div className="text-center mb-8">
              <div className="relative inline-block mb-6">
                <div className={`absolute inset-0 bg-gradient-to-r ${currentStepData.color} rounded-full blur opacity-30 animate-pulse`}></div>
                <div className="relative bg-white rounded-full p-4 shadow-lg">
                  <currentStepData.icon className="w-8 h-8 text-gray-700" />
                </div>
              </div>
              <h2 className={`text-3xl font-bold bg-gradient-to-r ${currentStepData.color} bg-clip-text text-transparent mb-2`}>
                {currentStepData.title}
              </h2>
              <p className="text-lg text-gray-600">{currentStepData.subtitle}</p>
            </div>

            {/* Step Component */}
            <div className={`transition-all duration-300 ${isAnimating ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'}`}>
              <StepComponent 
                data={formData} 
                onDataChange={handleDataChange}
              />
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-12">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className={`group flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
              currentStep === 0
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-lg transform hover:scale-105'
            }`}
          >
            <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            <span>Previous</span>
          </button>

          <div className="flex items-center space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? 'bg-purple-500 scale-125'
                    : index < currentStep
                    ? 'bg-green-500'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          {isLastStep ? (
            <button
              onClick={handleComplete}
              disabled={!canProceed}
              className={`group flex items-center space-x-2 px-8 py-4 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-105 ${
                canProceed
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg hover:shadow-xl'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              <Check className="w-5 h-5" />
              <span>Complete Setup</span>
              <div className="flex space-x-1">
                {[...Array(3)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 animate-pulse" style={{ animationDelay: `${i * 200}ms` }} />
                ))}
              </div>
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!canProceed}
              className={`group flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                canProceed
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600 shadow-lg hover:shadow-xl'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <span>Next Step</span>
              <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mt-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{Math.round(((currentStep + 1) / steps.length) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            >
              <div className="h-full bg-white opacity-30 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Encouraging Messages */}
        <div className="text-center mt-8">
          {currentStep === 0 && (
            <p className="text-gray-600 italic">
              💜 "Every journey begins with understanding where you are now"
            </p>
          )}
          {currentStep === 1 && (
            <p className="text-gray-600 italic">
              🍃 "Your preferences shape the meals that will nourish you"
            </p>
          )}
          {currentStep === 2 && (
            <p className="text-gray-600 italic">
              🎯 "Clear goals light the path to your wellness transformation"
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;