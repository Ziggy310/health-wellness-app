import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';

const OnboardingStart = () => {
  const { user, logout } = useAppContext();
  const navigate = useNavigate();
  
  const handleContinue = () => {
    navigate('/onboarding/symptoms');
  };
  
  return (
    <div className="min-h-screen flex flex-col px-4 py-8 max-w-lg mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-purple-600">Meno+</h1>
        <button 
          onClick={logout}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Sign out
        </button>
      </div>
      
      <div className="flex-grow flex flex-col justify-center items-center text-center">
        <div className="w-24 h-24 mb-6 rounded-full bg-purple-100 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold mb-2">Welcome, {user?.name || 'Friend'}!</h2>
        <p className="text-gray-600 mb-8">
          Let's create your personalized wellness plan for menopause. 
          We'll ask a few questions about your symptoms, diet, and goals.
        </p>
        
        <div className="w-full space-y-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="font-medium flex items-center text-lg">
              <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mr-3">1</span>
              Your Symptoms
            </h3>
            <p className="text-gray-600 ml-11">Tell us what you're experiencing</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="font-medium flex items-center text-lg">
              <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mr-3">2</span>
              Dietary Preferences
            </h3>
            <p className="text-gray-600 ml-11">Customize your nutrition plan</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="font-medium flex items-center text-lg">
              <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mr-3">3</span>
              Health Goals
            </h3>
            <p className="text-gray-600 ml-11">What you want to achieve</p>
          </div>
        </div>
        
        <button
          onClick={handleContinue}
          className="mt-8 w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
        >
          Let's Begin
        </button>
        
        <p className="mt-6 text-sm text-gray-500">
          This will take about 3 minutes to complete.
        </p>
      </div>
    </div>
  );
};

export default OnboardingStart;