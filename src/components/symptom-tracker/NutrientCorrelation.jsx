import React, { useState } from 'react';

const NutrientCorrelation = ({ symptomHistory, nutrientData }) => {
  const [selectedSymptom, setSelectedSymptom] = useState('');
  
  // Group symptoms by name
  const symptomNames = [...new Set(symptomHistory.map(item => item.name))];
  
  // Sample correlation data (in a real app this would come from backend analysis)
  const correlationData = {
    'Hot Flashes': [
      { nutrient: 'Caffeine', correlation: 0.78, impact: 'increases', foods: ['Coffee', 'Tea', 'Dark Chocolate'] },
      { nutrient: 'Spicy Foods', correlation: 0.65, impact: 'increases', foods: ['Hot Peppers', 'Curry', 'Hot Sauce'] },
      { nutrient: 'Alcohol', correlation: 0.59, impact: 'increases', foods: ['Wine', 'Beer', 'Spirits'] },
      { nutrient: 'Magnesium', correlation: -0.45, impact: 'decreases', foods: ['Leafy Greens', 'Nuts', 'Seeds'] }
    ],
    'Insomnia': [
      { nutrient: 'Caffeine', correlation: 0.82, impact: 'increases', foods: ['Coffee', 'Energy Drinks', 'Cola'] },
      { nutrient: 'Vitamin B6', correlation: -0.51, impact: 'decreases', foods: ['Fish', 'Chickpeas', 'Bananas'] },
      { nutrient: 'Magnesium', correlation: -0.63, impact: 'decreases', foods: ['Almonds', 'Spinach', 'Avocado'] }
    ],
    'Mood Swings': [
      { nutrient: 'Sugar', correlation: 0.67, impact: 'increases', foods: ['Soda', 'Candy', 'Desserts'] },
      { nutrient: 'Omega-3', correlation: -0.58, impact: 'decreases', foods: ['Salmon', 'Walnuts', 'Flaxseeds'] },
      { nutrient: 'Vitamin D', correlation: -0.72, impact: 'decreases', foods: ['Fatty Fish', 'Egg Yolks', 'Fortified Foods'] }
    ],
    'Joint Pain': [
      { nutrient: 'Sugar', correlation: 0.54, impact: 'increases', foods: ['Processed Foods', 'Sweets', 'White Bread'] },
      { nutrient: 'Omega-3', correlation: -0.61, impact: 'decreases', foods: ['Fish', 'Flaxseeds', 'Walnuts'] },
      { nutrient: 'Turmeric', correlation: -0.49, impact: 'decreases', foods: ['Curry', 'Turmeric Tea', 'Golden Milk'] }
    ]
  };
  
  // Get correlations for the selected symptom
  const getCorrelationsForSymptom = (symptomName) => {
    return correlationData[symptomName] || [];
  };
  
  // Get color for correlation strength 
  const getCorrelationColor = (correlation, impact) => {
    const absCorrelation = Math.abs(correlation);
    
    if (impact === 'increases') {
      if (absCorrelation > 0.7) return 'bg-red-100 text-red-800';
      if (absCorrelation > 0.5) return 'bg-orange-100 text-orange-800';
      return 'bg-yellow-100 text-yellow-800';
    } else {
      if (absCorrelation > 0.7) return 'bg-green-100 text-green-800';
      if (absCorrelation > 0.5) return 'bg-teal-100 text-teal-800';
      return 'bg-blue-100 text-blue-800';
    }
  };
  
  // Format correlation percentage
  const formatCorrelation = (correlation) => {
    return `${Math.abs(correlation * 100).toFixed(0)}%`;
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-purple-700 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Nutrient & Symptom Correlations
        </h2>
      </div>
      
      <div className="p-4">
        <div className="mb-4">
          <label htmlFor="symptomSelect" className="block text-sm font-medium text-gray-700 mb-2">
            Select a symptom to see potential nutrient correlations:
          </label>
          <select
            id="symptomSelect"
            value={selectedSymptom}
            onChange={(e) => setSelectedSymptom(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="">Select a symptom</option>
            {Object.keys(correlationData).map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </div>
        
        {selectedSymptom ? (
          <div className="space-y-4">
            <div className="bg-purple-50 p-3 rounded">
              <p className="text-sm text-purple-800">
                <span className="font-medium">Analysis based on your logs:</span> We've analyzed your symptom logs and meal history to identify potential correlations between nutrients and your {selectedSymptom.toLowerCase()}.
              </p>
            </div>
            
            <div className="space-y-3">
              {getCorrelationsForSymptom(selectedSymptom).map((item, index) => (
                <div key={index} className="border border-gray-100 rounded-lg p-3 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-gray-900">{item.nutrient}</h3>
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${getCorrelationColor(item.correlation, item.impact)}`}>
                      {formatCorrelation(item.correlation)} {item.impact === 'increases' ? 'Increase' : 'Decrease'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {item.impact === 'increases' ? 
                      `${item.nutrient} appears to worsen your ${selectedSymptom.toLowerCase()}.` :
                      `${item.nutrient} appears to help reduce your ${selectedSymptom.toLowerCase()}.`
                    }
                  </p>
                  <div className="mt-2">
                    <div className="text-xs font-medium text-gray-500 mb-1">Common sources:</div>
                    <div className="flex flex-wrap gap-1">
                      {item.foods.map((food, foodIndex) => (
                        <span key={foodIndex} className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-800">
                          {food}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-blue-50 p-3 rounded">
              <p className="text-sm text-blue-800 flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span>
                  This analysis is based on your personal data and general nutritional science. For best results, continue logging your meals and symptoms regularly to improve the accuracy of these correlations.
                </span>
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <p className="text-gray-500 mb-2">Select a symptom to view nutrient correlations</p>
            <p className="text-sm text-gray-400">Discover how your diet may be influencing your menopause symptoms</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NutrientCorrelation;
