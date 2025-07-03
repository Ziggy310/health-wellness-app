// Recipe-related utility functions and mock data
import { PostTopic } from './types';

// Sample recipes data for the app
export const sampleRecipes = [
  {
    id: '1',
    userId: 'user1',
    authorName: 'Emily Johnson',
    authorAvatar: '/assets/images/avatar1.jpg',
    title: 'Anti-inflammatory Berry Smoothie',
    description: 'This smoothie helps reduce hot flashes and provides antioxidant support.',
    image: '/assets/images/berry-smoothie.jpg',
    ingredients: [
      '1 cup mixed berries (blueberries, strawberries, raspberries)',
      '1 tablespoon ground flaxseed',
      '1 cup unsweetened almond milk',
      '1/2 teaspoon turmeric powder',
      'Small piece of ginger',
      '1 tablespoon honey (optional)'
    ],
    instructions: 'Blend all ingredients until smooth. Serve immediately for best results.',
    prepTime: '5 minutes',
    symptoms: ['Hot flashes', 'Inflammation'],
    nutrients: ['Antioxidants', 'Omega-3 fatty acids'],
    likes: 24,
    comments: 5,
    createdAt: '2023-08-12T14:30:00Z'
  },
  {
    id: '2',
    userId: 'user2',
    authorName: 'Lauren Smith',
    authorAvatar: '/assets/images/avatar2.jpg',
    title: 'Magnesium-Rich Sleep-Support Salad',
    description: 'This evening salad contains ingredients that support better sleep and reduced night sweats.',
    image: '/assets/images/sleep-salad.jpg',
    ingredients: [
      '2 cups spinach',
      '1/4 cup pumpkin seeds',
      '1/2 avocado, sliced',
      '1/4 cup chickpeas, cooked',
      '1 tablespoon olive oil',
      '1 teaspoon lemon juice',
      'Salt and pepper to taste'
    ],
    instructions: 'Combine all ingredients in a bowl. Drizzle with olive oil and lemon juice, then toss well.',
    prepTime: '10 minutes',
    symptoms: ['Sleep disturbances', 'Night sweats'],
    nutrients: ['Magnesium', 'Healthy fats', 'Protein'],
    likes: 18,
    comments: 3,
    createdAt: '2023-09-05T18:45:00Z'
  },
  {
    id: '3',
    userId: 'user3',
    authorName: 'Maria Garcia',
    authorAvatar: '/assets/images/avatar3.jpg',
    title: 'Phytoestrogen-Rich Breakfast Bowl',
    description: 'Support hormonal balance with this nourishing breakfast bowl rich in phytoestrogens.',
    image: '/assets/images/breakfast-bowl.jpg',
    ingredients: [
      '1/2 cup cooked quinoa',
      '1/4 cup edamame, shelled',
      '2 tablespoons ground flaxseed',
      '1/4 cup fresh berries',
      '1 tablespoon sliced almonds',
      '1/2 cup unsweetened almond milk',
      '1/2 teaspoon cinnamon'
    ],
    instructions: 'Mix cooked quinoa with almond milk and cinnamon. Top with edamame, flaxseed, berries, and almonds.',
    prepTime: '15 minutes',
    symptoms: ['Hormonal fluctuations', 'Mood changes'],
    nutrients: ['Phytoestrogens', 'Protein', 'Fiber'],
    likes: 31,
    comments: 7,
    createdAt: '2023-07-22T08:10:00Z'
  },
  {
    id: '4',
    userId: 'user4',
    authorName: 'Sarah Wynters',
    authorAvatar: '/assets/images/avatar4.jpg',
    title: 'Cooling Cucumber Mint Water',
    description: 'A refreshing drink that helps cool the body during hot flashes and supports hydration.',
    image: '/assets/images/cucumber-water.jpg',
    ingredients: [
      '1 cucumber, thinly sliced',
      '10 fresh mint leaves',
      '1 lemon, thinly sliced',
      '8 cups filtered water',
      'Ice cubes'
    ],
    instructions: 'Combine all ingredients in a large pitcher. Refrigerate for at least 2 hours to allow flavors to infuse.',
    prepTime: '5 minutes (plus infusing time)',
    symptoms: ['Hot flashes', 'Dehydration'],
    nutrients: ['Electrolytes', 'Antioxidants'],
    likes: 15,
    comments: 2,
    createdAt: '2023-10-01T11:25:00Z'
  },
  {
    id: '5',
    userId: 'user5',
    authorName: 'Rachel Thompson',
    authorAvatar: '/assets/images/avatar5.jpg',
    title: 'Calcium-Boosting Green Smoothie',
    description: 'Support bone health with this calcium-rich smoothie that tastes delicious.',
    image: '/assets/images/green-smoothie.jpg',
    ingredients: [
      '1 cup kale leaves, stems removed',
      '1 cup unsweetened fortified almond milk',
      '1/2 cup Greek yogurt',
      '1 tablespoon chia seeds',
      '1/2 banana',
      '1/2 cup frozen mango chunks',
      '1/2 teaspoon vanilla extract'
    ],
    instructions: 'Add all ingredients to a blender and blend until smooth and creamy. Adjust consistency with water if needed.',
    prepTime: '7 minutes',
    symptoms: ['Bone density concerns', 'Fatigue'],
    nutrients: ['Calcium', 'Vitamin D', 'Protein'],
    likes: 27,
    comments: 9,
    createdAt: '2023-09-18T15:40:00Z'
  }
];

