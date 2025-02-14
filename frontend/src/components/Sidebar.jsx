import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, NavLink } from 'react-router-dom';
import { FiBarChart2 } from 'react-icons/fi';
import '../styles/sidebar.css';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  // Toggle the sidebar open/close state
  const toggleSidebar = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <div className="sidebar-container">
      <motion.div
        className="sidebar"
        animate={{ width: isOpen ? 250 : 60 }} // Expanded width: 250px, collapsed: 60px
        transition={{ duration: 0.3, type: 'tween' }}
      >
        <div className="sidebar-header">
          <button className="toggle-btn" onClick={toggleSidebar}>
            {isOpen ? "<" : ">"}
          </button>
        </div>
        <motion.div
          className="sidebar-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: isOpen ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ul>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/workouts">Workouts</Link>
            </li>
            <li>
              <Link to="/leaderboard">Leaderboard</Link>
            </li>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
            <li>
              <NavLink to="/statistics" className="nav-link">
                <FiBarChart2 className="nav-icon" />
                Statistics
              </NavLink>
            </li>
          </ul>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Sidebar;
