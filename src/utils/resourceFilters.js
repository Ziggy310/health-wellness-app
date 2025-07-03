// Utility functions for filtering resources based on advanced search criteria

/**
 * Filter resources based on publication date range
 */
export const filterByDateRange = (resources, dateRange) => {
  if (dateRange === 'all') return resources;
  
  const now = new Date();
  let cutoffDate;
  
  switch (dateRange) {
    case 'last7days':
      cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'last30days':
      cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case 'last6months':
      cutoffDate = new Date(now.getTime() - 6 * 30 * 24 * 60 * 60 * 1000);
      break;
    case 'lastyear':
      cutoffDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      break;
    default:
      return resources;
  }
  
  return resources.filter(resource => {
    const resourceDate = new Date(resource.publishDate || resource.publication_date);
    return resourceDate >= cutoffDate;
  });
};

/**
 * Filter resources by reading time
 */
export const filterByReadingTime = (resources, readingTime) => {
  if (readingTime === 'all') return resources;
  
  return resources.filter(resource => {
    const estimatedTime = estimateReadingTime(resource);
    
    switch (readingTime) {
      case 'quick':
        return estimatedTime <= 5;
      case 'medium':
        return estimatedTime > 5 && estimatedTime <= 15;
      case 'long':
        return estimatedTime > 15;
      default:
        return true;
    }
  });
};

/**
 * Estimate reading time based on content type and description length
 */
export const estimateReadingTime = (resource) => {
  // Default estimates by resource type
  const typeEstimates = {
    'article': 8,
    'video': 12,
    'podcast': 25,
    'infographic': 3
  };
  
  // Base estimate from resource type
  let estimate = typeEstimates[resource.type?.toLowerCase()] || 8;
  
  // Adjust based on description length if available
  if (resource.description) {
    const words = resource.description.split(' ').length;
    const readingSpeed = 200; // words per minute
    const descriptionTime = Math.ceil(words / readingSpeed);
    estimate = Math.max(estimate, descriptionTime);
  }
  
  // Use duration if available for videos/podcasts
  if (resource.duration) {
    const durationMatch = resource.duration.match(/(\d+)/);
    if (durationMatch) {
      estimate = parseInt(durationMatch[1]);
    }
  }
  
  return estimate;
};

/**
 * Filter resources by difficulty level
 */
export const filterByDifficulty = (resources, difficultyLevel) => {
  if (difficultyLevel === 'all') return resources;
  
  return resources.filter(resource => {
    const difficulty = determineDifficulty(resource);
    return difficulty === difficultyLevel;
  });
};

/**
 * Determine difficulty level based on resource characteristics
 */
export const determineDifficulty = (resource) => {
  const title = (resource.title || '').toLowerCase();
  const description = (resource.description || '').toLowerCase();
  const content = `${title} ${description}`;
  
  // Keywords that indicate difficulty levels
  const beginnerKeywords = [
    'beginner', 'basic', 'introduction', 'getting started', 'simple',
    'easy', 'guide', 'overview', 'basics', '101', 'fundamentals'
  ];
  
  const advancedKeywords = [
    'advanced', 'complex', 'research', 'study', 'clinical', 'technical',
    'mechanism', 'pathophysiology', 'molecular', 'biochemical', 'expert'
  ];
  
  // Check for beginner indicators
  if (beginnerKeywords.some(keyword => content.includes(keyword))) {
    return 'beginner';
  }
  
  // Check for advanced indicators
  if (advancedKeywords.some(keyword => content.includes(keyword))) {
    return 'advanced';
  }
  
  // Default to intermediate
  return 'intermediate';
};

/**
 * Filter resources by health conditions
 */
export const filterByHealthConditions = (resources, selectedConditions) => {
  if (!selectedConditions || selectedConditions.length === 0) return resources;
  
  return resources.filter(resource => {
    const resourceContent = `${resource.title || ''} ${resource.description || ''} ${resource.category || ''}`.toLowerCase();
    
    return selectedConditions.some(condition => {
      const conditionKeywords = getConditionKeywords(condition);
      return conditionKeywords.some(keyword => resourceContent.includes(keyword.toLowerCase()));
    });
  });
};

/**
 * Get related keywords for health conditions
 */
export const getConditionKeywords = (condition) => {
  const keywordMap = {
    'Heart Disease': ['heart', 'cardiac', 'cardiovascular', 'coronary', 'cholesterol', 'hypertension'],
    'Diabetes': ['diabetes', 'blood sugar', 'glucose', 'insulin', 'diabetic'],
    'High Blood Pressure': ['blood pressure', 'hypertension', 'bp', 'systolic', 'diastolic'],
    'Obesity': ['obesity', 'weight loss', 'overweight', 'bmi', 'body mass'],
    'Mental Health': ['mental health', 'depression', 'anxiety', 'stress', 'mood', 'psychological'],
    'Brain Health': ['brain', 'cognitive', 'memory', 'alzheimer', 'dementia', 'neurological'],
    'Digestive Health': ['digestive', 'gut', 'stomach', 'intestinal', 'digestion', 'microbiome'],
    'Immune System': ['immune', 'immunity', 'autoimmune', 'infection', 'antibodies'],
    'Arthritis': ['arthritis', 'joint', 'inflammation', 'rheumatoid', 'osteoarthritis'],
    'Osteoporosis': ['osteoporosis', 'bone', 'calcium', 'bone density', 'fracture'],
    'Sleep Disorders': ['sleep', 'insomnia', 'sleep apnea', 'rest', 'sleeping'],
    'Stress Management': ['stress', 'relaxation', 'meditation', 'mindfulness', 'anxiety'],
    'Women\'s Health': ['women', 'female', 'menopause', 'pregnancy', 'hormonal'],
    'Men\'s Health': ['men', 'male', 'prostate', 'testosterone', 'masculine'],
    'Aging': ['aging', 'elderly', 'seniors', 'age-related', 'longevity'],
    'Cancer Prevention': ['cancer', 'oncology', 'tumor', 'prevention', 'screening']
  };
  
  return keywordMap[condition] || [condition.toLowerCase()];
};

