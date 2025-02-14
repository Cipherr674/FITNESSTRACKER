const mongoose = require('mongoose');

// models/Leaderboard.js
const leaderboardSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  totalPoints: { type: Number, default: 0 },
  cardioPoints: { type: Number, default: 0 },
  strengthPoints: { type: Number, default: 0 },
  cardioRank: { type: String, default: 'Jogger' },
  strengthRank: { type: String, default: 'Iron' },
  streaks: { type: Number, default: 0 }
});

// Ensure indexes for efficient querying
leaderboardSchema.index({ user_id: 1 });

module.exports = mongoose.model('Leaderboard', leaderboardSchema);
