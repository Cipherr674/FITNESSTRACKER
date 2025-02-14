// src/components/PredefinedWorkoutForm.jsx
import React, { useState, useEffect } from 'react';
import { fetchPredefinedWorkouts } from '../services/WorkoutService';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/workoutLog.css';

const PredefinedWorkoutForm = () => {
  const [muscle, setMuscle] = useState('triceps'); // Default muscle group
  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch predefined workouts when the muscle group changes
  useEffect(() => {
    async function loadWorkouts() {
      const workouts = await fetchPredefinedWorkouts(muscle);
      setExercises(workouts);
    }
    loadWorkouts();
  }, [muscle]);

  // When an exercise is selected, prefill form fields if available
  const handleExerciseChange = (e) => {
    const exerciseName = e.target.value;
    const exercise = exercises.find((ex) => ex.name === exerciseName);
    setSelectedExercise(exercise);
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Build the workout object
    const workoutData = {
      type: selectedExercise?.type || 'cardio',
      name: selectedExercise?.name || '',
      // You can prefill other fields like default duration, sets, reps if available
    };

    // Optional: Override with user-entered data if you want to allow modifications
    // For example, you might include additional inputs for duration, etc.

    try {
      const token = sessionStorage.getItem('token');
      await axios.post('http://localhost:5000/api/workouts', workoutData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/dashboard');
    } catch (err) {
      console.error('Error logging workout:', err);
      setError(err.response?.data?.error || 'Workout logging failed.');
    }
  };

  return (
    <div className="workout-log-container">
      <h1 className="log-heading">Log a Prefilled Workout</h1>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="workout-log-form">
        <div className="form-group">
          <label>Muscle Group</label>
          <select value={muscle} onChange={(e) => setMuscle(e.target.value)}>
            <option value="triceps">Triceps</option>
            <option value="biceps">Biceps</option>
            <option value="chest">Chest</option>
            <option value="legs">Legs</option>
            {/* Add more muscle groups as needed */}
          </select>
        </div>

        <div className="form-group">
          <label>Select Exercise</label>
          <select value={selectedExercise ? selectedExercise.name : ''} onChange={handleExerciseChange}>
            <option value="">-- Choose an exercise --</option>
            {exercises.map((exercise, index) => (
              <option key={index} value={exercise.name}>
                {exercise.name}
              </option>
            ))}
          </select>
        </div>

        {/* Optionally show prefilled details from selectedExercise */}
        {selectedExercise && (
          <>
            {selectedExercise.type === 'cardio' && (
              <div className="form-group">
                <label>Default Duration (in minutes)</label>
                <input type="number" defaultValue={selectedExercise.defaultDuration || ''} readOnly />
              </div>
            )}
            {selectedExercise.type === 'strength' && (
              <>
                <div className="form-group">
                  <label>Default Sets</label>
                  <input type="number" defaultValue={selectedExercise.defaultSets || ''} readOnly />
                </div>
                <div className="form-group">
                  <label>Default Reps (comma separated)</label>
                  <input type="text" defaultValue={selectedExercise.defaultReps ? selectedExercise.defaultReps.join(', ') : ''} readOnly />
                </div>
              </>
            )}
          </>
        )}

        <button type="submit" className="submit-btn">Log Workout</button>
      </form>
    </div>
  );
};

export default PredefinedWorkoutForm;
