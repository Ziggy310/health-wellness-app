-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types/enums
CREATE TYPE menopause_stage AS ENUM (
  'UNKNOWN',
  'PREMENOPAUSAL', 
  'PERIMENOPAUSAL',
  'MENOPAUSAL',
  'POSTMENOPAUSAL'
);

CREATE TYPE diet_type AS ENUM (
  'OMNIVORE',
  'VEGETARIAN',
  'VEGAN', 
  'PESCATARIAN',
  'MEDITERRANEAN',
  'LOW_CARB',
  'PALEO',
  'KETO',
  'OTHER'
);

CREATE TYPE symptom_category AS ENUM (
  'PHYSICAL',
  'EMOTIONAL', 
  'COGNITIVE',
  'SLEEP',
  'OTHER'
);

CREATE TYPE meal_type AS ENUM (
  'BREAKFAST',
  'LUNCH',
  'DINNER',
  'SNACK'
);

CREATE TYPE mood_type AS ENUM (
  'VERY_GOOD',
  'GOOD',
  'NEUTRAL',
  'LOW',
  'VERY_LOW',
  'IRRITABLE',
  'ANXIOUS',
  'FOGGY'
);

-- User profiles table
CREATE TABLE user_profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  menopause_stage menopause_stage DEFAULT 'UNKNOWN',
  last_period_date DATE,
  has_hot_flashes BOOLEAN DEFAULT FALSE,
  has_sleep_issues BOOLEAN DEFAULT FALSE,
  has_mood_changes BOOLEAN DEFAULT FALSE,
  energy_level INTEGER DEFAULT 3 CHECK (energy_level >= 1 AND energy_level <= 5),
  has_cognitive_issues BOOLEAN DEFAULT FALSE,
  health_conditions TEXT[],
  is_onboarded BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Dietary preferences table
