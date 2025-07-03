import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import ResourceCardFixed from '../components/resources/ResourceCardFixed';
import ResourceFilter from '../components/resources/ResourceFilter';
import Layout from '../components/common/Layout';
import { userProvidedResources } from '../data/userProvidedResources';

// Resource categories
const RESOURCE_CATEGORIES = {
  ALL: 'All Resources',
  MENOPAUSE_RESEARCH: 'Menopause Research',
  CLINICAL_GUIDELINES: 'Clinical Guidelines',
  NUTRITION_HEALTH: 'Nutrition & Health',
  EXPERT_INTERVIEWS: 'Expert Interviews',
  MEDICAL_EDUCATION: 'Medical Education',
  PATIENT_EDUCATION: 'Patient Education',
  HEALTHCARE_ACCESS: 'Healthcare Access',
  TREATMENT_OPTIONS: 'Treatment Options'
};

// Resource types with color coding
const RESOURCE_TYPES = {
  ALL: { label: 'All Types', color: 'gray' },
  ARTICLE: { label: 'Articles', color: 'blue' },
  VIDEO: { label: 'Videos', color: 'red' },
  PODCAST: { label: 'Podcasts', color: 'orange' }
};

const EducationalResources = () => {
  const navigate = useNavigate();
  const { user, isLoading, setIsLoading } = useAppContext();
  
  // State for resources and filters
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [bookmarkedResources, setBookmarkedResources] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(RESOURCE_CATEGORIES.ALL);
  const [selectedType, setSelectedType] = useState(RESOURCE_TYPES.ALL.label);
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Transform user provided resources data into component format
  const transformUserProvidedData = () => {
    const transformedResources = [];

    // Transform articles
    userProvidedResources.articles.forEach(article => {
      transformedResources.push({
        id: `article-${article.id}`,
        title: article.title,
        description: article.description,
        type: RESOURCE_TYPES.ARTICLE.label,
        category: getCategoryFromString(article.category),
        author: article.source,
        source: article.source,
        publishDate: article.publication_date,
        readTime: '5-8 min read',
        imageUrl: article.thumbnail || `/assets/health-article-${article.id}.jpg`,
        url: article.url,
        isBookmarked: false,
        isExternal: true,
        colorScheme: RESOURCE_TYPES.ARTICLE.color
      });
    });

    // Transform videos
    userProvidedResources.videos.forEach(video => {
      transformedResources.push({
        id: `video-${video.id}`,
        title: video.title,
        description: video.description,
        type: RESOURCE_TYPES.VIDEO.label,
        category: getCategoryFromString(video.category),
        author: video.creator_credentials || video.source,
        source: video.source,
        publishDate: video.publication_date,
        duration: video.duration,
        imageUrl: video.thumbnail || `/assets/health-video-${video.id}.jpg`,
        url: video.url,
        isBookmarked: false,
        isExternal: true,
        colorScheme: RESOURCE_TYPES.VIDEO.color
      });
    });

    // Transform podcasts
    userProvidedResources.podcasts.forEach(podcast => {
      transformedResources.push({
        id: `podcast-${podcast.id}`,
        title: podcast.title,
        description: podcast.description,
        type: RESOURCE_TYPES.PODCAST.label,
        category: getCategoryFromString(podcast.category),
        author: podcast.host_credentials || podcast.source,
        source: podcast.source,
        publishDate: podcast.publication_date,
        duration: podcast.duration,
        frequency: 'Weekly',
        imageUrl: podcast.thumbnail || `/assets/health-podcast-${podcast.id}.jpg`,
        url: podcast.url,
        isBookmarked: false,
        isExternal: true,
        colorScheme: RESOURCE_TYPES.PODCAST.color
      });
    });

    // Transform infographics
    userProvidedResources.infographics.forEach(infographic => {
      transformedResources.push({
        id: `infographic-${infographic.id}`,
        title: infographic.title,
        description: infographic.description,
        type: RESOURCE_TYPES.ARTICLE.label, // Treat as articles for display
        category: getCategoryFromString(infographic.category),
        author: infographic.source,
        source: infographic.source,
        publishDate: infographic.publication_date,
        readTime: 'Visual guide',
        imageUrl: infographic.thumbnail || `/assets/health-infographic-${infographic.id}.jpg`,
        url: infographic.url,
        isBookmarked: false,
        isExternal: true,
        colorScheme: RESOURCE_TYPES.ARTICLE.color
      });
    });

    return transformedResources.sort((a, b) => {
      // Sort by publication date, most recent first
      const dateStrA = a.publishDate || '2024-01-01';
      const dateStrB = b.publishDate || '2024-01-01';
      const dateA = new Date(dateStrA.includes('2025') ? '2025-01-01' : dateStrA.includes('2024') ? '2024-01-01' : '2023-01-01');
      const dateB = new Date(dateStrB.includes('2025') ? '2025-01-01' : dateStrB.includes('2024') ? '2024-01-01' : '2023-01-01');
      return dateB - dateA;
    });
  };

  // Map category strings to our category constants
  const getCategoryFromString = (categoryString) => {
    const categoryMap = {
      'Brain Health': RESOURCE_CATEGORIES.NUTRITION_HEALTH,
      'Nutrition': RESOURCE_CATEGORIES.NUTRITION_HEALTH,
      'Heart Health': RESOURCE_CATEGORIES.CLINICAL_GUIDELINES,
      'Weight Management': RESOURCE_CATEGORIES.TREATMENT_OPTIONS,
      'Mental Health': RESOURCE_CATEGORIES.PATIENT_EDUCATION,
      'Inflammation': RESOURCE_CATEGORIES.CLINICAL_GUIDELINES,
      'Digestive Health': RESOURCE_CATEGORIES.MEDICAL_EDUCATION,
      'Disease Prevention': RESOURCE_CATEGORIES.CLINICAL_GUIDELINES,
      'Functional Medicine': RESOURCE_CATEGORIES.EXPERT_INTERVIEWS,
      'Sports Nutrition': RESOURCE_CATEGORIES.NUTRITION_HEALTH,
      'Women\'s Health': RESOURCE_CATEGORIES.TREATMENT_OPTIONS,
      'Longevity': RESOURCE_CATEGORIES.MEDICAL_EDUCATION,
      'Behavioral Health': RESOURCE_CATEGORIES.PATIENT_EDUCATION,
      'Plant-Based Nutrition': RESOURCE_CATEGORIES.NUTRITION_HEALTH,
      'Metabolic Health': RESOURCE_CATEGORIES.CLINICAL_GUIDELINES,
      'Immune Health': RESOURCE_CATEGORIES.MEDICAL_EDUCATION,
      'Intermittent Fasting': RESOURCE_CATEGORIES.TREATMENT_OPTIONS,
      'Family Nutrition': RESOURCE_CATEGORIES.PATIENT_EDUCATION,
      'General Nutrition': RESOURCE_CATEGORIES.NUTRITION_HEALTH,
      'Global Health': RESOURCE_CATEGORIES.CLINICAL_GUIDELINES,
      'Government Guidelines': RESOURCE_CATEGORIES.CLINICAL_GUIDELINES,
      'Healthy Living': RESOURCE_CATEGORIES.PATIENT_EDUCATION,
      'Diabetes Prevention': RESOURCE_CATEGORIES.TREATMENT_OPTIONS
    };
    return categoryMap[categoryString] || RESOURCE_CATEGORIES.NUTRITION_HEALTH;
  };

  // Load user provided resources data
  useEffect(() => {
    setIsLoading(true);
    
    const loadResources = () => {
      const transformedResources = transformUserProvidedData();
      setResources(transformedResources);
      setFilteredResources(transformedResources);
      setBookmarkedResources(transformedResources.filter(resource => resource.isBookmarked));
      setIsLoading(false);
    };
    
    // Simulate brief loading for better UX
    setTimeout(loadResources, 300);
  }, [setIsLoading]);

  // Filter resources based on search, category, type, and bookmarks
  useEffect(() => {
    let results = resources;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        resource => 
          resource.title.toLowerCase().includes(query) || 
          resource.description.toLowerCase().includes(query) ||
          (resource.author && resource.author.toLowerCase().includes(query)) ||
          (resource.source && resource.source.toLowerCase().includes(query))
      );
    }

    // Filter by category
    if (selectedCategory !== RESOURCE_CATEGORIES.ALL) {
      results = results.filter(resource => resource.category === selectedCategory);
    }

    // Filter by type
    if (selectedType !== RESOURCE_TYPES.ALL.label) {
      results = results.filter(resource => resource.type === selectedType);
    }

    // Filter bookmarked only
    if (showBookmarkedOnly) {
      results = results.filter(resource => resource.isBookmarked);
    }

    setFilteredResources(results);
  }, [searchQuery, selectedCategory, selectedType, showBookmarkedOnly, resources]);

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
      window.open(resource.url, '_blank', 'noopener,noreferrer');
    } else {
      // Fallback for internal resources
      navigate(`/resources/${resource.id}`);
    }
  };

  // Get resource counts by type
  const getResourceCounts = () => {
    const articles = resources.filter(r => r.type === RESOURCE_TYPES.ARTICLE.label).length;
    const videos = resources.filter(r => r.type === RESOURCE_TYPES.VIDEO.label).length;
    const podcasts = resources.filter(r => r.type === RESOURCE_TYPES.PODCAST.label).length;
    return { articles, videos, podcasts };
  };

  const counts = getResourceCounts();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Your Curated Health & Nutrition Resources</h1>
          <p className="text-gray-600 text-lg">
            Your personally selected collection of trusted health resources from Harvard Health, Mayo Clinic, WebMD, WHO, CDC and leading medical professionals. 
            <span className="text-purple-600 font-medium">All content verified and updated for 2024-2025.</span>
          </p>
        </div>

        {/* Featured Experts Banner */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Featured Expert Authors</h3>
          <div className="flex flex-wrap gap-2 text-sm">
            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">Dr. Michael Greger M.D.</span>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">Dr. Mark Hyman M.D.</span>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">Dr. Neal Barnard M.D.</span>
            <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full">Dr. David Sinclair Ph.D.</span>
            <span className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full">Dr. Sara Gottfried M.D.</span>
          </div>
        </div>

        {/* Stats Banner with Color Coding */}
        <div className="bg-gradient-to-r from-blue-50 via-red-50 to-orange-50 border border-gray-200 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{counts.articles}</div>
                <div className="text-sm text-gray-600">Research Articles</div>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <div>
                <div className="text-2xl font-bold text-red-600">{counts.videos}</div>
                <div className="text-sm text-gray-600">Expert Videos</div>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
              <div>
                <div className="text-2xl font-bold text-orange-600">{counts.podcasts}</div>
                <div className="text-sm text-gray-600">Health Podcasts</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-6">
          {/* Search input */}
          <div className={`relative mb-4 transition-all duration-200 ${isSearchFocused ? 'ring-2 ring-purple-300 rounded-lg' : ''}`}>
            <input
              type="text"
              placeholder="Search menopause resources by title, author, or source..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {/* Filters */}
          <ResourceFilter
            categories={Object.values(RESOURCE_CATEGORIES)}
            types={Object.values(RESOURCE_TYPES).map(type => type.label)}
            selectedCategory={selectedCategory}
            selectedType={selectedType}
            showBookmarkedOnly={showBookmarkedOnly}
            onCategoryChange={setSelectedCategory}
            onTypeChange={setSelectedType}
            onBookmarkToggle={() => setShowBookmarkedOnly(!showBookmarkedOnly)}
          />
        </div>

        {/* Resources grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-12 h-12 border-t-4 border-purple-600 border-solid rounded-full animate-spin"></div>
          </div>
        ) : filteredResources.length > 0 ? (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {filteredResources.length} Resource{filteredResources.length !== 1 ? 's' : ''} Found
              </h2>
              <div className="text-sm text-gray-500">
                Last updated: {userProvidedResources.metadata?.extracted_from || 'December 2024'}
              </div>
            </div>
            
            {/* Color-coded legend */}
            <div className="flex flex-wrap gap-4 mb-6 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">📄 Articles</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-600">🎥 Videos</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-sm text-gray-600">🎙️ Podcasts</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {filteredResources.map((resource) => (
                <ResourceCardFixed
                  key={resource.id}
                  resource={resource}
                  onBookmarkToggle={() => handleToggleBookmark(resource.id)}
                  onClick={() => handleResourceClick(resource)}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-2">No resources match your criteria</div>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory(RESOURCE_CATEGORIES.ALL);
                setSelectedType(RESOURCE_TYPES.ALL.label);
                setShowBookmarkedOnly(false);
              }}
              className="text-purple-600 hover:text-purple-800 font-medium"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Bookmarked resources section - only show if there are bookmarks */}
        {!showBookmarkedOnly && bookmarkedResources.length > 0 && (
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Bookmarked Resources</h2>
              <button
                onClick={() => setShowBookmarkedOnly(true)}
                className="text-purple-600 hover:text-purple-800 text-sm font-medium"
              >
                See all bookmarks
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookmarkedResources.slice(0, 3).map((resource) => (
                <ResourceCardFixed
                  key={resource.id}
                  resource={resource}
                  onBookmarkToggle={() => handleToggleBookmark(resource.id)}
                  onClick={() => handleResourceClick(resource)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Trust indicators */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Trusted Health & Nutrition Sources</h3>
            <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Harvard Health Publishing</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Mayo Clinic</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>WebMD</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span>World Health Organization</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span>Centers for Disease Control</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                <span>Healthline</span>
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              All resources verified • External links open in new tabs • Your curated collection from conversation history
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EducationalResources;