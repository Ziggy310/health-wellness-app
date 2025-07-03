class BookmarkService {
  constructor() {
    this.storageKey = 'healthResourceBookmarks';
    this.foldersKey = 'bookmarkFolders';
    this.init();
  }

  // Initialize default folders
  init() {
    const existingFolders = this.getFolders();
    if (existingFolders.length === 0) {
      const defaultFolders = [
        {
          id: 'default',
          name: 'General',
          color: 'blue',
          icon: '📚',
          description: 'General health resources',
          createdAt: new Date().toISOString()
        },
        {
          id: 'heart-health',
          name: 'Heart Health',
          color: 'red',
          icon: '❤️',
          description: 'Cardiovascular and heart health resources',
          createdAt: new Date().toISOString()
        },
        {
          id: 'nutrition',
          name: 'Nutrition',
          color: 'green',
          icon: '🥗',
          description: 'Diet and nutrition resources',
          createdAt: new Date().toISOString()
        },
        {
          id: 'mental-health',
          name: 'Mental Health',
          color: 'purple',
          icon: '🧠',
          description: 'Mental health and wellness resources',
          createdAt: new Date().toISOString()
        }
      ];
      this.saveFolders(defaultFolders);
    }
  }

  // Get all bookmarks
  getBookmarks() {
    try {
      const bookmarks = localStorage.getItem(this.storageKey);
      return bookmarks ? JSON.parse(bookmarks) : [];
    } catch (error) {
      console.error('Error loading bookmarks:', error);
      return [];
    }
  }

  // Save bookmarks
  saveBookmarks(bookmarks) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(bookmarks));
      return true;
    } catch (error) {
      console.error('Error saving bookmarks:', error);
      return false;
    }
  }

  // Get all folders
  getFolders() {
    try {
      const folders = localStorage.getItem(this.foldersKey);
      return folders ? JSON.parse(folders) : [];
    } catch (error) {
      console.error('Error loading folders:', error);
      return [];
    }
  }

  // Save folders
  saveFolders(folders) {
    try {
      localStorage.setItem(this.foldersKey, JSON.stringify(folders));
      return true;
    } catch (error) {
      console.error('Error saving folders:', error);
      return false;
    }
  }

  // Add bookmark
  addBookmark(resource, folderId = 'default', notes = '') {
    const bookmarks = this.getBookmarks();
    
    // Check if already bookmarked
    const existingIndex = bookmarks.findIndex(b => b.resourceId === resource.id);
    if (existingIndex !== -1) {
      // Update existing bookmark
      bookmarks[existingIndex] = {
        ...bookmarks[existingIndex],
        folderId,
        notes,
        updatedAt: new Date().toISOString()
      };
    } else {
      // Add new bookmark
      const bookmark = {
        id: `bookmark-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        resourceId: resource.id,
        resourceTitle: resource.title,
        resourceType: resource.type,
        resourceAuthor: resource.author,
        resourceUrl: resource.url,
        resourceDescription: resource.description,
        folderId,
        notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: resource.healthTopics || []
      };
      bookmarks.push(bookmark);
    }
    
    return this.saveBookmarks(bookmarks);
  }

  // Remove bookmark
  removeBookmark(resourceId) {
    const bookmarks = this.getBookmarks();
    const filteredBookmarks = bookmarks.filter(b => b.resourceId !== resourceId);
    return this.saveBookmarks(filteredBookmarks);
  }

  // Check if resource is bookmarked
  isBookmarked(resourceId) {
    const bookmarks = this.getBookmarks();
    return bookmarks.some(b => b.resourceId === resourceId);
  }

  // Get bookmark by resource ID
  getBookmark(resourceId) {
    const bookmarks = this.getBookmarks();
    return bookmarks.find(b => b.resourceId === resourceId);
  }

  // Get bookmarks by folder
  getBookmarksByFolder(folderId) {
    const bookmarks = this.getBookmarks();
    return bookmarks.filter(b => b.folderId === folderId);
  }

  // Move bookmark to different folder
  moveBookmark(resourceId, newFolderId) {
    const bookmarks = this.getBookmarks();
    const bookmarkIndex = bookmarks.findIndex(b => b.resourceId === resourceId);
    
    if (bookmarkIndex !== -1) {
      bookmarks[bookmarkIndex].folderId = newFolderId;
      bookmarks[bookmarkIndex].updatedAt = new Date().toISOString();
      return this.saveBookmarks(bookmarks);
    }
    return false;
  }

  // Update bookmark notes
  updateBookmarkNotes(resourceId, notes) {
    const bookmarks = this.getBookmarks();
    const bookmarkIndex = bookmarks.findIndex(b => b.resourceId === resourceId);
    
    if (bookmarkIndex !== -1) {
      bookmarks[bookmarkIndex].notes = notes;
      bookmarks[bookmarkIndex].updatedAt = new Date().toISOString();
      return this.saveBookmarks(bookmarks);
    }
    return false;
  }

  // Create new folder
  createFolder(name, color = 'blue', icon = '📁', description = '') {
    const folders = this.getFolders();
    
    // Check if folder name already exists
    if (folders.some(f => f.name.toLowerCase() === name.toLowerCase())) {
      return { success: false, error: 'Folder name already exists' };
    }
    
    const newFolder = {
      id: `folder-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      color,
      icon,
      description,
      createdAt: new Date().toISOString()
    };
    
    folders.push(newFolder);
    const success = this.saveFolders(folders);
    return { success, folder: success ? newFolder : null };
  }

  // Delete folder and move bookmarks to default
  deleteFolder(folderId) {
    if (folderId === 'default') {
      return { success: false, error: 'Cannot delete default folder' };
    }
    
    const folders = this.getFolders();
    const bookmarks = this.getBookmarks();
    
    // Move all bookmarks from this folder to default
    const updatedBookmarks = bookmarks.map(bookmark => 
      bookmark.folderId === folderId 
        ? { ...bookmark, folderId: 'default', updatedAt: new Date().toISOString() }
        : bookmark
    );
    
    // Remove the folder
    const updatedFolders = folders.filter(f => f.id !== folderId);
    
    const bookmarksSaved = this.saveBookmarks(updatedBookmarks);
    const foldersSaved = this.saveFolders(updatedFolders);
    
    return { success: bookmarksSaved && foldersSaved };
  }

  // Update folder
  updateFolder(folderId, updates) {
    const folders = this.getFolders();
    const folderIndex = folders.findIndex(f => f.id === folderId);
    
    if (folderIndex !== -1) {
      folders[folderIndex] = { ...folders[folderIndex], ...updates };
      return this.saveFolders(folders);
    }
    return false;
  }

  // Get bookmark statistics
  getStatistics() {
    const bookmarks = this.getBookmarks();
    const folders = this.getFolders();
    
    const stats = {
      totalBookmarks: bookmarks.length,
      totalFolders: folders.length,
      bookmarksByType: {},
      bookmarksByFolder: {},
      recentBookmarks: bookmarks
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
    };
    
    // Count by type
    bookmarks.forEach(bookmark => {
      const type = bookmark.resourceType || 'Unknown';
      stats.bookmarksByType[type] = (stats.bookmarksByType[type] || 0) + 1;
    });
    
    // Count by folder
    folders.forEach(folder => {
      const count = bookmarks.filter(b => b.folderId === folder.id).length;
      stats.bookmarksByFolder[folder.name] = count;
    });
    
    return stats;
  }

  // Export bookmarks
  exportBookmarks() {
    const bookmarks = this.getBookmarks();
    const folders = this.getFolders();
    
    const exportData = {
      bookmarks,
      folders,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };
    
    return JSON.stringify(exportData, null, 2);
  }

  // Import bookmarks
  importBookmarks(jsonData) {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.bookmarks && Array.isArray(data.bookmarks)) {
        this.saveBookmarks(data.bookmarks);
      }
      
      if (data.folders && Array.isArray(data.folders)) {
        this.saveFolders(data.folders);
      }
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Search bookmarks
  searchBookmarks(query) {
    const bookmarks = this.getBookmarks();
    const searchTerm = query.toLowerCase();
    
    return bookmarks.filter(bookmark => 
      bookmark.resourceTitle.toLowerCase().includes(searchTerm) ||
      bookmark.resourceDescription.toLowerCase().includes(searchTerm) ||
      bookmark.notes.toLowerCase().includes(searchTerm) ||
      bookmark.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }
}

// Create singleton instance
const bookmarkService = new BookmarkService();
export default bookmarkService;