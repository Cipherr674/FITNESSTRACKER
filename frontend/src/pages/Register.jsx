// src/components/Register.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/login.css";
import { FiArrowRight } from "react-icons/fi";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [validationErrors, setValidationErrors] = useState({
    hasMinLength: false,
    hasNumber: false,
    hasSpecialChar: false,
    hasUppercase: false,
    passwordsMatch: false
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validatePassword = (password, confirmPassword) => {
    const hasMinLength = password.length >= 8;
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const passwordsMatch = password === confirmPassword && password !== "";

    setValidationErrors({
      hasMinLength,
      hasNumber,
      hasSpecialChar,
      hasUppercase,
      passwordsMatch
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = {...prev, [name]: value};
      if (name === 'password' || name === 'confirmPassword') {
        validatePassword(newData.password, newData.confirmPassword);
      }
      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Frontend validation check
    if (formData.password.length < 8 || 
        !/[A-Z]/.test(formData.password) || 
        !/\d/.test(formData.password) || 
        !/[!@#$%^&*(),.?":{}|<>~]/.test(formData.password)) {
      setError("Please meet all password requirements");
      setIsLoading(false);
      return;
    }

    // Password match check
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    console.log('Submission initiated with:', formData);
    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      console.log('Registration success:', response.data);
      // Navigate to login page immediately
      navigate("/login");
      
    } catch (err) {
      console.error('Full error object:', err);
      console.log('Response data:', err.response?.data);
      console.log('Request config:', err.config);
      const backendErrors = err.response?.data?.errors;
      if (backendErrors) {
        const errorMessages = backendErrors.map(error => error.msg || error.message);
        setError(errorMessages.join(', '));
      } else {
        setError(err.response?.data?.error || "Registration failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-image-section">
        <div className="overlay"></div>
        <div className="image-content">
          <h1>Join Our Community</h1>
          <p>Start your fitness journey today</p>
        </div>
      </div>
      
      <div className="login-form-section">
        <div className="login-form-container">
          <h2>Create Account</h2>
          <p className="login-subtitle">Join us and achieve your fitness goals</p>
          
          {error && <div className="error-message">{error}</div>}
          
          {/* Password Requirements Hints */}
          {error && (
            <div className="password-hints">
              {!validationErrors.hasMinLength && (
                <div>At least 8 characters</div>
              )}
              {!validationErrors.hasUppercase && (
                <div>One uppercase letter</div>
              )}
              {!validationErrors.hasNumber && (
                <div>One number</div>
              )}
              {!validationErrors.hasSpecialChar && (
                <div>One special character</div>
              )}
              {!validationErrors.passwordsMatch && (
                <div>Passwords must match</div>
              )}
            </div>
          )}

        

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <div className="input-icon-wrapper">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div className="input-icon-wrapper">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div className="input-icon-wrapper">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div className="input-icon-wrapper">
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="login-button" 
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
              <FiArrowRight className="button-icon" />
            </button>
          </form>

          <div className="login-footer">
            <p>Already have an account?</p>
            <Link to="/login" className="register-link">
              Sign In <FiArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
