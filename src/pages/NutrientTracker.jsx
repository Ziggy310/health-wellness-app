import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import Layout from '../components/common/Layout';

const NutrientTracker = () => {
  const { 
    isLoading,
    setIsLoading,
    user,
    meals,
    consumedMeals
  } = useAppContext();
  
  const [nutrientData, setNutrientData] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    calcium: 0,
    iron: 0,
    magnesium: 0,
    vitaminD: 0,
    vitaminE: 0,
  });
  
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [mealEntries, setMealEntries] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [servingSize, setServingSize] = useState(1);
  
  // Daily targets based on recommended intake for menopausal women
  const dailyTargets = {
    calories: 1800,
    protein: 75, // g
    carbs: 225, // g
    fat: 60, // g
    fiber: 25, // g
    calcium: 1200, // mg
    iron: 8, // mg
    magnesium: 320, // mg
    vitaminD: 15, // mcg
    vitaminE: 15, // mg
  };
  
  // Calculate total nutrients based on consumed meals
  useEffect(() => {
    calculateNutrients();
  }, [selectedDate, consumedMeals]);
  
  const calculateNutrients = () => {
    // Filter consumed meals for the selected date
    const todaysMeals = consumedMeals.filter(entry => {
      return entry.date === selectedDate;
    });
    
    setMealEntries(todaysMeals);
    
    // Calculate totals
    let totals = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      calcium: 0,
      iron: 0,
      magnesium: 0,
      vitaminD: 0,
      vitaminE: 0,
    };
    
    todaysMeals.forEach(entry => {
      const meal = meals.find(m => m.id === entry.mealId);
      if (meal) {
        const multiplier = entry.servingSize || 1;
        
        totals.calories += (meal.nutrition.calories || 0) * multiplier;
        totals.protein += (meal.nutrition.protein || 0) * multiplier;
        totals.carbs += (meal.nutrition.carbs || 0) * multiplier;
        totals.fat += (meal.nutrition.fat || 0) * multiplier;
        totals.fiber += (meal.nutrition.fiber || 0) * multiplier;
        totals.calcium += (meal.nutrition.calcium || 0) * multiplier;
        totals.iron += (meal.nutrition.iron || 0) * multiplier;
        totals.magnesium += (meal.nutrition.magnesium || 0) * multiplier;
        totals.vitaminD += (meal.nutrition.vitaminD || 0) * multiplier;
        totals.vitaminE += (meal.nutrition.vitaminE || 0) * multiplier;
      }
    });
    
    setNutrientData(totals);
  };
  
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };
  
  const handleAddMeal = () => {
    setShowAddModal(true);
  };
  
  const handleSelectMeal = (meal) => {
    setSelectedMeal(meal);
  };
  
  const handleServingSizeChange = (e) => {
    setServingSize(parseFloat(e.target.value));
  };
  
  const handleSaveMeal = () => {
    if (!selectedMeal) return;
    
    const newEntry = {
      id: Date.now().toString(),
      mealId: selectedMeal.id,
      date: selectedDate,
      servingSize: servingSize,
      timestamp: new Date().toISOString()
    };
    
    // Add to consumed meals in context
    if (Array.isArray(consumedMeals)) {
      consumedMeals.push(newEntry);
    }
    
    // Update local state
    setMealEntries([...mealEntries, newEntry]);
    
    // Recalculate nutrients
    calculateNutrients();
    
    // Reset modal
    setShowAddModal(false);
    setSelectedMeal(null);
    setServingSize(1);
  };
  
  const handleRemoveMeal = (entryId) => {
    // Remove from consumed meals in context
    const updatedConsumedMeals = consumedMeals.filter(entry => entry.id !== entryId);
    // TODO: Update in context
    
    // Update local state
    const updatedMealEntries = mealEntries.filter(entry => entry.id !== entryId);
    setMealEntries(updatedMealEntries);
    
    // Recalculate nutrients
    calculateNutrients();
  };
  
  const getNutrientPercentage = (nutrient) => {
    return Math.min(100, Math.round((nutrientData[nutrient] / dailyTargets[nutrient]) * 100));
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 mb-16">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 rounded-lg shadow-md p-6 mb-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold mb-1">Nutrient Tracker</h1>
              <p className="text-teal-100">Monitor your daily nutrient intake for better menopause management.</p>
            </div>
            <div className="hidden md:block">
              <div className="bg-white bg-opacity-20 rounded-lg p-3">
                <div className="flex items-center">
                  <div className="mr-4 text-right">
                    <div className="text-xs uppercase tracking-wide">Meals Today</div>
                    <div className="font-semibold text-xl">{mealEntries.length}</div>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-white bg-opacity-30 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Date Selector */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
              <input
                type="date"
                id="date"
                value={selectedDate}
                onChange={handleDateChange}
                max={new Date().toISOString().split('T')[0]}
                className="p-2 border border-gray-300 rounded focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
            <button
              onClick={handleAddMeal}
              className="bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded flex items-center justify-center transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Meal
            </button>
          </div>
        </div>
        
        {/* Nutrient Summary */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Daily Nutrient Summary</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Calories */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-gray-700">Calories</h3>
                <span className="text-gray-500 text-sm">{Math.round(nutrientData.calories)} / {dailyTargets.calories} kcal</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-teal-600 h-2.5 rounded-full"
                  style={{ width: `${getNutrientPercentage('calories')}%` }}
                ></div>
              </div>
            </div>
            
            {/* Protein */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-gray-700">Protein</h3>
                <span className="text-gray-500 text-sm">{Math.round(nutrientData.protein)} / {dailyTargets.protein} g</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-teal-600 h-2.5 rounded-full"
                  style={{ width: `${getNutrientPercentage('protein')}%` }}
                ></div>
              </div>
            </div>
            
            {/* Carbs */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-gray-700">Carbohydrates</h3>
                <span className="text-gray-500 text-sm">{Math.round(nutrientData.carbs)} / {dailyTargets.carbs} g</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-teal-600 h-2.5 rounded-full"
                  style={{ width: `${getNutrientPercentage('carbs')}%` }}
                ></div>
              </div>
            </div>
            
            {/* Fat */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-gray-700">Fat</h3>
                <span className="text-gray-500 text-sm">{Math.round(nutrientData.fat)} / {dailyTargets.fat} g</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-teal-600 h-2.5 rounded-full"
                  style={{ width: `${getNutrientPercentage('fat')}%` }}
                ></div>
              </div>
            </div>
            
            {/* Calcium */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-gray-700">Calcium</h3>
                <span className="text-gray-500 text-sm">{Math.round(nutrientData.calcium)} / {dailyTargets.calcium} mg</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-teal-600 h-2.5 rounded-full"
                  style={{ width: `${getNutrientPercentage('calcium')}%` }}
                ></div>
              </div>
            </div>
            
            {/* Vitamin D */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-gray-700">Vitamin D</h3>
                <span className="text-gray-500 text-sm">{Math.round(nutrientData.vitaminD)} / {dailyTargets.vitaminD} mcg</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-teal-600 h-2.5 rounded-full"
                  style={{ width: `${getNutrientPercentage('vitaminD')}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Meal Entries */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Today's Meals</h2>
          
          {mealEntries.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-gray-500">No meals logged for this day</p>
              <button
                onClick={handleAddMeal}
                className="mt-4 bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded inline-flex items-center text-sm transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Your First Meal
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Meal</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serving Size</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Calories</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Protein</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mealEntries.map(entry => {
                    const meal = meals.find(m => m.id === entry.mealId);
                    if (!meal) return null;
                    
                    return (
                      <tr key={entry.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200 mr-3">
                              {meal.image && (
                                <img src={meal.image} alt={meal.name} className="h-full w-full object-cover" />
                              )}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{meal.name}</div>
                              <div className="text-xs text-gray-500">{meal.category}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {entry.servingSize} serving{entry.servingSize !== 1 ? 's' : ''}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {Math.round((meal.nutrition?.calories || 0) * entry.servingSize)} kcal
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {Math.round((meal.nutrition?.protein || 0) * entry.servingSize)}g
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button 
                            onClick={() => handleRemoveMeal(entry.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {/* Add Meal Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="border-b border-gray-200 p-4">
                <h2 className="text-lg font-semibold text-gray-800">Add Meal</h2>
              </div>
              
              <div className="p-4">
                <div className="mb-4">
                  <label htmlFor="mealSelect" className="block text-sm font-medium text-gray-700 mb-1">Select Meal</label>
                  <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto p-2">
                    {meals.map(meal => (
                      <div 
                        key={meal.id} 
                        className={`border p-3 rounded-lg cursor-pointer flex items-center ${selectedMeal?.id === meal.id ? 'border-teal-500 bg-teal-50' : 'border-gray-200 hover:bg-gray-50'}`}
                        onClick={() => handleSelectMeal(meal)}
                      >
                        <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200 mr-3">
                          {meal.image && (
                            <img src={meal.image} alt={meal.name} className="h-full w-full object-cover" />
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{meal.name}</div>
                          <div className="text-xs text-gray-500">{meal.nutrition?.calories || 0} kcal per serving</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="servingSize" className="block text-sm font-medium text-gray-700 mb-1">Serving Size</label>
                  <input
                    type="number"
                    id="servingSize"
                    min="0.25"
                    step="0.25"
                    value={servingSize}
                    onChange={handleServingSizeChange}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
                
                {selectedMeal && (
                  <div className="bg-gray-50 p-3 rounded-lg mb-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Nutrition (for {servingSize} serving{servingSize !== 1 ? 's' : ''})</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-gray-500">Calories: {Math.round((selectedMeal.nutrition?.calories || 0) * servingSize)}kcal</div>
                      <div className="text-gray-500">Protein: {Math.round((selectedMeal.nutrition?.protein || 0) * servingSize)}g</div>
                      <div className="text-gray-500">Carbs: {Math.round((selectedMeal.nutrition?.carbs || 0) * servingSize)}g</div>
                      <div className="text-gray-500">Fat: {Math.round((selectedMeal.nutrition?.fat || 0) * servingSize)}g</div>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveMeal}
                    disabled={!selectedMeal}
                    className={`px-4 py-2 rounded text-white ${selectedMeal ? 'bg-teal-600 hover:bg-teal-700' : 'bg-gray-300 cursor-not-allowed'} transition`}
                  >
                    Add Meal
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default NutrientTracker;