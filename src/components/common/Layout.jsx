import React from 'react';
import { useLocation } from 'react-router-dom';
import Navigation from './Navigation';
import { useAppContext } from '../../contexts/AppContext';

const Layout = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, isOnboarded, authLoading } = useAppContext();
  
  // Define pages where navigation should be hidden
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const isOnboardingPage = location.pathname.startsWith('/onboarding');
  const isSplashScreen = location.pathname === '/splash';
  const isLandingPage = location.pathname === '/' && !isAuthenticated && !localStorage.getItem('demo_mode');
  
  // ENHANCED NAVIGATION LOGIC - More robust fallbacks
  // Show navigation when:
  // 1. User is authenticated (regardless of onboarding status)
  // 2. Demo mode is active (localStorage demo_mode is set)
  // 3. NOT on auth/splash/onboarding/landing pages
  // 4. FALLBACK: Show navigation on all main app pages regardless of auth state
  const isDemoMode = localStorage.getItem('demo_mode') === 'true';
  const isMainAppPage = [
    '/dashboard',
    '/meal-plan', 
    '/relief',
    '/symptoms',
    '/my-favorites',
    '/community',
    '/profile',
    '/resources',
    '/bookmarks'
  ].includes(location.pathname);
  
  // ROBUST NAVIGATION VISIBILITY LOGIC
  const showNavigation = (
    // Standard auth checks
    (isAuthenticated || isDemoMode) &&
    !isAuthPage &&
    !isOnboardingPage &&
    !isSplashScreen &&
    !isLandingPage
  ) || (
    // FALLBACK: Always show navigation on main app pages to prevent disappearance
    isMainAppPage && !isAuthPage && !isOnboardingPage && !isSplashScreen
  );
  
  // Apply different background for different pages
  const getBackgroundStyle = () => {
    if (isAuthPage) {
      return 'bg-gradient-to-br from-purple-50 to-indigo-100';
    }
    
    if (isOnboardingPage) {
      return 'bg-white';
    }
    
    return 'bg-gray-50';
  };
  
  // Show loading state during authentication check
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-purple-600 border-purple-200 rounded-full animate-spin mx-auto"></div>
          <p className="mt-3 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  // Enhanced debug logging for navigation visibility
  if (import.meta.env.DEV) {
    console.log('Layout Debug (Enhanced):', {
      pathname: location.pathname,
      isAuthenticated,
      isOnboarded,
      isDemoMode,
      isMainAppPage,
      showNavigation,
      isAuthPage,
      isOnboardingPage,
      isSplashScreen,
      isLandingPage,
      localStorage_demo: localStorage.getItem('demo_mode')
    });
  }
  
  return (
    <div className={`min-h-screen flex flex-col ${getBackgroundStyle()}`}>
      {/* ENHANCED NAVIGATION RENDERING WITH FALLBACK */}
      {showNavigation && <Navigation />}
      
      {/* EMERGENCY FALLBACK: Force navigation on main pages if auth fails */}
      {!showNavigation && isMainAppPage && !isAuthPage && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-2 text-xs">
          <p className="text-yellow-700">Navigation fallback active - auth state uncertain</p>
        </div>
      )}
      {!showNavigation && isMainAppPage && !isAuthPage && <Navigation />}
      
      <main className={`flex-grow ${(showNavigation || isMainAppPage) ? 'pb-20' : ''}`}>
        {children}
      </main>
    </div>
  );
};

export default Layout;