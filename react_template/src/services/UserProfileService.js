import { supabase } from '../lib/supabase';

class UserProfileService {
  async createProfile(userId, profileData) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .insert([{
          user_id: userId,
          ...profileData
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Create profile error:', error);
      throw new Error(error.message || 'Failed to create profile');
    }
  }

  async getProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      console.error('Get profile error:', error);
      throw new Error(error.message || 'Failed to get profile');
    }
  }

  async updateProfile(userId, updates) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw new Error(error.message || 'Failed to update profile');
    }
  }

  async getDietaryPreferences(userId) {
    try {
      const { data, error } = await supabase
        .from('dietary_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      console.error('Get dietary preferences error:', error);
      throw new Error(error.message || 'Failed to get dietary preferences');
    }
  }

  async saveDietaryPreferences(userId, preferences) {
    try {
      const { data, error } = await supabase
        .from('dietary_preferences')
        .upsert({
          user_id: userId,
          ...preferences,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Save dietary preferences error:', error);
      throw new Error(error.message || 'Failed to save dietary preferences');
    }
  }

  async getHealthGoals(userId) {
    try {
      const { data, error } = await supabase
        .from('health_goals')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      console.error('Get health goals error:', error);
      throw new Error(error.message || 'Failed to get health goals');
    }
  }

  async saveHealthGoals(userId, goals) {
    try {
      const { data, error } = await supabase
        .from('health_goals')
        .upsert({
          user_id: userId,
          ...goals,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Save health goals error:', error);
      throw new Error(error.message || 'Failed to save health goals');
    }
  }

  async logSymptom(userId, symptom) {
    try {
      const { data, error } = await supabase
        .from('symptoms')
        .insert([{
          user_id: userId,
          ...symptom
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Log symptom error:', error);
      throw new Error(error.message || 'Failed to log symptom');
    }
  }

  async getSymptoms(userId, startDate, endDate) {
    try {
      let query = supabase
        .from('symptoms')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false });

      if (startDate) {
        query = query.gte('timestamp', startDate);
      }
      if (endDate) {
        query = query.lte('timestamp', endDate);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Get symptoms error:', error);
      throw new Error(error.message || 'Failed to get symptoms');
    }
  }

  async logMood(userId, moodData) {
    try {
      const { data, error } = await supabase
        .from('mood_logs')
        .insert([{
          user_id: userId,
          ...moodData
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Log mood error:', error);
      throw new Error(error.message || 'Failed to log mood');
    }
  }

  async getMoodLogs(userId, startDate, endDate) {
    try {
      let query = supabase
        .from('mood_logs')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false });

      if (startDate) {
        query = query.gte('timestamp', startDate);
      }
      if (endDate) {
        query = query.lte('timestamp', endDate);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Get mood logs error:', error);
      throw new Error(error.message || 'Failed to get mood logs');
    }
  }
}

export default new UserProfileService();