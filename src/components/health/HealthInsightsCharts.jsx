// src/components/health/HealthInsightsCharts.jsx
import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const HealthInsightsCharts = ({ data }) => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Health Insights Visualization</h2>
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Symptom Trends Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="symptomSeverity" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Nutrient Intake vs Symptoms</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="nutrient" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="symptomSeverity" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default HealthInsightsCharts;