import { createClient } from '@supabase/supabase-js'
import { supabase as mockSupabase, authHelpers as mockAuthHelpers, dbHelpers as mockDbHelpers, subscriptions as mockSubscriptions } from './mockSupabase.js'

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ccsurvexwnswujhxbtdf.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjc3VydmV4d25zd3VqaHhidGRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2ODQ0NzgsImV4cCI6MjA2NTI2MDQ3OH0.SWEJmXePwT3kFg6FDgl35XHiAuzj5Jl0nP7lVfLxsKQ'

// Function to test if Supabase is available
const testSupabaseConnection = async () => {
  try {
    const testClient = createClient(supabaseUrl, supabaseAnonKey);
    const { data, error } = await testClient.auth.getUser();
    return true; // If no network error, Supabase is available
  } catch (error) {
    console.warn('Supabase connection failed, using mock backend:', error.message);
    return false;
  }
};

// Determine whether to use real or mock Supabase
// Default to mock since the real Supabase project doesn't exist
const USE_MOCK_SUPABASE = import.meta.env.VITE_USE_MOCK_SUPABASE !== 'false';

let supabaseClient;
let isUsingMock = USE_MOCK_SUPABASE;

if (USE_MOCK_SUPABASE) {
  console.log('Using mock Supabase backend for development');
  supabaseClient = mockSupabase;
} else {
  // Create real Supabase client
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  });
  
  // Test connection and fallback to mock if needed
  testSupabaseConnection().then(isConnected => {
    if (!isConnected) {
      console.log('Falling back to mock Supabase backend');
      supabaseClient = mockSupabase;
      isUsingMock = true;
    }
  }).catch(() => {
    console.log('Connection test failed, using mock Supabase backend');
    supabaseClient = mockSupabase;
    isUsingMock = true;
  });
}

export const supabase = supabaseClient;
export const isMockBackend = () => isUsingMock;

// Auth helper functions - dynamically use real or mock
export const authHelpers = {
  // Sign up with email and password
  signUp: async (email, password, metadata = {}) => {
    if (isUsingMock) {
      return await mockAuthHelpers.signUp(email, password, metadata);
    }
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      })
      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Sign in with email and password
  signIn: async (email, password) => {
    if (isUsingMock) {
      return await mockAuthHelpers.signIn(email, password);
    }
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Sign out
  signOut: async () => {
    if (isUsingMock) {
      return await mockAuthHelpers.signOut();
    }
    try {
      const { error } = await supabase.auth.signOut()
      return { error }
    } catch (error) {
      return { error }
    }
  },

  // Get current user
  getCurrentUser: async () => {
    if (isUsingMock) {
      return await mockAuthHelpers.getCurrentUser();
    }
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      return { user, error }
    } catch (error) {
      return { user: null, error }
    }
  },

  // Reset password
  resetPassword: async (email) => {
    if (isUsingMock) {
      return await mockAuthHelpers.resetPassword(email);
    }
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })
      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Update password
  updatePassword: async (password) => {
    if (isUsingMock) {
      return await mockAuthHelpers.updatePassword(password);
    }
    try {
      const { data, error } = await supabase.auth.updateUser({
        password
      })
      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  }
}

