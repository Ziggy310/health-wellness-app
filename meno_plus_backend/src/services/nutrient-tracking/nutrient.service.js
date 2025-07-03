const { db, admin } = require('../../config/firebase');

// Key nutrients important for menopause symptom management
const KEY_NUTRIENTS = [
  'calcium', 'vitamin_d', 'magnesium', 'vitamin_e', 
  'phytoestrogens', 'omega3', 'b_vitamins', 'iron',
  'fiber', 'antioxidants', 'protein'
];

// Helper function to normalize nutrient names
const normalizeNutrientName = (rawName) => {
  rawName = rawName.toLowerCase();
  
  if (rawName.includes('calcium')) return 'calcium';
  if (rawName.includes('vitamin d')) return 'vitamin_d';
  if (rawName.includes('magnesium')) return 'magnesium';
  if (rawName.includes('vitamin e')) return 'vitamin_e';
  if (rawName.includes('phytoestrogen') || rawName.includes('soy')) return 'phytoestrogens';
  if (rawName.includes('omega') || rawName.includes('fatty acid')) return 'omega3';
  if (rawName.includes('vitamin b') || rawName.includes('b vitamin')) return 'b_vitamins';
  if (rawName.includes('iron')) return 'iron';
  if (rawName.includes('fiber') || rawName.includes('fibre')) return 'fiber';
  if (rawName.includes('antioxidant')) return 'antioxidants';
  if (rawName.includes('protein')) return 'protein';
  
  return null;
};

// Process meals to extract nutrient data
const processNutrientData = (mealsSnapshot, startDate, endDate) => {
  // Group meals by date
  const mealsByDate = {};
  
  mealsSnapshot.forEach(doc => {
    const meal = doc.data();
    const mealDate = meal.date || 
      (meal.createdAt && meal.createdAt.toDate().toISOString().split('T')[0]);
      
    if (mealDate && mealDate >= startDate && mealDate <= endDate) {
      if (!mealsByDate[mealDate]) {
        mealsByDate[mealDate] = [];
      }
      mealsByDate[mealDate].push(meal);
    }
  });
  
  // Process nutrients for each date
  const nutrientData = [];
  
  Object.keys(mealsByDate).sort().forEach(date => {
    const dayNutrients = {
      date,
    };
    
    // Initialize nutrients for this day
    KEY_NUTRIENTS.forEach(nutrient => {
      dayNutrients[nutrient] = 0;
    });
    
    // Process each meal for this day
    mealsByDate[date].forEach(meal => {
      if (meal.keyNutrients && Array.isArray(meal.keyNutrients)) {
        meal.keyNutrients.forEach(nutrient => {
          const normalizedNutrient = normalizeNutrientName(nutrient);
          if (normalizedNutrient && dayNutrients[normalizedNutrient] !== undefined) {
            dayNutrients[normalizedNutrient] += 0.33; // Partial contribution
          }
        });
      }
    });
    
    // Cap nutrients at 1.0 (100% of daily value)
    KEY_NUTRIENTS.forEach(nutrient => {
      dayNutrients[nutrient] = Math.min(1, dayNutrients[nutrient]);
    });
    
    nutrientData.push(dayNutrients);
  });
  
  return nutrientData;
};

// Get nutrient data for a specific period
exports.getNutrientDataForPeriod = async (userId, startDate, endDate) => {
  // Get all meals for the date range
  const mealsSnapshot = await db.collection('Meals')
    .where('userId', '==', userId)
    .get();
    
  // Process meals to extract nutrient data
  return processNutrientData(mealsSnapshot, startDate, endDate);
};

