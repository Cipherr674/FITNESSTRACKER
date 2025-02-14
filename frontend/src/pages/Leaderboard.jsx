// src/components/Leaderboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/leaderboard.css';
import Aurora from '../components/Aurora';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Leaderboard.jsx
  const fetchLeaderboard = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/leaderboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Use correct response structure
      const rawData = response.data.leaderboard || [];
      
      // Transform data for display
      const processedData = rawData.map(entry => ({
        id: entry._id,
        rank: entry.rank,
        name: entry.name ,
        cardioPoints: entry.cardioPoints,
        strengthPoints: entry.strengthPoints,
        totalPoints: entry.cardioPoints + entry.strengthPoints,
        cardioRank: entry.cardioRank,
        strengthRank: entry.strengthRank,
        streaks: entry.streaks
      }));
  
      setLeaderboard(processedData);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching leaderboard data", err);
      setError("Error fetching leaderboard data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  return (
    <div className="leaderboard-wrapper">
      <Aurora amplitude={1.8} colorStops={["#2a0a45", "#4b1e6e", "#6d3b9e"]} />
      <div className="leaderboard-page">
        <h1>Leaderboard</h1>
        {loading ? (
          <div className="loading-indicator">Loading rankings...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>User</th>
                <th>Total</th>
                <th>Cardio</th>
                <th>Strength</th>
                <th>Cardio Level</th>
                <th>Strength Level</th>
                <th>Streak</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry) => (
                <tr key={entry.id} className={`rank-${entry.rank}`}>
                  <td className="rank-cell">#{entry.rank}</td>
                  <td className="user-cell">
                    <span>{entry.name}</span>
                  </td>
                  <td className="points-cell">{entry.totalPoints}</td>
                  <td>{entry.cardioPoints}</td>
                  <td>{entry.strengthPoints}</td>
                  <td>
                    <span className="status-badge">{entry.cardioRank}</span>
                  </td>
                  <td>
                    <span className="status-badge">{entry.strengthRank}</span>
                  </td>
                  <td>
                    <div className="streak-cell">
                      <span className="streak-count">{entry.streaks}</span>
                      <span className="flame-icon">🔥</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
