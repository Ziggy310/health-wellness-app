import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import Layout from '../components/common/Layout';
import { format, subDays, startOfDay, endOfDay, differenceInDays } from 'date-fns';

const HealthInsights = () => {
  const { 
    getSymptomHistory, 
    isLoading, 
    setIsLoading,
    meals,
    consumedMeals
  } = useAppContext();
  
  // State for data and date range
  const [symptomHistory, setSymptomHistory] = useState([]);
  const [correlationData, setCorrelationData] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: format(subDays(new Date(), 30), 'yyyy-MM-dd'), // Default to last 30 days
    endDate: format(new Date(), 'yyyy-MM-dd')
  });
  const [selectedSymptom, setSelectedSymptom] = useState('hotFlash');
  const [selectedNutrient, setSelectedNutrient] = useState('calcium');

  // Symptom types
  const symptomTypes = [
    { value: "hotFlash", label: "Hot Flashes" },
    { value: "nightSweats", label: "Night Sweats" },
    { value: "insomnia", label: "Insomnia" },
    { value: "moodChanges", label: "Mood Changes" },
    { value: "anxiety", label: "Anxiety" },
    { value: "headache", label: "Headache" },
    { value: "jointPain", label: "Joint Pain" },
    { value: "fatigue", label: "Fatigue" },
    { value: "brainFog", label: "Brain Fog" }
  ];
  
  // Nutrient types
  const nutrientTypes = [
    { value: "calcium", label: "Calcium" },
    { value: "magnesium", label: "Magnesium" },
    { value: "vitaminD", label: "Vitamin D" },
    { value: "vitaminE", label: "Vitamin E" },
    { value: "fiber", label: "Fiber" },
    { value: "protein", label: "Protein" },
    { value: "omega3", label: "Omega-3" }
  ];

  // Load symptom and meal history on component mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const history = await getSymptomHistory();
        setSymptomHistory(history || []);
        
        // After loading data, analyze correlations
        analyzeCorrelations(history, dateRange.startDate, dateRange.endDate);
      } catch (error) {
        console.error('Error loading health data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [getSymptomHistory, setIsLoading]);

  // Re-analyze when date range, symptom, or nutrient selection changes
  useEffect(() => {
    analyzeCorrelations(symptomHistory, dateRange.startDate, dateRange.endDate);
  }, [dateRange, selectedSymptom, selectedNutrient, symptomHistory]);

  // Handle date range changes
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange({
      ...dateRange,
      [name]: value
    });
  };

  // Analyze correlations between symptoms and nutrients
  const analyzeCorrelations = (symptoms, startDate, endDate) => {
    if (!symptoms || symptoms.length === 0) {
      setCorrelationData(null);
      return;
    }
    
    // Convert dates to timestamps for comparison
    const startTimestamp = new Date(startDate).getTime();
    const endTimestamp = endOfDay(new Date(endDate)).getTime();
    
    // Filter data by date range
    const filteredSymptoms = symptoms.filter(symptom => {
      const symptomTime = new Date(symptom.timestamp).getTime();
      return symptomTime >= startTimestamp && symptomTime <= endTimestamp;
    });
    
    // Group symptoms by date
    const symptomsGroupedByDate = {};
    
    filteredSymptoms.forEach(symptom => {
      const dateStr = format(new Date(symptom.timestamp), 'yyyy-MM-dd');
      
      if (!symptomsGroupedByDate[dateStr]) {
        symptomsGroupedByDate[dateStr] = [];
      }
      
      symptomsGroupedByDate[dateStr].push(symptom);
    });
    
    // Calculate daily averages for selected symptom
    const dailySymptomData = {};
    
    Object.keys(symptomsGroupedByDate).forEach(date => {
      const symptoms = symptomsGroupedByDate[date];
      const relevantSymptoms = symptoms.filter(s => s.type === selectedSymptom);
      
      if (relevantSymptoms.length > 0) {
        // Calculate average severity for the day
        const avgSeverity = relevantSymptoms.reduce((sum, s) => sum + s.severity, 0) / relevantSymptoms.length;
        dailySymptomData[date] = avgSeverity;
      }
    });
    
    // Calculate daily nutrient intake
    const dailyNutrientData = {};
    
    // Filter consumed meals by date range
    const filteredMeals = consumedMeals.filter(meal => {
      const mealDate = new Date(meal.date).getTime();
      return mealDate >= startTimestamp && mealDate <= endTimestamp;
    });
    
    // Group meals by date
    filteredMeals.forEach(mealEntry => {
      const date = mealEntry.date;
      const meal = meals.find(m => m.id === mealEntry.mealId);
      
      if (!meal) return;
      
      if (!dailyNutrientData[date]) {
        dailyNutrientData[date] = 0;
      }
      
      // Add nutrient amount if available in meal data
      const nutrientAmount = meal.nutrition?.[selectedNutrient] || 0;
      dailyNutrientData[date] += nutrientAmount * (mealEntry.servingSize || 1);
    });
    
    // Combine data points where both symptom and nutrient data exist
    const combinedData = [];
    const uniqueDates = new Set([...Object.keys(dailySymptomData), ...Object.keys(dailyNutrientData)]);
    
    uniqueDates.forEach(date => {
      // Skip if we don't have both data points
      if (dailySymptomData[date] === undefined || dailyNutrientData[date] === undefined) {
        return;
      }
      
      combinedData.push({
        date,
        symptomSeverity: dailySymptomData[date],
        nutrientAmount: dailyNutrientData[date]
      });
    });
    
    // Sort by date
    combinedData.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Calculate correlation if we have enough data points
    let correlation = null;
    if (combinedData.length >= 3) {
      correlation = calculateCorrelation(
        combinedData.map(d => d.nutrientAmount),
        combinedData.map(d => d.symptomSeverity)
      );
    }
    
    // Set data for visualization
    setCorrelationData({
      combinedData,
      correlation,
      correlationStrength: getCorrelationStrength(correlation),
      correlationDirection: getCorrelationDirection(correlation)
    });
  };
  
  // Calculate Pearson correlation coefficient
  const calculateCorrelation = (xValues, yValues) => {
    if (xValues.length !== yValues.length || xValues.length === 0) {
      return null;
    }
    
    const n = xValues.length;
    
    // Calculate means
    const xMean = xValues.reduce((sum, val) => sum + val, 0) / n;
    const yMean = yValues.reduce((sum, val) => sum + val, 0) / n;
    
    // Calculate sum of products of differences from means
    let sumProductDiffs = 0;
    let sumXDiffSquared = 0;
    let sumYDiffSquared = 0;
    
    for (let i = 0; i < n; i++) {
      const xDiff = xValues[i] - xMean;
      const yDiff = yValues[i] - yMean;
      
      sumProductDiffs += xDiff * yDiff;
      sumXDiffSquared += xDiff * xDiff;
      sumYDiffSquared += yDiff * yDiff;
    }
    
    // Calculate correlation coefficient
    const correlation = sumProductDiffs / Math.sqrt(sumXDiffSquared * sumYDiffSquared);
    
    return isNaN(correlation) ? null : correlation;
  };
  
  // Get qualitative description of correlation strength
  const getCorrelationStrength = (correlation) => {
    if (correlation === null) return null;
    
    const absCorrelation = Math.abs(correlation);
    
    if (absCorrelation < 0.3) return "weak";
    if (absCorrelation < 0.7) return "moderate";
    return "strong";
  };
  
  // Get correlation direction (positive or negative)
  const getCorrelationDirection = (correlation) => {
    if (correlation === null) return null;
    return correlation > 0 ? "positive" : "negative";
  };
  
  // Set quick date range
  const setQuickDateRange = (days) => {
    const endDate = new Date();
    const startDate = subDays(endDate, days);
    
    setDateRange({
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd')
    });
  };
  
  // Get correlation explanation text
  const getCorrelationExplanation = () => {
    if (!correlationData || correlationData.correlation === null) {
      return "Not enough data to determine a correlation. Try logging more symptoms and meals.";
    }
    
    const { correlationStrength, correlationDirection } = correlationData;
    const nutrientLabel = nutrientTypes.find(n => n.value === selectedNutrient)?.label;
    const symptomLabel = symptomTypes.find(s => s.value === selectedSymptom)?.label;
    
    if (correlationDirection === "positive") {
      return `There appears to be a ${correlationStrength} positive correlation between ${nutrientLabel} intake and ${symptomLabel} severity. This suggests that increasing ${nutrientLabel} may be associated with more severe ${symptomLabel}.`;
    } else {
      return `There appears to be a ${correlationStrength} negative correlation between ${nutrientLabel} intake and ${symptomLabel} severity. This suggests that increasing ${nutrientLabel} may be associated with less severe ${symptomLabel}.`;
    }
  };
  
  // Render correlation strength visually
  const renderCorrelationIndicator = () => {
    if (!correlationData || correlationData.correlation === null) {
      return (
        <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-500 mt-2 text-center">Not enough data points to calculate correlation</p>
        </div>
      );
    }
    
    const { correlation, correlationStrength, correlationDirection } = correlationData;
    const absCorrelation = Math.abs(correlation);
    
    // Colors based on correlation strength
    let color = "bg-gray-200";
    if (absCorrelation >= 0.7) color = "bg-purple-600";
    else if (absCorrelation >= 0.3) color = "bg-purple-400";
    else color = "bg-purple-200";
    
    return (
      <div className="flex flex-col items-center">
        <div className="w-full flex items-center justify-center mb-4">
          <div className="relative h-8 w-80 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`absolute h-full ${color} transition-all duration-500`} 
              style={{ width: `${absCorrelation * 100}%` }}
            ></div>
          </div>
        </div>
        <div className="flex justify-between w-full px-4">
          <span className="text-sm font-medium text-gray-500">Weak</span>
          <span className="text-sm font-medium text-gray-500">Moderate</span>
          <span className="text-sm font-medium text-gray-500">Strong</span>
        </div>
        <div className="mt-4 flex items-center">
          <span className="text-sm font-medium mr-2">Correlation:</span>
          <span className="text-lg font-bold">{correlation.toFixed(2)}</span>
          <span className="ml-2 text-sm">
            ({correlationStrength} {correlationDirection})
          </span>
        </div>
      </div>
    );
  };
  
  // Render data visualization
  const renderDataVisualization = () => {
    if (!correlationData || !correlationData.combinedData || correlationData.combinedData.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="text-gray-500 mt-2">No combined data available for the selected criteria</p>
        </div>
      );
    }
    
    // Extract data for chart
    const { combinedData } = correlationData;
    const nutrientLabel = nutrientTypes.find(n => n.value === selectedNutrient)?.label;
    
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {nutrientLabel} Intake
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symptom Severity</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {combinedData.map((data, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {format(new Date(data.date), 'MMM dd, yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div 
                      className="bg-teal-500 h-3 rounded"
                      style={{ width: `${Math.min(100, data.nutrientAmount * 3)}px` }}
                    ></div>
                    <span className="ml-3 text-sm text-gray-900">{data.nutrientAmount.toFixed(1)}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div 
                      className="bg-orange-500 h-3 rounded"
                      style={{ width: `${data.symptomSeverity * 10}px` }}
                    ></div>
                    <span className="ml-3 text-sm text-gray-900">{data.symptomSeverity.toFixed(1)}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  // Get nutrient recommendations based on correlations
  const getNutrientRecommendations = () => {
    if (!correlationData || correlationData.correlation === null) {
      return null;
    }
    
    const { correlation } = correlationData;
    const nutrientLabel = nutrientTypes.find(n => n.value === selectedNutrient)?.label;
    const symptomLabel = symptomTypes.find(s => s.value === selectedSymptom)?.label;
    
    let recommendationText = "";
    
    if (correlation <= -0.3) {
      recommendationText = `Consider increasing your ${nutrientLabel} intake, as it appears to be associated with reduced ${symptomLabel} severity.`;
    } else if (correlation >= 0.3) {
      recommendationText = `Consider monitoring your ${nutrientLabel} intake, as it appears to be associated with increased ${symptomLabel} severity.`;
    } else {
      recommendationText = `No clear relationship between ${nutrientLabel} and ${symptomLabel} was observed in your data.`;
    }
    
    return (
      <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-purple-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-purple-800">Recommendation</h3>
            <div className="mt-2 text-sm text-purple-700">
              <p>{recommendationText}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 mb-16">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-md p-6 mb-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold mb-1">Health Insights</h1>
              <p className="text-indigo-100">Discover correlations between your nutrition and menopause symptoms.</p>
            </div>
            <div className="hidden md:block">
              <div className="bg-white bg-opacity-20 rounded-lg p-3">
                <div className="flex items-center">
                  <div className="mr-4 text-right">
                    <div className="text-xs uppercase tracking-wide">Data Points</div>
                    <div className="font-semibold text-xl">{correlationData?.combinedData?.length || 0}</div>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-white bg-opacity-30 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Date Range Filter */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Select Time Period</h2>
          
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
                className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
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
                max={format(new Date(), 'yyyy-MM-dd')}
                className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setQuickDateRange(7)}
              className="px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition-colors"
            >
              Last 7 Days
            </button>
            <button
              onClick={() => setQuickDateRange(14)}
              className="px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition-colors"
            >
              Last 14 Days
            </button>
            <button
              onClick={() => setQuickDateRange(30)}
              className="px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition-colors"
            >
              Last 30 Days
            </button>
            <button
              onClick={() => setQuickDateRange(90)}
              className="px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition-colors"
            >
              Last 3 Months
            </button>
          </div>
        </div>
        
        {/* Data Selection */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Select Data to Analyze</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Symptom</label>
              <select
                value={selectedSymptom}
                onChange={(e) => setSelectedSymptom(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
              >
                {symptomTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nutrient</label>
              <select
                value={selectedNutrient}
                onChange={(e) => setSelectedNutrient(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
              >
                {nutrientTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Correlation Results */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Correlation Analysis</h2>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="p-4 bg-indigo-50 rounded-lg">
                <h3 className="font-medium text-indigo-900 mb-2">Analysis Result</h3>
                <p className="text-gray-800">{getCorrelationExplanation()}</p>
              </div>
              
              <div className="p-4 bg-white border border-gray-200 rounded-lg">
                <h3 className="font-medium text-gray-800 mb-4">Correlation Strength</h3>
                {renderCorrelationIndicator()}
              </div>
              
              {correlationData?.correlation !== null && getNutrientRecommendations()}
              
              <div className="mt-6">
                <h3 className="font-medium text-gray-800 mb-3">Data Visualization</h3>
                {renderDataVisualization()}
              </div>
            </div>
          )}
        </div>
        
        {/* Educational Content */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Understanding Correlations</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-indigo-50 rounded-lg">
              <h3 className="font-medium text-indigo-800 mb-2">What does a positive correlation mean?</h3>
              <p className="text-gray-700">
                A positive correlation means that as one variable increases, the other tends to increase as well. 
                For example, if calcium intake has a positive correlation with hot flashes, it suggests that 
                higher calcium intake might be associated with more severe hot flashes.
              </p>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-medium text-purple-800 mb-2">What does a negative correlation mean?</h3>
              <p className="text-gray-700">
                A negative correlation means that as one variable increases, the other tends to decrease. 
                For example, if magnesium intake has a negative correlation with insomnia, it suggests that 
                higher magnesium intake might be associated with less severe insomnia.
              </p>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-800 mb-2">Important Note</h3>
            <p className="text-gray-700">
              Correlation does not imply causation. These insights are based on your personal data and 
              should be considered alongside professional medical advice. More data points will provide 
              more reliable insights.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HealthInsights;