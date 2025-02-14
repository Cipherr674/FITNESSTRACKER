const User = require("../models/User");
const Workout = require("../models/Workouts");

exports.getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalWorkouts = await Workout.countDocuments();
    
    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalWorkouts,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
