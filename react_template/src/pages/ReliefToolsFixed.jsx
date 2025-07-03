import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import Layout from '../components/common/Layout';

// Relief tool categories with proper meaningful icons
const RELIEF_CATEGORIES = {
  PHYSICAL: 'Physical Relief',
  EMOTIONAL: 'Emotional Wellness', 
  COGNITIVE: 'Mental Clarity',
  SLEEP: 'Sleep Support'
};

// Individual relief tools with meaningful SVG icons
const RELIEF_TOOLS = [
  {
    id: 'cooling-breath',
    name: 'Cooling Breath Technique',
    category: RELIEF_CATEGORIES.PHYSICAL,
    description: 'A breathing technique to help cool your body during hot flashes',
    duration: '2-3 minutes',
    difficulty: 'Easy',
    color: 'from-blue-400 to-cyan-500',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
      </svg>
    )
  },
  {
    id: 'joint-relief',
    name: 'Gentle Joint Relief',
    category: RELIEF_CATEGORIES.PHYSICAL,
    description: 'Light stretching exercises to ease joint stiffness and pain',
    duration: '5-10 minutes',
    difficulty: 'Easy',
    color: 'from-orange-400 to-red-500',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    )
  },
  {
    id: 'mood-lift',
    name: 'Mood Lifting Exercise',
    category: RELIEF_CATEGORIES.EMOTIONAL,
    description: 'Simple exercises to boost your mood and reduce anxiety',
    duration: '3-5 minutes',
    difficulty: 'Easy',
    color: 'from-yellow-400 to-orange-500',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    )
  },
  {
    id: 'calming-breath',
    name: 'Calming Breath Practice',
    category: RELIEF_CATEGORIES.EMOTIONAL,
    description: 'Breathing exercises to reduce stress and promote relaxation',
    duration: '5-10 minutes',
    difficulty: 'Easy',
    color: 'from-teal-400 to-blue-500',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    )
  },
  {
    id: 'focus-meditation',
    name: 'Focus Enhancement',
    category: RELIEF_CATEGORIES.COGNITIVE,
    description: 'Meditation techniques to improve concentration and mental clarity',
    duration: '10-15 minutes',
    difficulty: 'Medium',
    color: 'from-purple-400 to-indigo-500',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    )
  },
  {
    id: 'sleep-prep',
    name: 'Sleep Preparation',
    category: RELIEF_CATEGORIES.SLEEP,
    description: 'Relaxation routine to prepare your body and mind for restful sleep',
    duration: '10-20 minutes',
    difficulty: 'Easy',
    color: 'from-indigo-400 to-purple-500',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    )
  },
  {
    id: 'night-sweat-relief',
    name: 'Night Sweat Relief',
    category: RELIEF_CATEGORIES.SLEEP,
    description: 'Cooling techniques and preparation to manage night sweats',
    duration: '5 minutes',
    difficulty: 'Easy',
    color: 'from-cyan-400 to-blue-500',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
      </svg>
    )
  }
];

// Symptom-based relief mapping with proper icons
const SYMPTOM_RELIEF_MAP = {
  physical: {
    name: 'Physical Symptoms',
    color: 'from-orange-400 to-red-500',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    tools: ['cooling-breath', 'joint-relief']
  },
  emotional: {
    name: 'Emotional Wellness',
    color: 'from-pink-400 to-rose-500',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    tools: ['mood-lift', 'calming-breath']
  },
  cognitive: {
    name: 'Mental Clarity',
    color: 'from-purple-400 to-indigo-500',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    tools: ['focus-meditation']
  },
  sleep: {
    name: 'Sleep Support',
    color: 'from-indigo-400 to-purple-600',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    ),
    tools: ['sleep-prep', 'night-sweat-relief']
  }
};

