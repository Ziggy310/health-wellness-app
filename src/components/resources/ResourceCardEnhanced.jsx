import React, { useState, useEffect } from 'react';
import { 
  BookmarkIcon, 
  StarIcon, 
  ClockIcon, 
  EyeIcon,
  ShareIcon,
  ChatBubbleLeftIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import { 
  BookmarkIcon as BookmarkSolid, 
  StarIcon as StarSolid 
} from '@heroicons/react/24/solid';
import reviewService from '../../services/ReviewService';
import RatingAndReview from './RatingAndReview';
import OfflineToggle from './OfflineToggle';

const ResourceCardEnhanced = ({ 
  resource, 
  onBookmarkToggle, 
  onClick, 
  viewMode = 'grid',
  showDifficulty = true,
  showRating = true,
  showReviews = false,
  showOfflineToggle = true
}) => {
  const [isBookmarked, setIsBookmarked] = useState(resource.isBookmarked || false);
  const [userRating, setUserRating] = useState(0);
  const [reviewStats, setReviewStats] = useState({
    totalReviews: 0,
    averageRating: 0,
    distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  });
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isOfflineAvailable, setIsOfflineAvailable] = useState(false);

  // Load user rating and review stats
  useEffect(() => {
    const loadRatingData = () => {
      const userRatingData = reviewService.getUserRating(resource.id);
      const stats = reviewService.getReviewStats(resource.id);
      
      setUserRating(userRatingData);
      setReviewStats(stats);
    };
    
    loadRatingData();
  }, [resource.id]);

  // Handle bookmark toggle
  const handleBookmarkClick = (e) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
    if (onBookmarkToggle) {
      onBookmarkToggle(resource.id);
    }
  };

  // Handle rating change
  const handleRatingChange = (rating) => {
    setUserRating(rating);
    reviewService.setUserRating(resource.id, rating);
    // Refresh stats
    const stats = reviewService.getReviewStats(resource.id);
    setReviewStats(stats);
  };

  // Handle review submission
  const handleReviewSubmit = (review) => {
    reviewService.addReview(resource.id, review);
    // Refresh stats
    const stats = reviewService.getReviewStats(resource.id);
    setReviewStats(stats);
  };

  // Handle offline status change
  const handleOfflineStatusChange = (resourceId, isOffline) => {
    setIsOfflineAvailable(isOffline);
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get type color
  const getTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'article': return 'bg-blue-100 text-blue-800';
      case 'video': return 'bg-purple-100 text-purple-800';
      case 'podcast': return 'bg-green-100 text-green-800';
      case 'infographic': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Render star rating
  const renderStarRating = (rating, interactive = false, size = 'w-4 h-4') => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= rating;
          const StarComponent = isFilled ? StarSolid : StarIcon;
          
          return (
            <StarComponent
              key={star}
              className={`${size} ${
                isFilled ? 'text-yellow-400' : 'text-gray-300'
              } ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
              onClick={interactive ? () => handleRatingChange(star) : undefined}
            />
          );
        })}
      </div>
    );
  };

  // Format reading time
  const formatReadingTime = (resource) => {
    if (resource.duration) {
      return resource.duration;
    }
    if (resource.readTime) {
      return resource.readTime;
    }
    // Estimate based on type
    const estimates = {
      'article': '5-8 min',
      'video': '10-15 min',
      'podcast': '20-30 min',
      'infographic': '2-3 min'
    };
    return estimates[resource.type?.toLowerCase()] || '5 min';
  };

  if (viewMode === 'list') {
    return (
      <div className="flex bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
        {/* Image */}
        <div className="w-48 h-32 flex-shrink-0 bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
          <AcademicCapIcon className="w-12 h-12 text-purple-600" />
        </div>
        
        {/* Content */}
        <div className="flex-1 p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-2 cursor-pointer hover:text-purple-600 transition-colors"
                  onClick={() => onClick && onClick(resource)}>
                {resource.title}
              </h3>
              
              {/* Meta Info */}
              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                <span className="flex items-center space-x-1">
                  <ClockIcon className="w-4 h-4" />
                  <span>{formatReadingTime(resource)}</span>
                </span>
                
                {resource.views && (
                  <span className="flex items-center space-x-1">
                    <EyeIcon className="w-4 h-4" />
                    <span>{resource.views.toLocaleString()} views</span>
                  </span>
                )}
                
                {showRating && reviewStats.totalReviews > 0 && (
                  <div className="flex items-center space-x-1">
                    {renderStarRating(reviewStats.averageRating)}
                    <span>({reviewStats.totalReviews})</span>
                  </div>
                )}
              </div>
              
              {/* Description */}
              <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                {resource.description}
              </p>
              
              {/* Tags */}
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(resource.type)}`}>
                  {resource.type}
                </span>
                
                {showDifficulty && resource.difficulty && (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(resource.difficulty)}`}>
                    {resource.difficulty}
                  </span>
                )}
                
                {isOfflineAvailable && (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Offline Available
                  </span>
                )}
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex items-center space-x-2 ml-4">
              <button
                onClick={() => setShowReviewModal(true)}
                className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                title="Reviews"
              >
                <ChatBubbleLeftIcon className="w-5 h-5" />
              </button>
              
              <button
                onClick={handleBookmarkClick}
                className={`p-2 rounded-lg transition-colors ${
                  isBookmarked 
                    ? 'text-purple-600 bg-purple-50' 
                    : 'text-gray-400 hover:text-purple-600 hover:bg-purple-50'
                }`}
                title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
              >
                {isBookmarked ? (
                  <BookmarkSolid className="w-5 h-5" />
                ) : (
                  <BookmarkIcon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
          
          {/* Offline Toggle in List View */}
          {showOfflineToggle && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <OfflineToggle 
                resource={resource} 
                onOfflineStatusChange={handleOfflineStatusChange}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <>
      <div 
        className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all duration-200 ${
          isHovered ? 'shadow-lg transform -translate-y-1' : 'hover:shadow-md'
        } cursor-pointer`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => onClick && onClick(resource)}
      >
        {/* Image */}
        <div className="relative h-48 bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
          <AcademicCapIcon className="w-16 h-16 text-purple-600" />
          
          {/* Bookmark Button */}
          <button
            onClick={handleBookmarkClick}
            className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 ${
              isBookmarked 
                ? 'bg-purple-600 text-white shadow-lg' 
                : 'bg-white/80 text-gray-600 hover:bg-white hover:text-purple-600'
            }`}
            title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
          >
            {isBookmarked ? (
              <BookmarkSolid className="w-5 h-5" />
            ) : (
              <BookmarkIcon className="w-5 h-5" />
            )}
          </button>
          
          {/* Type Badge */}
          <div className="absolute top-3 left-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(resource.type)}`}>
              {resource.type}
            </span>
          </div>
          
          {/* Offline Available Badge */}
          {isOfflineAvailable && (
            <div className="absolute bottom-3 left-3">
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 flex items-center space-x-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Offline</span>
              </span>
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="p-4">
          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 hover:text-purple-600 transition-colors">
            {resource.title}
          </h3>
          
          {/* Description */}
          <p className="text-gray-600 text-sm line-clamp-3 mb-3">
            {resource.description}
          </p>
          
          {/* Meta Info */}
          <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
            <div className="flex items-center space-x-3">
              <span className="flex items-center space-x-1">
                <ClockIcon className="w-4 h-4" />
                <span>{formatReadingTime(resource)}</span>
              </span>
              
              {resource.views && (
                <span className="flex items-center space-x-1">
                  <EyeIcon className="w-4 h-4" />
                  <span>{resource.views.toLocaleString()}</span>
                </span>
              )}
            </div>
            
            {showDifficulty && resource.difficulty && (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(resource.difficulty)}`}>
                {resource.difficulty}
              </span>
            )}
          </div>
          
          {/* Rating and Actions */}
          <div className="flex items-center justify-between mb-3">
            {/* Rating */}
            {showRating && (
              <div className="flex items-center space-x-2">
                {userRating > 0 ? (
                  <div className="flex items-center space-x-1">
                    {renderStarRating(userRating, true)}
                    <span className="text-xs text-gray-500">Your rating</span>
                  </div>
                ) : reviewStats.totalReviews > 0 ? (
                  <div className="flex items-center space-x-1">
                    {renderStarRating(reviewStats.averageRating)}
                    <span className="text-xs text-gray-500">({reviewStats.totalReviews})</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1">
                    {renderStarRating(0, true)}
                    <span className="text-xs text-gray-500">Rate this</span>
                  </div>
                )}
              </div>
            )}
            
            {/* Actions */}
            <div className="flex items-center space-x-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowReviewModal(true);
                }}
                className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                title="Reviews"
              >
                <ChatBubbleLeftIcon className="w-4 h-4" />
                {reviewStats.totalReviews > 0 && (
                  <span className="text-xs ml-1">{reviewStats.totalReviews}</span>
                )}
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle share functionality
                }}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Share"
              >
                <ShareIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {/* Offline Toggle in Grid View */}
          {showOfflineToggle && (
            <div className="border-t border-gray-100 pt-3">
              <OfflineToggle 
                resource={resource} 
                onOfflineStatusChange={handleOfflineStatusChange}
              />
            </div>
          )}
          
          {/* Author/Source */}
          {resource.author && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                By <span className="font-medium">{resource.author}</span>
                {resource.publishDate && (
                  <span className="ml-2">
                    • {new Date(resource.publishDate).toLocaleDateString()}
                  </span>
                )}
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] w-full overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  {resource.title}
                </h2>
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                >
                  <span className="sr-only">Close</span>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <RatingAndReview
                resource={resource}
                onRatingChange={handleRatingChange}
                onReviewSubmit={handleReviewSubmit}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ResourceCardEnhanced;