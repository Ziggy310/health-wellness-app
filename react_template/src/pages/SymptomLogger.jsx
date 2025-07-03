import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { format } from 'date-fns';
import Layout from '../components/common/Layout';

const SymptomLogger = () => {
  const { 
    addSymptomLog, 
    getSymptomHistory,
    isLoading,
    setIsLoading
  } = useAppContext();
  
  // State for symptom form
  const [symptomForm, setSymptomForm] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    time: format(new Date(), 'HH:mm'),
    type: '',
    severity: 5,
    duration: '',
    notes: '',
    triggers: [],
    customTrigger: ''
  });

  // State for symptom history
  const [symptomHistory, setSymptomHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  
  // Symptom categories
  const symptomTypes = [
    { value: "hotFlash", label: "Hot Flashes", icon: "🔥" },
    { value: "nightSweats", label: "Night Sweats", icon: "💦" },
    { value: "insomnia", label: "Insomnia", icon: "😴" },
    { value: "moodChanges", label: "Mood Changes", icon: "😢" },
    { value: "anxiety", label: "Anxiety", icon: "😰" },
    { value: "headache", label: "Headache", icon: "🤕" },
    { value: "jointPain", label: "Joint Pain", icon: "🦴" },
    { value: "fatigue", label: "Fatigue", icon: "😩" },
    { value: "brainFog", label: "Brain Fog", icon: "🧠" },
    { value: "other", label: "Other", icon: "❓" }
  ];
  
  // Duration options
  const durationOptions = [
    { value: "<5min", label: "Less than 5 minutes" },
    { value: "5-15min", label: "5-15 minutes" },
    { value: "15-30min", label: "15-30 minutes" },
    { value: "30-60min", label: "30-60 minutes" },
    { value: "1-3hrs", label: "1-3 hours" },
    { value: ">3hrs", label: "More than 3 hours" }
  ];
  
  // Common triggers
  const commonTriggers = [
    "Stress", "Alcohol", "Caffeine", "Spicy Food", 
    "Hot Weather", "Exercise", "Lack of Sleep"
  ];
  
  // Load symptom history on component mount
  useEffect(() => {
    const fetchSymptomHistory = async () => {
      setIsLoading(true);
      try {
        const history = await getSymptomHistory();
        setSymptomHistory(history || []);
      } catch (error) {
        console.error('Error fetching symptom history:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSymptomHistory();
  }, [getSymptomHistory, setIsLoading]);
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSymptomForm({
      ...symptomForm,
      [name]: value
    });
  };
  
  // Handle severity change
  const handleSeverityChange = (value) => {
    setSymptomForm({
      ...symptomForm,
      severity: value
    });
  };
  
  // Handle trigger selection
  const handleTriggerChange = (trigger) => {
    const updatedTriggers = [...symptomForm.triggers];
    
    if (updatedTriggers.includes(trigger)) {
      // Remove if already selected
      const index = updatedTriggers.indexOf(trigger);
      updatedTriggers.splice(index, 1);
    } else {
      // Add if not selected
      updatedTriggers.push(trigger);
    }
    
    setSymptomForm({
      ...symptomForm,
      triggers: updatedTriggers
    });
  };
  
  // Add custom trigger
  const handleAddCustomTrigger = () => {
    if (symptomForm.customTrigger.trim() !== '') {
      const updatedTriggers = [...symptomForm.triggers, symptomForm.customTrigger.trim()];
      
      setSymptomForm({
        ...symptomForm,
        triggers: updatedTriggers,
        customTrigger: ''
      });
    }
  };
  
  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!symptomForm.type) {
      // Show validation error
      alert('Please select a symptom type');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Create timestamp from date and time
      const timestamp = new Date(`${symptomForm.date}T${symptomForm.time}`).toISOString();
      
      // Create symptom log object
      const symptomLog = {
        id: Date.now().toString(),
        type: symptomForm.type,
        timestamp,
        severity: symptomForm.severity,
        duration: symptomForm.duration,
        notes: symptomForm.notes,
        triggers: symptomForm.triggers
      };
      
      // Add to context/storage
      await addSymptomLog(symptomLog);
      
      // Update local history
      setSymptomHistory([...symptomHistory, symptomLog]);
      
      // Reset form
      setSymptomForm({
        date: format(new Date(), 'yyyy-MM-dd'),
        time: format(new Date(), 'HH:mm'),
        type: '',
        severity: 5,
        duration: '',
        notes: '',
        triggers: [],
        customTrigger: ''
      });
      
      // Show success message
      alert('Symptom logged successfully!');
    } catch (error) {
      console.error('Error logging symptom:', error);
      alert('Failed to log symptom. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Get severity text based on value
  const getSeverityText = (value) => {
    if (value <= 2) return 'Mild';
    if (value <= 5) return 'Moderate';
    if (value <= 8) return 'Severe';
    return 'Very Severe';
  };
  
  // Get severity color based on value
  const getSeverityColor = (value) => {
    if (value <= 2) return 'bg-green-500';
    if (value <= 5) return 'bg-yellow-500';
    if (value <= 8) return 'bg-orange-500';
    return 'bg-red-500';
  };

  // Format date for display
  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    return `${format(date, 'MMM dd, yyyy')} at ${format(date, 'h:mm a')}`;
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 mb-16">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow-md p-6 mb-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold mb-1">Symptom Logger</h1>
              <p className="text-purple-100">Track and record your menopause symptoms to identify patterns and triggers.</p>
            </div>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white py-2 px-4 rounded-lg transition flex items-center"
            >
              {showHistory ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Log New Symptom
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
                  View Symptom History
                </>
              )}
            </button>
          </div>
        </div>
        
        {showHistory ? (
          /* Symptom History View */
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Symptom History</h2>
            
            {symptomHistory.length === 0 ? (
              <div className="text-center py-10 bg-gray-50 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-gray-500 mb-2">No symptom records found.</p>
                <button 
                  onClick={() => setShowHistory(false)} 
                  className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded transition"
                >
                  Log Your First Symptom
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {symptomHistory
                  .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                  .map(symptom => {
                    const symptomType = symptomTypes.find(type => type.value === symptom.type);
                  
                    return (
                      <div key={symptom.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
                        <div className="flex items-start">
                          <div className="rounded-full bg-purple-100 p-3 mr-4">
                            <span className="text-2xl" role="img" aria-label={symptomType?.label || "symptom"}>
                              {symptomType?.icon || "❓"}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <h3 className="text-lg font-medium text-gray-900">{symptomType?.label || "Unknown Symptom"}</h3>
                              <span className="text-sm text-gray-500">{formatDateTime(symptom.timestamp)}</span>
                            </div>
                            
                            <div className="flex items-center mt-2">
                              <div className="mr-1 text-sm font-medium text-gray-500">Severity: </div>
                              <div className="flex items-center">
                                <div className={`h-3 w-16 rounded-full ${getSeverityColor(symptom.severity)}`}></div>
                                <span className="ml-2 text-sm text-gray-700">{getSeverityText(symptom.severity)} ({symptom.severity})</span>
                              </div>
                            </div>
                            
                            {symptom.duration && (
                              <div className="text-sm text-gray-600 mt-1">
                                <span className="font-medium">Duration:</span> {durationOptions.find(d => d.value === symptom.duration)?.label || symptom.duration}
                              </div>
                            )}
                            
                            {symptom.triggers && symptom.triggers.length > 0 && (
                              <div className="mt-2">
                                <span className="text-sm font-medium text-gray-500">Triggers: </span>
                                <div className="flex flex-wrap mt-1">
                                  {symptom.triggers.map((trigger, index) => (
                                    <span 
                                      key={index} 
                                      className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded mr-1 mb-1"
                                    >
                                      {trigger}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {symptom.notes && (
                              <div className="mt-2">
                                <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">{symptom.notes}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        ) : (
          /* Symptom Form View */
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Log a New Symptom</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={symptomForm.date}
                    onChange={handleChange}
                    max={format(new Date(), 'yyyy-MM-dd')}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-purple-500 focus:border-purple-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input
                    type="time"
                    id="time"
                    name="time"
                    value={symptomForm.time}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-purple-500 focus:border-purple-500"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Symptom Type</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {symptomTypes.map(type => (
                    <button
                      type="button"
                      key={type.value}
                      onClick={() => setSymptomForm({ ...symptomForm, type: type.value })}
                      className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-all ${
                        symptomForm.type === type.value 
                          ? 'border-purple-500 bg-purple-50' 
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-2xl mb-1">{type.icon}</span>
                      <span className="text-sm font-medium text-gray-900">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Severity (Level: {symptomForm.severity})
                </label>
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 mr-4 w-14">Mild</span>
                  <div className="flex-1 relative">
                    <div className="h-2 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-full"></div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={symptomForm.severity}
                      onChange={(e) => handleSeverityChange(parseInt(e.target.value))}
                      className="absolute w-full top-1/2 transform -translate-y-1/2 appearance-none bg-transparent [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-600 [&::-webkit-slider-thumb]:cursor-pointer"
                    />
                  </div>
                  <span className="text-sm text-gray-500 ml-4 w-14">Severe</span>
                </div>
                <div className="text-right text-sm text-gray-500 mt-1">
                  {getSeverityText(symptomForm.severity)}
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                <select
                  id="duration"
                  name="duration"
                  value={symptomForm.duration}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">Select duration</option>
                  {durationOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Triggers (Optional)</label>
                <div className="flex flex-wrap mb-3 gap-2">
                  {commonTriggers.map(trigger => (
                    <button
                      type="button"
                      key={trigger}
                      onClick={() => handleTriggerChange(trigger)}
                      className={`py-1 px-3 text-sm rounded transition ${
                        symptomForm.triggers.includes(trigger)
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {trigger}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={symptomForm.customTrigger}
                    onChange={(e) => setSymptomForm({ ...symptomForm, customTrigger: e.target.value })}
                    placeholder="Add custom trigger..."
                    className="flex-1 p-2 border border-gray-300 rounded focus:ring-purple-500 focus:border-purple-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomTrigger}
                    disabled={!symptomForm.customTrigger.trim()}
                    className={`px-4 py-2 rounded ${
                      symptomForm.customTrigger.trim()
                        ? 'bg-purple-600 text-white hover:bg-purple-700'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Add
                  </button>
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={symptomForm.notes}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Add any additional notes about this symptom..."
                  className="w-full p-2 border border-gray-300 rounded focus:ring-purple-500 focus:border-purple-500"
                ></textarea>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading || !symptomForm.type}
                  className={`px-6 py-2 font-medium rounded transition ${
                    isLoading || !symptomForm.type
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-purple-600 text-white hover:bg-purple-700'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : 'Log Symptom'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SymptomLogger;