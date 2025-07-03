// Service for managing offline reading functionality and resource caching

class OfflineService {
  constructor() {
    this.dbName = 'HealthResourcesDB';
    this.dbVersion = 1;
    this.db = null;
    this.storageQuota = 50 * 1024 * 1024; // 50MB default quota
    this.maxCacheSize = 100 * 1024 * 1024; // 100MB max cache
    this.compressionEnabled = true;
  }

  // Initialize IndexedDB for offline storage
  async initialize() {
    try {
      if (!('indexedDB' in window)) {
        throw new Error('IndexedDB not supported');
      }

      return new Promise((resolve, reject) => {
        const request = indexedDB.open(this.dbName, this.dbVersion);
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          this.db = request.result;
          resolve(this.db);
        };
        
        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          
          // Create object stores
          if (!db.objectStoreNames.contains('resources')) {
            const resourceStore = db.createObjectStore('resources', { keyPath: 'id' });
            resourceStore.createIndex('category', 'category', { unique: false });
            resourceStore.createIndex('downloadDate', 'downloadDate', { unique: false });
            resourceStore.createIndex('size', 'size', { unique: false });
          }
          
          if (!db.objectStoreNames.contains('content')) {
            const contentStore = db.createObjectStore('content', { keyPath: 'resourceId' });
            contentStore.createIndex('contentType', 'contentType', { unique: false });
          }
          
          if (!db.objectStoreNames.contains('metadata')) {
            db.createObjectStore('metadata', { keyPath: 'key' });
          }
        };
      });
    } catch (error) {
      console.error('Error initializing offline service:', error);
      throw error;
    }
  }

  // Check if browser supports offline features
  isOfflineSupported() {
    return {
      indexedDB: 'indexedDB' in window,
      serviceWorker: 'serviceWorker' in navigator,
      cacheAPI: 'caches' in window,
      storageEstimate: 'storage' in navigator && 'estimate' in navigator.storage,
      compressionSupported: typeof CompressionStream !== 'undefined'
    };
  }

  // Get storage usage information
  async getStorageInfo() {
    try {
      let storageInfo = {
        used: 0,
        available: this.storageQuota,
        total: this.storageQuota,
        quota: this.storageQuota
      };

      if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        storageInfo = {
          used: estimate.usage || 0,
          available: (estimate.quota || this.storageQuota) - (estimate.usage || 0),
          total: estimate.quota || this.storageQuota,
          quota: estimate.quota || this.storageQuota
        };
      }

      // Get cached resources size
      const cachedResources = await this.getCachedResources();
      const cacheSize = cachedResources.reduce((total, resource) => total + (resource.size || 0), 0);
      
      return {
        ...storageInfo,
        cacheSize,
        cachedResourcesCount: cachedResources.length,
        percentageUsed: Math.round((storageInfo.used / storageInfo.total) * 100)
      };
    } catch (error) {
      console.error('Error getting storage info:', error);
      return {
        used: 0,
        available: this.storageQuota,
        total: this.storageQuota,
        quota: this.storageQuota,
        cacheSize: 0,
        cachedResourcesCount: 0,
        percentageUsed: 0
      };
    }
  }

  // Download and cache a resource for offline reading
  async downloadResource(resource, options = {}) {
    try {
      if (!this.db) {
        await this.initialize();
      }

      const {
        includeImages = true,
        includeVideos = false,
        quality = 'high',
        compress = this.compressionEnabled
      } = options;

      // Simulate content fetching (in real app, this would fetch from URL)
      const content = await this.fetchResourceContent(resource, {
        includeImages,
        includeVideos,
        quality
      });

      // Compress content if enabled
      const processedContent = compress ? await this.compressContent(content) : content;
      
      // Calculate size
      const contentSize = this.calculateContentSize(processedContent);
      
      // Check storage availability
      const storageInfo = await this.getStorageInfo();
      if (storageInfo.available < contentSize) {
        throw new Error('Insufficient storage space');
      }

      // Create offline resource record
      const offlineResource = {
        ...resource,
        downloadDate: new Date().toISOString(),
        size: contentSize,
        quality,
        compressed: compress,
        includeImages,
        includeVideos,
        status: 'cached',
        version: '1.0'
      };

      // Store resource metadata
      await this.storeInDB('resources', offlineResource);
      
      // Store content
      await this.storeInDB('content', {
        resourceId: resource.id,
        content: processedContent,
        contentType: resource.type,
        size: contentSize,
        downloadDate: offlineResource.downloadDate
      });

      // Update download statistics
      await this.updateDownloadStats();

      return {
        success: true,
        resource: offlineResource,
        size: contentSize
      };
    } catch (error) {
      console.error('Error downloading resource:', error);
      throw error;
    }
  }

  // Fetch resource content (simulated)
  async fetchResourceContent(resource, options) {
    // In a real application, this would fetch content from the resource URL
    // For demo purposes, we'll create simulated content
    
    const baseContent = {
      title: resource.title,
      description: resource.description,
      fullText: this.generateFullText(resource),
      metadata: {
        author: resource.author,
        publishDate: resource.publishDate,
        category: resource.category,
        readingTime: resource.duration
      }
    };

    if (options.includeImages) {
      baseContent.images = this.generateImagePlaceholders(resource);
    }

    if (options.includeVideos && resource.type === 'video') {
      baseContent.videoData = {
        thumbnail: resource.thumbnail,
        duration: resource.duration,
        transcript: this.generateTranscript(resource)
      };
    }

    return baseContent;
  }

  // Generate full text content for offline reading
  generateFullText(resource) {
    // Simulate comprehensive article content based on resource type
    const paragraphs = {
      'article': [
        `${resource.description}\n\n`,
        'This comprehensive health resource provides evidence-based information to help you make informed decisions about your wellness journey.',
        'Research shows that understanding health topics thoroughly can lead to better health outcomes and improved quality of life.',
        'Key takeaways from this resource include practical tips, scientific insights, and actionable recommendations.',
        'Regular engagement with quality health information empowers individuals to take control of their well-being.',
        'This content has been reviewed by health professionals to ensure accuracy and relevance.',
        'For additional resources and updates, consider bookmarking this content for future reference.'
      ],
      'video': [
        `Video: ${resource.title}\n\n`,
        'This educational video covers important health topics with visual demonstrations and expert commentary.',
        'Key concepts are explained through clear examples and practical applications.',
        'The video includes references to current research and evidence-based practices.',
        'Visual learners will benefit from the comprehensive approach to health education presented.',
        'Timestamps and key points are highlighted for easy navigation and review.'
      ],
      'podcast': [
        `Podcast Episode: ${resource.title}\n\n`,
        'This audio content features expert discussions on important health topics.',
        'Listeners will gain insights from healthcare professionals and researchers.',
        'The conversation covers practical applications and real-world examples.',
        'Audio format allows for convenient learning during commutes or exercise.',
        'Episode includes resources and references mentioned during the discussion.'
      ]
    };

    const contentType = resource.type || 'article';
    const selectedParagraphs = paragraphs[contentType] || paragraphs.article;
    
    return selectedParagraphs.join('\n\n');
  }

  // Generate image placeholders for offline content
  generateImagePlaceholders(resource) {
    const imageCount = Math.floor(Math.random() * 3) + 1;
    const images = [];
    
    for (let i = 0; i < imageCount; i++) {
      images.push({
        id: `img_${resource.id}_${i}`,
        alt: `Illustration for ${resource.title} - Image ${i + 1}`,
        caption: `Visual representation of key concepts discussed in ${resource.title}`,
        placeholder: `data:image/svg+xml;base64,${btoa(`
          <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="#f3f4f6"/>
            <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#6b7280">
              Health Illustration ${i + 1}
            </text>
          </svg>
        `)}`
      });
    }
    
    return images;
  }

  // Generate transcript for video content
  generateTranscript(resource) {
    return [
      '00:00 - Introduction to the topic',
      '02:15 - Key concepts and definitions',
      '05:30 - Research findings and evidence',
      '08:45 - Practical applications and tips',
      '12:00 - Common misconceptions addressed',
      '15:30 - Conclusion and key takeaways'
    ].join('\n');
  }

  // Compress content for storage optimization
  async compressContent(content) {
    try {
      if (typeof CompressionStream !== 'undefined') {
        const stream = new CompressionStream('gzip');
        const writer = stream.writable.getWriter();
        const reader = stream.readable.getReader();
        
        const contentString = JSON.stringify(content);
        const encoder = new TextEncoder();
        
        writer.write(encoder.encode(contentString));
        writer.close();
        
        const chunks = [];
        let result = await reader.read();
        
        while (!result.done) {
          chunks.push(result.value);
          result = await reader.read();
        }
        
        return {
          compressed: true,
          data: chunks,
          originalSize: contentString.length,
          compressedSize: chunks.reduce((total, chunk) => total + chunk.length, 0)
        };
      }
    } catch (error) {
      console.warn('Compression failed, storing uncompressed:', error);
    }
    
    return {
      compressed: false,
      data: content,
      originalSize: JSON.stringify(content).length,
      compressedSize: JSON.stringify(content).length
    };
  }

  // Decompress content for reading
  async decompressContent(compressedData) {
    try {
      if (compressedData.compressed && typeof DecompressionStream !== 'undefined') {
        const stream = new DecompressionStream('gzip');
        const writer = stream.writable.getWriter();
        const reader = stream.readable.getReader();
        
        // Write compressed chunks
        for (const chunk of compressedData.data) {
          writer.write(chunk);
        }
        writer.close();
        
        // Read decompressed data
        const chunks = [];
        let result = await reader.read();
        
        while (!result.done) {
          chunks.push(result.value);
          result = await reader.read();
        }
        
        const decoder = new TextDecoder();
        const decompressedString = decoder.decode(new Uint8Array(
          chunks.reduce((acc, chunk) => [...acc, ...chunk], [])
        ));
        
        return JSON.parse(decompressedString);
      }
    } catch (error) {
      console.warn('Decompression failed, trying direct access:', error);
    }
    
    return compressedData.data;
  }

  // Calculate content size in bytes
  calculateContentSize(content) {
    try {
      if (content.compressed) {
        return content.compressedSize;
      }
      return new Blob([JSON.stringify(content)]).size;
    } catch (error) {
      console.error('Error calculating content size:', error);
      return 0;
    }
  }

  // Store data in IndexedDB
  async storeInDB(storeName, data) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Retrieve data from IndexedDB
  async getFromDB(storeName, key) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Get all data from a store
  async getAllFromDB(storeName) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Delete data from IndexedDB
  async deleteFromDB(storeName, key) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Get cached resources
  async getCachedResources() {
    try {
      if (!this.db) {
        await this.initialize();
      }
      return await this.getAllFromDB('resources');
    } catch (error) {
      console.error('Error getting cached resources:', error);
      return [];
    }
  }

  // Get offline content for a resource
  async getOfflineContent(resourceId) {
    try {
      if (!this.db) {
        await this.initialize();
      }
      
      const content = await this.getFromDB('content', resourceId);
      if (!content) {
        throw new Error('Content not found offline');
      }
      
      // Decompress if necessary
      const processedContent = await this.decompressContent(content.content);
      
      return {
        ...content,
        content: processedContent
      };
    } catch (error) {
      console.error('Error getting offline content:', error);
      throw error;
    }
  }

  // Check if resource is cached
  async isResourceCached(resourceId) {
    try {
      if (!this.db) {
        await this.initialize();
      }
      const resource = await this.getFromDB('resources', resourceId);
      return !!resource;
    } catch (error) {
      console.error('Error checking cache status:', error);
      return false;
    }
  }

  // Remove resource from cache
  async removeCachedResource(resourceId) {
    try {
      if (!this.db) {
        await this.initialize();
      }
      
      await this.deleteFromDB('resources', resourceId);
      await this.deleteFromDB('content', resourceId);
      
      await this.updateDownloadStats();
      
      return true;
    } catch (error) {
      console.error('Error removing cached resource:', error)
      throw error;
    }
  }

  // Clear all cached content
  async clearCache() {
    try {
      if (!this.db) {
        await this.initialize();
      }
      
      const transaction = this.db.transaction(['resources', 'content'], 'readwrite');
      
      transaction.objectStore('resources').clear();
      transaction.objectStore('content').clear();
      
      await this.updateDownloadStats();
      
      return new Promise((resolve, reject) => {
        transaction.oncomplete = () => resolve(true);
        transaction.onerror = () => reject(transaction.error);
      });
    } catch (error) {
      console.error('Error clearing cache:', error);
      throw error;
    }
  }

  // Update download statistics
  async updateDownloadStats() {
    try {
      const cachedResources = await this.getCachedResources();
      const storageInfo = await this.getStorageInfo();
      
      const stats = {
        totalDownloads: cachedResources.length,
        totalSize: cachedResources.reduce((total, resource) => total + (resource.size || 0), 0),
        lastUpdated: new Date().toISOString(),
        categories: {},
        downloadDates: {}
      };
      
      // Analyze by category
      cachedResources.forEach(resource => {
        stats.categories[resource.category] = (stats.categories[resource.category] || 0) + 1;
        
        const downloadDate = resource.downloadDate.split('T')[0];
        stats.downloadDates[downloadDate] = (stats.downloadDates[downloadDate] || 0) + 1;
      });
      
      await this.storeInDB('metadata', {
        key: 'downloadStats',
        ...stats,
        storageInfo
      });
      
      return stats;
    } catch (error) {
      console.error('Error updating download stats:', error);
    }
  }

  // Get download statistics
  async getDownloadStats() {
    try {
      if (!this.db) {
        await this.initialize();
      }
      
      const stats = await this.getFromDB('metadata', 'downloadStats');
      return stats || {
        totalDownloads: 0,
        totalSize: 0,
        categories: {},
        downloadDates: {},
        lastUpdated: null
      };
    } catch (error) {
      console.error('Error getting download stats:', error);
      return {
        totalDownloads: 0,
        totalSize: 0,
        categories: {},
        downloadDates: {},
        lastUpdated: null
      };
    }
  }

  // Export cached content
  async exportCache() {
    try {
      const cachedResources = await this.getCachedResources();
      const stats = await this.getDownloadStats();
      
      const exportData = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        statistics: stats,
        resources: cachedResources.map(resource => ({
          id: resource.id,
          title: resource.title,
          category: resource.category,
          downloadDate: resource.downloadDate,
          size: resource.size
        }))
      };
      
      return exportData;
    } catch (error) {
      console.error('Error exporting cache:', error);
      throw error;
    }
  }

  // Clean up old cached content
  async cleanupOldContent(daysOld = 30) {
    try {
      const cutoffDate = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000);
      const cachedResources = await this.getCachedResources();
      
      const oldResources = cachedResources.filter(resource => 
        new Date(resource.downloadDate) < cutoffDate
      );
      
      for (const resource of oldResources) {
        await this.removeCachedResource(resource.id);
      }
      
      return {
        cleaned: oldResources.length,
        totalCleaned: oldResources.reduce((total, resource) => total + (resource.size || 0), 0)
      };
    } catch (error) {
      console.error('Error cleaning up old content:', error);
      throw error;
    }
  }

  // Get network status
  getNetworkStatus() {
    return {
      online: navigator.onLine,
      connection: navigator.connection ? {
        effectiveType: navigator.connection.effectiveType,
        downlink: navigator.connection.downlink,
        rtt: navigator.connection.rtt,
        saveData: navigator.connection.saveData
      } : null
    };
  }

  // Setup offline event listeners
  setupOfflineListeners(callbacks = {}) {
    const {
      onOnline = () => {},
      onOffline = () => {},
      onConnectionChange = () => {}
    } = callbacks;
    
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    
    if (navigator.connection) {
      navigator.connection.addEventListener('change', onConnectionChange);
    }
    
    // Return cleanup function
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
      if (navigator.connection) {
        navigator.connection.removeEventListener('change', onConnectionChange);
      }
    };
  }
}

// Create and export singleton instance
const offlineService = new OfflineService();
export default offlineService;