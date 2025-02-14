const updateStreak = (user) => {
    const today = new Date();
    const lastWorkout = user.lastWorkoutDate ? new Date(user.lastWorkoutDate) : null;
  
    if (!lastWorkout) {
      user.streaks = 1; // First workout
    } else {
      const diff = Math.floor((today - lastWorkout) / (1000 * 60 * 60 * 24)); // Difference in days
  
      if (diff === 1) {
        user.streaks += 1; // Increments a streak if yesterday was the last workout
      } else if (diff > 1) {
        user.streaks = 1; // Reset streak if a day is missed
      }
    }
  
    user.lastWorkoutDate = today; // Update last workout date
  };
  