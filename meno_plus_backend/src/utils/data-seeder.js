/**
 * Main data seeding utility for Meno+ app
 * Orchestrates all the individual seeders
 */

const { seedSymptoms } = require('./symptom-seeder');
const { seedAllReliefData } = require('./relief-tools-seeder');

/**
 * Run all data seeding operations
 */
const seedAllData = async () => {
  console.log('Starting data seeding operations...');
  
  try {
    // Seed symptoms
    await seedSymptoms();
    
    // Seed relief tools and snack substitutions
    await seedAllReliefData();
    
    console.log('All data seeding operations completed successfully');
  } catch (error) {
    console.error('Error during data seeding:', error);
  }
};

module.exports = {
  seedAllData
};

// If script is run directly, execute the seed function
if (require.main === module) {
  seedAllData()
    .then(() => console.log('Data seeding completed'))
    .catch(err => console.error('Data seeding failed:', err))
    .finally(() => process.exit());
}