CREATE TABLE dietary_preferences (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  primary_diet diet_type DEFAULT 'OMNIVORE',
  allergies TEXT[],
  dislikes TEXT[],
  preferences TEXT[],
  is_gluten_free BOOLEAN DEFAULT FALSE,
  is_dairy_free BOOLEAN DEFAULT FALSE,
  is_nut_free BOOLEAN DEFAULT FALSE,
  prep_time_preference INTEGER DEFAULT 30,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Health goals table
CREATE TABLE health_goals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  primary_goals TEXT[],
  secondary_goals TEXT[],
  target_date DATE,
  improve_sleep BOOLEAN DEFAULT FALSE,
  reduce_hot_flashes BOOLEAN DEFAULT FALSE,
  stabilize_mood BOOLEAN DEFAULT FALSE,
  improve_cognition BOOLEAN DEFAULT FALSE,
  maintain_weight BOOLEAN DEFAULT FALSE,
  lose_weight BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Symptoms tracking table
CREATE TABLE symptoms (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  symptom_id TEXT NOT NULL,
  name TEXT NOT NULL,
  category symptom_category NOT NULL,
  severity INTEGER CHECK (severity >= 1 AND severity <= 5),
  notes TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Mood logs table
CREATE TABLE mood_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  mood mood_type NOT NULL,
  notes TEXT,
  symptoms TEXT[],
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Master meals table (static data)
CREATE TABLE meals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  meal_type meal_type NOT NULL,
  description TEXT,
  ingredients JSONB,
  instructions JSONB,
  nutritional_info JSONB,
  dietary_tags TEXT[],
  prep_time INTEGER,
  cook_time INTEGER,
  servings INTEGER DEFAULT 1,
  difficulty_level INTEGER DEFAULT 1 CHECK (difficulty_level >= 1 AND difficulty_level <= 5),
  health_benefits TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User meal plans table
CREATE TABLE meal_plans (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Meal plan items (individual meals within a plan)
CREATE TABLE meal_plan_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  meal_plan_id UUID REFERENCES meal_plans(id) ON DELETE CASCADE NOT NULL,
  meal_id UUID REFERENCES meals(id) ON DELETE CASCADE NOT NULL,
  day_of_week TEXT NOT NULL CHECK (day_of_week IN ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday')),
  meal_type meal_type NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User meal customizations table
CREATE TABLE meal_customizations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  meal_id UUID REFERENCES meals(id) ON DELETE CASCADE NOT NULL,
  customization_data JSONB NOT NULL,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, meal_id)
);

-- User meal tracking (completed meals)
CREATE TABLE meal_tracking (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  meal_id UUID REFERENCES meals(id) ON DELETE CASCADE NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_dietary_preferences_user_id ON dietary_preferences(user_id);
CREATE INDEX idx_health_goals_user_id ON health_goals(user_id);
CREATE INDEX idx_symptoms_user_id ON symptoms(user_id);
CREATE INDEX idx_symptoms_timestamp ON symptoms(timestamp);
CREATE INDEX idx_mood_logs_user_id ON mood_logs(user_id);
CREATE INDEX idx_mood_logs_timestamp ON mood_logs(timestamp);
CREATE INDEX idx_meals_slug ON meals(slug);
CREATE INDEX idx_meals_meal_type ON meals(meal_type);
CREATE INDEX idx_meal_plans_user_id ON meal_plans(user_id);
CREATE INDEX idx_meal_plans_dates ON meal_plans(start_date, end_date);
CREATE INDEX idx_meal_plan_items_plan_id ON meal_plan_items(meal_plan_id);
CREATE INDEX idx_meal_customizations_user_meal ON meal_customizations(user_id, meal_id);
CREATE INDEX idx_meal_tracking_user_id ON meal_tracking(user_id);
CREATE INDEX idx_meal_tracking_completed_at ON meal_tracking(completed_at);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_dietary_preferences_updated_at BEFORE UPDATE ON dietary_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_health_goals_updated_at BEFORE UPDATE ON health_goals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_symptoms_updated_at BEFORE UPDATE ON symptoms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_meals_updated_at BEFORE UPDATE ON meals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_meal_plans_updated_at BEFORE UPDATE ON meal_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE dietary_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE symptoms ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_plan_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_customizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_tracking ENABLE ROW LEVEL SECURITY;

-- Policies for user_profiles
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = user_id);

-- Policies for dietary_preferences
CREATE POLICY "Users can view own dietary preferences" ON dietary_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own dietary preferences" ON dietary_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own dietary preferences" ON dietary_preferences FOR UPDATE USING (auth.uid() = user_id);

-- Policies for health_goals
CREATE POLICY "Users can view own health goals" ON health_goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own health goals" ON health_goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own health goals" ON health_goals FOR UPDATE USING (auth.uid() = user_id);

-- Policies for symptoms
CREATE POLICY "Users can view own symptoms" ON symptoms FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own symptoms" ON symptoms FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own symptoms" ON symptoms FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own symptoms" ON symptoms FOR DELETE USING (auth.uid() = user_id);

-- Policies for mood_logs
CREATE POLICY "Users can view own mood logs" ON mood_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own mood logs" ON mood_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own mood logs" ON mood_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own mood logs" ON mood_logs FOR DELETE USING (auth.uid() = user_id);

-- Policies for meals (public read access)
CREATE POLICY "Anyone can view meals" ON meals FOR SELECT USING (true);

-- Policies for meal_plans
CREATE POLICY "Users can view own meal plans" ON meal_plans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own meal plans" ON meal_plans FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own meal plans" ON meal_plans FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own meal plans" ON meal_plans FOR DELETE USING (auth.uid() = user_id);

-- Policies for meal_plan_items
CREATE POLICY "Users can view own meal plan items" ON meal_plan_items FOR SELECT USING (
  auth.uid() IN (SELECT user_id FROM meal_plans WHERE id = meal_plan_id)
);
CREATE POLICY "Users can insert own meal plan items" ON meal_plan_items FOR INSERT WITH CHECK (
  auth.uid() IN (SELECT user_id FROM meal_plans WHERE id = meal_plan_id)
);
CREATE POLICY "Users can update own meal plan items" ON meal_plan_items FOR UPDATE USING (
  auth.uid() IN (SELECT user_id FROM meal_plans WHERE id = meal_plan_id)
);
CREATE POLICY "Users can delete own meal plan items" ON meal_plan_items FOR DELETE USING (
  auth.uid() IN (SELECT user_id FROM meal_plans WHERE id = meal_plan_id)
);

-- Policies for meal_customizations
CREATE POLICY "Users can view own meal customizations" ON meal_customizations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own meal customizations" ON meal_customizations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own meal customizations" ON meal_customizations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own meal customizations" ON meal_customizations FOR DELETE USING (auth.uid() = user_id);

-- Policies for meal_tracking
CREATE POLICY "Users can view own meal tracking" ON meal_tracking FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own meal tracking" ON meal_tracking FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own meal tracking" ON meal_tracking FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own meal tracking" ON meal_tracking FOR DELETE USING (auth.uid() = user_id);

-- Insert some sample meals data
INSERT INTO meals (name, slug, meal_type, description, ingredients, instructions, nutritional_info, dietary_tags, prep_time, cook_time, servings, difficulty_level, health_benefits) VALUES
('Mediterranean Quinoa Bowl', 'mediterranean-quinoa-bowl', 'LUNCH', 'A nutritious bowl with quinoa, fresh vegetables, and mediterranean flavors perfect for menopause support.', 
 '{"main": ["1 cup quinoa", "2 cups vegetable broth"], "vegetables": ["1 cucumber diced", "2 tomatoes diced", "1/2 red onion sliced"], "protein": ["1/2 cup chickpeas", "1/4 cup feta cheese"], "dressing": ["3 tbsp olive oil", "2 tbsp lemon juice", "1 tsp oregano"]}',
 '{"steps": ["Cook quinoa in vegetable broth", "Dice vegetables", "Mix dressing ingredients", "Combine all ingredients", "Serve chilled or at room temperature"]}',
 '{"calories": 380, "protein": "14g", "carbs": "52g", "fat": "14g", "fiber": "8g", "calcium": "150mg"}',
 '{"Mediterranean", "Vegetarian", "High-Fiber", "Calcium-Rich"}', 15, 20, 2, 2,
 '{"Supports bone health with calcium", "High fiber for digestive health", "Anti-inflammatory ingredients", "Heart-healthy fats"}'),

('Hormone-Balancing Smoothie', 'hormone-balancing-smoothie', 'BREAKFAST', 'A delicious smoothie packed with ingredients that support hormonal balance during menopause.',
 '{"fruits": ["1 cup blueberries", "1/2 banana", "1/2 avocado"], "liquid": ["1 cup almond milk", "1 tbsp almond butter"], "supplements": ["1 tbsp ground flaxseed", "1 tsp maca powder", "1 cup spinach"]}',
 '{"steps": ["Add all ingredients to blender", "Blend until smooth", "Add ice if desired", "Pour into glass and enjoy immediately"]}',
 '{"calories": 320, "protein": "8g", "carbs": "28g", "fat": "20g", "fiber": "12g", "omega3": "2000mg"}',
 '{"Vegan", "Gluten-Free", "High-Fiber", "Omega-3 Rich"}', 5, 0, 1, 1,
 '{"Supports hormonal balance", "Rich in omega-3 fatty acids", "High in antioxidants", "Promotes energy and focus"}'),

('Salmon with Roasted Vegetables', 'salmon-roasted-vegetables', 'DINNER', 'Omega-3 rich salmon with colorful roasted vegetables for optimal menopause nutrition.',
 '{"protein": ["4 oz salmon fillet"], "vegetables": ["1 cup broccoli florets", "1 cup bell peppers", "1 cup zucchini sliced"], "seasonings": ["2 tbsp olive oil", "1 tsp garlic powder", "1 tsp herbs de provence", "salt and pepper"]}',
 '{"steps": ["Preheat oven to 400°F", "Toss vegetables with oil and seasonings", "Place salmon and vegetables on baking sheet", "Roast for 15-20 minutes", "Serve immediately"]}',
 '{"calories": 350, "protein": "28g", "carbs": "15g", "fat": "22g", "fiber": "6g", "omega3": "1800mg"}',
 '{"Pescatarian", "Gluten-Free", "Low-Carb", "Omega-3 Rich"}', 10, 20, 1, 2,
 '{"Supports heart health", "Rich in omega-3 fatty acids", "Anti-inflammatory properties", "Supports brain health"}');

-- Insert sample user data (this would typically be done through the application)
-- Note: This is just for reference and should be removed in production
-- Real user data will be inserted through the application after authentication