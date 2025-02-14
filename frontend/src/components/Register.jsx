import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState(''); // We'll take the email as-is (trimmed) without lower-casing it.
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  // Optional: Check if the email is already in use before attempting registration.
  // Uncomment the following function and its call in handleSubmit if your backend supports it.
  /*
  const checkEmailExists = async (email) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/auth/check-email?email=${email}`);
      return res.data.exists;
    } catch (err) {
      console.error("Error checking email:", err);
      return false;
    }
  };
  */

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Trim inputs to remove unintended spaces.
    const trimmedName = name.trim();
    const trimmedEmail = email.trim(); // Do not force lower-case.
    
    // Basic validation.
    if (!trimmedName || !trimmedEmail || !password || !confirmPassword) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // Optionally, check if the email exists before registration.
    // const emailInUse = await checkEmailExists(trimmedEmail);
    // if (emailInUse) {
    //   setError("Email already in use. Please try a different email.");
    //   return;
    // }

    // Prepare the registration payload.
    const payload = {
      name: trimmedName,
      email: trimmedEmail,
      password,
    };

    console.log('Attempting registration with payload:', payload);

    try {
      // Registration API call.
      const res = await axios.post(
        'http://localhost:5000/api/auth/register',
        payload,
        { headers: { 'Content-Type': 'application/json' } }
      );

      console.log('Registration successful:', res.data);

      // Automatically log in the user after registration.
      await login(trimmedEmail, password);
      // The login function should navigate you to the dashboard.
    } catch (err) {
      console.error('Registration error details:', err.response?.data);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="registration-container">
      <h2>Register</h2>
      {error && (
        <div className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
            required
          />
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter a secure password"
            required
          />
        </div>

        <div className="form-group">
          <label>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            required
          />
        </div>

        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register; 