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
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
    } else {
      setMessage({ type: 'error', text: 'Failed to update profile' });
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

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {/* Profile Header */}
          <div className="profile-header">
            <div className="profile-info">
              <div className="profile-avatar">👤</div>
              <div className="profile-details">
                <h1>{user?.first_name || user?.username}</h1>
                <p>{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          {message.text && (
            <div style={{ padding: 'var(--spacing-lg)' }}>
              <div className={`alert alert-${message.type}`}>
                {message.text}
              </div>
            </div>
          )}

          {/* Profile Content */}
          <div className="profile-content">
            {!isEditing ? (
              // View Mode
              <div>
                <div className="profile-section-header">
                  <h2>Profile Information</h2>
                  <button onClick={() => setIsEditing(true)} className="btn btn-primary">
                    Edit Profile
                  </button>
                </div>

                <div className="profile-field-grid">
                  <div className="profile-field">
                    <label>First Name</label>
                    <p>{user?.first_name || 'Not set'}</p>
                  </div>
                  <div className="profile-field">
                    <label>Last Name</label>
                    <p>{user?.last_name || 'Not set'}</p>
                  </div>
                  <div className="profile-field">
                    <label>Age</label>
                    <p>{user?.age ? `${user.age} years` : 'Not set'}</p>
                  </div>
                  <div className="profile-field">
                    <label>Gender</label>
                    <p>{getGenderDisplay(user?.gender)}</p>
                  </div>
                  <div className="profile-field">
                    <label>Height</label>
                    <p>{user?.height ? `${user.height} cm` : 'Not set'}</p>
                  </div>
                  <div className="profile-field">
                    <label>Weight</label>
                    <p>{user?.weight ? `${user.weight} kg` : 'Not set'}</p>
                  </div>
                </div>

                {/* Health Stats */}
                {user?.bmi && (
                  <>
                    <hr className="profile-divider" />
                    <h3>Health Statistics</h3>
                    <div className="health-stats">
                      <div className="health-stat-card bmi">
                        <label>BMI (Body Mass Index)</label>
                        <div className="value">{user.bmi}</div>
                      </div>
                      <div className="health-stat-card bmr">
                        <label>BMR (Basal Metabolic Rate)</label>
                        <div className="value">{user.bmr} <small>cal/day</small></div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              // Edit Mode
              <form onSubmit={handleSubmit}>
                <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>Edit Profile</h2>

                <div className="profile-field-grid">
                  <div className="form-group">
                    <label htmlFor="first_name">First Name</label>
                    <input
                      type="text"
                      id="first_name"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="last_name">Last Name</label>
                    <input
                      type="text"
                      id="last_name"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="age">Age</label>
                    <input
                      type="number"
                      id="age"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      min="1"
                      max="120"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="gender">Gender</label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                    >
                      <option value="">Select Gender</option>
                      <option value="M">Male</option>
                      <option value="F">Female</option>
                      <option value="O">Other</option>
                      <option value="N">Prefer not to say</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="height">Height (cm)</label>
                    <input
                      type="number"
                      id="height"
                      name="height"
                      value={formData.height}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="weight">Weight (kg)</label>
                    <input
                      type="number"
                      id="weight"
                      name="weight"
                      value={formData.weight}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="btn btn-secondary"
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