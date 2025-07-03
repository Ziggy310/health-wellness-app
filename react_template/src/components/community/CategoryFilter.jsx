import React from 'react';
import { PostCategory, PostTopic } from '../../utils/types';

const CategoryFilter = ({ selectedCategory, selectedTopic, onSelectCategory, onSelectTopic }) => {
  // Category options with display names and colors
  const categories = [
    { value: PostCategory.DISCUSSION, label: 'Discussions', color: 'bg-blue-100 text-blue-800' },
    { value: PostCategory.QUESTION, label: 'Questions', color: 'bg-amber-100 text-amber-800' },
    { value: PostCategory.RESOURCE, label: 'Resources', color: 'bg-green-100 text-green-800' },
    { value: PostCategory.SUCCESS_STORY, label: 'Success Stories', color: 'bg-purple-100 text-purple-800' },
    { value: PostCategory.SUPPORT, label: 'Support', color: 'bg-pink-100 text-pink-800' },
  ];

  // Topic options with display names and colors
  const topics = [
    { value: PostTopic.HOT_FLASHES, label: 'Hot Flashes', color: 'bg-red-100 text-red-800' },
    { value: PostTopic.SLEEP, label: 'Sleep', color: 'bg-indigo-100 text-indigo-800' },
    { value: PostTopic.MOOD_CHANGES, label: 'Mood Changes', color: 'bg-yellow-100 text-yellow-800' },
    { value: PostTopic.NUTRITION, label: 'Nutrition', color: 'bg-green-100 text-green-800' },
    { value: PostTopic.EXERCISE, label: 'Exercise', color: 'bg-blue-100 text-blue-800' },
    { value: PostTopic.RELATIONSHIPS, label: 'Relationships', color: 'bg-pink-100 text-pink-800' },
    { value: PostTopic.COGNITIVE_CHANGES, label: 'Cognitive Changes', color: 'bg-purple-100 text-purple-800' },
    { value: PostTopic.HORMONES, label: 'Hormones', color: 'bg-cyan-100 text-cyan-800' },
    { value: PostTopic.GENERAL, label: 'General', color: 'bg-gray-100 text-gray-800' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Filter by Category</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.value}
              className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                selectedCategory === category.value
                  ? `${category.color} ring-2 ring-offset-1 ring-opacity-60 ring-current`
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => onSelectCategory(category.value)}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Filter by Topic</h3>
        <div className="flex flex-wrap gap-2">
          {topics.map((topic) => (
            <button
              key={topic.value}
              className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                selectedTopic === topic.value
                  ? `${topic.color} ring-2 ring-offset-1 ring-opacity-60 ring-current`
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => onSelectTopic(topic.value)}
            >
              {topic.label}
            </button>
          ))}
        </div>
      </div>
      
      {(selectedCategory || selectedTopic) && (
        <div className="mt-4 text-right">
          <button
            className="text-purple-600 hover:text-purple-800 text-sm font-medium flex items-center justify-end w-full"
            onClick={() => {
              onSelectCategory(null);
              onSelectTopic(null);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};

export default CategoryFilter;