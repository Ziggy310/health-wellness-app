// src/pages/onboarding/DietaryPreferences.jsx
import React, { useState } from 'react';

const DietaryPreferences = () => {
  const [preferences, setPreferences] = useState({
    dietaryPattern: '',
    allergies: [],
    specificDiet: '',
    dislikes: [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPreferences({ ...preferences, [name]: value });
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Dietary Preferences</h2>
      <form>
        <div className="mb-4">
          <label className="block mb-2">Dietary Pattern</label>
          <select
            name="dietaryPattern"
            value={preferences.dietaryPattern}
            onChange={handleInputChange}
            className="p-2 border rounded"
          >
            <option value="">Select</option>
            <option value="omnivore">Omnivore</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="vegan">Vegan</option>
          </select>
        </div>
        {/* Additional form fields for allergies, specific diet, dislikes */}
      </form>
    </div>
  );
};

export default DietaryPreferences;