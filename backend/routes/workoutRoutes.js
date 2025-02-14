const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const { 
  logStrengthWorkout,
  logCardioWorkout,
  getWorkouts,
  getPredefinedWorkouts,
  deleteWorkout
} = require('../controllers/workoutController');

// Add error handling middleware
const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Separate routes for cardio and strength workouts
router.post('/strength', protect, logStrengthWorkout);
router.post('/cardio', protect, logCardioWorkout);

// General workout routes
router.get('/', protect, getWorkouts);
router.delete('/:id', protect, deleteWorkout);
router.get('/predefined', getPredefinedWorkouts);

module.exports = router; 