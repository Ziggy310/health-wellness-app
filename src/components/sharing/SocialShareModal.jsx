import React, { useState, useEffect } from 'react';
import {
  XMarkIcon,
  ShareIcon,
  LinkIcon,
  EnvelopeIcon,
  ClipboardDocumentIcon,
  CheckIcon,
  QrCodeIcon,
  ChatBubbleLeftRightIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import {
  FacebookIcon,
  TwitterIcon,
  LinkedInIcon,
  WhatsAppIcon,
  TelegramIcon,
  RedditIcon,
  PinterestIcon
} from '../icons/SocialIcons';

const SocialShareModal = ({ 
  isOpen, 
  onClose, 
  resource, 
  userRecommendation = null,
  shareContext = 'general'
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [emailFormData, setEmailFormData] = useState({
    to: '',
    subject: '',
    message: '',
    includePersonalNote: true
  });
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);
  const [shareStats, setShareStats] = useState({
    totalShares: 0,
    platforms: {}
  });

  // Generate share URL
  const shareUrl = `${window.location.origin}/resources/${resource?.id}`;
  
  // Generate share text based on context
  const getShareText = (platform = 'generic') => {
    if (!resource) return '';
    
    const baseText = `"${resource.title}" - ${resource.description?.substring(0, 150)}${resource.description?.length > 150 ? '...' : ''}`;
    
    const contextTexts = {
      recommendation: userRecommendation ? 
        `💡 Personalized health recommendation: ${baseText}` :
        `📚 Great health resource: ${baseText}`,
      bookmark: `🔖 Bookmarked this valuable health resource: ${baseText}`,
      review: `⭐ Just reviewed this health resource: ${baseText}`,
      general: `📖 Check out this health resource: ${baseText}`
    };
    
    let shareText = contextTexts[shareContext] || contextTexts.general;
    
    // Add recommendation score if available
    if (userRecommendation?.score) {
      shareText += ` (${Math.round(userRecommendation.score)}% match for my health goals)`;
    }
    
    // Platform-specific modifications
    switch (platform) {
      case 'twitter':
        // Add hashtags for Twitter
        const hashtags = ['HealthTips', 'Wellness', 'HealthyLiving'];
        if (resource.category) {
          hashtags.push(resource.category.replace(/\s+/g, ''));
        }
        shareText += ` ${hashtags.map(tag => `#${tag}`).join(' ')}`;
        break;
      case 'linkedin':
        // More professional tone for LinkedIn
        shareText = `Professional health resource recommendation: ${resource.title}. ${resource.description?.substring(0, 200)}...`;
        break;
      case 'whatsapp':
      case 'telegram':
        // More personal tone for messaging apps
        shareText = `Hey! Found this helpful health resource: ${resource.title}. Thought you might be interested! 😊`;
        break;
    }
    
    return shareText;
  };

  // Load share statistics
  useEffect(() => {
    if (resource?.id) {
      const stats = localStorage.getItem(`share_stats_${resource.id}`);
      if (stats) {
        setShareStats(JSON.parse(stats));
      }
    }
  }, [resource?.id]);

  // Track share event
  const trackShare = (platform) => {
    if (!resource?.id) return;
    
    const newStats = {
      ...shareStats,
      totalShares: shareStats.totalShares + 1,
      platforms: {
        ...shareStats.platforms,
        [platform]: (shareStats.platforms[platform] || 0) + 1
      }
    };
    
    setShareStats(newStats);
    localStorage.setItem(`share_stats_${resource.id}`, JSON.stringify(newStats));
    
    // Track in global analytics
    const globalStats = JSON.parse(localStorage.getItem('global_share_stats') || '{}');
    globalStats[platform] = (globalStats[platform] || 0) + 1;
    globalStats.total = (globalStats.total || 0) + 1;
    localStorage.setItem('global_share_stats', JSON.stringify(globalStats));
  };

  // Copy link to clipboard
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      trackShare('copy_link');
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  // Handle social media sharing
  const handleSocialShare = (platform) => {
    const text = encodeURIComponent(getShareText(platform));
    const url = encodeURIComponent(shareUrl);
    const title = encodeURIComponent(resource.title);
    
    let shareLink = '';
    
    switch (platform) {
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`;
        break;
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        break;
      case 'linkedin':
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}&summary=${text}`;
        break;
      case 'whatsapp':
        shareLink = `https://wa.me/?text=${text}%20${url}`;
        break;
      case 'telegram':
        shareLink = `https://t.me/share/url?url=${url}&text=${text}`;
        break;
      case 'reddit':
        shareLink = `https://reddit.com/submit?url=${url}&title=${title}`;
        break;
      case 'pinterest':
        shareLink = `https://pinterest.com/pin/create/button/?url=${url}&description=${text}`;
        break;
    }
    
    if (shareLink) {
      window.open(shareLink, '_blank', 'width=600,height=400');
      trackShare(platform);
    }
  };

  // Handle email sharing
  const handleEmailShare = () => {
    const subject = emailFormData.subject || `Health Resource Recommendation: ${resource.title}`;
    const body = emailFormData.includePersonalNote && emailFormData.message 
      ? `${emailFormData.message}\n\n---\n\n${getShareText('email')}\n\nRead more: ${shareUrl}`
      : `${getShareText('email')}\n\nRead more: ${shareUrl}`;
    
    const mailtoLink = `mailto:${emailFormData.to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
    
    trackShare('email');
    onClose();
  };

  // Generate QR Code (simplified - in production, use a proper QR code library)
  const generateQrCodeUrl = () => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareUrl)}`;
  };

  if (!isOpen || !resource) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-1">Share Resource</h2>
              <p className="text-sm text-gray-600">Help others discover this valuable health information</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Resource Preview */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-gray-800 mb-2 line-clamp-2">{resource.title}</h3>
            <p className="text-sm text-gray-600 line-clamp-3 mb-3">{resource.description}</p>
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span className="bg-white px-2 py-1 rounded capitalize">{resource.type}</span>
              <span>{resource.category}</span>
              {resource.author && <span>by {resource.author}</span>}
            </div>
          </div>

          {/* Share Statistics */}
          {shareStats.totalShares > 0 && (
            <div className="mb-6 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2 text-sm text-blue-800">
                <ShareIcon className="w-4 h-4" />
                <span>Shared {shareStats.totalShares} times</span>
              </div>
            </div>
          )}

          {/* Recommendation Context */}
          {userRecommendation && (
            <div className="mb-6 p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center space-x-2 text-sm text-purple-800 mb-2">
                <HeartIcon className="w-4 h-4" />
                <span>Personalized Recommendation</span>
              </div>
              <p className="text-xs text-purple-700">
                This resource is a {Math.round(userRecommendation.score)}% match for your health goals
              </p>
            </div>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={copyLink}
              className="flex items-center justify-center space-x-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {copiedLink ? (
                <>
                  <CheckIcon className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-600">Copied!</span>
                </>
              ) : (
                <>
                  <LinkIcon className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-600">Copy Link</span>
                </>
              )}
            </button>
            
            <button
              onClick={() => setShowQrCode(!showQrCode)}
              className="flex items-center justify-center space-x-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <QrCodeIcon className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-600">QR Code</span>
            </button>
          </div>

          {/* QR Code Display */}
          {showQrCode && (
            <div className="mb-6 text-center">
              <img 
                src={generateQrCodeUrl()} 
                alt="QR Code" 
                className="w-48 h-48 mx-auto border border-gray-200 rounded-lg"
              />
              <p className="text-xs text-gray-500 mt-2">Scan to access this resource</p>
            </div>
          )}

          {/* Social Media Platforms */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Share on Social Media</h4>
            <div className="grid grid-cols-4 gap-3">
              <button
                onClick={() => handleSocialShare('facebook')}
                className="flex flex-col items-center justify-center p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors group"
              >
                <FacebookIcon className="w-6 h-6 text-blue-600 mb-1" />
                <span className="text-xs text-gray-600 group-hover:text-blue-600">Facebook</span>
              </button>
              
              <button
                onClick={() => handleSocialShare('twitter')}
                className="flex flex-col items-center justify-center p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-400 transition-colors group"
              >
                <TwitterIcon className="w-6 h-6 text-blue-400 mb-1" />
                <span className="text-xs text-gray-600 group-hover:text-blue-400">Twitter</span>
              </button>
              
              <button
                onClick={() => handleSocialShare('linkedin')}
                className="flex flex-col items-center justify-center p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-700 transition-colors group"
              >
                <LinkedInIcon className="w-6 h-6 text-blue-700 mb-1" />
                <span className="text-xs text-gray-600 group-hover:text-blue-700">LinkedIn</span>
              </button>
              
              <button
                onClick={() => handleSocialShare('whatsapp')}
                className="flex flex-col items-center justify-center p-3 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-500 transition-colors group"
              >
                <WhatsAppIcon className="w-6 h-6 text-green-500 mb-1" />
                <span className="text-xs text-gray-600 group-hover:text-green-500">WhatsApp</span>
              </button>
              
              <button
                onClick={() => handleSocialShare('telegram')}
                className="flex flex-col items-center justify-center p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-500 transition-colors group"
              >
                <TelegramIcon className="w-6 h-6 text-blue-500 mb-1" />
                <span className="text-xs text-gray-600 group-hover:text-blue-500">Telegram</span>
              </button>
              
              <button
                onClick={() => handleSocialShare('reddit')}
                className="flex flex-col items-center justify-center p-3 border border-gray-200 rounded-lg hover:bg-orange-50 hover:border-orange-500 transition-colors group"
              >
                <RedditIcon className="w-6 h-6 text-orange-500 mb-1" />
                <span className="text-xs text-gray-600 group-hover:text-orange-500">Reddit</span>
              </button>
              
              <button
                onClick={() => handleSocialShare('pinterest')}
                className="flex flex-col items-center justify-center p-3 border border-gray-200 rounded-lg hover:bg-red-50 hover:border-red-500 transition-colors group"
              >
                <PinterestIcon className="w-6 h-6 text-red-500 mb-1" />
                <span className="text-xs text-gray-600 group-hover:text-red-500">Pinterest</span>
              </button>
              
              <button
                onClick={() => setShowEmailForm(!showEmailForm)}
                className="flex flex-col items-center justify-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors group"
              >
                <EnvelopeIcon className="w-6 h-6 text-gray-600 mb-1" />
                <span className="text-xs text-gray-600 group-hover:text-gray-800">Email</span>
              </button>
            </div>
          </div>

          {/* Email Form */}
          {showEmailForm && (
            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-sm font-medium text-gray-700 mb-4">Send via Email</h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">To:</label>
                  <input
                    type="email"
                    value={emailFormData.to}
                    onChange={(e) => setEmailFormData({...emailFormData, to: e.target.value})}
                    placeholder="recipient@example.com"
                    className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Subject:</label>
                  <input
                    type="text"
                    value={emailFormData.subject}
                    onChange={(e) => setEmailFormData({...emailFormData, subject: e.target.value})}
                    placeholder={`Health Resource Recommendation: ${resource.title}`}
                    className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <input
                      type="checkbox"
                      id="includeNote"
                      checked={emailFormData.includePersonalNote}
                      onChange={(e) => setEmailFormData({...emailFormData, includePersonalNote: e.target.checked})}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <label htmlFor="includeNote" className="text-xs font-medium text-gray-600">
                      Add personal message
                    </label>
                  </div>
                  
                  {emailFormData.includePersonalNote && (
                    <textarea
                      value={emailFormData.message}
                      onChange={(e) => setEmailFormData({...emailFormData, message: e.target.value})}
                      placeholder="Add a personal note about why you're sharing this resource..."
                      rows={3}
                      className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    />
                  )}
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowEmailForm(false)}
                    className="flex-1 px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEmailShare}
                    disabled={!emailFormData.to}
                    className="flex-1 px-4 py-2 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Send Email
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Share URL Display */}
          <div className="border-t border-gray-200 pt-4">
            <label className="block text-xs font-medium text-gray-600 mb-2">Direct Link:</label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 p-2 text-xs bg-gray-50 border border-gray-300 rounded text-gray-600"
              />
              <button
                onClick={copyLink}
                className="p-2 text-gray-600 hover:text-purple-600 transition-colors"
                title="Copy link"
              >
                {copiedLink ? (
                  <CheckIcon className="w-4 h-4 text-green-600" />
                ) : (
                  <ClipboardDocumentIcon className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialShareModal;