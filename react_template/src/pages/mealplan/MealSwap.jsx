// src/pages/mealplan/MealSwap.jsx
import React from 'react';

const MealSwap = ({ meals, onSwap }) => {
  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">Meal Swap Options</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {meals.map((meal, index) => (
          <div key={index} className="bg-white shadow rounded p-4">
            <h3 className="font-semibold">{meal.name}</h3>
            <button
              onClick={() => onSwap(meal)}
              className="mt-2 px-4 py-2 bg-green-500 text-white rounded"
            >
              Swap
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MealSwap;