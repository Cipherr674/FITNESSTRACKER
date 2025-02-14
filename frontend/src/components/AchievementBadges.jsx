import React, { useState } from 'react';

const AchievementBadges = ({ badges }) => {
  // new state for expand/collapse functionality
  const [expanded, setExpanded] = useState(false);
  // define limit for number of achievements shown when collapsed
  const DISPLAY_LIMIT = 3;

  // If badges is null/undefined or not an array, return the no-badges message
  if (!Array.isArray(badges) || badges.length === 0) {
    return (
      <div className="achievements">
        <h2>Achievements</h2>
        <div className="no-badges-message">
          <p>Complete workouts to earn badges!</p>
          <p>Start your fitness journey today.</p>
        </div>
      </div>
    );
  }

  // Determine which badges to display based on expand/collapse state
  const displayedBadges = expanded ? badges : badges.slice(0, DISPLAY_LIMIT);

  return (
    <div className="achievements">
      <h2>Achievements</h2>
      <div className="badges-grid">
        {displayedBadges.map((badge) => (
          <div key={badge.id} className="badge-item">
            <div className={`badge-icon ${badge.unlocked ? 'unlocked' : 'locked'}`}>
              {/* Add badge icon here */}
            </div>
            <div className="badge-info">
              <h3>{badge.name}</h3>
              <p>{badge.description}</p>
            </div>
          </div>
        ))}
      </div>
      {badges.length > DISPLAY_LIMIT && (
        <button 
          className="toggle-button" 
          onClick={() => {
            setExpanded((prev) => !prev);
            console.log("Expanded toggled:", !expanded);
          }}
          style={{ marginTop: '1rem' }} // optional inline style for spacing
        >
          {expanded ? "Show Less" : `Show All (${badges.length})`}
        </button>
      )}
    </div>
  );
};

export default AchievementBadges; 