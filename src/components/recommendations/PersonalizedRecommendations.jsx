import React, { useState, useEffect } from 'react';
import { 
  SparklesIcon, 
  TrendingUpIcon,
  ClockIcon,
  HeartIcon,
  AdjustmentsHorizontalIcon,
  UserCircleIcon,
  ChartBarIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';
import ResourceCardEnhanced from '../resources/ResourceCardEnhanced';
import recommendationService from '../../services/RecommendationService';

const PersonalizedRecommendations = ({ resources, onResourceClick, onBookmarkToggle }) => {
  const [dashboardData, setDashboardData] = useState({
    forYou: [],
    trending: [],
    recentlyViewed: [],
    topCategories: [],
    stats: { totalViewed: 0, averageRating: 0, favoriteType: 'article' }
  });
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [activeTab, setActiveTab] = useState('forYou');

  // Load recommendation data
  useEffect(() => {
    const loadRecommendations = async () => {
      setIsLoading(true);
      
      try {
        // Get user profile
        const profile = recommendationService.getUserProfile();
        setUserProfile(profile);
        
        // Check if user needs to set up profile
        const needsSetup = !profile.healthGoals || profile.healthGoals.length === 0;
        setShowProfileSetup(needsSetup);
        
        // Get dashboard recommendations
        const dashboard = recommendationService.getDashboardRecommendations(resources);
        setDashboardData(dashboard);
        
      } catch (error) {
        console.error('Error loading recommendations:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (resources.length > 0) {
      loadRecommendations();
    }
  }, [resources]);

  // Handle resource view tracking
  const handleResourceClick = (resource) => {
    recommendationService.trackResourceView(resource.id, resource);
    if (onResourceClick) {
      onResourceClick(resource);
    }
  };

  // Get category icon
  const getCategoryIcon = (category) => {
    const icons = {
      'Brain Health': '🧠',
      'Heart Health': '❤️',
      'Nutrition': '🥗',
      'Mental Health': '🧘',
      'Weight Management': '⚖️',
      'Immune Health': '🛡️',
      'Healthy Aging': '🌱',
      'Food Safety': '🔒',
      'Longevity': '⏳'
    };
    return icons[category] || '📚';
  };

  // Profile Setup Modal
  const ProfileSetupModal = () => {
    const [setupData, setSetupData] = useState({
      healthGoals: [],
      healthConditions: [],
      dietaryPreferences: [],
      fitnessLevel: 'beginner',
      ageRange: '25-34',
      readingTimePreference: 'medium',
      difficultyPreference: 'intermediate',
      preferredContentTypes: ['article']
    });

    const healthGoalOptions = [
      'Lose Weight', 'Build Muscle', 'Improve Heart Health', 'Better Sleep',
      'Reduce Stress', 'Boost Energy', 'Improve Brain Function', 'Better Digestion',
      'Stronger Immune System', 'Healthy Aging', 'Manage Chronic Condition'
    ];

    const healthConditionOptions = [
      'Heart Disease', 'Diabetes', 'High Blood Pressure', 'Obesity',
      'Mental Health', 'Brain Health', 'Digestive Health', 'Arthritis',
      'Osteoporosis', 'Sleep Disorders', 'Chronic Pain'
    ];

    const handleSetupSubmit = () => {
      recommendationService.updateUserProfile(setupData);
      setUserProfile({ ...userProfile, ...setupData });
      setShowProfileSetup(false);
      
      // Refresh recommendations
      const dashboard = recommendationService.getDashboardRecommendations(resources);
      setDashboardData(dashboard);
    };

    const toggleArrayItem = (array, item, setArray) => {
      if (array.includes(item)) {
        setArray(array.filter(i => i !== item));
      } else {
        setArray([...array, item]);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Personalize Your Experience</h2>
                <p className="text-gray-600">Help us recommend the best health resources for you</p>
              </div>
              <SparklesIcon className="w-8 h-8 text-purple-600" />
            </div>
            
            <div className="space-y-6">
              {/* Health Goals */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  What are your health goals? (Select all that apply)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {healthGoalOptions.map(goal => (
                    <button
                      key={goal}
                      onClick={() => toggleArrayItem(setupData.healthGoals, goal, 
                        (newGoals) => setSetupData({...setupData, healthGoals: newGoals}))}
                      className={`p-3 text-sm rounded-lg border transition-colors ${
                        setupData.healthGoals.includes(goal)
                          ? 'bg-purple-100 border-purple-300 text-purple-800'
                          : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {goal}
                    </button>
                  ))}
                </div>
              </div>

              {/* Health Conditions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Do you have any health conditions you'd like to focus on?
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {healthConditionOptions.map(condition => (
                    <button
                      key={condition}
                      onClick={() => toggleArrayItem(setupData.healthConditions, condition,
                        (newConditions) => setSetupData({...setupData, healthConditions: newConditions}))}
                      className={`p-3 text-sm rounded-lg border transition-colors ${
                        setupData.healthConditions.includes(condition)
                          ? 'bg-blue-100 border-blue-300 text-blue-800'
                          : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {condition}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preferences */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reading Time Preference
                  </label>
                  <select
                    value={setupData.readingTimePreference}
                    onChange={(e) => setSetupData({...setupData, readingTimePreference: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="quick">Quick reads (1-5 min)</option>
                    <option value="medium">Medium reads (5-15 min)</option>
                    <option value="long">Long reads (15+ min)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content Difficulty
                  </label>
                  <select
                    value={setupData.difficultyPreference}
                    onChange={(e) => setSetupData({...setupData, difficultyPreference: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="beginner">Beginner friendly</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              {/* Content Types */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Preferred Content Types
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {['article', 'video', 'podcast', 'infographic'].map(type => (
                    <button
                      key={type}
                      onClick={() => toggleArrayItem(setupData.preferredContentTypes, type,
                        (newTypes) => setSetupData({...setupData, preferredContentTypes: newTypes}))}
                      className={`p-3 text-sm rounded-lg border transition-colors capitalize ${
                        setupData.preferredContentTypes.includes(type)
                          ? 'bg-green-100 border-green-300 text-green-800'
                          : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setShowProfileSetup(false)}
                className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Skip for now
              </button>
              <button
                onClick={handleSetupSubmit}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-12 h-12 border-t-4 border-purple-600 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Profile Setup Modal */}
      {showProfileSetup && <ProfileSetupModal />}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center space-x-2">
            <SparklesIcon className="w-6 h-6 text-purple-600" />
            <span>Personalized for You</span>
          </h2>
          <p className="text-gray-600">
            Recommendations based on your health goals and reading preferences
          </p>
        </div>
        
        <button
          onClick={() => setShowProfileSetup(true)}
          className="flex items-center space-x-2 px-4 py-2 text-purple-600 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors"
        >
          <AdjustmentsHorizontalIcon className="w-4 h-4" />
          <span>Customize</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-purple-100 to-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <BookOpenIcon className="w-8 h-8 text-purple-600" />
            <div>
              <div className="text-2xl font-bold text-purple-600">{dashboardData.stats.totalViewed}</div>
              <div className="text-sm text-purple-600">Resources Read</div>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-yellow-100 to-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <StarIcon className="w-8 h-8 text-yellow-600" />
            <div>
              <div className="text-2xl font-bold text-yellow-600">
                {dashboardData.stats.averageRating.toFixed(1)}
              </div>
              <div className="text-sm text-yellow-600">Avg Rating</div>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-100 to-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <TrendingUpIcon className="w-8 h-8 text-green-600" />
            <div>
              <div className="text-lg font-bold text-green-600 capitalize">
                {dashboardData.stats.favoriteType}
              </div>
              <div className="text-sm text-green-600">Favorite Type</div>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-100 to-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <HeartIcon className="w-8 h-8 text-blue-600" />
            <div>
              <div className="text-lg font-bold text-blue-600">
                {dashboardData.topCategories[0] || 'Nutrition'}
              </div>
              <div className="text-sm text-blue-600">Top Interest</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'forYou', label: 'For You', icon: SparklesIcon },
          { id: 'trending', label: 'Trending', icon: TrendingUpIcon },
          { id: 'recent', label: 'Recently Viewed', icon: ClockIcon }
        ].map(tab => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <IconComponent className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content Sections */}
      {activeTab === 'forYou' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Recommended for You</h3>
            <span className="text-sm text-gray-500">
              {dashboardData.forYou.length} personalized recommendations
            </span>
          </div>
          
          {dashboardData.forYou.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dashboardData.forYou.map(resource => (
                <div key={resource.id} className="relative">
                  <ResourceCardEnhanced
                    resource={resource}
                    onClick={handleResourceClick}
                    onBookmarkToggle={onBookmarkToggle}
                    showDifficulty={true}
                    showRating={true}
                  />
                  {resource.recommendationScore && (
                    <div className="absolute top-2 left-2 bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                      {Math.round(resource.recommendationScore)}% match
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <UserCircleIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-800 mb-2">Start Building Your Profile</h4>
              <p className="text-gray-600 mb-4">
                Answer a few questions to get personalized recommendations
              </p>
              <button
                onClick={() => setShowProfileSetup(true)}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Set Up Profile
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'trending' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Trending Topics</h3>
            <span className="text-sm text-gray-500">Popular this week</span>
          </div>
          
          {dashboardData.trending.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
              {dashboardData.trending.map(topic => (
                <div key={topic} className="bg-white border border-gray-200 rounded-lg p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
                  <div className="text-2xl mb-2">{getCategoryIcon(topic)}</div>
                  <div className="text-sm font-medium text-gray-800">{topic}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <TrendingUpIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p>No trending topics yet. Start reading to see what's popular!</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'recent' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Recently Viewed</h3>
            <span className="text-sm text-gray-500">
              {dashboardData.recentlyViewed.length} recent items
            </span>
          </div>
          
          {dashboardData.recentlyViewed.length > 0 ? (
            <div className="space-y-4">
              {dashboardData.recentlyViewed.map(item => (
                <div key={item.resourceId} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800 mb-1">{item.title}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center space-x-1">
                          <span className="capitalize">{item.type}</span>
                        </span>
                        <span>{item.category}</span>
                        <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                      </div>
                    </div>
                    {item.rating > 0 && (
                      <div className="flex items-center space-x-1 ml-4">
                        <StarIcon className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm text-gray-600">{item.rating}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <ClockIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p>No recent activity. Start exploring resources to build your history!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PersonalizedRecommendations;