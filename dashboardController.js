// backend/controllers/dashboardController.js
const Workout = require('../models/Workouts');
const User = require('../models/User');
const { calculateMilestones } = require('../utils/milestoneLogic');

exports.getDashboardAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch all workouts for the user
    const allWorkouts = await Workout.find({ user_id: userId })
      .sort({ date: -1 }) // Newest first
      .lean();

    // Get recent workouts (last 5)
    const recentWorkouts = allWorkouts.slice(0, 5);

    // Calculate total workouts and points
    const numberOfWorkouts = allWorkouts.length;
    const totalCardioPoints = allWorkouts
      .filter(w => w.type === 'cardio')
      .reduce((sum, w) => sum + w.points, 0);
    const totalStrengthPoints = allWorkouts
      .filter(w => w.type === 'strength')
      .reduce((sum, w) => sum + w.points, 0);

    // Fetch the user to get their rank and streak
    const user = await User.findById(userId)
      .select('cardioRank strengthRank streaks strengthPoints cardioPoints');

    res.status(200).json({
      success: true,
      analytics: {
        numberOfWorkouts,
        totalCardioPoints,
        totalStrengthPoints,
        cardioRank: user.cardioRank,
        strengthRank: user.strengthRank,
        streak: user.streaks,
        recentWorkouts,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getMilestones = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('strengthPoints cardioPoints streaks workoutHistory');
    
    const milestones = calculateMilestones(user);
    
    res.status(200).json({
      success: true,
      data: milestones
    });
    
  } catch (error) {
    console.error('Error fetching milestones:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to load progress roadmap'
    });
  }
};
