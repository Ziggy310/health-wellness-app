const { db, admin } = require('../../config/firebase');

// Define symptom categories
const SYMPTOM_CATEGORIES = {
  PHYSICAL: 'Physical',
  EMOTIONAL: 'Emotional',
  COGNITIVE: 'Cognitive',
  SLEEP: 'Sleep'
};

// Common menopause symptoms with categories and related nutrients
const COMMON_SYMPTOMS = [
  { 
    name: 'Hot Flashes', 
    category: SYMPTOM_CATEGORIES.PHYSICAL, 
    relatedNutrients: ['phytoestrogens', 'vitamin_e', 'omega3', 'magnesium']
  },
  { 
    name: 'Night Sweats', 
    category: SYMPTOM_CATEGORIES.SLEEP, 
    relatedNutrients: ['vitamin_e', 'magnesium', 'phytoestrogens']
  },
  { 
    name: 'Mood Swings', 
    category: SYMPTOM_CATEGORIES.EMOTIONAL, 
    relatedNutrients: ['omega3', 'vitamin_d', 'b_vitamins']
  },
  { 
    name: 'Irritability', 
    category: SYMPTOM_CATEGORIES.EMOTIONAL, 
    relatedNutrients: ['b_vitamins', 'magnesium', 'omega3']
  },
  { 
    name: 'Anxiety', 
    category: SYMPTOM_CATEGORIES.EMOTIONAL, 
    relatedNutrients: ['magnesium', 'b_vitamins', 'omega3']
  },
  { 
    name: 'Depression', 
    category: SYMPTOM_CATEGORIES.EMOTIONAL, 
    relatedNutrients: ['vitamin_d', 'omega3', 'b_vitamins']
  },
  { 
    name: 'Insomnia', 
    category: SYMPTOM_CATEGORIES.SLEEP, 
    relatedNutrients: ['magnesium', 'calcium']
  },
  { 
    name: 'Fatigue', 
    category: SYMPTOM_CATEGORIES.PHYSICAL, 
    relatedNutrients: ['iron', 'b_vitamins', 'protein']
  },
  { 
    name: 'Brain Fog', 
    category: SYMPTOM_CATEGORIES.COGNITIVE, 
    relatedNutrients: ['omega3', 'antioxidants', 'b_vitamins']
  },
  { 
    name: 'Memory Issues', 
    category: SYMPTOM_CATEGORIES.COGNITIVE, 
    relatedNutrients: ['omega3', 'antioxidants', 'b_vitamins']
  },
  { 
    name: 'Headaches', 
    category: SYMPTOM_CATEGORIES.PHYSICAL, 
    relatedNutrients: ['magnesium', 'b_vitamins', 'hydration']
  },
  { 
    name: 'Joint Pain', 
    category: SYMPTOM_CATEGORIES.PHYSICAL, 
    relatedNutrients: ['omega3', 'vitamin_d', 'antioxidants']
  },
  { 
    name: 'Weight Gain', 
    category: SYMPTOM_CATEGORIES.PHYSICAL, 
    relatedNutrients: ['fiber', 'protein']
  },
  { 
    name: 'Vaginal Dryness', 
    category: SYMPTOM_CATEGORIES.PHYSICAL, 
    relatedNutrients: ['vitamin_e', 'omega3']
  }
];

// Helper function to get category for a symptom
const getSymptomCategory = (symptomName) => {
  const symptom = COMMON_SYMPTOMS.find(s => s.name.toLowerCase() === symptomName.toLowerCase());
  return symptom ? symptom.category : SYMPTOM_CATEGORIES.PHYSICAL;
};

// Helper function to get related nutrients for a symptom
const getRelatedNutrients = (symptomName) => {
  const symptom = COMMON_SYMPTOMS.find(s => s.name.toLowerCase() === symptomName.toLowerCase());
  return symptom ? symptom.relatedNutrients : [];
};

