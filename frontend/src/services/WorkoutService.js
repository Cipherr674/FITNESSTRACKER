// src/services/workoutService.js
import axios from 'axios';

export const fetchPredefinedWorkouts = async (muscle) => {
  try {
    // Replace muscle value if needed (e.g., "triceps")
    const res = await axios.get('http://localhost:5000/api/workouts/apiworkout', { 
      params: { muscle } 
    });
    return res.data.workouts;
  } catch (error) {
    console.error('Error fetching predefined workouts:', error);
    return [];
  }
};
