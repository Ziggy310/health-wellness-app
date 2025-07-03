// src/components/community/FollowButton.jsx
import React, { useState } from 'react';

const FollowButton = ({ isFollowing, onFollowToggle }) => {
  const [following, setFollowing] = useState(isFollowing);

  const handleToggle = () => {
    setFollowing(!following);
    onFollowToggle(!following);
  };

  return (
    <button
      onClick={handleToggle}
      className={`px-4 py-2 rounded ${following ? 'bg-red-500' : 'bg-blue-500'} text-white`}
    >
      {following ? 'Unfollow' : 'Follow'}
    </button>
  );
};

export default FollowButton;