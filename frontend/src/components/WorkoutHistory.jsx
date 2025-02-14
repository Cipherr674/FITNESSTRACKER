const StrengthWorkoutDetails = ({ workoutData }) => {
  return (
    <div className="strength-details">
      {workoutData.strengthData?.exercises?.map((exercise, exIndex) => (
        <div key={exIndex} className="exercise-detail">
          <div className="exercise-header">
            <h4 className="exercise-name">{exercise.exerciseName}</h4>
            <span className="exercise-sets">{exercise.sets.length} sets</span>
          </div>
          
          <div className="set-grid">
            {exercise.sets.map((set, setIndex) => (
              <div key={setIndex} className="set-detail">
                <div className="set-content">
                  <div className="set-reps">
                    <span>{set.reps}</span>
                    <span>reps</span>
                  </div>
                  <div className="set-weight">
                    <span>{set.weight}</span>
                    <span>kg</span>
                  </div>
                </div>
                <div className="set-number">Set #{setIndex + 1}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}; 