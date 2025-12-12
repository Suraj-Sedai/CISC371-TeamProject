import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    age: user?.age || '',
    height: user?.height || '',
    weight: user?.weight || '',
    gender: user?.gender || '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    const result = await updateUserProfile(formData);
    setLoading(false);

    if (result.success) {
      setMessage({ type: 'success', text: 'Profile updated successfully! 🎉' });
      setIsEditing(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } else {
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    }
  };

  const handleCancel = () => {
    setFormData({
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      age: user?.age || '',
      height: user?.height || '',
      weight: user?.weight || '',
      gender: user?.gender || '',
    });
    setIsEditing(false);
    setMessage({ type: '', text: '' });
  };

  const getGenderDisplay = (gender) => {
    const genderMap = {
      'M': 'Male',
      'F': 'Female',
      'O': 'Other',
      'N': 'Prefer not to say'
    };
    return genderMap[gender] || 'Not set';
  };

  const getGenderEmoji = (gender) => {
    const emojiMap = {
      'M': '👨',
      'F': '👩',
      'O': '🧑',
      'N': '👤'
    };
    return emojiMap[gender] || '👤';
  };

  const calculateBMICategory = (bmi) => {
    if (!bmi) return '';
    if (bmi < 18.5) return { text: 'Underweight', color: '#3b82f6' };
    if (bmi < 25) return { text: 'Normal', color: '#10b981' };
    if (bmi < 30) return { text: 'Overweight', color: '#f59e0b' };
    return { text: 'Obese', color: '#ef4444' };
  };

  const isProfileComplete = user?.first_name && user?.age && user?.height && user?.weight && user?.gender;
  const bmiCategory = calculateBMICategory(user?.bmi);

  return (
    <div className="profile-page">
      <div className="page-container-narrow">
        {/* Messages */}
        {message.text && (
          <div className={`alert-modern alert-${message.type}`}>
            <div className="alert-icon">
              {message.type === "success" ? "✅" : "⚠️"}
            </div>
            <div className="alert-content">
              <p>{message.text}</p>
            </div>
            <button className="alert-close" onClick={() => setMessage({ type: '', text: '' })}>
              ×
            </button>
          </div>
        )}

        {/* Profile Incomplete Alert */}
        {!isProfileComplete && !isEditing && (
          <div className="profile-incomplete-alert">
            <div className="alert-icon">⚠️</div>
            <div className="alert-content">
              <p><strong>Complete your profile</strong></p>
              <p>Add more details to unlock BMI and BMR calculations and personalized insights.</p>
            </div>
            <button onClick={() => setIsEditing(true)} className="btn btn-primary btn-sm">
              Complete Profile
            </button>
          </div>
        )}

        <div className="profile-card-modern">
          {/* Profile Header */}
          <div className="profile-header-modern">
            <div className="profile-header-bg"></div>
            <div className="profile-header-content">
              <div className="profile-avatar-modern">
                {getGenderEmoji(user?.gender)}
              </div>
              <div className="profile-info-modern">
                <h1 className="profile-name">
                  {user?.first_name && user?.last_name 
                    ? `${user.first_name} ${user.last_name}`
                    : user?.first_name || user?.username}
                </h1>
                <p className="profile-email">{user?.email}</p>
                {user?.age && (
                  <div className="profile-quick-stats">
                    <span className="quick-stat">{user.age} years old</span>
                    {user?.height && <span className="stat-divider">•</span>}
                    {user?.height && <span className="quick-stat">{user.height} cm</span>}
                    {user?.weight && <span className="stat-divider">•</span>}
                    {user?.weight && <span className="quick-stat">{user.weight} kg</span>}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Profile Body */}
          <div className="profile-body-modern">
            {!isEditing ? (
              // View Mode
              <>
                <div className="profile-section-header">
                  <h2 className="section-title">Personal Information</h2>
                  <button onClick={() => setIsEditing(true)} className="btn btn-primary">
                    <span>Edit Profile</span>
                    <span className="btn-icon">✏️</span>
                  </button>
                </div>

                <div className="profile-info-grid">
                  <div className="profile-info-item">
                    <div className="info-icon">👤</div>
                    <div className="info-content">
                      <label className="info-label">First Name</label>
                      <p className="info-value">{user?.first_name || 'Not set'}</p>
                    </div>
                  </div>

                  <div className="profile-info-item">
                    <div className="info-icon">👤</div>
                    <div className="info-content">
                      <label className="info-label">Last Name</label>
                      <p className="info-value">{user?.last_name || 'Not set'}</p>
                    </div>
                  </div>

                  <div className="profile-info-item">
                    <div className="info-icon">🎂</div>
                    <div className="info-content">
                      <label className="info-label">Age</label>
                      <p className="info-value">{user?.age ? `${user.age} years` : 'Not set'}</p>
                    </div>
                  </div>

                  <div className="profile-info-item">
                    <div className="info-icon">{getGenderEmoji(user?.gender)}</div>
                    <div className="info-content">
                      <label className="info-label">Gender</label>
                      <p className="info-value">{getGenderDisplay(user?.gender)}</p>
                    </div>
                  </div>

                  <div className="profile-info-item">
                    <div className="info-icon">📏</div>
                    <div className="info-content">
                      <label className="info-label">Height</label>
                      <p className="info-value">{user?.height ? `${user.height} cm` : 'Not set'}</p>
                    </div>
                  </div>

                  <div className="profile-info-item">
                    <div className="info-icon">⚖️</div>
                    <div className="info-content">
                      <label className="info-label">Weight</label>
                      <p className="info-value">{user?.weight ? `${user.weight} kg` : 'Not set'}</p>
                    </div>
                  </div>
                </div>

                {/* Health Stats */}
                {(user?.bmi || user?.bmr) && (
                  <>
                    <div className="profile-divider"></div>
                    
                    <div className="profile-section-header">
                      <h2 className="section-title">Health Statistics</h2>
                    </div>

                    <div className="health-stats-modern">
                      {user?.bmi && (
                        <div className="health-stat-card-modern">
                          <div className="stat-icon-wrapper">
                            <div className="stat-icon">📊</div>
                          </div>
                          <div className="stat-content">
                            <label className="stat-label">BMI (Body Mass Index)</label>
                            <div className="stat-value-row">
                              <span className="stat-value">{user.bmi}</span>
                              {bmiCategory && (
                                <span 
                                  className="stat-category"
                                  style={{ backgroundColor: `${bmiCategory.color}15`, color: bmiCategory.color }}
                                >
                                  {bmiCategory.text}
                                </span>
                              )}
                            </div>
                            <p className="stat-description">
                              Based on your height and weight measurements
                            </p>
                          </div>
                        </div>
                      )}

                      {user?.bmr && (
                        <div className="health-stat-card-modern">
                          <div className="stat-icon-wrapper">
                            <div className="stat-icon">🔥</div>
                          </div>
                          <div className="stat-content">
                            <label className="stat-label">BMR (Basal Metabolic Rate)</label>
                            <div className="stat-value-row">
                              <span className="stat-value">{user.bmr}</span>
                              <span className="stat-unit">cal/day</span>
                            </div>
                            <p className="stat-description">
                              Estimated calories burned at rest per day
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="health-info-card">
                      <div className="info-card-icon">💡</div>
                      <div className="info-card-content">
                        <h4>About Your Health Metrics</h4>
                        <p>
                          BMI measures body fat based on height and weight. BMR estimates 
                          the minimum calories your body needs at rest. These metrics are 
                          automatically calculated from your profile information.
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </>
            ) : (
              // Edit Mode
              <form onSubmit={handleSubmit} className="profile-edit-form">
                <div className="profile-section-header">
                  <h2 className="section-title">Edit Profile</h2>
                </div>

                <div className="form-grid-profile">
                  <div className="form-group">
                    <label htmlFor="first_name" className="form-label">
                      <span className="label-icon">👤</span>
                      <span>First Name</span>
                    </label>
                    <input
                      type="text"
                      id="first_name"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Enter your first name"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="last_name" className="form-label">
                      <span className="label-icon">👤</span>
                      <span>Last Name</span>
                    </label>
                    <input
                      type="text"
                      id="last_name"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Enter your last name"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="age" className="form-label">
                      <span className="label-icon">🎂</span>
                      <span>Age</span>
                    </label>
                    <input
                      type="number"
                      id="age"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      className="form-input"
                      min="1"
                      max="120"
                      placeholder="Your age"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="gender" className="form-label">
                      <span className="label-icon">🧑</span>
                      <span>Gender</span>
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="form-input"
                    >
                      <option value="">Select Gender</option>
                      <option value="M">Male</option>
                      <option value="F">Female</option>
                      <option value="O">Other</option>
                      <option value="N">Prefer not to say</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="height" className="form-label">
                      <span className="label-icon">📏</span>
                      <span>Height (cm)</span>
                    </label>
                    <input
                      type="number"
                      id="height"
                      name="height"
                      value={formData.height}
                      onChange={handleChange}
                      className="form-input"
                      step="0.01"
                      min="0"
                      placeholder="e.g., 175"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="weight" className="form-label">
                      <span className="label-icon">⚖️</span>
                      <span>Weight (kg)</span>
                    </label>
                    <input
                      type="number"
                      id="weight"
                      name="weight"
                      value={formData.weight}
                      onChange={handleChange}
                      className="form-input"
                      step="0.01"
                      min="0"
                      placeholder="e.g., 70"
                    />
                  </div>
                </div>

                <div className="form-actions-profile">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary btn-large"
                  >
                    {loading ? (
                      <>
                        <span className="spinner-small"></span>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <span>Save Changes</span>
                        <span className="btn-icon">✓</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="btn btn-secondary btn-large"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;