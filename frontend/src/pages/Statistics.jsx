import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import '../styles/statistics.css';
import { Link } from 'react-router-dom';
import Aurora from '../components/Aurora';

const Statistics = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/analytics', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAnalytics(response.data);
      } catch (err) {
        setError('Failed to load statistics');
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchStatistics();
  }, [user]);

  const calculateRankProgress = (currentPoints, currentRank, ranks, thresholds) => {
    const currentIndex = ranks.indexOf(currentRank);
    const nextRank = currentIndex < ranks.length - 1 ? ranks[currentIndex + 1] : null;
    const currentThreshold = thresholds[currentRank];
    const nextThreshold = nextRank ? thresholds[nextRank] : currentThreshold;
    
    const progress = currentPoints - currentThreshold;
    const needed = nextThreshold - currentThreshold;
    const percent = nextRank ? Math.min((progress / needed) * 100, 100) : 100;

    return { currentThreshold, nextThreshold, progress, needed, percent, nextRank };
  };

  if (loading) return <div className="statistics-loading">Loading analytics...</div>;
  if (error) return <div className="statistics-error">{error}</div>;
  if (!analytics) return <div className="statistics-loading">Loading analytics...</div>;

  const strengthRanks = ['Iron', 'Bronze', 'Silver', 'Gold', 'Diamond'];
  const strengthProgress = calculateRankProgress(
    analytics.totalStrengthPoints,
    analytics.strengthRank,
    strengthRanks,
    analytics.strengthRankThresholds
  );

  const cardioRanks = ['Jogger', 'Racer', 'Sprinter', 'Marathoner', 'Apex Athlete'];
  const cardioProgress = calculateRankProgress(
    analytics.totalCardioPoints,
    analytics.cardioRank,
    cardioRanks,
    analytics.cardioRankThresholds
  );

  return (
    <div className="statistics-wrapper">
      <Aurora amplitude={1.8} colorStops={["#2a0a45", "#4b1e6e", "#6d3b9e"]} />
      <div className="statistics-container">
        <div className="stats-card">
          <div className="stats-header">
            <h1>Workout Analytics</h1>
          </div>
          <div className="stats-grid">
            <div className="rank-container">
              <div className="stat-card">
                <h3>Strength Rank</h3>
                <p className="rank-name">{analytics.strengthRank}</p>
                <div className="progress-container">
                  <div 
                    className="progress-bar-fill" 
                    style={{ width: `${strengthProgress.percent}%` }}
                  ></div>
                </div>
                <div className="progress-numbers">
                  {strengthProgress.nextRank ? (
                    <>{analytics.totalStrengthPoints - strengthProgress.currentThreshold} / {strengthProgress.needed} to {strengthProgress.nextRank}</>
                  ) : (
                    <span>Max Rank Achieved</span>
                  )}
                </div>
              </div>

              <div className="stat-card">
                <h3>Cardio Rank</h3>
                <p className="rank-name">{analytics.cardioRank}</p>
                <div className="progress-container">
                  <div 
                    className="progress-bar-fill" 
                    style={{ width: `${cardioProgress.percent}%` }}
                  ></div>
                </div>
                <div className="progress-numbers">
                  {cardioProgress.nextRank ? (
                    <>{analytics.totalCardioPoints - cardioProgress.currentThreshold} / {cardioProgress.needed} to {cardioProgress.nextRank}</>
                  ) : (
                    <span>Max Rank Achieved</span>
                  )}
                </div>
              </div>
            </div>

            <div className="stat-card">
              <h3>Total Workouts</h3>
              <p>{analytics.totalWorkouts}</p>
            </div>

            <div className="stat-card">
              <h3>Strength Points</h3>
              <p>{analytics.totalStrengthPoints}</p>
            </div>

            <div className="stat-card">
              <h3>Cardio Points</h3>
              <p>{analytics.totalCardioPoints}</p>
            </div>

            <div className="stat-card">
              <h3>Current Streak</h3>
              <p>{analytics.currentStreak} days</p>
            </div>

            <div className="stat-card wide">
              <h3>Workout Distribution</h3>
              <div className="workout-types">
                {(analytics.workoutDistribution || []).map((type, index) => (
                  <div key={index} className="type-item">
                    <span className="type-name">
                      {type._id 
                        ? type._id.charAt(0).toUpperCase() + type._id.slice(1).toLowerCase()
                        : 'Unknown'}
                    </span>
                    <span className="type-count">{type.count} workouts</span>
                  </div>
                ))}
              </div>
              {analytics.workoutDistribution?.length === 0 && (
                <div className="empty-state">No workout type data available</div>
              )}
              <div className="see-all-link">
                <Link to="/workout-log">See all Workouts →</Link>
              </div>
            </div>

            <div className="stat-card wide">
              <h3>Monthly Activity</h3>
              <div className="monthly-activity">
                {(analytics.monthlyActivity || []).map((monthData, index) => (
                  <div key={index} className="month-item">
                    <span className="month-name">{monthData.month}</span>
                    <span className="month-count">{monthData.count} workouts</span>
                  </div>
                ))}
              </div>
              {analytics.monthlyActivity?.length === 0 && (
                <div className="empty-state">No monthly activity data available</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics; 