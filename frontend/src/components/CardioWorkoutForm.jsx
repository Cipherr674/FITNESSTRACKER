import React, { useState } from 'react';
import axios from 'axios';
import '../styles/workoutForms.css';

const CardioWorkoutForm = ({ onClose, onWorkoutLogged, onBack }) => {
  const [formData, setFormData] = useState({
    type: 'cardio',
    name: '',
    duration: '',
    distance: '',
    intensity: 'moderate'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const cardioTypes = [
    'Running',
    'Cycling',
    'Swimming',
    'Walking',
    'Rowing',
    'Elliptical',
    'Stair Climber',
    'Jump Rope'
  ];

  const intensityLevels = [
    { value: 'light', label: 'Light - Comfortable pace, can easily hold conversation' },
    { value: 'moderate', label: 'Moderate - Slightly challenging, can still talk' },
    { value: 'vigorous', label: 'Vigorous - Hard to maintain conversation' },
    { value: 'high', label: 'High Intensity - Can barely speak' }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate inputs
    if (!formData.name || !formData.duration || !formData.intensity) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/workouts/cardio`,
        {
          ...formData,
          duration: Number(formData.duration),
          distance: formData.distance ? Number(formData.distance) : undefined
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        onWorkoutLogged();
        onClose();
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to log workout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="workout-form cardio-form">
      <button className="back-button" onClick={onBack}>← Back</button>
      <h2>Log Cardio Workout</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Exercise Type:</label>
          <select
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          >
            <option value="">Select Type</option>
            {cardioTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Duration (minutes):</label>
          <input
            type="number"
            name="duration"
            min="1"
            value={formData.duration}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Distance (km) - Optional:</label>
          <input
            type="number"
            name="distance"
            min="0"
            step="0.01"
            value={formData.distance}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Intensity Level:</label>
          <select
            name="intensity"
            value={formData.intensity}
            onChange={handleChange}
            required
          >
            {intensityLevels.map(level => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-btn" 
            disabled={loading}
          >
            {loading ? 'Logging...' : 'Log Workout'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CardioWorkoutForm; 