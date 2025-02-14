const User = require('../models/User');

const badgeCriteria = [
  // Workout Count Badges
  { 
    name: 'First Step', 
    description: 'Complete your first workout', 
    condition: (user) => user.workoutCount >= 1 
  },
  { 
    name: 'Getting Started', 
    description: 'Complete 5 workouts', 
    condition: (user) => user.workoutCount >= 5 
  },
  { 
    name: 'Dedicated', 
    description: 'Complete 10 workouts', 
    condition: (user) => user.workoutCount >= 10 
  },
  
  // Strength Badges
  { 
    name: 'Strength Beginner', 
    description: 'Earn 100 strength points', 
    condition: (user) => user.strengthPoints >= 100 
  },
  { 
    name: 'Strength Enthusiast', 
    description: 'Earn 500 strength points', 
    condition: (user) => user.strengthPoints >= 500 
  },
  { 
    name: 'Strength Master', 
    description: 'Earn 1000 strength points', 
    condition: (user) => user.strengthPoints >= 1000 
  },
  
  // Cardio Badges
  { 
    name: 'Cardio Starter', 
    description: 'Earn 100 cardio points', 
    condition: (user) => user.cardioPoints >= 100 
  },
  { 
    name: 'Cardio Warrior', 
    description: 'Earn 500 cardio points', 
    condition: (user) => user.cardioPoints >= 500 
  },
  { 
    name: 'Cardio Master', 
    description: 'Earn 1000 cardio points', 
    condition: (user) => user.cardioPoints >= 1000 
  },
  
  // Streak Badges
  { 
    name: 'Consistency', 
    description: 'Achieve a 3-day streak', 
    condition: (user) => user.streaks >= 3 
  },
  { 
    name: 'Dedication', 
    description: 'Achieve a 7-day streak', 
    condition: (user) => user.streaks >= 7 
  },
  { 
    name: 'Unstoppable', 
    description: 'Achieve a 14-day streak', 
    condition: (user) => user.streaks >= 14 
  }
];

exports.checkAndAwardBadges = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    // Get currently earned badges
    const earnedBadges = user.badges.map(badge => badge.name);
    
    // Check for new badges
    const newBadges = badgeCriteria
      .filter(badge => 
        badge.condition(user) && !earnedBadges.includes(badge.name)
      )
      .map(badge => ({
        name: badge.name,
        description: badge.description,
        earnedAt: new Date()
      }));

    // If new badges were earned, add them to user
    if (newBadges.length > 0) {
      user.badges.push(...newBadges);
      await user.save();
    }

    return newBadges;
  } catch (err) {
    console.error('Badge checking error:', err);
    throw new Error('Error checking badges');
  }
};
