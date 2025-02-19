import React, { useState } from 'react';
import StrengthWorkoutForm from './StrengthWorkoutForm';
import CardioWorkoutForm from './CardioWorkoutForm';
import '../styles/workoutLogPanel.css';
import api from '../api';

const WorkoutLogPanel = ({ onClose, onWorkoutLogged }) => {
  const [workoutType, setWorkoutType] = useState(null);

  return (
    <div className="workout-log-panel">
      <div className="workout-log-content">
        <button className="close-button" onClick={onClose}>&times;</button>
        
        {!workoutType ? (
          <div className="workout-type-selection">
            <h2>Select Workout Type</h2>
            <div className="workout-type-buttons">
              <button 
                className="workout-type-btn strength"
                onClick={() => setWorkoutType('strength')}
              >
                Strength Training
              </button>
              <button 
                className="workout-type-btn cardio"
                onClick={() => setWorkoutType('cardio')}
              >
                Cardio
              </button>
            </div>
          </div>
        ) : workoutType === 'strength' ? (
          <StrengthWorkoutForm 
            onClose={onClose}
            onWorkoutLogged={onWorkoutLogged}
            onBack={() => setWorkoutType(null)}
          />
        ) : (
          <CardioWorkoutForm 
            onClose={onClose}
            onWorkoutLogged={onWorkoutLogged}
            onBack={() => setWorkoutType(null)}
          />
        )}
      </div>
    </div>
  );
};

export default WorkoutLogPanel; 