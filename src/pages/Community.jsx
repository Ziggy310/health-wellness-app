import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import PostCard from '../components/community/PostCard';
import CategoryFilter from '../components/community/CategoryFilter';
import NewPostModal from '../components/community/NewPostModal';
import Layout from '../components/common/Layout';
import { PostCategory, PostTopic, SymptomCategory } from '../utils/types';

//test

const Community = () => {
  const { user, isLoading } = useAppContext();
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [activePostId, setActivePostId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock data for posts
  useEffect(() => {
    const mockPosts = [
      {
        id: '1',
        title: 'How I manage my hot flashes',
        content: "I've found that keeping a small fan with me and wearing light, breathable clothing helps tremendously with my hot flashes. What works for you?",
        authorName: 'Emily Johnson',
        authorId: 'user1',
        authorAvatar: '/assets/images/avatar1.jpg',
        category: PostCategory.RESOURCE,
        topic: PostTopic.HOT_FLASHES,
        likeCount: 42,
        commentCount: 18,
        createdAt: '2023-10-15T14:30:00Z',
        comments: [
          {
            id: 'c1',
            postId: '1',
            authorName: 'Lauren Smith',
            authorId: 'user2',
            authorAvatar: '/assets/images/avatar2.jpg',
            content: "I keep cooling towels in my fridge and use them when I feel a hot flash coming on. It's been a game changer!",
            likeCount: 12,
            createdAt: '2023-10-15T15:15:00Z',
          },
          {
            id: 'c2',
            postId: '1',
            authorName: 'Maria Garcia',
            authorId: 'user3',
            authorAvatar: '/assets/images/avatar3.jpg',
            content: "I've started drinking sage tea. Research shows it can reduce hot flash frequency by up to 64%. Worth trying!",
            likeCount: 8,
            createdAt: '2023-10-15T16:20:00Z',
          },
          {
            id: 'c3',
            postId: '1',
            authorName: 'Sarah Wynters',
            authorId: 'user4',
            authorAvatar: '/assets/images/avatar4.jpg',
            content: "Paced breathing techniques (6 breaths per minute) help me when I feel a hot flash starting. I learned it from my doctor.",
            likeCount: 15,
            createdAt: '2023-10-15T17:45:00Z',
          }
        ]
      },
      {
        id: '2',
        title: 'Sleep issues getting worse - any advice?',
        content: "I'm waking up 3-4 times a night and can't fall back asleep easily. It's affecting my work performance. Has anyone found solutions that actually work?",
        authorName: 'Rachel Thompson',
        authorId: 'user5',
        authorAvatar: '/assets/images/avatar5.jpg',
        category: PostCategory.QUESTION,
        topic: PostTopic.SLEEP,
        likeCount: 28,
        commentCount: 24,
        createdAt: '2023-10-16T21:45:00Z',
        comments: [
          {
            id: 'c4',
            postId: '2',
            authorName: 'Dr. Amanda Chen',
            authorId: 'user6',
            authorAvatar: '/assets/images/avatar6.jpg',
            content: "Try creating a sleep routine with the same bedtime every night. Avoid screens 1 hour before bed. A magnesium supplement before bedtime might help too. Talk to your doctor about it.",
            likeCount: 22,
            createdAt: '2023-10-16T22:30:00Z',
          },
          {
            id: 'c5',
            postId: '2',
            authorName: 'Karen Williams',
            authorId: 'user7',
            authorAvatar: '/assets/images/avatar7.jpg',
            content: "Keeping my bedroom cool (65°F) and using a weighted blanket has helped me stay asleep longer. Also cut caffeine completely after noon.",
            likeCount: 17,
            createdAt: '2023-10-17T07:15:00Z',
          }
        ]
      },
      {
        id: '3',
        title: 'Unexpected emotional days - just me?',
        content: "Some days I feel completely fine, and others I'm overwhelmed with emotions for seemingly no reason. Is this normal during perimenopause? How are you all coping?",
        authorName: 'Jessica Peters',
        authorId: 'user8',
        authorAvatar: '/assets/images/avatar8.jpg',
        category: PostCategory.SUPPORT,
        topic: PostTopic.MOOD_CHANGES,
        likeCount: 56,
        commentCount: 32,
        createdAt: '2023-10-18T10:20:00Z',
        comments: [
          {
            id: 'c6',
            postId: '3',
            authorName: 'Olivia Washington',
            authorId: 'user9',
            authorAvatar: '/assets/images/avatar9.jpg',
            content: "You're definitely not alone! The hormonal fluctuations can cause mood swings. I found that tracking my moods helped me identify patterns and prepare for 'those days'.",
            likeCount: 31,
            createdAt: '2023-10-18T11:05:00Z',
          }
        ]
      },
      {
        id: '4',
        title: 'Success with dietary changes!',
        content: "I've been following a Mediterranean diet for 2 months now, and my symptoms have reduced significantly. Especially fewer hot flashes and better sleep quality. Has anyone else noticed improvements with diet?",
        authorName: 'Michelle Patel',
        authorId: 'user10',
        authorAvatar: '/assets/images/avatar10.jpg',
        category: PostCategory.SUCCESS_STORY,
        topic: PostTopic.NUTRITION,
        likeCount: 76,
        commentCount: 28,
        createdAt: '2023-10-19T16:40:00Z',
        comments: [
          {
            id: 'c7',
            postId: '4',
            authorName: 'Sophia Rodriguez',
            authorId: 'user11',
            authorAvatar: '/assets/images/avatar11.jpg',
            content: "Yes! I've eliminated processed sugar and noticed huge improvements. Would you mind sharing some of your favorite Mediterranean recipes?",
            likeCount: 18,
            createdAt: '2023-10-19T17:25:00Z',
          }
        ]
      },
      {
        id: '5',
        title: 'Brain fog strategies',
        content: "The cognitive changes are what I struggle with most. I've started keeping lists for everything and setting more reminders on my phone. What strategies help you manage brain fog?",
        authorName: 'Alison Taylor',
        authorId: 'user12',
        authorAvatar: '/assets/images/avatar12.jpg',
        category: PostCategory.DISCUSSION,
        topic: PostTopic.COGNITIVE_CHANGES,
        likeCount: 38,
        commentCount: 15,
        createdAt: '2023-10-20T09:10:00Z',
        comments: [
          {
            id: 'c8',
            postId: '5',
            authorName: 'Rebecca Johnson',
            authorId: 'user13',
            authorAvatar: '/assets/images/avatar13.jpg',
            content: "I've found that regular cardio exercise (30 mins, 4x/week) has made the biggest difference for my cognitive clarity. Also, omega-3 supplements might be helping.",
            likeCount: 14,
            createdAt: '2023-10-20T10:30:00Z',
          }
        ]
      }
    ];

    // Simulate API call delay
    setTimeout(() => {
      setPosts(mockPosts);
      setFilteredPosts(mockPosts);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter posts based on selected category and topic
  useEffect(() => {
    let filtered = [...posts];

    if (selectedCategory) {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    if (selectedTopic) {
      filtered = filtered.filter(post => post.topic === selectedTopic);
    }

    setFilteredPosts(filtered);
  }, [selectedCategory, selectedTopic, posts]);

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category === selectedCategory ? null : category);
  };

  const handleTopicFilter = (topic) => {
    setSelectedTopic(topic === selectedTopic ? null : topic);
  };

  const handleNewPost = (post) => {
    // In a real app, this would be an API call
    const newPost = {
      ...post,
      id: `${posts.length + 1}`,
      authorName: user?.name || 'Anonymous',
      authorId: user?.id || 'anonymous',
      authorAvatar: '/assets/images/user-avatar.jpg',
      likeCount: 0,
      commentCount: 0,
      createdAt: new Date().toISOString(),
      comments: []
    };

    setPosts([newPost, ...posts]);
    setShowNewPostModal(false);
  };

  const handlePostClick = (postId) => {
    setActivePostId(activePostId === postId ? null : postId);
  };

  const handleAddComment = (postId, comment) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const newComment = {
          id: `c${Date.now()}`,
          postId,
          authorName: user?.name || 'Anonymous',
          authorId: user?.id || 'anonymous',
          authorAvatar: '/assets/images/user-avatar.jpg',
          content: comment,
          likeCount: 0,
          createdAt: new Date().toISOString()
        };
        
        return {
          ...post,
          commentCount: post.commentCount + 1,
          comments: [...post.comments, newComment]
        };
      }
      return post;
    });
    
    setPosts(updatedPosts);
  };

  const handleLikePost = (postId) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likeCount: post.likeCount + 1
        };
      }
      return post;
    });
    
    setPosts(updatedPosts);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-5xl mb-16">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-purple-800">Meno+ Community</h1>
          <p className="text-gray-600 mt-2">
            Connect with others on the same journey, share experiences, and learn from each other.
          </p>
        </div>
        <button 
          onClick={() => setShowNewPostModal(true)}
          className="bg-purple-600 text-white px-6 py-2 rounded-lg flex items-center hover:bg-purple-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Post
        </button>
      </div>

      <div className="mb-6">
        <CategoryFilter 
          selectedCategory={selectedCategory}
          selectedTopic={selectedTopic}
          onSelectCategory={handleCategoryFilter}
          onSelectTopic={handleTopicFilter}
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPosts.length > 0 ? (
            filteredPosts.map(post => (
              <PostCard 
                key={post.id}
                post={post}
                isActive={activePostId === post.id}
                onClick={() => handlePostClick(post.id)}
                onLike={() => handleLikePost(post.id)}
                onComment={handleAddComment}
              />
            ))
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No posts found</h3>
              <p className="text-gray-600">
                {selectedCategory || selectedTopic ? 
                  "Try changing your filters or be the first to post in this category!" : 
                  "Be the first to share your experience with our community!"}
              </p>
              <button 
                onClick={() => setShowNewPostModal(true)}
                className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Create a Post
              </button>
            </div>
          )}
        </div>
      )}
      
      {showNewPostModal && (
        <NewPostModal
          onClose={() => setShowNewPostModal(false)}
          onSubmit={handleNewPost}
        />
      )}
      </div>
    </Layout>
  );
};

export default Community;