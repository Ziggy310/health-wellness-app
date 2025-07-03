import React, { useState, useEffect, useMemo } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Link } from 'react-router-dom';
import HeadsUpFeature from '../components/heads-up/HeadsUpFeature';
import Navigation from '../components/common/Navigation';
import { MoodType, SymptomCategory } from '../utils/types';
import { useNavigate } from 'react-router-dom';
import { getMealsByDietaryPreference, getMealsByType, comprehensiveMealsData } from '../data/comprehensiveMealsData';
import { filterMealsByDietaryPreferences, generateEmergencyMeals } from '../utils/globalDietaryFilter';
import { useAuth } from '../hooks/useAuth';
import FavoriteButton from '../components/common/FavoriteButton';

const Dashboard = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { 
    user, 
    userProfile, 
    topSymptoms, 
    todayMeals, 
    todaySymptoms, 
    setTodayMood,
    getSymptomHistory,
    symptomHistory: contextSymptomHistory,
    logout,
    dietaryPreferences
  } = useAppContext();
  
  // 🛡️ SAFETY FIRST: Get user's allergies and dietary restrictions with fallback
  // Check multiple sources: profile, localStorage, and dietaryPreferences
  const getUserSafetyData = () => {
    // Try profile first
    if (profile?.allergies || profile?.dietary_restrictions || profile?.spice_tolerance) {
      return {
        allergies: profile.allergies || [],
        restrictions: profile.dietary_restrictions || [],
        spiceLevel: profile.spice_tolerance || 'medium'
      };
    }
    
    // Fallback to localStorage (from onboarding)
    try {
      const storedPrefs = localStorage.getItem('userPreferences');
      if (storedPrefs) {
        const prefs = JSON.parse(storedPrefs);
        return {
          allergies: prefs.allergies || [],
          restrictions: prefs.dietaryRestrictions || [],
          spiceLevel: prefs.spicePreference || 'medium'
        };
      }
    } catch (e) {
      console.error('Error reading user preferences from localStorage:', e);
    }
    
    // Final fallback to dietaryPreferences from context
    return {
      allergies: dietaryPreferences?.allergies || [],
      restrictions: dietaryPreferences?.restrictions || [],
      spiceLevel: dietaryPreferences?.spiceLevel || 'medium'
    };
  };
  
  const safetyData = getUserSafetyData();
  const userAllergies = safetyData.allergies;
  const userDietaryRestrictions = safetyData.restrictions;
  const userSpicePreference = safetyData.spiceLevel;
  
  console.log('🛡️ SAFETY CHECK - User Restrictions:', {
    userAllergies,
    userDietaryRestrictions,
    userSpicePreference,
    primaryDiet: dietaryPreferences?.primaryDiet
  });
  
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentMood, setCurrentMood] = useState(null);
  const [symptomHistory, setSymptomHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Scroll to top when component mounts (fixes onboarding completion scroll issue)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  
  // Use context symptom history or fetch if needed
  useEffect(() => {
    if (contextSymptomHistory && contextSymptomHistory.length > 0) {
      setSymptomHistory(contextSymptomHistory);
    } else {
      const fetchSymptomHistory = async () => {
        setIsLoading(true);
        try {
          const history = await getSymptomHistory();
          setSymptomHistory(history);
        } catch (error) {
          console.error('Error fetching symptom history:', error);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchSymptomHistory();
    }
  }, [getSymptomHistory, contextSymptomHistory]);
  
  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = currentTime.getHours();
    
    if (hour < 12) {
      return 'Good morning';
    } else if (hour < 17) {
      return 'Good afternoon';
    } else {
      return 'Good evening';
    }
  };

  // Format date to readable string
  const formatDate = () => {
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    return currentTime.toLocaleDateString('en-US', options);
  };
  
  // Handle mood selection
  const handleMoodSelect = (mood) => {
    setCurrentMood(mood);
    setTodayMood(mood);
  };

  // Determine which meal to highlight based on time of day
  const getCurrentMeal = () => {
    const hour = currentTime.getHours();
    
    if (hour < 11) {
      return 'breakfast';
    } else if (hour < 15) {
      return 'lunch';
    } else if (hour < 19) {
      return 'dinner';
    } else {
      return 'snacks';
    }
  };
  
  // Get symptom trend data for mini-charts
  const getSymptomTrendData = useMemo(() => {
    if (!symptomHistory || symptomHistory.length === 0) return [];
    
    // Group symptoms by id
    const symptomsById = {};
    symptomHistory.forEach(log => {
      if (!symptomsById[log.id]) {
        symptomsById[log.id] = [];
      }
      symptomsById[log.id].push({
        severity: log.severity,
        timestamp: new Date(log.timestamp)
      });
    });
    
    // Sort each symptom's logs by date and take the most recent 7 days
    Object.keys(symptomsById).forEach(id => {
      symptomsById[id].sort((a, b) => b.timestamp - a.timestamp);
      symptomsById[id] = symptomsById[id].slice(0, 7).reverse();
    });
    
    // Format for display
    return Object.entries(symptomsById).map(([id, logs]) => {
      const symptomInfo = topSymptoms.find(s => s.id === id) || 
                          todaySymptoms.find(s => s.id === id) || 
                          { name: 'Unknown Symptom', category: SymptomCategory.PHYSICAL };
      return {
        id,
        name: symptomInfo.name,
        category: symptomInfo.category,
        data: logs
      };
    }).slice(0, 3); // Take top 3 symptoms with most data
  }, [symptomHistory, topSymptoms, todaySymptoms]);

  // Get a random relief tool suggestion based on symptoms
  const getSuggestedRelief = () => {
    // Mock data for relief tools - in a real app, this would come from the backend
    const reliefTools = [
      { id: 'breathing', name: 'Deep Breathing', forSymptom: 'anxiety', description: '5-minute guided breathing exercise' },
      { id: 'cooling', name: 'Cooling Visualization', forSymptom: 'hotFlashes', description: 'Mental technique to reduce hot flashes' },
      { id: 'stretching', name: 'Gentle Stretches', forSymptom: 'jointPain', description: 'Easy stretches for joint comfort' },
      { id: 'sleep', name: 'Sleep Meditation', forSymptom: 'sleepIssues', description: '10-minute bedtime meditation' },
      { id: 'mood', name: 'Mood Boost', forSymptom: 'moodChanges', description: 'Quick exercise to lift your spirits' },
    ];
    
    // Check if user has any symptoms today
    if (todaySymptoms && todaySymptoms.length > 0) {
      // Get a tool that matches one of today's symptoms
      const matchingTool = reliefTools.find(tool => 
        todaySymptoms.some(symptom => symptom.id === tool.forSymptom)
      );
      
      if (matchingTool) {
        return matchingTool;
      }
    }
    
    // If no matching tool or no symptoms today, return a random tool
    return reliefTools[Math.floor(Math.random() * reliefTools.length)];
  };
  
  const suggestedRelief = getSuggestedRelief();
  const currentMeal = getCurrentMeal();
  
  // 🛡️ REPLACED: Using comprehensive global dietary filter for maximum safety
  // Old complex logic replaced with standardized global filtering system

  // 🛡️ Get safe meals using GLOBAL DIETARY FILTER SYSTEM
  const getTodaysMeals = useMemo(() => {
    const allMeals = Object.values(comprehensiveMealsData);
    
    console.log('🛡️ DASHBOARD: Applying global dietary filter');
    
    // Use the comprehensive global filter
    const safeMeals = filterMealsByDietaryPreferences(allMeals, dietaryPreferences);
    
    console.log('🛡️ DASHBOARD: Safe meals found:', safeMeals.length);
    
    // If too few meals, add emergency meals
    if (safeMeals.length < 4) {
      console.warn('⚠️ DASHBOARD: Too few safe meals, using emergency fallbacks');
      const emergencyMeals = generateEmergencyMeals(dietaryPreferences);
      return emergencyMeals;
    }
    
    // Smart meal selection - one from each category
    const breakfasts = safeMeals.filter(meal => meal.mealType === 'Breakfast');
    const lunches = safeMeals.filter(meal => meal.mealType === 'Lunch');
    const dinners = safeMeals.filter(meal => meal.mealType === 'Dinner');
    const snacks = safeMeals.filter(meal => meal.mealType === 'Snack');
    
    const selectedMeals = {
      breakfast: breakfasts[0] || safeMeals[0],
      lunch: lunches[0] || safeMeals[1] || safeMeals[0],
      dinner: dinners[0] || safeMeals[2] || safeMeals[0],
      snacks: snacks[0] || safeMeals[3] || safeMeals[0]
    };
    
    console.log('✅ DASHBOARD: Final selected meals:', {
      breakfast: selectedMeals.breakfast?.name,
      lunch: selectedMeals.lunch?.name,
      dinner: selectedMeals.dinner?.name,
      snacks: selectedMeals.snacks?.name
    });
    
    return selectedMeals;
  }, [dietaryPreferences]);
  
  // Get personalized meal recommendations based on symptoms
  const getPersonalizedMealRecommendations = useMemo(() => {
    // Mock recommendations based on symptoms
    const recommendations = [
      { symptomId: 'hotFlashes', food: 'Flaxseeds', benefit: 'Contains lignans that may help reduce hot flashes' },
      { symptomId: 'sleepIssues', food: 'Tart Cherries', benefit: 'Natural source of melatonin for better sleep' },
      { symptomId: 'jointPain', food: 'Fatty Fish', benefit: 'Omega-3s may help reduce inflammation' },
      { symptomId: 'anxiety', food: 'Dark Chocolate', benefit: 'Contains compounds that may reduce stress' },
      { symptomId: 'moodChanges', food: 'Fermented Foods', benefit: 'Probiotics may help regulate mood' },
    ];
    
    // Match recommendations to user's active symptoms
    const userRecommendations = [];
    
    if (todaySymptoms && todaySymptoms.length > 0) {
      todaySymptoms.forEach(symptom => {
        const matching = recommendations.find(rec => rec.symptomId === symptom.id);
        if (matching) userRecommendations.push(matching);
      });
    }
    
    // Fallback to top symptoms if no today symptoms
    if (userRecommendations.length === 0 && topSymptoms && topSymptoms.length > 0) {
      topSymptoms.forEach(symptom => {
        const matching = recommendations.find(rec => rec.symptomId === symptom.id);
        if (matching) userRecommendations.push(matching);
      });
    }
    
    // If still no recommendations, return general ones
    return userRecommendations.length > 0 ? 
      userRecommendations : 
      [{ food: 'Whole Grains', benefit: 'Complex carbs for steady energy levels' },
       { food: 'Leafy Greens', benefit: 'Rich in calcium, vitamin K and magnesium' }];
  }, [todaySymptoms, topSymptoms]);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-700 to-purple-500 text-white px-4 pt-8 pb-16">
        <div className="flex justify-between items-start max-w-lg mx-auto">
          <div>
            <h1 className="text-2xl font-bold">{getGreeting()}, {user?.name || 'Friend'}!</h1>
            <p className="text-purple-100 mt-1">{formatDate()}</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/edit-dietary-preferences')}
              className="bg-purple-800/30 hover:bg-purple-800/50 px-3 py-2 rounded-lg text-sm text-white transition-colors flex items-center space-x-1"
              title="Edit Dietary Preferences"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Diet</span>
            </button>
            
            <Link to="/profile">
              <div className="w-12 h-12 rounded-full bg-purple-800/30 flex items-center justify-center text-white hover:bg-purple-800/50 transition-colors">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'M'}
              </div>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="px-4 max-w-lg mx-auto -mt-10">
        {/* Mood Check-in Card */}
        <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
          <h2 className="text-lg font-medium mb-3">How are you feeling today?</h2>
          
          <div className="flex overflow-x-auto pb-2">
            {Object.values(MoodType).map((mood) => (
              <button 
                key={mood} 
                onClick={() => handleMoodSelect(mood)}
                className={`flex flex-col items-center p-2 rounded-lg flex-shrink-0 mx-2 ${
                  currentMood === mood ? 'bg-purple-100' : ''
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center mb-1">
                  {mood === MoodType.VERY_GOOD && (
                    <span className="text-2xl">😀</span>
                  )}
                  {mood === MoodType.GOOD && (
                    <span className="text-2xl">🙂</span>
                  )}
                  {mood === MoodType.NEUTRAL && (
                    <span className="text-2xl">😐</span>
                  )}
                  {mood === MoodType.LOW && (
                    <span className="text-2xl">😕</span>
                  )}
                  {mood === MoodType.VERY_LOW && (
                    <span className="text-2xl">☹️</span>
                  )}
                  {mood === MoodType.IRRITABLE && (
                    <span className="text-2xl">😠</span>
                  )}
                  {mood === MoodType.ANXIOUS && (
                    <span className="text-2xl">😰</span>
                  )}
                  {mood === MoodType.FOGGY && (
                    <span className="text-2xl">🌫️</span>
                  )}
                </div>
                <span className="text-xs text-gray-600 capitalize">{mood.toLowerCase()}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Symptom Trends & Mini Charts */}
        <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Symptom Trends</h2>
            <Link to="/symptoms" className="text-sm text-purple-600 font-medium">
              View History
            </Link>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700"></div>
            </div>
          ) : getSymptomTrendData.length > 0 ? (
            <div className="space-y-5">
              {getSymptomTrendData.map(symptom => (
                <div key={symptom.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center mb-2">
                    <div
                      className={`w-3 h-3 rounded-full mr-2 ${
                        symptom.category === SymptomCategory.PHYSICAL ? 'bg-red-500' :
                        symptom.category === SymptomCategory.EMOTIONAL ? 'bg-blue-500' :
                        symptom.category === SymptomCategory.COGNITIVE ? 'bg-yellow-500' :
                        symptom.category === SymptomCategory.SLEEP ? 'bg-indigo-500' :
                        'bg-gray-500'
                      }`}
                    ></div>
                    <h3 className="text-sm font-medium">{symptom.name}</h3>
                  </div>
                  
                  <div className="flex items-end h-12 mt-1">
                    {symptom.data.map((point, idx) => {
                      const height = (point.severity / 5) * 100;
                      const dayLabel = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][point.timestamp.getDay()];
                      return (
                        <div key={idx} className="flex-1 flex flex-col items-center">
                          <div className="w-full px-1">
                            <div 
                              className="bg-purple-500 rounded-t-sm w-full" 
                              style={{ height: `${height}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-400 mt-1">{dayLabel}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-500">No symptom data available</p>
              <Link to="/symptoms" className="text-sm text-purple-600 font-medium mt-2 inline-block">
                Track Symptoms
              </Link>
            </div>
          )}
        </div>
        
        {/* Personalized Meal Recommendations */}
        <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Recommended Foods</h2>
            <Link to="/meal-plan" className="text-sm text-purple-600 font-medium">
              View All
            </Link>
          </div>
          
          <div className="space-y-3">
            {getPersonalizedMealRecommendations.slice(0, 3).map((rec, idx) => (
              <div key={idx} className="p-3 rounded-lg border border-gray-200">
                <h3 className="font-medium">{rec.food}</h3>
                <p className="text-sm text-gray-600">{rec.benefit}</p>
              </div>
            ))}
            
            <button
              onClick={() => navigate('/meal-plan')}
              className="w-full py-2 text-center text-sm text-purple-600 font-medium border border-purple-200 rounded-lg hover:bg-purple-50"
            >
              View Today's Complete Meal Plan
            </button>
          </div>
        </div>
        
        {/* Today's Meal Plan */}
        <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Today's Meals</h2>
            <Link to="/meal-plan" className="text-sm text-purple-600 font-medium">
              View All
            </Link>
          </div>
          
          <div className="space-y-3">
            {/* Dynamic meal data based on user's dietary preferences */}
            {['breakfast', 'lunch', 'dinner', 'snacks'].map((meal) => {
              const mealData = getTodaysMeals[meal];
              
              return (
                <div 
                  key={meal} 
                  className="rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-all"
                  onClick={() => navigate(`/meal/${mealData.slug}`, { state: { fromDay: 'monday' } })}
                  role="button"
                  tabIndex="0"
                  aria-label={`View details for ${meal}`}
                  onKeyPress={(e) => e.key === 'Enter' && navigate(`/meal/${mealData.slug}`, { state: { fromDay: 'monday' } })}
                >
                  <div className="flex">
                    {/* Colorful Icon Section */}
                    <div className="w-20 h-20 flex-shrink-0 flex items-center justify-center" style={{
                      background: meal === 'breakfast' ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' :
                                 meal === 'lunch' ? 'linear-gradient(135deg, #16A34A 0%, #15803D 100%)' :
                                 meal === 'dinner' ? 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)' :
                                 'linear-gradient(135deg, #E53E3E 0%, #DC2626 100%)'
                    }}>
                      {/* Meal Icons */}
                      {meal === 'breakfast' && (
                        <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
                        </svg>
                      )}
                      {meal === 'lunch' && (
                        <img 
                          src="/assets/lunch-icon.png" 
                          alt="Lunch" 
                          className="w-10 h-10 object-contain filter brightness-0 invert"
                          style={{ 
                            filter: 'brightness(0) invert(1)',
                            transform: 'rotate(35deg) scale(1.3)'
                          }}
                        />
                      )}
                      {meal === 'dinner' && (
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
                        </svg>
                      )}
                      {meal === 'snacks' && (
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.25c5.385 0 9.75 4.365 9.75 9.75s-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12 6.615 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z" />
                        </svg>
                      )}
                    </div>
                    
                    {/* Content Section */}
                    <div className="flex-1 p-4 bg-white">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <span className="text-xs text-gray-500 uppercase tracking-wide">{meal}</span>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-gray-900 truncate">{mealData.name}</h3>
                            <FavoriteButton 
                              mealId={mealData.id || mealData.slug} 
                              mealName={mealData.name} 
                              size="sm" 
                              variant="inline" 
                            />
                          </div>
                          {/* Show dietary preference tag */}
                          <div className="flex gap-1 mt-1">
                            {mealData.dietaryTags && mealData.dietaryTags.slice(0, 2).map((tag, idx) => (
                              <span key={idx} className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full capitalize">
                                {tag}
                              </span>
                            ))}
                          </div>
                          {currentMeal === meal && (
                            <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mt-2 inline-block">
                              Current Meal Time
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center flex-shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Symptoms Tracker */}
        <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Symptoms Today</h2>
            <Link to="/symptoms" className="text-sm text-purple-600 font-medium">
              Track Symptoms
            </Link>
          </div>
          
          {todaySymptoms && todaySymptoms.length > 0 ? (
            <div className="space-y-3">
              {todaySymptoms.map(symptom => (
                <div key={symptom.id} className="flex items-center">
                  <div 
                    className={`w-3 h-3 rounded-full mr-3 ${
                      symptom.category === SymptomCategory.PHYSICAL ? 'bg-red-500' :
                      symptom.category === SymptomCategory.EMOTIONAL ? 'bg-blue-500' :
                      symptom.category === SymptomCategory.COGNITIVE ? 'bg-yellow-500' :
                      symptom.category === SymptomCategory.SLEEP ? 'bg-indigo-500' :
                      'bg-gray-500'
                    }`}
                  ></div>
                  <span>{symptom.name}</span>
                  
                  <div className="ml-auto flex">
                    {[1, 2, 3, 4, 5].map(level => (
                      <div 
                        key={level}
                        className={`w-2 h-8 mx-0.5 rounded-sm ${
                          level <= symptom.severity ? 'bg-orange-500' : 'bg-gray-200'
                        }`}
                      ></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-500">No symptoms logged today</p>
              <Link to="/symptoms" className="text-sm text-purple-600 font-medium mt-2 inline-block">
                Log Symptoms
              </Link>
            </div>
          )}
        </div>
        
        {/* Heads Up Feature - Moved from the top to here as a secondary feature */}
        <HeadsUpFeature />
        
        {/* Quick Relief */}
        <div className="bg-purple-50 rounded-xl p-5">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-medium text-purple-900 mb-1">Quick Relief</h2>
              <p className="text-sm text-purple-700 mb-3">Recommended for your symptoms</p>
              
              <div className="bg-white rounded-lg p-4 shadow-sm border border-purple-100">
                <h3 className="font-medium text-purple-900">{suggestedRelief.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{suggestedRelief.description}</p>
                
                <Link 
                  to={`/relief/${suggestedRelief.id}`} 
                  className="text-sm text-purple-600 font-medium flex items-center"
                >
                  Start Now
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
            
            <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {/* Navigation Bar - RESTORED */}
      <Navigation />
    </div>
  );
};

export default Dashboard;