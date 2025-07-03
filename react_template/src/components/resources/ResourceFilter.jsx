import React from 'react';

const ResourceFilter = ({
  categories,
  types,
  selectedCategory,
  selectedType,
  showBookmarkedOnly,
  onCategoryChange,
  onTypeChange,
  onBookmarkToggle
}) => {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Category filter */}
        <div>
          <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="category-filter"
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Content type filter */}
        <div>
          <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Content Type
          </label>
          <select
            id="type-filter"
            value={selectedType}
            onChange={(e) => onTypeChange(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
          >
            {types.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Bookmarked filter */}
        <div className="flex items-end">
          <button
            onClick={onBookmarkToggle}
            className={`flex items-center justify-center px-4 py-2 rounded-md transition-colors ${
              showBookmarkedOnly
                ? 'bg-purple-600 text-white'
                : 'bg-white border border-purple-600 text-purple-600 hover:bg-purple-50'
            } w-full`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill={showBookmarkedOnly ? 'currentColor' : 'none'}
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={showBookmarkedOnly ? 0 : 2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
            {showBookmarkedOnly ? 'All Resources' : 'Bookmarked Only'}
          </button>
        </div>
      </div>

      {/* Additional filter chips for more specific filtering options */}
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          className={`px-3 py-1 text-xs rounded-full ${
            selectedCategory.includes('Symptom')
              ? 'bg-purple-100 text-purple-800'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
          onClick={() => onCategoryChange(selectedCategory.includes('Symptom') ? categories[0] : 'Symptom Management')}
        >
          Symptom Management
        </button>
        
        <button
          className={`px-3 py-1 text-xs rounded-full ${
            selectedCategory.includes('Treatment')
              ? 'bg-purple-100 text-purple-800'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
          onClick={() => onCategoryChange(selectedCategory.includes('Treatment') ? categories[0] : 'Treatment Options')}
        >
          Treatment Options
        </button>
        
        <button
          className={`px-3 py-1 text-xs rounded-full ${
            selectedType === 'Videos'
              ? 'bg-purple-100 text-purple-800'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
          onClick={() => onTypeChange(selectedType === 'Videos' ? types[0] : 'Videos')}
        >
          Videos
        </button>
        
        <button
          className={`px-3 py-1 text-xs rounded-full ${
            selectedType === 'Articles'
              ? 'bg-purple-100 text-purple-800'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
          onClick={() => onTypeChange(selectedType === 'Articles' ? types[0] : 'Articles')}
        >
          Articles
        </button>
      </div>
    </div>
  );
};

export default ResourceFilter;