import React from 'react';
import { Link } from 'react-router-dom';

const RecipeCard = ({ recipe }) => {
  // Format the recipe date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format time (converts minutes to "X hrs Y mins" if needed)
  const formatTime = (timeString) => {
    if (timeString.includes('minute')) return timeString;
    
    const minutes = parseInt(timeString);
    if (isNaN(minutes)) return timeString;
    
    if (minutes < 60) return `${minutes} minutes`;
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (remainingMinutes === 0) return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ${remainingMinutes} minutes`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg">
      {/* Recipe Image */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={recipe.image || '/assets/images/default-recipe.jpg'} 
          alt={recipe.title} 
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = '/assets/images/default-recipe.jpg';
          }}
        />
        
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <h3 className="text-white font-medium text-xl">{recipe.title}</h3>
          <div className="flex items-center mt-1">
            <div className="flex text-xs text-white/80">
              <span className="flex items-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {formatTime(recipe.prepTime)}
              </span>
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formatDate(recipe.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recipe Content */}
      <div className="p-4">
        <p className="text-gray-600 text-sm line-clamp-2">{recipe.description}</p>
        
        {/* Symptoms and Nutrients */}
        <div className="mt-3 mb-4">
          <div className="flex flex-wrap gap-2 mb-1.5">
            {recipe.symptoms && recipe.symptoms.map((symptom, index) => (
              <span 
                key={`symptom-${index}`}
                className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full"
              >
                {symptom}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {recipe.nutrients && recipe.nutrients.map((nutrient, index) => (
              <span 
                key={`nutrient-${index}`}
                className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full"
              >
                {nutrient}
              </span>
            ))}
          </div>
        </div>
        
        {/* Stats and View Button */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
          <div className="flex space-x-3 text-gray-500 text-sm">
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              {recipe.likes || 0}
            </span>
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
              </svg>
              {recipe.comments || 0}
            </span>
          </div>
          
          <Link 
            to={`/recipes/${recipe.id}`}
            className="text-sm font-medium text-purple-600 hover:text-purple-800 transition-colors"
          >
            View Recipe
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;