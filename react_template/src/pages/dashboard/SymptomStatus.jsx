// src/pages/dashboard/SymptomStatus.jsx
import React from 'react';

const SymptomStatus = ({ symptoms }) => {
  return (
    <div className="p-4 bg-white shadow rounded">
      <h2 className="text-lg font-bold mb-2">Today's Symptom Status</h2>
      <div className="flex justify-between">
        {symptoms.map((symptom, index) => (
          <div key={index} className="text-center">
            <div className={`w-8 h-8 rounded-full ${symptom.color}`}></div>
            <p className="text-sm">{symptom.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SymptomStatus;