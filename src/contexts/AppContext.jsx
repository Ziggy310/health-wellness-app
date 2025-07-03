import React, { createContext, useContext, useState, useEffect } from 'react';
import { MenopauseStage, DietType, SymptomCategory, MealType, MoodType } from '../utils/types';

// Create the context
const AppContext = createContext(undefined);

// Default values for new users
const defaultUserProfile = {
  menopauseStage: MenopauseStage.UNKNOWN,
  lastPeriodDate: null,
  hasHotFlashes: false,
  hasSleepIssues: false,
  hasMoodChanges: false,
  energyLevel: 3,
  hasCognitiveIssues: false,
  healthConditions: [],
};

const defaultDietaryPreferences = {
  primaryDiet: DietType.OMNIVORE,
  allergies: [],
  dislikes: [],
  preferences: [],
  isGlutenFree: false,
  isDairyFree: false,
  isNutFree: false,
  prepTimePreference: 30,
};

const defaultHealthGoals = {
  primaryGoals: [],
  secondaryGoals: [],
  targetDate: null,
  improveSleep: false,
  reduceHotFlashes: false,
  stabilizeMood: false,
  improveCognition: false,
  maintainWeight: false,
  loseWeight: false,
};

// Context provider component
export const AppProvider = ({ children }) => {
  // User Authentication state
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  
  // User profile states
  const [userProfile, setUserProfile] = useState(defaultUserProfile);
  const [dietaryPreferences, setDietaryPreferences] = useState(defaultDietaryPreferences);
  const [healthGoals, setHealthGoals] = useState(defaultHealthGoals);
  
  // App data states
  const [topSymptoms, setTopSymptoms] = useState([]);
  const [todaySymptoms, setTodaySymptoms] = useState([]);
  const [symptomHistory, setSymptomHistory] = useState([]);
  const [currentMealPlan, setCurrentMealPlan] = useState(null);
  const [todayMeals, setTodayMeals] = useState([]);
  const [todaysMood, setTodaysMood] = useState(null);
  const [moodHistory, setMoodHistory] = useState([]);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  
  // Loading states
  const [isLoading, setIsLoading] = useState(false);

  // Mock user authentication (to be replaced with Firebase Auth)
  useEffect(() => {
    const checkAuthState = async () => {
      try {
        // Simulate auth check
        const savedUser = localStorage.getItem('meno_plus_user');
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          setUser(userData);
          setIsAuthenticated(true);
          setIsOnboarded(userData.isOnboarded || false);
          
          // Load user data (mock implementation)
          if (userData.isOnboarded) {
            await fetchUserData(userData.id);
          }
        }
      } catch (error) {
        console.error('Auth error:', error);
      } finally {
        setAuthLoading(false);
      }
    };

    checkAuthState();
  }, []);

  // Mock function to fetch user data (to be replaced with API calls)
  const fetchUserData = async (userId) => {
    setIsLoading(true);
    try {
      // Simulate API calls
      // In a real implementation, these would be separate API calls
      
      // Mock user profile data
      const mockProfile = {
        ...defaultUserProfile,
        menopauseStage: MenopauseStage.PERIMENOPAUSAL,
        hasHotFlashes: true,
        hasSleepIssues: true,
      };
      setUserProfile(mockProfile);
      
      // Mock dietary preferences
      setDietaryPreferences({
        ...defaultDietaryPreferences,
        allergies: ['peanuts'],
        preferences: ['Mediterranean'],
      });
      
      // Mock health goals
      setHealthGoals({
        ...defaultHealthGoals,
        primaryGoals: ['Improve sleep', 'Reduce hot flashes'],
        improveSleep: true,
        reduceHotFlashes: true,
      });
      
      // Mock symptoms
      setTopSymptoms([
        { id: '1', name: 'Hot flashes', category: SymptomCategory.PHYSICAL, severity: 3 },
        { id: '2', name: 'Sleep issues', category: SymptomCategory.SLEEP, severity: 4 },
        { id: '3', name: 'Mood changes', category: SymptomCategory.EMOTIONAL, severity: 2 },
      ]);
      
      // Mock meal plan
      setCurrentMealPlan({
        id: 'plan1',
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        meals: [
          // Mock meals would be populated here
        ],
      });
      
    } catch (error) {
      console.error('Data fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Auth functions
  const login = async (email, password) => {
    setIsLoading(true);
    try {
      // Mock login - would use Firebase Auth in production
      const userData = { id: '123', email, name: 'Sarah', isOnboarded: false };
      localStorage.setItem('meno_plus_user', JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);
      setIsOnboarded(userData.isOnboarded);
      
      // Mock symptom data for demo purposes
      setTopSymptoms([
        { id: 'hotFlashes', name: 'Hot Flashes', category: SymptomCategory.PHYSICAL },
        { id: 'moodChanges', name: 'Mood Changes', category: SymptomCategory.EMOTIONAL },
        { id: 'jointPain', name: 'Joint Pain', category: SymptomCategory.PHYSICAL },
        { id: 'sleepIssues', name: 'Sleep Problems', category: SymptomCategory.SLEEP },
        { id: 'anxiety', name: 'Anxiety', category: SymptomCategory.EMOTIONAL }
      ]);
      
      setTodaySymptoms([
        { id: 'hotFlashes', name: 'Hot Flashes', severity: 3, category: SymptomCategory.PHYSICAL },
        { id: 'sleepIssues', name: 'Sleep Problems', severity: 4, category: SymptomCategory.SLEEP },
        { id: 'anxiety', name: 'Anxiety', severity: 2, category: SymptomCategory.EMOTIONAL }
      ]);
      
      // Generate mock symptom history for the charts
      const mockHistory = [];
      const symptoms = ['hotFlashes', 'sleepIssues', 'anxiety'];
      const symptomNames = ['Hot Flashes', 'Sleep Problems', 'Anxiety'];
      const categories = [SymptomCategory.PHYSICAL, SymptomCategory.SLEEP, SymptomCategory.EMOTIONAL];
      
      for (let s = 0; s < symptoms.length; s++) {
        const pastDate = new Date();
        for (let i = 0; i < 7; i++) {
          // Clone date to avoid reference issues
          const logDate = new Date(pastDate.setDate(pastDate.getDate() - (i === 0 ? 0 : 1)));
          mockHistory.push({
            id: symptoms[s],
            name: symptomNames[s],
            category: categories[s],
            severity: Math.floor(Math.random() * 5) + 1, // Random severity 1-5
            timestamp: logDate.toISOString(),
            note: ''
          });
        }
      }
      setSymptomHistory(mockHistory);
      
      if (userData.isOnboarded) {
        await fetchUserData(userData.id);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email, password, name) => {
    setIsLoading(true);
    try {
      // Mock registration - would use Firebase Auth in production
      const userData = { id: '123', email, name, isOnboarded: false };
      localStorage.setItem('meno_plus_user', JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);
      setIsOnboarded(false);
      
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('meno_plus_user');
    localStorage.removeItem('meno_plus_meal_customizations');
    setUser(null);
    setIsAuthenticated(false);
    setIsOnboarded(false);
    setOnboardingComplete(false);
    setUserProfile(defaultUserProfile);
    setDietaryPreferences(defaultDietaryPreferences);
    setHealthGoals(defaultHealthGoals);
    setTopSymptoms([]);
    setTodaySymptoms([]);
    setSymptomHistory([]);
    setCurrentMealPlan(null);
    setTodayMeals([]);
    setTodaysMood(null);
    setMoodHistory([]);
    // Clear meal customizations if the state exists
    if (typeof setMealCustomizations === 'function') {
      setMealCustomizations({});
    }
  };

  const resetPreferences = () => {
    // Same as logout but specifically for resetting preferences
    logout();
  };

  const completeOnboarding = (profileData) => {
    const { profile, dietary, goals, symptoms } = profileData;
    
    setUserProfile(profile);
    setDietaryPreferences(dietary);
    setHealthGoals(goals);
    setTopSymptoms(symptoms);
    
    // Update user in storage
    if (user) {
      const updatedUser = { ...user, isOnboarded: true };
      localStorage.setItem('meno_plus_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsOnboarded(true);
    }
  };
  
  // Mood check-in
  const recordMood = (mood, notes = '', symptoms = []) => {
    const moodData = { mood, notes, symptoms, timestamp: new Date() };
    setTodaysMood(moodData);
    // Add to mood history
    setMoodHistory([...moodHistory, moodData]);
    // Would save to backend in real implementation
  };

  // Set today's mood
  const setTodayMood = (mood) => {
    recordMood(mood);
  };
  
  // Symptom tracking
  const addSymptomLog = async (symptomLog) => {
    const newLog = {
      ...symptomLog,
      timestamp: new Date().toISOString()
    };
    
    // Update today's symptoms
    const updatedTodaySymptoms = [...todaySymptoms];
    const existingIndex = updatedTodaySymptoms.findIndex(s => s.id === newLog.id);
    
    if (existingIndex >= 0) {
      updatedTodaySymptoms[existingIndex] = newLog;
    } else {
      updatedTodaySymptoms.push(newLog);
    }
    
    setTodaySymptoms(updatedTodaySymptoms);
    
    // Add to history
    setSymptomHistory(prev => [...prev, newLog]);
    
    // Return a resolved promise to match async expectation
    return Promise.resolve(newLog);
  };
  
  // Get symptom history
  const getSymptomHistory = async () => {
    // In a real implementation, this would fetch from an API
    // Return a promise that resolves immediately with the current data
    return Promise.resolve(symptomHistory);
  };
  
  // Get mood history
  const getMoodHistory = async () => {
    // In a real implementation, this would fetch from an API
    return moodHistory;
  };
  
  // Meal customizations state
  const [mealCustomizations, setMealCustomizations] = useState({});

  // Add or update a meal customization
  const saveMealCustomization = (mealId, customizationData) => {
    setMealCustomizations(prev => ({
      ...prev,
      [mealId]: {
        ...prev[mealId],
        ...customizationData,
        lastUpdated: new Date().toISOString()
      }
    }));
    
    // In a real implementation, this would save to the backend
    localStorage.setItem('meno_plus_meal_customizations', 
      JSON.stringify({ ...mealCustomizations, [mealId]: customizationData }));
  };

  // Get customizations for a specific meal
  const getMealCustomization = (mealId) => {
    return mealCustomizations[mealId] || null;
  };
  
  // Load saved customizations on init
  useEffect(() => {
    try {
      const savedCustomizations = localStorage.getItem('meno_plus_meal_customizations');
      if (savedCustomizations) {
        setMealCustomizations(JSON.parse(savedCustomizations));
      }
    } catch (error) {
      console.error('Error loading meal customizations:', error);
    }
  }, []);

  // Provide the context value
  const contextValue = {
    // Auth state
    user,
    isAuthenticated,
    authLoading,
    login,
    register,
    logout,
    resetPreferences,
    
    // User profiles
    userProfile,
    dietaryPreferences,
    healthGoals,
    setUserProfile,
    setDietaryPreferences,
    setHealthGoals,
    
    // App data
    topSymptoms,
    setTopSymptoms,
    currentMealPlan,
    setCurrentMealPlan,
    todaysMood,
    recordMood,
    setTodayMood,
    
    // Symptoms tracking
    todaySymptoms,
    setTodaySymptoms,
    symptomHistory,
    addSymptomLog,
    getSymptomHistory,
    
    // Meal tracking
    todayMeals,
    setTodayMeals,
    mealCustomizations,
    saveMealCustomization,
    getMealCustomization,
    
    // Mood tracking
    moodHistory,
    getMoodHistory,
    
    // Onboarding
    isOnboarded,
    onboardingComplete,
    setOnboardingComplete,
    completeOnboarding,
    
    // App state
    isLoading,
    setIsLoading,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export default AppContext;