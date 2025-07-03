import React, { useState, useEffect } from 'react';
import bookmarkService from '../../services/BookmarkService';

const BookmarkModal = ({ isOpen, onClose, resource, onBookmarkChange }) => {
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState('default');
  const [notes, setNotes] = useState('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderColor, setNewFolderColor] = useState('blue');
  const [newFolderIcon, setNewFolderIcon] = useState('📁');
  const [loading, setLoading] = useState(false);
  const [existingBookmark, setExistingBookmark] = useState(null);

  const folderColors = [
    { value: 'blue', label: 'Blue', class: 'bg-blue-500' },
    { value: 'green', label: 'Green', class: 'bg-green-500' },
    { value: 'purple', label: 'Purple', class: 'bg-purple-500' },
    { value: 'red', label: 'Red', class: 'bg-red-500' },
    { value: 'yellow', label: 'Yellow', class: 'bg-yellow-500' },
    { value: 'pink', label: 'Pink', class: 'bg-pink-500' },
    { value: 'indigo', label: 'Indigo', class: 'bg-indigo-500' },
    { value: 'gray', label: 'Gray', class: 'bg-gray-500' }
  ];

  const folderIcons = ['📁', '📚', '❤️', '🧠', '🥗', '💊', '🏃‍♂️', '😌', '⚕️', '🔬'];

  useEffect(() => {
    if (isOpen && resource) {
      loadData();
    }
  }, [isOpen, resource]);

  const loadData = () => {
    const allFolders = bookmarkService.getFolders();
    setFolders(allFolders);
    
    const bookmark = bookmarkService.getBookmark(resource.id);
    if (bookmark) {
      setExistingBookmark(bookmark);
      setSelectedFolder(bookmark.folderId);
      setNotes(bookmark.notes || '');
    } else {
      setExistingBookmark(null);
      setSelectedFolder('default');
      setNotes('');
    }
  };

  const handleSaveBookmark = async () => {
    setLoading(true);
    
    try {
      const success = bookmarkService.addBookmark(resource, selectedFolder, notes);
      
      if (success) {
        onBookmarkChange?.(resource.id, true);
        onClose();
      } else {
        alert('Failed to save bookmark. Please try again.');
      }
    } catch (error) {
      console.error('Error saving bookmark:', error);
      alert('An error occurred while saving the bookmark.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBookmark = async () => {
    setLoading(true);
    
    try {
      const success = bookmarkService.removeBookmark(resource.id);
      
      if (success) {
        onBookmarkChange?.(resource.id, false);
        onClose();
      } else {
        alert('Failed to remove bookmark. Please try again.');
      }
    } catch (error) {
      console.error('Error removing bookmark:', error);
      alert('An error occurred while removing the bookmark.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      alert('Please enter a folder name.');
      return;
    }

    const result = bookmarkService.createFolder(
      newFolderName.trim(),
      newFolderColor,
      newFolderIcon,
      `Custom folder for ${newFolderName.trim()}`
    );

    if (result.success) {
      setFolders([...folders, result.folder]);
      setSelectedFolder(result.folder.id);
      setIsCreatingFolder(false);
      setNewFolderName('');
      setNewFolderColor('blue');
      setNewFolderIcon('📁');
    } else {
      alert(result.error || 'Failed to create folder.');
    }
  };

  const getFolderById = (folderId) => {
    return folders.find(f => f.id === folderId);
  };

  const getColorClass = (color) => {
    const colorMap = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500',
      red: 'bg-red-500',
      yellow: 'bg-yellow-500',
      pink: 'bg-pink-500',
      indigo: 'bg-indigo-500',
      gray: 'bg-gray-500'
    };
    return colorMap[color] || 'bg-blue-500';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          {/* Header */}
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 sm:mx-0 sm:h-10 sm:w-10">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {existingBookmark ? 'Edit Bookmark' : 'Add Bookmark'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {resource?.title || 'Resource'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="bg-white px-4 pb-4 sm:p-6">
            {/* Folder Selection */}
            <div className="mb-4">
              <label htmlFor="folder-select" className="block text-sm font-medium text-gray-700 mb-2">
                Save to Folder
              </label>
              <div className="flex space-x-2">
                <select
                  id="folder-select"
                  value={selectedFolder}
                  onChange={(e) => setSelectedFolder(e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {folders.map(folder => {
                    const folderData = getFolderById(folder.id) || folder;
                    return (
                      <option key={folder.id} value={folder.id}>
                        {folderData.icon} {folder.name}
                      </option>
                    );
                  })}
                </select>
                <button
                  onClick={() => setIsCreatingFolder(!isCreatingFolder)}
                  className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  title="Create new folder"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Create New Folder */}
            {isCreatingFolder && (
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Create New Folder</h4>
                
                <div className="space-y-3">
                  <div>
                    <input
                      type="text"
                      placeholder="Folder name"
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  
                  <div className="flex space-x-3">
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Color</label>
                      <div className="flex space-x-1">
                        {folderColors.slice(0, 4).map(color => (
                          <button
                            key={color.value}
                            onClick={() => setNewFolderColor(color.value)}
                            className={`w-6 h-6 rounded-full ${color.class} ${newFolderColor === color.value ? 'ring-2 ring-offset-1 ring-gray-400' : ''}`}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Icon</label>
                      <div className="flex space-x-1">
                        {folderIcons.slice(0, 5).map(icon => (
                          <button
                            key={icon}
                            onClick={() => setNewFolderIcon(icon)}
                            className={`w-6 h-6 text-sm ${newFolderIcon === icon ? 'bg-purple-100 rounded' : ''}`}
                          >
                            {icon}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={handleCreateFolder}
                      className="px-3 py-1 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700"
                    >
                      Create
                    </button>
                    <button
                      onClick={() => setIsCreatingFolder(false)}
                      className="px-3 py-1 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Notes */}
            <div className="mb-4">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                Notes (optional)
              </label>
              <textarea
                id="notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add your personal notes about this resource..."
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              />
            </div>

            {/* Resource Preview */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-start space-x-3">
                <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                  resource?.type === 'Articles' ? 'bg-blue-100 text-blue-600' :
                  resource?.type === 'Videos' ? 'bg-red-100 text-red-600' :
                  resource?.type === 'Podcasts' ? 'bg-green-100 text-green-600' :
                  'bg-purple-100 text-purple-600'
                }`}>
                  {resource?.type === 'Articles' ? '📄' :
                   resource?.type === 'Videos' ? '🎥' :
                   resource?.type === 'Podcasts' ? '🎙️' : '📊'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {resource?.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {resource?.author} • {resource?.type}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              disabled={loading}
              onClick={handleSaveBookmark}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
            >
              {loading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              {existingBookmark ? 'Update Bookmark' : 'Save Bookmark'}
            </button>
            
            {existingBookmark && (
              <button
                type="button"
                disabled={loading}
                onClick={handleRemoveBookmark}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-red-300 shadow-sm px-4 py-2 bg-red-50 text-base font-medium text-red-700 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
              >
                Remove Bookmark
              </button>
            )}
            
            <button
              type="button"
              disabled={loading}
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookmarkModal;