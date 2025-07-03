import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { subDays } from 'date-fns';
import Layout from '../components/common/Layout';
import SymptomForm from '../components/symptom-tracker/SymptomFormFixed';
import SymptomHistory from '../components/symptom-tracker/SymptomHistoryFixed';
import SymptomDetail from '../components/symptom-tracker/SymptomDetail';

const SymptomTrackerEnhanced = () => {
  const { 
    getSymptomHistory, 
    addSymptomLog, 
    isLoading, 
    setIsLoading 
  } = useAppContext();
  
  // State for symptom history
  const [symptomHistory, setSymptomHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
    endDate: new Date().toISOString().split('T')[0] // today
  });

  // State for tracking which symptom is selected for details view
  const [selectedSymptom, setSelectedSymptom] = useState(null);
  
  // State for chart data
  const [chartData, setChartData] = useState(null);
  
  // Canvas ref for chart
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  
  // Fetch symptom history on component mount
  useEffect(() => {
    const loadSymptomHistory = async () => {
      setIsLoading(true);
      try {
        const history = await getSymptomHistory();
        setSymptomHistory(history);
        filterSymptomHistory(history);
      } catch (error) {
        console.error('Failed to load symptom history:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSymptomHistory();
  }, [getSymptomHistory, setIsLoading]);
  
  // Filter symptom history based on date range
  const filterSymptomHistory = (history) => {
    const startTimestamp = new Date(dateRange.startDate).getTime();
    const endTimestamp = new Date(dateRange.endDate).getTime() + (24 * 60 * 60 * 1000 - 1); // End of the day
    
    const filtered = history.filter(item => {
      const itemTimestamp = new Date(item.timestamp).getTime();
      return itemTimestamp >= startTimestamp && itemTimestamp <= endTimestamp;
    });
    
    setFilteredHistory(filtered);
  };
  
  // Update filtered history when date range changes
  useEffect(() => {
    filterSymptomHistory(symptomHistory);
  }, [dateRange, symptomHistory]);
  
  // Handle submitting a new symptom - BYPASS AppContext completely
  const handleAddSymptom = (symptomLog) => {
    // Direct update to local state - no async needed!
    setSymptomHistory(prev => [...prev, symptomLog]);
    
    // Update filtered history immediately
    const startTimestamp = new Date(dateRange.startDate).getTime();
    const endTimestamp = new Date(dateRange.endDate).getTime() + (24 * 60 * 60 * 1000 - 1);
    const itemTimestamp = new Date(symptomLog.timestamp).getTime();
    
    if (itemTimestamp >= startTimestamp && itemTimestamp <= endTimestamp) {
      setFilteredHistory(prev => [...prev, symptomLog]);
    }
  };
  
  // Handle date range changes
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange({
      ...dateRange,
      [name]: value
    });
  };
  
  // Quick filters for date range
  const setQuickDateRange = (days) => {
    const endDate = new Date();
    const startDate = subDays(endDate, days);
    
    setDateRange({
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    });
  };

  // Show symptom details
  const handleViewDetails = (symptom) => {
    setSelectedSymptom(symptom);
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        {/* Header with enhanced UI */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow-md p-6 mb-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold mb-1">Symptom Tracker</h1>
              <p className="text-purple-100">Track your menopause symptoms to identify patterns and manage your health effectively.</p>
            </div>
            <div className="hidden md:block">
              <div className="bg-white bg-opacity-20 rounded-lg p-3">
                <div className="flex items-center">
                  <div className="mr-4 text-right">
                    <div className="text-xs uppercase tracking-wide">Tracked</div>
                    <div className="font-semibold text-xl">{filteredHistory.length}</div>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-white bg-opacity-30 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Date Range Filter */}
        <div className="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-purple-700 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filter by Date
            </h2>
          </div>
          
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={dateRange.startDate}
                  onChange={handleDateChange}
                  max={dateRange.endDate}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={dateRange.endDate}
                  onChange={handleDateChange}
                  min={dateRange.startDate}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => setQuickDateRange(7)} 
                className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors"
              >
                Last 7 Days
              </button>
              <button 
                onClick={() => setQuickDateRange(14)} 
                className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors"
              >
                Last 14 Days
              </button>
              <button 
                onClick={() => setQuickDateRange(30)} 
                className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors"
              >
                Last 30 Days
              </button>
              <button 
                onClick={() => setQuickDateRange(90)} 
                className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors"
              >
                Last 3 Months
              </button>
            </div>
          </div>
        </div>
        
        {/* Symptom Form Component */}
        <SymptomForm onSubmit={handleAddSymptom} isLoading={isLoading} />
        
        {/* Symptom History Component */}
        <SymptomHistory dateRange={dateRange} onSymptomSelect={handleViewDetails} />
        
        {/* Symptom Details Modal */}
        {selectedSymptom && (
          <SymptomDetail symptom={selectedSymptom} onClose={() => setSelectedSymptom(null)} />
        )}
      </div>
    </Layout>
  );
};

export default SymptomTrackerEnhanced;
