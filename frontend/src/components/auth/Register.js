import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { register, error } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    password2: '',
    first_name: '',
    last_name: '',
  });
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (formErrors[e.target.name]) {
      setFormErrors({ ...formErrors, [e.target.name]: '' });
    }
  };

  const validateStep1 = () => {
    const errors = {};
    if (!formData.email) errors.email = 'Email is required';
    if (!formData.username) errors.username = 'Username is required';
    return errors;
  };

  const validateStep2 = () => {
    const errors = {};
    if (!formData.password) errors.password = 'Password is required';
    if (formData.password.length < 6) errors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.password2) {
      errors.password2 = 'Passwords do not match';
    }
    return errors;
  };

  const handleNext = () => {
    const errors = validateStep1();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateStep2();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setLoading(true);
    const result = await register(formData);
    setLoading(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      if (typeof result.error === 'object') {
        setFormErrors(result.error);
      }
      setStep(1); // Go back to first step if there's an error
    }
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '' };
    if (password.length < 6) return { strength: 25, label: 'Weak', color: '#ef4444' };
    if (password.length < 10) return { strength: 50, label: 'Fair', color: '#f59e0b' };
    if (password.length < 14) return { strength: 75, label: 'Good', color: '#10b981' };
    return { strength: 100, label: 'Strong', color: '#059669' };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="auth-page">
      {/* Animated Background */}
      <div className="auth-background">
        <div className="auth-gradient-register"></div>
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
                Start Your
                <span className="highlight-text"> Transformation Today</span>
              </h2>
              
              <p className="brand-description">
                Join thousands of users who have transformed their lives. Track your 
                workouts, set goals, and achieve the fitness results you've always wanted.
              </p>

              <div className="brand-benefits">
                <div className="benefit-card">
                  <div className="benefit-icon">🎯</div>
                  <div className="benefit-content">
                    <h3>Goal Tracking</h3>
                    <p>Set and achieve your fitness goals with precision</p>
                  </div>
                </div>
                <div className="benefit-card">
                  <div className="benefit-icon">📊</div>
                  <div className="benefit-content">
                    <h3>Progress Analytics</h3>
                    <p>Visualize your journey with detailed charts</p>
                  </div>
                </div>
                <div className="benefit-card">
                  <div className="benefit-icon">🏆</div>
                  <div className="benefit-content">
                    <h3>Achievement System</h3>
                    <p>Stay motivated with streaks and milestones</p>
                  </div>
                </div>
              </div>

              <div className="testimonial">
                <p className="testimonial-text">
                  "FitTracker helped me stay consistent and reach my fitness goals faster than I ever imagined!"
                </p>
                <div className="testimonial-author">
                  <div className="author-avatar">👤</div>
                  <div className="author-info">
                    <div className="author-name">Sarah Johnson</div>
                    <div className="author-title">Lost 15kg in 6 months</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Register Form */}
          <div className="auth-form-container">
            <div className="auth-card-modern register-card">
              <div className="auth-card-header">
                <h2 className="auth-title">Create Account</h2>
                <p className="auth-subtitle">Get started with your free account</p>
              </div>

              {/* Progress Steps */}
              <div className="steps-indicator">
                <div className={`step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
                  <div className="step-number">1</div>
                  <div className="step-label">Account</div>
                </div>
                <div className="step-line"></div>
                <div className={`step ${step >= 2 ? 'active' : ''}`}>
                  <div className="step-number">2</div>
                  <div className="step-label">Security</div>
                </div>
              </div>

              {error && typeof error === 'string' && (
                <div className="alert-auth alert-error">
                  <div className="alert-icon">⚠️</div>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="auth-form">
                {step === 1 && (
                  <div className="form-step">
                    <div className="form-group-auth">
                      <label htmlFor="email" className="form-label-auth">
                        <span className="label-icon">✉️</span>
                        <span>Email Address</span>
                        <span className="required-star">*</span>
                      </label>
                      <div className="input-wrapper">
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="you@example.com"
                          className={`form-input-auth ${formErrors.email ? 'input-error' : ''}`}
                        />
                      </div>
                      {formErrors.email && (
                        <span className="error-message-auth">{formErrors.email}</span>
                      )}
                    </div>

                    <div className="form-group-auth">
                      <label htmlFor="username" className="form-label-auth">
                        <span className="label-icon">👤</span>
                        <span>Username</span>
                        <span className="required-star">*</span>
                      </label>
                      <div className="input-wrapper">
                        <input
                          id="username"
                          name="username"
                          type="text"
                          required
                          value={formData.username}
                          onChange={handleChange}
                          placeholder="Choose a username"
                          className={`form-input-auth ${formErrors.username ? 'input-error' : ''}`}
                        />
                      </div>
                      {formErrors.username && (
                        <span className="error-message-auth">{formErrors.username}</span>
                      )}
                    </div>

                    <div className="form-row-auth">
                      <div className="form-group-auth">
                        <label htmlFor="first_name" className="form-label-auth">
                          <span className="label-icon">📝</span>
                          <span>First Name</span>
                        </label>
                        <input
                          id="first_name"
                          name="first_name"
                          type="text"
                          value={formData.first_name}
                          onChange={handleChange}
                          placeholder="John"
                          className="form-input-auth"
                        />
                      </div>

                      <div className="form-group-auth">
                        <label htmlFor="last_name" className="form-label-auth">
                          <span className="label-icon">📝</span>
                          <span>Last Name</span>
                        </label>
                        <input
                          id="last_name"
                          name="last_name"
                          type="text"
                          value={formData.last_name}
                          onChange={handleChange}
                          placeholder="Doe"
                          className="form-input-auth"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleNext}
                      className="btn-auth btn-auth-primary"
                    >
                      <span>Continue</span>
                      <span className="btn-arrow">→</span>
                    </button>
                  </div>
                )}

                {step === 2 && (
                  <div className="form-step">
                    <div className="form-group-auth">
                      <label htmlFor="password" className="form-label-auth">
                        <span className="label-icon">🔒</span>
                        <span>Password</span>
                        <span className="required-star">*</span>
                      </label>
                      <div className="input-wrapper password-wrapper">
                        <input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          required
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Create a strong password"
                          className={`form-input-auth ${formErrors.password ? 'input-error' : ''}`}
                        />
                        <button
                          type="button"
                          className="password-toggle"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? "👁️" : "👁️‍🗨️"}
                        </button>
                      </div>
                      {formData.password && (
                        <div className="password-strength">
                          <div className="strength-bar">
                            <div 
                              className="strength-fill"
                              style={{ 
                                width: `${passwordStrength.strength}%`,
                                backgroundColor: passwordStrength.color
                              }}
                            ></div>
                          </div>
                          <span className="strength-label" style={{ color: passwordStrength.color }}>
                            {passwordStrength.label}
                          </span>
                        </div>
                      )}
                      {formErrors.password && (
                        <span className="error-message-auth">{formErrors.password}</span>
                      )}
                    </div>

                    <div className="form-group-auth">
                      <label htmlFor="password2" className="form-label-auth">
                        <span className="label-icon">🔐</span>
                        <span>Confirm Password</span>
                        <span className="required-star">*</span>
                      </label>
                      <div className="input-wrapper password-wrapper">
                        <input
                          id="password2"
                          name="password2"
                          type={showPassword2 ? "text" : "password"}
                          required
                          value={formData.password2}
                          onChange={handleChange}
                          placeholder="Confirm your password"
                          className={`form-input-auth ${formErrors.password2 ? 'input-error' : ''}`}
                        />
                        <button
                          type="button"
                          className="password-toggle"
                          onClick={() => setShowPassword2(!showPassword2)}
                        >
                          {showPassword2 ? "👁️" : "👁️‍🗨️"}
                        </button>
                      </div>
                      {formErrors.password2 && (
                        <span className="error-message-auth">{formErrors.password2}</span>
                      )}
                    </div>

                    <div className="terms-checkbox">
                      <label className="checkbox-wrapper">
                        <input type="checkbox" className="checkbox-input" required />
                        <span className="checkbox-label">
                          I agree to the <a href="#" className="terms-link">Terms of Service</a> and <a href="#" className="terms-link">Privacy Policy</a>
                        </span>
                      </label>
                    </div>

                    <div className="form-actions-register">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="btn-auth btn-auth-secondary"
                      >
                        <span className="btn-arrow">←</span>
                        <span>Back</span>
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="btn-auth btn-auth-primary"
                      >
                        {loading ? (
                          <>
                            <span className="spinner-auth"></span>
                            <span>Creating...</span>
                          </>
                        ) : (
                          <>
                            <span>Create Account</span>
                            <span className="btn-arrow">✓</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </form>

              {step === 1 && (
                <>
                  <div className="auth-divider">
                    <span className="divider-text">Or sign up with</span>
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
                </>
              )}

              <div className="auth-footer-text">
                <p>
                  Already have an account?{' '}
                  <Link to="/login" className="auth-link">
                    Sign in here
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

export default Register;