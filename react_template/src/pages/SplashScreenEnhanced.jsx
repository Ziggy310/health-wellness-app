import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';

const SplashScreenEnhanced = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isOnboarded } = useAppContext();
  const [animationComplete, setAnimationComplete] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // After component mounts, start animation and set timeout for redirect
  useEffect(() => {
    const animationTimer = setTimeout(() => {
      setAnimationComplete(true);
    }, 2500);

    const redirectTimer = setTimeout(() => {
      if (isAuthenticated) {
        // User is authenticated, check if onboarding is completed
        if (isOnboarded) {
          navigate('/dashboard');
        } else {
          navigate('/onboarding');
        }
      } else {
        // User is not authenticated, redirect to login
        navigate('/login');
      }
    }, 3000);

    // Clean up timers
    return () => {
      clearTimeout(animationTimer);
      clearTimeout(redirectTimer);
    };
  }, [isAuthenticated, isOnboarded, navigate]);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-800 transition-opacity duration-1000">
      {/* User-provided background image for splash screen */}
      <div className="absolute inset-0 opacity-30">
        <img
          src="/hero.jpg"
          alt="Meno+ Splash Image"
          className={`w-full h-full object-cover transition-opacity duration-1000 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={handleImageLoad}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/50 to-indigo-900/70" />
      </div>
      
      <div className={`flex flex-col items-center transition-all duration-1000 transform z-10 ${
        animationComplete ? 'scale-110 opacity-0' : 'scale-100 opacity-100'
      }`}>
        {/* App Logo */}
        <div className="w-32 h-32 mb-4 rounded-full bg-white/90 shadow-xl flex items-center justify-center">
          <span className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text flex items-center">
            M<span className="text-4xl">+</span>
          </span>
        </div>
        
        {/* App Name */}
        <h1 className="text-4xl font-bold text-white mb-3 drop-shadow-lg">Meno+</h1>
        <p className="text-lg text-purple-100 italic drop-shadow">Personalized Menopause Support</p>
        
        {/* Tagline */}
        <p className="text-white/80 mt-4 max-w-xs text-center">
          Your journey to wellness and balance starts here
        </p>
        
        {/* Loading animation */}
        <div className="mt-10">
          <div className="w-12 h-12 border-t-4 border-l-4 border-white rounded-full animate-spin"></div>
        </div>
      </div>
      
      {/* Nature-inspired decorative elements */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-purple-900/30 to-transparent" />
      
      <div className="absolute bottom-8 w-full flex justify-center opacity-70">
        <p className="text-white/80 text-xs">© 2023 Meno+ • Finding Balance Together</p>
      </div>
    </div>
  );
};

export default SplashScreenEnhanced;