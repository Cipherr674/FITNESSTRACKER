import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import '../styles/dashboard.css';
import flame from '../assets/flame.png';
import RecentActivityFeed from '../components/RecentActivityFeed';
import { FiPlus, FiList } from 'react-icons/fi';
import StreakSettings from '../components/StreakSettings';
import WorkoutLogPanel from '../components/WorkoutLogPanel';
import Aurora from '../components/Aurora';

const Dashboard = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState({
    recentWorkouts: [],
    weeklyProgress: [0, 0, 0, 0, 0, 0, 0],
    strengthRank: 'Iron',
    cardioRank: 'Jogger',
    totalStrengthPoints: 0,
    totalCardioPoints: 0,
    numberOfWorkouts: 0
  });
  const [isWorkoutModalOpen, setIsWorkoutModalOpen] = useState(false);
  const [dashboardStreak, setDashboardStreak] = useState(0);
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showStrengthRankInfo, setShowStrengthRankInfo] = useState(false);
  const [showCardioRankInfo, setShowCardioRankInfo] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const strengthRanks = [
    { rank: 'Iron', points: 0 },
    { rank: 'Bronze', points: 300 },
    { rank: 'Silver', points: 600 },
    { rank: 'Gold', points: 1000 },
    { rank: 'Diamond', points: 1500 }
  ];

  const cardioRanks = [
    { rank: 'Jogger', points: 0 },
    { rank: 'Racer', points: 300 },
    { rank: 'Sprinter', points: 600 },
    { rank: 'Marathoner', points: 1000 },
    { rank: 'Apex Athlete', points: 1500 }
  ];

  const fetchDashboardData = useCallback(async () => {
    try {
      const token = sessionStorage.getItem('token');
      if (!token) return;

      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnalytics({
        recentWorkouts: res.data.recentWorkouts || [],
        weeklyProgress: res.data.weeklyProgress || [],
        strengthRank: res.data.strengthRank || 'Iron',
        cardioRank: res.data.cardioRank || 'Jogger',
        totalStrengthPoints: res.data.totalStrengthPoints || 0,
        totalCardioPoints: res.data.totalCardioPoints || 0,
        numberOfWorkouts: res.data.numberOfWorkouts || 0
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDashboardStreak = useCallback(async () => {
    try {
      const token = sessionStorage.getItem('token');
      if (!token) return;
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/streak`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDashboardStreak(response.data.streak);
    } catch (error) {
      console.error("Error fetching dashboard streak:", error);
      setError('Failed to load streak data');
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    const abortController = new AbortController();
    
    const fetchData = async () => {
      try {
        await Promise.all([fetchDashboardData(), fetchDashboardStreak()]);
      } catch (error) {
        console.error("Data fetch error:", error);
      }
    };

    fetchData();
    return () => abortController.abort();
  }, [user, fetchDashboardData, fetchDashboardStreak]);

  const fetchMilestones = useCallback(async () => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/dashboard/milestones`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMilestones(response.data.milestones);
    } catch (error) {
      console.error("Error fetching milestones:", error);
      setError('Failed to load milestones');
    }
  }, []);
    
  useEffect(() => {
    if (user) fetchMilestones();
  }, [user, fetchMilestones]);

  const handleWorkoutLogged = useCallback(() => {
    setIsUpdating(true);
    fetchDashboardData();
    fetchDashboardStreak().finally(() => {
      setIsUpdating(false);
    });
  }, [fetchDashboardData, fetchDashboardStreak]);

  const calculateRankProgress = (currentPoints, currentRank, ranks, thresholds, maxRank) => {
    const currentThreshold = thresholds[currentRank];
    const currentIndex = ranks.indexOf(currentRank);
    const nextRank = currentIndex < ranks.length - 1 ? ranks[currentIndex + 1] : null;
    const nextThreshold = nextRank ? thresholds[nextRank] : currentThreshold;
    
    const progress = Math.max(0, currentPoints - currentThreshold);
    const range = nextThreshold - currentThreshold;
    const percent = currentRank === maxRank ? 100 : range > 0 ? (progress / range) * 100 : 0;

    return { percent, nextThreshold };
  };

  const strengthProgress = calculateRankProgress(
    analytics.totalStrengthPoints,
    analytics.strengthRank,
    ['Iron', 'Bronze', 'Silver', 'Gold', 'Diamond'],
    { Iron: 0, Bronze: 300, Silver: 600, Gold: 1000, Diamond: 1500 },
    'Diamond'
  );

  const cardioProgress = calculateRankProgress(
    analytics.totalCardioPoints,
    analytics.cardioRank,
    ['Jogger', 'Racer', 'Sprinter', 'Marathoner', 'Apex Athlete'],
    { Jogger: 0, Racer: 300, Sprinter: 600, Marathoner: 1000, 'Apex Athlete': 1500 },
    'Apex Athlete'
  );

  const ProgressRoadmap = ({ milestones }) => (
    <div className="progress-roadmap">
      <h3>Your Fitness Journey</h3>
      <div className="timeline">
        {milestones.map((milestone) => (
          <div key={milestone.id} className={`milestone ${milestone.achieved ? 'achieved' : ''}`}>
            <div className="icon">{milestone.achieved ? '🎯' : '⌛'}</div>
            <div className="details">
              <h4>{milestone.title}</h4>
              <p>{milestone.description}</p>
              {!milestone.achieved && (
                <div className="progress">
                  <div 
                    className="progress-bar" 
                    style={{ width: `${milestone.progress}%` }}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return <div className="dashboard-container">Loading...</div>;
  }

  if (error) {
    return <div className="dashboard-container error">{error}</div>;
  }

  return (
    <div className="dashboard-wrapper">
      <Aurora amplitude={0.5} colorStops={["#2a0a45", "#4b1e6e", "#6d3b9e"]} />
      <div className="dashboard-container body1">
        <h1 className="dashboard-heading">Welcome, {user.name}!</h1>
        
        <div className="dashboard-stats">
          <div className="stat">
            <h2>Total Workouts</h2>
            <p>{analytics.numberOfWorkouts}</p>
          </div>

          <div className="stat" onClick={() => setShowStrengthRankInfo(true)} style={{ cursor: 'pointer' }}>
            <h2>Strength Rank</h2>
            <div className="rank-display">
              <p className="rank-name strength-rank">{analytics.strengthRank}</p>
              <div className={`progress-container ${isUpdating ? 'updating' : ''}`}>
                <div
                  className="progress-bar-fill strength-progress"
                  style={{ width: `${strengthProgress.percent}%` }}
                />
                <div className="progress-numbers">
                  {analytics.strengthRank !== "Diamond" ? (
                    <>
                      <span>{analytics.totalStrengthPoints}</span>
                      <span className="divider">/</span>
                      <span>{strengthProgress.nextThreshold}</span>
                      <span className="to-go">
                        ({strengthProgress.nextThreshold - analytics.totalStrengthPoints} to go)
                      </span>
                    </>
                  ) : (
                    <span>Max Rank Achieved</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="stat" onClick={() => setShowCardioRankInfo(true)} style={{ cursor: 'pointer' }}>
            <h2>Cardio Rank</h2>
            <div className="rank-display">
              <p className="rank-name" style={{ color: '#8b5cf6' }}>{analytics.cardioRank}</p>
              <div className={`progress-container ${isUpdating ? 'updating' : ''}`}>
                <div
                  className="progress-bar-fill"
                  style={{ width: `${cardioProgress.percent}%` }}
                />
                <div className="progress-numbers">
                  {analytics.cardioRank !== "Apex Athlete" ? (
                    <>{analytics.totalCardioPoints} / {cardioProgress.nextThreshold}</>
                  ) : (
                    <span>Max Rank</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="stat">
            <h2>Streak</h2>
            <div className="streak-icon">
              <p>{dashboardStreak}</p>
              <img src={flame} alt="Fire Icon" className="fire-icon" />
            </div>
            
          </div>
        </div>

        <div className="dashboard-content">
          <div className="dashboard-grid">
            <RecentActivityFeed 
              recentWorkouts={analytics.recentWorkouts || []} 
            />
            <ProgressRoadmap milestones={milestones} />
          </div>
        </div>
        
        <div className="dashboard-buttons">
          <div className="button-group">
            <button 
              onClick={() => setIsWorkoutModalOpen(true)} 
              className="btn primary-btn"
            >
              <FiPlus className="btn-icon" /> Log Workout
            </button>
            <Link to="/workout-log" className="btn secondary-btn">
              <FiList className="btn-icon" /> Workout History
            </Link>
          </div>
        </div>

        {isWorkoutModalOpen && (
          <WorkoutLogPanel
            onClose={() => setIsWorkoutModalOpen(false)}
            onWorkoutLogged={handleWorkoutLogged}
          />
        )}

        <div className="dashboard-settings">
          <StreakSettings />
        </div>

        {showStrengthRankInfo && (
          <div className="rank-info-modal">
            <div className="rank-info-content">
              <div className="rank-info-header">
                <h3>Strength Ranking System</h3>
                <button 
                  className="close-btn"
                  onClick={() => setShowStrengthRankInfo(false)}
                >
                  &times;
                </button>
              </div>
              <div className="rank-info-body">
                {strengthRanks.map((rank, index) => (
                  <div key={rank.rank} className="rank-tier">
                    <div className="rank-tier-header">
                      <span className="rank-name">{rank.rank}</span>
                      <span className="rank-points">{rank.points}+ points</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {showCardioRankInfo && (
          <div className="rank-info-modal">
            <div className="rank-info-content">
              <div className="rank-info-header">
                <h3>Cardio Ranking System</h3>
                <button 
                  className="close-btn"
                  onClick={() => setShowCardioRankInfo(false)}
                >
                  &times;
                </button>
              </div>
              <div className="rank-info-body">
                {cardioRanks.map((rank, index) => (
                  <div key={rank.rank} className="rank-tier">
                    <div className="rank-tier-header">
                      <span className="rank-name">{rank.rank}</span>
                      <span className="rank-points">{rank.points}+ points</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
