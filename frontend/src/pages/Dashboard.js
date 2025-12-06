import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import api from "../services/api";

const Dashboard = () => {
  const { user } = useAuth();
  const [recentWorkouts, setRecentWorkouts] = useState([]);

  useEffect(() => {
    const fetchRecentWorkouts = async () => {
      try {
        const response = await api.get("/workouts/");
        setRecentWorkouts(response.data);
      } catch (error) {
        console.error("Failed to fetch recent workouts:", error);
      }
    };

    fetchRecentWorkouts();
  }, []);

  return (
    <div className="page-wrapper">
      <div className="container">

        {/* Welcome Section */}
        <div className="dashboard-welcome">
          <h1>Welcome back, {user?.first_name || user?.username}! 👋</h1>
          <p>Here's your fitness overview for today</p>
        </div>

        {/* Stats Overview */}
        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon blue"><span>🏃</span></div>
            <div className="stat-content">
              <div className="stat-label">Today's Workouts</div>
              <div className="stat-value">0</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green"><span>🔥</span></div>
            <div className="stat-content">
              <div className="stat-label">Calories Burned</div>
              <div className="stat-value">0</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon purple"><span>🎯</span></div>
            <div className="stat-content">
              <div className="stat-label">Active Goals</div>
              <div className="stat-value">0</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2>Quick Actions</h2>

          <div className="quick-actions-grid">

            <Link to="/workouts" className="quick-action-card">
              <span className="icon">💪</span>
              <p>Log Workout</p>
            </Link>

            <button className="quick-action-card">
              <span className="icon">🥗</span>
              <p>Log Meal</p>
            </button>

            <Link to="/goals" className="quick-action-card">
              <span className="icon">🎯</span>
              <p>Set Goal</p>
            </Link>

            <Link to="/profile" className="quick-action-card">
              <span className="icon">⚙️</span>
              <p>Update Profile</p>
            </Link>

          </div>
        </div>

        {/* Profile Completion Alert */}
        {(!user?.age || !user?.height || !user?.weight) && (
          <div className="profile-incomplete-alert">
            <div className="icon">⚠️</div>
            <div className="content">
              <p>
                Complete your profile to get personalized recommendations and
                accurate BMI/BMR calculations.
              </p>
              <Link to="/profile">Complete Profile →</Link>
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className="recent-activity">
          <h2>Recent Activity</h2>

          {recentWorkouts.length === 0 ? (
            <div className="empty-state">
              <span className="icon">📊</span>
              <p>No activity yet. Start logging your workouts!</p>
            </div>
          ) : (
            <ul>
              {recentWorkouts.slice(0, 5).map((workout) => (
                <li key={workout.id} className="recent-workout-item">
                  <strong>{workout.name}</strong> — {workout.duration} min<br />
                  <small>
                    {workout.type} • {workout.intensity} • {workout.date}
                  </small>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
