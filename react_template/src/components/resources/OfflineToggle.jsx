import React, { useState, useEffect } from 'react';
import {
  CloudArrowDownIcon,
  CloudArrowUpIcon,
  SignalSlashIcon,
  WifiIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import offlineService from '../../services/OfflineService';

const OfflineToggle = ({ resource, onOfflineStatusChange }) => {
  const [isOffline, setIsOffline] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [networkStatus, setNetworkStatus] = useState(navigator.onLine);

  // Check if resource is cached offline
  useEffect(() => {
    const checkOfflineStatus = async () => {
      try {
        const cached = await offlineService.isResourceCached(resource.id);
        setIsOffline(cached);
      } catch (error) {
        console.error('Error checking offline status:', error);
      }
    };

    checkOfflineStatus();
  }, [resource.id]);

  // Setup network listeners
  useEffect(() => {
    const handleOnline = () => setNetworkStatus(true);
    const handleOffline = () => setNetworkStatus(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Download resource for offline access
  const handleDownload = async () => {
    if (!networkStatus) {
      setError('Internet connection required to download resources');
      return;
    }

    setIsDownloading(true);
    setError(null);
    setDownloadProgress(0);

    try {
      // Initialize offline service if needed
      await offlineService.initialize();

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setDownloadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Download the resource
      const result = await offlineService.downloadResource(resource, {
        includeImages: true,
        includeVideos: resource.type === 'video',
        quality: 'high',
        compress: true
      });

      clearInterval(progressInterval);
      setDownloadProgress(100);

      if (result.success) {
        setIsOffline(true);
        if (onOfflineStatusChange) {
          onOfflineStatusChange(resource.id, true);
        }
      }
    } catch (error) {
      console.error('Download failed:', error);
      setError('Failed to download resource for offline access');
    } finally {
      setIsDownloading(false);
      setTimeout(() => setDownloadProgress(0), 1000);
    }
  };

  // Remove resource from offline storage
  const handleRemoveOffline = async () => {
    try {
      await offlineService.removeCachedResource(resource.id);
      setIsOffline(false);
      if (onOfflineStatusChange) {
        onOfflineStatusChange(resource.id, false);
      }
    } catch (error) {
      console.error('Failed to remove offline resource:', error);
      setError('Failed to remove offline resource');
    }
  };

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="relative">
      {/* Network Status Indicator */}
      <div className="flex items-center space-x-2 mb-2">
        {networkStatus ? (
          <WifiIcon className="w-4 h-4 text-green-600" />
        ) : (
          <SignalSlashIcon className="w-4 h-4 text-red-600" />
        )}
        <span className={`text-xs font-medium ${
          networkStatus ? 'text-green-600' : 'text-red-600'
        }`}>
          {networkStatus ? 'Online' : 'Offline'}
        </span>
      </div>

      {/* Offline Toggle Button */}
      {isOffline ? (
        <div className="flex items-center space-x-2">
          <CheckCircleIcon className="w-5 h-5 text-green-600" />
          <span className="text-sm text-green-600 font-medium">Available Offline</span>
          <button
            onClick={handleRemoveOffline}
            className="text-xs text-red-600 hover:text-red-800 underline"
            title="Remove from offline storage"
          >
            Remove
          </button>
        </div>
      ) : (
        <button
          onClick={handleDownload}
          disabled={isDownloading || !networkStatus}
          className={`flex items-center space-x-2 px-3 py-1 rounded text-sm font-medium transition-colors ${
            isDownloading || !networkStatus
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
          }`}
        >
          {isDownloading ? (
            <>
              <div className="w-4 h-4 border-t-2 border-blue-600 border-solid rounded-full animate-spin"></div>
              <span>Downloading...</span>
            </>
          ) : (
            <>
              <CloudArrowDownIcon className="w-4 h-4" />
              <span>Save Offline</span>
            </>
          )}
        </button>
      )}

      {/* Download Progress */}
      {isDownloading && downloadProgress > 0 && (
        <div className="mt-2">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Downloading...</span>
            <span>{downloadProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${downloadProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700 flex items-center space-x-2">
          <ExclamationTriangleIcon className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default OfflineToggle;