// Function to filter recipes by symptom
export const filterRecipesBySymptom = (recipes, symptom) => {
  if (!symptom) return recipes;
  return recipes.filter(recipe => 
    recipe.symptoms.some(s => s.toLowerCase().includes(symptom.toLowerCase()))
  );
};

// Function to filter recipes by nutrient
export const filterRecipesByNutrient = (recipes, nutrient) => {
  if (!nutrient) return recipes;
  return recipes.filter(recipe => 
    recipe.nutrients.some(n => n.toLowerCase().includes(nutrient.toLowerCase()))
  );
};

// Function to get personalized recipe recommendations based on user symptoms
export const getPersonalizedRecipes = (recipes, userSymptoms) => {
  if (!userSymptoms || userSymptoms.length === 0) return recipes;
  
  return recipes
    .map(recipe => {
      // Calculate relevance score based on how many of the user's symptoms this recipe addresses
      const matchedSymptoms = recipe.symptoms.filter(symptom => 
        userSymptoms.some(userSymptom => 
          userSymptom.toLowerCase().includes(symptom.toLowerCase()) ||
          symptom.toLowerCase().includes(userSymptom.toLowerCase())
        )
      );
      
      return {
        ...recipe,
        relevanceScore: matchedSymptoms.length / userSymptoms.length
      };
    })
    .sort((a, b) => b.relevanceScore - a.relevanceScore);
};

// Function to get related recipes based on a specific recipe
export const getRelatedRecipes = (recipes, currentRecipe, limit = 3) => {
  if (!currentRecipe) return [];
  
  return recipes
    .filter(recipe => recipe.id !== currentRecipe.id) // Exclude current recipe
    .map(recipe => {
      // Calculate similarity score based on common symptoms and nutrients
      const symptomOverlap = recipe.symptoms.filter(symptom => 
        currentRecipe.symptoms.includes(symptom)
      ).length;
      
      const nutrientOverlap = recipe.nutrients.filter(nutrient => 
        currentRecipe.nutrients.includes(nutrient)
      ).length;
      
      return {
        ...recipe,
        similarityScore: (symptomOverlap / currentRecipe.symptoms.length) + 
                        (nutrientOverlap / currentRecipe.nutrients.length)
      };
    })
    .sort((a, b) => b.similarityScore - a.similarityScore)
    .slice(0, limit);
};