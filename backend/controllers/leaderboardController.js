// controllers/leaderboardController.js
const User = require('../models/User');

exports.getLeaderboard = async (req, res) => {
  try {
    // Fetch all users including the rank fields (adjust the field names to match your User model)
    const users = await User.find(
      {},
      'name cardioPoints strengthPoints streaks cardioRank strengthRank'
    );

    const usersWithTotalPoints = users.map(user => {
      const cardio = user.cardioPoints || 0;
      const strength = user.strengthPoints || 0;
      return {
        ...user.toObject(),
        totalPoints: cardio + strength
      };
    });

    // Sort users by total points (if equal, optionally sort by streaks)
    const sortedUsers = usersWithTotalPoints.sort((a, b) => {
      if (b.totalPoints === a.totalPoints) {
        return (b.streaks || 0) - (a.streaks || 0);
      }
      return b.totalPoints - a.totalPoints;
    });

    // Assign rank based on sorted order
    const rankedUsers = sortedUsers.map((user, index) => ({
      ...user,
      rank: index + 1
    }));

    res.status(200).json({ success: true, leaderboard: rankedUsers });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
