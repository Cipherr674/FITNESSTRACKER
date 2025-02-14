import React from 'react';
import '../styles/badgeNotification.css';

const BadgeNotification = ({ badge, onClose }) => {
  return (
    <div className="badge-notification">
      <div className="badge-content">
        <h3>🏆 New Badge Earned!</h3>
        <h4>{badge.name}</h4>
        <p>{badge.description}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default BadgeNotification; 