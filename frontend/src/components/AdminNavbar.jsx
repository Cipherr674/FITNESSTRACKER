import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/adminNavbar.css';

const AdminNavbar = ({ activeTab, setActiveTab }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <nav className="admin-navbar">
      <div className="admin-navbar-logo">
        <h1>Admin Panel</h1>
      </div>
      <ul className="admin-nav-links">
        <li
          className={activeTab === "users" ? "active" : ""}
          onClick={() => setActiveTab("users")}
        >
          Users
        </li>
        <li
          className={activeTab === "workouts" ? "active" : ""}
          onClick={() => setActiveTab("workouts")}
        >
          Workouts
        </li>
        <li
          className={activeTab === "analytics" ? "active" : ""}
          onClick={() => setActiveTab("analytics")}
        >
          Analytics
        </li>
        <li className="logout" onClick={handleLogout}>
          Logout
        </li>
      </ul>
    </nav>
  );
};

export default AdminNavbar; 