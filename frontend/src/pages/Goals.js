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

  // Fetch goals and update progress
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

  // Handle input changes for new goal
  const handleChange = (e) => {
    setNewGoal({ ...newGoal, [e.target.name]: e.target.value });
  };

  // Add new goal
  const handleAddGoal = async (e) => {
    e.preventDefault();
    setError("");
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
    } catch (err) {
      console.error("Failed to create goal:", err);
      setError("Failed to create goal. Please check your input.");
    }
  };

  // Mark goal complete
  const handleComplete = async (goalId) => {
    try {
      await api.patch(`/goals/${goalId}/`, { completed: true });
      setGoals((prev) =>
        prev.map((goal) =>
          goal.id === goalId ? { ...goal, completed: true, progress_percentage: 100 } : goal
        )
      );
    } catch (err) {
      console.error("Failed to complete goal:", err);
    }
  };

  // Delete goal
  const handleDelete = async (goalId) => {
    try {
      await api.delete(`/goals/${goalId}/`);
      setGoals((prev) => prev.filter((goal) => goal.id !== goalId));
    } catch (err) {
      console.error("Failed to delete goal:", err);
    }
  };

  // Calculate progress from workouts (if needed)
  const calculateProgress = (goal) => {
    return Math.min(goal.progress_percentage || 0, 100);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div> Loading Goals...
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="dashboard-welcome">
          <h1>{user?.first_name || user?.username}'s Goals</h1>
          <p>Track your progress and complete your goals!</p>
        </div>

        {/* New Goal Form */}
        <div className="form-card">
          <h2>Add New Goal</h2>
          {error && <p className="error-text">{error}</p>}
          <form onSubmit={handleAddGoal}>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                name="title"
                value={newGoal.title}
                onChange={handleChange}
                placeholder="e.g., Lose 5 kg"
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={newGoal.description}
                onChange={handleChange}
                placeholder="Optional description"
              />
            </div>
            <div className="form-group">
              <label>Goal Type</label>
              <select name="goal_type" value={newGoal.goal_type} onChange={handleChange}>
                <option value="weight_loss">Weight Loss</option>
                <option value="muscle_gain">Muscle Gain</option>
                <option value="workout_time">Workout Time</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            <div className="form-group">
              <label>Target Value</label>
              <input
                type="number"
                name="target_value"
                value={newGoal.target_value}
                onChange={handleChange}
                placeholder="e.g., 5"
              />
            </div>
            <div className="form-group">
              <label>End Date</label>
              <input
                type="date"
                name="end_date"
                value={newGoal.end_date}
                onChange={handleChange}
              />
            </div>
            <button className="btn btn-primary" type="submit">
              Add Goal
            </button>
          </form>
        </div>

        {/* Goals List */}
        <div className="list-card">
          {goals.length === 0 ? (
            <div className="empty-state">
              <span className="icon">🎯</span>
              <p>No goals yet. Add your first goal!</p>
            </div>
          ) : (
            goals.map((goal) => (
              <div key={goal.id} className="list-item goal-item">
                <div className="goal-header">
                  <h3>{goal.title}</h3>
                  {goal.completed ? (
                    <span className="badge badge-success">Completed</span>
                  ) : goal.is_overdue ? (
                    <span className="badge badge-danger">Overdue</span>
                  ) : null}
                </div>
                {goal.description && <p className="goal-description">{goal.description}</p>}
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${calculateProgress(goal)}%` }}
                  ></div>
                </div>
                <div className="progress-text">
                  Progress: {calculateProgress(goal)}%
                </div>
                <div className="goal-actions">
                  {!goal.completed && (
                    <button
                      className="btn-complete"
                      onClick={() => handleComplete(goal.id)}
                    >
                      Mark Complete
                    </button>
                  )}
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(goal.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Goals;
