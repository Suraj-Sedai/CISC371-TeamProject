import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section-modern">
        <div className="hero-background">
          <div className="hero-gradient"></div>
          <div className="hero-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
          </div>
        </div>
        
        <div className="hero-container">
          <div className="hero-content-main">
            <div className="hero-badge">
              <span className="badge-dot"></span>
              <span>Your Personal Fitness Companion</span>
            </div>
            
            <h1 className="hero-title">
              Transform Your
              <span className="gradient-text"> Fitness Journey</span>
            </h1>
            
            <p className="hero-description">
              Track workouts, monitor progress, and achieve your health goals with 
              our intelligent fitness tracking platform. Your path to a healthier you starts here.
            </p>
            
            <div className="hero-cta">
              {isAuthenticated ? (
                <Link to="/dashboard" className="btn btn-hero btn-primary">
                  <span>Go to Dashboard</span>
                  <span className="btn-icon">→</span>
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn btn-hero btn-primary">
                    <span>Get Started Free</span>
                    <span className="btn-icon">→</span>
                  </Link>
                  <Link to="/login" className="btn btn-hero btn-secondary">
                    <span>Sign In</span>
                  </Link>
                </>
              )}
            </div>

            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">10K+</div>
                <div className="stat-label">Active Users</div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <div className="stat-number">50K+</div>
                <div className="stat-label">Workouts Logged</div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <div className="stat-number">95%</div>
                <div className="stat-label">Goal Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section-modern">
        <div className="features-container">
          <div className="section-header-center">
            <span className="section-badge">Features</span>
            <h2 className="section-title-large">Everything You Need to Succeed</h2>
            <p className="section-description">
              Powerful tools designed to help you track, analyze, and achieve your fitness goals
            </p>
          </div>

          <div className="features-grid-modern">
            <div className="feature-card-modern feature-primary">
              <div className="feature-icon-wrapper">
                <div className="feature-icon">💪</div>
              </div>
              <h3 className="feature-title">Track Workouts</h3>
              <p className="feature-description">
                Log your daily exercises, duration, and intensity. Keep a detailed record 
                of every training session and stay motivated.
              </p>
              <div className="feature-highlight">
                <span className="highlight-text">Real-time tracking</span>
              </div>
            </div>

            <div className="feature-card-modern feature-success">
              <div className="feature-icon-wrapper">
                <div className="feature-icon">🎯</div>
              </div>
              <h3 className="feature-title">Set Goals</h3>
              <p className="feature-description">
                Create personalized fitness goals with target values and deadlines. 
                Track your progress with visual indicators and celebrate milestones.
              </p>
              <div className="feature-highlight">
                <span className="highlight-text">Smart goal tracking</span>
              </div>
            </div>

            <div className="feature-card-modern feature-purple">
              <div className="feature-icon-wrapper">
                <div className="feature-icon">📊</div>
              </div>
              <h3 className="feature-title">Analyze Progress</h3>
              <p className="feature-description">
                View detailed analytics with beautiful charts and graphs. Understand 
                your fitness trends and make data-driven decisions.
              </p>
              <div className="feature-highlight">
                <span className="highlight-text">Advanced analytics</span>
              </div>
            </div>

            <div className="feature-card-modern feature-orange">
              <div className="feature-icon-wrapper">
                <div className="feature-icon">📅</div>
              </div>
              <h3 className="feature-title">Activity Calendar</h3>
              <p className="feature-description">
                Visualize your workout consistency with an interactive heatmap calendar. 
                Build streaks and maintain momentum.
              </p>
              <div className="feature-highlight">
                <span className="highlight-text">Visual insights</span>
              </div>
            </div>

            <div className="feature-card-modern feature-blue">
              <div className="feature-icon-wrapper">
                <div className="feature-icon">⚖️</div>
              </div>
              <h3 className="feature-title">Health Metrics</h3>
              <p className="feature-description">
                Automatic BMI and BMR calculations based on your profile. Monitor 
                your health statistics and body composition changes.
              </p>
              <div className="feature-highlight">
                <span className="highlight-text">Auto-calculated</span>
              </div>
            </div>

            <div className="feature-card-modern feature-pink">
              <div className="feature-icon-wrapper">
                <div className="feature-icon">🔥</div>
              </div>
              <h3 className="feature-title">Streak Tracking</h3>
              <p className="feature-description">
                Build and maintain workout streaks to stay consistent. Get motivated 
                by your longest streaks and daily achievements.
              </p>
              <div className="feature-highlight">
                <span className="highlight-text">Stay consistent</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="coming-soon-section">
        <div className="coming-soon-container">
          <div className="section-header-center">
            <span className="section-badge section-badge-gradient">Coming Soon</span>
            <h2 className="section-title-large">Exciting Features in Development</h2>
            <p className="section-description">
              We're constantly improving and adding new features to enhance your fitness journey
            </p>
          </div>

          <div className="coming-soon-grid">
            <div className="coming-soon-card">
              <div className="coming-soon-icon">🥗</div>
              <div className="coming-soon-content">
                <h3 className="coming-soon-title">Nutrition Tracking</h3>
                <p className="coming-soon-description">
                  Monitor your meals, track macros, and manage daily calorie intake 
                  with our comprehensive nutrition database.
                </p>
                <span className="coming-soon-tag">Q2 2025</span>
              </div>
            </div>

            <div className="coming-soon-card">
              <div className="coming-soon-icon">🤖</div>
              <div className="coming-soon-content">
                <h3 className="coming-soon-title">AI Recommendations</h3>
                <p className="coming-soon-description">
                  Get personalized workout suggestions and training plans powered 
                  by artificial intelligence based on your goals and history.
                </p>
                <span className="coming-soon-tag">Q3 2025</span>
              </div>
            </div>

            <div className="coming-soon-card">
              <div className="coming-soon-icon">👥</div>
              <div className="coming-soon-content">
                <h3 className="coming-soon-title">Social Features</h3>
                <p className="coming-soon-description">
                  Connect with friends, share achievements, and join challenges 
                  to stay motivated together in your fitness journey.
                </p>
                <span className="coming-soon-tag">Q4 2025</span>
              </div>
            </div>

            <div className="coming-soon-card">
              <div className="coming-soon-icon">📱</div>
              <div className="coming-soon-content">
                <h3 className="coming-soon-title">Mobile App</h3>
                <p className="coming-soon-description">
                  Native iOS and Android apps with offline support, wearable 
                  integration, and push notifications for your workouts.
                </p>
                <span className="coming-soon-tag">2026</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Start Your Fitness Journey?</h2>
            <p className="cta-description">
              Join thousands of users who have transformed their lives with FitTracker
            </p>
            {!isAuthenticated && (
              <Link to="/register" className="btn btn-hero btn-white">
                <span>Create Free Account</span>
                <span className="btn-icon">→</span>
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;