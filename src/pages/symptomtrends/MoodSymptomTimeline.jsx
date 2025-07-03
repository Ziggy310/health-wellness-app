// src/pages/symptomtrends/MoodSymptomTimeline.jsx
import React from 'react';

const MoodSymptomTimeline = ({ data }) => {
  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">Mood & Symptom Timeline</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2">Date</th>
              <th className="py-2">Mood</th>
              <th className="py-2">Symptoms</th>
            </tr>
          </thead>
          <tbody>
            {data.map((entry, index) => (
              <tr key={index} className="text-center">
                <td className="py-2">{entry.date}</td>
                <td className="py-2">{entry.mood}</td>
                <td className="py-2">{entry.symptoms.join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MoodSymptomTimeline;