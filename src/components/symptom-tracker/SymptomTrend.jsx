import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { format, parseISO } from 'date-fns';

const SymptomTrend = ({ symptomHistory, dateRange }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  
  useEffect(() => {
    if (!symptomHistory.length) return;
    
    // Prepare data for the chart
    const chartData = prepareChartData(symptomHistory, dateRange);
    
    // Create or update chart
    if (chartRef.current) {
      // Destroy previous chart instance if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
      
      // Create new chart
      chartInstance.current = new Chart(chartRef.current, {
        type: 'line',
        data: chartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                boxWidth: 12,
                usePointStyle: true,
                padding: 20
              }
            },
            tooltip: {
              callbacks: {
                title: function(tooltipItems) {
                  return `${tooltipItems[0].label} - Severity`;
                },
                label: function(context) {
                  const label = context.dataset.label || '';
                  const value = context.raw !== null ? context.raw : 'No data';
                  return `${label}: ${value !== 'No data' ? value.toFixed(1) : 'Not recorded'}`;
                }
              }
            }
          },
          scales: {
            y: {
              min: 0,
              max: 5,
              ticks: {
                stepSize: 1,
                callback: function(value) {
                  if (value === 0) return '';
                  if (value === 1) return 'Mild';
                  if (value === 3) return 'Moderate';
                  if (value === 5) return 'Severe';
                  return '';
                }
              },
              grid: {
                color: 'rgba(0, 0, 0, 0.05)'
              }
            },
            x: {
              grid: {
                display: false
              }
            }
          }
        }
      });
    }
    
    return () => {
      // Cleanup chart instance on unmount
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [symptomHistory, dateRange]);
  
  // Prepare data for the chart visualization
  const prepareChartData = (filteredData, dateRange) => {
    if (!filteredData.length) {
      return {
        labels: [],
        datasets: []
      };
    }
    
    // Group data by date and symptom
    const groupedData = {};
    
    // Generate all dates in the range
    const allDates = [];
    const startDate = new Date(dateRange.startDate);
    const endDate = new Date(dateRange.endDate);
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      allDates.push(dateStr);
      groupedData[dateStr] = {};
    }
    
    // Fill in the grouped data
    filteredData.forEach(item => {
      const dateStr = new Date(item.timestamp).toISOString().split('T')[0];
      if (!groupedData[dateStr]) {
        groupedData[dateStr] = {};
      }
      
      if (!groupedData[dateStr][item.name]) {
        groupedData[dateStr][item.name] = [];
      }
      
      groupedData[dateStr][item.name].push(item);
    });
    
    // Calculate the average severity for each symptom on each day
    const symptomNames = [...new Set(filteredData.map(item => item.name))];
    
    const datasets = symptomNames.map(name => {
      const data = allDates.map(date => {
        if (groupedData[date][name]) {
          const symptoms = groupedData[date][name];
          const avgSeverity = symptoms.reduce((sum, s) => sum + s.severity, 0) / symptoms.length;
          return avgSeverity;
        }
        return null;
      });
      
      const randomColor = `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`;
      
      return {
        label: name,
        data,
        borderColor: randomColor,
        backgroundColor: randomColor + '33', // Add transparency
        fill: false,
        tension: 0.2,
        pointRadius: 4,
        pointHoverRadius: 6
      };
    });
    
    // Format dates for display
    const displayDates = allDates.map(d => format(parseISO(d), 'MMM d'));
    
    return {
      labels: displayDates,
      datasets
    };
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-purple-700">Symptom Trends</h2>
        <div className="flex space-x-2">
          <button className="text-xs bg-purple-100 hover:bg-purple-200 text-purple-800 font-medium py-1 px-2 rounded transition-colors">
            Weekly View
          </button>
          <button className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-1 px-2 rounded transition-colors">
            Monthly View
          </button>
        </div>
      </div>
      
      <div className="h-72 relative">
        {symptomHistory.length > 0 ? (
          <canvas ref={chartRef}></canvas>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="text-gray-500">No symptoms recorded in this period</p>
              <p className="text-xs text-gray-400 mt-1">Log symptoms to see your trends over time</p>
            </div>
          </div>
        )}
      </div>
      
      <p className="text-xs text-gray-500 mt-3">
        <strong>Tip:</strong> Combine your symptom data with your meal logs to discover potential connections between what you eat and how you feel.
      </p>
    </div>
  );
};

export default SymptomTrend;