// Helper function to add symptom to user profile
const addSymptomToUserProfile = async (userId, symptomName, category) => {
  const userProfileRef = db.collection('UserProfiles').doc(userId);
  const userDoc = await userProfileRef.get();
  
  if (!userDoc.exists) {
    // Create profile if it doesn't exist
    await userProfileRef.set({
      userId,
      topSymptoms: [symptomName],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
  } else {
    // Update existing profile
    const userData = userDoc.data();
    const topSymptoms = userData.topSymptoms || [];
    
    if (!topSymptoms.includes(symptomName)) {
      // Only add if not already tracked
      // Keep only the top 5 symptoms
      const updatedSymptoms = [...topSymptoms, symptomName].slice(0, 5);
      
      await userProfileRef.update({
        topSymptoms: updatedSymptoms,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }
  }
};

// Get available symptoms
exports.getAvailableSymptoms = async (userId) => {
  // First, check if we have custom symptoms for this user
  const userSymptomRef = await db.collection('SymptomProfiles').doc(userId).get();
  
  // Combine common symptoms with any user-specific symptoms
  let symptoms = [...COMMON_SYMPTOMS];
  if (userSymptomRef.exists) {
    const userSymptoms = userSymptomRef.data().customSymptoms || [];
    symptoms = [...symptoms, ...userSymptoms];
  }
  
  // Sort by category then name
  symptoms.sort((a, b) => {
    if (a.category === b.category) {
      return a.name.localeCompare(b.name);
    }
    return a.category.localeCompare(b.category);
  });
  
  return symptoms;
};

// Get user's tracked symptoms
exports.getUserSymptoms = async (userId) => {
  // Get user's top symptoms
  const userProfileRef = await db.collection('UserProfiles').doc(userId).get();
  let topSymptoms = [];
  
  if (userProfileRef.exists) {
    topSymptoms = userProfileRef.data().topSymptoms || [];
  }
  
  // Get recent symptoms history (last 7 days)
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 7);
  
  const symptomsSnapshot = await db.collection('SymptomRecords')
    .where('userId', '==', userId)
    .where('timestamp', '>=', startDate)
    .orderBy('timestamp', 'desc')
    .limit(50)
    .get();
  
  const recentSymptoms = [];
  symptomsSnapshot.forEach(doc => {
    const data = doc.data();
    recentSymptoms.push({
      id: doc.id,
      name: data.name,
      severity: data.severity,
      timestamp: data.timestamp.toDate(),
      category: data.category || getSymptomCategory(data.name),
      notes: data.notes || ''
    });
  });
  
  return { topSymptoms, recentSymptoms };
};

// Record symptom occurrence
exports.recordSymptomOccurrence = async (userId, name, severity, notes = '') => {
  // Get category for the symptom
  const category = getSymptomCategory(name);
  
  // Create the symptom record
  const newSymptomRef = db.collection('SymptomRecords').doc();
  const timestamp = admin.firestore.FieldValue.serverTimestamp();
  
  await newSymptomRef.set({
    userId,
    name,
    severity: parseInt(severity),
    category,
    notes: notes || '',
    timestamp
  });
  
  // Add this symptom to user's tracked symptoms
  await addSymptomToUserProfile(userId, name, category);
  
  return {
    id: newSymptomRef.id,
    name,
    severity: parseInt(severity),
    category,
    timestamp: new Date(),
    notes: notes || ''
  };
};

// Get symptom history and trends
exports.getSymptomHistory = async (userId, startDate, endDate, symptomName = null) => {
  // Create date objects
  const start = new Date(startDate);
  const end = new Date(endDate);
  end.setHours(23, 59, 59); // Include the entire end day
  
  // Build query
  let query = db.collection('SymptomRecords')
    .where('userId', '==', userId)
    .where('timestamp', '>=', start)
    .where('timestamp', '<=', end);
    
  if (symptomName) {
    query = query.where('name', '==', symptomName);
  }
  
  const symptomsSnapshot = await query.orderBy('timestamp', 'asc').get();
  
  // Group by symptom name
  const symptomGroups = {};
  const symptoms = [];
  
  symptomsSnapshot.forEach(doc => {
    const data = doc.data();
    const name = data.name;
    const recordData = {
      id: doc.id,
      name: data.name,
      severity: data.severity,
      timestamp: data.timestamp.toDate(),
      category: data.category || getSymptomCategory(data.name),
      notes: data.notes || ''
    };
    
    symptoms.push(recordData);
    
    if (!symptomGroups[name]) {
      symptomGroups[name] = [];
    }
    
    symptomGroups[name].push(recordData);
  });
  
  // Calculate trends
  const trends = [];
  Object.entries(symptomGroups).forEach(([name, records]) => {
    if (records.length < 2) {
      trends.push({
        name,
        category: records[0].category,
        recordCount: records.length,
        trend: 'insufficient_data',
        avgSeverity: records.reduce((sum, r) => sum + r.severity, 0) / records.length
      });
      return;
    }
    
    // Sort by time (should already be sorted from query)
    records.sort((a, b) => a.timestamp - b.timestamp);
    
    // Get first and last record to calculate change
    const first = records[0];
    const last = records[records.length - 1];
    
    // Calculate average severity
    const avgSeverity = records.reduce((sum, r) => sum + r.severity, 0) / records.length;
    
    // Determine trend
    let trend = 'stable';
    if (last.severity < first.severity) {
      trend = 'improving';
    } else if (last.severity > first.severity) {
      trend = 'worsening';
    }
    
    trends.push({
      name,
      category: first.category,
      recordCount: records.length,
      avgSeverity,
      trend,
      change: last.severity - first.severity,
      relatedNutrients: getRelatedNutrients(name)
    });
  });
  
  return {
    symptoms,
    trends,
    period: { startDate, endDate }
  };
};

// Record mood check-in
exports.recordMoodCheckIn = async (userId, mood, notes = '', relatedSymptoms = []) => {
  // Create the mood record
  const newMoodRef = db.collection('MoodCheckIns').doc();
  const timestamp = admin.firestore.FieldValue.serverTimestamp();
  
  await newMoodRef.set({
    userId,
    mood,
    notes: notes || '',
    relatedSymptoms: relatedSymptoms || [],
    timestamp
  });
  
  return {
    id: newMoodRef.id,
    mood,
    timestamp: new Date(),
    notes: notes || '',
    relatedSymptoms: relatedSymptoms || []
  };
};

// Get mood history
exports.getMoodHistory = async (userId, startDate, endDate) => {
  // Create date objects
  const start = new Date(startDate);
  const end = new Date(endDate);
  end.setHours(23, 59, 59); // Include the entire end day
  
  const moodSnapshot = await db.collection('MoodCheckIns')
    .where('userId', '==', userId)
    .where('timestamp', '>=', start)
    .where('timestamp', '<=', end)
    .orderBy('timestamp', 'asc')
    .get();
  
  const moods = [];
  moodSnapshot.forEach(doc => {
    const data = doc.data();
    moods.push({
      id: doc.id,
      mood: data.mood,
      timestamp: data.timestamp.toDate(),
      notes: data.notes || '',
      relatedSymptoms: data.relatedSymptoms || []
    });
  });
  
  // Calculate trends
  let trend = 'stable';
  let commonMoods = [];
  
  if (moods.length > 0) {
    // Count occurrences of each mood
    const moodCounts = {};
    moods.forEach(record => {
      if (!moodCounts[record.mood]) {
        moodCounts[record.mood] = 0;
      }
      moodCounts[record.mood]++;
    });
    
    // Get the most common moods
    commonMoods = Object.entries(moodCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([mood, count]) => ({
        mood,
        count,
        percentage: Math.round((count / moods.length) * 100)
      }));
  }
  
  return {
    moods,
    trends: {
      commonMoods,
      recordCount: moods.length
    },
    period: { startDate, endDate }
  };
};

// Generate daily summary for dashboard
exports.generateDailySummary = async (userId) => {
  // Get today's date
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const todayStr = today.toISOString().split('T')[0];
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  
  // Get today's symptoms
  const todaySymptoms = await exports.getSymptomHistory(userId, todayStr, todayStr);
  
  // Get yesterday's symptoms
  const yesterdaySymptoms = await exports.getSymptomHistory(userId, yesterdayStr, yesterdayStr);
  
  // Compare symptoms between days
  const todaySymptomMap = {};
  todaySymptoms.symptoms.forEach(s => {
    if (!todaySymptomMap[s.name]) {
      todaySymptomMap[s.name] = [];
    }
    todaySymptomMap[s.name].push(s);
  });
  
  const yesterdaySymptomMap = {};
  yesterdaySymptoms.symptoms.forEach(s => {
    if (!yesterdaySymptomMap[s.name]) {
      yesterdaySymptomMap[s.name] = [];
    }
    yesterdaySymptomMap[s.name].push(s);
  });
  
  // Generate status for each symptom
  const symptomStatus = [];
  
  // Process today's symptoms
  Object.entries(todaySymptomMap).forEach(([name, records]) => {
    // Calculate average severity for today
    const avgTodaySeverity = records.reduce((sum, r) => sum + r.severity, 0) / records.length;
    
    // Check if symptom was present yesterday
    if (yesterdaySymptomMap[name]) {
      const avgYesterdaySeverity = yesterdaySymptomMap[name].reduce((sum, r) => sum + r.severity, 0) / yesterdaySymptomMap[name].length;
      
      // Determine trend
      let trend = 'unchanged';
      if (avgTodaySeverity < avgYesterdaySeverity) {
        trend = 'improved';
      } else if (avgTodaySeverity > avgYesterdaySeverity) {
        trend = 'worsened';
      }
      
      symptomStatus.push({
        name,
        category: records[0].category,
        severity: avgTodaySeverity,
        trend,
        change: avgTodaySeverity - avgYesterdaySeverity
      });
    } else {
      // New symptom not present yesterday
      symptomStatus.push({
        name,
        category: records[0].category,
        severity: avgTodaySeverity,
        trend: 'new',
        change: avgTodaySeverity
      });
    }
  });
  
  // Process yesterday's symptoms not present today
  Object.entries(yesterdaySymptomMap).forEach(([name, records]) => {
    if (!todaySymptomMap[name]) {
      symptomStatus.push({
        name,
        category: records[0].category,
        severity: 0,
        trend: 'resolved',
        change: -records.reduce((sum, r) => sum + r.severity, 0) / records.length
      });
    }
  });
  
  // Generate overall status
  let overallStatus = 'stable';
  if (symptomStatus.length === 0) {
    overallStatus = 'no_data';
  } else {
    const improvedCount = symptomStatus.filter(s => s.trend === 'improved' || s.trend === 'resolved').length;
    const worsenedCount = symptomStatus.filter(s => s.trend === 'worsened' || s.trend === 'new').length;
    
    if (improvedCount > worsenedCount) {
      overallStatus = 'improved';
    } else if (worsenedCount > improvedCount) {
      overallStatus = 'worsened';
    }
  }
  
  return {
    date: todayStr,
    overallStatus,
    symptomStatus,
    symptomCount: symptomStatus.length
  };
};