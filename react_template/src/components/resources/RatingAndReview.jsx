import React, { useState, useEffect } from 'react';
import { StarIcon, PencilSquareIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutline, UserCircleIcon } from '@heroicons/react/24/outline';

const RatingAndReview = ({ resource, onRatingChange, onReviewSubmit }) => {
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, highest, lowest, helpful

  // Load existing reviews and user rating from localStorage
  useEffect(() => {
    const savedReviews = localStorage.getItem(`reviews_${resource.id}`);
    const savedUserRating = localStorage.getItem(`user_rating_${resource.id}`);
    
    if (savedReviews) {
      setReviews(JSON.parse(savedReviews));
    }
    
    if (savedUserRating) {
      setUserRating(parseInt(savedUserRating));
    }
  }, [resource.id]);

  // Calculate average rating
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : resource.rating || 0;

  // Get rating distribution
  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[review.rating]++;
    });
    return distribution;
  };

  // Handle star click for rating
  const handleStarClick = (rating) => {
    setUserRating(rating);
    localStorage.setItem(`user_rating_${resource.id}`, rating.toString());
    if (onRatingChange) {
      onRatingChange(rating);
    }
  };

  // Handle review submission
  const handleReviewSubmit = async () => {
    if (!reviewText.trim() || userRating === 0) return;
    
    setIsSubmitting(true);
    
    const newReview = {
      id: Date.now().toString(),
      rating: userRating,
      text: reviewText.trim(),
      author: 'Current User', // In real app, get from auth context
      date: new Date().toISOString(),
      helpful: 0,
      verified: true,
      avatar: null
    };
    
    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);
    localStorage.setItem(`reviews_${resource.id}`, JSON.stringify(updatedReviews));
    
    // Reset form
    setReviewText('');
    setIsWritingReview(false);
    setIsSubmitting(false);
    
    if (onReviewSubmit) {
      onReviewSubmit(newReview);
    }
  };

  // Sort reviews
  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.date) - new Date(a.date);
      case 'oldest':
        return new Date(a.date) - new Date(b.date);
      case 'highest':
        return b.rating - a.rating;
      case 'lowest':
        return a.rating - b.rating;
      case 'helpful':
        return b.helpful - a.helpful;
      default:
        return new Date(b.date) - new Date(a.date);
    }
  });

  // Handle helpful vote
  const handleHelpfulVote = (reviewId) => {
    const updatedReviews = reviews.map(review => 
      review.id === reviewId 
        ? { ...review, helpful: review.helpful + 1 }
        : review
    );
    setReviews(updatedReviews);
    localStorage.setItem(`reviews_${resource.id}`, JSON.stringify(updatedReviews));
  };

  // Render star rating
  const renderStarRating = (rating, interactive = false, size = 'w-5 h-5') => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= (interactive ? (hoverRating || rating) : rating);
          const StarComponent = isFilled ? StarIcon : StarOutline;
          
          return (
            <button
              key={star}
              className={`${
                interactive 
                  ? 'hover:scale-110 transition-transform cursor-pointer' 
                  : 'cursor-default'
              } ${isFilled ? 'text-yellow-400' : 'text-gray-300'}`}
              onClick={() => interactive && handleStarClick(star)}
              onMouseEnter={() => interactive && setHoverRating(star)}
              onMouseLeave={() => interactive && setHoverRating(0)}
              disabled={!interactive}
            >
              <StarComponent className={size} />
            </button>
          );
        })}
      </div>
    );
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const distribution = getRatingDistribution();
  const totalReviews = reviews.length;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mt-4">
      {/* Rating Overview */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Ratings & Reviews</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-3xl font-bold text-gray-800">
                {averageRating.toFixed(1)}
              </span>
              {renderStarRating(Math.round(averageRating))}
            </div>
            <div className="text-sm text-gray-600">
              Based on {totalReviews} review{totalReviews !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
        
        {/* Quick Action Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={() => setIsWritingReview(!isWritingReview)}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <PencilSquareIcon className="w-4 h-4" />
            <span>Write Review</span>
          </button>
        </div>
      </div>

      {/* Rating Distribution */}
      {totalReviews > 0 && (
        <div className="mb-6">
          <h4 className="font-medium text-gray-700 mb-3">Rating Distribution</h4>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((stars) => (
              <div key={stars} className="flex items-center space-x-3">
                <div className="flex items-center space-x-1 w-16">
                  <span className="text-sm text-gray-600">{stars}</span>
                  <StarIcon className="w-4 h-4 text-yellow-400" />
                </div>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-400 transition-all duration-300"
                    style={{ 
                      width: totalReviews > 0 ? `${(distribution[stars] / totalReviews) * 100}%` : '0%' 
                    }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-8">
                  {distribution[stars]}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* User Rating Section */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-700 mb-3">Rate this resource</h4>
        <div className="flex items-center space-x-4">
          {renderStarRating(userRating, true, 'w-6 h-6')}
          {userRating > 0 && (
            <span className="text-sm text-gray-600">
              You rated this {userRating} star{userRating !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      {/* Write Review Form */}
      {isWritingReview && (
        <div className="mb-6 p-4 border border-gray-200 rounded-lg">
          <h4 className="font-medium text-gray-700 mb-3">Write your review</h4>
          
          {userRating === 0 && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                Please rate this resource first before writing a review.
              </p>
            </div>
          )}
          
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Share your thoughts about this resource. How helpful was it? What did you learn?"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            rows={4}
            maxLength={500}
          />
          
          <div className="flex items-center justify-between mt-3">
            <span className="text-sm text-gray-500">
              {reviewText.length}/500 characters
            </span>
            
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setIsWritingReview(false);
                  setReviewText('');
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReviewSubmit}
                disabled={!reviewText.trim() || userRating === 0 || isSubmitting}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <CheckIcon className="w-4 h-4" />
                )}
                <span>{isSubmitting ? 'Submitting...' : 'Submit Review'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      {totalReviews > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-700">
              Reviews ({totalReviews})
            </h4>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm border border-gray-300 rounded px-3 py-1 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="highest">Highest rated</option>
              <option value="lowest">Lowest rated</option>
              <option value="helpful">Most helpful</option>
            </select>
          </div>
          
          <div className="space-y-4">
            {(showAllReviews ? sortedReviews : sortedReviews.slice(0, 3)).map((review) => (
              <div key={review.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <UserCircleIcon className="w-10 h-10 text-gray-400" />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-800">{review.author}</span>
                        {review.verified && (
                          <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                            Verified
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        {renderStarRating(review.rating)}
                        <span className="text-sm text-gray-500">
                          {formatDate(review.date)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-3">{review.text}</p>
                
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => handleHelpfulVote(review.id)}
                    className="flex items-center space-x-1 text-sm text-gray-600 hover:text-purple-600 transition-colors"
                  >
                    <span>👍</span>
                    <span>Helpful ({review.helpful})</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {totalReviews > 3 && (
            <div className="text-center mt-4">
              <button
                onClick={() => setShowAllReviews(!showAllReviews)}
                className="text-purple-600 hover:text-purple-800 font-medium transition-colors"
              >
                {showAllReviews ? 'Show Less' : `Show All ${totalReviews} Reviews`}
              </button>
            </div>
          )}
        </div>
      )}

      {totalReviews === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p className="mb-2">No reviews yet</p>
          <p className="text-sm">Be the first to share your thoughts about this resource!</p>
        </div>
      )}
    </div>
  );
};

export default RatingAndReview;