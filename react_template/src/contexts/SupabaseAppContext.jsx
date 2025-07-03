import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import UserProfileService from '../services/UserProfileService';
import MealPlanService from '../services/MealPlanService';

const SupabaseAppContext = createContext();

export const useSupabaseApp = () => {
  const context = useContext(SupabaseAppContext);
  if (!context) {
    throw new Error('useSupabaseApp must be used within a SupabaseAppProvider');
  }
  return context;
};

export const SupabaseAppProvider = ({ children }) => {
  const { user, profile, isAuthenticated } = useAuth();
  
  // User data states
  const [dietaryPreferences, setDietaryPreferences] = useState(null);
  const [healthGoals, setHealthGoals] = useState(null);
  const [symptoms, setSymptoms] = useState([]);
  const [moodLogs, setMoodLogs] = useState([]);
  
  // Meal plan states
  const [activeMealPlan, setActiveMealPlan] = useState(null);
  const [mealHistory, setMealHistory] = useState([]);
  const [availableMeals, setAvailableMeals] = useState([]);
  
  // Loading states
  const [dataLoading, setDataLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load user data when authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserData();
    } else {
      // Clear data when not authenticated
      clearUserData();
    }
  }, [isAuthenticated, user]);

  const loadUserData = async () => {
    try {
      setDataLoading(true);
      setError(null);

      // Load all user data in parallel
      const [
        dietaryPrefs,
        healthGoalsData,
        recentSymptoms,
        recentMoods,
        mealPlan,
        mealHistoryData,
        mealsData
      ] = await Promise.all([
        UserProfileService.getDietaryPreferences(user.id).catch(() => null),
        UserProfileService.getHealthGoals(user.id).catch(() => null),
        UserProfileService.getSymptoms(user.id).catch(() => []),
        UserProfileService.getMoodLogs(user.id).catch(() => []),
        MealPlanService.getActiveMealPlan(user.id).catch(() => null),
        MealPlanService.getMealHistory(user.id, 20).catch(() => []),
        MealPlanService.getAllMeals().catch(() => [])
      ]);

      setDietaryPreferences(dietaryPrefs);
      setHealthGoals(healthGoalsData);
      setSymptoms(recentSymptoms);
      setMoodLogs(recentMoods);
      setActiveMealPlan(mealPlan);
      setMealHistory(mealHistoryData);
      setAvailableMeals(mealsData);

    } catch (error) {
      console.error('Error loading user data:', error);
      setError('Failed to load user data');
    } finally {
      setDataLoading(false);
    }
  };

  const clearUserData = () => {
    setDietaryPreferences(null);
    setHealthGoals(null);
    setSymptoms([]);
    setMoodLogs([]);
    setActiveMealPlan(null);
    setMealHistory([]);
    setAvailableMeals([]);
    setError(null);
  };

  // Dietary preferences methods
  const saveDietaryPreferences = async (preferences) => {
    try {
      const savedPrefs = await UserProfileService.saveDietaryPreferences(user.id, preferences);
      setDietaryPreferences(savedPrefs);
      return savedPrefs;
    } catch (error) {
      setError('Failed to save dietary preferences');
      throw error;
    }
  };

  // Health goals methods
  const saveHealthGoals = async (goals) => {
    try {
      const savedGoals = await UserProfileService.saveHealthGoals(user.id, goals);
      setHealthGoals(savedGoals);
      return savedGoals;
    } catch (error) {
      setError('Failed to save health goals');
      throw error;
    }
  };

  // Symptom tracking methods
  const logSymptom = async (symptom) => {
    try {
      const loggedSymptom = await UserProfileService.logSymptom(user.id, symptom);
      setSymptoms(prev => [loggedSymptom, ...prev]);
      return loggedSymptom;
    } catch (error) {
      setError('Failed to log symptom');
      throw error;
    }
  };

  // Mood tracking methods
  const logMood = async (moodData) => {
    try {
      const loggedMood = await UserProfileService.logMood(user.id, moodData);
      setMoodLogs(prev => [loggedMood, ...prev]);
      return loggedMood;
    } catch (error) {
      setError('Failed to log mood');
      throw error;
    }
  };

  // Meal plan methods
  const createMealPlan = async (planData) => {
    try {
      const newPlan = await MealPlanService.createMealPlan(user.id, {
        ...planData,
        is_active: true
      });
      
      // Deactivate previous plans if needed
      if (activeMealPlan) {
        await MealPlanService.updateMealPlan(activeMealPlan.id, { is_active: false });
      }
      
      setActiveMealPlan(newPlan);
      return newPlan;
    } catch (error) {
      setError('Failed to create meal plan');
      throw error;
    }
  };

  const addMealToPlan = async (mealId, dayOfWeek, mealType) => {
    try {
      if (!activeMealPlan) {
        throw new Error('No active meal plan found');
      }
      
      const mealPlanItem = await MealPlanService.addMealToPlan(
        activeMealPlan.id,
        mealId,
        dayOfWeek,
        mealType
      );
      
      // Refresh active meal plan
      const updatedPlan = await MealPlanService.getActiveMealPlan(user.id);
      setActiveMealPlan(updatedPlan);
      
      return mealPlanItem;
    } catch (error) {
      setError('Failed to add meal to plan');
      throw error;
    }
  };

  const trackMealCompletion = async (mealId, rating = null, notes = '') => {
    try {
      const trackedMeal = await MealPlanService.trackMealCompletion(
        user.id,
        mealId,
        rating,
        notes
      );
      
      setMealHistory(prev => [trackedMeal, ...prev]);
      return trackedMeal;
    } catch (error) {
      setError('Failed to track meal completion');
      throw error;
    }
  };

  const generateWeeklyMealPlan = async (preferences = {}) => {
    try {
      const generatedPlan = await MealPlanService.generateWeeklyMealPlan(user.id, preferences);
      return generatedPlan;
    } catch (error) {
      setError('Failed to generate meal plan');
      throw error;
    }
  };

  // Search meals
  const searchMeals = async (query, filters = {}) => {
    try {
      return await MealPlanService.searchMeals(query, filters);
    } catch (error) {
      setError('Failed to search meals');
      throw error;
    }
  };

  // Get meal by slug
  const getMealBySlug = async (slug) => {
    try {
      return await MealPlanService.getMealBySlug(slug);
    } catch (error) {
      setError('Failed to get meal details');
      throw error;
    }
  };

  // Reset app state (for testing or logout)
  const resetAppState = () => {
    clearUserData();
    setError(null);
  };

  const value = {
    // User data
    dietaryPreferences,
    healthGoals,
    symptoms,
    moodLogs,
    
    // Meal data
    activeMealPlan,
    mealHistory,
    availableMeals,
    
    // Loading and error states
    dataLoading,
    error,
    
    // Methods
    loadUserData,
    saveDietaryPreferences,
    saveHealthGoals,
    logSymptom,
    logMood,
    createMealPlan,
    addMealToPlan,
    trackMealCompletion,
    generateWeeklyMealPlan,
    searchMeals,
    getMealBySlug,
    resetAppState,
    
    // Convenience getters
    hasData: !!(dietaryPreferences || healthGoals),
    hasMealPlan: !!activeMealPlan,
    isLoading: dataLoading
  };

  return (
    <SupabaseAppContext.Provider value={value}>
      {children}
    </SupabaseAppContext.Provider>
  );
};

export default SupabaseAppContext;