// src/pages/mealplan/GroceryIntegration.jsx
import React from 'react';

const GroceryIntegration = ({ groceryList }) => {
  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">Grocery List</h2>
      <ul className="list-disc pl-5">
        {groceryList.map((item, index) => (
          <li key={index} className="mb-2">{item}</li>
        ))}
      </ul>
      <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
        Order Groceries
      </button>
    </div>
  );
};

export default GroceryIntegration;