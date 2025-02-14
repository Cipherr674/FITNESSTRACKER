const Workout = require('../models/Workouts');
const User = require('../models/User');
const mongoose = require('mongoose');

exports.getFullAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;

    const [workouts, user] = await Promise.all([
      Workout.find({ user_id: userId }),
      User.findById(userId).select('streaks cardioRank strengthRank')
    ]);

    // Workout type distribution
    const workoutDistribution = await Workout.aggregate([
      { 
        $match: { 
          user_id: new mongoose.Types.ObjectId(userId) 
        } 
      },
      { $group: { _id: "$type", count: { $sum: 1 } } }
    ]);

    // Monthly activity
    const monthlyActivity = await Workout.aggregate([
      { 
        $match: { 
          user_id: new mongoose.Types.ObjectId(userId) 
        } 
      },
      { $group: {
          _id: { 
            $dateToString: { 
              format: "%b %Y",  // Shows "Feb 2024" format
              date: "$date" 
            } 
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } },
      { $project: { 
          month: "$_id", 
          count: 1, 
          _id: 0 
        }
      }
    ]);

    res.status(200).json({
      totalWorkouts: workouts.length,
      totalStrengthPoints: workouts.filter(w => w.type === 'strength').reduce((sum, w) => sum + w.points, 0),
      totalCardioPoints: workouts.filter(w => w.type === 'cardio').reduce((sum, w) => sum + w.points, 0),
      currentStreak: user.streaks,
      workoutDistribution,
      monthlyActivity,
      strengthRank: user.strengthRank,
      cardioRank: user.cardioRank,
      strengthRankThresholds: { Iron: 0, Bronze: 300, Silver: 600, Gold: 1000, Diamond: 1500 },
      cardioRankThresholds: { Jogger: 0, Racer: 300, Sprinter: 600, Marathoner: 1000, 'Apex Athlete': 1500 }
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}; 