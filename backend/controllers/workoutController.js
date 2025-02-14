const Workout = require('../models/Workouts');
const User = require('../models/User');
const { cardioRanks, strengthRanks, getNewRank } = require('../utils/rankSystem');
const { checkAndAwardBadges } = require('../utils/badgeLogic'); // Import badge logic
const axios = require('axios');

// Helper function to calculate strength points
const calculateStrengthPoints = (exercises) => {
  return exercises.reduce((total, exercise) => {
    return total + exercise.sets.reduce((setTotal, set) => {
      return setTotal + (set.reps * set.weight * 0.5);
    }, 0);
  }, 0);
};

// Helper function to calculate cardio points
const calculateCardioPoints = (duration, intensity) => {
  const intensityMultipliers = {
    'light': 1,
    'moderate': 1.5,
    'vigorous': 2,
    'high': 2.5
  };
  return Math.round(duration * intensityMultipliers[intensity]);
};

exports.logWorkout = async (req, res) => {
  try {
    const { type, name } = req.body;
    let duration, sets;
    let points = 0;

    // Validate input data
    if (type === 'cardio') {
      duration = req.body.duration;
      if (!duration || duration <= 0) {
        return res.status(400).json({ error: "Check the duration again please" });
      }
    } else if (type === 'strength') {
      if (req.body.exercises && Array.isArray(req.body.exercises) && req.body.exercises.length > 0) {
         const exercises = req.body.exercises;
         for (let ex of exercises) {
            if (!ex.exerciseName || !ex.sets || Number(ex.sets) <= 0 || !ex.reps || Number(ex.reps) <= 0 || !ex.weight || Number(ex.weight) <= 0) {
              return res.status(400).json({ error: "Each exercise must have a name, sets, reps and weight greater than 0." });
            }
         }
         // Calculate points based on exercises
         points = exercises.reduce((sum, ex) => sum + (Number(ex.sets) * Number(ex.reps) * Number(ex.weight) * 0.5), 0);
      } else if (req.body.sets && Array.isArray(req.body.sets) && req.body.sets.length > 0) {
         sets = req.body.sets;
         for (let set of sets) {
          if (!set.reps || Number(set.reps) <= 0 || !set.weight || Number(set.weight) <= 0) {
            return res.status(400).json({ error: "Each strength set must have reps and weight greater than 0."});
          }
         }
         points = sets.reduce((sum, set) => sum + (Number(set.reps) * Number(set.weight) * 0.5), 0);
      } else {
         return res.status(400).json({ error: "Strength workout must include at least one exercise or set."});
      }
    }

    // Fetch user details
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayDay = today.toLocaleString('en-us', { weekday: 'long' });
    const isRestDay = (user.restDays && Array.isArray(user.restDays) && user.restDays.includes(todayDay));

    // Check if streak is frozen
    if (user.streakFrozen) {
      return res.status(400).json({ error: "Your streak is frozen, please unfreeze before logging a workout." });
    }

    // Prepare workout data (now supporting custom date and notes)
    const workoutData = {
      user_id: req.user.id,
      type,
      name,
      points,
      date: req.body.date || Date.now(),
      notes: req.body.notes || ''
    };
    if (type === 'cardio') {
      workoutData.duration = duration;
    } else if (type === 'strength'){
       if (req.body.exercises && Array.isArray(req.body.exercises) && req.body.exercises.length > 0) {
         workoutData.exercises = req.body.exercises;
       } else {
         workoutData.sets = sets;
       }
    }

    const workout = await Workout.create(workoutData);

    let rankUpdated = false;

    // Only update the streak if today is not a rest day.
    if (!isRestDay) {
      if (user.lastWorkoutDate) {
        // Normalize lastWorkoutDate to midnight
        let lastWorkout = new Date(user.lastWorkoutDate);
        lastWorkout.setHours(0, 0, 0, 0);

        // Determine expected workout day: start with the day after the last workout,
        // skipping any days marked as rest.
        let expectedWorkoutDay = new Date(lastWorkout);
        do {
          expectedWorkoutDay.setDate(expectedWorkoutDay.getDate() + 1);
        } while (user.restDays &&
          user.restDays.includes(expectedWorkoutDay.toLocaleString('en-us', { weekday: 'long' }))
        );

        // If today (normalized) matches the expected workout day, increment streak;
        // otherwise, reset the streak to 1.
        if (today.getTime() === expectedWorkoutDay.getTime()) {
          user.streaks = (user.streaks || 0) + 1;
        } else {
          user.streaks = 1;
        }
      } else {
        user.streaks = 1;
      }
    }

    // Update Points and Rank
    if (type === 'cardio') {
      user.cardioPoints += points;
      const newCardioRank = getNewRank(user.cardioPoints, cardioRanks);
      if (newCardioRank !== user.cardioRank) {
        user.cardioRank = newCardioRank;
        rankUpdated = true;
      }
    } else if (type === 'strength') {
      user.strengthPoints += points;  
      const newStrengthRank = getNewRank(user.strengthPoints, strengthRanks);
      if (newStrengthRank !== user.strengthRank) {
        user.strengthRank = newStrengthRank;
        rankUpdated = true;
      }
    }

    // Always update lastWorkoutDate regardless of rest day status
    user.lastWorkoutDate = today;

    // Save user details
    await user.save();

    // Badge Checking Logic
    const newBadges = await checkAndAwardBadges(user.id); // Check and award badges

    res.status(200).json({
      success: true,
      message: "Workout logged successfully",
      data: workout,
      newBadges, // Include new badges in response
    });

  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Get all workouts for a user
exports.getWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({ user_id: req.user.id })
      .sort({ date: -1 })
      .lean();

    res.status(200).json({
      success: true,
      workouts
    });
  } catch (error) {
    console.error('Error in getWorkouts:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching workouts'
    });
  }
};

