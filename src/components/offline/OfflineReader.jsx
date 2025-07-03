import React, { useState, useEffect } from 'react';
import {
  CloudArrowDownIcon,
  CloudArrowUpIcon,
  SignalSlashIcon,
  WifiIcon,
  DocumentTextIcon,
  TrashIcon,
  FolderIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowDownTrayIcon,
  Cog6ToothIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';

import offlineService from '../../services/OfflineService';

const OfflineReader = ({ resources = [], onResourceSelect, currentResource = null }) => {
  const [cachedResources, setCachedResources] = useState([]);
  const [downloadQueue, setDownloadQueue] = useState([]);
  const [storageInfo, setStorageInfo] = useState({});
  const [downloadStats, setDownloadStats] = useState({});
  const [networkStatus, setNetworkStatus] = useState({ online: true });
  const [selectedResources, setSelectedResources] = useState(new Set());
  const [showSettings, setShowSettings] = useState(false);
  const [downloadOptions, setDownloadOptions] = useState({
    includeImages: true,
    includeVideos: false,
    quality: 'high',
    compress: true
  });
  const [activeTab, setActiveTab] = useState('available'); // 'available', 'cached', 'downloading', 'settings'
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState(null);

  // Initialize offline service
  useEffect(() => {
    const initializeOfflineService = async () => {
      try {
        await offlineService.initialize();
        setIsInitialized(true);
        
        // Load initial data
        await Promise.all([
          loadCachedResources(),
          loadStorageInfo(),
          loadDownloadStats()
        ]);
        
        // Setup network listeners
        const cleanup = offlineService.setupOfflineListeners({
          onOnline: () => setNetworkStatus({ online: true }),
          onOffline: () => setNetworkStatus({ online: false }),
          onConnectionChange: () => {
            setNetworkStatus(offlineService.getNetworkStatus());
          }
        });
        
        return cleanup;
      } catch (error) {
        console.error('Failed to initialize offline service:', error);
        setError('Failed to initialize offline functionality');
      }
    };
    
    let cleanup;
    initializeOfflineService().then(cleanupFn => {
      cleanup = cleanupFn;
    });
    
    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  // Load cached resources
  const loadCachedResources = async () => {
    try {
      const cached = await offlineService.getCachedResources();
      setCachedResources(cached);
    } catch (error) {
      console.error('Error loading cached resources:', error);
    }
  };

  // Load storage information
  const loadStorageInfo = async () => {
    try {
      const info = await offlineService.getStorageInfo();
      setStorageInfo(info);
    } catch (error) {
      console.error('Error loading storage info:', error);
    }
  };

  // Load download statistics
  const loadDownloadStats = async () => {
    try {
      const stats = await offlineService.getDownloadStats();
      setDownloadStats(stats);
    } catch (error) {
      console.error('Error loading download stats:', error);
    }
  };

  // Download single resource
  const downloadResource = async (resource) => {
    try {
      setDownloadQueue(prev => [...prev, resource.id]);
      
      const result = await offlineService.downloadResource(resource, downloadOptions);
      
      if (result.success) {
        await Promise.all([
          loadCachedResources(),
          loadStorageInfo(),
          loadDownloadStats()
        ]);
      }
    } catch (error) {
      console.error('Error downloading resource:', error);
      setError(`Failed to download: ${resource.title}`);
    } finally {
      setDownloadQueue(prev => prev.filter(id => id !== resource.id));
    }
  };

  // Download multiple resources
  const downloadMultipleResources = async () => {
    const resourcesToDownload = resources.filter(r => selectedResources.has(r.id));
    
    for (const resource of resourcesToDownload) {
      await downloadResource(resource);
    }
    
    setSelectedResources(new Set());
  };

  // Remove cached resource
  const removeCachedResource = async (resourceId) => {
    try {
      await offlineService.removeCachedResource(resourceId);
      await Promise.all([
        loadCachedResources(),
        loadStorageInfo(),
        loadDownloadStats()
      ]);
    } catch (error) {
      console.error('Error removing cached resource:', error);
      setError('Failed to remove cached resource');
    }
  };

  // Clear all cache
  const clearAllCache = async () => {
    if (window.confirm('Are you sure you want to clear all offline content? This action cannot be undone.')) {
      try {
        await offlineService.clearCache();
        await Promise.all([
          loadCachedResources(),
          loadStorageInfo(),
          loadDownloadStats()
        ]);
      } catch (error) {
        console.error('Error clearing cache:', error);
        setError('Failed to clear cache');
      }
    }
  };

  // Cleanup old content
  const cleanupOldContent = async () => {
    try {
      const result = await offlineService.cleanupOldContent(30); // 30 days
      await Promise.all([
        loadCachedResources(),
        loadStorageInfo(),
        loadDownloadStats()
      ]);
      
      if (result.cleaned > 0) {
        alert(`Cleaned up ${result.cleaned} old resources, freed ${(result.totalCleaned / 1024 / 1024).toFixed(2)} MB`);
      } else {
        alert('No old content to clean up');
      }
    } catch (error) {
      console.error('Error cleaning up old content:', error);
      setError('Failed to cleanup old content');
    }
  };

  // Toggle resource selection
  const toggleResourceSelection = (resourceId) => {
    const newSelected = new Set(selectedResources);
    if (newSelected.has(resourceId)) {
      newSelected.delete(resourceId);
    } else {
      newSelected.add(resourceId);
    }
    setSelectedResources(newSelected);
  };

  // Check if resource is cached
  const isResourceCached = (resourceId) => {
    return cachedResources.some(cached => cached.id === resourceId);
  };

  // Check if resource is downloading
  const isResourceDownloading = (resourceId) => {
    return downloadQueue.includes(resourceId);
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Get available resources (not cached)
  const availableResources = resources.filter(r => !isResourceCached(r.id));

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-t-4 border-blue-600 border-solid rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing offline reader...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center space-x-3">
          <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
          <div>
            <h3 className="text-lg font-medium text-red-800">Offline Reader Error</h3>
            <p className="text-red-700 mt-1">{error}</p>
            <button
              onClick={() => {
                setError(null);
                window.location.reload();
              }}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            {networkStatus.online ? (
              <WifiIcon className="w-6 h-6 text-green-600" />
            ) : (
              <SignalSlashIcon className="w-6 h-6 text-red-600" />
            )}
            <h2 className="text-2xl font-bold text-gray-800">
              Offline Reader
            </h2>
          </div>
          
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            networkStatus.online 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {networkStatus.online ? 'Online' : 'Offline'}
          </div>
        </div>
        
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <Cog6ToothIcon className="w-4 h-4" />
          <span>Settings</span>
        </button>
      </div>

      {/* Storage Usage */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-800">Storage Usage</h3>
          <span className="text-sm text-gray-600">
            {formatFileSize(storageInfo.used || 0)} of {formatFileSize(storageInfo.quota || 0)} used
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <div 
            className="bg-blue-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${storageInfo.percentageUsed || 0}%` }}
          ></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{cachedResources.length}</div>
            <div className="text-gray-600">Cached Resources</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {formatFileSize(storageInfo.cacheSize || 0)}
            </div>
            <div className="text-gray-600">Cache Size</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {Object.keys(downloadStats.categories || {}).length}
            </div>
            <div className="text-gray-600">Categories</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {storageInfo.percentageUsed || 0}%
            </div>
            <div className="text-gray-600">Storage Used</div>
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Download Settings</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-700">Content Options</h4>
              
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={downloadOptions.includeImages}
                    onChange={(e) => setDownloadOptions(prev => ({...prev, includeImages: e.target.checked}))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Include images</span>
                </label>
                
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={downloadOptions.includeVideos}
                    onChange={(e) => setDownloadOptions(prev => ({...prev, includeVideos: e.target.checked}))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Include videos (larger size)</span>
                </label>
                
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={downloadOptions.compress}
                    onChange={(e) => setDownloadOptions(prev => ({...prev, compress: e.target.checked}))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Compress content (saves space)</span>
                </label>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium text-gray-700">Quality Settings</h4>
              
              <div className="space-y-2">
                {['low', 'medium', 'high'].map(quality => (
                  <label key={quality} className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="quality"
                      value={quality}
                      checked={downloadOptions.quality === quality}
                      onChange={(e) => setDownloadOptions(prev => ({...prev, quality: e.target.value}))}
                      className="border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 capitalize">{quality} quality</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
            <div className="space-x-3">
              <button
                onClick={cleanupOldContent}
                className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
              >
                Cleanup Old Content
              </button>
              <button
                onClick={clearAllCache}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Clear All Cache
              </button>
            </div>
            
            <button
              onClick={() => setShowSettings(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              Close Settings
            </button>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'available', label: 'Available', count: availableResources.length },
          { id: 'cached', label: 'Offline', count: cachedResources.length },
          { id: 'downloading', label: 'Downloading', count: downloadQueue.length }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`px-2 py-1 rounded-full text-xs ${
              activeTab === tab.id
                ? 'bg-blue-100 text-blue-600'
                : 'bg-gray-200 text-gray-600'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Content based on active tab */}
      {activeTab === 'available' && (
        <div>
          {/* Bulk Actions */}
          {selectedResources.size > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-blue-800">
                  {selectedResources.size} resources selected
                </span>
                <div className="space-x-3">
                  <button
                    onClick={downloadMultipleResources}
                    disabled={!networkStatus.online}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Download Selected
                  </button>
                  <button
                    onClick={() => setSelectedResources(new Set())}
                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                  >
                    Clear Selection
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Available Resources */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableResources.map(resource => (
              <div key={resource.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800 mb-1 line-clamp-2">{resource.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{resource.description}</p>
                  </div>
                  
                  <input
                    type="checkbox"
                    checked={selectedResources.has(resource.id)}
                    onChange={() => toggleResourceSelection(resource.id)}
                    className="ml-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                  <span className="bg-gray-100 px-2 py-1 rounded capitalize">{resource.type}</span>
                  <span>{resource.category}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    Est: {Math.floor(Math.random() * 5) + 1} MB
                  </div>
                  
                  <button
                    onClick={() => downloadResource(resource)}
                    disabled={!networkStatus.online || isResourceDownloading(resource.id)}
                    className="flex items-center space-x-2 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isResourceDownloading(resource.id) ? (
                      <>
                        <div className="w-4 h-4 border-t-2 border-white border-solid rounded-full animate-spin"></div>
                        <span>Downloading</span>
                      </>
                    ) : (
                      <>
                        <ArrowDownTrayIcon className="w-4 h-4" />
                        <span>Download</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {availableResources.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <CloudArrowDownIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>All available resources have been downloaded for offline reading.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'cached' && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cachedResources.map(resource => (
              <div key={resource.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800 mb-1 line-clamp-2">{resource.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{resource.description}</p>
                  </div>
                  
                  <CheckCircleSolid className="w-5 h-5 text-green-600 ml-3 flex-shrink-0" />
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                  <span className="bg-gray-100 px-2 py-1 rounded capitalize">{resource.type}</span>
                  <span>{formatFileSize(resource.size || 0)}</span>
                </div>
                
                <div className="text-xs text-gray-500 mb-3">
                  Downloaded: {new Date(resource.downloadDate).toLocaleDateString()}
                </div>
                
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => onResourceSelect && onResourceSelect(resource)}
                    className="flex items-center space-x-2 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                  >
                    <DocumentTextIcon className="w-4 h-4" />
                    <span>Read</span>
                  </button>
                  
                  <button
                    onClick={() => removeCachedResource(resource.id)}
                    className="flex items-center space-x-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                    title="Remove from offline storage"
                  >
                    <TrashIcon className="w-4 h-4" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {cachedResources.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <FolderIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>No resources cached for offline reading yet.</p>
              <p className="text-sm mt-2">Download resources from the Available tab to read them offline.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'downloading' && (
        <div>
          {downloadQueue.length > 0 ? (
            <div className="space-y-4">
              {downloadQueue.map(resourceId => {
                const resource = resources.find(r => r.id === resourceId);
                return resource ? (
                  <div key={resourceId} className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800">{resource.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">Downloading...</p>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 border-t-2 border-blue-600 border-solid rounded-full animate-spin"></div>
                        <span className="text-sm text-gray-600">Processing</span>
                      </div>
                    </div>
                  </div>
                ) : null;
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <CloudArrowUpIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>No resources currently downloading.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OfflineReader;