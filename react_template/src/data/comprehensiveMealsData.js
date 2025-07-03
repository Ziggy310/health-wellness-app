// src/data/comprehensiveMealsData.js
import mealImageMapping from '../../public/data/mealImageMap.json';

// Comprehensive meal data with 21 unique meals for a full week
// Properly categorized by dietary preferences: vegan, vegetarian, omnivore
export const comprehensiveMealsData = {
  // MONDAY MEALS
  "overnight-oats-berries": {
    id: "overnight-oats-berries",
    name: "Overnight Oats with Berries",
    slug: "overnight-oats-berries",
    description: "Creamy overnight oats topped with fresh berries and chia seeds for sustained energy.",
    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    thumbnail: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    alt: "Overnight Oats with Berries",
    prepTime: "5 minutes (+ overnight)",
    cookTime: "0 minutes",
    servings: 1,
    difficulty: "Easy",
    mealType: "Breakfast",
    dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"],
    ingredients: [
      "1/2 cup rolled oats",
      "1/2 cup oat milk",
      "1 tablespoon chia seeds",
      "1 tablespoon maple syrup",
      "1/2 cup mixed berries",
      "1 tablespoon sunflower seed butter",
      "1/4 teaspoon vanilla extract"
    ],
    instructions: [
      "Mix oats, oat milk, chia seeds, maple syrup, and vanilla in a jar.",
      "Refrigerate overnight.",
      "Top with berries and sunflower seed butter before serving."
    ],
    nutritionalInfo: {
      calories: 340,
      protein: "12g",
      carbohydrates: "52g",
      fat: "12g",
      fiber: "12g",
      sugar: "18g",
      sodium: "45mg",
      calcium: "180mg",
      iron: "3mg",
      vitaminC: "8mg"
    },
    healthBenefits: [
      "High fiber supports digestive health",
      "Antioxidants from berries fight inflammation",
      "Plant-based protein supports muscle health"
    ],
    symptomsHelped: ["Digestive issues", "Energy fluctuations", "Heart health"],
    keyNutrients: [
      "Fiber",
      "Antioxidants",
      "Plant protein",
      "Omega-3 fatty acids",
      "Magnesium"
    ],
    tags: ["Vegan", "High Fiber", "Quick & Easy", "Antioxidant Rich", "Heart Healthy"]
  },

  "simple-chickpea-bowl": {
    id: "simple-chickpea-bowl",
    name: "Simple Chickpea Quinoa Bowl",
    slug: "simple-chickpea-bowl",
    description: "Mild and gentle chickpeas with quinoa and fresh vegetables - perfect for sensitive palates.",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    thumbnail: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    alt: "Simple Chickpea Quinoa Bowl",
    prepTime: "15 minutes",
    cookTime: "20 minutes",
    servings: 2,
    difficulty: "Easy",
    mealType: "Lunch",
    dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free", "mild", "bland"],
    ingredients: [
      "1 cup cooked quinoa",
      "1 can chickpeas, drained",
      "1 onion, diced",
      "2 cloves garlic, minced",
      "1 can diced tomatoes",
      "1 cup spinach",
      "2 tbsp olive oil",
      "Salt to taste",
      "1 tbsp lemon juice"
    ],
    instructions: [
      "Heat olive oil in a pan, sauté onion and garlic gently.",
      "Add tomatoes and chickpeas, simmer 15 minutes.",
      "Stir in spinach until wilted.",
      "Season with salt and lemon juice.",
      "Serve over quinoa."
    ],
    nutritionalInfo: {
      calories: 380,
      protein: "16g",
      carbohydrates: "62g",
      fat: "10g",
      fiber: "14g",
      sugar: "10g",
      sodium: "280mg",
      calcium: "110mg",
      iron: "5mg",
      vitaminC: "12mg"
    },
    healthBenefits: [
      "High protein supports muscle maintenance",
      "Gentle on digestive system",
      "Iron from chickpeas supports energy levels"
    ],
    symptomsHelped: ["Digestive sensitivity", "Energy fluctuations", "Gentle nutrition"],
    keyNutrients: [
      "Plant protein",
      "Iron",
      "Fiber",
      "Folate",
      "Magnesium"
    ],
    tags: ["Vegan", "High Protein", "Gentle", "Iron Rich", "Gluten-free", "Mild"]
  },

  "lentil-mushroom-bolognese": {
    id: "lentil-mushroom-bolognese",
    name: "Lentil Mushroom Bolognese",
    slug: "lentil-mushroom-bolognese",
    description: "Rich and hearty plant-based bolognese with lentils and mushrooms over whole grain pasta - completely nut-free.",
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    thumbnail: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    alt: "Lentil Mushroom Bolognese",
    prepTime: "20 minutes",
    cookTime: "30 minutes",
    servings: 4,
    difficulty: "Medium",
    mealType: "Dinner",
    dietaryTags: ["vegan", "vegetarian", "dairy-free", "nut-free"],
    ingredients: [
      "1 cup green lentils",
      "1/2 cup mushrooms, finely chopped",
      "1 onion, diced",
      "2 carrots, diced",
      "2 celery stalks, diced",
      "3 cloves garlic, minced",
      "1 can crushed tomatoes",
      "2 tbsp tomato paste",
      "1 tsp oregano",
      "1 tsp basil",
      "2 tbsp olive oil",
      "8 oz whole grain pasta"
    ],
    instructions: [
      "Cook lentils according to package directions.",
      "Heat olive oil, sauté vegetables and mushrooms until soft.",
      "Add garlic, cook 1 minute.",
      "Add tomato paste, herbs, crushed tomatoes.",
      "Stir in cooked lentils.",
      "Simmer 15 minutes, serve over pasta."
    ],
    nutritionalInfo: {
      calories: 480,
      protein: "20g",
      carbohydrates: "72g",
      fat: "14g",
      fiber: "18g",
      sugar: "12g",
      sodium: "320mg",
      calcium: "90mg",
      iron: "8mg",
      vitaminC: "12mg"
    },
    healthBenefits: [
      "High fiber supports digestive health",
      "Plant protein supports muscle health",
      "Mushrooms provide immune-boosting compounds"
    ],
    symptomsHelped: ["Immune support", "Digestive issues", "Heart health"],
    keyNutrients: [
      "Plant protein",
      "Fiber",
      "Selenium",
      "Iron",
      "Folate"
    ],
    tags: ["Vegan", "Nut-Free", "High Protein", "High Fiber", "Heart Healthy"]
  },

  // TUESDAY MEALS
  "green-smoothie-bowl": {
    id: "green-smoothie-bowl",
    name: "Green Goddess Smoothie Bowl",
    slug: "green-smoothie-bowl",
    description: "Nutrient-dense green smoothie bowl topped with fresh fruits and seeds.",
    image: "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    thumbnail: "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    alt: "Green Goddess Smoothie Bowl",
    prepTime: "10 minutes",
    cookTime: "0 minutes",
    servings: 1,
    difficulty: "Easy",
    mealType: "Breakfast",
    dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"],
    ingredients: [
      "1 frozen banana",
      "1 cup spinach",
      "1/2 avocado",
      "1/2 cup coconut milk",
      "1 tbsp sunflower seed butter",
      "1 tsp spirulina powder",
      "1 tbsp hemp seeds",
      "1/4 cup blueberries",
      "1 tbsp coconut flakes"
    ],
    instructions: [
      "Blend banana, spinach, avocado, coconut milk, sunflower seed butter, and spirulina.",
      "Pour into bowl.",
      "Top with hemp seeds, blueberries, and coconut flakes."
    ],
    nutritionalInfo: {
      calories: 380,
      protein: "14g",
      carbohydrates: "35g",
      fat: "22g",
      fiber: "12g",
      sugar: "20g",
      sodium: "85mg"
    },
    healthBenefits: [
      "Detoxifying chlorophyll supports liver health",
      "Healthy fats support hormone production",
      "Antioxidants fight cellular damage"
    ],
    symptomsHelped: ["Energy fluctuations", "Inflammation", "Hormonal balance"],
    keyNutrients: [
      "Chlorophyll",
      "Healthy fats",
      "Antioxidants",
      "Fiber",
      "Spirulina"
    ],
    tags: ["Vegan", "Detoxifying", "Antioxidant Rich", "Hormone Support", "Energy Boosting"]
  },

  "mediterranean-stuffed-peppers": {
    id: "mediterranean-stuffed-peppers",
    name: "Mediterranean Stuffed Bell Peppers",
    slug: "mediterranean-stuffed-peppers",
    description: "Colorful bell peppers stuffed with quinoa, vegetables, and fresh herbs - completely dairy-free and nut-free.",
    image: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    thumbnail: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    alt: "Mediterranean Stuffed Bell Peppers",
    prepTime: "20 minutes",
    cookTime: "35 minutes",
    servings: 4,
    difficulty: "Medium",
    mealType: "Lunch",
    dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free", "nut-free"],
    ingredients: [
      "4 bell peppers, tops cut and seeds removed",
      "1 cup cooked quinoa",
      "1/2 cup nutritional yeast",
      "1/2 cup sun-dried tomatoes, chopped",
      "1/4 cup sunflower seeds",
      "2 tbsp fresh basil, chopped",
      "2 tbsp olive oil",
      "1 clove garlic, minced",
      "Salt and pepper to taste"
    ],
    instructions: [
      "Preheat oven to 375°F.",
      "Mix quinoa, nutritional yeast, sun-dried tomatoes, sunflower seeds, basil, garlic, and olive oil.",
      "Stuff peppers with mixture.",
      "Bake 30-35 minutes until peppers are tender.",
      "Season with salt and pepper before serving."
    ],
    nutritionalInfo: {
      calories: 320,
      protein: "12g",
      carbohydrates: "38g",
      fat: "15g",
      fiber: "8g",
      sugar: "12g",
      sodium: "380mg"
    },
    healthBenefits: [
      "Vitamin C from peppers supports immune function",
      "B-vitamins from nutritional yeast support energy metabolism",
      "Healthy fats from sunflower seeds support heart health"
    ],
    symptomsHelped: ["Energy fluctuations", "Immune support", "Heart health"],
    keyNutrients: [
      "Vitamin C",
      "B-vitamins",
      "Healthy fats",
      "Plant protein",
      "Antioxidants"
    ],
    tags: ["Vegan", "Mediterranean", "Nut-Free", "Dairy-Free", "Immune Support"]
  },

  "mushroom-barley-risotto": {
    id: "mushroom-barley-risotto",
    name: "Mushroom Barley Risotto",
    slug: "mushroom-barley-risotto",
    description: "Hearty dairy-free risotto made with pearl barley and mixed mushrooms - no dairy ingredients.",
    image: "https://images.unsplash.com/photo-1604152135912-04a022e23696?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    thumbnail: "https://images.unsplash.com/photo-1604152135912-04a022e23696?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    alt: "Mushroom Barley Risotto",
    prepTime: "15 minutes",
    cookTime: "45 minutes",
    servings: 4,
    difficulty: "Medium",
    mealType: "Dinner",
    dietaryTags: ["vegan", "vegetarian", "dairy-free", "nut-free"],
    ingredients: [
      "1 cup pearl barley",
      "4 cups vegetable broth",
      "2 cups mixed mushrooms, sliced",
      "1 onion, diced",
      "2 cloves garlic, minced",
      "1/2 cup white wine",
      "1/2 cup nutritional yeast",
      "2 tbsp vegan butter",
      "2 tbsp olive oil",
      "Fresh thyme and parsley"
    ],
    instructions: [
      "Heat broth in a separate pot.",
      "Sauté mushrooms in olive oil until golden, set aside.",
      "Sauté onion and garlic in vegan butter.",
      "Add barley, stir 2 minutes.",
      "Add wine, then hot broth one ladle at a time, stirring constantly.",
      "Cook 35-40 minutes until creamy.",
      "Stir in mushrooms, nutritional yeast, and herbs."
    ],
    nutritionalInfo: {
      calories: 380,
      protein: "14g",
      carbohydrates: "58g",
      fat: "12g",
      fiber: "10g",
      sugar: "6g",
      sodium: "680mg"
    },
    healthBenefits: [
      "Beta-glucan from barley supports heart health",
      "Mushrooms provide immune-boosting compounds",
      "High fiber supports digestive health"
    ],
    symptomsHelped: ["Heart health", "Immune support", "Digestive issues"],
    keyNutrients: [
      "Beta-glucan",
      "Selenium",
      "Fiber",
      "B-vitamins",
      "Potassium"
    ],
    tags: ["Vegetarian", "Heart Healthy", "High Fiber", "Immune Support", "Comfort Food"]
  },

  // WEDNESDAY MEALS
  "chia-pudding-mango": {
    id: "chia-pudding-mango",
    name: "Tropical Chia Pudding",
    slug: "chia-pudding-mango",
    description: "Creamy chia pudding with tropical mango and coconut flavors.",
    image: "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    thumbnail: "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    alt: "Tropical Chia Pudding",
    prepTime: "10 minutes (+ 4 hours chilling)",
    cookTime: "0 minutes",
    servings: 2,
    difficulty: "Easy",
    mealType: "Breakfast",
    dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"],
    ingredients: [
      "1/4 cup chia seeds",
      "1 cup coconut milk",
      "2 tbsp maple syrup",
      "1/2 tsp vanilla extract",
      "1 ripe mango, diced",
      "2 tbsp coconut flakes",
      "1 tbsp lime juice"
    ],
    instructions: [
      "Mix chia seeds, coconut milk, maple syrup, and vanilla.",
      "Refrigerate 4 hours or overnight.",
      "Top with mango, coconut flakes, and lime juice."
    ],
    nutritionalInfo: {
      calories: 320,
      protein: "8g",
      carbohydrates: "35g",
      fat: "18g",
      fiber: "12g",
      sugar: "25g",
      sodium: "15mg"
    },
    healthBenefits: [
      "Omega-3 fatty acids support brain health",
      "High fiber supports digestive health",
      "Vitamin C from mango supports immune function"
    ],
    symptomsHelped: ["Brain fog", "Digestive issues", "Immune support"],
    keyNutrients: [
      "Omega-3 fatty acids",
      "Fiber",
      "Vitamin C",
      "Calcium",
      "Antioxidants"
    ],
    tags: ["Vegan", "Brain Healthy", "High Fiber", "Tropical", "Make-ahead"]
  },

  "rainbow-buddha-bowl": {
    id: "rainbow-buddha-bowl",
    name: "Rainbow Buddha Bowl",
    slug: "rainbow-buddha-bowl",
    description: "Colorful bowl with roasted vegetables, quinoa, and tahini dressing.",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    thumbnail: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    alt: "Rainbow Buddha Bowl",
    prepTime: "20 minutes",
    cookTime: "25 minutes",
    servings: 2,
    difficulty: "Medium",
    mealType: "Lunch",
    dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"],
    ingredients: [
      "1 cup cooked quinoa",
      "1 sweet potato, cubed and roasted",
      "1 cup broccoli florets",
      "1 red bell pepper, sliced",
      "1 cup chickpeas, roasted",
      "2 tbsp tahini",
      "1 tbsp lemon juice",
      "1 tsp maple syrup",
      "2 tbsp olive oil",
      "Pumpkin seeds for garnish"
    ],
    instructions: [
      "Roast sweet potato and chickpeas at 400°F for 20 minutes.",
      "Steam broccoli until tender-crisp.",
      "Arrange quinoa, vegetables, and chickpeas in bowls.",
      "Whisk tahini, lemon juice, maple syrup, and olive oil for dressing.",
      "Drizzle with dressing and garnish with pumpkin seeds."
    ],
    nutritionalInfo: {
      calories: 450,
      protein: "18g",
      carbohydrates: "65g",
      fat: "16g",
      fiber: "14g",
      sugar: "18g",
      sodium: "280mg"
    },
    healthBenefits: [
      "Beta-carotene from sweet potato supports eye health",
      "Complete protein from quinoa supports muscle health",
      "Fiber-rich vegetables support digestive health"
    ],
    symptomsHelped: ["Eye health", "Digestive issues", "Energy fluctuations"],
    keyNutrients: [
      "Beta-carotene",
      "Complete protein",
      "Fiber",
      "Vitamin A",
      "Antioxidants"
    ],
    tags: ["Vegan", "Rainbow Colors", "High Protein", "Eye Health", "Nutrient Dense"]
  },

  "stuffed-sweet-potatoes": {
    id: "stuffed-sweet-potatoes",
    name: "Black Bean Stuffed Sweet Potatoes",
    slug: "stuffed-sweet-potatoes",
    description: "Roasted sweet potatoes stuffed with spiced black beans and fresh toppings.",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    thumbnail: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    alt: "Black Bean Stuffed Sweet Potatoes",
    prepTime: "15 minutes",
    cookTime: "45 minutes",
    servings: 4,
    difficulty: "Easy",
    mealType: "Dinner",
    dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"],
    ingredients: [
      "4 large sweet potatoes",
      "1 can black beans, drained and rinsed",
      "1 bell pepper, diced",
      "1/2 red onion, diced",
      "1 tsp cumin",
      "1/2 tsp smoked paprika",
      "1 avocado, diced",
      "1/4 cup cilantro, chopped",
      "2 tbsp lime juice",
      "2 tbsp olive oil"
    ],
    instructions: [
      "Bake sweet potatoes at 400°F for 45 minutes.",
      "Sauté onion and bell pepper in olive oil.",
      "Add black beans, cumin, and paprika, cook 5 minutes.",
      "Cut open sweet potatoes, fluff flesh.",
      "Top with black bean mixture, avocado, cilantro, and lime juice."
    ],
    nutritionalInfo: {
      calories: 380,
      protein: "12g",
      carbohydrates: "65g",
      fat: "10g",
      fiber: "15g",
      sugar: "18g",
      sodium: "320mg"
    },
    healthBenefits: [
      "Beta-carotene supports eye health",
      "High fiber supports digestive health",
      "Plant protein supports muscle health"
    ],
    symptomsHelped: ["Digestive issues", "Eye health", "Energy fluctuations"],
    keyNutrients: [
      "Beta-carotene",
      "Plant protein",
      "Fiber",
      "Potassium",
      "Folate"
    ],
    tags: ["Vegan", "High Fiber", "Eye Health", "Plant Protein", "Comfort Food"]
  },

  // SNACK MEALS
  "apple-slices": {
    id: "apple-slices",
    name: "Apple Slices",
    slug: "apple-slices",
    description: "Fresh apple slices - naturally safe and refreshing for everyone.",
    image: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    thumbnail: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    alt: "Apple Slices",
    prepTime: "2 minutes",
    cookTime: "0 minutes",
    servings: 1,
    difficulty: "Easy",
    mealType: "Snack",
    dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free", "nut-free"],
    ingredients: [
      "1 medium apple, sliced",
      "Optional: cinnamon"
    ],
    instructions: [
      "Wash and slice apple into wedges.",
      "Sprinkle with cinnamon if desired."
    ],
    nutritionalInfo: {
      calories: 95,
      protein: "0g",
      carbohydrates: "25g",
      fat: "0g",
      fiber: "4g",
      sugar: "19g",
      sodium: "2mg",
      calcium: "6mg",
      iron: "0mg",
      vitaminC: "8mg"
    },
    healthBenefits: [
      "High fiber supports digestive health",
      "Natural sugars provide quick energy",
      "Antioxidants support overall health"
    ],
    symptomsHelped: ["Sweet cravings", "Energy fluctuations", "Digestive issues"],
    keyNutrients: [
      "Fiber",
      "Vitamin C",
      "Natural sugars",
      "Antioxidants",
      "Potassium"
    ],
    tags: ["Vegan", "Nut-Free", "Natural", "Quick Snack", "Safe"]
  },

  "hummus-veggies": {
    id: "hummus-veggies",
    name: "Hummus and Veggies",
    slug: "hummus-veggies",
    description: "Fresh vegetables served with creamy hummus for a satisfying and nutritious snack.",
    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    thumbnail: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    alt: "Hummus and Veggies",
    prepTime: "5 minutes",
    cookTime: "0 minutes",
    servings: 1,
    difficulty: "Easy",
    mealType: "Snack",
    dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"],
    ingredients: [
      "1/4 cup hummus",
      "1 carrot, cut into sticks",
      "1 cucumber, sliced",
      "1/2 bell pepper, sliced",
      "5 cherry tomatoes"
    ],
    instructions: [
      "Wash and cut vegetables into bite-sized pieces.",
      "Serve with hummus for dipping."
    ],
    nutritionalInfo: {
      calories: 150,
      protein: "6g",
      carbohydrates: "18g",
      fat: "6g",
      fiber: "6g",
      sugar: "8g",
      sodium: "240mg",
      calcium: "60mg",
      iron: "2mg",
      vitaminC: "45mg"
    },
    healthBenefits: [
      "High fiber supports digestive health",
      "Vitamin C boosts immune system",
      "Plant protein provides sustained energy"
    ],
    symptomsHelped: ["Digestive issues", "Immune support", "Energy fluctuations"],
    keyNutrients: [
      "Fiber",
      "Vitamin C",
      "Plant protein",
      "Beta-carotene",
      "Folate"
    ],
    tags: ["Vegan", "High Fiber", "Immune Support", "Fresh", "Low Calorie"]
  },

  "seed-mix": {
    id: "seed-mix",
    name: "Seed Mix",
    slug: "seed-mix",
    description: "Energy-packed mix of seeds and dried fruits - completely nut-free and safe.",
    image: "https://images.unsplash.com/photo-1609501676725-7186f467e4c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    thumbnail: "https://images.unsplash.com/photo-1609501676725-7186f467e4c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    alt: "Seed Mix",
    prepTime: "2 minutes",
    cookTime: "0 minutes",
    servings: 1,
    difficulty: "Easy",
    mealType: "Snack",
    dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free", "nut-free"],
    ingredients: [
      "2 tbsp pumpkin seeds",
      "1 tbsp sunflower seeds",
      "1 tbsp dried cranberries",
      "1 tbsp dark chocolate chips",
      "1 tbsp coconut flakes"
    ],
    instructions: [
      "Mix all ingredients in a small bowl.",
      "Enjoy as an energy-boosting snack."
    ],
    nutritionalInfo: {
      calories: 180,
      protein: "5g",
      carbohydrates: "14g",
      fat: "12g",
      fiber: "3g",
      sugar: "10g",
      sodium: "5mg",
      calcium: "25mg",
      iron: "2mg",
      vitaminC: "1mg"
    },
    healthBenefits: [
      "Antioxidants from dark chocolate support heart health",
      "Healthy fats provide sustained energy",
      "Natural sugars offer quick energy boost"
    ],
    symptomsHelped: ["Energy fluctuations", "Sweet cravings", "Pre-workout fuel"],
    keyNutrients: [
      "Healthy fats",
      "Antioxidants",
      "Fiber",
      "Magnesium",
      "Natural sugars"
    ],
    tags: ["Vegan", "Nut-Free", "Energy Boosting", "Antioxidant Rich", "Safe"]
  },

  "date-seed-balls": {
    id: "date-seed-balls",
    name: "Date Seed Energy Balls",
    slug: "date-seed-balls",
    description: "No-bake energy balls made with dates and seeds - completely nut-free and safe.",
    image: "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    thumbnail: "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    alt: "Date Seed Energy Balls",
    prepTime: "15 minutes",
    cookTime: "0 minutes",
    servings: 3,
    difficulty: "Easy",
    mealType: "Snack",
    dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free", "nut-free"],
    ingredients: [
      "6 Medjool dates, pitted",
      "1/4 cup sunflower seeds",
      "2 tbsp chia seeds",
      "1 tbsp cocoa powder",
      "1 tbsp coconut oil",
      "1 tsp vanilla extract"
    ],
    instructions: [
      "Process dates in food processor until paste forms.",
      "Add sunflower seeds, chia seeds, cocoa powder, coconut oil, and vanilla.",
      "Process until mixture holds together.",
      "Roll into 6 balls and refrigerate 30 minutes."
    ],
    nutritionalInfo: {
      calories: 145,
      protein: "3g",
      carbohydrates: "22g",
      fat: "6g",
      fiber: "4g",
      sugar: "16g",
      sodium: "2mg",
      calcium: "35mg",
      iron: "1mg",
      vitaminC: "0mg"
    },
    healthBenefits: [
      "Natural sugars provide quick energy",
      "Fiber helps stabilize blood sugar",
      "Antioxidants from cocoa support heart health"
    ],
    symptomsHelped: ["Energy fluctuations", "Sweet cravings", "Pre-workout fuel"],
    keyNutrients: [
      "Natural sugars",
      "Fiber",
      "Healthy fats",
      "Antioxidants",
      "Omega-3s"
    ],
    tags: ["Vegan", "Nut-Free", "No-Bake", "Energy Boosting", "Safe"]
  },

  "coconut-yogurt": {
    id: "coconut-yogurt",
    name: "Coconut Yogurt",
    slug: "coconut-yogurt",
    description: "Creamy coconut yogurt topped with fresh berries and a drizzle of honey.",
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    thumbnail: "https://images.unsplash.com/photo-1488477181946-6428a0291777?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    alt: "Coconut Yogurt",
    prepTime: "3 minutes",
    cookTime: "0 minutes",
    servings: 1,
    difficulty: "Easy",
    mealType: "Snack",
    dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"],
    ingredients: [
      "1/2 cup coconut yogurt",
      "1/4 cup mixed berries",
      "1 tbsp maple syrup",
      "1 tbsp granola (optional)",
      "1 tsp coconut flakes"
    ],
    instructions: [
      "Place coconut yogurt in a bowl.",
      "Top with berries, maple syrup, granola, and coconut flakes."
    ],
    nutritionalInfo: {
      calories: 140,
      protein: "3g",
      carbohydrates: "20g",
      fat: "6g",
      fiber: "4g",
      sugar: "16g",
      sodium: "10mg",
      calcium: "100mg",
      iron: "1mg",
      vitaminC: "12mg"
    },
    healthBenefits: [
      "Probiotics support digestive health",
      "Antioxidants from berries fight inflammation",
      "Calcium supports bone health"
    ],
    symptomsHelped: ["Digestive issues", "Sweet cravings", "Bone health"],
    keyNutrients: [
      "Probiotics",
      "Antioxidants",
      "Calcium",
      "Vitamin C",
      "Healthy fats"
    ],
    tags: ["Vegan", "Probiotic", "Antioxidant Rich", "Bone Health", "Refreshing"]
  },

  "fruit-salad": {
    id: "fruit-salad",
    name: "Fruit Salad",
    slug: "fruit-salad",
    description: "Fresh seasonal fruit salad with a hint of lime and mint for natural sweetness.",
    image: "https://images.unsplash.com/photo-1546173159-315724a31696?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    thumbnail: "https://images.unsplash.com/photo-1546173159-315724a31696?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    alt: "Fruit Salad",
    prepTime: "10 minutes",
    cookTime: "0 minutes",
    servings: 2,
    difficulty: "Easy",
    mealType: "Snack",
    dietaryTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"],
    ingredients: [
      "1 apple, diced",
      "1 banana, sliced",
      "1/2 cup strawberries, hulled and halved",
      "1/2 cup grapes, halved",
      "1 tbsp lime juice",
      "1 tbsp fresh mint, chopped"
    ],
    instructions: [
      "Wash and prepare all fruits.",
      "Combine fruits in a large bowl.",
      "Drizzle with lime juice and toss gently.",
      "Garnish with fresh mint before serving."
    ],
    nutritionalInfo: {
      calories: 120,
      protein: "1g",
      carbohydrates: "30g",
      fat: "0g",
      fiber: "5g",
      sugar: "24g",
      sodium: "2mg",
      calcium: "20mg",
      iron: "0mg",
      vitaminC: "60mg"
    },
    healthBenefits: [
      "High vitamin C supports immune function",
      "Natural sugars provide quick energy",
      "Fiber supports digestive health"
    ],
    symptomsHelped: ["Immune support", "Energy fluctuations", "Sweet cravings"],
    keyNutrients: [
      "Vitamin C",
      "Fiber",
      "Natural sugars",
      "Antioxidants",
      "Potassium"
    ],
    tags: ["Vegan", "High Vitamin C", "Natural Sugars", "Refreshing", "Low Calorie"]
  }
};

// Function to get meal by slug
export const getMealBySlug = (slug) => {
  return comprehensiveMealsData[slug] || null;
};

// Function to get all meals
export const getAllMeals = () => {
  return Object.values(comprehensiveMealsData);
};

// Function to get meals by dietary preference
export const getMealsByDietaryPreference = (dietaryPreference) => {
  return Object.values(comprehensiveMealsData).filter(meal => 
    meal.dietaryTags.includes(dietaryPreference.toLowerCase())
  );
};

// Function to get meals by type
export const getMealsByType = (mealType) => {
  return Object.values(comprehensiveMealsData).filter(meal => 
    meal.mealType.toLowerCase() === mealType.toLowerCase()
  );
};

export default comprehensiveMealsData;