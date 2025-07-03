// Service for managing resource sharing and analytics

class SharingService {
  constructor() {
    this.storagePrefix = 'health_resources_sharing_';
  }

  // Get sharing statistics for a resource
  getResourceShareStats(resourceId) {
    try {
      const stats = localStorage.getItem(`${this.storagePrefix}stats_${resourceId}`);
      return stats ? JSON.parse(stats) : {
        totalShares: 0,
        platforms: {},
        lastShared: null,
        topPlatform: null
      };
    } catch (error) {
      console.error('Error loading share stats:', error);
      return { totalShares: 0, platforms: {}, lastShared: null, topPlatform: null };
    }
  }

  // Record a share event
  recordShare(resourceId, platform, shareData = {}) {
    try {
      const stats = this.getResourceShareStats(resourceId);
      
      // Update statistics
      stats.totalShares += 1;
      stats.platforms[platform] = (stats.platforms[platform] || 0) + 1;
      stats.lastShared = new Date().toISOString();
      
      // Determine top platform
      stats.topPlatform = Object.entries(stats.platforms)
        .sort(([,a], [,b]) => b - a)[0]?.[0] || platform;
      
      // Save updated stats
      localStorage.setItem(`${this.storagePrefix}stats_${resourceId}`, JSON.stringify(stats));
      
      // Record individual share event
      this.recordShareEvent(resourceId, platform, shareData);
      
      // Update global sharing analytics
      this.updateGlobalStats(platform);
      
      return stats;
    } catch (error) {
      console.error('Error recording share:', error);
      throw error;
    }
  }

  // Record individual share event with details
  recordShareEvent(resourceId, platform, shareData) {
    try {
      const shareHistory = this.getShareHistory();
      
      const shareEvent = {
        id: Date.now().toString(),
        resourceId,
        platform,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        referrer: document.referrer,
        ...shareData
      };
      
      // Add to history (keep last 100 events)
      const updatedHistory = [shareEvent, ...shareHistory.slice(0, 99)];
      localStorage.setItem(`${this.storagePrefix}history`, JSON.stringify(updatedHistory));
      
      return shareEvent;
    } catch (error) {
      console.error('Error recording share event:', error);
    }
  }

  // Get share history
  getShareHistory(limit = 50) {
    try {
      const history = localStorage.getItem(`${this.storagePrefix}history`);
      const parsedHistory = history ? JSON.parse(history) : [];
      return limit ? parsedHistory.slice(0, limit) : parsedHistory;
    } catch (error) {
      console.error('Error loading share history:', error);
      return [];
    }
  }

  // Update global sharing statistics
  updateGlobalStats(platform) {
    try {
      const globalStats = this.getGlobalStats();
      
      globalStats.totalShares += 1;
      globalStats.platforms[platform] = (globalStats.platforms[platform] || 0) + 1;
      globalStats.lastUpdated = new Date().toISOString();
      
      // Calculate platform popularity
      const sortedPlatforms = Object.entries(globalStats.platforms)
        .sort(([,a], [,b]) => b - a);
      globalStats.topPlatforms = sortedPlatforms.slice(0, 5);
      
      localStorage.setItem(`${this.storagePrefix}global_stats`, JSON.stringify(globalStats));
      
      return globalStats;
    } catch (error) {
      console.error('Error updating global stats:', error);
    }
  }

  // Get global sharing statistics
  getGlobalStats() {
    try {
      const stats = localStorage.getItem(`${this.storagePrefix}global_stats`);
      return stats ? JSON.parse(stats) : {
        totalShares: 0,
        platforms: {},
        topPlatforms: [],
        lastUpdated: null
      };
    } catch (error) {
      console.error('Error loading global stats:', error);
      return { totalShares: 0, platforms: {}, topPlatforms: [], lastUpdated: null };
    }
  }

  // Generate share URL with tracking parameters
  generateShareUrl(resourceId, platform, campaignData = {}) {
    const baseUrl = `${window.location.origin}/resources/${resourceId}`;
    const params = new URLSearchParams({
      utm_source: platform,
      utm_medium: 'social_share',
      utm_campaign: campaignData.campaign || 'resource_sharing',
      share_id: Date.now().toString(),
      ...campaignData.customParams
    });
    
    return `${baseUrl}?${params.toString()}`;
  }

