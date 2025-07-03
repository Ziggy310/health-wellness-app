import React from 'react';

const CommentList = ({ comments }) => {
  // Function to format the date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Function to format the time
  const formatTime = (dateString) => {
    const options = { hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleTimeString(undefined, options);
  };

  return (
    <div className="divide-y divide-gray-200">
      <div className="px-4 py-3 bg-gray-50">
        <h4 className="font-medium text-gray-900">
          Comments ({comments.length})
        </h4>
      </div>
      
      {comments.length > 0 ? (
        <ul className="divide-y divide-gray-100">
          {comments.map((comment) => (
            <li key={comment.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex space-x-3">
                <div className="flex-shrink-0">
                  <img 
                    className="h-10 w-10 rounded-full object-cover border border-gray-200"
                    src={comment.authorAvatar || '/assets/images/default-avatar.jpg'}
                    alt={comment.authorName}
                    onError={(e) => {
                      e.target.src = '/assets/images/default-avatar.jpg';
                    }}
                  />
                </div>
                <div className="flex-grow">
                  <div className="flex items-center justify-between">
                    <h5 className="text-sm font-medium text-gray-900">{comment.authorName}</h5>
                    <span className="text-xs text-gray-500">
                      {formatDate(comment.createdAt)} at {formatTime(comment.createdAt)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-700">{comment.content}</p>
                  <div className="mt-2 flex items-center">
                    <button className="inline-flex items-center text-xs text-gray-500 hover:text-purple-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      {comment.likeCount} Likes
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="p-4 text-center text-gray-500">
          No comments yet. Be the first to share your thoughts!
        </div>
      )}
    </div>
  );
};

export default CommentList;