import React, { useState, useEffect } from 'react';
import { ChevronDownIcon, XMarkIcon, FunnelIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const AdvancedSearch = ({ onFiltersChange, initialFilters = {} }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState({
    searchQuery: '',
    publicationDateRange: 'all', // all, last7days, last30days, last6months, lastyear
    readingTime: 'all', // all, quick (1-5min), medium (5-15min), long (15min+)
    difficultyLevel: 'all', // all, beginner, intermediate, advanced
    healthConditions: [], // array of selected conditions
    resourceType: 'all', // all, article, video, podcast, infographic
    sources: [], // array of selected sources
    sortBy: 'newest', // newest, oldest, mostRelevant, mostPopular
    ...initialFilters
  });

  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  // Health conditions options
  const healthConditions = [
    'Heart Disease', 'Diabetes', 'High Blood Pressure', 'Obesity',
    'Mental Health', 'Brain Health', 'Digestive Health', 'Immune System',
    'Arthritis', 'Osteoporosis', 'Sleep Disorders', 'Stress Management',
    'Women\'s Health', 'Men\'s Health', 'Aging', 'Cancer Prevention'
  ];

  // Source options
  const sources = [
    'Harvard Health Publishing', 'Mayo Clinic', 'WebMD', 'WHO',
    'CDC', 'American Heart Association', 'NIH', 'Johns Hopkins',
    'Cleveland Clinic', 'Nutrition.gov'
  ];

  // Calculate active filters count
  useEffect(() => {
    let count = 0;
    if (filters.searchQuery) count++;
    if (filters.publicationDateRange !== 'all') count++;
    if (filters.readingTime !== 'all') count++;
    if (filters.difficultyLevel !== 'all') count++;
    if (filters.healthConditions.length > 0) count++;
    if (filters.resourceType !== 'all') count++;
    if (filters.sources.length > 0) count++;
    if (filters.sortBy !== 'newest') count++;
    setActiveFiltersCount(count);
  }, [filters]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  // Handle array filter changes
  const handleArrayFilterChange = (key, item, checked) => {
    const currentArray = filters[key];
    let newArray;
    if (checked) {
      newArray = [...currentArray, item];
    } else {
      newArray = currentArray.filter(i => i !== item);
    }
    const newFilters = { ...filters, [key]: newArray };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  // Clear all filters
  const clearAllFilters = () => {
    const clearedFilters = {
      searchQuery: '',
      publicationDateRange: 'all',
      readingTime: 'all',
      difficultyLevel: 'all',
      healthConditions: [],
      resourceType: 'all',
      sources: [],
      sortBy: 'newest'
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 shadow-sm">
      {/* Search Bar */}
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search health resources by title, topic, or author..."
          value={filters.searchQuery}
          onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
        />
      </div>

      {/* Filter Toggle Button */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors"
        >
          <FunnelIcon className="h-5 w-5" />
          <span className="font-medium">Advanced Filters</span>
          {activeFiltersCount > 0 && (
            <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2 py-1 rounded-full">
              {activeFiltersCount}
            </span>
          )}
          <ChevronDownIcon className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </button>
        
        {activeFiltersCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-gray-500 hover:text-red-600 transition-colors"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="space-y-6 pt-4 border-t border-gray-100">
          {/* Quick Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Publication Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Publication Date
              </label>
              <select
                value={filters.publicationDateRange}
                onChange={(e) => handleFilterChange('publicationDateRange', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
              >
                <option value="all">All time</option>
                <option value="last7days">Last 7 days</option>
                <option value="last30days">Last 30 days</option>
                <option value="last6months">Last 6 months</option>
                <option value="lastyear">Last year</option>
              </select>
            </div>

            {/* Reading Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reading Time
              </label>
              <select
                value={filters.readingTime}
                onChange={(e) => handleFilterChange('readingTime', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
              >
                <option value="all">Any length</option>
                <option value="quick">Quick read (1-5 min)</option>
                <option value="medium">Medium read (5-15 min)</option>
                <option value="long">Long read (15+ min)</option>
              </select>
            </div>

            {/* Difficulty Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty Level
              </label>
              <select
                value={filters.difficultyLevel}
                onChange={(e) => handleFilterChange('difficultyLevel', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
              >
                <option value="all">All levels</option>
                <option value="beginner">Beginner friendly</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="mostRelevant">Most relevant</option>
                <option value="mostPopular">Most popular</option>
              </select>
            </div>
          </div>

          {/* Health Conditions Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Health Conditions & Topics
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {healthConditions.map((condition) => (
                <label key={condition} className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={filters.healthConditions.includes(condition)}
                    onChange={(e) => handleArrayFilterChange('healthConditions', condition, e.target.checked)}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-gray-700">{condition}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Sources Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Trusted Sources
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
              {sources.map((source) => (
                <label key={source} className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={filters.sources.includes(source)}
                    onChange={(e) => handleArrayFilterChange('sources', source, e.target.checked)}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-gray-700">{source}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Resource Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Resource Type
            </label>
            <div className="flex flex-wrap gap-2">
              {['all', 'article', 'video', 'podcast', 'infographic'].map((type) => (
                <button
                  key={type}
                  onClick={() => handleFilterChange('resourceType', type)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    filters.resourceType === type
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex flex-wrap gap-2">
            {filters.searchQuery && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Search: {filters.searchQuery}
                <button
                  onClick={() => handleFilterChange('searchQuery', '')}
                  className="ml-2 hover:text-purple-600"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.publicationDateRange !== 'all' && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Date: {filters.publicationDateRange.replace('last', 'Last ').replace('days', ' days').replace('months', ' months').replace('year', ' year')}
                <button
                  onClick={() => handleFilterChange('publicationDateRange', 'all')}
                  className="ml-2 hover:text-blue-600"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.readingTime !== 'all' && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Reading: {filters.readingTime === 'quick' ? 'Quick (1-5 min)' : filters.readingTime === 'medium' ? 'Medium (5-15 min)' : 'Long (15+ min)'}
                <button
                  onClick={() => handleFilterChange('readingTime', 'all')}
                  className="ml-2 hover:text-green-600"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.healthConditions.map((condition) => (
              <span key={condition} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                {condition}
                <button
                  onClick={() => handleArrayFilterChange('healthConditions', condition, false)}
                  className="ml-2 hover:text-orange-600"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedSearch;