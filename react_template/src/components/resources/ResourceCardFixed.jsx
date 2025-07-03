import React, { useState, useEffect } from 'react';
import BookmarkModal from '../bookmarks/BookmarkModal';
import bookmarkService from '../../services/BookmarkService';

const ResourceCardFixed = ({ resource, onBookmarkToggle, onClick }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showBookmarkModal, setShowBookmarkModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if resource is bookmarked
    const bookmarked = bookmarkService.isBookmarked(resource.id);
    setIsBookmarked(bookmarked);
  }, [resource.id]);

  const handleBookmarkClick = (e) => {
    e.stopPropagation();
    if (isBookmarked) {
      // If already bookmarked, remove it directly
      handleRemoveBookmark();
    } else {
      // If not bookmarked, show modal to add it
      setShowBookmarkModal(true);
    }
  };

  const handleRemoveBookmark = async () => {
    setIsLoading(true);
    try {
      const success = bookmarkService.removeBookmark(resource.id);
      if (success) {
        setIsBookmarked(false);
        onBookmarkToggle?.(resource.id, false);
      }
    } catch (error) {
      console.error('Error removing bookmark:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookmarkChange = (resourceId, bookmarked) => {
    setIsBookmarked(bookmarked);
    onBookmarkToggle?.(resourceId, bookmarked);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Articles':
        return '📄';
      case 'Videos':
        return '🎥';
      case 'Podcasts':
        return '🎙️';
      case 'Infographics':
        return '📊';
      default:
        return '📄';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Articles':
        return 'bg-blue-100 text-blue-800';
      case 'Videos':
        return 'bg-red-100 text-red-800';
      case 'Podcasts':
        return 'bg-green-100 text-green-800';
      case 'Infographics':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const truncateText = (text, maxLength = 120) => {
    if (!text || text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group">
        <div className="relative">
          {/* Card Header with Type Badge */}
          <div className="p-4 pb-2">
            <div className="flex items-start justify-between mb-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(resource.type)}`}>
                <span className="mr-1">{getTypeIcon(resource.type)}</span>
                {resource.type}
              </span>
              
              {/* Bookmark Button */}
              <button
                onClick={handleBookmarkClick}
                disabled={isLoading}
                className={`p-1.5 rounded-full transition-all duration-200 ${
                  isBookmarked 
                    ? 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
              >
                {isLoading ? (
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4" 
                    fill={isBookmarked ? 'currentColor' : 'none'} 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                    strokeWidth={isBookmarked ? 0 : 2}
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" 
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Card Content */}
          <div className="px-4 pb-4" onClick={() => onClick?.(resource)}>
            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors duration-200">
              {resource.title}
            </h3>

            {/* Author and Date */}
            <div className="flex items-center text-sm text-gray-600 mb-3">
              <span className="font-medium">{resource.author}</span>
              {resource.publishDate && (
                <>
                  <span className="mx-2">•</span>
                  <span>{formatDate(resource.publishDate)}</span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-700 text-sm mb-4 line-clamp-3">
              {truncateText(resource.description)}
            </p>

            {/* Health Topics Tags */}
            {resource.healthTopics && resource.healthTopics.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-4">
                {resource.healthTopics.slice(0, 3).map((topic, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700"
                  >
                    {topic}
                  </span>
                ))}
                {resource.healthTopics.length > 3 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                    +{resource.healthTopics.length - 3} more
                  </span>
                )}
              </div>
            )}

            {/* Footer with additional info */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-3">
                {resource.readTime && (
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {resource.readTime}
                  </span>
                )}
                {resource.duration && (
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    {resource.duration}
                  </span>
                )}
                {resource.views && (
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    {resource.views}
                  </span>
                )}
              </div>
              
              {/* External Link Indicator */}
              {resource.isExternal && (
                <span className="flex items-center text-purple-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  External
                </span>
              )}
            </div>
          </div>

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-purple-50 opacity-0 group-hover:opacity-10 transition-opacity duration-200 rounded-lg pointer-events-none" />
        </div>
      </div>

      {/* Bookmark Modal */}
      <BookmarkModal
        isOpen={showBookmarkModal}
        onClose={() => setShowBookmarkModal(false)}
        resource={resource}
        onBookmarkChange={handleBookmarkChange}
      />
    </>
  );
};

export default ResourceCardFixed;