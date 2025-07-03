import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { getMealBySlug } from '../data/detailedMealsData';
import Loading from '../components/Loading';
import ErrorPage from '../components/ErrorPage';
import FavoriteButton from '../components/common/FavoriteButton';

const MealDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Get the day we came from (if any)
  const fromDay = location.state?.fromDay;
  
  const handleBackNavigation = () => {
    if (fromDay) {
      // Navigate back to the specific day in the meal plan
      navigate(`/meal-plan?day=${fromDay}`);
    } else {
      // Fallback to general navigation
      navigate(-1);
    }
  };

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    console.log("Looking for meal with slug:", slug);
    const foundMeal = getMealBySlug(slug);
    console.log("Found meal:", foundMeal);
    
    setMeal(foundMeal);
    setLoading(false);
  }, [slug]);
  
  // Scroll to top when component mounts or slug changes (fixes meal detail scroll issue)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (loading) {
    return <Loading />;
  }

  if (!meal) {
    return <ErrorPage />;
  }

  const renderNutritionalInfo = () => (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Nutritional Information</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-700">{meal.nutritionalInfo.calories}</div>
          <div className="text-sm text-gray-600">Calories</div>
        </div>
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-700">{meal.nutritionalInfo.protein}</div>
          <div className="text-sm text-gray-600">Protein</div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-700">{meal.nutritionalInfo.carbohydrates}</div>
          <div className="text-sm text-gray-600">Carbs</div>
        </div>
        <div className="text-center p-3 bg-yellow-50 rounded-lg">
          <div className="text-2xl font-bold text-yellow-700">{meal.nutritionalInfo.fat}</div>
          <div className="text-sm text-gray-600">Fat</div>
        </div>
        <div className="text-center p-3 bg-orange-50 rounded-lg">
          <div className="text-2xl font-bold text-orange-700">{meal.nutritionalInfo.fiber}</div>
          <div className="text-sm text-gray-600">Fiber</div>
        </div>
        <div className="text-center p-3 bg-red-50 rounded-lg">
          <div className="text-2xl font-bold text-red-700">{meal.nutritionalInfo.calcium}</div>
          <div className="text-sm text-gray-600">Calcium</div>
        </div>
      </div>
    </div>
  );

  const renderIngredients = () => (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Ingredients</h3>
      <div className="space-y-2">
        {meal.ingredients.map((ingredient, index) => (
          <div key={index} className="flex items-center">
            <div className="w-2 h-2 bg-purple-500 rounded-full mr-3 flex-shrink-0"></div>
            <span className="text-gray-700">{ingredient}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderInstructions = () => (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Cooking Instructions</h3>
      <div className="space-y-4">
        {meal.instructions.map((instruction, index) => (
          <div key={index} className="flex">
            <div className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-4">
              {index + 1}
            </div>
            <p className="text-gray-700 leading-relaxed pt-1">{instruction}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderHealthBenefits = () => (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Health Benefits</h3>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium text-gray-800 mb-3">Key Benefits</h4>
          <div className="space-y-2">
            {meal.healthBenefits.map((benefit, index) => (
              <div key={index} className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700 text-sm">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-medium text-gray-800 mb-3">Symptoms Helped</h4>
          <div className="flex flex-wrap gap-2">
            {meal.symptomsHelped.map((symptom, index) => (
              <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                {symptom}
              </span>
            ))}
          </div>
          <h4 className="font-medium text-gray-800 mb-3 mt-4">Key Nutrients</h4>
          <div className="flex flex-wrap gap-2">
            {meal.keyNutrients.map((nutrient, index) => (
              <span key={index} className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                {nutrient}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Beautiful Header Design */}
      <div className="relative h-64 md:h-80 overflow-hidden" style={{
        background: meal.mealType === 'Breakfast' ? 
          'linear-gradient(135deg, #FEF3C7 0%, #F59E0B 50%, #D97706 100%)' :
        meal.mealType === 'Lunch' ? 
          'linear-gradient(135deg, #DCFCE7 0%, #16A34A 50%, #15803D 100%)' :
        meal.mealType === 'Dinner' ? 
          'linear-gradient(135deg, #EDE9FE 0%, #7C3AED 50%, #6D28D9 100%)' :
          'linear-gradient(135deg, #FED7D7 0%, #E53E3E 50%, #DC2626 100%)'
      }}>
        {/* Decorative Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full border-2 border-white"></div>
          <div className="absolute top-20 right-20 w-20 h-20 rounded-full border-2 border-white"></div>
          <div className="absolute bottom-16 left-16 w-24 h-24 rounded-full border-2 border-white"></div>
          <div className="absolute bottom-10 right-10 w-16 h-16 rounded-full border-2 border-white"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 flex items-end h-full">
          <div className="text-white p-6 w-full">
            <button 
              onClick={handleBackNavigation}
              className="mb-4 text-white hover:text-gray-200 flex items-center transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </button>
            
            {/* Large Modern Icon */}
            <div className="flex items-center mb-4">
              <div className="mr-4">
                {meal.mealType === 'Breakfast' && (
                  <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
                  </svg>
                )}
                {meal.mealType === 'Lunch' && (
                  <img 
                    src="/assets/lunch-icon.png" 
                    alt="Lunch" 
                    className="w-20 h-20 object-contain filter brightness-0 invert"
                    style={{ 
                      filter: 'brightness(0) invert(1)',
                      transform: 'rotate(35deg) scale(1.3)'
                    }}
                  />
                )}
                {meal.mealType === 'Dinner' && (
                  <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
                  </svg>
                )}
                {(meal.mealType === 'Snack' || meal.mealType === 'Snacks') && (
                  <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.25c5.385 0 9.75 4.365 9.75 9.75s-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12 6.615 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{meal.name}</h1>
                <p className="text-white/90 mb-4">{meal.description}</p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/30">
                ⏱️ {meal.prepTime}
              </span>
              <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/30">
                👥 Serves {meal.servings}
              </span>
              <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/30">
                📊 {meal.difficulty}
              </span>
              <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/30">
                🍽️ {meal.mealType}
              </span>
              {/* Prominent Favorite Button - Right where users look! */}
              <div className="ml-2">
                <FavoriteButton 
                  mealId={meal.id || meal.slug} 
                  mealName={meal.name} 
                  size="lg" 
                  variant="prominent" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', label: 'Overview', icon: '📊' },
                { id: 'nutrition', label: 'Nutrition', icon: '🥗' },
                { id: 'recipe', label: 'Recipe', icon: '👨‍🍳' },
                { id: 'benefits', label: 'Health Benefits', icon: '💚' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div>
            {renderNutritionalInfo()}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Quick Facts</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-lg font-semibold text-gray-800">{meal.prepTime}</div>
                  <div className="text-sm text-gray-600">Prep Time</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-lg font-semibold text-gray-800">{meal.cookTime}</div>
                  <div className="text-sm text-gray-600">Cook Time</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-lg font-semibold text-gray-800">{meal.difficulty}</div>
                  <div className="text-sm text-gray-600">Difficulty</div>
                </div>
              </div>
              <div className="mt-6">
                <h4 className="font-medium text-gray-800 mb-3">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {meal.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'nutrition' && renderNutritionalInfo()}
        
        {activeTab === 'recipe' && (
          <div>
            {renderIngredients()}
            {renderInstructions()}
          </div>
        )}

        {activeTab === 'benefits' && renderHealthBenefits()}

        {/* Bottom Navigation */}
        <div className="mt-8 flex justify-center">
          <Link 
            to="/dashboard"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MealDetail;