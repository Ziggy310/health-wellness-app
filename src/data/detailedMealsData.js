// src/data/detailedMealsData.js
import mealImageMapping from '../../public/data/mealImageMap.json';
import { comprehensiveMealsData } from './comprehensiveMealsData';

// Comprehensive meal data with nutritional information, recipes, and health benefits
// Merging existing meals with new comprehensive meals
export const detailedMealsData = {
  // Include all comprehensive meals
  ...comprehensiveMealsData,
  "mediterranean-yogurt-bowl": {
    id: "mediterranean-yogurt-bowl",
    name: "Mediterranean Yogurt Bowl",
    slug: "mediterranean-yogurt-bowl",
    description: "A protein-rich breakfast bowl packed with probiotics and antioxidants to support digestive health and hormone balance.",
    image: mealImageMapping["Mediterranean Yogurt Bowl"]?.header || "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    thumbnail: mealImageMapping["Mediterranean Yogurt Bowl"]?.thumbnail || "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    alt: "Mediterranean Yogurt Bowl",
    prepTime: "10 minutes",
    cookTime: "0 minutes",
    servings: 1,
    difficulty: "Easy",
    mealType: "Breakfast",
    ingredients: [
      "1 cup Greek yogurt (plain, full-fat)",
      "2 tablespoons ground flaxseed",
      "1/4 cup mixed berries (blueberries, strawberries)",
      "2 tablespoons chopped walnuts",
      "1 tablespoon honey",
      "1 teaspoon chia seeds",
      "1/4 teaspoon cinnamon",
      "Fresh mint leaves for garnish"
    ],
    instructions: [
      "In a bowl, combine the Greek yogurt with ground flaxseed and cinnamon.",
      "Drizzle with honey and mix gently.",
      "Top with mixed berries, chopped walnuts, and chia seeds.",
      "Garnish with fresh mint leaves.",
      "Serve immediately for best texture and freshness."
    ],
    nutritionalInfo: {
      calories: 320,
      protein: "20g",
      carbohydrates: "28g",
      fat: "16g",
      fiber: "8g",
      sugar: "18g",
      sodium: "85mg",
      calcium: "300mg",
      iron: "2mg",
      vitaminC: "15mg"
    },
    healthBenefits: [
      "Supports digestive health with probiotics",
      "Rich in omega-3 fatty acids for heart health",
      "High protein content helps maintain muscle mass",
      "Antioxidants from berries support cellular health",
      "Flaxseeds provide lignans that may help with hormonal balance"
    ],
    symptomsHelped: [
      "Digestive issues",
      "Hormonal fluctuations",
      "Bone health concerns",
      "Heart health",
      "Energy levels"
    ],
    keyNutrients: [
      "Probiotics",
      "Omega-3 fatty acids",
      "Calcium",
      "Protein",
      "Antioxidants",
      "Lignans"
    ],
    tags: ["High Protein", "Probiotic Rich", "Heart Healthy", "Bone Health", "Quick & Easy"]
  },

  "mediterranean-quinoa-salad": {
    id: "mediterranean-quinoa-salad",
    name: "Spinach & Feta Salad with Walnuts",
    slug: "mediterranean-quinoa-salad",
    description: "A nutrient-rich salad with fresh spinach, creamy feta cheese, and crunchy walnuts to support energy levels and bone health.",
    image: mealImageMapping["Mediterranean Quinoa Salad"]?.header || "/assets/images/meals/real/mediterranean-quinoa-salad-large.jpg",
    thumbnail: mealImageMapping["Mediterranean Quinoa Salad"]?.thumbnail || "/assets/images/meals/real/mediterranean-quinoa-salad.jpg",
    alt: "Mediterranean Quinoa Salad",
    prepTime: "15 minutes",
    cookTime: "15 minutes",
    servings: 2,
    difficulty: "Easy",
    mealType: "Lunch",
    ingredients: [
      "4 cups fresh baby spinach",
      "1/2 cup crumbled feta cheese",
      "1/3 cup chopped walnuts",
      "1/4 red onion, thinly sliced",
      "1/2 cup cherry tomatoes, halved",
      "1/4 cup dried cranberries",
      "2 tablespoons extra virgin olive oil",
      "1 tablespoon balsamic vinegar",
      "1 teaspoon honey",
      "1/2 teaspoon Dijon mustard",
      "Salt and pepper to taste"
    ],
    instructions: [
      "Wash and dry the fresh spinach thoroughly.",
      "In a small bowl, whisk together olive oil, balsamic vinegar, honey, and Dijon mustard to make dressing.",
      "In a large salad bowl, combine spinach, cherry tomatoes, and red onion.",
      "Toast walnuts in a dry skillet for 2-3 minutes until fragrant (optional).",
      "Add crumbled feta cheese, toasted walnuts, and dried cranberries to the salad.",
      "Drizzle with dressing and toss gently to coat all ingredients.",
      "Season with salt and pepper to taste.",
      "Serve immediately for best texture."
    ],
    nutritionalInfo: {
      calories: 320,
      protein: "12g",
      carbohydrates: "18g",
      fat: "24g",
      fiber: "4g",
      sugar: "12g",
      sodium: "380mg",
      calcium: "280mg",
      iron: "2mg",
      vitaminC: "15mg"
    },
    healthBenefits: [
      "Rich in calcium from feta cheese supports bone health",
      "Omega-3 fatty acids from walnuts support brain function",
      "Iron and folate from spinach support energy levels",
      "Antioxidants from berries and vegetables protect cells",
      "Healthy fats support hormone production"
    ],
    symptomsHelped: [
      "Bone health concerns",
      "Brain fog",
      "Energy fluctuations",
      "Heart health concerns",
      "Inflammation"
    ],
    keyNutrients: [
      "Calcium",
      "Omega-3 fatty acids",
      "Iron",
      "Folate",
      "Antioxidants",
      "Healthy fats"
    ],
    tags: ["High Protein", "Anti-inflammatory", "Heart Healthy", "High Fiber", "Mediterranean"]
  },

  "salmon-poke-bowl": {
    id: "salmon-poke-bowl",
    name: "Grilled Salmon with Quinoa",
    slug: "salmon-poke-bowl",
    description: "A perfectly grilled salmon fillet served with fluffy quinoa, packed with omega-3s and complete proteins to support brain health and reduce inflammation.",
    image: mealImageMapping["Salmon Poke Bowl"]?.header || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    thumbnail: mealImageMapping["Salmon Poke Bowl"]?.thumbnail || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    alt: "Salmon Poke Bowl",
    prepTime: "20 minutes",
    cookTime: "15 minutes",
    servings: 2,
    difficulty: "Medium",
    mealType: "Dinner",
    ingredients: [
      "2 salmon fillets (6 oz each)",
      "1 cup quinoa",
      "2 cups vegetable broth",
      "2 tablespoons olive oil",
      "1 lemon (juiced and zested)",
      "2 cloves garlic, minced",
      "1 teaspoon dried herbs (dill or thyme)",
      "1 cup steamed broccoli",
      "1/2 cup cherry tomatoes, halved",
      "2 tablespoons fresh parsley, chopped",
      "Salt and black pepper to taste",
      "1 tablespoon butter (optional)"
    ],
    instructions: [
      "Rinse quinoa and cook with vegetable broth in a saucepan. Bring to boil, reduce heat, cover and simmer for 15 minutes.",
      "Let quinoa rest for 5 minutes, then fluff with a fork.",
      "Season salmon fillets with salt, pepper, and herbs.",
      "Heat 1 tablespoon olive oil in a grill pan or skillet over medium-high heat.",
      "Cook salmon fillets for 4-5 minutes per side until cooked through and flaky.",
      "In the last minute, add butter and lemon juice to the pan for extra flavor.",
      "Steam broccoli until tender-crisp, about 4-5 minutes.",
      "Mix cooked quinoa with remaining olive oil, lemon zest, garlic, and parsley.",
      "Serve grilled salmon over quinoa, accompanied by steamed broccoli and cherry tomatoes."
    ],
    nutritionalInfo: {
      calories: 520,
      protein: "28g",
      carbohydrates: "45g",
      fat: "24g",
      fiber: "8g",
      sugar: "12g",
      sodium: "580mg",
      calcium: "120mg",
      iron: "3mg",
      vitaminC: "30mg"
    },
    healthBenefits: [
      "High in omega-3 fatty acids for brain and heart health",
      "Complete protein supports muscle maintenance",
      "Rich in antioxidants from colorful vegetables",
      "Healthy fats from avocado support hormone production",
      "Complex carbohydrates provide sustained energy"
    ],
    symptomsHelped: [
      "Brain fog",
      "Inflammation",
      "Heart health concerns",
      "Joint pain",
      "Energy fluctuations",
      "Mood changes"
    ],
    keyNutrients: [
      "Omega-3 fatty acids",
      "High-quality protein",
      "Healthy monounsaturated fats",
      "Complex carbohydrates",
      "Vitamin D",
      "B-vitamins"
    ],
    tags: ["High Protein", "Omega-3 Rich", "Brain Healthy", "Anti-inflammatory", "Heart Healthy"]
  },

  "greek-yogurt-with-berries-and-flaxseeds": {
    id: "greek-yogurt-with-berries-and-flaxseeds",
    name: "Apple with Almond Butter",
    slug: "greek-yogurt-with-berries-and-flaxseeds",
    description: "A satisfying and nutritious snack combining fiber-rich apple with protein-packed almond butter to support stable energy levels and heart health.",
    image: mealImageMapping["Greek Yogurt with Berries and Flaxseeds"]?.header || "/assets/images/meals/real/greek-yogurt-with-berries-large.jpg",
    thumbnail: mealImageMapping["Greek Yogurt with Berries and Flaxseeds"]?.thumbnail || "/assets/images/meals/real/greek-yogurt-with-berries.jpg",
    alt: "Apple with Almond Butter",
    prepTime: "3 minutes",
    cookTime: "0 minutes",
    servings: 1,
    difficulty: "Easy",
    mealType: "Snack",
    ingredients: [
      "1 medium apple (Honeycrisp or Granny Smith)",
      "2 tablespoons natural almond butter",
      "1/2 teaspoon cinnamon",
      "1 teaspoon honey (optional)",
      "1 tablespoon chopped almonds (optional)"
    ],
    instructions: [
      "Wash and core the apple, then slice into 8-10 wedges.",
      "Arrange apple slices on a plate.",
      "Serve with almond butter for dipping.",
      "Sprinkle with cinnamon for extra flavor.",
      "Drizzle with honey if desired for added sweetness.",
      "Garnish with chopped almonds if using."
    ],
    nutritionalInfo: {
      calories: 280,
      protein: "8g",
      carbohydrates: "25g",
      fat: "16g",
      fiber: "7g",
      sugar: "19g",
      sodium: "2mg",
      calcium: "80mg",
      iron: "1mg",
      vitaminC: "8mg"
    },
    healthBenefits: [
      "High fiber content supports digestive health and satiety",
      "Healthy fats from almonds support heart health",
      "Natural sugars provide quick energy without crashes",
      "Vitamin E from almonds acts as an antioxidant",
      "Potassium from apple supports heart function"
    ],
    symptomsHelped: [
      "Energy crashes",
      "Cravings",
      "Heart health concerns",
      "Digestive issues",
      "Blood sugar fluctuations"
    ],
    keyNutrients: [
      "Fiber",
      "Healthy monounsaturated fats",
      "Vitamin E",
      "Potassium",
      "Protein",
      "Antioxidants"
    ],
    tags: ["Heart Healthy", "High Fiber", "Natural Energy", "Quick & Easy", "Blood Sugar Friendly"]
  }
};

// Function to get meal by slug
export const getMealBySlug = (slug) => {
  return detailedMealsData[slug] || null;
};

// Function to get all meals
export const getAllMeals = () => {
  return Object.values(detailedMealsData);
};

// Function to get meals by type
export const getMealsByType = (mealType) => {
  return Object.values(detailedMealsData).filter(meal => 
    meal.mealType.toLowerCase() === mealType.toLowerCase()
  );
};

// Function to get meals that help with specific symptoms
export const getMealsForSymptoms = (symptoms) => {
  if (!symptoms || symptoms.length === 0) return [];
  
  return Object.values(detailedMealsData).filter(meal =>
    meal.symptomsHelped.some(symptom =>
      symptoms.some(userSymptom =>
        symptom.toLowerCase().includes(userSymptom.toLowerCase()) ||
        userSymptom.toLowerCase().includes(symptom.toLowerCase())
      )
    )
  );
};

export default detailedMealsData;