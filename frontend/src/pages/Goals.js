import React, { useEffect, useState } from "react";
import api from "../services/api";

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    goal_type: "custom",
    target_value: "",
    current_value: 0,
    end_date: "",
  });

  const [error, setError] = useState("");

  // Fetch goals
  const fetchGoals = async () => {
    try {
      const res = await api.get("/goals/");
      setGoals(res.data);
    } catch (err) {
      console.error("Failed to load goals:", err);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  // Submit goal
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.title || !form.target_value || !form.end_date) {
      setError("Please fill out all required fields.");
      return;
    }

    try {
      await api.post("/goals/", form);
      await fetchGoals();

      setForm({
        title: "",
        description: "",
        goal_type: "custom",
        target_value: "",
        current_value: 0,
        end_date: "",
      });
    } catch (err) {
      console.error("Failed to create goal:", err);
      setError("Failed to create goal. Check fields.");
    }
  };

  // Delete goal
  const deleteGoal = async (id) => {
    await api.delete(`/goals/${id}/`);
    fetchGoals();
  };

  return (
    <div className="page-wrapper">
      <div className="container">

        {/* PAGE TITLE */}
        <h1 className="page-title">🎯 Your Fitness Goals</h1>
        <p className="page-subtitle">Set goals and track your progress</p>

        {/* GOAL FORM */}
        <div className="form-card">
          <h2>Add New Goal</h2>

          {error && <p className="error-text">{error}</p>}

          <form onSubmit={handleSubmit}>

            {/* Title */}
            <div className="form-group">
              <label>Goal Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Lose weight, build muscle, etc."
              />
            </div>

            {/* Description */}
            <div className="form-group">
              <label>Description (optional)</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Details about this goal"
              />
            </div>

            {/* Goal Type */}
            <div className="form-group">
              <label>Goal Type</label>
              <select
                value={form.goal_type}
                onChange={(e) => setForm({ ...form, goal_type: e.target.value })}
              >
                <option value="weight_loss">Weight Loss</option>
                <option value="muscle_gain">Muscle Gain</option>
                <option value="workout_time">Workout Time</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            {/* Target Value */}
            <div className="form-group">
              <label>Target Value</label>
              <input
                type="number"
                value={form.target_value}
                onChange={(e) =>
                  setForm({ ...form, target_value: e.target.value })
                }
                placeholder="Example: 5 (kg, hours, etc.)"
              />
            </div>

            {/* End Date */}
            <div className="form-group">
              <label>End Date</label>
              <input
                type="date"
                value={form.end_date}
                onChange={(e) =>
                  setForm({ ...form, end_date: e.target.value })
                }
              />
            </div>

            <button type="submit" className="btn-primary">
              Add Goal
            </button>
          </form>
        </div>

        {/* GOAL LIST */}
        <div className="list-card">
          <h2>Your Goals</h2>

          {goals.length === 0 ? (
            <p className="empty-state">No goals yet. Add one above!</p>
          ) : (
            goals.map((g) => (
              <div key={g.id} className="list-item goal-item">
                <div className="goal-header">
                  <h3>{g.title}</h3>
                  {g.is_overdue && !g.completed && (
                    <span className="badge badge-danger">Overdue</span>
                  )}
                  {g.completed && (
                    <span className="badge badge-success">Completed</span>
                  )}
                </div>

                {/* Description */}
                {g.description && (
                  <p className="goal-description">{g.description}</p>
                )}

                {/* Progress */}
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${g.progress_percentage}%` }}
                  ></div>
                </div>
                <p className="progress-text">
                  {g.current_value}/{g.target_value} — {g.progress_percentage}%
                </p>

                {/* Actions */}
                <div className="goal-actions">
                  <button
                    className="btn-delete"
                    onClick={() => deleteGoal(g.id)}
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
