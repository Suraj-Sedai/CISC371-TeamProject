import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1>Track Your Fitness Journey</h1>
          <p className="subtitle">
            Your personal fitness companion to log workouts, track progress, and achieve your health goals.
          </p>
          <div className="hero-buttons">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn btn-primary btn-lg">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-lg">
                  Get Started Free
                </Link>
                <Link to="/login" className="btn btn-secondary btn-lg">
                  Sign In
                </Link>
              </>
            )}
          </div>

          {/* Features Grid */}
          <div className="features-grid">
            <div className="feature-card">
              <span className="icon">💪</span>
              <h3>Track Workouts</h3>
              <p>
                Log your daily exercises, duration, and calories burned to stay on top of your fitness routine.
              </p>
            </div>

            <div className="feature-card">
              <span className="icon">🎯</span>
              <h3>Set Goals</h3>
              <p>
                Create personalized fitness goals and track your progress with visual indicators and milestones.
              </p>
            </div>

            <div className="feature-card">
              <span className="icon">📊</span>
              <h3>Analyze Progress</h3>
              <p>
                View detailed analytics with charts and graphs to understand your fitness trends over time.
              </p>
            </div>
          </div>

          {/* Additional Features */}
          <div className="additional-features">
            <h2>More Amazing Features</h2>
            <div className="features-list">
              <div className="feature-item">
                <span className="icon">🥗</span>
                <div>
                  <h4>Nutrition Tracking</h4>
                  <p>Monitor your meals and daily calorie intake</p>
                </div>
              </div>
              <div className="feature-item">
                <span className="icon">⚖️</span>
                <div>
                  <h4>BMI & BMR Calculator</h4>
                  <p>Auto-calculate health statistics</p>
                </div>
              </div>
              <div className="feature-item">
                <span className="icon">📅</span>
                <div>
                  <h4>Activity Calendar</h4>
                  <p>Visual calendar showing your workout days</p>
                </div>
              </div>
              <div className="feature-item">
                <span className="icon">🤖</span>
                <div>
                  <h4>AI Recommendations</h4>
                  <p>Get personalized workout suggestions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;