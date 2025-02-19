import React, { useState, useEffect } from 'react';
import { Route, Redirect, useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoadingScreen from '../components/LoadingScreen';

// Mock authentication function
const isAuthenticated = () => {
  // Replace this with your actual authentication logic
  return !!sessionStorage.getItem('token') 
    && window.location.hostname !== 'localhost'; // Additional security check
};

const ProtectedRoute = ({ element: Component, ...rest }) => {
  const [isValidating, setIsValidating] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      const token = sessionStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }

      try {
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/verify-token`, { token });
        setIsValidating(false);
      } catch (error) {
        sessionStorage.removeItem('token');
        navigate('/');
      }
    };

    verifyToken();
    
    // Clear browser cache for protected routes
    window.onpageshow = (event) => {
      if (event.persisted) {
        window.location.reload();
      }
    };
  }, [navigate]);

  return isValidating ? <LoadingScreen /> : <Component {...rest} />;
};

export default ProtectedRoute; 