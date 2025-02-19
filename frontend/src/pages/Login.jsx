import React, { useState, useEffect } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../styles/login.css"; // Your custom CSS for login
import { FiMail, FiLock, FiArrowRight } from "react-icons/fi";
import workoutImage from "../assets/workout-bg.jpg"; // You'll need to add this image
import axios from "axios";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [validationError, setValidationError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user, login } = useAuth();

  // Redirect based on user's role once logged in
  useEffect(() => {
    // Only redirect if we are at /login and not coming from a link to /register.
    if (user && window.location.pathname === '/login') {
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    }
  }, [user, navigate]);
  
  const validateForm = () => {
    const { email, password } = formData;
    if (!email || !password) {
      setValidationError("All fields are required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setValidationError("Invalid email format");
      return false;
    }
    setValidationError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/login`,
        { email: formData.email, password: formData.password }
      );
      // Use the login function from AuthContext directly
      await login(formData.email, formData.password);
      // Navigation is handled inside the login function
    } catch (err) {
      setValidationError(err.message || "Failed to login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <button 
        onClick={() => navigate('/')}
        className="top-right-button"
      >
        ← Back to Home
      </button>
      <div className="login-image-section">
        <div className="overlay"></div>
        <div className="image-content">
          <h1>Welcome Back</h1>
          <p>Track your fitness journey with us</p>
        </div>
      </div>
      
      <div className="login-form-section">
        <div className="login-form-container">
          <h2>Sign In</h2>
          <p className="login-subtitle">Continue your fitness journey</p>
          
          {validationError && <div className="error-message">{validationError}</div>}
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <div className="input-icon-wrapper">
                
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Email"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div className="input-icon-wrapper">
                
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Password"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="login-button" 
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
              <FiArrowRight className="button-icon" />
            </button>
          </form>

          <div className="login-footer">
            <p>Don't have an account?</p>
            <Link to="/register" className="register-link">
              Create Account <FiArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
