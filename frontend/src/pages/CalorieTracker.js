import React, { useState, useEffect } from "react";
import axios from "axios";

const CalorieTracker = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [dailyLog, setDailyLog] = useState([]);

  // Debounce search to avoid too many requests
  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        const res = await axios.get(
          `http://127.0.0.1:8000/api/auth/search-food/?q=${query}`
        );
        setResults(res.data.foods || []);
      } catch (err) {
        console.error("Error fetching foods:", err);
        setResults([]);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [query]);

  const addToLog = (food) => {
    setDailyLog((prev) => [...prev, food]);
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        <h1>Calorie Tracker</h1>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search for food..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
        />

        {/* Search Results */}
        {results.length > 0 && (
          <div className="food-results">
            {results.map((food) => (
              <button
                key={food.fdcId}
                className="food-card"
                onClick={() => addToLog(food)}
              >
                <p>{food.description}</p>
                <p>Brand: {food.brandOwner || "N/A"}</p>
                <p>Calories: {food.calories}</p>
              </button>
            ))}
          </div>
        )}

        {/* Daily Log */}
        <h2>Daily Log</h2>
        {dailyLog.length === 0 && <p>No foods logged yet.</p>}
        <div className="daily-log">
          {dailyLog.map((food, idx) => (
            <div key={idx} className="food-card">
              <p>{food.description}</p>
              <p>Brand: {food.brandOwner || "N/A"}</p>
              <p>Calories: {food.calories}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalorieTracker;
