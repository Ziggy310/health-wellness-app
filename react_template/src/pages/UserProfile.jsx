import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import RecipeCard from '../components/community/RecipeCard';
import PostCard from '../components/community/PostCard';
import RecipeSharingModal from '../components/community/RecipeSharingModal';
import { MenopauseStage, DietType } from '../utils/types';

const UserProfile = () => {
  const { userId } = useParams();
  const { user } = useAppContext();
  const [profileUser, setProfileUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('recipes');
  const [showRecipeSharingModal, setShowRecipeSharingModal] = useState(false);
  const [userRecipes, setUserRecipes] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [isCurrentUser, setIsCurrentUser] = useState(false);

  // Convert menopause stage to display text
  const getMenopauseStageDisplay = (stage) => {
    const stages = {
      [MenopauseStage.PREMENOPAUSAL]: 'Pre-menopausal',
      [MenopauseStage.PERIMENOPAUSAL]: 'Peri-menopausal',
      [MenopauseStage.MENOPAUSAL]: 'Menopausal',
      [MenopauseStage.POSTMENOPAUSAL]: 'Post-menopausal',
      [MenopauseStage.UNKNOWN]: 'Unspecified',
    };
    return stages[stage] || 'Unspecified';
  };

  // Convert diet type to display text
  const getDietTypeDisplay = (dietType) => {
    const types = {
      [DietType.OMNIVORE]: 'Omnivore',
      [DietType.VEGETARIAN]: 'Vegetarian',
      [DietType.VEGAN]: 'Vegan',
      [DietType.PESCATARIAN]: 'Pescatarian',
      [DietType.MEDITERRANEAN]: 'Mediterranean',
      [DietType.LOW_CARB]: 'Low-carb',
      [DietType.PALEO]: 'Paleo',
      [DietType.KETO]: 'Keto',
      [DietType.OTHER]: 'Other',
    };
    return types[dietType] || 'Not specified';
  };

  useEffect(() => {
    // Check if viewing own profile
    if (user && (userId === user.id || !userId)) {
      setIsCurrentUser(true);
      setProfileUser(user);
    } else {
      // Mock fetching user data - would be replaced with an API call
      setTimeout(() => {
        // Mock user data
        const mockUser = {
          id: userId || '123',
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
          avatar: '/assets/images/avatar5.jpg',
          bio: 'Navigating menopause with a positive outlook. Love cooking healthy meals and sharing wellness tips.',
          stage: MenopauseStage.PERIMENOPAUSAL,
          dietType: DietType.MEDITERRANEAN,
          joinDate: '2023-01-15T00:00:00Z',
          topSymptoms: ['Hot flashes', 'Sleep disturbances', 'Mood changes'],
          goals: ['Improve sleep quality', 'Maintain energy levels', 'Support bone health'],
        };
        setProfileUser(mockUser);
        setIsCurrentUser(false);
      }, 800);
    }
    
    // Fetch user recipes - would be replaced with an API call
    setTimeout(() => {
      const mockRecipes = [
        {
          id: '1',
          userId: userId || '123',
          title: 'Anti-inflammatory Berry Smoothie',
          description: 'This smoothie helps reduce hot flashes and provides antioxidant support.',
          image: '/assets/images/berry-smoothie.jpg',
          ingredients: [
            '1 cup mixed berries (blueberries, strawberries, raspberries)',
            '1 tablespoon ground flaxseed',
            '1 cup unsweetened almond milk',
            '1/2 teaspoon turmeric powder',
            'Small piece of ginger',
            '1 tablespoon honey (optional)'
          ],
          instructions: 'Blend all ingredients until smooth. Serve immediately for best results.',
          prepTime: '5 minutes',
          symptoms: ['Hot flashes', 'Inflammation'],
          nutrients: ['Antioxidants', 'Omega-3 fatty acids'],
          likes: 24,
          comments: 5,
          createdAt: '2023-08-12T14:30:00Z'
        },
        {
          id: '2',
          userId: userId || '123',
          title: 'Magnesium-Rich Sleep-Support Salad',
          description: 'This evening salad contains ingredients that support better sleep and reduced night sweats.',
          image: '/assets/images/sleep-salad.jpg',
          ingredients: [
            '2 cups spinach',
            '1/4 cup pumpkin seeds',
            '1/2 avocado, sliced',
            '1/4 cup chickpeas, cooked',
            '1 tablespoon olive oil',
            '1 teaspoon lemon juice',
            'Salt and pepper to taste'
          ],
          instructions: 'Combine all ingredients in a bowl. Drizzle with olive oil and lemon juice, then toss well.',
          prepTime: '10 minutes',
          symptoms: ['Sleep disturbances', 'Night sweats'],
          nutrients: ['Magnesium', 'Healthy fats', 'Protein'],
          likes: 18,
          comments: 3,
          createdAt: '2023-09-05T18:45:00Z'
        }
      ];
      
      setUserRecipes(mockRecipes);
      
      // Mock posts data
      const mockPosts = [
        {
          id: '101',
          title: 'My journey with Mediterranean diet',
          content: "I've been following a Mediterranean diet for 3 months now and have noticed significant improvements in my hot flashes and sleep quality. Happy to share specific meal plans if anyone is interested!",
          authorName: profileUser?.name || 'Jane Smith',
          authorId: userId || '123',
          authorAvatar: profileUser?.avatar || '/assets/images/avatar5.jpg',
          category: 'SUCCESS_STORY',
          topic: 'NUTRITION',
          likeCount: 32,
          commentCount: 8,
          createdAt: '2023-07-20T09:15:00Z',
          comments: [
            {
              id: 'c101',
              postId: '101',
              authorName: 'Maria Garcia',
              authorId: 'user3',
              authorAvatar: '/assets/images/avatar3.jpg',
              content: "I'd love to see your meal plan! Been considering this diet change myself.",
              likeCount: 5,
              createdAt: '2023-07-20T10:30:00Z',
            }
          ]
        },
        {
          id: '102',
          title: 'Question about cognitive changes',
          content: "Has anyone else experienced brain fog during perimenopause? I'm finding it harder to focus at work and would appreciate any tips that have helped others.",
          authorName: profileUser?.name || 'Jane Smith',
          authorId: userId || '123',
          authorAvatar: profileUser?.avatar || '/assets/images/avatar5.jpg',
          category: 'QUESTION',
          topic: 'COGNITIVE_CHANGES',
          likeCount: 28,
          commentCount: 12,
          createdAt: '2023-06-18T14:20:00Z',
          comments: [
            {
              id: 'c102',
              postId: '102',
              authorName: 'Rebecca Johnson',
              authorId: 'user13',
              authorAvatar: '/assets/images/avatar13.jpg',
              content: "I've found that regular cardiovascular exercise helps clear my brain fog. Also, omega-3 supplements might be worth considering.",
              likeCount: 8,
              createdAt: '2023-06-18T15:05:00Z',
            }
          ]
        }
      ];
      
      setUserPosts(mockPosts);
      setIsLoading(false);
    }, 1000);
  }, [userId, user]);

  const handleAddRecipe = (newRecipe) => {
    // Mock saving a new recipe - would be replaced with an API call
    const recipe = {
      ...newRecipe,
      id: Date.now().toString(),
      userId: user?.id || '123',
      authorName: user?.name || 'Current User',
      likes: 0,
      comments: 0,
      createdAt: new Date().toISOString()
    };
    
    setUserRecipes([recipe, ...userRecipes]);
    setShowRecipeSharingModal(false);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center">
          <div className="relative mb-4 md:mb-0 mr-6">
            <img 
              src={profileUser?.avatar || '/assets/images/default-avatar.jpg'} 
              alt={profileUser?.name || 'User'} 
              className="w-24 h-24 rounded-full object-cover border-4 border-purple-100"
              onError={(e) => {
                e.target.src = '/assets/images/default-avatar.jpg';
              }}
            />
            {isCurrentUser && (
              <button 
                className="absolute -bottom-1 -right-1 bg-purple-600 text-white rounded-full p-1 hover:bg-purple-700 transition-colors"
                title="Change profile picture"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-2 md:mb-0">{profileUser?.name || 'User'}</h1>
              {isCurrentUser && (
                <button 
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                  onClick={() => setShowRecipeSharingModal(true)}
                >
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Share Recipe
                  </span>
                </button>
              )}
            </div>
            
            <p className="text-gray-600 mt-2">{profileUser?.bio || 'No bio provided.'}</p>
            
            <div className="mt-3 flex flex-wrap gap-y-2">
              <div className="w-full sm:w-1/2 md:w-1/3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm text-gray-600">Joined {formatDate(profileUser?.joinDate || new Date())}</span>
              </div>
              <div className="w-full sm:w-1/2 md:w-1/3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span className="text-sm text-gray-600">Stage: {getMenopauseStageDisplay(profileUser?.stage)}</span>
              </div>
              <div className="w-full sm:w-1/2 md:w-1/3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="text-sm text-gray-600">Diet: {getDietTypeDisplay(profileUser?.dietType)}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Top symptoms and goals */}
        {profileUser?.topSymptoms && profileUser.topSymptoms.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-900">Top Symptoms:</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {profileUser.topSymptoms.map((symptom, index) => (
                <span 
                  key={index} 
                  className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full"
                >
                  {symptom}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {profileUser?.goals && profileUser.goals.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-900">Health Goals:</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {profileUser.goals.map((goal, index) => (
                <span 
                  key={index} 
                  className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
                >
                  {goal}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="flex border-b border-gray-200">
          <button 
            className={`px-6 py-3 text-sm font-medium flex-grow ${activeTab === 'recipes' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => handleTabChange('recipes')}
          >
            Recipes
          </button>
          <button 
            className={`px-6 py-3 text-sm font-medium flex-grow ${activeTab === 'posts' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => handleTabChange('posts')}
          >
            Posts
          </button>
        </div>
      </div>
      
      {/* Content based on selected tab */}
      <div>
        {activeTab === 'recipes' && (
          <div>
            {userRecipes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userRecipes.map(recipe => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No recipes shared yet</h3>
                <p className="text-gray-600">
                  {isCurrentUser ? 
                    "You haven't shared any recipes yet. Share your favorite menopause-friendly recipes with the community!" : 
                    "This user hasn't shared any recipes yet."}
                </p>
                {isCurrentUser && (
                  <button 
                    onClick={() => setShowRecipeSharingModal(true)}
                    className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Share Recipe
                  </button>
                )}
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'posts' && (
          <div className="space-y-4">
            {userPosts.length > 0 ? (
              userPosts.map(post => (
                <PostCard 
                  key={post.id} 
                  post={post} 
                  isActive={false}
                  onClick={() => {}}
                  onLike={() => {}}
                  onComment={() => {}}
                />
              ))
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No posts yet</h3>
                <p className="text-gray-600">
                  {isCurrentUser ? 
                    "You haven't created any posts yet. Join the conversation in the community section!" : 
                    "This user hasn't created any posts yet."}
                </p>
                {isCurrentUser && (
                  <Link
                    to="/community"
                    className="mt-4 inline-block bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Go to Community
                  </Link>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Recipe Sharing Modal */}
      {showRecipeSharingModal && (
        <RecipeSharingModal
          onClose={() => setShowRecipeSharingModal(false)}
          onSubmit={handleAddRecipe}
        />
      )}
    </div>
  );
};

export default UserProfile;