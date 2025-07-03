import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import OfflineReader from '../components/offline/OfflineReader';
import Layout from '../components/common/Layout';
import { transformResourcesForOffline, preCachePopularResources } from '../utils/offlineResourcesInitializer';
import offlineService from '../services/OfflineService';
import {
  WifiIcon,
  SignalSlashIcon,
  DocumentTextIcon,
  ClockIcon,
  ArrowLeftIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const OfflineResources = () => {
  const navigate = useNavigate();
  const { user, isLoading, setIsLoading } = useAppContext();
  
  // State for offline functionality
  const [resources, setResources] = useState([]);
  const [selectedResource, setSelectedResource] = useState(null);
  const [offlineContent, setOfflineContent] = useState(null);
  const [networkStatus, setNetworkStatus] = useState(navigator.onLine);
  const [isReaderMode, setIsReaderMode] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState(null);
  const [preCacheStatus, setPreCacheStatus] = useState('idle'); // 'idle', 'caching', 'completed', 'failed'

  // Initialize offline service and load resources
  useEffect(() => {
    const initializeOffline = async () => {
      try {
        setIsLoading(true);
        
        // Initialize offline service
        await offlineService.initialize();
        setIsInitialized(true);
        
        // Load transformed resources
        const transformedResources = transformResourcesForOffline();
        setResources(transformedResources);
        
        // Setup network listeners
        const handleOnline = () => setNetworkStatus(true);
        const handleOffline = () => setNetworkStatus(false);
        
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        
        // Pre-cache popular resources if online
        if (navigator.onLine) {
          setPreCacheStatus('caching');
          try {
            await preCachePopularResources();
            setPreCacheStatus('completed');
          } catch (error) {
            console.error('Pre-caching failed:', error);
            setPreCacheStatus('failed');
          }
        }
        
        setIsLoading(false);
        
        return () => {
          window.removeEventListener('online', handleOnline);
          window.removeEventListener('offline', handleOffline);
        };
      } catch (error) {
        console.error('Failed to initialize offline resources:', error);
        setError('Failed to initialize offline functionality');
        setIsLoading(false);
      }
    };
    
    initializeOffline();
  }, [setIsLoading]);

  // Handle resource selection for offline reading
  const handleResourceSelect = async (resource) => {
    try {
      setIsLoading(true);
      const content = await offlineService.getOfflineContent(resource.id);
      setSelectedResource(resource);
      setOfflineContent(content);
      setIsReaderMode(true);
    } catch (error) {
      console.error('Error loading offline content:', error);
      setError(`Failed to load offline content for: ${resource.title}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Show reader mode
  if (isReaderMode && selectedResource && offlineContent) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-6">
          {/* Reader Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  setIsReaderMode(false);
                  setSelectedResource(null);
                  setOfflineContent(null);
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5" />
                <span>Back to Offline Resources</span>
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Reading Offline</span>
              </div>
            </div>
            
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
              networkStatus 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {networkStatus ? (
                <WifiIcon className="w-4 h-4" />
              ) : (
                <SignalSlashIcon className="w-4 h-4" />
              )}
              <span>{networkStatus ? 'Online' : 'Offline'}</span>
            </div>
          </div>

          {/* Content Display */}
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <div className="max-w-4xl mx-auto">
              <div className="mb-6">
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full mb-4 capitalize">
                  {selectedResource.type}
                </span>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {selectedResource.title}
                </h1>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-6">
                  <span>By {selectedResource.author}</span>
                  <span>•</span>
                  <span>{selectedResource.publishDate}</span>
                  <span>•</span>
                  <span>{selectedResource.category}</span>
                  {selectedResource.readTime && (
                    <>
                      <span>•</span>
                      <span className="flex items-center space-x-1">
                        <ClockIcon className="w-4 h-4" />
                        <span>{selectedResource.readTime}</span>
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="prose prose-lg max-w-none">
                <div className="text-gray-700 leading-relaxed">
                  <p className="text-xl mb-6 text-gray-800">
                    {offlineContent.content.description || selectedResource.description}
                  </p>
                  <div className="whitespace-pre-line text-gray-700">
                    {offlineContent.content.fullText}
                  </div>
                </div>

                {/* Display images if available */}
                {offlineContent.content.images && offlineContent.content.images.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Visual Resources</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {offlineContent.content.images.map((image, index) => (
                        <div key={index} className="bg-gray-100 rounded-lg p-4">
                          <img 
                            src={image.placeholder} 
                            alt={image.alt}
                            className="w-full h-48 object-cover rounded mb-2"
                          />
                          <p className="text-sm text-gray-600">{image.caption}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Display video transcript if available */}
                {offlineContent.content.videoData && (
                  <div className="mt-8">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Video Transcript</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="whitespace-pre-line text-sm text-gray-700">
                        {offlineContent.content.videoData.transcript}
                      </div>
                    </div>
                  </div>
                )}

                {/* Display resource tags */}
                {selectedResource.tags && selectedResource.tags.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedResource.tags.map((tag, index) => (
                        <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Source information */}
                <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">Source Information</h3>
                  <p className="text-blue-700 text-sm">
                    <strong>Publisher:</strong> {selectedResource.author}<br/>
                    <strong>Publication Date:</strong> {selectedResource.publishDate}<br/>
                    <strong>Category:</strong> {selectedResource.category}<br/>
                    <strong>Type:</strong> {selectedResource.type.charAt(0).toUpperCase() + selectedResource.type.slice(1)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-12 h-12 border-t-4 border-blue-600 border-solid rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">
              {preCacheStatus === 'caching' ? 'Caching popular resources...' : 'Initializing offline reader...'}
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  // Error state
  if (!isInitialized && error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center space-x-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.88-.833-2.5 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
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
        </div>
      </Layout>
    );
  }

  // Main offline resources view
  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/resources')}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              <span>Back to Resources</span>
            </button>
            <div className="flex items-center space-x-2">
              {networkStatus ? (
                <WifiIcon className="w-6 h-6 text-green-600" />
              ) : (
                <SignalSlashIcon className="w-6 h-6 text-red-600" />
              )}
              <h1 className="text-2xl font-bold text-gray-800">Offline Reading Mode</h1>
            </div>
          </div>
          
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
            networkStatus 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {networkStatus ? (
              <WifiIcon className="w-4 h-4" />
            ) : (
              <SignalSlashIcon className="w-4 h-4" />
            )}
            <span>{networkStatus ? 'Online' : 'Offline'}</span>
          </div>
        </div>

        {/* Pre-cache Status */}
        {preCacheStatus === 'completed' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-3">
              <CheckCircleIcon className="w-6 h-6 text-green-600" />
              <div>
                <h3 className="text-lg font-medium text-green-800">Ready for Offline Reading</h3>
                <p className="text-green-700 text-sm">
                  Popular health resources have been cached and are available for offline reading.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Description */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <DocumentTextIcon className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-medium text-blue-800 mb-2">Offline Reading Mode</h3>
              <p className="text-blue-700 text-sm leading-relaxed">
                Access {resources.length} curated health resources for offline reading. Perfect for areas with limited connectivity or when you want to save data. 
                Resources include expert articles, research papers, and educational content from leading health institutions.
              </p>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.88-.833-2.5 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Offline Reader Component */}
        <OfflineReader
          resources={resources}
          onResourceSelect={handleResourceSelect}
          currentResource={selectedResource}
        />
      </div>
    </Layout>
  );
};

export default OfflineResources;