const express = require('express');
const router = express.Router();
const protect = require('../middlewares/auth');
const User = require('../models/User');

exports.restDays = async (req, res) => {
  try {
    // Extract restDays from request body
    const { restDays } = req.body; // Expected to be an array of days like ["Monday", "Thursday"]

    // Validate if restDays is an array and contains at least one day
    if (!Array.isArray(restDays) || restDays.length === 0) {
      return res.status(400).json({ success: false, error: "Rest days must be an array with at least one day." });
    }

    // Find the user using the user ID from the JWT token
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // Update the user's restDays field
    user.restDays = restDays;

    // Save the updated user document
    await user.save();

    // Return success response
    res.status(200).json({ success: true, message: "Rest days updated successfully" });
  } catch (err) {
    // Log the error in development for debugging
    console.error(err);

    // Return error response
    res.status(400).json({ success: false, error: err.message });
  }
};
