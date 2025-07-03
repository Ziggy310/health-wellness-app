// Types used throughout the application

// User related enums
export const MenopauseStage = {
  UNKNOWN: 'UNKNOWN',
  PREMENOPAUSAL: 'PREMENOPAUSAL',
  PERIMENOPAUSAL: 'PERIMENOPAUSAL',
  MENOPAUSAL: 'MENOPAUSAL',
  POSTMENOPAUSAL: 'POSTMENOPAUSAL',
};

export const DietType = {
  OMNIVORE: 'OMNIVORE',
  VEGETARIAN: 'VEGETARIAN',
  VEGAN: 'VEGAN',
  PESCATARIAN: 'PESCATARIAN',
  MEDITERRANEAN: 'MEDITERRANEAN',
  LOW_CARB: 'LOW_CARB',
  PALEO: 'PALEO',
  KETO: 'KETO',
  OTHER: 'OTHER',
};

// Symptom related enums
export const SymptomCategory = {
  PHYSICAL: 'PHYSICAL',
  EMOTIONAL: 'EMOTIONAL',
  COGNITIVE: 'COGNITIVE',
  SLEEP: 'SLEEP',
  OTHER: 'OTHER',
};

// Meal related enums
export const MealType = {
  BREAKFAST: 'BREAKFAST',
  LUNCH: 'LUNCH',
  DINNER: 'DINNER',
  SNACK: 'SNACK',
};

// Mood check-in types
export const MoodType = {
  VERY_GOOD: 'VERY_GOOD',
  GOOD: 'GOOD',
  NEUTRAL: 'NEUTRAL',
  LOW: 'LOW',
  VERY_LOW: 'VERY_LOW',
  IRRITABLE: 'IRRITABLE',
  ANXIOUS: 'ANXIOUS',
  FOGGY: 'FOGGY',
};

// Relief tools categories
export const ToolCategory = {
  SLEEP: 'SLEEP',
  MOOD: 'MOOD',
  PHYSICAL: 'PHYSICAL',
  NUTRITION: 'NUTRITION',
  MINDFULNESS: 'MINDFULNESS',
};

// Craving types for snack substitutions
export const CravingType = {
  SWEET: 'SWEET',
  SALTY: 'SALTY',
  CRUNCHY: 'CRUNCHY',
  CREAMY: 'CREAMY',
  SAVORY: 'SAVORY',
  CHOCOLATE: 'CHOCOLATE',
  CARBS: 'CARBS',
};

// Grocery provider types
export const GroceryProvider = {
  INSTACART: 'INSTACART',
  WALMART: 'WALMART',
  AMAZON_FRESH: 'AMAZON_FRESH',
  KROGER: 'KROGER',
  SHIPT: 'SHIPT',
};

// Community post related enums
export const PostCategory = {
  DISCUSSION: 'DISCUSSION',
  QUESTION: 'QUESTION',
  RESOURCE: 'RESOURCE',
  SUCCESS_STORY: 'SUCCESS_STORY',
  SUPPORT: 'SUPPORT',
};

export const PostTopic = {
  HOT_FLASHES: 'HOT_FLASHES',
  SLEEP: 'SLEEP',
  MOOD_CHANGES: 'MOOD_CHANGES',
  NUTRITION: 'NUTRITION',
  EXERCISE: 'EXERCISE',
  RELATIONSHIPS: 'RELATIONSHIPS',
  COGNITIVE_CHANGES: 'COGNITIVE_CHANGES',
  HORMONES: 'HORMONES',
  GENERAL: 'GENERAL',
};

export const CommentSortType = {
  NEWEST: 'NEWEST',
  OLDEST: 'OLDEST',
  MOST_LIKED: 'MOST_LIKED',
};

// Educational resources related enums
export const ResourceType = {
  ARTICLE: 'ARTICLE',
  VIDEO: 'VIDEO',
  PODCAST: 'PODCAST',
  INFOGRAPHIC: 'INFOGRAPHIC',
  RESEARCH: 'RESEARCH',
};

export const ResourceCategory = {
  SYMPTOMS: 'SYMPTOMS',
  TREATMENTS: 'TREATMENTS',
  LIFESTYLE: 'LIFESTYLE',
  NUTRITION: 'NUTRITION',
  MENTAL_HEALTH: 'MENTAL_HEALTH',
  HORMONES: 'HORMONES',
  RELATIONSHIPS: 'RELATIONSHIPS',
  RESEARCH: 'RESEARCH',
  OTHER: 'OTHER',
};