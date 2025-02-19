// backend/controllers/dashboardController.js
const Workout = require('../models/Workouts');
const User = require('../models/User');
const { calculateMilestones } = require('../utils/milestoneLogic');

exports.getDashboardAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get current date and 7 days ago
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [allWorkouts, user] = await Promise.all([
      Workout.find({ 
        user_id: userId,
        date: { $gte: sevenDaysAgo } // Only get workouts from last 7 days
      }).sort({ date: -1 }),
      User.findById(userId).select('cardioRank strengthRank streaks')
    ]);

    // Calculate weekly progress
    const weeklyProgress = Array(7).fill(0).map((_, index) => {
      const day = new Date(sevenDaysAgo);
      day.setDate(day.getDate() + index);
      return allWorkouts.filter(w => 
        w.date.toISOString().split('T')[0] === day.toISOString().split('T')[0]
      ).length;
    });

    res.status(200).json({
      success: true,
      analytics: {
        numberOfWorkouts: allWorkouts.length,
        totalCardioPoints: allWorkouts.filter(w => w.type === 'cardio').reduce((sum, w) => sum + w.points, 0),
        totalStrengthPoints: allWorkouts.filter(w => w.type === 'strength').reduce((sum, w) => sum + w.points, 0),
        cardioRank: user.cardioRank,
        strengthRank: user.strengthRank,
        streak: user.streaks,
        recentWorkouts: allWorkouts.slice(0, 5), // Get first 5 sorted by date
        weeklyProgress
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getMilestones = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('strengthPoints cardioPoints streaks')
      .lean();

    const milestones = calculateMilestones({
      strengthPoints: user.strengthPoints || 0,
      cardioPoints: user.cardioPoints || 0,
      streaks: user.streaks || 0
    });
    
    res.status(200).json({
      success: true,
      data: milestones // Ensure this is an array
    });
  } catch (error) {
    console.error('Error fetching milestones:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to load progress roadmap'
    });
  }
};
