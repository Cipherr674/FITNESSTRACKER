const express = require("express");
const router = express.Router();
const authorize = require("../middlewares/authorize"); // Role-based middleware
const User = require("../models/User");
const Workout = require("../models/Workouts");

// Get a list of all users (admin only)
exports.getUsers= async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get a specific user's details by ID (admin only)
exports.getUserID= async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Update a specific user's details (admin only)
exports.updateUser =async (req, res) => {
  try {
    // Allow admin to update fields like name, email, and role
    const updates = req.body;
    // For security, you might want to prevent password changes from this endpoint
    const updatedUser = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select("-password");
    if (!updatedUser) return res.status(404).json({ success: false, message: "User not found" });
    res.status(200).json({ success: true, user: updatedUser });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Delete a user by ID (admin only)
exports.deleteUser=async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ success: false, message: "User not found" });
    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};



// Get all workouts (admin only)
exports.getWorkout= async (req, res) => {
  try {
    const workouts = await Workout.find().sort({ date: -1 });
    res.status(200).json({ success: true, workouts });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get a specific workout by ID (admin only)
exports.getWorkoutID=  async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);
    if (!workout) return res.status(404).json({ success: false, message: "Workout not found" });
    res.status(200).json({ success: true, workout });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Update a specific workout (admin only)
exports.updateWorkout=  async (req, res) => {
  try {
    const updates = req.body;
    const updatedWorkout = await Workout.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!updatedWorkout) return res.status(404).json({ success: false, message: "Workout not found" });
    res.status(200).json({ success: true, workout: updatedWorkout });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Delete a workout by ID (admin only)
exports.deleteWorkout=  async (req, res) => {
  try {
    await Workout.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Workout deleted" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get workouts for a specific user
exports.getUserWorkouts = async (req, res) => {
  try {
    const { userId } = req.params;

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: "User not found" 
      });
    }

    // Fetch user's workouts with most recent first
    const workouts = await Workout.find({ user_id: userId })
      .sort({ date: -1 })
      .select('type name points date duration exercises sets notes')
      .lean();

    // Format the workout data
    const formattedWorkouts = workouts.map(workout => {
      const formattedWorkout = {
        _id: workout._id,
        type: workout.type,
        name: workout.name,
        points: workout.points,
        date: workout.date,
      };

      // Add type-specific details
      if (workout.type === 'cardio') {
        formattedWorkout.duration = workout.duration;
      } else if (workout.type === 'strength') {
        if (workout.exercises && workout.exercises.length > 0) {
          formattedWorkout.exercises = workout.exercises;
        } else if (workout.sets && workout.sets.length > 0) {
          formattedWorkout.sets = workout.sets;
        }
      }

      // Add notes if they exist
      if (workout.notes) {
        formattedWorkout.notes = workout.notes;
      }

      return formattedWorkout;
    });

    res.status(200).json({
      success: true,
      workouts: formattedWorkouts
    });

  } catch (error) {
    console.error('Error in getUserWorkouts:', error);
    res.status(500).json({
      success: false,
      error: "Error fetching user workouts"
    });
  }
};



