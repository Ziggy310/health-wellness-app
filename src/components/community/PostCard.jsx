import React, { useState } from 'react';
import CommentList from './CommentList';
import { PostCategory, PostTopic } from '../../utils/types';

const PostCard = ({ post, isActive, onClick, onLike, onComment }) => {
  const [commentText, setCommentText] = useState('');
  const [isLiked, setIsLiked] = useState(false);

  // Format the post date 
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get category and topic display names
  const getCategoryDisplay = (category) => {
    const labels = {
      [PostCategory.DISCUSSION]: 'Discussion',
      [PostCategory.QUESTION]: 'Question',
      [PostCategory.RESOURCE]: 'Resource',
      [PostCategory.SUCCESS_STORY]: 'Success Story',
      [PostCategory.SUPPORT]: 'Support',
    };
    return labels[category] || 'Discussion';
  };

  const getTopicDisplay = (topic) => {
    const labels = {
      [PostTopic.HOT_FLASHES]: 'Hot Flashes',
      [PostTopic.SLEEP]: 'Sleep',
      [PostTopic.MOOD_CHANGES]: 'Mood Changes',
      [PostTopic.NUTRITION]: 'Nutrition',
      [PostTopic.EXERCISE]: 'Exercise',
      [PostTopic.RELATIONSHIPS]: 'Relationships',
      [PostTopic.COGNITIVE_CHANGES]: 'Cognitive Changes',
      [PostTopic.HORMONES]: 'Hormones',
      [PostTopic.GENERAL]: 'General',
    };
    return labels[topic] || 'General';
  };

  // Get category color based on type
  const getCategoryColor = (category) => {
    const colors = {
      [PostCategory.DISCUSSION]: 'text-blue-600 bg-blue-100',
      [PostCategory.QUESTION]: 'text-amber-600 bg-amber-100',
      [PostCategory.RESOURCE]: 'text-green-600 bg-green-100',
      [PostCategory.SUCCESS_STORY]: 'text-purple-600 bg-purple-100',
      [PostCategory.SUPPORT]: 'text-pink-600 bg-pink-100',
    };
    return colors[category] || 'text-gray-600 bg-gray-100';
  };

  const getTopicColor = (topic) => {
    const colors = {
      [PostTopic.HOT_FLASHES]: 'text-red-600 bg-red-50',
      [PostTopic.SLEEP]: 'text-indigo-600 bg-indigo-50',
      [PostTopic.MOOD_CHANGES]: 'text-yellow-600 bg-yellow-50',
      [PostTopic.NUTRITION]: 'text-green-600 bg-green-50',
      [PostTopic.EXERCISE]: 'text-blue-600 bg-blue-50',
      [PostTopic.RELATIONSHIPS]: 'text-pink-600 bg-pink-50',
      [PostTopic.COGNITIVE_CHANGES]: 'text-purple-600 bg-purple-50',
      [PostTopic.HORMONES]: 'text-cyan-600 bg-cyan-50',
      [PostTopic.GENERAL]: 'text-gray-600 bg-gray-50',
    };
    return colors[topic] || 'text-gray-600 bg-gray-50';
  };

  const handleLike = () => {
    if (!isLiked) {
      setIsLiked(true);
      onLike(post.id);
    }
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      onComment(post.id, commentText);
      setCommentText('');
    }
  };

  return (
    <div 
      className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ${isActive ? 'border-l-4 border-purple-500' : ''}`}
    >
      {/* Post Header */}
      <div className="p-4 cursor-pointer" onClick={onClick}>
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            <img 
              src={post.authorAvatar || '/assets/images/default-avatar.jpg'} 
              alt={post.authorName} 
              className="w-10 h-10 rounded-full mr-3 object-cover border border-gray-200"
              onError={(e) => {
                e.target.src = '/assets/images/default-avatar.jpg';
              }}
            />
            <div>
              <div className="font-medium text-gray-900">{post.authorName}</div>
              <div className="text-xs text-gray-500">{formatDate(post.createdAt)}</div>
            </div>
          </div>
          <div className="flex space-x-2">
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${getCategoryColor(post.category)}`}>
              {getCategoryDisplay(post.category)}
            </span>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${getTopicColor(post.topic)}`}>
              {getTopicDisplay(post.topic)}
            </span>
          </div>
        </div>

        {/* Post Content */}
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{post.title}</h3>
        <p className="text-gray-700">{post.content}</p>
      </div>

      {/* Post Actions */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex justify-between">
        <div className="flex space-x-4">
          <button 
            className={`flex items-center space-x-1 ${isLiked ? 'text-purple-600' : 'text-gray-500 hover:text-purple-600'}`}
            onClick={handleLike}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={isLiked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={isLiked ? 0 : 1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span>{post.likeCount}</span>
          </button>
          <button 
            className="flex items-center space-x-1 text-gray-500 hover:text-purple-600"
            onClick={onClick}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span>{post.commentCount}</span>
          </button>
        </div>
        <button 
          className="text-gray-500 hover:text-purple-600"
          onClick={onClick}
        >
          {isActive ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </button>
      </div>

      {/* Comments Section (expanded when active) */}
      {isActive && (
        <div className="border-t border-gray-200">
          <CommentList comments={post.comments} />
          
          {/* Add comment form */}
          <form className="p-4 border-t border-gray-100 bg-gray-50" onSubmit={handleCommentSubmit}>
            <div className="flex">
              <input
                type="text"
                className="flex-grow border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                required
              />
              <button
                type="submit"
                className="bg-purple-600 text-white rounded-r-lg px-4 py-2 hover:bg-purple-700 transition-colors"
              >
                Post
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default PostCard;