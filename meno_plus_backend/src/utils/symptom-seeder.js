/**
 * Utility to seed initial symptom data into Firestore
 * This can be run as a standalone script or imported and used programmatically
 */

const { db, admin } = require('../config/firebase');

// Initial symptom data
const initialSymptoms = [
  {
    name: 'Hot Flashes',
    description: 'Sudden feelings of warmth in the upper body, often with flushing and sweating',
    relatedNutrients: ['magnesium', 'vitamin E', 'omega-3'],
    reliefStrategies: [
      'Stay hydrated',
      'Dress in layers',
      'Avoid trigger foods like caffeine and spicy food'
    ],
    category: 'PHYSICAL',
    baselineSeverity: 0
  },
  {
    name: 'Night Sweats',
    description: 'Hot flashes that occur during sleep often disrupting sleep',
    relatedNutrients: ['magnesium', 'vitamin E', 'calcium'],
    reliefStrategies: [
      'Keep bedroom cool',
      'Use moisture-wicking bedding',
      'Avoid alcohol before bed'
    ],
    category: 'SLEEP',
    baselineSeverity: 0
  },
  {
    name: 'Insomnia',
    description: 'Difficulty falling asleep or staying asleep',
    relatedNutrients: ['magnesium', 'calcium', 'vitamin D'],
    reliefStrategies: [
      'Regular sleep schedule',
      'Relaxation techniques before bed',
      'Keep bedroom dark and cool'
    ],
    category: 'SLEEP',
    baselineSeverity: 0
  },
  {
    name: 'Mood Swings',
    description: 'Rapid and extreme emotional changes',
    relatedNutrients: ['omega-3', 'B vitamins', 'zinc'],
    reliefStrategies: [
      'Regular exercise',
      'Meditation',
      'Journaling'
    ],
    category: 'EMOTIONAL',
    baselineSeverity: 0
  },
  {
    name: 'Irritability',
    description: 'Heightened sensitivity and tendency to become angry easily',
    relatedNutrients: ['B vitamins', 'magnesium', 'omega-3'],
    reliefStrategies: [
      'Deep breathing exercises',
      'Physical activity',
      'Adequate rest'
    ],
    category: 'EMOTIONAL',
    baselineSeverity: 0
  },
  {
    name: 'Brain Fog',
    description: 'Problems with memory, focus, and mental clarity',
    relatedNutrients: ['omega-3', 'vitamin D', 'iron', 'B vitamins'],
    reliefStrategies: [
      'Mental exercises',
      'Adequate sleep',
      'Regular physical activity'
    ],
    category: 'COGNITIVE',
    baselineSeverity: 0
  },
  {
    name: 'Fatigue',
    description: 'Persistent feeling of tiredness or exhaustion',
    relatedNutrients: ['iron', 'vitamin B12', 'vitamin D', 'magnesium'],
    reliefStrategies: [
      'Regular exercise',
      'Balanced diet',
      'Adequate hydration'
    ],
    category: 'PHYSICAL',
    baselineSeverity: 0
  },
  {
    name: 'Weight Gain',
    description: 'Increased weight, especially around the abdomen',
    relatedNutrients: ['fiber', 'protein'],
    reliefStrategies: [
      'Regular exercise',
      'Portion control',
      'Increased physical activity'
    ],
    category: 'PHYSICAL',
    baselineSeverity: 0
  },
  {
    name: 'Joint Pain',
    description: 'Discomfort, aches, and soreness in joints',
    relatedNutrients: ['vitamin D', 'calcium', 'omega-3', 'turmeric/curcumin'],
    reliefStrategies: [
      'Gentle stretching',
      'Low-impact exercise',
      'Heat or cold therapy'
    ],
    category: 'PHYSICAL',
    baselineSeverity: 0
  },
  {
    name: 'Headaches',
    description: 'Increased frequency or intensity of headaches',
    relatedNutrients: ['magnesium', 'vitamin B2', 'coenzyme Q10'],
    reliefStrategies: [
      'Stay hydrated',
      'Stress management',
      'Regular sleep schedule'
    ],
    category: 'PHYSICAL',
    baselineSeverity: 0
  },
  {
    name: 'Anxiety',
    description: 'Feelings of worry, nervousness, or unease',
    relatedNutrients: ['magnesium', 'omega-3', 'B vitamins', 'probiotics'],
    reliefStrategies: [
      'Deep breathing exercises',
      'Meditation',
      'Regular physical activity'
    ],
    category: 'EMOTIONAL',
    baselineSeverity: 0
  }
];

/**
 * Seed initial symptom data
 */
const seedSymptoms = async () => {
  try {
    console.log('Starting symptom data seeding...');
    
    // Check if collection already has data
    const existingSymptoms = await db.collection('Symptoms').limit(1).get();
    if (!existingSymptoms.empty) {
      console.log('Symptom data already exists. Skipping seed operation.');
      return;
    }
    
    // Create batch for efficient writing
    const batch = db.batch();
    
    // Add each symptom to batch
    for (const symptom of initialSymptoms) {
      const docRef = db.collection('Symptoms').doc();
      batch.set(docRef, {
        ...symptom,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }
    
    // Commit the batch write
    await batch.commit();
    console.log(`Successfully seeded ${initialSymptoms.length} symptoms`);
  } catch (error) {
    console.error('Error seeding symptom data:', error);
  }
};

module.exports = {
  seedSymptoms
};

// If script is run directly, execute the seed function
if (require.main === module) {
  // Ensure Firebase is initialized
  seedSymptoms()
    .then(() => console.log('Seeding complete'))
    .catch(err => console.error('Seeding failed:', err))
    .finally(() => process.exit());
}
