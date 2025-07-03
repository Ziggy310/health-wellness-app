import { supabase } from '../lib/supabase';

class MealPlanService {
  async getAllMeals() {
    try {
      const { data, error } = await supabase
        .from('meals')
        .select('*')
        .order('name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Get all meals error:', error);
      throw new Error(error.message || 'Failed to get meals');
    }
  }

  async getMealBySlug(slug) {
    try {
      const { data, error } = await supabase
        .from('meals')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Get meal by slug error:', error);
      throw new Error(error.message || 'Failed to get meal');
    }
  }

  async getMealsByType(mealType) {
    try {
      const { data, error } = await supabase
        .from('meals')
        .select('*')
        .eq('meal_type', mealType.toUpperCase())
        .order('name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Get meals by type error:', error);
      throw new Error(error.message || 'Failed to get meals by type');
    }
  }

  async searchMeals(query, filters = {}) {
    try {
      let queryBuilder = supabase
        .from('meals')
        .select('*');

      if (query) {
        queryBuilder = queryBuilder.or(`name.ilike.%${query}%,description.ilike.%${query}%`);
      }

      if (filters.mealType) {
        queryBuilder = queryBuilder.eq('meal_type', filters.mealType.toUpperCase());
      }

      if (filters.dietaryTags && filters.dietaryTags.length > 0) {
        queryBuilder = queryBuilder.overlaps('dietary_tags', filters.dietaryTags);
      }

      if (filters.maxPrepTime) {
        queryBuilder = queryBuilder.lte('prep_time', filters.maxPrepTime);
      }

      if (filters.maxCookTime) {
        queryBuilder = queryBuilder.lte('cook_time', filters.maxCookTime);
      }

      const { data, error } = await queryBuilder.order('name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Search meals error:', error);
      throw new Error(error.message || 'Failed to search meals');
    }
  }

  async createMealPlan(userId, planData) {
    try {
      const { data, error } = await supabase
        .from('meal_plans')
        .insert([{
          user_id: userId,
          ...planData
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Create meal plan error:', error);
      throw new Error(error.message || 'Failed to create meal plan');
    }
  }

  async getUserMealPlans(userId) {
    try {
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
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Get user meal plans error:', error);
      throw new Error(error.message || 'Failed to get meal plans');
    }
  }

  async getActiveMealPlan(userId) {
    try {
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
        .eq('is_active', true)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      console.error('Get active meal plan error:', error);
      throw new Error(error.message || 'Failed to get active meal plan');
    }
  }

  async addMealToPlan(mealPlanId, mealId, dayOfWeek, mealType, orderIndex = 0) {
    try {
      const { data, error } = await supabase
        .from('meal_plan_items')
        .insert([{
          meal_plan_id: mealPlanId,
          meal_id: mealId,
          day_of_week: dayOfWeek.toLowerCase(),
          meal_type: mealType.toUpperCase(),
          order_index: orderIndex
        }])
        .select(`
          *,
          meals (*)
        `)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Add meal to plan error:', error);
      throw new Error(error.message || 'Failed to add meal to plan');
    }
  }

  async removeMealFromPlan(mealPlanItemId) {
    try {
      const { error } = await supabase
        .from('meal_plan_items')
        .delete()
        .eq('id', mealPlanItemId);

      if (error) throw error;
    } catch (error) {
      console.error('Remove meal from plan error:', error);
      throw new Error(error.message || 'Failed to remove meal from plan');
    }
  }

  async updateMealPlan(mealPlanId, updates) {
    try {
      const { data, error } = await supabase
        .from('meal_plans')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', mealPlanId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Update meal plan error:', error);
      throw new Error(error.message || 'Failed to update meal plan');
    }
  }

  async trackMealCompletion(userId, mealId, rating = null, notes = '') {
    try {
      const { data, error } = await supabase
        .from('meal_tracking')
        .insert([{
          user_id: userId,
          meal_id: mealId,
          rating,
          notes
        }])
        .select(`
          *,
          meals (*)
        `)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Track meal completion error:', error);
      throw new Error(error.message || 'Failed to track meal completion');
    }
  }

  async getMealHistory(userId, limit = 50) {
    try {
      const { data, error } = await supabase
        .from('meal_tracking')
        .select(`
          *,
          meals (*)
        `)
        .eq('user_id', userId)
        .order('completed_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Get meal history error:', error);
      throw new Error(error.message || 'Failed to get meal history');
    }
  }

  async customizeMeal(userId, mealId, customizations) {
    try {
      const { data, error } = await supabase
        .from('meal_customizations')
        .upsert({
          user_id: userId,
          meal_id: mealId,
          customization_data: customizations
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Customize meal error:', error);
      throw new Error(error.message || 'Failed to customize meal');
    }
  }

  async getMealCustomizations(userId, mealId) {
    try {
      const { data, error } = await supabase
        .from('meal_customizations')
        .select('*')
        .eq('user_id', userId)
        .eq('meal_id', mealId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      console.error('Get meal customizations error:', error);
      throw new Error(error.message || 'Failed to get meal customizations');
    }
  }

  async generateWeeklyMealPlan(userId, preferences = {}) {
    try {
      // Get user's dietary preferences and health goals
      const { data: dietaryPrefs } = await supabase
        .from('dietary_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      const { data: healthGoals } = await supabase
        .from('health_goals')
        .select('*')
        .eq('user_id', userId)
        .single();

      // Build query based on preferences
      let queryBuilder = supabase.from('meals').select('*');

      if (dietaryPrefs?.primary_diet) {
        const dietTag = dietaryPrefs.primary_diet.toLowerCase();
        queryBuilder = queryBuilder.contains('dietary_tags', [dietTag]);
      }

      if (dietaryPrefs?.prep_time_preference) {
        queryBuilder = queryBuilder.lte('prep_time', dietaryPrefs.prep_time_preference);
      }

      const { data: meals, error } = await queryBuilder;
      if (error) throw error;

      // Simple meal plan generation logic
      const mealPlan = {
        breakfast: [],
        lunch: [],
        dinner: []
      };

      const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

      days.forEach(day => {
        const breakfastMeals = meals.filter(m => m.meal_type === 'BREAKFAST');
        const lunchMeals = meals.filter(m => m.meal_type === 'LUNCH');
        const dinnerMeals = meals.filter(m => m.meal_type === 'DINNER');

        if (breakfastMeals.length > 0) {
          mealPlan.breakfast.push({
            day,
            meal: breakfastMeals[Math.floor(Math.random() * breakfastMeals.length)]
          });
        }

        if (lunchMeals.length > 0) {
          mealPlan.lunch.push({
            day,
            meal: lunchMeals[Math.floor(Math.random() * lunchMeals.length)]
          });
        }

        if (dinnerMeals.length > 0) {
          mealPlan.dinner.push({
            day,
            meal: dinnerMeals[Math.floor(Math.random() * dinnerMeals.length)]
          });
        }
      });

      return mealPlan;
    } catch (error) {
      console.error('Generate weekly meal plan error:', error);
      throw new Error(error.message || 'Failed to generate meal plan');
    }
  }
}

export default new MealPlanService();