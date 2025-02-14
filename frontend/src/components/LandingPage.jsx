import React from 'react';
import Aurora from './Aurora';
import '../styles/Landing.css';
import SpotlightCard from './SpotlightCard';

const LandingPage = () => {
  return (
    <div className="landing-container">
      <Aurora />
      
      <nav className="navbar">
        <div className="nav-content">
          <h1 className="logo">getFit</h1>
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="/login" className="cta-button">Get Started</a>
          </div>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-content">
          <h1>Transform Your Fitness Journey</h1>
          <p>Track workouts, analyze progress, and achieve your goals with our intuitive fitness platform</p>
          <div className="cta-buttons">
            <a href="/register" className="cta-button primary">Start Free Trial</a>
            <a href="#features" className="cta-button secondary">Learn More</a>
          </div>
        </div>
      </section>

      <section className="features" id="features">
        <h2>Why Choose getFit?</h2>
        <div className="feature-grid">
          <SpotlightCard spotlightColor="rgba(147, 51, 234, 0.15)">
            <div className="feature-card">
              <div className="feature-icon">🏋️</div>
              <h3>Workout Tracking</h3>
              <p>Log strength training, cardio sessions, and custom workouts with ease</p>
            </div>
          </SpotlightCard>
          
          <SpotlightCard spotlightColor="rgba(126, 34, 206, 0.2)">
            <div className="feature-card">
              <div className="feature-icon">📈</div>
              <h3>Progress Analytics</h3>
              <p>Detailed charts and insights to monitor your fitness journey</p>
            </div>
          </SpotlightCard>
          
          <SpotlightCard spotlightColor="rgba(88, 28, 135, 0.2)">
            <div className="feature-card">
              <div className="feature-icon">🏆</div>
              <h3>Achievements</h3>
              <p>Earn badges and milestones as you hit your fitness goals</p>
            </div>
          </SpotlightCard>
        </div>
      </section>
    </div>
  );
};

export default LandingPage; 