  // Get platform-specific share text
  generateShareText(resource, platform, context = {}) {
    const baseText = resource.description?.substring(0, 150) + (resource.description?.length > 150 ? '...' : '');
    
    const templates = {
      facebook: `📚 "${resource.title}" - ${baseText}\n\nGreat health resource I found! #HealthTips #Wellness`,
      twitter: `📖 "${resource.title}"\n\n${baseText}\n\n#HealthTips #Wellness #HealthyLiving`,
      linkedin: `Professional health resource recommendation:\n\n"${resource.title}"\n\n${resource.description}\n\nThought this might be valuable for the health-conscious professionals in my network.`,
      whatsapp: `Hey! 👋\n\nFound this helpful health resource: "${resource.title}"\n\n${baseText}\n\nThought you might find it interesting!`,
      telegram: `🔗 Health Resource Recommendation\n\n"${resource.title}"\n\n${baseText}`,
      email: `I wanted to share this valuable health resource with you:\n\n"${resource.title}"\n\n${resource.description}\n\nI thought you might find it helpful based on your interest in health and wellness.`,
      reddit: `Found this interesting health resource: "${resource.title}"\n\n${resource.description}`,
      pinterest: `${resource.title} - ${baseText} #Health #Wellness #HealthTips`
    };
    
    // Add personalization if context provided
    let shareText = templates[platform] || templates.email;
    
    if (context.personalNote) {
      shareText = `${context.personalNote}\n\n---\n\n${shareText}`;
    }
    
    if (context.recommendationScore) {
      shareText += `\n\n🎯 This is a ${Math.round(context.recommendationScore)}% match for my health goals!`;
    }
    
    return shareText;
  }

  // Get most shared resources
  getMostSharedResources(limit = 10) {
    try {
      const shareStats = [];
      
      // Iterate through localStorage to find all resource share stats
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(`${this.storagePrefix}stats_`)) {
          const resourceId = key.replace(`${this.storagePrefix}stats_`, '');
          const stats = JSON.parse(localStorage.getItem(key));
          
          if (stats.totalShares > 0) {
            shareStats.push({
              resourceId,
              totalShares: stats.totalShares,
              topPlatform: stats.topPlatform,
              lastShared: stats.lastShared
            });
          }
        }
      }
      
