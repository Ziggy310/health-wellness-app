// Service for managing resource reviews and ratings

class ReviewService {
  constructor() {
    this.storagePrefix = 'health_resources_';
  }

  // Get all reviews for a resource
  getReviews(resourceId) {
    try {
      const reviews = localStorage.getItem(`${this.storagePrefix}reviews_${resourceId}`);
      return reviews ? JSON.parse(reviews) : [];
    } catch (error) {
      console.error('Error loading reviews:', error);
      return [];
    }
  }

  // Add a new review
  addReview(resourceId, review) {
    try {
      const reviews = this.getReviews(resourceId);
      const newReview = {
        id: Date.now().toString(),
        ...review,
        date: new Date().toISOString(),
        helpful: 0,
        verified: true
      };
      
      const updatedReviews = [newReview, ...reviews];
      localStorage.setItem(`${this.storagePrefix}reviews_${resourceId}`, JSON.stringify(updatedReviews));
      
      // Update resource rating
      this.updateResourceRating(resourceId, updatedReviews);
      
      return newReview;
    } catch (error) {
      console.error('Error adding review:', error);
      throw error;
    }
  }

  // Update review helpfulness
  markReviewHelpful(resourceId, reviewId) {
    try {
      const reviews = this.getReviews(resourceId);
      const updatedReviews = reviews.map(review => 
        review.id === reviewId 
          ? { ...review, helpful: review.helpful + 1 }
          : review
      );
      
      localStorage.setItem(`${this.storagePrefix}reviews_${resourceId}`, JSON.stringify(updatedReviews));
      return updatedReviews;
    } catch (error) {
      console.error('Error marking review helpful:', error);
      throw error;
    }
  }

  // Get user's rating for a resource
  getUserRating(resourceId) {
    try {
      const rating = localStorage.getItem(`${this.storagePrefix}user_rating_${resourceId}`);
      return rating ? parseInt(rating) : 0;
    } catch (error) {
      console.error('Error loading user rating:', error);
      return 0;
    }
  }

  // Set user's rating for a resource
  setUserRating(resourceId, rating) {
    try {
      localStorage.setItem(`${this.storagePrefix}user_rating_${resourceId}`, rating.toString());
      
      // Update overall resource rating
      const reviews = this.getReviews(resourceId);
      this.updateResourceRating(resourceId, reviews);
      
      return rating;
    } catch (error) {
      console.error('Error setting user rating:', error);
      throw error;
    }
  }

  // Calculate and update resource's overall rating
  updateResourceRating(resourceId, reviews) {
    try {
      if (reviews.length === 0) return;
      
      const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
      localStorage.setItem(`${this.storagePrefix}resource_rating_${resourceId}`, averageRating.toString());
      
      return averageRating;
    } catch (error) {
      console.error('Error updating resource rating:', error);
    }
  }

  // Get resource's overall rating
  getResourceRating(resourceId) {
    try {
      const rating = localStorage.getItem(`${this.storagePrefix}resource_rating_${resourceId}`);
      return rating ? parseFloat(rating) : 0;
    } catch (error) {
      console.error('Error loading resource rating:', error);
      return 0;
    }
  }

  // Get review statistics for a resource
  getReviewStats(resourceId) {
    try {
      const reviews = this.getReviews(resourceId);
      
      if (reviews.length === 0) {
        return {
          totalReviews: 0,
          averageRating: 0,
          distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        };
      }
      
      const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      let totalRating = 0;
      
      reviews.forEach(review => {
        distribution[review.rating]++;
        totalRating += review.rating;
      });
      
      return {
        totalReviews: reviews.length,
        averageRating: totalRating / reviews.length,
        distribution
      };
    } catch (error) {
      console.error('Error calculating review stats:', error);
      return {
        totalReviews: 0,
        averageRating: 0,
        distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      };
    }
  }

