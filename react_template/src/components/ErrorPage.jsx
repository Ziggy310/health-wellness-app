// src/components/ErrorPage.jsx
import React from 'react';

const ErrorPage = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Error loading meal</h1>
        <p>Please try again later.</p>
      </div>
    </div>
  );
};

export default ErrorPage;