const ReliefToolsFixed = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAppContext();
  
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTool, setSelectedTool] = useState(null);
  const [isDetailView, setIsDetailView] = useState(false);

  // Filter tools by category
  const filteredTools = selectedCategory 
    ? RELIEF_TOOLS.filter(tool => tool.category === selectedCategory)
    : RELIEF_TOOLS;

  // Handle tool selection
  const handleToolSelect = (tool) => {
    setSelectedTool(tool);
    setIsDetailView(true);
  };

  // Handle back to overview
  const handleBackToOverview = () => {
    setIsDetailView(false);
    setSelectedTool(null);
  };

  // Handle symptom-based browsing
  const handleSymptomSelect = (symptomKey) => {
    const symptom = SYMPTOM_RELIEF_MAP[symptomKey];
    const symptomTools = RELIEF_TOOLS.filter(tool => symptom.tools.includes(tool.id));
    // For now, just show the first tool for that symptom
    if (symptomTools.length > 0) {
      handleToolSelect(symptomTools[0]);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        {!isDetailView ? (
          <>
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow-md p-6 mb-6 text-white">
              <h1 className="text-2xl font-bold mb-2">Relief Tools</h1>
              <p className="text-purple-100">
                Quick relief techniques for managing menopause symptoms. Choose by category or symptom type.
              </p>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">Browse by Category</h2>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === null
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  All Categories
                </button>
                {Object.values(RELIEF_CATEGORIES).map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Browse by Symptom Type */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">Browse by Symptom Type</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(SYMPTOM_RELIEF_MAP).map(([key, symptom]) => (
                  <button
                    key={key}
                    onClick={() => handleSymptomSelect(key)}
                    className={`bg-gradient-to-br ${symptom.color} rounded-lg p-4 text-white hover:opacity-90 transition-opacity`}
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="mb-2">{symptom.icon}</div>
                      <span className="text-sm font-medium">{symptom.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Recommended Relief Tools */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">
                {selectedCategory ? `${selectedCategory} Tools` : 'Recommended Relief Tools'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTools.map((tool) => (
                  <div
                    key={tool.id}
                    onClick={() => handleToolSelect(tool)}
                    className="cursor-pointer group"
                  >
                    <div className={`bg-gradient-to-br ${tool.color} rounded-lg p-6 text-white hover:opacity-90 transition-opacity`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="text-white">{tool.icon}</div>
                        <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">
                          {tool.difficulty}
                        </span>
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{tool.name}</h3>
                      <p className="text-sm opacity-90 mb-2">{tool.description}</p>
                      <div className="flex justify-between items-center text-xs">
                        <span>{tool.duration}</span>
                        <span className="bg-white bg-opacity-20 px-2 py-1 rounded">
                          {tool.category}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          /* Detail View */
          <div>
            {/* Back Button */}
            <button
              onClick={handleBackToOverview}
              className="flex items-center text-purple-600 hover:text-purple-800 mb-4 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Relief Tools
            </button>

            {/* Tool Detail */}
            {selectedTool && (
              <div className={`bg-gradient-to-br ${selectedTool.color} rounded-lg p-6 text-white mb-6`}>
                <div className="flex items-center mb-4">
                  <div className="mr-4">{selectedTool.icon}</div>
                  <div>
                    <h1 className="text-2xl font-bold">{selectedTool.name}</h1>
                    <p className="opacity-90">{selectedTool.description}</p>
                  </div>
                </div>
                <div className="flex gap-4 text-sm">
                  <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
                    {selectedTool.duration}
                  </span>
                  <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
                    {selectedTool.difficulty}
                  </span>
                  <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
                    {selectedTool.category}
                  </span>
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">How to Practice</h2>
              
              {selectedTool?.id === 'cooling-breath' && (
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-blue-100 rounded-full p-2 mr-3 mt-1">
                      <span className="text-blue-600 font-semibold text-sm">1</span>
                    </div>
                    <p className="text-gray-700">Sit comfortably with your back straight and shoulders relaxed.</p>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-blue-100 rounded-full p-2 mr-3 mt-1">
                      <span className="text-blue-600 font-semibold text-sm">2</span>
                    </div>
                    <p className="text-gray-700">Curl your tongue and inhale slowly through the curled tongue for 4 counts.</p>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-blue-100 rounded-full p-2 mr-3 mt-1">
                      <span className="text-blue-600 font-semibold text-sm">3</span>
                    </div>
                    <p className="text-gray-700">Close your mouth and exhale slowly through your nose for 6 counts.</p>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-blue-100 rounded-full p-2 mr-3 mt-1">
                      <span className="text-blue-600 font-semibold text-sm">4</span>
                    </div>
                    <p className="text-gray-700">Repeat for 5-10 cycles or until you feel cooler.</p>
                  </div>
                </div>
              )}

              {selectedTool?.id === 'joint-relief' && (
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-orange-100 rounded-full p-2 mr-3 mt-1">
                      <span className="text-orange-600 font-semibold text-sm">1</span>
                    </div>
                    <p className="text-gray-700">Start with gentle neck rolls - 5 times in each direction.</p>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-orange-100 rounded-full p-2 mr-3 mt-1">
                      <span className="text-orange-600 font-semibold text-sm">2</span>
                    </div>
                    <p className="text-gray-700">Roll your shoulders backward and forward 5 times each.</p>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-orange-100 rounded-full p-2 mr-3 mt-1">
                      <span className="text-orange-600 font-semibold text-sm">3</span>
                    </div>
                    <p className="text-gray-700">Gently stretch your wrists by flexing and extending them 10 times.</p>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-orange-100 rounded-full p-2 mr-3 mt-1">
                      <span className="text-orange-600 font-semibold text-sm">4</span>
                    </div>
                    <p className="text-gray-700">End with gentle ankle circles - 5 times in each direction.</p>
                  </div>
                </div>
              )}

              {selectedTool?.id === 'sleep-prep' && (
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-indigo-100 rounded-full p-2 mr-3 mt-1">
                      <span className="text-indigo-600 font-semibold text-sm">1</span>
                    </div>
                    <p className="text-gray-700">Dim all lights in your bedroom 30 minutes before sleep.</p>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-indigo-100 rounded-full p-2 mr-3 mt-1">
                      <span className="text-indigo-600 font-semibold text-sm">2</span>
                    </div>
                    <p className="text-gray-700">Practice deep breathing: inhale for 4, hold for 4, exhale for 6.</p>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-indigo-100 rounded-full p-2 mr-3 mt-1">
                      <span className="text-indigo-600 font-semibold text-sm">3</span>
                    </div>
                    <p className="text-gray-700">Progressive muscle relaxation: tense and release each muscle group.</p>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-indigo-100 rounded-full p-2 mr-3 mt-1">
                      <span className="text-indigo-600 font-semibold text-sm">4</span>
                    </div>
                    <p className="text-gray-700">Focus on gratitude - think of 3 positive things from your day.</p>
                  </div>
                </div>
              )}

              {/* Default instructions for other tools */}
              {!['cooling-breath', 'joint-relief', 'sleep-prep'].includes(selectedTool?.id) && (
                <div className="space-y-4">
                  <p className="text-gray-700">This relief technique can help manage your symptoms effectively.</p>
                  <p className="text-gray-700">Find a quiet, comfortable space where you won't be interrupted.</p>
                  <p className="text-gray-700">Take your time and focus on the present moment.</p>
                  <p className="text-gray-700">If you feel uncomfortable at any point, stop and rest.</p>
                </div>
              )}

              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-yellow-800 text-sm">
                    <strong>Remember:</strong> These techniques are complementary to medical treatment. 
                    Consult your healthcare provider for persistent or severe symptoms.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ReliefToolsFixed;