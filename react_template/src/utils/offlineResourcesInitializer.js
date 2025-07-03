// Utility to initialize offline resources with real health data
import { realResourcesData } from '../data/realResourcesData';
import offlineService from '../services/OfflineService';

// Transform real resources data for offline caching
export const transformResourcesForOffline = () => {
  const transformedResources = [];

  // Transform articles
  realResourcesData.articles.forEach(article => {
    transformedResources.push({
      id: `article-${article.id}`,
      title: article.title,
      description: article.description,
      type: 'article',
      category: article.category || 'General',
      author: article.source,
      publishDate: article.publication_date,
      readTime: '5-8 min',
      url: article.url,
      tags: article.tags || [],
      originalData: article
    });
  });

  // Transform podcasts
  realResourcesData.podcasts.forEach(podcast => {
    transformedResources.push({
      id: `podcast-${podcast.id}`,
      title: podcast.title,
      description: podcast.description,
      type: 'podcast',
      category: podcast.category || 'General',
      author: podcast.source,
      publishDate: podcast.publication_date,
      duration: podcast.duration,
      url: podcast.url,
      tags: podcast.tags || [],
      originalData: podcast
    });
  });

  // Transform videos
  realResourcesData.videos.forEach(video => {
    transformedResources.push({
      id: `video-${video.id}`,
      title: video.title,
      description: video.description,
      type: 'video',
      category: video.category || 'General',
      author: video.source,
      publishDate: video.publication_date,
      duration: video.duration,
      views: video.views,
      url: video.url,
      tags: video.tags || [],
      originalData: video
    });
  });

  // Transform infographics
  realResourcesData.infographics.forEach(infographic => {
    transformedResources.push({
      id: `infographic-${infographic.id}`,
      title: infographic.title,
      description: infographic.description,
      type: 'infographic',
      category: infographic.category || 'General',
      author: infographic.source,
      publishDate: infographic.publication_date,
      url: infographic.url,
      tags: infographic.tags || [],
      originalData: infographic
    });
  });

  return transformedResources;
};

// Pre-cache popular resources for immediate offline access
export const preCachePopularResources = async () => {
  try {
    await offlineService.initialize();
    
    const resources = transformResourcesForOffline();
    const popularResources = resources.slice(0, 5); // Cache first 5 resources
    
    console.log('Pre-caching popular resources for offline access...');
    
    for (const resource of popularResources) {
      try {
        await offlineService.downloadResource(resource, {
          includeImages: true,
          includeVideos: false,
          quality: 'high',
          compress: true
        });
        console.log(`Cached: ${resource.title}`);
      } catch (error) {
        console.warn(`Failed to cache ${resource.title}:`, error);
      }
    }
    
    console.log('Pre-caching completed');
    return true;
  } catch (error) {
    console.error('Pre-caching failed:', error);
    return false;
  }
};

export default {
  transformResourcesForOffline,
  preCachePopularResources
};