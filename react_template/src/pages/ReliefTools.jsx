import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { SymptomCategory } from '../utils/types';
import Navigation from '../components/common/Navigation';

const ReliefTools = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { topSymptoms } = useAppContext();
  
  const [activeExercise, setActiveExercise] = useState(id || null);
  const [exerciseStep, setExerciseStep] = useState(0);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  
  // Relief tools organized by symptom category
  const reliefTools = {
    [SymptomCategory.PHYSICAL]: [
      {
        id: 'cooling',
        name: 'Cooling Visualization',
        description: 'A mental technique to reduce hot flashes',
        duration: '3 minutes',
        forSymptoms: ['hotFlashes', 'nightSweats'],
        steps: [
          'Find a comfortable position, either sitting or lying down.',
          'Close your eyes and take three deep, slow breaths.',
          'Imagine yourself in a cool, peaceful environment - perhaps by a mountain stream or on a snow-capped peak.',
          'Feel the cool air on your skin, hear the sound of water or gentle wind.',
          'With each breath, imagine drawing coolness into your body.',
          'As you exhale, release any heat and tension.'
        ],
        image: '/assets/images/cooling-visualization.jpg'
      },
      {
        id: 'jointRelief',
        name: 'Gentle Joint Stretch',
        description: 'Simple stretches to reduce joint discomfort',
        duration: '5 minutes',
        forSymptoms: ['jointPain', 'stiffness'],
        steps: [
          'Start seated in a comfortable chair with your feet flat on the floor.',
          'Gently roll your shoulders backward 5 times, then forward 5 times.',
          'Extend each arm in front of you, then gently roll your wrists 5 times in each direction.',
          'Slowly tilt your head to the right, feeling a gentle stretch. Hold for 10 seconds.',
          'Repeat on the left side, then forward and back.',
          'Finish by gently rotating your ankles 5 times in each direction.'
        ],
        image: '/assets/images/joint-stretch.jpg'
      }
    ],
    [SymptomCategory.EMOTIONAL]: [
      {
        id: 'moodLift',
        name: 'Mood Lifting Exercise',
        description: 'Quick practice to boost your spirits',
        duration: '4 minutes',
        forSymptoms: ['moodChanges', 'irritability'],
        steps: [
          'Sit comfortably and take a few deep breaths.',
          'Think of three things you are grateful for today, no matter how small.',
          'Recall a moment when you felt happy or accomplished. Try to fully experience that memory.',
          'Place your hand on your heart and repeat: "I accept my feelings without judgment."',
          'Smile gently, even if it feels forced at first.',
          'Notice any positive shift in your mood, however subtle.'
        ],
        image: '/assets/images/mood-lift.jpg'
      },
      {
        id: 'calmingBreath',
        name: 'Calming Breath Technique',
        description: 'Breathing exercise to reduce anxiety',
        duration: '3 minutes',
        forSymptoms: ['anxiety', 'stress', 'irritability'],
        steps: [
          'Sit in a comfortable position with your back straight.',
          'Place one hand on your chest and one on your abdomen.',
          'Inhale slowly through your nose for a count of 4, feeling your abdomen expand.',
          'Hold your breath for a count of 1.',
          'Exhale slowly through your mouth for a count of 6.',
          'Repeat this cycle for 6-8 breaths.'
        ],
        image: '/assets/images/calming-breath.jpg'
      }
    ],
    [SymptomCategory.COGNITIVE]: [
      {
        id: 'mindClearing',
        name: 'Mind Clearing Exercise',
        description: 'Help clear brain fog and improve focus',
        duration: '5 minutes',
        forSymptoms: ['brainFog', 'memoryIssues', 'difficultyConcentrating'],
        steps: [
          'Sit in a quiet place where you will not be disturbed.',
          'Close your eyes and take three deep breaths.',
          'Imagine your thoughts as clouds in the sky, simply passing by.',
          'Focus your attention on your breathing for 1 minute.',
          'Now count backward from 100 by 7 (100, 93, 86...).',
          'Return to focusing on your breath for another minute.'
        ],
        image: '/assets/images/mind-clearing.jpg'
      }
    ],
    [SymptomCategory.SLEEP]: [
      {
        id: 'sleepPrep',
        name: 'Sleep Preparation Routine',
        description: 'Evening routine to prepare for better sleep',
        duration: '10 minutes',
        forSymptoms: ['sleepIssues', 'insomnia'],
        steps: [
          'One hour before bed, dim the lights in your home.',
          'Take 5 minutes to write down any thoughts or worries.',
          'Do some gentle stretching focusing on your neck, shoulders, and back.',
          'Take a warm shower or bath.',
          'Practice progressive muscle relaxation in bed: tense and release each muscle group.',
          'Focus on your breathing as you drift off to sleep.'
        ],
        image: '/assets/images/sleep-prep.jpg'
      },
      {
        id: 'nightSweatsRelief',
        name: 'Night Sweats Relief',
        description: 'Techniques to manage night sweats for better sleep',
        duration: '5 minutes',
        forSymptoms: ['nightSweats', 'sleepIssues'],
        steps: [
          'Prepare your bedroom: set temperature between 60-67°F (15-19°C) if possible.',
          'Layer your bedding so you can easily adjust during the night.',
          'Keep a glass of cool water by your bed.',
          'Before sleep, practice the cooling visualization technique.',
          'If you wake up during the night, take slow deep breaths.',
          'Apply a cool washcloth to your forehead or neck if needed.'
        ],
        image: '/assets/images/night-sweats.jpg'
      }
    ]
  };
  
  // Flatten all tools into a single array for easy lookup
  const allTools = Object.values(reliefTools).flat();
  
  // Get the currently selected exercise
  const currentExercise = activeExercise ? allTools.find(tool => tool.id === activeExercise) : null;
  
  // Filter tools based on user's symptoms
  const getRecommendedTools = () => {
    if (!topSymptoms || topSymptoms.length === 0) {
      // If no symptoms, return a mix of tools
      return allTools.slice(0, 4);
    }
    
    // Map user symptoms to relevant tools
    const userSymptomIds = topSymptoms.map(symptom => symptom.id);
    
    return allTools.filter(tool => 
      tool.forSymptoms.some(symptomId => userSymptomIds.includes(symptomId))
    );
  };
  
  const recommendedTools = getRecommendedTools();
  
  // Handle starting an exercise
  const handleStartExercise = (exerciseId) => {
    setActiveExercise(exerciseId);
    setExerciseStep(0);
  };
  
  // Navigate through exercise steps
  const handleNextStep = () => {
    if (currentExercise && exerciseStep < currentExercise.steps.length - 1) {
      setExerciseStep(exerciseStep + 1);
    } else {
      // Exercise complete
      setExerciseStep(0);
    }
  };
  
  const handlePrevStep = () => {
    if (exerciseStep > 0) {
      setExerciseStep(exerciseStep - 1);
    }
  };
  
  // Handle audio playback
  const toggleAudio = () => {
    setIsAudioPlaying(!isAudioPlaying);
    // In a real implementation, this would handle actual audio playback
  };
  
  // Get icon for symptom category
  const getCategoryIcon = (category) => {
    switch (category) {
      case SymptomCategory.PHYSICAL:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        );
      case SymptomCategory.EMOTIONAL:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case SymptomCategory.COGNITIVE:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        );
      case SymptomCategory.SLEEP:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        );
      default:
        return null;
    }
  };
  
  // Get color for symptom category
  const getCategoryColor = (category) => {
    switch (category) {
      case SymptomCategory.PHYSICAL:
        return 'text-red-600 bg-red-50 border-red-200';
      case SymptomCategory.EMOTIONAL:
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case SymptomCategory.COGNITIVE:
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case SymptomCategory.SLEEP:
        return 'text-indigo-600 bg-indigo-50 border-indigo-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-800 to-purple-500 text-white px-4 py-10">
        <div className="max-w-lg mx-auto">
          <h1 className="text-3xl font-bold mb-2">Relief Tools</h1>
          <p className="text-purple-100">Quick techniques to help manage your symptoms</p>
          
          <div className="flex items-center mt-6 space-x-3">
            <button className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-white/30 transition-colors flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add to Favorites
            </button>
            <button className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-white/30 transition-colors flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share
            </button>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="px-4 py-6 max-w-lg mx-auto">
        {/* Active exercise */}
        {currentExercise && (
          <div className="bg-white rounded-lg shadow-lg mb-8 border-t-4 border-purple-500">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <button 
                  onClick={() => setActiveExercise(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <span className="text-sm text-gray-500">
                  Step {exerciseStep + 1} of {currentExercise.steps.length}
                </span>
              </div>
              
              <h2 className="text-xl font-medium mb-1">{currentExercise.name}</h2>
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {currentExercise.duration}
              </div>
              
              <div className="relative h-48 rounded-lg mb-6 overflow-hidden flex items-center justify-center">
                {/* Color-coded tile based on exercise type */}
                {currentExercise.id === 'cooling' && (
                  <div className="w-full h-full bg-gradient-to-br from-blue-200 to-blue-300 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18.5a6.5 6.5 0 100-13 6.5 6.5 0 000 13zM12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                    </svg>
                  </div>
                )}
                {currentExercise.id === 'jointRelief' && (
                  <div className="w-full h-full bg-gradient-to-br from-orange-200 to-orange-300 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                )}
                {currentExercise.id === 'moodLift' && (
                  <div className="w-full h-full bg-gradient-to-br from-yellow-200 to-yellow-300 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                )}
                {currentExercise.id === 'calmingBreath' && (
                  <div className="w-full h-full bg-gradient-to-br from-teal-200 to-teal-300 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2M7 4h10M7 4v12a2 2 0 002 2h6a2 2 0 002-2V4M10 8v4m4-4v4" />
                    </svg>
                  </div>
                )}
                {!['cooling', 'jointRelief', 'moodLift', 'calmingBreath'].includes(currentExercise.id) && (
                  <div className="w-full h-full bg-gradient-to-br from-purple-200 to-purple-300 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                )}
                
                {/* Audio controls overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                  <button 
                    onClick={toggleAudio}
                    className="flex items-center text-white"
                  >
                    {!isAudioPlaying ? (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Play Audio Guide
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Pause Guide
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              <div className="bg-purple-50 p-6 rounded-lg mb-6 border border-purple-100 min-h-[180px] flex items-center justify-center">
                <div className="text-center">
                  {isAudioPlaying && (
                    <div className="flex justify-center mb-4">
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4].map((bar) => (
                          <div 
                            key={bar}
                            className="w-1.5 h-8 bg-purple-400 rounded-full animate-pulse"
                            style={{ animationDelay: `${bar * 0.15}s` }}
                          ></div>
                        ))}
                      </div>
                    </div>
                  )}
                  <p className="text-center text-lg font-medium">
                    {currentExercise.steps[exerciseStep]}
                  </p>
                  <p className="text-sm text-purple-600 mt-4 italic">
                    {isAudioPlaying ? "Audio guide playing..." : "Start audio guidance to enhance your experience"}
                  </p>
                </div>
              </div>
              
              <div className="mt-8">
                {/* Progress indicator */}
                <div className="mb-5">
                  <div className="flex justify-between mb-2">
                    <span className="text-xs text-gray-500">Start</span>
                    <span className="text-xs text-gray-500">Finish</span>
                  </div>
                  <div className="relative">
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-2 bg-purple-500 rounded-full transition-all duration-300" 
                        style={{ width: `${(exerciseStep / (currentExercise.steps.length - 1)) * 100}%` }}
                      ></div>
                    </div>
                    {currentExercise.steps.map((_, stepIndex) => (
                      <div 
                        key={stepIndex}
                        className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 transform -translate-x-1/2 transition-colors ${stepIndex <= exerciseStep ? 'bg-purple-500 border-purple-300' : 'bg-white border-gray-300'}`}
                        style={{ left: `${(stepIndex / (currentExercise.steps.length - 1)) * 100}%` }}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <button
                    onClick={handlePrevStep}
                    disabled={exerciseStep === 0}
                    className={`px-5 py-2.5 flex items-center rounded-lg shadow-sm ${
                      exerciseStep === 0 
                        ? 'text-gray-400 bg-gray-100 cursor-not-allowed' 
                        : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Previous
                  </button>
                  
                  <button
                    onClick={handleNextStep}
                    className="px-5 py-2.5 bg-purple-600 text-white rounded-lg shadow-sm hover:bg-purple-700 flex items-center transition-colors"
                  >
                    {exerciseStep < currentExercise.steps.length - 1 ? (
                      <>
                        Next
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </>
                    ) : (
                      <>
                        Finish Exercise
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {!currentExercise && (
          <>
            {/* Recommended tools */}
            <div className="mb-10">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Recommended for You</h2>
                <span className="text-sm text-purple-600">Based on your symptoms</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {recommendedTools.slice(0, 4).map(tool => {
                  // Determine styling based on tool type
                  let tileStyle = { bg: '', icon: null };
                  
                  if (tool.id === 'cooling') {
                    tileStyle = {
                      bg: 'bg-gradient-to-br from-blue-200 to-blue-300',
                      icon: (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18.5a6.5 6.5 0 100-13 6.5 6.5 0 000 13zM12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                        </svg>
                      )
                    };
                  } else if (tool.id === 'jointRelief') {
                    tileStyle = {
                      bg: 'bg-gradient-to-br from-orange-200 to-orange-300',
                      icon: (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      )
                    };
                  } else if (tool.id === 'moodLift') {
                    tileStyle = {
                      bg: 'bg-gradient-to-br from-yellow-200 to-yellow-300',
                      icon: (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )
                    };
                  } else if (tool.id === 'calmingBreath') {
                    tileStyle = {
                      bg: 'bg-gradient-to-br from-teal-200 to-teal-300',
                      icon: (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2M7 4h10M7 4v12a2 2 0 002 2h6a2 2 0 002-2V4M10 8v4m4-4v4" />
                        </svg>
                      )
                    };
                  } else {
                    tileStyle = {
                      bg: 'bg-gradient-to-br from-purple-200 to-purple-300',
                      icon: (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      )
                    };
                  }
                  
                  return (
                    <div 
                      key={tool.id}
                      onClick={() => handleStartExercise(tool.id)}
                      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-all"
                    >
                      <div className={`h-36 ${tileStyle.bg} relative flex items-center justify-center`}>
                        {tileStyle.icon}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-3">
                          <div className="flex items-center gap-2">
                            <span className="bg-white/90 text-gray-800 rounded-full px-3 py-0.5 text-xs font-medium flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {tool.duration}
                            </span>
                            
                            {tool.forSymptoms.slice(0, 1).map(symptom => (
                              <span key={symptom} className="bg-white/90 text-gray-800 rounded-full px-3 py-0.5 text-xs font-medium">
                                {symptom.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-gray-800">{tool.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{tool.description}</p>
                        <button className="mt-3 text-purple-600 text-sm font-medium flex items-center hover:text-purple-800">
                          Start exercise
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Browse by category */}
            <h2 className="text-lg font-medium mb-4">Browse by Symptom Type</h2>
            
            {/* Physical */}
            <div className="mb-6">
              <div className="flex items-center mb-3">
                <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center mr-2">
                  {getCategoryIcon(SymptomCategory.PHYSICAL)}
                </div>
                <h3 className="text-md font-medium">Physical Relief</h3>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                {reliefTools[SymptomCategory.PHYSICAL].map(tool => (
                  <button 
                    key={tool.id} 
                    onClick={() => handleStartExercise(tool.id)}
                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-red-50 hover:border-red-200 transition-colors group"
                  >
                    <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mr-4 group-hover:bg-red-100">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div className="flex-grow text-left">
                      <h4 className="font-medium text-gray-800 group-hover:text-red-700">{tool.name}</h4>
                      <div className="flex items-center mt-1">
                        <span className="text-sm text-gray-500 mr-3">{tool.duration}</span>
                        {tool.forSymptoms.slice(0, 2).map((symptom, idx) => (
                          <span key={idx} className="text-xs bg-red-50 text-red-700 rounded-full px-2 py-0.5 mr-1">
                            {symptom.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </span>
                        ))}
                      </div>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Emotional */}
            <div className="mb-6">
              <div className="flex items-center mb-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2">
                  {getCategoryIcon(SymptomCategory.EMOTIONAL)}
                </div>
                <h3 className="text-md font-medium">Emotional Relief</h3>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                {reliefTools[SymptomCategory.EMOTIONAL].map(tool => (
                  <button 
                    key={tool.id} 
                    onClick={() => handleStartExercise(tool.id)}
                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-colors group"
                  >
                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mr-4 group-hover:bg-blue-100">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div className="flex-grow text-left">
                      <h4 className="font-medium text-gray-800 group-hover:text-blue-700">{tool.name}</h4>
                      <div className="flex items-center mt-1">
                        <span className="text-sm text-gray-500 mr-3">{tool.duration}</span>
                        {tool.forSymptoms.slice(0, 2).map((symptom, idx) => (
                          <span key={idx} className="text-xs bg-blue-50 text-blue-700 rounded-full px-2 py-0.5 mr-1">
                            {symptom.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </span>
                        ))}
                      </div>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Cognitive */}
            <div className="mb-6">
              <div className="flex items-center mb-3">
                <div className="w-6 h-6 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center mr-2">
                  {getCategoryIcon(SymptomCategory.COGNITIVE)}
                </div>
                <h3 className="text-md font-medium">Cognitive Relief</h3>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                {reliefTools[SymptomCategory.COGNITIVE].map(tool => (
                  <button 
                    key={tool.id} 
                    onClick={() => handleStartExercise(tool.id)}
                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-yellow-50 hover:border-yellow-200 transition-colors group"
                  >
                    <div className="w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center mr-4 group-hover:bg-yellow-100">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div className="flex-grow text-left">
                      <h4 className="font-medium text-gray-800 group-hover:text-yellow-700">{tool.name}</h4>
                      <div className="flex items-center mt-1">
                        <span className="text-sm text-gray-500 mr-3">{tool.duration}</span>
                        {tool.forSymptoms.slice(0, 2).map((symptom, idx) => (
                          <span key={idx} className="text-xs bg-yellow-50 text-yellow-700 rounded-full px-2 py-0.5 mr-1">
                            {symptom.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </span>
                        ))}
                      </div>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Sleep */}
            <div className="mb-6">
              <div className="flex items-center mb-3">
                <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mr-2">
                  {getCategoryIcon(SymptomCategory.SLEEP)}
                </div>
                <h3 className="text-md font-medium">Sleep Relief</h3>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                {reliefTools[SymptomCategory.SLEEP].map(tool => (
                  <button 
                    key={tool.id} 
                    onClick={() => handleStartExercise(tool.id)}
                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-200 transition-colors group"
                  >
                    <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mr-4 group-hover:bg-indigo-100">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div className="flex-grow text-left">
                      <h4 className="font-medium text-gray-800 group-hover:text-indigo-700">{tool.name}</h4>
                      <div className="flex items-center mt-1">
                        <span className="text-sm text-gray-500 mr-3">{tool.duration}</span>
                        {tool.forSymptoms.slice(0, 2).map((symptom, idx) => (
                          <span key={idx} className="text-xs bg-indigo-50 text-indigo-700 rounded-full px-2 py-0.5 mr-1">
                            {symptom.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </span>
                        ))}
                      </div>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
      
      {/* Navigation */}
      <Navigation />
    </div>
  );
};

export default ReliefTools;