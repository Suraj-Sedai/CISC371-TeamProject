import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from "chart.js";
import api from "../services/api";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const workoutsRes = await api.get("/workouts/");
        const goalsRes = await api.get("/goals/");
        setWorkouts(workoutsRes.data);
        setGoals(goalsRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  // Weekly workout duration chart
  const workoutChartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Workout Duration (min)",
        data: [10, 45, 30, 60, 20, 50, 40], // Example, replace with computed data
        backgroundColor: "#4f46e5",
        borderRadius: 8,
      },
    ],
  };

  // Goal Progress Pie Chart
  const goalChartData = {
    labels: goals.map((g) => g.name),
    datasets: [
      {
        data: goals.map((g) => Math.min((g.current_value / g.target_value) * 100, 100)),
        backgroundColor: ["#4f46e5", "#f43f5e", "#10b981", "#f59e0b"],
      },
    ],
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">

        {/* Welcome */}
        <div className="dashboard-welcome">
          <h1>Welcome back, {user?.first_name || user?.username}! 👋</h1>
          <p>Here’s your fitness snapshot for today</p>
        </div>

        {/* Top Stats Cards */}
        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon">🏃</div>
            <div>
              <div className="stat-label">Workouts Today</div>
              <div className="stat-value">{workouts.filter(w => w.date === new Date().toISOString().split("T")[0]).length}</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div>
              <div className="stat-label">Active Goals</div>
              <div className="stat-value">{goals.filter(g => !g.completed).length}</div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="dashboard-grid">
          {/* Left Column */}
          <div className="dashboard-left">
            {/* Workout Duration Chart */}
            <div className="chart-card">
              <h3>Weekly Workout Duration</h3>
              <Bar data={workoutChartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
            </div>

            {/* Recent Workouts */}
            <div className="recent-workouts">
              <h3>Recent Workouts</h3>
              {workouts.slice(0, 5).map((w) => (
                <div key={w.id} className="recent-workout-card">
                  <div className="header">
                    <strong>{w.name}</strong>
                    <span className={`type-badge ${w.type.toLowerCase()}`}>{w.type}</span>
                  </div>
                  <div className="meta">
                    {w.duration} min • {w.intensity} • {w.date}
                  </div>
                </div>
              ))}
              {workouts.length === 0 && <p>No workouts logged yet.</p>}
            </div>
          </div>

          {/* Right Column */}
          <div className="dashboard-right">
            {/* Goal Progress Pie Chart */}
            <div className="chart-card">
              <h3>Goals Progress</h3>
              {goals.length > 0 ? (
                <Pie data={goalChartData} options={{ responsive: true, plugins: { legend: { position: "bottom" } } }} />
              ) : (
                <p>No active goals</p>
              )}
            </div>

            {/* Quick Actions */}
            <div className="quick-actions-card">
              <h3>Quick Actions</h3>
              <div className="quick-actions-grid">
                <Link to="/workouts" className="quick-action-card">💪 Log Workout</Link>
                <Link to="/goals" className="quick-action-card">🎯 Set Goal</Link>
                <Link to="/profile" className="quick-action-card">⚙️ Profile</Link>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
