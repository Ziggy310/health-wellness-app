import React, { useState, useEffect } from 'react';

const ResourceFilterEnhanced = ({
  categories,
  types,
  selectedCategory,
  selectedType,
  showBookmarkedOnly,
  searchQuery,
  onCategoryChange,
  onTypeChange,
  onBookmarkToggle,
  onSearchChange,
  onDateRangeChange,
  onHealthTopicChange,
  resources
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedHealthTopics, setSelectedHealthTopics] = useState([]);
  const [availableHealthTopics, setAvailableHealthTopics] = useState([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Extract unique health topics from resources
  useEffect(() => {
    if (resources && resources.length > 0) {
      const allTopics = new Set();
      resources.forEach(resource => {
        if (resource.healthTopics) {
          resource.healthTopics.forEach(topic => allTopics.add(topic));
        }
      });
      setAvailableHealthTopics(Array.from(allTopics).sort());
    }
  }, [resources]);

  const handleDateRangeChange = (field, value) => {
    const newDateRange = { ...dateRange, [field]: value };
    setDateRange(newDateRange);
    onDateRangeChange(newDateRange);
  };

  const handleHealthTopicToggle = (topic) => {
    const updatedTopics = selectedHealthTopics.includes(topic)
      ? selectedHealthTopics.filter(t => t !== topic)
      : [...selectedHealthTopics, topic];
    
    setSelectedHealthTopics(updatedTopics);
    onHealthTopicChange(updatedTopics);
  };

  const clearAllFilters = () => {
    onSearchChange('');
    onCategoryChange(categories[0]);
    onTypeChange(types[0]);
    setDateRange({ start: '', end: '' });
    setSelectedHealthTopics([]);
    onDateRangeChange({ start: '', end: '' });
    onHealthTopicChange([]);
    if (showBookmarkedOnly) {
      onBookmarkToggle();
    }
  };

  const hasActiveFilters = () => {
    return searchQuery ||
           selectedCategory !== categories[0] ||
           selectedType !== types[0] ||
           dateRange.start ||
           dateRange.end ||
           selectedHealthTopics.length > 0 ||
           showBookmarkedOnly;
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (searchQuery) count++;
    if (selectedCategory !== categories[0]) count++;
    if (selectedType !== types[0]) count++;
    if (dateRange.start || dateRange.end) count++;
    if (selectedHealthTopics.length > 0) count += selectedHealthTopics.length;
    if (showBookmarkedOnly) count++;
    return count;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 sm:p-6">
      {/* Search Bar */}
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search resources by title, author, or content..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Quick Actions Row */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        {/* Bookmarks Toggle */}
        <button
          onClick={onBookmarkToggle}
          className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium transition-colors ${
            showBookmarkedOnly
              ? 'bg-purple-100 text-purple-800 border-2 border-purple-300'
              : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill={showBookmarkedOnly ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          Bookmarked Only
        </button>

        {/* Mobile Filters Toggle */}
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="sm:hidden inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
          </svg>
          Filters
          {hasActiveFilters() && (
            <span className="ml-1 bg-purple-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
              {getActiveFilterCount()}
            </span>
          )}
        </button>

        {/* Desktop Advanced Filters Toggle */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="hidden sm:inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 mr-2 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          Advanced Filters
          {hasActiveFilters() && (
            <span className="ml-2 bg-purple-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
              {getActiveFilterCount()}
            </span>
          )}
        </button>

        {/* Clear Filters */}
        {hasActiveFilters() && (
          <button
            onClick={clearAllFilters}
            className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Clear All
          </button>
        )}
      </div>

      {/* Basic Filters Row - Always Visible on Desktop */}
      <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
          <select
            value={selectedType}
            onChange={(e) => onTypeChange(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
          >
            {types.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Date Range - Start */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => handleDateRangeChange('start', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
          />
        </div>

        {/* Date Range - End */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => handleDateRangeChange('end', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
          />
        </div>
      </div>

      {/* Mobile Filters - Collapsible */}
      {showMobileFilters && (
        <div className="sm:hidden space-y-4 mb-4 p-4 bg-gray-50 rounded-lg">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
            <select
              value={selectedType}
              onChange={(e) => onTypeChange(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {types.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => handleDateRangeChange('start', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => handleDateRangeChange('end', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Advanced Filters - Desktop Expandable */}
      {(isExpanded || showMobileFilters) && (
        <div className={`${showMobileFilters ? 'sm:hidden' : 'hidden sm:block'} space-y-4 pt-4 border-t border-gray-200`}>
          {/* Health Topics */}
          {availableHealthTopics.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Health Topics ({selectedHealthTopics.length} selected)
              </label>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {availableHealthTopics.map((topic) => (
                  <button
                    key={topic}
                    onClick={() => handleHealthTopicToggle(topic)}
                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      selectedHealthTopics.includes(topic)
                        ? 'bg-purple-100 text-purple-800 border-2 border-purple-300'
                        : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
                    }`}
                  >
                    {topic}
                    {selectedHealthTopics.includes(topic) && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Active Filters Summary */}
      {hasActiveFilters() && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Active filters:</span>
            
            {searchQuery && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Search: "{searchQuery}"
                <button
                  onClick={() => onSearchChange('')}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
            
            {selectedCategory !== categories[0] && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {selectedCategory}
                <button
                  onClick={() => onCategoryChange(categories[0])}
                  className="ml-1 text-green-600 hover:text-green-800"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
            
            {selectedType !== types[0] && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                {selectedType}
                <button
                  onClick={() => onTypeChange(types[0])}
                  className="ml-1 text-purple-600 hover:text-purple-800"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
            
            {showBookmarkedOnly && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Bookmarked Only
                <button
                  onClick={onBookmarkToggle}
                  className="ml-1 text-yellow-600 hover:text-yellow-800"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
            
            {selectedHealthTopics.map((topic) => (
              <span key={topic} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                {topic}
                <button
                  onClick={() => handleHealthTopicToggle(topic)}
                  className="ml-1 text-red-600 hover:text-red-800"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceFilterEnhanced;