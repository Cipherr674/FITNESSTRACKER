const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['strength', 'cardio'],
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  points: {
    type: Number,
    required: true
  },
  // Strength workout fields
  muscleGroup: {
    type: String,
    required: function() { return this.type === 'strength'; }
  },
  exercises: [{
    exerciseName: String,
    sets: [{
      reps: Number,
      weight: Number
    }]
  }],
  // Cardio workout fields
  name: {
    type: String,
    required: function() { return this.type === 'cardio'; }
  },
  duration: {
    type: Number,
    required: function() { return this.type === 'cardio'; }
  },
  distance: {
    type: Number
  },
  intensity: {
    type: String,
    enum: ['light', 'moderate', 'vigorous', 'high'],
    required: function() { return this.type === 'cardio'; }
  }
});

// Add pre-save middleware for additional validation
workoutSchema.pre('save', function(next) {
  if (this.type === 'cardio' && !this.duration) {
    next(new Error('Duration is required for cardio workouts'));
  }
  next();
});

module.exports = mongoose.model('Workout', workoutSchema);