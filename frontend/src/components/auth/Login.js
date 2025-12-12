import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login, error } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(credentials);
    setLoading(false);

    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="auth-page">
      {/* Animated Background */}
      <div className="auth-background">
        <div className="auth-gradient"></div>
        <div className="floating-shapes">
          <div className="floating-shape shape-1"></div>
          <div className="floating-shape shape-2"></div>
          <div className="floating-shape shape-3"></div>
          <div className="floating-shape shape-4"></div>
          <div className="floating-shape shape-5"></div>
        </div>
      </div>

      <div className="auth-container-modern">
        <div className="auth-content-wrapper">
          {/* Left Side - Branding */}
          <div className="auth-branding">
            <div className="brand-content">
              <div className="brand-logo">
                <div className="logo-icon">💪</div>
                <h1 className="brand-name">FitTracker</h1>
              </div>
              
              <h2 className="brand-tagline">
                Welcome Back to Your
                <span className="highlight-text"> Fitness Journey</span>
              </h2>
              
              <p className="brand-description">
                Track your progress, achieve your goals, and transform your life 
                with the ultimate fitness companion.
              </p>

              <div className="brand-features">
                <div className="brand-feature">
                  <div className="feature-icon">✓</div>
                  <span>Track workouts & progress</span>
                </div>
                <div className="brand-feature">
                  <div className="feature-icon">✓</div>
                  <span>Set & achieve goals</span>
                </div>
                <div className="brand-feature">
                  <div className="feature-icon">✓</div>
                  <span>Visualize your journey</span>
                </div>
              </div>

              <div className="brand-stats">
                <div className="brand-stat">
                  <div className="stat-number">10+</div>
                  <div className="stat-label">Active Users</div>
                </div>
                <div className="brand-stat">
                  <div className="stat-number">50+</div>
                  <div className="stat-label">Workouts</div>
                </div>
                <div className="brand-stat">
                  <div className="stat-number">95%</div>
                  <div className="stat-label">Success Rate</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="auth-form-container">
            <div className="auth-card-modern">
              <div className="auth-card-header">
                <h2 className="auth-title">Sign In</h2>
                <p className="auth-subtitle">Enter your credentials to access your account</p>
              </div>

              {error && (
                <div className="alert-auth alert-error">
                  <div className="alert-icon">⚠️</div>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group-auth">
                  <label htmlFor="email" className="form-label-auth">
                    <span className="label-icon">✉️</span>
                    <span>Email Address</span>
                  </label>
                  <div className="input-wrapper">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={credentials.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="form-input-auth"
                    />
                  </div>
                </div>

                <div className="form-group-auth">
                  <label htmlFor="password" className="form-label-auth">
                    <span className="label-icon">🔒</span>
                    <span>Password</span>
                  </label>
                  <div className="input-wrapper password-wrapper">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={credentials.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="form-input-auth"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? "👁️" : "👁️‍🗨️"}
                    </button>
                  </div>
                </div>

                <div className="form-footer-auth">
                  <label className="checkbox-wrapper">
                    <input type="checkbox" className="checkbox-input" />
                    <span className="checkbox-label">Remember me</span>
                  </label>
                  <a href="#" className="forgot-link">Forgot password?</a>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-auth btn-auth-primary"
                >
                  {loading ? (
                    <>
                      <span className="spinner-auth"></span>
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <span className="btn-arrow">→</span>
                    </>
                  )}
                </button>
              </form>

              <div className="auth-divider">
                <span className="divider-text">Or continue with</span>
              </div>

              <div className="social-login">
                <button className="social-btn" type="button">
                  <span className="social-icon">🔍</span>
                  <span>Google</span>
                </button>
                <button className="social-btn" type="button">
                  <span className="social-icon">📘</span>
                  <span>Facebook</span>
                </button>
              </div>

              <div className="auth-footer-text">
                <p>
                  Don't have an account?{' '}
                  <Link to="/register" className="auth-link">
                    Sign up for free
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;