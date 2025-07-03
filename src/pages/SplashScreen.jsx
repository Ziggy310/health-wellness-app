import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';

const SplashScreen = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isOnboarded } = useAppContext();
  const [animationComplete, setAnimationComplete] = useState(false);

  // After component mounts, start animation and set timeout for redirect
  useEffect(() => {
    const animationTimer = setTimeout(() => {
      setAnimationComplete(true);
    }, 2500);

    const redirectTimer = setTimeout(() => {
      if (isAuthenticated) {
        // User is authenticated, check if onboarding is completed
        if (isOnboarded) {
          navigate('/');
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

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-purple-200 via-rose-100 to-purple-300 transition-opacity duration-1000">
      <div className={`flex flex-col items-center transition-all duration-1000 transform ${
        animationComplete ? 'scale-110 opacity-0' : 'scale-100 opacity-100'
      }`}>
        {/* App Logo */}
        <div className="w-32 h-32 mb-4 rounded-full bg-white shadow-xl flex items-center justify-center">
          <div className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-rose-500 text-transparent bg-clip-text">
            M+
          </div>
        </div>
        
        {/* App Name */}
        <h1 className="text-4xl font-bold text-purple-800 mb-3">Meno+</h1>
        <p className="text-lg text-purple-700 font-medium">Personalized Menopause Support</p>
        
        {/* Loading animation */}
        <div className="mt-10">
          <div className="w-12 h-12 border-t-4 border-l-4 border-purple-600 rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;