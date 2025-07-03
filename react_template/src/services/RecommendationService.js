// Service for generating personalized resource recommendations

class RecommendationService {
  constructor() {
    this.storagePrefix = 'health_resources_';
    this.userDataKey = 'user_profile';
    this.browsingHistoryKey = 'browsing_history';
    this.preferencesKey = 'user_preferences';
  }

  // Get user profile data
  getUserProfile() {
    try {
      const profile = localStorage.getItem(`${this.storagePrefix}${this.userDataKey}`);
      return profile ? JSON.parse(profile) : this.getDefaultProfile();
    } catch (error) {
      console.error('Error loading user profile:', error);
      return this.getDefaultProfile();
    }
  }

  // Get default user profile
  getDefaultProfile() {
    return {
      healthGoals: [],
      healthConditions: [],
      dietaryPreferences: [],
      fitnessLevel: 'beginner',
      ageRange: '25-34',
      interests: [],
      readingTimePreference: 'medium',
      difficultyPreference: 'intermediate',
      preferredContentTypes: ['article', 'video'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  // Update user profile
  updateUserProfile(profileData) {
    try {
      const currentProfile = this.getUserProfile();
      const updatedProfile = {
        ...currentProfile,
        ...profileData,
        updatedAt: new Date().toISOString()
      };
      
      localStorage.setItem(`${this.storagePrefix}${this.userDataKey}`, JSON.stringify(updatedProfile));
      return updatedProfile;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  // Track user browsing behavior
  trackResourceView(resourceId, resource, timeSpent = 0) {
    try {
      const history = this.getBrowsingHistory();
      const viewRecord = {
        resourceId,
        title: resource.title,
        type: resource.type,
        category: resource.category,
        difficulty: resource.difficulty,
        author: resource.author,
        timestamp: new Date().toISOString(),
        timeSpent,
        rating: this.getUserRating(resourceId)
      };
      
      // Add to beginning of array and limit to last 100 views
      const updatedHistory = [viewRecord, ...history.slice(0, 99)];
      localStorage.setItem(`${this.storagePrefix}${this.browsingHistoryKey}`, JSON.stringify(updatedHistory));
      
      return updatedHistory;
    } catch (error) {
      console.error('Error tracking resource view:', error);
    }
  }

  // Get browsing history
  getBrowsingHistory() {
    try {
      const history = localStorage.getItem(`${this.storagePrefix}${this.browsingHistoryKey}`);
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('Error loading browsing history:', error);
      return [];
    }
  }

  // Get user rating for a resource
  getUserRating(resourceId) {
    try {
      const rating = localStorage.getItem(`${this.storagePrefix}user_rating_${resourceId}`);
      return rating ? parseInt(rating) : 0;
    } catch (error) {
      return 0;
    }
  }

  // Analyze user preferences from browsing history
  analyzeUserPreferences() {
    const history = this.getBrowsingHistory();
    const profile = this.getUserProfile();
    
    if (history.length === 0) {
      return this.getDefaultPreferences();
    }

    const analysis = {
      preferredTypes: {},
      preferredCategories: {},
      preferredDifficulties: {},
      preferredAuthors: {},
      averageRating: 0,
      totalViews: history.length,
      recentInterests: []
    };

    let totalRating = 0;
    let ratedItems = 0;

    // Analyze browsing patterns
    history.forEach(view => {
      // Content type preferences
      analysis.preferredTypes[view.type] = (analysis.preferredTypes[view.type] || 0) + 1;
      
      // Category preferences
      analysis.preferredCategories[view.category] = (analysis.preferredCategories[view.category] || 0) + 1;
      
      // Difficulty preferences
      if (view.difficulty) {
        analysis.preferredDifficulties[view.difficulty] = (analysis.preferredDifficulties[view.difficulty] || 0) + 1;
      }
      
      // Author preferences
      if (view.author) {
        analysis.preferredAuthors[view.author] = (analysis.preferredAuthors[view.author] || 0) + 1;
      }
      
      // Rating analysis
      if (view.rating > 0) {
        totalRating += view.rating;
        ratedItems++;
      }
    });

    // Calculate average rating
    analysis.averageRating = ratedItems > 0 ? totalRating / ratedItems : 0;

    // Get recent interests (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    analysis.recentInterests = history
      .filter(view => new Date(view.timestamp) > thirtyDaysAgo)
      .map(view => view.category)
      .reduce((acc, category) => {
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {});

    return analysis;
  }

  // Get default preferences
  getDefaultPreferences() {
    return {
      preferredTypes: { 'article': 5, 'video': 3, 'podcast': 2 },
      preferredCategories: { 'Nutrition': 4, 'Heart Health': 3, 'Brain Health': 3 },
      preferredDifficulties: { 'intermediate': 5, 'beginner': 3 },
      preferredAuthors: {},
      averageRating: 0,
      totalViews: 0,
      recentInterests: {}
    };
  }

  // Generate personalized recommendations
  generateRecommendations(resources, limit = 10) {
    try {
      const profile = this.getUserProfile();
      const preferences = this.analyzeUserPreferences();
      const history = this.getBrowsingHistory();
      const viewedResourceIds = new Set(history.map(h => h.resourceId));
      
      // Filter out already viewed resources
      const unviewedResources = resources.filter(resource => !viewedResourceIds.has(resource.id));
      
      if (unviewedResources.length === 0) {
        return resources.slice(0, limit); // Return top resources if all have been viewed
      }

      // Score each resource
      const scoredResources = unviewedResources.map(resource => ({
        ...resource,
        recommendationScore: this.calculateRecommendationScore(resource, profile, preferences)
      }));

      // Sort by recommendation score and return top results
      return scoredResources
        .sort((a, b) => b.recommendationScore - a.recommendationScore)
        .slice(0, limit);
        
    } catch (error) {
      console.error('Error generating recommendations:', error);
      return resources.slice(0, limit);
    }
  }

  // Calculate recommendation score for a resource
  calculateRecommendationScore(resource, profile, preferences) {
    let score = 0;
    
    // Base score from resource rating
    score += (resource.rating || 0) * 10;
    
    // Content type preference
    const typeWeight = preferences.preferredTypes[resource.type] || 0;
    score += typeWeight * 15;
    
    // Category preference
    const categoryWeight = preferences.preferredCategories[resource.category] || 0;
    score += categoryWeight * 20;
    
    // Difficulty matching
    if (resource.difficulty) {
      const difficultyWeight = preferences.preferredDifficulties[resource.difficulty] || 0;
      score += difficultyWeight * 10;
      
      // Bonus for matching user's preferred difficulty
      if (resource.difficulty === profile.difficultyPreference) {
        score += 25;
      }
    }
    
    // Author preference
    if (resource.author) {
      const authorWeight = preferences.preferredAuthors[resource.author] || 0;
      score += authorWeight * 8;
    }
    
    // Health goals alignment
    if (profile.healthGoals && profile.healthGoals.length > 0) {
      const resourceContent = `${resource.title} ${resource.description} ${resource.category}`.toLowerCase();
      profile.healthGoals.forEach(goal => {
        if (resourceContent.includes(goal.toLowerCase())) {
          score += 30;
        }
      });
    }
    
    // Health conditions alignment
    if (profile.healthConditions && profile.healthConditions.length > 0) {
      const resourceContent = `${resource.title} ${resource.description} ${resource.category}`.toLowerCase();
      profile.healthConditions.forEach(condition => {
        const conditionKeywords = this.getHealthConditionKeywords(condition);
        if (conditionKeywords.some(keyword => resourceContent.includes(keyword.toLowerCase()))) {
          score += 35;
        }
      });
    }
    
    // Reading time preference
    const estimatedTime = this.estimateReadingTime(resource);
    if (this.matchesReadingTimePreference(estimatedTime, profile.readingTimePreference)) {
      score += 15;
    }
    
    // Recency bonus (newer content gets slight boost)
    if (resource.publishDate) {
      const daysSincePublication = (Date.now() - new Date(resource.publishDate).getTime()) / (1000 * 60 * 60 * 24);
      if (daysSincePublication < 30) {
        score += 10;
      } else if (daysSincePublication < 90) {
        score += 5;
      }
    }
    
    // View count bonus (popular content)
    if (resource.views) {
      const viewBonus = Math.min(resource.views / 1000, 20); // Max 20 points
      score += viewBonus;
    }
    
    // Trending topics bonus
    const trendingTopics = this.getTrendingTopics();
    if (trendingTopics.includes(resource.category)) {
      score += 12;
    }
    
    return Math.max(0, score);
  }

  // Get health condition keywords
  getHealthConditionKeywords(condition) {
    const keywordMap = {
      'Heart Disease': ['heart', 'cardiac', 'cardiovascular', 'cholesterol', 'blood pressure'],
      'Diabetes': ['diabetes', 'blood sugar', 'glucose', 'insulin'],
      'Weight Management': ['weight', 'obesity', 'diet', 'nutrition', 'calories'],
      'Mental Health': ['mental', 'depression', 'anxiety', 'stress', 'mood'],
      'Brain Health': ['brain', 'cognitive', 'memory', 'alzheimer', 'focus'],
      'Digestive Health': ['digestive', 'gut', 'stomach', 'fiber', 'probiotics']
    };
    
    return keywordMap[condition] || [condition.toLowerCase()];
  }

  // Estimate reading time
  estimateReadingTime(resource) {
    if (resource.duration) {
      const match = resource.duration.match(/(\d+)/);
      return match ? parseInt(match[1]) : 5;
    }
    
    const typeEstimates = {
      'article': 7,
      'video': 12,
      'podcast': 25,
      'infographic': 3
    };
    
    return typeEstimates[resource.type?.toLowerCase()] || 7;
  }

  // Check if reading time matches user preference
  matchesReadingTimePreference(estimatedTime, preference) {
    switch (preference) {
      case 'quick':
        return estimatedTime <= 5;
      case 'medium':
        return estimatedTime > 5 && estimatedTime <= 15;
      case 'long':
        return estimatedTime > 15;
      default:
        return true;
    }
  }

  // Get trending topics based on recent user activity
  getTrendingTopics() {
    const history = this.getBrowsingHistory();
    const recentViews = history.filter(view => {
      const viewDate = new Date(view.timestamp);
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return viewDate > weekAgo;
    });
    
    const categoryCount = {};
    recentViews.forEach(view => {
      categoryCount[view.category] = (categoryCount[view.category] || 0) + 1;
    });
    
    return Object.entries(categoryCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([category]) => category);
  }

  // Get similar resources based on a specific resource
  getSimilarResources(targetResource, allResources, limit = 5) {
    try {
      const similarResources = allResources
        .filter(resource => resource.id !== targetResource.id)
        .map(resource => ({
          ...resource,
          similarityScore: this.calculateSimilarityScore(targetResource, resource)
        }))
        .sort((a, b) => b.similarityScore - a.similarityScore)
        .slice(0, limit);
        
      return similarResources;
    } catch (error) {
      console.error('Error finding similar resources:', error);
      return [];
    }
  }

  // Calculate similarity score between two resources
  calculateSimilarityScore(resource1, resource2) {
    let score = 0;
    
    // Category match
    if (resource1.category === resource2.category) {
      score += 50;
    }
    
    // Type match
    if (resource1.type === resource2.type) {
      score += 20;
    }
    
    // Difficulty match
    if (resource1.difficulty === resource2.difficulty) {
      score += 15;
    }
    
    // Author match
    if (resource1.author === resource2.author) {
      score += 25;
    }
    
    // Content similarity (basic keyword matching)
    const keywords1 = this.extractKeywords(resource1);
    const keywords2 = this.extractKeywords(resource2);
    const commonKeywords = keywords1.filter(keyword => keywords2.includes(keyword));
    score += commonKeywords.length * 5;
    
    return score;
  }

  // Extract keywords from resource
  extractKeywords(resource) {
    const text = `${resource.title} ${resource.description}`.toLowerCase();
    const words = text.split(/\W+/);
    
    // Filter out common words and return significant keywords
    const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'been', 'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should'];
    
    return words
      .filter(word => word.length > 3 && !stopWords.includes(word))
      .slice(0, 10); // Return top 10 keywords
  }

  // Get personalized dashboard data
  getDashboardRecommendations(resources) {
    try {
      const recommendations = this.generateRecommendations(resources, 6);
      const trending = this.getTrendingTopics();
      const recentlyViewed = this.getBrowsingHistory().slice(0, 5);
      const preferences = this.analyzeUserPreferences();
      
      return {
        forYou: recommendations,
        trending: trending,
        recentlyViewed: recentlyViewed,
        topCategories: Object.entries(preferences.preferredCategories)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([category]) => category),
        stats: {
          totalViewed: preferences.totalViews,
          averageRating: preferences.averageRating,
          favoriteType: Object.entries(preferences.preferredTypes)
            .sort((a, b) => b[1] - a[1])[0]?.[0] || 'article'
        }
      };
    } catch (error) {
      console.error('Error generating dashboard recommendations:', error);
      return {
        forYou: resources.slice(0, 6),
        trending: [],
        recentlyViewed: [],
        topCategories: [],
        stats: { totalViewed: 0, averageRating: 0, favoriteType: 'article' }
      };
    }
  }

  // Clear user data
  clearUserData() {
    try {
      localStorage.removeItem(`${this.storagePrefix}${this.userDataKey}`);
      localStorage.removeItem(`${this.storagePrefix}${this.browsingHistoryKey}`);
      localStorage.removeItem(`${this.storagePrefix}${this.preferencesKey}`);
      return true;
    } catch (error) {
      console.error('Error clearing user data:', error);
      return false;
    }
  }
}

// Create and export singleton instance
const recommendationService = new RecommendationService();
export default recommendationService;