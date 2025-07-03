import React from 'react';
import { format, isToday, isYesterday } from 'date-fns';

const SymptomHistory = ({ symptomHistory, onViewDetails }) => {
  // Get symptom category color
  const getCategoryColor = (category) => {
    switch(category) {
      case 'PHYSICAL':
        return 'bg-red-100 text-red-800';
      case 'EMOTIONAL':
        return 'bg-blue-100 text-blue-800';
      case 'COGNITIVE':
        return 'bg-purple-100 text-purple-800';
      case 'SLEEP':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get severity badge color
  const getSeverityColor = (severity) => {
    if (severity > 3) return 'bg-red-100 text-red-800';
    if (severity > 1) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };
  
  // Get severity emoji
  const getSeverityEmoji = (severity) => {
    if (severity > 3) return '🔴';
    if (severity > 1) return '🟡';
    return '🟢';
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'MMM d, yyyy');
  };

  // Get the grouped symptom history by date
  const getGroupedSymptomHistory = () => {
    const grouped = {};
    
    symptomHistory.forEach(symptom => {
      const dateStr = new Date(symptom.timestamp).toISOString().split('T')[0];
      if (!grouped[dateStr]) {
        grouped[dateStr] = [];
      }
      grouped[dateStr].push(symptom);
    });
    
    // Convert to array and sort by date (latest first)
    return Object.entries(grouped)
      .map(([date, symptoms]) => ({
        date,
        displayDate: formatDate(date),
        symptoms
      }))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const groupedHistory = getGroupedSymptomHistory();

  return (
    <div className="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-purple-700 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          Symptom History
        </h2>
      </div>
      
      <div className="p-4">
        {groupedHistory.length > 0 ? (
          <div className="space-y-6">
            {groupedHistory.map((group) => (
              <div key={group.date} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                <div className="flex items-center mb-3">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-purple-100 text-purple-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-800">{group.displayDate}</h3>
                    <p className="text-sm text-gray-500">{group.symptoms.length} symptom{group.symptoms.length !== 1 ? 's' : ''} recorded</p>
                  </div>
                </div>
                
                <div className="space-y-2 ml-13">
                  {group.symptoms.map((symptom) => (
                    <div 
                      key={symptom.id} 
                      className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors duration-150"
                      onClick={() => onViewDetails(symptom)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">{symptom.name}</h4>
                          <div className="flex flex-wrap gap-2 mt-1">
                            <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded ${getCategoryColor(symptom.category)}`}>
                              {symptom.category}
                            </span>
                            <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded ${getSeverityColor(symptom.severity)}`}>
                              Severity: {symptom.severity} {getSeverityEmoji(symptom.severity)}
                            </span>
                            <span className="inline-block px-2 py-0.5 text-xs font-medium rounded bg-gray-100 text-gray-800">
                              {format(new Date(symptom.timestamp), 'h:mm a')}
                            </span>
                          </div>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      {symptom.notes && (
                        <p className="text-sm text-gray-600 mt-2 line-clamp-1">{symptom.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-gray-500 mb-2">No symptoms recorded in this date range.</p>
            <p className="text-sm text-gray-400">Try selecting a different date range or log new symptoms.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SymptomHistory;
