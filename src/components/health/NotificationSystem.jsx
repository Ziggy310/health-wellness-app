// src/components/health/NotificationSystem.jsx
import React, { useState, useEffect } from 'react';

const NotificationSystem = ({ correlations }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const importantCorrelations = correlations.filter(correlation => correlation.importance > 0.8);
    setNotifications(importantCorrelations);
  }, [correlations]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Notifications</h2>
      {notifications.length > 0 ? (
        <ul className="list-disc pl-5">
          {notifications.map((notification, index) => (
            <li key={index} className="mb-2">
              <span className="font-semibold">{notification.title}:</span> {notification.message}
            </li>
          ))}
        </ul>
      ) : (
        <p>No important notifications at the moment.</p>
      )}
    </div>
  );
};

export default NotificationSystem;