import React, { useState, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  ShareIcon,
  BookmarkIcon,
  StarIcon,
  EyeIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';

import ResourceCardEnhanced from '../components/resources/ResourceCardEnhanced';
import AdvancedSearch from '../components/resources/AdvancedSearch';
import PersonalizedRecommendations from '../components/recommendations/PersonalizedRecommendations';
import SocialShareModal from '../components/sharing/SocialShareModal';

import { realResourcesData } from '../data/realResourcesData';
import { filterResources } from '../utils/resourceFilters';
import reviewService from '../services/ReviewService';
import recommendationService from '../services/RecommendationService';
import sharingService from '../services/SharingService';

const EducationalResourcesWithSharing = () => {
  const [resources, setResources] = useState(realResourcesData);
  const [filteredResources, setFilteredResources] = useState(realResourcesData);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [activeView, setActiveView] = useState('all'); // 'all', 'recommendations', 'bookmarked', 'trending'
  const [bookmarkedResources, setBookmarkedResources] = useState(new Set());
  const [shareModal, setShareModal] = useState({ isOpen: false, resource: null, context: 'general' });
  const [sharingStats, setSharingStats] = useState({});
  const [sortBy, setSortBy] = useState('relevance'); // 'relevance', 'date', 'rating', 'shares'
  const [isLoading, setIsLoading] = useState(false);

  // Load bookmarked resources and sharing stats on component mount
  useEffect(() => {
    const loadBookmarks = () => {
      try {
        const bookmarks = JSON.parse(localStorage.getItem('bookmarked_resources') || '[]');
        setBookmarkedResources(new Set(bookmarks));
      } catch (error) {
        console.error('Error loading bookmarks:', error);
      }
    };

    const loadSharingStats = () => {
      try {
        const stats = {};
        realResourcesData.forEach(resource => {
          stats[resource.id] = sharingService.getResourceShareStats(resource.id);
        });
        setSharingStats(stats);
      } catch (error) {
        console.error('Error loading sharing stats:', error);
      }
    };

    loadBookmarks();
    loadSharingStats();
  }, []);

  // Handle search and filtering
  useEffect(() => {
    setIsLoading(true);
    
    setTimeout(() => {
      let filtered = resources;
      
      // Apply search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(resource =>
          resource.title.toLowerCase().includes(query) ||
          resource.description.toLowerCase().includes(query) ||
          resource.category.toLowerCase().includes(query) ||
          resource.author?.toLowerCase().includes(query)
        );
      }
      
      // Apply view filter
      if (activeView === 'bookmarked') {
        filtered = filtered.filter(resource => bookmarkedResources.has(resource.id));
      } else if (activeView === 'trending') {
        const trendingIds = sharingService.getTrendingShares(7, 20).map(item => item.resourceId);
        filtered = filtered.filter(resource => trendingIds.includes(resource.id));
      }
      
      // Apply sorting
      filtered = sortResources(filtered, sortBy);
      
      setFilteredResources(filtered);
      setIsLoading(false);
    }, 300);
  }, [searchQuery, resources, activeView, bookmarkedResources, sortBy]);

  // Sort resources based on selected criteria
  const sortResources = (resourceList, criteria) => {
    const sorted = [...resourceList];
    
    switch (criteria) {
      case 'date':
        return sorted.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
      case 'rating':
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'shares':
        return sorted.sort((a, b) => 
          (sharingStats[b.id]?.totalShares || 0) - (sharingStats[a.id]?.totalShares || 0)
        );
      case 'relevance':
      default:
        // Use recommendation score if available, otherwise use rating
        return sorted.sort((a, b) => {
          const scoreA = a.recommendationScore || a.rating || 0;
          const scoreB = b.recommendationScore || b.rating || 0;
          return scoreB - scoreA;
        });
    }
  };

  // Handle advanced search
  const handleAdvancedSearch = (filters) => {
    setIsLoading(true);
    
    setTimeout(() => {
      const filtered = filterResources(realResourcesData, filters);
      setResources(filtered);
      setShowAdvancedSearch(false);
      setIsLoading(false);
    }, 500);
  };

  // Handle bookmark toggle
  const handleBookmarkToggle = (resourceId) => {
    const newBookmarks = new Set(bookmarkedResources);
    
    if (newBookmarks.has(resourceId)) {
      newBookmarks.delete(resourceId);
    } else {
      newBookmarks.add(resourceId);
    }
    
    setBookmarkedResources(newBookmarks);
    localStorage.setItem('bookmarked_resources', JSON.stringify([...newBookmarks]));
  };

  // Handle resource click (track view)
  const handleResourceClick = (resource) => {
    recommendationService.trackResourceView(resource.id, resource);
    // In a real app, this would navigate to the resource detail page
    console.log('Viewing resource:', resource.title);
  };

  // Handle share button click
  const handleShareClick = (resource, context = 'general') => {
    setShareModal({ isOpen: true, resource, context });
  };

  // Handle share modal close
  const handleShareModalClose = () => {
    setShareModal({ isOpen: false, resource: null, context: 'general' });
    
    // Refresh sharing stats
    if (shareModal.resource) {
      const updatedStats = sharingService.getResourceShareStats(shareModal.resource.id);
      setSharingStats(prev => ({
        ...prev,
        [shareModal.resource.id]: updatedStats
      }));
    }
  };

  // Get view statistics
  const getViewStats = () => {
    const totalResources = realResourcesData.length;
    const bookmarkedCount = bookmarkedResources.size;
    const globalStats = sharingService.getGlobalStats();
    
    return {
      total: totalResources,
      filtered: filteredResources.length,
      bookmarked: bookmarkedCount,
      totalShares: globalStats.totalShares
    };
  };

  const stats = getViewStats();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Health Resources</h1>
                <p className="mt-2 text-gray-600">
                  Discover, bookmark, and share evidence-based health information
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-500">
                  <span className="font-medium">{stats.filtered}</span> of {stats.total} resources
                </div>
                <button
                  onClick={() => setShowAdvancedSearch(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <AdjustmentsHorizontalIcon className="w-4 h-4" />
                  <span>Filters</span>
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search resources by title, author, or topic..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center justify-between mt-6">
              <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                {[
                  { id: 'all', label: 'All Resources', count: stats.total },
                  { id: 'recommendations', label: 'For You', icon: '✨' },
                  { id: 'bookmarked', label: 'Bookmarked', count: stats.bookmarked, icon: '🔖' },
                  { id: 'trending', label: 'Trending', icon: '🔥' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveView(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeView === tab.id
                        ? 'bg-white text-purple-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    {tab.icon && <span>{tab.icon}</span>}
                    <span>{tab.label}</span>
                    {tab.count !== undefined && (
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        activeView === tab.id
                          ? 'bg-purple-100 text-purple-600'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Sort Options */}
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="relevance">Relevance</option>
                  <option value="date">Newest First</option>
                  <option value="rating">Highest Rated</option>
                  <option value="shares">Most Shared</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeView === 'recommendations' ? (
          <PersonalizedRecommendations
            resources={realResourcesData}
            onResourceClick={handleResourceClick}
            onBookmarkToggle={handleBookmarkToggle}
          />
        ) : (
          <div>
            {/* Stats Bar */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <EyeIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <div className="text-2xl font-bold text-gray-900">{stats.filtered}</div>
                    <div className="text-sm text-gray-600">Resources Available</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <BookmarkIcon className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <div className="text-2xl font-bold text-gray-900">{stats.bookmarked}</div>
                    <div className="text-sm text-gray-600">Bookmarked</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <ShareIcon className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <div className="text-2xl font-bold text-gray-900">{stats.totalShares}</div>
                    <div className="text-sm text-gray-600">Total Shares</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <StarIcon className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <div className="text-2xl font-bold text-gray-900">
                      {(filteredResources.reduce((sum, r) => sum + (r.rating || 0), 0) / filteredResources.length || 0).toFixed(1)}
                    </div>
                    <div className="text-sm text-gray-600">Avg Rating</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-t-4 border-purple-600 border-solid rounded-full animate-spin"></div>
                <span className="ml-3 text-gray-600">Loading resources...</span>
              </div>
            )}

            {/* Resources Grid */}
            {!isLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources.map(resource => (
                  <div key={resource.id} className="relative group">
                    <ResourceCardEnhanced
                      resource={{
                        ...resource,
                        isBookmarked: bookmarkedResources.has(resource.id),
                        shareCount: sharingStats[resource.id]?.totalShares || 0,
                        topSharePlatform: sharingStats[resource.id]?.topPlatform
                      }}
                      onClick={handleResourceClick}
                      onBookmarkToggle={handleBookmarkToggle}
                      onShare={(resource, context) => handleShareClick(resource, context)}
                      showDifficulty={true}
                      showRating={true}
                      showSharing={true}
                    />
                    
                    {/* Share Button Overlay */}
                    <button
                      onClick={() => handleShareClick(resource, 'quick_share')}
                      className="absolute top-3 right-3 p-2 bg-white bg-opacity-90 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-opacity-100 hover:shadow-lg"
                      title="Share this resource"
                    >
                      <ShareIcon className="w-4 h-4 text-gray-600 hover:text-purple-600" />
                    </button>
                    
                    {/* Share Count Badge */}
                    {sharingStats[resource.id]?.totalShares > 0 && (
                      <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        {sharingStats[resource.id].totalShares} shares
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!isLoading && filteredResources.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
                  <ChartBarIcon className="w-full h-full" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No resources found
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery 
                    ? `No resources match "${searchQuery}". Try adjusting your search terms.`
                    : 'No resources available for the selected filters.'
                  }
                </p>
                <div className="space-x-4">
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Clear Search
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setActiveView('all');
                      setResources(realResourcesData);
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Advanced Search Modal */}
      {showAdvancedSearch && (
        <AdvancedSearch
          onSearch={handleAdvancedSearch}
          onClose={() => setShowAdvancedSearch(false)}
        />
      )}

      {/* Social Share Modal */}
      <SocialShareModal
        isOpen={shareModal.isOpen}
        onClose={handleShareModalClose}
        resource={shareModal.resource}
        shareContext={shareModal.context}
        userRecommendation={
          shareModal.resource?.recommendationScore 
            ? { score: shareModal.resource.recommendationScore }
            : null
        }
      />
    </div>
  );
};

export default EducationalResourcesWithSharing;