// Get recommendations for deficient nutrients
exports.getNutrientRecommendations = (nutrient) => {
  const recommendations = {
    calcium: ['Dairy products', 'Leafy greens', 'Fortified plant milks', 'Tofu'],
    vitamin_d: ['Fatty fish', 'Egg yolks', 'Mushrooms', 'Fortified foods'],
    magnesium: ['Nuts', 'Seeds', 'Whole grains', 'Leafy greens'],
    vitamin_e: ['Nuts', 'Seeds', 'Vegetable oils', 'Spinach'],
    phytoestrogens: ['Soy products', 'Flaxseeds', 'Sesame seeds', 'Legumes'],
    omega3: ['Fatty fish', 'Walnuts', 'Flaxseeds', 'Chia seeds'],
    b_vitamins: ['Whole grains', 'Meat', 'Eggs', 'Leafy greens'],
    iron: ['Red meat', 'Beans', 'Spinach', 'Fortified cereals'],
    fiber: ['Beans', 'Whole grains', 'Fruits', 'Vegetables'],
    antioxidants: ['Berries', 'Dark chocolate', 'Pecans', 'Artichokes'],
    protein: ['Meat', 'Fish', 'Dairy', 'Legumes', 'Tofu']
  };
  
  return recommendations[nutrient] || ['Consult with a nutritionist for personalized recommendations'];
};

// Analyze nutrient deficiencies over the last week
exports.analyzeNutrientDeficiencies = async (userId) => {
  // Get the latest nutrient data for the last week
  const today = new Date();
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);
  
  const startDate = lastWeek.toISOString().split('T')[0];
  const endDate = today.toISOString().split('T')[0];
  
  // Get nutrient data
  const nutrientData = await exports.getNutrientDataForPeriod(userId, startDate, endDate);
  
  // Calculate average nutrient values
  const avgNutrients = {};
  KEY_NUTRIENTS.forEach(nutrient => {
    avgNutrients[nutrient] = 0;
  });
  
  // Calculate averages
  if (nutrientData.length > 0) {
    nutrientData.forEach(day => {
      KEY_NUTRIENTS.forEach(nutrient => {
        avgNutrients[nutrient] += day[nutrient] || 0;
      });
    });
    
    KEY_NUTRIENTS.forEach(nutrient => {
      avgNutrients[nutrient] /= nutrientData.length;
    });
  }
  
  // Identify deficiencies (under 0.5 of recommended)
  const deficiencies = [];
  Object.entries(avgNutrients).forEach(([nutrient, value]) => {
    if (value < 0.5) {
      deficiencies.push({
        nutrient: nutrient.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase()),
        value,
        recommendations: exports.getNutrientRecommendations(nutrient)
      });
    }
  });
  
  return {
    deficiencies,
    period: { startDate, endDate }
  };
};

// Get micronutrient rings data
exports.getMicronutrientRingsData = async (userId, date) => {
  const targetDate = date || new Date().toISOString().split('T')[0];
  
  // Get a week's worth of meals for context
  const endDate = new Date(targetDate);
  const startDate = new Date(targetDate);
  startDate.setDate(startDate.getDate() - 6);  // Last 7 days
  
  const startDateStr = startDate.toISOString().split('T')[0];
  const endDateStr = endDate.toISOString().split('T')[0];
  
  // Get nutrient data
  const nutrientData = await exports.getNutrientDataForPeriod(userId, startDateStr, endDateStr);
  
  // If no data for target date, find the most recent date
  let targetDateData = nutrientData.find(item => item.date === targetDate);
  
  if (!targetDateData && nutrientData.length > 0) {
    // Sort by date descending and take the most recent
    nutrientData.sort((a, b) => new Date(b.date) - new Date(a.date));
    targetDateData = nutrientData[0];
  }
  
  if (!targetDateData) {
    // No data found, return empty rings
    return {
      date: targetDate,
      nutrients: []
    };
  }
  
  // Format the data for the micronutrient completion rings
  const nutrients = KEY_NUTRIENTS.map(nutrient => ({
    name: nutrient.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase()),
    value: targetDateData[nutrient] || 0
  }));
  
  return {
    date: targetDateData.date,
    nutrients
  };
};

