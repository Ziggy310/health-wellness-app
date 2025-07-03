// src/pages/onboarding/MotivationalScreen.jsx
import React from 'react';

const MotivationalScreen = () => {
  return (
    <div className="p-6 bg-blue-100 min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold mb-4">Welcome to Meno+</h1>
      <p className="text-lg mb-6">
        Empowering you with personalized nutrition and support to manage menopause symptoms effectively.
      </p>
      <button className="px-6 py-3 bg-blue-500 text-white rounded-lg">
        Get Started
      </button>
    </div>
  );
};

export default MotivationalScreen;