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

exports.calculateMilestones = (user) => {
  return MILESTONES.map(milestone => {
    const currentValue = {
      strength: user.strengthPoints,
      cardio: user.cardioPoints,
      streak: user.streaks
    }[milestone.type];

    return {
      ...milestone,
      achieved: currentValue >= milestone.threshold,
      progress: Math.min((currentValue / milestone.threshold) * 100, 100),
      currentValue
    };
  });
}; 