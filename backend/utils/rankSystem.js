const cardioRanks = ['Jogger', 'Racer', 'Sprinter', 'Marathoner', 'Apex Athlete'];
const strengthRanks = ['Iron', 'Bronze', 'Silver', 'Gold', 'Diamond'];

const rankThresholds = {
  Jogger: 100, Racer: 300, Sprinter: 600, Marathoner: 1000, 'Apex Athlete': 1500,
  Iron: 100, Bronze: 300, Silver: 600, Gold: 1000, Diamond: 1500
};

const getNewRank = (points, rankList) => {
  for (let i = rankList.length - 1; i >= 0; i--) {
    if (points >= rankThresholds[rankList[i]]) {
      return rankList[i];
    }
  }
  return rankList[0]; // Default lowest rank
};

module.exports = { cardioRanks, strengthRanks, getNewRank };
