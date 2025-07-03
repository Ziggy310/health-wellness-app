import React from 'react';
import { format } from 'date-fns';

const SymptomDetail = ({ symptom, onClose }) => {
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

  if (!symptom) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 m-4" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-gray-900">{symptom.name}</h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${getCategoryColor(symptom.category)}`}>
              {symptom.category}
            </span>
            <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ml-2 ${getSeverityColor(symptom.severity)}`}>
              Severity: {symptom.severity} {getSeverityEmoji(symptom.severity)}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Recorded on</p>
            <p className="text-base text-gray-900">
              {format(new Date(symptom.timestamp), 'MMMM d, yyyy \'at\' h:mm a')}
            </p>
          </div>
          {symptom.notes && (
            <div>
              <p className="text-sm font-medium text-gray-700">Notes</p>
              <p className="text-base text-gray-900 bg-gray-50 p-3 rounded">{symptom.notes}</p>
            </div>
          )}
          {/* Potential triggers section */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-2">Potential Factors</p>
            <div className="flex flex-wrap gap-2">
              <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded">Diet</span>
              <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded">Stress</span>
              <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded">Sleep</span>
              <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded">Exercise</span>
            </div>
          </div>
          
          {/* Correlation data */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-2">Insights</p>
            <div className="bg-purple-50 p-3 rounded">
              <p className="text-sm text-purple-800">
                <span className="font-medium">Pattern detected:</span> This symptom often occurs 2-3 hours after meals high in processed sugar.
              </p>
              <div className="flex items-center mt-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-600 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <p className="text-xs text-purple-600">Try reducing refined sugars in your diet</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex space-x-3 justify-end">
          <button 
            className="px-4 py-2 bg-gray-200 text-gray-800 text-sm font-medium rounded-md hover:bg-gray-300"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SymptomDetail;
