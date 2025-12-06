import React, { useEffect, useState } from "react";
import { workoutsAPI, goalsAPI } from "../services/api";

const Workouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [formData, setFormData] = useState({
    name: "",
    type: "cardio", // lowercase to match backend choices
    duration: "",
    intensity: "Medium",
    notes: "",
  });

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

  // Handle form change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.duration) {
      setMessage({ type: "error", text: "Workout name and duration are required." });
      return;
    }

    const payload = {
      name: formData.name,
      type: formData.type.toLowerCase(), // backend expects lowercase
      duration: Number(formData.duration),
      intensity: formData.intensity,
      notes: formData.notes,
    };

    try {
      const response = await workoutsAPI.create(payload);
      setWorkouts((prev) => [response.data, ...prev]);

      // Reset form
      setFormData({
        name: "",
        type: "cardio",
        duration: "",
        intensity: "Medium",
        notes: "",
      });

      setMessage({ type: "success", text: "Workout logged!" });
      setTimeout(() => setMessage({ type: "", text: "" }), 2000);

      // Refresh goals
      await fetchGoals();
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Failed to save workout." });
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this workout?")) return;

    try {
      await workoutsAPI.delete(id);
      setWorkouts((prev) => prev.filter((w) => w.id !== id));
      await fetchGoals();
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Failed to delete workout." });
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="dashboard-welcome">
          <h1>Your Workouts 💪</h1>
          <p>Log and review your recent training sessions.</p>
        </div>

        {message.text && (
          <div
            className={`alert ${message.type === "error" ? "alert-error" : "alert-success"}`}
            style={{ marginBottom: "1rem" }}
          >
            {message.text}
          </div>
        )}

        <div className="dashboard-grid">
          {/* Log workout form */}
          <div className="card">
            <h2>Log a Workout</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Workout Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Morning Run, Leg Day"
                />
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="type">Type</label>
                  <select id="type" name="type" value={formData.type} onChange={handleChange}>
                    <option value="cardio">Cardio</option>
                    <option value="strength">Strength</option>
                    <option value="flexibility">Flexibility</option>
                    <option value="hiit">HIIT</option>
                    <option value="mobility">Mobility</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="duration">Duration (minutes)</label>
                  <input
                    id="duration"
                    name="duration"
                    type="number"
                    min="1"
                    value={formData.duration}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="intensity">Intensity</label>
                <select id="intensity" name="intensity" value={formData.intensity} onChange={handleChange}>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="notes">Notes (optional)</label>
                <textarea
                  id="notes"
                  name="notes"
                  rows="3"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="How did it feel? Anything to remember?"
                />
              </div>

              <button type="submit" className="btn btn-primary btn-block">
                Save Workout
              </button>
            </form>
          </div>

          {/* Recent workouts */}
          <div className="card">
            <h2>Recent Workouts</h2>
            {loading ? (
              <div className="empty-state">
                <span className="icon">⏳</span>
                <p>Loading your workouts...</p>
              </div>
            ) : workouts.length === 0 ? (
              <div className="empty-state">
                <span className="icon">📋</span>
                <p>No workouts logged yet. Start by adding your first session!</p>
              </div>
            ) : (
              <div className="goal-list">
                {workouts.map((w) => (
                  <div key={w.id} className="goal-item">
                    <div className="goal-header">
                      <h3>{w.name}</h3>
                      <span className="badge">{w.type.charAt(0).toUpperCase() + w.type.slice(1)} • {w.intensity}</span>
                    </div>
                    <div className="goal-meta">
                      <span>{w.duration} min</span>
                      <span>{w.date}</span>
                    </div>
                    {w.notes && <p className="goal-description">{w.notes}</p>}
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(w.id)}>Delete</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Workouts;
