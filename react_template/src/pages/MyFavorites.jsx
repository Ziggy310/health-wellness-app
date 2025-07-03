import React, { useState, useMemo } from 'react';
import { useFavorites } from '../hooks/useFavorites';
import { useAppContext } from '../contexts/AppContext';
import { comprehensiveMealsData } from '../data/comprehensiveMealsData';
import { filterMealsByDietaryPreferences } from '../utils/globalDietaryFilter';
import FavoriteButton from '../components/common/FavoriteButton';
import MealImage from '../components/meals/MealImage';
import Navigation from '../components/common/Navigation';
import { Link } from 'react-router-dom';

const MyFavorites = () => {
  const { getAllFavorites, count, clearAllFavorites } = useFavorites();
  const { userPreferences } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name'); // name, cookTime, difficulty

  // Get favorited meals with dietary filtering
  const favoritedMeals = useMemo(() => {
    const favoriteIds = getAllFavorites();
    
    if (favoriteIds.length === 0) return [];

    // Get meals that are favorited (convert object to array first)
    const allMealsArray = Object.values(comprehensiveMealsData);
    const favoriteMeals = allMealsArray.filter(meal => 
      favoriteIds.includes(meal.id || meal.slug)
    );

    // Apply dietary filtering for safety
    const filteredMeals = filterMealsByDietaryPreferences(favoriteMeals, userPreferences);

    // Apply search filter
    const searchFiltered = searchTerm 
      ? filteredMeals.filter(meal =>
          meal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          meal.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          meal.cuisine?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : filteredMeals;

    // Apply sorting
    return searchFiltered.sort((a, b) => {
      switch (sortBy) {
        case 'cookTime':
          return (a.cookTime || 30) - (b.cookTime || 30);
        case 'difficulty':
          const difficultyOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
          return (difficultyOrder[a.difficulty] || 2) - (difficultyOrder[b.difficulty] || 2);
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });
  }, [getAllFavorites, userPreferences, searchTerm, sortBy]);

  const handleClearAll = () => {
    if (window.confirm(`Are you sure you want to remove all ${count} favorites?`)) {
      clearAllFavorites();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl text-white">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Favorites</h1>
                <p className="text-gray-600">
                  {count === 0 ? 'No favorites yet' : `${count} favorite meal${count === 1 ? '' : 's'}`}
                </p>
              </div>
            </div>
            
            {count > 0 && (
              <button
                onClick={handleClearAll}
                className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
              >
                Clear All
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {count === 0 ? (
          // Empty State
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-pink-100 to-purple-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" viewBox="0 0 24 24" stroke="currentColor" fill="none">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No favorites yet</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start exploring meals and click the heart icon to save your favorites for quick access!
            </p>
            <div className="flex gap-4 justify-center">
              <Link 
                to="/meal-plan"
                className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-medium hover:from-pink-600 hover:to-purple-700 transition-all transform hover:scale-105"
              >
                Explore Meals
              </Link>
              <Link 
                to="/dashboard"
                className="px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Search and Filter Controls */}
            <div className="mb-8 bg-white rounded-xl shadow-sm p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search your favorites..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
                
                {/* Sort */}
                <div className="flex items-center gap-2">
                  <svg className="text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    <option value="name">Sort by Name</option>
                    <option value="cookTime">Sort by Cook Time</option>
                    <option value="difficulty">Sort by Difficulty</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Results Info */}
            <div className="mb-6">
              <p className="text-gray-600">
                {favoritedMeals.length === count 
                  ? `Showing all ${count} favorites`
                  : `Showing ${favoritedMeals.length} of ${count} favorites`
                }
                {searchTerm && ` matching "${searchTerm}"`}
              </p>
            </div>

            {/* Meals Grid */}
            {favoritedMeals.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No matches found</h3>
                <p className="text-gray-600">Try adjusting your search terms</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {favoritedMeals.map((meal) => (
                  <div
                    key={meal.id}
                    className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
                  >
                    <Link to={`/meal/${meal.slug}`} className="block">
                      {/* Compact Colored Header with Meal Type Icon */}
                      <div className="relative h-16 overflow-hidden flex items-center justify-center" style={{
                        background: meal.mealType === 'Breakfast' ? 'linear-gradient(135deg, #FEF3C7 0%, #F59E0B 100%)' :
                                   meal.mealType === 'Lunch' ? 'linear-gradient(135deg, #DCFCE7 0%, #16A34A 100%)' :
                                   meal.mealType === 'Dinner' ? 'linear-gradient(135deg, #EDE9FE 0%, #7C3AED 100%)' :
                                   'linear-gradient(135deg, #FED7D7 0%, #E53E3E 100%)'
                      }}>
                        {/* Proper Meal Type Icons - Matching Dashboard */}
                        {meal.mealType === 'Breakfast' && (
                          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
                          </svg>
                        )}
                        {meal.mealType === 'Lunch' && (
                          <img 
                            src="/assets/lunch-icon.png" 
                            alt="Lunch" 
                            className="w-8 h-8 object-contain filter brightness-0 invert"
                            style={{ 
                              filter: 'brightness(0) invert(1)',
                              transform: 'rotate(35deg) scale(1.3)'
                            }}
                          />
                        )}
                        {meal.mealType === 'Dinner' && (
                          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
                          </svg>
                        )}
                        {meal.mealType === 'Snack' && (
                          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.25c5.385 0 9.75 4.365 9.75 9.75s-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12 6.615 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z" />
                          </svg>
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />

                        
                        {/* Difficulty Badge */}
                        {meal.difficulty && (
                          <div className="absolute top-2 left-2 px-2 py-1 bg-white/90 rounded-full text-xs font-medium text-gray-700">
                            {meal.difficulty}
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 group-hover:text-pink-600 transition-colors line-clamp-2 flex-1">
                            {meal.name}
                          </h3>
                          <FavoriteButton
                            mealId={meal.id}
                            mealName={meal.name}
                            variant="inline"
                            size="sm"
                          />
                        </div>
                        
                        {meal.description && (
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {meal.description}
                          </p>
                        )}

                        {/* Meta Info */}
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          {meal.cookTime && (
                            <div className="flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>{meal.cookTime}min</span>
                            </div>
                          )}
                          
                          {meal.servings && (
                            <div className="flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                              </svg>
                              <span>{meal.servings} servings</span>
                            </div>
                          )}
                          
                          {meal.cuisine && (
                            <div className="flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                              </svg>
                              <span>{meal.cuisine}</span>
                            </div>
                          )}
                        </div>

                        {/* Dietary Tags */}
                        {meal.dietaryInfo && meal.dietaryInfo.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-3">
                            {meal.dietaryInfo.slice(0, 3).map((tag, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-md"
                              >
                                {tag}
                              </span>
                            ))}
                            {meal.dietaryInfo.length > 3 && (
                              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-md">
                                +{meal.dietaryInfo.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Bottom Navigation */}
      <Navigation />
    </div>
  );
};

export default MyFavorites;