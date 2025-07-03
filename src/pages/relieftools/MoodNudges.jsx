// src/pages/relieftools/MoodNudges.jsx
import React from 'react';

const MoodNudges = () => {
  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">Mood Nudges</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {['Anxiety', 'Irritability', 'Sadness'].map((mood, index) => (
          <div key={index} className="bg-white shadow rounded p-4">
            <h3 className="font-semibold">{mood}</h3>
            <p className="mt-2">Quick CBT-based techniques to help manage {mood.toLowerCase()}.</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoodNudges;