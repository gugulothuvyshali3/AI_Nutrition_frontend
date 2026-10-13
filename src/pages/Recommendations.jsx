import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Recommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const loadData = async () => {
    setLoading(true);
    try {
      const [recsData, studentsData] = await Promise.all([
        api.getRecommendations(),
        api.getStudents(),
      ]);
      setRecommendations(Array.isArray(recsData) ? recsData : []);
      setStudents(Array.isArray(studentsData) ? studentsData : []);
      if (Array.isArray(studentsData) && studentsData.length > 0 && !selectedStudentId) {
        setSelectedStudentId(studentsData[0].id);
      }
    } catch (err) {
      console.error('Failed to load recommendations:', err);
      setMessage({ type: 'error', text: 'Could not fetch recommendations from backend.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleGenerate = async () => {
    if (!selectedStudentId) {
      setMessage({ type: 'error', text: 'Please select a student first.' });
      return;
    }
    setGenerating(true);
    setMessage(null);
    try {
      const newRec = await api.generateRecommendation(selectedStudentId);
      setRecommendations((prev) => [newRec, ...prev]);
      setMessage({ type: 'success', text: `New meal plan generated for ${newRec.student?.name || 'student'}!` });
    } catch (err) {
      console.error('Generation error:', err);
      setMessage({ type: 'error', text: err.message || 'Failed to generate recommendation' });
    } finally {
      setGenerating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this saved recommendation?')) return;
    try {
      await api.deleteRecommendation(id);
      setRecommendations((prev) => prev.filter((r) => r.id !== id));
      setMessage({ type: 'success', text: 'Recommendation deleted.' });
    } catch (err) {
      console.error('Delete error:', err);
      setMessage({ type: 'error', text: 'Failed to delete recommendation.' });
    }
  };

  return (
    <div className="page-container">
      <div className="page-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span className="section-kicker">PERSONALIZED MEAL PLANS</span>
          <h1>Generated Recommendations</h1>
          <p>Complete record of AI-optimized breakfast, lunch, and dinner plans saved in your MySQL database.</p>
        </div>
        <button
          className="button button-secondary"
          onClick={loadData}
          disabled={loading}
        >
          ↻ Refresh List
        </button>
      </div>

      {message && (
        <div className={`status-message ${message.type}`}>
          {message.type === 'success' ? '✓ ' : '⚠️ '}
          {message.text}
        </div>
      )}

      {/* Quick Generator Bar */}
      {students.length > 0 && (
        <div className="panel" style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '240px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: '#1f502d', marginBottom: '6px' }}>
              Select Student to Generate New Plan:
            </label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '10px',
                border: '1px solid #bdd8b7',
                background: '#fbfef9',
                fontSize: '15px',
              }}
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} (Budget: ₹{s.budget} | {s.foodPreference} | {s.goal})
                </option>
              ))}
            </select>
          </div>

          <div style={{ alignSelf: 'flex-end' }}>
            <button
              className="button button-primary"
              onClick={handleGenerate}
              disabled={generating}
            >
              {generating ? '⏳ Generating Plan...' : '✨ Generate New Plan'}
            </button>
          </div>
        </div>
      )}

      {/* Recommendations Cards */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#5c7963', fontSize: '18px' }}>
          ⏳ Loading recommendations from database...
        </div>
      ) : recommendations.length === 0 ? (
        <div className="panel" style={{ textAlign: 'center', padding: '50px 20px' }}>
          <h3>No recommendations saved yet</h3>
          <p style={{ color: '#5c7963', margin: '12px 0 20px' }}>
            Submit student details in the Student Details form to generate your first personalized meal plan.
          </p>
          <button
            className="button button-primary"
            onClick={() => navigate('/student')}
          >
            Go to Student Details Form →
          </button>
        </div>
      ) : (
        <div>
          {recommendations.map((rec) => (
            <article key={rec.id} className="recommendation-card">
              <div className="rec-header">
                <div>
                  <h3>
                    👩‍🎓 {rec.student?.name || 'Student'}
                    <span style={{ fontSize: '14px', color: '#5c7963', fontWeight: '500', marginLeft: '12px' }}>
                      (Goal: <b>{rec.student?.goal || 'Healthy Eating'}</b> · Preference: <b>{rec.student?.foodPreference || 'Vegetarian'}</b>)
                    </span>
                  </h3>
                  <small style={{ color: '#728c78' }}>
                    Created: {rec.createdAt ? new Date(rec.createdAt).toLocaleString() : 'Recently'}
                  </small>
                </div>
                <button
                  className="text-button"
                  style={{ color: '#d32f2f' }}
                  onClick={() => handleDelete(rec.id)}
                  title="Delete recommendation"
                >
                  Delete 🗑️
                </button>
              </div>

              {/* Meal Blocks */}
              <div className="rec-grid">
                <div className="meal-block">
                  <span>🌅 Breakfast</span>
                  <p>{rec.breakfast || 'Nutritious morning meal'}</p>
                </div>
                <div className="meal-block">
                  <span>☀️ Lunch</span>
                  <p>{rec.lunch || 'Wholesome balanced lunch'}</p>
                </div>
                <div className="meal-block">
                  <span>🌙 Dinner</span>
                  <p>{rec.dinner || 'Light digestible dinner'}</p>
                </div>
                <div className="meal-block">
                  <span>🍵 Evening Snack</span>
                  <p>{rec.snacks || 'Healthy evening snack'}</p>
                </div>
              </div>

              {/* Summary Metrics */}
              <div className="rec-summary">
                <div>💰 Est. Cost: <b>₹{rec.estimatedCost}</b></div>
                <div>🔥 Calories: <b>{rec.totalCalories} kcal</b></div>
                <div>💪 Protein: <b>{rec.totalProtein} g</b></div>
                <div>🌾 Carbs: <b>{rec.totalCarbohydrates || 0} g</b></div>
                <div>🥑 Fat: <b>{rec.totalFat || 0} g</b></div>
              </div>

              {/* Rationale / Why Recommended */}
              <h4 style={{ color: '#1f502d', marginBottom: '8px' }}>💡 Why this meal plan is recommended:</h4>
              <div className="rec-explanation" style={{ marginBottom: '14px' }}>
                {rec.explanation}
              </div>

              <details>
                <summary style={{ cursor: 'pointer', fontWeight: '700', color: '#2e7d32', fontSize: '14px' }}>
                  View Full Output Text
                </summary>
                <pre className="meal-plan-text" style={{ marginTop: '10px' }}>
                  {rec.recommendationText}
                </pre>
              </details>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
