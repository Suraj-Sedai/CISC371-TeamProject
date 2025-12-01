import React, { useEffect, useState } from 'react';
import { workoutsAPI } from '../services/api';

const Workouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    name: '',
    type: 'Cardio',
    duration: '',
    intensity: 'Medium',
    notes: '',
  });

  // Load workouts on mount
  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await workoutsAPI.list();
        setWorkouts(response.data);
      } catch (error) {
        console.error(error);
        setMessage({ type: 'error', text: 'Failed to load workouts.' });
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.duration) {
      setMessage({ type: 'error', text: 'Workout name and duration are required.' });
      return;
    }

    try {
      const payload = {
        name: formData.name,
        type: formData.type,
        duration: Number(formData.duration),
        intensity: formData.intensity,
        notes: formData.notes,
      };

      const response = await workoutsAPI.create(payload);
      // Prepend new workout
      setWorkouts((prev) => [response.data, ...prev]);

      setFormData({
        name: '',
        type: 'Cardio',
        duration: '',
        intensity: 'Medium',
        notes: '',
      });

      setMessage({ type: 'success', text: 'Workout logged!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 2000);
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: 'Could not save workout.' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this workout?')) return;

    try {
      await workoutsAPI.delete(id);
      setWorkouts((prev) => prev.filter((w) => w.id !== id));
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: 'Failed to delete workout.' });
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Header */}
        <div className="dashboard-welcome">
          <h1>Your Workouts 💪</h1>
          <p>Log and review your recent training sessions.</p>
        </div>

        {message.text && (
          <div
            className={`alert ${message.type === 'error' ? 'alert-danger' : 'alert-success'}`}
            style={{ marginBottom: '1rem' }}
          >
            {message.text}
          </div>
        )}

        <div className="dashboard-grid">
          {/* Left: form */}
          <div className="card">
            <h2>Log a Workout</h2>
            <p className="subtitle">
              Add a workout session. Entries are stored in your account on the server.
            </p>

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
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                  >
                    <option value="Cardio">Cardio</option>
                    <option value="Strength">Strength</option>
                    <option value="HIIT">HIIT</option>
                    <option value="Mobility">Mobility</option>
                    <option value="Other">Other</option>
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
                    placeholder="30"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="intensity">Intensity</label>
                <select
                  id="intensity"
                  name="intensity"
                  value={formData.intensity}
                  onChange={handleChange}
                >
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

              <button type="submit" className="btn btn-primary">
                Save Workout
              </button>
            </form>
          </div>

          {/* Right: list */}
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
                {workouts.map((workout) => (
                  <div key={workout.id} className="goal-item">
                    <div className="goal-header">
                      <h3>{workout.name}</h3>
                      <span className="badge">
                        {workout.type} • {workout.intensity}
                      </span>
                    </div>
                    <div className="goal-meta">
                      <span>{workout.duration} min</span>
                      <span>{workout.date}</span>
                    </div>
                    {workout.notes && (
                      <p className="goal-description">{workout.notes}</p>
                    )}
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(workout.id)}
                    >
                      Delete
                    </button>
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