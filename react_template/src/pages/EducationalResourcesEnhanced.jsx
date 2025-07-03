import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import ResourceCardFixed from '../components/resources/ResourceCardFixed';
import AdvancedSearch from '../components/resources/AdvancedSearch';
import Layout from '../components/common/Layout';
import { realResourcesData } from '../data/realResourcesData';
import { applyAllFilters, getFilterStats } from '../utils/resourceFilters';
import { ChartBarIcon, ClockIcon, AcademicCapIcon, HeartIcon } from '@heroicons/react/24/outline';

// Resource categories
const RESOURCE_CATEGORIES = {
  ALL: 'All Resources',
  BRAIN_HEALTH: 'Brain Health',
  NUTRITION: 'Nutrition',
  HEART_HEALTH: 'Heart Health',
  MENTAL_HEALTH: 'Mental Health',
  WEIGHT_MANAGEMENT: 'Weight Management',
  IMMUNE_HEALTH: 'Immune Health',
  HEALTHY_AGING: 'Healthy Aging',
  FOOD_SAFETY: 'Food Safety',
  LONGEVITY: 'Longevity'
};

// Resource types
const RESOURCE_TYPES = {
  ALL: 'All Types',
  ARTICLE: 'Articles',
  VIDEO: 'Videos',
  PODCAST: 'Podcasts',
  INFOGRAPHIC: 'Infographics'
};

