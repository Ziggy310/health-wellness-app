import React, { useState, useEffect } from 'react';
import { SymptomCategory } from '../../utils/types';

const SymptomHistoryFixed = ({ dateRange, onSymptomSelect }) => {
  const [symptoms, setSymptoms] = useState([]);
  const [filteredSymptoms, setFilteredSymptoms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load symptoms from localStorage
  const loadSymptoms = () => {
    setIsLoading(true);
    try {
      const storedSymptoms = localStorage.getItem('symptom_history');
      const parsedSymptoms = storedSymptoms ? JSON.parse(storedSymptoms) : [];
      
      // Sort by timestamp (newest first)
      const sortedSymptoms = parsedSymptoms.sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
      );
      
      setSymptoms(sortedSymptoms);
    } catch (error) {
      console.error('Error loading symptoms from localStorage:', error);
      setSymptoms([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter symptoms by date range
  useEffect(() => {
    if (!dateRange) {
      setFilteredSymptoms(symptoms);
      return;
    }

    const startTimestamp = new Date(dateRange.startDate).getTime();
    const endTimestamp = new Date(dateRange.endDate).getTime() + (24 * 60 * 60 * 1000 - 1);
    
    const filtered = symptoms.filter(symptom => {
      const symptomTimestamp = new Date(symptom.timestamp).getTime();
      return symptomTimestamp >= startTimestamp && symptomTimestamp <= endTimestamp;
    });
    
    setFilteredSymptoms(filtered);
  }, [symptoms, dateRange]);

  // Load symptoms on component mount
  useEffect(() => {
    loadSymptoms();
  }, []);

  // Listen for new symptoms being added
  useEffect(() => {
    const handleSymptomAdded = () => {
      loadSymptoms();
    };

    // Listen for custom events when symptoms are added
    window.addEventListener('symptomAdded', handleSymptomAdded);
    
    // Listen for localStorage changes (cross-tab updates)
    window.addEventListener('storage', handleSymptomAdded);

    return () => {
      window.removeEventListener('symptomAdded', handleSymptomAdded);
      window.removeEventListener('storage', handleSymptomAdded);
    };
  }, []);

  // Get category color
  const getCategoryColor = (category) => {
    switch (category) {
      case SymptomCategory.PHYSICAL:
        return 'bg-red-500';
      case SymptomCategory.EMOTIONAL:
        return 'bg-blue-500';
      case SymptomCategory.COGNITIVE:
        return 'bg-yellow-500';
      case SymptomCategory.SLEEP:
        return 'bg-indigo-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Get category display name
  const getCategoryName = (category) => {
    switch (category) {
      case SymptomCategory.PHYSICAL:
        return 'Physical';
      case SymptomCategory.EMOTIONAL:
        return 'Emotional';
      case SymptomCategory.COGNITIVE:
        return 'Cognitive';
      case SymptomCategory.SLEEP:
        return 'Sleep';
      default:
        return 'Unknown';
    }
  };

  // Format date for display
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return `Today at ${date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      })}`;
    } else if (diffDays === 1) {
      return `Yesterday at ${date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      })}`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      });
    }
  };

  // Render severity bars
  const renderSeverityBars = (severity) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(level => (
          <div
            key={level}
            className={`w-2 h-6 rounded-sm ${
              level <= severity ? 'bg-orange-500' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-purple-700 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Symptom History
        </h2>
        {filteredSymptoms.length > 0 && (
          <p className="text-sm text-gray-600 mt-1">
            {filteredSymptoms.length} symptom{filteredSymptoms.length !== 1 ? 's' : ''} logged
            {dateRange && (
              <span className="ml-1">
                from {new Date(dateRange.startDate).toLocaleDateString()} to {new Date(dateRange.endDate).toLocaleDateString()}
              </span>
            )}
          </p>
        )}
      </div>

      <div className="max-h-96 overflow-y-auto">
        {filteredSymptoms.length === 0 ? (
          <div className="p-6 text-center">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-500 mb-2">No symptoms logged yet</p>
            <p className="text-sm text-gray-400">
              {dateRange 
                ? 'No symptoms found in the selected date range' 
                : 'Start tracking your symptoms to see your history here'
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredSymptoms.map((symptom, index) => (
              <div
                key={symptom.id || index}
                className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => onSymptomSelect && onSymptomSelect(symptom)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center flex-1 min-w-0">
                    <div
                      className={`w-3 h-3 rounded-full mr-3 flex-shrink-0 ${getCategoryColor(symptom.category)}`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-gray-900 truncate">{symptom.name}</h3>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                          {getCategoryName(symptom.category)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        {formatDate(symptom.timestamp)}
                      </p>
                      {symptom.notes && (
                        <p className="text-sm text-gray-500 truncate">
                          "{symptom.notes}"
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                    <div className="text-right">
                      <div className="text-xs text-gray-500 mb-1">Severity</div>
                      {renderSeverityBars(symptom.severity)}
                    </div>
                    
                    {onSymptomSelect && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {filteredSymptoms.length > 0 && (
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <span>Physical</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span>Emotional</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                <span>Cognitive</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                <span>Sleep</span>
              </div>
            </div>
            
            <div className="text-xs text-gray-500">
              Severity: 1 (mild) - 5 (severe)
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SymptomHistoryFixed;