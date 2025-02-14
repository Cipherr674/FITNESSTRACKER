// Freeze streak: To manually freeze the streak
const User = require('../models/User');


exports.getStreak = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    let effectiveStreak = user.streaks;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (!user.lastWorkoutDate) {
      effectiveStreak = 0;
    } else {
      // Normalize lastWorkoutDate
      let lastWorkout = new Date(user.lastWorkoutDate);
      lastWorkout.setHours(0, 0, 0, 0);

      // If lastWorkout is today, return the stored streak.
      if (lastWorkout.getTime() === today.getTime()) {
        effectiveStreak = user.streaks;
      } else {
        // Check if today is a rest day. On rest days, preserve the streak.
        const todayDay = today.toLocaleString('en-us', { weekday: 'long' });
        if (user.restDays && user.restDays.includes(todayDay)) {
          effectiveStreak = user.streaks;
        } else {
          // Calculate expected workout day starting from lastWorkout (skipping rest days)
          let expectedWorkoutDay = new Date(lastWorkout);
          do {
            expectedWorkoutDay.setDate(expectedWorkoutDay.getDate() + 1);
          } while (
            user.restDays &&
            user.restDays.includes(expectedWorkoutDay.toLocaleString('en-us', { weekday: 'long' }))
          );

          if (today.getTime() !== expectedWorkoutDay.getTime()) {
            effectiveStreak = 0;
          }
        }
      }
    }

    res.status(200).json({ streak: effectiveStreak });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}



exports.freezeStreak = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    // If streak is already frozen, notify the user
    if (user.streakFrozen) {
      return res.status(400).json({ error: "Your streak is already frozen." });
    }

    user.streakFrozen = true;  // Mark streak as frozen
    user.frozenDate = new Date();  // Store freeze date
    await user.save();

    res.status(200).json({ success: true, message: "Streak has been frozen." });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Unfreeze streak: This would be used for manual unfreeze, and also if the user manually resumes a streak after a break
exports.unfreezeStreak = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    // If streak is not frozen, notify the user
    if (!user.streakFrozen) {
      return res.status(400).json({ error: "Streak is not frozen." });
    }

    const today = new Date().toISOString().split("T")[0];
    const lastWorkoutDate = user.lastWorkoutDate ? user.lastWorkoutDate.toISOString().split("T")[0] : null;

    // If today is the same day as last workout, allow unfreeze
    if (today === lastWorkoutDate) {
      user.streakFrozen = false; // Unfreeze the streak
      user.frozenDate = null; // Clear the frozen date
      user.streaks += 1;  // Continue the streak
      await user.save();
      res.status(200).json({ success: true, message: "Streak has been unfrozen and updated." });
    } else {
      res.status(400).json({ error: "You can only unfreeze your streak for the same day." });
    }
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