// To delete all workouts
exports.deleteAllWorkouts = async (req, res) => {
  try {
    await Workout.deleteMany({ user_id: req.user.id });
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Log a strength workout
exports.logStrengthWorkout = async (req, res) => {
  try {
    const { muscleGroup, exercises } = req.body;
    const points = calculateStrengthPoints(exercises);

    const workout = new Workout({
      user_id: req.user.id,
      type: 'strength',
      muscleGroup,
      exercises,
      points,
      date: new Date()
    });

    await workout.save();

    // Update user's strength points and check for rank update
    const user = await User.findById(req.user.id);
    user.strengthPoints += points;
    user.totalStrengthPoints += points;
    
    // Update strength rank based on total points
    const strengthRanks = ['Iron', 'Bronze', 'Silver', 'Gold', 'Diamond'];
    const strengthThresholds = [0, 300, 600, 1000, 1500];
    
    for (let i = strengthRanks.length - 1; i >= 0; i--) {
      if (user.totalStrengthPoints >= strengthThresholds[i]) {
        user.strengthRank = strengthRanks[i];
        break;
      }
    }

    // Update streak
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (user.lastWorkoutDate) {
      const lastWorkout = new Date(user.lastWorkoutDate);
      lastWorkout.setHours(0, 0, 0, 0);
      
      const timeDiff = today.getTime() - lastWorkout.getTime();
      const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
      
      if (daysDiff === 1) {
        user.streaks += 1;
      } else if (daysDiff > 1) {
        user.streaks = 1;
      }
    } else {
      user.streaks = 1;
    }
    
    user.lastWorkoutDate = today;
    user.workoutCount += 1;

    await user.save();

    res.status(200).json({
      success: true,
      workout,
      newStrengthRank: user.strengthRank,
      streak: user.streaks
    });

  } catch (error) {
    console.error('Error in logStrengthWorkout:', error);
    res.status(500).json({
      success: false,
      error: 'Error logging strength workout'
    });
  }
};

// Log a cardio workout
exports.logCardioWorkout = async (req, res) => {
  try {
    const { name, duration, distance, intensity } = req.body;
    const points = calculateCardioPoints(duration, intensity);

    const workout = new Workout({
      user_id: req.user.id,
      type: 'cardio',
      name,
      duration,
      distance,
      intensity,
      points,
      date: new Date()
    });

    await workout.save();

    // Update user's cardio points and check for rank update
    const user = await User.findById(req.user.id);
    user.cardioPoints += points;
    user.totalCardioPoints += points;
    
    // Update cardio rank based on total points
    const cardioRanks = ['Jogger', 'Racer', 'Sprinter', 'Marathoner', 'Apex Athlete'];
    const cardioThresholds = [0, 300, 600, 1000, 1500];
    
    for (let i = cardioRanks.length - 1; i >= 0; i--) {
      if (user.totalCardioPoints >= cardioThresholds[i]) {
        user.cardioRank = cardioRanks[i];
        break;
      }
    }

    // Update streak (same logic as strength workout)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (user.lastWorkoutDate) {
      const lastWorkout = new Date(user.lastWorkoutDate);
      lastWorkout.setHours(0, 0, 0, 0);
      
      const timeDiff = today.getTime() - lastWorkout.getTime();
      const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
      
      if (daysDiff === 1) {
        user.streaks += 1;
      } else if (daysDiff > 1) {
        user.streaks = 1;
      }
    } else {
      user.streaks = 1;
    }
    
    user.lastWorkoutDate = today;
    user.workoutCount += 1;

    await user.save();

    res.status(200).json({
      success: true,
      workout,
      newCardioRank: user.cardioRank,
      streak: user.streaks
    });

  } catch (error) {
    console.error('Error in logCardioWorkout:', error);
    res.status(500).json({
      success: false,
      error: 'Error logging cardio workout'
    });
  }
};

// Get predefined exercises
exports.getPredefinedWorkouts = async (req, res) => {
  try {
    const { muscle } = req.query;
    if (!muscle) {
      return res.status(400).json({ 
        success: false, 
        error: 'Muscle parameter is required' 
      });
    }

    const options = {
      method: 'GET',
      url: `https://api.api-ninjas.com/v1/exercises?muscle=${muscle}`,
      headers: {
        'X-Api-Key': process.env.API_NINJAS_KEY
      }
    };

    const response = await axios.get(options.url, { headers: options.headers });
    
    // Transform the data to match our needs
    const exercises = response.data.map(exercise => ({
      name: exercise.name,
      muscle: exercise.muscle,
      equipment: exercise.equipment,
      instructions: exercise.instructions
    }));

    res.status(200).json({ 
      success: true, 
      workouts: exercises 
    });

  } catch (error) {
    console.error('Error fetching exercises:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch exercises' 
    });
  }
};

exports.deleteWorkout = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);

    // Check if workout exists
    if (!workout) {
      return res.status(404).json({
        success: false,
        error: 'Workout not found'
      });
    }

    // Make sure user owns workout
    if (workout.user_id.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'User not authorized to delete this workout'
      });
    }

    await workout.remove();

    res.status(200).json({
      success: true,
      message: 'Workout deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};