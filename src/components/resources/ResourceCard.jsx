import React from 'react';

/**
 * Component for displaying a resource card with appropriate styling based on resource type
 */
const ResourceCard = ({ resource, onBookmarkToggle, onClick }) => {
  const { 
    title, 
    description, 
    type, 
    author, 
    publishDate, 
    readTime, 
    duration,
    imageUrl, 
    isBookmarked 
  } = resource;

  // Get the appropriate type icon based on resource type
  const getTypeIcon = () => {
    switch(type) {
      case 'Articles':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
        );
      case 'Videos':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 001.447.894l3-1.5a1 1 0 000-1.788l-3-1.5z" />
          </svg>
        );
      case 'Podcasts':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
          </svg>
        );
      case 'Infographics':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-3 1a1 1 0 10-2 0v3a1 1 0 102 0V8zM8 9a1 1 0 00-2 0v2a1 1 0 102 0V9z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div 
      className="flex flex-col overflow-hidden rounded-lg shadow-md border border-gray-100 bg-white h-full hover:shadow-lg transition-shadow duration-300 hover:border-purple-200 cursor-pointer"
      onClick={onClick}
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover"
          onError={(e) => {
            // If image fails to load, set a default based on resource type
            e.target.onerror = null;
            if (type === 'Articles') {
              e.target.src = 'https://placehold.co/400x200/9370db/ffffff?text=Article';
            } else if (type === 'Videos') {
              e.target.src = 'https://placehold.co/400x200/8A2BE2/ffffff?text=Video';
            } else if (type === 'Podcasts') {
              e.target.src = 'https://placehold.co/400x200/8A2BE2/ffffff?text=Podcast';
            } else {
              e.target.src = 'https://placehold.co/400x200/9370db/ffffff?text=Resource';
            }
          }}
        />
        
        {/* Bookmark button */}
        <button 
          className="absolute top-2 right-2 p-2 rounded-full bg-white shadow-md hover:bg-gray-100" 
          onClick={(e) => {
            e.stopPropagation();
            onBookmarkToggle();
          }}
        >
          {isBookmarked ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 4a3 3 0 00-3 3v10a1 1 0 001.4 1l5.6-2.8 5.6 2.8a1 1 0 001.4-1V7a3 3 0 00-3-3H5z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          )}
        </button>
      </div>
      
      {/* Content Section */}
      <div className="flex-1 p-4">
        <div className="mb-2 flex items-center text-xs text-gray-500">
          <span className="flex items-center mr-3">
            {getTypeIcon()}
            {type}
          </span>
          <span>
            {formatDate(publishDate)}
          </span>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-3">{description}</p>
      </div>
      
      {/* Footer Section */}
      <div className="px-4 pb-4 text-xs text-gray-600">
        <div className="flex justify-between items-center">
          <div>
            {author && <span>By {author}</span>}
          </div>
          <div className="flex items-center">
            {readTime && (
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {readTime}
              </span>
            )}
            
            {duration && (
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {duration}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;