/**
 * Filter resources by sources
 */
export const filterBySources = (resources, selectedSources) => {
  if (!selectedSources || selectedSources.length === 0) return resources;
  
  return resources.filter(resource => {
    const resourceSource = resource.author || resource.source || '';
    return selectedSources.some(source => 
      resourceSource.toLowerCase().includes(source.toLowerCase())
    );
  });
};

/**
 * Sort resources based on sort criteria
 */
export const sortResources = (resources, sortBy) => {
  const sorted = [...resources];
  
  switch (sortBy) {
    case 'newest':
      return sorted.sort((a, b) => {
        const dateA = new Date(a.publishDate || a.publication_date || 0);
        const dateB = new Date(b.publishDate || b.publication_date || 0);
        return dateB - dateA;
      });
      
    case 'oldest':
      return sorted.sort((a, b) => {
        const dateA = new Date(a.publishDate || a.publication_date || 0);
        const dateB = new Date(b.publishDate || b.publication_date || 0);
        return dateA - dateB;
      });
      
    case 'mostRelevant':
      // For now, sort by a combination of recency and source credibility
      return sorted.sort((a, b) => {
        const scoreA = calculateRelevanceScore(a);
        const scoreB = calculateRelevanceScore(b);
        return scoreB - scoreA;
      });
      
    case 'mostPopular':
      // Sort by views or engagement if available
      return sorted.sort((a, b) => {
        const viewsA = parseInt(a.views) || 0;
        const viewsB = parseInt(b.views) || 0;
        return viewsB - viewsA;
      });
      
    default:
      return sorted;
  }
};

/**
 * Calculate relevance score for sorting
 */
export const calculateRelevanceScore = (resource) => {
  let score = 0;
  
  // Recency score (newer = higher score)
  const resourceDate = new Date(resource.publishDate || resource.publication_date || 0);
  const daysSincePublication = (Date.now() - resourceDate.getTime()) / (1000 * 60 * 60 * 24);
  const recencyScore = Math.max(0, 100 - daysSincePublication / 10);
  score += recencyScore;
  
  // Source credibility score
  const credibleSources = [
    'Harvard Health Publishing', 'Mayo Clinic', 'WebMD', 'WHO', 'CDC',
    'NIH', 'Johns Hopkins', 'Cleveland Clinic'
  ];
  const resourceSource = resource.author || resource.source || '';
  if (credibleSources.some(source => resourceSource.includes(source))) {
    score += 50;
  }
  
  // Content quality indicators
  const title = resource.title || '';
  const description = resource.description || '';
  if (title.length > 10 && description.length > 50) {
    score += 25;
  }
  
  return score;
};

/**
 * Apply all filters to resources
 */
export const applyAllFilters = (resources, filters) => {
  let filteredResources = [...resources];
  
  // Apply search query
  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    filteredResources = filteredResources.filter(resource => {
      const searchableContent = `${resource.title || ''} ${resource.description || ''} ${resource.author || ''} ${resource.source || ''}`.toLowerCase();
      return searchableContent.includes(query);
    });
  }
  
  // Apply date range filter
  filteredResources = filterByDateRange(filteredResources, filters.publicationDateRange);
  
  // Apply reading time filter
  filteredResources = filterByReadingTime(filteredResources, filters.readingTime);
  
  // Apply difficulty filter
  filteredResources = filterByDifficulty(filteredResources, filters.difficultyLevel);
  
  // Apply health conditions filter
  filteredResources = filterByHealthConditions(filteredResources, filters.healthConditions);
  
  // Apply resource type filter
  if (filters.resourceType && filters.resourceType !== 'all') {
    filteredResources = filteredResources.filter(resource => 
      resource.type?.toLowerCase() === filters.resourceType.toLowerCase()
    );
  }
  
  // Apply sources filter
  filteredResources = filterBySources(filteredResources, filters.sources);
  
  // Apply sorting
  filteredResources = sortResources(filteredResources, filters.sortBy);
  
  return filteredResources;
};

/**
 * Get filter statistics
 */
export const getFilterStats = (resources, filters) => {
  const filteredResources = applyAllFilters(resources, filters);
  
  return {
    totalResults: filteredResources.length,
    originalTotal: resources.length,
    percentageFiltered: Math.round((filteredResources.length / resources.length) * 100),
    resourceTypeBreakdown: getResourceTypeBreakdown(filteredResources),
    sourceBreakdown: getSourceBreakdown(filteredResources),
    difficultyBreakdown: getDifficultyBreakdown(filteredResources)
  };
};

/**
 * Get breakdown by resource type
 */
export const getResourceTypeBreakdown = (resources) => {
  const breakdown = {};
  resources.forEach(resource => {
    const type = resource.type || 'unknown';
    breakdown[type] = (breakdown[type] || 0) + 1;
  });
  return breakdown;
};

/**
 * Get breakdown by source
 */
export const getSourceBreakdown = (resources) => {
  const breakdown = {};
  resources.forEach(resource => {
    const source = resource.author || resource.source || 'unknown';
    breakdown[source] = (breakdown[source] || 0) + 1;
  });
  return breakdown;
};

/**
 * Get breakdown by difficulty
 */
export const getDifficultyBreakdown = (resources) => {
  const breakdown = { beginner: 0, intermediate: 0, advanced: 0 };
  resources.forEach(resource => {
    const difficulty = determineDifficulty(resource);
    breakdown[difficulty]++;
  });
  return breakdown;
};