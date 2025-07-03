import React from 'react';
import { useHeadsUpContext } from '../../contexts/HeadsUpContext';

const HeadsUpContact = ({ contact, onSelect }) => {
  const { toggleFavorite } = useHeadsUpContext();

  const handleFavoriteToggle = (e) => {
    e.stopPropagation();
    toggleFavorite(contact.id);
  };

  return (
    <div 
      onClick={() => onSelect(contact)}
      className="flex items-center p-4 border-b border-gray-100 hover:bg-purple-50 transition-colors cursor-pointer"
    >
      <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mr-4 flex-shrink-0">
        <span className="text-purple-700 font-bold text-lg">{contact.name.charAt(0)}</span>
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-900 truncate">{contact.name}</h3>
          <button 
            onClick={handleFavoriteToggle}
            className="text-gray-400 hover:text-yellow-500 focus:outline-none"
            aria-label={contact.isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            {contact.isFavorite ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-yellow-500">
                <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
              </svg>
            )}
          </button>
        </div>
        <p className="text-sm text-gray-500 truncate">{contact.relationship}</p>
        <p className="text-xs text-gray-400 truncate">{contact.email}</p>
      </div>
    </div>
  );
};

export default HeadsUpContact;