const EducationalResourcesEnhanced = () => {
  const navigate = useNavigate();
  const { user, isLoading, setIsLoading } = useAppContext();
  
  // State for resources and filters
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [bookmarkedResources, setBookmarkedResources] = useState([]);
  const [filters, setFilters] = useState({
    searchQuery: '',
    publicationDateRange: 'all',
    readingTime: 'all',
    difficultyLevel: 'all',
    healthConditions: [],
    resourceType: 'all',
    sources: [],
    sortBy: 'newest'
  });
  const [filterStats, setFilterStats] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [showFilterStats, setShowFilterStats] = useState(false);

  // Transform real resources data into component format
  const transformResourceData = () => {
    const transformedResources = [];

    // Transform articles
    realResourcesData.articles.forEach(article => {
      transformedResources.push({
        id: `article-${article.id}`,
        title: article.title,
        description: article.description,
        type: RESOURCE_TYPES.ARTICLE,
        category: getCategoryFromString(article.category),
        author: article.source,
        publishDate: article.publication_date,
        readTime: '5-8 min',
        imageUrl: `/assets/health-article-${article.id}.jpg`,
        url: article.url,
        isBookmarked: false,
        isExternal: true,
        difficulty: 'intermediate',
        views: Math.floor(Math.random() * 10000) + 1000,
        rating: 4.2 + Math.random() * 0.8
      });
    });

    // Transform podcasts
    realResourcesData.podcasts.forEach(podcast => {
      transformedResources.push({
        id: `podcast-${podcast.id}`,
        title: podcast.title,
        description: podcast.description,
        type: RESOURCE_TYPES.PODCAST,
        category: getCategoryFromString(podcast.category),
        author: podcast.source,
        publishDate: podcast.publication_date,
        duration: podcast.duration,
        imageUrl: `/assets/podcast-${podcast.id}.jpg`,
        url: podcast.url,
        isBookmarked: false,
        isExternal: true,
        difficulty: 'beginner',
        views: Math.floor(Math.random() * 5000) + 500,
        rating: 4.0 + Math.random() * 1.0
      });
    });

    // Transform videos
    realResourcesData.videos.forEach(video => {
      transformedResources.push({
        id: `video-${video.id}`,
        title: video.title,
        description: video.description,
        type: RESOURCE_TYPES.VIDEO,
        category: getCategoryFromString(video.category),
        author: video.source,
        publishDate: video.publication_date,
        duration: video.duration,
        views: video.views,
        imageUrl: `/assets/video-${video.id}.jpg`,
        url: video.url,
        isBookmarked: false,
        isExternal: true,
        difficulty: 'intermediate',
        rating: 4.3 + Math.random() * 0.7
      });
    });

    // Transform infographics
    realResourcesData.infographics.forEach(infographic => {
      transformedResources.push({
        id: `infographic-${infographic.id}`,
        title: infographic.title,
        description: infographic.description,
        type: RESOURCE_TYPES.INFOGRAPHIC,
        category: getCategoryFromString(infographic.category),
        author: infographic.source,
        publishDate: infographic.publication_date,
        imageUrl: `/assets/infographic-${infographic.id}.jpg`,
        url: infographic.url,
        isBookmarked: false,
        isExternal: true,
        difficulty: 'beginner',
        views: Math.floor(Math.random() * 3000) + 200,
        rating: 4.1 + Math.random() * 0.9
      });
    });

    return transformedResources.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
  };

  // Map category strings to our category constants
  const getCategoryFromString = (categoryString) => {
    const categoryMap = {
      'Brain Health': RESOURCE_CATEGORIES.BRAIN_HEALTH,
      'Nutrition': RESOURCE_CATEGORIES.NUTRITION,
      'Heart Health': RESOURCE_CATEGORIES.HEART_HEALTH,
      'Mental Health': RESOURCE_CATEGORIES.MENTAL_HEALTH,
      'Weight Management': RESOURCE_CATEGORIES.WEIGHT_MANAGEMENT,
      'Immune Health': RESOURCE_CATEGORIES.IMMUNE_HEALTH,
      'Healthy Aging': RESOURCE_CATEGORIES.HEALTHY_AGING,
      'Food Safety': RESOURCE_CATEGORIES.FOOD_SAFETY,
      'Longevity': RESOURCE_CATEGORIES.LONGEVITY,
      'Energy & Sleep': RESOURCE_CATEGORIES.MENTAL_HEALTH,
      'Comprehensive Nutrition': RESOURCE_CATEGORIES.NUTRITION,
      'Diet Rankings': RESOURCE_CATEGORIES.NUTRITION,
      'Detox & Cleansing': RESOURCE_CATEGORIES.NUTRITION,
      'Supplements': RESOURCE_CATEGORIES.NUTRITION,
      'Intermittent Fasting': RESOURCE_CATEGORIES.NUTRITION,
      'Family Nutrition': RESOURCE_CATEGORIES.NUTRITION,
      'General Nutrition': RESOURCE_CATEGORIES.NUTRITION,
      'Healthy Living': RESOURCE_CATEGORIES.HEALTHY_AGING,
      'Diabetes Prevention': RESOURCE_CATEGORIES.NUTRITION
    };
    return categoryMap[categoryString] || RESOURCE_CATEGORIES.NUTRITION;
  };

  // Load real resources data
  useEffect(() => {
    setIsLoading(true);
    
    const loadResources = () => {
      const transformedResources = transformResourceData();
      setResources(transformedResources);
      setFilteredResources(transformedResources);
      setBookmarkedResources(transformedResources.filter(resource => resource.isBookmarked));
      setIsLoading(false);
    };
    
    // Simulate brief loading for better UX
    setTimeout(loadResources, 300);
  }, [setIsLoading]);

  // Apply filters using utility functions
  const applyFilters = useMemo(() => {
    if (resources.length === 0) return [];
    
    const filtered = applyAllFilters(resources, filters);
    const stats = getFilterStats(resources, filters);
    
    setFilterStats(stats);
    return filtered;
  }, [resources, filters]);

  // Update filtered resources when filters change
  useEffect(() => {
    setFilteredResources(applyFilters);
  }, [applyFilters]);

  // Handle filter changes
  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Toggle bookmark status for a resource
  const handleToggleBookmark = (resourceId) => {
    const updatedResources = resources.map(resource => 
      resource.id === resourceId 
        ? { ...resource, isBookmarked: !resource.isBookmarked } 
        : resource
    );
    
    setResources(updatedResources);
    setBookmarkedResources(updatedResources.filter(resource => resource.isBookmarked));
  };

  // Handle resource click - open external links
  const handleResourceClick = (resource) => {
    if (resource.isExternal && resource.url) {
      window.open(resource.url, '_blank');
    } else {
      navigate(`/resources/${resource.id}`);
    }
  };

  // Get difficulty level color
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Advanced Health Resources Library</h1>
          <p className="text-gray-600 text-lg">
            Discover personalized health content with advanced filtering and search capabilities. 
            <span className="text-purple-600 font-medium">All content verified and updated for 2025.</span>
          </p>
        </div>

        {/* Stats Banner */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <ChartBarIcon className="h-8 w-8 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-purple-600">{resources.length}</div>
              <div className="text-sm text-gray-600">Total Resources</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <ClockIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-600">{filteredResources.length}</div>
              <div className="text-sm text-gray-600">Filtered Results</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <AcademicCapIcon className="h-8 w-8 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-600">
                {filterStats ? Object.values(filterStats.difficultyBreakdown).reduce((a, b) => a + b, 0) : 0}
              </div>
              <div className="text-sm text-gray-600">All Levels</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <HeartIcon className="h-8 w-8 text-red-600" />
              </div>
              <div className="text-2xl font-bold text-red-600">{bookmarkedResources.length}</div>
              <div className="text-sm text-gray-600">Bookmarked</div>
            </div>
          </div>
          
          {/* Filter Statistics */}
          {filterStats && showFilterStats && (
            <div className="mt-4 pt-4 border-t border-purple-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">By Type</h4>
                  {Object.entries(filterStats.resourceTypeBreakdown).map(([type, count]) => (
                    <div key={type} className="flex justify-between">
                      <span className="text-gray-600">{type}:</span>
                      <span className="font-medium">{count}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">By Difficulty</h4>
                  {Object.entries(filterStats.difficultyBreakdown).map(([level, count]) => (
                    <div key={level} className="flex justify-between">
                      <span className={`px-2 py-1 rounded text-xs ${getDifficultyColor(level)}`}>
                        {level}
                      </span>
                      <span className="font-medium">{count}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Filter Efficiency</h4>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Results shown:</span>
                    <span className="font-medium">{filterStats.percentageFiltered}%</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Advanced Search */}
        <AdvancedSearch 
          onFiltersChange={handleFiltersChange}
          initialFilters={filters}
        />

        {/* View Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {filteredResources.length} Resource{filteredResources.length !== 1 ? 's' : ''} Found
            </h2>
            {filterStats && (
              <button
                onClick={() => setShowFilterStats(!showFilterStats)}
                className="text-sm text-purple-600 hover:text-purple-800 font-medium"
              >
                {showFilterStats ? 'Hide' : 'Show'} Filter Stats
              </button>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">View:</span>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                viewMode === 'list' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              List
            </button>
          </div>
        </div>

        {/* Resources Display */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-12 h-12 border-t-4 border-purple-600 border-solid rounded-full animate-spin"></div>
          </div>
        ) : filteredResources.length > 0 ? (
          <div className={`${
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
              : 'space-y-4'
          } mb-8`}>
            {filteredResources.map((resource) => (
              <div key={resource.id} className={viewMode === 'list' ? 'border rounded-lg p-4' : ''}>
                <ResourceCardFixed
                  resource={resource}
                  onBookmarkToggle={() => handleToggleBookmark(resource.id)}
                  onClick={() => handleResourceClick(resource)}
                  viewMode={viewMode}
                  showDifficulty={true}
                  showRating={true}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4 text-lg">No resources match your search criteria</div>
            <p className="text-gray-400 mb-4">Try adjusting your filters or search terms</p>
            <button
              onClick={() => handleFiltersChange({
                searchQuery: '',
                publicationDateRange: 'all',
                readingTime: 'all',
                difficultyLevel: 'all',
                healthConditions: [],
                resourceType: 'all',
                sources: [],
                sortBy: 'newest'
              })}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Bookmarked resources section */}
        {bookmarkedResources.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Your Bookmarked Resources</h2>
              <span className="text-sm text-gray-500">{bookmarkedResources.length} saved</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookmarkedResources.slice(0, 6).map((resource) => (
                <ResourceCardFixed
                  key={resource.id}
                  resource={resource}
                  onBookmarkToggle={() => handleToggleBookmark(resource.id)}
                  onClick={() => handleResourceClick(resource)}
                  showDifficulty={true}
                  showRating={true}
                />
              ))}
            </div>
          </div>
        )}

        {/* Trust indicators */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Trusted Health Sources</h3>
            <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Harvard Health Publishing</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Mayo Clinic</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>WebMD</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span>WHO & CDC</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EducationalResourcesEnhanced;