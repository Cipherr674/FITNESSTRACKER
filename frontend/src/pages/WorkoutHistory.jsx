// src/pages/WorkoutHistory.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiCalendar, FiActivity, FiAward, FiClock, FiTrendingUp, FiZap } from 'react-icons/fi';
import '../styles/WorkoutHistory.css'; // This file will style our cards and modal

const WorkoutHistory = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorkout, setSelectedWorkout] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const fetchWorkouts = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/workouts/history`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Sort workouts by date (newest first)
        const sortedWorkouts = res.data.workouts.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setWorkouts(sortedWorkouts);
      } catch (error) {
        console.error("Error fetching workouts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  // Helper function to capitalize the first letter of the workout type.
  const getCapitalizedType = (type) => {
    return type ? type.charAt(0).toUpperCase() + type.slice(1) : '';
  };

  // Group workouts by type and month
  const groupWorkoutsByTypeAndMonth = (workouts) => {
    return workouts.reduce((groups, workout) => {
      const type = workout.type || 'other';
      const date = new Date(workout.date);
      const month = date.toLocaleString("en-US", { month: "long" });
      const year = date.getFullYear();
      const monthKey = `${month} ${year}`;

      if (!groups[type]) {
        groups[type] = {};
      }
      
      if (!groups[type][monthKey]) {
        groups[type][monthKey] = [];
      }
      
      groups[type][monthKey].push(workout);
      return groups;
    }, {});
  };

  // Group the workouts and sort the month keys (most recent first)
  const groupedWorkouts = groupWorkoutsByTypeAndMonth(workouts);

  const handleWorkoutClick = (workout) => {
    setSelectedWorkout(workout);
  };

  const handleCloseModal = () => {
    setSelectedWorkout(null);
  };

  return (
    <div className="workout-log-page">
      <h1>Workout History</h1>
      {loading ? (
        <p>Loading workouts...</p>
      ) : workouts.length === 0 ? (
        <p>No workouts logged yet. Start your fitness journey today!</p>
      ) : (
        Object.entries(groupedWorkouts).map(([type, months]) => (
          <div key={type} className="workout-type-group">
            <h2 className="type-heading">
              {getCapitalizedType(type)} Workouts
              <span className="workout-count">
                {Object.values(months).flat().length} sessions
              </span>
            </h2>
            
            {Object.keys(months).sort((a, b) => {
              const [monthA, yearA] = a.split(" ");
              const [monthB, yearB] = b.split(" ");
              return new Date(`${monthB} 1, ${yearB}`) - new Date(`${monthA} 1, ${yearA}`);
            }).map(monthKey => (
              <div key={monthKey} className="month-group">
                <h3 className="month-heading">{monthKey}</h3>
                <ul className="workout-list">
                  {months[monthKey].map((workout) => {
                    const formattedDate = new Date(workout.date).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric"
                    });
                    return (
                      <li
                        key={workout._id}
                        className="workout-item"
                        onClick={() => handleWorkoutClick(workout)}
                      >
                        <div className="workout-header">
                          <span className="workout-type-badge">
                            {getCapitalizedType(workout.type)}
                          </span>
                          <span className="workout-date">
                            <FiCalendar className="icon" />
                            {formattedDate}
                          </span>
                        </div>
                        
                        <div className="workout-stats">
                          <div className="stat-item">
                            <FiAward className="icon" />
                            <span className="stat-value">{workout.points} XP</span>
                          </div>
                          <div className="stat-item">
                            <FiClock className="icon" />
                            <span className="stat-value">{workout.duration} mins</span>
                          </div>
                          {workout.type === 'strength' && (
                            <div className="stat-item">
                              <FiActivity className="icon" />
                              <span className="stat-value">
                                {workout.exercises?.reduce((total, ex) => total + ex.sets.length, 0)} sets
                              </span>
                            </div>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        ))
      )}

      {/* Expanded Card Modal */}
      {selectedWorkout && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="expanded-card" onClick={(e) => e.stopPropagation()}>
            <h2>{getCapitalizedType(selectedWorkout.type)} Workout</h2>
            <div className="modal-details">
              <div className="modal-row">
                <span className="detail-label">
                  <FiCalendar className="icon" /> Date:
                </span>
                <span className="detail-value">
                  {new Date(selectedWorkout.date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric"
                  })}
                </span>
              </div>
              <div className="modal-row">
                <span className="detail-label">
                  <FiAward className="icon" /> Points:
                </span>
                <span className="detail-value">{selectedWorkout.points}</span>
              </div>
              <div className="modal-row">
                <span className="detail-label">
                  <FiClock className="icon" /> Duration:
                </span>
                <span className="detail-value">{selectedWorkout.duration} mins</span>
              </div>
              {selectedWorkout.type === 'strength' && (
                <div className="strength-workout-card">
                  <h3>Exercise Breakdown</h3>
                  {selectedWorkout.exercises?.map((exercise, exIndex) => (
                    <div key={exIndex} className="exercise-detail">
                      <div className="exercise-header">
                        <span className="exercise-name">{exercise.exerciseName}</span>
                        <span className="exercise-sets">{exercise.sets.length} sets</span>
                      </div>
                      <div className="set-grid">
                        {exercise.sets.map((set, setIndex) => (
                          <div key={setIndex} className="set-detail">
                            <span className="set-number">Set {setIndex + 1}</span>
                            <span className="set-reps">{set.reps} reps</span>
                            <span className="set-weight">{set.weight} kg</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {selectedWorkout.type === 'cardio' && (
                <div className="cardio-details">
                  <div className="modal-row">
                    <span className="detail-label">
                      <FiActivity className="icon" />
                      Activity:
                    </span>
                    <span className="detail-value">
                      {selectedWorkout.cardioType || 'N/A'}
                    </span>
                  </div>
                  <div className="modal-row">
                    <span className="detail-label">
                      <FiTrendingUp className="icon" />
                      Distance:
                    </span>
                    <span className="detail-value">
                      {selectedWorkout.distance ? `${selectedWorkout.distance} km` : 'N/A'}
                    </span>
                  </div>
                  <div className="modal-row">
                    <span className="detail-label">
                      <FiZap className="icon" />
                      Intensity:
                    </span>
                    <span className="detail-value">
                      {selectedWorkout.intensity || 'N/A'}
                    </span>
                  </div>
                </div>
              )}
            </div>
            <button className="close-btn" onClick={handleCloseModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutHistory;
