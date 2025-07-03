// src/components/community/Leaderboard.jsx
import React from 'react';

const Leaderboard = ({ users }) => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Community Leaderboard</h2>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">Rank</th>
            <th className="py-2">User</th>
            <th className="py-2">Points</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.id} className="text-center">
              <td className="py-2">{index + 1}</td>
              <td className="py-2">{user.name}</td>
              <td className="py-2">{user.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;