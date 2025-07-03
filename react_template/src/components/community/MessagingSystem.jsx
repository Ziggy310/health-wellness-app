// src/components/community/MessagingSystem.jsx
import React, { useState } from 'react';

const MessagingSystem = ({ users }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSendMessage = () => {
    if (message.trim() !== '') {
      setMessages([...messages, { user: selectedUser, text: message }]);
      setMessage('');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Messaging System</h2>
      <div className="mb-4">
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">Select a user</option>
          {users.map((user) => (
            <option key={user.id} value={user.name}>
              {user.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Type your message..."
        />
      </div>
      <button
        onClick={handleSendMessage}
        className="px-4 py-2 bg-green-500 text-white rounded"
      >
        Send
      </button>
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Messages</h3>
        <ul className="list-disc pl-5">
          {messages.map((msg, index) => (
            <li key={index} className="mb-2">
              <span className="font-semibold">{msg.user}:</span> {msg.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MessagingSystem;