      // Sort by total shares and return top results
      return shareStats
        .sort((a, b) => b.totalShares - a.totalShares)
        .slice(0, limit);
    } catch (error) {
      console.error('Error getting most shared resources:', error);
      return [];
    }
  }

  // Get trending shares (resources shared recently)
  getTrendingShares(daysBack = 7, limit = 10) {
    try {
      const cutoffDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000);
      const recentShares = this.getShareHistory()
        .filter(share => new Date(share.timestamp) > cutoffDate);
      
      // Group by resource and count
      const resourceCounts = {};
      recentShares.forEach(share => {
        resourceCounts[share.resourceId] = (resourceCounts[share.resourceId] || 0) + 1;
      });
      
      // Convert to array and sort
      return Object.entries(resourceCounts)
        .map(([resourceId, count]) => ({ resourceId, recentShares: count }))
        .sort((a, b) => b.recentShares - a.recentShares)
        .slice(0, limit);
    } catch (error) {
      console.error('Error getting trending shares:', error);
      return [];
    }
  }

  // Get sharing analytics dashboard data
  getAnalyticsDashboard() {
    try {
      const globalStats = this.getGlobalStats();
      const mostShared = this.getMostSharedResources(5);
      const trending = this.getTrendingShares(7, 5);
      const recentActivity = this.getShareHistory(10);
      
      // Calculate platform distribution
      const platformDistribution = Object.entries(globalStats.platforms)
        .map(([platform, count]) => ({
          platform,
          count,
          percentage: Math.round((count / globalStats.totalShares) * 100) || 0
        }))
        .sort((a, b) => b.count - a.count);
      
      // Calculate growth metrics (shares in last 30 days vs previous 30 days)
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
      
      const recentShares = this.getShareHistory()
        .filter(share => new Date(share.timestamp) > thirtyDaysAgo).length;
      const previousShares = this.getShareHistory()
        .filter(share => {
          const shareDate = new Date(share.timestamp);
          return shareDate > sixtyDaysAgo && shareDate <= thirtyDaysAgo;
        }).length;
      
      const growthRate = previousShares > 0 
        ? Math.round(((recentShares - previousShares) / previousShares) * 100)
        : recentShares > 0 ? 100 : 0;
      
      return {
        overview: {
          totalShares: globalStats.totalShares,
          recentShares: recentShares,
          growthRate: growthRate,
          topPlatform: globalStats.topPlatforms[0]?.[0] || 'None'
        },
        platformDistribution,
        mostSharedResources: mostShared,
        trendingResources: trending,
        recentActivity: recentActivity
      };
    } catch (error) {
      console.error('Error generating analytics dashboard:', error);
      return {
        overview: { totalShares: 0, recentShares: 0, growthRate: 0, topPlatform: 'None' },
        platformDistribution: [],
        mostSharedResources: [],
        trendingResources: [],
        recentActivity: []
      };
    }
  }

  // Export sharing data
  exportSharingData() {
    try {
      const exportData = {
        globalStats: this.getGlobalStats(),
        shareHistory: this.getShareHistory(),
        mostShared: this.getMostSharedResources(50),
        analytics: this.getAnalyticsDashboard(),
        exportDate: new Date().toISOString(),
        version: '1.0'
      };
      
      return exportData;
    } catch (error) {
      console.error('Error exporting sharing data:', error);
      return null;
    }
  }

  // Clear sharing data
  clearSharingData() {
    try {
      const keysToRemove = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.storagePrefix)) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
      return true;
    } catch (error) {
      console.error('Error clearing sharing data:', error);
      return false;
    }
  }

  // Check if sharing is available on the current platform
  isSharingSupported() {
    return {
      nativeShare: 'share' in navigator,
      clipboard: 'clipboard' in navigator,
      webShare: 'share' in navigator && navigator.canShare,
      email: true, // Always available via mailto
      social: true // Always available via URL schemes
    };
  }

  // Use native Web Share API if available
  async nativeShare(shareData) {
    if ('share' in navigator && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return { success: true, method: 'native' };
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Native share failed:', error);
        }
        return { success: false, error: error.message, method: 'native' };
      }
    }
    return { success: false, error: 'Native sharing not supported', method: 'native' };
  }

  // Generate sharing insights for a resource
  getResourceSharingInsights(resourceId) {
    try {
      const stats = this.getResourceShareStats(resourceId);
      const history = this.getShareHistory().filter(share => share.resourceId === resourceId);
      
      if (stats.totalShares === 0) {
        return {
          message: 'This resource hasn\'t been shared yet. Be the first to share it!',
          recommendations: ['Share on social media', 'Send to friends via email', 'Copy link to share'],
          insights: []
        };
      }
      
      const insights = [];
      const recommendations = [];
      
      // Analyze sharing patterns
      if (stats.topPlatform) {
        insights.push(`Most shared on ${stats.topPlatform} (${stats.platforms[stats.topPlatform]} times)`);
      }
      
      const recentShares = history.filter(share => 
        new Date(share.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      ).length;
      
      if (recentShares > 0) {
        insights.push(`${recentShares} shares in the last 7 days`);
      }
      
      // Generate recommendations
      const unusedPlatforms = ['facebook', 'twitter', 'linkedin', 'whatsapp']
        .filter(platform => !stats.platforms[platform] || stats.platforms[platform] === 0);
      
      if (unusedPlatforms.length > 0) {
        recommendations.push(`Try sharing on ${unusedPlatforms.slice(0, 2).join(' or ')}`);
      }
      
      if (stats.platforms.email && stats.platforms.email > stats.platforms.whatsapp) {
        recommendations.push('Consider sharing via WhatsApp for more personal reach');
      }
      
      return {
        message: `This resource has been shared ${stats.totalShares} times across ${Object.keys(stats.platforms).length} platforms`,
        insights,
        recommendations: recommendations.length > 0 ? recommendations : ['Keep sharing to help others discover this valuable resource']
      };
    } catch (error) {
      console.error('Error generating sharing insights:', error);
      return {
        message: 'Unable to generate insights at this time',
        insights: [],
        recommendations: []
      };
    }
  }
}

// Create and export singleton instance
const sharingService = new SharingService();
export default sharingService;