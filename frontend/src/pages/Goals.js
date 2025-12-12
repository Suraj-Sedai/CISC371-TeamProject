import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const Goals = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    goal_type: "custom",
    target_value: "",
    end_date: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const goalTypeOptions = [
    { value: "weight_loss", label: "Weight Loss", icon: "⚖️", color: "#ef4444" },
    { value: "muscle_gain", label: "Muscle Gain", icon: "💪", color: "#8b5cf6" },
    { value: "workout_time", label: "Workout Time", icon: "⏱️", color: "#3b82f6" },
    { value: "custom", label: "Custom", icon: "🎯", color: "#10b981" },
  ];

  const fetchGoals = async () => {
    setLoading(true);
    try {
      const response = await api.get("/goals/");
      setGoals(response.data);
    } catch (err) {
      console.error("Failed to fetch goals:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleChange = (e) => {
    setNewGoal({ ...newGoal, [e.target.name]: e.target.value });
    setError("");
  };

  const handleAddGoal = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!newGoal.title || !newGoal.target_value || !newGoal.end_date) {
      setError("Title, target value, and end date are required.");
      return;
    }

    try {
      const response = await api.post("/goals/", newGoal);
      setGoals((prev) => [response.data, ...prev]);
      setNewGoal({
        title: "",
        description: "",
        goal_type: "custom",
        target_value: "",
        end_date: "",
      });
      setSuccessMessage("Goal created successfully! 🎉");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Failed to create goal:", err);
      setError("Failed to create goal. Please check your input.");
    }
  };

  const handleComplete = async (goalId) => {
    try {
      await api.patch(`/goals/${goalId}/`, { completed: true });
      setGoals((prev) =>
        prev.map((goal) =>
          goal.id === goalId ? { ...goal, completed: true, progress_percentage: 100 } : goal
        )
      );
      setSuccessMessage("Goal completed! 🎊");
      setTimeout(() => setSuccessMessage(""), 2000);
    } catch (err) {
      console.error("Failed to complete goal:", err);
    }
  };

  const handleDelete = async (goalId) => {
    if (!window.confirm("Are you sure you want to delete this goal?")) return;

    try {
      await api.delete(`/goals/${goalId}/`);
      setGoals((prev) => prev.filter((goal) => goal.id !== goalId));
      setSuccessMessage("Goal deleted.");
      setTimeout(() => setSuccessMessage(""), 2000);
    } catch (err) {
      console.error("Failed to delete goal:", err);
    }
  };

  const calculateProgress = (goal) => {
    return Math.min(goal.progress_percentage || 0, 100);
  };

  const getGoalTypeInfo = (type) => {
    return goalTypeOptions.find(t => t.value === type) || goalTypeOptions[3];
  };

  const getDaysRemaining = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="loading-page">
        <div className="spinner"></div>
        <p>Loading your goals...</p>
      </div>
    );
  }

  const activeGoals = goals.filter(g => !g.completed);
  const completedGoals = goals.filter(g => g.completed);

  return (
    <div className="goals-page">
      <div className="page-container">
        {/* Page Header */}
        <div className="page-header-modern">
          <div className="header-content">
            <div className="header-icon">🎯</div>
            <div>
              <h1 className="page-title">{user?.first_name || user?.username}'s Goals</h1>
              <p className="page-subtitle">Track your progress and achieve your fitness goals</p>
            </div>
          </div>
          <div className="header-stats">
            <div className="header-stat">
              <span className="stat-value">{activeGoals.length}</span>
              <span className="stat-label">Active</span>
            </div>
            <div className="header-stat">
              <span className="stat-value">{completedGoals.length}</span>
              <span className="stat-label">Completed</span>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="alert-modern alert-success">
            <div className="alert-icon">✅</div>
            <div className="alert-content">
              <p>{successMessage}</p>
            </div>
            <button className="alert-close" onClick={() => setSuccessMessage("")}>×</button>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="alert-modern alert-error">
            <div className="alert-icon">⚠️</div>
            <div className="alert-content">
              <p>{error}</p>
            </div>
            <button className="alert-close" onClick={() => setError("")}>×</button>
          </div>
        )}

        <div className="goals-layout">
          {/* New Goal Form */}
          <div className="goal-form-card">
            <div className="form-card-header">
              <h2 className="form-card-title">Create New Goal</h2>
              <p className="form-card-subtitle">Set a target and track your progress</p>
            </div>

            <form onSubmit={handleAddGoal} className="modern-form">
              <div className="form-group">
                <label htmlFor="title" className="form-label">
                  <span>Goal Title</span>
                  <span className="label-required">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={newGoal.title}
                  onChange={handleChange}
                  placeholder="e.g., Lose 5 kg, Run 100 km this month"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description" className="form-label">Description (optional)</label>
                <textarea
                  id="description"
                  name="description"
                  value={newGoal.description}
                  onChange={handleChange}
                  placeholder="Add more details about your goal..."
                  className="form-textarea"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Goal Type</label>
                <div className="goal-type-grid">
                  {goalTypeOptions.map((type) => (
                    <label
                      key={type.value}
                      className={`goal-type-option ${
                        newGoal.goal_type === type.value ? "selected" : ""
                      }`}
                      style={{
                        borderColor: newGoal.goal_type === type.value ? type.color : "transparent"
                      }}
                    >
                      <input
                        type="radio"
                        name="goal_type"
                        value={type.value}
                        checked={newGoal.goal_type === type.value}
                        onChange={handleChange}
                        className="goal-type-input"
                      />
                      <span className="goal-type-icon">{type.icon}</span>
                      <span className="goal-type-label">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="target_value" className="form-label">
                    <span>Target Value</span>
                    <span className="label-required">*</span>
                  </label>
                  <input
                    type="number"
                    id="target_value"
                    name="target_value"
                    value={newGoal.target_value}
                    onChange={handleChange}
                    placeholder="e.g., 5, 100, 10"
                    className="form-input"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="end_date" className="form-label">
                    <span>Target Date</span>
                    <span className="label-required">*</span>
                  </label>
                  <input
                    type="date"
                    id="end_date"
                    name="end_date"
                    value={newGoal.end_date}
                    onChange={handleChange}
                    className="form-input"
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-block btn-large">
                <span>Create Goal</span>
                <span className="btn-icon">+</span>
              </button>
            </form>
          </div>

          {/* Goals List */}
          <div className="goals-list-section">
            {/* Active Goals */}
            <div className="goals-category">
              <div className="category-header">
                <h2 className="category-title">Active Goals</h2>
                <span className="category-count">{activeGoals.length}</span>
              </div>

              {activeGoals.length === 0 ? (
                <div className="empty-state-modern">
                  <div className="empty-icon">🎯</div>
                  <h3 className="empty-title">No active goals</h3>
                  <p className="empty-description">
                    Create your first goal to start tracking your progress!
                  </p>
                </div>
              ) : (
                <div className="goals-grid">
                  {activeGoals.map((goal) => {
                    const progress = calculateProgress(goal);
                    const typeInfo = getGoalTypeInfo(goal.goal_type);
                    const daysRemaining = getDaysRemaining(goal.end_date);
                    const isOverdue = daysRemaining < 0;

                    return (
                      <div key={goal.id} className="goal-card-modern">
                        <div className="goal-card-header">
                          <div className="goal-type-badge" style={{ backgroundColor: `${typeInfo.color}15`, color: typeInfo.color }}>
                            <span className="type-icon">{typeInfo.icon}</span>
                            <span className="type-label">{typeInfo.label}</span>
                          </div>
                          {isOverdue && (
                            <span className="overdue-badge">Overdue</span>
                          )}
                        </div>

                        <h3 className="goal-card-title">{goal.title}</h3>

                        {goal.description && (
                          <p className="goal-card-description">{goal.description}</p>
                        )}

                        <div className="goal-progress-section">
                          <div className="progress-header">
                            <span className="progress-label">Progress</span>
                            <span className="progress-percentage">{Math.round(progress)}%</span>
                          </div>
                          <div className="progress-bar-modern">
                            <div
                              className="progress-fill-modern"
                              style={{ 
                                width: `${progress}%`,
                                backgroundColor: typeInfo.color
                              }}
                            />
                          </div>
                        </div>

                        <div className="goal-card-footer">
                          <div className="goal-deadline">
                            <span className="deadline-icon">📅</span>
                            <span className="deadline-text">
                              {isOverdue 
                                ? `${Math.abs(daysRemaining)} days overdue`
                                : daysRemaining === 0
                                ? "Due today"
                                : `${daysRemaining} days left`
                              }
                            </span>
                          </div>

                          <div className="goal-actions">
                            <button
                              className="btn-icon-action btn-complete"
                              onClick={() => handleComplete(goal.id)}
                              title="Mark as complete"
                            >
                              ✓
                            </button>
                            <button
                              className="btn-icon-action btn-delete"
                              onClick={() => handleDelete(goal.id)}
                              title="Delete goal"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Completed Goals */}
            {completedGoals.length > 0 && (
              <div className="goals-category">
                <div className="category-header">
                  <h2 className="category-title">Completed Goals</h2>
                  <span className="category-count">{completedGoals.length}</span>
                </div>

                <div className="goals-grid">
                  {completedGoals.map((goal) => {
                    const typeInfo = getGoalTypeInfo(goal.goal_type);

                    return (
                      <div key={goal.id} className="goal-card-modern goal-completed">
                        <div className="goal-card-header">
                          <div className="goal-type-badge" style={{ backgroundColor: `${typeInfo.color}15`, color: typeInfo.color }}>
                            <span className="type-icon">{typeInfo.icon}</span>
                            <span className="type-label">{typeInfo.label}</span>
                          </div>
                          <span className="completed-badge">✓ Completed</span>
                        </div>

                        <h3 className="goal-card-title">{goal.title}</h3>

                        {goal.description && (
                          <p className="goal-card-description">{goal.description}</p>
                        )}

                        <div className="goal-card-footer">
                          <div className="goal-completed-date">
                            <span className="completed-icon">🎉</span>
                            <span className="completed-text">Goal achieved!</span>
                          </div>

                          <button
                            className="btn-icon-action btn-delete"
                            onClick={() => handleDelete(goal.id)}
                            title="Delete goal"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Goals;