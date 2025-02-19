import React from 'react';
import { FiActivity, FiClock, FiAward, FiTarget } from 'react-icons/fi';
import { GiMuscleUp } from 'react-icons/gi';
import api from '../api';

const RecentActivityFeed = ({ recentWorkouts = [] }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderWorkoutDetails = (workout) => {
    if (!workout) return null;
    if (workout.type === 'cardio') {
      return (
        <div className="activity-stats">
          <span><FiClock /> {workout.duration || 0} mins</span>
          {workout.distance && <span><FiTarget /> {workout.distance} km</span>}
          <span className="intensity">{workout.intensity}</span>
          <span><FiAward /> {workout.points} pts</span>
        </div>
      );
    } else {
      // For strength workouts
      return (
        <div className="activity-stats">
          <span className="muscle-group">{formatMuscleGroup(workout.muscleGroup)}</span>
          <span>{workout.exercises.length} exercises</span>
          <span>{getTotalSets(workout)} sets</span>
          <span><FiAward /> {workout.points} pts</span>
        </div>
      );
    }
  };

  const formatMuscleGroup = (muscleGroup) => {
    return muscleGroup
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getTotalSets = (workout) => {
    if (!workout?.exercises) return 0;
    return workout.exercises.reduce((total, exercise) => 
      total + (exercise.sets?.length || 0), 0
    );
  };

  const getWorkoutTitle = (workout) => {
    if (!workout) return 'Unknown Workout';
    if (workout.type === 'cardio') {
      return workout.name || 'Cardio Session';
    } else {
      return workout.muscleGroup 
        ? `${formatMuscleGroup(workout.muscleGroup)} Workout`
        : 'Strength Training';
    }
  };

  const getWorkoutIcon = (type) => {
    return type === 'cardio' ? 
      <FiActivity className="icon cardio" /> : 
      <GiMuscleUp className="icon strength" />;
  };

  if (recentWorkouts.length === 0) {
    return (
      <div className="recent-activity">
        <h2>Recent Activity</h2>
        <p className="no-activity">No recent workouts logged</p>
      </div>
    );
  }

  return (
    <div className="recent-activity">
      <h2>Recent Activity</h2>
      <div className="activity-list">
        {(Array.isArray(recentWorkouts) ? recentWorkouts : []).map((workout) => (
          <div key={workout?._id || Math.random()} className={`activity-item ${workout?.type || 'unknown'}`}>
            {getWorkoutIcon(workout?.type)}
            <div className="activity-details">
              <div className="activity-header">
                <h3>{workout ? getWorkoutTitle(workout) : 'Unknown Workout'}</h3>
                <span className="workout-date">{workout?.date ? formatDate(workout.date) : 'Unknown Date'}</span>
              </div>
              {renderWorkoutDetails(workout)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivityFeed; 