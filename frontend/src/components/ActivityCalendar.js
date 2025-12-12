import React, { useMemo } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import { Tooltip } from "react-tooltip";
import "react-calendar-heatmap/dist/styles.css";

export default function ActivityCalendar({ workouts }) {
  const tooltipId = "activity-tooltip";

  // Calculate statistics
  const stats = useMemo(() => {
    const totalWorkouts = workouts.length;
    const totalMinutes = workouts.reduce((sum, w) => sum + w.duration, 0);
    const uniqueDays = new Set(workouts.map(w => w.date)).size;
    
    // Calculate current streak
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
    
    return { totalWorkouts, totalMinutes, uniqueDays, streak };
  }, [workouts]);

  // Convert workouts → heatmap-friendly format
  const heatmapValues = useMemo(() => {
    const dateMap = {};
    
    workouts.forEach((w) => {
      if (!dateMap[w.date]) {
        dateMap[w.date] = { date: w.date, count: 0, duration: 0, workouts: [] };
      }
      dateMap[w.date].count += 1;
      dateMap[w.date].duration += w.duration;
      dateMap[w.date].workouts.push(w);
    });

    return Object.values(dateMap).map(day => ({
      date: day.date,
      count: Math.min(4, Math.ceil(day.duration / 20)),
      duration: day.duration,
      workoutCount: day.count,
      workouts: day.workouts
    }));
  }, [workouts]);

  // Find most active day
  const mostActiveDay = useMemo(() => {
    if (heatmapValues.length === 0) return null;
    return heatmapValues.reduce((max, day) => 
      day.duration > max.duration ? day : max
    , heatmapValues[0]);
  }, [heatmapValues]);

  return (
    <div className="activity-calendar-wrapper">
      {/* Header with Stats */}
      <div className="calendar-header">
        <div className="calendar-title-section">
          <h2 className="calendar-title">📅 Activity Calendar</h2>
          <p className="calendar-subtitle">Your workout consistency over the past year</p>
        </div>
        
        <div className="calendar-stats-mini">
          <div className="stat-mini">
            <div className="stat-mini-value">{stats.uniqueDays}</div>
            <div className="stat-mini-label">Active Days</div>
          </div>
          <div className="stat-mini-divider"></div>
          <div className="stat-mini">
            <div className="stat-mini-value">{stats.totalWorkouts}</div>
            <div className="stat-mini-label">Total Workouts</div>
          </div>
          <div className="stat-mini-divider"></div>
          <div className="stat-mini">
            <div className="stat-mini-value">{stats.totalMinutes}</div>
            <div className="stat-mini-label">Minutes</div>
          </div>
        </div>
      </div>

      {/* Calendar Heatmap */}
      <div className="calendar-heatmap-container">
        <CalendarHeatmap
          startDate={new Date(new Date().setFullYear(new Date().getFullYear() - 1))}
          endDate={new Date()}
          values={heatmapValues}
          classForValue={(value) => {
            if (!value || !value.count) return "color-empty";
            return `color-scale-${value.count}`;
          }}
          tooltipDataAttrs={(value) => {
            if (!value?.date) {
              return {
                "data-tooltip-id": tooltipId,
                "data-tooltip-content": "No activity"
              };
            }

            const workoutsList = value.workouts
              .map(w => `• ${w.name} (${w.duration} min)`)
              .join('\n');

            return {
              "data-tooltip-id": tooltipId,
              "data-tooltip-content": `📅 ${new Date(value.date).toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
              })}\n\n${value.workoutCount} workout${value.workoutCount > 1 ? 's' : ''} • ${value.duration} min\n\n${workoutsList}`,
              "data-tooltip-html": true
            };
          }}
          showWeekdayLabels={true}
        />
      </div>

      {/* Legend */}
      <div className="calendar-legend">
        <div className="legend-left">
          <span className="legend-text">Less</span>
          <div className="legend-boxes">
            <div className="legend-box color-empty"></div>
            <div className="legend-box color-scale-1"></div>
            <div className="legend-box color-scale-2"></div>
            <div className="legend-box color-scale-3"></div>
            <div className="legend-box color-scale-4"></div>
          </div>
          <span className="legend-text">More</span>
        </div>

        {mostActiveDay && (
          <div className="legend-right">
            <span className="legend-highlight">
              🔥 Most active: {new Date(mostActiveDay.date).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              })} ({mostActiveDay.duration} min)
            </span>
          </div>
        )}
      </div>

      {/* Enhanced Tooltip */}
      <Tooltip 
        id={tooltipId} 
        place="top"
        className="custom-activity-tooltip"
        style={{ 
          zIndex: 9999,
          backgroundColor: 'var(--tooltip-bg, rgba(15, 23, 42, 0.95))',
          color: 'white',
          padding: '12px 16px',
          borderRadius: '12px',
          fontSize: '13px',
          lineHeight: '1.6',
          maxWidth: '300px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
          whiteSpace: 'pre-line'
        }}
      />
    </div>
  );
}