  // Get top rated resources
  getTopRatedResources(limit = 10) {
    try {
      const ratings = [];
      
      // Iterate through localStorage to find all resource ratings
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(`${this.storagePrefix}resource_rating_`)) {
          const resourceId = key.replace(`${this.storagePrefix}resource_rating_`, '');
          const rating = parseFloat(localStorage.getItem(key));
          const stats = this.getReviewStats(resourceId);
          
          if (stats.totalReviews > 0) {
            ratings.push({
              resourceId,
              rating,
              reviewCount: stats.totalReviews
            });
          }
        }
      }
      
      // Sort by rating (descending) and then by review count
      return ratings
        .sort((a, b) => {
          if (b.rating !== a.rating) {
            return b.rating - a.rating;
          }
          return b.reviewCount - a.reviewCount;
        })
        .slice(0, limit);
    } catch (error) {
      console.error('Error getting top rated resources:', error);
      return [];
    }
  }

  // Get recent reviews across all resources
  getRecentReviews(limit = 5) {
    try {
      const allReviews = [];
      
      // Iterate through localStorage to find all reviews
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(`${this.storagePrefix}reviews_`)) {
          const resourceId = key.replace(`${this.storagePrefix}reviews_`, '');
          const reviews = JSON.parse(localStorage.getItem(key) || '[]');
          
          reviews.forEach(review => {
            allReviews.push({
              ...review,
              resourceId
            });
          });
        }
      }
      
      // Sort by date (newest first)
      return allReviews
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, limit);
    } catch (error) {
      console.error('Error getting recent reviews:', error);
      return [];
    }
  }

  // Export user's reviews and ratings
  exportUserData() {
    try {
      const userData = {
        ratings: {},
        reviews: {},
        exportDate: new Date().toISOString()
      };
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.storagePrefix)) {
          const value = localStorage.getItem(key);
          
          if (key.includes('user_rating_')) {
            const resourceId = key.replace(`${this.storagePrefix}user_rating_`, '');
            userData.ratings[resourceId] = parseInt(value);
          } else if (key.includes('reviews_')) {
            const resourceId = key.replace(`${this.storagePrefix}reviews_`, '');
            userData.reviews[resourceId] = JSON.parse(value);
          }
        }
      }
      
      return userData;
    } catch (error) {
      console.error('Error exporting user data:', error);
      return null;
    }
  }

  // Import user's reviews and ratings
  importUserData(userData) {
    try {
      if (!userData || typeof userData !== 'object') {
        throw new Error('Invalid user data format');
      }
      
      // Import ratings
      if (userData.ratings) {
        Object.entries(userData.ratings).forEach(([resourceId, rating]) => {
          localStorage.setItem(`${this.storagePrefix}user_rating_${resourceId}`, rating.toString());
        });
      }
      
      // Import reviews
      if (userData.reviews) {
        Object.entries(userData.reviews).forEach(([resourceId, reviews]) => {
          localStorage.setItem(`${this.storagePrefix}reviews_${resourceId}`, JSON.stringify(reviews));
        });
      }
      
      return true;
    } catch (error) {
      console.error('Error importing user data:', error);
      throw error;
    }
  }

  // Clear all review data
  clearAllData() {
    try {
      const keysToRemove = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.storagePrefix)) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
      return true;
    } catch (error) {
      console.error('Error clearing review data:', error);
      throw error;
    }
  }

  // Get user's review history
  getUserReviewHistory() {
    try {
      const userReviews = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(`${this.storagePrefix}reviews_`)) {
          const resourceId = key.replace(`${this.storagePrefix}reviews_`, '');
          const reviews = JSON.parse(localStorage.getItem(key) || '[]');
          
          // Find reviews by current user (in real app, filter by user ID)
          const userReviewsForResource = reviews.filter(review => 
            review.author === 'Current User'
          );
          
          userReviewsForResource.forEach(review => {
            userReviews.push({
              ...review,
              resourceId
            });
          });
        }
      }
      
      return userReviews.sort((a, b) => new Date(b.date) - new Date(a.date));
    } catch (error) {
      console.error('Error getting user review history:', error);
      return [];
    }
  }
}

// Create and export singleton instance
const reviewService = new ReviewService();
export default reviewService;