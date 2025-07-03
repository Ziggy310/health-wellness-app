import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MealDetail from './MealDetail';

/**
 * MealPage serves as a wrapper for the MealDetail component.
 * It ensures proper routing and hydration of meal data for individual meal detail pages.
 */
const MealPage = () => {
  return (
    <Router>
      <Routes>
        {/* Define a route for meal detail pages */}
        <Route path="/meal/:slug" element={<MealDetail />} />
      </Routes>
    </Router>
  );
};

export default MealPage;