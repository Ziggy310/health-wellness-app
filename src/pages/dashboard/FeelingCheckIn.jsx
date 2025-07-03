// src/pages/dashboard/FeelingCheckIn.jsx
import React, { useState } from 'react';

const FeelingCheckIn = () => {
  const [mood, setMood] = useState('');

  const handleMoodSelect = (selectedMood) => {
    setMood(selectedMood);
  };

  return (
    <div className="p-4 bg-white shadow rounded">
      <h2 className="text-lg font-bold mb-2">How Are You Feeling?</h2>
      <div className="flex justify-around">
        {['Happy', 'Sad', 'Anxious', 'Calm'].map((m) => (
          <button
            key={m}
            onClick={() => handleMoodSelect(m)}
            className={`px-4 py-2 rounded ${mood === m ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            {m}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FeelingCheckIn;