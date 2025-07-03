import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/common/Layout';
import ResourceCardFixed from '../components/resources/ResourceCardFixed';
import BookmarkModal from '../components/bookmarks/BookmarkModal';
import bookmarkService from '../services/BookmarkService';

const Bookmarks = () => {
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState([]);
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showModal, setShowModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [selectedBookmarks, setSelectedBookmarks] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allBookmarks = bookmarkService.getBookmarks();
    const allFolders = bookmarkService.getFolders();
    const stats = bookmarkService.getStatistics();
    
    setBookmarks(allBookmarks);
    setFolders(allFolders);
    setStatistics(stats);
  };

  // Filter and sort bookmarks
  const getFilteredBookmarks = () => {
    let filtered = bookmarks;

    // Filter by folder
    if (selectedFolder !== 'all') {
      filtered = filtered.filter(bookmark => bookmark.folderId === selectedFolder);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(bookmark => 
        bookmark.resourceTitle.toLowerCase().includes(query) ||
        bookmark.resourceDescription.toLowerCase().includes(query) ||
        bookmark.notes.toLowerCase().includes(query) ||
        bookmark.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Sort bookmarks
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'alphabetical':
        filtered.sort((a, b) => a.resourceTitle.toLowerCase().localeCompare(b.resourceTitle.toLowerCase()));
        break;
      case 'type':
        filtered.sort((a, b) => a.resourceType.localeCompare(b.resourceType));
        break;
      default:
        break;
    }

    return filtered;
  };

  const handleBookmarkToggle = (resourceId, isBookmarked) => {
    if (!isBookmarked) {
      // Remove bookmark
      bookmarkService.removeBookmark(resourceId);
    }
    loadData();
  };

  const handleResourceClick = (bookmark) => {
    if (bookmark.resourceUrl) {
      window.open(bookmark.resourceUrl, '_blank');
    }
  };

  const handleEditBookmark = (bookmark) => {
    // Convert bookmark back to resource format for the modal
    const resource = {
      id: bookmark.resourceId,
      title: bookmark.resourceTitle,
      type: bookmark.resourceType,
      author: bookmark.resourceAuthor,
      url: bookmark.resourceUrl,
      description: bookmark.resourceDescription,
      healthTopics: bookmark.tags
    };
    setSelectedResource(resource);
    setShowModal(true);
  };

  const handleBulkAction = (action) => {
    switch (action) {
      case 'delete':
        if (window.confirm(`Delete ${selectedBookmarks.length} selected bookmarks?`)) {
          selectedBookmarks.forEach(bookmarkId => {
            const bookmark = bookmarks.find(b => b.id === bookmarkId);
            if (bookmark) {
              bookmarkService.removeBookmark(bookmark.resourceId);
            }
          });
          setSelectedBookmarks([]);
          loadData();
        }
        break;
      case 'move':
        // This would open a folder selection modal
        console.log('Move to folder functionality');
        break;
      default:
        break;
    }
  };

  const exportBookmarks = () => {
    const exportData = bookmarkService.exportBookmarks();
    const blob = new Blob([exportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `health-bookmarks-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getFolderById = (folderId) => {
    return folders.find(f => f.id === folderId) || { name: 'Unknown', icon: '📁', color: 'gray' };
  };

  const getColorClass = (color) => {
    const colorMap = {
      blue: 'bg-blue-100 text-blue-800',
      green: 'bg-green-100 text-green-800',
      purple: 'bg-purple-100 text-purple-800',
      red: 'bg-red-100 text-red-800',
      yellow: 'bg-yellow-100 text-yellow-800',
      pink: 'bg-pink-100 text-pink-800',
      indigo: 'bg-indigo-100 text-indigo-800',
      gray: 'bg-gray-100 text-gray-800'
    };
    return colorMap[color] || 'bg-blue-100 text-blue-800';
  };

  const filteredBookmarks = getFilteredBookmarks();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">My Bookmarks</h1>
              <p className="text-gray-600">
                Manage your saved health resources and organize them into folders
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex space-x-2">
              <button
                onClick={exportBookmarks}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export
              </button>
              <button
                onClick={() => navigate('/resources')}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Resources
              </button>
            </div>
          </div>
        </div>

        {/* Statistics */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-purple-600">{statistics.totalBookmarks}</div>
              <div className="text-sm text-gray-600">Total Bookmarks</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-blue-600">{statistics.totalFolders}</div>
              <div className="text-sm text-gray-600">Folders</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-green-600">
                {Object.keys(statistics.bookmarksByType).length}
              </div>
              <div className="text-sm text-gray-600">Content Types</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-orange-600">
                {statistics.recentBookmarks.length}
              </div>
              <div className="text-sm text-gray-600">Recent</div>
            </div>
          </div>
        )}

        {/* Filters and Controls */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search bookmarks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Folder Filter */}
            <div>
              <select
                value={selectedFolder}
                onChange={(e) => setSelectedFolder(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Folders</option>
                {folders.map(folder => (
                  <option key={folder.id} value={folder.id}>
                    {folder.icon} {folder.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="alphabetical">Alphabetical</option>
                <option value="type">By Type</option>
              </select>
            </div>
          </div>

          {/* View Toggle and Bulk Actions */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">View:</span>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1 rounded ${viewMode === 'grid' ? 'bg-purple-100 text-purple-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1 rounded ${viewMode === 'list' ? 'bg-purple-100 text-purple-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button>
              </div>
              
              <span className="text-sm text-gray-500">
                {filteredBookmarks.length} bookmark{filteredBookmarks.length !== 1 ? 's' : ''}
              </span>
            </div>

            {selectedBookmarks.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {selectedBookmarks.length} selected
                </span>
                <button
                  onClick={() => handleBulkAction('delete')}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bookmarks Display */}
        {filteredBookmarks.length > 0 ? (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredBookmarks.map((bookmark) => {
              const folder = getFolderById(bookmark.folderId);
              const resource = {
                id: bookmark.resourceId,
                title: bookmark.resourceTitle,
                description: bookmark.resourceDescription,
                type: bookmark.resourceType,
                author: bookmark.resourceAuthor,
                url: bookmark.resourceUrl,
                publishDate: bookmark.createdAt,
                isBookmarked: true,
                healthTopics: bookmark.tags || []
              };

              return (
                <div key={bookmark.id} className={viewMode === 'list' ? 'bg-white border border-gray-200 rounded-lg p-4' : ''}>
                  {viewMode === 'grid' ? (
                    <div className="relative">
                      <ResourceCardFixed
                        resource={resource}
                        onBookmarkToggle={(id, isBookmarked) => handleBookmarkToggle(id, isBookmarked)}
                        onClick={() => handleResourceClick(bookmark)}
                      />
                      <div className="absolute top-2 left-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getColorClass(folder.color)}`}>
                          {folder.icon} {folder.name}
                        </span>
                      </div>
                      <button
                        onClick={() => handleEditBookmark(bookmark)}
                        className="absolute top-2 right-12 p-1 bg-white rounded-full shadow-sm hover:bg-gray-50"
                        title="Edit bookmark"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-start space-x-4">
                      <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${
                        bookmark.resourceType === 'Articles' ? 'bg-blue-100 text-blue-600' :
                        bookmark.resourceType === 'Videos' ? 'bg-red-100 text-red-600' :
                        bookmark.resourceType === 'Podcasts' ? 'bg-green-100 text-green-600' :
                        'bg-purple-100 text-purple-600'
                      }`}>
                        {bookmark.resourceType === 'Articles' ? '📄' :
                         bookmark.resourceType === 'Videos' ? '🎥' :
                         bookmark.resourceType === 'Podcasts' ? '🎙️' : '📊'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-medium text-gray-900 cursor-pointer hover:text-purple-600"
                                onClick={() => handleResourceClick(bookmark)}>
                              {bookmark.resourceTitle}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">{bookmark.resourceAuthor}</p>
                            <p className="text-sm text-gray-500 mt-2 line-clamp-2">{bookmark.resourceDescription}</p>
                            {bookmark.notes && (
                              <p className="text-sm text-blue-600 mt-2 italic">📝 {bookmark.notes}</p>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getColorClass(folder.color)}`}>
                              {folder.icon} {folder.name}
                            </span>
                            <button
                              onClick={() => handleEditBookmark(bookmark)}
                              className="p-1 text-gray-400 hover:text-gray-600"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              <div className="text-lg font-medium">
                {bookmarks.length === 0 ? 'No bookmarks yet' : 'No bookmarks match your criteria'}
              </div>
              <div className="text-sm mt-2">
                {bookmarks.length === 0 
                  ? 'Start bookmarking health resources to see them here'
                  : 'Try adjusting your search or filter settings'
                }
              </div>
            </div>
            <button
              onClick={() => navigate('/resources')}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
            >
              Browse Resources
            </button>
          </div>
        )}

        {/* Bookmark Modal */}
        <BookmarkModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedResource(null);
          }}
          resource={selectedResource}
          onBookmarkChange={handleBookmarkToggle}
        />
      </div>
    </Layout>
  );
};

export default Bookmarks;