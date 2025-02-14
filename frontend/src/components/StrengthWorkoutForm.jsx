import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/workoutForms.css';

const StrengthWorkoutForm = ({ onClose, onWorkoutLogged, onBack }) => {
  const [exercises, setExercises] = useState([{
    exerciseName: '',
    sets: [{
      reps: '',
      weight: ''
    }]
  }]);
  const [muscleGroup, setMuscleGroup] = useState('');
  const [predefinedExercises, setPredefinedExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sessionStarted, setSessionStarted] = useState(false);
  const [loggedExercises, setLoggedExercises] = useState([]);
  const [message, setMessage] = useState('');

  const muscleGroups = [
    'abdominals',
    'abductors',
    'adductors',
    'biceps',
    'calves',
    'chest',
    'forearms',
    'glutes',
    'hamstrings',
    'lats',
    'lower_back',
    'middle_back',
    'neck',
    'quadriceps',
    'traps',
    'triceps'
  ];

  // Fetch predefined exercises when muscle group changes
  useEffect(() => {
    if (muscleGroup) {
      fetchExercises(muscleGroup);
    }
  }, [muscleGroup]);

  const fetchExercises = async (muscle) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/workouts/predefined?muscle=${muscle}`);
      if (response.data.success && Array.isArray(response.data.workouts)) {
        setPredefinedExercises(response.data.workouts);
      } else {
        setError('No exercises found for this muscle group');
        setPredefinedExercises([]);
      }
    } catch (error) {
      console.error('Error fetching exercises:', error);
      setError(error.response?.data?.error || 'Failed to load exercises');
      setPredefinedExercises([]);
    }
  };

  const addExercise = () => {
    setExercises([...exercises, {
      exerciseName: '',
      sets: [{
        reps: '',
        weight: ''
      }]
    }]);
  };

  const addSet = (exerciseIndex) => {
    const newExercises = [...exercises];
    newExercises[exerciseIndex].sets.push({
      reps: '',
      weight: ''
    });
    setExercises(newExercises);
  };

  const removeSet = (exerciseIndex, setIndex) => {
    const newExercises = [...exercises];
    newExercises[exerciseIndex].sets = newExercises[exerciseIndex].sets.filter((_, i) => i !== setIndex);
    setExercises(newExercises);
  };

  const handleSetChange = (exerciseIndex, setIndex, field, value) => {
    const newExercises = [...exercises];
    newExercises[exerciseIndex].sets[setIndex][field] = value;
    setExercises(newExercises);
  };

  const removeExercise = (index) => {
    const newExercises = exercises.filter((_, i) => i !== index);
    setExercises(newExercises);
  };

  const handleExerciseChange = (index, field, value) => {
    const newExercises = [...exercises];
    newExercises[index][field] = value;
    setExercises(newExercises);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate inputs
    const isValid = exercises.every(ex => 
      ex.exerciseName && 
      ex.sets.every(set =>
        Number(set.reps) > 0 && 
        Number(set.weight) > 0
      )
    );

    if (!isValid) {
      setError('Please fill in all fields with valid numbers');
      setLoading(false);
      return;
    }

    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/workouts/strength',
        {
          type: 'strength',
          muscleGroup,
          exercises: exercises.map(ex => ({
            exerciseName: ex.exerciseName,
            sets: ex.sets.map(set => ({
              reps: Number(set.reps),
              weight: Number(set.weight)
            }))
          }))
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        // Add to logged exercises and reset current form
        setLoggedExercises(prev => [...prev, ...exercises]);
        setExercises([{
          exerciseName: '',
          sets: [{
            reps: '',
            weight: ''
          }]
        }]);
        setSessionStarted(true);
        setMessage('Exercise logged! Add another or finish session.');
        onWorkoutLogged(); // Update any parent components if needed
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to log workout');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteSession = () => {
    setSessionStarted(false);
    setLoggedExercises([]);
    setMuscleGroup('');
    onClose();
  };

  // Helper function to format muscle group name for display
  const formatMuscleGroupName = (name) => {
    return name
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="workout-form strength-form">
      <button className="back-button" onClick={onBack}>← Back</button>
      <h2>{sessionStarted ? 'Active Strength Session' : 'Start Strength Session'}</h2>

      {!sessionStarted ? (
        <div className="session-start">
          <div className="form-group">
            <label>Select Target Muscle Group:</label>
            <select 
              value={muscleGroup} 
              onChange={(e) => setMuscleGroup(e.target.value)}
              required
            >
              <option value="">Select Muscle Group</option>
              {muscleGroups.map(group => (
                <option key={group} value={group}>
                  {formatMuscleGroupName(group)}
                </option>
              ))}
            </select>
          </div>
          <button 
            className="start-session-btn"
            onClick={() => setSessionStarted(true)}
            disabled={!muscleGroup}
          >
            Start Session
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="active-session-header">
            <h3>Current Muscle Group: {formatMuscleGroupName(muscleGroup)}</h3>
            <div className="logged-exercises">
              <h4>Logged Exercises:</h4>
              {loggedExercises.map((ex, idx) => (
                <div key={idx} className="logged-exercise">
                  {ex.exerciseName} - {ex.sets.length} sets
                </div>
              ))}
            </div>
          </div>

          {exercises.map((exercise, exerciseIndex) => (
            <div key={exerciseIndex} className="exercise-entry">
              <h3>Exercise {exerciseIndex + 1}</h3>
              
              <div className="form-group">
                <label>Exercise Name:</label>
                <select
                  value={exercise.exerciseName}
                  onChange={(e) => handleExerciseChange(exerciseIndex, 'exerciseName', e.target.value)}
                  required
                >
                  <option value="">Select Exercise</option>
                  {predefinedExercises.map((ex, i) => (
                    <option key={i} value={ex.name}>
                      {ex.name}
                    </option>
                  ))}
                </select>
              </div>

              {exercise.sets.map((set, setIndex) => (
                <div key={setIndex} className="set-entry">
                  <h4>Set {setIndex + 1}</h4>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Reps:</label>
                      <input
                        type="number"
                        min="1"
                        value={set.reps}
                        onChange={(e) => handleSetChange(exerciseIndex, setIndex, 'reps', e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Weight (kg):</label>
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        value={set.weight}
                        onChange={(e) => handleSetChange(exerciseIndex, setIndex, 'weight', e.target.value)}
                        required
                      />
                    </div>

                    {exercise.sets.length > 1 && (
                      <button
                        type="button"
                        className="remove-set-btn"
                        onClick={() => removeSet(exerciseIndex, setIndex)}
                      >
                        Remove Set
                      </button>
                    )}
                  </div>
                </div>
              ))}

              <button
                type="button"
                className="add-set-btn"
                onClick={() => addSet(exerciseIndex)}
              >
                Add Set
              </button>

              {exercises.length > 1 && (
                <button 
                  type="button" 
                  className="remove-exercise-btn"
                  onClick={() => removeExercise(exerciseIndex)}
                >
                  Remove Exercise
                </button>
              )}
            </div>
          ))}

          <div className="session-controls">
            <button 
              type="submit" 
              className="log-exercise-btn" 
              disabled={loading}
            >
              {loading ? 'Logging...' : 'Log Exercise'}
            </button>
            
            <button 
              type="button" 
              className="complete-session-btn"
              onClick={handleCompleteSession}
            >
              Finish Session
            </button>
          </div>
        </form>
      )}

      {error && <div className="error-message">{error}</div>}
      {message && <div className="success-message">{message}</div>}
    </div>
  );
};

export default StrengthWorkoutForm; 