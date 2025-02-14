import React, { useState } from 'react';
import { Menu } from 'antd';
import { HomeOutlined, InfoCircleOutlined, LogoutOutlined, TrophyFilled, UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/navbar.css';
import { BarChartOutlined } from '@ant-design/icons';


const Navbar = () => {
  const { logout } = useAuth();
  const [current, setCurrent] = useState('home');

  const onClick = (e) => {
    setCurrent(e.key);
  };

  const items = [
    {
      label: <Link to="/dashboard">Dashboard</Link>,
      key: 'dashboard',
      icon: <HomeOutlined />,
    },
    {
      label: <Link to="/statistics">Statistics</Link>,
      key: 'statistics',
      icon: <BarChartOutlined />,
    },
    {
      label: <Link to="/leaderboard">Leaderboard</Link>,
      key: 'leaderboard',
      icon: <TrophyFilled />,
    },
    {
      label: <Link to="/profile">Profile</Link>,
      key: 'profile',
      icon: <UserOutlined />,
    },
    {
      label: <span onClick={logout}>Logout</span>,
      key: 'logout',
      icon: <LogoutOutlined />,
    }

  ];

  return (
    <Menu
      onClick={onClick}
      selectedKeys={[current]}
      mode="horizontal"
      theme="dark"
      style={{
        lineHeight: '64px',
        padding: '0 2rem',
        display: 'flex',
        justifyContent: 'flex-end', // Aligns items to the right
      }}
      items={items}
    />
  );
};

export default Navbar;
