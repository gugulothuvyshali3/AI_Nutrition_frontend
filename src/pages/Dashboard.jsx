import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import DashboardCharts from '../components/DashboardCharts';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalFoods: 0,
    totalRecommendations: 0,
    averageBudget: 0,
    foodPreferences: {},
    healthGoals: {},
    budgetDistribution: {},
    recentStudents: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError('Could not connect to Spring Boot backend. Ensure server is running on port 8080.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  return (
    <div className="page-container">
      <div className="page-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span className="section-kicker">REAL-TIME OVERVIEW</span>
          <h1>Hostel Nutrition Dashboard</h1>
          <p>Live metrics, dietary trends, and meal recommendation activity from the NutriSmartAI database.</p>
        </div>
        <button
          className="button button-secondary"
          onClick={loadDashboardData}
          disabled={loading}
        >
          {loading ? '↻ Loading...' : '↻ Refresh Dashboard'}
        </button>
      </div>

      {error && (
        <div className="status-message error">
          <span>⚠️ {error}</span>
        </div>
      )}

      {/* Top Stat Cards */}
      <div className="stats-grid">
        <article className="stat-card">
          <div className="stat-icon">👩‍🎓</div>
          <div>
            <p>Total Students</p>
            <strong>{stats.totalStudents}</strong>
          </div>
        </article>

        <article className="stat-card">
          <div className="stat-icon">🥗</div>
          <div>
            <p>Foods in Library</p>
            <strong>{stats.totalFoods}</strong>
          </div>
        </article>

        <article className="stat-card">
          <div className="stat-icon">✨</div>
          <div>
            <p>Recommendations</p>
            <strong>{stats.totalRecommendations}</strong>
          </div>
        </article>
      </div>

      {/* Charts Section: Food Preferences, Health Goals, Budget Distribution */}
      <DashboardCharts
        foodPreferences={stats.foodPreferences}
        healthGoals={stats.healthGoals}
        budgetDistribution={stats.budgetDistribution}
      />

      {/* Recent Students Table */}
      <div className="panel table-panel">
        <h3>📋 Recent Student Profiles</h3>
        {stats.recentStudents && stats.recentStudents.length > 0 ? (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Age</th>
                  <th>Food Preference</th>
                  <th>Health Goal</th>
                  <th>Daily Budget</th>
                  <th>Available Foods</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentStudents.map((s) => (
                  <tr key={s.id}>
                    <td><b>{s.name}</b></td>
                    <td>{s.age}</td>
                    <td>
                      <span
                        className={`food-badge ${
                          s.foodPreference === 'Vegetarian'
                            ? 'veg'
                            : s.foodPreference === 'Vegan'
                            ? 'vegan'
                            : 'non-veg'
                        }`}
                        style={{ position: 'static' }}
                      >
                        {s.foodPreference}
                      </span>
                    </td>
                    <td>{s.goal}</td>
                    <td>₹{s.budget}</td>
                    <td style={{ maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={s.availableFoods}>
                      {s.availableFoods}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="empty-state">
            No student profiles recorded yet. Fill out the Student Details form to populate the dashboard.
          </p>
        )}
      </div>
    </div>
  );
}