// Database helper functions - dynamically use real or mock
export const dbHelpers = {
  // User Profile operations
  userProfile: {
    get: async (userId) => {
      if (isUsingMock) {
        return await mockDbHelpers.userProfile.get(userId);
      }
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single()
      return { data, error }
    },

    upsert: async (profileData) => {
      if (isUsingMock) {
        return await mockDbHelpers.userProfile.upsert(profileData);
      }
      const { data, error } = await supabase
        .from('user_profiles')
        .upsert(profileData)
        .select()
        .single()
      return { data, error }
    }
  },

  // Dietary Preferences operations
  dietaryPreferences: {
    get: async (userId) => {
      if (isUsingMock) {
        return await mockDbHelpers.dietaryPreferences.get(userId);
      }
      const { data, error } = await supabase
        .from('dietary_preferences')
        .select('*')
        .eq('user_id', userId)
        .single()
      return { data, error }
    },

    upsert: async (preferencesData) => {
      if (isUsingMock) {
        return await mockDbHelpers.dietaryPreferences.upsert(preferencesData);
      }
      const { data, error } = await supabase
        .from('dietary_preferences')
        .upsert(preferencesData)
        .select()
        .single()
      return { data, error }
    }
  },

  // Health Goals operations
  healthGoals: {
    get: async (userId) => {
      if (isUsingMock) {
        return await mockDbHelpers.healthGoals.get(userId);
      }
      const { data, error } = await supabase
        .from('health_goals')
        .select('*')
        .eq('user_id', userId)
        .single()
      return { data, error }
    },

    upsert: async (goalsData) => {
      if (isUsingMock) {
        return await mockDbHelpers.healthGoals.upsert(goalsData);
      }
      const { data, error } = await supabase
        .from('health_goals')
        .upsert(goalsData)
        .select()
        .single()
      return { data, error }
    }
  },

  // Symptoms operations
  symptoms: {
    getAll: async (userId) => {
      const { data, error } = await supabase
        .from('symptoms')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      return { data, error }
    },

    getByDate: async (userId, date) => {
      const { data, error } = await supabase
        .from('symptoms')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', `${date}T00:00:00`)
        .lt('created_at', `${date}T23:59:59`)
        .order('created_at', { ascending: false })
      return { data, error }
    },

    insert: async (symptomData) => {
      const { data, error } = await supabase
        .from('symptoms')
        .insert(symptomData)
        .select()
        .single()
      return { data, error }
    },

    update: async (id, updateData) => {
      const { data, error } = await supabase
        .from('symptoms')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()
      return { data, error }
    }
  },

  // Mood Logs operations
  moodLogs: {
    getAll: async (userId) => {
      const { data, error } = await supabase
        .from('mood_logs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      return { data, error }
    },

    getByDate: async (userId, date) => {
      const { data, error } = await supabase
        .from('mood_logs')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', `${date}T00:00:00`)
        .lt('created_at', `${date}T23:59:59`)
        .order('created_at', { ascending: false })
      return { data, error }
    },

    insert: async (moodData) => {
      const { data, error } = await supabase
        .from('mood_logs')
        .insert(moodData)
        .select()
        .single()
      return { data, error }
    }
  },

  // Meal Plans operations
  mealPlans: {
    get: async (userId) => {
      const { data, error } = await supabase
        .from('meal_plans')
        .select(`
          *,
          meal_plan_items (
            *,
            meals (*)
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      return { data, error }
    },

    getCurrent: async (userId) => {
      const today = new Date().toISOString().split('T')[0]
      const { data, error } = await supabase
        .from('meal_plans')
        .select(`
          *,
          meal_plan_items (
            *,
            meals (*)
          )
        `)
        .eq('user_id', userId)
        .lte('start_date', today)
        .gte('end_date', today)
        .single()
      return { data, error }
    },

    insert: async (mealPlanData) => {
      const { data, error } = await supabase
        .from('meal_plans')
        .insert(mealPlanData)
        .select()
        .single()
      return { data, error }
    }
  },

  // Meal Customizations operations
  mealCustomizations: {
    get: async (userId, mealId) => {
      const { data, error } = await supabase
        .from('meal_customizations')
        .select('*')
        .eq('user_id', userId)
        .eq('meal_id', mealId)
        .single()
      return { data, error }
    },

    getAll: async (userId) => {
      const { data, error } = await supabase
        .from('meal_customizations')
        .select('*')
        .eq('user_id', userId)
      return { data, error }
    },

    upsert: async (customizationData) => {
      const { data, error } = await supabase
        .from('meal_customizations')
        .upsert(customizationData)
        .select()
        .single()
      return { data, error }
    }
  }
}

// Real-time subscriptions - dynamically use real or mock
export const subscriptions = {
  // Subscribe to user's symptoms changes
  subscribeToSymptoms: (userId, callback) => {
    if (isUsingMock) {
      return mockSubscriptions.subscribeToSymptoms(userId, callback);
    }
    return supabase
      .channel('symptoms_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'symptoms',
        filter: `user_id=eq.${userId}`
      }, callback)
      .subscribe()
  },

  // Subscribe to user's mood logs changes
  subscribeToMoodLogs: (userId, callback) => {
    if (isUsingMock) {
      return mockSubscriptions.subscribeToMoodLogs(userId, callback);
    }
    return supabase
      .channel('mood_logs_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'mood_logs',
        filter: `user_id=eq.${userId}`
      }, callback)
      .subscribe()
  },

  // Subscribe to meal plan changes
  subscribeToMealPlans: (userId, callback) => {
    if (isUsingMock) {
      return mockSubscriptions.subscribeToMealPlans(userId, callback);
    }
    return supabase
      .channel('meal_plans_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'meal_plans',
        filter: `user_id=eq.${userId}`
      }, callback)
      .subscribe()
  }
}

export default supabase