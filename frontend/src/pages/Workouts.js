import React, { useEffect, useState } from "react";
import { workoutsAPI, goalsAPI } from "../services/api";

const Workouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [formData, setFormData] = useState({
    name: "",
    type: "cardio",
    duration: "",
    intensity: "Medium",
    notes: "",
  });

  const workoutTypes = [
    { value: "cardio", label: "Cardio", icon: "🏃", color: "#3b82f6" },
    { value: "strength", label: "Strength", icon: "💪", color: "#ef4444" },
    { value: "flexibility", label: "Flexibility", icon: "🧘", color: "#8b5cf6" },
    { value: "hiit", label: "HIIT", icon: "⚡", color: "#f59e0b" },
    { value: "mobility", label: "Mobility", icon: "🤸", color: "#10b981" },
    { value: "other", label: "Other", icon: "🎯", color: "#6b7280" },
  ];

  const intensityLevels = [
    { value: "Low", icon: "🌱", color: "#10b981" },
    { value: "Medium", icon: "🔥", color: "#f59e0b" },
    { value: "High", icon: "💥", color: "#ef4444" },
  ];

  // Fetch workouts
  const fetchWorkouts = async () => {
    try {
      const response = await workoutsAPI.list();
      setWorkouts(response.data);
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Failed to load workouts." });
    } finally {
      setLoading(false);
    }
  };

  // Fetch goals
  const fetchGoals = async () => {
    try {
      const response = await goalsAPI.list();
      setGoals(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchWorkouts();
    fetchGoals();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.duration) {
      setMessage({ type: "error", text: "Workout name and duration are required." });
      return;
    }

    const payload = {
      name: formData.name,
      type: formData.type.toLowerCase(),
      duration: Number(formData.duration),
      intensity: formData.intensity,
      notes: formData.notes,
    };

    try {
      const response = await workoutsAPI.create(payload);
      setWorkouts((prev) => [response.data, ...prev]);

      setFormData({
        name: "",
        type: "cardio",
        duration: "",
        intensity: "Medium",
        notes: "",
      });

      setMessage({ type: "success", text: "Workout logged successfully! 🎉" });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);

      await fetchGoals();
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Failed to save workout." });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this workout?")) return;

    try {
      await workoutsAPI.delete(id);
      setWorkouts((prev) => prev.filter((w) => w.id !== id));
      setMessage({ type: "success", text: "Workout deleted." });
      setTimeout(() => setMessage({ type: "", text: "" }), 2000);
      await fetchGoals();
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Failed to delete workout." });
    }
  };

  const getWorkoutTypeInfo = (type) => {
    return workoutTypes.find(t => t.value === type.toLowerCase()) || workoutTypes[5];
  };

  const getIntensityInfo = (intensity) => {
    return intensityLevels.find(i => i.value === intensity) || intensityLevels[1];
  };

  return (
    <div className="workouts-page">
      <div className="page-container">
        {/* Page Header */}
        <div className="page-header-modern">
          <div className="header-content">
            <div className="header-icon">💪</div>
            <div>
              <h1 className="page-title">Your Workouts</h1>
              <p className="page-subtitle">Log and review your training sessions</p>
            </div>
          </div>
          <div className="header-stats">
            <div className="header-stat">
              <span className="stat-value">{workouts.length}</span>
              <span className="stat-label">Total</span>
            </div>
            <div className="header-stat">
              <span className="stat-value">{workouts.reduce((sum, w) => sum + w.duration, 0)}</span>
              <span className="stat-label">Minutes</span>
            </div>
          </div>
        </div>

        {/* Alert Message */}
        {message.text && (
          <div className={`alert-modern alert-${message.type}`}>
            <div className="alert-icon">
              {message.type === "success" ? "✅" : "⚠️"}
            </div>
            <div className="alert-content">
              <p>{message.text}</p>
            </div>
            <button 
              className="alert-close" 
              onClick={() => setMessage({ type: "", text: "" })}
            >
              ×
            </button>
          </div>
        )}

        {/* Main Grid */}
        <div className="workouts-grid">
          {/* Log Workout Form */}
          <div className="workout-form-card">
            <div className="form-card-header">
              <h2 className="form-card-title">Log a Workout</h2>
              <p className="form-card-subtitle">Record your latest training session</p>
            </div>

            <form onSubmit={handleSubmit} className="modern-form">
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  <span>Workout Name</span>
                  <span className="label-required">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Morning Run, Leg Day, HIIT Session"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="type" className="form-label">Workout Type</label>
                  <div className="workout-type-grid">
                    {workoutTypes.map((type) => (
                      <label
                        key={type.value}
                        className={`workout-type-option ${
                          formData.type === type.value ? "selected" : ""
                        }`}
                        style={{
                          borderColor: formData.type === type.value ? type.color : "transparent"
                        }}
                      >
                        <input
                          type="radio"
                          name="type"
                          value={type.value}
                          checked={formData.type === type.value}
                          onChange={handleChange}
                          className="workout-type-input"
                        />
                        <span className="workout-type-icon">{type.icon}</span>
                        <span className="workout-type-label">{type.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="duration" className="form-label">
                    <span>Duration (minutes)</span>
                    <span className="label-required">*</span>
                  </label>
                  <div className="input-with-icon">
                    <span className="input-icon">⏱️</span>
                    <input
                      id="duration"
                      name="duration"
                      type="number"
                      min="1"
                      max="1440"
                      value={formData.duration}
                      onChange={handleChange}
                      placeholder="30"
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="intensity" className="form-label">Intensity</label>
                  <div className="intensity-selector">
                    {intensityLevels.map((level) => (
                      <label
                        key={level.value}
                        className={`intensity-option ${
                          formData.intensity === level.value ? "selected" : ""
                        }`}
                        style={{
                          borderColor: formData.intensity === level.value ? level.color : "transparent"
                        }}
                      >
                        <input
                          type="radio"
                          name="intensity"
                          value={level.value}
                          checked={formData.intensity === level.value}
                          onChange={handleChange}
                          className="intensity-input"
                        />
                        <span className="intensity-icon">{level.icon}</span>
                        <span className="intensity-label">{level.value}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="notes" className="form-label">Notes (optional)</label>
                <textarea
                  id="notes"
                  name="notes"
                  rows="3"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="How did it feel? Any achievements or observations?"
                  className="form-textarea"
                />
              </div>

              <button type="submit" className="btn btn-primary btn-block btn-large">
                <span>Save Workout</span>
                <span className="btn-icon">✓</span>
              </button>
            </form>
          </div>

          {/* Recent Workouts List */}
          <div className="workouts-list-card">
            <div className="list-card-header">
              <h2 className="list-card-title">Recent Workouts</h2>
              <span className="workout-count">{workouts.length} total</span>
            </div>

            {loading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading your workouts...</p>
              </div>
            ) : workouts.length === 0 ? (
              <div className="empty-state-modern">
                <div className="empty-icon">📋</div>
                <h3 className="empty-title">No workouts yet</h3>
                <p className="empty-description">
                  Start by logging your first workout session using the form on the left.
                </p>
              </div>
            ) : (
              <div className="workouts-list">
                {workouts.map((w) => {
                  const typeInfo = getWorkoutTypeInfo(w.type);
                  const intensityInfo = getIntensityInfo(w.intensity);
                  
                  return (
                    <div key={w.id} className="workout-card">
                      <div className="workout-card-header">
                        <div className="workout-type-badge" style={{ backgroundColor: `${typeInfo.color}15`, color: typeInfo.color }}>
                          <span className="type-icon">{typeInfo.icon}</span>
                          <span className="type-label">{typeInfo.label}</span>
                        </div>
                        <button 
                          className="workout-delete-btn" 
                          onClick={() => handleDelete(w.id)}
                          title="Delete workout"
                        >
                          🗑️
                        </button>
                      </div>

                      <h3 className="workout-card-title">{w.name}</h3>

                      <div className="workout-card-meta">
                        <div className="meta-item">
                          <span className="meta-icon">⏱️</span>
                          <span className="meta-text">{w.duration} min</span>
                        </div>
                        <div className="meta-item">
                          <span className="meta-icon">{intensityInfo.icon}</span>
                          <span className="meta-text">{w.intensity}</span>
                        </div>
                        <div className="meta-item">
                          <span className="meta-icon">📅</span>
                          <span className="meta-text">
                            {new Date(w.date).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>

                      {w.notes && (
                        <div className="workout-notes">
                          <p>{w.notes}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Workouts;