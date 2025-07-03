import React, { useState } from 'react';
import { SymptomCategory } from '../../utils/types';

const SymptomForm = ({ onSubmit, isLoading }) => {
  // Common symptom options with categories
  const commonSymptoms = [
    { id: 'hot_flashes', name: 'Hot Flashes', category: SymptomCategory.PHYSICAL },
    { id: 'night_sweats', name: 'Night Sweats', category: SymptomCategory.SLEEP },
    { id: 'insomnia', name: 'Insomnia', category: SymptomCategory.SLEEP },
    { id: 'fatigue', name: 'Fatigue', category: SymptomCategory.PHYSICAL },
    { id: 'anxiety', name: 'Anxiety', category: SymptomCategory.EMOTIONAL },
    { id: 'mood_changes', name: 'Mood Changes', category: SymptomCategory.EMOTIONAL },
    { id: 'brain_fog', name: 'Brain Fog', category: SymptomCategory.COGNITIVE },
    { id: 'headaches', name: 'Headaches', category: SymptomCategory.PHYSICAL },
    { id: 'joint_pain', name: 'Joint Pain', category: SymptomCategory.PHYSICAL },
    { id: 'vaginal_dryness', name: 'Vaginal Dryness', category: SymptomCategory.PHYSICAL },
    { id: 'memory_issues', name: 'Memory Issues', category: SymptomCategory.COGNITIVE },
    { id: 'weight_gain', name: 'Weight Gain', category: SymptomCategory.PHYSICAL }
  ];

  // State for the new symptom form
  const [newSymptom, setNewSymptom] = useState({
    name: '',
    category: SymptomCategory.PHYSICAL,
    severity: 3,
    notes: '',
    logDate: new Date().toISOString().split('T')[0] // Default to today's date
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSymptom({
      ...newSymptom,
      [name]: name === 'severity' ? parseInt(value, 10) : value
    });
  };

  // Handle selecting a common symptom
  const handleSelectSymptom = (symptom) => {
    setNewSymptom({
      ...newSymptom,
      name: symptom.name,
      category: symptom.category
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Don't submit if no symptom name
    if (!newSymptom.name.trim()) return;
    
    // Create symptom timestamp based on selected date
    const logDate = new Date(newSymptom.logDate);
    // Set time to current time if today, otherwise noon
    const isToday = new Date().toDateString() === logDate.toDateString();
    const logTime = isToday ? new Date() : new Date(logDate.setHours(12, 0, 0, 0));
    
    const symptomLog = {
      id: `symptom_${Date.now()}`,
      name: newSymptom.name,
      category: newSymptom.category,
      severity: newSymptom.severity,
      notes: newSymptom.notes,
      timestamp: logTime
    };
    
    onSubmit(symptomLog);
    
    // Reset the form but keep the date
    setNewSymptom({
      name: '',
      category: SymptomCategory.PHYSICAL,
      severity: 3,
      notes: '',
      logDate: newSymptom.logDate
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-purple-700 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Log a New Symptom
        </h2>
      </div>
      
      <div className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Common Symptoms Quick Select with Category Indicators */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
              </svg>
              Common Symptoms
            </label>
            
            <div className="flex flex-wrap gap-2 mb-2">
              {commonSymptoms.map((symptom) => (
                <button
                  key={symptom.id}
                  type="button"
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${newSymptom.name === symptom.name
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                  onClick={() => handleSelectSymptom(symptom)}
                >
                  {symptom.name}
                </button>
              ))}
            </div>
            
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded">Physical</span>
              <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded">Emotional</span>
              <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded">Cognitive</span>
              <span className="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded">Sleep</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Custom Symptom Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                Symptom Name*
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={newSymptom.name}
                onChange={handleInputChange}
                placeholder="Enter symptom name"
                required
                className="w-full p-2 border border-gray-300 rounded focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            
            {/* Category Selection */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                Category
              </label>
              <select
                id="category"
                name="category"
                value={newSymptom.category}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-purple-500 focus:border-purple-500"
              >
                <option value={SymptomCategory.PHYSICAL}>Physical</option>
                <option value={SymptomCategory.EMOTIONAL}>Emotional</option>
                <option value={SymptomCategory.COGNITIVE}>Cognitive</option>
                <option value={SymptomCategory.SLEEP}>Sleep</option>
              </select>
            </div>
            
            {/* Date Selection */}
            <div>
              <label htmlFor="logDate" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Date
              </label>
              <input
                type="date"
                id="logDate"
                name="logDate"
                value={newSymptom.logDate}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-purple-500 focus:border-purple-500"
                max={new Date().toISOString().split('T')[0]} // Cannot select future dates
              />
            </div>
          </div>
          
          {/* Severity Selection */}
          <div className="mb-4">
            <label htmlFor="severity" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              Severity
            </label>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">{newSymptom.severity}</span>
                <input 
                  type="range" 
                  id="severity" 
                  name="severity" 
                  min="1" 
                  max="5" 
                  value={newSymptom.severity} 
                  onChange={handleInputChange}
                  className="w-3/4 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div className="flex justify-between text-xs text-gray-600 px-1 mt-1">
                <span>1 - Mild</span>
                <span>3 - Moderate</span>
                <span>5 - Severe</span>
              </div>
            </div>
          </div>
          
          {/* Notes */}
          <div className="mb-4">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Notes (optional)
            </label>
            <textarea
              id="notes"
              name="notes"
              value={newSymptom.notes}
              onChange={handleInputChange}
              placeholder="Add any details about this symptom..."
              rows="2"
              className="w-full p-2 border border-gray-300 rounded focus:ring-purple-500 focus:border-purple-500 bg-white"
            ></textarea>
            <p className="text-xs text-gray-500 mt-1">Include details about possible triggers, time of day, or related activities</p>
          </div>
          
          <div className="flex justify-end items-center">
            <button
              type="submit"
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 shadow-sm transition-all flex items-center"
              disabled={isLoading || !newSymptom.name.trim()}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Log Symptom
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SymptomForm;
