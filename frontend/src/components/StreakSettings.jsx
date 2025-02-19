import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import '../styles/streakSettings.css';

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const StreakSettings = () => {
  const { user } = useAuth();

  // Initialize with current user settings (assumes these exist in the user object)
  const [streakFrozen, setStreakFrozen] = useState(user?.streakFrozen || false);
  const [restDays, setRestDays] = useState(user?.restDays || []);
  const [freezesRemaining, setFreezesRemaining] = useState(user?.freezesRemaining || 0);
  const [currentStreak, setCurrentStreak] = useState(user?.streaks || 0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Function to fetch the current streak from backend
  const fetchStreak = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/streak`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCurrentStreak(response.data.streak);
    } catch (error) {
      console.error("Error fetching streak:", error);
    }
  };

  // Fetch (or refresh) the streak when component mounts or when rest days change
  useEffect(() => {
    fetchStreak();
  }, [restDays]);

  // Toggle the freeze streak setting
  const handleToggleFreeze = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      const newFreeze = !streakFrozen;
      
      // If user tries to freeze but has no freezes remaining
      if (newFreeze && freezesRemaining <= 0) {
        setMessage("No freeze remaining. Please upgrade or wait until reset.");
        setLoading(false);
        return;
      }

      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/users/profile`,
        { streakFrozen: newFreeze },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setStreakFrozen(newFreeze);
        setMessage("Streak freeze updated.");
        if (newFreeze) {
          setFreezesRemaining(prev => prev - 1);
        }
      }
    } catch (error) {
      console.error("Error updating streak freeze:", error);
      setMessage("Error updating streak freeze.");
    } finally {
      setLoading(false);
    }
  };

  // Toggle an individual rest day
  const handleToggleRestDay = (day) => {
    const updated = restDays.includes(day)
      ? restDays.filter(d => d !== day)
      : [...restDays, day];
    setRestDays(updated);
  };

  // Save rest day selection to backend
  const handleSaveRestDays = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/users/profile`,
        { restDays },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setMessage("Rest days updated.");
        fetchStreak();
      }
    } catch (error) {
      console.error("Error updating rest days:", error);
      setMessage("Error updating rest days.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="streak-settings">
      <div className="streak-settings-header">
        <h3>Streak Settings</h3>
        <p>Your current streak is: {currentStreak} day{currentStreak !== 1 ? 's' : ''}</p>
      </div>
      
      <div className="section freeze-section">
        <label>
          <input 
            type="checkbox" 
            checked={streakFrozen} 
            onChange={handleToggleFreeze} 
            disabled={loading}
          />
          Freeze my streak
          <span style={{ fontSize: '0.85rem', color: '#a3a3a3' }}>
            ({freezesRemaining} remaining)
          </span>
        </label>
      </div>
      
      <div className="section rest-days-section">
        <p>Select your rest days (your streak won't reset on these days):</p>
        <div className="days-list">
          {daysOfWeek.map(day => (
            <label key={day}>
              <input 
                type="checkbox" 
                checked={restDays.includes(day)} 
                onChange={() => handleToggleRestDay(day)}
              />
              {day}
            </label>
          ))}
        </div>
        <button onClick={handleSaveRestDays} disabled={loading}>
          Save Rest Days
        </button>
      </div>
      
      {message && <p className="streak-message">{message}</p>}
    </div>
  );
};

export default StreakSettings; 