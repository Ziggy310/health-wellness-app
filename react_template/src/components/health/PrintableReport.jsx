// src/components/health/PrintableReport.jsx
import React from 'react';

const PrintableReport = ({ data }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Printable Health Report</h2>
      <div id="printable-content" className="bg-white p-4 shadow-md">
        <h3 className="text-lg font-semibold mb-2">Health Insights Summary</h3>
        <ul className="list-disc pl-5">
          {data.map((item, index) => (
            <li key={index} className="mb-2">
              <span className="font-semibold">{item.title}:</span> {item.details}
            </li>
          ))}
        </ul>
      </div>
      <button
        onClick={handlePrint}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Print Report
      </button>
    </div>
  );
};

export default PrintableReport;