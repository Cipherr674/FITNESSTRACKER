const MILESTONES = [
  {
    type: 'strength',
    title: 'First Weight Session',
    threshold: 50,
    description: 'Complete your first weight training session'
  },
  {
    type: 'strength',
    title: '100kg Club',
    threshold: 5000,
    description: 'Lift 100kg cumulative weight'
  },
  {
    type: 'cardio',
    title: '5k Runner',
    threshold: 300,
    description: 'Complete a 5k run'
  },
  {
    type: 'streak',
    title: '7-Day Streak',
    threshold: 7,
    description: 'Maintain a workout streak for 7 days'
  }
];

const calculateMilestones = (user) => {
  return MILESTONES.map(milestone => {
    const currentValue = {
      strength: user.strengthPoints || 0,
      cardio: user.cardioPoints || 0,
      streak: user.streaks || 0
    }[milestone.type];
    
    const progress = Math.min(
      (currentValue / milestone.threshold) * 100, 
      100
    );
    
    return {
      ...milestone,
      achieved: currentValue >= milestone.threshold,
      progress: Number(progress.toFixed(2)),
      currentValue
    };
  });
};

exports.calculateMilestones = calculateMilestones; 