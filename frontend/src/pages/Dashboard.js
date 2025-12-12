import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import api from "../services/api";
import ActivityCalendar from "../components/ActivityCalendar";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

const Dashboard = () => {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const workoutsRes = await api.get("/workouts/");
        const goalsRes = await api.get("/goals/");
        setWorkouts(workoutsRes.data);
        setGoals(goalsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ----------------------------
  // Statistics Calculations
  // ----------------------------
  const today = new Date().toISOString().split("T")[0];
  const todaysWorkouts = workouts.filter((w) => w.date === today);
  
  const totalWorkouts = workouts.length;
  const totalDuration = workouts.reduce((sum, w) => sum + w.duration, 0);
  const averageDuration = totalWorkouts > 0 ? Math.round(totalDuration / totalWorkouts) : 0;
  const activeGoals = goals.filter((g) => !g.completed).length;
  const completedGoals = goals.filter((g) => g.completed).length;

  // Calculate streak
  const calculateStreak = () => {
    if (workouts.length === 0) return 0;
    
    const sortedDates = [...new Set(workouts.map(w => w.date))].sort().reverse();
    let streak = 0;
    let currentDate = new Date();
    
    for (let date of sortedDates) {
      const workoutDate = new Date(date);
      const diffDays = Math.floor((currentDate - workoutDate) / (1000 * 60 * 60 * 24));
      
      if (diffDays === streak) {
        streak++;
      } else if (diffDays > streak) {
        break;
      }
    }
    return streak;
  };

  const currentStreak = calculateStreak();

  // ----------------------------
  // Weekly Workout Duration Chart
  // ----------------------------
  const weekdayMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weeklyTotals = {
    Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0,
  };

  workouts.forEach((w) => {
    const day = weekdayMap[new Date(w.date).getDay()];
    weeklyTotals[day] += w.duration;
  });

  const workoutChartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Duration (min)",
        data: [
          weeklyTotals.Mon,
          weeklyTotals.Tue,
          weeklyTotals.Wed,
          weeklyTotals.Thu,
          weeklyTotals.Fri,
          weeklyTotals.Sat,
          weeklyTotals.Sun,
        ],
        backgroundColor: "rgba(99, 102, 241, 0.8)",
        borderRadius: 12,
        borderSkipped: false,
      },
    ],
  };

  // ----------------------------
  // Workout Type Distribution
  // ----------------------------
  const typeCount = {};
  workouts.forEach((w) => {
    typeCount[w.type] = (typeCount[w.type] || 0) + 1;
  });

  const typeChartData = {
    labels: Object.keys(typeCount),
    datasets: [
      {
        data: Object.values(typeCount),
        backgroundColor: [
          "#6366f1",
          "#f43f5e",
          "#10b981",
          "#f59e0b",
          "#8b5cf6",
          "#3b82f6",
        ],
        borderWidth: 0,
        hoverOffset: 8,
      },
    ],
  };

  // ----------------------------
  // Goals Progress Chart
  // ----------------------------
  const goalChartData = {
    labels: goals.slice(0, 5).map((g) => g.name),
    datasets: [
      {
        label: "Progress %",
        data: goals.slice(0, 5).map((g) =>
          Math.min((g.current_value / g.target_value) * 100, 100)
        ),
        backgroundColor: "rgba(16, 185, 129, 0.2)",
        borderColor: "rgba(16, 185, 129, 1)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(16, 185, 129, 1)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        {/* Hero Welcome Section */}
        <div className="dashboard-hero">
          <div className="hero-content-dash">
            <div className="greeting-section">
              <h1 className="greeting-text">
                {getGreeting()}, {user?.first_name || user?.username}! 👋
              </h1>
              <p className="greeting-subtitle">
                {todaysWorkouts.length > 0
                  ? `Great job! You've completed ${todaysWorkouts.length} workout${todaysWorkouts.length > 1 ? 's' : ''} today.`
                  : "Ready to crush your fitness goals today?"}
              </p>
            </div>
            <div className="streak-badge">
              <div className="streak-icon">🔥</div>
              <div className="streak-content">
                <div className="streak-number">{currentStreak}</div>
                <div className="streak-label">Day Streak</div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="metrics-grid">
          <div className="metric-card metric-primary">
            <div className="metric-icon-wrapper">
              <div className="metric-icon">💪</div>
            </div>
            <div className="metric-content">
              <div className="metric-label">Total Workouts</div>
              <div className="metric-value">{totalWorkouts}</div>
              <div className="metric-change positive">+{todaysWorkouts.length} today</div>
            </div>
          </div>

          <div className="metric-card metric-success">
            <div className="metric-icon-wrapper">
              <div className="metric-icon">⏱️</div>
            </div>
            <div className="metric-content">
              <div className="metric-label">Total Minutes</div>
              <div className="metric-value">{totalDuration}</div>
              <div className="metric-change">Avg: {averageDuration} min</div>
            </div>
          </div>

          <div className="metric-card metric-warning">
            <div className="metric-icon-wrapper">
              <div className="metric-icon">🎯</div>
            </div>
            <div className="metric-content">
              <div className="metric-label">Active Goals</div>
              <div className="metric-value">{activeGoals}</div>
              <div className="metric-change">{completedGoals} completed</div>
            </div>
          </div>

          <div className="metric-card metric-purple">
            <div className="metric-icon-wrapper">
              <div className="metric-icon">📈</div>
            </div>
            <div className="metric-content">
              <div className="metric-label">This Week</div>
              <div className="metric-value">
                {Object.values(weeklyTotals).reduce((a, b) => a + b, 0)} min
              </div>
              <div className="metric-change">
                {Object.values(weeklyTotals).filter(v => v > 0).length} days active
              </div>
            </div>
          </div>
        </div>

        {/* Activity Calendar */}
        <div className="section-card">
          <ActivityCalendar workouts={workouts} />
        </div>

        {/* Charts Grid */}
        <div className="charts-grid">
          {/* Weekly Duration Chart */}
          <div className="chart-card-modern">
            <div className="chart-header">
              <div>
                <h3 className="chart-title">Weekly Activity</h3>
                <p className="chart-subtitle">Workout duration by day</p>
              </div>
            </div>
            <div className="chart-body">
              <Bar
                data={workoutChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      backgroundColor: "rgba(0, 0, 0, 0.8)",
                      padding: 12,
                      cornerRadius: 8,
                      titleFont: { size: 14, weight: "bold" },
                      bodyFont: { size: 13 },
                    },
                  },
                  scales: {
                    x: {
                      grid: { display: false },
                      border: { display: false },
                      ticks: { font: { size: 12, weight: "500" } },
                    },
                    y: {
                      grid: {
                        color: "rgba(0, 0, 0, 0.05)",
                        drawBorder: false,
                      },
                      border: { display: false },
                      ticks: {
                        font: { size: 12 },
                        callback: (value) => value + " min",
                      },
                    },
                  },
                }}
                height={280}
              />
            </div>
          </div>

          {/* Workout Type Distribution */}
          <div className="chart-card-modern">
            <div className="chart-header">
              <div>
                <h3 className="chart-title">Workout Types</h3>
                <p className="chart-subtitle">Distribution by category</p>
              </div>
            </div>
            <div className="chart-body chart-body-center">
              {Object.keys(typeCount).length > 0 ? (
                <Pie
                  data={typeChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "bottom",
                        labels: {
                          padding: 15,
                          font: { size: 12, weight: "500" },
                          usePointStyle: true,
                          pointStyle: "circle",
                        },
                      },
                      tooltip: {
                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                        padding: 12,
                        cornerRadius: 8,
                        callbacks: {
                          label: (context) => {
                            const label = context.label || "";
                            const value = context.parsed || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return ` ${label}: ${value} (${percentage}%)`;
                          },
                        },
                      },
                    },
                  }}
                  height={280}
                />
              ) : (
                <div className="empty-state-small">
                  <div className="empty-icon">📊</div>
                  <p>No workout data yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="bottom-grid">
          {/* Recent Workouts */}
          <div className="recent-workouts-modern">
            <div className="section-header">
              <h3 className="section-title">Recent Activity</h3>
              <Link to="/workouts" className="view-all-link">
                View all →
              </Link>
            </div>

            {workouts.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🏃‍♂️</div>
                <p className="empty-text">No workouts logged yet</p>
                <Link to="/workouts" className="btn btn-primary btn-sm">
                  Log Your First Workout
                </Link>
              </div>
            ) : (
              <div className="workout-list">
                {workouts.slice(0, 5).map((w) => (
                  <div key={w.id} className="workout-item">
                    <div className="workout-item-icon">
                      {w.type === "Cardio" && "🏃"}
                      {w.type === "Strength" && "💪"}
                      {w.type === "HIIT" && "⚡"}
                      {w.type === "Mobility" && "🧘"}
                      {w.type === "Other" && "🎯"}
                    </div>
                    <div className="workout-item-content">
                      <div className="workout-item-header">
                        <h4 className="workout-item-name">{w.name}</h4>
                        <span className={`workout-badge workout-${w.type.toLowerCase()}`}>
                          {w.type}
                        </span>
                      </div>
                      <div className="workout-item-meta">
                        <span>⏱️ {w.duration} min</span>
                        <span>•</span>
                        <span>🔥 {w.intensity}</span>
                        <span>•</span>
                        <span>📅 {new Date(w.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Goals Progress & Quick Actions */}
          <div className="sidebar-section">
            {/* Goals Progress */}
            <div className="goals-card-modern">
              <div className="section-header">
                <h3 className="section-title">Goals Progress</h3>
                <Link to="/goals" className="view-all-link">
                  View all →
                </Link>
              </div>

              {goals.length === 0 ? (
                <div className="empty-state-small">
                  <div className="empty-icon">🎯</div>
                  <p className="empty-text">No goals set yet</p>
                  <Link to="/goals" className="btn btn-primary btn-sm">
                    Create Goal
                  </Link>
                </div>
              ) : (
                <div className="goals-list">
                  {goals.slice(0, 3).map((g) => {
                    const progress = Math.min((g.current_value / g.target_value) * 100, 100);
                    return (
                      <div key={g.id} className="goal-progress-item">
                        <div className="goal-info">
                          <div className="goal-name">{g.name}</div>
                          <div className="goal-values">
                            {g.current_value} / {g.target_value}
                          </div>
                        </div>
                        <div className="progress-bar-modern">
                          <div
                            className="progress-fill-modern"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <div className="goal-percentage">{Math.round(progress)}%</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="quick-actions-modern">
              <h3 className="section-title">Quick Actions</h3>
              <div className="action-buttons">
                <Link to="/workouts" className="action-button action-primary">
                  <span className="action-icon">💪</span>
                  <span className="action-text">Log Workout</span>
                </Link>
                <Link to="/goals" className="action-button action-success">
                  <span className="action-icon">🎯</span>
                  <span className="action-text">Set Goal</span>
                </Link>
                <Link to="/profile" className="action-button action-purple">
                  <span className="action-icon">⚙️</span>
                  <span className="action-text">Edit Profile</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;