// Get information about a specific nutrient
exports.getNutrientInformation = async (nutrientId) => {
  // Validate nutrient id
  if (!KEY_NUTRIENTS.includes(nutrientId)) {
    return null;
  }
  
  // Get food sources
  const sources = exports.getNutrientRecommendations(nutrientId);
  
  // Get additional information about the nutrient
  const nutrientInfo = {
    calcium: {
      benefits: 'Supports bone health and may reduce risk of osteoporosis during menopause',
      dailyValue: '1000-1200mg',
      menopauseRelevance: 'Critical for bone health as estrogen decline increases bone loss risk'
    },
    vitamin_d: {
      benefits: 'Enhances calcium absorption and may help improve mood',
      dailyValue: '600-800 IU',
      menopauseRelevance: 'Works with calcium to protect bones; may help with mood fluctuations'
    },
    magnesium: {
      benefits: 'May reduce hot flashes and improve sleep quality',
      dailyValue: '320mg',
      menopauseRelevance: 'Can help with sleep disturbances and temperature regulation'
    },
    vitamin_e: {
      benefits: 'Antioxidant properties that may reduce hot flashes',
      dailyValue: '15mg',
      menopauseRelevance: 'Some studies suggest it may reduce hot flash frequency'
    },
    phytoestrogens: {
      benefits: 'Plant compounds that may help balance hormones',
      dailyValue: 'No official recommendation',
      menopauseRelevance: 'May provide mild estrogenic effects that help with symptom relief'
    },
    omega3: {
      benefits: 'Anti-inflammatory properties that may improve joint pain and mood',
      dailyValue: '1.1g',
      menopauseRelevance: 'May reduce inflammation associated with menopausal symptoms'
    },
    b_vitamins: {
      benefits: 'Support energy metabolism and may help with cognition',
      dailyValue: 'Varies by specific B vitamin',
      menopauseRelevance: 'May help with energy levels and cognitive function during menopause'
    },
    iron: {
      benefits: 'Essential for blood health and energy levels',
      dailyValue: '8mg for women over 50',
      menopauseRelevance: 'Requirements typically decrease after menopause'
    },
    fiber: {
      benefits: 'Supports digestive health and may help with weight management',
      dailyValue: '25g',
      menopauseRelevance: 'Can help with weight management and heart health post-menopause'
    },
    antioxidants: {
      benefits: 'Protect cells from oxidative stress and may support heart health',
      dailyValue: 'No official recommendation',
      menopauseRelevance: 'May help protect against age-related cellular damage'
    },
    protein: {
      benefits: 'Supports muscle maintenance and satiety',
      dailyValue: '0.8g per kg of body weight',
      menopauseRelevance: 'Important for preserving muscle mass during and after menopause'
    }
  };
  
  return {
    nutrient: nutrientId.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase()),
    sources,
    ...nutrientInfo[nutrientId]
  };
};

// Calculate correlation between nutrients and symptoms
exports.analyzeNutrientSymptomCorrelation = async (userId, symptom, days_offset = 1) => {
  // Get the latest nutrient and symptom data for the last 30 days
  const today = new Date();
  const lastMonth = new Date();
  lastMonth.setDate(lastMonth.getDate() - 30);
  
  const startDate = lastMonth.toISOString().split('T')[0];
  const endDate = today.toISOString().split('T')[0];
  
  // Get nutrient data
  const nutrientData = await exports.getNutrientDataForPeriod(userId, startDate, endDate);
  
  // Get symptom data
  const symptomsSnapshot = await db.collection('SymptomRecords')
    .where('userId', '==', userId)
    .where('name', '==', symptom)
    .where('timestamp', '>=', lastMonth)
    .where('timestamp', '<=', today)
    .get();
    
  if (nutrientData.length < 3 || symptomsSnapshot.empty) {
    return {
      correlations: {},
      recommendations: [],
      summary: "Not enough data to analyze correlations."
    };
  }
  
  // Convert nutrient data to map for easy lookup
  const nutrientsByDate = {};
  nutrientData.forEach(day => {
    nutrientsByDate[day.date] = day;
  });
  
  // Prepare paired data for correlation analysis
  const pairedData = [];
  
  symptomsSnapshot.forEach(doc => {
    const symptomRecord = doc.data();
    const symptomDate = symptomRecord.timestamp.toDate().toISOString().split('T')[0];
    
    // Calculate offset date (when nutrients were consumed)
    const symptomDateTime = new Date(symptomDate);
    const offsetDateTime = new Date(symptomDateTime);
    offsetDateTime.setDate(offsetDateTime.getDate() - days_offset);
    const offsetDate = offsetDateTime.toISOString().split('T')[0];
    
    // Get nutrient data for offset date
    if (nutrientsByDate[offsetDate]) {
      const nutrientValues = nutrientsByDate[offsetDate];
      const severity = symptomRecord.severity;
      
      KEY_NUTRIENTS.forEach(nutrient => {
        pairedData.push({
          nutrient,
          nutrientValue: nutrientValues[nutrient] || 0,
          severity
        });
      });
    }
  });
  
  if (pairedData.length === 0) {
    return {
      correlations: {},
      recommendations: [],
      summary: "No matching data found for correlation analysis."
    };
  }
  
  // Group by nutrient and calculate correlations
  const correlations = {};
  KEY_NUTRIENTS.forEach(nutrient => {
    const nutrientPairs = pairedData.filter(item => item.nutrient === nutrient);
    
    if (nutrientPairs.length < 3) {  // Need at least 3 data points
      return;
    }
      
    const nutrientValues = nutrientPairs.map(p => p.nutrientValue);
    const severityValues = nutrientPairs.map(p => p.severity);
    
    // Only calculate if there's variation in the values
    const uniqueNutrientValues = [...new Set(nutrientValues)];
    if (uniqueNutrientValues.length > 1) {
      // Calculate correlation coefficient
      correlations[nutrient] = calculateCorrelation(nutrientValues, severityValues);
    }
  });
  
  // Generate recommendations based on correlations
  const recommendations = [];
  Object.entries(correlations).forEach(([nutrient, corr]) => {
    if (corr <= -0.3) {  // Negative correlation means nutrient helps reduce symptom
      recommendations.push({
        nutrient: nutrient.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase()),
        action: 'increase',
        correlation: corr,
        message: `Increasing ${nutrient.replace('_', ' ')} may help reduce ${symptom}`,
        sources: exports.getNutrientRecommendations(nutrient)
      });
    } else if (corr >= 0.3) {  // Positive correlation means nutrient may worsen symptom
      recommendations.push({
        nutrient: nutrient.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase()),
        action: 'decrease',
        correlation: corr,
        message: `Reducing ${nutrient.replace('_', ' ')} may help reduce ${symptom}`,
        alternatives: exports.getNutrientRecommendations(nutrient)
      });
    }
  });
  
  // Create summary
  let summary = "No strong correlations found between nutrients and symptoms.";
  if (recommendations.length > 0) {
    summary = `Analysis suggests that ${recommendations.length} nutritional changes may help reduce ${symptom}.`;
  }
  
  return {
    correlations,
    recommendations,
    summary
  };
};

// Helper function to calculate correlation coefficient
function calculateCorrelation(x, y) {
  const n = x.length;
  
  // Calculate means
  const xMean = x.reduce((sum, val) => sum + val, 0) / n;
  const yMean = y.reduce((sum, val) => sum + val, 0) / n;
  
  // Calculate correlation coefficient
  let numerator = 0;
  let denomX = 0;
  let denomY = 0;
  
  for (let i = 0; i < n; i++) {
    const xDiff = x[i] - xMean;
    const yDiff = y[i] - yMean;
    numerator += xDiff * yDiff;
    denomX += xDiff * xDiff;
    denomY += yDiff * yDiff;
  }
  
  if (denomX === 0 || denomY === 0) {
    return 0;
  }
  
  return parseFloat((numerator / Math.sqrt(denomX * denomY)).toFixed(2));
}